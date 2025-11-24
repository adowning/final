/**
 * PHP.ts
 * A compatibility layer to mimic common PHP functions used in legacy slot logic.
 * This reduces the cognitive load for agents converting PHP arrays to TS.
 */

export class PHP {
  
  /**
   * Mimics PHP rand(min, max) - Inclusive
   */
  static rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Mimics PHP array_rand(array, num)
   * Returns one or more random KEYS from the array
   */
  static array_rand(array: any[] | Record<string, any>, num: number = 1): any | any[] {
    const keys = Object.keys(array);
    if (keys.length === 0) return null;

    if (num === 1) {
      return keys[Math.floor(Math.random() * keys.length)];
    }

    const shuffled = keys.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  /**
   * Mimics PHP shuffle() - Sorts in place
   */
  static shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }

  /**
   * Mimics PHP array_count_values()
   * Returns object { "value": count }
   */
  static array_count_values(array: (string | number)[]): Record<string, number> {
    return array.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Mimics PHP in_array()
   */
  static in_array(needle: any, haystack: any[]): boolean {
    return haystack.includes(needle);
  }

  /**
   * Mimics PHP array_fill()
   */
  static array_fill(startIndex: number, num: number, value: any): any[] {
    return new Array(num).fill(value);
  }
}
