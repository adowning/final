/**
 * GameLog model for casino game logging system
 * 
 * Simple data container for game logging with mock database methods
 * providing backward compatibility with existing code.
 * 
 * @package Casino Game System
 * @version 1.0.0
 */

/**
 * Interface for GameLog data structure
 */
export interface GameLogData {
  id: number;
  game_id: number;
  user_id: number;
  ip: string;
  str: string;
  shop_id: number;
}

/**
 * GameLog model class for tracking game events and user activities
 */
export class GameLog {
  // Core properties
  public id: number;
  public game_id: number;
  public user_id: number;
  public ip: string;
  public str: string;
  public shop_id: number;

  /**
   * Constructor for GameLog model
   * @param data Initial game log data
   */
  constructor(data: Partial<GameLogData> = {}) {
    // Initialize properties with defaults
    this.id = data.id ?? 0;
    this.game_id = data.game_id ?? 0;
    this.user_id = data.user_id ?? 0;
    this.ip = data.ip ?? '';
    this.str = data.str ?? '';
    this.shop_id = data.shop_id ?? 0;
  }

  /**
   * Mock database method for complex WHERE clauses (backward compatibility)
   * @param query SQL-like query string
   * @param bindings Query parameter bindings
   * @returns New GameLog instance with filtered data
   */
  static whereRaw(query: string, bindings: any[] = []): GameLog {
    // Simple mock implementation for backward compatibility
    // Extract game_id and user_id from typical query patterns
    const gameId = bindings[0] ?? 0;
    const userId = bindings[1] ?? 0;
    
    return new GameLog({
      game_id: gameId,
      user_id: userId
    });
  }

  /**
   * Mock database method to get results (backward compatibility)
   * @returns Array containing this instance
   */
  get(): GameLog[] {
    return [this];
  }

  /**
   * Static method to create new GameLog instance (backward compatibility)
   * @param data Game log data
   * @returns New GameLog instance
   */
  static create(data: GameLogData): GameLog {
    return new GameLog(data);
  }

  /**
   * Convert model to array format for serialization
   * @returns Object with all properties
   */
  toArray(): GameLogData {
    return {
      id: this.id,
      game_id: this.game_id,
      user_id: this.user_id,
      ip: this.ip,
      str: this.str,
      shop_id: this.shop_id
    };
  }

  /**
   * Get log entry details for debugging
   * @returns Formatted log entry string
   */
  getLogDetails(): string {
    return `GameLog[ID:${this.id}] Game:${this.game_id} User:${this.user_id} IP:${this.ip} Shop:${this.shop_id}`;
  }

  /**
   * Check if this is a valid log entry
   * @returns true if entry has minimum required data
   */
  isValid(): boolean {
    return this.game_id > 0 && this.user_id > 0;
  }
}