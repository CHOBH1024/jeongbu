import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';

const INPUT_H: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'#f9f9fb', border:'1.5px solid #e5e5ea', borderRadius:10, fontSize:14, color:'#1d1d1f', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const mutedColor = '#6e6e73';
const fmt = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

// 로또 6/45 확률 및 당첨금
const PRIZES = [
  { rank: '1등', prob: 1 / 8145060, prize: 2000000000, label: '6개 번호 일치' },
  { rank: '2등', prob: 1 / 1357510, prize: 60000000,   label: '5개 + 보너스' },
  { rank: '3등', prob: 1 / 35724,   prize: 1500000,    label: '5개 번호 일치' },
  { rank: '4등', prob: 1 / 733,     prize: 50000,      label: '4개 번호 일치' },
  { rank: '5등', prob: 1 / 45,      prize: 5000,       label: '3개 번호 일치' },
];

const EXPECTED_VALUE = PRIZES.reduce((s, p) => s + p.prob * p.prize, 0);
const TICKET_PRICE = 1000;

// S&P500 연 10% 복리 20년
function spCompound(monthly: number, years: number, annualRate: number) {
  const r = annualRate / 12;
  const n = years * 12;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

export const LottoExpectation = () => {
  const [monthlyBuy, setMonthlyBuy] = useState(10000);

  const result = useMemo(() => {
    const tickets = monthlyBuy / TICKET_PRICE;
    const expectedMonthly = tickets * EXPECTED_VALUE;
    const lossMonthly = monthlyBuy - expectedMonthly;
    const lossYearly = lossMonthly * 12;
    const sp20y = spCompound(monthlyBuy, 20, 0.10);
    const totalSpent20y = monthlyBuy * 12 * 20;
    const opportunityCost20y = sp20y - totalSpent20y;
    return { tickets, expectedMonthly, lossMonthly, lossYearly, sp20y, totalSpent20y, opportunityCost20y };
  }, [monthlyBuy]);

  return (
    <div className="space-y-6">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>
        <div className="space-y-5">
          <Card title="월 구매 금액">
            <div style={{ marginTop:8 }}>
              <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>
                월 로또 구매 금액 (원)
              </label>
              <input type="number" min={1000} step={1000} value={monthlyBuy} onChange={e => setMonthlyBuy(+e.target.value)} style={INPUT_H}/>
              <p style={{ fontSize:11, color:'#aeaeb2', marginTop:4 }}>
                {Math.floor(monthlyBuy / 1000).toLocaleString()}장 구매
              </p>
            </div>
          </Card>

          <Card title="등수별 당첨 확률">
            <div className="space-y-3" style={{ marginTop:8, fontSize:13 }}>
              {PRIZES.map(p => (
                <div key={p.rank} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:8, borderBottom:'1px solid #f2f2f7' }}>
                  <div>
                    <span style={{ fontWeight:700, color:'#1d1d1f' }}>{p.rank}</span>
                    <span style={{ fontSize:11, color:mutedColor, marginLeft:6 }}>{p.label}</span>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontWeight:700, color:'#6366f1' }}>{fmt(p.prize)}</div>
                    <div style={{ fontSize:11, color:mutedColor }}>1/{Math.round(1/p.prob).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <div style={{
            padding:'28px', borderRadius:20,
            background:'linear-gradient(135deg,#fef3c7,#fde68a)',
            border:'1.5px solid rgba(245,158,11,0.3)',
            textAlign:'center',
          }}>
            <p style={{ fontSize:13, color:mutedColor, fontWeight:700, marginBottom:8 }}>1장당 기대값</p>
            <p className="num" style={{ fontSize:36, fontWeight:900, color:'#d97706', letterSpacing:'-0.03em', marginBottom:4 }}>
              {fmt(EXPECTED_VALUE)}
            </p>
            <p style={{ fontSize:12, color:mutedColor }}>구매가 ₩1,000의 약 {(EXPECTED_VALUE/TICKET_PRICE*100).toFixed(0)}% 수준</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <StatCard label="월 기대 수익" value={fmt(result.expectedMonthly)} color="#f59e0b"/>
            <StatCard label="월 기대 손실" value={`-${fmt(result.lossMonthly)}`} color="#ef4444"/>
            <StatCard label="연 기대 손실" value={`-${fmt(result.lossYearly)}`} color="#ef4444"/>
            <StatCard label="20년 S&P500 투자 시" value={fmt(result.sp20y)} color="#10b981" sub="연 10% 복리"/>
          </div>

          <Card title="재미있는 사실 Facts">
            <div className="space-y-4" style={{ marginTop:8 }}>
              <div style={{ padding:'14px', borderRadius:12, background:'#fef3c7', fontSize:13, lineHeight:1.75 }}>
                <strong>벼락 맞을 확률과 비교</strong><br/>
                <span style={{ color:mutedColor }}>
                  1등 확률(1/8,145,060) ≈ 벼락 맞을 확률(1/100만)의 약 1/8.<br/>
                  즉, 벼락 맞기보다 1등 당첨이 8배 더 어렵습니다.
                </span>
              </div>
              <div style={{ padding:'14px', borderRadius:12, background:'#ecfdf5', fontSize:13, lineHeight:1.75 }}>
                <strong>20년 투자 기회비용</strong><br/>
                <span style={{ color:mutedColor }}>
                  같은 돈을 S&P500에 투자하면 20년 후 <strong style={{ color:'#10b981' }}>{fmt(result.sp20y)}</strong>.<br/>
                  총 투입 {fmt(result.totalSpent20y)} 대비 수익 {fmt(result.opportunityCost20y)}.
                </span>
              </div>
              <div style={{ padding:'14px', borderRadius:12, background:'#eef2ff', fontSize:13, lineHeight:1.75 }}>
                <strong>매주 1장씩 산다면?</strong><br/>
                <span style={{ color:mutedColor }}>
                  매주 1장씩 사면 1등 당첨까지 통계적으로 약 <strong style={{ color:'#6366f1' }}>
                    {Math.round(8145060 / 52 / 10).toLocaleString()}백 년
                  </strong> 걸립니다.
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
