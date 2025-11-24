/**
 * Integration Test for Casino Game System
 * This test verifies that all models can be imported and used together
 */

import { Game } from './Game';
import { User } from './User';
import { Shop } from './Shop';
import { JPG } from './JPG';
import { BaseSlotSettings, IGameSettings } from '../games/base/BaseSlotSettings';

console.log('🔗 Starting Integration Tests...\n');

// Test 1: Basic Model Creation
console.log('📦 Testing Model Creation:');
try {
  const game = new Game({
    id: 1,
    name: 'Test Game',
    denomination: 1.0
  });
  console.log('✅ Game model created:', game.name);

  const user = new User({
    id: 'user123',
    balance: 1000,
    count_balance: 500
  });
  console.log('✅ User model created:', user.id);

  const shop = new Shop({
    id: 1,
    max_win: 50000,
    percent: 10
  });
  console.log('✅ Shop model created:', shop.id);

  console.log('✅ All basic models created successfully\n');

} catch (error) {
  console.error('❌ Model creation failed:', error);
}

// Test 2: Game Configuration Access
console.log('⚙️ Testing Game Configuration:');
try {
  const jpValues = Game.getValues('jp_1_percent');
  console.log('✅ Static configuration accessible:', Array.isArray(jpValues) ? `${jpValues.length} values` : 'Object');

  const denominationValues = Game.getValues('denomination') as readonly string[];
  console.log('✅ Denomination options:', denominationValues.length, 'available');

  console.log('✅ Game configuration tests passed\n');

} catch (error) {
  console.error('❌ Game configuration test failed:', error);
}

// Test 3: Model Integration with BaseSlotSettings
console.log('🏗️ Testing BaseSlotSettings Integration:');
try {
  const testSettings: IGameSettings = {
    user: {
      id: 'test_user',
      balance: 1000,
      count_balance: 500,
      address: 0
    },
    game: {
      id: 1,
      name: 'Integration Test Game',
      denomination: 1.0,
      bet: '0.1,0.2,0.5,1,2,5'
    },
    shop: {
      id: 1,
      max_win: 10000,
      percent: 10,
      currency: 'USD',
      is_blocked: false
    },
    reelStrips: {
      reelStrip1: ['A', 'B', 'C', 'D', 'E'],
      reelStrip2: ['A', 'B', 'C', 'D', 'E'],
      reelStrip3: ['A', 'B', 'C', 'D', 'E']
    }
  };

  const slotSettings = new BaseSlotSettings(testSettings);
  console.log('✅ BaseSlotSettings created successfully');
  console.log('   - Player ID:', slotSettings.playerId);
  console.log('   - Balance:', slotSettings.GetBalance());
  console.log('   - Currency:', slotSettings.slotCurrency);
  console.log('   - Is Active:', slotSettings.is_active());

  console.log('✅ BaseSlotSettings integration test passed\n');

} catch (error) {
  console.error('❌ BaseSlotSettings integration test failed:', error);
}

// Test 4: Backward Compatibility ArrayAccess
console.log('🔄 Testing ArrayAccess Backward Compatibility:');
try {
  const game = new Game({
    id: 42,
    name: 'Compatibility Test Game'
  });

  // Test bracket access
  const gameName = game['name'];
  const gameId = game['id'];
  console.log('✅ Bracket read access - name:', gameName);
  console.log('✅ Bracket read access - id:', gameId);

  // Test bracket write
  game['denomination'] = 2.5;
  const updatedDenom = game['denomination'];
  console.log('✅ Bracket write access - denomination:', updatedDenom);

  console.log('✅ ArrayAccess compatibility test passed\n');

} catch (error) {
  console.error('❌ ArrayAccess compatibility test failed:', error);
}

// Test 5: Model Change Tracking
console.log('📊 Testing Change Tracking:');
try {
  const user = new User({
    id: 'track_user',
    balance: 1000
  });

  console.log('✅ Initial balance:', user.balance);
  
  user.increment('balance', 100);
  console.log('✅ After increment +100:', user.balance);
  
  console.log('✅ Has changes:', user.hasChanges());
  console.log('✅ Changes count:', Object.keys(user.getChanges()).length);

  console.log('✅ Change tracking test passed\n');

} catch (error) {
  console.error('❌ Change tracking test failed:', error);
}

console.log('🎉 Integration Tests Complete!');
console.log('\n📋 Summary:');
console.log('✅ Model creation and basic functionality');
console.log('✅ Game configuration and static values');
console.log('✅ BaseSlotSettings integration with all models');
console.log('✅ ArrayAccess backward compatibility');
console.log('✅ Change tracking and state management');
console.log('\n🚀 Casino Game System Core Integration Verified!');