const fs = require('fs');
const path = require('path');

// CONFIGURATION
const SEARCH_FILENAME = 'Server.php';
const NEW_PHP_FILENAME = 'spin_logic.php';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (f.startsWith('.') || f === 'node_modules') return;
        try {
            if (fs.statSync(dirPath).isDirectory()) walkDir(dirPath, callback);
            else callback(dirPath);
        } catch (e) { console.error(`Error accessing ${dirPath}: ${e.message}`); }
    });
}

console.log(`Scanning for ${SEARCH_FILENAME} files to refactor Spin logic...`);

walkDir(process.cwd(), (filePath) => {
    if(SEARCH_FILENAME === 'GoldenGrimoireNET' || SEARCH_FILENAME === 'GrandSpinnSuperpotNET')
    if (path.basename(filePath) !== SEARCH_FILENAME) return;

    const content = fs.readFileSync(filePath, 'utf8');

    // 1. Detect Namespace
    const nsMatch = content.match(/namespace\s+([a-zA-Z0-9_\\]+)\s*[;{]/);
    if (!nsMatch) return;
    const namespace = nsMatch[1];

    // 2. Extract the 'spin' case block
    // We assume the spin case starts with "case 'spin':" and ends with "break;" 
    // We capture everything in between.
    // Note: We use a non-greedy capture that respects the structure typical of these files.
    const spinRegex = /(case\s+'spin':)([\s\S]*?)(\s*break;)/;
    const match = content.match(spinRegex);

    if (match) {
        console.log(`Processing: ${filePath}`);
        
        const spinLogic = match[2]; // The content inside the case

        // 3. Fix Paths: Remove '/Helpers' from require_once since file is moving INTO Helpers
        // Pattern: require_once __DIR__ . '/Helpers/file.php' -> require_once __DIR__ . '/file.php'
        const fixedSpinLogic = spinLogic.replace(/(\/__DIR__\s*\.\s*['"])\/Helpers(\/[^'"]+['"])/g, '$1$2');

        // 4. Create spin_logic.php content
        // We accept $balanceInCents by reference because it's often updated
        const phpContent = `<?php

namespace ${namespace};

function runSpin(&$slotSettings, $postData, &$balanceInCents) {
    $result_tmp = [];
    // Logic moved from Server.php
    ${fixedSpinLogic}
    
    return $result_tmp;
}
`;
        
        const targetDir = path.dirname(filePath);
        const helpersDir = path.join(targetDir, 'Helpers');
        
        if (!fs.existsSync(helpersDir)){
            fs.mkdirSync(helpersDir);
        }
        
        fs.writeFileSync(path.join(helpersDir, NEW_PHP_FILENAME), phpContent);
        console.log(`   -> Created: Helpers/${NEW_PHP_FILENAME}`);

        // 5. Update Server.php
        // We handle the return value: 
        // - If string: it's an error response (returned via 'return' in the original logic)
        // - If array: it's the $result_tmp
        const replacement = `case 'spin':
                        require_once __DIR__ . '/Helpers/${NEW_PHP_FILENAME}';
                        $result = runSpin($slotSettings, $postData, $balanceInCents);
                        
                        if (is_string($result)) {
                            return $result;
                        }
                        
                        $result_tmp = $result;
                        break;`;
        
        const newContent = content.replace(spinRegex, replacement);

        fs.writeFileSync(filePath, newContent);
        console.log(`   -> Updated: ${SEARCH_FILENAME}`);
    }
});

console.log('Spin Logic Refactoring complete.');