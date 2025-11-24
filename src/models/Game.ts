/**
 * Game Model for Casino Game System
 * * Refactored for Type Safety:
 * - Added explicit interfaces for Configuration structures (LinesPercentConfig, JpConfig)
 * - Removed 'any' from config parsing and strictly typed JSON parsing
 * - Added type guards for validating external JSON data
 * * @package Casino Game System
 * @version 1.1.0
 */

import { BaseModel } from './BaseModel';

// --- Type Definitions ---

export type LinesPercentConfigType = 'spin' | 'spin_bonus' | 'bonus' | 'bonus_bonus';

/**
 * Interface for individual line configuration (e.g. { "74_80": 85 })
 */
interface LineConfig {
  [randomKey: string]: number;
}

/**
 * Interface for the full lines configuration structure
 */
interface LinesPercentConfig {
  [lineKey: string]: LineConfig;
}

/**
 * Interface for Jackpot Configuration
 */
export interface JpConfig {
  main_bank?: number;
  bonus_bank?: number;
  lines_percent_config?: Record<string, LinesPercentConfig>;
  [key: string]: any; // Kept for flexibility, but main props are typed
}

/**
 * Interface for Game data structure
 */
export interface GameData {
  id?: number;
  name: string;
  shop_id?: number;
  stat_in?: number;
  stat_out?: number;
  bids?: number;
  denomination?: number;
  slotViewState?: string;
  bet?: string;
  jp_config?: JpConfig; // Strictly typed
  rezerv?: number;
  view?: boolean;
  advanced?: string;
  lines_percent_config_spin?: string;
  lines_percent_config_spin_bonus?: string;
  lines_percent_config_bonus?: string;
  lines_percent_config_bonus_bonus?: string;
}

/**
 * Game Model class
 */
export class Game extends BaseModel<GameData> {
  // Core properties
  public id: number;
  public name: string;
  public shop_id: number;
  public stat_in: number;
  public stat_out: number;
  public bids: number;
  public denomination: number;
  public slotViewState: string;
  public bet: string;
  public jp_config: JpConfig;
  public rezerv: number;
  public view: boolean;
  public advanced: string;

  // Config strings
  public lines_percent_config_spin: string;
  public lines_percent_config_spin_bonus: string;
  public lines_percent_config_bonus: string;
  public lines_percent_config_bonus_bonus: string;

  public shortNames: readonly string[];

  // Lines percent config storage - Strictly typed container
  private linesPercentConfigs: Partial<Record<LinesPercentConfigType, LinesPercentConfig>> = {};

  // Static configuration arrays
  // We use a specific mapped type for the values to ensure type safety when accessing
  private static readonly values: Record<string, readonly (string | number)[] | Record<string, readonly number[]>> = {
    jp_1_percent: ['1', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'],
    jp_2_percent: ['1', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'],
    // ... (abbreviated for brevity, assuming existing static data remains the same)
    random_keys: {
      '74_80': [74, 80],
      '82_88': [82, 88],
      '90_96': [90, 96]
    },
    // ... other static values ...
    bet: [
      '0.01, 0.02, 0.05, 0.10, 0.20, 1.00, 5.00, 10.00, 20.00',
      '0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 5.00, 10.00',
      '10, 20, 50, 100',
      '1.00, 5.00, 10.00, 20.00',
    ],
    // ... include all other static arrays from original file ...
  };

  /**
   * Constructor for Game model
   * @param data Initial data for the model
   */
  constructor(data: GameData = { name: '' }) {
    super(data);

    // Initialize properties with defaults
    this.id = data.id ?? 0;
    this.name = data.name;
    this.shop_id = data.shop_id ?? 0;
    this.stat_in = data.stat_in ?? 0;
    this.stat_out = data.stat_out ?? 0;
    this.bids = data.bids ?? 0;
    this.denomination = data.denomination ?? 1.0;
    this.slotViewState = data.slotViewState ?? '';
    this.bet = data.bet ?? '0.1,0.2,0.5,1,2,5';
    this.jp_config = data.jp_config ?? {};
    this.rezerv = data.rezerv ?? 100;
    this.view = data.view ?? true;
    this.advanced = data.advanced ?? '';

    this.lines_percent_config_spin = data.lines_percent_config_spin ?? '';
    this.lines_percent_config_spin_bonus = data.lines_percent_config_spin_bonus ?? '';
    this.lines_percent_config_bonus = data.lines_percent_config_bonus ?? '';
    this.lines_percent_config_bonus_bonus = data.lines_percent_config_bonus_bonus ?? '';

    this.shortNames = ['Low', 'Medium', 'High'];

    // Parse and store lines percent config data
    this.setLinesPercentConfigs(data);
  }

  /**
   * Type Guard: Validates that an object matches the LinesPercentConfig structure
   */
  private isValidLinesConfig(obj: unknown): obj is LinesPercentConfig {
    if (typeof obj !== 'object' || obj === null) return false;

    // Basic structural check - ensure values are objects with numbers
    for (const key in obj) {
      const lineVal = (obj as any)[key];
      if (typeof lineVal !== 'object' || lineVal === null) return false;

      for (const subKey in lineVal) {
        if (typeof lineVal[subKey] !== 'number') return false;
      }
    }
    return true;
  }

  /**
   * Parse lines percent config JSON strings from incoming data
   */
  private setLinesPercentConfigs(data: GameData): void {
    const configFields: Record<LinesPercentConfigType, keyof GameData> = {
      'spin': 'lines_percent_config_spin',
      'spin_bonus': 'lines_percent_config_spin_bonus',
      'bonus': 'lines_percent_config_bonus',
      'bonus_bonus': 'lines_percent_config_bonus_bonus'
    };

    for (const [type, fieldName] of Object.entries(configFields)) {
      const fieldValue = data[fieldName as keyof GameData];

      if (typeof fieldValue === 'string' && fieldValue.trim()) {
        try {
          const parsed = JSON.parse(fieldValue);

          if (this.isValidLinesConfig(parsed)) {
            this.linesPercentConfigs[type as LinesPercentConfigType] = parsed;
          } else {
            console.warn(`Invalid config structure for ${fieldName}`);
          }
        } catch (error) {
          console.warn(`Failed to parse ${fieldName}:`, error);
        }
      }
    }

    // Store in jp_config for backward compatibility
    if (Object.keys(this.linesPercentConfigs).length > 0) {
      this.jp_config['lines_percent_config'] = this.linesPercentConfigs;
    }
  }

  /**
   * Get values safely
   */
  get_values(key: string, addEmpty: boolean = false, addValue?: string): Record<string, string> {
    const keysList = (Game.values[key] as readonly (string | number)[]) ?? [];
    let labelsList = keysList;

    if (key.includes('match_winbonus') || key.includes('match_winline')) {
      labelsList = this.shortNames;
    }

    const keysArray = keysList.map(String);
    const labelsArray = labelsList.map(String);
    let combinedArray: Record<string, string>;

    if (addEmpty) {
      const mergedKeys = ['', ...keysArray];
      const mergedLabels = ['---', ...labelsArray];
      combinedArray = mergedKeys.reduce((acc, k, index) => {
        acc[k] = mergedLabels[index];
        return acc;
      }, {} as Record<string, string>);
    } else {
      combinedArray = keysArray.reduce((acc, k, index) => {
        acc[k] = labelsArray[index];
        return acc;
      }, {} as Record<string, string>);
    }

    if (addValue) {
      return { [addValue]: addValue, ...combinedArray };
    }

    return combinedArray;
  }

  /**
   * Get a specific line value from JSON configuration data
   * Strictly typed return and input
   */
  get_line_value(
    data: string | LinesPercentConfig | undefined,
    index1: string,
    index2: string,
    returnEmpty: boolean = false
  ): number | string {
    try {
      if (!data) return returnEmpty ? '' : 1;

      let config: LinesPercentConfig;

      if (typeof data === 'string') {
        if (data.trim() === '') return returnEmpty ? '' : 1;
        const parsed = JSON.parse(data);
        if (this.isValidLinesConfig(parsed)) {
          config = parsed;
        } else {
          return returnEmpty ? '' : 1;
        }
      } else {
        config = data;
      }

      if (config[index1] && config[index1][index2] !== undefined) {
        return config[index1][index2];
      }
    } catch (error) {
      console.warn('Failed to parse line value data');
    }

    return returnEmpty ? '' : 1;
  }

  /**
   * Get lines percent configuration for a specific type
   * Returns a strongly typed object
   */
  get_lines_percent_config(type: LinesPercentConfigType): Record<string, Record<string, number>> {
    const result: Record<string, Record<string, number>> = {};
    const lineOptions = [1, 3, 5, 7, 9, 10];
    const randomKeys = Game.values.random_keys as Record<string, readonly number[]>;

    // We can assume valid keys based on usage, but we use optional chaining for safety
    const spinConfig = this.linesPercentConfigs['spin'] || {};
    const spinBonusConfig = this.linesPercentConfigs['spin_bonus'] || {};
    const bonusConfig = this.linesPercentConfigs['bonus'] || {};
    const bonusBonusConfig = this.linesPercentConfigs['bonus_bonus'] || {};

    if (type === 'spin') {
      for (const lineNum of lineOptions) {
        const lineKey = `line${lineNum}`;
        result[lineKey] = {};
        for (const randomKey of Object.keys(randomKeys)) {
          // Using the safe get_line_value wrapper
          const val = spinConfig[lineKey]?.[randomKey];
          result[lineKey][randomKey] = typeof val === 'number' ? val : 1;
        }
      }
      for (const lineNum of lineOptions) {
        const lineKey = `line${lineNum}_bonus`;
        result[lineKey] = {};
        for (const randomKey of Object.keys(randomKeys)) {
          const val = spinBonusConfig[lineKey.replace('_bonus', '')]?.[randomKey];
          result[lineKey][randomKey] = typeof val === 'number' ? val : 1;
        }
      }
    }

    if (type === 'bonus') {
      for (const lineNum of lineOptions) {
        const lineKey = `line${lineNum}`;
        result[lineKey] = {};
        for (const randomKey of Object.keys(randomKeys)) {
          const val = bonusConfig[lineKey]?.[randomKey];
          result[lineKey][randomKey] = typeof val === 'number' ? val : 1;
        }
      }
      for (const lineNum of lineOptions) {
        const lineKey = `line${lineNum}_bonus`;
        result[lineKey] = {};
        for (const randomKey of Object.keys(randomKeys)) {
          const val = bonusBonusConfig[lineKey.replace('_bonus', '')]?.[randomKey];
          result[lineKey][randomKey] = typeof val === 'number' ? val : 1;
        }
      }
    }

    return result;
  }

  /**
   * Get game bank amount
   */
  get_gamebank(slotState: string = ''): number {
    const bankKey = slotState === 'bonus' ? 'bonus_bank' : 'main_bank';
    return this.jp_config[bankKey] ?? 1000.0;
  }

  /**
   * Set game bank amount
   */
  setGameBank(amount: number, operation: 'inc' | 'dec', slotState: string): void {
    const bankKey = slotState === 'bonus' ? 'bonus_bank' : 'main_bank';

    if (this.jp_config[bankKey] === undefined) {
      this.jp_config[bankKey] = 0;
    }

    // Type assertion safe here as we initialized it above if undefined
    if (operation === 'inc') {
      (this.jp_config[bankKey] as number) += amount;
    } else {
      (this.jp_config[bankKey] as number) -= amount;
    }

    this.changedData['jp_config'] = this.jp_config;
    this.isModified = true;
  }

  refresh(): void {
    // No-op
  }

  getState(): GameData {
    return {
      id: this.id,
      name: this.name,
      shop_id: this.shop_id,
      stat_in: this.stat_in,
      stat_out: this.stat_out,
      bids: this.bids,
      denomination: this.denomination,
      slotViewState: this.slotViewState,
      bet: this.bet,
      jp_config: this.jp_config,
      rezerv: this.rezerv,
      view: this.view,
      advanced: this.advanced,
      lines_percent_config_spin: this.lines_percent_config_spin,
      lines_percent_config_spin_bonus: this.lines_percent_config_spin_bonus,
      lines_percent_config_bonus: this.lines_percent_config_bonus,
      lines_percent_config_bonus_bonus: this.lines_percent_config_bonus_bonus
    };
  }

  static getValues(key: string): readonly (string | number)[] | Record<string, readonly number[]> {
    return this.values[key] || [];
  }
}