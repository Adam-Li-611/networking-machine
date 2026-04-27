# Changelog

All notable product changes for Networking Machine are tracked here. Released segment entries must also be reflected in `docs/VERSION_LOG.md`.

## [Unreleased]

### Planned

- Segment 2 Gmail Drafts-First Spine: Google OAuth, one connected Gmail account, AI-generated 4-email sequences, approval review, and Gmail draft creation only.

### Guardrails

- No Gmail OAuth, Gmail scopes, Gmail draft creation, send behavior, scanner, scheduler, or auto-send begins until Segment 2 is explicitly started.

## [v0.1.0] Foundation Deployable App

### Added

- Added missing primary workflow route surfaces for People, Draft Review, Gmail, Templates, Background, Calls, and Lead Research.
- Replaced Settings with a system health page covering app version, environment, database connectivity, password gate, OpenAI configuration, Gmail placeholder status, and Segment 1 safety gates.
- Added signed password-gate cookies so private routes require a server-verifiable auth cookie instead of a plain marker value.
- Preserved Gmail as a locked placeholder for Segment 2.

### Verified

- Vercel production deploy succeeded for merge `f0c088ad3f6302849eb7bbb2e0780c7417f4e7a5`.
- Production root redirects unauthenticated requests to `/login`.
- Production rejects forged `networking_machine_auth=ok` cookies and redirects to `/login`.
- Primary navigation route file smoke check passed for all required Segment 1 areas.
- Gmail boundary search found no OAuth, scopes, Gmail API calls, draft creation, scanner, scheduler, or send behavior.

### Known Verification Gap

- Authenticated Dashboard and Settings health still need a production click-through with the real app password or a temporary verification method.

## [v0.0.0] Planning Baseline

### Added

- Established rebuild mandate around a finance recruiting workflow machine instead of a generic CRM.
- Defined segment-based delivery process, governance docs, version log, status tracking, and GitHub issue/PR templates.
- Added local GitHub label, milestone, and starter issue manifests for repository setup.
- Captured safety rules for Gmail, AI drafting, approval, and future automation.

### Not Included

- No Gmail OAuth implementation.
- No Gmail draft creation.
- No scheduler, scanner, auto-send, or reply classification.
