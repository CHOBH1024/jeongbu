import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(/\\n/g, '\n');

fs.writeFileSync('src/App.tsx', app);
