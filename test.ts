/**
 * test.ts
 * Comprehensive Test Runner for Casino Game System.
 * Usage: bun run test.ts [all|gameId]
 */

import { handleRequest } from './src/index';
import { InitRequest, PaytableRequest, SpinRequest } from './src/payloads';

const COLORS = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  reset: "\x1b[0m"
};

const GAMES_TO_TEST = [
  'creature_from_the_black_lagoon',
  // Add other game IDs here as they are registered in index.ts
];

async function runTests(gameId: string) {
  console.log(`${COLORS.blue}=== TESTING GAME: ${gameId} ===${COLORS.reset}`);
  
  const userId = `test_user_${Date.now()}`;
  let currentBalance = 1000.00;

  // --- TEST 1: INIT ---
  console.log(`\nTesting Action: [INIT]`);
  const initReq: InitRequest = {
    action: 'init',
    gameId,
    userId,
    sessionId: 'sess_123'
  };

  const initRes: any = await handleRequest(initReq);

  if (initRes.error) {
    console.log(`${COLORS.red}[FAIL] Init failed: ${initRes.error}${COLORS.reset}`);
    return;
  }

  if (initRes.balance === currentBalance) {
    console.log(`${COLORS.green}[PASS] Init successful. Balance: ${initRes.balance}${COLORS.reset}`);
  } else {
    console.log(`${COLORS.red}[FAIL] Balance mismatch. Expected ${currentBalance}, got ${initRes.balance}${COLORS.reset}`);
  }

  // --- TEST 2: PAYTABLE ---
  console.log(`\nTesting Action: [PAYTABLE]`);
  const payReq: PaytableRequest = {
    action: 'paytable',
    gameId,
    userId,
    sessionId: 'sess_123'
  };
  
  const payRes: any = await handleRequest(payReq);
  
  if (payRes.error) {
    console.log(`${COLORS.red}[FAIL] Paytable failed: ${payRes.error}${COLORS.reset}`);
  } else if (payRes.paytable) {
    console.log(`${COLORS.green}[PASS] Paytable retrieved.${COLORS.reset}`);
  } else {
    console.log(`${COLORS.red}[FAIL] Paytable response empty.${COLORS.reset}`);
  }

  // --- TEST 3: SPIN ---
  console.log(`\nTesting Action: [SPIN]`);
  const betAmount = 1.00;
  const spinReq: SpinRequest = {
    action: 'spin',
    gameId,
    userId,
    sessionId: 'sess_123',
    bet: betAmount,
    lines: 10,
    coin: 0.1,
    cpl: 1
  };

  const spinRes: any = await handleRequest(spinReq);

  if (spinRes.error) {
    console.log(`${COLORS.red}[FAIL] Spin failed: ${spinRes.error}${COLORS.reset}`);
  } else {
    // Validate Balance deduction
    // Note: If win > 0, balance might increase. 
    // We expect balance to change.
    if (spinRes.balance !== currentBalance) {
      console.log(`${COLORS.green}[PASS] Spin successful. New Balance: ${spinRes.balance}${COLORS.reset}`);
    } else {
       // It's possible to win exactly what you bet, but unlikely. Warning only.
       console.log(`${COLORS.blue}[WARN] Balance unchanged (Win == Bet?). Balance: ${spinRes.balance}${COLORS.reset}`);
    }
    
    // Check if result structure exists
    if(spinRes.reels || spinRes.rows || spinRes.content) { 
        // Adapting check to whatever the game returns
        console.log(`${COLORS.green}[PASS] Spin data received.${COLORS.reset}`);
    }
  }
}

async function main() {
  const arg = process.argv[2] || 'all';

  if (arg === 'all') {
    for (const gameId of GAMES_TO_TEST) {
      await runTests(gameId);
    }
  } else {
    await runTests(arg);
  }
}

main();
