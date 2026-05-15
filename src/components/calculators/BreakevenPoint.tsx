import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';

const INPUT_H: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'#f9f9fb', border:'1.5px solid #e5e5ea', borderRadius:10, fontSize:14, color:'#1d1d1f', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const mutedColor = '#6e6e73';
const fmt = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

export const BreakevenPoint = () => {
  const [fixedCost, setFixedCost] = useState(5000000);
  const [price, setPrice] = useState(15000);
  const [variableCost, setVariableCost] = useState(7000);
  const [targetProfit, setTargetProfit] = useState(2000000);

  const result = useMemo(() => {
    const contribution = price - variableCost;
    if (contribution <= 0) return null;

    const contributionRate = (contribution / price) * 100;
    const bepQty = Math.ceil(fixedCost / contribution);
    const bepSales = fixedCost / (contributionRate / 100);
    const targetQty = Math.ceil((fixedCost + targetProfit) / contribution);
    const targetSales = (fixedCost + targetProfit) / (contributionRate / 100);

    return { contribution, contributionRate, bepQty, bepSales, targetQty, targetSales };
  }, [fixedCost, price, variableCost, targetProfit]);

  // BEP 시각화 테이블 (수량 구간별 손익)
  const tableRows = useMemo(() => {
    if (!result) return [];
    const bep = result.bepQty;
    const points = [
      Math.floor(bep * 0.25),
      Math.floor(bep * 0.5),
      Math.floor(bep * 0.75),
      bep,
      Math.ceil(bep * 1.25),
      Math.ceil(bep * 1.5),
    ].filter((v, i, a) => v > 0 && a.indexOf(v) === i);

    return points.map(qty => ({
      qty,
      revenue: qty * price,
      totalCost: fixedCost + qty * variableCost,
      profit: qty * price - fixedCost - qty * variableCost,
    }));
  }, [result, price, variableCost, fixedCost]);

  return (
    <div className="space-y-6">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>
        <div className="space-y-5">
          <Card title="비용 구조 입력">
            <div className="space-y-4" style={{ marginTop:8 }}>
              {[
                { label:'월 고정비 합계 (원)', val:fixedCost, set:setFixedCost, hint:'임차료, 인건비, 감가상각 등', step:100000 },
                { label:'상품·서비스 단가 (원)', val:price, set:setPrice, hint:'판매 단가', step:1000 },
                { label:'단위당 변동비 (원)', val:variableCost, set:setVariableCost, hint:'원재료, 포장비 등', step:1000 },
                { label:'목표 월 이익 (원, 선택)', val:targetProfit, set:setTargetProfit, hint:'달성하고 싶은 월 이익', step:100000 },
              ].map(({ label, val, set, hint, step }) => (
                <div key={label}>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>{label}</label>
                  <input type="number" min={0} value={val} onChange={e => set(+e.target.value)} style={INPUT_H} step={step}/>
                  <p style={{ fontSize:11, color:'#aeaeb2', marginTop:4 }}>{hint}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          {result === null ? (
            <div style={{ padding:24, borderRadius:16, background:'#fef2f2', border:'1.5px solid #fca5a5', color:'#b91c1c', fontSize:14 }}>
              단가가 변동비보다 커야 합니다. 공헌이익이 0 이하이면 손익분기점이 없습니다.
            </div>
          ) : (
            <>
              <div style={{
                padding:'28px', borderRadius:20,
                background:'linear-gradient(135deg,#eef2ff,#fdf4ff)',
                border:'1.5px solid rgba(99,102,241,0.2)',
                textAlign:'center',
              }}>
                <p style={{ fontSize:13, color:mutedColor, fontWeight:700, marginBottom:8 }}>손익분기점 (BEP) 월매출</p>
                <p className="num" style={{ fontSize:36, fontWeight:900, color:'#6366f1', letterSpacing:'-0.03em', marginBottom:4 }}>
                  {fmt(result.bepSales)}
                </p>
                <p style={{ fontSize:12, color:mutedColor }}>{result.bepQty.toLocaleString()}개 판매 시 BEP 달성</p>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <StatCard label="공헌이익 (단위당)" value={fmt(result.contribution)} color="#6366f1"/>
                <StatCard label="공헌이익률" value={`${result.contributionRate.toFixed(1)}%`} color="#8b5cf6"/>
                <StatCard label="BEP 수량" value={`${result.bepQty.toLocaleString()}개`} color="#10b981"/>
                <StatCard label="목표이익 달성 수량" value={`${result.targetQty.toLocaleString()}개`} color="#f59e0b" sub={`월 ${fmt(targetProfit)} 목표`}/>
              </div>

              <Card title="손익 시뮬레이션">
                <div style={{ marginTop:8, overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                    <thead>
                      <tr style={{ borderBottom:'2px solid #e5e5ea' }}>
                        {['판매 수량','매출','총비용','손익'].map(h => (
                          <th key={h} style={{ textAlign:'right', padding:'6px 8px', color:mutedColor, fontWeight:700, fontSize:12 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map(row => (
                        <tr key={row.qty} style={{
                          borderBottom:'1px solid #f2f2f7',
                          background: row.qty === result.bepQty ? '#eef2ff' : 'transparent',
                        }}>
                          <td style={{ textAlign:'right', padding:'7px 8px', fontWeight: row.qty === result.bepQty ? 800 : 400 }}>
                            {row.qty.toLocaleString()}{row.qty === result.bepQty ? ' ★' : ''}
                          </td>
                          <td style={{ textAlign:'right', padding:'7px 8px' }}>{fmt(row.revenue)}</td>
                          <td style={{ textAlign:'right', padding:'7px 8px' }}>{fmt(row.totalCost)}</td>
                          <td style={{ textAlign:'right', padding:'7px 8px', fontWeight:700, color: row.profit >= 0 ? '#10b981' : '#ef4444' }}>
                            {row.profit >= 0 ? '+' : ''}{fmt(row.profit)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{ fontSize:11, color:'#aeaeb2', marginTop:8 }}>★ = 손익분기점</p>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
