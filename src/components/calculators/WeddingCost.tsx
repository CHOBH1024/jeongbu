import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';

const INPUT_H: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'#f9f9fb', border:'1.5px solid #e5e5ea', borderRadius:10, fontSize:14, color:'#1d1d1f', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const mutedColor = '#6e6e73';
const fmt = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

interface CostItem {
  label: string;
  key: string;
  defaultVal: number;
  hint: string;
}

const COST_ITEMS: CostItem[] = [
  { label:'예식장·폐백·피로연', key:'ceremony', defaultVal:15000000, hint:'웨딩홀, 뷔페 포함' },
  { label:'혼수·가구·가전', key:'trousseau', defaultVal:20000000, hint:'가구, 전자제품, 침구 등' },
  { label:'신혼여행', key:'honeymoon', defaultVal:5000000, hint:'항공·숙박·관광 포함' },
  { label:'신혼집 보증금/전세금', key:'housing', defaultVal:200000000, hint:'전세·보증금 (실거주 비용)' },
  { label:'예물·예단', key:'gifts', defaultVal:5000000, hint:'반지, 시계, 예단 등' },
  { label:'청첩장·답례품 등 기타', key:'misc', defaultVal:2000000, hint:'청첩장, 사진, 답례품 등' },
];

export const WeddingCost = () => {
  const [costs, setCosts] = useState<Record<string, number>>(
    Object.fromEntries(COST_ITEMS.map(i => [i.key, i.defaultVal]))
  );
  const [guestCount, setGuestCount] = useState(200);
  const [avgGift, setAvgGift] = useState(80000);

  const result = useMemo(() => {
    const totalCost = Object.values(costs).reduce((s, v) => s + v, 0);
    const giftIncome = guestCount * avgGift;
    const netCost = totalCost - giftIncome;
    const nonHousingCost = totalCost - (costs.housing || 0);
    const netNonHousing = nonHousingCost - giftIncome;
    return { totalCost, giftIncome, netCost, nonHousingCost, netNonHousing };
  }, [costs, guestCount, avgGift]);

  const setCost = (key: string, val: number) => setCosts(prev => ({ ...prev, [key]: val }));

  const itemList = COST_ITEMS.map(i => ({ ...i, val: costs[i.key] ?? i.defaultVal }));

  return (
    <div className="space-y-6">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>
        <div className="space-y-5">
          <Card title="결혼 비용 항목">
            <div className="space-y-4" style={{ marginTop:8 }}>
              {itemList.map(item => (
                <div key={item.key}>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>{item.label}</label>
                  <input type="number" min={0} value={item.val} onChange={e => setCost(item.key, +e.target.value)} style={INPUT_H} step={1000000}/>
                  <p style={{ fontSize:11, color:'#aeaeb2', marginTop:4 }}>{item.hint}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="축의금 예상">
            <div className="space-y-4" style={{ marginTop:8 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>예상 하객 수 (명)</label>
                <input type="number" min={0} value={guestCount} onChange={e => setGuestCount(+e.target.value)} style={INPUT_H}/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>평균 축의금 (원/명)</label>
                <input type="number" min={0} step={10000} value={avgGift} onChange={e => setAvgGift(+e.target.value)} style={INPUT_H}/>
              </div>
              <div style={{ padding:'14px', borderRadius:12, background:'#eef2ff', fontSize:13, lineHeight:1.75 }}>
                <span style={{ fontWeight:700, color:'#6366f1' }}>예상 축의금 수입: </span>
                <span style={{ fontWeight:800 }}>{fmt(result.giftIncome)}</span>
                <br/>
                <span style={{ fontSize:11, color:mutedColor }}>{guestCount}명 × {fmt(avgGift)}/명</span>
              </div>
            </div>
          </Card>

          <div style={{
            padding:'28px', borderRadius:20,
            background:'linear-gradient(135deg,#eef2ff,#fdf4ff)',
            border:'1.5px solid rgba(99,102,241,0.2)',
            textAlign:'center',
          }}>
            <p style={{ fontSize:13, color:mutedColor, fontWeight:700, marginBottom:8 }}>총 결혼 비용</p>
            <p className="num" style={{ fontSize:36, fontWeight:900, color:'#6366f1', letterSpacing:'-0.03em', marginBottom:4 }}>
              {fmt(result.totalCost)}
            </p>
            <p style={{ fontSize:12, color:mutedColor }}>신혼집 포함</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <StatCard label="신혼집 제외 비용" value={fmt(result.nonHousingCost)} color="#8b5cf6"/>
            <StatCard label="예상 축의금" value={fmt(result.giftIncome)} color="#10b981"/>
            <StatCard
              label="순 지출 (신혼집 포함)"
              value={result.netCost >= 0 ? fmt(result.netCost) : `-${fmt(-result.netCost)}`}
              color={result.netCost >= 0 ? '#ef4444' : '#10b981'}
              sub="총비용 - 축의금"
            />
            <StatCard
              label="순 지출 (신혼집 제외)"
              value={result.netNonHousing >= 0 ? fmt(result.netNonHousing) : `-${fmt(-result.netNonHousing)}`}
              color={result.netNonHousing >= 0 ? '#f59e0b' : '#10b981'}
              sub="실질 웨딩 비용"
            />
          </div>

          <Card title="항목별 비용 요약">
            <div className="space-y-3" style={{ marginTop:8, fontSize:13, color:mutedColor }}>
              {itemList.map(item => (
                <div key={item.key} style={{ display:'flex', justifyContent:'space-between', paddingBottom:8, borderBottom:'1px solid #f2f2f7' }}>
                  <span>{item.label}</span>
                  <span style={{ fontWeight:700, color:'#1d1d1f' }}>{fmt(item.val)}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', paddingBottom:8, borderBottom:'1px solid #f2f2f7' }}>
                <span style={{ color:'#10b981' }}>(-) 예상 축의금</span>
                <span style={{ fontWeight:700, color:'#10b981' }}>-{fmt(result.giftIncome)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:4 }}>
                <span style={{ fontWeight:800, color:'#1d1d1f' }}>순 지출 합계</span>
                <span style={{ fontWeight:900, color:'#6366f1', fontSize:15 }}>{fmt(result.netCost)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
