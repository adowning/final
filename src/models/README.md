# Models Layer

This directory contains the TypeScript model layer for the casino game system conversion from PHP.

## BaseModel

The `BaseModel.ts` file provides an abstract base class for all model classes, implementing change tracking functionality that mirrors the PHP version.

### Key Features

- **Generic Type Support**: Works with any data structure via TypeScript generics
- **Change Tracking**: Automatically tracks modifications to model properties
- **ArrayAccess Compatibility**: Supports array-like access (`model['fieldName']`)
- **API Compatibility**: Maintains exact API compatibility with PHP version

### Core Properties

```typescript
protected originalData: T;          // Original data snapshot
protected changedData: Partial<T> = {};  // Track of modified fields
protected isModified = false;       // Modification flag
```

### Key Methods

#### Change Tracking
- `increment(field: keyof T, amount: number = 1): void` - Increment numeric fields
- `hasChanges(): boolean` - Check if model has modifications
- `getChanges(): Partial<T>` - Get all changed data
- `isFieldChanged(field: keyof T): boolean` - Check specific field change

#### State Management
- `getState(): T` - Abstract method to get current state
- `update(data: Partial<T>): void` - Update multiple fields
- `reset(): void` - Reset to original state
- `clearChanges(): void` - Clear tracking without resetting values

#### ArrayAccess Support
- `offsetGet(offset: string): any` - Get property value
- `offsetSet(offset: string, value: any): void` - Set property value
- `offsetExists(offset: string): boolean` - Check property existence
- `offsetUnset(offset: string): void` - Remove property

### Usage Example

```typescript
interface UserData {
  id: string;
  balance: number;
  status: string;
}

class User extends BaseModel<UserData> implements ArrayAccess {
  id: string;
  balance: number;
  status: string;

  constructor(data: UserData) {
    super(data);
    this.id = data.id;
    this.balance = data.balance;
    this.status = data.status;
  }

  getState(): UserData {
    return {
      id: this.id,
      balance: this.balance,
      status: this.status
    };
  }

  // ArrayAccess methods
  offsetExists(offset: string): boolean {
    return ['id', 'balance', 'status'].includes(offset);
  }

  offsetGet(offset: string): any {
    return (this as any)[offset];
  }

  offsetSet(offset: string, value: any): void {
    (this as any)[offset] = value;
  }

  offsetUnset(offset: string): void {
    delete (this as any)[offset];
  }
}

// Usage
const user = new User({
  id: '1',
  balance: 100.0,
  status: 'active'
});

user.increment('balance', 50.0);
console.log(user.hasChanges()); // true
console.log(user.getChanges()); // { balance: 150 }

// Array access
console.log(user['balance']); // 150
```

### PHP Compatibility

The BaseModel maintains exact API compatibility with the PHP version:

**PHP Methods** → **TypeScript Methods**
- `increment(string $field, float $amount)` → `increment(field: keyof T, amount: number = 1)`
- `hasChanges(): bool` → `hasChanges(): boolean`
- `getChanges(): array` → `getChanges(): Partial<T>`
- `save(): void` → `save(): void`

### Implementation Notes

1. **Generic Type**: Subclasses must extend `BaseModel<T>` where T is their data interface
2. **Abstract getState()**: Must be implemented by each subclass
3. **ArrayAccess**: Subclasses should implement ArrayAccess interface for backward compatibility
4. **Change Detection**: Changes are detected via reference equality (`oldValue !== newValue`)

### Next Steps

This BaseModel is ready for concrete model implementations:
- User model
- Game model  
- Shop model
- JPG model
- Session model
- Banker model
- GameBank model
- GameLog model
- StatGame model
- UserStatus model

Each model will extend BaseModel and implement the required abstract methods while maintaining their specific business logic.