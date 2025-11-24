/**
 * TypeScript utility class for GameReel functionality, converted from Games/GameReel.php
 * Handles parsing of reel strip data from string format to structured data
 */

import { Log } from './Log';

export interface ReelStrip {
  [key: string]: string[];
}

export interface GameReelData {
  reelsStrip: { [key: string]: string[] };
  reelsStripBonus: { [key: string]: string[] };
}

/**
 * GameReel utility class that parses reel strip data strings
 * Maintains exact API compatibility with the PHP version
 */
export class GameReel implements GameReelData {
  public reelsStrip: { [key: string]: string[] };
  public reelsStripBonus: { [key: string]: string[] };

  /**
   * Constructor that parses reel data strings into structured format
   * @param reelData Array of strings in format "key=value1,value2,value3"
   */
  constructor(reelData: string[]) {
    // Initialize with empty arrays for each reel position
    this.reelsStrip = {
      'reelStrip1': [],
      'reelStrip2': [],
      'reelStrip3': [],
      'reelStrip4': [],
      'reelStrip5': [],
      'reelStrip6': []
    };

    this.reelsStripBonus = {
      'reelStripBonus1': [],
      'reelStripBonus2': [],
      'reelStripBonus3': [],
      'reelStripBonus4': [],
      'reelStripBonus5': [],
      'reelStripBonus6': []
    };

    // Parse each string in the reelData array
    const temp = reelData;
    for (const str of temp) {
      try {
        // Split on '=' to separate key from values
        const strParts = str.split('=');
        if (strParts.length !== 2) {
          Log.warning('Invalid reel data format, expected key=value format', {
            input: str,
            parts: strParts
          });
          continue;
        }

        const key = strParts[0].trim();
        const valuesStr = strParts[1].trim();

        // Check if key matches reelsStrip pattern
        if (this.reelsStrip.hasOwnProperty(key)) {
          Log.debug(`Parsing reelStrip for key: ${key}`);
          const data = valuesStr.split(',');
          for (const elem of data) {
            const trimmedElem = elem.trim();
            if (trimmedElem !== '') {
              this.reelsStrip[key].push(trimmedElem);
            }
          }
          Log.debug(`Added ${this.reelsStrip[key].length} elements to ${key}`);
        }

        // Check if key matches reelsStripBonus pattern
        if (this.reelsStripBonus.hasOwnProperty(key)) {
          Log.debug(`Parsing reelsStripBonus for key: ${key}`);
          const data = valuesStr.split(',');
          for (const elem of data) {
            const trimmedElem = elem.trim();
            if (trimmedElem !== '') {
              this.reelsStripBonus[key].push(trimmedElem);
            }
          }
          Log.debug(`Added ${this.reelsStripBonus[key].length} elements to ${key}`);
        }
      } catch (error) {
        Log.error('Error parsing reel data string', {
          input: str,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    Log.info('GameReel initialization completed', {
      mainReelsTotal: this.getTotalElements(this.reelsStrip),
      bonusReelsTotal: this.getTotalElements(this.reelsStripBonus)
    });
  }

  /**
   * Helper method to get total number of elements in a reel strip
   * @param reelStrip The reel strip to count
   * @returns Total number of elements
   */
  private getTotalElements(reelStrip: { [key: string]: string[] }): number {
    return Object.values(reelStrip).reduce((total, arr) => total + arr.length, 0);
  }

  /**
   * Get a specific reel strip by name
   * @param stripName Name of the strip (e.g., 'reelStrip1', 'reelStripBonus3')
   * @returns Array of elements in the strip
   */
  public getStrip(stripName: string): string[] {
    if (this.reelsStrip.hasOwnProperty(stripName)) {
      return this.reelsStrip[stripName];
    }
    if (this.reelsStripBonus.hasOwnProperty(stripName)) {
      return this.reelsStripBonus[stripName];
    }
    Log.warning(`Requested unknown strip: ${stripName}`);
    return [];
  }

  /**
   * Get all main reel strips
   * @returns Object containing all main reel strips
   */
  public getReelsStrip(): { [key: string]: string[] } {
    return { ...this.reelsStrip };
  }

  /**
   * Get all bonus reel strips
   * @returns Object containing all bonus reel strips
   */
  public getReelsStripBonus(): { [key: string]: string[] } {
    return { ...this.reelsStripBonus };
  }

  /**
   * Check if a reel strip exists
   * @param stripName Name of the strip to check
   * @returns True if the strip exists
   */
  public hasStrip(stripName: string): boolean {
    return this.reelsStrip.hasOwnProperty(stripName) || this.reelsStripBonus.hasOwnProperty(stripName);
  }

  /**
   * Get the count of elements in a specific strip
   * @param stripName Name of the strip
   * @returns Number of elements in the strip
   */
  public getStripCount(stripName: string): number {
    const strip = this.getStrip(stripName);
    return strip.length;
  }

  /**
   * Get statistics about the loaded reel data
   * @returns Object with statistics about the reel data
   */
  public getStats(): {
    mainStrips: number;
    bonusStrips: number;
    totalMainElements: number;
    totalBonusElements: number;
    stripCounts: { [key: string]: number };
  } {
    const mainStrips = Object.keys(this.reelsStrip).length;
    const bonusStrips = Object.keys(this.reelsStripBonus).length;
    const totalMainElements = this.getTotalElements(this.reelsStrip);
    const totalBonusElements = this.getTotalElements(this.reelsStripBonus);
    
    const stripCounts: { [key: string]: number } = {};
    
    // Count elements in all strips
    for (const [key, arr] of Object.entries(this.reelsStrip)) {
      stripCounts[key] = arr.length;
    }
    for (const [key, arr] of Object.entries(this.reelsStripBonus)) {
      stripCounts[key] = arr.length;
    }

    return {
      mainStrips,
      bonusStrips,
      totalMainElements,
      totalBonusElements,
      stripCounts
    };
  }
}

export default GameReel;