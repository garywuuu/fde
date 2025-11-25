# RBAC & Client Portal Strategy

## Roles & Permissions
1. **FDE**
   - Full edit access to assigned companies, integrations, evals, notes.
   - Can invite customers with restricted scopes.
   - Can trigger automations (eval reruns, task generation).
2. **Solutions Architect / Leadership**
   - Org-wide read/write across workspaces.
   - Access to portfolio dashboards + analytics.
   - Manage templates, checklists, AI prompt libraries.
3. **Customer / External Stakeholder**
   - Read-only or comment access to selected artifacts (notes, metrics, eval summaries).
   - Cannot see internal tasks or other customers.
   - Optional upload capability for artifacts (logs, datasets) with approvals.

## Access Model
- Multi-tenant Postgres schema with `organization_id` scoping.
- `user_organization` join table storing role + feature flags.
- Resource-level ACLs for sensitive artifacts (e.g., restrict eval payloads).
- Feature gating via `entitlements` table (e.g., AI copilot beta, pipeline health).

## Client Portal Experience
- Shareable subdomain (client.company.workflows.app) with SSO magic links.
- Modules exposed: status dashboard, agreed deliverables, eval report summaries, ticket timeline.
- Downloadable reports + ability to comment/acknowledge milestones.
- Audit logging whenever customers view/export data.

## Security Considerations
- Row-level security policies enforced in DB; backend checks via Prisma middleware.
- Secrets (API keys, credentials) stored in Vault/KMS, never displayed to clients.
- ATO features: IP allowlists, session timeout, SCIM/Okta provisioning roadmap.

## Implementation Checklist
- Define Zod schemas for role-based capabilities; centralize in `accessControl.ts`.
- Middleware to inject `permissions` object on each request.
- Frontend guard HOCs/hooks (e.g., `usePermission('integration:edit')`).
- Portal theming options per customer; include watermarking for exports.
