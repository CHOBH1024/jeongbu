export function TermsOfService() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-muted">
      <p>
        별의별 계산기(이하 "서비스")를 이용해 주셔서 감사합니다.
        본 이용약관은 서비스 이용에 관한 기본적인 사항을 규정합니다.
      </p>

      <Section title="제1조 (목적)">
        <p>
          본 약관은 별의별 계산기가 제공하는 웹 기반 계산 서비스의 이용조건 및
          절차, 이용자와 서비스 제공자의 권리·의무에 관한 사항을 규정함을 목적으로 합니다.
        </p>
      </Section>

      <Section title="제2조 (서비스 내용)">
        <p>서비스는 다음과 같은 계산 기능을 무료로 제공합니다.</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>대출 이자·대환 시뮬레이터</li>
          <li>FIRE(조기은퇴) 시뮬레이터</li>
          <li>퇴직금·연차 계산기</li>
          <li>파킹통장, NAS 전기요금, 해외송금 계산기</li>
          <li>기타 재무·생활 관련 계산 도구</li>
        </ul>
        <p className="mt-2">
          서비스는 사전 예고 없이 일부 기능을 변경·추가·중단할 수 있습니다.
        </p>
      </Section>

      <Section title="제3조 (면책조항)">
        <p>
          본 서비스의 계산 결과는 <strong className="text-slate-800 dark:text-slate-200">참고용 정보</strong>이며,
          실제 금융 상품·세법·노무 법령과 차이가 발생할 수 있습니다.
          중요한 금융 결정이나 법적 판단 전에는 반드시 해당 분야 전문가(세무사, 노무사, 금융전문가 등)와
          상담하시기 바랍니다.
        </p>
        <p className="mt-2">
          서비스는 계산 결과의 정확성을 위해 노력하지만, 법령 개정이나
          금융기관 정책 변경으로 인한 오차에 대해 법적 책임을 지지 않습니다.
        </p>
      </Section>

      <Section title="제4조 (이용자 의무)">
        <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>서비스를 상업적 목적으로 무단 복제·배포하는 행위</li>
          <li>서비스의 정상 운영을 방해하는 행위</li>
          <li>타인의 개인정보를 도용하거나 허위 정보를 입력하는 행위</li>
          <li>관련 법령을 위반하는 행위</li>
        </ul>
      </Section>

      <Section title="제5조 (지식재산권)">
        <p>
          서비스에 포함된 콘텐츠(텍스트, 디자인, 계산 로직 등)의 지식재산권은
          별의별 계산기에 귀속됩니다. 이용자는 서비스를 개인적·비상업적 목적으로만
          이용할 수 있습니다.
        </p>
      </Section>

      <Section title="제6조 (약관의 변경)">
        <p>
          서비스는 관련 법령 변경이나 서비스 정책에 따라 본 약관을 변경할 수 있으며,
          변경 시 서비스 내 공지를 통해 사전 안내합니다.
          변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.
        </p>
      </Section>

      <Section title="제7조 (준거법 및 분쟁해결)">
        <p>
          본 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련한 분쟁이
          발생하면 관련 법령에 따른 절차에 따릅니다.
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
