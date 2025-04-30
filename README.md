# Crypto Lottery Platform - README

## Overview

The Crypto Lottery Platform is a decentralized application that allows users to participate in various crypto lottery games using USDT on the Polygon network. The platform offers four main features:

1. **Lottery**: Daily, monthly, and yearly subscription-based lotteries
2. **Duel**: 1v1 games where players bet against each other
3. **Quick Draw**: 5 or 10-player games with one random winner
4. **Host**: Create and manage custom games with revenue sharing

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Blockchain**: Polygon (Mumbai Testnet for development, Mainnet for production)
- **Smart Contracts**: Solidity
- **Web3 Integration**: Thirdweb SDK
- **Payment**: USDT token, with fiat on-ramps via Moonpay and Ramp

## Project Structure

```
crypto-lottery-app/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and constants
│   │   └── providers/      # Context providers
│   ├── public/             # Static assets
│   ├── next.config.js      # Next.js configuration
│   └── package.json        # Frontend dependencies
├── contracts/              # Smart contracts
│   ├── src/                # Solidity source files
│   │   ├── LotteryManager.sol
│   │   ├── DuelGame.sol
│   │   ├── QuickDraw.sol
│   │   ├── HostManager.sol
│   │   └── PaymentProcessor.sol
│   └── README.md           # Smart contract documentation
├── docs/                   # Documentation
│   └── deployment-guide.md # Deployment instructions
├── vercel.json             # Vercel deployment configuration
└── README.md               # Project overview
```

## Features

### Lottery
- Daily lottery: $1 per ticket
- Monthly lottery: $20 per ticket
- Yearly lottery: $100 per ticket
- 50% of the prize pool goes to the winner, 50% to the platform

### Duel
- 1v1 games with fixed or custom bet amounts
- 90% of the pot goes to the winner, 10% to the platform
- Fixed bet options: $10, $20, $50, $100, $200, $500, $1000

### Quick Draw
- 5 or 10-player games with equal stakes
- One random winner takes 90% of the pot, 10% goes to the platform

### Host
- Create custom games with your own rules
- Public or private access
- Revenue sharing: 
  - Lottery: 50% winner, 25% platform, 25% host
  - Duel/QuickDraw: 90% winner, 5% platform, 5% host

## Wallet Integration

- Connect with MetaMask, Phantom, or WalletConnect
- Automatic network detection and switching
- Low balance warnings
- Transaction notifications
- Wallet connection persistence

## Payment Options

- USDT on Polygon network
- Fiat on-ramps via Moonpay and Ramp
- Location-optimized provider selection
- Subscription management for recurring payments

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- MetaMask or compatible wallet

### Local Development
1. Clone the repository
2. Install dependencies:
   ```
   cd crypto-lottery-app/frontend
   npm install
   ```
3. Create a `.env.local` file with required environment variables
4. Start the development server:
   ```
   npm run dev
   ```
5. Open http://localhost:3000 in your browser

### Deployment
See the [Deployment Guide](./docs/deployment-guide.md) for instructions on deploying to Vercel.

## Smart Contracts

The platform uses five main smart contracts:

1. **LotteryManager**: Handles subscription-based lotteries
2. **DuelGame**: Manages 1v1 betting games
3. **QuickDraw**: Handles 5 or 10-player games
4. **HostManager**: Allows users to create and host custom games
5. **PaymentProcessor**: Manages USDT payments and contract interactions

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
