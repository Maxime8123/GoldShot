import { useState, useEffect } from 'react';
import { useUSDT } from './hooks';
import { MOONPAY_API_URL, RAMP_API_URL } from './constants';

// Types of fiat payment providers
export const PROVIDER_TYPES = {
  MOONPAY: 'moonpay',
  RAMP: 'ramp'
};

// Fiat payment service for Moonpay and Ramp integration
export const useFiatPayment = () => {
  const { formatUSDT, parseUSDT } = useUSDT();
  const [preferredProvider, setPreferredProvider] = useState(null);
  
  // Determine the best provider based on user's location
  useEffect(() => {
    const determinePreferredProvider = async () => {
      try {
        // Get user's country from IP (in a real implementation, this would call an API)
        // For now, we'll simulate this with a mock response
        const userCountry = 'US'; // Mock country code
        
        // Check provider availability for the user's country
        // In a real implementation, this would check against the providers' supported countries
        // For this demo, we'll use a simple logic
        if (['US', 'CA', 'GB', 'AU'].includes(userCountry)) {
          setPreferredProvider(PROVIDER_TYPES.MOONPAY as any);
        } else {
          setPreferredProvider(PROVIDER_TYPES.RAMP as any);
        }
      } catch (error) {
        console.error("Error determining preferred provider:", error);
        // Default to Moonpay if there's an error
        setPreferredProvider(PROVIDER_TYPES.MOONPAY as any);
      }
    };
    
    determinePreferredProvider();
  }, []);
  
  // Calculate subscription cost
  const calculateSubscriptionCost = (lotteryType: 'daily' | 'monthly' | 'yearly' | number, ticketCount: number) => {
    let dailyCost = 0;
    let monthlyCost = 0;
    let yearlyCost = 0;
    
    switch (lotteryType) {
      case 0: // Daily
        dailyCost = 1 * ticketCount;
        monthlyCost = dailyCost * 30;
        yearlyCost = dailyCost * 365;
        break;
      case 1: // Monthly
        monthlyCost = 20 * ticketCount;
        yearlyCost = monthlyCost * 12;
        break;
      case 2: // Yearly
        yearlyCost = 100 * ticketCount;
        break;
      default:
        break;
    }
    
    return {
      dailyCost,
      monthlyCost,
      yearlyCost
    };
  };
  
  // Generate Moonpay checkout URL
  const getMoonpayCheckoutUrl = (amount: number, currencyCode = 'usdt_polygon', returnUrl = window.location.href) => {
    // In a real implementation, this would include your Moonpay API key and signature
    // For this demo, we'll create a mock URL
    const baseUrl = 'https://buy.moonpay.com';
    const apiKey = 'pk_test_moonpay_api_key'; // Replace with your actual public key
    
    const params = new URLSearchParams({
      apiKey,
      currencyCode,
      baseCurrencyAmount: amount.toString(),
      returnUrl
    });
    
    return `${baseUrl}?${params.toString()}`;
  };
  
  // Generate Ramp checkout URL
  const getRampCheckoutUrl = (amount: number, currencyCode = 'USDT', network = 'polygon', returnUrl = window.location.href) => {
    // In a real implementation, this would include your Ramp API key
    // For this demo, we'll create a mock URL
    const baseUrl = 'https://buy.ramp.network';
    const apiKey = 'ramp_api_key'; // Replace with your actual API key
    
    const params = new URLSearchParams({
      hostApiKey: apiKey,
      swapAsset: `${currencyCode}_${network}`,
      swapAmount: amount.toString(),
      userAddress: 'USER_ADDRESS', // This would be dynamically set to the user's address
      finalUrl: returnUrl
    });
    
    return `${baseUrl}?${params.toString()}`;
  };
  
  // Get checkout URL based on preferred provider
  const getCheckoutUrl = (amount: number, returnUrl: string) => {
    if (preferredProvider === PROVIDER_TYPES.MOONPAY) {
      return getMoonpayCheckoutUrl(amount, 'usdt_polygon', returnUrl);
    } else {
      return getRampCheckoutUrl(amount, 'USDT', 'polygon', returnUrl);
    }
  };
  
  // Open checkout in a new window
  const openCheckout = (amount: number, returnUrl: string) => {
    const checkoutUrl = getCheckoutUrl(amount, returnUrl);
    window.open(checkoutUrl, '_blank', 'width=500,height=800');
  };
  
  // Calculate bundle options for prepaid subscriptions
  const calculateBundleOptions = (lotteryType: 'daily' | 'monthly' | 'yearly' | number, ticketCount: number) => {
    const costs = calculateSubscriptionCost(lotteryType, ticketCount);
    
    let options: {name: string; description: string; amount: number}[] = [];
    
    switch (lotteryType) {
      case 0: // Daily
        options = [
          { name: '1 Week', amount: costs.dailyCost * 7, description: `${ticketCount} ticket(s) daily for 1 week` },
          { name: '1 Month', amount: costs.monthlyCost, description: `${ticketCount} ticket(s) daily for 1 month` },
          { name: '3 Months', amount: costs.monthlyCost * 3, description: `${ticketCount} ticket(s) daily for 3 months` }
        ];
        break;
      case 1: // Monthly
        options = [
          { name: '1 Month', amount: costs.monthlyCost, description: `${ticketCount} ticket(s) for 1 monthly draw` },
          { name: '3 Months', amount: costs.monthlyCost * 3, description: `${ticketCount} ticket(s) for 3 monthly draws` },
          { name: '6 Months', amount: costs.monthlyCost * 6, description: `${ticketCount} ticket(s) for 6 monthly draws` }
        ];
        break;
      case 2: // Yearly
        options = [
          { name: '1 Year', amount: costs.yearlyCost, description: `${ticketCount} ticket(s) for 1 yearly draw` }
        ];
        break;
      default:
        break;
    }
    
    return options;
  };
  
  return {
    preferredProvider,
    calculateSubscriptionCost,
    getCheckoutUrl,
    openCheckout,
    calculateBundleOptions
  };
};
