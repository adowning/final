/**
 * UNIVERSAL TEST RUNNER
 * Usage: bun src/index.ts [GameName]
 * Example: bun src/index.ts VikingsNET
 */

import { ModelFactory } from './models/ModelFactory';
import { IGameSettings } from './games/base/BaseSlotSettings';

async function main() {
    // 1. Get Game Name from CLI Arguments
    const gameName = process.argv[2];
    if (!gameName) {
        console.error("❌ ERROR: No game name provided.");
        console.error("Usage: bun src/index.ts [GameName]");
        console.error("Example: bun src/index.ts VikingsNET");
        process.exit(1);
    }

    console.log(`\n🚀 STARTING TEST FOR: ${gameName}`);
    console.log("==================================================");

    // 2. Dynamic Import of the Game Module
    let ServerClass, SlotSettingsClass;
    try {
        // This assumes your games are in src/games/[GameName]
        const gameModule = await import(`./games/${gameName}`);
        ServerClass = gameModule.Server;
        SlotSettingsClass = gameModule.SlotSettings;

        if (!ServerClass || !SlotSettingsClass) {
            throw new Error(`Could not find Server or SlotSettings export in ./games/${gameName}`);
        }
    } catch (e: any) {
        console.error(`❌ FATAL: Could not load game module '${gameName}'.`);
        console.error("Check if the folder exists and index.ts exports Server and SlotSettings.");
        console.error("Error Details:", e.message);
        process.exit(1);
    }

    // 3. Setup Test Environment (Mock Data)
    const user = ModelFactory.createUser({
        id: 1,
        balance: 1000,
        count_balance: 1000
    });

    const game = ModelFactory.createGame({
        id: 1,
        name: gameName,
        bet: '0.1,0.2,0.5,1,2,5,10', // Standard bet config
        lines_percent_config_spin: '{"line10":{"74_80":100}}', // Basic config mock
        lines_percent_config_bonus: '{"line10":{"74_80":100}}'
    });

    const shop = ModelFactory.createShop({
        id: 1,
        percent: 90
    });

    const settings: IGameSettings = {
        user,
        game,
        shop,
        jpgs: [],
        reelStrips: {}, // BaseSlotSettings will handle defaults or empty if not provided
    };

    // 4. Instantiate Classes
    let slotSettings;
    let server;

    try {
        console.log("🔹 Instantiating SlotSettings...");
        slotSettings = new SlotSettingsClass(settings);
        console.log("✅ SlotSettings instantiated.");

        console.log("🔹 Instantiating Server...");
        server = new ServerClass();
        console.log("✅ Server instantiated.");
    } catch (e: any) {
        console.error("❌ CRITICAL ERROR during Class Instantiation:");
        console.error(e);
        process.exit(1);
    }

    // 5. Run Test Actions
    const actions = ['init', 'paytable', 'spin'];

    for (const action of actions) {
        console.log(`\n🔸 TESTING ACTION: [${action}]`);
        console.log("--------------------------------------------------");

        const postData = {
            action: action,
            'bet.denomination': 1,
            'bet.betlevel': 1,
            'bet.lines': 10
        };

        try {
            // Execute the Logic
            const resultJson = await server.get(postData, slotSettings);

            // Parse Result
            let result;
            try {
                result = JSON.parse(resultJson);
            } catch (e) {
                console.error("❌ FAILED: Response is not valid JSON.");
                console.log("Raw Output:", resultJson);
                continue;
            }

            // Validate Result Structure
            if (!result.response) {
                console.error("❌ FAILED: JSON missing 'response' field.");
            } else if (result.response.startsWith('error')) {
                console.error("⚠️  WARNING: Server returned an error response.");
                console.log("Error Message:", result.response);
            } else {
                console.log("✅ PASS: Valid response received.");
                console.log("Length:", result.response.length, "chars");
                console.log("Snippet:", result.response.substring(0, 100) + "...");
            }

            // Check State
            if (!result.state) {
                console.error("❌ FAILED: JSON missing 'state' object.");
            } else {
                console.log("✅ PASS: State object present.");
            }

        } catch (e: any) {
            console.error(`❌ EXCEPTION during '${action}':`);
            console.error(e);
        }
    }

    console.log("\n==================================================");
    console.log("🏁 TEST SEQUENCE COMPLETE");
}

main();