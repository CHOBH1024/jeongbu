import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');

const importHistory = "import { saveHistory, getHistory, type HistoryItem } from './utils/history';\n";
app = importHistory + app;

const saveLogic = `
  React.useEffect(() => {
    if (activeCalcId && activeCategory && selectedCalc) {
      saveHistory({
        calcId: activeCalcId,
        catId: activeCategory,
        name: selectedCalc.name,
        emoji: selectedCalc.emoji
      });
    }
  }, [activeCalcId, activeCategory, selectedCalc]);
`;

app = app.replace('/* AdSense SPA', saveLogic + '\n  /* AdSense SPA');

app = app.replace("const [modal,          setModal]          = useState<'privacy'|'about'|'terms'|null>(null);", 
  "const [modal,          setModal]          = useState<'privacy'|'about'|'terms'|'history'|null>(null);");

const historyModalContent = `
function HistoryContent({ navigate, setModal, isDark, titleColor, mutedColor }: any) {
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  React.useEffect(() => {
    setHistory(getHistory());
  }, []);
  
  if (history.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center', color: mutedColor }}>최근 사용 기록이 없습니다.</div>;
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {history.map((h, i) => (
        <button key={i} onClick={() => { navigate(h.catId, h.calcId); setModal(null); }}
          style={{
            padding: '16px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 14,
            background: isDark ? 'rgba(255,255,255,0.05)' : '#f9f9fb', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.1)' : '#e5e5ea'),
            textAlign: 'left'
          }}>
          <div style={{ fontSize: 24 }}>{h.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: titleColor }}>{h.name}</div>
            <div style={{ fontSize: 12, color: mutedColor, marginTop: 4 }}>
              {new Date(h.timestamp).toLocaleDateString()}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
`;

app = app + '\n' + historyModalContent;

app = app.replace("{modal==='privacy' ? <PrivacyPolicy/>",
  "{modal==='history' ? <HistoryContent navigate={handleNavigate} setModal={setModal} isDark={isDark} titleColor={titleColor} mutedColor={mutedColor} />\\n                    : modal==='privacy' ? <PrivacyPolicy/>");

app = app.replace("{modal==='privacy'?'🔒 개인정보처리방침':modal==='terms'?'📄 이용약관':'✨ 서비스 소개'}",
  "{modal==='history'?'🕒 최근 사용 기록':modal==='privacy'?'🔒 개인정보처리방침':modal==='terms'?'📄 이용약관':'✨ 서비스 소개'}");

fs.writeFileSync('src/App.tsx', app);
