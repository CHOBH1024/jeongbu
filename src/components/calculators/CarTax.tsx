import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';

const INPUT_H: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'#f9f9fb', border:'1.5px solid #e5e5ea', borderRadius:10, fontSize:14, color:'#1d1d1f', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const mutedColor = '#6e6e73';
const fmt = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

type CarType = 'passenger' | 'van' | 'truck';

function getAgeDiscount(carYear: number): number {
  const age = 2026 - carYear;
  if (age <= 2) return 0;
  if (age === 3) return 0.05;
  if (age === 4) return 0.10;
  if (age === 5) return 0.15;
  if (age === 6) return 0.20;
  if (age === 7) return 0.25;
  if (age === 8) return 0.30;
  if (age === 9) return 0.35;
  if (age === 10) return 0.40;
  if (age === 11) return 0.45;
  return 0.50;
}

function calcCarTax(carType: CarType, cc: number, carYear: number) {
  let baseTax = 0;

  if (carType === 'passenger') {
    let ratePerCc = 0;
    if (cc <= 1000) ratePerCc = 80;
    else if (cc <= 1600) ratePerCc = 140;
    else ratePerCc = 200;
    baseTax = cc * ratePerCc;
  } else if (carType === 'van') {
    baseTax = 65000;
  } else {
    baseTax = 28500;
  }

  const discount = getAgeDiscount(carYear);
  const afterDiscount = Math.floor(baseTax * (1 - discount));
  const educationTax = Math.floor(afterDiscount * 0.30);
  const annual = afterDiscount + educationTax;
  const earlyPayment = Math.floor(annual * 0.90);

  return { baseTax, discount, afterDiscount, educationTax, annual, earlyPayment };
}

export const CarTax = () => {
  const [carType, setCarType] = useState<CarType>('passenger');
  const [cc, setCc] = useState(1998);
  const [carYear, setCarYear] = useState(2020);

  const result = useMemo(() => calcCarTax(carType, cc, carYear), [carType, cc, carYear]);

  const carAge = 2026 - carYear;

  return (
    <div className="space-y-6">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>
        <div className="space-y-5">
          <Card title="차량 정보">
            <div className="space-y-4" style={{ marginTop:8 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>차종</label>
                <div style={{ display:'flex', gap:8 }}>
                  {(['passenger','van','truck'] as const).map(t => (
                    <button key={t} onClick={() => setCarType(t)} style={{
                      flex:1, padding:'10px 0', borderRadius:10, fontWeight:700, fontSize:12,
                      border:'1.5px solid',
                      background: carType === t ? '#6366f1' : 'transparent',
                      color: carType === t ? '#fff' : mutedColor,
                      borderColor: carType === t ? '#6366f1' : '#e5e5ea',
                      cursor:'pointer',
                    }}>
                      {t === 'passenger' ? '승용차' : t === 'van' ? '승합차' : '화물차'}
                    </button>
                  ))}
                </div>
              </div>

              {carType === 'passenger' && (
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>
                    배기량 (cc)
                  </label>
                  <input type="number" min={100} value={cc} onChange={e => setCc(+e.target.value)} style={INPUT_H}/>
                  <p style={{ fontSize:11, color:'#aeaeb2', marginTop:4 }}>
                    {cc <= 1000 ? '80원/cc' : cc <= 1600 ? '140원/cc' : '200원/cc'} 구간
                  </p>
                </div>
              )}

              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>
                  차량 연식 (년도)
                </label>
                <input type="number" min={1990} max={2026} value={carYear} onChange={e => setCarYear(+e.target.value)} style={INPUT_H}/>
                <p style={{ fontSize:11, color:'#aeaeb2', marginTop:4 }}>
                  차령 {carAge}년 · 감경률 {Math.round(result.discount * 100)}%
                </p>
              </div>
            </div>
          </Card>

          <Card title="알아두세요 💡">
            <div className="space-y-3" style={{ marginTop:8 }}>
              {[
                '승용차 배기량 기준: 1000cc 이하 80원, 1001~1600cc 140원, 1601cc 이상 200원/cc.',
                '차령 3년부터 5%씩 추가 감경, 12년 이상 최대 50% 감경.',
                '지방교육세는 자동차세의 30%입니다.',
                '1월에 연납 신청 시 연간 합계의 10%를 할인받을 수 있습니다.',
                '승합차·화물차는 정액세율 적용입니다.',
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
            <p style={{ fontSize:13, color:mutedColor, fontWeight:700, marginBottom:8 }}>연간 자동차세 합계</p>
            <p className="num" style={{ fontSize:36, fontWeight:900, color:'#6366f1', letterSpacing:'-0.03em', marginBottom:4 }}>
              {fmt(result.annual)}
            </p>
            <p style={{ fontSize:12, color:mutedColor }}>자동차세 + 지방교육세</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <StatCard label="자동차세" value={fmt(result.afterDiscount)} color="#6366f1"/>
            <StatCard label="지방교육세" value={fmt(result.educationTax)} color="#8b5cf6"/>
            <StatCard label="연납할인 (10%)" value={fmt(result.earlyPayment)} color="#10b981" sub="1월 납부 시"/>
            <StatCard label="감경률" value={`${Math.round(result.discount * 100)}%`} color="#f59e0b" sub={`차령 ${carAge}년`}/>
          </div>

          <Card title="세금 계산 내역">
            <div className="space-y-3" style={{ marginTop:8, fontSize:13, color:mutedColor }}>
              {[
                ['기준 세액 (감경 전)', fmt(result.baseTax)],
                [`차령 감경 (${Math.round(result.discount*100)}%)`, `-${fmt(result.baseTax * result.discount)}`],
                ['감경 후 자동차세', fmt(result.afterDiscount)],
                ['지방교육세 (30%)', fmt(result.educationTax)],
              ].map(([k, v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', paddingBottom:8, borderBottom:'1px solid #f2f2f7' }}>
                  <span>{k}</span><span style={{ fontWeight:700, color:'#1d1d1f' }}>{v}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:4 }}>
                <span style={{ fontWeight:800, color:'#1d1d1f' }}>연간 합계</span>
                <span style={{ fontWeight:900, color:'#6366f1', fontSize:15 }}>{fmt(result.annual)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
