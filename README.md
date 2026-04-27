# Networking Machine

Private, hosted, single-user Gmail-connected AI outreach command center for finance recruiting and professional networking.

Networking Machine is not a generic CRM. It is a workflow machine for moving from a lead to an approved outreach sequence, Gmail drafts, reply detection, call prep, transcript processing, memory updates, and future follow-up.

## Product Loop

1. Lead or person identified.
2. Campaign created for that person.
3. AI drafts a 4-email sequence.
4. Adam reviews, edits, and approves.
5. The app creates Gmail drafts.
6. Later, approved emails can be scheduled and sent on cadence.
7. Gmail scanning detects replies, bounces, out-of-office messages, and scheduling intent.
8. Campaigns pause or update based on real signals.
9. Call prep is generated.
10. Notes or transcripts update person memory and future follow-up cadence.

## Safety Rules

- Never auto-reply to people.
- Never send unapproved outreach.
- Start with Gmail draft creation before any auto-send behavior.
- Use progressive Gmail scopes: draft or compose first, scan and send later.
- Do not use LinkedIn scraping or logged-in browser automation.
- Design for personal Gmail fallback and future OAuth verification or Google Workspace admin approval.

## Primary Product Areas

- Dashboard
- People
- Campaigns
- Draft Review
- Gmail
- Templates
- Background
- Calls
- Lead Research
- Settings

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style local UI components
- Prisma
- PostgreSQL or Supabase
- Zod validation
- OpenAI API
- Gmail API via Google OAuth
- Vercel deployment

## Governance

This rebuild is organized by segments. Each segment must have a written plan in `STATUS.md` before coding begins. Each meaningful change must update `STATUS.md`. Released segments must update `CHANGELOG.md` and `docs/VERSION_LOG.md`. Major product or architecture choices must be logged in `docs/DECISIONS.md`.

Current governance docs:

- `ROADMAP.md`
- `STATUS.md`
- `CHANGELOG.md`
- `docs/PRODUCT_SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/VERSION_LOG.md`
- `docs/TEST_PLAN.md`

GitHub issue and pull request templates live under `.github/`.

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example` and set at minimum:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/networking_machine?schema=public"
OPENAI_API_KEY=""
APP_PASSWORD=""
```

Generate Prisma client and apply the schema:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Run locally:

```bash
npm run dev
```

## Current Build Boundary

The current active work is Segment 0 governance plus the Segment 1 foundation plan. Gmail implementation must not begin until the tracker, roadmap, version log, status process, and foundation plan are in place.
