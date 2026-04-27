# Test Plan

## Principles

- Safety-sensitive workflows need explicit test evidence.
- Gmail behavior must support mock mode so local development does not require real Gmail every time.
- Never test by sending real emails unless Adam explicitly approves.
- Prefer smoke tests around segment acceptance criteria.
- Manual verification is acceptable for early private-app segments, but evidence must be recorded in `STATUS.md`.

## Segment 1: Foundation

Automated or command checks:

- `npm install`
- `npm run lint` if configured
- `npm run prisma:generate`
- `npm run prisma:migrate` or equivalent migration command
- `npm run build`

Manual checks:

- Password gate blocks unauthenticated access when `APP_PASSWORD` is set.
- Dashboard loads.
- Primary nav routes load with no broken pages:
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
- Settings shows system health:
  - app/version status
  - database status
  - password gate status
  - OpenAI key status
  - Gmail placeholder/mock status

## Segment 2: Gmail Drafts-First Spine

Mock mode checks:

- OAuth-disabled local mode can simulate a connected Gmail account.
- Draft creation can be simulated without calling Gmail.
- Gmail API failures can be simulated and logged.

Real Gmail checks:

- OAuth asks only for minimum draft/compose scope.
- Connected account email and scopes display correctly.
- Refresh token is stored encrypted server-side.
- Expired access token refreshes server-side.
- Revoked token moves account into an error/reconnect state.
- Approved draft creates a real Gmail draft.
- Gmail draft ID is stored on the email draft.
- No send endpoint or auto-send path is active.

## Later Segments

Scheduler:

- Approved-only send gate.
- Default 8-day follow-up interval.
- Monday send moves to Tuesday.
- Pause/resume behavior.
- System event logging.

Scanner:

- Real reply pauses follow-ups.
- Bounce closes campaign and flags bad email.
- No-thanks closes campaign.
- Out-of-office pauses or delays as designed.
- Scheduling intent suggests or creates a call.
- Scanner never sends replies.

Calls and transcripts:

- Call brief includes all required sections.
- Transcript extraction produces structured fields.
- Person memory updates remain editable.
- Thank-you draft is created as a draft/review artifact, not auto-sent.
