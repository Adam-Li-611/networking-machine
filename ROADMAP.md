# Roadmap

Networking Machine ships segment by segment. Do not advance to the next segment until the current segment acceptance criteria pass and logs are updated.

## Version Track

- `v0.0.0` Planning baseline
- `v0.1.0` Foundation deployable app
- `v0.2.0` Gmail OAuth and draft creation
- `v0.3.0` Template/background-driven AI sequences
- `v0.4.0` Campaign approval workflow
- `v0.5.0` Gmail scanning and campaign updates
- `v1.0.0` Reliable daily-driver system

## Segment 0: Project Governance And Tracking

Goal: create the operating system for the rebuild before feature work.

Acceptance criteria:

- Governance docs exist.
- GitHub issue and pull request templates exist.
- Required label and milestone set is documented and ready to create in GitHub.
- `STATUS.md` captures the active segment plan and status process.
- `CHANGELOG.md` and `docs/VERSION_LOG.md` contain `v0.0.0`.
- Major product and architecture choices are logged in `docs/DECISIONS.md`.

## Segment 1: Foundation

Target version: `v0.1.0`

Acceptance criteria:

- App deploys on Vercel.
- Supabase Postgres is connected.
- Prisma schema applies cleanly.
- Password gate protects the app.
- Dashboard loads.
- No broken primary nav routes.
- Settings page shows system health.

## Segment 2: Gmail Drafts-First Spine

Target version: `v0.2.0`

Acceptance criteria:

- User can connect one Gmail account via OAuth.
- Tokens are stored securely server-side.
- Gmail connection status appears in Settings and Gmail.
- User can create or select a person.
- User can create a campaign for that person.
- App can generate a 4-email sequence.
- User can review, edit, and approve each email.
- App can create real Gmail drafts from approved emails.
- Gmail draft IDs are stored in the database.
- No auto-send exists.

## Segment 3: Templates And Background

Target version: `v0.3.0`

Acceptance criteria:

- Background profile is editable.
- Template sets support initial email and three follow-ups.
- Curly braces are direct variables, such as `{firstName}` and `{firm}`.
- Square brackets are AI instructions, such as `[mention strongest overlap]`.
- Old campaigns preserve the template snapshot used at creation time.

## Segment 4: Campaign Workflow

Target version: `v0.4.0`

Acceptance criteria:

- Every campaign belongs to one person.
- Every campaign has initial plus three follow-ups.
- All four drafts are generated upfront.
- User approves upfront.
- Campaign and person lifecycle statuses match `docs/PRODUCT_SPEC.md`.

## Segment 5: Scheduler

Acceptance criteria:

- Approved sequences can be scheduled.
- Default follow-up interval is 8 days.
- Monday sends move to Tuesday.
- No sends happen without approval.
- Background job can run online.
- System logs scheduled and send attempts.
- User can pause or resume a campaign.

## Segment 6: Gmail Scanner

Target version: `v0.5.0`

Acceptance criteria:

- App scans Gmail for relevant replies.
- Scanner detects real reply, bounce, no thanks, out of office, scheduling intent, and meeting confirmation.
- Real replies pause remaining follow-ups.
- Bounces close campaign and flag bad email.
- No-thanks replies close campaign.
- Scheduling intent creates or suggests a call.
- Scanner never sends replies.

## Segment 7: Calls And Prep

Acceptance criteria:

- Calls can be manually added or created from Gmail signals.
- Call brief includes person overview, firm or team overview, outreach reason, previous emails and replies, background overlap, suggested questions, specific ask, topics to avoid, and useful prior notes.

## Segment 8: Transcript Processing And Memory

Acceptance criteria:

- User can paste messy notes or transcripts.
- AI extracts dense notes, short summary, career/background, firm/team insights, recruiting advice, personal hooks, people mentioned, follow-up topics, next action, suggested follow-up cadence, and thank-you draft.
- Person memory updates automatically and remains editable.

## Segment 9: Dashboard Automation

Acceptance criteria:

- Dashboard answers: "What do I need to do today?"
- Dashboard shows drafts awaiting approval, Gmail drafts created, scheduled sends, replies needing review, overdue follow-ups, upcoming calls, call briefs needed, leads missing email, and campaigns paused due to reply, bounce, or scheduling signal.

## GitHub Tracking

Required labels:

- `segment-0-governance`
- `segment-1-gmail-drafts`
- `segment-2-templates-background`
- `segment-3-campaigns`
- `segment-4-scheduler`
- `segment-5-gmail-scanner`
- `segment-6-calls-transcripts`
- `priority-critical`
- `priority-high`
- `blocked`
- `needs-review`

Required milestones:

- `v0.1 Foundation`
- `v0.2 Gmail Drafts`
- `v0.3 Campaign Workflow`
- `v0.4 Background Automation`
- `v0.5 Gmail Scanner`
- `v1.0 Daily Driver`

Live GitHub target repo: `Adam-Li-611/networking-machine`

Live GitHub creation status: branch creation works. Label and milestone creation are tracked in local manifests and still need GitHub UI, GitHub CLI, or a connector tool that supports repository labels and milestones.

Local manifests:

- `.github/labels.yml`
- `.github/milestones.yml`
- `docs/GITHUB_TRACKING.md`
