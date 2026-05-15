import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';

const INPUT_H: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'#f9f9fb', border:'1.5px solid #e5e5ea', borderRadius:10, fontSize:14, color:'#1d1d1f', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const mutedColor = '#6e6e73';
const fmt = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

export const FreelanceRate = () => {
  const [targetNet, setTargetNet] = useState(50000000);
  const [vacationDays, setVacationDays] = useState(20);
  const [weeklyHours, setWeeklyHours] = useState(40);
  const [billableRatio, setBillableRatio] = useState(70);
  const [taxRate, setTaxRate] = useState(20);

  const result = useMemo(() => {
    const grossNeeded = targetNet / (1 - taxRate / 100);
    const hoursPerDay = weeklyHours / 5;
    const annualWorkHours = 52 * weeklyHours - vacationDays * hoursPerDay;
    const billableHours = annualWorkHours * (billableRatio / 100);
    const hourlyRate = grossNeeded / billableHours;
    const dailyRate = hourlyRate * hoursPerDay;
    const monthlyRevenue = grossNeeded / 12;
    const netCheck = grossNeeded * (1 - taxRate / 100);

    return {
      grossNeeded,
      annualWorkHours,
      billableHours,
      hourlyRate,
      dailyRate,
      monthlyRevenue,
      netCheck,
    };
  }, [targetNet, vacationDays, weeklyHours, billableRatio, taxRate]);

  return (
    <div className="space-y-6">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>
        <div className="space-y-5">
          <Card title="프리랜서 조건 입력">
            <div className="space-y-4" style={{ marginTop:8 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>원하는 연 실수령액 (원)</label>
                <input type="number" min={0} value={targetNet} onChange={e => setTargetNet(+e.target.value)} style={INPUT_H} step={1000000}/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>예상 세율 (%)</label>
                <input type="number" min={0} max={60} step={1} value={taxRate} onChange={e => setTaxRate(+e.target.value)} style={INPUT_H}/>
                <p style={{ fontSize:11, color:'#aeaeb2', marginTop:4 }}>종합소득세 + 지방세 합산 실효세율</p>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>연간 유급 휴가 일수 (일)</label>
                <input type="number" min={0} max={365} value={vacationDays} onChange={e => setVacationDays(+e.target.value)} style={INPUT_H}/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>주 근무 시간</label>
                <input type="number" min={1} max={80} value={weeklyHours} onChange={e => setWeeklyHours(+e.target.value)} style={INPUT_H}/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>
                  실제 청구 가능 시간 비율 (%)
                </label>
                <input type="number" min={1} max={100} value={billableRatio} onChange={e => setBillableRatio(+e.target.value)} style={INPUT_H}/>
                <p style={{ fontSize:11, color:'#aeaeb2', marginTop:4 }}>행정·미팅·학습 시간 제외 후 실제 청구 가능 비율</p>
              </div>
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
            <p style={{ fontSize:13, color:mutedColor, fontWeight:700, marginBottom:8 }}>필요 시간당 단가</p>
            <p className="num" style={{ fontSize:36, fontWeight:900, color:'#6366f1', letterSpacing:'-0.03em', marginBottom:4 }}>
              {fmt(result.hourlyRate)}
            </p>
            <p style={{ fontSize:12, color:mutedColor }}>연 청구 가능 시간 {Math.round(result.billableHours).toLocaleString()}h 기준</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <StatCard label="일당" value={fmt(result.dailyRate)} color="#6366f1"/>
            <StatCard label="월 필요 매출 (세전)" value={fmt(result.monthlyRevenue)} color="#8b5cf6"/>
            <StatCard label="연 세전 필요 소득" value={fmt(result.grossNeeded)} color="#10b981"/>
            <StatCard label="실수령액 검증" value={fmt(result.netCheck)} color="#f59e0b" sub="세후"/>
          </div>

          <Card title="근무 시간 분석">
            <div className="space-y-3" style={{ marginTop:8, fontSize:13, color:mutedColor }}>
              {[
                ['연간 총 근무 시간', `${Math.round(result.annualWorkHours).toLocaleString()}시간`],
                [`청구 가능 시간 (${billableRatio}%)`, `${Math.round(result.billableHours).toLocaleString()}시간`],
                ['비청구 시간 (행정·기타)', `${Math.round(result.annualWorkHours - result.billableHours).toLocaleString()}시간`],
                ['세전 필요 소득', fmt(result.grossNeeded)],
                ['세금 예상', fmt(result.grossNeeded * taxRate / 100)],
                ['세후 실수령', fmt(result.netCheck)],
              ].map(([k, v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', paddingBottom:8, borderBottom:'1px solid #f2f2f7' }}>
                  <span>{k}</span><span style={{ fontWeight:700, color:'#1d1d1f' }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="알아두세요 💡">
            <div className="space-y-3" style={{ marginTop:8 }}>
              {[
                '청구 가능 비율을 70% 이하로 설정하면 현실적인 단가를 산출할 수 있습니다.',
                '세율은 종합소득세 신고 시 실효세율(절세 후)을 기준으로 입력하세요.',
                '국민연금·건강보험 등 4대보험도 비용에 포함하는 것이 좋습니다.',
              ].map((tip, i) => (
                <div key={i} style={{ display:'flex', gap:8, fontSize:12, color:mutedColor }}>
                  <span style={{ flexShrink:0, color:'#6366f1', fontWeight:800 }}>{i+1}.</span>
                  <span style={{ lineHeight:1.7 }}>{tip}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
