import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';

const INPUT_H: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'#f9f9fb', border:'1.5px solid #e5e5ea', borderRadius:10, fontSize:14, color:'#1d1d1f', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const mutedColor = '#6e6e73';
const fmt = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

type InputMode = 'annual' | 'hourly';

export const TimeValue = () => {
  const [mode, setMode] = useState<InputMode>('annual');
  const [annualSalary, setAnnualSalary] = useState(50000000);
  const [hourlySalary, setHourlySalary] = useState(25000);
  const [activityHours, setActivityHours] = useState(2);
  const [activityMins, setActivityMins] = useState(0);
  const [commuteHours, setCommuteHours] = useState(1.5);

  const result = useMemo(() => {
    const hourlyRate = mode === 'annual'
      ? annualSalary / (52 * 40)
      : hourlySalary;
    const activityTime = activityHours + activityMins / 60;
    const activityCost = hourlyRate * activityTime;
    const annualCommuteCost = hourlyRate * commuteHours * 2 * 250; // 왕복 * 250일
    const youtube1h = hourlyRate;
    const waiting30m = hourlyRate * 0.5;

    return { hourlyRate, activityCost, annualCommuteCost, youtube1h, waiting30m };
  }, [mode, annualSalary, hourlySalary, activityHours, activityMins, commuteHours]);

  return (
    <div className="space-y-6">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>
        <div className="space-y-5">
          <Card title="소득 정보">
            <div className="space-y-4" style={{ marginTop:8 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>입력 방식</label>
                <div style={{ display:'flex', gap:8 }}>
                  {(['annual','hourly'] as const).map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                      flex:1, padding:'10px 0', borderRadius:10, fontWeight:700, fontSize:13,
                      border:'1.5px solid',
                      background: mode === m ? '#6366f1' : 'transparent',
                      color: mode === m ? '#fff' : mutedColor,
                      borderColor: mode === m ? '#6366f1' : '#e5e5ea',
                      cursor:'pointer',
                    }}>
                      {m === 'annual' ? '연봉 입력' : '시급 입력'}
                    </button>
                  ))}
                </div>
              </div>

              {mode === 'annual' ? (
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>연봉 (원)</label>
                  <input type="number" min={0} value={annualSalary} onChange={e => setAnnualSalary(+e.target.value)} style={INPUT_H} step={1000000}/>
                  <p style={{ fontSize:11, color:'#aeaeb2', marginTop:4 }}>주 40시간 × 52주 기준</p>
                </div>
              ) : (
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>시급 (원)</label>
                  <input type="number" min={0} value={hourlySalary} onChange={e => setHourlySalary(+e.target.value)} style={INPUT_H} step={500}/>
                </div>
              )}
            </div>
          </Card>

          <Card title="계산할 활동">
            <div className="space-y-4" style={{ marginTop:8 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>활동 소요 시간</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  <div>
                    <input type="number" min={0} value={activityHours} onChange={e => setActivityHours(+e.target.value)} style={INPUT_H} placeholder="시간"/>
                    <p style={{ fontSize:11, color:'#aeaeb2', marginTop:4 }}>시간</p>
                  </div>
                  <div>
                    <input type="number" min={0} max={59} value={activityMins} onChange={e => setActivityMins(+e.target.value)} style={INPUT_H} placeholder="분"/>
                    <p style={{ fontSize:11, color:'#aeaeb2', marginTop:4 }}>분</p>
                  </div>
                </div>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>
                  편도 출퇴근 시간 (시간)
                </label>
                <input type="number" min={0} step={0.25} value={commuteHours} onChange={e => setCommuteHours(+e.target.value)} style={INPUT_H}/>
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
            <p style={{ fontSize:13, color:mutedColor, fontWeight:700, marginBottom:8 }}>내 시간 가치 (시간당)</p>
            <p className="num" style={{ fontSize:36, fontWeight:900, color:'#6366f1', letterSpacing:'-0.03em', marginBottom:4 }}>
              {fmt(result.hourlyRate)}
            </p>
            <p style={{ fontSize:12, color:mutedColor }}>
              {mode === 'annual' ? `연봉 ${(annualSalary/10000).toFixed(0)}만원 기준` : '시급 기준'}
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <StatCard
              label={`활동 비용 (${activityHours}시간 ${activityMins}분)`}
              value={fmt(result.activityCost)}
              color="#6366f1"
            />
            <StatCard label="연간 출퇴근 비용" value={fmt(result.annualCommuteCost)} color="#ef4444" sub="왕복 250일"/>
          </div>

          <Card title="재미있는 시간 가치 계산">
            <div className="space-y-3" style={{ marginTop:8 }}>
              {[
                { label:'유튜브 1시간 시청', value:result.youtube1h, desc:'집중 시청 기회비용' },
                { label:'줄서기 30분 대기', value:result.waiting30m, desc:'맛집·관공서 대기 비용' },
                { label:'출퇴근 왕복 (일)', value:result.hourlyRate * commuteHours * 2, desc:`편도 ${commuteHours}시간 기준` },
              ].map(item => (
                <div key={item.label} style={{
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'12px 14px', borderRadius:12, background:'#f9f9fb',
                }}>
                  <div>
                    <p style={{ fontWeight:700, fontSize:13, color:'#1d1d1f' }}>{item.label}</p>
                    <p style={{ fontSize:11, color:mutedColor }}>{item.desc}</p>
                  </div>
                  <span style={{ fontWeight:800, color:'#6366f1', fontSize:15 }}>{fmt(item.value)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="알아두세요 💡">
            <div className="space-y-3" style={{ marginTop:8 }}>
              {[
                '시간 가치는 기회비용 개념입니다. 세전 기준이므로 실수령으로 환산하려면 세율을 적용하세요.',
                '출퇴근 비용을 절감하면 연봉 인상 효과와 동일합니다.',
                '시간 절약형 서비스(배달·택시)와 직접 비교 시 활용하세요.',
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
