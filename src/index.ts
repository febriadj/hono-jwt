import { Context, Hono } from 'hono';

const app = new Hono();

app.get('/', (ctx: Context) => ctx.text('Hello Hono!'));

export default app;
