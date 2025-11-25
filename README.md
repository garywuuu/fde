# Orbital - MVP

A consolidated platform for Forward Deployed Engineers to manage client-facing deliverables and infrastructure workflows.

## What We've Built (Documentation Phase)

### 1. User Research (`docs/user_research.md`)
- Synthesized insights from 6 FDE interviews
- Identified key personas: Integrator FDE, Eval Guardian, Customer Navigator
- Documented pain points: tool sprawl, integration runbooks, eval observability, client comms, task alignment
- Validated MVP opportunities

### 2. MVP Scope (`docs/mvp_scope.md`)
- Defined two core surfaces: Client Engagement Hub + Technical Runbooks
- Set success metrics: ≥3 design partners, 80% task completion, 30% time reduction
- Outlined dependencies: Postgres, Auth, Messaging integrations

### 3. Client Engagement Hub (`docs/workspace_ui.md`)
- Account overview dashboard design
- Notes & proposals workspace with rich text
- Timeline & communications view
- AI assist panel specifications

### 4. Integration Tracker (`docs/integration_tracker.md`)
- Data model: Customers, Integrations, Checklists, Artifacts, Pipelines, Agents
- Template library for onboarding workflows
- Portfolio view with filters
- Webhook automations

### 5. Agent & Eval Panel (`docs/agent_eval_panel.md`)
- Run history table with regression detection
- Real-time alerts and escalation policies
- Agent health cards
- Webhook ingestion for eval results

### 6. Contextual AI (`docs/contextual_ai.md`)
- Note → task extraction
- Insight summaries ("What's blocking Client X?")
- Template generation with slash commands
- LangChain/LangGraph architecture

### 7. RBAC & Sharing (`docs/rbac_sharing.md`)
- Role definitions: FDE, Solutions Architect, Customer
- Multi-tenant access model
- Client portal with SSO
- Security considerations

### 8. Design Partners (`docs/design_partners.md`)
- Recruitment pipeline
- Engagement model (weekly cadence)
- Success metrics and feedback loops

## Implementation Status

### ✅ Completed

1. **Project Setup**
   - Next.js 15 with TypeScript and Tailwind CSS
   - Prisma ORM with PostgreSQL schema
   - Project structure (`app/`, `components/`, `lib/`, `prisma/`)

2. **Database Schema** (`prisma/schema.prisma`)
   - Organizations (multi-tenant)
   - Users with RBAC roles (FDE, Solutions Architect, Customer)
   - Customers (clients) with stages
   - Integrations with checklists and artifacts
   - Pipelines and Agents
   - Eval Runs
   - Tasks and Notes
   - NextAuth models (Account, Session, VerificationToken)

3. **Authentication**
   - NextAuth.js setup with credentials provider
   - Registration API endpoint
   - Sign-in and register pages
   - Session management with JWT
   - Auth helpers for protected routes

4. **API Routes**
   - `/api/auth/register` - User registration
   - `/api/auth/[...nextauth]` - NextAuth handler
   - `/api/customers` - CRUD for customers
   - `/api/integrations` - CRUD for integrations
   - `/api/tasks` - CRUD for tasks with filtering
   - `/api/notes` - CRUD for notes

5. **UI Components**
   - Layout component with navigation
   - Dashboard with stats overview
   - Customers: list, create, and detail pages
   - Integrations: list, create, and detail pages with checklist management
   - Tasks: list, create pages with filtering by status
   - Notes: list, create, and detail pages with shareable links
   - Evals: eval runs dashboard with regression detection
   - Reusable UI components (Button, Input, Card)

6. **Protected Routes**
   - Middleware for authentication
   - All dashboard routes require login
   - Auth helpers for API routes

7. **API Endpoints (15+)**
   - Auth: register, sign-in (NextAuth)
   - Customers: CRUD operations
   - Integrations: CRUD + checklist management
   - Tasks: CRUD with filtering
   - Notes: CRUD with versioning
   - Evals: list, create, webhook ingestion

7. **Testing Infrastructure**
   - Vitest test framework configured
   - 32+ tests covering API routes, components, and utilities
   - Test coverage for core CRUD operations
   - Mock setup for Next.js, Prisma, and NextAuth

### 🚧 Next Steps

1. Task detail/edit pages
2. Integration templates and artifact management
3. AI copilot features (note → task extraction)
4. External integrations (Slack, GitHub webhooks)
5. Client portal views with RBAC
6. Pipeline and agent management UI
7. Advanced search and filtering
8. Expand test coverage to 80%+

## Getting Started

### Local Development

1. Set up your database:
   ```bash
   # Copy .env.example to .env and update DATABASE_URL
   cp .env.example .env
   
   # Push schema to database
   npm run db:push
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Railway (PostgreSQL Database)

1. Connect your GitHub repo to Railway
2. Add PostgreSQL plugin to your Railway project
3. Copy the `DATABASE_URL` from Railway variables

### Vercel (Next.js Application)

1. Connect your GitHub repo to Vercel
2. Add environment variables:
   - `DATABASE_URL` - From Railway PostgreSQL
   - `NEXTAUTH_URL` - Your Vercel app URL (e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
3. Vercel will automatically run `prisma generate` during build
4. Run migrations: `DATABASE_URL="..." npx prisma migrate deploy` or via Railway CLI

### Environment Variables

Required for production:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - Secret key for NextAuth.js

