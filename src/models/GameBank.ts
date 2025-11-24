/**
 * GameBank model for casino game system with change tracking and mock database query methods.
 * 
 * This class extends BaseModel to provide game bank operations including balance management
 * and mock database query methods for backward compatibility.
 * 
 * @package Casino Game System
 * @version 1.0.0
 */

// Import BaseModel foundation
import { BaseModel } from './BaseModel';

/**
 * GameBank data interface defining the structure of game bank information
 */
export interface GameBankData {
  id: number;
  shop_id: number;
  balance: number;
}

/**
 * Query builder interface for mock database operations
 */
interface QueryBuilder {
  where(conditions: Partial<GameBankData>): GameBank;
  lockForUpdate(): GameBank;
  get(): GameBank[];
  first(): GameBank | null;
}

/**
 * GameBank model class with change tracking and mock database query methods
 */
export class GameBank extends BaseModel<GameBankData> implements QueryBuilder {
  // GameBank properties
  public id: number;
  public shop_id: number;
  public balance: number;

  /**
   * Constructor for GameBank model
   * @param data Initial game bank data
   */
  constructor(data: Partial<GameBankData> = {}) {
    // Initialize default data structure
    const defaultData: GameBankData = {
      id: 0,
      shop_id: 0,
      balance: 0.0
    };

    // Merge provided data with defaults
    const gameBankData: GameBankData = {
      ...defaultData,
      ...data
    };

    super(gameBankData);

    // Initialize properties from data
    this.id = gameBankData.id;
    this.shop_id = gameBankData.shop_id;
    this.balance = gameBankData.balance;
  }

  /**
   * Get the current state of the GameBank model
   * @returns Current state as GameBankData
   */
  getState(): GameBankData {
    return {
      id: this.id,
      shop_id: this.shop_id,
      balance: this.balance
    };
  }

  /**
   * Mock database query method - where clause
   * @param conditions Query conditions
   * @returns New GameBank instance with applied conditions
   */
  where(conditions: Partial<GameBankData>): GameBank {
    const updatedData = { ...this.getState(), ...conditions };
    return new GameBank(updatedData);
  }

  /**
   * Mock database query method - lock for update
   * @returns Current GameBank instance
   */
  lockForUpdate(): GameBank {
    // In a real implementation, this would lock the row for updates
    // For mock purposes, just return the current instance
    return this;
  }

  /**
   * Mock database query method - get results
   * @returns Array containing current GameBank instance
   */
  get(): GameBank[] {
    // Return array with current instance if it has valid ID
    return this.id > 0 ? [this] : [];
  }

  /**
   * Mock database query method - get first result
   * @returns GameBank instance if valid, null otherwise
   */
  first(): GameBank | null {
    // Return current instance if it has valid ID
    return this.id > 0 ? this : null;
  }

  /**
   * Override increment method to properly track balance changes
   * @param field Name of the field to increment
   * @param amount Amount to increment by (default: 1)
   */
  override increment(field: keyof GameBankData, amount: number = 1): void {
    if (field === 'balance') {
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
   * Update balance with change tracking
   * @param balance New balance amount
   */
  setBalance(balance: number): void {
    const oldBalance = this.balance;
    this.balance = balance;

    if (oldBalance !== balance) {
      this.changedData['balance'] = balance;
      this.isModified = true;
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
   * Update ID with change tracking
   * @param id New ID
   */
  setId(id: number): void {
    const oldId = this.id;
    this.id = id;

    if (oldId !== id) {
      this.changedData['id'] = id;
      this.isModified = true;
    }
  }

  /**
   * Add amount to balance with change tracking
   * @param amount Amount to add to balance
   */
  addToBalance(amount: number): void {
    this.increment('balance', amount);
  }

  /**
   * Deduct amount from balance with change tracking
   * @param amount Amount to deduct from balance
   * @returns true if deduction was successful, false otherwise
   */
  deductFromBalance(amount: number): boolean {
    if (this.balance >= amount) {
      this.increment('balance', -amount);
      return true;
    }
    return false;
  }

  /**
   * Check if game bank has sufficient balance
   * @param amount Amount to check
   * @returns true if bank has sufficient balance, false otherwise
   */
  hasSufficientBalance(amount: number): boolean {
    return this.balance >= amount;
  }

  /**
   * Get game bank information summary
   * @returns Object with game bank details
   */
  getInfo(): { id: number; shop_id: number; balance: number; has_changes: boolean } {
    return {
      id: this.id,
      shop_id: this.shop_id,
      balance: this.balance,
      has_changes: this.hasChanges()
    };
  }

  /**
   * Convert GameBank data to array format for serialization
   * @returns Object representation of GameBank data
   */
  toArray(): Record<string, any> {
    return {
      id: this.id,
      shop_id: this.shop_id,
      balance: this.balance
    };
  }

  /**
   * Create a static method to find GameBank by ID (mock implementation)
   * @param id GameBank ID to find
   * @returns GameBank instance or null if not found
   */
  static find(id: number): GameBank | null {
    if (id > 0) {
      return new GameBank({ id, shop_id: 1, balance: 1000.0 });
    }
    return null;
  }

  /**
   * Create a static method to find GameBank by shop ID (mock implementation)
   * @param shop_id Shop ID to find
   * @returns GameBank instance or null if not found
   */
  static findByShopId(shop_id: number): GameBank | null {
    if (shop_id > 0) {
      return new GameBank({ id: 1, shop_id, balance: 1000.0 });
    }
    return null;
  }

  /**
   * Create a static method to get all GameBanks (mock implementation)
   * @returns Array of GameBank instances
   */
  static all(): GameBank[] {
    return [
      new GameBank({ id: 1, shop_id: 1, balance: 1000.0 }),
      new GameBank({ id: 2, shop_id: 1, balance: 2000.0 }),
      new GameBank({ id: 3, shop_id: 2, balance: 1500.0 })
    ];
  }

  /**
   * Create a static method to create a new GameBank (mock implementation)
   * @param data GameBank data
   * @returns New GameBank instance
   */
  static create(data: Partial<GameBankData>): GameBank {
    return new GameBank({
      id: Date.now(), // Simple ID generation for mock
      shop_id: data.shop_id || 0,
      balance: data.balance || 0.0
    });
  }
}