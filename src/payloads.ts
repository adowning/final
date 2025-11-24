/**
 * Payloads.ts
 * strict type definitions for Client-Server communication.
 */

export type ActionType = 'init' | 'paytable' | 'spin' | 'bonus' | 'gamble';

// Base Request Interface
export interface BaseRequest {
  action: ActionType;
  gameId: string;
  userId: string;
  sessionId: string;
}

// --- INIT ---
export interface InitRequest extends BaseRequest {
  action: 'init';
}

export interface InitResponse {
  balance: number;
  gameId: string;
  currency: string;
  config: any; // Game specific configuration
  symbol_game?: string[];
  paytable?: any;
}

// --- PAYTABLE ---
export interface PaytableRequest extends BaseRequest {
  action: 'paytable';
}

export interface PaytableResponse {
  paytable: any; // Specific structure depends on game logic
}

// --- SPIN ---
export interface SpinRequest extends BaseRequest {
  action: 'spin';
  bet: number;      // Total bet amount in currency
  lines: number;    // Number of active lines
  coin: number;     // Coin value (denomination)
  cpl: number;      // Coins per line (bet level)
}

export interface SpinResponse {
  balance: number;
  win: number;
  reels: any;       // Reel positions
  symbols: string[][]; // Matrix of symbols
  winLines: any[];  // Winning line details
  bonus?: boolean;  // Triggered bonus?
  freeSpins?: number; // Triggered free spins?
}

// Union types for generic handling
export type GameRequest = InitRequest | PaytableRequest | SpinRequest;
export type GameResponse = InitResponse | PaytableResponse | SpinResponse;
