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
