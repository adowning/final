/**
 * BaseSlotSettings.ts - Core Engine for Casino Slot Games
 * 
 * This is the most critical and complex component in the entire casino game system.
 * It orchestrates all casino game logic, integrating User, Game, Shop, JPG models 
 * with Log and GameReel utilities.
 * 
 * @package Casino Game System
 * @version 1.0.0
 * @author Casino Game Engine
 */

// Import all converted components
import { User, type UserData } from '../../models/User';
import { Game, type GameData } from '../../models/Game';
import { Shop, type ShopData } from '../../models/Shop';
import { JPG, type JPGData } from '../../models/JPG';
import { GameReel } from '../../utils/GameReel';
import { Log } from '../../utils/Log';
import { UserStatusConstants } from '../../models/UserStatus';

/**
 * Interface for Game Settings - the main configuration object passed to constructor
 */
export interface IGameSettings {
  user?: Partial<UserData>;
  game?: Partial<GameData>;
  shop?: Partial<ShopData>;
  jpgs?: Partial<JPGData>[];
  reelStrips?: Record<string, string[]>;
  state?: {
    goldsvetData?: {
      denomination?: string;
      symbol_game?: string[];
      paytable?: any;
    };
  };
  bank?: number;
  balance?: number;
  slotId?: string;
  playerId?: string;
  jackpots?: Record<string, any>;
  bankerService?: any;
  betLogs?: any[];
  count_balance?: number;
}

/**
 * Interface for game data with time-to-live
 */
export interface GameDataEntry {
  timelife: number;
  payload: any;
}

/**
 * Log report entry interface
 */
export interface LogReportEntry {
  response: any;
  allbet: number;
  lines: number;
  reportWin: number;
  slotEvent: string;
}

/**
 * Error log report entry interface
 */
export interface ErrorLogReportEntry {
  type: string;
  error_code: string;
  timestamp: number;
  slot_id?: string;
  player_id?: string;
  balance: number;
  game_state: any;
  backtrace: any[];
}

/**
 * Key controller interface for input handling
 */
export interface KeyControllerMap {
  [key: string]: string;
}

/**
 * BaseSlotSettings class - The Core Engine for Casino Slot Games
 * 
 * This class integrates all models and utilities to provide the complete
 * game state management, financial operations, and game logic orchestration.
 */
export class BaseSlotSettings {
  // ===== GAME STATE PROPERTIES =====

  // Reel strip properties
  public splitScreen: string | null = null;
  public reelStrip1: string[] | null = null;
  public reelStrip2: string[] | null = null;
  public reelStrip3: string[] | null = null;
  public reelStrip4: string[] | null = null;
  public reelStrip5: string[] | null = null;
  public reelStrip6: string[] | null = null;
  public reelStripBonus1: string[] | null = null;
  public reelStripBonus2: string[] | null = null;
  public reelStripBonus3: string[] | null = null;
  public reelStripBonus4: string[] | null = null;
  public reelStripBonus5: string[] | null = null;
  public reelStripBonus6: string[] | null = null;

  // Core game properties
  public slotDBId: string = '';
  public Line: number | null = null;
  public scaleMode: string | null = null;
  public numFloat: number | null = null;
  public gameLine: number | null = null;
  public Bet: number[] | null = null;
  public SymbolGame: string[] = [];
  public GambleType: string | null = null;
  public lastEvent: string | null = null;
  public keyController: KeyControllerMap = {};
  public slotViewState: string | null = null;
  public hideButtons: string[] | null = null;
  public slotReelsConfig: any = null;
  public slotExitUrl: string | null = null;
  public slotBonusType: string | null = null;
  public slotScatterType: string | null = null;
  public slotGamble: string | null = null;
  public slotSounds: string[] = [];
  public slotFastStop: boolean | null = null;

  // Bet and RTP properties
  public betRemains: number | null = null;
  public betRemains0: number | null = null;
  public toGameBanks: number | null = null;
  public toSlotJackBanks: number | null = null;
  public toSysJackBanks: number | null = null;
  public betProfit: number | null = null;
  public slotJackPercent: number[] = [];
  public slotJackpot: number[] = [];
  public increaseRTP: number | null = null;

  // Model and state properties
  public jpgs: JPG[] | null = null;
  public betLogs: any = null;

  // Log and error properties
  public logReport: LogReportEntry[] = [];
  public errorLogReport: ErrorLogReportEntry[] = [];
  public internalError: any[] = [];

  // Game data properties
  public gameData: Record<string, GameDataEntry> = {};
  public gameDataStatic: Record<string, GameDataEntry> = {};

  // Financial properties
  public AllBet: number = 0;
  public MaxWin: number = 0;
  public CurrentDenom: number = 1;
  public GameData: any[] = [];
  public Denominations: number[] = [];
  public CurrentDenomination: number = 1.0;
  public slotCurrency: string = 'USD';
  public playerId: string | null = null;
  public Balance: number | null = null;
  public Jackpots: Record<string, any> = {};
  public Paytable: any[] = [];
  public slotId: string = '';
  public Bank: number | null = null;
  public Percent: number | null = null;
  public WinLine: any[] = [];
  public WinGamble: any[] = [];
  public Bonus: any[] = [];

  // Model properties
  public shop_id: number | null = null;
  public currency: string | null = null;
  public user: User | null = null;
  public game: Game | null = null;
  public shop: Shop | null = null;
  public jpgPercentZero: boolean = false;
  public count_balance: number | null = null;

  // Game State Properties
  public slotBonus: boolean | null = null;
  public isBonusStart: boolean | null = null;
  public slotFreeMpl: number = 1;
  public slotWildMpl: number = 1;
  public slotFreeCount: number[] = [];

  // Configuration Defaults
  public reelRows: number = 3;
  public scatterSymbolId: string = '0';

  // Reel Strip Placeholders
  public reelStripsData: any = {};

  // Settings storage
  private goldsvetData: any;

  // ===== CONSTRUCTOR =====

  /**
   * Main constructor for BaseSlotSettings
   * @param settings Game settings object containing all configuration
   */
  constructor(settings: IGameSettings) {
    Log.debug('Initializing BaseSlotSettings with settings', {
      hasUser: !!settings.user,
      hasGame: !!settings.game,
      hasShop: !!settings.shop,
      hasJpgs: !!settings.jpgs,
      hasReelStrips: !!settings.reelStrips
    });

    try {
      // 1. Initialize model objects from settings
      this.initializeModels(settings);

      // 2. Initialize game data safely
      this.initializeGameDataSafely();

      // 3. Initialize JPGs
      this.initializeJPGs(settings.jpgs);

      // 4. Load reel strips
      this.initializeReelStrips(settings.reelStrips);

      // 5. Initialize key controller
      this.initializeKeyController();

      // 6. Initialize denominations
      this.initializeDenominations(settings.state);

      // 7. Set up player and shop info
      this.setupPlayerAndShopInfo(settings);

      // 8. Initialize financial properties
      this.initializeFinancialProperties(settings);

      Log.info('BaseSlotSettings initialization completed successfully', {
        slotId: this.slotId,
        playerId: this.playerId,
        balance: this.GetBalance(),
        currency: this.slotCurrency
      });

    } catch (error) {
      Log.error('Error during BaseSlotSettings initialization', {
        error: error instanceof Error ? error.message : String(error),
        settings: settings
      });
      throw error;
    }
  }

  /**
   * Initialize model objects from settings
   */
  private initializeModels(settings: IGameSettings): void {
    // Convert settings to model objects
    this.user = settings.user ? new User(settings.user) : null;
    this.game = settings.game ? new Game({ ...settings.game, name: settings.game.name || 'Default Game' }) : null;
    this.shop = settings.shop ? new Shop(settings.shop) : null;
  }

  /**
   * Initialize game data with safe deserialization
   */
  private initializeGameDataSafely(): void {
    // Initialize user session data
    if (this.user?.session) {
      const userSession = this.safeUnserialize(this.user.session, []);
      if (Array.isArray(userSession)) {
        // Clean up expired entries
        this.gameData = this.cleanupExpiredData(userSession) as unknown as Record<string, GameDataEntry>;
      }
    }

    // Initialize game advanced data
    if (this.game?.advanced) {
      const gameAdvanced = this.safeUnserialize(this.game.advanced, []);
      if (Array.isArray(gameAdvanced)) {
        // Clean up expired entries
        this.gameDataStatic = this.cleanupExpiredData(gameAdvanced) as unknown as Record<string, GameDataEntry>;
      }
    }

    Log.debug('Game data initialized', {
      gameDataEntries: Object.keys(this.gameData).length,
      gameDataStaticEntries: Object.keys(this.gameDataStatic).length
    });
  }

  /**
   * Initialize JPG objects from data
   */
  private initializeJPGs(jpgsData?: Partial<JPGData>[]): void {
    if (!jpgsData || !Array.isArray(jpgsData) || jpgsData.length === 0) {
      this.jpgs = [];
      return;
    }

    this.jpgs = jpgsData.map((jpgData) => {
      // Check if it's already a JPG object
      if (jpgData instanceof JPG) {
        return jpgData;
      }
      // Otherwise create new JPG object
      return new JPG(jpgData);
    });

    Log.debug('JPGs initialized', { count: this.jpgs.length });
  }

  /**
   * Initialize reel strips from settings
   */
  private initializeReelStrips(reelStripsData?: Record<string, string[]>): void {
    if (!reelStripsData) {
      Log.warning('No reel strips data provided');
      return;
    }

    // Transform reel strips to "key=value" strings format for GameReel
    const reelStrings: string[] = [];

    if (typeof reelStripsData === 'object' && reelStripsData !== null) {
      for (const [key, values] of Object.entries(reelStripsData)) {
        if (Array.isArray(values)) {
          // Convert array of values to comma-separated string
          reelStrings.push(`${key}=${values.join(',')}`);
          Log.debug(`Converted ${key} to reel string format`);
        } else if (typeof values === 'string') {
          // Keep as-is if already a string
          reelStrings.push(values);
          Log.debug(`Kept ${key} as-is: ${values}`);
        }
      }
    }

    // Initialize GameReel with converted strings
    const reel = new GameReel(reelStrings);

    // Dynamically extract all available reel strips (flexible for different game configurations)
    const allPossibleReelStrips = [
      'reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5',
      'reelStrip6', 'reelStrip7', 'reelStrip8', 'reelStrip9', 'reelStrip10'
    ];

    let stripsLoaded = 0;
    for (const reelStripName of allPossibleReelStrips) {
      const strip = reel.getStrip(reelStripName);
      if (strip.length > 0) {
        (this as any)[reelStripName] = strip;
        stripsLoaded++;
      }
    }

    Log.info('Reel strips initialized', {
      stripsLoaded,
      stats: reel.getStats()
    });
  }

  /**
   * Initialize key controller mapping
   */
  private initializeKeyController(): void {
    this.keyController = {
      '13': 'uiButtonSpin,uiButtonSkip',
      '49': 'uiButtonInfo',
      '50': 'uiButtonCollect',
      '51': 'uiButtonExit2',
      '52': 'uiButtonLinesMinus',
      '53': 'uiButtonLinesPlus',
      '54': 'uiButtonBetMinus',
      '55': 'uiButtonBetPlus',
      '56': 'uiButtonGamble',
      '57': 'uiButtonRed',
      '48': 'uiButtonBlack',
      '189': 'uiButtonAuto',
      '187': 'uiButtonSpin'
    };
  }

  /**
   * Initialize denominations from settings
   */
  private initializeDenominations(state?: IGameSettings['state']): void {
    const denominationStr = state?.goldsvetData?.denomination || '';

    if (denominationStr) {
      this.Denominations = denominationStr.split(',').map(Number);
      Log.debug('Denominations loaded from settings', { denominations: this.Denominations });
    } else {
      this.Denominations = [1.0];
      Log.debug('Using default denomination [1.0]');
    }

    this.CurrentDenom = this.Denominations[0] || 1;
  }

  /**
   * Setup player and shop information
   */
  private setupPlayerAndShopInfo(settings: IGameSettings): void {
    // Shop ID from shop model
    this.shop_id = (this.shop?.id as number) ?? 0;

    // Player ID from settings or user
    this.playerId = settings.playerId || this.user?.id || null;

    // Fallback: If user is missing, create a temporary one
    if (this.user === null && this.playerId) {
      this.user = new User({
        id: this.playerId,
        balance: settings.balance || 0,
        count_balance: settings.count_balance || 0,
        address: 0
      });
      Log.debug('Created fallback user object', { playerId: this.playerId });
    }

    // Game DB ID
    this.slotDBId = this.game?.id?.toString() || '0';
    this.count_balance = this.user?.count_balance || 0;
    this.Percent = this.shop?.percent || 10;
    this.WinGamble = this.game?.rezerv ? [this.game.rezerv] : [0];
    this.MaxWin = this.shop?.max_win || 50000;
    this.increaseRTP = 1;

    // Currency
    this.slotCurrency = this.shop?.currency || 'USD';

    Log.debug('Player and shop info setup completed', {
      shopId: this.shop_id,
      playerId: this.playerId,
      currency: this.slotCurrency,
      percent: this.Percent,
      maxWin: this.MaxWin
    });
  }

  /**
   * Initialize financial properties
   */
  private initializeFinancialProperties(settings: IGameSettings): void {
    // Bank logic
    if (settings.bank !== undefined) {
      this.Bank = settings.bank;
    } else {
      this.Bank = this.shop?.balance || 1000;
    }

    // Balance
    this.Balance = settings.balance || 0;

    // Jackpots
    this.Jackpots = settings.jackpots || {};

    // GameDenoms fallback
    const gameDenoms = this.game?.denomination ? [this.game.denomination] : [];
    if (this.Denominations.length === 0 && gameDenoms.length > 0) {
      this.Denominations = gameDenoms;
      this.CurrentDenom = this.Denominations[0] || 1;
    }

    // Initialize state data
    this.goldsvetData = settings.state?.goldsvetData || {};
    this.SymbolGame = settings.state?.goldsvetData?.symbol_game || [];

    // Initialize logs
    this.logReport = [];
    this.internalError = [];

    // Initialize betRemains
    this.betRemains = null;
    this.betRemains0 = null;

    Log.debug('Financial properties initialized', {
      bank: this.Bank,
      balance: this.Balance,
      jackpotCount: Object.keys(this.Jackpots).length,
      denomination: this.CurrentDenom
    });
  }

  /**
   * Remove expired entries from game data
   */
  private cleanupExpiredData(data: any[]): any[] {
    if (!Array.isArray(data)) {
      return data;
    }

    const currentTime = Date.now() / 1000; // Convert to Unix timestamp
    const cleaned = data.filter((entry) => {
      if (typeof entry === 'object' && entry !== null && 'timelife' in entry) {
        return entry.timelife > currentTime;
      }
      return true;
    });

    return cleaned;
  }

  /**
   * Safe unserialization with default handling
   */
  private safeUnserialize(data: string, defaultValue: any = []): any {
    if (typeof data !== 'string' || data.length === 0) {
      return defaultValue;
    }

    try {
      // For JSON strings (most common in TypeScript), try JSON.parse first
      if (data.startsWith('{') || data.startsWith('[')) {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : defaultValue;
      }

      // For serialized PHP-style strings, handle them as plain strings
      return data;
    } catch (error) {
      Log.warning('Failed to parse serialized data', { data, error });
      return defaultValue;
    }
  }

  // ===== CORE GAME METHODS =====

  /**
   * Check if the game is active and accessible
   */
  public is_active(): boolean {
    try {
      const gameView = this.game?.view ?? true;
      const shopBlocked = this.shop?.is_blocked ?? false;
      const userBlocked = this.user?.is_blocked ?? false;
      const userStatus = this.user?.status ?? '';

      const isBanned = userStatus === UserStatusConstants.BANNED;

      Log.debug('is_active check', {
        gameView,
        shopBlocked,
        userBlocked,
        userStatus,
        isBanned
      });

      // If any blocking condition is true, user must be signed out
      if (this.game && this.shop && this.user && (!gameView || shopBlocked || userBlocked || isBanned)) {
        if (this.user) {
          // Clear remember token for blocked users
          this.user.remember_token = undefined;
        }
        return false;
      }

      return gameView && !shopBlocked && !userBlocked && !isBanned;

    } catch (error) {
      Log.error('Error checking game active status', { error });
      return false;
    }
  }

  /**
   * Set game data with time-to-live
   */
  public SetGameData(key: string, value: any): void {
    const timeLife = 86400; // 24 hours
    this.gameData[key] = {
      timelife: Date.now() / 1000 + timeLife,
      payload: value
    };
    Log.debug('Game data set', { key, hasValue: !!value });
  }

  /**
   * Get game data with safe default handling
   */
  public GetGameData(key: string): any {
    if (this.gameData[key]) {
      const payload = this.gameData[key].payload;
      // Ensure return value is always valid for count() operations
      return Array.isArray(payload) ? payload : (payload ?? []);
    } else {
      return []; // Return empty array instead of 0
    }
  }

  /**
   * Check if game data exists
   */
  public HasGameData(key: string): boolean {
    return key in this.gameData;
  }

  /**
   * Save game data to user session
   */
  public SaveGameData(): void {
    if (this.user) {
      try {
        this.user.session = JSON.stringify(this.gameData);
        this.user.save();
        Log.debug('Game data saved to user session');
      } catch (error) {
        Log.error('Error saving game data', { error });
      }
    }
  }

  /**
   * Set static game data with time-to-live
   */
  public SetGameDataStatic(key: string, value: any): void {
    const timeLife = 86400; // 24 hours
    this.gameDataStatic[key] = {
      timelife: Date.now() / 1000 + timeLife,
      payload: value
    };
    Log.debug('Static game data set', { key });
  }

  /**
   * Get static game data
   */
  public GetGameDataStatic(key: string): any {
    if (this.gameDataStatic[key]) {
      const data = this.gameDataStatic[key];
      if (typeof data === 'object' && data !== null && 'payload' in data) {
        return (data as GameDataEntry).payload;
      } else {
        return data; // Return the direct value if not in expected format
      }
    } else {
      return 0;
    }
  }

  /**
   * Check if static game data exists
   */
  public HasGameDataStatic(key: string): boolean {
    return key in this.gameDataStatic;
  }

  /**
   * Save static game data
   */
  public SaveGameDataStatic(): void {
    if (this.game) {
      try {
        this.game.advanced = JSON.stringify(this.gameDataStatic);
        this.game.save();
        Log.debug('Static game data saved');
      } catch (error) {
        Log.error('Error saving static game data', { error });
      }
    }
  }

  // ===== FINANCIAL OPERATIONS =====

  /**
   * Get current balance
   */
  public GetBalance(): number {
    if (!this.user) {
      Log.warning('GetBalance called but user is null');
      return 0;
    }

    this.Balance = (this.user.balance || 0) / this.CurrentDenom;
    return this.Balance;
  }

  /**
   * Set balance with slot event handling
   */
  public SetBalance(sum: number, slotEvent: string = ''): User | null {
    try {
      if (this.GetBalance() + sum < 0) {
        this.InternalError('Balance_   ' + sum);
      }

      const adjustedSum = sum * this.CurrentDenom;
      const user = this.user;

      if (!user) {
        Log.error('SetBalance called but user is null');
        return null;
      }

      // Handle bet event (deduction from balance)
      if (adjustedSum < 0 && slotEvent === 'bet') {
        this.handleBetDeduction(user, Math.abs(adjustedSum));
      }

      // Update balance
      const userBalance = user.balance || 0;
      const newBalance = userBalance + adjustedSum;

      user.balance = this.FormatFloat(newBalance);

      // Save if needed
      user.save();

      Log.debug('Balance updated', {
        sum,
        adjustedSum,
        oldBalance: userBalance,
        newBalance: user.balance,
        event: slotEvent
      });

      return user;

    } catch (error) {
      Log.error('Error setting balance', { sum, slotEvent, error });
      return null;
    }
  }

  /**
   * Handle bet deduction logic with address and count_balance management
   */
  private handleBetDeduction(user: User, betAmount: number): void {
    const userCountBalance = user.count_balance || 0;
    const userAddress = user.address || 0;

    // Handle different balance scenarios
    if (userCountBalance === 0) {
      this.handleZeroCountBalance(user, betAmount);
    } else if (userCountBalance > 0 && userCountBalance < betAmount) {
      this.handlePartialCountBalance(user, betAmount);
    }

    // Update count_balance
    const newCountBalance = Math.max(0, userCountBalance - betAmount);
    user.count_balance = this.FormatFloat(newCountBalance);

    // Handle address updates
    this.updateUserAddress(user, userAddress, betAmount);
  }

  /**
   * Handle case when count_balance is 0
   */
  private handleZeroCountBalance(user: User, betAmount: number): void {
    const userAddress = user.address || 0;
    if (userAddress < betAmount && userAddress > 0) {
      user.address = 0;
      this.betRemains = betAmount - userAddress;
    }
  }

  /**
   * Handle case when count_balance is partially sufficient
   */
  private handlePartialCountBalance(user: User, betAmount: number): void {
    const userCountBalance = user.count_balance || 0;
    const userAddress = user.address || 0;
    const remainingAmount = betAmount - userCountBalance;

    this.betRemains0 = remainingAmount;

    if (userAddress > 0) {
      this.betRemains0 = 0;
      if (userAddress < remainingAmount && userAddress > 0) {
        user.address = 0;
        this.betRemains0 = remainingAmount - userAddress;
      }
    }
  }

  /**
   * Update user address after bet
   */
  private updateUserAddress(user: User, currentAddress: number, betAmount: number): void {
    if (currentAddress === 0) {
      if ((user.address || 0) < betAmount && (user.address || 0) > 0) {
        user.address = 0;
      } else if ((user.address || 0) > 0) {
        user.address = (user.address || 0) - betAmount;
      }
    } else if (currentAddress > 0 && currentAddress < betAmount) {
      if ((user.address || 0) < (betAmount - currentAddress) && (user.address || 0) > 0) {
        user.address = 0;
      } else if ((user.address || 0) > 0) {
        user.address = (user.address || 0) - (betAmount - currentAddress);
      }
    }
  }

  /**
   * Get bank amount for specified slot state
   */
  public GetBank(slotState: string = ''): number {
    try {
      // Normalize slot state
      if (this.isBonusStart || slotState === 'bonus' || slotState === 'freespin' || slotState === 'respin') {
        slotState = 'bonus';
      } else {
        slotState = '';
      }

      // Try to get from game model
      if (this.game && typeof (this.game as any).get_gamebank === 'function') {
        this.Bank = (this.game as any).get_gamebank(slotState);
      } else {
        // Fallback
        this.Bank = this.Bank ?? 10000;
      }

      return (this.Bank || 0) / this.CurrentDenom;

    } catch (error) {
      Log.error('Error getting bank', { slotState, error });
      return 0;
    }
  }

  /**
   * Set bank amount for specified slot state
   */
  public SetBank(slotState: string = '', sum: number, slotEvent: string = ''): Game | null {
    try {
      // Normalize slot state
      if (this.isBonusStart || slotState === 'bonus' || slotState === 'freespin' || slotState === 'respin') {
        slotState = 'bonus';
      } else {
        slotState = '';
      }

      // Check bank availability
      if (this.GetBank(slotState) + sum < 0) {
        this.InternalError(`Bank_   ${sum}  CurrentBank_ ${this.GetBank(slotState)} CurrentState_ ${slotState} Trigger_ ${this.GetBank(slotState) + sum}`);
      }

      const adjustedSum = sum * this.CurrentDenom;
      const game = this.game;
      let bankBonusSum = 0;

      // Handle bet events
      if (adjustedSum > 0 && slotEvent === 'bet') {
        this.handleBetBankCalculation(adjustedSum);
      }

      if (bankBonusSum > 0) {
        const finalSum = adjustedSum - bankBonusSum;

        // Update bonus bank
        if (game && typeof (game as any).set_gamebank === 'function') {
          (game as any).set_gamebank(bankBonusSum, 'inc', 'bonus');
        } else {
          this.Bank = (this.Bank || 0) + bankBonusSum;
        }

        // Update main bank
        if (game && typeof (game as any).set_gamebank === 'function') {
          (game as any).set_gamebank(finalSum, 'inc', slotState);
          game.save();
        } else {
          this.Bank = (this.Bank || 0) + finalSum;
        }
      } else {
        // Update bank without bonus split
        if (game && typeof (game as any).set_gamebank === 'function') {
          (game as any).set_gamebank(adjustedSum, 'inc', slotState);
          game.save();
        } else {
          this.Bank = (this.Bank || 0) + adjustedSum;
        }
      }

      // Handle bet remains
      if (adjustedSum === 0 && slotEvent === 'bet' && this.betRemains !== null) {
        if (game && typeof (game as any).set_gamebank === 'function') {
          (game as any).set_gamebank(this.betRemains * this.CurrentDenom, 'inc', slotState);
          game.save();
        } else {
          this.Bank = (this.Bank || 0) + (this.betRemains * this.CurrentDenom);
        }
      }

      Log.debug('Bank updated', {
        slotState,
        sum,
        adjustedSum,
        bankBonusSum,
        newBank: this.GetBank(slotState)
      });

      return game;

    } catch (error) {
      Log.error('Error setting bank', { slotState, sum, slotEvent, error });
      return null;
    }
  }

  /**
   * Handle bet-related bank calculations
   */
  private handleBetBankCalculation(adjustedSum: number): void {
    this.toGameBanks = 0;
    this.toSlotJackBanks = 0;
    this.toSysJackBanks = 0;
    this.betProfit = 0;

    const percentage = this.GetPercent();
    const percentageBonus = 10;
    const bankPercentage = percentage <= percentageBonus ? 0 : percentageBonus;
    const countBalance = this.count_balance || 0;
    const gameBet = adjustedSum / this.GetPercent() * 100;

    // Handle partial balance scenarios
    if (countBalance > 0 && countBalance < gameBet) {
      this.handlePartialBalanceBankCalculation(countBalance, gameBet, bankPercentage);
    } else if (countBalance > 0) {
      this.handleFullBalanceBankCalculation(gameBet, bankPercentage);
    }
  }

  /**
   * Handle bank calculation when balance is partially sufficient
   */
  private handlePartialBalanceBankCalculation(countBalance: number, gameBet: number, bankPercentage: number): void {
    const firstBid = countBalance;
    const secondBid = gameBet - countBalance;

    // Use betRemains0 if available
    const adjustedSecondBid = this.betRemains0 !== null ? this.betRemains0 : secondBid;

    const bankSum = firstBid / 100 * this.GetPercent();
    const totalSum = bankSum + adjustedSecondBid;

    // Calculate bonus sum
    const bonusSum = firstBid / 100 * bankPercentage;

    // Set the amounts
    this.toGameBanks = totalSum;
    this.toSlotJackBanks = bonusSum;

    // Calculate profit
    this.betProfit = gameBet - this.toGameBanks - this.toSlotJackBanks - (this.toSysJackBanks || 0);
  }

  /**
   * Handle bank calculation when balance is fully sufficient
   */
  private handleFullBalanceBankCalculation(gameBet: number, bankPercentage: number): void {
    const bonusSum = gameBet / 100 * bankPercentage;

    this.toGameBanks = gameBet / 100 * this.GetPercent();
    this.toSlotJackBanks = bonusSum;

    // Calculate profit
    this.betProfit = gameBet - this.toGameBanks - this.toSlotJackBanks - (this.toSysJackBanks || 0);
  }

  /**
   * Get percentage value
   */
  public GetPercent(): number {
    return this.Percent || 10;
  }

  /**
   * Get user count balance
   */
  public GetCountBalanceUser(): number {
    return this.user?.count_balance || 0;
  }

  // ===== JACKPOT MANAGEMENT =====

  /**
   * Update jackpots based on bet amount
   */
  public UpdateJackpots(bet: number): void {
    try {
      if (!this.jpgs || this.jpgs.length === 0) {
        Log.debug('No jackpots to update');
        return;
      }

      const adjustedBet = bet * this.CurrentDenom;
      const countBalance = this.count_balance || 0;
      const jsum: number[] = [];
      let payJack = 0;

      Log.debug('Updating jackpots', {
        bet,
        adjustedBet,
        countBalance,
        jpgCount: this.jpgs.length
      });

      for (let i = 0; i < this.jpgs.length; i++) {
        const jpg = this.jpgs[i];

        // Get JPG properties with safe defaults
        const jpgBalance = jpg?.balance ?? 0;
        const jpgPercent = jpg?.percent ?? 10;
        const jpgUserId = jpg?.user_id ?? null;
        const jpgStartBalance = jpg?.start_balance ?? 0;

        // Calculate jackpot sum
        if (countBalance === 0 || this.jpgPercentZero) {
          jsum[i] = jpgBalance;
        } else if (countBalance < adjustedBet) {
          jsum[i] = countBalance / 100 * jpgPercent + jpgBalance;
        } else {
          jsum[i] = adjustedBet / 100 * jpgPercent + jpgBalance;
        }

        // Determine if jackpot should pay (simplified logic)
        const payThreshold = jsum[i] * 0.1; // 10% threshold
        const currentPaySum = jpgBalance * 0.05; // 5% of current balance

        if (currentPaySum < jsum[i] && currentPaySum > 0 && jpg) {
          const userId = this.user?.id?.toString() || '0';

          // Check if user is eligible for this jackpot
          if (!jpgUserId || jpgUserId.toString() === userId) {
            payJack = currentPaySum / this.CurrentDenom;
            jsum[i] = jsum[i] - currentPaySum;

            // Update user balance
            this.SetBalance(currentPaySum / this.CurrentDenom);

            // Double check (keeping original PHP logic)
            if (currentPaySum > 0) {
              const userId2 = this.user?.id?.toString() || '0';
              if (!jpgUserId || jpgUserId.toString() === userId2) {
                payJack = currentPaySum / this.CurrentDenom;
                jsum[i] = jsum[i] - currentPaySum;
                this.SetBalance(currentPaySum / this.CurrentDenom);
                this.Jackpots['jackPay'] = payJack;
              }
            }
          }
        }

        // Update jackpot balance
        if (jpg && jsum[i] !== undefined) {
          jpg.balance = jsum[i]!;
          jpg.save();
        }

        // Check minimum balance threshold
        const minBalance = jpgStartBalance * 0.5; // 50% of start balance
        if (jsum[i] !== undefined && jsum[i] < minBalance && jpgStartBalance > 0 && jsum[i] > 0 && jpg) {
          const summ = jpgStartBalance;
          jsum[i] = jsum[i]! + summ;
          jpg.balance = jsum[i]!;
          jpg.save();
        }
      }

      if (payJack > 0) {
        this.Jackpots['jackPay'] = payJack.toFixed(2);
        Log.info('Jackpot paid', { payJack });
      }

      Log.debug('Jackpot update completed', { payJack: payJack > 0 ? payJack : null });

    } catch (error) {
      Log.error('Error updating jackpots', { bet, error });
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * Format float number to proper precision
   */
  public FormatFloat(num: number): number {
    const str0 = num.toString().split('.');
    if (str0[1]) {
      if (str0[1].length > 4) {
        return Math.round(num * 100) / 100;
      } else if (str0[1].length > 2) {
        return Math.floor(num * 100) / 100;
      } else {
        return num;
      }
    } else {
      return num;
    }
  }

  /**
   * Get random pay amount based on RTP logic
   */
  public GetRandomPay(): number {
    const allRate: number[] = [];

    // Collect all positive paytable values
    if (Array.isArray(this.Paytable)) {
      for (const vl of this.Paytable) {
        if (Array.isArray(vl)) {
          for (const vl2 of vl) {
            if (vl2 > 0) {
              allRate.push(vl2);
            }
          }
        }
      }
    }

    // Shuffle array (basic implementation)
    for (let i = allRate.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = allRate[i]!;
      allRate[i] = allRate[j]!;
      allRate[j] = temp;
    }

    // Check RTP constraints
    const gameStatIn = this.game?.stat_in || 0;
    const gameStatOut = this.game?.stat_out || 0;
    const randomPay = allRate[0] || 0;

    if (gameStatIn < (gameStatOut + (randomPay * this.AllBet))) {
      return 0;
    }

    return randomPay;
  }

  /**
   * Check bonus win percentage
   */
  public CheckBonusWin(): number {
    let allRateCnt = 0;
    let allRate = 0;

    if (Array.isArray(this.Paytable)) {
      for (const vl of this.Paytable) {
        if (Array.isArray(vl)) {
          for (const vl2 of vl) {
            if (vl2 > 0) {
              allRateCnt++;
              allRate += vl2;
              break;
            }
          }
        }
      }
    }

    return allRateCnt > 0 ? allRate / allRateCnt : 0;
  }

  /**
   * Get game history
   */
  public GetHistory(): any {
    try {
      const history = this.betLogs;
      this.lastEvent = null;

      if (Array.isArray(history)) {
        for (const log of history) {
          if (log?.str) {
            try {
              const tmpLog = JSON.parse(log.str);
              if (tmpLog.responseEvent !== 'gambleResult' && tmpLog.responseEvent !== 'jackpot') {
                this.lastEvent = log.str;
                break;
              }
            } catch (parseError) {
              Log.warning('Failed to parse log entry', { log: log.str });
            }
          }
        }
      }

      if (this.lastEvent) {
        try {
          return JSON.parse(this.lastEvent);
        } catch (error) {
          Log.warning('Failed to parse last event', { error });
        }
      }

      return null;

    } catch (error) {
      Log.error('Error getting history', { error });
      return null;
    }
  }

  /**
   * Get gamble settings
   */
  public GetGambleSettings(): number {
    return Math.floor(Math.random() * (this.WinGamble[0] || 100)) + 1;
  }

  /**
   * Save log report
   */
  public SaveLogReport(response: any, allbet: number, lines: number, reportWin: number, slotEvent: string): void {
    this.logReport.push({
      response,
      allbet,
      lines,
      reportWin,
      slotEvent
    });
    Log.debug('Log report saved', { slotEvent, allbet, lines, reportWin });
  }

  /**
   * Internal error handling
   */
  public InternalError(errcode: string): never {
    throw new Error(errcode);
  }

  /**
   * Internal error handling (silent)
   */
  public InternalErrorSilent(errcode: string): void {
    Log.info('Internal Error Silent: ' + errcode);

    this.errorLogReport.push({
      type: 'internal_error',
      error_code: errcode,
      timestamp: Math.floor(Date.now() / 1000),
      slot_id: this.slotId,
      player_id: this.playerId || undefined,
      balance: this.GetBalance(),
      game_state: this.getState(),
      backtrace: []
    });
  }

  /**
   * Get current game state for debugging and logging
   */
  public getState(): any {
    return {
      slotId: this.slotId,
      playerId: this.playerId,
      balance: this.GetBalance(),
      gameData: this.GameData,
      jackpots: this.Jackpots,
      logReport: this.logReport,
      errorLogReport: this.errorLogReport,
      internalError: this.internalError,
      user_balance: this.GetBalance(),
      game_bank: this.Bank,
      user: this.user,
      shop: this.shop,
      isActive: this.is_active(),
      denomination: this.CurrentDenom,
      currency: this.slotCurrency
    };
  }
}

export default BaseSlotSettings;