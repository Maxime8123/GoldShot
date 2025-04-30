# Vercel Deployment Guide for GoldShot

This guide will walk you through deploying the GoldShot platform to Vercel.

## Prerequisites

1. A Vercel account (create one at https://vercel.com if you don't have one)
2. Git repository with your GoldShot code (optional but recommended)

## Option 1: Deploy via Vercel Dashboard

1. Log in to your Vercel account at https://vercel.com
2. Click "Add New..." and select "Project"
3. Import your Git repository or upload the project files
4. Configure the project settings:
   - Framework Preset: Next.js
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: .next
5. Add the following environment variables:
   - NEXT_PUBLIC_THIRDWEB_CLIENT_ID: f5408bfc2c3cfab3ae25f88b7ffe1f25
   - NEXT_PUBLIC_THIRDWEB_SECRET_KEY: 8nDPqjZDbwFxkcvYEjGxPcq9ovyYquXSt7GTZFiocUcuMM52XVVi9WKx1fiWFBOj2eGsLK7BYZeRrvEa1ZgO5A
   - NEXT_PUBLIC_PLATFORM_WALLET: 0x45fe416F294Eb17E9D04a6BF169Eb946D7a77A79
6. Click "Deploy"

## Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Navigate to the project directory:
   ```
   cd crypto-lottery-app
   ```

3. Log in to Vercel:
   ```
   vercel login
   ```

4. Deploy the project:
   ```
   vercel
   ```

5. Follow the prompts and configure:
   - Set the root directory to "frontend"
   - Add the environment variables as listed above

## After Deployment

Once deployed, you'll receive a URL for your GoldShot platform. You can:

1. Connect your wallet to test the platform
2. Try the lottery subscription feature
3. Create or join duel games
4. Participate in quick draw games
5. Host your own custom games

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs in the Vercel dashboard
2. Verify that all environment variables are correctly set
3. Ensure your Thirdweb credentials are valid

For any additional help, please reach out for support.
