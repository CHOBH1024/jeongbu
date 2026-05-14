import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';
import { TrendingUp, DollarSign, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function fmt(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return Math.round(n).toLocaleString('ko-KR');
}

function fmtFull(n: number) {
  return Math.round(n).toLocaleString('ko-KR');
}

export function DripSnowball() {
  const [initialInvest, setInitialInvest] = useState(10000000);
  const [annualAdd, setAnnualAdd] = useState(3000000);
  const [dividendYield, setDividendYield] = useState(4);
  const [priceGrowth, setPriceGrowth] = useState(5);
  const [years, setYears] = useState(20);
  const [taxRate] = useState(15.4); // 배당소득세 15.4% 고정

  const { data, summary } = useMemo(() => {
    const rows = [];
    let principal = initialInvest;
    let totalDividends = 0;
    let totalAdded = initialInvest;

    for (let yr = 1; yr <= years; yr++) {
      const dividendGross = principal * (dividendYield / 100);
      const dividendNet = dividendGross * (1 - taxRate / 100);
      totalDividends += dividendNet;
      principal = (principal + dividendNet + annualAdd) * (1 + priceGrowth / 100);
      totalAdded += annualAdd;

      rows.push({
        year: `${yr}년`,
        yr,
        자산: Math.round(principal),
        배당금: Math.round(dividendNet),
        투자원금: Math.round(totalAdded),
      });
    }

    return {
      data: rows,
      summary: {
        finalAsset: rows[rows.length - 1]?.자산 ?? 0,
        totalAdded,
        totalDividends: Math.round(totalDividends),
        gain: (rows[rows.length - 1]?.자산 ?? 0) - totalAdded,
      },
    };
  }, [initialInvest, annualAdd, dividendYield, priceGrowth, years, taxRate]);

  const annualDividendNow = Math.round(
    (summary.finalAsset * (dividendYield / 100)) * (1 - taxRate / 100)
  );

  return (
    <div className="space-y-6">
      <Card title="투자 조건 설정" icon={<TrendingUp size={18} />}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-2">
          {[
            { label: '초기 투자금 (원)', value: initialInvest, set: setInitialInvest, step: 1000000, min: 0 },
            { label: '연간 추가 투자 (원)', value: annualAdd, set: setAnnualAdd, step: 500000, min: 0 },
            { label: '배당 수익률 (%)', value: dividendYield, set: setDividendYield, step: 0.5, min: 0, max: 30 },
            { label: '연간 주가 상승률 (%)', value: priceGrowth, set: setPriceGrowth, step: 0.5, min: -10, max: 30 },
            { label: '투자 기간 (년)', value: years, set: setYears, step: 1, min: 1, max: 50 },
          ].map((f) => (
            <div key={f.label} className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-muted px-1">{f.label}</label>
              <input
                type="number"
                min={f.min}
                max={f.max}
                step={f.step}
                value={f.value}
                onChange={(e) => f.set(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={`${years}년 후 총 자산`} value={`${fmt(summary.finalAsset)}원`} sub="배당 재투자 포함" color="var(--color-primary)" icon={<TrendingUp size={18} />} />
        <StatCard label="총 투자 원금" value={`${fmt(summary.totalAdded)}원`} sub={`초기 + 연간 추가`} color="#3b82f6" icon={<DollarSign size={18} />} />
        <StatCard label="수익 (자본+배당)" value={`${fmt(summary.gain + summary.totalDividends)}원`} sub="세후 누적 수익" color="var(--color-secondary)" icon={<TrendingUp size={18} />} />
        <StatCard label={`${years}년 후 연간 배당`} value={`${fmt(annualDividendNow)}원`} sub="세후 예상 (월 기준)" color="var(--color-warning)" icon={<DollarSign size={18} />} />
      </div>

      <Card title="자산 성장 그래프" icon={<TrendingUp size={18} />}>
        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorAsset" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} interval={Math.floor(years / 5)} />
              <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 11 }} width={60} />
              <Tooltip
                formatter={(v, name) => [`${fmtFull(Number(v))}원`, String(name)]}
                labelStyle={{ fontWeight: 700 }}
              />
              <Legend />
              <Area type="monotone" dataKey="자산" stroke="var(--color-primary)" fill="url(#colorAsset)" strokeWidth={2} />
              <Area type="monotone" dataKey="투자원금" stroke="#3b82f6" fill="url(#colorPrincipal)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-start gap-2 text-xs text-muted">
          <Info size={14} className="flex-shrink-0 mt-0.5 text-primary" />
          <p>배당소득세 15.4% 적용. 주가 상승률은 연평균 복리 기준. 실제 수익은 시장 상황에 따라 다를 수 있습니다.</p>
        </div>
      </Card>

      <Card title="연도별 배당금 현황" icon={<DollarSign size={18} />}>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="text-left py-2 px-3 text-muted font-semibold">연도</th>
                <th className="text-right py-2 px-3 text-muted font-semibold">연간 배당금(세후)</th>
                <th className="text-right py-2 px-3 text-muted font-semibold">월 배당금</th>
                <th className="text-right py-2 px-3 text-muted font-semibold">총 자산</th>
              </tr>
            </thead>
            <tbody>
              {data.filter((_, i) => i % Math.max(1, Math.floor(years / 10)) === 0 || i === data.length - 1).map((row) => (
                <tr key={row.yr} className="border-b border-slate-100 dark:border-slate-800 hover:bg-primary/3">
                  <td className="py-2 px-3 font-medium">{row.year}</td>
                  <td className="py-2 px-3 text-right tabular-nums">{fmtFull(row.배당금)}원</td>
                  <td className="py-2 px-3 text-right tabular-nums text-secondary">{fmtFull(Math.round(row.배당금 / 12))}원</td>
                  <td className="py-2 px-3 text-right tabular-nums font-semibold text-primary">{fmt(row.자산)}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
