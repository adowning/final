/**
 * Abstract BaseModel class for change tracking in casino game system models.
 * 
 * This class provides common functionality for tracking changes to model properties
 * and maintaining original vs modified state, enabling efficient save operations.
 * 
 * @package Casino Game System
 * @version 1.0.0
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
   * @param field Name of the field to increment
   * @param amount Amount to increment by (default: 1)
   */
  increment(field: keyof T, amount: number = 1): void {
    const currentValue = (this as any)[field] ?? 0;
    const newValue = currentValue + amount;
    (this as any)[field] = newValue;

    this.changedData[field] = newValue;
    this.isModified = true;
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
   * In PHP version, this would persist changes to database
   */
  save(): void {
    // Placeholder for save logic - to be implemented by subclasses
    // In a real implementation, this would persist changes to a database
    if (this.isModified) {
      // Simulate clearing changes after save
      this.changedData = {};
      this.isModified = false;
    }
  }

  /**
   * Reset the model to its original state
   */
  reset(): void {
    // Reset all properties to original values
    Object.keys(this.originalData).forEach(key => {
      if (key in this) {
        (this as any)[key] = this.originalData[key as keyof T];
      }
    });
    
    // Clear tracking data
    this.changedData = {};
    this.isModified = false;
  }

  /**
   * Update multiple fields at once
   * @param data Object containing fields to update
   */
  update(data: Partial<T>): void {
    Object.keys(data).forEach(key => {
      const value = data[key as keyof T];
      const oldValue = (this as any)[key] ?? null;
      
      (this as any)[key] = value;
      
      if (oldValue !== value) {
        this.changedData[key as keyof T] = value;
        this.isModified = true;
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
  getOriginalValue(field: keyof T): any {
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
   * Index signature for ArrayAccess compatibility
   * This allows array-like access: model['fieldName']
   */
  [key: string]: any;

  /**
   * Get a property value (for ArrayAccess compatibility)
   * @param offset Property name
   * @returns Property value
   */
  offsetGet(offset: string): any {
    return (this as any)[offset] ?? null;
  }

  /**
   * Set a property value (for ArrayAccess compatibility)
   * @param offset Property name
   * @param value New value
   */
  offsetSet(offset: string, value: any): void {
    (this as any)[offset] = value;
  }

  /**
   * Check if a property exists (for ArrayAccess compatibility)
   * @param offset Property name
   * @returns true if property exists, false otherwise
   */
  offsetExists(offset: string): boolean {
    return offset in this || offset in this.originalData;
  }

  /**
   * Unset a property (for ArrayAccess compatibility)
   * @param offset Property name
   */
  offsetUnset(offset: string): void {
    delete (this as any)[offset];
  }

  /**
   * Get the number of changed fields
   * @returns Number of changed fields
   */
  getChangedFieldCount(): number {
    return Object.keys(this.changedData).length;
  }

  /**
   * Get an array of changed field names
   * @returns Array of changed field names
   */
  getChangedFieldNames(): (keyof T)[] {
    return Object.keys(this.changedData) as (keyof T)[];
  }
}