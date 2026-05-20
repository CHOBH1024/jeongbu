import fs from 'fs';
let cat = fs.readFileSync('src/data/categories.tsx', 'utf8');

// Replace standard imports with lazy imports
cat = cat.replace(/import \{ ([a-zA-Z0-9_]+) \}\s+from\s+'\.\/components\/calculators\/([^']+)'/g, 
  "const $1 = React.lazy(() => import('./components/calculators/$2').then(module => ({ default: module.$1 })))");

// Also replace default imports if any
cat = cat.replace(/import ([a-zA-Z0-9_]+)\s+from\s+'\.\/components\/calculators\/([^']+)'/g, 
  "const $1 = React.lazy(() => import('./components/calculators/$2'))");

fs.writeFileSync('src/data/categories.tsx', cat);
