import { useState, useMemo } from 'react';
import { Card, StatCard, Input } from '../ui/Base';
import { Wallet, TrendingDown, DollarSign, Info } from 'lucide-react';

function fmt(n: number) {
  return Math.round(n).toLocaleString('ko-KR') + '원';
}

/**
 * 월 소득세 간이세액표 근사 계산
 * 부양가족 1인당 연 150만 원 소득공제 근사 적용 (월 125,000원 차감).
 * 정확한 세액은 국세청 간이세액표를 기준으로 합니다.
 */
function calcIncomeTax(taxable: number, dependents: number): number {
  // 부양가족 공제: 1인당 연 150만 원 → 월 125,000원 차감 (근사치)
  const depDeductMonthly = (dependents - 1) * 125_000;
  const adjusted = Math.max(0, taxable - depDeductMonthly);
  if (adjusted <= 1_500_000) return 0;
  let rate = 0;
  if (adjusted <= 3_500_000) rate = 0.06;
  else if (adjusted <= 8_500_000) rate = 0.15;
  else rate = 0.24;
  return adjusted * rate;
}

export function NetSalary() {
  const [monthlyGross, setMonthlyGross] = useState(3_500_000);
  const [dependents, setDependents] = useState(1);
  const [mealNonTax, setMealNonTax] = useState(200_000);       // 식대 비과세 (월)
  const [carNonTax, setCarNonTax] = useState(200_000);         // 차량유지비 비과세 (월)
  const [childcareNonTax, setChildcareNonTax] = useState(0);   // 육아수당 비과세 (월)

  const result = useMemo(() => {
    const gross = monthlyGross;
    const totalNonTax = mealNonTax + carNonTax + childcareNonTax;
    const pension = Math.round(gross * 0.045);
    const health = Math.round(gross * 0.03545);
    const ltc = Math.round(health * 0.1281);
    const employment = Math.round(gross * 0.009);
    const taxable = Math.max(0, gross - totalNonTax);
    const incomeTax = Math.round(calcIncomeTax(taxable, dependents));
    const localTax = Math.round(incomeTax * 0.1);
    const totalDeduction = pension + health + ltc + employment + incomeTax + localTax;
    const netSalary = gross - totalDeduction;
    return { pension, health, ltc, employment, incomeTax, localTax, totalDeduction, netSalary, totalNonTax };
  }, [monthlyGross, dependents, mealNonTax, carNonTax, childcareNonTax]);

  const deductionPct = Math.round((result.totalDeduction / monthlyGross) * 100);
  const netPct = 100 - deductionPct;

  const barSegments = [
    { label: '국민연금', value: result.pension, color: '#6366f1' },
    { label: '건강보험', value: result.health, color: '#8b5cf6' },
    { label: '장기요양', value: result.ltc, color: '#a78bfa' },
    { label: '고용보험', value: result.employment, color: '#c4b5fd' },
    { label: '소득세', value: result.incomeTax, color: '#f59e0b' },
    { label: '지방소득세', value: result.localTax, color: '#fbbf24' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Inputs */}
      <Card title="급여 정보 입력" icon={<Wallet size={18} />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <Input
            label="월 급여 (세전)"
            type="number"
            min={0}
            step={100000}
            value={monthlyGross}
            unit="원"
            onChange={(e) => setMonthlyGross(Number(e.target.value))}
          />
          <Input
            label="부양가족 수 (본인 포함)"
            type="number"
            min={1}
            max={11}
            value={dependents}
            unit="명"
            onChange={(e) => setDependents(Math.min(11, Math.max(1, Number(e.target.value))))}
          />
          <Input
            label="식대 비과세 (월)"
            type="number"
            min={0}
            max={200000}
            step={10000}
            value={mealNonTax}
            unit="원"
            onChange={(e) => setMealNonTax(Number(e.target.value))}
          />
          <Input
            label="차량유지비 비과세 (월)"
            type="number"
            min={0}
            max={200000}
            step={10000}
            value={carNonTax}
            unit="원"
            onChange={(e) => setCarNonTax(Number(e.target.value))}
          />
          <Input
            label="육아수당 비과세 (월)"
            type="number"
            min={0}
            step={10000}
            value={childcareNonTax}
            unit="원"
            onChange={(e) => setChildcareNonTax(Number(e.target.value))}
          />
        </div>
      </Card>

      {/* Key Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <StatCard
          label="월 급여 (세전)"
          value={fmt(monthlyGross)}
          sub="총 지급액"
          color="#6366f1"
          icon={<DollarSign size={18} />}
        />
        <StatCard
          label="총 공제액"
          value={fmt(result.totalDeduction)}
          sub={`공제율 ${deductionPct}%`}
          color="#ef4444"
          icon={<TrendingDown size={18} />}
        />
        <StatCard
          label="실수령액"
          value={fmt(result.netSalary)}
          sub={`수령률 ${netPct}%`}
          color="#10b981"
          icon={<Wallet size={18} />}
        />
      </div>

      {/* Visual Bar */}
      <Card title="급여 구성 시각화" icon={<TrendingDown size={18} />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Bar */}
          <div style={{ display: 'flex', height: 36, borderRadius: 10, overflow: 'hidden', gap: 2 }}>
            <div style={{
              flex: result.netSalary,
              background: 'linear-gradient(90deg, #10b981, #34d399)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff', minWidth: 0,
            }}>
              실수령 {netPct}%
            </div>
            {barSegments.map((seg) => (
              seg.value > 0 ? (
                <div key={seg.label} style={{
                  flex: seg.value,
                  background: seg.color,
                  minWidth: 2,
                }} title={`${seg.label}: ${fmt(seg.value)}`} />
              ) : null
            ))}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: '#10b981' }} />
              <span style={{ fontSize: 12, color: '#6e6e73' }}>실수령액</span>
            </div>
            {barSegments.map((seg) => (
              <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: seg.color }} />
                <span style={{ fontSize: 12, color: '#6e6e73' }}>{seg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Deduction Breakdown */}
      <Card title="공제 항목 상세" icon={<Info size={18} />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { label: '국민연금', value: result.pension, rate: '4.5%', color: '#6366f1' },
            { label: '건강보험', value: result.health, rate: '3.545%', color: '#8b5cf6' },
            { label: '장기요양보험', value: result.ltc, rate: '건강보험료 × 12.81%', color: '#a78bfa' },
            { label: '고용보험', value: result.employment, rate: '0.9%', color: '#c4b5fd' },
            { label: '소득세', value: result.incomeTax, rate: '간이세액표 기준', color: '#f59e0b' },
            { label: '지방소득세', value: result.localTax, rate: '소득세 × 10%', color: '#fbbf24' },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: i < arr.length - 1 ? '1px solid #f2f2f7' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f' }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: '#aeaeb2' }}>{item.rate}</p>
                </div>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#3a3a3c' }}>{fmt(item.value)}</p>
            </div>
          ))}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 0 0', marginTop: 4,
            borderTop: '2px solid #e5e5ea',
          }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#1d1d1f' }}>총 공제액</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>{fmt(result.totalDeduction)}</p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 0 0',
          }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#1d1d1f' }}>실수령액</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#10b981' }}>{fmt(result.netSalary)}</p>
          </div>
        </div>
        <div style={{
          marginTop: 16, padding: '12px 16px', borderRadius: 10,
          background: '#f2f2f7', fontSize: 12, color: '#6e6e73', lineHeight: 1.7,
        }}>
          ※ 2026년 기준 적용. 실제 세액은 연말정산 후 확정됩니다.<br />
          ※ 비과세 합계 (식대 + 차량유지비 + 육아수당): {result.totalNonTax.toLocaleString('ko-KR')}원 — 이 금액은 과세표준에서 제외됩니다.<br />
          ※ 부양가족 공제는 간이세액표 근사치 적용 (1인당 연 150만 원 소득공제 기준). 정확한 세액은 국세청 간이세액표를 참고하세요.
        </div>
      </Card>
    </div>
  );
}
