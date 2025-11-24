/**
 * User model for casino game system with change tracking and shop currency integration.
 * 
 * This class extends BaseModel to provide user balance management, session tracking,
 * and critical shop currency change detection functionality.
 * 
 * @package Casino Game System
 * @version 1.0.0
 */

// Import BaseModel foundation
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
 * Shop currency change tracking interface
 */
interface ShopCurrencyChange {
  currency: string;
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
    const userData: UserData = {
      ...defaultData,
      ...data,
      shop: {
        currency: data.shop?.currency ?? 'USD'
      }
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
    this.level_data = userData.level_data || {};
  }

  /**
   * Get the current state of the user model
   * @returns Current state as UserData
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
   * @param field Name of the field to increment
   * @param amount Amount to increment by (default: 1)
   */
  override increment(field: keyof UserData, amount: number = 1): void {
    if (field === 'balance' || field === 'count_balance' || field === 'address') {
      const currentValue = (this as any)[field] ?? 0;
      const newValue = currentValue + amount;
      (this as any)[field] = newValue;

      this.changedData[field] = newValue;
      this.isModified = true;
    } else {
      // Use parent method for other fields
      super.increment(field, amount);
    }
  }

  /**
   * Override offsetSet to implement shop currency change tracking
   * This mirrors the critical __set logic from the PHP version
   * @param offset Property name
   * @param value New value
   */
  override offsetSet(offset: string, value: any): void {
    const oldValue = (this as any)[offset] ?? null;
    (this as any)[offset] = value;

    // Special handling for shop object to track its currency changes
    if (offset === 'shop') {
      (this.changedData as any)[offset] = {
        currency: value?.currency ?? 'USD'
      };
      this.isModified = true;
    } else if (oldValue !== value) {
      (this.changedData as any)[offset] = value;
      this.isModified = true;
    }
  }

  /**
   * Check if the user is banned
   * @returns true if user status is 'banned', false otherwise
   */
  isBanned(): boolean {
    return this.status === 'banned';
  }

  /**
   * Update level data for a specific type
   * @param type Level type to update
   * @param amount Amount to add to the level
   */
  updateLevel(type: string, amount: number): void {
    if (!this.level_data) {
      this.level_data = {};
    }

    const currentValue = this.level_data[type] ?? 0;
    this.level_data[type] = currentValue + amount;

    this.changedData['level_data'] = this.level_data;
    this.isModified = true;
  }

  /**
   * Update count balance with sum and current value
   * @param sum Amount to add
   * @param current Current base amount
   * @returns New count_balance value
   */
  updateCountBalance(sum: number, current: number): number {
    this.count_balance = current + sum;
    this.changedData['count_balance'] = this.count_balance;
    this.isModified = true;
    return this.count_balance;
  }

  /**
   * Get shop currency information
   * @returns Current shop currency
   */
  getShopCurrency(): string {
    return this.shop.currency;
  }

  /**
   * Update shop currency with change tracking
   * @param currency New currency code
   */
  setShopCurrency(currency: string): void {
    const oldCurrency = this.shop.currency;
    this.shop.currency = currency;

    // Track the currency change
    this.changedData['shop'] = {
      currency: currency
    } as any;
    this.isModified = true;
  }

  /**
   * Check if shop currency has changed
   * @returns true if currency was changed, false otherwise
   */
  hasShopCurrencyChanged(): boolean {
    return this.isFieldChanged('shop');
  }

  /**
   * Get the original shop currency
   * @returns Original currency value
   */
  getOriginalShopCurrency(): string {
    return this.getOriginalValue('shop')?.currency || 'USD';
  }

  /**
   * Block the user
   */
  block(): void {
    this.status = 'blocked';
    this.is_blocked = true;
    this.changedData['status'] = this.status;
    this.changedData['is_blocked'] = this.is_blocked;
    this.isModified = true;
  }

  /**
   * Unblock the user
   */
  unblock(): void {
    this.status = 'active';
    this.is_blocked = false;
    this.changedData['status'] = this.status;
    this.changedData['is_blocked'] = this.is_blocked;
    this.isModified = true;
  }

  /**
   * Activate the user
   */
  activate(): void {
    this.status = 'active';
    this.changedData['status'] = this.status;
    this.isModified = true;
  }

  /**
   * Ban the user
   */
  ban(): void {
    this.status = 'banned';
    this.changedData['status'] = this.status;
    this.isModified = true;
  }

  /**
   * Get user balance information
   * @returns Object with balance details
   */
  getBalanceInfo(): { balance: number; count_balance: number; currency: string } {
    return {
      balance: this.balance,
      count_balance: this.count_balance,
      currency: this.shop.currency
    };
  }

  /**
   * Check if user has sufficient balance
   * @param amount Amount to check
   * @returns true if user has sufficient balance, false otherwise
   */
  hasSufficientBalance(amount: number): boolean {
    return this.balance >= amount;
  }

  /**
   * Deduct balance with change tracking
   * @param amount Amount to deduct
   * @returns true if deduction was successful, false otherwise
   */
  deductBalance(amount: number): boolean {
    if (this.hasSufficientBalance(amount)) {
      this.increment('balance', -amount);
      return true;
    }
    return false;
  }

  /**
   * Add balance with change tracking
   * @param amount Amount to add
   */
  addBalance(amount: number): void {
    this.increment('balance', amount);
  }
}