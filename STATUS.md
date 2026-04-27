# Status

## Active Segment

Segment 1: Foundation

Current version: `v0.1.0` foundation shipped to production

Next segment: Segment 2 Gmail Drafts-First Spine, not started.

Segment 2 may start only after Adam or a temporary verification method confirms the authenticated Dashboard and Settings health page in production.

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
- Live GitHub PR creation: complete for Segment 0 PR #1.
- Live GitHub labels: tracked in `.github/labels.yml`; repository label creation still needs GitHub UI, GitHub CLI, or a connector tool that supports repository labels.
- Live GitHub milestones: tracked in `.github/milestones.yml`; repository milestone creation still needs GitHub UI, GitHub CLI, or a connector tool that supports milestones.
- Live GitHub segment issues: complete for Segment 0 through Segment 9.

## Segment 1 Foundation Plan

Objective: make the app deployable, protected, database-backed, and navigable without starting Gmail implementation.

Release status:

- Segment 1 PR: `https://github.com/Adam-Li-611/networking-machine/pull/13`
- Production merge SHA: `f0c088ad3f6302849eb7bbb2e0780c7417f4e7a5`
- Production URL: `https://networking-machine.vercel.app`
- Release version: `v0.1.0`
- Status: shipped, with authenticated UI health check pending because the local environment does not have the production app password.

Build scope:

- Confirm the Next.js App Router project runs locally.
- Confirm Vercel deployment requirements are documented.
- Connect Supabase Postgres through `DATABASE_URL`.
- Make Prisma generate and apply cleanly.
- Ensure the password gate protects all private app routes.
- Build or adapt the Dashboard as the operational home.
- Ensure primary nav routes exist for Dashboard, People, Campaigns, Draft Review, Gmail, Templates, Background, Calls, Lead Research, and Settings.
- Build Settings system health with app version, database connectivity, environment configuration status, mock mode status, and Gmail status placeholder.

Current implementation pass:

- Add missing primary navigation routes for People, Draft Review, Gmail, Templates, Background, Calls, and Lead Research.
- Keep existing Contacts/Firms/Conversations/Tasks pages available while the UX is reoriented around workflow areas.
- Replace Settings content with system health checks for app version, database, password gate, OpenAI configuration, Gmail placeholder status, mock mode, Vercel environment, and required environment variables.
- Preserve Gmail as a placeholder only; no OAuth, scopes, tokens, draft creation, send behavior, or scanner.

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

Current test evidence:

- Primary nav route file check passed for Dashboard, People, Campaigns, Draft Review, Gmail, Templates, Background, Calls, Lead Research, and Settings.
- Password gate signed-cookie helper check passed: valid signed cookie accepted, plain `ok` cookie rejected, wrong-password signature rejected.
- ASCII check passed for Segment 1 edited files.
- Gmail boundary search found only existing stubs and new placeholder/status copy; no OAuth, scopes, Gmail API calls, draft creation, scanner, or auto-send implementation was added.
- Vercel production deployment for merge `f0c088ad3f6302849eb7bbb2e0780c7417f4e7a5` reported success.
- Production root smoke check passed: unauthenticated `https://networking-machine.vercel.app/` redirects to `/login?next=%2F`.
- Production password-gate smoke check passed: forged cookie `networking_machine_auth=ok` against `/settings` redirects to `/login?next=%2Fsettings`.
- Production login page smoke check passed: login copy and metadata identify the app as a private AI outreach command center.
- `npm run build` could not run locally because `npm` is not installed in this environment (`zsh: command not found: npm`).

Exit criteria:

- Segment 1 acceptance criteria pass at the code and deployment level.
- `STATUS.md` records test evidence.
- `CHANGELOG.md` has `v0.1.0`.
- `docs/VERSION_LOG.md` has `v0.1.0`.
- `docs/DECISIONS.md` includes the signed password gate choice.
- Remaining manual check before Segment 2: authenticate with the production app password and confirm Dashboard plus Settings system health load successfully.

## Meaningful Change Log

- Started Segment 1 foundation implementation.
- Identified missing primary navigation routes as the first foundation gap.
- Identified Settings system health as the second foundation gap.
- Added missing primary navigation route files.
- Replaced Settings with system health and Segment 1 gate status.
- Hardened the password gate so middleware verifies a signed auth cookie instead of trusting a plain `ok` cookie value.
- Recorded local verification evidence and package-manager blocker.
- Merged Segment 1 foundation PR #13.
- Verified production smoke checks for unauthenticated redirect and forged-cookie rejection.
- Released Segment 1 as `v0.1.0` in `CHANGELOG.md` and `docs/VERSION_LOG.md`.
- Created Segment 0 governance plan.
- Created Segment 1 foundation plan.
- Created local GitHub label and milestone manifests.
- Created local starter issue tracking plan.
- Identified target GitHub repo: `https://github.com/Adam-Li-611/networking-machine`.
- Confirmed GitHub connector write authorization by creating `codex/segment-0-governance`.
- Opened Segment 0 PR #1 and created Segment 0 through Segment 9 tracking issues.
- Recorded that live GitHub label and milestone creation still need GitHub UI, GitHub CLI, or a connector tool that supports those repository mutations.
