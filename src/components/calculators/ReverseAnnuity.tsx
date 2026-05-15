import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Info } from 'lucide-react';

const INPUT_H: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: '#f9f9fb', border: '1.5px solid #e5e5ea',
  borderRadius: 10, fontSize: 14, color: '#1d1d1f',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};

const mutedColor = '#6e6e73';
const fmt = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

/** HF 주택연금 종신형 지급률 (나이 → 월지급률) */
const PAYOUT_TABLE: Array<{ age: number; rate: number }> = [
  { age: 55, rate: 0.000152 },
  { age: 60, rate: 0.000192 },
  { age: 65, rate: 0.000244 },
  { age: 70, rate: 0.000316 },
  { age: 75, rate: 0.000419 },
  { age: 80, rate: 0.000580 },
];

function interpolateRate(age: number): number {
  const clamped = Math.max(55, Math.min(84, age));
  const below = PAYOUT_TABLE.filter((r) => r.age <= clamped).pop();
  const above = PAYOUT_TABLE.find((r) => r.age > clamped);
  if (!below) return PAYOUT_TABLE[0].rate;
  if (!above) return PAYOUT_TABLE[PAYOUT_TABLE.length - 1].rate;
  const t = (clamped - below.age) / (above.age - below.age);
  return below.rate + t * (above.rate - below.rate);
}

/** 확정기간형 지급률 (종신형의 배율로 단순 근사) */
const FIXED_TERM_MULTIPLIER: Record<number, number> = {
  10: 1.95,
  15: 1.50,
  20: 1.25,
};

type PaymentType = '종신형' | '확정10년' | '확정15년' | '확정20년';

export const ReverseAnnuity = () => {
  const [houseValue, setHouseValue] = useState(500000000);
  const [age, setAge] = useState(65);
  const [spouseAge, setSpouseAge] = useState<string>('');
  const [paymentType, setPaymentType] = useState<PaymentType>('종신형');

  const result = useMemo(() => {
    const effectiveAge = spouseAge && +spouseAge >= 55 && +spouseAge <= 84
      ? Math.min(age, +spouseAge)  // 배우자가 있으면 더 어린 쪽 기준 (보수적)
      : age;

    const baseRate = interpolateRate(effectiveAge);
    let monthlyRate = baseRate;
    if (paymentType !== '종신형') {
      const years = +paymentType.replace('확정', '').replace('년', '') as number;
      monthlyRate = baseRate * (FIXED_TERM_MULTIPLIER[years] ?? 1);
    }

    const monthly = houseValue * monthlyRate;
    const annual = monthly * 12;
    const cumul10 = monthly * 12 * 10;
    const cumul20 = monthly * 12 * 20;

    return { monthly, annual, cumul10, cumul20, effectiveAge };
  }, [houseValue, age, spouseAge, paymentType]);

  const paymentTypes: PaymentType[] = ['종신형', '확정10년', '확정15년', '확정20년'];

  return (
    <div className="space-y-6">
      <div style={{
        padding: '12px 18px', borderRadius: 12, fontSize: 12,
        background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e',
        display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
        <span>
          HF 한국주택금융공사 주택연금 공시 지급률을 근사한 값으로,{' '}
          <strong>실제 수령액은 HF 주택금융공사 심사 결과에 따라 다를 수 있습니다.</strong>{' '}
          참고용으로만 활용하세요.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>
        {/* 입력 */}
        <div className="space-y-5">
          <Card title="수령 유형">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              {paymentTypes.map((t) => (
                <button key={t} onClick={() => setPaymentType(t)}
                  style={{
                    padding: '10px 0', borderRadius: 10, fontWeight: 700, fontSize: 12,
                    border: '1.5px solid',
                    background: paymentType === t ? '#6366f1' : 'transparent',
                    color: paymentType === t ? '#fff' : mutedColor,
                    borderColor: paymentType === t ? '#6366f1' : '#e5e5ea',
                    cursor: 'pointer',
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </Card>

          <Card title="주택 및 나이 정보">
            <div className="space-y-4" style={{ marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>주택 시가</label>
                <input type="number" value={houseValue} onChange={(e) => setHouseValue(+e.target.value)} style={INPUT_H} step={10000000}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>신청자 나이 (55~84세)</label>
                <input type="number" value={age} onChange={(e) => setAge(Math.max(55, Math.min(84, +e.target.value)))} style={INPUT_H} min={55} max={84}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                  배우자 나이 <span style={{ color: '#aeaeb2', fontWeight: 400 }}>(선택, 55~84세)</span>
                </label>
                <input type="number" value={spouseAge} onChange={(e) => setSpouseAge(e.target.value)} style={INPUT_H} min={55} max={84} placeholder="없으면 비워두세요"/>
              </div>
            </div>
          </Card>

          <Card title="나이별 종신형 지급률 (참고)">
            <div style={{ marginTop: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e5ea' }}>
                    {['나이', '월 지급률', '1억당 월 수령'].map((h) => (
                      <th key={h} style={{ padding: '6px', textAlign: 'center', color: mutedColor, fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PAYOUT_TABLE.map((row) => (
                    <tr key={row.age} style={{ borderBottom: '1px solid #f2f2f7', background: Math.abs(age - row.age) < 3 ? '#eef2ff' : undefined }}>
                      <td style={{ padding: '6px', textAlign: 'center', fontWeight: 600 }}>{row.age}세</td>
                      <td style={{ padding: '6px', textAlign: 'center' }}>{(row.rate * 100).toFixed(4)}%</td>
                      <td style={{ padding: '6px', textAlign: 'center', fontWeight: 700, color: '#6366f1' }}>
                        {Math.round(100000000 * row.rate).toLocaleString('ko-KR')}원
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* 결과 */}
        <div className="space-y-5">
          <div style={{
            padding: '28px', borderRadius: 20, textAlign: 'center',
            background: 'linear-gradient(135deg,#eef2ff,#fdf4ff)',
            border: '1.5px solid rgba(99,102,241,0.2)',
          }}>
            <p style={{ fontSize: 13, color: mutedColor, fontWeight: 700, marginBottom: 8 }}>
              예상 월 수령액 ({paymentType})
            </p>
            <p className="num" style={{ fontSize: 40, fontWeight: 900, color: '#6366f1', letterSpacing: '-0.03em', marginBottom: 4 }}>
              {fmt(result.monthly)}
            </p>
            <p style={{ fontSize: 12, color: mutedColor }}>
              적용 나이: {result.effectiveAge}세{spouseAge && +spouseAge >= 55 ? ' (배우자 포함 낮은 나이 기준)' : ''}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <StatCard label="연 수령액" value={fmt(result.annual)} color="#6366f1"/>
            <StatCard label="10년 누적" value={fmt(result.cumul10)} color="#10b981"/>
            <StatCard label="20년 누적" value={fmt(result.cumul20)} color="#8b5cf6"/>
            <StatCard label="주택 시가" value={fmt(houseValue)} color="#f59e0b"/>
          </div>

          <Card title="알아두세요 💡">
            <div className="space-y-3" style={{ marginTop: 8 }}>
              {[
                '주택연금은 만 55세 이상, 공시가격 12억원 이하 주택에 신청 가능합니다.',
                '종신형은 평생 수령, 확정기간형은 정해진 기간만 수령합니다.',
                '배우자가 있는 경우 더 어린 나이를 기준으로 지급액이 계산됩니다.',
                '실제 지급액은 HF 주택금융공사 공시 지급률에 따라 다르며, 본 계산기는 참고용입니다.',
                '가입 후 사망 시 남은 주택가치는 상속인에게 돌아갑니다.',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: mutedColor }}>
                  <span style={{ flexShrink: 0, color: '#6366f1', fontWeight: 800 }}>{i + 1}.</span>
                  <span style={{ lineHeight: 1.7 }}>{tip}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
