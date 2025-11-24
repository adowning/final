/**
 * JPG (Jackpot) model for casino game system with change tracking and ArrayAccess compatibility.
 * 
 * This class extends BaseModel to provide jackpot management functionality including
 * balance tracking, percentage calculations, and payout management.
 * 
 * @package Casino Game System
 * @version 1.0.0
 */

// Import BaseModel foundation
import { BaseModel } from './BaseModel';

/**
 * JPG (Jackpot) data interface defining the structure of jackpot information
 */
export interface JPGData {
  id: number;
  shop_id: number;
  balance: number;
  percent: number;
  user_id: number | null;
  start_balance: number;
}

/**
 * JPG (Jackpot) model class with change tracking and ArrayAccess compatibility
 */
export class JPG extends BaseModel<JPGData> {
  // JPG properties
  public id: number;
  public shop_id: number;
  public balance: number;
  public percent: number;
  public user_id: number | null;
  public start_balance: number;

  /**
   * Constructor for JPG model
   * @param data Initial JPG data
   */
  constructor(data: Partial<JPGData> = {}) {
    // Initialize default data structure
    const defaultData: JPGData = {
      id: 0,
      shop_id: 0,
      balance: 0.0,
      percent: 1.0,
      user_id: null,
      start_balance: 1000.0
    };

    // Merge provided data with defaults
    const jpgData: JPGData = {
      ...defaultData,
      ...data
    };

    super(jpgData);

    // Initialize properties from data
    this.id = jpgData.id;
    this.shop_id = jpgData.shop_id;
    this.balance = jpgData.balance;
    this.percent = jpgData.percent;
    this.user_id = jpgData.user_id;
    this.start_balance = jpgData.start_balance;
  }

  /**
   * Get the current state of the JPG model
   * @returns Current state as JPGData
   */
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

  /**
   * Override increment method to properly track balance and percent changes
   * @param field Name of the field to increment
   * @param amount Amount to increment by (default: 1)
   */
  override increment(field: keyof JPGData, amount: number = 1): void {
    if (field === 'balance' || field === 'percent' || field === 'start_balance') {
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
   * Get the payout sum based on current balance
   * @returns Payout amount (1000.0 if balance > 10000, 0.0 otherwise)
   */
  getPaySum(): number {
    return this.balance > 10000 ? 1000.0 : 0.0;
  }

  /**
   * Get the minimum value for a field (placeholder implementation)
   * @param field Field name (ignored in current implementation)
   * @returns Minimum value (50% of start_balance)
   */
  getMin(field: string): number {
    return this.start_balance * 0.5;
  }

  /**
   * Get the starting balance
   * @returns Starting balance amount
   */
  getStartBalance(): number {
    return this.start_balance;
  }

  /**
   * Add amount to JPG with specified operation
   * @param operation Operation type ('add' supported)
   * @param amount Amount to add
   */
  addJpg(operation: string, amount: number): void {
    if (operation === 'add') {
      this.increment('balance', amount);
    }
  }

  /**
   * Update shop ID with change tracking
   * @param shop_id New shop ID
   */
  setShopId(shop_id: number): void {
    const oldShopId = this.shop_id;
    this.shop_id = shop_id;

    if (oldShopId !== shop_id) {
      this.changedData['shop_id'] = shop_id;
      this.isModified = true;
    }
  }

  /**
   * Update user ID with change tracking
   * @param user_id New user ID (can be null)
   */
  setUserId(user_id: number | null): void {
    const oldUserId = this.user_id;
    this.user_id = user_id;

    if (oldUserId !== user_id) {
      this.changedData['user_id'] = user_id;
      this.isModified = true;
    }
  }

  /**
   * Update percentage with change tracking
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
   * Update starting balance with change tracking
   * @param start_balance New starting balance
   */
  setStartBalance(start_balance: number): void {
    const oldStartBalance = this.start_balance;
    this.start_balance = start_balance;

    if (oldStartBalance !== start_balance) {
      this.changedData['start_balance'] = start_balance;
      this.isModified = true;
    }
  }

  /**
   * Check if jackpot is eligible for payout
   * @returns true if jackpot balance > 10000, false otherwise
   */
  isEligibleForPayout(): boolean {
    return this.balance > 10000;
  }

  /**
   * Get jackpot information summary
   * @returns Object with jackpot details
   */
  getInfo(): { 
    id: number; 
    shop_id: number; 
    balance: number; 
    percent: number; 
    user_id: number | null; 
    start_balance: number; 
    is_eligible: boolean;
    pay_sum: number;
  } {
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

  /**
   * Convert JPG data to array format for serialization
   * @returns Object representation of JPG data
   */
  toArray(): Record<string, any> {
    return {
      id: this.id,
      shop_id: this.shop_id,
      balance: this.balance,
      percent: this.percent,
      user_id: this.user_id,
      start_balance: this.start_balance
    };
  }

  /**
   * Save method - placeholder for compatibility
   */
  save(): void {
    // Placeholder for save logic - no-op for stateless operation
    // In a real implementation, this would persist changes to a database
  }
}