// Network and contract constants

// Polygon Mumbai Testnet (for development)
export const TESTNET_CHAIN_ID = 80001;
export const TESTNET_USDT_ADDRESS = "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832"; // Mumbai Testnet USDT

// Polygon Mainnet (for production)
export const MAINNET_CHAIN_ID = 137;
export const MAINNET_USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // Polygon USDT

// Use testnet for development (will be switched to mainnet for production)
export const IS_PRODUCTION = false;
export const ACTIVE_CHAIN_ID = IS_PRODUCTION ? MAINNET_CHAIN_ID : TESTNET_CHAIN_ID;
export const USDT_ADDRESS = IS_PRODUCTION ? MAINNET_USDT_ADDRESS : TESTNET_USDT_ADDRESS;

// Contract addresses (will be updated after deployment)
export const LOTTERY_MANAGER_ADDRESS = "0x0000000000000000000000000000000000000000";
export const DUEL_GAME_ADDRESS = "0x0000000000000000000000000000000000000000";
export const QUICK_DRAW_ADDRESS = "0x0000000000000000000000000000000000000000";
export const HOST_MANAGER_ADDRESS = "0x0000000000000000000000000000000000000000";
export const PAYMENT_PROCESSOR_ADDRESS = "0x0000000000000000000000000000000000000000";

// Platform wallet address
export const PLATFORM_WALLET_ADDRESS = "0x45fe416F294Eb17E9D04a6BF169Eb946D7a77A79";

// Fiat payment providers
export const MOONPAY_API_URL = "https://api.moonpay.com";
export const RAMP_API_URL = "https://api.ramp.network";

// Lottery prices (in USD)
export const DAILY_LOTTERY_PRICE = 1;
export const MONTHLY_LOTTERY_PRICE = 20;
export const YEARLY_LOTTERY_PRICE = 100;

// Duel fixed bet amounts (in USD)
export const DUEL_BET_AMOUNTS = [10, 20, 50, 100, 200, 500, 1000];

// Fee percentages
export const LOTTERY_WINNER_PERCENT = 50;
export const LOTTERY_PLATFORM_PERCENT = 50;

export const DUEL_WINNER_PERCENT = 90;
export const DUEL_PLATFORM_PERCENT = 10;

export const QUICK_DRAW_WINNER_PERCENT = 90;
export const QUICK_DRAW_PLATFORM_PERCENT = 10;

export const HOSTED_LOTTERY_WINNER_PERCENT = 50;
export const HOSTED_LOTTERY_PLATFORM_PERCENT = 25;
export const HOSTED_LOTTERY_HOST_PERCENT = 25;

export const HOSTED_GAME_WINNER_PERCENT = 90;
export const HOSTED_GAME_PLATFORM_PERCENT = 5;
export const HOSTED_GAME_HOST_PERCENT = 5;
