/**
 * Shop model for casino game system with change tracking and ArrayAccess compatibility.
 * 
 * This class extends BaseModel to provide shop configuration management including
 * max win limits, percentage settings, and currency management.
 * 
 * @package Casino Game System
 * @version 1.0.0
 */

// Import BaseModel foundation
import { BaseModel } from './BaseModel';

/**
 * Shop data interface defining the structure of shop information
 */
export interface ShopData {
  id: string | number;
  max_win: number;
  percent: number;
  is_blocked: boolean;
  currency: string;
  balance: number;
}

/**
 * Shop model class with change tracking and ArrayAccess compatibility
 */
export class Shop extends BaseModel<ShopData> {

  // Shop properties
  public id: string | number;
  public max_win: number;
  public percent: number;
  public is_blocked: boolean;
  public currency: string;
  public balance: number;

  /**
   * Constructor for Shop model
   * @param data Initial shop data
   */
  constructor(data: ShopData) {
    // Initialize default data structure
    const defaultData: ShopData = {
      id: 0,
      max_win: 1000.0,
      percent: 10.0,
      is_blocked: false,
      currency: 'USD',
      balance: 1000
    };

    // Merge provided data with defaults
    const shopData: ShopData = {
      ...defaultData,
      ...data
    };

    super(shopData);

    // Initialize properties from data
    this.id = shopData.id;
    this.max_win = shopData.max_win;
    this.percent = shopData.percent;
    this.is_blocked = shopData.is_blocked;
    this.currency = shopData.currency;
    this.balance = shopData.balance;
  }

  /**
   * Get the current state of the shop model
   * @returns Current state as ShopData
   */
  getState(): ShopData {
    return {
      id: this.id,
      max_win: this.max_win,
      percent: this.percent,
      is_blocked: this.is_blocked,
      currency: this.currency,
      balance: this.balance
    };
  }


  isBlocked(): boolean {
    return this.is_blocked;
  }

  /**
   * Block the shop
   */
  block(): void {
    this.is_blocked = true;
    this.changedData['is_blocked'] = this.is_blocked;
    this.isModified = true;
  }

  /**
   * Unblock the shop
   */
  unblock(): void {
    this.is_blocked = false;
    this.changedData['is_blocked'] = this.is_blocked;
    this.isModified = true;
  }

  /**
   * Update max win limit with change tracking
   * @param max_win New maximum win limit
   */
  setMaxWin(max_win: number): void {
    const oldMaxWin = this.max_win;
    this.max_win = max_win;

    if (oldMaxWin !== max_win) {
      this.changedData['max_win'] = max_win;
      this.isModified = true;
    }
  }

  /**
   * Update shop percentage with change tracking
   * @param percent New percentage value
   */
  setPercent(percent: number): void {
    const oldPercent = this.percent;
    this.percent = percent;

    if (oldPercent !== percent) {
      this.changedData['percent'] = percent;
      this.isModified = true;
    }
  }

  /**
   * Update currency with change tracking
   * @param currency New currency code
   */
  setCurrency(currency: string): void {
    const oldCurrency = this.currency;
    this.currency = currency;

    if (oldCurrency !== currency) {
      this.changedData['currency'] = currency;
      this.isModified = true;
    }
  }

  /**
   * Get shop configuration summary
   * @returns Object with shop configuration details
   */
  getConfig(): { max_win: number; percent: number; currency: string; is_blocked: boolean } {
    return {
      max_win: this.max_win,
      percent: this.percent,
      currency: this.currency,
      is_blocked: this.is_blocked
    };
  }

  /**
   * Check if shop can process wins up to specified amount
   * @param winAmount Amount to check
   * @returns true if shop can process the win amount, false otherwise
   */
  canProcessWin(winAmount: number): boolean {
    return !this.is_blocked && winAmount <= this.max_win;
  }

  /**
   * Convert shop data to array format for serialization
   * @returns Object representation of shop data
   */
  toArray(): Record<string, any> {
    return {
      id: this.id,
      max_win: this.max_win,
      percent: this.percent,
      is_blocked: this.is_blocked,
      currency: this.currency
    };
  }
}