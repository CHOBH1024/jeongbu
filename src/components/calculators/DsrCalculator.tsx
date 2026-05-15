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

/** 원리금균등 월상환액 */
function calcMonthlyPayment(principal: number, annualRate: number, years: number): number {
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/** DSR 한도 기반 최대 대출 역산 */
function calcMaxLoan(annualIncome: number, existingMonthly: number, annualRate: number, years: number, dsrLimit: number): number {
  const availableMonthly = (annualIncome * dsrLimit / 100 / 12) - existingMonthly;
  if (availableMonthly <= 0) return 0;
  if (annualRate === 0) return availableMonthly * years * 12;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (availableMonthly * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
}

type FinanceType = '1금융권' | '2금융권';

export const DsrCalculator = () => {
  const [annualIncome, setAnnualIncome] = useState(60000000);
  const [existingMonthly, setExistingMonthly] = useState(0);
  const [loanAmount, setLoanAmount] = useState(300000000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanYears, setLoanYears] = useState(30);
  const [financeType, setFinanceType] = useState<FinanceType>('1금융권');

  const result = useMemo(() => {
    if (annualIncome <= 0) return null;
    const dsrLimit = financeType === '1금융권' ? 40 : 50;
    const newMonthly = loanAmount > 0 ? calcMonthlyPayment(loanAmount, interestRate, loanYears) : 0;
    const totalMonthly = existingMonthly + newMonthly;
    const dsr = (totalMonthly * 12 / annualIncome) * 100;
    const passed = dsr <= dsrLimit;
    const maxLoan = calcMaxLoan(annualIncome, existingMonthly, interestRate, loanYears, dsrLimit);
    const additionalLoan = Math.max(0, maxLoan - loanAmount);
    return { dsr, passed, dsrLimit, newMonthly, totalMonthly, maxLoan, additionalLoan };
  }, [annualIncome, existingMonthly, loanAmount, interestRate, loanYears, financeType]);

  return (
    <div className="space-y-6">
      <div style={{
        padding: '12px 18px', borderRadius: 12, fontSize: 12,
        background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e',
        display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
        <span>
          <strong>DSR(총부채원리금상환비율)</strong> = (연간 원리금 상환액 ÷ 연 소득) × 100 &middot; 1금융권 40%, 2금융권 50% 한도 적용 &middot; 결과는 참고용입니다.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>
        {/* 입력 */}
        <div className="space-y-5">
          <Card title="금융권 구분">
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {(['1금융권', '2금융권'] as const).map((t) => (
                <button key={t} onClick={() => setFinanceType(t)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 10, fontWeight: 700, fontSize: 13,
                    border: '1.5px solid',
                    background: financeType === t ? '#6366f1' : 'transparent',
                    color: financeType === t ? '#fff' : mutedColor,
                    borderColor: financeType === t ? '#6366f1' : '#e5e5ea',
                    cursor: 'pointer',
                  }}>
                  {t} (DSR {t === '1금융권' ? '40%' : '50%'})
                </button>
              ))}
            </div>
          </Card>

          <Card title="소득 정보">
            <div className="space-y-4" style={{ marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>연 소득 (세전)</label>
                <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(+e.target.value)} style={INPUT_H} step={1000000}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>기존 대출 월 상환액 합계</label>
                <input type="number" value={existingMonthly} onChange={(e) => setExistingMonthly(+e.target.value)} style={INPUT_H} step={100000}/>
              </div>
            </div>
          </Card>

          <Card title="신규 대출 정보">
            <div className="space-y-4" style={{ marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>신규 대출 금액</label>
                <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(+e.target.value)} style={INPUT_H} step={10000000}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>대출 금리 (%)</label>
                <input type="number" value={interestRate} onChange={(e) => setInterestRate(+e.target.value)} style={INPUT_H} step={0.1} min={0} max={30}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>대출 기간 (년)</label>
                <input type="number" value={loanYears} onChange={(e) => setLoanYears(+e.target.value)} style={INPUT_H} step={1} min={1} max={50}/>
              </div>
            </div>
          </Card>
        </div>

        {/* 결과 */}
        <div className="space-y-5">
          {result ? (
            <>
              <div style={{
                padding: '28px', borderRadius: 20, textAlign: 'center',
                background: result.passed
                  ? 'linear-gradient(135deg,#f0fdf4,#dcfce7)'
                  : 'linear-gradient(135deg,#fef2f2,#fee2e2)',
                border: `1.5px solid ${result.passed ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}>
                <p style={{ fontSize: 13, color: mutedColor, fontWeight: 700, marginBottom: 8 }}>나의 DSR</p>
                <p className="num" style={{ fontSize: 48, fontWeight: 900, color: result.passed ? '#10b981' : '#ef4444', letterSpacing: '-0.03em', marginBottom: 4 }}>
                  {result.dsr.toFixed(1)}%
                </p>
                <p style={{ fontSize: 14, fontWeight: 700, color: result.passed ? '#10b981' : '#ef4444' }}>
                  {result.passed ? `DSR ${result.dsrLimit}% 이하 — 통과` : `DSR ${result.dsrLimit}% 초과 — 대출 제한`}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <StatCard label="신규 월 상환액" value={fmt(result.newMonthly)} color="#6366f1"/>
                <StatCard label="총 월 상환액" value={fmt(result.totalMonthly)} color="#8b5cf6"/>
                <StatCard label="최대 대출 가능" value={fmt(result.maxLoan)} color="#10b981"/>
                <StatCard label="추가 가능 대출" value={fmt(result.additionalLoan)} color="#f59e0b"/>
              </div>

              <Card title="DSR 계산 근거">
                <div className="space-y-3" style={{ marginTop: 8, fontSize: 13, color: mutedColor }}>
                  {[
                    ['연 소득', fmt(annualIncome)],
                    ['기존 대출 월 상환', fmt(existingMonthly)],
                    ['신규 대출 월 상환 (원리금균등)', fmt(result.newMonthly)],
                    ['총 월 상환액', fmt(result.totalMonthly)],
                    ['연간 상환액 (×12)', fmt(result.totalMonthly * 12)],
                    [`DSR 한도 (${financeType})`, `${result.dsrLimit}%`],
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
              연 소득을 입력하면 계산됩니다
            </div>
          )}

          <Card title="알아두세요 💡">
            <div className="space-y-3" style={{ marginTop: 8 }}>
              {[
                'DSR = (연간 원리금 상환액 ÷ 연 소득) × 100으로 계산됩니다.',
                '1금융권(은행)은 40%, 2금융권(저축은행·캐피탈)은 50%가 상한입니다.',
                '전세자금대출, 카드론 등 일부 대출은 DSR 산정에서 제외될 수 있습니다.',
                '실제 금융기관 심사 결과와 다를 수 있으며 참고용으로만 활용하세요.',
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
