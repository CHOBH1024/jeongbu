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

type RentalMode = '전세' | '월세';

export const RentalYield = () => {
  const [buyPrice, setBuyPrice] = useState(700000000);
  const [rentalMode, setRentalMode] = useState<RentalMode>('월세');
  const [jeonseDeposit, setJeonseDeposit] = useState(400000000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(50000000);
  const [monthlyRent, setMonthlyRent] = useState(1000000);
  const [annualExpense, setAnnualExpense] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanRate, setLoanRate] = useState(4.5);
  const [vacancyRate, setVacancyRate] = useState(5);

  const result = useMemo(() => {
    if (buyPrice <= 0) return null;

    const deposit = rentalMode === '전세' ? jeonseDeposit : monthlyDeposit;
    const gapInvestment = Math.max(0, buyPrice - deposit - loanAmount);
    const totalInvestment = Math.max(gapInvestment, 1);

    // 연 임대수익
    const annualRentIncome = rentalMode === '전세'
      ? jeonseDeposit * 0.04  // 전세: 보증금 운용 가정 (4%)
      : monthlyRent * 12 * (1 - vacancyRate / 100);

    // 연 비용
    const annualLoanInterest = loanAmount * loanRate / 100;
    const totalAnnualCost = annualExpense + annualLoanInterest;

    // 순수익
    const netProfit = annualRentIncome - totalAnnualCost;

    // 수익률
    const yieldOnGap = (netProfit / totalInvestment) * 100;
    const yieldOnPrice = (netProfit / buyPrice) * 100;

    return {
      gapInvestment,
      annualRentIncome,
      totalAnnualCost,
      netProfit,
      yieldOnGap,
      yieldOnPrice,
      annualLoanInterest,
    };
  }, [buyPrice, rentalMode, jeonseDeposit, monthlyDeposit, monthlyRent, annualExpense, loanAmount, loanRate, vacancyRate]);

  return (
    <div className="space-y-6">
      <div style={{
        padding: '12px 18px', borderRadius: 12, fontSize: 12,
        background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e',
        display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
        <span>
          갭투자 실투자금 대비 임대수익률과 매매가 대비 수익률을 함께 보여줍니다.
          전세는 보증금 운용수익(4% 가정)으로 환산합니다.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>
        {/* 입력 */}
        <div className="space-y-5">
          <Card title="임대 유형">
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {(['전세', '월세'] as const).map((t) => (
                <button key={t} onClick={() => setRentalMode(t)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 10, fontWeight: 700, fontSize: 13,
                    border: '1.5px solid',
                    background: rentalMode === t ? '#6366f1' : 'transparent',
                    color: rentalMode === t ? '#fff' : mutedColor,
                    borderColor: rentalMode === t ? '#6366f1' : '#e5e5ea',
                    cursor: 'pointer',
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </Card>

          <Card title="매물 / 임대 정보">
            <div className="space-y-4" style={{ marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>매매가</label>
                <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(+e.target.value)} style={INPUT_H} step={10000000}/>
              </div>

              {rentalMode === '전세' ? (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>전세보증금</label>
                  <input type="number" value={jeonseDeposit} onChange={(e) => setJeonseDeposit(+e.target.value)} style={INPUT_H} step={10000000}/>
                </div>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>보증금</label>
                    <input type="number" value={monthlyDeposit} onChange={(e) => setMonthlyDeposit(+e.target.value)} style={INPUT_H} step={5000000}/>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>월세</label>
                    <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(+e.target.value)} style={INPUT_H} step={100000}/>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>공실률 (%)</label>
                    <input type="number" value={vacancyRate} onChange={(e) => setVacancyRate(+e.target.value)} style={INPUT_H} step={1} min={0} max={100}/>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card title="비용 / 대출 정보">
            <div className="space-y-4" style={{ marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>연간 관리비·세금 <span style={{ color: '#aeaeb2', fontWeight: 400 }}>(없으면 0)</span></label>
                <input type="number" value={annualExpense} onChange={(e) => setAnnualExpense(+e.target.value)} style={INPUT_H} step={100000}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>대출 금액 <span style={{ color: '#aeaeb2', fontWeight: 400 }}>(없으면 0)</span></label>
                <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(+e.target.value)} style={INPUT_H} step={10000000}/>
              </div>
              {loanAmount > 0 && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>대출 금리 (%)</label>
                  <input type="number" value={loanRate} onChange={(e) => setLoanRate(+e.target.value)} style={INPUT_H} step={0.1} min={0} max={30}/>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* 결과 */}
        <div className="space-y-5">
          {result ? (
            <>
              <div style={{
                padding: '28px', borderRadius: 20, textAlign: 'center',
                background: result.yieldOnGap >= 0
                  ? 'linear-gradient(135deg,#eef2ff,#fdf4ff)'
                  : 'linear-gradient(135deg,#fef2f2,#fee2e2)',
                border: `1.5px solid ${result.yieldOnGap >= 0 ? 'rgba(99,102,241,0.2)' : 'rgba(239,68,68,0.3)'}`,
              }}>
                <p style={{ fontSize: 13, color: mutedColor, fontWeight: 700, marginBottom: 8 }}>실투자금 대비 수익률</p>
                <p className="num" style={{ fontSize: 48, fontWeight: 900, color: result.yieldOnGap >= 0 ? '#6366f1' : '#ef4444', letterSpacing: '-0.03em', marginBottom: 4 }}>
                  {result.yieldOnGap.toFixed(2)}%
                </p>
                <p style={{ fontSize: 12, color: mutedColor }}>
                  매매가 대비 수익률: {result.yieldOnPrice.toFixed(2)}%
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <StatCard label="실투자금 (갭)" value={fmt(result.gapInvestment)} color="#6366f1"/>
                <StatCard label="연 임대수익" value={fmt(result.annualRentIncome)} color="#10b981"/>
                <StatCard label="연 총 비용" value={fmt(result.totalAnnualCost)} color="#ef4444"/>
                <StatCard label="연 순수익" value={fmt(result.netProfit)} color={result.netProfit >= 0 ? '#10b981' : '#ef4444'}/>
              </div>

              <Card title="수익률 계산 근거">
                <div className="space-y-3" style={{ marginTop: 8, fontSize: 13, color: mutedColor }}>
                  {[
                    ['매매가', fmt(buyPrice)],
                    ['임대 보증금', fmt(rentalMode === '전세' ? jeonseDeposit : monthlyDeposit)],
                    ['대출금', fmt(loanAmount)],
                    ['실투자금 (갭)', fmt(result.gapInvestment)],
                    ['연 임대수익', fmt(result.annualRentIncome)],
                    ['연 대출이자', fmt(result.annualLoanInterest)],
                    ['연 관리·세금', fmt(annualExpense)],
                    ['연 순수익', fmt(result.netProfit)],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f2f2f7' }}>
                      <span>{k}</span><span style={{ fontWeight: 700, color: '#1d1d1f' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: mutedColor, fontSize: 14 }}>
              매매가를 입력하면 계산됩니다
            </div>
          )}

          <Card title="알아두세요 💡">
            <div className="space-y-3" style={{ marginTop: 8 }}>
              {[
                '실투자금(갭)은 매매가에서 임대보증금과 대출금을 뺀 금액입니다.',
                '전세의 경우 보증금 운용수익을 연 4%로 가정해 임대수익을 계산합니다.',
                '공실률은 실제 임대 공백 기간을 감안한 수치로, 기본 5%를 권장합니다.',
                '임대소득세, 건강보험료 등 추가 세금 부담은 포함되지 않습니다.',
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
