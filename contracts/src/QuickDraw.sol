// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@thirdweb-dev/contracts/extension/PermissionsEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title QuickDraw
 * @dev Contract for 5 or 10-player random winner games
 */
contract QuickDraw is PermissionsEnumerable, ReentrancyGuard {
    using SafeMath for uint256;

    // USDT token contract on Polygon
    IERC20 public usdtToken;
    
    // Owner wallet to receive platform fees
    address public platformWallet;
    
    // Game types
    enum GameType { FIVE_PLAYER, TEN_PLAYER }
    
    // Game state
    struct Game {
        uint256 id;
        GameType gameType;
        uint256 betAmount;
        address[] players;
        bool isComplete;
        address winner;
        uint256 prizePool;
    }
    
    // Platform fee percentage (10%)
    uint256 public constant PLATFORM_FEE_PERCENT = 10;
    
    // Mapping of game ID to Game
    mapping(uint256 => Game) public games;
    
    // Current game ID
    uint256 public currentGameId;
    
    // Open games (not yet filled)
    mapping(GameType => mapping(uint256 => uint256[])) public openGamesByAmount; // betAmount => gameIds
    
    // Events
    event GameCreated(uint256 indexed gameId, GameType gameType, uint256 betAmount);
    event PlayerJoined(uint256 indexed gameId, address indexed player);
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
     * @dev Create or join a quick draw game
     * @param gameType Type of game (FIVE_PLAYER or TEN_PLAYER)
     * @param betAmount Bet amount in USDT
     */
    function joinGame(GameType gameType, uint256 betAmount) external nonReentrant {
        require(betAmount > 0, "Bet amount must be greater than 0");
        
        // Transfer USDT from player to contract
        require(usdtToken.transferFrom(msg.sender, address(this), betAmount), "USDT transfer failed");
        
        // Check if there's an open game with the same bet amount
        uint256[] storage openGames = openGamesByAmount[gameType][betAmount];
        
        uint256 gameId;
        bool isNewGame = false;
        
        if (openGames.length > 0) {
            // Join existing game
            gameId = openGames[0];
            Game storage game = games[gameId];
            
            // Check if player already joined
            for (uint256 i = 0; i < game.players.length; i++) {
                require(game.players[i] != msg.sender, "Already joined this game");
            }
            
            // Add player to game
            game.players.push(msg.sender);
            game.prizePool = game.prizePool.add(betAmount);
            
            emit PlayerJoined(gameId, msg.sender);
            
            // Check if game is full
            uint256 maxPlayers = gameType == GameType.FIVE_PLAYER ? 5 : 10;
            
            if (game.players.length == maxPlayers) {
                // Remove from open games
                openGames[0] = openGames[openGames.length - 1];
                openGames.pop();
                
                // Complete the game
                _completeGame(gameId);
            }
        } else {
            // Create new game
            isNewGame = true;
            gameId = _createGame(gameType, betAmount, msg.sender);
        }
    }
    
    /**
     * @dev Internal function to create a new game
     * @param gameType Type of game (FIVE_PLAYER or TEN_PLAYER)
     * @param betAmount Bet amount in USDT
     * @param firstPlayer Address of the first player
     * @return gameId ID of the created game
     */
    function _createGame(GameType gameType, uint256 betAmount, address firstPlayer) internal returns (uint256) {
        // Increment game ID
        currentGameId++;
        
        // Create new game
        games[currentGameId] = Game({
            id: currentGameId,
            gameType: gameType,
            betAmount: betAmount,
            players: new address[](0),
            isComplete: false,
            winner: address(0),
            prizePool: betAmount
        });
        
        // Add first player
        games[currentGameId].players.push(firstPlayer);
        
        // Add to open games
        openGamesByAmount[gameType][betAmount].push(currentGameId);
        
        emit GameCreated(currentGameId, gameType, betAmount);
        emit PlayerJoined(currentGameId, firstPlayer);
        
        return currentGameId;
    }
    
    /**
     * @dev Complete a game and select a winner
     * @param gameId ID of the game to complete
     */
    function _completeGame(uint256 gameId) internal {
        Game storage game = games[gameId];
        
        require(!game.isComplete, "Game is already complete");
        
        uint256 maxPlayers = game.gameType == GameType.FIVE_PLAYER ? 5 : 10;
        require(game.players.length == maxPlayers, "Game is not full");
        
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
        
        // Calculate prize amount (90% of total pool)
        uint256 platformFee = game.prizePool.mul(PLATFORM_FEE_PERCENT).div(100);
        uint256 prizeAmount = game.prizePool.sub(platformFee);
        
        // Transfer prize to winner
        require(usdtToken.transfer(winner, prizeAmount), "Prize transfer failed");
        
        // Transfer platform fee
        require(usdtToken.transfer(platformWallet, platformFee), "Platform fee transfer failed");
        
        emit GameCompleted(gameId, winner, prizeAmount);
    }
    
    /**
     * @dev Get open games for a specific game type and bet amount
     * @param gameType Type of game (FIVE_PLAYER or TEN_PLAYER)
     * @param betAmount Bet amount in USDT
     * @return gameIds Array of open game IDs
     */
    function getOpenGames(GameType gameType, uint256 betAmount) external view returns (uint256[] memory) {
        return openGamesByAmount[gameType][betAmount];
    }
    
    /**
     * @dev Get game details
     * @param gameId ID of the game
     * @return gameType Type of game (FIVE_PLAYER or TEN_PLAYER)
     * @return betAmount Bet amount in USDT
     * @return players Array of player addresses
     * @return isComplete Whether the game is complete
     * @return winner Address of the winner (if complete)
     * @return prizePool Total prize pool
     */
    function getGameDetails(uint256 gameId) external view returns (
        GameType gameType,
        uint256 betAmount,
        address[] memory players,
        bool isComplete,
        address winner,
        uint256 prizePool
    ) {
        Game storage game = games[gameId];
        
        return (
            game.gameType,
            game.betAmount,
            game.players,
            game.isComplete,
            game.winner,
            game.prizePool
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
}
