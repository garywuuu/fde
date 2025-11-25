#!/bin/bash

# Script to set up GitHub repository and push code
# Usage: ./setup-github.sh YOUR_GITHUB_USERNAME YOUR_REPO_NAME

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: ./setup-github.sh YOUR_GITHUB_USERNAME YOUR_REPO_NAME"
  echo "Example: ./setup-github.sh garywuuu fde-workflow-platform"
  exit 1
fi

GITHUB_USER=$1
REPO_NAME=$2

echo "🚀 Setting up GitHub repository..."
echo "Repository: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
  echo "⚠️  Remote 'origin' already exists. Removing it..."
  git remote remove origin
fi

# Add GitHub remote
echo "📦 Adding GitHub remote..."
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

# Push to GitHub
echo "⬆️  Pushing code to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully pushed to GitHub!"
  echo ""
  echo "Next steps:"
  echo "1. Go to https://railway.app and create a new project from GitHub"
  echo "2. Add PostgreSQL database in Railway"
  echo "3. Go to https://vercel.com and import your GitHub repository"
  echo "4. Add environment variables in Vercel (see DEPLOYMENT.md)"
  echo ""
else
  echo ""
  echo "❌ Failed to push. Make sure:"
  echo "1. The repository exists on GitHub"
  echo "2. You have push access"
  echo "3. You're authenticated (git credential helper or SSH keys)"
fi

