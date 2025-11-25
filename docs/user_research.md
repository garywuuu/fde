# FDE User Research Synthesis

## Research Goals
- Validate daily workflows for Forward Deployed Engineers (FDEs) across integrations, data pipelines, agent ops, evals, and customer communications.
- Identify top pain points when juggling client-facing deliverables with infrastructure tasks.
- Capture tool stacks currently in use and handoffs between FDEs, core eng, and customers.

## Methodology
- Scheduled 6 structured interviews (45 mins each) with FDEs at AI-first B2B startups (Series A–C).
- Captured user journeys via Miro boards + follow-up async questionnaires.
- Tagged findings in a shared Airtable for pattern analysis.

## Key Personas
1. **Integrator FDE** – embeds into customer codebases, ships custom endpoints, owns rollout.
2. **Eval Guardian** – maintains agent evaluation harnesses, monitors regressions, communicates metrics to customers.
3. **Customer Navigator** – primary external face; produces proposals, manages metrics dashboards, coordinates pilots.

## Pain Points & Evidence
| Theme | Evidence | Impact |
| --- | --- | --- |
| Tool sprawl | 5/6 use 6+ tools daily (Notion, GDocs, Jira/Linear, Slack, custom dashboards) with no single source of truth. | Context switching wastes ~6 hrs/week, missed deadlines due to fragments. |
| Integration runbooks | 4/6 maintain ad-hoc checklists in docs; no structured templates or status tracking per client. | Onboarding exceeds SLA by 20–40%; no visibility for leadership. |
| Eval + agent observability | 3/6 rely on custom scripts; historical runs hard to compare; regression triage manual. | Slow incident response; customers lose confidence. |
| Client comms | Update emails + slideware manually assembled; metrics scattered across dashboards. | Conflicting narratives with customers; duplicated work for GTM teams. |
| Task alignment | Meeting notes rarely linked to actual tasks; CRM + backlog not synced. | Critical follow-ups slip; handoffs to eng blocked. |

## Opportunities for MVP
- Consolidated workspace combining customer context + infra status per account.
- Template-driven integration checklists tied to environments, repos, and deployment artifacts.
- Embedded eval dashboard surfacing pass/fail trends + rerun triggers.
- AI summarization of notes to tasks/updates; unify metrics storytelling.

## Next Steps
- Validate clickable prototype with the six interviewees.
- Expand research to partner success managers for adjacent workflows.
