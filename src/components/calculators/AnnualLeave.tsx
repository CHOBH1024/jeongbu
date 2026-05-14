import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';
import { CalendarDays, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';

function calcAnnualLeave(startDate: Date, refDate: Date): {
  yearsWorked: number;
  monthsWorked: number;
  totalDays: number;
  breakdown: string;
  isFirstYear: boolean;
} {
  const msPerDay = 1000 * 60 * 60 * 24;
  const msPerYear = msPerDay * 365.25;
  const totalMs = refDate.getTime() - startDate.getTime();

  if (totalMs < 0) return { yearsWorked: 0, monthsWorked: 0, totalDays: 0, breakdown: '', isFirstYear: true };

  const yearsWorked = totalMs / msPerYear;
  const fullYears = Math.floor(yearsWorked);

  // Count full months for first-year calculation
  let months = 0;
  const d = new Date(startDate);
  while (true) {
    const next = new Date(d);
    next.setMonth(next.getMonth() + 1);
    if (next > refDate) break;
    months++;
    d.setMonth(d.getMonth() + 1);
  }

  if (fullYears < 1) {
    // First year: 1 day per full month worked (max 11)
    const days = Math.min(months, 11);
    return {
      yearsWorked: fullYears,
      monthsWorked: months,
      totalDays: days,
      breakdown: `근무 ${months}개월 → 월 1일 기준 ${days}일`,
      isFirstYear: true,
    };
  }

  // 1년 이상: 15일 + 매 2년마다 1일 추가, 최대 25일
  const extra = Math.floor((fullYears - 1) / 2);
  const days = Math.min(15 + extra, 25);
  return {
    yearsWorked: fullYears,
    monthsWorked: months,
    totalDays: days,
    breakdown: `근속 ${fullYears}년 → 15일 + 추가 ${extra}일 = ${days}일`,
    isFirstYear: false,
  };
}

export function AnnualLeave() {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState('2022-03-01');
  const [refDate, setRefDate] = useState(today);
  const [usedDays, setUsedDays] = useState(5);

  const result = useMemo(() => {
    const start = new Date(startDate);
    const ref = new Date(refDate);
    if (isNaN(start.getTime()) || isNaN(ref.getTime())) return null;
    return calcAnnualLeave(start, ref);
  }, [startDate, refDate]);

  const remaining = result ? Math.max(0, result.totalDays - usedDays) : 0;
  const isNegative = result ? result.totalDays - usedDays < 0 : false;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card title="근무 정보 입력" icon={<CalendarDays size={18} />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-muted px-1">입사일</label>
            <input
              type="date"
              value={startDate}
              max={today}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-muted px-1">기준일 (오늘)</label>
            <input
              type="date"
              value={refDate}
              onChange={(e) => setRefDate(e.target.value)}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-muted px-1">사용한 연차 (일)</label>
            <input
              type="number"
              min={0}
              max={25}
              value={usedDays}
              onChange={(e) => setUsedDays(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="근속 기간"
              value={
                result.isFirstYear
                  ? `${result.monthsWorked}개월`
                  : `${Math.floor(result.yearsWorked)}년`
              }
              sub={result.isFirstYear ? '1년 미만' : `${result.monthsWorked}개월`}
              color="var(--color-primary)"
              icon={<Clock size={18} />}
            />
            <StatCard
              label="발생 연차"
              value={`${result.totalDays}일`}
              sub={result.isFirstYear ? '월 1일 기준' : '근로기준법 기준'}
              color="#3b82f6"
              icon={<CalendarDays size={18} />}
            />
            <StatCard
              label="사용 연차"
              value={`${usedDays}일`}
              sub="입력값 기준"
              color="var(--color-warning)"
              icon={<CheckCircle size={18} />}
            />
            <StatCard
              label="잔여 연차"
              value={`${remaining}일`}
              sub={isNegative ? '초과 사용' : '남은 일수'}
              color={isNegative ? 'var(--color-danger)' : 'var(--color-secondary)'}
              icon={isNegative ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            />
          </div>

          {/* Breakdown */}
          <Card>
            <div className="flex items-start gap-3">
              <Info size={18} className="flex-shrink-0 mt-0.5 text-primary" />
              <div>
                <p className="font-semibold text-sm mb-1">계산 근거</p>
                <p className="text-sm text-muted">{result.breakdown}</p>
                {isNegative && (
                  <p className="text-sm text-danger font-semibold mt-2">
                    ⚠️ 사용한 연차가 발생 연차를 초과합니다. ({Math.abs(result.totalDays - usedDays)}일 초과)
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Year-by-year table */}
          <Card title="연도별 연차 발생 기준표" icon={<CalendarDays size={18} />}>
            <p className="text-xs text-muted mb-4">근로기준법 제60조 기준 (2024년 기준)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left py-2 px-3 text-muted font-semibold">근속 기간</th>
                    <th className="text-left py-2 px-3 text-muted font-semibold">발생 연차</th>
                    <th className="text-left py-2 px-3 text-muted font-semibold">비고</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 px-3">1년 미만</td>
                    <td className="py-2 px-3 font-medium">월 1일 (최대 11일)</td>
                    <td className="py-2 px-3 text-muted text-xs">매월 개근 시 1일 발생</td>
                  </tr>
                  {[
                    [1, 15], [2, 15], [3, 16], [4, 16], [5, 17],
                    [6, 17], [7, 18], [8, 18], [9, 19], [10, 19],
                    [11, 20], [21, 25],
                  ].map(([yr, days]) => {
                    const isCurrent = result && !result.isFirstYear && Math.floor(result.yearsWorked) === yr;
                    return (
                      <tr
                        key={yr}
                        className={`border-b border-slate-100 dark:border-slate-800 ${
                          isCurrent ? 'bg-primary/5 font-semibold' : ''
                        }`}
                      >
                        <td className="py-2 px-3">
                          {yr === 21 ? '21년 이상' : `${yr}년`}
                          {isCurrent && <span className="ml-2 text-xs text-primary">← 현재</span>}
                        </td>
                        <td className="py-2 px-3" style={{ color: isCurrent ? 'var(--color-primary)' : undefined }}>
                          {days}일
                        </td>
                        <td className="py-2 px-3 text-muted text-xs">
                          {yr === 21 ? '최대 한도' : ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted mt-4">
              ※ 1년 미만의 월차는 1년이 되면 15일의 연차로 대체됩니다. (중복 부여 아님)
              <br />
              ※ 상시 5인 미만 사업장은 연차 규정이 다를 수 있습니다.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
