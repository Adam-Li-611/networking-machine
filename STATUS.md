# Status

## Active Segment

Segment 0: Project Governance And Tracking

Current version: `v0.0.0` planning baseline

## Segment 0 Plan

Objective: establish the rebuild operating system before feature work.

Scope:

- Create governance docs.
- Replace the old CRM-shaped README with a workflow-machine README.
- Create GitHub issue and pull request templates.
- Document required labels and milestones.
- Log major product and architecture decisions.
- Write Segment 1 foundation plan before coding Segment 1.

Acceptance criteria:

- `README.md` exists and describes the rebuild.
- `CHANGELOG.md` exists and includes `v0.0.0`.
- `ROADMAP.md` exists and lists segments, acceptance gates, labels, and milestones.
- `STATUS.md` exists and is the active tracker.
- `docs/PRODUCT_SPEC.md` exists.
- `docs/ARCHITECTURE.md` exists.
- `docs/DECISIONS.md` exists.
- `docs/VERSION_LOG.md` exists.
- `docs/TEST_PLAN.md` exists.
- `.github/ISSUE_TEMPLATE/bug_report.md` exists.
- `.github/ISSUE_TEMPLATE/feature_request.md` exists.
- `.github/pull_request_template.md` exists.

Status:

- Local governance files: complete.
- Local GitHub label and milestone manifests: complete.
- Local starter issue plan: complete in `docs/GITHUB_TRACKING.md`.
- Live GitHub target repo: identified as `Adam-Li-611/networking-machine`.
- Live GitHub branch creation: complete for `codex/segment-0-governance`.
- Live GitHub PR creation: pending governance file import.
- Live GitHub labels: tracked in `.github/labels.yml`; repository label creation still needs GitHub UI, GitHub CLI, or a connector tool that supports repository labels.
- Live GitHub milestones: tracked in `.github/milestones.yml`; repository milestone creation still needs GitHub UI, GitHub CLI, or a connector tool that supports milestones.
- Live GitHub segment issues: pending.

## Segment 1 Foundation Plan

Objective: make the app deployable, protected, database-backed, and navigable without starting Gmail implementation.

Build scope:

- Confirm the Next.js App Router project runs locally.
- Confirm Vercel deployment requirements are documented.
- Connect Supabase Postgres through `DATABASE_URL`.
- Make Prisma generate and apply cleanly.
- Ensure the password gate protects all private app routes.
- Build or adapt the Dashboard as the operational home.
- Ensure primary nav routes exist for Dashboard, People, Campaigns, Draft Review, Gmail, Templates, Background, Calls, Lead Research, and Settings.
- Build Settings system health with app version, database connectivity, environment configuration status, mock mode status, and Gmail status placeholder.

Non-goals:

- No Gmail OAuth.
- No Gmail scopes.
- No Gmail API calls.
- No Gmail draft creation.
- No scheduler.
- No scanner.
- No auto-send.

Implementation notes:

- Prefer keeping the existing Next.js, TypeScript, Tailwind, Prisma, and local UI component setup where it supports the new workflow.
- Replace CRM-shaped routes and labels only where needed for Segment 1 acceptance criteria.
- Use the future data model in `docs/ARCHITECTURE.md` to shape Prisma, but only implement what Segment 1 needs to apply cleanly.
- Use mock or placeholder integration status for Gmail until Segment 2.

Test plan:

- `npm install`
- `npm run lint` if configured
- `npm run prisma:generate`
- `npm run prisma:migrate` or equivalent migration command
- `npm run build`
- Manual verification of password gate
- Manual verification of all primary nav routes
- Manual verification of Settings system health

Exit criteria:

- Segment 1 acceptance criteria pass.
- `STATUS.md` records test evidence.
- `CHANGELOG.md` has `v0.1.0`.
- `docs/VERSION_LOG.md` has `v0.1.0`.
- `docs/DECISIONS.md` includes any new major choices made during foundation work.

## Meaningful Change Log

- Created Segment 0 governance plan.
- Created Segment 1 foundation plan.
- Created local GitHub label and milestone manifests.
- Created local starter issue tracking plan.
- Identified target GitHub repo: `https://github.com/Adam-Li-611/networking-machine`.
- Confirmed GitHub connector write authorization by creating `codex/segment-0-governance`.
- Recorded that live GitHub label and milestone creation still need GitHub UI, GitHub CLI, or a connector tool that supports those repository mutations.
