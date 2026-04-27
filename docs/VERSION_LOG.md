# Version Log

Networking Machine uses semantic-ish product versions tied to product capability, not only code packaging.

## Current Version

`v0.1.0` Foundation deployable app

## Version Ladder

| Version | Name | Release Gate |
| --- | --- | --- |
| `v0.0.0` | Planning baseline | Governance docs, status process, version log, and rebuild direction exist. |
| `v0.1.0` | Foundation deployable app | Vercel deployable, Supabase connected, Prisma applies, password gate protects app, dashboard and primary nav routes work, Settings shows system health. |
| `v0.2.0` | Gmail OAuth and draft creation | One Gmail account connects, approved emails create real Gmail drafts, draft IDs persist, no auto-send. |
| `v0.3.0` | Template/background-driven AI sequences | Background profile and template sets drive generated sequences with snapshots. |
| `v0.4.0` | Campaign approval workflow | Campaign lifecycle, person lifecycle, upfront generation, and approval workflow are reliable. |
| `v0.5.0` | Gmail scanning and campaign updates | Scanner classifies replies, bounces, OOO, no thanks, and scheduling intent without sending replies. |
| `v1.0.0` | Reliable daily-driver system | Dashboard automation, calls, transcript memory, scheduling, scanning, and safety controls are reliable enough for daily use. |

## Releases

### `v0.1.0` Foundation Deployable App

Status: shipped to production

Released through:

- PR: `https://github.com/Adam-Li-611/networking-machine/pull/13`
- Merge SHA: `f0c088ad3f6302849eb7bbb2e0780c7417f4e7a5`
- Production URL: `https://networking-machine.vercel.app`

Included:

- Deployable Next.js App Router foundation.
- Password gate hardening with signed auth cookies.
- Primary workflow routes for Dashboard, People, Campaigns, Draft Review, Gmail, Templates, Background, Calls, Lead Research, and Settings.
- Settings system health page.
- Gmail placeholder status only.

Verified:

- Production deploy succeeded on Vercel.
- Unauthenticated production root redirects to login.
- Forged plain `networking_machine_auth=ok` cookie no longer opens private routes.
- Local signed-cookie helper check passed.
- Primary route file smoke check passed.
- Gmail boundary search found no Segment 2 behavior.

Pending manual verification:

- Authenticated Dashboard and Settings health need a production click-through with the real app password or a temporary verification method.

### `v0.0.0` Planning Baseline

Status: released

Included:

- Rebuild mandate captured.
- Segment roadmap captured.
- Safety rules captured.
- Governance docs and templates created.
- Segment 1 foundation plan written.

Not included:

- Gmail OAuth
- Gmail draft creation
- Scheduler
- Gmail scanner
- Calls/transcript automation
- Dashboard automation
