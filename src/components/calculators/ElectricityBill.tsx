import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';

const INPUT_H: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'#f9f9fb', border:'1.5px solid #e5e5ea', borderRadius:10, fontSize:14, color:'#1d1d1f', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const mutedColor = '#6e6e73';
const fmt = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

type Season = 'other' | 'summer';

function calcElectricity(kwh: number, season: Season) {
  let basicFee = 0;
  let energyFee = 0;

  if (season === 'other') {
    // 기타계절 기본요금
    if (kwh <= 200) basicFee = 910;
    else if (kwh <= 400) basicFee = 1600;
    else basicFee = 7300;

    // 기타계절 전력량 요금
    if (kwh <= 200) {
      energyFee = kwh * 112.0;
    } else if (kwh <= 400) {
      energyFee = 200 * 112.0 + (kwh - 200) * 206.6;
    } else {
      energyFee = 200 * 112.0 + 200 * 206.6 + (kwh - 400) * 299.3;
    }
  } else {
    // 하계 기본요금
    if (kwh <= 200) basicFee = 910;
    else if (kwh <= 400) basicFee = 1600;
    else basicFee = 7300;

    // 하계 전력량 요금
    if (kwh <= 300) {
      energyFee = kwh * 112.0;
    } else if (kwh <= 450) {
      energyFee = 300 * 112.0 + (kwh - 300) * 206.6;
    } else {
      energyFee = 300 * 112.0 + 150 * 206.6 + (kwh - 450) * 299.3;
    }
  }

  const climateFee = kwh * 9.0;
  const fuelFee = kwh * 5.0;
  const subtotal = basicFee + energyFee + climateFee + fuelFee;
  const vat = subtotal * 0.10;
  const fundFee = subtotal * 0.037;
  const total = subtotal + vat + fundFee;

  return { basicFee, energyFee, climateFee, fuelFee, subtotal, vat, fundFee, total };
}

export const ElectricityBill = () => {
  const [kwh, setKwh] = useState(300);
  const [season, setSeason] = useState<Season>('other');

  const result = useMemo(() => calcElectricity(kwh, season), [kwh, season]);

  const rows = [
    ['기본요금', result.basicFee],
    ['전력량 요금', result.energyFee],
    ['기후환경요금', result.climateFee],
    ['연료비조정액', result.fuelFee],
    ['부가가치세 (10%)', result.vat],
    ['전력산업기반기금 (3.7%)', result.fundFee],
  ] as const;

  return (
    <div className="space-y-6">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>
        <div className="space-y-5">
          <Card title="전기 사용 정보">
            <div className="space-y-4" style={{ marginTop:8 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>
                  월 사용량 (kWh)
                </label>
                <input type="number" min={0} value={kwh} onChange={e => setKwh(+e.target.value)} style={INPUT_H}/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>계절</label>
                <div style={{ display:'flex', gap:8 }}>
                  {(['other','summer'] as const).map(s => (
                    <button key={s} onClick={() => setSeason(s)} style={{
                      flex:1, padding:'10px 0', borderRadius:10, fontWeight:700, fontSize:13,
                      border:'1.5px solid',
                      background: season === s ? '#6366f1' : 'transparent',
                      color: season === s ? '#fff' : mutedColor,
                      borderColor: season === s ? '#6366f1' : '#e5e5ea',
                      cursor:'pointer',
                    }}>
                      {s === 'other' ? '기타계절 (9~6월)' : '하계 (7~8월)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card title="알아두세요 💡">
            <div className="space-y-3" style={{ marginTop:8 }}>
              {[
                '2026년 주택용 전력(저압) 누진 3단계 기준입니다.',
                '하계(7~8월)는 1단계 구간이 300kWh로 확대됩니다.',
                '기후환경요금 9.0원/kWh, 연료비조정액 5.0원/kWh 포함.',
                '실제 청구액은 소수점 처리 방식에 따라 약간 다를 수 있습니다.',
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
            background:'linear-gradient(135deg,#eef2ff,#fdf4ff)',
            border:'1.5px solid rgba(99,102,241,0.2)',
            textAlign:'center',
          }}>
            <p style={{ fontSize:13, color:mutedColor, fontWeight:700, marginBottom:8 }}>이번 달 예상 청구액</p>
            <p className="num" style={{ fontSize:36, fontWeight:900, color:'#6366f1', letterSpacing:'-0.03em', marginBottom:4 }}>
              {fmt(result.total)}
            </p>
            <p style={{ fontSize:12, color:mutedColor }}>{kwh.toLocaleString()} kWh 기준 · {season === 'other' ? '기타계절' : '하계'}</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <StatCard label="기본요금" value={fmt(result.basicFee)} color="#6366f1"/>
            <StatCard label="전력량 요금" value={fmt(result.energyFee)} color="#8b5cf6"/>
            <StatCard label="기후환경요금" value={fmt(result.climateFee)} color="#10b981"/>
            <StatCard label="연료비조정액" value={fmt(result.fuelFee)} color="#f59e0b"/>
          </div>

          <Card title="항목별 상세 내역">
            <div className="space-y-3" style={{ marginTop:8, fontSize:13, color:mutedColor }}>
              {rows.map(([k, v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', paddingBottom:8, borderBottom:'1px solid #f2f2f7' }}>
                  <span>{k}</span><span style={{ fontWeight:700, color:'#1d1d1f' }}>{fmt(v)}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:4 }}>
                <span style={{ fontWeight:800, color:'#1d1d1f' }}>총 청구액</span>
                <span style={{ fontWeight:900, color:'#6366f1', fontSize:15 }}>{fmt(result.total)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
