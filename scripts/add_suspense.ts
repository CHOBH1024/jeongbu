import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace('{selectedCalc.component}', '<React.Suspense fallback={<div style={{padding: 40, textAlign: "center", color: "#a1a1aa"}}>계산기를 불러오는 중입니다...</div>}>{selectedCalc.component}</React.Suspense>');

fs.writeFileSync('src/App.tsx', app);
