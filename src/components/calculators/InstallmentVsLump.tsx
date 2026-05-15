import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';

const INPUT_H: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'#f9f9fb', border:'1.5px solid #e5e5ea', borderRadius:10, fontSize:14, color:'#1d1d1f', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const mutedColor = '#6e6e73';
const fmt = (n: number) => '₩' + Math.round(Math.abs(n)).toLocaleString('ko-KR');

const MONTHS = [3, 6, 12, 24, 36] as const;

export const InstallmentVsLump = () => {
  const [price, setPrice] = useState(1000000);
  const [months, setMonths] = useState<typeof MONTHS[number]>(12);
  const [feeRate, setFeeRate] = useState(0);
  const [investRate, setInvestRate] = useState(4);

  const result = useMemo(() => {
    const monthly = price / months;
    const totalFee = price * (feeRate / 100);
    const installmentTotal = price + totalFee;

    // 무이자 할부 시 남은 금액 투자 이득
    // 매월 monthly씩 지불하므로 i번째 달 지불 전까지 (months - i) * monthly를 운용
    let investGain = 0;
    const monthlyRate = investRate / 100 / 12;
    for (let i = 0; i < months; i++) {
      const remaining = (months - i) * monthly;
      investGain += remaining * monthlyRate;
    }

    const interestFreeRealCost = price - investGain;
    const interestBearingRealCost = installmentTotal;

    const diff0 = price - interestFreeRealCost; // 무이자 이득
    const diff1 = installmentTotal - price;      // 유이자 추가 비용

    return {
      monthly: Math.round(monthly),
      totalFee: Math.round(totalFee),
      installmentTotal: Math.round(installmentTotal),
      investGain: Math.round(investGain),
      interestFreeRealCost: Math.round(interestFreeRealCost),
      interestBearingRealCost: Math.round(interestBearingRealCost),
      diff0: Math.round(diff0),
      diff1: Math.round(diff1),
    };
  }, [price, months, feeRate, investRate]);

  const isInterestFree = feeRate === 0;

  return (
    <div className="space-y-6">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>
        <div className="space-y-5">
          <Card title="결제 조건 입력">
            <div className="space-y-4" style={{ marginTop:8 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>상품 가격 (원)</label>
                <input type="number" min={0} value={price} onChange={e => setPrice(+e.target.value)} style={INPUT_H} step={10000}/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>할부 개월 수</label>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {MONTHS.map(m => (
                    <button key={m} onClick={() => setMonths(m)} style={{
                      flex:'1 0 auto', padding:'9px 0', borderRadius:10, fontWeight:700, fontSize:13,
                      border:'1.5px solid',
                      background: months === m ? '#6366f1' : 'transparent',
                      color: months === m ? '#fff' : mutedColor,
                      borderColor: months === m ? '#6366f1' : '#e5e5ea',
                      cursor:'pointer',
                    }}>
                      {m}개월
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>
                  할부 수수료율 (%) — 0이면 무이자
                </label>
                <input type="number" min={0} max={30} step={0.1} value={feeRate} onChange={e => setFeeRate(+e.target.value)} style={INPUT_H}/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>
                  일시불 결제 시 포기 투자 수익률 (%/년)
                </label>
                <input type="number" min={0} max={30} step={0.1} value={investRate} onChange={e => setInvestRate(+e.target.value)} style={INPUT_H}/>
              </div>
            </div>
          </Card>

          <Card title="알아두세요 💡">
            <div className="space-y-3" style={{ marginTop:8 }}>
              {[
                '무이자 할부는 할부금을 투자에 활용하면 실질적으로 이득이 됩니다.',
                '유이자 할부는 수수료만큼 실질 비용이 늘어납니다.',
                '투자 수익률은 예금·채권 등 안정적 수익률을 기준으로 입력하세요.',
                '실제 카드사 수수료율은 상품·카드·프로모션에 따라 다릅니다.',
              ].map((tip, i) => (
                <div key={i} style={{ display:'flex', gap:8, fontSize:12, color:mutedColor }}>
                  <span style={{ flexShrink:0, color:'#6366f1', fontWeight:800 }}>{i+1}.</span>
                  <span style={{ lineHeight:1.7 }}>{tip}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <div style={{
            padding:'28px', borderRadius:20,
            background: isInterestFree ? 'linear-gradient(135deg,#ecfdf5,#d1fae5)' : 'linear-gradient(135deg,#fef3c7,#fde68a)',
            border: `1.5px solid ${isInterestFree ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
            textAlign:'center',
          }}>
            <p style={{ fontSize:13, color:mutedColor, fontWeight:700, marginBottom:8 }}>
              {isInterestFree ? '무이자 할부 실질 비용' : '유이자 할부 실질 비용'}
            </p>
            <p className="num" style={{ fontSize:36, fontWeight:900, color: isInterestFree ? '#10b981' : '#f59e0b', letterSpacing:'-0.03em', marginBottom:4 }}>
              {isInterestFree ? fmt(result.interestFreeRealCost) : fmt(result.interestBearingRealCost)}
            </p>
            <p style={{ fontSize:12, color:mutedColor }}>
              {isInterestFree
                ? `투자 이득 ₩${result.investGain.toLocaleString()} 제외`
                : `수수료 ₩${result.totalFee.toLocaleString()} 포함`}
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <StatCard label="월 할부금" value={fmt(result.monthly)} color="#6366f1" sub={`${months}개월`}/>
            <StatCard label="일시불 가격" value={fmt(price)} color="#8b5cf6"/>
            {isInterestFree ? (
              <StatCard label="투자 이득 (무이자)" value={fmt(result.investGain)} color="#10b981" sub={`연 ${investRate}% 기준`}/>
            ) : (
              <StatCard label="총 수수료" value={fmt(result.totalFee)} color="#ef4444" sub={`${feeRate}%`}/>
            )}
            <StatCard label="할부 총 지불" value={fmt(result.installmentTotal)} color="#f59e0b"/>
          </div>

          <Card title="유불리 판정">
            <div className="space-y-3" style={{ marginTop:8, fontSize:13 }}>
              {isInterestFree ? (
                <div style={{ padding:'16px', borderRadius:12, background:'#ecfdf5', border:'1px solid rgba(16,185,129,0.2)' }}>
                  <p style={{ fontWeight:800, color:'#10b981', marginBottom:4 }}>무이자 할부가 유리합니다!</p>
                  <p style={{ color:mutedColor, lineHeight:1.7 }}>
                    {months}개월 무이자 할부 시 투자 이득 <strong>₩{result.investGain.toLocaleString()}</strong>만큼
                    실질 비용이 줄어듭니다. 일시불보다 <strong>₩{result.diff0.toLocaleString()}</strong> 절약 효과.
                  </p>
                </div>
              ) : (
                <div style={{ padding:'16px', borderRadius:12, background:'#fef3c7', border:'1px solid rgba(245,158,11,0.2)' }}>
                  <p style={{ fontWeight:800, color:'#d97706', marginBottom:4 }}>일시불이 유리합니다!</p>
                  <p style={{ color:mutedColor, lineHeight:1.7 }}>
                    유이자 할부 시 수수료 <strong>₩{result.totalFee.toLocaleString()}</strong>가 추가됩니다.
                    일시불 대비 <strong>₩{result.diff1.toLocaleString()}</strong> 추가 지출.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
