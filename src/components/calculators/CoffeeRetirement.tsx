import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Coffee, TrendingUp, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function fmt(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(2)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return Math.round(n).toLocaleString('ko-KR');
}

function fmtFull(n: number) {
  return Math.round(n).toLocaleString('ko-KR');
}

export function CoffeeRetirement() {
  const [coffeePrice, setCoffeePrice] = useState(6500);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [annualRate, setAnnualRate] = useState(7);

  const { data, summary } = useMemo(() => {
    const years = Math.max(1, retireAge - age);
    const weeklySpend = coffeePrice * daysPerWeek;
    const monthlySpend = weeklySpend * (52 / 12);
    const annualSpend = monthlySpend * 12;

    const monthRate = annualRate / 100 / 12;
    const n = years * 12;
    const invested = monthlySpend * ((Math.pow(1 + monthRate, n) - 1) / monthRate) * (1 + monthRate);
    const totalSpent = annualSpend * years;

    const rows = [];
    let cumSpent = 0;
    let cumInvested = 0;
    for (let yr = 1; yr <= years; yr++) {
      cumSpent += annualSpend;
      const nMo = yr * 12;
      cumInvested = monthlySpend * ((Math.pow(1 + monthRate, nMo) - 1) / monthRate) * (1 + monthRate);
      rows.push({
        year: `${age + yr}세`,
        yr,
        투자시: Math.round(cumInvested),
        지출합계: Math.round(cumSpent),
      });
    }

    return { data: rows, summary: { monthlySpend, annualSpend, invested, totalSpent, years } };
  }, [coffeePrice, daysPerWeek, age, retireAge, annualRate]);

  return (
    <div className="space-y-6">
      <Card title="커피 습관 & 투자 조건" icon={<Coffee size={18} />}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-2">
          {[
            { label: '커피 1잔 가격 (원)', value: coffeePrice, set: setCoffeePrice, step: 500, min: 0 },
            { label: '주당 구매 횟수 (일)', value: daysPerWeek, set: setDaysPerWeek, step: 1, min: 0, max: 7 },
            { label: '현재 나이', value: age, set: setAge, step: 1, min: 15, max: 70 },
            { label: '은퇴 목표 나이', value: retireAge, set: setRetireAge, step: 1, min: 30, max: 80 },
            { label: '연 투자 수익률 (%)', value: annualRate, set: setAnnualRate, step: 0.5, min: 0, max: 20 },
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
        <StatCard
          label="월 커피 지출"
          value={`${fmt(summary.monthlySpend)}원`}
          sub={`주 ${daysPerWeek}회 × ${coffeePrice.toLocaleString()}원`}
          color="var(--color-warning)"
          icon={<Coffee size={18} />}
        />
        <StatCard
          label="연 커피 지출"
          value={`${fmt(summary.annualSpend)}원`}
          sub="1년 합계"
          color="#ef4444"
          icon={<Coffee size={18} />}
        />
        <StatCard
          label={`${summary.years}년 총 지출`}
          value={`${fmt(summary.totalSpent)}원`}
          sub={`${age}세~${retireAge}세`}
          color="var(--color-danger)"
          icon={<TrendingUp size={18} />}
        />
        <StatCard
          label={`투자했다면`}
          value={`${fmt(summary.invested)}원`}
          sub={`연 ${annualRate}% 복리, ${summary.years}년`}
          color="var(--color-secondary)"
          icon={<TrendingUp size={18} />}
        />
      </div>

      <Card title={`커피값 vs 투자 비교 (${age}세 → ${retireAge}세)`} icon={<TrendingUp size={18} />}>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorCoffeeInvest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="colorCoffeeSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} interval={Math.floor(summary.years / 5)} />
              <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 11 }} width={60} />
              <Tooltip
                formatter={(v, name) => [`${fmtFull(Number(v))}원`, String(name)]}
                labelStyle={{ fontWeight: 700 }}
              />
              <Legend />
              <Area type="monotone" dataKey="투자시" stroke="var(--color-secondary)" fill="url(#colorCoffeeInvest)" strokeWidth={2} />
              <Area type="monotone" dataKey="지출합계" stroke="#ef4444" fill="url(#colorCoffeeSpend)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 glass rounded-xl">
          <p className="text-sm text-muted">
            {age}세부터 {retireAge}세까지 {summary.years}년간 커피를 끊고 매달{' '}
            <strong className="text-slate-800 dark:text-slate-200">{fmt(summary.monthlySpend)}원</strong>씩 투자하면
            은퇴 시점에 <strong className="text-secondary">{fmt(summary.invested)}원</strong>이 됩니다.
            월 <strong className="text-secondary">{fmt(summary.invested / (20 * 12))}원</strong>씩
            20년간 인출 가능한 노후 자금입니다.
          </p>
        </div>
        <div className="mt-3 flex items-start gap-2 text-xs text-muted">
          <Info size={14} className="flex-shrink-0 mt-0.5 text-primary" />
          <p>커피를 끊으라는 게 아닙니다. 소비가 장기적으로 어떤 의미인지 인식하기 위한 도구입니다.</p>
        </div>
      </Card>
    </div>
  );
}
