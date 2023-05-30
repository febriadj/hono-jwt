import { Context, Hono, Next } from 'hono';
import { cors } from 'hono/cors';
import AuthRoute from './routes/auth.route';
import UsersRoute from './routes/users.route';
import HttpError from './helpers/http-error.helper';

const app = new Hono();

app.use('*', async (ctx: Context, next: Next): Promise<void | Response> => {
    return await cors({
        origin: [ctx.env.CLIENT_ORIGIN_URL],
        credentials: true,
    })(ctx, next);
});

app.onError((err, ctx: Context) => {
    ctx.status(err instanceof HttpError ? err.status : 500);

    return ctx.json({
        success: false,
        message: err.message,
        data: null,
    });
});

app.route('/auth', AuthRoute);
app.route('/users', UsersRoute);

export default app;
