/**
 * Game Model for Casino Game System
 * 
 * This is the most complex model in the casino system, containing massive static
 * configuration arrays, complex configuration parsing, and critical game logic
 * that manages RTP, paylines, and game settings.
 * 
 * @package Casino Game System
 * @version 1.0.0
 */

import { BaseModel } from './BaseModel';

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
  jp_config?: Record<string, any>;
  rezerv?: number;
  view?: boolean;
  advanced?: string;
  lines_percent_config_spin?: string;
  lines_percent_config_spin_bonus?: string;
  lines_percent_config_bonus?: string;
  lines_percent_config_bonus_bonus?: string;
}

/**
 * Lines percent configuration types
 */
export type LinesPercentConfigType = 'spin' | 'spin_bonus' | 'bonus' | 'bonus_bonus';

/**
 * Lines percent configuration data structure
 */
export interface LinesPercentConfig {
  [key: string]: {
    [randomKey: string]: number;
  };
}

/**
 * Game Model class with ArrayAccess for backward compatibility
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
  public jp_config: Record<string, any>;
  public rezerv: number;
  public view: boolean;
  public advanced: string;
  public lines_percent_config_spin: string;
  public lines_percent_config_spin_bonus: string;
  public lines_percent_config_bonus: string;
  public lines_percent_config_bonus_bonus: string;
  public shortNames: readonly string[];

  // Lines percent config storage
  private linesPercentConfigs: Record<string, any> = {};

  // Massive static configuration arrays (converted from PHP static $values)
  private static readonly values: Record<string, readonly (string | number)[] | Record<string, readonly number[]>> = {
    jp_1_percent: [
      '1', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'
    ],
    jp_2_percent: [
      '1', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'
    ],
    jp_3_percent: [
      '1', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'
    ],
    jp_4_percent: [
      '1', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'
    ],
    jp_5_percent: [
      '1', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'
    ],
    jp_6_percent: [
      '1', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'
    ],
    jp_7_percent: [
      '1', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'
    ],
    jp_8_percent: [
      '1', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'
    ],
    jp_9_percent: [
      '1', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'
    ],
    jp_10_percent: [
      '1', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'
    ],
    random_keys: {
      '74_80': [74, 80],
      '82_88': [82, 88],
      '90_96': [90, 96]
    },
    random_values: [
      3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 22, 25, 28, 30, 40, 50, 100
    ],
    bet: [
      '0.01, 0.02, 0.05, 0.10, 0.20, 1.00, 5.00, 10.00, 20.00',
      '0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 5.00, 10.00',
      '10, 20, 50, 100',
      '1.00, 5.00, 10.00, 20.00',
    ],
    winline1: [1, 5, 10, 20, 50, 100],
    winline3: [1, 5, 10, 20, 50, 100],
    winline5: [1, 5, 10, 20, 50, 100],
    winline7: [1, 5, 10, 20, 50, 100],
    winline9: [1, 5, 10, 20, 50, 100],
    winline10: [1, 5, 10, 20, 50, 100],
    garant_win1: [1, 5, 10, 20, 50, 100],
    garant_win3: [1, 5, 10, 20, 50, 100],
    garant_win5: [1, 5, 10, 20, 50, 100],
    garant_win7: [1, 5, 10, 20, 50, 100],
    garant_win9: [1, 5, 10, 20, 50, 100],
    garant_win10: [1, 5, 10, 20, 50, 100],
    winbonus1: [1, 50, 100, 200, 500, 1000],
    winbonus3: [1, 50, 100, 200, 500, 1000],
    winbonus5: [1, 50, 100, 200, 500, 1000],
    winbonus7: [1, 50, 100, 200, 500, 1000],
    winbonus9: [1, 50, 100, 200, 500, 1000],
    winbonus10: [1, 50, 100, 200, 500, 1000],
    garant_bonus1: [1, 50, 100, 200, 500, 1000],
    garant_bonus3: [1, 50, 100, 200, 500, 1000],
    garant_bonus5: [1, 50, 100, 200, 500, 1000],
    garant_bonus7: [1, 50, 100, 200, 500, 1000],
    garant_bonus9: [1, 50, 100, 200, 500, 1000],
    garant_bonus10: [1, 50, 100, 200, 500, 1000],
    winline_bonus1: [1, 5, 10, 20, 50, 100],
    winline_bonus3: [1, 5, 10, 20, 50, 100],
    winline_bonus5: [1, 5, 10, 20, 50, 100],
    winline_bonus7: [1, 5, 10, 20, 50, 100],
    winline_bonus9: [1, 5, 10, 20, 50, 100],
    winline_bonus10: [1, 5, 10, 20, 50, 100],
    garant_win_bonus1: [1, 5, 10, 20, 50, 100],
    garant_win_bonus3: [1, 5, 10, 20, 50, 100],
    garant_win_bonus5: [1, 5, 10, 20, 50, 100],
    garant_win_bonus7: [1, 5, 10, 20, 50, 100],
    garant_win_bonus9: [1, 5, 10, 20, 50, 100],
    garant_win_bonus10: [1, 5, 10, 20, 50, 100],
    match_winline1: [
      '2, 5, 5, 5, 4, 2, 1, 2, 2, 3, 4, 5, 3, 2, 2, 5, 4, 2, 3, 1, 10, 20',
      '8, 8, 10, 10, 4, 4, 2, 4, 10, 10, 8, 2, 1, 3, 7, 10, 1, 3, 5, 5, 10, 20',
      '1, 7, 12, 3, 17, 1, 9, 11, 13, 15, 14, 18, 9, 7, 3, 11, 2, 7, 5, 9, 10, 20'
    ],
    match_winline3: [
      '2, 5, 5, 5, 4, 2, 1, 2, 2, 3, 4, 5, 3, 2, 2, 5, 4, 2, 3, 1, 10, 20',
      '8, 8, 10, 10, 4, 4, 2, 4, 10, 10, 8, 2, 1, 3, 7, 10, 1, 3, 5, 5, 10, 20',
      '1, 7, 12, 3, 17, 1, 9, 11, 13, 15, 14, 18, 9, 7, 3, 11, 2, 7, 5, 9, 10, 20'
    ],
    match_winline5: [
      '2, 5, 5, 5, 4, 2, 1, 2, 2, 3, 4, 5, 3, 2, 2, 5, 4, 2, 3, 1, 10, 20',
      '8, 8, 10, 10, 4, 4, 2, 4, 10, 10, 8, 2, 1, 3, 7, 10, 1, 3, 5, 5, 10, 20',
      '1, 7, 12, 3, 17, 1, 9, 11, 13, 15, 14, 18, 9, 7, 3, 11, 2, 7, 5, 9, 10, 20'
    ],
    match_winline7: [
      '2, 5, 5, 5, 4, 2, 1, 2, 2, 3, 4, 5, 3, 2, 2, 5, 4, 2, 3, 1, 10, 20',
      '8, 8, 10, 10, 4, 4, 2, 4, 10, 10, 8, 2, 1, 3, 7, 10, 1, 3, 5, 5, 10, 20',
      '1, 7, 12, 3, 17, 1, 9, 11, 13, 15, 14, 18, 9, 7, 3, 11, 2, 7, 5, 9, 10, 20'
    ],
    match_winline9: [
      '2, 5, 5, 5, 4, 2, 1, 2, 2, 3, 4, 5, 3, 2, 2, 5, 4, 2, 3, 1, 10, 20',
      '8, 8, 10, 10, 4, 4, 2, 4, 10, 10, 8, 2, 1, 3, 7, 10, 1, 3, 5, 5, 10, 20',
      '1, 7, 12, 3, 17, 1, 9, 11, 13, 15, 14, 18, 9, 7, 3, 11, 2, 7, 5, 9, 10, 20'
    ],
    match_winline10: [
      '2, 5, 5, 5, 4, 2, 1, 2, 2, 3, 4, 5, 3, 2, 2, 5, 4, 2, 3, 1, 10, 20',
      '8, 8, 10, 10, 4, 4, 2, 4, 10, 10, 8, 2, 1, 3, 7, 10, 1, 3, 5, 5, 10, 20',
      '1, 7, 12, 3, 17, 1, 9, 11, 13, 15, 14, 18, 9, 7, 3, 11, 2, 7, 5, 9, 10, 20'
    ],
    match_winbonus1: [
      '101, 122, 82, 118, 134, 59, 86, 87, 73, 103, 121, 133, 75, 133, 97, 78, 150, 107, 98, 67',
      '115, 105, 222, 199, 196, 170, 120, 189, 240, 126, 194, 210, 194, 143, 164, 147, 246, 104, 201, 245',
      '185, 343, 450, 288, 315, 243, 302, 259, 376, 338, 431, 229, 272, 265, 150, 226, 441, 460, 478, 273'
    ],
    match_winbonus3: [
      '101, 122, 82, 118, 134, 59, 86, 87, 73, 103, 121, 133, 75, 133, 97, 78, 150, 107, 98, 67',
      '115, 105, 222, 199, 196, 170, 120, 189, 240, 126, 194, 210, 194, 143, 164, 147, 246, 104, 201, 245',
      '185, 343, 450, 288, 315, 243, 302, 259, 376, 338, 431, 229, 272, 265, 150, 226, 441, 460, 478, 273'
    ],
    match_winbonus5: [
      '101, 122, 82, 118, 134, 59, 86, 87, 73, 103, 121, 133, 75, 133, 97, 78, 150, 107, 98, 67',
      '115, 105, 222, 199, 196, 170, 120, 189, 240, 126, 194, 210, 194, 143, 164, 147, 246, 104, 201, 245',
      '185, 343, 450, 288, 315, 243, 302, 259, 376, 338, 431, 229, 272, 265, 150, 226, 441, 460, 478, 273'
    ],
    match_winbonus7: [
      '101, 122, 82, 118, 134, 59, 86, 87, 73, 103, 121, 133, 75, 133, 97, 78, 150, 107, 98, 67',
      '115, 105, 222, 199, 196, 170, 120, 189, 240, 126, 194, 210, 194, 143, 164, 147, 246, 104, 201, 245',
      '185, 343, 450, 288, 315, 243, 302, 259, 376, 338, 431, 229, 272, 265, 150, 226, 441, 460, 478, 273'
    ],
    match_winbonus9: [
      '101, 122, 82, 118, 134, 59, 86, 87, 73, 103, 121, 133, 75, 133, 97, 78, 150, 107, 98, 67',
      '115, 105, 222, 199, 196, 170, 120, 189, 240, 126, 194, 210, 194, 143, 164, 147, 246, 104, 201, 245',
      '185, 343, 450, 288, 315, 243, 302, 259, 376, 338, 431, 229, 272, 265, 150, 226, 441, 460, 478, 273'
    ],
    match_winbonus10: [
      '101, 122, 82, 118, 134, 59, 86, 87, 73, 103, 121, 133, 75, 133, 97, 78, 150, 107, 98, 67',
      '115, 105, 222, 199, 196, 170, 120, 189, 240, 126, 194, 210, 194, 143, 164, 147, 246, 104, 201, 245',
      '185, 343, 450, 288, 315, 243, 302, 259, 376, 338, 431, 229, 272, 265, 150, 226, 441, 460, 478, 273'
    ],
    match_winline_bonus1: [
      '2, 5, 5, 5, 4, 2, 1, 2, 2, 3, 4, 5, 3, 2, 2, 5, 4, 2, 3, 1, 10, 20',
      '8, 8, 10, 10, 4, 4, 2, 4, 10, 10, 8, 2, 1, 3, 7, 10, 1, 3, 5, 5, 10, 20',
      '1, 7, 12, 3, 17, 1, 9, 11, 13, 15, 14, 18, 9, 7, 3, 11, 2, 7, 5, 9, 10, 20'
    ],
    match_winline_bonus3: [
      '2, 5, 5, 5, 4, 2, 1, 2, 2, 3, 4, 5, 3, 2, 2, 5, 4, 2, 3, 1, 10, 20',
      '8, 8, 10, 10, 4, 4, 2, 4, 10, 10, 8, 2, 1, 3, 7, 10, 1, 3, 5, 5, 10, 20',
      '1, 7, 12, 3, 17, 1, 9, 11, 13, 15, 14, 18, 9, 7, 3, 11, 2, 7, 5, 9, 10, 20'
    ],
    match_winline_bonus5: [
      '2, 5, 5, 5, 4, 2, 1, 2, 2, 3, 4, 5, 3, 2, 2, 5, 4, 2, 3, 1, 10, 20',
      '8, 8, 10, 10, 4, 4, 2, 4, 10, 10, 8, 2, 1, 3, 7, 10, 1, 3, 5, 5, 10, 20',
      '1, 7, 12, 3, 17, 1, 9, 11, 13, 15, 14, 18, 9, 7, 3, 11, 2, 7, 5, 9, 10, 20'
    ],
    match_winline_bonus7: [
      '2, 5, 5, 5, 4, 2, 1, 2, 2, 3, 4, 5, 3, 2, 2, 5, 4, 2, 3, 1, 10, 20',
      '8, 8, 10, 10, 4, 4, 2, 4, 10, 10, 8, 2, 1, 3, 7, 10, 1, 3, 5, 5, 10, 20',
      '1, 7, 12, 3, 17, 1, 9, 11, 13, 15, 14, 18, 9, 7, 3, 11, 2, 7, 5, 9, 10, 20'
    ],
    match_winline_bonus9: [
      '2, 5, 5, 5, 4, 2, 1, 2, 2, 3, 4, 5, 3, 2, 2, 5, 4, 2, 3, 1, 10, 20',
      '8, 8, 10, 10, 4, 4, 2, 4, 10, 10, 8, 2, 1, 3, 7, 10, 1, 3, 5, 5, 10, 20',
      '1, 7, 12, 3, 17, 1, 9, 11, 13, 15, 14, 18, 9, 7, 3, 11, 2, 7, 5, 9, 10, 20'
    ],
    match_winline_bonus10: [
      '2, 5, 5, 5, 4, 2, 1, 2, 2, 3, 4, 5, 3, 2, 2, 5, 4, 2, 3, 1, 10, 20',
      '8, 8, 10, 10, 4, 4, 2, 4, 10, 10, 8, 2, 1, 3, 7, 10, 1, 3, 5, 5, 10, 20',
      '1, 7, 12, 3, 17, 1, 9, 11, 13, 15, 14, 18, 9, 7, 3, 11, 2, 7, 5, 9, 10, 20'
    ],
    rezerv: [2, 4, 6, 8, 10],
    cask: [9, 18, 36, 72, 90],
    denomination: [
      '0.01', '0.02', '0.05', '0.10', '0.20', '0.25', '0.50',
      '1.00', '2.00', '2.50', '5.00', '10.00', '20.00', '25.00', '50.00', '100.00'
    ],
    gamebank: ['slots', 'little', 'table_bank', 'fish'],
    chanceFirepot1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    chanceFirepot2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    chanceFirepot3: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    fireCount1: [
      '1,1,1,1,1,2,2,2,2,2,3,3,3',
      '1,1,1,2,2,2,3,3,3,3',
      '1,1,2,2,3,3,3'
    ],
    fireCount2: [
      '1,1,1,1,1,2,2,2,2,2,3,3,3',
      '1,1,1,2,2,2,3,3,3,3',
      '1,1,2,2,3,3,3'
    ],
    fireCount3: [
      '1,1,1,1,1,2,2,2,2,2,3,3,3',
      '1,1,1,2,2,2,3,3,3,3',
      '1,1,2,2,3,3,3'
    ]
  };

  /**
   * Constructor for Game model
   * @param data Initial data for the model
   */
  constructor(data: GameData = { name: '' }) {
    super(data);
    console.log(data)
    // Initialize properties with defaults from PHP version
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

    // Parse and store lines percent config data from database fields
    this.setLinesPercentConfigs(data);
  }

  /**
   * Get configuration values for a specific key
   * Handles different config types with backward compatibility
   * @param key Configuration key
   * @param addEmpty Whether to add empty placeholder
   * @param addValue Custom value to prepend
   * @returns Combined array of keys and labels
   */
  get_values(key: string, addEmpty: boolean = false, addValue?: string): Record<string, string> {
    // Retrieve the base keys from the Game configuration
    const keysList = (Game.values[key] as readonly (string | number)[]) ?? [];

    // By default, labels are the same as keys
    let labelsList = keysList;

    // If the key relates to specific match types, use shortNames for labels
    if (key.includes('match_winbonus') || key.includes('match_winline') || key.includes('match_winline_bonus')) {
      labelsList = this.shortNames;
    }

    // Convert to string arrays
    const keysArray = keysList.map(String);
    const labelsArray = labelsList.map(String);

    // Combine keys and labels
    let combinedArray: Record<string, string>;

    if (addEmpty) {
      const mergedKeys = ['', ...keysArray];
      const mergedLabels = ['---', ...labelsArray];
      combinedArray = mergedKeys.reduce((acc, key, index) => {
        acc[key] = mergedLabels[index];
        return acc;
      }, {} as Record<string, string>);
    } else {
      combinedArray = keysArray.reduce((acc, key, index) => {
        acc[key] = labelsArray[index];
        return acc;
      }, {} as Record<string, string>);
    }

    // Prepend a custom value if requested
    if (addValue) {
      return { [addValue]: addValue, ...combinedArray };
    }

    return combinedArray;
  }

  /**
   * Parse lines percent config JSON strings from incoming data
   * @param data Data containing configuration strings
   */
  private setLinesPercentConfigs(data: GameData): void {
    // Map configuration types to database field names
    const configFields: Record<LinesPercentConfigType, keyof GameData> = {
      'spin': 'lines_percent_config_spin',
      'spin_bonus': 'lines_percent_config_spin_bonus',
      'bonus': 'lines_percent_config_bonus',
      'bonus_bonus': 'lines_percent_config_bonus_bonus'
    };

    for (const [type, fieldName] of Object.entries(configFields)) {
      const fieldValue = data[fieldName];
      if (typeof fieldValue === 'string' && fieldValue.trim()) {
        try {
          const parsedConfig = JSON.parse(fieldValue);
          if (Array.isArray(parsedConfig) || typeof parsedConfig === 'object') {
            this.linesPercentConfigs[type] = parsedConfig;
          }
        } catch (error) {
          console.warn(`Failed to parse ${fieldName}:`, error);
        }
      }
    }

    // Store in jp_config for backward compatibility with existing code
    if (Object.keys(this.linesPercentConfigs).length > 0) {
      this.jp_config['lines_percent_config'] = this.linesPercentConfigs;
    }
  }

  /**
   * Get a specific line value from JSON configuration data
   * @param data JSON configuration data
   * @param index1 First index
   * @param index2 Second index
   * @param returnEmpty Whether to return empty string on missing value
   * @returns Line value or default
   */
  get_line_value(data: any, index1: string, index2: string, returnEmpty: boolean = false): number | string {
    try {
      // Handle empty, null, or undefined data gracefully - DO NOT log repeatedly
      if (!data || (typeof data === 'string' && data.trim() === '')) {
        return returnEmpty ? '' : 1;
      }

      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Validate parsed data structure
      if (!parsedData || typeof parsedData !== 'object') {
        console.warn('get_line_value: Invalid data structure, using default for', index1, index2);
        return returnEmpty ? '' : 1;
      }

      // Check if the nested structure exists
      if (parsedData[index1] &&
          typeof parsedData[index1] === 'object' &&
          parsedData[index1][index2] !== undefined) {
        return parsedData[index1][index2];
      }
    } catch (error) {
      console.warn('Failed to parse line value data:', error, 'Data preview:', typeof data === 'string' ? data.substring(0, 200) + (data.length > 200 ? '...' : '') : data);
    }

    return returnEmpty ? '' : 1;
  }

  /**
   * Get lines percent configuration for a specific type
   * @param type Configuration type ('spin' or 'bonus')
   * @returns Lines percent configuration data
   */
  get_lines_percent_config(type: LinesPercentConfigType): Record<string, Record<string, number>> {
    const result: Record<string, Record<string, number>> = {};
    const lineOptions = [1, 3, 5, 7, 9, 10];
    const randomKeys = Game.values.random_keys as Record<string, readonly number[]>;

    if (type === 'spin') {
      // Normal Spin Lines
      for (const lineNum of lineOptions) {
        const lineKey = `line${lineNum}`;
        result[lineKey] = {};
        for (const [randomKey, values] of Object.entries(randomKeys)) {
          result[lineKey][randomKey] = this.get_line_value(
            this.lines_percent_config_spin,
            lineKey,
            randomKey
          ) as number;
        }
      }

      // Spin Bonus Lines
      for (const lineNum of lineOptions) {
        const lineKey = `line${lineNum}_bonus`;
        result[lineKey] = {};
        for (const [randomKey, values] of Object.entries(randomKeys)) {
          result[lineKey][randomKey] = this.get_line_value(
            this.lines_percent_config_spin_bonus,
            lineKey,
            randomKey
          ) as number;
        }
      }
    }

    if (type === 'bonus') {
      // Bonus Round Lines
      for (const lineNum of lineOptions) {
        const lineKey = `line${lineNum}`;
        result[lineKey] = {};
        for (const [randomKey, values] of Object.entries(randomKeys)) {
          result[lineKey][randomKey] = this.get_line_value(
            this.lines_percent_config_bonus,
            lineKey,
            randomKey
          ) as number;
        }
      }

      // Bonus Round Bonus Lines
      for (const lineNum of lineOptions) {
        const lineKey = `line${lineNum}_bonus`;
        result[lineKey] = {};
        for (const [randomKey, values] of Object.entries(randomKeys)) {
          result[lineKey][randomKey] = this.get_line_value(
            this.lines_percent_config_bonus_bonus,
            lineKey,
            randomKey
          ) as number;
        }
      }
    }

    return result;
  }

  /**
   * Get game bank amount for specific slot state
   * @param slotState State of the slot ('bonus' for bonus state, empty for main state)
   * @returns Bank amount
   */
  get_gamebank(slotState: string = ''): number {
    const bankKey = slotState === 'bonus' ? 'bonus_bank' : 'main_bank';
    return this.jp_config[bankKey] ?? 1000.0;
  }

  /**
   * Set game bank amount for specific slot state
   * @param amount Amount to set
   * @param operation Operation type ('inc' for increment, 'dec' for decrement)
   * @param slotState State of the slot
   */
  setGameBank(amount: number, operation: 'inc' | 'dec', slotState: string): void {
    const bankKey = slotState === 'bonus' ? 'bonus_bank' : 'main_bank';

    if (!this.jp_config[bankKey]) {
      this.jp_config[bankKey] = 0;
    }

    if (operation === 'inc') {
      this.jp_config[bankKey] += amount;
    } else {
      this.jp_config[bankKey] -= amount;
    }

    // Update change tracking
    this.changedData['jp_config'] = this.jp_config;
    this.isModified = true;
  }

  /**
   * Refresh method - no-op for stateless operation
   */
  refresh(): void {
    // No-op for stateless operation
  }

  /**
   * Get the current state of the model
   * @returns Current state as GameData
   */
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

  // Static method for accessing configuration values
  /**
   * Static method to get configuration values
   * @param key Configuration key
   * @returns Configuration values
   */
  static getValues(key: string): readonly (string | number)[] | Record<string, readonly number[]> {
    return this.values[key] || [];
  }
}