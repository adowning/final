# 🤖 Master Agent Instructions: PHP to TypeScript Slot Conversion

## PROJECT STATUS: 🔴 HIGH RISK. DEVIATION CAUSES CLIENT FAILURE.

## ROLE: Forensic Code Translator

## OBJECTIVE: Convert legacy PHP slot games into the specific Node.js/TypeScript architecture found in the final/ folder.

## 📚 Resources

**Source Code:** You will find the PHP source in final/Games/[GameName]/.

**Logic:** Server.php

**Data:** Helpers/*.php (Paytables, Lines, Reels)

**Target Location:** Create new files in final/src/games/[GameName]/.

**Reference Implementation:** final/src/games/CreatureFromTheBlackLagoonNET/. Use this as your Gold Standard for class structure and syntax.

**Base Classes:** final/src/games/base/BaseSlotSettings.ts.

## 🚫 ZERO TOLERANCE RULES (READ FIRST)

### NO "HELPERS" IN TYPESCRIPT:
You must reassemble the code. If PHP does `require_once 'Helpers/paytable.php'`, you must OPEN that file, COPY the data, and PASTE it into your TypeScript constructor. Do not create a Helpers folder in the TypeScript directory. Hardcode the data.

### STRING EXACTNESS IS MANDATORY:
The legacy client parses raw URL-encoded strings (e.g., `&rs.i0.r.i0.syms=SYM1...`).

- DO NOT convert this to JSON.
- DO NOT fix "ugly" concatenation.
- If PHP has `'text' . $var`, TS must have `` `text${var}` ``.
- A missing & or = will break the game.

### MATHEMATICAL INTEGRITY:
Do not mock logic. If PHP iterates 2000 times to find a win, you must iterate 2000 times.

**Strict Types:** PHP is loose (`"10" * 1 = 10`). TS is strict. You must use `parseFloat()`, `parseInt()`, and `Math.floor()`/`Math.round()` to ensure numerical identity.

## 🛠️ Step-by-Step Implementation

### A. SlotSettings.ts (The Configuration)

**Inheritance:** Extend BaseSlotSettings.

**Imports:**
```typescript
import BaseSlotSettings, { IGameSettings } from '../../base/BaseSlotSettings';
import ModelFactory from '../../models/ModelFactory';
```

**Constructor:**
- Call `super(settings)`.
- Game Instance: `this.game = ModelFactory.createGame(settings.game);`
- Paytable: Open `Helpers/paytable.php`. Copy the array logic into `this.Paytable`.
- Reels: Open `Helpers/reels.txt`. Copy the CSV numbers into `this.reelStrip1`, etc.
- Config: Port `SymbolGame`, `slotBonusType`, etc. exactly.

### B. Server.ts (The Logic)

**Structure:** Keep the `switch(postData['action'])` structure.

**Data Re-integration:**
- `Helpers/lines.php` → Copy array to `const linesId` inside spin.
- `Helpers/cwins.php` → Copy logic (usually `fill(0)`) to spin.
- `Helpers/*_response.php` → Copy the massive string. Convert `$var` to `${var}`.

**Response:** Return the JSON object exactly as follows:

```typescript
return JSON.stringify({
    response: finalResponse,
    state: slotSettings.getState()
});
```

## 🧪 Mandatory Verification

You must verify your code runs before submitting.

**Run the Test Runner:**

```bash
bun final/src/index.ts [GameName] > for_review.txt
```

(Replace `[GameName]` with the folder name you are working on, e.g., VikingsNET)

**Compare with Reference Log:**

Check `for_review.txt`. It MUST match the structure of the Passing Example Log below.

- ✅ PASS must appear for init, paytable, and spin.
- Snippet must show a long URL-encoded string (not empty, not JSON).
- State object must be present.

## 📜 Reference Log (Target Output)

Your output should look almost identical to this:

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