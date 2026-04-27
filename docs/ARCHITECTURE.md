# Architecture

## Overview

Networking Machine is a private Next.js application deployed to Vercel, backed by Supabase Postgres and Prisma. It uses OpenAI for controlled drafting and transcript processing, and Gmail API integration through Google OAuth.

The first production shape is single-user. Future multi-user support should remain possible by avoiding hard-coded global state where user ownership belongs in the data model.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style local UI components
- Prisma
- PostgreSQL/Supabase
- Zod validation
- OpenAI API
- Gmail API via Google OAuth
- Vercel deployment

## App Areas

- Dashboard: operational inbox for what needs attention today.
- People: person memory, lifecycle, contact quality, and recruiting context.
- Campaigns: 4-email outreach sequences and campaign state.
- Draft Review: edit and approve AI-generated emails before Gmail draft creation.
- Gmail: connection state, draft records, scanner status, and future send status.
- Templates: reusable sequence templates with variable and instruction syntax.
- Background: Adam's reusable recruiting profile and writing constraints.
- Calls: call records, prep briefs, notes, and follow-up outputs.
- Lead Research: source notes and manual research queue.
- Settings: system health, environment status, version, and integration status.

## Data Model Direction

Core tables:

- `Person`: recruiting contact, lifecycle, email quality, memory, and firm relation.
- `Firm`: employer, sector, coverage, recruiting notes, and related people.
- `Campaign`: one outreach workflow for one person.
- `EmailSequence`: sequence container and template snapshot metadata.
- `EmailDraft`: individual email drafts, approval state, Gmail draft ID, and send timing.
- `GmailAccount`: OAuth provider state, account email, scopes, encrypted refresh token, token expiry, and status.
- `GmailThread`: Gmail thread reference, campaign/person relation, last scanned state.
- `GmailMessage`: Gmail message reference, classification, and relevant headers/snippets.
- `TemplateSet`: reusable initial/follow-up templates.
- `BackgroundProfile`: Adam's school, major, clubs, internships, interests, goals, writing style, reusable asks, and avoid list.
- `Call`: scheduled/completed call, brief, source signal, and prep state.
- `ConversationNote`: transcript or notes plus structured AI extraction.
- `Task`: next action, due date, owner state, and source entity.
- `SystemEvent`: audit trail for approvals, draft creation, scanner classifications, scheduler attempts, and integration errors.

Future multi-user support:

- Add `User` or `Workspace` ownership to user-scoped tables.
- Keep OAuth tokens tied to a user-owned Gmail account.
- Keep background profiles and templates user-owned.
- Keep audit logs attributable.

## Safety Boundaries

The app must maintain explicit user approval before external action:

- AI may draft, summarize, classify, and suggest.
- AI must not directly send or reply.
- Gmail draft creation requires approved email content.
- Future scheduled sends require prior approval and campaign scheduling.
- Scanner may classify and pause/update campaigns, but must never send replies.

## Gmail Integration Direction

Segment 2 starts with the minimum scope needed for draft creation. Later segments can add send and scan scopes only when needed.

Gmail account storage must include:

- Provider
- Google account email
- Granted scopes
- Token expiry
- Encrypted refresh token
- Status
- Revoked/expired/error state

Implementation requirements:

- Use Google OAuth.
- Refresh access tokens server-side.
- Construct MIME email payloads.
- Use Gmail `drafts.create` first.
- Store Gmail draft IDs on `EmailDraft`.
- Log Gmail API errors to `SystemEvent`.
- Keep future-ready interfaces for `drafts.send`, `messages.list`, `messages.get`, and reply classification.

## Background Jobs

Likely job categories:

- Scheduler run
- Gmail scanner run
- Draft creation retry
- AI transcript processing
- System health check

Each job should write `SystemEvent` records so the app can explain what happened and why.

## Environment Variables

Expected baseline:

- `DATABASE_URL`
- `APP_PASSWORD`
- `OPENAI_API_KEY`

Expected Gmail variables for Segment 2:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- token encryption secret

## Deployment

Vercel hosts the Next.js app. Supabase hosts Postgres. Environment variables must be configured in Vercel before production use.

Segment 1 must verify deployability before Gmail implementation begins.
