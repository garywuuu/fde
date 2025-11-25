# MVP Scope & Success Criteria

## Core Surfaces
1. **Client Engagement Hub**
   - Account overview: deliverables, status, blockers, success metrics.
   - Proposal/notes workspace with rich text + shareable links.
   - Timeline of customer touchpoints (meetings, Slack threads, releases).
2. **Technical Runbooks**
   - Integration tracker: checklist templates, linked repos/envs, deployment targets.
   - Pipeline + agent registry: definitions, owners, last run state, alerts.
   - Eval control panel: surface latest runs, regressions, rerun triggers.

## Functional Requirements
- Multi-tenant orgs with workspace switcher.
- Unified task model across notes, checklists, and eval actions.
- Bi-directional links to external systems (Slack webhooks, GitHub PRs, Linear issues).
- AI summarization + task extraction within both surfaces.

## Out of Scope for MVP
- Deep CRM functionality; rely on integrations for contacts/opps.
- Full observability stack (logs, traces); link to existing tools instead.
- Automated deployment orchestration; focus on surfacing status + checklists.

## Success Metrics
- ≥3 design partner orgs using platform weekly.
- 80%+ of tracked integration tasks completed inside platform.
- Reduce customer update prep time by 30% (self-reported).
- Detect eval regressions within 30 mins via notifications dashboard.

## Dependencies
- Postgres + Prisma schema for entities listed above.
- Auth0/Clerk for org-level auth or custom NextAuth setup.
- Messaging integrations (Slack/Teams webhooks) for notifications.
