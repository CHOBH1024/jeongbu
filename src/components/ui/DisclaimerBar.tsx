import { AlertTriangle } from 'lucide-react';

interface Props {
  categoryId: string;
}

const MESSAGES: Record<string, { text: string; hotline?: string }> = {
  tax: {
    text: '세금 계산 결과는 참고용이며, 세무사법 제2조에 따른 세무대리 행위가 아닙니다. 실제 신고·납부 전 세무사 또는 국세청에 확인하세요.',
    hotline: '국세청 126',
  },
  hr: {
    text: '급여·퇴직금·연차 계산 결과는 참고용이며, 공인노무사법에 따른 노무상담이 아닙니다. 실제 분쟁·산정은 노무사 또는 고용노동부에 문의하세요.',
    hotline: '고용노동부 1350',
  },
  invest: {
    text: '투자 시뮬레이션 결과는 참고용이며, 자본시장법에 따른 투자자문이 아닙니다. 실제 투자 결정 전 금융전문가와 상담하고 원금 손실 가능성을 인지하세요.',
    hotline: '금융감독원 1332',
  },
  estate: {
    text: '부동산 비용 계산 결과는 참고용이며, 실제 계약·등기 비용과 다를 수 있습니다. 법무사·공인중개사·세무사와 사전 확인을 권장합니다.',
    hotline: '국토교통부 1599-0001',
  },
  viral: {
    text: '금융 시뮬레이션 결과는 미래 수익을 보장하지 않습니다. 실제 금융상품 가입 전 상품설명서를 반드시 확인하고 전문가와 상담하세요.',
    hotline: '금융감독원 1332',
  },
  biz: {
    text: '사업·프리랜서 계산 결과는 참고용이며, 실제 세금·계약·소득은 세무사·노무사와 확인하세요.',
  },
  daily: {
    text: '생활비 시뮬레이션은 참고용입니다. 실제 공과금·상품 요금은 해당 기관의 최신 요금표를 확인하세요.',
  },
  tech: {
    text: '비용 추정치는 참고용이며 실제 계약·구매 전 공급사의 최신 요금 정책을 확인하세요.',
  },
  fun: {
    text: '재미 목적의 계산기입니다. 결과를 실제 의사결정에 활용하지 마세요.',
  },
};

export function DisclaimerBar({ categoryId }: Props) {
  const msg = MESSAGES[categoryId] ?? {
    text: '계산 결과는 참고용이며 실제 금융·법률 상황과 차이가 있을 수 있습니다. 중요한 결정 전 전문가와 상담하세요.',
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 16px',
      background: '#fffbeb',
      borderBottom: '1px solid #fde68a',
    }}>
      <AlertTriangle size={14} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={{ fontSize: 12, color: '#92400e', lineHeight: 1.6, margin: 0 }}>
        <strong>참고용 계산기</strong> — {msg.text}
        {msg.hotline && (
          <span style={{ marginLeft: 6, fontWeight: 700, color: '#b45309' }}>
            ({msg.hotline})
          </span>
        )}
      </p>
    </div>
  );
}
