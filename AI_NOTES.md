# AI_NOTES.md

## Which AI tools I used, and how work was split

I used Claude (Anthropic) throughout — for planning the architecture, generating
the Express/Sequelize backend code, debugging the Discord integration, and
scaffolding the React frontend components.

Roughly how it split: Claude handled architecture decisions, wrote first drafts
of nearly every file (models, middleware, services, controllers, routes, and
frontend components), and walked through debugging step by step when something
broke. I did the actual typing into my project, ran everything locally, set up
the Discord Developer Portal and Supabase myself, tested each piece in a real
Discord server, and made the final call on trade-offs when there was a choice
to make. I treated it less like "generate the whole app" and more like pairing
through it one piece at a time — plan the step, get the code, test it for
real, then move to the next step.

## Key decisions I made myself, and why

**1. JWT with no refresh token.** I considered a full access+refresh token
pair, but this app only has one or two admin accounts on a low-stakes internal
dashboard — not a multi-tenant product with a large attack surface. Refresh
tokens solve real problems (shorter exposure windows, server-side revocation)
but need a tracked-token table, rotation, and reuse detection to do correctly.
I decided that was disproportionate complexity for this timeline and threat
model, and accepted the trade-off that logout only clears the token
client-side rather than invalidating it server-side.

**2. Discord snowflake IDs stored as `STRING`, and UUIDs for my own primary
keys.** Discord's IDs exceed JavaScript's safe integer range, so storing them
as numbers risks silent precision loss. And since the dashboard's API exposes
resource IDs in URLs, I used UUIDs instead of auto-increment integers so
nobody can guess `/api/servers/2`, `/api/servers/3`, etc.

**3. Separate `status` and `mirrorStatus` fields on `CommandLog`, instead of
one combined status.** A command can be fully logged and replied to in
Discord while its Slack mirror fails — those are two independent outcomes,
and the spec specifically calls out that a downstream failure shouldn't take
down the whole interaction. Splitting the fields let me satisfy that without
guessing which failure a single "failed" status referred to.

## The hardest bug (and the one I actually got wrong)

The core interaction handler originally did everything synchronously before
replying to Discord: look up the server, insert the command log, check it
against the rules table, save it, then respond. That worked fine in every
local test. It broke the first time I tested it against my real Supabase
database with real network latency — Discord showed **"The application did
not respond,"** even though my own server logs showed the correct response
object being built successfully right after.

What actually happened: those four sequential database round trips added up
to more than Discord's ~3 second response window. Discord doesn't wait past
that window — it shows a timeout to the user and discards whatever you send
afterward, even if your server "succeeds" a moment too late. My first
instinct was to assume something was actually broken, since the console
looked completely fine.

The fix was to acknowledge the interaction immediately (Discord's
type-5 "deferred" response), do the real database work after that
acknowledgment is already sent, and then edit the message in with the real
content via a follow-up webhook call. This is the correct general pattern
Discord expects for anything that isn't guaranteed to be instant — not just a
workaround for slow database calls.

A smaller but related bug on the way there: I had briefly wrapped my
response in an extra object (`res.json({ response })`) instead of sending it
directly. That one was sneakier because my Ed25519 signature verification was
completely correct and returned `true` — the failure was purely in the shape
of the reply body, not the security check, so it took ruling out the crypto
layer first before finding the actual cause.

## What I'd improve or add with more time

- Real Sequelize migrations instead of `sync({ alter: true })`, since that's
  risky against a live schema
- The button and modal interaction types (stretch goals) — the signature
  verification and dedup logic already generalize to them, they're just not
  wired up yet
- An AI summarization step on `/report` text, using a free-tier model
- A visible failure/retry history in the dashboard, not just individual row
  statuses
- Rate limiting in front of the signature check, so scanners hitting the
  public endpoint don't cost unnecessary crypto work