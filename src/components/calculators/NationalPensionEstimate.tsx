import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Info } from 'lucide-react';

const INPUT_H: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'#f9f9fb', border:'1.5px solid #e5e5ea', borderRadius:10, fontSize:14, color:'#1d1d1f', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const mutedColor = '#6e6e73';

/* 2025년 전체 가입자 평균소득월액 */
const A_VALUE = 2_989_764;

/** 기본연금액 계산 */
function calcPension(avgMonthlyIncome: number, totalMonths: number): number {
  const B = avgMonthlyIncome;
  const base = 1.2 * (A_VALUE + B) * (totalMonths / 480);
  return Math.floor(base);
}

export const NationalPensionEstimate = () => {
  const [currentAge, setCurrentAge]         = useState(35);
  const [retireAge, setRetireAge]           = useState(60);
  const [monthlyIncome, setMonthlyIncome]   = useState(3_500_000);
  const [subscribedMonths, setSubscribedMonths] = useState(60);

  const result = useMemo(() => {
    const remainingMonths = Math.max(0, (retireAge - currentAge) * 12);
    const totalMonths = subscribedMonths + remainingMonths;

    if (totalMonths < 120) {
      return { error: '국민연금은 최소 10년(120개월) 가입해야 수령 가능합니다.' };
    }

    /* 정상 수령(65세) */
    const normalPension = calcPension(monthlyIncome, totalMonths);

    /* 조기수령(60세): 65세 대비 1년당 6% 감액, 최대 5년 30% 감액 */
    const earlyYears = Math.max(0, Math.min(5, 65 - 60));
    const earlyFactor = 1 - earlyYears * 0.06;
    const earlyPension = Math.floor(normalPension * earlyFactor);

    /* 연기수령(70세): 1년당 7.2% 증액, 최대 5년 36% 증액 */
    const lateYears = Math.max(0, Math.min(5, 70 - 65));
    const lateFactor = 1 + lateYears * 0.072;
    const latePension = Math.floor(normalPension * lateFactor);

    return {
      totalMonths,
      normalPension,
      earlyPension,
      latePension,
      normalAnnual: normalPension * 12,
      earlyAnnual:  earlyPension * 12,
      lateAnnual:   latePension * 12,
      normal20yr:   normalPension * 12 * 20,
      early20yr:    earlyPension  * 12 * 20,
      late20yr:     latePension   * 12 * 20,
    };
  }, [currentAge, retireAge, monthlyIncome, subscribedMonths]);

  const fmt  = (n: number) => '₩' + n.toLocaleString('ko-KR');
  const fmtM = (n: number) => `₩${(n / 10_000).toFixed(0)}만`;

  return (
    <div className="space-y-6">
      <div style={{ padding:'12px 18px', borderRadius:12, fontSize:12, background:'#fffbeb', border:'1px solid #fde68a', color:'#92400e', display:'flex', alignItems:'flex-start', gap:8 }}>
        <Info size={14} style={{ flexShrink:0, marginTop:1 }}/>
        <span>2025년 기준 &middot; A값(평균소득월액) 2,989,764원 적용 &middot; 1969년 이후 출생자 정상 지급 개시 연령 65세 기준 &middot; 결과는 참고용입니다.</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>

        {/* 입력 */}
        <div className="space-y-5">
          <Card title="기본 정보">
            <div className="space-y-4" style={{ marginTop:8 }}>
              {[
                { label:'현재 나이 (세)', val:currentAge, set:(v:number) => setCurrentAge(v), min:18, max:64 },
                { label:'예상 은퇴 나이 (세)', val:retireAge, set:(v:number) => setRetireAge(v), min:18, max:65 },
                { label:'현재까지 가입 기간 (개월)', val:subscribedMonths, set:(v:number) => setSubscribedMonths(v), min:0, max:480 },
              ].map(({ label, val, set, min, max }) => (
                <div key={label}>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>{label}</label>
                  <input type="number" value={val} min={min} max={max}
                    onChange={(e) => set(+e.target.value)} style={INPUT_H}/>
                </div>
              ))}
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>현재 월 소득 (원)</label>
                <input type="number" value={monthlyIncome} step={100000}
                  onChange={(e) => setMonthlyIncome(+e.target.value)} style={INPUT_H}/>
              </div>
            </div>
          </Card>

          <Card title="계산 근거">
            <div className="space-y-2" style={{ marginTop:8, fontSize:12, color:mutedColor, lineHeight:1.8 }}>
              <p>• 기본연금액 = 1.2 × (A + B) × (가입월수/480)</p>
              <p>• A = 전체 가입자 평균소득월액 {fmt(A_VALUE)}</p>
              <p>• B = 본인 평균소득월액 (입력값)</p>
              <p>• 조기수령(60세): 1년당 6% 감액 (최대 30%)</p>
              <p>• 연기수령(70세): 1년당 7.2% 증액 (최대 36%)</p>
              {result && !('error' in result) && (
                <p style={{ color:'#6366f1', fontWeight:700 }}>• 총 가입 예정 기간: {result.totalMonths}개월</p>
              )}
            </div>
          </Card>
        </div>

        {/* 결과 */}
        <div className="space-y-5">
          {result && 'error' in result ? (
            <div style={{ padding:24, borderRadius:16, background:'#fef2f2', border:'1.5px solid #fca5a5', color:'#b91c1c', fontSize:13 }}>
              {result.error}
            </div>
          ) : result ? (
            <>
              {/* 시나리오 비교 */}
              {[
                { label:'정상 수령 (65세)', pension:result.normalPension, annual:result.normalAnnual, cum20:result.normal20yr, color:'#6366f1', bg:'linear-gradient(135deg,#eef2ff,#fdf4ff)' },
                { label:'조기 수령 (60세, 30% 감액)', pension:result.earlyPension, annual:result.earlyAnnual, cum20:result.early20yr, color:'#f59e0b', bg:'linear-gradient(135deg,#fffbeb,#fef9c3)' },
                { label:'연기 수령 (70세, 36% 증액)', pension:result.latePension, annual:result.lateAnnual, cum20:result.late20yr, color:'#10b981', bg:'linear-gradient(135deg,#ecfdf5,#d1fae5)' },
              ].map(({ label, pension, annual, cum20, color, bg }) => (
                <div key={label} style={{ padding:24, borderRadius:18, background:bg, border:`1.5px solid ${color}30` }}>
                  <p style={{ fontSize:12, fontWeight:700, color:mutedColor, marginBottom:4 }}>{label}</p>
                  <p className="num" style={{ fontSize:30, fontWeight:900, color, letterSpacing:'-0.03em' }}>
                    {fmt(pension)} <span style={{ fontSize:14, fontWeight:600 }}>/ 월</span>
                  </p>
                  <div style={{ display:'flex', gap:24, marginTop:8, fontSize:12, color:mutedColor }}>
                    <span>연 <strong style={{ color }}>{fmtM(annual)}</strong></span>
                    <span>20년 누적 <strong style={{ color }}>{fmtM(cum20)}</strong></span>
                  </div>
                </div>
              ))}

              {/* 시나리오 비교표 */}
              <Card title="수령 시기별 비교">
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, marginTop:8 }}>
                  <thead>
                    <tr style={{ borderBottom:'2px solid #e5e5ea' }}>
                      {['구분','월 수령액','연 수령액','20년 누적'].map((h) => (
                        <th key={h} style={{ padding:'8px 4px', textAlign:'right', fontSize:11, color:mutedColor, fontWeight:700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label:'조기(60세)', p:result.earlyPension, a:result.earlyAnnual, c:result.early20yr, color:'#f59e0b' },
                      { label:'정상(65세)', p:result.normalPension, a:result.normalAnnual, c:result.normal20yr, color:'#6366f1' },
                      { label:'연기(70세)', p:result.latePension, a:result.lateAnnual, c:result.late20yr, color:'#10b981' },
                    ].map(({ label, p, a, c, color }) => (
                      <tr key={label} style={{ borderBottom:'1px solid #f2f2f7' }}>
                        <td style={{ padding:'10px 4px', fontWeight:700, color }}>{label}</td>
                        <td style={{ padding:'10px 4px', textAlign:'right' }}>{fmt(p)}</td>
                        <td style={{ padding:'10px 4px', textAlign:'right' }}>{fmtM(a)}</td>
                        <td style={{ padding:'10px 4px', textAlign:'right', fontWeight:700, color }}>{fmtM(c)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <StatCard label="총 가입 예정" value={`${result.totalMonths}개월`} color="#6366f1"/>
                <StatCard label="정상 수령 월액" value={fmt(result.normalPension)} color="#6366f1"/>
              </div>
            </>
          ) : null}

          <Card title="알아두세요">
            <div className="space-y-2" style={{ marginTop:8, fontSize:12, color:mutedColor, lineHeight:1.8 }}>
              {[
                '최소 가입 기간 10년(120개월) 미충족 시 반환일시금만 지급됩니다.',
                '1969년 이후 출생자는 정상 지급 개시 연령이 65세입니다.',
                '소득이 높을수록 연금 수령액 증가 효과는 감소합니다 (A값 포함 공식 구조).',
                '실제 수령액은 물가 연동, 조정 등으로 달라질 수 있습니다.',
              ].map((tip, i) => (
                <div key={i} style={{ display:'flex', gap:8 }}>
                  <span style={{ flexShrink:0, color:'#6366f1', fontWeight:800 }}>{i+1}.</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
