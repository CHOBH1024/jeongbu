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

interface YearRow {
  year: number;
  jeonseNetCost: number;     // 전세 누적 순 비용
  buyNetCost: number;        // 매입 누적 순 비용 (자산 상승 포함)
  breakEven: boolean;
}

export const JeonseVsBuy = () => {
  const [jeonseDeposit, setJeonseDeposit] = useState(400000000);
  const [buyPrice, setBuyPrice] = useState(700000000);
  const [priceGrowthRate, setPriceGrowthRate] = useState(3);
  const [depositYield, setDepositYield] = useState(4);
  const [loanRate, setLoanRate] = useState(4.5);
  const [ltv, setLtv] = useState(70);

  const result = useMemo(() => {
    const loanAmount = buyPrice * ltv / 100;
    const downPayment = buyPrice - loanAmount;
    const annualLoanInterest = loanAmount * loanRate / 100;
    const annualHoldingTax = buyPrice * 0.0015; // 보유세 0.15%
    const annualManagement = 1200000; // 관리비 연 120만 추정

    const rows: YearRow[] = [];
    let jeonseNetCumul = 0;
    let buyNetCumul = 0;
    let breakEvenYear: number | null = null;
    let currentPrice = buyPrice;

    for (let y = 1; y <= 10; y++) {
      // 전세: 기회비용 = 전세보증금 × 운용수익률
      const jeonseOpportunityCost = jeonseDeposit * depositYield / 100;
      jeonseNetCumul += jeonseOpportunityCost;

      // 매입: 연 비용 = 대출이자 + 보유세 + 관리비
      const buyAnnualCost = annualLoanInterest + annualHoldingTax + annualManagement;
      // 집값 상승으로 인한 자산 증가
      currentPrice = currentPrice * (1 + priceGrowthRate / 100);
      const assetGain = currentPrice - buyPrice * Math.pow(1 + priceGrowthRate / 100, y - 1);
      buyNetCumul += buyAnnualCost - assetGain;

      const isBetterToBuy = buyNetCumul < jeonseNetCumul;
      if (breakEvenYear === null && isBetterToBuy) {
        breakEvenYear = y;
      }

      rows.push({
        year: y,
        jeonseNetCost: jeonseNetCumul,
        buyNetCost: buyNetCumul,
        breakEven: breakEvenYear === y,
      });
    }

    return {
      rows, breakEvenYear, loanAmount, downPayment,
      annualLoanInterest, annualHoldingTax,
    };
  }, [jeonseDeposit, buyPrice, priceGrowthRate, depositYield, loanRate, ltv]);

  return (
    <div className="space-y-6">
      <div style={{
        padding: '12px 18px', borderRadius: 12, fontSize: 12,
        background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e',
        display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
        <span>
          전세 기회비용과 매입 보유 비용을 비교해 <strong>몇 년째에 매입이 유리</strong>해지는지 시뮬레이션합니다.
          세금·수리비 등 세부 비용은 단순화되었으며 참고용입니다.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>
        {/* 입력 */}
        <div className="space-y-5">
          <Card title="전세 / 매매 정보">
            <div className="space-y-4" style={{ marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>전세보증금</label>
                <input type="number" value={jeonseDeposit} onChange={(e) => setJeonseDeposit(+e.target.value)} style={INPUT_H} step={10000000}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>매매가</label>
                <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(+e.target.value)} style={INPUT_H} step={10000000}/>
              </div>
            </div>
          </Card>

          <Card title="수익률 / 금리 가정">
            <div className="space-y-4" style={{ marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>예상 연 집값 상승률 (%)</label>
                <input type="number" value={priceGrowthRate} onChange={(e) => setPriceGrowthRate(+e.target.value)} style={INPUT_H} step={0.5} min={-10} max={30}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>전세금 운용 수익률 (%)</label>
                <input type="number" value={depositYield} onChange={(e) => setDepositYield(+e.target.value)} style={INPUT_H} step={0.5} min={0} max={20}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>대출 금리 (%)</label>
                <input type="number" value={loanRate} onChange={(e) => setLoanRate(+e.target.value)} style={INPUT_H} step={0.1} min={0} max={30}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>LTV 비율 (%)</label>
                <input type="number" value={ltv} onChange={(e) => setLtv(+e.target.value)} style={INPUT_H} step={5} min={0} max={100}/>
              </div>
            </div>
          </Card>
        </div>

        {/* 결과 */}
        <div className="space-y-5">
          <div style={{
            padding: '28px', borderRadius: 20, textAlign: 'center',
            background: result.breakEvenYear
              ? 'linear-gradient(135deg,#eef2ff,#fdf4ff)'
              : 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
            border: `1.5px solid ${result.breakEvenYear ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.3)'}`,
          }}>
            <p style={{ fontSize: 13, color: mutedColor, fontWeight: 700, marginBottom: 8 }}>손익분기점</p>
            {result.breakEvenYear ? (
              <>
                <p className="num" style={{ fontSize: 48, fontWeight: 900, color: '#6366f1', letterSpacing: '-0.03em' }}>
                  {result.breakEvenYear}년째
                </p>
                <p style={{ fontSize: 13, color: mutedColor, marginTop: 4 }}>이 시점부터 매입이 전세보다 유리</p>
              </>
            ) : (
              <>
                <p className="num" style={{ fontSize: 32, fontWeight: 900, color: '#10b981' }}>10년 내 전세 유리</p>
                <p style={{ fontSize: 13, color: mutedColor, marginTop: 4 }}>집값 상승률 대비 전세 기회비용이 더 낮음</p>
              </>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <StatCard label="필요 자기자금" value={fmt(result.downPayment)} color="#6366f1"/>
            <StatCard label="대출금" value={fmt(result.loanAmount)} color="#8b5cf6"/>
            <StatCard label="연 대출이자" value={fmt(result.annualLoanInterest)} color="#ef4444"/>
            <StatCard label="연 보유세 (추정)" value={fmt(result.annualHoldingTax)} color="#f59e0b"/>
          </div>

          <Card title="10년 시뮬레이션">
            <div style={{ marginTop: 8, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e5ea' }}>
                    {['년도', '전세 누적 비용', '매입 누적 순비용', '결과'].map((h) => (
                      <th key={h} style={{ padding: '8px 6px', textAlign: 'right', color: mutedColor, fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => {
                    const buyBetter = row.buyNetCost < row.jeonseNetCost;
                    return (
                      <tr key={row.year} style={{
                        borderBottom: '1px solid #f2f2f7',
                        background: row.breakEven ? '#eef2ff' : undefined,
                      }}>
                        <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: row.breakEven ? 800 : 500 }}>{row.year}년</td>
                        <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 600, color: '#6e6e73' }}>
                          {(row.jeonseNetCost / 1e4).toFixed(0)}만
                        </td>
                        <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 600, color: row.buyNetCost < 0 ? '#10b981' : '#ef4444' }}>
                          {(row.buyNetCost / 1e4).toFixed(0)}만
                        </td>
                        <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 700, color: buyBetter ? '#10b981' : '#6366f1' }}>
                          {row.breakEven ? '★ 분기점' : (buyBetter ? '매입' : '전세')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
