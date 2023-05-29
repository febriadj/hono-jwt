import { Context, Hono } from 'hono';
import AuthRoute from './routes/auth.route';
import HttpError from './helpers/http-error.helper';

const app = new Hono();

app.route('/auth', AuthRoute);

app.onError((err, ctx: Context) => {
    ctx.status(err instanceof HttpError ? err.status : 500);

    return ctx.json({
        success: false,
        message: err.message,
        data: null,
    });
});

export default app;
