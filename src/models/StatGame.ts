/**
 * StatGame model for casino game statistics tracking
 * 
 * Comprehensive statistics model for tracking game performance,
 * user balance changes, bank management, and profit calculations.
 * 
 * @package Casino Game System
 * @version 1.0.0
 */

/**
 * Interface for StatGame data structure
 */
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

/**
 * StatGame model class for comprehensive game statistics tracking
 */
export class StatGame {
  // Core identification
  public id: number;
  public user_id: number;
  public game: string;
  public shop_id: number;

  // Balance and betting data
  public balance: number;
  public bet: number;
  public win: number;

  // Financial tracking
  public in_game: number;
  public in_jpg: number;
  public in_profit: number;

  // Configuration
  public denomination: number;

  // Bank management
  public slots_bank: number;
  public bonus_bank: number;
  public fish_bank: number;
  public table_bank: number;
  public little_bank: number;
  public total_bank: number;

  // Timestamp
  public date_time: string;

  /**
   * Constructor for StatGame model
   * @param data Initial statistics data
   */
  constructor(data: Partial<StatGameData> = {}) {
    // Initialize core identification
    this.id = data.id ?? 0;
    this.user_id = data.user_id ?? 0;
    this.game = data.game ?? '';
    this.shop_id = data.shop_id ?? 0;

    // Initialize balance and betting data
    this.balance = data.balance ?? 0.0;
    this.bet = data.bet ?? 0.0;
    this.win = data.win ?? 0.0;

    // Initialize financial tracking
    this.in_game = data.in_game ?? 0.0;
    this.in_jpg = data.in_jpg ?? 0.0;
    this.in_profit = data.in_profit ?? 0.0;

    // Initialize configuration
    this.denomination = data.denomination ?? 1.0;

    // Initialize bank management
    this.slots_bank = data.slots_bank ?? 0.0;
    this.bonus_bank = data.bonus_bank ?? 0.0;
    this.fish_bank = data.fish_bank ?? 0.0;
    this.table_bank = data.table_bank ?? 0.0;
    this.little_bank = data.little_bank ?? 0.0;
    this.total_bank = data.total_bank ?? 0.0;

    // Initialize timestamp
    this.date_time = data.date_time ?? new Date().toISOString().replace('T', ' ').substring(0, 19);
  }

  /**
   * Static method to create new StatGame instance (backward compatibility)
   * @param data Statistics data
   * @returns New StatGame instance
   */
  static create(data: StatGameData): StatGame {
    return new StatGame(data);
  }

  /**
   * Convert model to array format for serialization
   * @returns Object with all properties
   */
  toArray(): StatGameData {
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

  /**
   * Calculate net win/loss for this session
   * @returns Net result (positive for win, negative for loss)
   */
  getNetResult(): number {
    return this.win - this.bet;
  }

  /**
   * Calculate win rate as percentage
   * @returns Win rate percentage (0-100)
   */
  getWinRate(): number {
    if (this.bet <= 0) return 0;
    return (this.win / this.bet) * 100;
  }

  /**
   * Update balance and related financial data
   * @param newBalance New balance amount
   */
  updateBalance(newBalance: number): void {
    this.balance = newBalance;
    this.calculateFinancialTotals();
  }

  /**
   * Update bet amount
   * @param betAmount New bet amount
   */
  updateBet(betAmount: number): void {
    this.bet = betAmount;
  }

  /**
   * Update win amount
   * @param winAmount New win amount
   */
  updateWin(winAmount: number): void {
    this.win = winAmount;
    this.calculateFinancialTotals();
  }

  /**
   * Calculate and update financial totals
   */
  private calculateFinancialTotals(): void {
    // Update in_game with net result
    this.in_game = this.getNetResult();
    
    // Calculate total bank from all bank types
    this.total_bank = this.slots_bank + this.bonus_bank + this.fish_bank + this.table_bank + this.little_bank;
    
    // Update profit calculation
    this.in_profit = this.in_game + this.in_jpg;
  }

  /**
   * Update individual bank amounts
   * @param bankType Type of bank to update
   * @param amount New amount for the bank
   */
  updateBankAmount(bankType: 'slots_bank' | 'bonus_bank' | 'fish_bank' | 'table_bank' | 'little_bank', amount: number): void {
    (this as any)[bankType] = amount;
    this.calculateFinancialTotals();
  }

  /**
   * Get formatted statistics summary
   * @returns Formatted statistics summary
   */
  getStatisticsSummary(): string {
    return `StatGame[ID:${this.id}] User:${this.user_id} Game:${this.game} ` +
           `Bet:${this.bet} Win:${this.win} Net:${this.getNetResult()} ` +
           `WinRate:${this.getWinRate().toFixed(2)}%`;
  }

  /**
   * Check if statistics represent a winning session
   * @returns true if net result is positive
   */
  isWinningSession(): boolean {
    return this.getNetResult() > 0;
  }

  /**
   * Check if statistics represent a losing session
   * @returns true if net result is negative
   */
  isLosingSession(): boolean {
    return this.getNetResult() < 0;
  }

  /**
   * Get current date/time in formatted string
   * @returns Current timestamp
   */
  static getCurrentDateTime(): string {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
  }
}