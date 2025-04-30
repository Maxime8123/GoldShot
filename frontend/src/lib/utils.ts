/**
 * Truncates an Ethereum address for display
 * @param address The full Ethereum address
 * @param start Number of characters to show at start
 * @param end Number of characters to show at end
 * @returns Truncated address string
 */
export const truncateAddress = (address: string, start = 6, end = 4): string => {
  if (!address) return '';
  return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
};

/**
 * Formats a number with commas
 * @param num The number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Formats a date to a readable string
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Formats a currency amount
 * @param amount The amount to format
 * @param currency The currency code
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

/**
 * Generates a random ID
 * @returns Random ID string
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Delays execution for a specified time
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Checks if a string is a valid URL
 * @param str The string to check
 * @returns Boolean indicating if string is a valid URL
 */
export const isValidUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Shortens a string to a specified length
 * @param str The string to shorten
 * @param maxLength Maximum length of the string
 * @returns Shortened string with ellipsis if needed
 */
export const shortenString = (str: string, maxLength = 50): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
};
