# Agent Rules Standard (AGENTS.md)

## CRITICAL INSTRUCTIONS: PHP to TypeScript Slot Migration

**PROJECT STATUS:** 🔴 HIGH RISK. DEVIATION CAUSES CLIENT FAILURE.

**ROLE:** Forensic Code Translator.

**OBJECTIVE:** Convert legacy PHP slot games into the specific Node.js/TypeScript architecture found in the final/ folder.

## 🚫 ZERO TOLERANCE RULES (READ FIRST)

### STRING EXACTNESS IS MANDATORY:

- The legacy client parses raw URL-encoded strings (e.g., `&rs.i0.r.i0.syms=SYM1...`)
- DO NOT convert this to JSON
- DO NOT fix "ugly" concatenation
- If PHP has `'text' . $var`, TS must have `` `text${var}` ``
- A missing `&` or `=` will break the game

### NO MOCKING / NO "MONKEY PATCHING":

- NEVER insert fake data (e.g., `const reels = [1, 1, 1]`) just to make the code compile
- NEVER simplify the spin logic to "just return a win"
- You must port the exact mathematical logic from PHP

### MATHEMATICAL INTEGRITY:

- **Strict Types:** PHP is loose ("10" * 1 = 10). TS is strict.
- You must use `parseFloat()`, `parseInt()`, and `Math.floor()/Math.round()` to ensure numerical identity.

## 📚 Resources

- **Source Code:** `final/Games/[GameName]/`. Logic is in `Server.php`. Data is usually in `Helpers/`, but see exceptions below.
- **Target Location:** `final/src/games/[GameName]/`
- **Reference Implementation:** `final/src/games/CreatureFromTheBlackLagoonNET/`. Use this as your Gold Standard.
- **Base Classes:** `final/src/games/base/BaseSlotSettings.ts`

## 1. The "Slimmed Down" Extraction Strategy

The source PHP files have extracted massive data blocks. You must manually fetch and re-integrate this data.

### ⚠️ CRITICAL PATH WARNING: 

Do not assume all files are in `Helpers/`. Use this lookup table:

| Data Needed | Primary Source | Fallback / Specific Instruction | Target TS File |
|-------------|----------------|----------------------------------|----------------|
| Paytable | `Helpers/paytable.php` | **TRAP:** If `paytable.php` returns a string, IGNORE IT. Copy the array logic from the original PHP `SlotSettings.php` constructor. | `SlotSettings.ts` (Constructor) |
| Reels | Game Root (`Games/[Game]/reels.txt`) | It is NOT in `Helpers/`. If missing, check "Known Anomalies" below. | `SlotSettings.ts` (Constructor) |
| Lines | `Helpers/lines.php` | If missing, copy `$linesId` array from PHP `Server.php`. | `Server.ts` (spin logic) |
| CWins | `Helpers/cwins.php` | If missing, copy `$cWins` logic from PHP `Server.php`. | `Server.ts` (spin logic) |
| Responses | `Helpers/*_response.php` | If missing, extract the string construction logic directly from PHP `Server.php` (init or spin case). | `Server.ts` (get method) |

## 2. Implementation Guide

### A. SlotSettings.ts (Configuration)

**Inheritance:** Extend `BaseSlotSettings`.

**Constructor:**
- Call `super(settings)`
- Game Instance: `this.game = ModelFactory.createGame(settings.game)`
- Paytable: Populate `this.Paytable` array
- Reels: Hardcode `reelStrip1`, `reelStrip2`, etc. Do not write file-reading logic
- Config: Port `SymbolGame`, `slotBonusType`, `slotGamble` etc. exactly

### B. Server.ts (The Logic)

**Structure:** Keep the `switch(postData['action'])` structure.

**Data Re-integration:**
- `Helpers/lines.php` → Copy array to `const linesId`
- `Helpers/cwins.php` → Copy logic (usually `fill(0)`)
- `Helpers/*_response.php` → Copy the massive string. Convert `$var` to `${var}`

**Response:** Return the JSON object exactly as follows:

```typescript
return JSON.stringify({
    response: finalResponse,
    state: slotSettings.getState()
});
```

## 3. ⚠️ Known Anomalies & Missing Data

If you are converting these specific games, use the data below instead of searching for files.

### 1. DazzleMeNET

**Reels:** 5 reels with unique row counts (3-3-4-4-5).

**Reel 1:** `[8,8,8,6,6,6,3,3,8,8,8,5,5,7,7,7,8,8,8,0,4,4,5,5,8,8,8,6,6,6,5,5,5,7,7,7,8,8,8,5,5,3,3,4,4,8,8,8,7,7,7,6,6,8,8,8,7,7,7,5,5,8,8,8,6,6,6,7,7,7,8,8,8,5,5,4,4,8,8,8,6,6,6,7,7,7,8,8,8,6,6,6,5,5,5,4,4,6,6,3,3,3,5,5,5,6,6,6,7,7,7,0,4,4,4,6,6,3,3,8,8,8,6,6,5,5,7,7,7,4,4,8,8,8,7,7,7,5,5,5,8,8,8,6,6,4,4,4,7,7,7,8,8,8,5,5,5,7,7,7,4,4,6,6,6,7,7,7,4,4,6,6,6,5,5,3,3,3,8,8,8,6,6,6,5,5,8,8,8,4,4,5,5,5,8,8,8,6,6,5,5,8,8,8,7,7,7,6,6,6,8,8,8,4,4,6,6,3,3,8,8,8,6,6,6]`

**Note:** See provided reels.txt context for Reels 2-5 if needed.

### 2. FortuneRangersNET

**Reel 1:** `[8,8,8,6,6,6,3,3,8,8,8,5,5,7,7,7,8,8,8,0,4,4,5,5,8,8,8,6,6,6,5,5,5,7,7,7,8,8,8,5,5,3,3,4,4,8,8,8,7,7,7,6,6,8,8,8,7,7,7,5,5,8,8,8,6,6,6,7,7,7,8,8,8,5,5,4,4,8,8,8,6,6,6,7,7,7,8,8,8,6,6,6,5,5,5,4,4,6,6,3,3,3,5,5,5,6,6,6,7,7,7,0,4,4,4,6,6,3,3,8,8,8,6,6,5,5,7,7,7,4,4,8,8,8,7,7,7,5,5,5,8,8,8,6,6,4,4,4,7,7,7,8,8,8,5,5,5,7,7,7,4,4,6,6,6,7,7,7,4,4,6,6,6,5,5,3,3,3,8,8,8,6,6,6,5,5,8,8,8,4,4,5,5,5,8,8,8,6,6,5,5,8,8,8,7,7,7,6,6,6,8,8,8,4,4,6,6,3,3,8,8,8,6,6,6]`

### 3. FlowersNET & FlowersChristmasNET

**Reel 1:** `[6,10,11,17,9,16,11,9,10,11,9,15,7,9,10,11,10,13,9,7,9,14,11,17,11,5,8,9,11,3,9,3,4,9,11,8,1,10,9,11,16,8,9,11,10,9,11,8,3,11,5,9,6,11,9,15,11,7,11,9,9,0,6,11,8,9,11,10,4,14,8,9]`

**Note:** Use these same values for both games.

## 4. 🚨 MANDATORY VERIFICATION PHASE

Do not submit your code until you have passed this test.

### Run the Test Runner:

```bash
bun final/src/index.ts [GameName] > for_review.txt
```

*(Replace `[GameName]` with the folder name you are working on, e.g., `VikingsNET`)*

### Compare with Reference Log:

Check `for_review.txt`. It MUST match the structure of the Target Output below.

✅ **PASS** must appear for init, paytable, and spin.

**Snippet** must show a long URL-encoded string (not empty, not JSON).

## 📜 Reference Log (Target Output)

```
✅ SlotSettings instantiated.
🔹 Instantiating Server...
✅ Server instantiated.

🔸 TESTING ACTION: [init]
--------------------------------------------------
✅ PASS: Valid response received.
Length: 6833 chars
Snippet: rs.i1.r.i0.syms=SYM1%2CSYM1%2CSYM1&bl.i6.coins=1&rs.i8.r.i3.hold=false&bl.i17.reelset=ALL&bl.i15.id=...
✅ PASS: State object present.

🔸 TESTING ACTION: [paytable]
--------------------------------------------------
✅ PASS: Valid response received.
Length: 7733 chars
Snippet: pt.i0.comp.i19.symbol=SYM9&bl.i6.coins=1&bl.i17.reelset=ALL&pt.i0.comp.i15.type=betline&pt.i0.comp.i...
✅ PASS: State object present.

🔸 TESTING ACTION: [spin]
--------------------------------------------------
[DEBUG] Log report saved {"slotEvent":"bet","allbet":20,"lines":20,"reportWin":5}
✅ PASS: Valid response received.
Length: 1425 chars
Snippet: previous.rs.i0=basic&rs.i0.r.i1.pos=15&gameServerVersion=1.5.0&g4mode=false&game.win.coins=5&playerc...
✅ PASS: State object present.

==================================================
🏁 TEST SEQUENCE COMPLETE