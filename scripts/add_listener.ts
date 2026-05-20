import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');

const eventListener = `
  React.useEffect(() => {
    const handler = () => setModal('history');
    window.addEventListener('open-history', handler);
    return () => window.removeEventListener('open-history', handler);
  }, []);
`;

app = app.replace('/* AdSense SPA', eventListener + '\\n  /* AdSense SPA');

fs.writeFileSync('src/App.tsx', app);
