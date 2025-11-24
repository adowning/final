/**
 * Test implementation of BaseModel to verify functionality
 */

interface TestModelData {
  id: string;
  balance: number;
  shop_id: number;
  status: string;
}

class TestModel extends BaseModel<TestModelData> {
  id: string;
  balance: number;
  shop_id: number;
  status: string;

  constructor(data: TestModelData) {
    super(data);
    this.id = data.id;
    this.balance = data.balance;
    this.shop_id = data.shop_id;
    this.status = data.status;
  }

  getState(): TestModelData {
    return {
      id: this.id,
      balance: this.balance,
      shop_id: this.shop_id,
      status: this.status
    };
  }
}

// Test the BaseModel functionality
const testModel = new TestModel({
  id: '1',
  balance: 100.0,
  shop_id: 1,
  status: 'active'
});

console.log('Initial state:', testModel.getState());
console.log('Has changes initially:', testModel.hasChanges());

// Test increment
testModel.increment('balance', 50.0);
console.log('After increment balance by 50:', testModel.getState());
console.log('Has changes after increment:', testModel.hasChanges());
console.log('Changes:', testModel.getChanges());

// Test update
testModel.update({ status: 'inactive' });
console.log('After status update:', testModel.getState());
console.log('Has changes after update:', testModel.hasChanges());

// Test field change detection
console.log('Is balance changed:', testModel.isFieldChanged('balance'));
console.log('Is status changed:', testModel.isFieldChanged('status'));

// Test reset
testModel.reset();
console.log('After reset:', testModel.getState());
console.log('Has changes after reset:', testModel.hasChanges());

// Test ArrayAccess
console.log('Array access - id:', testModel['id']);
console.log('Array access - balance:', testModel['balance']);

export { TestModel };