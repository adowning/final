/**
 * JPG (Jackpot) model for casino game system.
 * Refactored for Strict Type Safety.
 * * @package Casino Game System
 * @version 1.1.0
 */

import { BaseModel } from './BaseModel';

export interface JPGData {
  id: number;
  shop_id: number;
  balance: number;
  percent: number;
  user_id: number | null;
  start_balance: number;
}

export class JPG extends BaseModel<JPGData> {
  public id: number;
  public shop_id: number;
  public balance: number;
  public percent: number;
  public user_id: number | null;
  public start_balance: number;

  constructor(data: Partial<JPGData> = {}) {
    const defaultData: JPGData = {
      id: 0,
      shop_id: 0,
      balance: 0.0,
      percent: 1.0,
      user_id: null,
      start_balance: 1000.0
    };

    const jpgData: JPGData = { ...defaultData, ...data };
    super(jpgData);

    this.id = jpgData.id;
    this.shop_id = jpgData.shop_id;
    this.balance = jpgData.balance;
    this.percent = jpgData.percent;
    this.user_id = jpgData.user_id;
    this.start_balance = jpgData.start_balance;
  }

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

  override increment(field: keyof JPGData, amount: number = 1): void {
    if (field === 'balance' || field === 'percent' || field === 'start_balance') {
      // Safe casting because we verified these fields are numbers in interface
      const currentValue = (this as any)[field] as number;
      const newValue = currentValue + amount;
      (this as any)[field] = newValue;
      this.changedData[field] = newValue as any;
      this.isModified = true;
    } else {
      super.increment(field, amount);
    }
  }

  getPaySum(): number {
    return this.balance > 10000 ? 1000.0 : 0.0;
  }

  getMin(field: string): number {
    return this.start_balance * 0.5;
  }

  getStartBalance(): number {
    return this.start_balance;
  }

  addJpg(operation: string, amount: number): void {
    if (operation === 'add') {
      this.increment('balance', amount);
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

  setUserId(user_id: number | null): void {
    const oldUserId = this.user_id;
    this.user_id = user_id;
    if (oldUserId !== user_id) {
      this.changedData['user_id'] = user_id;
      this.isModified = true;
    }
  }

  setPercent(percent: number): void {
    const oldPercent = this.percent;
    this.percent = percent;
    if (oldPercent !== percent) {
      this.changedData['percent'] = percent;
      this.isModified = true;
    }
  }

  setStartBalance(start_balance: number): void {
    const oldStartBalance = this.start_balance;
    this.start_balance = start_balance;
    if (oldStartBalance !== start_balance) {
      this.changedData['start_balance'] = start_balance;
      this.isModified = true;
    }
  }

  isEligibleForPayout(): boolean {
    return this.balance > 10000;
  }

  getInfo() {
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

  toArray(): Record<string, any> {
    return this.getState();
  }
}
