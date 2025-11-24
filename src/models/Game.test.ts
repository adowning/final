/**
 * Test file for Game model conversion
 */

import { Game } from './Game';

describe('Game Model', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game({
      id: 1,
      name: 'Test Game',
      shop_id: 1,
      lines_percent_config_spin: JSON.stringify({
        line1: {
          '74_80': 85,
          '82_88': 90,
          '90_96': 95
        },
        line3: {
          '74_80': 80,
          '82_88': 85,
          '90_96': 92
        }
      }),
      lines_percent_config_spin_bonus: JSON.stringify({
        line1_bonus: {
          '74_80': 75,
          '82_88': 80,
          '90_96': 88
        }
      }),
      jp_config: {
        main_bank: 1000.0,
        bonus_bank: 500.0
      }
    });
  });

  describe('Static Configuration Arrays', () => {
    test('should have jp_1_percent values', () => {
      const values = Game.getValues('jp_1_percent');
      expect(values).toEqual(['1', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1']);
    });

    test('should have random_keys configuration', () => {
      const randomKeys = Game.getValues('random_keys');
      expect(randomKeys).toEqual({
        '74_80': [74, 80],
        '82_88': [82, 88],
        '90_96': [90, 96]
      });
    });

    test('should have denomination options', () => {
      const denominations = Game.getValues('denomination');
      expect(denominations).toEqual([
        '0.01', '0.02', '0.05', '0.10', '0.20', '0.25', '0.50',
        '1.00', '2.00', '2.50', '5.00', '10.00', '20.00', '25.00', '50.00', '100.00'
      ]);
    });
  });

  describe('get_values() Method', () => {
    test('should return basic key-value pairs', () => {
      const result = game.get_values('jp_1_percent');
      expect(result['1']).toBe('1');
      expect(result['0.9']).toBe('0.9');
    });

    test('should use shortNames for match types', () => {
      const result = game.get_values('match_winline1');
      expect(result).toHaveProperty('2, 5, 5, 5, 4, 2, 1, 2, 2, 3, 4, 5, 3, 2, 2, 5, 4, 2, 3, 1, 10, 20');
      // Should use 'Low' label for first value
      const firstKey = Object.keys(result)[0];
      expect(result[firstKey]).toBe('Low');
    });

    test('should add empty placeholder when requested', () => {
      const result = game.get_values('jp_1_percent', true);
      expect(result['']).toBe('---');
      expect(result['1']).toBe('1');
    });

    test('should prepend custom value when requested', () => {
      const result = game.get_values('jp_1_percent', false, 'custom');
      expect(result['custom']).toBe('custom');
      expect(result['1']).toBe('1');
    });
  });

  describe('Lines Percent Configuration', () => {
    test('should parse lines percent config for spin type', () => {
      const config = game.get_lines_percent_config('spin');
      
      expect(config.line1).toBeDefined();
      expect(config.line1['74_80']).toBe(85);
      expect(config.line1['82_88']).toBe(90);
      expect(config.line1['90_96']).toBe(95);
    });

    test('should handle spin bonus lines', () => {
      const config = game.get_lines_percent_config('spin');
      
      expect(config.line1_bonus).toBeDefined();
      expect(config.line1_bonus['74_80']).toBe(75);
      expect(config.line1_bonus['82_88']).toBe(80);
      expect(config.line1_bonus['90_96']).toBe(88);
    });

    test('should return default values for missing config data', () => {
      const config = game.get_lines_percent_config('bonus');
      
      // Should have structure but use default values
      expect(config.line1).toBeDefined();
      expect(config.line1['74_80']).toBe(1); // Default value
    });
  });

  describe('Game Bank Management', () => {
    test('should get main bank', () => {
      const bank = game.get_gamebank('');
      expect(bank).toBe(1000.0);
    });

    test('should get bonus bank', () => {
      const bank = game.get_gamebank('bonus');
      expect(bank).toBe(500.0);
    });

    test('should get default bank when not set', () => {
      const gameWithoutBank = new Game({ name: 'Test' });
      const bank = gameWithoutBank.get_gamebank('');
      expect(bank).toBe(1000.0);
    });

    test('should increment bank amount', () => {
      game.setGameBank(100, 'inc', '');
      expect(game.get_gamebank('')).toBe(1100.0);
    });

    test('should decrement bank amount', () => {
      game.setGameBank(100, 'dec', '');
      expect(game.get_gamebank('')).toBe(900.0);
    });

    test('should handle bonus bank operations', () => {
      game.setGameBank(50, 'inc', 'bonus');
      expect(game.get_gamebank('bonus')).toBe(550.0);
    });
  });

  describe('Change Tracking Integration', () => {
    test('should track changes when bank is modified', () => {
      expect(game.hasChanges()).toBe(false);
      
      game.setGameBank(100, 'inc', '');
      
      expect(game.hasChanges()).toBe(true);
      expect(game.getChanges()).toHaveProperty('jp_config');
    });

    test('should get current state', () => {
      const state = game.getState();
      
      expect(state).toHaveProperty('id', 1);
      expect(state).toHaveProperty('name', 'Test Game');
      expect(state).toHaveProperty('shop_id', 1);
    });
  });

  describe('ArrayAccess Backward Compatibility', () => {
    test('should allow property access via bracket notation', () => {
      expect(game['name']).toBe('Test Game');
      expect(game['id']).toBe(1);
    });

    test('should allow property setting via bracket notation', () => {
      game['name'] = 'Updated Game';
      expect(game['name']).toBe('Updated Game');
    });

    test('should check property existence', () => {
      expect(game.offsetExists('name')).toBe(true);
      expect(game.offsetExists('nonexistent')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should handle invalid JSON gracefully', () => {
      const gameWithInvalidJson = new Game({
        name: 'Test',
        lines_percent_config_spin: 'invalid json'
      });
      
      const config = gameWithInvalidJson.get_lines_percent_config('spin');
      expect(config).toBeDefined();
    });

    test('should handle empty configuration', () => {
      const emptyGame = new Game({ name: 'Empty' });
      const config = emptyGame.get_lines_percent_config('spin');
      expect(config).toBeDefined();
    });

    test('should handle missing static values gracefully', () => {
      const values = Game.getValues('nonexistent_key');
      expect(values).toEqual([]);
    });
  });
});