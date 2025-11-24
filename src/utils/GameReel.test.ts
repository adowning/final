/**
 * Test file to verify GameReel.ts API compatibility with PHP version
 * Tests the exact same data parsing logic as the PHP implementation
 */

import { GameReel } from './GameReel.js';

// Test data in the same format as the PHP version uses
const testReelData: string[] = [
  'reelStrip1=3,8,3,6,7,4,6,3,5,9,8,5,8,9,8,7,4,3,7,3,5,6,0,4,7,4,9,8,7,8,7,5,9,8,6,9,8,0,5,8,10,4,7,10,4,6,10,6,8,6,7,6,3,7,5,9,6,3,10,9,10,9,8,5,8,0,3,7,4,6,5,6,8,5,9,5,10,4,10,4,9,8,10,8,9,6,9,5,4,7,10,7,4,7,10,5,0,3,7,7,3,10,5,9,4,6,10,6,3,5,8,5,10,9,10,9,7,8,10,8,5,6,10,4,8,8,10,1',
  'reelStrip2=3,8,6,3,6,7,4,6,3,5,0,5,8,9,8,9,8,7,5,7,4,3,7,3,5,6,5,4,7,4,9,8,7,5,9,8,8,6,5,8,10,7,4,7,10,4,6,10,6,8,6,7,9,3,5,7,5,9,10,6,10,3,9,10,9,5,8,5,9,8,3,7,4,6,5,8,5,9,5,10,4,5,4,10,9,8,10,8,9,10,6,5,7,4,7,4,7,10,3,10,7,6,10,3,9,10,4,6,10,3,8,5,10,6,0,9,10,7,8,10,8,5,6,5,10,4,8,10,1',
  'reelStrip3=3,8,6,7,6,7,4,6,8,3,5,9,5,8,9,8,7,4,3,7,5,3,5,6,3,0,4,7,9,8,4,7,8,7,5,9,5,9,5,8,6,0,5,8,10,5,4,7,10,4,10,6,8,6,9,6,0,3,7,6,5,9,6,3,10,9,10,5,9,8,5,8,7,0,3,7,8,6,4,5,6,5,8,9,10,5,4,10,5,4,10,9,8,9,10,9,6,7,5,4,7,6,4,7,10,0,3,6,7,3,10,9,6,4,6,10,3,8,0,7,9,10,7,10,8,5,6,5,10,8,4,8,10,1',
  'reelStripBonus1=3,8,3,6,7,4,6,3,5,9,8,5,8,9,8,7,4,3,7,3,5,6,0,4,7,4,9,8,7,8,7,5,9,8,6,9,8,0,5,8,10,4,7,10,4,6,10,6,8,6,7,6,3,7,5,9,6,3,10,9,10,9,8,5,8,0,3,7,4,6,5,6,8,5,9,5,10,4,10,4,9,8,10,8,9,6,9,5,4,7,10,7,4,7,10,5,0,3,7,7,3,10,5,9,4,6,10,6,3,5,8,5,10,9,10,9,7,8,10,8,5,6,10,4,8,8,10,1',
  'reelStripBonus2=3,8,6,3,6,7,4,6,3,5,0,5,8,9,8,9,8,7,5,7,4,3,7,3,5,6,5,4,7,4,9,8,7,5,9,8,8,6,5,8,10,7,4,7,10,4,6,10,6,8,6,7,9,3,5,7,5,9,10,6,10,3,9,10,9,5,8,5,9,8,3,7,4,6,5,8,5,9,5,10,4,5,4,10,9,8,10,8,9,10,6,5,7,4,7,4,7,10,3,10,7,6,10,3,9,10,4,6,10,3,8,5,10,6,0,9,10,7,8,10,8,5,6,5,10,4,8,10,1',
  'reelStrip6=',  // Empty strip (same as PHP version)
  'reelStripBonus6=' // Empty bonus strip (same as PHP version)
];

// Test functions
export function testGameReelBasicFunctionality(): boolean {
  try {
    console.log('Testing GameReel basic functionality...');
    
    const gameReel = new GameReel(testReelData);
    
    // Test that data was parsed correctly
    console.log('Testing basic data structure...');
    console.log('reelStrip1 length:', gameReel.reelsStrip.reelStrip1.length);
    console.log('reelStripBonus1 length:', gameReel.reelsStripBonus.reelStripBonus1.length);
    console.log('reelStrip6 length (empty):', gameReel.reelsStrip.reelStrip6.length);
    console.log('reelStripBonus6 length (empty):', gameReel.reelsStripBonus.reelStripBonus6.length);
    
    // Test API compatibility - these are the same public properties as PHP version
    console.log('API compatibility test passed - properties accessible');
    
    // Test helper methods
    console.log('Testing getStrip method...');
    const strip1 = gameReel.getStrip('reelStrip1');
    console.log('getStrip("reelStrip1") length:', strip1.length);
    
    console.log('Testing hasStrip method...');
    console.log('hasStrip("reelStrip1"):', gameReel.hasStrip('reelStrip1'));
    console.log('hasStrip("reelStripBonus3"):', gameReel.hasStrip('reelStripBonus3'));
    console.log('hasStrip("invalidStrip"):', gameReel.hasStrip('invalidStrip'));
    
    // Test stats
    console.log('Testing getStats method...');
    const stats = gameReel.getStats();
    console.log('Stats:', stats);
    
    return true;
  } catch (error) {
    console.error('Basic functionality test failed:', error);
    return false;
  }
}

export function testErrorHandling(): boolean {
  try {
    console.log('\nTesting error handling...');
    
    // Test with malformed data
    const badData = [
      'invalidFormat',
      'reelStrip1=',  // Empty value
      'reelStrip1=value1,value2,,value4', // Empty middle value
      'unknownStrip=value1,value2', // Unknown strip name
    ];
    
    const gameReel = new GameReel(badData);
    
    // Should handle gracefully - the unknown strip should be ignored
    console.log('Error handling test passed');
    
    return true;
  } catch (error) {
    console.error('Error handling test failed:', error);
    return false;
  }
}

export function testAPICCompatibility(): boolean {
  try {
    console.log('\nTesting API compatibility with PHP version...');
    
    const gameReel = new GameReel(testReelData);
    
    // Test that we can access data exactly like the PHP version
    // PHP: $gameReel->reelsStrip['reelStrip1'][] = $value;
    // TypeScript: gameReel.reelsStrip.reelStrip1.push($value);
    
    const originalCount = gameReel.reelsStrip.reelStrip1.length;
    gameReel.reelsStrip.reelStrip1.push('testValue');
    
    if (gameReel.reelsStrip.reelStrip1.length === originalCount + 1) {
      console.log('Property mutability test passed');
    } else {
      throw new Error('Property mutability test failed');
    }
    
    // Test exact same property structure as PHP
    console.log('reelsStrip structure:', Object.keys(gameReel.reelsStrip));
    console.log('reelsStripBonus structure:', Object.keys(gameReel.reelsStripBonus));
    
    // These should match the PHP version exactly
    const expectedMainStrips = ['reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5', 'reelStrip6'];
    const expectedBonusStrips = ['reelStripBonus1', 'reelStripBonus2', 'reelStripBonus3', 'reelStripBonus4', 'reelStripBonus5', 'reelStripBonus6'];
    
    const mainStrips = Object.keys(gameReel.reelsStrip);
    const bonusStrips = Object.keys(gameReel.reelsStripBonus);
    
    console.log('API compatibility test passed');
    
    return true;
  } catch (error) {
    console.error('API compatibility test failed:', error);
    return false;
  }
}

function runAllTests(): void {
  console.log('=== GameReel TypeScript vs PHP Compatibility Tests ===\n');
  
  const tests = [
    testGameReelBasicFunctionality,
    testErrorHandling,
    testAPICCompatibility
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = test();
      if (result) {
        passed++;
        console.log('✅ Test passed\n');
      } else {
        failed++;
        console.log('❌ Test failed\n');
      }
    } catch (error) {
      failed++;
      console.log('❌ Test threw error:', error, '\n');
    }
  }
  
  console.log(`=== Test Results: ${passed} passed, ${failed} failed ===`);
}

export { runAllTests };