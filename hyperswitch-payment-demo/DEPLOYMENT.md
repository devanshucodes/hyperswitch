# 🚀 Vercel Deployment Guide

## Prerequisites
- Vercel account (free at vercel.com)
- GitHub account
- Hyperswitch API keys

## Step 1: Prepare Repository
1. Push your code to GitHub
2. Make sure all files are committed

## Step 2: Deploy to Vercel

### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? hyperswitch-payment-demo
# - Directory? ./
```

### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub
4. Select your repository
5. Configure environment variables
6. Deploy

## Step 3: Environment Variables
In Vercel dashboard, add these environment variables:

```
HYPERSWITCH_SECRET_KEY=your_actual_secret_key
HYPERSWITCH_PUBLISHABLE_KEY=your_actual_publishable_key
HYPERSWITCH_BASE_URL=https://sandbox.hyperswitch.io
NODE_ENV=production
PORT=3000
```

## Step 4: Test Deployment
1. Visit your Vercel URL
2. Test payment flow
3. Verify all endpoints work

## Project Structure for Vercel
```
hyperswitch-payment-demo/
├── src/
│   └── server.js          # Main server file
├── public/                # Static files
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies
└── README.md
```

## Important Notes
- ✅ No build step required (Node.js app)
- ✅ Environment variables must be set in Vercel dashboard
- ✅ API keys should be kept secure
- ✅ Free tier supports custom domains
