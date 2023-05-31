# Hono: JWT Auth

The main purpose of this repository is to demonstrate JWT authentication and cookie middlewares in [Hono](https://github.com/honojs/hono)🔥 with Cloudflare Workers.

## Getting Started

**Step 1:** Clone this repository.

```bash
git clone https://github.com/febriadj/hono-jwt.git
```

**Step 2:** Rename the `wrangler.example.toml` file to `wrangler.toml`.

**Step 3:** Install dependencies.

```bash
npm install
```

**Step 4:** Create a Prisma data proxy connection string.

```bash
# https://www.prisma.io/docs/data-platform/projects/create#optional-create-a-data-proxy-connection-string

npx prisma generate --data-proxy
```

**Step 5:** Run the Hono app.

```bash
npm run dev
```
