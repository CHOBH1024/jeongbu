export function PrivacyPolicy() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-muted">
      <p>
        별의별 계산기(이하 "본 서비스")는 이용자의 개인정보를 중요하게 생각하며,
        「개인정보 보호법」을 준수합니다.
      </p>

      <Section title="1. 수집하는 개인정보 항목">
        <p>
          본 서비스는 <strong className="text-slate-800 dark:text-slate-200">어떠한 개인정보도 수집하지 않습니다.</strong>
          계산기에 입력되는 모든 수치는 이용자의 브라우저 내에서만 처리되며,
          서버로 전송되거나 저장되지 않습니다.
        </p>
      </Section>

      <Section title="2. 개인정보의 수집 및 이용 목적">
        <p>
          본 서비스는 개인정보를 수집하지 않으므로, 별도의 이용 목적이 없습니다.
        </p>
      </Section>

      <Section title="3. 쿠키(Cookie) 사용">
        <p>
          본 서비스는 서비스 이용 편의를 위해 브라우저 로컬 스토리지(localStorage)를
          사용할 수 있습니다. 이는 사용자의 화면 설정(다크모드 등)을 저장하기 위한 것으로,
          개인 식별 정보가 포함되지 않습니다.
        </p>
        <p className="mt-2">
          향후 서비스 개선을 위해 Google Analytics 등 분석 도구를 도입할 수 있으며,
          이 경우 사전에 안내드립니다.
        </p>
      </Section>

      <Section title="4. 광고 서비스">
        <p>
          본 서비스는 Google AdSense 등 제3자 광고 서비스를 사용할 수 있습니다.
          광고 서비스 제공업체는 광고 맞춤화를 위해 쿠키를 사용할 수 있으며,
          이는 해당 업체의 개인정보처리방침에 따릅니다.
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Google 개인정보처리방침: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">policies.google.com/privacy</a></li>
          <li>광고 맞춤화 거부: <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">adssettings.google.com</a></li>
        </ul>
      </Section>

      <Section title="5. 제3자 제공">
        <p>
          본 서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다.
        </p>
      </Section>

      <Section title="6. 개인정보 보호책임자">
        <p>
          본 서비스의 개인정보 관련 문의는 아래 이메일로 연락해 주세요.
          <br />
          이메일:{' '}
          <a href="mailto:mirririnside1024@gmail.com" className="text-primary underline">
            mirririnside1024@gmail.com
          </a>
        </p>
      </Section>

      <Section title="7. 방침 변경">
        <p>
          본 개인정보처리방침은 법령 개정이나 서비스 변경에 따라 수정될 수 있습니다.
          변경 시 서비스 내 공지를 통해 안내해 드립니다.
        </p>
      </Section>

      <p className="text-xs text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
        시행일: 2026년 1월 1일
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
      {children}
    </div>
  );
}
