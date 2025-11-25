# Verification Checklist

## ✅ Quick Verification Steps

### 1. Server Status
```bash
# Check if server is running
curl http://localhost:3000

# Or check port
lsof -ti:3000
```

### 2. Database Connection
```bash
# Verify database schema
npm run db:push

# Open database GUI
npm run db:studio
```

### 3. Test Suite
```bash
# Run all tests
npm test

# Should see: "Test Files X passed, Tests Y passed"
```

### 4. Manual Testing Checklist

#### Authentication
- [ ] Visit http://localhost:3000/auth/register
- [ ] Create a new account
- [ ] Sign in at http://localhost:3000/auth/signin
- [ ] Verify redirect to dashboard

#### Companies
- [ ] Navigate to Companies page
- [ ] Create a new company
- [ ] View company details
- [ ] Edit company information

#### Integrations
- [ ] Create a new integration
- [ ] Add checklist items
- [ ] View integration details
- [ ] Update integration status

#### Tasks
- [ ] Create a new task
- [ ] Filter tasks by status
- [ ] Update task status
- [ ] View task details

#### Notes
- [ ] Create a new note
- [ ] View note details
- [ ] Test shareable link
- [ ] Filter notes by type

#### Search
- [ ] Use search bar in navigation
- [ ] Search for companies
- [ ] Search for tasks
- [ ] Verify search results

#### Dashboard
- [ ] View dashboard stats
- [ ] Check quick actions
- [ ] Verify navigation works

### 5. API Endpoints Test

```bash
# After registering and logging in, test APIs:

# Get companies (requires auth)
curl http://localhost:3000/api/companies

# Get tasks
curl http://localhost:3000/api/tasks

# Search
curl "http://localhost:3000/api/search?q=test"
```

### 6. Common Issues & Fixes

**Issue**: Server won't start
- Check if port 3000 is in use: `lsof -ti:3000 | xargs kill`
- Verify Node.js version: `node --version` (should be 18+)
- Check dependencies: `npm install`

**Issue**: Database connection errors
- Verify PostgreSQL is running: `pg_isready`
- Check `.env` file has correct DATABASE_URL
- Try: `npm run db:push`

**Issue**: Authentication not working
- Check NEXTAUTH_SECRET is set in `.env`
- Verify NEXTAUTH_URL matches your local URL
- Clear browser cookies and try again

**Issue**: Build errors
- Run `npm run db:generate`
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### 7. Performance Check

```bash
# Build for production (tests build process)
npm run build

# Should complete without errors
```

### 8. Browser Console Check

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify no 401/403/500 errors

## Expected Behavior

✅ All pages load without errors
✅ Navigation works smoothly
✅ Forms submit successfully
✅ Data persists after refresh
✅ Search returns results
✅ Authentication redirects correctly
✅ All tests pass

## Next Steps After Verification

1. ✅ Everything works → Ready for development/deployment
2. ❌ Issues found → Check error logs and fix
3. 🚀 Ready to deploy → See DEPLOYMENT.md

