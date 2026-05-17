import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Shield, Building2, Info } from 'lucide-react';

type CompanySize = '150미만' | '150~999' | '1000이상';

const COMPANY_SIZE_OPTIONS: { label: string; value: CompanySize; rate: number }[] = [
  { label: '150인 미만', value: '150미만', rate: 0.0025 },
  { label: '150~999인', value: '150~999', rate: 0.0045 },
  { label: '1,000인 이상', value: '1000이상', rate: 0.0065 },
];

const INDUSTRIAL_ACCIDENT_RATES: { label: string; rate: number }[] = [
  { label: '사무직 (일반)', rate: 0.006 },
  { label: '제조업 (경공업)', rate: 0.009 },
  { label: '제조업 (중공업)', rate: 0.016 },
  { label: '건설업', rate: 0.036 },
  { label: '운수·창고업', rate: 0.013 },
  { label: '음식·숙박업', rate: 0.009 },
];

function fmt(n: number) {
  return Math.round(n).toLocaleString('ko-KR');
}

export function InsuranceContribution() {
  const [salary, setSalary] = useState(3000000);
  const [companySize, setCompanySize] = useState<CompanySize>('150미만');
  const [accidentRateIdx, setAccidentRateIdx] = useState(0);

  const result = useMemo(() => {
    const s = salary;

    // 국민연금 (월 상한 6,170,000원, 하한 390,000원) — 2025년 7월 기준
    const pensionBase = Math.min(Math.max(s, 390000), 6170000);
    const pension = { emp: pensionBase * 0.045, co: pensionBase * 0.045 };

    // 건강보험 (2025년 기준 3.545%)
    const health = { emp: s * 0.03545, co: s * 0.03545 };

    // 장기요양보험 (건강보험료의 12.95%)
    const ltc = { emp: health.emp * 0.1295, co: health.co * 0.1295 };

    // 고용보험 (실업급여 근로자·사업주 각 0.9%)
    const unemployBase = { emp: s * 0.009, co: s * 0.009 };
    const employStab = s * (COMPANY_SIZE_OPTIONS.find((o) => o.value === companySize)?.rate ?? 0.0025);
    const employment = { emp: unemployBase.emp, co: unemployBase.co + employStab };

    // 산재보험 (사업주만)
    const accRate = INDUSTRIAL_ACCIDENT_RATES[accidentRateIdx].rate;
    const accident = { emp: 0, co: s * accRate };

    const totalEmp = pension.emp + health.emp + ltc.emp + employment.emp;
    const totalCo = pension.co + health.co + ltc.co + employment.co + accident.co;

    return { pension, health, ltc, employment, accident, totalEmp, totalCo };
  }, [salary, companySize, accidentRateIdx]);

  const rows = [
    { label: '국민연금', emp: result.pension.emp, co: result.pension.co, note: '각 4.5%' },
    { label: '건강보험', emp: result.health.emp, co: result.health.co, note: '각 3.545%' },
    { label: '장기요양보험', emp: result.ltc.emp, co: result.ltc.co, note: '건강보험료의 12.95%' },
    { label: '고용보험', emp: result.employment.emp, co: result.employment.co, note: '실업급여 각 0.9% + 고용안정 사업주 추가' },
    { label: '산재보험', emp: result.accident.emp, co: result.accident.co, note: '업종별 사업주 전액 부담' },
  ];

  return (
    <div className="space-y-6">
      <Card title="기업 정보 입력" icon={<Building2 size={18} />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-muted px-1">월 급여 (원)</label>
            <input
              type="number"
              min={0}
              step={100000}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-muted px-1">사업장 규모</label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value as CompanySize)}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
            >
              {COMPANY_SIZE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-muted px-1">산재보험 업종</label>
            <select
              value={accidentRateIdx}
              onChange={(e) => setAccidentRateIdx(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
            >
              {INDUSTRIAL_ACCIDENT_RATES.map((r, i) => (
                <option key={i} value={i}>{r.label} ({(r.rate * 100).toFixed(1)}%)</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="근로자 부담 합계"
          value={`${fmt(result.totalEmp)}원`}
          sub="월 공제액"
          color="var(--color-primary)"
          icon={<Shield size={18} />}
        />
        <StatCard
          label="사업주 부담 합계"
          value={`${fmt(result.totalCo)}원`}
          sub="월 사업주 추가 비용"
          color="var(--color-warning)"
          icon={<Building2 size={18} />}
        />
      </div>

      <Card title="4대보험 항목별 상세" icon={<Shield size={18} />}>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="text-left py-2 px-3 text-muted font-semibold">항목</th>
                <th className="text-right py-2 px-3 text-muted font-semibold">근로자 부담</th>
                <th className="text-right py-2 px-3 text-muted font-semibold">사업주 부담</th>
                <th className="text-left py-2 px-3 text-muted font-semibold hidden md:table-cell">비고</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2.5 px-3 font-medium">{r.label}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    {r.emp === 0 ? <span className="text-muted">-</span> : `${fmt(r.emp)}원`}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-semibold" style={{ color: 'var(--color-warning)' }}>
                    {fmt(r.co)}원
                  </td>
                  <td className="py-2.5 px-3 text-xs text-muted hidden md:table-cell">{r.note}</td>
                </tr>
              ))}
              <tr className="bg-primary/5 font-bold">
                <td className="py-2.5 px-3">합계</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-primary">{fmt(result.totalEmp)}원</td>
                <td className="py-2.5 px-3 text-right tabular-nums" style={{ color: 'var(--color-warning)' }}>{fmt(result.totalCo)}원</td>
                <td className="hidden md:table-cell" />
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-start gap-2 text-xs text-muted">
          <Info size={14} className="flex-shrink-0 mt-0.5 text-primary" />
          <p>2026년 요율 기준. 국민연금 상한 월 6,170,000원 (2025년 7월 기준). 건강보험료에 장기요양보험료 별도 가산됩니다.</p>
        </div>
      </Card>

      <Card title="인건비 총계" icon={<Building2 size={18} />}>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: '월 급여', value: fmt(salary), unit: '원' },
            { label: '사업주 4대보험', value: fmt(result.totalCo), unit: '원' },
            { label: '실제 인건비', value: fmt(salary + result.totalCo), unit: '원/월' },
          ].map((item) => (
            <div key={item.label} className="glass rounded-xl p-4">
              <div className="text-xs text-muted mb-1">{item.label}</div>
              <div className="text-lg font-extrabold text-primary">{item.value}</div>
              <div className="text-xs text-muted">{item.unit}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
