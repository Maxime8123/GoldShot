// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@thirdweb-dev/contracts/extension/PermissionsEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PaymentProcessor
 * @dev Contract to handle USDT payments and manage contract interactions
 */
contract PaymentProcessor is PermissionsEnumerable {
    // USDT token contract on Polygon
    IERC20 public usdtToken;
    
    // Contract addresses
    address public lotteryManager;
    address public duelGame;
    address public quickDraw;
    address public hostManager;
    
    // Owner wallet to receive platform fees
    address public platformWallet;
    
    // Events
    event ContractUpdated(string contractName, address contractAddress);
    
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
     * @dev Set the lottery manager contract address
     * @param _lotteryManager Address of the lottery manager contract
     */
    function setLotteryManager(address _lotteryManager) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_lotteryManager != address(0), "Invalid address");
        lotteryManager = _lotteryManager;
        emit ContractUpdated("LotteryManager", _lotteryManager);
    }
    
    /**
     * @dev Set the duel game contract address
     * @param _duelGame Address of the duel game contract
     */
    function setDuelGame(address _duelGame) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_duelGame != address(0), "Invalid address");
        duelGame = _duelGame;
        emit ContractUpdated("DuelGame", _duelGame);
    }
    
    /**
     * @dev Set the quick draw contract address
     * @param _quickDraw Address of the quick draw contract
     */
    function setQuickDraw(address _quickDraw) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_quickDraw != address(0), "Invalid address");
        quickDraw = _quickDraw;
        emit ContractUpdated("QuickDraw", _quickDraw);
    }
    
    /**
     * @dev Set the host manager contract address
     * @param _hostManager Address of the host manager contract
     */
    function setHostManager(address _hostManager) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_hostManager != address(0), "Invalid address");
        hostManager = _hostManager;
        emit ContractUpdated("HostManager", _hostManager);
    }
    
    /**
     * @dev Update platform wallet address
     * @param _platformWallet New platform wallet address
     */
    function updatePlatformWallet(address _platformWallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_platformWallet != address(0), "Invalid address");
        platformWallet = _platformWallet;
    }
    
    /**
     * @dev Approve USDT spending for all game contracts
     * @param amount Amount to approve
     */
    function approveContracts(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        
        if (lotteryManager != address(0)) {
            usdtToken.approve(lotteryManager, amount);
        }
        
        if (duelGame != address(0)) {
            usdtToken.approve(duelGame, amount);
        }
        
        if (quickDraw != address(0)) {
            usdtToken.approve(quickDraw, amount);
        }
        
        if (hostManager != address(0)) {
            usdtToken.approve(hostManager, amount);
        }
    }
    
    /**
     * @dev Get USDT allowance for all game contracts
     * @param user Address of the user
     * @return lotteryAllowance Allowance for lottery manager
     * @return duelAllowance Allowance for duel game
     * @return quickDrawAllowance Allowance for quick draw
     * @return hostAllowance Allowance for host manager
     */
    function getAllowances(address user) external view returns (
        uint256 lotteryAllowance,
        uint256 duelAllowance,
        uint256 quickDrawAllowance,
        uint256 hostAllowance
    ) {
        lotteryAllowance = lotteryManager != address(0) ? usdtToken.allowance(user, lotteryManager) : 0;
        duelAllowance = duelGame != address(0) ? usdtToken.allowance(user, duelGame) : 0;
        quickDrawAllowance = quickDraw != address(0) ? usdtToken.allowance(user, quickDraw) : 0;
        hostAllowance = hostManager != address(0) ? usdtToken.allowance(user, hostManager) : 0;
    }
}
