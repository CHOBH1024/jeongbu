import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';

function fmt(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(2)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return Math.round(n).toLocaleString('ko-KR');
}

const ITEMS = [
  { emoji: '🍗', name: '치킨 (BBQ 황금올리브)', price: 23000 },
  { emoji: '☕', name: '스타벅스 아메리카노', price: 5000 },
  { emoji: '🍕', name: '피자 (도미노 라지)', price: 28000 },
  { emoji: '🍜', name: '짜장면', price: 7500 },
  { emoji: '🚕', name: '택시 기본요금', price: 4800 },
  { emoji: '🎬', name: '영화 1편', price: 14000 },
  { emoji: '🍺', name: '맥주 1캔 (편의점)', price: 2500 },
  { emoji: '✈️', name: '제주도 왕복 항공권', price: 120000 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316', '#ef4444'];

export function ChickenCount() {
  const [mode, setMode] = useState<'annual' | 'monthly'>('annual');
  const [amount, setAmount] = useState(40000000);

  const calc = useMemo(() => {
    const annualAmount = mode === 'annual' ? amount : amount * 12;
    const monthlyAmount = mode === 'monthly' ? amount : amount / 12;
    const hourlyWage = annualAmount / 12 / (8 * 22);   // 월 22일 기준
    const perMinute = annualAmount / 12 / (8 * 22 * 60);
    const chickenPer1h = hourlyWage / 23000;

    return { annualAmount, monthlyAmount, hourlyWage, perMinute, chickenPer1h };
  }, [mode, amount]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card title="연봉 치킨 환산기" icon={<span style={{ fontSize: 20 }}>🍗</span>}>
        {/* Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['annual', 'monthly'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setAmount(m === 'annual' ? 40000000 : 3300000); }}
              style={{
                padding: '8px 20px', borderRadius: 99, fontSize: 14, fontWeight: 700,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: mode === m ? '#6366f1' : '#f2f2f7',
                color: mode === m ? '#fff' : '#6e6e73',
              }}
            >
              {m === 'annual' ? '연봉' : '월급'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>
            {mode === 'annual' ? '연봉' : '월급'} (원)
          </label>
          <input
            type="number"
            step={mode === 'annual' ? 1000000 : 100000}
            min={0}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{
              padding: '12px 16px', background: '#f9f9fb', border: '1.5px solid #e5e5ea',
              borderRadius: 12, fontSize: 16, color: '#1d1d1f', fontFamily: 'inherit',
              outline: 'none', boxSizing: 'border-box', fontWeight: 700,
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#fff'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5ea'; e.currentTarget.style.background = '#f9f9fb'; }}
          />
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16 }}>
        <StatCard label="연봉" value={`${fmt(calc.annualAmount)}원`} sub="세전" color="#6366f1" icon={<span>💼</span>} />
        <StatCard label="시급 (8h 기준)" value={`${fmt(calc.hourlyWage)}원`} sub="월 22일 근무 기준" color="#10b981" icon={<span>⏰</span>} />
        <StatCard label="분당 버는 돈" value={`${Math.round(calc.perMinute).toLocaleString('ko-KR')}원`} sub="근무 시간 기준" color="#f59e0b" icon={<span>⚡</span>} />
        <StatCard label="1시간 일하면 치킨" value={`${calc.chickenPer1h.toFixed(2)}마리`} sub="BBQ 황금올리브 기준" color="#ec4899" icon={<span>🍗</span>} />
      </div>

      <Card title="내 연봉으로 살 수 있는 것들" icon={<span style={{ fontSize: 18 }}>🛒</span>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 14, marginTop: 8 }}>
          {ITEMS.map((item, i) => {
            const count = Math.floor(calc.annualAmount / item.price);
            return (
              <div key={item.name} style={{
                borderRadius: 18, padding: '20px 14px', textAlign: 'center',
                background: `${COLORS[i % COLORS.length]}10`,
                border: `1.5px solid ${COLORS[i % COLORS.length]}25`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <span style={{ fontSize: 36 }}>{item.emoji}</span>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8e8e93', lineHeight: 1.4 }}>{item.name}</p>
                <p style={{ fontSize: 11, color: '#aeaeb2' }}>{item.price.toLocaleString('ko-KR')}원</p>
                <p style={{ fontSize: 28, fontWeight: 900, color: COLORS[i % COLORS.length], lineHeight: 1.1 }}>
                  {count.toLocaleString('ko-KR')}
                </p>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#6e6e73' }}>개 / 회 / 장</p>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 20, padding: '16px 20px', borderRadius: 14,
          background: 'linear-gradient(135deg, #eef2ff 0%, #fdf4ff 100%)',
          border: '1px solid rgba(99,102,241,0.15)',
          fontSize: 13, color: '#3a3a3c', lineHeight: 1.8,
        }}>
          🍗 연봉으로 환산하면: 매일 치킨 <strong style={{ color: '#6366f1' }}>
            {(calc.annualAmount / 23000 / 365).toFixed(1)}마리
          </strong> 씩, 매달 커피 <strong style={{ color: '#10b981' }}>
            {Math.floor(calc.monthlyAmount / 5000).toLocaleString('ko-KR')}잔
          </strong>을 살 수 있어요. 물론 세금 전 기준입니다 😅
        </div>
      </Card>
    </div>
  );
}
