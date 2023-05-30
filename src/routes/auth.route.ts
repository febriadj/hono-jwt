import { Context, Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client/edge';
import { sign } from 'hono/utils/jwt/jwt';
import { setCookie } from 'hono/cookie';
import { TBindings } from '../types/bindings.type';
import HttpError from '../helpers/http-error.helper';

const app = new Hono<{ Bindings: TBindings }>();

/** POST /auth/register */
app.post('/register', async (ctx: Context): Promise<Response> => {
    const prisma = new PrismaClient({
        datasources: { db: { url: ctx.env.PRISMA_PROXY_URL } },
    });

    const {
        username,
        password,
    }: {
        username: string;
        password: string;
    } = await ctx.req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
        data: {
            username,
            password: hashedPassword,
        },
    });

    return ctx.json({ data: user });
});

/** POST /auth/login */
app.post('/login', async (ctx: Context): Promise<Response> => {
    const prisma = new PrismaClient({
        datasources: { db: { url: ctx.env.PRISMA_PROXY_URL } },
    });

    const { username, password } = await ctx.req.json();

    const user = await prisma.users.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new HttpError(
            !user ? 'Invalid username' : 'Invalid password',
            401
        );
    }

    const token = await sign({ id: user.id, username }, ctx.env.JWT_SECRET_KEY);

    ctx.header('Access-Control-Allow-Credentials', 'true');
    ctx.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    ctx.header('Access-Control-Allow-Headers', '*');
    ctx.header('Access-Control-Allow-Origin', ctx.env.CLIENT_ORIGIN_URL);

    setCookie(ctx, 'token', token, {
        expires: new Date(new Date().setDate(new Date().getDate() + 7)),
        secure: true,
        sameSite: 'None',
        httpOnly: true,
    });

    return ctx.json({ data: { token } });
});

export default app;
