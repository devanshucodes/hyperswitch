#!/bin/bash

echo "🚀 Deploying Hyperswitch Payment Demo to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first:"
    vercel login
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your app will be available at the URL provided above"
echo "📝 Don't forget to set environment variables in Vercel dashboard:"
echo "   - HYPERSWITCH_SECRET_KEY"
echo "   - HYPERSWITCH_PUBLISHABLE_KEY"
echo "   - HYPERSWITCH_BASE_URL"
echo "   - NODE_ENV"
