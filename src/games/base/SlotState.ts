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
