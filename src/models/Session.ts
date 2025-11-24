/**
 * Session model for casino game session management.
 * Refactored for Strict Type Safety.
 * * @package Casino Game System
 * @version 1.1.0
 */

import { BaseModel } from './BaseModel';

export interface SessionData {
  id: number;
  user_id: number;
  payload: string;
}

export class Session extends BaseModel<SessionData> {
  public id: number;
  public user_id: number;
  public payload: string;

  constructor(data: Partial<SessionData> = {}) {
    const defaultData: SessionData = {
      id: 0,
      user_id: 0,
      payload: ''
    };

    const sessionData: SessionData = { ...defaultData, ...data };
    super(sessionData);

    this.id = sessionData.id;
    this.user_id = sessionData.user_id;
    this.payload = sessionData.payload;
  }

  getState(): SessionData {
    return {
      id: this.id,
      user_id: this.user_id,
      payload: this.payload
    };
  }

  static where(field: keyof SessionData, value: any): Session {
    return new Session({ [field]: value });
  }

  static whereUserId(userId: number): Session {
    return new Session({ user_id: userId });
  }

  delete(): void {
    // Stateless mock
  }

  toArray(): SessionData {
    return this.getState();
  }

  isActive(): boolean {
    return this.user_id > 0;
  }

  setPayload(payloadData: string): void {
    this.payload = payloadData;
    this.changedData['payload'] = payloadData;
    this.isModified = true;
  }
}
