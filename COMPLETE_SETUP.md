# Complete Railway + Vercel Setup Guide

This guide walks you through connecting Railway (PostgreSQL) and Vercel (Next.js) together.

## Prerequisites

- ✅ GitHub repository: https://github.com/garywuuu/fde.git
- ✅ Code pushed to GitHub
- Railway account (sign up at https://railway.app)
- Vercel account (sign up at https://vercel.com)

---

## Part 1: Set Up Railway PostgreSQL

### Step 1.1: Login to Railway

```bash
railway login
```

Opens browser for authentication.

### Step 1.2: Create Project and Add PostgreSQL

**Via Railway Dashboard (Recommended):**

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose repository: `garywuuu/fde`
5. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
6. Wait for PostgreSQL to provision (~30 seconds)

### Step 1.3: Get DATABASE_URL

1. Click on the PostgreSQL service in your Railway project
2. Go to **"Variables"** tab
3. Copy the `DATABASE_URL` value
   - Format: `postgresql://user:password@host:port/database?sslmode=require`
   - **Save this** - you'll need it for Vercel!

### Step 1.4: Link Project (for migrations)

```bash
cd /Users/garywu/Desktop/learning
railway link
```

Select your Railway project when prompted.

---

## Part 2: Set Up Vercel

### Step 2.1: Import GitHub Repository

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select `garywuuu/fde`
5. Click **"Import"**

### Step 2.2: Configure Project Settings

Vercel should auto-detect:
- **Framework Preset**: Next.js
- **Root Directory**: `./` (current)
- **Build Command**: `prisma generate && next build` (or auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

**Verify these settings**, then click **"Deploy"** (we'll add env vars after)

### Step 2.3: Get Your Vercel URL

After deployment, Vercel will show your app URL:
- Format: `https://your-project-name.vercel.app`
- **Save this** - you'll need it for `NEXTAUTH_URL`

---

## Part 3: Connect Railway and Vercel

### Step 3.1: Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add the following variables:

#### Variable 1: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: Paste the `DATABASE_URL` from Railway (Step 1.3)
- **Environment**: Select all (Production, Preview, Development)

#### Variable 2: NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: Your Vercel app URL (from Step 2.3)
  - Example: `https://your-project-name.vercel.app`
- **Environment**: Select all (Production, Preview, Development)

#### Variable 3: NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: Generate a secret:
  ```bash
  openssl rand -base64 32
  ```
- **Environment**: Select all (Production, Preview, Development)

### Step 3.2: Redeploy with Environment Variables

1. Go to **"Deployments"** tab in Vercel
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. This will rebuild with the new environment variables

---

## Part 4: Run Database Migrations

### Option A: Via Railway CLI (Recommended)

```bash
cd /Users/garywu/Desktop/learning
railway run npx prisma migrate deploy
```

This will:
- Connect to your Railway PostgreSQL database
- Run all pending Prisma migrations
- Set up your database schema

### Option B: Via Railway Dashboard

1. Go to your Railway project
2. Click on PostgreSQL service
3. Go to **"Connect"** tab
4. Copy the connection string
5. Use a database client (like DBeaver, pgAdmin, or `psql`) to connect
6. Run migrations manually or use Railway's shell

### Option C: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migrations with production DATABASE_URL
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx prisma migrate deploy
```

---

## Part 5: Verify Everything Works

### Step 5.1: Check Vercel Deployment

1. Go to Vercel dashboard → **"Deployments"**
2. Verify latest deployment shows **"Ready"** status
3. Click on the deployment to see build logs
4. Verify no errors in build logs

### Step 5.2: Test Your App

1. Visit your Vercel URL: `https://your-project-name.vercel.app`
2. You should see the sign-in page
3. Click **"Register here"** to create an account
4. Test creating a company, integration, task, or note

### Step 5.3: Verify Database Connection

1. Create a test account in your app
2. Check Railway PostgreSQL logs to see if data is being written
3. Or connect to database and verify tables exist:
   ```bash
   railway run npx prisma studio
   ```

---

## Troubleshooting

### Build Fails in Vercel

1. **Check build logs** in Vercel dashboard
2. **Verify environment variables** are set correctly
3. **Check Prisma schema** is valid:
   ```bash
   npx prisma validate
   ```

### Database Connection Errors

1. **Verify DATABASE_URL** is correct in Vercel
2. **Check SSL mode**: Should include `?sslmode=require`
3. **Verify Railway PostgreSQL** is running (check Railway dashboard)

### Migration Errors

1. **Check Prisma schema** matches migrations
2. **Verify DATABASE_URL** is accessible
3. **Run migrations manually** via Railway CLI

### NextAuth Errors

1. **Verify NEXTAUTH_URL** matches your Vercel domain exactly
2. **Check NEXTAUTH_SECRET** is set
3. **Verify callback URLs** in NextAuth config

---

## Quick Reference

### Railway Commands
```bash
railway login          # Login to Railway
railway init           # Initialize new project
railway link           # Link to existing project
railway variables      # View environment variables
railway run <command>  # Run command in Railway environment
```

### Vercel Commands
```bash
vercel login           # Login to Vercel
vercel link            # Link to existing project
vercel env pull        # Pull environment variables
vercel --prod          # Deploy to production
```

### Database Commands
```bash
npx prisma migrate deploy    # Run migrations
npx prisma studio            # Open Prisma Studio
npx prisma db pull           # Pull schema from database
npx prisma generate          # Generate Prisma Client
```

---

## Success Checklist

- [ ] Railway project created
- [ ] PostgreSQL database added and running
- [ ] DATABASE_URL copied from Railway
- [ ] Vercel project created and connected to GitHub
- [ ] Environment variables added to Vercel:
  - [ ] DATABASE_URL
  - [ ] NEXTAUTH_URL
  - [ ] NEXTAUTH_SECRET
- [ ] Vercel deployment successful
- [ ] Prisma migrations run on production database
- [ ] App accessible at Vercel URL
- [ ] Can register and login
- [ ] Can create data (companies, integrations, etc.)

---

## Next Steps After Setup

1. **Monitor deployments**: Vercel will auto-deploy on every GitHub push
2. **Set up monitoring**: Add error tracking (Sentry, etc.)
3. **Configure custom domain**: Add your domain in Vercel settings
4. **Set up backups**: Configure Railway PostgreSQL backups
5. **Add staging environment**: Create preview deployments for testing

---

## Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs

