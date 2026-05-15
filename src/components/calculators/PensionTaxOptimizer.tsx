import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Info, TrendingUp } from 'lucide-react';

const INPUT_H: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'#f9f9fb', border:'1.5px solid #e5e5ea', borderRadius:10, fontSize:14, color:'#1d1d1f', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const mutedColor = '#6e6e73';

/* 2025년 세액공제 한도 */
const PENSION_LIMIT   = 6_000_000;   // 연금저축 한도
const IRP_EXTRA_LIMIT = 3_000_000;   // IRP 추가 한도 (연금저축 + IRP = 9,000,000)
const TOTAL_LIMIT     = 9_000_000;   // 합산 한도

/* 세액공제율 */
function taxCreditRate(totalSalary: number): number {
  return totalSalary <= 55_000_000 ? 0.165 : 0.132;
}

export const PensionTaxOptimizer = () => {
  const [totalSalary, setTotalSalary]   = useState(60_000_000);
  const [pensionPay, setPensionPay]     = useState(3_000_000);
  const [irpPay, setIrpPay]             = useState(1_000_000);
  const [isSelfEmployed, setIsSelfEmployed] = useState(false);

  const result = useMemo(() => {
    const rate = taxCreditRate(isSelfEmployed ? 0 : totalSalary); // 종소세는 항상 16.5%

    /* 현재 납입액 기준 공제 */
    const pensionCapped   = Math.min(pensionPay, PENSION_LIMIT);
    const irpCapped       = Math.min(irpPay, IRP_EXTRA_LIMIT);
    const currentTotal    = Math.min(pensionCapped + irpCapped, TOTAL_LIMIT);
    const currentCredit   = Math.floor(currentTotal * rate);

    /* 최대 납입 시 공제 */
    const maxCredit = Math.floor(TOTAL_LIMIT * rate);

    /* 추가 납입 권장 */
    const additionalNeeded  = Math.max(0, TOTAL_LIMIT - (pensionPay + irpPay));
    const additionalCredit  = Math.max(0, maxCredit - currentCredit);

    /* 최적 분배 제안 */
    const optimalPension = Math.min(PENSION_LIMIT, pensionPay + additionalNeeded);
    const optimalIrp     = Math.min(IRP_EXTRA_LIMIT, TOTAL_LIMIT - optimalPension);

    return {
      rate: rate * 100,
      pensionCapped,
      irpCapped,
      currentTotal,
      currentCredit,
      maxCredit,
      additionalNeeded,
      additionalCredit,
      optimalPension,
      optimalIrp,
    };
  }, [totalSalary, pensionPay, irpPay, isSelfEmployed]);

  const fmt = (n: number) => '₩' + n.toLocaleString('ko-KR');
  const fmtM = (n: number) => `${(n / 10_000).toFixed(0)}만`;

  return (
    <div className="space-y-6">
      <div style={{ padding:'12px 18px', borderRadius:12, fontSize:12, background:'#fffbeb', border:'1px solid #fde68a', color:'#92400e', display:'flex', alignItems:'flex-start', gap:8 }}>
        <Info size={14} style={{ flexShrink:0, marginTop:1 }}/>
        <span>2025년 세법 기준 &middot; 소득세법 §59의3 &middot; 연금저축 한도 600만, IRP 추가 300만 (합산 최대 900만) &middot; 참고용입니다.</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>

        {/* 입력 */}
        <div className="space-y-5">
          <Card title="소득 정보" icon={<TrendingUp size={18}/>}>
            <div className="space-y-4" style={{ marginTop:8 }}>
              <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', fontSize:13, padding:'10px 14px', borderRadius:10, background: isSelfEmployed ? '#eef2ff' : '#f9f9fb', border:`1.5px solid ${isSelfEmployed ? '#6366f1' : '#e5e5ea'}` }}>
                <input type="checkbox" checked={isSelfEmployed} onChange={(e) => setIsSelfEmployed(e.target.checked)} style={{ accentColor:'#6366f1', width:16, height:16 }}/>
                <span style={{ fontWeight: isSelfEmployed ? 700 : 500, color: isSelfEmployed ? '#6366f1' : '#1d1d1f' }}>종합소득세 신고자 (항상 16.5% 적용)</span>
              </label>

              {!isSelfEmployed && (
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>
                    총 급여 (원/년) <span style={{ color:'#aeaeb2', fontWeight:400 }}>5,500만 초과 시 13.2%</span>
                  </label>
                  <input type="number" value={totalSalary} step={1_000_000}
                    onChange={(e) => setTotalSalary(+e.target.value)} style={INPUT_H}/>
                </div>
              )}
            </div>
          </Card>

          <Card title="현재 납입액">
            <div className="space-y-4" style={{ marginTop:8 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>
                  연금저축 납입액 (원/년) <span style={{ color:'#aeaeb2', fontWeight:400 }}>한도 600만</span>
                </label>
                <input type="number" value={pensionPay} step={100_000} max={PENSION_LIMIT}
                  onChange={(e) => setPensionPay(+e.target.value)} style={INPUT_H}/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>
                  IRP 납입액 (원/년) <span style={{ color:'#aeaeb2', fontWeight:400 }}>추가 한도 300만</span>
                </label>
                <input type="number" value={irpPay} step={100_000} max={IRP_EXTRA_LIMIT}
                  onChange={(e) => setIrpPay(+e.target.value)} style={INPUT_H}/>
              </div>
            </div>
          </Card>
        </div>

        {/* 결과 */}
        <div className="space-y-5">
          {/* 핵심 결과 */}
          <div style={{ padding:28, borderRadius:20, background:'linear-gradient(135deg,#eef2ff,#fdf4ff)', border:'1.5px solid rgba(99,102,241,0.2)', textAlign:'center' }}>
            <p style={{ fontSize:12, color:mutedColor, fontWeight:700, marginBottom:4 }}>현재 세액공제 예상</p>
            <p className="num" style={{ fontSize:38, fontWeight:900, color:'#6366f1', letterSpacing:'-0.03em' }}>
              {fmt(result.currentCredit)}
            </p>
            <p style={{ fontSize:12, color:mutedColor, marginTop:4 }}>세액공제율 {result.rate.toFixed(1)}%</p>
          </div>

          {/* 상세 */}
          <Card title="공제 상세">
            <div className="space-y-3" style={{ marginTop:8, fontSize:13, color:mutedColor }}>
              {[
                ['적용 세액공제율',    `${result.rate.toFixed(1)}%`],
                ['연금저축 공제 적용액',  fmt(result.pensionCapped)],
                ['IRP 공제 적용액',       fmt(result.irpCapped)],
                ['합산 공제 적용액',      fmt(result.currentTotal)],
                ['현재 세액공제',         fmt(result.currentCredit)],
                ['최대 납입 시 세액공제', fmt(result.maxCredit)],
              ].map(([k, v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', paddingBottom:8, borderBottom:'1px solid #f2f2f7' }}>
                  <span>{k}</span>
                  <span style={{ fontWeight:700, color:'#1d1d1f' }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 추가 납입 권장 */}
          {result.additionalNeeded > 0 && (
            <div style={{ padding:20, borderRadius:16, background:'linear-gradient(135deg,#ecfdf5,#d1fae5)', border:'1.5px solid rgba(16,185,129,0.25)' }}>
              <p style={{ fontSize:13, fontWeight:800, color:'#10b981', marginBottom:12 }}>추가 납입 시 환급 최대화</p>
              <div className="space-y-3" style={{ fontSize:12, color:mutedColor }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span>추가 납입 권장액</span>
                  <span style={{ fontWeight:700, color:'#10b981' }}>{fmt(result.additionalNeeded)}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span>추가 환급 예상액</span>
                  <span style={{ fontWeight:900, color:'#10b981', fontSize:14 }}>{fmt(result.additionalCredit)}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span>최적 연금저축</span>
                  <span style={{ fontWeight:700 }}>{fmt(result.optimalPension)}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span>최적 IRP</span>
                  <span style={{ fontWeight:700 }}>{fmt(result.optimalIrp)}</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <StatCard label="현재 환급액" value={`${fmtM(result.currentCredit)}원`} color="#6366f1"/>
            <StatCard label="최대 환급액" value={`${fmtM(result.maxCredit)}원`} color="#10b981"/>
            <StatCard label="추가 납입액" value={fmt(result.additionalNeeded)} color="#f59e0b"/>
            <StatCard label="추가 환급액" value={fmt(result.additionalCredit)} color="#ec4899"/>
          </div>

          <Card title="알아두세요">
            <div className="space-y-2" style={{ marginTop:8, fontSize:12, color:mutedColor, lineHeight:1.8 }}>
              {[
                '연금저축(펀드·보험·신탁) 한도 600만 + IRP 추가 300만 = 최대 900만.',
                '총급여 5,500만원 이하 또는 종합소득 4,000만원 이하 → 16.5%.',
                '퇴직연금(DB) 본인 추가 부담금도 IRP 한도에 포함됩니다.',
                '55세 이후 연금 수령 시 연금소득세(3.3~5.5%) 별도 적용.',
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
