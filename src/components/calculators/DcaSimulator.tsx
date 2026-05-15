import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Info } from 'lucide-react';

const INPUT_H: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'#f9f9fb', border:'1.5px solid #e5e5ea', borderRadius:10, fontSize:14, color:'#1d1d1f', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const mutedColor = '#6e6e73';

/** FV: PV + 매달 PMT 복리 */
function calcFV(pmt: number, r: number, n: number): number {
  if (r === 0) return pmt * n;
  return pmt * ((Math.pow(1 + r, n) - 1) / r);
}

const MILESTONES = [5, 10, 20, 30] as const;

export const DcaSimulator = () => {
  const [monthly, setMonthly]         = useState(500_000);
  const [years, setYears]             = useState(20);
  const [annualRate, setAnnualRate]   = useState(10);
  const [inflationRate, setInflationRate] = useState(3);

  const result = useMemo(() => {
    const r   = annualRate / 100 / 12;
    const inf = inflationRate / 100 / 12;
    const n   = years * 12;

    const fv            = calcFV(monthly, r, n);
    const totalInvested = monthly * n;
    const profit        = fv - totalInvested;
    const roi           = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

    // 실질 구매력
    const realFv = inf > 0
      ? fv / Math.pow(1 + inf * 12, years)
      : fv;

    // Milestone rows
    const milestones = MILESTONES.map((yr) => {
      const mn   = yr * 12;
      const mFv  = calcFV(monthly, r, mn);
      const mInv = monthly * mn;
      const mPf  = mFv - mInv;
      const mReal = inf > 0 ? mFv / Math.pow(1 + inf * 12, yr) : mFv;
      return { yr, fv: Math.floor(mFv), invested: mInv, profit: Math.floor(mPf), realFv: Math.floor(mReal) };
    });

    return {
      fv: Math.floor(fv),
      totalInvested,
      profit: Math.floor(profit),
      roi,
      realFv: Math.floor(realFv),
      milestones,
    };
  }, [monthly, years, annualRate, inflationRate]);

  const fmt  = (n: number) => '₩' + n.toLocaleString('ko-KR');
  const fmtB = (n: number) => {
    if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(2)}억`;
    if (n >= 10_000)      return `${(n / 10_000).toFixed(0)}만`;
    return fmt(n);
  };

  return (
    <div className="space-y-6">
      <div style={{ padding:'12px 18px', borderRadius:12, fontSize:12, background:'#fffbeb', border:'1px solid #fde68a', color:'#92400e', display:'flex', alignItems:'flex-start', gap:8 }}>
        <Info size={14} style={{ flexShrink:0, marginTop:1 }}/>
        <span>달러 코스트 에버리징(DCA) &middot; 매달 정액 투자 복리 시뮬레이션 &middot; 세금·수수료 미반영 &middot; 참고용입니다.</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>

        {/* 입력 */}
        <div className="space-y-5">
          <Card title="투자 조건">
            <div className="space-y-4" style={{ marginTop:8 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>월 투자금액 (원)</label>
                <input type="number" value={monthly} step={100_000} min={1}
                  onChange={(e) => setMonthly(+e.target.value)} style={INPUT_H}/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>투자 기간 (년)</label>
                <input type="number" value={years} step={1} min={1} max={50}
                  onChange={(e) => setYears(+e.target.value)} style={INPUT_H}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>
                    연 수익률 (%)
                  </label>
                  <input type="number" value={annualRate} step={0.5} min={0} max={50}
                    onChange={(e) => setAnnualRate(+e.target.value)} style={INPUT_H}/>
                  <p style={{ fontSize:11, color:'#aeaeb2', marginTop:4 }}>S&amp;P500 장기 평균 ≈ 10%</p>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>
                    연 물가상승률 (%)
                  </label>
                  <input type="number" value={inflationRate} step={0.5} min={0} max={20}
                    onChange={(e) => setInflationRate(+e.target.value)} style={INPUT_H}/>
                </div>
              </div>
            </div>
          </Card>

          {/* 복리 효과 강조 */}
          <Card title="복리 효과">
            <div className="space-y-2" style={{ marginTop:8, fontSize:12, color:mutedColor, lineHeight:1.9 }}>
              <p>• 매달 같은 금액 투자 → 가격 하락 시 더 많은 주수 확보</p>
              <p>• 타이밍 리스크 최소화, 장기 평균단가 하락 효과</p>
              <p>• 복리 수익은 후반부에 급격히 증가 (72의 법칙)</p>
              <div style={{ padding:'12px', borderRadius:10, background:'#eef2ff', marginTop:8 }}>
                <p style={{ fontWeight:700, color:'#6366f1', fontSize:13 }}>
                  72의 법칙: 수익률 {annualRate}% → 자산 2배 달성까지 약 {(72 / annualRate).toFixed(1)}년
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 결과 */}
        <div className="space-y-5">
          {/* 최종 결과 */}
          <div style={{ padding:28, borderRadius:20, background:'linear-gradient(135deg,#eef2ff,#fdf4ff)', border:'1.5px solid rgba(99,102,241,0.2)', textAlign:'center' }}>
            <p style={{ fontSize:12, color:mutedColor, fontWeight:700, marginBottom:8 }}>{years}년 후 최종 자산</p>
            <p className="num" style={{ fontSize:38, fontWeight:900, color:'#6366f1', letterSpacing:'-0.03em' }}>
              {fmtB(result.fv)}
            </p>
            <div style={{ display:'flex', justifyContent:'center', gap:24, marginTop:10, fontSize:12, color:mutedColor }}>
              <span>총 투자금 <strong>{fmtB(result.totalInvested)}</strong></span>
              <span>수익률 <strong style={{ color:'#10b981' }}>{result.roi.toFixed(0)}%</strong></span>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <StatCard label="최종 자산" value={fmtB(result.fv)} color="#6366f1"/>
            <StatCard label="총 투자금" value={fmtB(result.totalInvested)} color="#8b5cf6"/>
            <StatCard label="총 수익" value={fmtB(result.profit)} color="#10b981"/>
            <StatCard label="실질 구매력" value={fmtB(result.realFv)} color="#f59e0b"
              sub={`물가 ${inflationRate}% 반영`}/>
          </div>

          {/* Milestone 표 */}
          <Card title="연도별 Milestone">
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, marginTop:8 }}>
              <thead>
                <tr style={{ borderBottom:'2px solid #e5e5ea' }}>
                  {['기간','최종 자산','총 투자금','수익','실질가치'].map((h) => (
                    <th key={h} style={{ padding:'8px 4px', textAlign:'right', fontSize:11, color:mutedColor, fontWeight:700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.milestones.map(({ yr, fv, invested, profit, realFv }) => {
                  const isCurrent = yr === years;
                  return (
                    <tr key={yr} style={{ borderBottom:'1px solid #f2f2f7', background: isCurrent ? '#f5f3ff' : 'transparent' }}>
                      <td style={{ padding:'10px 4px', fontWeight:700, color: isCurrent ? '#6366f1' : '#1d1d1f' }}>
                        {yr}년{isCurrent ? ' ★' : ''}
                      </td>
                      <td style={{ padding:'10px 4px', textAlign:'right', fontWeight: isCurrent ? 800 : 500, color: isCurrent ? '#6366f1' : '#1d1d1f' }}>{fmtB(fv)}</td>
                      <td style={{ padding:'10px 4px', textAlign:'right', color:mutedColor }}>{fmtB(invested)}</td>
                      <td style={{ padding:'10px 4px', textAlign:'right', color:'#10b981', fontWeight:600 }}>{fmtB(profit)}</td>
                      <td style={{ padding:'10px 4px', textAlign:'right', color:'#f59e0b' }}>{fmtB(realFv)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          <Card title="알아두세요">
            <div className="space-y-2" style={{ marginTop:8, fontSize:12, color:mutedColor, lineHeight:1.8 }}>
              {[
                '배당소득세 15.4%, ETF 환매 시 세금 등은 반영되지 않았습니다.',
                'S&P500 명목 수익률 연 10%는 과거 100년 장기 평균 기준입니다.',
                '환율 변동, 펀드 수수료에 따라 실제 수익은 달라집니다.',
                '중도 인출하지 않을수록 복리 효과가 극대화됩니다.',
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
