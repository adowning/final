/**
 * generate_reels.ts
 * Reads a JSON file containing reel data and outputs TypeScript code
 * for hardcoding them into SlotSettings.ts.
 * * Usage: bun run src/utils/generate_reels.ts path/to/reels.json
 */

import { readFileSync, existsSync } from 'fs';

const args = process.argv.slice(2);
const filePath = args[0];

if (!filePath || !existsSync(filePath)) {
  console.error('❌ Please provide a valid path to reels.json');
  console.error('Usage: bun run src/utils/generate_reels.ts <path_to_json>');
  process.exit(1);
}

try {
  const content = readFileSync(filePath, 'utf-8');
  const json = JSON.parse(content);

  console.log('//Copy and paste the following into your SlotSettings constructor:\n');

  // Handle typical structure where reels might be nested or top-level
  // We look for keys like 'reel1', 'reelStrip1', '1', '0', etc.
  
  let output = '';
  const foundReels: string[] = [];

  // Helper to normalize keys (reel1 -> reelStrip1, 1 -> reelStrip1)
  const mapKeyToProp = (key: string): string | null => {
    const lower = key.toLowerCase();
    // Extract number
    const num = lower.replace(/[^0-9]/g, '');
    if (!num) return null;

    if (lower.includes('bonus')) {
      return `reelStripBonus${num}`;
    }
    return `reelStrip${num}`;
  };

  for (const [key, value] of Object.entries(json)) {
    const propName = mapKeyToProp(key);
    
    if (propName && Array.isArray(value)) {
      // Format array as string with proper indentation
      const arrayStr = JSON.stringify(value)
        .replace(/"/g, "'") // Use single quotes for TS preference
        .replace(/,/g, ", "); // Add space for readability

      output += `    this.${propName} = ${arrayStr};\n`;
      foundReels.push(propName);
    }
  }

  if (output.length === 0) {
    console.log('// ⚠️ No recognized reel arrays found (looking for keys like "reel1", "1", "reelStrip1")');
  } else {
    console.log(output);
    
    // Also generate the Unified Accessor code automatically
    console.log('    // Unified Reel Access (Auto-generated)');
    console.log('    this.Reels = [');
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
