import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { BROKER_FEE_RATES } from '../../data/rates';
import { Info } from 'lucide-react';

const INPUT_H: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: '#f9f9fb', border: '1.5px solid #e5e5ea',
  borderRadius: 10, fontSize: 14, color: '#1d1d1f',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};

const mutedColor = '#6e6e73';
const fmt = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

type HouseCount = '1주택' | '2주택' | '3주택이상';

/** 취득세 계산 */
function calcAcquisitionTax(price: number, area: number, houseCount: HouseCount, isAdjusted: boolean): number {
  if (houseCount === '3주택이상') {
    return price * (isAdjusted ? 0.12 : 0.08);
  }
  if (houseCount === '2주택') {
    return price * (isAdjusted ? 0.08 : calcBase1hRate(price, area));
  }
  // 1주택
  return price * calcBase1hRate(price, area);
}

function calcBase1hRate(price: number, area: number): number {
  if (area > 85) return 0.03;
  if (price <= 600000000) return 0.01;
  if (price <= 900000000) return 0.02;
  return 0.03;
}

/** 법무사 수수료 근사 */
function calcLegalFee(price: number): number {
  if (price < 100000000) return 1000000;
  if (price < 300000000) return 1500000;
  if (price < 600000000) return 2000000;
  if (price < 1000000000) return 2500000;
  return 3000000;
}

/** 인지세 */
function calcStampDuty(price: number): number {
  if (price < 100000000) return 0;
  if (price <= 1000000000) return 150000;
  return 350000;
}

/** 국민주택채권 매입 (즉시 환매 할인율 3% 가정) */
function calcBondCost(price: number): number {
  const bondAmount = price * 0.013;
  return bondAmount * 0.03; // 즉시 환매 할인 손실
}

/** 이사비 */
function calcMovingCost(price: number): number {
  if (price < 300000000) return 1000000;
  if (price < 600000000) return 1500000;
  return 3000000;
}

/** 중개보수 (매매 기준) */
function calcBrokerFee(price: number): number {
  const tier = BROKER_FEE_RATES.sale.find((t) => price <= t.max);
  if (!tier) return price * 0.009;
  const fee = price * tier.rate;
  return tier.limit ? Math.min(fee, tier.limit) : fee;
}

export const PropertyAcquisitionCost = () => {
  const [price, setPrice] = useState(700000000);
  const [area, setArea] = useState(84);
  const [houseCount, setHouseCount] = useState<HouseCount>('1주택');
  const [isAdjusted, setIsAdjusted] = useState(false);
  const [hasLoan, setHasLoan] = useState(false);
  const [loanAmount, setLoanAmount] = useState(400000000);

  const result = useMemo(() => {
    const acquisitionTax = calcAcquisitionTax(price, area, houseCount, isAdjusted);
    const localEduTax = acquisitionTax * 0.1; // 지방교육세
    const specialTax = houseCount === '1주택' && area <= 85 ? 0 : acquisitionTax * 0.2; // 농어촌특별세
    const legalFee = calcLegalFee(price);
    const stampDuty = hasLoan ? calcStampDuty(loanAmount) : 0;
    const bondCost = calcBondCost(price);
    const movingCost = calcMovingCost(price);
    const brokerFee = calcBrokerFee(price);

    const items = [
      { label: '취득세', amount: acquisitionTax },
      { label: '지방교육세 (취득세의 10%)', amount: localEduTax },
      ...(specialTax > 0 ? [{ label: '농어촌특별세 (취득세의 20%)', amount: specialTax }] : []),
      { label: '법무사 수수료 (등기대행)', amount: legalFee },
      ...(hasLoan ? [{ label: `인지세 (대출 ${(loanAmount / 1e8).toFixed(1)}억)`, amount: stampDuty }] : []),
      { label: '국민주택채권 매입 (즉시 환매 비용)', amount: bondCost },
      { label: '부동산 중개보수', amount: brokerFee },
      { label: '이사비 (추정)', amount: movingCost },
    ];

    const total = items.reduce((s, i) => s + i.amount, 0);
    const taxRate = calcBase1hRate(price, area);

    return { items, total, acquisitionTax, taxRate };
  }, [price, area, houseCount, isAdjusted, hasLoan, loanAmount]);

  const houseCounts: HouseCount[] = ['1주택', '2주택', '3주택이상'];

  return (
    <div className="space-y-6">
      <div style={{
        padding: '12px 18px', borderRadius: 12, fontSize: 12,
        background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e',
        display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
        <span>
          지방세법 기준 취득세와 부대 비용을 계산합니다. 법무사 수수료·이사비는 추정값이며,{' '}
          실제 비용과 다를 수 있습니다.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>
        {/* 입력 */}
        <div className="space-y-5">
          <Card title="주택 정보">
            <div className="space-y-4" style={{ marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>매매가</label>
                <input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} style={INPUT_H} step={10000000}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>면적 (㎡)</label>
                <input type="number" value={area} onChange={(e) => setArea(+e.target.value)} style={INPUT_H} step={1} min={1}/>
              </div>
            </div>
          </Card>

          <Card title="주택 수 / 지역">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 8 }}>
              {houseCounts.map((h) => (
                <button key={h} onClick={() => setHouseCount(h)}
                  style={{
                    padding: '10px 4px', borderRadius: 10, fontWeight: 700, fontSize: 12,
                    border: '1.5px solid',
                    background: houseCount === h ? '#6366f1' : 'transparent',
                    color: houseCount === h ? '#fff' : mutedColor,
                    borderColor: houseCount === h ? '#6366f1' : '#e5e5ea',
                    cursor: 'pointer',
                  }}>
                  {h}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: mutedColor }}>
                <input type="checkbox" checked={isAdjusted} onChange={(e) => setIsAdjusted(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}/>
                조정대상지역
              </label>
            </div>
          </Card>

          <Card title="대출 정보">
            <div style={{ marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: mutedColor, marginBottom: 16 }}>
                <input type="checkbox" checked={hasLoan} onChange={(e) => setHasLoan(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}/>
                대출 이용
              </label>
              {hasLoan && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>대출 금액</label>
                  <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(+e.target.value)} style={INPUT_H} step={10000000}/>
                </div>
              )}
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
            <p style={{ fontSize: 13, color: mutedColor, fontWeight: 700, marginBottom: 8 }}>총 취득 부대 비용</p>
            <p className="num" style={{ fontSize: 40, fontWeight: 900, color: '#6366f1', letterSpacing: '-0.03em', marginBottom: 4 }}>
              {fmt(result.total)}
            </p>
            <p style={{ fontSize: 12, color: mutedColor }}>
              매매가의 {((result.total / price) * 100).toFixed(2)}% 추가 비용
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <StatCard label="취득세" value={fmt(result.acquisitionTax)} color="#ef4444"/>
            <StatCard label="취득세율" value={`${(result.taxRate * 100).toFixed(0)}%`} color="#f59e0b"/>
          </div>

          <Card title="비용 항목별 내역">
            <div className="space-y-3" style={{ marginTop: 8, fontSize: 13 }}>
              {result.items.map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid #f2f2f7' }}>
                  <span style={{ color: mutedColor }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: '#1d1d1f' }}>{fmt(item.amount)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 14 }}>합계</span>
                <span style={{ fontWeight: 900, fontSize: 16, color: '#6366f1' }}>{fmt(result.total)}</span>
              </div>
            </div>
          </Card>

          <Card title="알아두세요 💡">
            <div className="space-y-3" style={{ marginTop: 8 }}>
              {[
                '2주택 조정지역 취득세 8%, 3주택 이상 조정지역 12%가 적용됩니다.',
                '85㎡ 초과 주택은 면적 무관 3% 기본세율이 적용됩니다.',
                '법무사 수수료는 사무소마다 다를 수 있으며 추정값입니다.',
                '국민주택채권은 취득 즉시 환매 시 약 3% 할인 손실이 발생합니다.',
                '취득세 외 지방교육세(10%)·농어촌특별세(20%)가 추가 부과됩니다.',
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
