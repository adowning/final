/**
 * TypeScript utility class for logging, converted from Games/Log.php
 * Provides static logging methods that write to stderr to avoid polluting stdout JSON responses
 */

export interface LogContext {
  [key: string]: any;
}

export type LogLevel = 'INFO' | 'ERROR' | 'WARNING' | 'DEBUG' | string;

export class Log {
  /**
   * Log an informational message
   */
  static info(message: string | object, context: LogContext = {}): void {
    this.write('INFO', message, context);
  }

  /**
   * Log an error message
   */
  static error(message: string | object, context: LogContext = {}): void {
    this.write('ERROR', message, context);
  }

  /**
   * Log a warning message
   */
  static warning(message: string | object, context: LogContext = {}): void {
    this.write('WARNING', message, context);
  }

  /**
   * Log a debug message
   */
  static debug(message: string | object, context: LogContext = {}): void {
    this.write('DEBUG', message, context);
  }

  /**
   * Catch-all static method for other Laravel Log methods (alert, notice, etc.)
   * This maintains backward compatibility with the PHP version's __callStatic
   */
  static __callStatic(methodName: string, args: [string | object, LogContext?]): void {
    const message = args[0] ?? '';
    const context = args[1] ?? {};
    const level = methodName.toUpperCase() as LogLevel;
    this.write(level, message, context);
  }

  /**
   * Core logging method that writes to stderr
   * Matches PHP version behavior of writing to php://stderr
   */
  public static write(level: LogLevel, message: string | object, context: LogContext = {}): void {
    // Convert objects/arrays to JSON string for readability (matches PHP json_encode behavior)
    let messageStr: string;
    if (typeof message === 'string') {
      messageStr = message;
    } else {
      messageStr = JSON.stringify(message);
    }

    // Append context if provided (matches PHP version's json_encode behavior)
    let fullMessage = messageStr;
    if (Object.keys(context).length > 0) {
      fullMessage += ' ' + JSON.stringify(context);
    }

    // Format: [Timestamp] [LEVEL] Message (matches PHP sprintf format)
    const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', '');
    const output = `[${timestamp}] [${level}] ${fullMessage}`;

    // Write to stderr to avoid corrupting stdout JSON responses
    // This matches the PHP version's file_put_contents('php://stderr', $output)
    console.error(output);
  }
}

// Add dynamic method support via Proxy to handle Laravel-style log methods
const logProxy = new Proxy(Log, {
  get(target, prop) {
    if (typeof prop === 'string' && !(prop in target) && !prop.startsWith('_')) {
      return (message: string | object, context: LogContext = {}) => {
        const level = prop.toUpperCase() as LogLevel;
        target.write(level, message, context);
      };
    }
    return (target as any)[prop];
  }
});

export default logProxy;