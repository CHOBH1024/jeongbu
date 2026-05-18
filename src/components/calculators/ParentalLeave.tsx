import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Baby, Calendar, DollarSign, Info, Gift } from 'lucide-react';

function fmt(n: number) {
  return Math.round(n).toLocaleString('ko-KR') + '원';
}

// 6+6 부모육아휴직제 월별 상한 (2024.01 시행)
const SIX_SIX_CAPS = [2_000_000, 2_500_000, 3_000_000, 3_500_000, 4_000_000, 4_500_000];

function calcMonthBenefit(monthNum: number, wage: number, sixSix = false): number {
  if (sixSix && monthNum <= 6) {
    const cap = SIX_SIX_CAPS[monthNum - 1];
    return Math.min(Math.max(wage, 700_000), cap);
  }
  if (monthNum <= 3) {
    return Math.min(Math.max(wage * 0.8, 700_000), 1_500_000);
  }
  return Math.min(Math.max(wage * 0.5, 700_000), 1_200_000);
}

export function ParentalLeave() {
  const [monthlyWage, setMonthlyWage] = useState(3_000_000);
  const [leaveDuration, setLeaveDuration] = useState(6);
  const [sixSix, setSixSix] = useState(false); // 6+6 부모육아휴직제

  const result = useMemo(() => {
    const months: { month: number; rate: string; raw: number; benefit: number }[] = [];
    let total = 0;

    for (let m = 1; m <= leaveDuration; m++) {
      const isSixSixPeriod = sixSix && m <= 6;
      const raw = isSixSixPeriod ? monthlyWage : monthlyWage * (m <= 3 ? 0.8 : 0.5);
      const benefit = calcMonthBenefit(m, monthlyWage, sixSix);
      months.push({
        month: m,
        rate: isSixSixPeriod ? '100%' : (m <= 3 ? '80%' : '50%'),
        raw,
        benefit,
      });
      total += benefit;
    }

    const monthlyAvg = leaveDuration > 0 ? total / leaveDuration : 0;
    return { months, total, monthlyAvg };
  }, [monthlyWage, leaveDuration, sixSix]);

  const bonusMonth1 = Math.min(Math.max(monthlyWage * 1.0, 700_000), 2_500_000);

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
      <Card title="육아휴직 정보 입력" icon={<Baby size={18} />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {/* Monthly wage */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>통상임금 (월)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min={0}
                step={100000}
                value={monthlyWage}
                onChange={(e) => setMonthlyWage(Math.max(0, Number(e.target.value)))}
                style={{ ...inputStyle, paddingRight: 36 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#fff'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5ea'; e.currentTarget.style.background = '#f9f9fb'; }}
              />
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#8e8e93', fontWeight: 600, pointerEvents: 'none' }}>원</span>
            </div>
          </div>

          {/* 6+6 제도 */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
              padding: '14px 18px', borderRadius: 12,
              background: sixSix ? '#fef3c7' : '#f9f9fb',
              border: `1.5px solid ${sixSix ? '#f59e0b' : '#e5e5ea'}`,
            }}>
              <input type="checkbox" checked={sixSix} onChange={(e) => setSixSix(e.target.checked)}
                style={{ accentColor: '#f59e0b', width: 16, height: 16, marginTop: 2, flexShrink: 0 }}
              />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: sixSix ? '#92400e' : '#1d1d1f', marginBottom: 4 }}>
                  6+6 부모육아휴직제 적용 (2024.01 시행)
                </p>
                <p style={{ fontSize: 12, color: '#6e6e73', lineHeight: 1.6 }}>
                  부모 모두 사용 시 각 6개월 통상임금 100% 지급.<br/>
                  월별 상한: 1개월 200만 → 2개월 250만 → 3개월 300만 → 4개월 350만 → 5개월 400만 → 6개월 450만원
                </p>
              </div>
            </label>
          </div>

          {/* Duration slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>
              육아휴직 기간&nbsp;
              <span style={{ color: '#6366f1', fontWeight: 800 }}>{leaveDuration}개월</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#aeaeb2', whiteSpace: 'nowrap' }}>1개월</span>
              <input
                type="range"
                min={1}
                max={12}
                step={1}
                value={leaveDuration}
                onChange={(e) => setLeaveDuration(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#6366f1', cursor: 'pointer' }}
              />
              <span style={{ fontSize: 12, color: '#aeaeb2', whiteSpace: 'nowrap' }}>12개월</span>
            </div>
            <p style={{ fontSize: 12, color: '#8e8e93' }}>1~12개월 선택 (법정 최대 12개월)</p>
          </div>
        </div>
      </Card>

      {/* Key Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <StatCard
          label="총 육아휴직급여"
          value={fmt(result.total)}
          sub={`${leaveDuration}개월 합계`}
          color="#6366f1"
          icon={<DollarSign size={18} />}
        />
        <StatCard
          label="월 평균 수령액"
          value={fmt(result.monthlyAvg)}
          sub="평균 기준"
          color="#10b981"
          icon={<Calendar size={18} />}
        />
        <StatCard
          label="초기 3개월 (80%)"
          value={fmt(calcMonthBenefit(1, monthlyWage))}
          sub={`상한 150만원 / 하한 70만원`}
          color="#8b5cf6"
          icon={<Baby size={18} />}
        />
        <StatCard
          label="4개월 이후 (50%)"
          value={fmt(calcMonthBenefit(4, monthlyWage))}
          sub={`상한 120만원 / 하한 70만원`}
          color="#f59e0b"
          icon={<Calendar size={18} />}
        />
      </div>

      {/* Month-by-month breakdown */}
      <Card title="월별 수령액 상세" icon={<Info size={18} />}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #e5e5ea' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6e6e73', fontWeight: 700 }}>월차</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', color: '#6e6e73', fontWeight: 700 }}>적용 비율</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: '#6e6e73', fontWeight: 700 }}>산정 기초액</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: '#6e6e73', fontWeight: 700 }}>실제 수령액</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', color: '#6e6e73', fontWeight: 700 }}>구분</th>
              </tr>
            </thead>
            <tbody>
              {result.months.map((row) => {
                const isCapped = Math.round(row.benefit) !== Math.round(row.raw);
                const isFloor = row.benefit > row.raw;
                const isEarly = row.month <= 3;
                return (
                  <tr key={row.month} style={{
                    borderBottom: '1px solid #f2f2f7',
                    background: isEarly ? '#eef2ff08' : 'transparent',
                  }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1d1d1f' }}>
                      {row.month}개월차
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                        background: isEarly ? '#eef2ff' : '#fef3c7',
                        color: isEarly ? '#6366f1' : '#d97706',
                      }}>
                        {row.rate}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#6e6e73' }}>
                      {fmt(row.raw)}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#1d1d1f' }}>
                      {fmt(row.benefit)}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: 12, color: '#aeaeb2' }}>
                      {isCapped && !isFloor ? '상한 적용' : isFloor ? '하한 적용' : '그대로'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid #e5e5ea', background: '#f9f9fb' }}>
                <td colSpan={3} style={{ padding: '12px 12px', fontWeight: 800, color: '#1d1d1f', fontSize: 15 }}>
                  합계
                </td>
                <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 800, fontSize: 16, color: '#6366f1' }}>
                  {fmt(result.total)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        <div style={{
          marginTop: 16, padding: '12px 16px', borderRadius: 10,
          background: '#f2f2f7', fontSize: 12, color: '#6e6e73', lineHeight: 1.7,
        }}>
          ※ 2024년 기준 육아휴직급여 지급 기준<br />
          ※ 초기 3개월: 통상임금의 80% (상한 150만원, 하한 70만원)<br />
          ※ 4개월 이후: 통상임금의 50% (상한 120만원, 하한 70만원)<br />
          ※ 복직 후 6개월 이상 근속 시 사업주에게 복직장려금 지급 (참고)
        </div>
      </Card>

      {/* 아빠 육아휴직 보너스 */}
      <Card title="아빠 육아휴직 보너스제" icon={<Gift size={18} />} accentColor="#ec4899">
        <div style={{
          padding: '16px 20px', borderRadius: 14,
          background: 'linear-gradient(135deg, #fdf4ff 0%, #fce7f3 100%)',
          border: '1px solid #f5d0fe',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#ec489915', color: '#ec4899',
            }}>
              <Gift size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#1d1d1f', marginBottom: 8 }}>
                배우자도 육아휴직을 사용하면 첫 달 100% 지급!
              </p>
              <p style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.7, marginBottom: 12 }}>
                같은 자녀에 대해 부모 모두 육아휴직을 사용할 경우, 두 번째 사용자의
                첫 1개월은 통상임금의 <strong>100%</strong>를 지급합니다.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{
                  padding: '10px 16px', borderRadius: 12,
                  background: '#fff', border: '1px solid #f5d0fe',
                }}>
                  <p style={{ fontSize: 11, color: '#9d174d', fontWeight: 700, marginBottom: 2 }}>보너스 첫 달 수령액 (예상)</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: '#ec4899' }}>{fmt(bonusMonth1)}</p>
                  <p style={{ fontSize: 11, color: '#aeaeb2' }}>상한 250만원 / 하한 70만원</p>
                </div>
                <div style={{
                  padding: '10px 16px', borderRadius: 12,
                  background: '#fff', border: '1px solid #f5d0fe',
                }}>
                  <p style={{ fontSize: 11, color: '#9d174d', fontWeight: 700, marginBottom: 2 }}>적용 조건</p>
                  <p style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.6 }}>
                    동일 자녀 대상<br />
                    부모 모두 육아휴직
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 12, padding: '12px 16px', borderRadius: 10,
          background: '#f2f2f7', fontSize: 12, color: '#6e6e73', lineHeight: 1.7,
        }}>
          ※ "3+3 부모육아휴직제" (2022년~): 생후 12개월 이내 자녀 대상, 부모 모두 육아휴직 시 각 3개월 통상임금 100% 지급 (상한 월 300만원까지 확대 추진 중)<br />
          ※ 정확한 금액은 고용24(www.work24.go.kr) 에서 확인하세요.
        </div>
      </Card>
    </div>
  );
}
