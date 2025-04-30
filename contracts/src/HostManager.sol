// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@thirdweb-dev/contracts/extension/PermissionsEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title HostManager
 * @dev Contract for hosting custom lottery, duel, and quick draw games
 */
contract HostManager is PermissionsEnumerable, ReentrancyGuard {
    using SafeMath for uint256;

    // USDT token contract on Polygon
    IERC20 public usdtToken;
    
    // Owner wallet to receive platform fees
    address public platformWallet;
    
    // Game types
    enum GameType { LOTTERY, DUEL, QUICK_DRAW }
    
    // Access types
    enum AccessType { PUBLIC, PRIVATE }
    
    // Game state
    struct HostedGame {
        uint256 id;
        GameType gameType;
        address host;
        uint256 entryAmount;
        uint256 playerLimit; // For quick draw
        AccessType accessType;
        address[] players;
        bool isComplete;
        address winner;
        uint256 prizePool;
        mapping(address => bool) allowedPlayers; // For private games
    }
    
    // Fee percentages
    uint256 public constant LOTTERY_PLATFORM_FEE_PERCENT = 25;
    uint256 public constant LOTTERY_HOST_FEE_PERCENT = 25;
    uint256 public constant DUEL_PLATFORM_FEE_PERCENT = 5;
    uint256 public constant DUEL_HOST_FEE_PERCENT = 5;
    
    // Mapping of game ID to HostedGame
    mapping(uint256 => HostedGame) public hostedGames;
    
    // Current game ID
    uint256 public currentGameId;
    
    // Public games
    uint256[] public publicGames;
    
    // Host's games
    mapping(address => uint256[]) public hostGames;
    
    // Events
    event GameCreated(uint256 indexed gameId, GameType gameType, address indexed host, uint256 entryAmount, AccessType accessType);
    event PlayerJoined(uint256 indexed gameId, address indexed player);
    event PlayerAllowed(uint256 indexed gameId, address indexed player);
    event GameCompleted(uint256 indexed gameId, address indexed winner, uint256 prizeAmount);
    
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
     * @dev Create a new hosted game
     * @param gameType Type of game (LOTTERY, DUEL, QUICK_DRAW)
     * @param entryAmount Entry amount in USDT
     * @param playerLimit Player limit for QUICK_DRAW games (5 or 10)
     * @param accessType Access type (PUBLIC or PRIVATE)
     */
    function createGame(
        GameType gameType, 
        uint256 entryAmount, 
        uint256 playerLimit, 
        AccessType accessType
    ) external nonReentrant {
        require(entryAmount > 0, "Entry amount must be greater than 0");
        
        if (gameType == GameType.QUICK_DRAW) {
            require(playerLimit == 5 || playerLimit == 10, "Player limit must be 5 or 10");
        }
        
        // Increment game ID
        currentGameId++;
        
        // Create new game
        HostedGame storage game = hostedGames[currentGameId];
        game.id = currentGameId;
        game.gameType = gameType;
        game.host = msg.sender;
        game.entryAmount = entryAmount;
        game.playerLimit = playerLimit;
        game.accessType = accessType;
        game.isComplete = false;
        game.winner = address(0);
        game.prizePool = 0;
        
        // Add to host's games
        hostGames[msg.sender].push(currentGameId);
        
        // Add to public games if public
        if (accessType == AccessType.PUBLIC) {
            publicGames.push(currentGameId);
        }
        
        emit GameCreated(currentGameId, gameType, msg.sender, entryAmount, accessType);
    }
    
    /**
     * @dev Allow a player to join a private game
     * @param gameId ID of the game
     * @param player Address of the player to allow
     */
    function allowPlayer(uint256 gameId, address player) external {
        HostedGame storage game = hostedGames[gameId];
        
        require(game.host == msg.sender, "Only host can allow players");
        require(game.accessType == AccessType.PRIVATE, "Game is not private");
        require(!game.isComplete, "Game is already complete");
        
        game.allowedPlayers[player] = true;
        
        emit PlayerAllowed(gameId, player);
    }
    
    /**
     * @dev Join a hosted game
     * @param gameId ID of the game to join
     */
    function joinGame(uint256 gameId) external nonReentrant {
        HostedGame storage game = hostedGames[gameId];
        
        require(game.id == gameId, "Game does not exist");
        require(!game.isComplete, "Game is already complete");
        
        if (game.accessType == AccessType.PRIVATE) {
            require(game.allowedPlayers[msg.sender], "Not allowed to join this game");
        }
        
        // Check if player already joined
        for (uint256 i = 0; i < game.players.length; i++) {
            require(game.players[i] != msg.sender, "Already joined this game");
        }
        
        // Check player limit for quick draw
        if (game.gameType == GameType.QUICK_DRAW) {
            require(game.players.length < game.playerLimit, "Game is full");
        }
        
        // Transfer USDT from player to contract
        require(usdtToken.transferFrom(msg.sender, address(this), game.entryAmount), "USDT transfer failed");
        
        // Add player to game
        game.players.push(msg.sender);
        game.prizePool = game.prizePool.add(game.entryAmount);
        
        emit PlayerJoined(gameId, msg.sender);
        
        // Check if quick draw game is full
        if (game.gameType == GameType.QUICK_DRAW && game.players.length == game.playerLimit) {
            _completeGame(gameId);
        }
        
        // For duel games, complete when 2 players join
        if (game.gameType == GameType.DUEL && game.players.length == 2) {
            _completeGame(gameId);
        }
    }
    
    /**
     * @dev Draw a hosted lottery
     * @param gameId ID of the lottery to draw
     */
    function drawLottery(uint256 gameId) external {
        HostedGame storage game = hostedGames[gameId];
        
        require(game.host == msg.sender, "Only host can draw lottery");
        require(game.gameType == GameType.LOTTERY, "Not a lottery game");
        require(!game.isComplete, "Lottery already drawn");
        require(game.players.length > 0, "No participants");
        
        _completeGame(gameId);
    }
    
    /**
     * @dev Complete a game and select a winner
     * @param gameId ID of the game to complete
     */
    function _completeGame(uint256 gameId) internal {
        HostedGame storage game = hostedGames[gameId];
        
        require(!game.isComplete, "Game is already complete");
        require(game.players.length > 0, "No players");
        
        // Remove from public games if public
        if (game.accessType == AccessType.PUBLIC) {
            for (uint256 i = 0; i < publicGames.length; i++) {
                if (publicGames[i] == gameId) {
                    publicGames[i] = publicGames[publicGames.length - 1];
                    publicGames.pop();
                    break;
                }
            }
        }
        
        // Select winner using a pseudo-random mechanism
        // In production, this should use a verifiable random function or oracle
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            blockhash(block.number - 1),
            gameId
        ))) % game.players.length;
        
        address winner = game.players[randomIndex];
        
        // Mark game as complete and set winner
        game.isComplete = true;
        game.winner = winner;
        
        // Calculate fees and prize based on game type
        uint256 platformFee;
        uint256 hostFee;
        uint256 prizeAmount;
        
        if (game.gameType == GameType.LOTTERY) {
            // Lottery: 50% winner, 25% platform, 25% host
            platformFee = game.prizePool.mul(LOTTERY_PLATFORM_FEE_PERCENT).div(100);
            hostFee = game.prizePool.mul(LOTTERY_HOST_FEE_PERCENT).div(100);
            prizeAmount = game.prizePool.sub(platformFee).sub(hostFee);
        } else {
            // Duel/QuickDraw: 90% winner, 5% platform, 5% host
            platformFee = game.prizePool.mul(DUEL_PLATFORM_FEE_PERCENT).div(100);
            hostFee = game.prizePool.mul(DUEL_HOST_FEE_PERCENT).div(100);
            prizeAmount = game.prizePool.sub(platformFee).sub(hostFee);
        }
        
        // Transfer prize to winner
        require(usdtToken.transfer(winner, prizeAmount), "Prize transfer failed");
        
        // Transfer platform fee
        require(usdtToken.transfer(platformWallet, platformFee), "Platform fee transfer failed");
        
        // Transfer host fee
        require(usdtToken.transfer(game.host, hostFee), "Host fee transfer failed");
        
        emit GameCompleted(gameId, winner, prizeAmount);
    }
    
    /**
     * @dev Get public games
     * @return gameIds Array of public game IDs
     */
    function getPublicGames() external view returns (uint256[] memory) {
        return publicGames;
    }
    
    /**
     * @dev Get host's games
     * @param host Address of the host
     * @return gameIds Array of game IDs hosted by the address
     */
    function getHostGames(address host) external view returns (uint256[] memory) {
        return hostGames[host];
    }
    
    /**
     * @dev Get game details
     * @param gameId ID of the game
     * @return gameType Type of game
     * @return host Address of the host
     * @return entryAmount Entry amount in USDT
     * @return playerLimit Player limit (for quick draw)
     * @return accessType Access type (PUBLIC or PRIVATE)
     * @return players Array of player addresses
     * @return isComplete Whether the game is complete
     * @return winner Address of the winner (if complete)
     * @return prizePool Total prize pool
     */
    function getGameDetails(uint256 gameId) external view returns (
        GameType gameType,
        address host,
        uint256 entryAmount,
        uint256 playerLimit,
        AccessType accessType,
        address[] memory players,
        bool isComplete,
        address winner,
        uint256 prizePool
    ) {
        HostedGame storage game = hostedGames[gameId];
        
        return (
            game.gameType,
            game.host,
            game.entryAmount,
            game.playerLimit,
            game.accessType,
            game.players,
            game.isComplete,
            game.winner,
            game.prizePool
        );
    }
    
    /**
     * @dev Check if a player is allowed to join a private game
     * @param gameId ID of the game
     * @param player Address of the player
     * @return allowed Whether the player is allowed
     */
    function isPlayerAllowed(uint256 gameId, address player) external view returns (bool) {
        return hostedGames[gameId].allowedPlayers[player];
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
