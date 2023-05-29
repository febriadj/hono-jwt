import { Context, Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import bcrypt from 'bcryptjs';
import { TBindings } from '../types/bindings.type';

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

export default app;
