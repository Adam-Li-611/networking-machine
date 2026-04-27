# Decisions

Major product and architecture choices are recorded here. Add a new entry whenever the rebuild chooses a durable direction.

## D-001: Rebuild Around Workflow, Not CRM

Status: accepted

Decision: Networking Machine will be rebuilt as an outreach workflow machine rather than preserving the old CRM-shaped UX.

Why: The core value is moving a lead through campaign drafting, approval, Gmail drafts, reply handling, call prep, transcript processing, and follow-up memory. Generic CRM surfaces can support this only when they serve the workflow.

Consequences:

- Primary navigation follows workflow areas.
- Dashboard focuses on "what needs attention today."
- Campaign and draft review are first-class product surfaces.

## D-002: Drafts Before Sending

Status: accepted

Decision: Gmail integration starts with draft creation only. Auto-send is deferred until after explicit approval, scheduling, and safety logs exist.

Why: Outreach mistakes are high-trust failures. Draft creation gives real Gmail integration value while preserving user control.

Consequences:

- Segment 2 uses Gmail draft/compose scope only.
- Scheduler and send behavior wait for later segments.
- Tests must not send real emails unless Adam explicitly approves.

## D-003: Progressive Gmail Scopes

Status: accepted

Decision: Request Gmail scopes only as segments need them.

Why: Personal Gmail and school Gmail can have different OAuth approval constraints. Smaller scopes reduce user friction and future OAuth verification burden.

Consequences:

- Draft creation scope comes first.
- Send and scan scopes come later.
- Gmail account records must store granted scopes and status.

## D-004: Single-User First, Future Multi-User Compatible

Status: accepted

Decision: Optimize for Adam's private use first, while avoiding architecture that blocks later multi-user support.

Why: The fastest path to value is a private daily-driver app. Future SaaS support should remain possible without dominating current design.

Consequences:

- Segment 1 can use a password gate.
- Data model should be easy to add ownership to later.
- OAuth tokens and background profiles should not be treated as unstructured globals.

## D-005: No LinkedIn Scraping Or Logged-In Browser Automation

Status: accepted

Decision: The app will not scrape LinkedIn or automate logged-in browser sessions.

Why: The product should avoid brittle, risky, and policy-hostile data collection. Lead research can use manual entry and compliant sources.

Consequences:

- Lead Research starts as a manual and assisted workflow.
- Browser automation is not part of the product plan.

## D-006: Segment Governance Is Mandatory

Status: accepted

Decision: Every segment needs a plan in `STATUS.md` before coding, and released segments update `CHANGELOG.md` plus `docs/VERSION_LOG.md`.

Why: The app has safety-sensitive Gmail behavior and a long workflow arc. Governance keeps scope, safety, and test evidence visible.

Consequences:

- Meaningful changes update `STATUS.md`.
- Major choices update this file.
- Pull requests must include summary, files changed, tests, screenshots when UI changes, and version/log updates.
