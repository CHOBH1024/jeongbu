import fs from 'fs';

// Add to BottomTab
let tab = fs.readFileSync('src/components/ui/BottomTab.tsx', 'utf8');
tab = tab.replace(/alert\('링크가 복사되었습니다!'\);/g, "window.dispatchEvent(new CustomEvent('show-toast', { detail: '링크가 복사되었습니다!' }));");
fs.writeFileSync('src/components/ui/BottomTab.tsx', tab);

// Add to App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = "import { Toast } from './components/ui/Toast';\n" + app;
app = app.replace('<BottomTab isDark={isDark} />', '<Toast />\n        <BottomTab isDark={isDark} />');
fs.writeFileSync('src/App.tsx', app);
