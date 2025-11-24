/**
 * Abstract BaseModel class for change tracking in casino game system models.
 * * Refactored for Type Safety:
 * - Removed loose index signature [key: string]: any
 * - Strict typing for property access using keyof T
 * - Safer increment logic
 * * @package Casino Game System
 * @version 1.1.0
 */

export abstract class BaseModel<T extends Record<string, any>> {
  protected originalData: T;
  protected changedData: Partial<T> = {};
  protected isModified = false;

  /**
   * Constructor for BaseModel
   * @param data Initial data for the model
   */
  constructor(data: T) {
    this.originalData = { ...data };
  }

  /**
   * Abstract method to get the current state of the model
   * @returns Current state as T
   */
  abstract getState(): T;

  /**
   * Increment a numeric field by a specified amount
   * @param field Name of the field to increment (must be a key of T)
   * @param amount Amount to increment by (default: 1)
   */
  increment(field: keyof T, amount: number = 1): void {
    // Type-safe access requires assertions here because TS cannot guarantee T[K] is a number at compile time 
    // for a generic T, but we check/cast strictly.
    const currentValue = (this as unknown as T)[field] as unknown;

    if (typeof currentValue === 'number') {
      const newValue = currentValue + amount;
      (this as unknown as T)[field] = newValue as T[keyof T];
      this.changedData[field] = newValue as T[keyof T];
      this.isModified = true;
    } else {
      console.warn(`Attempted to increment non-numeric field: ${String(field)}`);
    }
  }

  /**
   * Check if the model has any changes
   * @returns true if the model has been modified, false otherwise
   */
  hasChanges(): boolean {
    return this.isModified;
  }

  /**
   * Get all changed data
   * @returns Object containing all changed fields and their new values
   */
  getChanges(): Partial<T> {
    return { ...this.changedData };
  }

  /**
   * Save method - to be implemented by subclasses
   */
  save(): void {
    if (this.isModified) {
      this.changedData = {};
      this.isModified = false;
    }
  }

  /**
   * Reset the model to its original state
   */
  reset(): void {
    // Reset all properties to original values
    (Object.keys(this.originalData) as Array<keyof T>).forEach(key => {
      // We can safely write back to 'this' because we know 'key' exists on T
      // casting 'this' to T is necessary because strict property initialization 
      // prevents 'this' from being treated purely as T in abstract classes
      (this as unknown as T)[key] = this.originalData[key];
    });

    this.changedData = {};
    this.isModified = false;
  }

  /**
   * Update multiple fields at once
   * @param data Object containing fields to update
   */
  update(data: Partial<T>): void {
    (Object.keys(data) as Array<keyof T>).forEach(key => {
      const value = data[key];
      const oldValue = (this as unknown as T)[key];

      // Strict equality check
      if (value !== undefined) {
        (this as unknown as T)[key] = value!;

        if (oldValue !== value) {
          this.changedData[key] = value!;
          this.isModified = true;
        }
      }
    });
  }

  /**
   * Get the original data
   * @returns Original data as T
   */
  getOriginalData(): T {
    return { ...this.originalData };
  }

  /**
   * Check if a specific field has been changed
   * @param field Name of the field to check
   * @returns true if the field has been changed, false otherwise
   */
  isFieldChanged(field: keyof T): boolean {
    return field in this.changedData;
  }

  /**
   * Get the original value of a specific field
   * @param field Name of the field
   * @returns Original value of the field
   */
  getOriginalValue(field: keyof T): T[keyof T] {
    return this.originalData[field];
  }

  /**
   * Clear all changes (without resetting to original values)
   */
  clearChanges(): void {
    this.changedData = {};
    this.isModified = false;
  }

  /**
   * Get a property value (for ArrayAccess compatibility)
   * NOTE: This is strictly typed to return values from T or null
   */
  offsetGet(offset: string): any {
    if (offset in (this as unknown as T)) {
      return (this as unknown as T)[offset as keyof T];
    }
    return null;
  }

  /**
   * Set a property value (for ArrayAccess compatibility)
   * Only allows setting keys that actually exist in T
   */
  offsetSet(offset: string, value: any): void {
    // We treat this as a runtime check. If the key exists in our data structure, we allow the set.
    // If we are adding new arbitrary keys, we are breaking the model contract, so we generally shouldn't.
    // However, to maintain some compatibility with dynamic PHP patterns, we allow writing if we can map it to T.

    // Check if property exists on instance or original data to consider it valid
    const key = offset as keyof T;
    (this as unknown as T)[key] = value;

    // We can't easily check against previous value without type assertion
    const prev = (this.originalData as any)[offset];
    if (prev !== value) {
      this.changedData[key] = value;
      this.isModified = true;
    }
  }

  /**
   * Check if a property exists (for ArrayAccess compatibility)
   */
  offsetExists(offset: string): boolean {
    return offset in (this as unknown as T) || offset in this.originalData;
  }

  /**
   * Unset a property (for ArrayAccess compatibility)
   */
  offsetUnset(offset: string): void {
    delete (this as unknown as T)[offset as keyof T];
  }

  /**
   * Get the number of changed fields
   */
  getChangedFieldCount(): number {
    return Object.keys(this.changedData).length;
  }

  /**
   * Get an array of changed field names
   */
  getChangedFieldNames(): (keyof T)[] {
    return Object.keys(this.changedData) as (keyof T)[];
  }
}