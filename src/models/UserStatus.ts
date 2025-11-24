/**
 * UserStatus constants for casino user management
 * 
 * Simple constants class defining user status values
 * with utility methods for status checking.
 * 
 * @package Casino Game System
 * @version 1.0.0
 */

/**
 * User status constants
 */
export const UserStatus = {
  BANNED: 'banned' as const,
  ACTIVE: 'active' as const,
  SUSPENDED: 'suspended' as const
} as const;

/**
 * Type for valid user status values
 */
export type UserStatusValue = typeof UserStatus[keyof typeof UserStatus];

/**
 * UserStatus utility class for status management
 */
export class UserStatusClass {
  /**
   * Banned user status
   */
  static readonly BANNED = UserStatus.BANNED;

  /**
   * Active user status
   */
  static readonly ACTIVE = UserStatus.ACTIVE;

  /**
   * Suspended user status
   */
  static readonly SUSPENDED = UserStatus.SUSPENDED;

  /**
   * Check if a status represents a banned user
   * @param status User status to check
   * @returns true if status is banned
   */
  static isBanned(status: string): boolean {
    return status === UserStatus.BANNED;
  }

  /**
   * Check if a status represents an active user
   * @param status User status to check
   * @returns true if status is active
   */
  static isActive(status: string): boolean {
    return status === UserStatus.ACTIVE;
  }

  /**
   * Check if a status represents a suspended user
   * @param status User status to check
   * @returns true if status is suspended
   */
  static isSuspended(status: string): boolean {
    return status === UserStatus.SUSPENDED;
  }

  /**
   * Check if a status represents an allowed/accessible user
   * @param status User status to check
   * @returns true if user is not banned or suspended
   */
  static isAllowed(status: string): boolean {
    return !this.isBanned(status) && !this.isSuspended(status);
  }

  /**
   * Get all valid status values
   * @returns Array of all valid status values
   */
  static getValidStatuses(): UserStatusValue[] {
    return [UserStatus.BANNED, UserStatus.ACTIVE, UserStatus.SUSPENDED];
  }

  /**
   * Get status display name for user interface
   * @param status User status
   * @returns Human-readable status name
   */
  static getDisplayName(status: UserStatusValue): string {
    const displayNames: Record<UserStatusValue, string> = {
      [UserStatus.BANNED]: 'Banned',
      [UserStatus.ACTIVE]: 'Active',
      [UserStatus.SUSPENDED]: 'Suspended'
    };
    return displayNames[status] || 'Unknown';
  }

  /**
   * Validate if a status value is valid
   * @param status Status to validate
   * @returns true if status is valid
   */
  static isValidStatus(status: string): status is UserStatusValue {
    return Object.values(UserStatus).includes(status as UserStatusValue);
  }
}

/**
 * Backward compatibility alias
 */
export const UserStatusConstants = UserStatusClass;