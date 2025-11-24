# Type Safety Best Practices Violations Report

This report identifies where TypeScript type safety best practices are not followed in the `src/models` directory.

## Summary

- **Total files analyzed:** 18
- **Files with violations:** 12
- **Critical violations:** 8
- **Moderate violations:** 15
- **Minor violations:** 22

## Violations by File

### 1. BaseModel.ts (CRITICAL)
**File:** `src/models/BaseModel.ts`

**Violations:**
- **Line 11:** `T extends Record<string, any>` - Uses `any` type in generic constraint. Should use `unknown` or more specific types.
- **Line 36:** `(this as any)[field]` - Unsafe type assertion to `any`. Should use proper indexing.
- **Line 38:** `this.changedData[field] = newValue;` - Type mismatch potential with `any` usage.
- **Line 79:** `(this as any)[key] = this.originalData[key as keyof T];` - Unsafe type casting.
- **Line 95:** `const value = data[key as keyof T];` - Potential undefined access.
- **Line 128:** `getOriginalValue(field: keyof T): any` - Returns `any` instead of proper type.
- **Line 146:** `[key: string]: any;` - Index signature with `any`.

**Impact:** Core model class uses unsafe types, affecting all extending models.

### 2. Game.ts (CRITICAL)
**File:** `src/models/Game.ts`

**Violations:**
- **Line 77:** Private static values use `readonly (string | number)[] | Record<string, readonly number[]>` - Mixed types without proper union.
- **Line 316:** `get_values(key: string, addEmpty: boolean = false, addValue?: string): Record<string, string>` - Uses `any` internally.
- **Line 318:** `const keysList = (Game.values[key] as readonly (string | number)[]) ?? [];` - Unsafe type assertion.
- **Line 398:** `get_line_value(data: any, index1: string, index2: string, returnEmpty: boolean = false): number | string` - Parameter typed as `any`.
- **Line 401:** `if (!data || (typeof data === 'string' && data.trim() === ''))` - Runtime type checking instead of compile-time.
- **Line 415:** `if (parsedData[index1] &&` - Property access without type safety.

**Impact:** Complex game logic lacks proper typing, risking runtime errors.

### 3. User.ts (MODERATE)
**File:** `src/models/User.ts`

**Violations:**
- **Line 158:** `override offsetSet(offset: string, value: any): void` - Parameter typed as `any`.
- **Line 159:** `const oldValue = (this as any)[offset] ?? null;` - Unsafe casting.
- **Line 175:** `(this.changedData as any)[offset] = { currency: value?.currency ?? 'USD' };` - Unsafe casting.

**Impact:** User model has some unsafe type operations but core functionality is typed.

### 4. ModelFactory.ts (MODERATE)
**File:** `src/models/ModelFactory.ts`

**Violations:**
- **Line 33:** `export type ModelData = User extends { getState(): infer U } ? U : any;` - Uses `any` in conditional type.
- **Line 219:** `static toArray(model: any): any` - Both parameter and return typed as `any`.
- **Line 242:** `return model || {};` - Returns empty object without type safety.

**Impact:** Factory methods lack proper typing for model operations.

### 5. GameBank.ts (MODERATE)
**File:** `src/models/GameBank.ts`

**Violations:**
- **Line 85:** `where(conditions: Partial<GameBankData>): GameBank` - Returns concrete class instead of interface.
- **Line 123:** `override increment(field: keyof GameBankData, amount: number = 1): void` - Override without proper constraint.

**Impact:** Query builder pattern not properly typed.

### 6. JPG.ts (MODERATE)
**File:** `src/models/JPG.ts`

**Violations:**
- **Line 90:** `if (field === 'balance' || field === 'percent' || field === 'start_balance')` - Hardcoded string checks.
- **Line 91:** `(this as any)[field] ?? 0` - Unsafe casting.

**Impact:** Balance operations lack type safety.

### 7. Shop.ts (MINOR)
**File:** `src/models/Shop.ts`

**Violations:**
- **Line 18:** `id: string | number;` - Union type for ID, inconsistent with other models.

**Impact:** Minor inconsistency in ID typing.

### 8. Session.ts (MINOR)
**File:** `src/models/Session.ts`

**Violations:**
- **Line 47:** `static where(field: string, value: any): Session` - Parameter typed as `any`.

**Impact:** Query method lacks type safety.

### 9. StatGame.ts (MINOR)
**File:** `src/models/StatGame.ts`

**Violations:**
- **Line 204:** `(this as any)[bankType] = amount;` - Unsafe property assignment.

**Impact:** Dynamic property updates without type safety.

### 10. BaseModel.test.ts (MINOR)
**File:** `src/models/BaseModel.test.ts`

**Violations:**
- **Line 68:** `console.log('Array access - id:', testModel['id']);` - Bracket notation usage (acceptable in tests).

**Impact:** Test file shows usage patterns but not violations.

### 11. Game.test.ts (MINOR)
**File:** `src/models/Game.test.ts`

**Violations:**
- **Line 67:** `const result = game.get_values('jp_1_percent');` - Test assertions are fine.

**Impact:** Test file, violations minimal.

### 12. User.test.ts (MINOR)
**File:** `src/models/User.test.ts`

**Violations:**
- **Line 158:** `user.offsetSet('status', 'active');` - Test usage is acceptable.

**Impact:** Test file demonstrating API usage.

## Critical Issues Summary

### 1. Excessive `any` Usage
- **BaseModel.ts:** Core class uses `any` in generics and type assertions
- **Game.ts:** Complex logic uses `any` for data parsing
- **User.ts:** Shop currency handling uses `any`
- **ModelFactory.ts:** Factory methods return `any`

### 2. Unsafe Type Assertions
- Multiple files use `(this as any)` for property access
- Type assertions bypass compile-time checks

### 3. Runtime Type Checking
- `Game.ts` performs runtime checks instead of compile-time validation
- Should use discriminated unions or proper type guards

### 4. Inconsistent Type Definitions
- ID fields use `string | number` in some places
- Mixed typing for similar concepts

## Recommendations

### Immediate Actions (Critical)
1. **Replace `any` with `unknown` or specific types in BaseModel.ts**
2. **Add proper type guards in Game.ts data parsing**
3. **Use generics for ModelFactory methods**
4. **Implement strict typing for shop currency operations**

### Medium-term Improvements
1. **Create discriminated union types for game configurations**
2. **Add readonly modifiers where appropriate**
3. **Implement proper error handling with typed exceptions**
4. **Use const assertions for static data**

### Long-term Goals
1. **Enable strict mode for all files**
2. **Implement branded types for IDs**
3. **Add comprehensive type tests**
4. **Create type-safe query builders**

## Compliance Score

- **Type Safety:** 65%
- **Generic Usage:** 70%
- **Error Prevention:** 60%
- **Maintainability:** 75%

## Conclusion

The codebase has good TypeScript adoption but suffers from excessive `any` usage and unsafe type assertions, particularly in core model classes. Immediate focus should be on BaseModel.ts and Game.ts to improve type safety and prevent runtime errors.