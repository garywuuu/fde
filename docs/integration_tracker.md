# Integration & Pipeline Tracker – Functional Spec

## Goals
- Provide canonical checklist + status for each customer integration.
- Tie technical artifacts (repos, environments, agents, pipelines) to workflows.
- Offer leadership visibility into rollout progress + risk.

## Data Model Sketch
- **Customer** (id, name, stage, success metrics)
- **Integration** (id, customer_id, template_id, status, phase, owner_id)
- **ChecklistItem** (id, integration_id, title, state, due_date, linked_task)
- **ArtifactLink** (id, integration_id, type[repo/env/pipeline], url, metadata)
- **Pipeline** (id, customer_id, type[ingest/transform/eval], last_run_at, status)
- **AgentConfig** (id, customer_id, purpose, model, env, last_eval_id)

## UX Flow
1. **Library of Templates** – Onboarding, Data Sync, Eval Harness. Each template preloads checklist items + artifacts.
2. **Integration Detail View**
   - Header: phase (Discovery, Build, Pilot, Launch), owner, last updated.
   - Checklist board grouped by categories (Access, Data, Agents, Testing).
   - Artifact sidebar linking GitHub repos, Databricks jobs, Snowflake creds, etc.
   - Pipeline cards showing status (success/fail) + CTA to view logs.
3. **Portfolio View** – Table of all integrations with filters by stage, owner, risk level.

## Automations
- Webhook ingestion from CI/CD to auto-complete checklist items when PRs merge.
- Sync with Linear/Jira tasks: checklist updates push to ticket status.
- Scheduled reminders when due dates slip; escalate to Slack channel.

## Technical Implementation Notes
- API endpoints via Next.js route handlers or tRPC procedures (`integration.create`, `integration.updateStatus`, `pipeline.recordRun`).
- Prisma migrations for entities above; consider soft deletes via deleted_at.
- Background worker (Temporal/Queue) for webhook processing + reminder jobs.
- Use Zod schemas for validation; emit analytics events (`integration_stage_changed`).
