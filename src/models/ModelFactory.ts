/**
 * ModelFactory for Casino Game System
 * 
 * Comprehensive factory for creating and managing all converted model types.
 * Provides backward compatibility with existing codebase and seamless integration
 * between TypeScript models and legacy code patterns.
 * 
 * @package Casino Game System
 * @version 1.0.0
 */

// Import all converted models
import { User } from './User';
import { Game } from './Game';
import { Shop } from './Shop';
import { JPG } from './JPG';
import { Banker } from './Banker';
import { GameBank } from './GameBank';
import { GameLog } from './GameLog';
import { Session } from './Session';
import { StatGame } from './StatGame';
import { UserStatusClass } from './UserStatus';

/**
 * Union type for all supported model classes (Banker is a static utility class)
 */
export type ModelClass = User | Game | Shop | JPG | GameBank | GameLog | Session | StatGame;
export type ModelClassOrUtility = ModelClass | typeof Banker;

/**
 * Union type for all supported data interfaces
 */
export type ModelData = User extends { getState(): infer U } ? U : any;

/**
 * ModelFactory - Complete factory for all casino system models
 * 
 * This factory handles creation, conversion, and utility operations
 * for all models in the casino game system.
 */
export class ModelFactory {
  // ================================
  // SINGLE MODEL CREATION
  // ================================

  /**
   * Create a User model from data
   * @param data User data
   * @returns User instance
   */
  static createUser(data: Partial<User extends { getState(): infer U } ? U : any> = {}): User {
    return new User(data);
  }

  /**
   * Create a Game model from data
   * @param data Game data
   * @returns Game instance
   */
  static createGame(data: any = { name: '' }): Game {
    return new Game(data);
  }

  /**
   * Create a Shop model from data
   * @param data Shop data
   * @returns Shop instance
   */
  static createShop(data: Partial<Shop extends { toArray(): infer U } ? U : any> = {}): Shop {
    return new Shop(data);
  }

  /**
   * Create a JPG model from data
   * @param data JPG data
   * @returns JPG instance
   */
  static createJPG(data: Partial<JPG extends { toArray(): infer U } ? U : any> = {}): JPG {
    return new JPG(data);
  }

  /**
   * Get Banker utility class (static utility class)
   * @returns Banker utility class
   */
  static getBanker(): typeof Banker {
    return Banker;
  }

  /**
   * Create a GameBank model from data
   * @param data GameBank data
   * @returns GameBank instance
   */
  static createGameBank(data: Partial<GameBank extends { toArray(): infer U } ? U : any> = {}): GameBank {
    return new GameBank(data);
  }

  /**
   * Create a GameLog model from data
   * @param data GameLog data
   * @returns GameLog instance
   */
  static createGameLog(data: Partial<GameLog extends { toArray(): infer U } ? U : any> = {}): GameLog {
    return new GameLog(data);
  }

  /**
   * Create a Session model from data
   * @param data Session data
   * @returns Session instance
   */
  static createSession(data: Partial<Session extends { toArray(): infer U } ? U : any> = {}): Session {
    return new Session(data);
  }

  /**
   * Create a StatGame model from data
   * @param data StatGame data
   * @returns StatGame instance
   */
  static createStatGame(data: Partial<StatGame extends { toArray(): infer U } ? U : any> = {}): StatGame {
    return new StatGame(data);
  }

  // ================================
  // BATCH MODEL CREATION
  // ================================

  /**
   * Create multiple User instances from array data
   * @param users Array of user data
   * @returns Array of User instances
   */
  static createUsers(users: any[] = []): User[] {
    return users.map(data => this.createUser(data));
  }

  /**
   * Create multiple Game instances from array data
   * @param games Array of game data
   * @returns Array of Game instances
   */
  static createGames(games: any[] = []): Game[] {
    return games.map(data => this.createGame(data));
  }

  /**
   * Create multiple Shop instances from array data
   * @param shops Array of shop data
   * @returns Array of Shop instances
   */
  static createShops(shops: any[] = []): Shop[] {
    return shops.map(data => this.createShop(data));
  }

  /**
   * Create multiple JPG instances from array data
   * @param jpgs Array of JPG data
   * @returns Array of JPG instances
   */
  static createJPGs(jpgs: any[] = []): JPG[] {
    return jpgs.map(data => this.createJPG(data));
  }

  /**
   * Get Banker utility class multiple times (returns utility class)
   * @returns Banker utility class (since it's static)
   */
  static createBankers(): typeof Banker {
    return Banker;
  }

  /**
   * Create multiple GameBank instances from array data
   * @param gameBanks Array of game bank data
   * @returns Array of GameBank instances
   */
  static createGameBanks(gameBanks: any[] = []): GameBank[] {
    return gameBanks.map(data => this.createGameBank(data));
  }

  /**
   * Create multiple GameLog instances from array data
   * @param gameLogs Array of game log data
   * @returns Array of GameLog instances
   */
  static createGameLogs(gameLogs: any[] = []): GameLog[] {
    return gameLogs.map(data => this.createGameLog(data));
  }

  /**
   * Create multiple Session instances from array data
   * @param sessions Array of session data
   * @returns Array of Session instances
   */
  static createSessions(sessions: any[] = []): Session[] {
    return sessions.map(data => this.createSession(data));
  }

  /**
   * Create multiple StatGame instances from array data
   * @param statGames Array of stat game data
   * @returns Array of StatGame instances
   */
  static createStatGames(statGames: any[] = []): StatGame[] {
    return statGames.map(data => this.createStatGame(data));
  }

  // ================================
  // MODEL TO ARRAY CONVERSION
  // ================================

  /**
   * Convert model to array format for serialization
   * @param model Any model instance
   * @returns Array representation of the model
   */
  static toArray(model: any): any {
    // Handle User model with getState method
    if (model instanceof User && typeof model.getState === 'function') {
      return model.getState();
    }

    // Handle Game model with getState method
    if (model instanceof Game && typeof model.getState === 'function') {
      return model.getState();
    }

    // Handle models with toArray method
    if (model && typeof model.toArray === 'function') {
      return model.toArray();
    }

    // Handle models with getState method (fallback)
    if (model && typeof model.getState === 'function') {
      return model.getState();
    }

    // Last resort - return as-is or convert to plain object
    return model || {};
  }

  /**
   * Convert array of models to array format
   * @param models Array of model instances
   * @returns Array of model data
   */
  static toArrayOfArrays(models: any[]): any[] {
    return models.map(model => this.toArray(model));
  }

  // ================================
  // DATA SANITIZATION UTILITIES
  // ================================

  /**
   * Sanitize array data to include only allowed keys
   * @param data Raw data object
   * @param allowedKeys Array of allowed property names
   * @returns Sanitized data object
   */
  static sanitizeArray(data: Record<string, any>, allowedKeys: string[]): Record<string, any> {
    const sanitized: Record<string, any> = {};
    for (const key of allowedKeys) {
      if (data.hasOwnProperty(key)) {
        sanitized[key] = data[key];
      }
    }
    return sanitized;
  }

  /**
   * Convert snake_case keys to camelCase
   * @param data Object with snake_case keys
   * @returns Object with camelCase keys
   */
  static snakeToCamel(data: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
      result[camelKey] = value;
    }
    return result;
  }

  /**
   * Convert camelCase keys to snake_case
   * @param data Object with camelCase keys
   * @returns Object with snake_case keys
   */
  static camelToSnake(data: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = value;
    }
    return result;
  }

  // ================================
  // UTILITY METHODS
  // ================================

  /**
   * Validate if a model is a valid instance
   * @param model Object to validate
   * @returns true if valid model instance
   */
  static isValidModel(model: any): boolean {
    return model && typeof model === 'object' && (
      model instanceof User ||
      model instanceof Game ||
      model instanceof Shop ||
      model instanceof JPG ||
      model instanceof Banker ||
      model instanceof GameBank ||
      model instanceof GameLog ||
      model instanceof Session ||
      model instanceof StatGame
    );
  }

  /**
   * Get model type name for debugging
   * @param model Model instance
   * @returns Model class name
   */
  static getModelType(model: any): string {
    if (model instanceof User) return 'User';
    if (model instanceof Game) return 'Game';
    if (model instanceof Shop) return 'Shop';
    if (model instanceof JPG) return 'JPG';
    if (model instanceof Banker) return 'Banker';
    if (model instanceof GameBank) return 'GameBank';
    if (model instanceof GameLog) return 'GameLog';
    if (model instanceof Session) return 'Session';
    if (model instanceof StatGame) return 'StatGame';
    return 'Unknown';
  }

  /**
   * Create model instance by type name (for dynamic creation)
   * @param type Model type name
   * @param data Model data
   * @returns Model instance
   */
  static createByType(type: string, data: any = {}): ModelClassOrUtility | null {
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

  /**
   * Get all supported model types
   * @returns Array of supported model type names
   */
  static getSupportedTypes(): string[] {
    return [
      'User', 'Game', 'Shop', 'JPG', 'Banker', 'GameBank', 
      'GameLog', 'Session', 'StatGame'
    ];
  }
}

// Backward compatibility alias
export const Factory = ModelFactory;

// Default export for convenience
export default ModelFactory;