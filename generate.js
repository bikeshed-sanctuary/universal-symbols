#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Read the symbols data
const symbolsData = JSON.parse(fs.readFileSync('symbols.json', 'utf8'));

// Generate the index.js content
function generateIndexJS() {
  const prefix = '8784e0ee-1345-46ab-ad8c-964bacb656a3';
  
  let content = `// Universal Utility Symbols v${symbolsData.version}
// ${symbolsData.description}

const prefix = '${prefix}';

const real_symbol = globalThis.Symbol;
const Symbol = s => real_symbol.for(prefix + ':' + s);

`;

  // Generate vibes symbols
  content += `// =============================================================================
// VIBES - Abstract, emotional, and vibe-based symbols for expressive programming
// =============================================================================
// ${symbolsData.categories.vibes.description}

`;

  // Group vibes by category
  const vibesByCategory = {};
  for (const [symbolName, symbolData] of Object.entries(symbolsData.categories.vibes.symbols)) {
    const category = symbolData.category;
    if (!vibesByCategory[category]) {
      vibesByCategory[category] = [];
    }
    vibesByCategory[category].push({ name: symbolName, ...symbolData });
  }

  // Generate vibes exports by category
  for (const [category, symbols] of Object.entries(vibesByCategory)) {
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    content += `// ${categoryTitle} vibes
`;
    
    for (const symbol of symbols) {
      content += `export const ${symbol.name} = Symbol('${symbol.name.toLowerCase()}'); // ${symbol.description}
`;
    }
    content += '\n';
  }

  // Generate formal symbols
  content += `// =============================================================================
// FORMAL - Well-defined symbols with specific, formal use cases
// =============================================================================
// ${symbolsData.categories.formal.description}

`;

  // Group formal by category
  const formalByCategory = {};
  for (const [symbolName, symbolData] of Object.entries(symbolsData.categories.formal.symbols)) {
    const category = symbolData.category;
    if (!formalByCategory[category]) {
      formalByCategory[category] = [];
    }
    formalByCategory[category].push({ name: symbolName, ...symbolData });
  }

  // Generate formal exports by category
  for (const [category, symbols] of Object.entries(formalByCategory)) {
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    content += `// ${categoryTitle} formal symbols
`;
    
    for (const symbol of symbols) {
      content += `export const ${symbol.name} = Symbol('${symbol.name.toLowerCase()}'); // ${symbol.description}
`;
    }
    content += '\n';
  }

  // Generate convenience collections
  content += `// =============================================================================
// CONVENIENCE COLLECTIONS
// =============================================================================

`;

  // Vibes collections by category
  for (const [category, symbols] of Object.entries(vibesByCategory)) {
    const categoryUpper = category.toUpperCase();
    const symbolNames = symbols.map(s => s.name).join(', ');
    content += `export const ${categoryUpper}_VIBES = {
  ${symbolNames}
};

`;
  }

  // Formal collections by category
  for (const [category, symbols] of Object.entries(formalByCategory)) {
    const categoryUpper = category.toUpperCase();
    const symbolNames = symbols.map(s => s.name).join(', ');
    content += `export const ${categoryUpper}_FORMAL = {
  ${symbolNames}
};

`;
  }

  // All vibes and formal collections
  const allVibes = Object.values(vibesByCategory).flat().map(s => s.name).join(', ');
  const allFormal = Object.values(formalByCategory).flat().map(s => s.name).join(', ');

  content += `// All symbols by category
export const VIBES = {
  ${allVibes}
};

export const FORMAL = {
  ${allFormal}
};

// Complete collection
export const ALL_SYMBOLS = {
  ...VIBES,
  ...FORMAL
};

`;

  return content;
}

// Generate TypeScript declarations
function generateTypeScriptDeclarations() {
  let content = `// TypeScript declarations for Universal Utility Symbols v${symbolsData.version}
// ${symbolsData.description}

`;

  // Generate vibes symbols
  content += `// =============================================================================
// VIBES - Abstract, emotional, and vibe-based symbols for expressive programming
// =============================================================================
// ${symbolsData.categories.vibes.description}

`;

  // Group vibes by category
  const vibesByCategory = {};
  for (const [symbolName, symbolData] of Object.entries(symbolsData.categories.vibes.symbols)) {
    const category = symbolData.category;
    if (!vibesByCategory[category]) {
      vibesByCategory[category] = [];
    }
    vibesByCategory[category].push({ name: symbolName, ...symbolData });
  }

  // Generate vibes exports by category
  for (const [category, symbols] of Object.entries(vibesByCategory)) {
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    content += `// ${categoryTitle} vibes
`;
    
    for (const symbol of symbols) {
      content += `export declare const ${symbol.name}: unique symbol; // ${symbol.description}
`;
    }
    content += '\n';
  }

  // Generate formal symbols
  content += `// =============================================================================
// FORMAL - Well-defined symbols with specific, formal use cases
// =============================================================================
// ${symbolsData.categories.formal.description}

`;

  // Group formal by category
  const formalByCategory = {};
  for (const [symbolName, symbolData] of Object.entries(symbolsData.categories.formal.symbols)) {
    const category = symbolData.category;
    if (!formalByCategory[category]) {
      formalByCategory[category] = [];
    }
    formalByCategory[category].push({ name: symbolName, ...symbolData });
  }

  // Generate formal exports by category
  for (const [category, symbols] of Object.entries(formalByCategory)) {
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    content += `// ${categoryTitle} formal symbols
`;
    
    for (const symbol of symbols) {
      content += `export declare const ${symbol.name}: unique symbol; // ${symbol.description}
`;
    }
    content += '\n';
  }

  // Generate convenience collections
  content += `// =============================================================================
// CONVENIENCE COLLECTIONS
// =============================================================================

`;

  // Vibes collections by category
  for (const [category, symbols] of Object.entries(vibesByCategory)) {
    const categoryUpper = category.toUpperCase();
    const symbolEntries = symbols.map(s => `  ${s.name}: symbol`).join(';\n');
    content += `export declare const ${categoryUpper}_VIBES: {
${symbolEntries};
};

`;
  }

  // Formal collections by category
  for (const [category, symbols] of Object.entries(formalByCategory)) {
    const categoryUpper = category.toUpperCase();
    const symbolEntries = symbols.map(s => `  ${s.name}: symbol`).join(';\n');
    content += `export declare const ${categoryUpper}_FORMAL: {
${symbolEntries};
};

`;
  }

  // All vibes and formal collections
  const allVibesEntries = Object.values(vibesByCategory).flat().map(s => `  ${s.name}: symbol`).join(';\n');
  const allFormalEntries = Object.values(formalByCategory).flat().map(s => `  ${s.name}: symbol`).join(';\n');

  content += `// All symbols by category
export declare const VIBES: {
${allVibesEntries};
};

export declare const FORMAL: {
${allFormalEntries};
};

// Complete collection
export declare const ALL_SYMBOLS: {
${allVibesEntries};
${allFormalEntries};
};

`;

  return content;
}

// Generate and write the files
const generatedJSContent = generateIndexJS();
const generatedTSContent = generateTypeScriptDeclarations();

fs.writeFileSync('index.js', generatedJSContent);
fs.writeFileSync('index.d.ts', generatedTSContent);

console.log('✅ Generated index.js from symbols.json');
console.log('✅ Generated index.d.ts from symbols.json');
console.log(`📊 Generated ${Object.keys(symbolsData.categories.vibes.symbols).length} vibes symbols`);
console.log(`📊 Generated ${Object.keys(symbolsData.categories.formal.symbols).length} formal symbols`);
console.log('🎯 Total symbols:', Object.keys(symbolsData.categories.vibes.symbols).length + Object.keys(symbolsData.categories.formal.symbols).length); 