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
        <p>서비스는 세금·노무·금융·부동산·생활 관련 계산 기능을 무료로 제공합니다.</p>
        <p className="mt-2">
          서비스는 사전 예고 없이 일부 기능을 변경·추가·중단할 수 있습니다.
        </p>
      </Section>

      <Section title="제3조 (면책조항 — 중요)">
        <div className="space-y-3">
          <p>
            본 서비스의 모든 계산 결과는 <strong className="text-slate-800 dark:text-slate-200">일반 정보 제공 목적의 참고용</strong>이며,
            어떠한 경우에도 법적 구속력이 있는 조언으로 해석될 수 없습니다.
          </p>
          <p className="font-semibold text-slate-700 dark:text-slate-300">① 세무 관련</p>
          <p>
            본 서비스는 <strong>세무사법 제2조</strong>에 따른 세무대리(세금 신고·조사·심판 청구 등) 행위가 아닙니다.
            세금 신고·납부·환급 등 실제 세무 처리는 반드시 세무사에게 의뢰하거나 국세청(☎ 126)에 문의하십시오.
          </p>
          <p className="font-semibold text-slate-700 dark:text-slate-300">② 노무 관련</p>
          <p>
            본 서비스는 <strong>공인노무사법</strong>에 따른 노무상담·대리 행위가 아닙니다.
            퇴직금·임금·연차 등 실제 노무 분쟁·산정은 공인노무사 또는 고용노동부(☎ 1350)에 문의하십시오.
          </p>
          <p className="font-semibold text-slate-700 dark:text-slate-300">③ 금융투자 관련</p>
          <p>
            본 서비스는 <strong>자본시장과 금융투자업에 관한 법률</strong>에 따른 투자자문·일임 행위가 아닙니다.
            실제 투자 결정은 원금 손실 가능성을 인지하고 금융전문가·금융감독원(☎ 1332)과 확인하십시오.
          </p>
          <p className="font-semibold text-slate-700 dark:text-slate-300">④ 부동산·법률 관련</p>
          <p>
            본 서비스는 변호사법·법무사법에 따른 법률 조언이 아닙니다.
            실제 부동산 거래·계약·등기는 공인중개사·법무사·변호사와 상담 후 진행하십시오.
          </p>
          <p className="font-semibold text-slate-700 dark:text-slate-300">⑤ 계산 정확성</p>
          <p>
            서비스는 최신 법령 기준 유지를 위해 노력하나, 법령 개정·요율 변경·입력 오류 등으로 인해
            실제 금액과 차이가 발생할 수 있습니다. 서비스 제공자는 계산 결과의 오차로 인한
            어떠한 손해에 대해서도 법적 책임을 지지 않습니다.
          </p>
        </div>
      </Section>

      <Section title="제4조 (이용자 의무)">
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>서비스를 상업적 목적으로 무단 복제·배포하는 행위 금지</li>
          <li>서비스의 정상 운영을 방해하는 행위 금지</li>
          <li>타인의 개인정보를 도용하거나 허위 정보를 입력하는 행위 금지</li>
          <li>관련 법령을 위반하는 행위 금지</li>
        </ul>
        <p className="mt-2">
          이용자는 계산 결과를 전문가 확인 없이 세금 신고·계약·투자 등 법적 효력이 있는 행위에
          단독으로 사용하지 않을 책임이 있습니다.
        </p>
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
        시행일: 2026년 1월 1일 · 최종 개정: 2026년 5월 17일
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
