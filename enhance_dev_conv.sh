#!/bin/bash

# Define directories
SRC_DIR="src"
UTILS_DIR="src/utils"
BASE_DIR="src/games/base"

# Ensure directories exist
mkdir -p "$UTILS_DIR"
mkdir -p "$BASE_DIR"

echo "Creating PHP Shim Library..."

# 1. Create src/utils/PHP.ts
cat > "$UTILS_DIR/PHP.ts" << 'EOF'
/**
 * PHP.ts
 * A compatibility layer to mimic common PHP functions used in legacy slot logic.
 * This reduces the cognitive load for agents converting PHP arrays to TS.
 */

export class PHP {
  
  /**
   * Mimics PHP rand(min, max) - Inclusive
   */
  static rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Mimics PHP array_rand(array, num)
   * Returns one or more random KEYS from the array
   */
  static array_rand(array: any[] | Record<string, any>, num: number = 1): any | any[] {
    const keys = Object.keys(array);
    if (keys.length === 0) return null;

    if (num === 1) {
      return keys[Math.floor(Math.random() * keys.length)];
    }

    const shuffled = keys.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  /**
   * Mimics PHP shuffle() - Sorts in place
   */
  static shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }

  /**
   * Mimics PHP array_count_values()
   * Returns object { "value": count }
   */
  static array_count_values(array: (string | number)[]): Record<string, number> {
    return array.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Mimics PHP in_array()
   */
  static in_array(needle: any, haystack: any[]): boolean {
    return haystack.includes(needle);
  }

  /**
   * Mimics PHP array_fill()
   */
  static array_fill(startIndex: number, num: number, value: any): any[] {
    return new Array(num).fill(value);
  }
}
EOF

echo "Enhancing SlotState with Unified Reel Access..."

# 2. Update src/games/base/SlotState.ts
# We are adding the 'Reels' property and 'reels' getter/setter aliases
cat > "$BASE_DIR/SlotState.ts" << 'EOF'
/**
 * SlotState.ts - Foundation Layer
 * Handles interfaces, model definitions, properties, and state persistence.
 */

import { User, type UserData } from '../../models/User';
import { Game, type GameData } from '../../models/Game';
import { Shop, type ShopData } from '../../models/Shop';
import { JPG, type JPGData } from '../../models/JPG';
import { Log } from '../../utils/Log';
import { GameReel } from '../../utils/GameReel';

// --- Interfaces ---
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

export interface GameDataEntry {
  timelife: number;
  payload: any;
}

export interface LogReportEntry {
  response: any;
  allbet: number;
  lines: number;
  reportWin: number;
  slotEvent: string;
}

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

export interface KeyControllerMap {
  [key: string]: string;
}

/**
 * SlotState - The base class holding all properties and persistence logic.
 */
export class SlotState {
  // ===== PROPERTIES =====
  
  // Unified Reel Access (Crucial for Agent conversion)
  // Maps reelStrip1..6 to a 0-indexed array for loop-based logic
  public Reels: string[][] = [];

  // Legacy Reel Strips (Kept for compatibility with raw PHP porting)
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

  // Core Configuration
  public slotDBId: string = '';
  public Line: number[] | null = null;
  public scaleMode: number | null = null;
  public numFloat: number | null = null;
  public gameLine: number[] | null = null;
  public Bet: string[] | number[] | null = null;
  public SymbolGame: string[] = [];
  public GambleType: number | null = null;
  public lastEvent: string | null = null;
  public keyController: KeyControllerMap = {};
  public slotViewState: string | null = null;
  public hideButtons: string[] | null = null;
  public slotReelsConfig: any = null;
  public slotExitUrl: string | null = null;
  public slotBonusType: number | null = null;
  public slotScatterType: number | null = null;
  public slotGamble: boolean | null = null;
  public slotSounds: string[] = [];
  public slotFastStop: number | null = null;

  // Financial State
  public betRemains: number | null = null;
  public betRemains0: number | null = null;
  public toGameBanks: number | null = null;
  public toSlotJackBanks: number | null = null;
  public toSysJackBanks: number | null = null;
  public betProfit: number | null = null;
  public slotJackPercent: number[] = [];
  public slotJackpot: number[] = [];
  public increaseRTP: number | null = null;

  // Models
  public user: User | null = null;
  public game: Game | null = null;
  public shop: Shop | null = null;
  public jpgs: JPG[] | null = null;

  // Data Persistence
  public gameData: Record<string, GameDataEntry> = {};
  public gameDataStatic: Record<string, GameDataEntry> = {};
  public betLogs: any = null;
  public logReport: LogReportEntry[] = [];
  public errorLogReport: ErrorLogReportEntry[] = [];
  public internalError: any[] = [];

  // General State
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
  public shop_id: number | null = null;
  public currency: string | null = null;
  public jpgPercentZero: boolean = false;
  public count_balance: number | null = null;

  // Bonus State
  public slotBonus: boolean | null = null;
  public isBonusStart: boolean | null = null;
  public slotFreeMpl: number = 1;
  public slotWildMpl: number = 1;
  public slotFreeCount: number | number[] = 1;
  
  protected goldsvetData: any;

  // ===== PERSISTENCE METHODS =====

  public SetGameData(key: string, value: any): void {
    const timeLife = 86400; // 24 hours
    this.gameData[key] = {
      timelife: Date.now() / 1000 + timeLife,
      payload: value
    };
  }

  public GetGameData(key: string): any {
    if (this.gameData[key]) {
      const payload = this.gameData[key].payload;
      return Array.isArray(payload) ? payload : (payload ?? []);
    }
    return [];
  }

  public HasGameData(key: string): boolean {
    return key in this.gameData;
  }

  public SaveGameData(): void {
    if (this.user) {
      try {
        this.user.session = JSON.stringify(this.gameData);
        this.user.save();
      } catch (error) {
        Log.error('Error saving game data', { error });
      }
    }
  }

  public SetGameDataStatic(key: string, value: any): void {
    const timeLife = 86400;
    this.gameDataStatic[key] = {
      timelife: Date.now() / 1000 + timeLife,
      payload: value
    };
  }

  public GetGameDataStatic(key: string): any {
    if (this.gameDataStatic[key]) {
      const data = this.gameDataStatic[key];
      if (typeof data === 'object' && data !== null && 'payload' in data) {
        return (data as GameDataEntry).payload;
      }
      return data;
    }
    return 0;
  }

  public HasGameDataStatic(key: string): boolean {
    return key in this.gameDataStatic;
  }

  public SaveGameDataStatic(): void {
    if (this.game) {
      try {
        this.game.advanced = JSON.stringify(this.gameDataStatic);
        this.game.save();
      } catch (error) {
        Log.error('Error saving static game data', { error });
      }
    }
  }

  // ===== LOGGING & ERROR METHODS =====

  public SaveLogReport(response: any, allbet: number, lines: number, reportWin: number, slotEvent: string): void {
    this.logReport.push({ response, allbet, lines, reportWin, slotEvent });
  }

  public InternalError(errcode: string): never {
    throw new Error(errcode);
  }

  public InternalErrorSilent(errcode: string): void {
    this.internalError.push(errcode);
    Log.error('Internal Error Silent', { errcode });
  }

  // ===== INITIALIZATION HELPERS =====

  protected safeUnserialize(data: string, defaultValue: any = []): any {
    if (typeof data !== 'string' || data.length === 0) return defaultValue;
    try {
      if (data.startsWith('{') || data.startsWith('[')) {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : defaultValue;
      }
      return data;
    } catch (error) {
      return defaultValue;
    }
  }

  protected cleanupExpiredData(data: any[]): any[] {
    if (!Array.isArray(data)) return data;
    const currentTime = Date.now() / 1000;
    return data.filter((entry) => {
      if (typeof entry === 'object' && entry !== null && 'timelife' in entry) {
        return entry.timelife > currentTime;
      }
      return true;
    });
  }
}
EOF

echo "Enhancing BaseSlotSettings with standard logic..."

# 3. Update src/games/base/BaseSlotSettings.ts
cat > "$BASE_DIR/BaseSlotSettings.ts" << 'EOF'
/**
 * BaseSlotSettings.ts - Core Engine
 * The main entry point. Orchestrates initialization and defines Game API.
 * Extends SlotFinance to provide access to all features.
 */

import { SlotFinance } from './SlotFinance';
import { IGameSettings } from './SlotState';
import { User } from '../../models/User';
import { Game } from '../../models/Game';
import { Shop } from '../../models/Shop';
import { JPG } from '../../models/JPG';
import { GameReel } from '../../utils/GameReel';
import { Log } from '../../utils/Log';
import { UserStatusConstants } from '../../models/UserStatus';

export class BaseSlotSettings extends SlotFinance {
  
  constructor(settings: IGameSettings) {
    super(); // Initialize SlotState/SlotFinance properties

    Log.debug('Initializing BaseSlotSettings', { slotId: settings.slotId });

    try {
      this.initializeModels(settings);
      this.initializeGameDataSafely();
      this.initializeJPGs(settings.jpgs);
      this.initializeReelStrips(settings.reelStrips);
      this.initializeKeyController();
      this.initializeDenominations(settings.state);
      this.setupPlayerAndShopInfo(settings);
      this.initializeFinancialProperties(settings);

      Log.info('BaseSlotSettings initialized');
    } catch (error) {
      Log.error('Error during BaseSlotSettings initialization', { error });
      throw error;
    }
  }

  // ===== INITIALIZATION LOGIC =====

  private initializeModels(settings: IGameSettings): void {
    this.user = settings.user ? new User(settings.user) : null;
    this.game = settings.game ? new Game({ ...settings.game, name: settings.game.name || 'Default Game' }) : null;
    this.shop = settings.shop ? new Shop(settings.shop) : null;
  }

  private initializeGameDataSafely(): void {
    if (this.user?.session) {
      const userSession = this.safeUnserialize(this.user.session, []);
      if (Array.isArray(userSession)) {
        this.gameData = this.cleanupExpiredData(userSession) as any;
      }
    }
    if (this.game?.advanced) {
      const gameAdvanced = this.safeUnserialize(this.game.advanced, []);
      if (Array.isArray(gameAdvanced)) {
        this.gameDataStatic = this.cleanupExpiredData(gameAdvanced) as any;
      }
    }
  }

  private initializeJPGs(jpgsData?: Partial<any>[]): void {
    if (!jpgsData || !Array.isArray(jpgsData)) {
      this.jpgs = [];
      return;
    }
    this.jpgs = jpgsData.map(j => j instanceof JPG ? j : new JPG(j));
  }

  private initializeReelStrips(reelStripsData?: Record<string, string[]>): void {
    if (!reelStripsData) return;
    
    const reelStrings: string[] = [];
    for (const [key, values] of Object.entries(reelStripsData)) {
      if (Array.isArray(values)) reelStrings.push(`${key}=${values.join(',')}`);
      else if (typeof values === 'string') reelStrings.push(values);
    }

    const reel = new GameReel(reelStrings);
    const stripNames = ['reelStrip1','reelStrip2','reelStrip3','reelStrip4','reelStrip5','reelStrip6'];
    
    // Auto-populate both legacy properties AND the new unified Reels array
    this.Reels = []; 
    for (const name of stripNames) {
      const strip = reel.getStrip(name);
      if (strip.length > 0) {
        (this as any)[name] = strip; // Legacy access
        this.Reels.push(strip);      // Unified access for loop logic
      }
    }
  }

  private initializeKeyController(): void {
    this.keyController = {
      '13': 'uiButtonSpin,uiButtonSkip',
      '49': 'uiButtonInfo',
      '187': 'uiButtonSpin'
    };
  }

  private initializeDenominations(state?: any): void {
    const denomStr = state?.goldsvetData?.denomination || '';
    this.Denominations = denomStr ? denomStr.split(',').map(Number) : [1.0];
    this.CurrentDenom = this.Denominations[0] || 1;
  }

  private setupPlayerAndShopInfo(settings: IGameSettings): void {
    this.shop_id = (this.shop?.id as number) ?? 0;
    this.playerId = settings.playerId || this.user?.id || null;
    
    // Fallback User
    if (this.user === null && this.playerId) {
      this.user = new User({ id: this.playerId, balance: settings.balance || 0 });
    }

    this.slotDBId = this.game?.id?.toString() || '0';
    this.Percent = this.shop?.percent || 10;
    this.MaxWin = this.shop?.max_win || 50000;
    this.slotCurrency = this.shop?.currency || 'USD';
  }

  private initializeFinancialProperties(settings: IGameSettings): void {
    this.Bank = settings.bank !== undefined ? settings.bank : (this.shop?.balance || 1000);
    this.Balance = settings.balance || 0;
    this.Jackpots = settings.jackpots || {};
    this.goldsvetData = settings.state?.goldsvetData || {};
    this.SymbolGame = settings.state?.goldsvetData?.symbol_game || [];
    this.Paytable = settings.state?.goldsvetData?.paytable || [];
  }

  // ===== CORE API (Virtual Methods) =====

  public GetSpinSettings(bet: number, lines: number, garantType: string = 'bet'): any[] {
    Log.warning('BaseSlotSettings.GetSpinSettings called. Should be overridden.');
    return ['none', 0];
  }

  public GetReelStrips(winType: string, slotEvent: string): any {
    Log.warning('BaseSlotSettings.GetReelStrips called. Should be overridden.');
    return { rp: [] };
  }

  // ===== HELPERS FOR AGENTS =====

  /**
   * Helper to quickly check win on a standard line.
   * Simplifies converting complex PHP nested loops.
   */
  public calculateLineWin(lineId: number, symbolsOnLine: string[], betPerLine: number, wildSymbol: string): number {
    if (symbolsOnLine.length === 0) return 0;

    let matchCount = 1;
    let symbol = symbolsOnLine[0];

    // Handle first symbol being wild
    if (symbol === wildSymbol && symbolsOnLine.length > 1) {
      symbol = symbolsOnLine[1]; // Temporarily assume next symbol
      // If entire line is wild, it's a wild win
      if (symbolsOnLine.every(s => s === wildSymbol)) {
        symbol = wildSymbol;
      }
    }

    for (let i = 1; i < symbolsOnLine.length; i++) {
      const current = symbolsOnLine[i];
      if (current === symbol || current === wildSymbol) {
        matchCount++;
      } else {
        break;
      }
    }

    // Lookup paytable (assuming standard array structure)
    // Agents just need to populate this.Paytable correctly
    if (this.Paytable[symbol as any] && this.Paytable[symbol as any][matchCount]) {
      return this.Paytable[symbol as any][matchCount] * betPerLine;
    }
    return 0;
  }

  public is_active(): boolean {
    const gameView = this.game?.view ?? true;
    const shopBlocked = this.shop?.is_blocked ?? false;
    const userBlocked = this.user?.is_blocked ?? false;
    const userStatus = this.user?.status ?? '';
    const isBanned = userStatus === UserStatusConstants.BANNED;

    if (this.game && this.shop && this.user && (!gameView || shopBlocked || userBlocked || isBanned)) {
      if (this.user) this.user.remember_token = undefined;
      return false;
    }
    return true;
  }

  public GetHistory(): any {
    if (!this.betLogs) return null;
    return null; 
  }

  public GetRandomScatterPos(rp: any[]): number {
    const rpResult: number[] = [];
    return rpResult[0] || 0;
  }
}
EOF

echo "Developer Experience Enhancements Applied."