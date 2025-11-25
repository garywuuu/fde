# Agent & Eval Observability Panel – Spec

## Objectives
- Centralize eval runs across agents/pipelines with historical comparison.
- Accelerate regression triage via alerts, diffs, and remediation actions.
- Provide customer-ready metrics to embed in updates.

## Core Features
1. **Run History Table**
   - Columns: Suite, Agent/Model, Dataset, Pass %, Tokens, Duration, Trigger (manual/scheduled/webhook).
   - Row expanders show failure clusters + sample transcripts.
2. **Regression Diff View**
   - Compare baseline vs latest run; highlight metrics outside thresholds.
   - Inline CTA: “Create incident”, “Roll back agent”, “Open ticket”.
3. **Real-time Alerts**
   - Slack/email notifications when pass rate drops below target or latency spikes.
   - Escalation policies per customer or integration phase.
4. **Agent Health Cards**
   - For each agent: last deploy, current model, guardrail status, eval trend sparkline.

## Data Inputs
- Webhook endpoint `POST /api/evals/report` accepting JSON payloads from Helicone/Langfuse/LlamaIndex harnesses.
- Poll GitHub Actions / CI for scheduled eval results.
- Manual upload for CSV/JSON eval outputs during initial pilots.

## Actions & Automations
- “Rerun eval” button triggers CI job or internal workflow via queue.
- Auto-create tasks when regressions detected; link to integration checklist.
- Customer-safe summary: select metrics + generate shareable snapshot.

## Tech Notes
- Store eval runs in Postgres table `eval_run` (json payload + metrics). Use Timescale/ClickHouse later if needed.
- Background worker normalizes payloads, computes derived metrics, and writes to analytics store.
- API response shaped for frontend charts (grouped by suite/date).
- Visualization via Recharts or Tremor; consider virtualization for large histories.
