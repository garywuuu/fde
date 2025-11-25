# Contextual AI Copilot – Design Doc

## Purpose
- Reduce manual synthesis of meeting notes, tasks, and customer updates.
- Answer ad-hoc questions leveraging workspace context (integrations, evals, metrics).
- Draft proposals, remediation plans, and communication summaries.

## Capabilities
1. **Note → Task Extraction**
   - After a meeting note is saved, run LLM prompt to produce structured tasks (title, owner suggestion, due date hint, linked context).
   - Present diff for user approval before committing tasks.
2. **Insight Summaries**
   - “What’s blocking Client X?” query compiles open checklist items, latest eval regressions, and unresolved risks.
   - Generate weekly update drafts referencing metrics + timeline events.
3. **Template Generation**
   - Provide slash commands: `/proposal`, `/qasummary`, `/retro`.
   - LLM fills sections using workspace data (deliverables, KPIs, incidents).
4. **Proactive Nudges**
   - Detect stale tasks/integrations; send Slack DM with context + suggested next step.

## Architecture
- Use LangChain/LangGraph orchestration with tools:
  - `fetchClientContext(companyId)` – pulls notes, integrations, eval metrics.
  - `listOpenTasks(companyId)` – returns outstanding items.
  - `getMetrics(companyId)` – latest success KPIs.
- Store conversation state per user; respect RBAC scopes when fetching context.
- Employ vector store (pgvector/Weaviate) for semantic retrieval over notes/docs.
- Guardrails: moderation + deterministic prompt templates; allow manual review for external comms.

## Implementation Steps
1. Define prompt templates + tool schemas (Zod) for tasks, insights, updates.
2. Build API endpoint `/api/ai/compose` accepting intent + payload; route to appropriate chain.
3. Frontend UI: side-panel with suggestions, inline buttons in notes editor.
4. Logging + analytics for prompt usage, completion rate, acceptance vs discarded suggestions.

## Future Enhancements
- Integrate eval agent logs for RAG context.
- Fine-tune on internal knowledge base of best-practice proposals.
- Add speech-to-text ingestion for live call summaries.
