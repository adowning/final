/**
 * Session model for casino game session management
 * 
 * Simple session data container with mock database methods
 * providing backward compatibility for session tracking.
 * 
 * @package Casino Game System
 * @version 1.0.0
 */

/**
 * Interface for Session data structure
 */
export interface SessionData {
  id: number;
  user_id: number;
  payload: string;
}

/**
 * Session model class for managing user sessions
 */
export class Session {
  // Core properties
  public id: number;
  public user_id: number;
  public payload: string;

  /**
   * Constructor for Session model
   * @param data Initial session data
   */
  constructor(data: Partial<SessionData> = {}) {
    // Initialize properties with defaults
    this.id = data.id ?? 0;
    this.user_id = data.user_id ?? 0;
    this.payload = data.payload ?? '';
  }

  /**
   * Mock database method for simple WHERE clauses (backward compatibility)
   * @param field Field name to filter on
   * @param value Field value to match
   * @returns New Session instance with filtered data
   */
  static where(field: string, value: any): Session {
    return new Session({ [field]: value });
  }

  /**
   * Mock database method to filter by user ID (backward compatibility)
   * @param userId User ID to filter sessions for
   * @returns New Session instance with user_id set
   */
  static whereUserId(userId: number): Session {
    return new Session({ user_id: userId });
  }

  /**
   * Mock database method to delete session (backward compatibility)
   * No-op for stateless operation
   */
  delete(): void {
    // Stateless operation - no actual deletion
    // This is a mock implementation for backward compatibility
  }

  /**
   * Convert model to array format for serialization
   * @returns Object with all properties
   */
  toArray(): SessionData {
    return {
      id: this.id,
      user_id: this.user_id,
      payload: this.payload
    };
  }

  /**
   * Check if session is active/valid
   * @returns true if session has valid user ID
   */
  isActive(): boolean {
    return this.user_id > 0;
  }

  /**
   * Get session information summary
   * @returns Formatted session summary string
   */
  getSessionSummary(): string {
    return `Session[ID:${this.id}] User:${this.user_id} Active:${this.isActive()}`;
  }

  /**
   * Check if payload contains specific data
   * @param searchText Text to search for in payload
   * @returns true if payload contains the search text
   */
  hasPayloadData(searchText: string): boolean {
    return this.payload.includes(searchText);
  }

  /**
   * Set or update session payload
   * @param payloadData New payload data
   */
  setPayload(payloadData: string): void {
    this.payload = payloadData;
  }
}