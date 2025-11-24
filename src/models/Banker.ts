/**
 * Banker utility class for casino game system providing static bank operations.
 * 
 * This class provides static methods for retrieving bank information across
 * different game categories including slots, bonus, fish, table, and little games.
 * 
 * @package Casino Game System
 * @version 1.0.0
 */

/**
 * Bank information interface for all bank categories
 */
export interface BankInfo {
  slots: number;
  bonus: number;
  fish: number;
  table: number;
  little: number;
}

/**
 * Banker utility class with static methods for bank operations
 */
export class Banker {
  /**
   * Get all banks for a specific shop
   * @param shopId Shop identifier
   * @returns Object containing all bank categories with their balances
   */
  static getAllBanks(shopId: number): BankInfo {
    return {
      slots: 10000.0,
      bonus: 5000.0,
      fish: 2000.0,
      table: 3000.0,
      little: 1000.0
    };
  }

  /**
   * Get slot banks for a specific shop
   * @param shopId Shop identifier
   * @returns Array containing slot-related bank balances [slots, bonus, fish, table, little]
   */
  static getSlotBanks(shopId: number): number[] {
    const banks = this.getAllBanks(shopId);
    return [
      banks.slots,
      banks.bonus,
      banks.fish,
      banks.table,
      banks.little
    ];
  }

  /**
   * Get total bank balance across all categories
   * @param shopId Shop identifier
   * @returns Total balance across all banks
   */
  static getTotalBalance(shopId: number): number {
    const banks = this.getAllBanks(shopId);
    return banks.slots + banks.bonus + banks.fish + banks.table + banks.little;
  }

  /**
   * Get bank balance for a specific category
   * @param shopId Shop identifier
   * @param category Bank category ('slots', 'bonus', 'fish', 'table', 'little')
   * @returns Balance for the specified category
   */
  static getBankForCategory(shopId: number, category: string): number {
    const banks = this.getAllBanks(shopId);
    
    switch (category.toLowerCase()) {
      case 'slots':
        return banks.slots;
      case 'bonus':
        return banks.bonus;
      case 'fish':
        return banks.fish;
      case 'table':
        return banks.table;
      case 'little':
        return banks.little;
      default:
        throw new Error(`Unknown bank category: ${category}`);
    }
  }

  /**
   * Check if a specific bank category has sufficient balance
   * @param shopId Shop identifier
   * @param category Bank category
   * @param amount Amount to check
   * @returns true if category has sufficient balance, false otherwise
   */
  static hasSufficientBalance(shopId: number, category: string, amount: number): boolean {
    const balance = this.getBankForCategory(shopId, category);
    return balance >= amount;
  }

  /**
   * Get bank summary for reporting
   * @param shopId Shop identifier
   * @returns Object with bank summary information
   */
  static getBankSummary(shopId: number): {
    shop_id: number;
    total_balance: number;
    category_breakdown: BankInfo;
    category_counts: Record<string, number>;
  } {
    const banks = this.getAllBanks(shopId);
    const total = this.getTotalBalance(shopId);

    return {
      shop_id: shopId,
      total_balance: total,
      category_breakdown: banks,
      category_counts: {
        slots: 1,
        bonus: 1,
        fish: 1,
        table: 1,
        little: 1
      }
    };
  }

  /**
   * Validate bank category
   * @param category Category to validate
   * @returns true if category is valid, false otherwise
   */
  static isValidCategory(category: string): boolean {
    const validCategories = ['slots', 'bonus', 'fish', 'table', 'little'];
    return validCategories.includes(category.toLowerCase());
  }

  /**
   * Get list of valid bank categories
   * @returns Array of valid category names
   */
  static getValidCategories(): string[] {
    return ['slots', 'bonus', 'fish', 'table', 'little'];
  }
}