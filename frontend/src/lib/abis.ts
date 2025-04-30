import { ethers } from 'ethers';
import { USDT_ADDRESS } from './constants';

// ABI for ERC20 token (USDT)
export const ERC20_ABI = [
  // Read-only functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  
  // Write functions
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// ABI for LotteryManager contract
export const LOTTERY_MANAGER_ABI = [
  "function subscribe(uint8 lotteryType, uint256 ticketCount) external",
  "function updateSubscription(uint8 lotteryType, uint256 newTicketCount) external",
  "function cancelSubscription(uint8 lotteryType) external",
  "function drawLottery(uint256 lotteryId) external",
  "function getCurrentLotteryInfo(uint8 lotteryType) external view returns (uint256 id, uint256 drawTime, uint256 prizePool)",
  "function getUserSubscription(address user, uint8 lotteryType) external view returns (bool isActive, uint256 ticketCount, uint256 lastPaymentTime)",
  "function getUserTickets(address user, uint256 lotteryId) external view returns (uint256 ticketCount)"
];

// ABI for DuelGame contract
export const DUEL_GAME_ABI = [
  "function createFixedDuel(uint256 betAmountIndex) external",
  "function createCustomDuel(uint256 betAmount) external",
  "function joinDuel(uint256 duelId) external",
  "function cancelDuel(uint256 duelId) external",
  "function getOpenDuels() external view returns (uint256[] memory)",
  "function getDuelDetails(uint256 duelId) external view returns (address creator, uint256 betAmount, address challenger, bool isComplete, address winner, bool isCustom)"
];

// ABI for QuickDraw contract
export const QUICK_DRAW_ABI = [
  "function joinGame(uint8 gameType, uint256 betAmount) external",
  "function getOpenGames(uint8 gameType, uint256 betAmount) external view returns (uint256[] memory)",
  "function getGameDetails(uint256 gameId) external view returns (uint8 gameType, uint256 betAmount, address[] memory players, bool isComplete, address winner, uint256 prizePool)"
];

// ABI for HostManager contract
export const HOST_MANAGER_ABI = [
  "function createGame(uint8 gameType, uint256 entryAmount, uint256 playerLimit, uint8 accessType) external",
  "function allowPlayer(uint256 gameId, address player) external",
  "function joinGame(uint256 gameId) external",
  "function drawLottery(uint256 gameId) external",
  "function getPublicGames() external view returns (uint256[] memory)",
  "function getHostGames(address host) external view returns (uint256[] memory)",
  "function getGameDetails(uint256 gameId) external view returns (uint8 gameType, address host, uint256 entryAmount, uint256 playerLimit, uint8 accessType, address[] memory players, bool isComplete, address winner, uint256 prizePool)",
  "function isPlayerAllowed(uint256 gameId, address player) external view returns (bool)"
];

// ABI for PaymentProcessor contract
export const PAYMENT_PROCESSOR_ABI = [
  "function approveContracts(uint256 amount) external",
  "function getAllowances(address user) external view returns (uint256 lotteryAllowance, uint256 duelAllowance, uint256 quickDrawAllowance, uint256 hostAllowance)"
];
