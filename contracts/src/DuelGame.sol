// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@thirdweb-dev/contracts/extension/PermissionsEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DuelGame
 * @dev Contract for 1v1 random winner games with fixed bet amounts
 */
contract DuelGame is PermissionsEnumerable, ReentrancyGuard {
    using SafeMath for uint256;

    // USDT token contract on Polygon
    IERC20 public usdtToken;
    
    // Owner wallet to receive platform fees
    address public platformWallet;
    
    // Duel state
    struct Duel {
        uint256 id;
        address creator;
        uint256 betAmount;
        address challenger;
        bool isComplete;
        address winner;
        bool isCustom;
    }
    
    // Fixed bet amounts in USDT (with 6 decimals)
    uint256[] public fixedBetAmounts = [
        10 * 10**6,   // $10
        20 * 10**6,   // $20
        50 * 10**6,   // $50
        100 * 10**6,  // $100
        200 * 10**6,  // $200
        500 * 10**6,  // $500
        1000 * 10**6  // $1000
    ];
    
    // Platform fee percentage (10%)
    uint256 public constant PLATFORM_FEE_PERCENT = 10;
    
    // Mapping of duel ID to Duel
    mapping(uint256 => Duel) public duels;
    
    // Current duel ID
    uint256 public currentDuelId;
    
    // Open duels (not yet matched)
    uint256[] public openDuels;
    
    // Events
    event DuelCreated(uint256 indexed duelId, address indexed creator, uint256 betAmount, bool isCustom);
    event DuelJoined(uint256 indexed duelId, address indexed challenger);
    event DuelCompleted(uint256 indexed duelId, address indexed winner, uint256 prizeAmount);
    
    /**
     * @dev Constructor sets the USDT token address and platform wallet
     * @param _usdtToken Address of the USDT token contract on Polygon
     * @param _platformWallet Address of the platform wallet to receive fees
     */
    constructor(address _usdtToken, address _platformWallet) {
        usdtToken = IERC20(_usdtToken);
        platformWallet = _platformWallet;
        
        // Set up permissions
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Create a new duel with a fixed bet amount
     * @param betAmountIndex Index of the fixed bet amount
     */
    function createFixedDuel(uint256 betAmountIndex) external nonReentrant {
        require(betAmountIndex < fixedBetAmounts.length, "Invalid bet amount index");
        
        uint256 betAmount = fixedBetAmounts[betAmountIndex];
        
        // Transfer USDT from creator to contract
        require(usdtToken.transferFrom(msg.sender, address(this), betAmount), "USDT transfer failed");
        
        // Create new duel
        _createDuel(msg.sender, betAmount, false);
    }
    
    /**
     * @dev Create a new duel with a custom bet amount
     * @param betAmount Custom bet amount in USDT
     */
    function createCustomDuel(uint256 betAmount) external nonReentrant {
        require(betAmount > 0, "Bet amount must be greater than 0");
        
        // Transfer USDT from creator to contract
        require(usdtToken.transferFrom(msg.sender, address(this), betAmount), "USDT transfer failed");
        
        // Create new duel
        _createDuel(msg.sender, betAmount, true);
    }
    
    /**
     * @dev Internal function to create a new duel
     * @param creator Address of the duel creator
     * @param betAmount Bet amount in USDT
     * @param isCustom Whether this is a custom duel
     */
    function _createDuel(address creator, uint256 betAmount, bool isCustom) internal {
        // Increment duel ID
        currentDuelId++;
        
        // Create new duel
        duels[currentDuelId] = Duel({
            id: currentDuelId,
            creator: creator,
            betAmount: betAmount,
            challenger: address(0),
            isComplete: false,
            winner: address(0),
            isCustom: isCustom
        });
        
        // Add to open duels
        openDuels.push(currentDuelId);
        
        emit DuelCreated(currentDuelId, creator, betAmount, isCustom);
    }
    
    /**
     * @dev Join an existing duel
     * @param duelId ID of the duel to join
     */
    function joinDuel(uint256 duelId) external nonReentrant {
        Duel storage duel = duels[duelId];
        
        require(duel.creator != address(0), "Duel does not exist");
        require(duel.challenger == address(0), "Duel already has a challenger");
        require(duel.creator != msg.sender, "Cannot join your own duel");
        require(!duel.isComplete, "Duel is already complete");
        
        // Transfer USDT from challenger to contract
        require(usdtToken.transferFrom(msg.sender, address(this), duel.betAmount), "USDT transfer failed");
        
        // Set challenger
        duel.challenger = msg.sender;
        
        // Remove from open duels
        _removeOpenDuel(duelId);
        
        emit DuelJoined(duelId, msg.sender);
        
        // Complete the duel immediately
        _completeDuel(duelId);
    }
    
    /**
     * @dev Complete a duel and select a winner
     * @param duelId ID of the duel to complete
     */
    function _completeDuel(uint256 duelId) internal {
        Duel storage duel = duels[duelId];
        
        require(duel.creator != address(0), "Duel does not exist");
        require(duel.challenger != address(0), "Duel has no challenger");
        require(!duel.isComplete, "Duel is already complete");
        
        // Select winner using a pseudo-random mechanism
        // In production, this should use a verifiable random function or oracle
        uint256 randomValue = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            blockhash(block.number - 1),
            duelId
        ))) % 2;
        
        address winner = randomValue == 0 ? duel.creator : duel.challenger;
        
        // Mark duel as complete and set winner
        duel.isComplete = true;
        duel.winner = winner;
        
        // Calculate prize amount (90% of total pool)
        uint256 totalPool = duel.betAmount.mul(2);
        uint256 platformFee = totalPool.mul(PLATFORM_FEE_PERCENT).div(100);
        uint256 prizeAmount = totalPool.sub(platformFee);
        
        // Transfer prize to winner
        require(usdtToken.transfer(winner, prizeAmount), "Prize transfer failed");
        
        // Transfer platform fee
        require(usdtToken.transfer(platformWallet, platformFee), "Platform fee transfer failed");
        
        emit DuelCompleted(duelId, winner, prizeAmount);
    }
    
    /**
     * @dev Remove a duel from the open duels list
     * @param duelId ID of the duel to remove
     */
    function _removeOpenDuel(uint256 duelId) internal {
        for (uint256 i = 0; i < openDuels.length; i++) {
            if (openDuels[i] == duelId) {
                // Replace with the last element and pop
                openDuels[i] = openDuels[openDuels.length - 1];
                openDuels.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Cancel an open duel and refund the creator
     * @param duelId ID of the duel to cancel
     */
    function cancelDuel(uint256 duelId) external nonReentrant {
        Duel storage duel = duels[duelId];
        
        require(duel.creator == msg.sender, "Only creator can cancel");
        require(duel.challenger == address(0), "Cannot cancel after challenger joins");
        require(!duel.isComplete, "Duel is already complete");
        
        // Remove from open duels
        _removeOpenDuel(duelId);
        
        // Refund creator
        require(usdtToken.transfer(duel.creator, duel.betAmount), "Refund failed");
        
        // Mark as complete with no winner
        duel.isComplete = true;
    }
    
    /**
     * @dev Get all open duels
     * @return duelIds Array of open duel IDs
     */
    function getOpenDuels() external view returns (uint256[] memory) {
        return openDuels;
    }
    
    /**
     * @dev Get duel details
     * @param duelId ID of the duel
     * @return creator Address of the duel creator
     * @return betAmount Bet amount in USDT
     * @return challenger Address of the challenger (if any)
     * @return isComplete Whether the duel is complete
     * @return winner Address of the winner (if complete)
     * @return isCustom Whether this is a custom duel
     */
    function getDuelDetails(uint256 duelId) external view returns (
        address creator,
        uint256 betAmount,
        address challenger,
        bool isComplete,
        address winner,
        bool isCustom
    ) {
        Duel storage duel = duels[duelId];
        
        return (
            duel.creator,
            duel.betAmount,
            duel.challenger,
            duel.isComplete,
            duel.winner,
            duel.isCustom
        );
    }
    
    /**
     * @dev Update platform wallet address
     * @param newPlatformWallet New platform wallet address
     */
    function updatePlatformWallet(address newPlatformWallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newPlatformWallet != address(0), "Invalid address");
        platformWallet = newPlatformWallet;
    }
    
    /**
     * @dev Update fixed bet amounts
     * @param newFixedBetAmounts New array of fixed bet amounts
     */
    function updateFixedBetAmounts(uint256[] calldata newFixedBetAmounts) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFixedBetAmounts.length > 0, "Empty array");
        fixedBetAmounts = newFixedBetAmounts;
    }
}
