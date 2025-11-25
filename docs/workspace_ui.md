# Client Engagement Hub – UX Blueprint

## Primary Views
1. **Account Overview Dashboard**
   - Hero summary: health score, success metrics, current phase.
   - Four cards: Deliverables, Open Risks, Integration Status, Latest Metrics.
   - Kanban lane for milestone stages (Discovery → Pilot → Rollout → Live).
2. **Notes & Proposals Workspace**
   - Rich-text editor with inline components (tasks, slash commands).
   - Templates: Pilot Proposal, Weekly Update, Launch Report.
   - Version history + quick share link with client visibility toggle.
3. **Timeline & Communications**
   - Chronological feed combining meetings, Slack threads, PR merges, incidents.
   - Filters by artifact type; quick action buttons (log touchpoint, generate summary).

## Key Components
- **Global Context Bar**: Client switcher, dataset selection, last sync status.
- **Task Drawer**: Shows tasks generated from notes; assign owners and due dates.
- **Metrics Widget**: Embed charts (success KPIs, eval pass rate) with annotations.
- **AI Assist Panel**: Suggests next updates, drafts customer emails, answers questions.

## Interactions
- Drag deliverables between phases; triggers checklist updates.
- Link notes to integrations/pipelines to maintain traceability.
- One-click “Generate update” uses AI to summarize timeline + metrics.
- Meeting note template auto-creates tasks via AI extraction.

## Technical Considerations
- Build with Next.js + React Server Components.
- Use Tailwind + Radix UI; support dark mode.
- Persist layout preferences per user via Postgres JSONB.
- Instrument with PostHog to measure widget usage (funnel from note creation → update send).
