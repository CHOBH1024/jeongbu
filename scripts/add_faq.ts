import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');

const faqComponent = `
  {selectedCalc.desc && (
    <div style={{ marginTop: 40 }}>
      <SeoColumn 
        isDark={isDark}
        title={\`\${selectedCalc.name} 자주 묻는 질문(FAQ)\`}
        content={\`\${selectedCalc.desc}\\n\\n\${selectedCalc.name}에 대한 결과는 가장 최신 알고리즘을 기반으로 제공됩니다. 정확한 수치는 개인별 요건에 따라 다를 수 있으므로 참고용으로만 사용해주세요.\`}
      />
    </div>
  )}
`;

app = app.replace('<AdResult />', '<AdResult />\n' + faqComponent);

fs.writeFileSync('src/App.tsx', app);
