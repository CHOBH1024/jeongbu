import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { RATES_EFFECTIVE_DATE, INCOME_TAX_BRACKETS } from '../../data/rates';
import { Briefcase, Info, AlertTriangle } from 'lucide-react';

/* ── 퇴직소득세 계산 (소득세법 §48) ─────────────────────── */

/** 근속연수 공제 */
function tenureDeduction(years: number): number {
  const y = Math.max(1, Math.ceil(years));
  if (y <= 5)  return 300000 * y;
  if (y <= 10) return 1500000 + 500000 * (y - 5);
  if (y <= 20) return 4000000 + 800000 * (y - 10);
  return 12000000 + 1200000 * (y - 20);
}

/** 환산급여 공제 */
function incomeDeduction(annualized: number): number {
  if (annualized <=  8000000) return annualized;
  if (annualized <= 17000000) return  8000000 + (annualized -  8000000) * 0.60;
  if (annualized <= 30000000) return 13400000 + (annualized - 17000000) * 0.55;
  if (annualized <= 45000000) return 20550000 + (annualized - 30000000) * 0.45;
  if (annualized <= 87000000) return 27300000 + (annualized - 45000000) * 0.35;
  return 42000000 + (annualized - 87000000) * 0.25;
}

/** 종합소득세 누진세 */
function incomeTax(taxBase: number): number {
  for (const b of INCOME_TAX_BRACKETS) {
    if (taxBase <= b.max) return Math.max(0, taxBase * b.rate - b.deduct);
  }
  return 0;
}

/** 퇴직소득세 최종 계산 */
function severanceTax(severance: number, years: number): {
  tax: number; localTax: number; net: number;
  tenureDeductAmt: number; annualizedIncome: number; incomeDeductAmt: number;
} {
  const y = Math.max(1, Math.ceil(years));
  const tenureDeductAmt = tenureDeduction(y);
  const taxableIncome = Math.max(0, severance - tenureDeductAmt);
  const annualizedIncome = taxableIncome * 12 / y;      // 환산급여
  const incomeDeductAmt = incomeDeduction(annualizedIncome);
  const taxBase = Math.max(0, annualizedIncome - incomeDeductAmt);
  const annualTax = incomeTax(taxBase);
  const tax = Math.floor(annualTax * y / 12);           // 환산 산출세액
  const localTax = Math.floor(tax * 0.10);              // 지방소득세 10%
  return { tax, localTax, net: severance - tax - localTax, tenureDeductAmt, annualizedIncome, incomeDeductAmt };
}

/* ── 컴포넌트 ─────────────────────────────────────────────── */

const INPUT_H: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: '#f9f9fb', border: '1.5px solid #e5e5ea',
  borderRadius: 10, fontSize: 14, color: '#1d1d1f',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};

type WorkType = 'full' | 'parttime';

export const SeveranceCalculator = () => {
  const [workType, setWorkType]       = useState<WorkType>('full');
  const [avgSalary, setAvgSalary]     = useState(3500000);   // 직전 3개월 평균 월급
  const [bonus, setBonus]             = useState(2000000);    // 연간 상여금 합계
  const [vacationPay, setVacationPay] = useState(0);          // 연차수당 (퇴직 전 1년)
  const [startDate, setStartDate]     = useState('2020-01-01');
  const [endDate, setEndDate]         = useState(new Date().toISOString().split('T')[0]);
  const [weeklyHours, setWeeklyHours] = useState(15);         // 단시간용

  const result = useMemo(() => {
    const s = new Date(startDate), e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || e <= s) return null;

    const totalDays = Math.floor((e.getTime() - s.getTime()) / 86400000);
    const years = totalDays / 365;

    if (years < 1) return { error: '퇴직금은 1년 이상 재직 시 발생합니다 (근로기준법 §34)' };

    /* 1일 평균임금 계산
       = (직전 3개월 급여 합계 + 상여금 × 3/12 + 연차수당 × 3/12) / 직전 3개월 일수(91일 고정 원칙)
    */
    const last3MonthsWage  = avgSalary * 3;
    const bonusPortion     = bonus * (3 / 12);
    const vacationPortion  = vacationPay * (3 / 12);
    const totalWage3m      = last3MonthsWage + bonusPortion + vacationPortion;
    const avgDailyWage     = totalWage3m / 91;

    /* 단시간 근로자 보정 (주 소정근로시간 기준) */
    const ratio = workType === 'parttime' ? Math.min(weeklyHours / 40, 1) : 1;

    /* 퇴직금 = 1일 평균임금 × 30 × (재직일수 / 365) */
    const severance = Math.floor(avgDailyWage * ratio * 30 * (totalDays / 365));

    const { tax, localTax, net, tenureDeductAmt, annualizedIncome, incomeDeductAmt } = severanceTax(severance, years);

    return {
      totalDays, years: Math.floor(years),
      avgDailyWage: Math.floor(avgDailyWage * ratio),
      severance, tax, localTax, net,
      tenureDeductAmt, annualizedIncome, incomeDeductAmt,
    };
  }, [workType, avgSalary, bonus, vacationPay, startDate, endDate, weeklyHours]);

  const fmt = (n: number) => '₩' + n.toLocaleString('ko-KR');
  const mutedColor = '#6e6e73';
  const dangerColor = '#ef4444';

  return (
    <div className="space-y-6">

      {/* 상단 안내 */}
      <div style={{
        padding: '12px 18px', borderRadius: 12, fontSize: 12,
        background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e',
        display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
        <span>
          <strong>{RATES_EFFECTIVE_DATE}</strong> 기준 &middot; 근로기준법 §34, 소득세법 §48 적용 &middot; 결과는 참고용이며 실제와 차이가 있을 수 있습니다.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>

        {/* 입력 */}
        <div className="space-y-5">
          <Card title="근무 형태" icon={<Briefcase size={18}/>}>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {(['full','parttime'] as const).map((t) => (
                <button key={t} onClick={() => setWorkType(t)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 10, fontWeight: 700, fontSize: 13,
                    border: '1.5px solid',
                    background: workType === t ? '#6366f1' : 'transparent',
                    color:      workType === t ? '#fff'    : '#6e6e73',
                    borderColor: workType === t ? '#6366f1' : '#e5e5ea',
                    cursor: 'pointer',
                  }}>
                  {t === 'full' ? '🏢 정규직 / 일반' : '⏰ 단시간 근로자'}
                </button>
              ))}
            </div>
          </Card>

          <Card title="재직 기간">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
              {[
                { label: '입사일', val: startDate, set: setStartDate },
                { label: '퇴직일', val: endDate,   set: setEndDate },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>{label}</label>
                  <input type="date" value={val} onChange={(e) => set(e.target.value)} style={INPUT_H}/>
                </div>
              ))}
            </div>
          </Card>

          <Card title="임금 정보">
            <div className="space-y-4" style={{ marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                  직전 3개월 평균 월급 <span style={{ color: '#aeaeb2', fontWeight: 400 }}>(세전, 수당 포함)</span>
                </label>
                <input type="number" value={avgSalary} onChange={(e) => setAvgSalary(+e.target.value)} style={INPUT_H} step={100000}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                  연간 상여금 합계 <span style={{ color: '#aeaeb2', fontWeight: 400 }}>(1년 치 합산, 없으면 0)</span>
                </label>
                <input type="number" value={bonus} onChange={(e) => setBonus(+e.target.value)} style={INPUT_H} step={100000}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                  퇴직 전 1년간 연차수당 <span style={{ color: '#aeaeb2', fontWeight: 400 }}>(사용 못한 연차 × 일급, 없으면 0)</span>
                </label>
                <input type="number" value={vacationPay} onChange={(e) => setVacationPay(+e.target.value)} style={INPUT_H} step={100000}/>
              </div>
              {workType === 'parttime' && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                    주 소정근로시간 <span style={{ color: '#aeaeb2', fontWeight: 400 }}>(최대 40시간)</span>
                  </label>
                  <input type="number" min={1} max={40} value={weeklyHours} onChange={(e) => setWeeklyHours(+e.target.value)} style={INPUT_H}/>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* 결과 */}
        <div className="space-y-5">
          {result && 'error' in result ? (
            <div style={{
              padding: '24px', borderRadius: 16,
              background: '#fef2f2', border: '1.5px solid #fca5a5',
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <AlertTriangle size={20} color={dangerColor} style={{ flexShrink: 0 }}/>
              <div>
                <p style={{ fontWeight: 800, color: dangerColor, marginBottom: 4 }}>퇴직금 미발생</p>
                <p style={{ fontSize: 13, color: '#b91c1c' }}>{result.error}</p>
              </div>
            </div>
          ) : result ? (
            <>
              {/* 핵심 결과 */}
              <div style={{
                padding: '28px', borderRadius: 20,
                background: 'linear-gradient(135deg,#eef2ff,#fdf4ff)',
                border: '1.5px solid rgba(99,102,241,0.2)',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: 13, color: mutedColor, fontWeight: 700, marginBottom: 8 }}>예상 퇴직금 (세전)</p>
                <p className="num" style={{ fontSize: 36, fontWeight: 900, color: '#6366f1', letterSpacing: '-0.03em', marginBottom: 4 }}>
                  {fmt(result.severance)}
                </p>
                <p style={{ fontSize: 12, color: mutedColor }}>
                  재직 {result.totalDays.toLocaleString()}일 ({result.years}년 {Math.floor((result.totalDays % 365) / 30)}개월)
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <StatCard label="1일 평균임금" value={fmt(result.avgDailyWage)} color="#6366f1"/>
                <StatCard label="실수령액 (세후)" value={fmt(result.net)} color="#10b981"/>
                <StatCard label="퇴직소득세" value={fmt(result.tax)} color="#ef4444"/>
                <StatCard label="지방소득세 (10%)" value={fmt(result.localTax)} color="#f59e0b"/>
              </div>

              {/* 세금 계산 근거 */}
              <Card title="세금 계산 근거 (소득세법 §48)">
                <div className="space-y-3" style={{ marginTop: 8, fontSize: 13, color: mutedColor }}>
                  {[
                    ['① 퇴직소득', fmt(result.severance)],
                    ['② 근속연수 공제', `-${fmt(result.tenureDeductAmt)}`],
                    ['③ 환산급여 (×12/근속)', fmt(result.annualizedIncome)],
                    ['④ 환산급여 공제', `-${fmt(result.incomeDeductAmt)}`],
                    ['⑤ 세율 적용 산출세액', fmt(result.tax)],
                    ['⑥ 지방소득세', fmt(result.localTax)],
                  ].map(([k, v]) => (
                    <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f2f2f7' }}>
                      <span>{k as string}</span><span style={{ fontWeight: 700, color: '#1d1d1f' }}>{v as string}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: mutedColor, fontSize: 14 }}>
              입사일과 퇴직일을 입력하면 계산됩니다
            </div>
          )}

          {/* 알아두세요 */}
          <Card title="알아두세요 💡">
            <div className="space-y-3" style={{ marginTop: 8 }}>
              {[
                '근속 1년 미만이면 퇴직금이 발생하지 않습니다.',
                '상여금은 1년치를 입력하세요. 퇴직 전 12개월 이내 지급분을 3/12로 환산해 평균임금에 포함합니다.',
                '퇴직연금(DC형)은 회사가 납입하는 방식이므로 이 계산기와 다를 수 있습니다.',
                '임원, 계약직, 일용직 등은 별도 규정이 적용될 수 있습니다.',
                '세금 계산은 2025년 세법 기준이며 실제 환경에 따라 달라질 수 있습니다.',
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
