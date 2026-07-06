# Discord Slash-Command Bot

A small web app + Discord bot. Admins log in to a dashboard, connect a Discord
server, and set up simple keyword rules. When someone runs a slash command in
Discord, the bot logs it, checks it against those rules, replies in Discord,
and sends a copy of the report to a second channel (Slack or another Discord
channel).

---

## What it actually does

1. An admin logs into the dashboard and connects a Discord server (which
   channel the bot should post in, and where reports should be mirrored to).
2. In Discord, anyone can run:
   - `/status` — checks that the bot is connected and working
   - `/report <text>` — logs a report (e.g. a bug, an issue, feedback)
3. Every command is:
   - Checked to make sure it really came from Discord (signature verified)
   - Saved to the database
   - Checked against the server's rules (e.g. "urgent" → high priority)
   - Replied to, right there in Discord
   - `/report` submissions are also copied to a second channel (Slack or
     another Discord channel), so someone doesn't have to watch Discord
     directly to know a report came in
4. The dashboard shows a live log of every command, and lets the admin
   add/edit/remove rules without touching any code.

---

## Tech stack

| Part | Tech |
|---|---|
| Frontend | React (Vite), JavaScript only, Tailwind CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL (Supabase) |
| ORM | Sequelize |
| Auth | JWT (Bearer token) |
| Hosting | `[ADD HOSTING PROVIDER HERE — e.g. Render / Railway]` (backend), `[ADD HOSTING PROVIDER HERE — e.g. Vercel / Netlify]` (frontend) |

---

## Project structure

```
/client                  React + Vite frontend
  /src
    /api                 axios calls to the backend
    /components/ui       Card, Button, Modal, EmptyState, etc.
    /context             AuthContext
    /pages               LoginPage, RulesPage, ServersPage, etc.
    /routes              ProtectedRoute, AppRoutes

/server                   Express backend
  /config                 database connection
  /constants              shared Discord interaction type constants
  /controller             thin request handlers
  /service                actual business logic (rules, servers, mirror, discord)
  /middleware             auth check, Discord signature check, error handler
  /models                 Sequelize models (Admin, Server, Rule, CommandLog)
  /routes                 Express route definitions
  /scripts                one-off scripts (seed admin, register Discord commands)
```

---

## Requirements checklist (from the original spec)

- [x] Admin signs in and connects a Discord server (picks a channel)
- [x] Users run slash commands in Discord (`/report`, `/status`)
- [x] Each command is recorded, checked against a rule, replied to in
      Discord, and mirrored to a second channel
- [x] Dashboard (behind login) shows a live command log and lets the admin
      configure rules
- [x] Deployed, publicly reachable web app
- [x] Discord bot registered via the Developer Portal, with 2+ slash commands
- [x] Working, signature-verified interactions endpoint
- [x] Bot replies in Discord for commands
- [x] Mirrors notifications to a second channel (Slack webhook or a second
      Discord channel)
- [x] Rejects forged/unsigned requests (Ed25519 signature check)
- [x] Doesn't process the same interaction twice (dedup on interaction ID)
- [x] Doesn't lose an interaction if the mirror channel or database is
      briefly unavailable
- [x] Responds within Discord's ~3 second window (uses a deferred
      response + follow-up for slower work)
- [x] No secrets in the repo, client code, or logs
- [x] Configurable rules through the dashboard UI, not hardcoded

---

## Command comparison: `/status` vs `/report`

| | `/status` | `/report` |
|---|---|---|
| Purpose | Health check — confirms the bot is connected | Logs an issue, bug, or note from a user |
| Requires input text | No | Yes (the `<text>` argument) |
| Saved to `CommandLog` | Yes | Yes |
| Checked against rules | Effectively no — there's no input text to match against, so it always falls back to `actionTaken: "logged"` | Yes — matched against the server's active `Rule` keywords |
| Mirrored to Slack / second channel | No — a routine check isn't worth forwarding | Yes |
| Reply content | Fixed message | Reflects the actual `actionTaken` from rule matching |

---

## Environment variables

### `/server/.env`

| Variable | What it's for |
|---|---|
| `DATABASE_URL` | Postgres connection string (Supabase) |
| `JWT_SECRET` | Signs and verifies login tokens |
| `JWT_EXPIRES_IN` | How long a login session lasts (e.g. `8h`) |
| `DISCORD_PUBLIC_KEY` | Verifies that requests really came from Discord |
| `DISCORD_BOT_TOKEN` | Used to register slash commands |
| `DISCORD_APPLICATION_ID` | Your Discord application's ID |
| `DISCORD_GUILD_ID` | Your test server's ID (for fast command registration) |
| `CLIENT_URL` | The deployed frontend's URL (for CORS) |
| `SEED_ADMIN_EMAIL` | Used once, to create the first admin account |
| `SEED_ADMIN_PASSWORD` | Used once, to create the first admin account |

### `/client/.env`

| Variable | What it's for |
|---|---|
| `VITE_API_URL` | The deployed backend's URL |

A `.env.example` file with these names (and no real values) is included in
both `/client` and `/server`.

---

## Running it locally

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Set up the database

Create a free Postgres project on [Supabase](https://supabase.com), copy the
**direct connection** string (port `5432`, not the pooler on `6543`), and put
it in `server/.env` as `DATABASE_URL`.

### 3. Set up Discord

1. Create an application at the
   [Discord Developer Portal](https://discord.com/developers/applications)
2. Copy the **Public Key**, **Application ID**, and **Bot Token** into
   `server/.env`
3. Invite the bot to a test server (OAuth2 URL Generator → `bot` +
   `applications.commands` scopes)
4. Register the two slash commands:
   ```bash
   node server/scripts/register-commands.js
   ```

### 4. Create the first admin account

```bash
SEED_ADMIN_EMAIL="you@example.com" SEED_ADMIN_PASSWORD="yourpassword" \
node server/scripts/seed-admin.js
```

### 5. Run both apps

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

### 6. Expose your local server to Discord (development only)

Discord needs a public HTTPS URL to send commands to. While developing
locally, use a tunnel:

```bash
ngrok http <your-backend-port>
```

Paste the `https://...` URL it gives you (plus `/api/discord/interactions`)
into the Developer Portal's **Interactions Endpoint URL** field.

---

## How it's deployed

- **Backend:** `[ADD RENDER/RAILWAY DEPLOYED BACKEND URL HERE]`
- **Frontend:** `[ADD VERCEL/NETLIFY DEPLOYED FRONTEND URL HERE]`
- **Database:** Supabase (Postgres)
- **Discord Interactions Endpoint URL** (set in the Developer Portal):
  `[ADD DEPLOYED BACKEND URL]/api/discord/interactions`

---

## How to test this

- **GitHub repo:** `[ADD GITHUB REPO LINK HERE]`
- **Live app:** `[ADD DEPLOYED FRONTEND URL HERE]`
- **Discord test server invite:** `[ADD DISCORD SERVER INVITE LINK HERE]`
- **Throwaway admin login:**
  - Email: `[ADD TEST ADMIN EMAIL HERE]`
  - Password: `[ADD TEST ADMIN PASSWORD HERE]`

To see it working: join the test server above, run `/status` or
`/report <some text>`, then log into the dashboard to see it appear in the
command log.

---

## A few design decisions worth knowing

- **No public sign-up page.** The one admin account is created with a script
  (`seed-admin.js`), not a form — there's no reason a real admin dashboard
  should let anyone register themselves as an admin.
- **JWT with no refresh token.** Sessions last 8 hours; logging out clears
  the token client-side. For a small internal dashboard like this, a full
  refresh-token setup was more complexity than the actual risk called for.
- **`/status` isn't mirrored to the second channel.** It's just a health
  check with nothing worth forwarding — only `/report` gets mirrored.
- **Deferred responses.** Since a few database calls in a row can sometimes
  take longer than Discord's 3-second limit, the bot acknowledges the
  command immediately and edits in the real reply once processing finishes.

---

## Other files in this repo

- `AI_NOTES.md` — how AI tools were used while building this
- `CLAUDE.md` / `.cursorrules` (if present) — AI context files used during
  development
- `.env.example` — in both `/client` and `/server`, no real secrets