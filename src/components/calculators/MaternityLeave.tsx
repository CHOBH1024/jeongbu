import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Info } from 'lucide-react';

const INPUT_H: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'#f9f9fb', border:'1.5px solid #e5e5ea', borderRadius:10, fontSize:14, color:'#1d1d1f', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const mutedColor = '#6e6e73';

/* 상수 */
const MATERNITY_MAX      = 2_100_000;   // 출산휴가 고용보험 상한 월 210만
const PARENTAL_80_MAX    = 1_500_000;   // 육아휴직 1~3개월 상한
const PARENTAL_80_MIN    = 700_000;     // 육아휴직 하한
const PARENTAL_50_MAX    = 1_200_000;   // 육아휴직 4개월~ 상한
const PARENTAL_50_MIN    = 700_000;
const DADDY_MAX          = 2_500_000;   // 아빠의 달 첫 달 상한

type LeaveType = 'maternity' | 'parental' | 'daddy';

export const MaternityLeave = () => {
  const [monthlyWage, setMonthlyWage]     = useState(3_000_000);
  const [leaveType, setLeaveType]         = useState<LeaveType>('maternity');
  const [parentalMonths, setParentalMonths] = useState(6);
  const [daddyUsed, setDaddyUsed]         = useState(false);
  const [multipleBirth, setMultipleBirth] = useState(false); // 다태아 여부

  const result = useMemo(() => {
    const maternityMonths = multipleBirth ? 4 : 3; // 다태아 120일(4개월)
    if (leaveType === 'maternity') {
      /* 출산휴가 단태아 90일 / 다태아 120일 */
      const govPay    = Math.min(monthlyWage, MATERNITY_MAX);
      const compPay   = Math.max(0, monthlyWage - MATERNITY_MAX);
      const totalGov  = govPay * maternityMonths;
      const totalComp = compPay * maternityMonths;
      return {
        type: 'maternity' as const,
        govPay, compPay, totalGov, totalComp,
        totalPay: monthlyWage * maternityMonths,
        periods: [
          { label: `출산휴가 ${maternityMonths}개월${multipleBirth ? ' (다태아)' : ''}`, govPay, compPay, total: monthlyWage },
        ],
      };
    }

    if (leaveType === 'parental') {
      /* 육아휴직 */
      const periods: { label: string; govPay: number; compPay: number; total: number }[] = [];
      let totalGov = 0;
      let totalComp = 0;

      /* 아빠의 달 첫 달 (배우자 동시 사용 시) */
      let startMonth = 0;
      if (daddyUsed && parentalMonths >= 1) {
        const raw     = monthlyWage;
        const govPay  = Math.min(raw, DADDY_MAX);
        const compPay = Math.max(0, raw - govPay);
        periods.push({ label:'1개월 (아빠의 달 100%)', govPay, compPay, total: raw });
        totalGov  += govPay;
        totalComp += compPay;
        startMonth = 1;
      }

      for (let m = startMonth; m < parentalMonths; m++) {
        const rate   = m < 3 ? 0.8 : 0.5;
        const maxPay = m < 3 ? PARENTAL_80_MAX : PARENTAL_50_MAX;
        const minPay = m < 3 ? PARENTAL_80_MIN : PARENTAL_50_MIN;
        const raw    = monthlyWage * rate;
        const govPay = Math.max(minPay, Math.min(raw, maxPay));
        const compPay = 0;
        const labelMonth = m + 1;
        periods.push({
          label: `${labelMonth}개월 차 (통상임금 ${rate * 100}%)`,
          govPay, compPay, total: govPay,
        });
        totalGov  += govPay;
        totalComp += compPay;
      }

      return {
        type: 'parental' as const,
        govPay: totalGov / parentalMonths,
        compPay: 0,
        totalGov,
        totalComp,
        totalPay: totalGov,
        periods,
      };
    }

    /* 아빠육아휴직 (단독) */
    const govPay  = Math.min(monthlyWage, DADDY_MAX);
    const compPay = Math.max(0, monthlyWage - DADDY_MAX);
    return {
      type: 'daddy' as const,
      govPay, compPay,
      totalGov: govPay,
      totalComp: compPay,
      totalPay: monthlyWage,
      periods: [{ label:'아빠의 달 1개월 (100%)', govPay, compPay, total: monthlyWage }],
    };
  }, [monthlyWage, leaveType, parentalMonths, daddyUsed, multipleBirth]);

  const fmt = (n: number) => '₩' + n.toLocaleString('ko-KR');

  return (
    <div className="space-y-6">
      <div style={{ padding:'12px 18px', borderRadius:12, fontSize:12, background:'#fffbeb', border:'1px solid #fde68a', color:'#92400e', display:'flex', alignItems:'flex-start', gap:8 }}>
        <Info size={14} style={{ flexShrink:0, marginTop:1 }}/>
        <span>2025년 기준 &middot; 고용보험법 §75, §76 적용 &middot; 상한액은 변경될 수 있습니다. 결과는 참고용입니다.</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>

        {/* 입력 */}
        <div className="space-y-5">
          <Card title="기본 정보">
            <div className="space-y-4" style={{ marginTop:8 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>월 통상임금 (원)</label>
                <input type="number" value={monthlyWage} step={100000}
                  onChange={(e) => setMonthlyWage(+e.target.value)} style={INPUT_H}/>
              </div>

              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:10 }}>휴가 구분</label>
                <div className="space-y-2">
                  {([
                    ['maternity', multipleBirth ? '출산휴가 (120일, 다태아)' : '출산휴가 (90일)'],
                    ['parental',  '육아휴직'],
                    ['daddy',     '아빠 육아휴직 (아빠의 달)'],
                  ] as const).map(([t, label]) => (
                    <label key={t} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', fontSize:13, padding:'10px 14px', borderRadius:10, background: leaveType === t ? '#eef2ff' : '#f9f9fb', border:`1.5px solid ${leaveType === t ? '#6366f1' : '#e5e5ea'}` }}>
                      <input type="radio" name="leaveType" value={t} checked={leaveType === t}
                        onChange={() => setLeaveType(t)} style={{ accentColor:'#6366f1' }}/>
                      <span style={{ fontWeight: leaveType === t ? 700 : 500, color: leaveType === t ? '#6366f1' : '#1d1d1f' }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {leaveType === 'maternity' && (
                <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', fontSize:13, padding:'12px 14px', borderRadius:10, background: multipleBirth ? '#fef3c7' : '#f9f9fb', border:`1.5px solid ${multipleBirth ? '#f59e0b' : '#e5e5ea'}` }}>
                  <input type="checkbox" checked={multipleBirth} onChange={(e) => setMultipleBirth(e.target.checked)} style={{ accentColor:'#f59e0b', width:16, height:16 }}/>
                  <span style={{ fontWeight: multipleBirth ? 700 : 500, color: multipleBirth ? '#92400e' : '#1d1d1f' }}>
                    다태아 (쌍둥이·삼둥이 등) — 출산휴가 120일 적용
                  </span>
                </label>
              )}

              {leaveType === 'parental' && (
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>육아휴직 사용 기간 (개월)</label>
                  <input type="number" value={parentalMonths} min={1} max={12}
                    onChange={(e) => setParentalMonths(+e.target.value)} style={INPUT_H}/>
                </div>
              )}

              {leaveType === 'parental' && (
                <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', fontSize:13, padding:'12px 14px', borderRadius:10, background:'#f9f9fb', border:'1.5px solid #e5e5ea' }}>
                  <input type="checkbox" checked={daddyUsed} onChange={(e) => setDaddyUsed(e.target.checked)} style={{ accentColor:'#6366f1', width:16, height:16 }}/>
                  <span>배우자 육아휴직 동시 사용 (첫 달 아빠의 달 100% 적용)</span>
                </label>
              )}
            </div>
          </Card>

          <Card title="지급 기준 요약">
            <div className="space-y-2" style={{ marginTop:8, fontSize:12, color:mutedColor, lineHeight:1.9 }}>
              <p>• 출산휴가: 통상임금 100% (상한 월 210만)</p>
              <p>• 육아휴직 1~3개월: 통상임금 80% (상한 150만, 하한 70만)</p>
              <p>• 육아휴직 4개월~: 통상임금 50% (상한 120만, 하한 70만)</p>
              <p>• 아빠의 달 첫 달: 통상임금 100% (상한 250만)</p>
            </div>
          </Card>
        </div>

        {/* 결과 */}
        <div className="space-y-5">
          {/* 총 수령액 */}
          <div style={{ padding:28, borderRadius:20, background:'linear-gradient(135deg,#ecfdf5,#d1fae5)', border:'1.5px solid rgba(16,185,129,0.2)', textAlign:'center' }}>
            <p style={{ fontSize:12, color:mutedColor, fontWeight:700, marginBottom:8 }}>총 수령 급여 (고용보험)</p>
            <p className="num" style={{ fontSize:36, fontWeight:900, color:'#10b981', letterSpacing:'-0.03em' }}>
              {fmt(result.totalGov)}
            </p>
            {result.totalComp > 0 && (
              <p style={{ fontSize:12, color:mutedColor, marginTop:4 }}>회사 차액 부담: {fmt(result.totalComp)}</p>
            )}
          </div>

          {/* 기간별 수령 급여 */}
          <Card title="기간별 수령 급여">
            <div className="space-y-3" style={{ marginTop:8, fontSize:13 }}>
              {result.periods.map(({ label, govPay, compPay, total }) => (
                <div key={label} style={{ paddingBottom:12, borderBottom:'1px solid #f2f2f7' }}>
                  <p style={{ fontWeight:700, color:'#1d1d1f', marginBottom:4 }}>{label}</p>
                  <div style={{ display:'flex', gap:24, fontSize:12, color:mutedColor }}>
                    <span>고용보험: <strong style={{ color:'#10b981' }}>{fmt(govPay)}</strong></span>
                    {compPay > 0 && <span>회사 부담: <strong style={{ color:'#f59e0b' }}>{fmt(compPay)}</strong></span>}
                    <span>합계: <strong>{fmt(total)}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <StatCard label="월 통상임금" value={fmt(monthlyWage)} color="#6366f1"/>
            <StatCard label="고용보험 지급 합계" value={fmt(result.totalGov)} color="#10b981"/>
            {result.totalComp > 0 && (
              <StatCard label="회사 차액 부담 합계" value={fmt(result.totalComp)} color="#f59e0b"/>
            )}
          </div>

          <Card title="알아두세요">
            <div className="space-y-2" style={{ marginTop:8, fontSize:12, color:mutedColor, lineHeight:1.8 }}>
              {[
                '출산휴가는 90일(다태아 120일) 중 60일 이후 고용보험에서 지급.',
                '고용보험 미가입 또는 가입기간 180일 미충족 시 지급 제한.',
                '육아휴직 급여는 복직 후 6개월 경과 시 25% 사후 지급.',
                '아빠의 달은 같은 자녀에 대해 부모 중 두 번째 사용자에게 적용.',
              ].map((tip, i) => (
                <div key={i} style={{ display:'flex', gap:8 }}>
                  <span style={{ flexShrink:0, color:'#10b981', fontWeight:800 }}>{i+1}.</span>
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
