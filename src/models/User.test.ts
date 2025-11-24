/**
 * API Compatibility Test for User Model
 * 
 * This test verifies that the TypeScript User model maintains exact API compatibility
 * with the original PHP User model while adding TypeScript type safety.
 */

// TypeScript User model implementation for testing
import { User } from './User';

/**
 * Test the API compatibility between PHP and TypeScript User models
 */
export class UserCompatibilityTest {
  
  /**
   * Test user property initialization and defaults
   */
  testUserProperties(): void {
    console.log('Testing User Properties...');
    
    const user = new User();
    
    // Test default values match PHP version
    console.assert(user.id === '0', 'Default ID should be "0"');
    console.assert(user.balance === 0, 'Default balance should be 0');
    console.assert(user.shop_id === 0, 'Default shop_id should be 0');
    console.assert(user.count_balance === 0, 'Default count_balance should be 0');
    console.assert(user.address === 0, 'Default address should be 0');
    console.assert(user.session === '', 'Default session should be empty string');
    console.assert(user.is_blocked === false, 'Default is_blocked should be false');
    console.assert(user.status === 'active', 'Default status should be "active"');
    console.assert(user.remember_token === undefined, 'Default remember_token should be undefined');
    console.assert(user.last_bid === undefined, 'Default last_bid should be undefined');
    console.assert(user.shop.currency === 'USD', 'Default shop currency should be "USD"');
    
    console.log('✓ User properties test passed');
  }

  /**
   * Test user initialization with data
   */
  testUserInitialization(): void {
    console.log('Testing User Initialization...');
    
    const userData = {
      id: '123',
      balance: 100.50,
      shop_id: 1,
      count_balance: 50.25,
      address: 10.0,
      session: 'test-session',
      is_blocked: true,
      status: 'banned',
      remember_token: 'token123',
      last_bid: '2024-01-01',
      shop: {
        currency: 'EUR'
      }
    };
    
    const user = new User(userData);
    
    console.assert(user.id === '123', 'ID should be set from data');
    console.assert(user.balance === 100.50, 'Balance should be set from data');
    console.assert(user.shop_id === 1, 'shop_id should be set from data');
    console.assert(user.count_balance === 50.25, 'count_balance should be set from data');
    console.assert(user.address === 10.0, 'address should be set from data');
    console.assert(user.session === 'test-session', 'session should be set from data');
    console.assert(user.is_blocked === true, 'is_blocked should be set from data');
    console.assert(user.status === 'banned', 'status should be set from data');
    console.assert(user.remember_token === 'token123', 'remember_token should be set from data');
    console.assert(user.last_bid === '2024-01-01', 'last_bid should be set from data');
    console.assert(user.shop.currency === 'EUR', 'shop currency should be set from data');
    
    console.log('✓ User initialization test passed');
  }

  /**
   * Test change tracking functionality
   */
  testChangeTracking(): void {
    console.log('Testing Change Tracking...');
    
    const user = new User();
    
    // Test initial state
    console.assert(!user.hasChanges(), 'New user should not have changes initially');
    
    // Test property changes are tracked
    user.balance = 100;
    console.assert(user.hasChanges(), 'User should have changes after property modification');
    
    const changes = user.getChanges();
    console.assert(changes.balance === 100, 'Balance change should be tracked');
    
    console.log('✓ Change tracking test passed');
  }

  /**
   * Test increment functionality
   */
  testIncrement(): void {
    console.log('Testing Increment Functionality...');
    
    const user = new User({ balance: 50 });
    user.increment('balance', 25);
    
    console.assert(user.balance === 75, 'Balance should be incremented by 25');
    console.assert(user.hasChanges(), 'Increment should create changes');
    
    const changes = user.getChanges();
    console.assert(changes.balance === 75, 'Incremented balance should be tracked');
    
    console.log('✓ Increment test passed');
  }

  /**
   * Test shop currency change tracking (Critical Feature)
   */
  testShopCurrencyTracking(): void {
    console.log('Testing Shop Currency Change Tracking...');
    
    const user = new User({ shop: { currency: 'USD' } });
    console.assert(user.getShopCurrency() === 'USD', 'Initial currency should be USD');
    
    // Test currency change through offsetSet (ArrayAccess)
    user['shop'] = { currency: 'EUR' };
    console.assert(user.hasChanges(), 'Currency change should create changes');
    console.assert(user.getShopCurrency() === 'EUR', 'Currency should be updated to EUR');
    
    // Test hasShopCurrencyChanged
    console.assert(user.hasShopCurrencyChanged(), 'Should detect currency change');
    console.assert(user.getOriginalShopCurrency() === 'USD', 'Original currency should be USD');
    
    console.log('✓ Shop currency tracking test passed');
  }

  /**
   * Test ArrayAccess compatibility
   */
  testArrayAccess(): void {
    console.log('Testing ArrayAccess Compatibility...');
    
    const user = new User({ id: '123', balance: 100 });
    
    // Test offsetGet
    console.assert(user.offsetGet('id') === '123', 'offsetGet should work for id');
    console.assert(user.offsetGet('balance') === 100, 'offsetGet should work for balance');
    console.assert(user.offsetGet('nonexistent') === null, 'offsetGet should return null for nonexistent properties');
    
    // Test offsetExists
    console.assert(user.offsetExists('id'), 'offsetExists should return true for existing properties');
    console.assert(user.offsetExists('balance'), 'offsetExists should return true for existing properties');
    console.assert(!user.offsetExists('nonexistent'), 'offsetExists should return false for nonexistent properties');
    
    // Test offsetSet
    user.offsetSet('status', 'active');
    console.assert(user.status === 'active', 'offsetSet should update property');
    console.assert(user.hasChanges(), 'offsetSet should create changes');
    
    console.log('✓ ArrayAccess test passed');
  }

  /**
   * Test status methods
   */
  testStatusMethods(): void {
    console.log('Testing Status Methods...');
    
    const user = new User();
    
    // Test isBanned
    console.assert(!user.isBanned(), 'Active user should not be banned');
    
    user.status = 'banned';
    console.assert(user.isBanned(), 'User with banned status should be banned');
    
    // Test status change methods
    user.activate();
    console.assert(user.status === 'active', 'activate() should set status to active');
    
    user.ban();
    console.assert(user.status === 'banned', 'ban() should set status to banned');
    console.assert(user.isBanned(), 'User should be banned after ban() call');
    
    user.block();
    console.assert(user.status === 'blocked', 'block() should set status to blocked');
    console.assert(user.is_blocked === true, 'block() should set is_blocked to true');
    
    user.unblock();
    console.assert(user.status === 'active', 'unblock() should set status to active');
    console.assert(user.is_blocked === false, 'unblock() should set is_blocked to false');
    
    console.log('✓ Status methods test passed');
  }

  /**
   * Test level and balance methods
   */
  testLevelAndBalanceMethods(): void {
    console.log('Testing Level and Balance Methods...');
    
    const user = new User({ balance: 100, count_balance: 50 });
    
    // Test updateLevel
    user.updateLevel('experience', 10);
    console.assert(user.level_data?.['experience'] === 10, 'updateLevel should set experience');
    
    user.updateLevel('experience', 5);
    console.assert(user.level_data?.['experience'] === 15, 'updateLevel should accumulate experience');
    
    // Test updateCountBalance
    const newCountBalance = user.updateCountBalance(10, 50);
    console.assert(newCountBalance === 60, 'updateCountBalance should return new count_balance');
    console.assert(user.count_balance === 60, 'updateCountBalance should update count_balance');
    
    // Test balance methods
    console.assert(user.hasSufficientBalance(50), 'User should have sufficient balance');
    console.assert(!user.hasSufficientBalance(150), 'User should not have sufficient balance');
    
    const deducted = user.deductBalance(25);
    console.assert(deducted === true, 'Balance deduction should succeed');
    console.assert(user.balance === 75, 'Balance should be reduced by 25');
    
    user.addBalance(10);
    console.assert(user.balance === 85, 'Balance should be increased by 10');
    
    console.log('✓ Level and balance methods test passed');
  }

  /**
   * Test getState method
   */
  testGetState(): void {
    console.log('Testing getState Method...');
    
    const user = new User({
      id: '123',
      balance: 100,
      shop: { currency: 'EUR' }
    });
    
    const state = user.getState();
    
    console.assert(state.id === '123', 'State should include id');
    console.assert(state.balance === 100, 'State should include balance');
    console.assert(state.shop.currency === 'EUR', 'State should include shop currency');
    console.assert(state.shop_id === 0, 'State should include default shop_id');
    console.assert(state.status === 'active', 'State should include default status');
    
    console.log('✓ getState test passed');
  }

  /**
   * Test save method
   */
  testSave(): void {
    console.log('Testing Save Method...');
    
    const user = new User();
    user.balance = 100;
    
    console.assert(user.hasChanges(), 'User should have changes before save');
    
    user.save();
    console.assert(!user.hasChanges(), 'User should not have changes after save');
    
    console.log('✓ Save test passed');
  }

  /**
   * Run all compatibility tests
   */
  runAllTests(): void {
    console.log('Running User Model API Compatibility Tests...\n');
    
    this.testUserProperties();
    this.testUserInitialization();
    this.testChangeTracking();
    this.testIncrement();
    this.testShopCurrencyTracking();
    this.testArrayAccess();
    this.testStatusMethods();
    this.testLevelAndBalanceMethods();
    this.testGetState();
    this.testSave();
    
    console.log('\n✅ All User Model API Compatibility Tests Passed!');
  }
}

// Export for external use
export default UserCompatibilityTest;

// If running directly, execute tests
if (require.main === module) {
  const tester = new UserCompatibilityTest();
  tester.runAllTests();
}