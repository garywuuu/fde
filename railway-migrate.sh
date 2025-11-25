#!/bin/bash

# Script to run Prisma schema push on Railway
# Uses DATABASE_PUBLIC_URL for external connection

echo "🚀 Pushing Prisma schema to Railway database..."
echo ""

# Check if Railway is linked
if ! railway status &>/dev/null; then
  echo "❌ Railway project not linked. Run: railway link"
  exit 1
fi

echo "✅ Railway project linked"
echo ""

# Get DATABASE_PUBLIC_URL from Railway
echo "📦 Getting DATABASE_URL from Railway..."
PUBLIC_URL=$(railway variables --json 2>/dev/null | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('DATABASE_PUBLIC_URL', ''))" 2>/dev/null)

if [ -z "$PUBLIC_URL" ]; then
  echo "⚠️  Could not get DATABASE_PUBLIC_URL automatically"
  echo "   Using railway run instead..."
  railway run npx prisma db push --accept-data-loss
else
  # Add sslmode if not present
  if [[ "$PUBLIC_URL" != *"sslmode"* ]]; then
    PUBLIC_URL="${PUBLIC_URL}?sslmode=require"
  fi
  
  echo "✅ Using public DATABASE_URL"
  echo "📦 Pushing schema..."
  DATABASE_URL="$PUBLIC_URL" npx prisma db push --accept-data-loss
fi

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Schema pushed successfully!"
  echo ""
  echo "Next steps:"
  echo "1. Verify tables: DATABASE_URL=\"$PUBLIC_URL\" npx prisma studio"
  echo "2. Or check in Railway dashboard → PostgreSQL → Connect"
else
  echo ""
  echo "❌ Failed to push schema"
  echo ""
  echo "Troubleshooting:"
  echo "1. Check Railway PostgreSQL service is running"
  echo "2. Get DATABASE_PUBLIC_URL manually: railway variables"
  echo "3. Run manually: DATABASE_URL=\"<public-url>\" npx prisma db push --accept-data-loss"
  exit 1
fi

