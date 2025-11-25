# Local Development Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v14 or higher)
3. **npm** or **yarn**

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

#### Option A: Using Local PostgreSQL

1. Create a PostgreSQL database:
```bash
createdb fde_platform
```

2. Update `.env` with your database credentials:
```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/fde_platform?schema=public"
```

#### Option B: Using Docker (Recommended)

```bash
docker run --name fde-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=fde_platform \
  -p 5432:5432 \
  -d postgres:14
```

Then update `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/fde_platform?schema=public"
```

#### Option C: Using Supabase (Cloud)

1. Create a project at https://supabase.com
2. Copy the connection string and update `.env`

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Push Database Schema

```bash
npm run db:push
```

This will create all the tables in your database.

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

## First Steps

1. **Register an Account**
   - Navigate to http://localhost:3000/auth/register
   - Create your organization and user account

2. **Create Your First Customer**
   - Go to Customers → Add Customer
   - Add a client customer

3. **Start Tracking Work**
   - Create integrations, tasks, and notes
   - Use the search bar to find items quickly

## Environment Variables

Required variables in `.env`:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret key for NextAuth (generate with `openssl rand -hex 32`)
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for local dev)

Optional:
- `ANTHROPIC_API_KEY` - For AI features (if implemented)

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio (database GUI)
npm run db:migrate       # Create migration

# Testing
npm test                 # Run tests
npm test:ui              # Run tests with UI
npm test:coverage        # Run tests with coverage
```

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running: `pg_isready` or check Docker container
- Verify DATABASE_URL in `.env` is correct
- Check PostgreSQL logs for connection errors

### Prisma Issues

- Run `npm run db:generate` after schema changes
- Run `npm run db:push` to sync schema
- Use `npm run db:studio` to inspect database

### Port Already in Use

- Change port: `PORT=3001 npm run dev`
- Or kill process on port 3000: `lsof -ti:3000 | xargs kill`

## Next Steps

- Explore the dashboard
- Create customers and integrations
- Add tasks and notes
- Check out the eval runs page
- Use the search functionality

