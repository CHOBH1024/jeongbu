import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';

function fmtBig(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${Math.round(n / 10000).toLocaleString('ko-KR')}만`;
  return Math.round(n).toLocaleString('ko-KR');
}

function getLifeMessage(pct: number): string {
  if (pct < 25) return '이제 막 시작! 🌱';
  if (pct < 50) return '절반도 안 왔어요 💪';
  if (pct < 75) return '황금기를 보내고 있어요 ✨';
  if (pct < 90) return '소중한 시간이에요 🌸';
  return '매 순간이 선물이에요 🙏';
}

function getGradient(pct: number): string {
  if (pct < 25) return 'linear-gradient(90deg, #6366f1, #8b5cf6)';
  if (pct < 50) return 'linear-gradient(90deg, #10b981, #06b6d4)';
  if (pct < 75) return 'linear-gradient(90deg, #f59e0b, #f97316)';
  if (pct < 90) return 'linear-gradient(90deg, #ec4899, #ef4444)';
  return 'linear-gradient(90deg, #6366f1, #ec4899)';
}

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function LifeTimeCalc() {
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [expectedAge, setExpectedAge] = useState(82);

  const calc = useMemo(() => {
    const now = new Date();
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime()) || birth > now) return null;

    const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
    const totalMs = (expectedAge * msPerYear);
    const livedMs = now.getTime() - birth.getTime();
    const remainMs = totalMs - livedMs;

    if (remainMs < 0) return null;

    const livedYears = livedMs / msPerYear;
    const remainYears = remainMs / msPerYear;
    const pct = (livedMs / totalMs) * 100;

    const livedY = Math.floor(livedYears);
    const livedM = Math.floor((livedYears - livedY) * 12);
    const livedD = Math.floor(((livedYears - livedY) * 12 - livedM) * 30.44);

    const remY = Math.floor(remainYears);
    const remM = Math.floor((remainYears - remY) * 12);
    const remD = Math.floor(((remainYears - remY) * 12 - remM) * 30.44);

    const sleepDays = Math.round(remainYears * 365 * 8 / 24);
    const meals = Math.round(remainYears * 365 * 3);
    const paydays = Math.round(remainYears * 12);
    const weekends = Math.round(remainYears * 52);
    const heartbeats = Math.round(remainYears * 365 * 24 * 60 * 72);

    return {
      pct,
      livedY, livedM, livedD,
      remY, remM, remD,
      sleepDays, meals, paydays, weekends, heartbeats,
      livedYears, remainYears,
    };
  }, [birthDate, expectedAge]);

  const funStats = calc ? [
    { label: '잠 잘 날', value: fmtBig(calc.sleepDays), unit: '일', emoji: '😴', color: '#8b5cf6' },
    { label: '밥 먹을 횟수', value: fmtBig(calc.meals), unit: '끼', emoji: '🍚', color: '#f59e0b' },
    { label: '월급날', value: fmtBig(calc.paydays), unit: '번', emoji: '💸', color: '#10b981' },
    { label: '주말', value: fmtBig(calc.weekends), unit: '번', emoji: '🎉', color: '#ec4899' },
    { label: '심장 박동', value: fmtBig(calc.heartbeats), unit: '회', emoji: '❤️', color: '#ef4444' },
  ] : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card title="인생 시간 계산기" icon={<span style={{ fontSize: 20 }}>⏳</span>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>생년월일</label>
            <input
              type="date"
              value={birthDate}
              max={todayString()}
              onChange={(e) => setBirthDate(e.target.value)}
              style={{
                padding: '10px 14px', background: '#f9f9fb', border: '1.5px solid #e5e5ea',
                borderRadius: 12, fontSize: 14, color: '#1d1d1f', fontFamily: 'inherit',
                outline: 'none', boxSizing: 'border-box', width: '100%',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#fff'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5ea'; e.currentTarget.style.background = '#f9f9fb'; }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>기대수명: {expectedAge}세</label>
            <input
              type="range"
              min={70}
              max={100}
              value={expectedAge}
              onChange={(e) => setExpectedAge(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', marginTop: 8 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aeaeb2' }}>
              <span>70세</span><span>100세</span>
            </div>
          </div>
        </div>
      </Card>

      {calc ? (
        <>
          {/* Progress bar */}
          <Card title="인생 진행률" icon={<span style={{ fontSize: 18 }}>📊</span>}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 48, fontWeight: 900, color: '#1d1d1f', lineHeight: 1, marginBottom: 4 }}>
                {calc.pct.toFixed(1)}%
              </p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#6366f1' }}>{getLifeMessage(calc.pct)}</p>
            </div>
            <div style={{ position: 'relative', height: 24, borderRadius: 99, background: '#f2f2f7', overflow: 'hidden', marginBottom: 12 }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${Math.min(calc.pct, 100)}%`,
                background: getGradient(calc.pct),
                borderRadius: 99,
                transition: 'width 0.6s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#aeaeb2' }}>
              <span>탄생</span>
              <span>{expectedAge}세</span>
            </div>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            <StatCard
              label="살아온 시간"
              value={`${calc.livedY}년`}
              sub={`${calc.livedM}개월 ${calc.livedD}일`}
              color="#6366f1"
              icon={<span>🕰️</span>}
            />
            <StatCard
              label="남은 시간"
              value={`${calc.remY}년`}
              sub={`${calc.remM}개월 ${calc.remD}일`}
              color="#10b981"
              icon={<span>🌟</span>}
            />
          </div>

          {/* Fun stats */}
          <Card title="남은 인생, 이만큼 남았어요" icon={<span style={{ fontSize: 18 }}>🎲</span>}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginTop: 8 }}>
              {funStats.map((s) => (
                <div key={s.label} style={{
                  borderRadius: 18, padding: '20px 16px', textAlign: 'center',
                  background: `${s.color}10`, border: `1.5px solid ${s.color}25`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 32 }}>{s.emoji}</span>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
                  <p style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1.1 }}>
                    {s.value}
                    <span style={{ fontSize: 14, fontWeight: 700, marginLeft: 2 }}>{s.unit}</span>
                  </p>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 16, padding: '14px 18px', borderRadius: 14,
              background: '#f9f9fb', border: '1px solid #e5e5ea',
              fontSize: 13, color: '#6e6e73', lineHeight: 1.75,
            }}>
              ⚠️ 기대수명은 통계 평균입니다. 건강한 생활습관으로 더 오래, 더 활기차게 살 수 있습니다.
            </div>
          </Card>
        </>
      ) : (
        <Card title="결과">
          <p style={{ textAlign: 'center', color: '#8e8e93', padding: '20px 0' }}>
            올바른 생년월일을 입력해 주세요.
          </p>
        </Card>
      )}
    </div>
  );
}
