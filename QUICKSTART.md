# Quick Start Guide

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database

**Using Local PostgreSQL:**
```bash
# Create database
createdb fde_platform

# Push schema
npm run db:push
```

Your `.env` should have:
```env
DATABASE_URL="postgresql://your-username@localhost:5432/fde_platform?schema=public"
NEXTAUTH_SECRET="development-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Start Development Server
```bash
npm run dev
```

Visit **http://localhost:3000**

## 📝 First Steps

1. **Register**: Go to `/auth/register` and create your account
2. **Create Company**: Add your first client company
3. **Add Integration**: Track a customer integration
4. **Create Tasks**: Start managing your work items
5. **Take Notes**: Document meetings and proposals

## 🚢 Deploying to Production

### Railway (Database) + Vercel (App)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide.

**Quick Summary:**
1. Create PostgreSQL on Railway → Get `DATABASE_URL`
2. Deploy to Vercel → Add environment variables
3. Run migrations: `npx prisma migrate deploy`

## 🛠️ Useful Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm test                 # Run tests
npm run db:studio        # Open database GUI
npm run db:push          # Push schema changes
```

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Railway + Vercel deployment
- [test/README.md](./test/README.md) - Testing guide

## 🎯 Features

- ✅ User authentication & authorization
- ✅ Company management
- ✅ Integration tracking with checklists
- ✅ Task management
- ✅ Notes with versioning
- ✅ Eval runs monitoring
- ✅ Global search
- ✅ Integration templates

## 🐛 Troubleshooting

**Database connection issues?**
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Try: `npm run db:push`

**Port 3000 in use?**
- Change port: `PORT=3001 npm run dev`
- Or kill process: `lsof -ti:3000 | xargs kill`

**Build errors?**
- Run `npm run db:generate`
- Check Node.js version (18+)
- Clear `.next` folder: `rm -rf .next`

