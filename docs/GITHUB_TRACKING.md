# GitHub Tracking

Live GitHub target repo: `Adam-Li-611/networking-machine`

Live GitHub setup is partially automated. Branch creation works through the GitHub connector. Repository labels and milestones are tracked here and in local manifests because the current connector toolset does not expose direct repository label or milestone creation.

## Labels

See `.github/labels.yml`.

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

## Milestones

See `.github/milestones.yml`.

Required milestones:

- `v0.1 Foundation`
- `v0.2 Gmail Drafts`
- `v0.3 Campaign Workflow`
- `v0.4 Background Automation`
- `v0.5 Gmail Scanner`
- `v1.0 Daily Driver`

## Starter Issues

### Segment 0: Governance Baseline

Labels: `segment-0-governance`, `priority-high`, `needs-review`

Milestone: `v0.1 Foundation`

Acceptance criteria:

- Required governance docs exist.
- GitHub issue and PR templates exist.
- Label and milestone manifests exist.
- Segment 1 foundation plan is written in `STATUS.md`.
- `CHANGELOG.md` and `docs/VERSION_LOG.md` include `v0.0.0`.
- Major decisions are logged in `docs/DECISIONS.md`.

### Segment 1: Foundation Deployable App

Labels: `segment-1-gmail-drafts`, `priority-critical`, `needs-review`

Milestone: `v0.1 Foundation`

Acceptance criteria:

- App deploys on Vercel.
- Supabase Postgres connected.
- Prisma schema applies cleanly.
- Password gate protects the app.
- Dashboard loads.
- No broken primary nav routes.
- Settings page shows system health.

### Segment 2: Gmail Drafts-First Spine

Labels: `segment-1-gmail-drafts`, `priority-critical`, `needs-review`

Milestone: `v0.2 Gmail Drafts`

Acceptance criteria:

- One Gmail account connects through OAuth.
- Tokens are stored securely server-side.
- Gmail status appears in Settings/Gmail.
- Person and campaign can be created.
- Four-email sequence can be generated, reviewed, edited, and approved.
- Approved emails create Gmail drafts and store draft IDs.
- No auto-send.

### Segment 3: Templates And Background

Labels: `segment-2-templates-background`, `priority-high`, `needs-review`

Milestone: `v0.3 Campaign Workflow`

Acceptance criteria:

- Background profile is editable.
- Template sets support initial email and three follow-ups.
- Curly braces are variables.
- Square brackets are AI instructions.
- Campaigns preserve template snapshots.

### Segment 4: Campaign Workflow

Labels: `segment-3-campaigns`, `priority-high`, `needs-review`

Milestone: `v0.3 Campaign Workflow`

Acceptance criteria:

- Every campaign belongs to one person.
- Every campaign has initial plus three follow-ups.
- All four drafts are generated upfront.
- User approves upfront.
- Campaign and person lifecycle statuses are implemented.

### Segment 5: Scheduler

Labels: `segment-4-scheduler`, `priority-high`, `needs-review`

Milestone: `v0.4 Background Automation`

Acceptance criteria:

- Approved sequences can be scheduled.
- Default follow-up interval is 8 days.
- Monday sends move to Tuesday.
- No sends happen without approval.
- Background job can run online.
- Send attempts are logged.
- Campaigns can be paused and resumed.

### Segment 6: Gmail Scanner

Labels: `segment-5-gmail-scanner`, `priority-critical`, `needs-review`

Milestone: `v0.5 Gmail Scanner`

Acceptance criteria:

- App scans Gmail for relevant replies.
- Scanner detects real reply, bounce, no thanks, out of office, scheduling intent, and meeting confirmation.
- Real reply pauses remaining follow-ups.
- Bounce closes campaign and flags bad email.
- No-thanks closes campaign.
- Scheduling intent creates or suggests call.
- Scanner never sends replies.

### Segment 7: Calls And Prep

Labels: `segment-6-calls-transcripts`, `priority-high`, `needs-review`

Milestone: `v1.0 Daily Driver`

Acceptance criteria:

- Calls can be manually added or created from Gmail signals.
- Call brief includes all required context and suggested questions.

### Segment 8: Transcript Processing And Memory

Labels: `segment-6-calls-transcripts`, `priority-high`, `needs-review`

Milestone: `v1.0 Daily Driver`

Acceptance criteria:

- Messy notes/transcripts can be pasted.
- AI extraction creates all required structured outputs.
- Person memory updates automatically and remains editable.

### Segment 9: Dashboard Automation

Labels: `priority-high`, `needs-review`

Milestone: `v1.0 Daily Driver`

Acceptance criteria:

- Dashboard answers "What do I need to do today?"
- Dashboard shows all required work queues and paused campaign signals.
