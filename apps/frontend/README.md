# frontend (TAMWEP)

Required env vars (development):

- `NEXT_PUBLIC_API_URL` — backend URL for RAG demo (default `http://localhost:3001`).
- `NEXTAUTH_SECRET` — set for next-auth session signing (recommended).
- `CONTACT_EMAIL` — optional override for contact form recipient (default `20778@mh.ac.th`).
- `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD`, `EMAIL_SERVER_SECURE` — SMTP settings for production email.
- `DEBUG_TOKEN_SECRET` — optional secret to protect `/api/debug/token` in dev.

Dev notes:

- Dev-only scripts live under `apps/frontend/scripts/dev/`. They include:
  - `node_signin2.js` — automated sign-in + session check.
  - `pw_signin.ps1` — PowerShell helper for Windows.
  - `createTestUser.js` — creates/upserts a test user via Prisma (requires `DATABASE_URL`).

How to run locally:

1. Start frontend:

```bash
cd apps/frontend
npx next dev -p 3000
```

2. Test contact form (from the running frontend):

Fill and submit the form at `http://localhost:3000/#contact` or POST to `/api/contact`.

3. Run automated signin test (dev):

```bash
node apps/frontend/scripts/dev/node_signin2.js 3000
```

If SMTP is not configured in dev, sending email will use Nodemailer test account and the API will return a preview URL.
