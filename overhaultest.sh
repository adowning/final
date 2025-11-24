# 2. Generate src/index.ts
cat > "index.ts" << 'EOF'
/**
 * index.ts
 * Main entry point and Game Dispatcher.
 * Simulates a server environment with a mock database.
 */

import { GameRequest, GameResponse, InitRequest, SpinRequest } from './payloads';
import { ModelFactory } from './models/ModelFactory';
import { IGameSettings } from './games/base/SlotState';

// --- GAME REGISTRY ---
import { SlotSettings as CreatureSettings } from './games/CreatureFromTheBlackLagoonNET/SlotSettings';
import { Server as CreatureServer } from './games/CreatureFromTheBlackLagoonNET/Server';

const GAME_REGISTRY: Record<string, any> = {
  'creature_from_the_black_lagoon': {
    settings: CreatureSettings,
    server: CreatureServer
  },
};

// --- MOCK DATABASE ---
const MOCK_DB = {
  users: new Map<string, any>(),
  shops: new Map<number, any>(),
};

// Seed Mock DB
MOCK_DB.shops.set(1, {
  id: 1,
  currency: 'USD',
  percent: 96,
  max_win: 10000,
  is_blocked: false,
  balance: 100000 // House bank
});

function getUser(userId: string): any {
  if (!MOCK_DB.users.has(userId)) {
    MOCK_DB.users.set(userId, {
      id: userId,
      balance: 1000.00,
      count_balance: 1000.00,
      shop_id: 1,
      session: '',
      status: 'active',
      is_blocked: false,
      address: 0
    });
  }
  return MOCK_DB.users.get(userId);
}

/**
 * Main Request Handler (Internal Logic)
 */
export async function handleRequest(request: GameRequest): Promise<GameResponse | { error: string }> {
  try {
    const { gameId, userId, action } = request;

    if (!GAME_REGISTRY[gameId]) {
      return { error: `Game not found: ${gameId}` };
    }

    const userData = getUser(userId);
    const shopData = MOCK_DB.shops.get(userData.shop_id);
    
    const gameSettings: IGameSettings = {
      user: userData,
      shop: shopData,
      game: {
        id: 1,
        name: gameId,
        shop_id: shopData.id,
        denomination: 1,
        view: true,
      },
      jpgs: [],
      balance: userData.balance,
      slotId: gameId,
      playerId: userId,
      state: {
        goldsvetData: {
          denomination: "0.01,0.02,0.05,0.10,0.20,0.50,1.00",
          symbol_game: [],
          paytable: {}
        }
      }
    };

    const GameSettingsClass = GAME_REGISTRY[gameId].settings;
    const gameInstance = new GameSettingsClass(gameSettings);

    let response: any = {};

    switch (action) {
      case 'init':
        response = {
            balance: gameInstance.GetBalance(),
            gameId: gameId,
            currency: shopData.currency,
            config: gameInstance.slotReelsConfig || {},
        };
        break;

      case 'paytable':
        response = {
          paytable: gameInstance.Paytable || {}
        };
        break;

      case 'spin':
        const spinReq = request as SpinRequest;
        const spinResult = gameInstance.GetSpinSettings(spinReq.bet, spinReq.lines);
        
        response = {
            balance: gameInstance.GetBalance(),
            win: 0, // TODO: Extract actual win from spinResult
            reels: {}, // TODO: Extract reel positions
            symbols: [],
            winLines: []
        };
        
        // Sync Mock DB
        userData.balance = gameInstance.user?.balance;
        MOCK_DB.users.set(userId, userData);
        break;

      default:
        return { error: `Invalid action: ${action}` };
    }

    return response;

  } catch (error) {
    console.error(`System Error:`, error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// --- SELF EXECUTION (HTTP SERVER) ---
// Only runs if executed directly (e.g., bun run src/index.ts)
if (import.meta.main) {
  const PORT = 3000;
  console.log(`🎰 Casino Game Server running on http://localhost:${PORT}`);
  
  Bun.serve({
    port: PORT,
    async fetch(req) {
      // Handle CORS
      if (req.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
          }
        });
      }

      if (req.method === "POST") {
        try {
          const body = await req.json();
          const result = await handleRequest(body as GameRequest);
          
          return Response.json(result, {
            headers: { "Access-Control-Allow-Origin": "*" }
          });
        } catch (e) {
          return Response.json({ error: "Invalid JSON or Internal Error" }, { status: 400 });
        }
      }

      return new Response("Casino Server Ready. Send POST to /", { status: 200 });
    }
  });
}
EOF