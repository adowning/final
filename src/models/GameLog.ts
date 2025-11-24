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
