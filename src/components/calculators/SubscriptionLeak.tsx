import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';
import { CreditCard, Plus, Trash2, TrendingUp, Info } from 'lucide-react';

type Sub = { id: number; name: string; monthly: number };

let nextId = 10;

const PRESETS = [
  { name: '넷플릭스', monthly: 17000 },
  { name: '유튜브 프리미엄', monthly: 14900 },
  { name: '스포티파이', monthly: 10900 },
  { name: '쿠팡 로켓와우', monthly: 7890 },
  { name: '애플 뮤직', monthly: 10900 },
  { name: '왓챠', monthly: 12900 },
  { name: '네이버 플러스', monthly: 6900 },
  { name: '카카오 이모티콘', monthly: 4900 },
];

function fmt(n: number) {
  return Math.round(n).toLocaleString('ko-KR');
}

function fmtEok(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(2)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return fmt(n);
}

export function SubscriptionLeak() {
  const [subs, setSubs] = useState<Sub[]>([
    { id: 1, name: '넷플릭스', monthly: 17000 },
    { id: 2, name: '유튜브 프리미엄', monthly: 14900 },
    { id: 3, name: '쿠팡 로켓와우', monthly: 7890 },
  ]);
  const [investRate, setInvestRate] = useState(7);
  const [investYears, setInvestYears] = useState(10);
  const [newName, setNewName] = useState('');
  const [newMonthly, setNewMonthly] = useState(0);

  const totalMonthly = useMemo(() => subs.reduce((s, x) => s + x.monthly, 0), [subs]);

  const { annual, invested } = useMemo(() => {
    const monthly = totalMonthly;
    const annual = monthly * 12;
    // 매월 투자 시 복리 (월 복리)
    const monthRate = investRate / 100 / 12;
    const n = investYears * 12;
    const invested = monthly * ((Math.pow(1 + monthRate, n) - 1) / monthRate) * (1 + monthRate);
    return { annual, invested };
  }, [totalMonthly, investRate, investYears]);

  const addSub = () => {
    if (!newName.trim() || newMonthly <= 0) return;
    setSubs((prev) => [...prev, { id: nextId++, name: newName.trim(), monthly: newMonthly }]);
    setNewName('');
    setNewMonthly(0);
  };

  const removeSub = (id: number) => setSubs((prev) => prev.filter((s) => s.id !== id));

  const addPreset = (p: { name: string; monthly: number }) => {
    if (subs.some((s) => s.name === p.name)) return;
    setSubs((prev) => [...prev, { id: nextId++, ...p }]);
  };

  return (
    <div className="space-y-6">
      <Card title="구독 중인 서비스" icon={<CreditCard size={18} />}>
        {/* Presets */}
        <div className="flex flex-wrap gap-2 mt-3 mb-4">
          {PRESETS.map((p) => {
            const added = subs.some((s) => s.name === p.name);
            return (
              <button
                key={p.name}
                onClick={() => addPreset(p)}
                disabled={added}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                style={{
                  background: added ? '#e2e8f0' : 'var(--color-primary)',
                  color: added ? '#94a3b8' : '#fff',
                  cursor: added ? 'default' : 'pointer',
                }}
              >
                {added ? '✓ ' : '+ '}{p.name}
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="space-y-2">
          {subs.map((sub) => (
            <div key={sub.id} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
              <span className="flex-1 text-sm font-semibold truncate">{sub.name}</span>
              <input
                type="number"
                min={0}
                step={100}
                value={sub.monthly}
                onChange={(e) =>
                  setSubs((prev) => prev.map((s) => s.id === sub.id ? { ...s, monthly: Number(e.target.value) } : s))
                }
                className="w-28 px-3 py-1.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-right tabular-nums"
              />
              <span className="text-xs text-muted w-6">원</span>
              <button
                onClick={() => removeSub(sub.id)}
                className="text-danger hover:opacity-70 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Add */}
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            placeholder="서비스명"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSub()}
            className="flex-1 px-4 py-2.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
          />
          <input
            type="number"
            placeholder="월 금액"
            value={newMonthly || ''}
            onChange={(e) => setNewMonthly(Number(e.target.value))}
            onKeyDown={(e) => e.key === 'Enter' && addSub()}
            className="w-28 px-4 py-2.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-right"
          />
          <button
            onClick={addSub}
            className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors flex items-center gap-1"
          >
            <Plus size={16} />
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="월 구독 합계" value={`${fmt(totalMonthly)}원`} sub={`${subs.length}개 서비스`} color="var(--color-primary)" icon={<CreditCard size={18} />} />
        <StatCard label="연간 지출" value={`${fmt(annual)}원`} sub="1년 기준" color="var(--color-warning)" icon={<CreditCard size={18} />} />
        <StatCard label={`${investYears}년 누적 지출`} value={`${fmtEok(annual * investYears)}원`} sub="단순 합산" color="var(--color-danger)" icon={<TrendingUp size={18} />} />
        <StatCard label={`투자했다면 (${investYears}년)`} value={`${fmtEok(invested)}원`} sub={`연 ${investRate}% 복리 가정`} color="var(--color-secondary)" icon={<TrendingUp size={18} />} />
      </div>

      <Card title="투자 가정 설정" icon={<TrendingUp size={18} />}>
        <div className="grid grid-cols-2 gap-5 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-muted px-1">연 수익률 (%)</label>
            <input
              type="number"
              min={0}
              max={30}
              step={0.5}
              value={investRate}
              onChange={(e) => setInvestRate(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-muted px-1">투자 기간 (년)</label>
            <input
              type="number"
              min={1}
              max={40}
              step={1}
              value={investYears}
              onChange={(e) => setInvestYears(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
            />
          </div>
        </div>
        <div className="mt-4 p-4 glass rounded-xl">
          <p className="text-sm text-muted">
            매월 <strong className="text-slate-800 dark:text-slate-200">{fmt(totalMonthly)}원</strong>을 구독 대신 연 {investRate}%로 {investYears}년 투자하면
            <strong className="text-primary"> {fmtEok(invested)}원</strong>이 됩니다.
            실제 지출 <strong className="text-danger">{fmtEok(annual * investYears)}원</strong> 대비
            <strong className="text-secondary"> {fmtEok(invested - annual * investYears)}원</strong> 차이입니다.
          </p>
        </div>
        <div className="mt-3 flex items-start gap-2 text-xs text-muted">
          <Info size={14} className="flex-shrink-0 mt-0.5 text-primary" />
          <p>모든 구독을 끊으라는 게 아닙니다. 자신이 실제로 사용하는 서비스를 파악하고 미사용 구독을 정리하는 용도로 활용하세요.</p>
        </div>
      </Card>
    </div>
  );
}
