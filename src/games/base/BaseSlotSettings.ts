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
