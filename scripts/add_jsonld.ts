import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');

const importJson = "import { JsonLd } from './components/ui/JsonLd';\n";
app = importJson + app;

app = app.replace('<AnimatePresence mode="wait">', '{selectedCalc && <JsonLd calc={selectedCalc} />}\n        <AnimatePresence mode="wait">');

fs.writeFileSync('src/App.tsx', app);
