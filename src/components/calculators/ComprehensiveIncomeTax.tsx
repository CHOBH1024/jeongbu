import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { RATES_EFFECTIVE_DATE, INCOME_TAX_BRACKETS } from '../../data/rates';
import { Calculator, Info } from 'lucide-react';

/* ── 종합소득세 계산 로직 ─────────────────────────────────── */

/** 근로소득공제 (소득세법 §47) */
function laborIncomeDeduction(salary: number): number {
  if (salary <= 5000000)    return Math.floor(salary * 0.70);
  if (salary <= 15000000)   return Math.floor(1500000  + (salary - 5000000)  * 0.40);
  if (salary <= 45000000)   return Math.floor(5500000  + (salary - 15000000) * 0.15);
  if (salary <= 100000000)  return Math.floor(10000000 + (salary - 45000000) * 0.05); // 1억 이하 (1275만 오류→수정)
  return Math.min(Math.floor(12750000 + (salary - 100000000) * 0.02), 20000000);
}

/** 종합소득세 누진세 */
function incomeTax(taxBase: number): number {
  for (const b of INCOME_TAX_BRACKETS) {
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

export const ComprehensiveIncomeTax = () => {
  const [laborIncome, setLaborIncome]         = useState(50000000);
  const [businessIncome, setBusinessIncome]   = useState(0);
  const [interestIncome, setInterestIncome]   = useState(0);
  const [otherIncome, setOtherIncome]         = useState(0);
  const [pensionContrib, setPensionContrib]   = useState(0);
  const [dependents, setDependents]           = useState(0);

  const result = useMemo(() => {
    const totalGross = laborIncome + businessIncome + interestIncome + otherIncome;
    if (totalGross <= 0) return null;

    // 근로소득공제
    const laborDeduction = laborIncomeDeduction(laborIncome);

    // 종합소득금액
    const totalIncome = Math.max(0, laborIncome - laborDeduction) + businessIncome + interestIncome + otherIncome;

    // 인적공제: 본인 150만 + 부양가족 × 150만
    const personalDeduction = 1500000 + dependents * 1500000;

    // 소득공제 합계
    const totalDeduction = personalDeduction;

    // 과세표준
    const taxBase = Math.max(0, totalIncome - totalDeduction);

    // 산출세액
    const grossTax = incomeTax(taxBase);

    // 연금저축 세액공제
    // 총급여 5500만 이하 → 16.5%, 초과 → 13.2%
    const pensionTaxCredit = laborIncome <= 55000000
      ? Math.floor(Math.min(pensionContrib, 9000000) * 0.165)
      : Math.floor(Math.min(pensionContrib, 9000000) * 0.132);

    // 최종 산출세액
    const netTax = Math.max(0, grossTax - pensionTaxCredit);
    const localTax = Math.floor(netTax * 0.10);
    const finalTax = netTax + localTax;

    return {
      totalGross,
      laborDeduction,
      totalIncome,
      personalDeduction,
      totalDeduction,
      taxBase,
      grossTax,
      pensionTaxCredit,
      netTax,
      localTax,
      finalTax,
    };
  }, [laborIncome, businessIncome, interestIncome, otherIncome, pensionContrib, dependents]);

  const fmt = (n: number) => '₩' + n.toLocaleString('ko-KR');

  const incomeFields = [
    { label: '근로소득 (연간 세전, 원)', value: laborIncome, set: setLaborIncome },
    { label: '사업소득 순이익 (연간, 원)', value: businessIncome, set: setBusinessIncome },
    { label: '이자·배당소득 (연간, 원)', value: interestIncome, set: setInterestIncome },
    { label: '기타소득 (연간, 원)', value: otherIncome, set: setOtherIncome },
  ];

  return (
    <div className="space-y-6">
      <div style={{
        padding: '12px 18px', borderRadius: 12, fontSize: 12,
        background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e',
        display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong>{RATES_EFFECTIVE_DATE}</strong> 기준 &middot; 소득세법 §47·§55 적용 &middot; 단순 추정치이며 실제 신고와 다를 수 있습니다.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>
        {/* 입력 */}
        <div className="space-y-5">
          <Card title="소득 정보" icon={<Calculator size={18} />}>
            <div className="space-y-4" style={{ marginTop: 8 }}>
              {incomeFields.map(({ label, value, set }) => (
                <div key={label}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>{label}</label>
                  <input type="number" value={value} onChange={e => set(+e.target.value)} style={INPUT_H} step={1000000} min={0} />
                </div>
              ))}
            </div>
          </Card>

          <Card title="공제 정보">
            <div className="space-y-4" style={{ marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                  연금저축 + IRP 납입액 (원)
                  <span style={{ color: '#aeaeb2', fontWeight: 400, marginLeft: 4 }}>세액공제 연 900만 한도</span>
                </label>
                <input type="number" value={pensionContrib} onChange={e => setPensionContrib(+e.target.value)} style={INPUT_H} step={100000} min={0} max={9000000} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                  부양가족 수 (본인 제외)
                </label>
                <input type="number" value={dependents} onChange={e => setDependents(+e.target.value)} style={INPUT_H} step={1} min={0} max={20} />
              </div>
            </div>
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
                <p style={{ fontSize: 13, color: mutedColor, fontWeight: 700, marginBottom: 8 }}>예상 종합소득세 (소득세+지방세)</p>
                <p className="num" style={{ fontSize: 36, fontWeight: 900, color: '#6366f1', letterSpacing: '-0.03em', marginBottom: 4 }}>
                  {fmt(result.finalTax)}
                </p>
                <p style={{ fontSize: 12, color: mutedColor }}>
                  소득세 {fmt(result.netTax)} + 지방소득세 {fmt(result.localTax)}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <StatCard label="종합소득금액" value={fmt(result.totalIncome)} color="#6366f1" />
                <StatCard label="과세표준" value={fmt(result.taxBase)} color="#8b5cf6" />
                <StatCard label="산출세액" value={fmt(result.grossTax)} color="#ef4444" />
                <StatCard label="연금저축 세액공제" value={`-${fmt(result.pensionTaxCredit)}`} color="#10b981" />
              </div>

              <Card title="세금 계산 근거">
                <div className="space-y-3" style={{ marginTop: 8, fontSize: 13, color: mutedColor }}>
                  {[
                    ['① 총 소득 합산', fmt(result.totalGross)],
                    ['② 근로소득공제', `-${fmt(result.laborDeduction)}`],
                    ['③ 종합소득금액', fmt(result.totalIncome)],
                    ['④ 인적공제 (본인+부양가족)', `-${fmt(result.personalDeduction)}`],
                    ['⑤ 과세표준', fmt(result.taxBase)],
                    ['⑥ 산출세액 (6~45%)', fmt(result.grossTax)],
                    ['⑦ 연금저축 세액공제', `-${fmt(result.pensionTaxCredit)}`],
                    ['⑧ 소득세', fmt(result.netTax)],
                    ['⑨ 지방소득세 (10%)', fmt(result.localTax)],
                    ['⑩ 최종 납부세액', fmt(result.finalTax)],
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
              소득 정보를 입력하면 계산됩니다
            </div>
          )}

          <Card title="알아두세요 💡">
            <div className="space-y-3" style={{ marginTop: 8 }}>
              {[
                '사업소득은 필요경비를 제외한 순이익을 입력하세요. 장부 기장이 있다면 실제 신고액과 다를 수 있습니다.',
                '이자·배당소득이 2천만 원 초과 시 금융소득 종합과세가 적용됩니다.',
                '연금저축(IRP 포함) 세액공제는 연 최대 900만 원 납입분까지 적용됩니다.',
                '총급여 5,500만 원 이하는 세액공제율 16.5%, 초과 시 13.2%가 적용됩니다.',
                '이 계산기는 기본 공제·감면만 반영합니다. 교육비·의료비 등 추가 공제는 별도입니다.',
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
