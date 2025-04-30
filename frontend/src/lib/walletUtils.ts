import { truncateAddress } from './utils';
import { ethers } from 'ethers';

// Helper functions for wallet-related operations

/**
 * Formats an Ethereum address for display
 * @param address The full Ethereum address
 * @param start Number of characters to show at start
 * @param end Number of characters to show at end
 * @returns Formatted address string
 */
export const formatAddress = (address: string, start = 6, end = 4): string => {
  if (!address) return '';
  return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
};

/**
 * Gets the network name from chain ID
 * @param chainId The blockchain network chain ID
 * @returns Network name string
 */
export const getNetworkName = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 137:
      return 'Polygon Mainnet';
    case 80001:
      return 'Mumbai Testnet';
    default:
      return 'Unknown Network';
  }
};

/**
 * Checks if a wallet has sufficient balance for an action
 * @param balance The current balance in wei
 * @param requiredAmount The required amount in wei
 * @returns Boolean indicating if balance is sufficient
 */
export const hasSufficientBalance = (balance: ethers.BigNumber, requiredAmount: ethers.BigNumber): boolean => {
  if (!balance || !requiredAmount) return false;
  return balance.gte(requiredAmount);
};

/**
 * Formats a transaction hash for display
 * @param hash The transaction hash
 * @returns Formatted transaction hash
 */
export const formatTxHash = (hash: string): string => {
  if (!hash) return '';
  return truncateAddress(hash);
};

/**
 * Gets the explorer URL for a transaction
 * @param hash The transaction hash
 * @param chainId The blockchain network chain ID
 * @returns Explorer URL string
 */
export const getExplorerUrl = (hash: string, chainId: number): string => {
  if (!hash) return '';
  
  let baseUrl = '';
  switch (chainId) {
    case 1:
      baseUrl = 'https://etherscan.io';
      break;
    case 137:
      baseUrl = 'https://polygonscan.com';
      break;
    case 80001:
      baseUrl = 'https://mumbai.polygonscan.com';
      break;
    default:
      return '';
  }
  
  return `${baseUrl}/tx/${hash}`;
};

/**
 * Persists wallet connection in local storage
 * @param address The wallet address
 */
export const persistWalletConnection = (address: string): void => {
  if (!address) return;
  localStorage.setItem('walletConnected', 'true');
  localStorage.setItem('walletAddress', address);
};

/**
 * Clears persisted wallet connection from local storage
 */
export const clearWalletConnection = (): void => {
  localStorage.removeItem('walletConnected');
  localStorage.removeItem('walletAddress');
};

/**
 * Checks if a wallet was previously connected
 * @returns Boolean indicating if wallet was previously connected
 */
export const wasPreviouslyConnected = (): boolean => {
  return localStorage.getItem('walletConnected') === 'true';
};

/**
 * Gets the previously connected wallet address
 * @returns Previously connected wallet address or null
 */
export const getPreviousWalletAddress = (): string | null => {
  return localStorage.getItem('walletAddress');
};
