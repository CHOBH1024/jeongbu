import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { RATES_EFFECTIVE_DATE } from '../../data/rates';
import { Gift, Info } from 'lucide-react';

/* ── 증여세 계산 로직 ─────────────────────────────────────── */

type Relation = 'spouse' | 'linealAscendant' | 'linealDescendant' | 'otherRelative' | 'other';

const RELATION_LABELS: Record<Relation, string> = {
  spouse: '배우자',
  linealAscendant: '직계존속 (부모·조부모)',
  linealDescendant: '직계비속 (자녀·손자녀)',
  otherRelative: '기타친족',
  other: '타인',
};

const DEDUCTION_LIMITS: Record<Relation, number> = {
  spouse: 600000000,      // 6억
  linealAscendant: 50000000, // 5천만
  linealDescendant: 50000000, // 5천만
  otherRelative: 10000000, // 1천만
  other: 0,
};

// 증여세 세율 구간
const GIFT_TAX_BRACKETS = [
  { max: 100000000,  rate: 0.10, deduct: 0 },         // 1억 이하 10%
  { max: 500000000,  rate: 0.20, deduct: 10000000 },  // 5억 이하 20% (누진공제 1천만)
  { max: 1000000000, rate: 0.30, deduct: 60000000 },  // 10억 이하 30% (누진공제 6천만)
  { max: 3000000000, rate: 0.40, deduct: 160000000 }, // 30억 이하 40% (누진공제 1.6억)
  { max: Infinity,   rate: 0.50, deduct: 460000000 }, // 초과 50% (누진공제 4.6억)
];

function calcGiftTax(taxBase: number): number {
  for (const b of GIFT_TAX_BRACKETS) {
    if (taxBase <= b.max) return Math.max(0, Math.floor(taxBase * b.rate - b.deduct));
  }
  return 0;
}

/* ── 컴포넌트 ─────────────────────────────────────────────── */

const INPUT_H: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: '#f9f9fb', border: '1.5px solid #e5e5ea',
  borderRadius: 10, fontSize: 14, color: '#1d1d1f',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};

const mutedColor = '#6e6e73';

export const GiftTax = () => {
  const [giftAmount, setGiftAmount] = useState(100000000);
  const [relation, setRelation] = useState<Relation>('linealAscendant');
  const [prevGifts, setPrevGifts] = useState(0);
  const [isMinor, setIsMinor] = useState(false);

  const result = useMemo(() => {
    if (giftAmount <= 0) return null;

    const deductionLimit = relation === 'linealAscendant' && isMinor
      ? 20000000 // 미성년자 직계존속 공제 한도 2천만
      : DEDUCTION_LIMITS[relation];

    const totalGifts = giftAmount + prevGifts;
    const taxBase = Math.max(0, totalGifts - deductionLimit);
    const grossTax = calcGiftTax(taxBase);
    const reportingDeduction = Math.floor(grossTax * 0.03); // 신고세액공제 3%
    const finalTax = Math.max(0, grossTax - reportingDeduction);

    return {
      deductionLimit,
      totalGifts,
      taxBase,
      grossTax,
      reportingDeduction,
      finalTax,
    };
  }, [giftAmount, relation, prevGifts, isMinor]);

  const fmt = (n: number) => '₩' + n.toLocaleString('ko-KR');

  return (
    <div className="space-y-6">
      <div style={{
        padding: '12px 18px', borderRadius: 12, fontSize: 12,
        background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e',
        display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong>{RATES_EFFECTIVE_DATE}</strong> 기준 &middot; 상속세 및 증여세법 §53·§56 적용 &middot; 결과는 참고용이며 실제와 차이가 있을 수 있습니다.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>
        {/* 입력 */}
        <div className="space-y-5">
          <Card title="증여 정보" icon={<Gift size={18} />}>
            <div className="space-y-4" style={{ marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>증여 금액 (원)</label>
                <input type="number" value={giftAmount} onChange={e => setGiftAmount(+e.target.value)} style={INPUT_H} step={10000000} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>10년 내 이전 증여액 (원)</label>
                <input type="number" value={prevGifts} onChange={e => setPrevGifts(+e.target.value)} style={INPUT_H} step={1000000} min={0} />
              </div>
            </div>
          </Card>

          <Card title="증여자와의 관계">
            <div className="space-y-2" style={{ marginTop: 8 }}>
              {(Object.keys(RELATION_LABELS) as Relation[]).map(r => (
                <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 10, background: relation === r ? '#eef2ff' : 'transparent', border: `1.5px solid ${relation === r ? '#6366f1' : 'transparent'}` }}>
                  <input type="radio" name="relation" value={r} checked={relation === r} onChange={() => setRelation(r)}
                    style={{ accentColor: '#6366f1' }} />
                  <div>
                    <span style={{ fontSize: 14, color: '#1d1d1f', fontWeight: 600 }}>{RELATION_LABELS[r]}</span>
                    <span style={{ fontSize: 12, color: mutedColor, marginLeft: 8 }}>
                      {DEDUCTION_LIMITS[r] === 0 ? '공제 없음' : `${(DEDUCTION_LIMITS[r] / 100000000).toFixed(1)}억 공제`}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {relation === 'linealAscendant' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, cursor: 'pointer' }}>
                <input type="checkbox" checked={isMinor} onChange={e => setIsMinor(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#6366f1' }} />
                <span style={{ fontSize: 13, color: '#1d1d1f', fontWeight: 600 }}>미성년자 (공제 한도 2천만 원 적용)</span>
              </label>
            )}
          </Card>
        </div>

        {/* 결과 */}
        <div className="space-y-5">
          {result ? (
            <>
              <div style={{
                padding: '28px', borderRadius: 20,
                background: 'linear-gradient(135deg,#eef2ff,#fdf4ff)',
                border: '1.5px solid rgba(99,102,241,0.2)',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: 13, color: mutedColor, fontWeight: 700, marginBottom: 8 }}>최종 납부세액</p>
                <p className="num" style={{ fontSize: 36, fontWeight: 900, color: '#6366f1', letterSpacing: '-0.03em', marginBottom: 4 }}>
                  {fmt(result.finalTax)}
                </p>
                {result.taxBase === 0 && (
                  <p style={{ fontSize: 13, color: '#10b981', fontWeight: 700, marginTop: 8 }}>
                    공제 한도 이내 — 증여세 없음
                  </p>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <StatCard label="증여 공제 한도" value={fmt(result.deductionLimit)} color="#10b981" />
                <StatCard label="과세표준" value={fmt(result.taxBase)} color="#6366f1" />
                <StatCard label="산출세액" value={fmt(result.grossTax)} color="#ef4444" />
                <StatCard label="신고공제 (3%)" value={`-${fmt(result.reportingDeduction)}`} color="#f59e0b" />
              </div>

              <Card title="세금 계산 근거">
                <div className="space-y-3" style={{ marginTop: 8, fontSize: 13, color: mutedColor }}>
                  {[
                    ['① 이번 증여액', fmt(giftAmount)],
                    ['② 10년 내 이전 증여액', fmt(prevGifts)],
                    ['③ 합산 증여액', fmt(result.totalGifts)],
                    ['④ 증여재산 공제', `-${fmt(result.deductionLimit)}`],
                    ['⑤ 과세표준', fmt(result.taxBase)],
                    ['⑥ 산출세액', fmt(result.grossTax)],
                    ['⑦ 신고세액공제 (3%)', `-${fmt(result.reportingDeduction)}`],
                    ['⑧ 최종 납부세액', fmt(result.finalTax)],
                  ].map(([k, v]) => (
                    <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f2f2f7' }}>
                      <span>{k as string}</span>
                      <span style={{ fontWeight: 700, color: '#1d1d1f' }}>{v as string}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: mutedColor, fontSize: 14 }}>
              증여 금액을 입력하면 계산됩니다
            </div>
          )}

          <Card title="알아두세요 💡">
            <div className="space-y-3" style={{ marginTop: 8 }}>
              {[
                '증여재산 공제는 10년 단위로 합산됩니다. 10년이 지나면 공제 한도가 초기화됩니다.',
                '배우자는 6억 원까지 공제되어 사실상 소액 증여는 비과세됩니다.',
                '신고세액공제(3%)는 신고기한(증여일 기준 3개월) 내 자진신고 시 적용됩니다.',
                '미성년 자녀에게 직계존속이 증여할 때는 공제 한도가 2천만 원으로 줄어듭니다.',
                '부담부증여(채무 포함 증여)는 채무 부분에 양도소득세가 별도 과세될 수 있습니다.',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: '#6e6e73' }}>
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
