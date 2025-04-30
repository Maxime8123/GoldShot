// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@thirdweb-dev/contracts/base/ERC20Base.sol";
import "@thirdweb-dev/contracts/extension/PermissionsEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title LotteryManager
 * @dev Manages daily, monthly, and yearly lotteries with subscription-based entry
 */
contract LotteryManager is PermissionsEnumerable, ReentrancyGuard {
    using SafeMath for uint256;

    // USDT token contract on Polygon
    IERC20 public usdtToken;
    
    // Owner wallet to receive platform fees
    address public platformWallet;
    
    // Lottery types
    enum LotteryType { DAILY, MONTHLY, YEARLY }
    
    // Lottery prices in USDT (with 6 decimals)
    uint256 public constant DAILY_PRICE = 1 * 10**6;    // $1
    uint256 public constant MONTHLY_PRICE = 20 * 10**6; // $20
    uint256 public constant YEARLY_PRICE = 100 * 10**6; // $100
    
    // Lottery state
    struct Lottery {
        uint256 id;
        LotteryType lotteryType;
        uint256 drawTime;
        uint256 prizePool;
        bool drawn;
        address winner;
    }
    
    // User subscription
    struct Subscription {
        bool isActive;
        uint256 ticketCount;
        uint256 lastPaymentTime;
    }
    
    // Mapping of lottery ID to Lottery
    mapping(uint256 => Lottery) public lotteries;
    
    // Mapping of lottery type to current lottery ID
    mapping(LotteryType => uint256) public currentLotteryIds;
    
    // Mapping of lottery ID to participant addresses
    mapping(uint256 => address[]) public lotteryParticipants;
    
    // Mapping of lottery ID to participant ticket counts
    mapping(uint256 => mapping(address => uint256)) public participantTickets;
    
    // Mapping of user address to subscription for each lottery type
    mapping(address => mapping(LotteryType => Subscription)) public userSubscriptions;
    
    // Events
    event LotteryCreated(uint256 indexed lotteryId, LotteryType lotteryType, uint256 drawTime);
    event TicketsPurchased(address indexed user, uint256 indexed lotteryId, uint256 ticketCount);
    event SubscriptionUpdated(address indexed user, LotteryType lotteryType, uint256 ticketCount);
    event LotteryDrawn(uint256 indexed lotteryId, address winner, uint256 prizeAmount);
    
    /**
     * @dev Constructor sets the USDT token address and platform wallet
     * @param _usdtToken Address of the USDT token contract on Polygon
     * @param _platformWallet Address of the platform wallet to receive fees
     */
    constructor(address _usdtToken, address _platformWallet) {
        usdtToken = IERC20(_usdtToken);
        platformWallet = _platformWallet;
        
        // Initialize lotteries
        _initializeLotteries();
        
        // Set up permissions
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Initialize the first lottery of each type
     */
    function _initializeLotteries() internal {
        // Create first daily lottery
        uint256 dailyDrawTime = block.timestamp + 1 days;
        _createNewLottery(LotteryType.DAILY, dailyDrawTime);
        
        // Create first monthly lottery
        uint256 monthlyDrawTime = block.timestamp + 30 days;
        _createNewLottery(LotteryType.MONTHLY, monthlyDrawTime);
        
        // Create first yearly lottery
        uint256 yearlyDrawTime = block.timestamp + 365 days;
        _createNewLottery(LotteryType.YEARLY, yearlyDrawTime);
    }
    
    /**
     * @dev Create a new lottery
     * @param lotteryType Type of lottery (DAILY, MONTHLY, YEARLY)
     * @param drawTime Timestamp when the lottery will be drawn
     */
    function _createNewLottery(LotteryType lotteryType, uint256 drawTime) internal {
        uint256 newLotteryId = currentLotteryIds[lotteryType] + 1;
        
        lotteries[newLotteryId] = Lottery({
            id: newLotteryId,
            lotteryType: lotteryType,
            drawTime: drawTime,
            prizePool: 0,
            drawn: false,
            winner: address(0)
        });
        
        currentLotteryIds[lotteryType] = newLotteryId;
        
        emit LotteryCreated(newLotteryId, lotteryType, drawTime);
    }
    
    /**
     * @dev Subscribe to a lottery type
     * @param lotteryType Type of lottery to subscribe to
     * @param ticketCount Number of tickets to purchase per period
     */
    function subscribe(LotteryType lotteryType, uint256 ticketCount) external nonReentrant {
        require(ticketCount > 0, "Must subscribe to at least 1 ticket");
        
        // Get the current lottery ID for this type
        uint256 currentLotteryId = currentLotteryIds[lotteryType];
        
        // Calculate payment amount based on lottery type and ticket count
        uint256 paymentAmount;
        if (lotteryType == LotteryType.DAILY) {
            paymentAmount = DAILY_PRICE.mul(ticketCount);
        } else if (lotteryType == LotteryType.MONTHLY) {
            paymentAmount = MONTHLY_PRICE.mul(ticketCount);
        } else {
            paymentAmount = YEARLY_PRICE.mul(ticketCount);
        }
        
        // Transfer USDT from user to contract
        require(usdtToken.transferFrom(msg.sender, address(this), paymentAmount), "USDT transfer failed");
        
        // Update subscription
        userSubscriptions[msg.sender][lotteryType] = Subscription({
            isActive: true,
            ticketCount: ticketCount,
            lastPaymentTime: block.timestamp
        });
        
        // Add tickets to current lottery
        participantTickets[currentLotteryId][msg.sender] += ticketCount;
        
        // Add participant to lottery if first time
        if (participantTickets[currentLotteryId][msg.sender] == ticketCount) {
            lotteryParticipants[currentLotteryId].push(msg.sender);
        }
        
        // Update prize pool
        lotteries[currentLotteryId].prizePool += paymentAmount / 2; // 50% to prize pool
        
        // Send 50% to platform wallet
        require(usdtToken.transfer(platformWallet, paymentAmount / 2), "Platform fee transfer failed");
        
        emit SubscriptionUpdated(msg.sender, lotteryType, ticketCount);
        emit TicketsPurchased(msg.sender, currentLotteryId, ticketCount);
    }
    
    /**
     * @dev Update subscription ticket count
     * @param lotteryType Type of lottery subscription to update
     * @param newTicketCount New number of tickets to purchase per period
     */
    function updateSubscription(LotteryType lotteryType, uint256 newTicketCount) external {
        require(userSubscriptions[msg.sender][lotteryType].isActive, "No active subscription");
        
        userSubscriptions[msg.sender][lotteryType].ticketCount = newTicketCount;
        
        emit SubscriptionUpdated(msg.sender, lotteryType, newTicketCount);
    }
    
    /**
     * @dev Cancel subscription
     * @param lotteryType Type of lottery subscription to cancel
     */
    function cancelSubscription(LotteryType lotteryType) external {
        require(userSubscriptions[msg.sender][lotteryType].isActive, "No active subscription");
        
        userSubscriptions[msg.sender][lotteryType].isActive = false;
        
        emit SubscriptionUpdated(msg.sender, lotteryType, 0);
    }
    
    /**
     * @dev Draw a lottery and select a winner
     * @param lotteryId ID of the lottery to draw
     */
    function drawLottery(uint256 lotteryId) external nonReentrant {
        Lottery storage lottery = lotteries[lotteryId];
        
        require(!lottery.drawn, "Lottery already drawn");
        require(block.timestamp >= lottery.drawTime, "Draw time not reached");
        
        address[] memory participants = lotteryParticipants[lotteryId];
        require(participants.length > 0, "No participants");
        
        // Create a new lottery of the same type
        uint256 nextDrawTime;
        if (lottery.lotteryType == LotteryType.DAILY) {
            nextDrawTime = lottery.drawTime + 1 days;
        } else if (lottery.lotteryType == LotteryType.MONTHLY) {
            nextDrawTime = lottery.drawTime + 30 days;
        } else {
            nextDrawTime = lottery.drawTime + 365 days;
        }
        
        _createNewLottery(lottery.lotteryType, nextDrawTime);
        
        // Select winner using a pseudo-random mechanism
        // In production, this should use a verifiable random function or oracle
        uint256 totalTickets = 0;
        for (uint256 i = 0; i < participants.length; i++) {
            totalTickets += participantTickets[lotteryId][participants[i]];
        }
        
        require(totalTickets > 0, "No tickets purchased");
        
        // Generate random index based on block data
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            blockhash(block.number - 1),
            lotteryId
        ))) % totalTickets;
        
        // Find the winner based on ticket distribution
        address winner;
        uint256 ticketCounter = 0;
        
        for (uint256 i = 0; i < participants.length; i++) {
            address participant = participants[i];
            uint256 participantTicketCount = participantTickets[lotteryId][participant];
            
            if (randomIndex >= ticketCounter && randomIndex < ticketCounter + participantTicketCount) {
                winner = participant;
                break;
            }
            
            ticketCounter += participantTicketCount;
        }
        
        // Mark lottery as drawn and set winner
        lottery.drawn = true;
        lottery.winner = winner;
        
        // Transfer prize to winner
        uint256 prizeAmount = lottery.prizePool;
        require(usdtToken.transfer(winner, prizeAmount), "Prize transfer failed");
        
        emit LotteryDrawn(lotteryId, winner, prizeAmount);
        
        // Process subscriptions for next lottery
        _processSubscriptions(lottery.lotteryType);
    }
    
    /**
     * @dev Process subscriptions for the next lottery
     * @param lotteryType Type of lottery to process subscriptions for
     */
    function _processSubscriptions(LotteryType lotteryType) internal {
        uint256 nextLotteryId = currentLotteryIds[lotteryType];
        
        // Get previous lottery participants
        uint256 prevLotteryId = nextLotteryId - 1;
        address[] memory prevParticipants = lotteryParticipants[prevLotteryId];
        
        for (uint256 i = 0; i < prevParticipants.length; i++) {
            address participant = prevParticipants[i];
            Subscription storage sub = userSubscriptions[participant][lotteryType];
            
            if (sub.isActive && sub.ticketCount > 0) {
                // Calculate payment amount
                uint256 paymentAmount;
                if (lotteryType == LotteryType.DAILY) {
                    paymentAmount = DAILY_PRICE.mul(sub.ticketCount);
                } else if (lotteryType == LotteryType.MONTHLY) {
                    paymentAmount = MONTHLY_PRICE.mul(sub.ticketCount);
                } else {
                    paymentAmount = YEARLY_PRICE.mul(sub.ticketCount);
                }
                
                // Try to transfer USDT from user to contract
                if (usdtToken.balanceOf(participant) >= paymentAmount &&
                    usdtToken.allowance(participant, address(this)) >= paymentAmount) {
                    
                    bool success = usdtToken.transferFrom(participant, address(this), paymentAmount);
                    
                    if (success) {
                        // Update subscription
                        sub.lastPaymentTime = block.timestamp;
                        
                        // Add tickets to next lottery
                        participantTickets[nextLotteryId][participant] += sub.ticketCount;
                        
                        // Add participant to lottery if first time
                        if (participantTickets[nextLotteryId][participant] == sub.ticketCount) {
                            lotteryParticipants[nextLotteryId].push(participant);
                        }
                        
                        // Update prize pool
                        lotteries[nextLotteryId].prizePool += paymentAmount / 2; // 50% to prize pool
                        
                        // Send 50% to platform wallet
                        usdtToken.transfer(platformWallet, paymentAmount / 2);
                        
                        emit TicketsPurchased(participant, nextLotteryId, sub.ticketCount);
                    }
                }
            }
        }
    }
    
    /**
     * @dev Get current lottery info
     * @param lotteryType Type of lottery
     * @return id Lottery ID
     * @return drawTime Time when lottery will be drawn
     * @return prizePool Current prize pool amount
     */
    function getCurrentLotteryInfo(LotteryType lotteryType) external view returns (
        uint256 id,
        uint256 drawTime,
        uint256 prizePool
    ) {
        uint256 lotteryId = currentLotteryIds[lotteryType];
        Lottery storage lottery = lotteries[lotteryId];
        
        return (
            lottery.id,
            lottery.drawTime,
            lottery.prizePool
        );
    }
    
    /**
     * @dev Get user subscription info
     * @param user Address of the user
     * @param lotteryType Type of lottery
     * @return isActive Whether subscription is active
     * @return ticketCount Number of tickets per period
     * @return lastPaymentTime Timestamp of last payment
     */
    function getUserSubscription(address user, LotteryType lotteryType) external view returns (
        bool isActive,
        uint256 ticketCount,
        uint256 lastPaymentTime
    ) {
        Subscription storage sub = userSubscriptions[user][lotteryType];
        
        return (
            sub.isActive,
            sub.ticketCount,
            sub.lastPaymentTime
        );
    }
    
    /**
     * @dev Get user tickets for a specific lottery
     * @param user Address of the user
     * @param lotteryId ID of the lottery
     * @return ticketCount Number of tickets owned by user
     */
    function getUserTickets(address user, uint256 lotteryId) external view returns (uint256 ticketCount) {
        return participantTickets[lotteryId][user];
    }
    
    /**
     * @dev Update platform wallet address
     * @param newPlatformWallet New platform wallet address
     */
    function updatePlatformWallet(address newPlatformWallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newPlatformWallet != address(0), "Invalid address");
        platformWallet = newPlatformWallet;
    }
}
