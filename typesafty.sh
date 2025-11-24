#!/bin/bash

# Define the target directory
TARGET_DIR="src/models"

# Ensure the directory exists
mkdir -p "$TARGET_DIR"

echo "Applying strict type safety to models in $TARGET_DIR..."

# 1. Update User.ts
cat > "$TARGET_DIR/User.ts" << 'EOF'
/**
 * User model for casino game system with change tracking and shop currency integration.
 * Refactored for Strict Type Safety.
 * * @package Casino Game System
 * @version 1.1.0
 */

import { BaseModel } from './BaseModel';

/**
 * User data interface defining the structure of user information
 */
export interface UserData {
  id: string;
  balance: number;
  shop_id: number;
  count_balance: number;
  address: number;
  session: string;
  is_blocked: boolean;
  status: string;
  remember_token?: string;
  last_bid?: string;
  shop: {
    currency: string;
  };
  level_data?: Record<string, number>;
}

/**
 * User model class with change tracking and shop currency integration
 */
export class User extends BaseModel<UserData> {
  // User properties
  public id: string;
  public balance: number;
  public shop_id: number;
  public count_balance: number;
  public address: number;
  public session: string;
  public is_blocked: boolean;
  public status: string;
  public remember_token?: string;
  public last_bid?: string;
  public shop: {
    currency: string;
  };
  public level_data?: Record<string, number>;

  /**
   * Constructor for User model
   * @param data Initial user data
   */
  constructor(data: Partial<UserData> = {}) {
    // Initialize default data structure
    const defaultData: UserData = {
      id: '0',
      balance: 0,
      shop_id: 0,
      count_balance: 0,
      address: 0,
      session: '',
      is_blocked: false,
      status: 'active',
      remember_token: undefined,
      last_bid: undefined,
      shop: {
        currency: 'USD'
      },
      level_data: {}
    };

    // Merge provided data with defaults
    // We handle nested object 'shop' specifically to prevent overwrite if partial data is passed
    const userData: UserData = {
      ...defaultData,
      ...data,
      shop: {
        currency: data.shop?.currency ?? defaultData.shop.currency
      },
      level_data: data.level_data ?? defaultData.level_data
    };

    super(userData);

    // Initialize properties from data
    this.id = userData.id;
    this.balance = userData.balance;
    this.shop_id = userData.shop_id;
    this.count_balance = userData.count_balance;
    this.address = userData.address;
    this.session = userData.session;
    this.is_blocked = userData.is_blocked;
    this.status = userData.status;
    this.remember_token = userData.remember_token;
    this.last_bid = userData.last_bid;
    this.shop = userData.shop;
    this.level_data = userData.level_data;
  }

  /**
   * Get the current state of the user model
   */
  getState(): UserData {
    return {
      id: this.id,
      balance: this.balance,
      shop_id: this.shop_id,
      count_balance: this.count_balance,
      address: this.address,
      session: this.session,
      is_blocked: this.is_blocked,
      status: this.status,
      remember_token: this.remember_token,
      last_bid: this.last_bid,
      shop: {
        currency: this.shop.currency
      },
      level_data: this.level_data
    };
  }

  /**
   * Override increment method to properly track balance changes
   */
  override increment(field: keyof UserData, amount: number = 1): void {
    if (field === 'balance' || field === 'count_balance' || field === 'address') {
      // Type assertion is safe here because we know these specific fields are numbers
      const currentValue = (this as any)[field] as number;
      const newValue = currentValue + amount;
      (this as any)[field] = newValue;

      this.changedData[field] = newValue as any;
      this.isModified = true;
    } else {
      super.increment(field, amount);
    }
  }

  /**
   * Override offsetSet to implement shop currency change tracking
   */
  override offsetSet(offset: string, value: any): void {
    // Safe access
    if (offset === 'shop') {
       const newCurrency = value?.currency ?? 'USD';
       this.shop.currency = newCurrency;
       this.changedData['shop'] = { currency: newCurrency };
       this.isModified = true;
       return;
    }

    // Standard property update via BaseModel logic
    super.offsetSet(offset, value);
  }

  isBanned(): boolean {
    return this.status === 'banned';
  }

  updateLevel(type: string, amount: number): void {
    if (!this.level_data) {
      this.level_data = {};
    }
    const currentValue = this.level_data[type] ?? 0;
    this.level_data[type] = currentValue + amount;

    this.changedData['level_data'] = this.level_data;
    this.isModified = true;
  }

  updateCountBalance(sum: number, current: number): number {
    this.count_balance = current + sum;
    this.changedData['count_balance'] = this.count_balance;
    this.isModified = true;
    return this.count_balance;
  }

  getShopCurrency(): string {
    return this.shop.currency;
  }

  setShopCurrency(currency: string): void {
    this.shop.currency = currency;
    this.changedData['shop'] = { currency: currency };
    this.isModified = true;
  }

  hasShopCurrencyChanged(): boolean {
    return this.isFieldChanged('shop');
  }

  getOriginalShopCurrency(): string {
    return this.getOriginalValue('shop')?.currency || 'USD';
  }

  block(): void {
    this.status = 'blocked';
    this.is_blocked = true;
    this.changedData['status'] = this.status;
    this.changedData['is_blocked'] = this.is_blocked;
    this.isModified = true;
  }

  unblock(): void {
    this.status = 'active';
    this.is_blocked = false;
    this.changedData['status'] = this.status;
    this.changedData['is_blocked'] = this.is_blocked;
    this.isModified = true;
  }

  activate(): void {
    this.status = 'active';
    this.changedData['status'] = this.status;
    this.isModified = true;
  }

  ban(): void {
    this.status = 'banned';
    this.changedData['status'] = this.status;
    this.isModified = true;
  }

  getBalanceInfo(): { balance: number; count_balance: number; currency: string } {
    return {
      balance: this.balance,
      count_balance: this.count_balance,
      currency: this.shop.currency
    };
  }

  hasSufficientBalance(amount: number): boolean {
    return this.balance >= amount;
  }

  deductBalance(amount: number): boolean {
    if (this.hasSufficientBalance(amount)) {
      this.increment('balance', -amount);
      return true;
    }
    return false;
  }

  addBalance(amount: number): void {
    this.increment('balance', amount);
  }
}
EOF

# 2. Update JPG.ts
cat > "$TARGET_DIR/JPG.ts" << 'EOF'
/**
 * JPG (Jackpot) model for casino game system.
 * Refactored for Strict Type Safety.
 * * @package Casino Game System
 * @version 1.1.0
 */

import { BaseModel } from './BaseModel';

export interface JPGData {
  id: number;
  shop_id: number;
  balance: number;
  percent: number;
  user_id: number | null;
  start_balance: number;
}

export class JPG extends BaseModel<JPGData> {
  public id: number;
  public shop_id: number;
  public balance: number;
  public percent: number;
  public user_id: number | null;
  public start_balance: number;

  constructor(data: Partial<JPGData> = {}) {
    const defaultData: JPGData = {
      id: 0,
      shop_id: 0,
      balance: 0.0,
      percent: 1.0,
      user_id: null,
      start_balance: 1000.0
    };

    const jpgData: JPGData = { ...defaultData, ...data };
    super(jpgData);

    this.id = jpgData.id;
    this.shop_id = jpgData.shop_id;
    this.balance = jpgData.balance;
    this.percent = jpgData.percent;
    this.user_id = jpgData.user_id;
    this.start_balance = jpgData.start_balance;
  }

  getState(): JPGData {
    return {
      id: this.id,
      shop_id: this.shop_id,
      balance: this.balance,
      percent: this.percent,
      user_id: this.user_id,
      start_balance: this.start_balance
    };
  }

  override increment(field: keyof JPGData, amount: number = 1): void {
    if (field === 'balance' || field === 'percent' || field === 'start_balance') {
      // Safe casting because we verified these fields are numbers in interface
      const currentValue = (this as any)[field] as number;
      const newValue = currentValue + amount;
      (this as any)[field] = newValue;
      this.changedData[field] = newValue as any;
      this.isModified = true;
    } else {
      super.increment(field, amount);
    }
  }

  getPaySum(): number {
    return this.balance > 10000 ? 1000.0 : 0.0;
  }

  getMin(field: string): number {
    return this.start_balance * 0.5;
  }

  getStartBalance(): number {
    return this.start_balance;
  }

  addJpg(operation: string, amount: number): void {
    if (operation === 'add') {
      this.increment('balance', amount);
    }
  }

  setShopId(shop_id: number): void {
    const oldShopId = this.shop_id;
    this.shop_id = shop_id;
    if (oldShopId !== shop_id) {
      this.changedData['shop_id'] = shop_id;
      this.isModified = true;
    }
  }

  setUserId(user_id: number | null): void {
    const oldUserId = this.user_id;
    this.user_id = user_id;
    if (oldUserId !== user_id) {
      this.changedData['user_id'] = user_id;
      this.isModified = true;
    }
  }

  setPercent(percent: number): void {
    const oldPercent = this.percent;
    this.percent = percent;
    if (oldPercent !== percent) {
      this.changedData['percent'] = percent;
      this.isModified = true;
    }
  }

  setStartBalance(start_balance: number): void {
    const oldStartBalance = this.start_balance;
    this.start_balance = start_balance;
    if (oldStartBalance !== start_balance) {
      this.changedData['start_balance'] = start_balance;
      this.isModified = true;
    }
  }

  isEligibleForPayout(): boolean {
    return this.balance > 10000;
  }

  getInfo() {
    return {
      id: this.id,
      shop_id: this.shop_id,
      balance: this.balance,
      percent: this.percent,
      user_id: this.user_id,
      start_balance: this.start_balance,
      is_eligible: this.isEligibleForPayout(),
      pay_sum: this.getPaySum()
    };
  }

  toArray(): Record<string, any> {
    return this.getState();
  }
}
EOF

# 3. Update StatGame.ts
cat > "$TARGET_DIR/StatGame.ts" << 'EOF'
/**
 * StatGame model for casino game statistics tracking.
 * Refactored for Strict Type Safety.
 * * @package Casino Game System
 * @version 1.1.0
 */

import { BaseModel } from './BaseModel';

export interface StatGameData {
  id: number;
  user_id: number;
  balance: number;
  bet: number;
  win: number;
  game: string;
  in_game: number;
  in_jpg: number;
  in_profit: number;
  denomination: number;
  shop_id: number;
  slots_bank: number;
  bonus_bank: number;
  fish_bank: number;
  table_bank: number;
  little_bank: number;
  total_bank: number;
  date_time: string;
}

export class StatGame extends BaseModel<StatGameData> {
  public id: number;
  public user_id: number;
  public game: string;
  public shop_id: number;
  public balance: number;
  public bet: number;
  public win: number;
  public in_game: number;
  public in_jpg: number;
  public in_profit: number;
  public denomination: number;
  public slots_bank: number;
  public bonus_bank: number;
  public fish_bank: number;
  public table_bank: number;
  public little_bank: number;
  public total_bank: number;
  public date_time: string;

  constructor(data: Partial<StatGameData> = {}) {
    const defaultData: StatGameData = {
      id: 0,
      user_id: 0,
      balance: 0.0,
      bet: 0.0,
      win: 0.0,
      game: '',
      in_game: 0.0,
      in_jpg: 0.0,
      in_profit: 0.0,
      denomination: 1.0,
      shop_id: 0,
      slots_bank: 0.0,
      bonus_bank: 0.0,
      fish_bank: 0.0,
      table_bank: 0.0,
      little_bank: 0.0,
      total_bank: 0.0,
      date_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const statData: StatGameData = { ...defaultData, ...data };
    super(statData);

    this.id = statData.id;
    this.user_id = statData.user_id;
    this.game = statData.game;
    this.shop_id = statData.shop_id;
    this.balance = statData.balance;
    this.bet = statData.bet;
    this.win = statData.win;
    this.in_game = statData.in_game;
    this.in_jpg = statData.in_jpg;
    this.in_profit = statData.in_profit;
    this.denomination = statData.denomination;
    this.slots_bank = statData.slots_bank;
    this.bonus_bank = statData.bonus_bank;
    this.fish_bank = statData.fish_bank;
    this.table_bank = statData.table_bank;
    this.little_bank = statData.little_bank;
    this.total_bank = statData.total_bank;
    this.date_time = statData.date_time;
  }

  getState(): StatGameData {
    return {
      id: this.id,
      user_id: this.user_id,
      balance: this.balance,
      bet: this.bet,
      win: this.win,
      game: this.game,
      in_game: this.in_game,
      in_jpg: this.in_jpg,
      in_profit: this.in_profit,
      denomination: this.denomination,
      shop_id: this.shop_id,
      slots_bank: this.slots_bank,
      bonus_bank: this.bonus_bank,
      fish_bank: this.fish_bank,
      table_bank: this.table_bank,
      little_bank: this.little_bank,
      total_bank: this.total_bank,
      date_time: this.date_time
    };
  }

  static create(data: StatGameData): StatGame {
    return new StatGame(data);
  }

  toArray(): StatGameData {
    return this.getState();
  }

  getNetResult(): number {
    return this.win - this.bet;
  }

  getWinRate(): number {
    if (this.bet <= 0) return 0;
    return (this.win / this.bet) * 100;
  }

  updateBalance(newBalance: number): void {
    this.balance = newBalance;
    this.calculateFinancialTotals();
  }

  updateBet(betAmount: number): void {
    this.bet = betAmount;
  }

  updateWin(winAmount: number): void {
    this.win = winAmount;
    this.calculateFinancialTotals();
  }

  private calculateFinancialTotals(): void {
    this.in_game = this.getNetResult();
    this.total_bank = this.slots_bank + this.bonus_bank + this.fish_bank + this.table_bank + this.little_bank;
    this.in_profit = this.in_game + this.in_jpg;
  }

  updateBankAmount(bankType: keyof Pick<StatGameData, 'slots_bank' | 'bonus_bank' | 'fish_bank' | 'table_bank' | 'little_bank'>, amount: number): void {
    this[bankType] = amount;
    this.calculateFinancialTotals();
  }
}
EOF

# 4. Update GameBank.ts
cat > "$TARGET_DIR/GameBank.ts" << 'EOF'
/**
 * GameBank model for casino game system.
 * Refactored for Strict Type Safety.
 * * @package Casino Game System
 * @version 1.1.0
 */

import { BaseModel } from './BaseModel';

export interface GameBankData {
  id: number;
  shop_id: number;
  balance: number;
}

interface QueryBuilder {
  where(conditions: Partial<GameBankData>): GameBank;
  lockForUpdate(): GameBank;
  get(): GameBank[];
  first(): GameBank | null;
}

export class GameBank extends BaseModel<GameBankData> implements QueryBuilder {
  public id: number;
  public shop_id: number;
  public balance: number;

  constructor(data: Partial<GameBankData> = {}) {
    const defaultData: GameBankData = {
      id: 0,
      shop_id: 0,
      balance: 0.0
    };

    const bankData: GameBankData = { ...defaultData, ...data };
    super(bankData);

    this.id = bankData.id;
    this.shop_id = bankData.shop_id;
    this.balance = bankData.balance;
  }

  getState(): GameBankData {
    return {
      id: this.id,
      shop_id: this.shop_id,
      balance: this.balance
    };
  }

  where(conditions: Partial<GameBankData>): GameBank {
    const updatedData = { ...this.getState(), ...conditions };
    return new GameBank(updatedData);
  }

  lockForUpdate(): GameBank {
    return this;
  }

  get(): GameBank[] {
    return this.id > 0 ? [this] : [];
  }

  first(): GameBank | null {
    return this.id > 0 ? this : null;
  }

  override increment(field: keyof GameBankData, amount: number = 1): void {
    if (field === 'balance') {
      const currentValue = this.balance;
      const newValue = currentValue + amount;
      this.balance = newValue;
      this.changedData['balance'] = newValue;
      this.isModified = true;
    } else {
      super.increment(field, amount);
    }
  }

  setBalance(balance: number): void {
    const oldBalance = this.balance;
    this.balance = balance;
    if (oldBalance !== balance) {
      this.changedData['balance'] = balance;
      this.isModified = true;
    }
  }

  setShopId(shop_id: number): void {
    const oldShopId = this.shop_id;
    this.shop_id = shop_id;
    if (oldShopId !== shop_id) {
      this.changedData['shop_id'] = shop_id;
      this.isModified = true;
    }
  }

  addToBalance(amount: number): void {
    this.increment('balance', amount);
  }

  deductFromBalance(amount: number): boolean {
    if (this.balance >= amount) {
      this.increment('balance', -amount);
      return true;
    }
    return false;
  }

  hasSufficientBalance(amount: number): boolean {
    return this.balance >= amount;
  }

  toArray(): Record<string, any> {
    return this.getState();
  }

  static find(id: number): GameBank | null {
    if (id > 0) return new GameBank({ id, shop_id: 1, balance: 1000.0 });
    return null;
  }

  static findByShopId(shop_id: number): GameBank | null {
    if (shop_id > 0) return new GameBank({ id: 1, shop_id, balance: 1000.0 });
    return null;
  }

  static create(data: Partial<GameBankData>): GameBank {
    return new GameBank({
      id: Date.now(),
      shop_id: data.shop_id || 0,
      balance: data.balance || 0.0
    });
  }
}
EOF

# 5. Update GameLog.ts
cat > "$TARGET_DIR/GameLog.ts" << 'EOF'
/**
 * GameLog model for casino game logging system.
 * Refactored for Strict Type Safety.
 * * @package Casino Game System
 * @version 1.1.0
 */

import { BaseModel } from './BaseModel';

export interface GameLogData {
  id: number;
  game_id: number;
  user_id: number;
  ip: string;
  str: string;
  shop_id: number;
}

export class GameLog extends BaseModel<GameLogData> {
  public id: number;
  public game_id: number;
  public user_id: number;
  public ip: string;
  public str: string;
  public shop_id: number;

  constructor(data: Partial<GameLogData> = {}) {
    const defaultData: GameLogData = {
      id: 0,
      game_id: 0,
      user_id: 0,
      ip: '',
      str: '',
      shop_id: 0
    };

    const logData: GameLogData = { ...defaultData, ...data };
    super(logData);

    this.id = logData.id;
    this.game_id = logData.game_id;
    this.user_id = logData.user_id;
    this.ip = logData.ip;
    this.str = logData.str;
    this.shop_id = logData.shop_id;
  }

  getState(): GameLogData {
    return {
      id: this.id,
      game_id: this.game_id,
      user_id: this.user_id,
      ip: this.ip,
      str: this.str,
      shop_id: this.shop_id
    };
  }

  static whereRaw(query: string, bindings: any[] = []): GameLog {
    const gameId = typeof bindings[0] === 'number' ? bindings[0] : 0;
    const userId = typeof bindings[1] === 'number' ? bindings[1] : 0;
    
    return new GameLog({
      game_id: gameId,
      user_id: userId
    });
  }

  get(): GameLog[] {
    return [this];
  }

  static create(data: Partial<GameLogData>): GameLog {
    return new GameLog(data);
  }

  toArray(): GameLogData {
    return this.getState();
  }

  isValid(): boolean {
    return this.game_id > 0 && this.user_id > 0;
  }
}
EOF

# 6. Update Session.ts
cat > "$TARGET_DIR/Session.ts" << 'EOF'
/**
 * Session model for casino game session management.
 * Refactored for Strict Type Safety.
 * * @package Casino Game System
 * @version 1.1.0
 */

import { BaseModel } from './BaseModel';

export interface SessionData {
  id: number;
  user_id: number;
  payload: string;
}

export class Session extends BaseModel<SessionData> {
  public id: number;
  public user_id: number;
  public payload: string;

  constructor(data: Partial<SessionData> = {}) {
    const defaultData: SessionData = {
      id: 0,
      user_id: 0,
      payload: ''
    };

    const sessionData: SessionData = { ...defaultData, ...data };
    super(sessionData);

    this.id = sessionData.id;
    this.user_id = sessionData.user_id;
    this.payload = sessionData.payload;
  }

  getState(): SessionData {
    return {
      id: this.id,
      user_id: this.user_id,
      payload: this.payload
    };
  }

  static where(field: keyof SessionData, value: any): Session {
    return new Session({ [field]: value });
  }

  static whereUserId(userId: number): Session {
    return new Session({ user_id: userId });
  }

  delete(): void {
    // Stateless mock
  }

  toArray(): SessionData {
    return this.getState();
  }

  isActive(): boolean {
    return this.user_id > 0;
  }

  setPayload(payloadData: string): void {
    this.payload = payloadData;
    this.changedData['payload'] = payloadData;
    this.isModified = true;
  }
}
EOF

# 7. Update ModelFactory.ts
cat > "$TARGET_DIR/ModelFactory.ts" << 'EOF'
/**
 * ModelFactory for Casino Game System
 * Refactored for Strict Type Safety and Generic Support.
 * * @package Casino Game System
 * @version 1.1.0
 */

import { User, UserData } from './User';
import { Game, GameData } from './Game';
import { Shop, ShopData } from './Shop';
import { JPG, JPGData } from './JPG';
import { Banker } from './Banker';
import { GameBank, GameBankData } from './GameBank';
import { GameLog, GameLogData } from './GameLog';
import { Session, SessionData } from './Session';
import { StatGame, StatGameData } from './StatGame';
import { BaseModel } from './BaseModel';

export type ModelClass = User | Game | Shop | JPG | GameBank | GameLog | Session | StatGame;

export class ModelFactory {
  // ================================
  // SINGLE MODEL CREATION
  // ================================

  static createUser(data: Partial<UserData> = {}): User {
    return new User(data);
  }

  static createGame(data: Partial<GameData> = { name: '' }): Game {
    return new Game(data as any); // Game cast is complex due to configs
  }

  static createShop(data: Partial<ShopData> = {}): Shop {
    return new Shop(data);
  }

  static createJPG(data: Partial<JPGData> = {}): JPG {
    return new JPG(data);
  }

  static getBanker(): typeof Banker {
    return Banker;
  }

  static createGameBank(data: Partial<GameBankData> = {}): GameBank {
    return new GameBank(data);
  }

  static createGameLog(data: Partial<GameLogData> = {}): GameLog {
    return new GameLog(data);
  }

  static createSession(data: Partial<SessionData> = {}): Session {
    return new Session(data);
  }

  static createStatGame(data: Partial<StatGameData> = {}): StatGame {
    return new StatGame(data);
  }

  // ================================
  // BATCH MODEL CREATION
  // ================================

  static createUsers(users: Partial<UserData>[] = []): User[] {
    return users.map(data => this.createUser(data));
  }

  static createGames(games: Partial<GameData>[] = []): Game[] {
    return games.map(data => this.createGame(data));
  }

  // ================================
  // MODEL TO ARRAY CONVERSION
  // ================================

  /**
   * Convert model to its strictly typed data structure
   */
  static toArray<T extends Record<string, any>>(model: BaseModel<T>): T {
    return model.getState();
  }

  static toArrayOfArrays<T extends Record<string, any>>(models: BaseModel<T>[]): T[] {
    return models.map(model => model.getState());
  }

  // ================================
  // UTILITY METHODS
  // ================================

  static createByType(type: string, data: any = {}): ModelClass | typeof Banker | null {
    switch (type.toLowerCase()) {
      case 'user': return this.createUser(data);
      case 'game': return this.createGame(data);
      case 'shop': return this.createShop(data);
      case 'jpg': return this.createJPG(data);
      case 'banker': return this.getBanker();
      case 'gamebank': return this.createGameBank(data);
      case 'gamelog': return this.createGameLog(data);
      case 'session': return this.createSession(data);
      case 'statgame': return this.createStatGame(data);
      default: return null;
    }
  }
}

export const Factory = ModelFactory;
export default ModelFactory;
EOF

echo "All models refactored successfully!"