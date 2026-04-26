# NetworkOS

Private personal CRM for finance recruiting, alumni networking, investor and banker relationship tracking, UChicago Credit Group outreach, speaker outreach, and long-term relationship management.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style local UI components
- Prisma ORM
- PostgreSQL / Supabase-compatible `DATABASE_URL`
- Zod validation
- React Hook Form dependency included for richer form flows
- TanStack Table for dense contact tables
- Recharts dashboard coverage chart
- Lucide icons

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/networkos?schema=public"
OPENAI_API_KEY=""
```

3. Generate Prisma client, create the database schema, and seed realistic sample data:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

4. Run locally:

```bash
npm run dev
```

## AI Transcript Processing

`/api/ai/process-transcript` and the conversation detail page call a server-side transcript processor. If `OPENAI_API_KEY` is configured, it calls OpenAI server-side. If no key is present, it uses a deterministic mock processor and marks the conversation as mock processed.

## Intentional Stubs

Gmail, Google Calendar, Google Contacts, LinkedIn, and AI email draft queue integrations are intentionally not active in v1. Placeholder service interfaces live in:

- `lib/integrations/gmail.ts`
- `lib/ai/draftQueue.ts`

No OAuth scopes are requested, no Gmail sync runs, and no email is sent.
