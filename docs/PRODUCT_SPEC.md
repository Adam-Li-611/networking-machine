# Product Spec

## Product

Networking Machine is a private, hosted, single-user AI outreach command center for finance recruiting and professional networking.

It is designed for Adam's own use first. The architecture should not block future multi-user support, but the product should stay fast, trusted, and personal rather than becoming a generic CRM.

## Core Principle

This is a workflow machine, not a generic CRM.

The product should help Adam move work forward:

Lead/person identified -> campaign created -> AI drafts 4-email sequence -> user reviews/edits/approves -> app creates Gmail drafts -> later app sends approved emails on cadence -> Gmail scanner detects replies/bounces/OOO/scheduling intent -> campaign pauses/updates -> call prep is generated -> transcript/notes are processed -> person memory and future follow-up cadence update.

## Primary User

Adam, using a private hosted app for finance recruiting and professional networking.

## Design Tone

- Dense
- Clean
- Operational
- Finance-professional
- Closer to Linear, Airtable, and Superhuman than consumer SaaS
- Fast to scan
- Built around trust and review

Avoid:

- Generic sales CRM language
- Fluffy marketing UI
- Decorative landing-page composition inside the app
- LinkedIn scraping or logged-in browser automation

## Hard Safety Rules

- Never auto-reply to people.
- Never send unapproved outreach.
- Start with Gmail draft creation before auto-send.
- Use progressive Gmail scopes: draft or compose first, scan and send later.
- Avoid LinkedIn scraping or logged-in browser automation.
- Support personal Gmail fallback and future OAuth verification or Google Workspace admin approval.

## Product Areas

1. Dashboard
2. People
3. Campaigns
4. Draft Review
5. Gmail
6. Templates
7. Background
8. Calls
9. Lead Research
10. Settings

## Campaign Statuses

- Drafting
- Needs Approval
- Approved
- Gmail Drafts Created
- Scheduled
- Initial Sent
- Follow-Up 1 Sent
- Follow-Up 2 Sent
- Follow-Up 3 Sent
- Replied
- Call Scheduled
- Call Completed
- Closed No Response
- Closed No Thanks
- Bounced
- Paused

## Person Lifecycle

- Lead
- Potential Contact
- Contact
- Closed

## Required Data Model

- Person
- Firm
- Campaign
- EmailSequence
- EmailDraft
- GmailAccount
- GmailMessage/GmailThread reference records
- TemplateSet
- BackgroundProfile
- Call
- Transcript/ConversationNote
- Task/NextAction
- SystemEvent/AuditLog

## Segment Acceptance Criteria

### Segment 1: Foundation

- App deploys on Vercel.
- Supabase Postgres connected.
- Prisma schema applies cleanly.
- Password gate protects the app.
- Dashboard loads.
- No broken primary nav routes.
- Settings page shows system health.

### Segment 2: Gmail Drafts-First Spine

- User can connect one Gmail account via OAuth.
- Store refresh/access token securely server-side.
- Show Gmail connection status in Settings/Gmail page.
- User can create/select a person.
- User can create a campaign for that person.
- App can generate a 4-email sequence.
- User can review/edit/approve each email.
- App can create real Gmail drafts from approved emails.
- Store Gmail draft IDs back in the database.
- No auto-send yet.

### Segment 3: Templates And Background

- User can edit reusable background profile fields.
- User can create template sets for initial email plus three follow-ups.
- Curly braces are direct variables.
- Square brackets are AI instructions.
- Old campaigns preserve the template snapshot used at creation time.

### Segment 4: Campaign Workflow

- Every campaign belongs to one person.
- Every campaign has initial plus three follow-ups.
- All four drafts are generated upfront.
- User approves upfront.
- Campaign and person lifecycle statuses are implemented.

### Segment 5: Scheduler

- Approved sequences can be scheduled.
- Follow-up interval default is 8 days.
- Monday sends move to Tuesday.
- No sends happen without approval.
- Background job can run online.
- System logs scheduled/send attempts.
- User can pause/resume campaign.

### Segment 6: Gmail Scanner

- App scans Gmail for relevant replies.
- Detect real reply, bounce, no thanks, out of office, scheduling intent, and meeting confirmation.
- Real reply pauses remaining follow-ups.
- Bounce closes campaign and flags bad email.
- No thanks closes campaign.
- Scheduling intent creates or suggests call.
- Scanner never sends replies.

### Segment 7: Calls And Prep

- Calls can be manually added or created from Gmail signals.
- Call brief includes person overview, firm/team overview, why Adam reached out, previous emails/replies, background overlap, suggested questions, specific ask, topics to avoid, and useful prior notes.

### Segment 8: Transcript Processing And Memory

- User can paste messy notes/transcripts.
- AI extracts dense notes, summary, career/background, firm/team insights, recruiting advice, personal hooks, people mentioned, follow-up topics, next action, suggested follow-up cadence, and thank-you draft.
- Person memory updates automatically but remains editable.

### Segment 9: Dashboard Automation

- Dashboard answers: "What do I need to do today?"
- Dashboard shows approvals, Gmail drafts, scheduled sends, replies needing review, overdue follow-ups, upcoming calls, call briefs needed, leads missing email, and campaigns paused by signal.
