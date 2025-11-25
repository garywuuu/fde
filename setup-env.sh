#!/bin/bash

# Script to help set up environment variables for Vercel
# Usage: ./setup-env.sh

echo "🔧 Railway + Vercel Environment Setup"
echo "======================================"
echo ""

# Check if Railway is linked
if ! railway status &>/dev/null; then
  echo "❌ Railway project not linked. Run: railway link"
  exit 1
fi

echo "✅ Railway project is linked"
echo ""

# Get DATABASE_URL from Railway
echo "📦 Getting DATABASE_URL from Railway..."
DATABASE_URL=$(railway variables 2>/dev/null | grep "DATABASE_URL" | awk '{print $2}' || railway variables | grep -A 1 "DATABASE_URL" | tail -1 | xargs)

if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  Could not get DATABASE_URL automatically"
  echo "   Please get it manually from Railway dashboard:"
  echo "   1. Go to https://railway.app"
  echo "   2. Click on your PostgreSQL service"
  echo "   3. Go to Variables tab"
  echo "   4. Copy DATABASE_URL"
  echo ""
  read -p "Enter DATABASE_URL manually: " DATABASE_URL
fi

echo "✅ DATABASE_URL retrieved"
echo ""

# Generate NEXTAUTH_SECRET
echo "🔐 Generating NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "✅ NEXTAUTH_SECRET generated"
echo ""

# Get Vercel URL
echo "🌐 Enter your Vercel app URL"
echo "   (e.g., https://your-project-name.vercel.app)"
read -p "NEXTAUTH_URL: " NEXTAUTH_URL

echo ""
echo "======================================"
echo "📋 Environment Variables for Vercel"
echo "======================================"
echo ""
echo "Add these in Vercel Dashboard → Settings → Environment Variables:"
echo ""
echo "1. DATABASE_URL"
echo "   Value: $DATABASE_URL"
echo ""
echo "2. NEXTAUTH_URL"
echo "   Value: $NEXTAUTH_URL"
echo ""
echo "3. NEXTAUTH_SECRET"
echo "   Value: $NEXTAUTH_SECRET"
echo ""
echo "======================================"
echo ""
echo "💡 Tip: Select all environments (Production, Preview, Development)"
echo "   when adding these variables in Vercel."
echo ""
echo "📝 After adding variables, redeploy your Vercel project!"
echo ""

# Save to file for reference
cat > .env.production.example << EOF
# Production Environment Variables
# Add these to Vercel Dashboard → Settings → Environment Variables

DATABASE_URL="$DATABASE_URL"
NEXTAUTH_URL="$NEXTAUTH_URL"
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
EOF

echo "✅ Saved to .env.production.example (for reference only)"
echo "   ⚠️  Do NOT commit this file to git!"

