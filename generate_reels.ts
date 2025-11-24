/**
 * generate_reels.ts
 * Reads a JSON file containing reel data and outputs TypeScript code
 * for hardcoding them into SlotSettings.ts.
 * * Usage: bun run src/utils/generate_reels.ts path/to/reels.json [GameName]
 */

import { readFileSync, existsSync } from 'fs';

const args = process.argv.slice(2);
const filePath = args[0];
const gameNameFilter = args[1]; // Optional: Filter by game name if JSON has multiple

if (!filePath || !existsSync(filePath)) {
  console.error('❌ Please provide a valid path to reels.json');
  console.error('Usage: bun run src/utils/generate_reels.ts <path_to_json> [GameName]');
  process.exit(1);
}

try {
  const content = readFileSync(filePath, 'utf-8');
  let json = JSON.parse(content);

  // Handle array root (common in large dumps)
  if (Array.isArray(json)) {
    if (gameNameFilter) {
      const found = json.find((g: any) => g.name === gameNameFilter);
      if (!found) {
        console.error(`❌ Game "${gameNameFilter}" not found in JSON.`);
        process.exit(1);
      }
      json = found; // Focus on the specific game object
    } else if (json.length === 1) {
      json = json[0]; // Default to first if only one
    } else {
      console.log(`ℹ️  JSON contains multiple games. Processing the first one: "${json[0].name}"`);
      console.log(`   (Tip: Provide game name as 2nd argument to select another)`);
      json = json[0];
    }
  }

  // Detect if strips are nested under 'reel_strips' or 'reels'
  let strips = json;
  if (json.reel_strips) strips = json.reel_strips;
  else if (json.reels) strips = json.reels;

  console.log('// Copy and paste the following into your SlotSettings constructor:\n');

  let output = '';
  const foundReels: string[] = [];

  // Helper to normalize keys (reel1 -> reelStrip1, 1 -> reelStrip1)
  const mapKeyToProp = (key: string): string | null => {
    const lower = key.toLowerCase();

    // Handle "reelStrip1", "reel1", "1"
    let num = lower.replace(/[^0-9]/g, '');

    // Special case: if key is just "reelStripBonus1", num is 1. 
    // We need to detect "bonus" explicitly.
    const isBonus = lower.includes('bonus');

    if (!num) return null;

    if (isBonus) {
      return `reelStripBonus${num}`;
    }
    return `reelStrip${num}`;
  };

  for (const [key, value] of Object.entries(strips)) {
    const propName = mapKeyToProp(key);

    if (propName && Array.isArray(value) && value.length > 0) {
      // Format array as string with single quotes
      const arrayStr = JSON.stringify(value)
        .replace(/"/g, "'")
        .replace(/,/g, ", ");

      output += `    this.${propName} = ${arrayStr};\n`;
      foundReels.push(propName);
    }
  }

  if (output.length === 0) {
    console.log('// ⚠️ No recognized reel arrays found.');
    console.log('// Debug: Keys found:', Object.keys(strips));
  } else {
    console.log(output);

    // Generate Unified Accessor
    console.log('    // Unified Reel Access (Auto-generated)');
    console.log('    this.Reels = [');

    // Only add main reels (1-6) to the main Reels accessor
    // (Bonuses usually have their own logic)
    [1, 2, 3, 4, 5, 6].forEach(i => {
      const name = `reelStrip${i}`;
      if (foundReels.includes(name)) {
        console.log(`      this.${name},`);
      }
    });
    console.log('    ];');
  }

} catch (e) {
  console.error('❌ Error parsing JSON:', e);
}