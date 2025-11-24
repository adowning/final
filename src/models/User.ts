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
