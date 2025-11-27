# CopyCraft AI - Local Backend (Credits & History)

This small Express server provides persistent storage for per-user credits and history using SQLite. It's intended as a local/dev backend you can run alongside the frontend.

Quick start

1. Change to the server folder and install dependencies:

```powershell
cd server; npm install
```

2. (Optional) Copy `.env.example` to `.env` and adjust values:

```powershell
copy .env.example .env
```

3. Start the server:

```powershell
npm run start
```

The server will listen on `PORT` (default `5174`).

API

- `GET /health` — simple health check
- `GET /api/credits/:userId` — returns `{ userId, credits }` (resets daily based on `DAILY_CREDITS`)
- `POST /api/credits/:userId/decrement` — atomically decrements credits by 1 and returns updated value
- `GET /api/history/:userId` — returns `{ userId, history }`
- `POST /api/history/:userId` — add history item; body: `{ content: string, params: object }`

Notes

- The default daily credits are controlled by the `DAILY_CREDITS` env var.
- The DB file path is set by `DATABASE_FILE` (default `./data.sqlite`).
