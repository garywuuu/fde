# Railway PostgreSQL Setup Guide

## Step 1: Login to Railway

```bash
railway login
```

This will open your browser to authenticate with Railway.

## Step 2: Create a New Project

### Option A: Via Railway Dashboard (Recommended)

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `garywuuu/fde`
5. Railway will create a new project

### Option B: Via CLI

```bash
railway init
```

When prompted:
- **Project name**: `fde-workflow-platform` (or your choice)
- **Would you like to setup a GitHub repo?**: Yes (if you want Railway to manage deployments)

## Step 3: Add PostgreSQL Database

### Via Railway Dashboard (Recommended)

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Wait for PostgreSQL to provision (takes ~30 seconds)
4. Click on the PostgreSQL service

### Via CLI

```bash
railway add --plugin postgresql
```

## Step 4: Get Database Connection String

### Via Railway Dashboard

1. Click on your PostgreSQL service
2. Go to **"Variables"** tab
3. Copy the `DATABASE_URL` value
4. **Important**: This is your production database URL - keep it secure!

### Via CLI

```bash
railway variables
```

Look for `DATABASE_URL` in the output.

## Step 5: Link Local Project (Optional, for running migrations)

```bash
railway link
```

Select your project when prompted.

## Step 6: Test Connection (Optional)

```bash
railway run npx prisma db pull
```

This will test if you can connect to the database.

## Next Steps

After getting your `DATABASE_URL`:
1. Add it to Vercel environment variables (see VERCEL_SETUP.md)
2. Run Prisma migrations (see below)

## Running Migrations on Railway

Once linked, you can run migrations:

```bash
railway run npx prisma migrate deploy
```

Or via Railway dashboard:
1. Go to your project
2. Click on PostgreSQL service
3. Go to "Connect" tab
4. Use the connection string in a database client

