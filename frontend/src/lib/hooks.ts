import { ethers } from 'ethers';
import { useAddress, useContract, useContractRead, useContractWrite, useSDK } from '@thirdweb-dev/react';
import { 
  USDT_ADDRESS, 
  LOTTERY_MANAGER_ADDRESS, 
  DUEL_GAME_ADDRESS, 
  QUICK_DRAW_ADDRESS, 
  HOST_MANAGER_ADDRESS,
  PAYMENT_PROCESSOR_ADDRESS
} from './constants';
import { 
  ERC20_ABI, 
  LOTTERY_MANAGER_ABI, 
  DUEL_GAME_ABI, 
  QUICK_DRAW_ABI, 
  HOST_MANAGER_ABI,
  PAYMENT_PROCESSOR_ABI
} from './abis';

// Hook for USDT token interactions
export function useUSDT() {
  const sdk = useSDK();
  const address = useAddress();
  
  const { contract: usdtContract } = useContract(USDT_ADDRESS, ERC20_ABI);
  
  // Get USDT balance
  const { data: balance, isLoading: isBalanceLoading, refetch: refetchBalance } = useContractRead(
    usdtContract,
    "balanceOf",
    [address]
  );
  
  // Approve USDT spending
  const { mutateAsync: approve, isLoading: isApproving } = useContractWrite(
    usdtContract,
    "approve"
  );
  
  // Format USDT amount (6 decimals)
  const formatUSDT = (amount: any) => {
    if (!amount) return "0";
    return ethers.utils.formatUnits(amount, 6);
  };
  
  // Parse USDT amount (6 decimals)
  const parseUSDT = (amount: number | string) => {
    return ethers.utils.parseUnits(amount.toString(), 6);
  };
  
  // Check if USDT balance is low (less than threshold)
  const isBalanceLow = (threshold: number) => {
    if (!balance) return true;
    return parseFloat(formatUSDT(balance)) < threshold;
  };
  
  return {
    usdtContract,
    balance,
    isBalanceLoading,
    refetchBalance,
    approve,
    isApproving,
    formatUSDT,
    parseUSDT,
    isBalanceLow
  };
}

// Hook for Lottery interactions
export function useLottery() {
  const address = useAddress();
  const { usdtContract, approve, parseUSDT } = useUSDT();
  
  const { contract: lotteryContract } = useContract(LOTTERY_MANAGER_ADDRESS, LOTTERY_MANAGER_ABI);
  
  // Subscribe to lottery
  const { mutateAsync: subscribe, isLoading: isSubscribing } = useContractWrite(
    lotteryContract,
    "subscribe"
  );
  
  // Update subscription
  const { mutateAsync: updateSubscription, isLoading: isUpdating } = useContractWrite(
    lotteryContract,
    "updateSubscription"
  );
  
  // Cancel subscription
  const { mutateAsync: cancelSubscription, isLoading: isCancelling } = useContractWrite(
    lotteryContract,
    "cancelSubscription"
  );
  
  // Get current lottery info
  const getLotteryInfo = async (lotteryType: number) => {
    try {
      const info = await lotteryContract.call("getCurrentLotteryInfo", [lotteryType]);
      return {
        id: info[0].toNumber(),
        drawTime: new Date(info[1].toNumber() * 1000),
        prizePool: info[2]
      };
    } catch (error) {
      console.error("Error getting lottery info:", error);
      return null;
    }
  };
  
  // Get user subscription
  const getUserSubscription = async (lotteryType: number) => {
    if (!address) return null;
    
    try {
      const subscription = await lotteryContract.call("getUserSubscription", [address, lotteryType]);
      return {
        isActive: subscription[0],
        ticketCount: subscription[1].toNumber(),
        lastPaymentTime: new Date(subscription[2].toNumber() * 1000)
      };
    } catch (error) {
      console.error("Error getting user subscription:", error);
      return null;
    }
  };
  
  // Subscribe to lottery with approval
  const subscribeWithApproval = async (lotteryType: number, ticketCount: number, price: number) => {
    if (!address) throw new Error("Wallet not connected");
    
    try {
      // Calculate total cost
      const totalCost = parseUSDT(price * ticketCount);
      
      // Approve USDT spending
      const approvalTx = await approve({
        args: [LOTTERY_MANAGER_ADDRESS, totalCost]
      });
      
      // Wait for approval to be mined
      await approvalTx.wait();
      
      // Subscribe to lottery
      const subscribeTx = await subscribe({
        args: [lotteryType, ticketCount]
      });
      
      return subscribeTx;
    } catch (error) {
      console.error("Error subscribing to lottery:", error);
      throw error;
    }
  };
  
  return {
    lotteryContract,
    subscribe,
    isSubscribing,
    updateSubscription,
    isUpdating,
    cancelSubscription,
    isCancelling,
    getLotteryInfo,
    getUserSubscription,
    subscribeWithApproval
  };
}

// Hook for Duel interactions
export function useDuel() {
  const address = useAddress();
  const { usdtContract, approve, parseUSDT } = useUSDT();
  
  const { contract: duelContract } = useContract(DUEL_GAME_ADDRESS, DUEL_GAME_ABI);
  
  // Create fixed duel
  const { mutateAsync: createFixedDuel, isLoading: isCreatingFixed } = useContractWrite(
    duelContract,
    "createFixedDuel"
  );
  
  // Create custom duel
  const { mutateAsync: createCustomDuel, isLoading: isCreatingCustom } = useContractWrite(
    duelContract,
    "createCustomDuel"
  );
  
  // Join duel
  const { mutateAsync: joinDuel, isLoading: isJoining } = useContractWrite(
    duelContract,
    "joinDuel"
  );
  
  // Cancel duel
  const { mutateAsync: cancelDuel, isLoading: isCancelling } = useContractWrite(
    duelContract,
    "cancelDuel"
  );
  
  // Get open duels
  const getOpenDuels = async (): Promise<any[]> => {
    try {
      const duelIds = await duelContract.call("getOpenDuels");
      
      // Get details for each duel
      const duels = await Promise.all(
        duelIds.map(async (id) => {
          const details = await duelContract.call("getDuelDetails", [id]);
          return {
            id: id.toNumber(),
            creator: details[0],
            betAmount: details[1],
            challenger: details[2],
            isComplete: details[3],
            winner: details[4],
            isCustom: details[5]
          };
        })
      );
      
      return duels;
    } catch (error) {
      console.error("Error getting open duels:", error);
      return [];
    }
  };
  
  // Create duel with approval
  const createDuelWithApproval = async (isCustom: boolean, betAmount: number, betAmountIndex: number) => {
    if (!address) throw new Error("Wallet not connected");
    
    try {
      // Parse bet amount
      const parsedBetAmount = parseUSDT(betAmount);
      
      // Approve USDT spending
      const approvalTx = await approve({
        args: [DUEL_GAME_ADDRESS, parsedBetAmount]
      });
      
      // Wait for approval to be mined
      await approvalTx.wait();
      
      // Create duel
      if (isCustom) {
        const createTx = await createCustomDuel({
          args: [parsedBetAmount]
        });
        return createTx;
      } else {
        const createTx = await createFixedDuel({
          args: [betAmountIndex]
        });
        return createTx;
      }
    } catch (error) {
      console.error("Error creating duel:", error);
      throw error;
    }
  };
  
  // Join duel with approval
  const joinDuelWithApproval = async (duelId: number, betAmount: number) => {
    if (!address) throw new Error("Wallet not connected");
    
    try {
      // Parse bet amount
      const parsedBetAmount = parseUSDT(betAmount);
      
      // Approve USDT spending
      const approvalTx = await approve({
        args: [DUEL_GAME_ADDRESS, parsedBetAmount]
      });
      
      // Wait for approval to be mined
      await approvalTx.wait();
      
      // Join duel
      const joinTx = await joinDuel({
        args: [duelId]
      });
      
      return joinTx;
    } catch (error) {
      console.error("Error joining duel:", error);
      throw error;
    }
  };
  
  return {
    duelContract,
    createFixedDuel,
    isCreatingFixed,
    createCustomDuel,
    isCreatingCustom,
    joinDuel,
    isJoining,
    cancelDuel,
    isCancelling,
    getOpenDuels,
    createDuelWithApproval,
    joinDuelWithApproval
  };
}

// Hook for QuickDraw interactions
export function useQuickDraw() {
  const address = useAddress();
  const { usdtContract, approve, parseUSDT } = useUSDT();
  
  const { contract: quickDrawContract } = useContract(QUICK_DRAW_ADDRESS, QUICK_DRAW_ABI);
  
  // Join game
  const { mutateAsync: joinGame, isLoading: isJoining } = useContractWrite(
    quickDrawContract,
    "joinGame"
  );
  
  // Get open games
  const getOpenGames = async (gameType: number, betAmount: number): Promise<any[]> => {
    try {
      const parsedBetAmount = parseUSDT(betAmount);
      const gameIds = await quickDrawContract.call("getOpenGames", [gameType, parsedBetAmount]);
      
      // Get details for each game
      const games = await Promise.all(
        gameIds.map(async (id) => {
          const details = await quickDrawContract.call("getGameDetails", [id]);
          return {
            id: id.toNumber(),
            gameType: details[0],
            betAmount: details[1],
            players: details[2],
            isComplete: details[3],
            winner: details[4],
            prizePool: details[5]
          };
        })
      );
      
      return games;
    } catch (error) {
      console.error("Error getting open games:", error);
      return [];
    }
  };
  
  // Join game with approval
  const joinGameWithApproval = async (gameType: number, betAmount: number) => {
    if (!address) throw new Error("Wallet not connected");
    
    try {
      // Parse bet amount
      const parsedBetAmount = parseUSDT(betAmount);
      
      // Approve USDT spending
      const approvalTx = await approve({
        args: [QUICK_DRAW_ADDRESS, parsedBetAmount]
      });
      
      // Wait for approval to be mined
      await approvalTx.wait();
      
      // Join game
      const joinTx = await joinGame({
        args: [gameType, parsedBetAmount]
      });
      
      return joinTx;
    } catch (error) {
      console.error("Error joining game:", error);
      throw error;
    }
  };
  
  return {
    quickDrawContract,
    joinGame,
    isJoining,
    getOpenGames,
    joinGameWithApproval
  };
}

// Hook for Host interactions
export function useHost() {
  const address = useAddress();
  const { usdtContract, approve, parseUSDT } = useUSDT();
  
  const { contract: hostContract } = useContract(HOST_MANAGER_ADDRESS, HOST_MANAGER_ABI);
  
  // Create game
  const { mutateAsync: createGame, isLoading: isCreating } = useContractWrite(
    hostContract,
    "createGame"
  );
  
  // Allow player
  const { mutateAsync: allowPlayer, isLoading: isAllowing } = useContractWrite(
    hostContract,
    "allowPlayer"
  );
  
  // Join game
  const { mutateAsync: joinGame, isLoading: isJoining } = useContractWrite(
    hostContract,
    "joinGame"
  );
  
  // Draw lottery
  const { mutateAsync: drawLottery, isLoading: isDrawing } = useContractWrite(
    hostContract,
    "drawLottery"
  );
  
  // Get public games
  const getPublicGames = async (): Promise<any[]> => {
    try {
      const gameIds = await hostContract.call("getPublicGames");
      
      // Get details for each game
      const games = await Promise.all(
        gameIds.map(async (id) => {
          const details = await hostContract.call("getGameDetails", [id]);
          return {
            id: id.toNumber(),
            gameType: details[0],
            host: details[1],
            entryAmount: details[2],
            playerLimit: details[3].toNumber(),
            accessType: details[4],
            players: details[5],
            isComplete: details[6],
            winner: details[7],
            prizePool: details[8]
          };
        })
      );
      
      return games;
    } catch (error) {
      console.error("Error getting public games:", error);
      return [];
    }
  };
  
  // Get host games
  const getHostGames = async (): Promise<any[]> => {
    if (!address) return [];
    
    try {
      const gameIds = await hostContract.call("getHostGames", [address]);
      
      // Get details for each game
      const games = await Promise.all(
        gameIds.map(async (id) => {
          const details = await hostContract.call("getGameDetails", [id]);
          return {
            id: id.toNumber(),
            gameType: details[0],
            host: details[1],
            entryAmount: details[2],
            playerLimit: details[3].toNumber(),
            accessType: details[4],
            players: details[5],
            isComplete: details[6],
            winner: details[7],
            prizePool: details[8]
          };
        })
      );
      
      return games;
    } catch (error) {
      console.error("Error getting host games:", error);
      return [];
    }
  };
  
  // Create game with approval
  const createGameWithApproval = async (gameType: number, entryAmount: number, playerLimit: number, accessType: number) => {
    if (!address) throw new Error("Wallet not connected");
    
    try {
      // Create game
      const createTx = await createGame({
        args: [gameType, parseUSDT(entryAmount), playerLimit, accessType]
      });
      
      return createTx;
    } catch (error) {
      console.error("Error creating game:", error);
      throw error;
    }
  };
  
  // Join game with approval
  const joinGameWithApproval = async (gameId: number, entryAmount: number) => {
    if (!address) throw new Error("Wallet not connected");
    
    try {
      // Parse entry amount
      const parsedEntryAmount = parseUSDT(entryAmount);
      
      // Approve USDT spending
      const approvalTx = await approve({
        args: [HOST_MANAGER_ADDRESS, parsedEntryAmount]
      });
      
      // Wait for approval to be mined
      await approvalTx.wait();
      
      // Join game
      const joinTx = await joinGame({
        args: [gameId]
      });
      
      return joinTx;
    } catch (error) {
      console.error("Error joining game:", error);
      throw error;
    }
  };
  
  return {
    hostContract,
    createGame,
    isCreating,
    allowPlayer,
    isAllowing,
    joinGame,
    isJoining,
    drawLottery,
    isDrawing,
    getPublicGames,
    getHostGames,
    createGameWithApproval,
    joinGameWithApproval
  };
}

// Hook for Payment Processor interactions
export function usePaymentProcessor() {
  const address = useAddress();
  
  const { contract: paymentProcessorContract } = useContract(PAYMENT_PROCESSOR_ADDRESS, PAYMENT_PROCESSOR_ABI);
  
  // Approve contracts
  const { mutateAsync: approveContracts, isLoading: isApproving } = useContractWrite(
    paymentProcessorContract,
    "approveContracts"
  );
  
  // Get allowances
  const getAllowances = async (): Promise<any | null> => {
    if (!address) return null;
    
    try {
      const allowances = await paymentProcessorContract.call("getAllowances", [address]);
      return {
        lotteryAllowance: allowances[0],
        duelAllowance: allowances[1],
        quickDrawAllowance: allowances[2],
        hostAllowance: allowances[3]
      };
    } catch (error) {
      console.error("Error getting allowances:", error);
      return null;
    }
  };
  
  // Approve all contracts with a large amount
  const approveAllContracts = async (amount: number) => {
    if (!address) throw new Error("Wallet not connected");
    
    try {
      const parsedAmount = ethers.utils.parseUnits(amount.toString(), 6);
      const approveTx = await approveContracts({
        args: [parsedAmount]
      });
      
      return approveTx;
    } catch (error) {
      console.error("Error approving contracts:", error);
      throw error;
    }
  };
  
  return {
    paymentProcessorContract,
    approveContracts,
    isApproving,
    getAllowances,
    approveAllContracts
  };
}
