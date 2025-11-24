/**
 * StatGame model for casino game statistics tracking.
 * Refactored for Strict Type Safety.
 * * @package Casino Game System
 * @version 1.1.0
 */

import { BaseModel } from './BaseModel';

export interface StatGameData {
  id: number;
  user_id: number;
  balance: number;
  bet: number;
  win: number;
  game: string;
  in_game: number;
  in_jpg: number;
  in_profit: number;
  denomination: number;
  shop_id: number;
  slots_bank: number;
  bonus_bank: number;
  fish_bank: number;
  table_bank: number;
  little_bank: number;
  total_bank: number;
  date_time: string;
}

export class StatGame extends BaseModel<StatGameData> {
  public id: number;
  public user_id: number;
  public game: string;
  public shop_id: number;
  public balance: number;
  public bet: number;
  public win: number;
  public in_game: number;
  public in_jpg: number;
  public in_profit: number;
  public denomination: number;
  public slots_bank: number;
  public bonus_bank: number;
  public fish_bank: number;
  public table_bank: number;
  public little_bank: number;
  public total_bank: number;
  public date_time: string;

  constructor(data: Partial<StatGameData> = {}) {
    const defaultData: StatGameData = {
      id: 0,
      user_id: 0,
      balance: 0.0,
      bet: 0.0,
      win: 0.0,
      game: '',
      in_game: 0.0,
      in_jpg: 0.0,
      in_profit: 0.0,
      denomination: 1.0,
      shop_id: 0,
      slots_bank: 0.0,
      bonus_bank: 0.0,
      fish_bank: 0.0,
      table_bank: 0.0,
      little_bank: 0.0,
      total_bank: 0.0,
      date_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const statData: StatGameData = { ...defaultData, ...data };
    super(statData);

    this.id = statData.id;
    this.user_id = statData.user_id;
    this.game = statData.game;
    this.shop_id = statData.shop_id;
    this.balance = statData.balance;
    this.bet = statData.bet;
    this.win = statData.win;
    this.in_game = statData.in_game;
    this.in_jpg = statData.in_jpg;
    this.in_profit = statData.in_profit;
    this.denomination = statData.denomination;
    this.slots_bank = statData.slots_bank;
    this.bonus_bank = statData.bonus_bank;
    this.fish_bank = statData.fish_bank;
    this.table_bank = statData.table_bank;
    this.little_bank = statData.little_bank;
    this.total_bank = statData.total_bank;
    this.date_time = statData.date_time;
  }

  getState(): StatGameData {
    return {
      id: this.id,
      user_id: this.user_id,
      balance: this.balance,
      bet: this.bet,
      win: this.win,
      game: this.game,
      in_game: this.in_game,
      in_jpg: this.in_jpg,
      in_profit: this.in_profit,
      denomination: this.denomination,
      shop_id: this.shop_id,
      slots_bank: this.slots_bank,
      bonus_bank: this.bonus_bank,
      fish_bank: this.fish_bank,
      table_bank: this.table_bank,
      little_bank: this.little_bank,
      total_bank: this.total_bank,
      date_time: this.date_time
    };
  }

  static create(data: StatGameData): StatGame {
    return new StatGame(data);
  }

  toArray(): StatGameData {
    return this.getState();
  }

  getNetResult(): number {
    return this.win - this.bet;
  }

  getWinRate(): number {
    if (this.bet <= 0) return 0;
    return (this.win / this.bet) * 100;
  }

  updateBalance(newBalance: number): void {
    this.balance = newBalance;
    this.calculateFinancialTotals();
  }

  updateBet(betAmount: number): void {
    this.bet = betAmount;
  }

  updateWin(winAmount: number): void {
    this.win = winAmount;
    this.calculateFinancialTotals();
  }

  private calculateFinancialTotals(): void {
    this.in_game = this.getNetResult();
    this.total_bank = this.slots_bank + this.bonus_bank + this.fish_bank + this.table_bank + this.little_bank;
    this.in_profit = this.in_game + this.in_jpg;
  }

  updateBankAmount(bankType: keyof Pick<StatGameData, 'slots_bank' | 'bonus_bank' | 'fish_bank' | 'table_bank' | 'little_bank'>, amount: number): void {
    this[bankType] = amount;
    this.calculateFinancialTotals();
  }
}
