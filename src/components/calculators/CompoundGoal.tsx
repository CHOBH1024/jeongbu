import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Info } from 'lucide-react';

const INPUT_H: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'#f9f9fb', border:'1.5px solid #e5e5ea', borderRadius:10, fontSize:14, color:'#1d1d1f', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const mutedColor = '#6e6e73';

/** FV 계산: 현재 자산 PV, 월 추가 PMT, 월 수익률 r, 기간 n개월 */
function calcFV(pv: number, pmt: number, r: number, n: number): number {
  if (r === 0) return pv + pmt * n;
  return pv * Math.pow(1 + r, n) + pmt * ((Math.pow(1 + r, n) - 1) / r);
}

/** 목표 달성 기간 계산 (반복법) */
function calcMonthsToGoal(pv: number, pmt: number, r: number, goal: number): number | null {
  if (pv >= goal) return 0;
  const maxMonths = 600; // 50년 상한
  for (let n = 1; n <= maxMonths; n++) {
    const fv = calcFV(pv, pmt, r, n);
    if (fv >= goal) return n;
  }
  return null; // 50년 이내 달성 불가
}

export const CompoundGoal = () => {
  const [goal, setGoal]           = useState(1_000_000_000);  // 목표 자산
  const [current, setCurrent]     = useState(50_000_000);     // 현재 자산
  const [monthly, setMonthly]     = useState(500_000);        // 월 추가 투자
  const [annualRate, setAnnualRate] = useState(7);            // 연 수익률 %
  const [inflationRate, setInflationRate] = useState(3);      // 연 물가상승률 %

  const result = useMemo(() => {
    const r = annualRate / 100 / 12;
    const inf = inflationRate / 100 / 12;

    const months = calcMonthsToGoal(current, monthly, r, goal);

    /* 시뮬레이션 표: 10/20/30년 */
    const milestones = [10, 20, 30].map((yr) => {
      const n = yr * 12;
      const fv = calcFV(current, monthly, r, n);
      const totalInvested = current + monthly * n;
      const profit = fv - totalInvested;
      // 물가 반영 실질가치
      const realFv = fv / Math.pow(1 + inf * 12, yr);
      return { yr, fv: Math.floor(fv), totalInvested, profit: Math.floor(profit), realFv: Math.floor(realFv) };
    });

    const yrs = months === null ? 0 : Math.floor(months / 12);
    const mos = months === null ? 0 : months % 12;
    const fv   = months === null ? 0 : calcFV(current, monthly, r, months);
    const totalInvested = months === null ? 0 : current + monthly * months;
    const profit = fv - totalInvested;

    // 실질 구매력 (물가 반영)
    const realValue = months === null ? 0 : fv / Math.pow(1 + inf * 12, yrs + mos / 12);

    return {
      error: months === null,
      months: months ?? 0, yrs, mos,
      fv:   Math.floor(fv),
      totalInvested: Math.floor(totalInvested),
      profit:        Math.floor(profit),
      realValue:     Math.floor(realValue),
      milestones,
    };
  }, [goal, current, monthly, annualRate, inflationRate]);

  const fmt  = (n: number) => '₩' + n.toLocaleString('ko-KR');
  const fmtB = (n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}억`;
    if (n >= 10_000)        return `${(n / 10_000).toFixed(0)}만`;
    return fmt(n);
  };

  return (
    <div className="space-y-6">
      <div style={{ padding:'12px 18px', borderRadius:12, fontSize:12, background:'#fffbeb', border:'1px solid #fde68a', color:'#92400e', display:'flex', alignItems:'flex-start', gap:8 }}>
        <Info size={14} style={{ flexShrink:0, marginTop:1 }}/>
        <span>복리 계산 공식 (FV = PV×(1+r)^n + PMT×((1+r)^n−1)/r) 적용 &middot; 세금, 수수료 미반영 &middot; 참고용입니다.</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>

        {/* 입력 */}
        <div className="space-y-5">
          <Card title="투자 조건 설정">
            <div className="space-y-4" style={{ marginTop:8 }}>
              {[
                { label:'목표 자산 (원)',       val:goal,     set:setGoal,     step:10_000_000 },
                { label:'현재 자산 (원)',       val:current,  set:setCurrent,  step:1_000_000  },
                { label:'월 추가 투자액 (원)', val:monthly,  set:setMonthly,  step:100_000   },
              ].map(({ label, val, set, step }) => (
                <div key={label}>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>{label}</label>
                  <input type="number" value={val} step={step} min={0}
                    onChange={(e) => set(+e.target.value)} style={INPUT_H}/>
                </div>
              ))}

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>연 수익률 (%)</label>
                  <input type="number" value={annualRate} step={0.5} min={0} max={50}
                    onChange={(e) => setAnnualRate(+e.target.value)} style={INPUT_H}/>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>연 물가상승률 (%)</label>
                  <input type="number" value={inflationRate} step={0.5} min={0} max={20}
                    onChange={(e) => setInflationRate(+e.target.value)} style={INPUT_H}/>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 결과 */}
        <div className="space-y-5">
          {result.error ? (
            <div style={{ padding:24, borderRadius:16, background:'#fef2f2', border:'1.5px solid #fca5a5', color:'#b91c1c', fontSize:13 }}>
              현재 조건으로는 50년 이내 목표 달성이 어렵습니다. 월 투자금 또는 수익률을 높여보세요.
            </div>
          ) : (
            <>
              {/* 목표 달성 기간 */}
              <div style={{ padding:28, borderRadius:20, background:'linear-gradient(135deg,#eef2ff,#fdf4ff)', border:'1.5px solid rgba(99,102,241,0.2)', textAlign:'center' }}>
                <p style={{ fontSize:12, color:mutedColor, fontWeight:700, marginBottom:8 }}>목표 달성까지</p>
                <p className="num" style={{ fontSize:38, fontWeight:900, color:'#6366f1', letterSpacing:'-0.03em' }}>
                  {result.yrs}년 {result.mos}개월
                </p>
                <p style={{ fontSize:12, color:mutedColor, marginTop:4 }}>
                  ({result.months}개월 후 달성)
                </p>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <StatCard label="달성 시 자산" value={fmtB(result.fv)} color="#6366f1"/>
                <StatCard label="총 투자금" value={fmtB(result.totalInvested)} color="#8b5cf6"/>
                <StatCard label="총 수익" value={fmtB(result.profit)} color="#10b981"/>
                <StatCard label="실질 구매력" value={fmtB(result.realValue)} color="#f59e0b"
                  sub={`물가 ${inflationRate}% 반영`}/>
              </div>
            </>
          )}

          {/* 시뮬레이션 표 */}
          <Card title="연도별 시뮬레이션">
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, marginTop:8 }}>
              <thead>
                <tr style={{ borderBottom:'2px solid #e5e5ea' }}>
                  {['기간','예상 자산','총 투자금','수익','실질가치'].map((h) => (
                    <th key={h} style={{ padding:'8px 4px', textAlign:'right', fontSize:11, color:mutedColor, fontWeight:700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.milestones.map(({ yr, fv, totalInvested, profit, realFv }) => (
                  <tr key={yr} style={{ borderBottom:'1px solid #f2f2f7' }}>
                    <td style={{ padding:'10px 4px', fontWeight:700, color:'#6366f1' }}>{yr}년</td>
                    <td style={{ padding:'10px 4px', textAlign:'right', fontWeight:700 }}>{fmtB(fv)}</td>
                    <td style={{ padding:'10px 4px', textAlign:'right', color:mutedColor }}>{fmtB(totalInvested)}</td>
                    <td style={{ padding:'10px 4px', textAlign:'right', color:'#10b981', fontWeight:600 }}>{fmtB(profit)}</td>
                    <td style={{ padding:'10px 4px', textAlign:'right', color:'#f59e0b' }}>{fmtB(realFv)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title="알아두세요">
            <div className="space-y-2" style={{ marginTop:8, fontSize:12, color:mutedColor, lineHeight:1.8 }}>
              {[
                '세금(15.4% 이자소득세 등)과 운용 수수료는 반영되지 않았습니다.',
                '연 수익률 7%는 S&P500 장기 평균(물가 반영 실질 기준 약 7%).',
                '실질 구매력은 현재 화폐가치로 환산한 미래 자산의 구매력입니다.',
                '중도 인출 시 복리 효과가 크게 감소합니다.',
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
