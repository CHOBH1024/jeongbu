import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Home, Users, Clock, Award, Info } from 'lucide-react';

/* ── Scoring helpers ── */

function calcNoHousingScore(years: number, under30Unmarried: boolean): number {
  if (under30Unmarried) return 0;
  if (years <= 0) return 2;
  const clamped = Math.min(years, 15);
  return 2 + Math.round(clamped) * 2;
}

function calcDependentsScore(count: number): number {
  return Math.min(count, 6) * 5 + 5;
}

function calcSubscriptionScore(months: number): number {
  if (months < 6) return 1;
  if (months < 12) return 2;
  const years = months / 12;
  if (years < 2) return 3;
  if (years < 3) return 4;
  if (years < 4) return 5;
  if (years < 5) return 6;
  if (years < 6) return 7;
  if (years < 7) return 8;
  if (years < 8) return 9;
  if (years < 9) return 10;
  if (years < 10) return 11;
  if (years < 11) return 12;
  if (years < 12) return 13;
  if (years < 13) return 14;
  if (years < 14) return 15;
  if (years < 15) return 16;
  return 17;
}

function getPercentileInfo(score: number): { label: string; color: string; bg: string; border: string } {
  if (score < 40)  return { label: '낮음',    color: '#ef4444', bg: '#fef2f2', border: '#fecaca' };
  if (score < 60)  return { label: '보통',    color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' };
  if (score < 75)  return { label: '높음',    color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0' };
  return               { label: '매우 높음', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' };
}

export function HousingSubscription() {
  const [noHousingYears, setNoHousingYears] = useState(5);
  const [under30Unmarried, setUnder30Unmarried] = useState(false);
  const [dependents, setDependents] = useState(2);
  const [subscriptionMonths, setSubscriptionMonths] = useState(48);

  const result = useMemo(() => {
    const noHousingScore    = calcNoHousingScore(noHousingYears, under30Unmarried);
    const dependentsScore   = calcDependentsScore(dependents);
    const subscriptionScore = calcSubscriptionScore(subscriptionMonths);
    const total = noHousingScore + dependentsScore + subscriptionScore;
    return { noHousingScore, dependentsScore, subscriptionScore, total };
  }, [noHousingYears, under30Unmarried, dependents, subscriptionMonths]);

  const percentile = getPercentileInfo(result.total);
  const maxScore = 84;
  const pct = Math.round((result.total / maxScore) * 100);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: '#f9f9fb', border: '1.5px solid #e5e5ea',
    borderRadius: 12, fontSize: 14, color: '#1d1d1f',
    fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Inputs */}
      <Card title="청약 가점 정보 입력" icon={<Home size={18} />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* 무주택 기간 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>
              무주택 기간&nbsp;
              <span style={{ color: '#6366f1', fontWeight: 800 }}>
                {under30Unmarried ? '해당없음 (0점)' : `${noHousingYears}년`}
              </span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#aeaeb2', whiteSpace: 'nowrap' }}>0년</span>
              <input
                type="range"
                min={0}
                max={15}
                step={1}
                value={noHousingYears}
                disabled={under30Unmarried}
                onChange={(e) => setNoHousingYears(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#6366f1', cursor: under30Unmarried ? 'not-allowed' : 'pointer', opacity: under30Unmarried ? 0.4 : 1 }}
              />
              <span style={{ fontSize: 12, color: '#aeaeb2', whiteSpace: 'nowrap' }}>15년+</span>
            </div>
            {/* Under 30 unmarried checkbox */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              padding: '10px 14px', background: under30Unmarried ? '#eef2ff' : '#f9f9fb', borderRadius: 10,
              border: `1.5px solid ${under30Unmarried ? '#6366f1' : '#e5e5ea'}`,
              transition: 'all 0.15s', marginTop: 4,
            }}>
              <input
                type="checkbox"
                checked={under30Unmarried}
                onChange={(e) => setUnder30Unmarried(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#6366f1' }}
              />
              <span style={{ fontSize: 13, color: '#1d1d1f', fontWeight: 500 }}>
                만 30세 미만이고 미혼입니다 (무주택 기간 점수 = 0점)
              </span>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {/* 부양가족 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>부양가족 수 (본인 제외)</label>
              <select
                value={dependents}
                onChange={(e) => setDependents(Number(e.target.value))}
                style={{ ...inputStyle }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#fff'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5ea'; e.currentTarget.style.background = '#f9f9fb'; }}
              >
                <option value={0}>0명 (본인만)</option>
                <option value={1}>1명</option>
                <option value={2}>2명</option>
                <option value={3}>3명</option>
                <option value={4}>4명</option>
                <option value={5}>5명</option>
                <option value={6}>6명 이상</option>
              </select>
            </div>

            {/* 청약통장 가입 기간 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>청약통장 가입 기간</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  min={0}
                  max={240}
                  step={1}
                  value={subscriptionMonths}
                  onChange={(e) => setSubscriptionMonths(Math.max(0, Number(e.target.value)))}
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#fff'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5ea'; e.currentTarget.style.background = '#f9f9fb'; }}
                />
                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#8e8e93', fontWeight: 600, pointerEvents: 'none' }}>개월</span>
              </div>
              <p style={{ fontSize: 12, color: '#8e8e93' }}>
                약 {Math.floor(subscriptionMonths / 12)}년 {subscriptionMonths % 12}개월
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Total Score + Gauge */}
      <Card title="청약 가점 결과" icon={<Award size={18} />} accentColor={percentile.color}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Big score + badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#8e8e93', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>총 가점</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 56, fontWeight: 900, color: percentile.color, lineHeight: 1 }}>{result.total}</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#aeaeb2' }}>/ {maxScore}점</span>
              </div>
            </div>
            <div style={{
              padding: '12px 24px', borderRadius: 16,
              background: percentile.bg, border: `1px solid ${percentile.border}`,
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 12, color: percentile.color, fontWeight: 700, marginBottom: 4 }}>경쟁력 수준</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: percentile.color }}>{percentile.label}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#aeaeb2' }}>0점</span>
              <span style={{ fontSize: 12, color: '#aeaeb2' }}>84점 만점</span>
            </div>
            <div style={{ height: 20, borderRadius: 10, background: '#f2f2f7', overflow: 'hidden', position: 'relative' }}>
              {/* Colored zone markers */}
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${(40/84)*100}%`, background: '#fef2f2', borderRight: '1px dashed #fecaca' }} />
              <div style={{ position: 'absolute', left: `${(40/84)*100}%`, top: 0, height: '100%', width: `${(20/84)*100}%`, background: '#fffbeb', borderRight: '1px dashed #fde68a' }} />
              <div style={{ position: 'absolute', left: `${(60/84)*100}%`, top: 0, height: '100%', width: `${(15/84)*100}%`, background: '#f0fdf4', borderRight: '1px dashed #a7f3d0' }} />
              <div style={{ position: 'absolute', left: `${(75/84)*100}%`, top: 0, height: '100%', width: `${(9/84)*100}%`, background: '#eef2ff' }} />
              {/* Actual score bar */}
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${percentile.color}99, ${percentile.color})`,
                borderRadius: 10, transition: 'width 0.4s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', paddingRight: 8 }}>{result.total}점</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#aeaeb2' }}>
              <span style={{ color: '#ef4444' }}>낮음 (~39)</span>
              <span style={{ color: '#f59e0b' }}>보통 (40~59)</span>
              <span style={{ color: '#10b981' }}>높음 (60~74)</span>
              <span style={{ color: '#6366f1' }}>매우 높음 (75+)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Category breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <StatCard
          label="무주택 기간"
          value={`${result.noHousingScore}점`}
          sub="최대 32점"
          color="#6366f1"
          icon={<Home size={18} />}
        />
        <StatCard
          label="부양가족 수"
          value={`${result.dependentsScore}점`}
          sub="최대 35점"
          color="#10b981"
          icon={<Users size={18} />}
        />
        <StatCard
          label="청약통장 기간"
          value={`${result.subscriptionScore}점`}
          sub="최대 17점"
          color="#f59e0b"
          icon={<Clock size={18} />}
        />
      </div>

      {/* Scoring table detail */}
      <Card title="항목별 점수 기준표" icon={<Info size={18} />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>

          {/* 무주택 기간 */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#6366f1', marginBottom: 10 }}>① 무주택 기간 (최대 32점)</p>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #e5e5ea' }}>
                  <th style={{ textAlign: 'left', padding: '6px 8px', color: '#6e6e73', fontWeight: 700 }}>기간</th>
                  <th style={{ textAlign: 'right', padding: '6px 8px', color: '#6e6e73', fontWeight: 700 }}>점수</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: '30세 미만 미혼', score: 0 },
                  { label: '0년 (만 30세 이상)', score: 2 },
                  ...[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(y => ({ label: `${y}년 이상`, score: 2 + y * 2 })),
                  { label: '15년 이상', score: 32 },
                ].map((row) => {
                  const isCurrent = !under30Unmarried
                    ? (row.score === result.noHousingScore)
                    : (under30Unmarried && row.score === 0 && row.label.includes('미혼'));
                  return (
                    <tr key={row.label} style={{ borderBottom: '1px solid #f2f2f7', background: isCurrent ? '#eef2ff' : 'transparent' }}>
                      <td style={{ padding: '6px 8px', color: isCurrent ? '#6366f1' : '#3a3a3c', fontWeight: isCurrent ? 700 : 400 }}>
                        {row.label}{isCurrent ? ' ←' : ''}
                      </td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: isCurrent ? 800 : 500, color: isCurrent ? '#6366f1' : '#3a3a3c' }}>
                        {row.score}점
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* 부양가족 */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#10b981', marginBottom: 10 }}>② 부양가족 수 (최대 35점)</p>
              <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #e5e5ea' }}>
                    <th style={{ textAlign: 'left', padding: '6px 8px', color: '#6e6e73', fontWeight: 700 }}>인원</th>
                    <th style={{ textAlign: 'right', padding: '6px 8px', color: '#6e6e73', fontWeight: 700 }}>점수</th>
                  </tr>
                </thead>
                <tbody>
                  {[0,1,2,3,4,5,6].map((n) => {
                    const s = n * 5 + 5;
                    const isCurrent = s === result.dependentsScore;
                    return (
                      <tr key={n} style={{ borderBottom: '1px solid #f2f2f7', background: isCurrent ? '#f0fdf4' : 'transparent' }}>
                        <td style={{ padding: '6px 8px', color: isCurrent ? '#10b981' : '#3a3a3c', fontWeight: isCurrent ? 700 : 400 }}>
                          {n === 6 ? '6명 이상' : `${n}명`}{isCurrent ? ' ←' : ''}
                        </td>
                        <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: isCurrent ? 800 : 500, color: isCurrent ? '#10b981' : '#3a3a3c' }}>
                          {s}점
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 청약통장 기간 */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b', marginBottom: 10 }}>③ 청약통장 가입 기간 (최대 17점)</p>
              <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #e5e5ea' }}>
                    <th style={{ textAlign: 'left', padding: '6px 8px', color: '#6e6e73', fontWeight: 700 }}>기간</th>
                    <th style={{ textAlign: 'right', padding: '6px 8px', color: '#6e6e73', fontWeight: 700 }}>점수</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: '6개월 미만', score: 1 },
                    { label: '6개월~1년', score: 2 },
                    { label: '1~2년', score: 3 },
                    { label: '2~3년', score: 4 },
                    { label: '3~4년', score: 5 },
                    { label: '4~5년', score: 6 },
                    { label: '5~6년', score: 7 },
                    { label: '6~7년', score: 8 },
                    { label: '7~8년', score: 9 },
                    { label: '8~9년', score: 10 },
                    { label: '9~10년', score: 11 },
                    { label: '10~11년', score: 12 },
                    { label: '11~12년', score: 13 },
                    { label: '12~13년', score: 14 },
                    { label: '13~14년', score: 15 },
                    { label: '14~15년', score: 16 },
                    { label: '15년 이상', score: 17 },
                  ].map((row) => {
                    const isCurrent = row.score === result.subscriptionScore;
                    return (
                      <tr key={row.label} style={{ borderBottom: '1px solid #f2f2f7', background: isCurrent ? '#fffbeb' : 'transparent' }}>
                        <td style={{ padding: '6px 8px', color: isCurrent ? '#d97706' : '#3a3a3c', fontWeight: isCurrent ? 700 : 400 }}>
                          {row.label}{isCurrent ? ' ←' : ''}
                        </td>
                        <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: isCurrent ? 800 : 500, color: isCurrent ? '#f59e0b' : '#3a3a3c' }}>
                          {row.score}점
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 20, padding: '12px 16px', borderRadius: 10,
          background: '#f2f2f7', fontSize: 12, color: '#6e6e73', lineHeight: 1.7,
        }}>
          ※ 투기과열지구 및 청약과열지역 내 전용면적 85㎡ 이하 주택은 100% 가점제 적용<br />
          ※ 무주택 기간은 세대원 전원 기준으로, 만 30세 이후 또는 혼인 이후부터 산정<br />
          ※ 부양가족은 세대별 주민등록표상 동재 등록 및 일정 요건 충족 필요<br />
          ※ 청약통장은 주택청약종합저축 기준 (구 청약저축·청약예금·청약부금 전환 포함)
        </div>
      </Card>
    </div>
  );
}
