# Deployment Guide

This guide walks you through deploying the FDE Workflow Platform to Railway (PostgreSQL) and Vercel (Next.js).

## Prerequisites

- GitHub account
- Railway account (sign up at https://railway.app)
- Vercel account (sign up at https://vercel.com)
- Git installed locally

## Step 1: Prepare GitHub Repository

### 1.1 Create a new GitHub repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `fde-workflow-platform`)
3. **Don't** initialize with README, .gitignore, or license (we already have these)

### 1.2 Push your code to GitHub

```bash
cd /Users/garywu/Desktop/learning

# Make sure all changes are committed
git add .
git commit -m "Initial commit: FDE Workflow Platform MVP"

# Add your GitHub repo as origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Set up Railway (PostgreSQL)

### 2.1 Create Railway Project

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will create a new project

### 2.2 Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will provision a PostgreSQL instance
4. Click on the PostgreSQL service
5. Go to the "Variables" tab
6. Copy the `DATABASE_URL` value (you'll need this for Vercel)

### 2.3 Configure Railway Environment Variables (Optional)

If you want to run migrations via Railway:
- Add `DATABASE_URL` (already set automatically)
- You can run migrations with: `railway run npx prisma migrate deploy`

## Step 3: Set up Vercel (Next.js App)

### 3.1 Import Project

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3.2 Configure Build Settings

Vercel should auto-detect:
- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && next build` (or just `next build` if postinstall handles Prisma)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`

### 3.3 Add Environment Variables

In Vercel project settings → Environment Variables, add:

1. **DATABASE_URL**
   - Value: Copy from Railway PostgreSQL service variables
   - Environment: Production, Preview, Development

2. **NEXTAUTH_URL**
   - Value: `https://your-project-name.vercel.app` (Vercel will show you the URL)
   - Environment: Production, Preview, Development
   - For preview deployments, use: `https://$VERCEL_URL`

3. **NEXTAUTH_SECRET**
   - Generate with: `openssl rand -base64 32`
   - Environment: Production, Preview, Development

### 3.4 Deploy

1. Click "Deploy"
2. Vercel will build and deploy your app
3. Wait for deployment to complete

## Step 4: Run Database Migrations

After your first deployment, you need to run Prisma migrations:

### Option A: Via Railway CLI

```bash
# Install Railway CLI if not already installed
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run migrations
railway run npx prisma migrate deploy
```

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Run migrations with production DATABASE_URL
vercel env pull .env.production
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx prisma migrate deploy
```

### Option C: Via Railway Dashboard

1. Go to your Railway project
2. Click on your PostgreSQL service
3. Go to "Connect" tab
4. Use the connection string in a database client (like DBeaver or pgAdmin)
5. Run migrations manually or use Railway's shell

## Step 5: Verify Deployment

1. Visit your Vercel URL: `https://your-project-name.vercel.app`
2. You should see the sign-in page
3. Register a new account
4. Test the application

## Step 6: Set up Automatic Deployments

Both Railway and Vercel are now connected to your GitHub repo:

- **Railway**: Will automatically redeploy if you change Railway-specific configs
- **Vercel**: Will automatically deploy on every push to `main` branch

### Preview Deployments

Vercel creates preview deployments for every pull request automatically.

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct in Vercel environment variables
- Check that Railway PostgreSQL is running
- Ensure SSL mode is enabled: `?sslmode=require` in DATABASE_URL

### Build Failures

- Check Vercel build logs for errors
- Ensure `prisma generate` runs before `next build`
- Verify all environment variables are set

### Migration Issues

- Make sure migrations are committed to your repo
- Run `npx prisma migrate deploy` after first deployment
- Check Prisma schema matches your database

### NextAuth Issues

- Verify `NEXTAUTH_URL` matches your Vercel domain
- Ensure `NEXTAUTH_SECRET` is set and consistent
- Check that callback URLs are correct

## Updating Your Deployment

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. Vercel will automatically deploy
4. If you changed database schema, run migrations:
   ```bash
   railway run npx prisma migrate deploy
   ```

## Environment Variables Reference

| Variable | Description | Where to Set |
|----------|-------------|--------------|
| `DATABASE_URL` | PostgreSQL connection string | Railway (auto) + Vercel (manual) |
| `NEXTAUTH_URL` | Your app URL | Vercel |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Vercel |
| `NODE_ENV` | Environment (production) | Vercel (auto) |

## Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
