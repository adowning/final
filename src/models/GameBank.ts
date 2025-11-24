/**
 * GameBank model for casino game system.
 * Refactored for Strict Type Safety.
 * * @package Casino Game System
 * @version 1.1.0
 */

import { BaseModel } from './BaseModel';

export interface GameBankData {
  id: number;
  shop_id: number;
  balance: number;
}

interface QueryBuilder {
  where(conditions: Partial<GameBankData>): GameBank;
  lockForUpdate(): GameBank;
  get(): GameBank[];
  first(): GameBank | null;
}

export class GameBank extends BaseModel<GameBankData> implements QueryBuilder {
  public id: number;
  public shop_id: number;
  public balance: number;

  constructor(data: Partial<GameBankData> = {}) {
    const defaultData: GameBankData = {
      id: 0,
      shop_id: 0,
      balance: 0.0
    };

    const bankData: GameBankData = { ...defaultData, ...data };
    super(bankData);

    this.id = bankData.id;
    this.shop_id = bankData.shop_id;
    this.balance = bankData.balance;
  }

  getState(): GameBankData {
    return {
      id: this.id,
      shop_id: this.shop_id,
      balance: this.balance
    };
  }

  where(conditions: Partial<GameBankData>): GameBank {
    const updatedData = { ...this.getState(), ...conditions };
    return new GameBank(updatedData);
  }

  lockForUpdate(): GameBank {
    return this;
  }

  get(): GameBank[] {
    return this.id > 0 ? [this] : [];
  }

  first(): GameBank | null {
    return this.id > 0 ? this : null;
  }

  override increment(field: keyof GameBankData, amount: number = 1): void {
    if (field === 'balance') {
      const currentValue = this.balance;
      const newValue = currentValue + amount;
      this.balance = newValue;
      this.changedData['balance'] = newValue;
      this.isModified = true;
    } else {
      super.increment(field, amount);
    }
  }

  setBalance(balance: number): void {
    const oldBalance = this.balance;
    this.balance = balance;
    if (oldBalance !== balance) {
      this.changedData['balance'] = balance;
      this.isModified = true;
    }
  }

  setShopId(shop_id: number): void {
    const oldShopId = this.shop_id;
    this.shop_id = shop_id;
    if (oldShopId !== shop_id) {
      this.changedData['shop_id'] = shop_id;
      this.isModified = true;
    }
  }

  addToBalance(amount: number): void {
    this.increment('balance', amount);
  }

  deductFromBalance(amount: number): boolean {
    if (this.balance >= amount) {
      this.increment('balance', -amount);
      return true;
    }
    return false;
  }

  hasSufficientBalance(amount: number): boolean {
    return this.balance >= amount;
  }

  toArray(): Record<string, any> {
    return this.getState();
  }

  static find(id: number): GameBank | null {
    if (id > 0) return new GameBank({ id, shop_id: 1, balance: 1000.0 });
    return null;
  }

  static findByShopId(shop_id: number): GameBank | null {
    if (shop_id > 0) return new GameBank({ id: 1, shop_id, balance: 1000.0 });
    return null;
  }

  static create(data: Partial<GameBankData>): GameBank {
    return new GameBank({
      id: Date.now(),
      shop_id: data.shop_id || 0,
      balance: data.balance || 0.0
    });
  }
}
