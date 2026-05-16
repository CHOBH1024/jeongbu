import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';
import { CalendarDays, Info, AlertTriangle } from 'lucide-react';
import { RATES_EFFECTIVE_DATE } from '../../data/rates';

/* ──────────────────────────────────────────────────────────
   연차 계산 핵심 로직
   근거: 근로기준법 §60 (2018.5.29 개정)

   ▶ 2018년 이후 현행법:
   - 1년 미만: 1개월 개근 시 1일 (최대 11일) — 독립 발생
   - 만 1년 개근: 15일 추가 발생 (1년 미만 연차와 별개, 차감 없음)
   - 2년차~: 15일 + 매 2년마다 1일 추가, 최대 25일
   - 즉, 입사 1년간 최대 26일(11+15) 발생 가능
─────────────────────────────────────────────────────────── */

function countFullMonths(start: Date, ref: Date): number {
  let months = 0;
  const d = new Date(start);
  while (true) {
    const next = new Date(d);
    next.setMonth(next.getMonth() + 1);
    if (next > ref) break;
    months++;
    d.setMonth(d.getMonth() + 1);
  }
  return months;
}

function annualLeaveDays(years: number): number {
  if (years < 1) return 0;
  const extra = Math.floor((Math.floor(years) - 1) / 2);
  return Math.min(15 + extra, 25);
}

const INPUT_H: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: '#f9f9fb', border: '1.5px solid #e5e5ea',
  borderRadius: 10, fontSize: 14, color: '#1d1d1f',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};

type WorkerType = 'full' | 'parttime' | 'under5';

export function AnnualLeave() {
  const today = new Date().toISOString().split('T')[0];
  const [startDate,   setStartDate]   = useState('2022-03-01');
  const [refDate,     setRefDate]     = useState(today);
  const [usedDays,    setUsedDays]    = useState(5);
  const [workerType,  setWorkerType]  = useState<WorkerType>('full');
  const [weeklyHours, setWeeklyHours] = useState(15);
  const [dailyWage,   setDailyWage]   = useState(0);   // 연차수당 계산용 (0=미입력)

  const result = useMemo(() => {
    const start = new Date(startDate);
    const ref   = new Date(refDate);
    if (isNaN(start.getTime()) || isNaN(ref.getTime()) || ref <= start) return null;

    const totalMs   = ref.getTime() - start.getTime();
    const totalDays = Math.floor(totalMs / 86400000);
    const years     = totalMs / (365.25 * 86400000);
    const fullYears = Math.floor(years);
    const months    = countFullMonths(start, ref);

    const ratio = workerType === 'parttime' ? Math.min(weeklyHours / 40, 1) : 1;

    /* 1년 미만: 월 단위 연차 */
    const monthlyLeave = workerType === 'under5' ? 0 : Math.floor(Math.min(months, 11) * ratio);

    /* 만 1년 이후 연차 */
    const yearlyLeave  = workerType === 'under5' ? 0 : Math.floor(annualLeaveDays(years) * ratio);

    /* 현재 발생한 총 연차 (현행법: 별개 발생) */
    let totalLeave = 0;
    let breakdown  = '';

    if (fullYears === 0) {
      // 1년 미만: 월 단위만
      totalLeave = monthlyLeave;
      breakdown  = `근무 ${months}개월 → 월 1일 × ${ratio < 1 ? `${Math.round(ratio * 100)}%` : ''} = ${monthlyLeave}일`;
    } else {
      // 1년 이상: 1년치 월차 11일(or 비례) + 현재 연도 연차
      const priorMonthly = workerType === 'under5' ? 0 : Math.floor(11 * ratio); // 입사 첫해 발생분
      totalLeave = priorMonthly + yearlyLeave;
      breakdown  = `첫 해 월차 ${priorMonthly}일 + 근속 ${fullYears}년 연차 ${yearlyLeave}일 = ${totalLeave}일`;
    }

    const remaining = totalLeave - usedDays;
    const compensation = dailyWage > 0 ? Math.max(0, remaining) * dailyWage : null;

    return {
      totalDays, years, fullYears, months,
      monthlyLeave, yearlyLeave, totalLeave,
      remaining, compensation, breakdown,
    };
  }, [startDate, refDate, usedDays, workerType, weeklyHours, dailyWage]);

  const mutedColor = '#6e6e73';

  /* 연도별 연차 기준표 */
  const TABLE_ROWS = [
    { label: '1년 미만', days: '월 1일 (최대 11일)', note: '매월 개근 시 1일 — 1년 후 연차와 별개' },
    { label: '1년',  days: '11일 + 15일',  note: '최초 1년: 월차 11일 + 만 1년 연차 15일 = 최대 26일' },
    { label: '2년',  days: '15일', note: '' },
    { label: '3년',  days: '16일', note: '2년마다 +1일' },
    { label: '4년',  days: '16일', note: '' },
    { label: '5년',  days: '17일', note: '' },
    { label: '7년',  days: '18일', note: '' },
    { label: '9년',  days: '19일', note: '' },
    { label: '11년', days: '20일', note: '' },
    { label: '13년', days: '21일', note: '' },
    { label: '15년', days: '22일', note: '' },
    { label: '17년', days: '23일', note: '' },
    { label: '19년', days: '24일', note: '' },
    { label: '21년+',days: '25일', note: '최대 한도' },
  ];

  return (
    <div className="space-y-6">

      {/* 안내 */}
      <div style={{
        padding: '12px 18px', borderRadius: 12, fontSize: 12,
        background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af',
        display: 'flex', gap: 8, alignItems: 'flex-start',
      }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
        <span>
          <strong>{RATES_EFFECTIVE_DATE}</strong> · 근로기준법 §60 (2018.5.29 개정) 기준 ·
          2018년 이후 1년 미만 월차와 만 1년 연차는 <strong>별개 발생</strong> (입사 1년간 최대 26일 가능)
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>

        {/* 입력 패널 */}
        <div className="space-y-5">

          {/* 근로 형태 */}
          <Card title="근로 형태" icon={<CalendarDays size={18}/>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {([
                ['full',     '🏢 정규직 / 5인 이상 사업장'],
                ['parttime', '⏰ 단시간 근로자 (주 40시간 미만)'],
                ['under5',   '🏪 5인 미만 사업장 (연차 미적용)'],
              ] as const).map(([t, label]) => (
                <button key={t} onClick={() => setWorkerType(t)}
                  style={{
                    padding: '10px 14px', borderRadius: 10, fontWeight: 700, fontSize: 13,
                    border: '1.5px solid', textAlign: 'left', cursor: 'pointer',
                    background:  workerType === t ? '#6366f1' : 'transparent',
                    color:       workerType === t ? '#fff'    : '#6e6e73',
                    borderColor: workerType === t ? '#6366f1' : '#e5e5ea',
                  }}>
                  {label}
                </button>
              ))}
            </div>
            {workerType === 'parttime' && (
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                  주 소정근로시간
                </label>
                <input type="number" min={1} max={39} value={weeklyHours}
                  onChange={(e) => setWeeklyHours(+e.target.value)} style={INPUT_H}/>
                <p style={{ fontSize: 11, color: mutedColor, marginTop: 4 }}>
                  연차 = 정규직 기준 × {Math.round(Math.min(weeklyHours / 40, 1) * 100)}% 비례
                </p>
              </div>
            )}
          </Card>

          {/* 재직 기간 */}
          <Card title="재직 기간">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
              {[
                { label: '입사일', val: startDate, set: setStartDate },
                { label: '기준일', val: refDate,   set: setRefDate },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>{label}</label>
                  <input type="date" value={val} onChange={(e) => set(e.target.value)} style={INPUT_H}/>
                </div>
              ))}
            </div>
          </Card>

          {/* 사용 연차 + 수당 */}
          <Card title="연차 사용 현황">
            <div className="space-y-4" style={{ marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                  사용한 연차 (일)
                </label>
                <input type="number" min={0} value={usedDays}
                  onChange={(e) => setUsedDays(+e.target.value)} style={INPUT_H}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                  1일 통상임금 <span style={{ color: '#aeaeb2', fontWeight: 400 }}>(연차수당 계산, 0이면 생략)</span>
                </label>
                <input type="number" min={0} step={10000} value={dailyWage}
                  onChange={(e) => setDailyWage(+e.target.value)} style={INPUT_H}/>
              </div>
            </div>
          </Card>
        </div>

        {/* 결과 패널 */}
        <div className="space-y-5">
          {workerType === 'under5' ? (
            <div style={{
              padding: '24px', borderRadius: 16,
              background: '#fef2f2', border: '1.5px solid #fca5a5',
              display: 'flex', gap: 12,
            }}>
              <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0 }}/>
              <div>
                <p style={{ fontWeight: 800, color: '#ef4444', marginBottom: 4 }}>5인 미만 사업장</p>
                <p style={{ fontSize: 13, color: '#b91c1c', lineHeight: 1.7 }}>
                  상시 근로자 5인 미만 사업장은 근로기준법 §60 연차 규정이 적용되지 않습니다.<br/>
                  단, 취업규칙이나 근로계약서에 연차를 부여하기로 명시된 경우에는 해당 기준을 따릅니다.
                </p>
              </div>
            </div>
          ) : result ? (
            <>
              {/* 발생 연차 요약 */}
              <div style={{
                padding: '28px', borderRadius: 20,
                background: 'linear-gradient(135deg,#eff6ff,#f0fdf4)',
                border: '1.5px solid rgba(99,102,241,0.2)',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: 13, color: mutedColor, fontWeight: 700, marginBottom: 8 }}>
                  현재까지 발생한 총 연차
                </p>
                <p className="num" style={{ fontSize: 40, fontWeight: 900, color: '#6366f1', marginBottom: 4 }}>
                  {result.totalLeave}일
                </p>
                <p style={{ fontSize: 12, color: mutedColor }}>
                  근무 {result.fullYears > 0 ? `${result.fullYears}년 ` : ''}{result.months % 12}개월 ({result.totalDays.toLocaleString()}일)
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <StatCard
                  label="발생 연차"
                  value={`${result.totalLeave}일`}
                  color="#6366f1"
                />
                <StatCard
                  label={result.remaining < 0 ? '초과 사용' : '잔여 연차'}
                  value={`${Math.abs(result.remaining)}일`}
                  color={result.remaining < 0 ? '#ef4444' : '#10b981'}
                />
                {result.compensation !== null && (
                  <StatCard
                    label="미사용 연차수당"
                    value={`₩${result.compensation.toLocaleString()}`}
                    color="#f59e0b"
                  />
                )}
                <StatCard
                  label="사용 연차"
                  value={`${usedDays}일`}
                  color="#8b5cf6"
                />
              </div>

              {result.remaining < 0 && (
                <div style={{
                  padding: '14px 18px', borderRadius: 12,
                  background: '#fef2f2', border: '1px solid #fca5a5',
                  fontSize: 13, color: '#b91c1c', display: 'flex', gap: 8,
                }}>
                  <AlertTriangle size={15} style={{ flexShrink: 0 }}/>
                  사용한 연차({usedDays}일)가 발생 연차({result.totalLeave}일)를 {Math.abs(result.remaining)}일 초과합니다.
                </div>
              )}

              {/* 발생 내역 */}
              <Card title="연차 발생 내역">
                <div className="space-y-3" style={{ marginTop: 8 }}>
                  {result.fullYears === 0 ? (
                    <div style={{ fontSize: 13, color: mutedColor, lineHeight: 1.8 }}>
                      <p>• 근무 {result.months}개월 → 월 1일 = <strong style={{ color: '#6366f1' }}>{result.monthlyLeave}일</strong> 발생</p>
                      <p style={{ marginTop: 8, color: '#aeaeb2', fontSize: 12 }}>
                        만 1년 도달 시 15일이 추가로 발생합니다 (현재 월차와 별개)
                      </p>
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: mutedColor, lineHeight: 1.8 }}>
                      <p>• 입사 첫 해 월차: <strong style={{ color: '#6366f1' }}>{Math.floor(11 * (workerType === 'parttime' ? Math.min(weeklyHours / 40, 1) : 1))}일</strong></p>
                      <p>• 현재 근속 연차 ({result.fullYears}년): <strong style={{ color: '#10b981' }}>{result.yearlyLeave}일</strong></p>
                      <p>• 합계: <strong style={{ color: '#6366f1' }}>{result.totalLeave}일</strong></p>
                      {result.fullYears < 21 && (() => {
                        // 증가 시점: 3, 5, 7, 9... (홀수년). 1→3, 2→3, 3→5, 4→5 ...
                        const nextYear = result.fullYears % 2 === 1 ? result.fullYears + 2 : result.fullYears + 1;
                        return (
                          <p style={{ marginTop: 8, color: '#aeaeb2', fontSize: 12 }}>
                            다음 증가: {nextYear}년 → {annualLeaveDays(nextYear)}일
                          </p>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </Card>
            </>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: mutedColor, fontSize: 14 }}>
              입사일을 입력하면 계산됩니다
            </div>
          )}

          {/* 연도별 기준표 */}
          <Card title="연차 발생 기준표 (근로기준법 §60)">
            <p style={{ fontSize: 11, color: mutedColor, marginBottom: 12 }}>{RATES_EFFECTIVE_DATE} · 5인 이상 사업장 · 정규직 기준</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e5ea' }}>
                    {['근속 기간', '연차', '비고'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '6px 10px', color: mutedColor, fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map((row, i) => {
                    const highlight = result && result.fullYears > 0 && row.label.startsWith(`${result.fullYears}년`);
                    return (
                      <tr key={i} style={{
                        borderBottom: '1px solid #f2f2f7',
                        background: highlight ? '#eef2ff' : 'transparent',
                      }}>
                        <td style={{ padding: '7px 10px', fontWeight: highlight ? 800 : 400, color: highlight ? '#6366f1' : '#1d1d1f' }}>
                          {row.label} {highlight ? '← 현재' : ''}
                        </td>
                        <td style={{ padding: '7px 10px', fontWeight: 700, color: highlight ? '#6366f1' : '#1d1d1f' }}>{row.days}</td>
                        <td style={{ padding: '7px 10px', color: mutedColor, fontSize: 11, lineHeight: 1.5 }}>{row.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="space-y-2" style={{ marginTop: 16 }}>
              {[
                '5인 미만 사업장에는 법정 연차가 적용되지 않습니다.',
                '단시간 근로자는 소정근로시간 비례 연차가 적용됩니다.',
                '육아휴직 기간은 출근한 것으로 봅니다 (§60⑥).',
                '미사용 연차는 퇴직 시 연차수당으로 지급받을 수 있습니다 (§60⑤).',
                '연차유급휴가 사용촉진제도 사용 시 미사용 연차수당 지급 의무 면제될 수 있습니다.',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, fontSize: 11, color: mutedColor }}>
                  <span style={{ color: '#6366f1', fontWeight: 800, flexShrink: 0 }}>※</span>
                  <span style={{ lineHeight: 1.6 }}>{tip}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
