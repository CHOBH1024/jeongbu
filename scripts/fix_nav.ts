import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');

// Replace UI navigation calls
app = app.replace(/onClick=\{\(\) => navigate\(/g, 'onClick={() => handleNavigate(');
app = app.replace(/if \(cat\) navigate\(/g, 'if (cat) handleNavigate(');
app = app.replace(/calc\.status !== '준비중' && navigate\(/g, "calc.status !== '준비중' && handleNavigate(");

// Footer link
app = app.replace(/onClick=\{\(\) => \{ setActiveCategory\(cat\); setActiveCalcId\(id\); \}\}/g, 'onClick={() => handleNavigate(cat, id)}');

// Back buttons
app = app.replace(/onClick=\{\(\) => setActiveCalcId\(null\)\}/g, 'onClick={() => handleNavigate(activeCategory!)}');

fs.writeFileSync('src/App.tsx', app);
