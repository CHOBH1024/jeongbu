const fs = require('fs');

const appTsx = fs.readFileSync('src/App.tsx', 'utf8');

// We want to extract CATEGORIES and getFeatured into src/data/categories.tsx
// It starts at "import { LoanRefinancing }" and ends after "getFeatured()"
const startIdx = appTsx.indexOf("import { LoanRefinancing }");
const endStr = "  );\n}";
const getFeaturedIdx = appTsx.indexOf("function getFeatured()");
const endIdx = appTsx.indexOf(endStr, getFeaturedIdx) + endStr.length;

const categoriesCode = appTsx.slice(startIdx, endIdx);

const newCategoriesTsx = `import React from 'react';
import { Rocket, Building2, Monitor, Coins, Wallet, Scale, Home, TrendingUp, Laugh } from 'lucide-react';

` + categoriesCode + `

export { CATEGORIES, getFeatured };
export type { CalcDef, Category };
`;

fs.writeFileSync('src/data/categories.tsx', newCategoriesTsx);

// Now remove it from App.tsx
const newAppTsx = appTsx.slice(0, startIdx) + "import { CATEGORIES, getFeatured, type CalcDef, type Category } from './data/categories';\n" + appTsx.slice(endIdx);
fs.writeFileSync('src/App.tsx', newAppTsx);

console.log("Successfully extracted categories.tsx");
