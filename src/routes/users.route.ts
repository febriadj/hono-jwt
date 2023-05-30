import { Context, Hono, Next } from 'hono';
import { jwt } from 'hono/jwt';
import { PrismaClient } from '@prisma/client/edge';
import { TBindings } from '../types/bindings.type';

const app = new Hono<{ Bindings: TBindings }>();

app.use('*', async (ctx: Context, next: Next): Promise<void | Response> => {
    return (
        await jwt({
            cookie: 'token',
            secret: ctx.env.JWT_SECRET_KEY,
        })
    )(ctx, next);
});

/** GET /users/:id */
app.get('/:id', async (ctx: Context): Promise<Response> => {
    const prisma = new PrismaClient({
        datasources: { db: { url: ctx.env.PRISMA_PROXY_URL } },
    });

    const id = ctx.req.param('id');
    const user = await prisma.users.findUnique({ where: { id } });

    return ctx.json({ data: user });
});

export default app;
