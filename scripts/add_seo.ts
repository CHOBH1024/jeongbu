import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');

const importSeo = "import { SeoColumn } from './components/ui/SeoColumn';\n";
app = importSeo + app;

const seoComponent = `
  <div style={{ marginTop: 40 }}>
    <SeoColumn 
      isDark={isDark}
      title="일상의 필수 계산기 모음, 별의별 계산기"
      content="대출이자, 연봉, 세금, 부동산, 가상화폐 등 복잡한 계산을 언제 어디서나 쉽게 할 수 있습니다.\\n무료로 제공되는 40여 종의 스마트 계산기로 여러분의 시간을 절약하세요."
    />
  </div>
`;

app = app.replace(/<AdBanner \/>\s*<div style=\{\{ paddingTop:28 \}\}>/, seoComponent + '\n                  <AdBanner />\n                  <div style={{ paddingTop:28 }}>');

fs.writeFileSync('src/App.tsx', app);
