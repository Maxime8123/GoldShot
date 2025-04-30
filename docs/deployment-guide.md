# Crypto Lottery Platform Deployment Guide

This document provides instructions for deploying the Crypto Lottery Platform to Vercel.

## Prerequisites

Before deploying, ensure you have:

1. A Vercel account
2. Access to the GitHub repository (if using GitHub integration)
3. Your Thirdweb API credentials
4. Smart contract addresses (after deploying the contracts)

## Deployment Options

### Option 1: Deploy from Vercel Dashboard

1. Log in to your Vercel account
2. Click "New Project"
3. Import your Git repository or upload the project files
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: frontend
   - Build Command: next build
   - Output Directory: .next
5. Add Environment Variables:
   - NEXT_PUBLIC_THIRDWEB_CLIENT_ID
   - NEXT_PUBLIC_THIRDWEB_SECRET_KEY (as a secret)
   - NEXT_PUBLIC_IS_PRODUCTION
   - NEXT_PUBLIC_ACTIVE_CHAIN_ID
   - NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS
   - Contract addresses (once deployed)
6. Click "Deploy"

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```
   vercel login
   ```

3. Navigate to the project directory:
   ```
   cd crypto-lottery-app
   ```

4. Deploy to Vercel:
   ```
   vercel
   ```

5. Follow the prompts to configure your project
   - Select your Vercel scope/account
   - Set the project name
   - Confirm the root directory as "frontend"
   - Override settings if needed

6. For production deployment:
   ```
   vercel --prod
   ```

## Environment Variables

Ensure these environment variables are set in your Vercel project:

```
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=f5408bfc2c3cfab3ae25f88b7ffe1f25
NEXT_PUBLIC_THIRDWEB_SECRET_KEY=********** (use Vercel secrets)
NEXT_PUBLIC_IS_PRODUCTION=false
NEXT_PUBLIC_ACTIVE_CHAIN_ID=80001
NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS=0x45fe416F294Eb17E9D04a6BF169Eb946D7a77A79
```

After deploying your smart contracts, update these variables:

```
NEXT_PUBLIC_LOTTERY_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_DUEL_GAME_ADDRESS=0x...
NEXT_PUBLIC_QUICK_DRAW_ADDRESS=0x...
NEXT_PUBLIC_HOST_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_PAYMENT_PROCESSOR_ADDRESS=0x...
```

## Going to Production

When ready to move to production:

1. Deploy smart contracts to Polygon Mainnet
2. Update environment variables:
   - NEXT_PUBLIC_IS_PRODUCTION=true
   - NEXT_PUBLIC_ACTIVE_CHAIN_ID=137
   - Update contract addresses to mainnet versions
3. Set up real API keys for Moonpay and Ramp
4. Redeploy the application

## Troubleshooting

- If you encounter build errors, check the Vercel build logs
- Ensure all dependencies are correctly installed
- Verify that environment variables are correctly set
- Check that smart contract addresses are correct for the selected network
