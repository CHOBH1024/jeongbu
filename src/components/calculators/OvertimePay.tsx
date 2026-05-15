import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { AlertTriangle, Info } from 'lucide-react';

const INPUT_H: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'#f9f9fb', border:'1.5px solid #e5e5ea', borderRadius:10, fontSize:14, color:'#1d1d1f', fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
const mutedColor = '#6e6e73';

type CalcMode = 'hourly' | 'monthly';

export const OvertimePay = () => {
  const [mode, setMode]               = useState<CalcMode>('monthly');
  const [hourlyWage, setHourlyWage]   = useState(12000);
  const [monthlyWage, setMonthlyWage] = useState(2_500_000);
  const [workHours, setWorkHours]     = useState(209);   // 월 소정근로시간
  const [overtime, setOvertime]       = useState(10);    // 연장근로
  const [nighttime, setNighttime]     = useState(5);     // 야간근로
  const [holiday, setHoliday]         = useState(8);     // 휴일근로
  const [holidayOt, setHolidayOt]     = useState(0);    // 휴일+연장 겹침

  const result = useMemo(() => {
    /* 통상시급 산정 */
    let normalHourly: number;
    if (mode === 'hourly') {
      normalHourly = hourlyWage;
    } else {
      normalHourly = monthlyWage / 209;
    }

    /* 각 수당 계산 */
    const overtimePay   = overtime   * normalHourly * 1.5;
    const nightPay      = nighttime  * normalHourly * 0.5;   // 기본급 외 야간 가산
    const holidayBase   = Math.min(holiday, 8) * normalHourly * 1.5;
    const holidayExtra  = Math.max(0, holiday - 8) * normalHourly * 2.0;
    const holidayPay    = holidayBase + holidayExtra;
    const holidayOtPay  = holidayOt  * normalHourly * 2.0;

    const total = overtimePay + nightPay + holidayPay + holidayOtPay;

    /* 주 52시간 초과 여부 (연장 12시간 초과 = 기본 40 + 연장 12) */
    const weeklyOvertime = overtime;
    const over52 = weeklyOvertime > 12;

    return {
      normalHourly: Math.floor(normalHourly),
      overtimePay:  Math.floor(overtimePay),
      nightPay:     Math.floor(nightPay),
      holidayPay:   Math.floor(holidayPay),
      holidayOtPay: Math.floor(holidayOtPay),
      total:        Math.floor(total),
      over52,
    };
  }, [mode, hourlyWage, monthlyWage, workHours, overtime, nighttime, holiday, holidayOt]);

  const fmt = (n: number) => '₩' + n.toLocaleString('ko-KR');

  return (
    <div className="space-y-6">
      <div style={{ padding:'12px 18px', borderRadius:12, fontSize:12, background:'#fffbeb', border:'1px solid #fde68a', color:'#92400e', display:'flex', alignItems:'flex-start', gap:8 }}>
        <Info size={14} style={{ flexShrink:0, marginTop:1 }}/>
        <span>근로기준법 §56 기준 &middot; 통상시급 = 월 통상임금 ÷ 209시간 &middot; 결과는 참고용입니다.</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>

        {/* 입력 */}
        <div className="space-y-5">
          {/* 계산 방식 선택 */}
          <Card title="임금 입력 방식">
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              {([['monthly','월 통상임금'], ['hourly','시급']] as const).map(([t, label]) => (
                <button key={t} onClick={() => setMode(t)} style={{
                  flex:1, padding:'10px 0', borderRadius:10, fontWeight:700, fontSize:13,
                  border:'1.5px solid',
                  background: mode === t ? '#6366f1' : 'transparent',
                  color:      mode === t ? '#fff'    : mutedColor,
                  borderColor: mode === t ? '#6366f1' : '#e5e5ea',
                  cursor:'pointer',
                }}>{label}</button>
              ))}
            </div>

            <div style={{ marginTop:16 }}>
              {mode === 'monthly' ? (
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>
                    월 통상임금 (원)
                  </label>
                  <input type="number" value={monthlyWage} step={100000}
                    onChange={(e) => setMonthlyWage(+e.target.value)} style={INPUT_H}/>
                  <p style={{ fontSize:11, color:'#aeaeb2', marginTop:4 }}>통상시급 = 월 통상임금 ÷ 209</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>기본 시급 (원)</label>
                    <input type="number" value={hourlyWage} step={100}
                      onChange={(e) => setHourlyWage(+e.target.value)} style={INPUT_H}/>
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>월 소정근로시간</label>
                    <input type="number" value={workHours} step={1}
                      onChange={(e) => setWorkHours(+e.target.value)} style={INPUT_H}/>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card title="근로 시간 입력">
            <div className="space-y-4" style={{ marginTop:8 }}>
              {[
                { label:'연장 근로 시간 (시간)', val:overtime,   set:setOvertime,  hint:'1주 최대 12시간 (법정)' },
                { label:'야간 근로 시간 (22시~06시)', val:nighttime, set:setNighttime, hint:'기본급 외 0.5배 가산' },
                { label:'휴일 근로 시간 (시간)', val:holiday,   set:setHoliday,   hint:'8시간 이하 1.5배, 초과 2.0배' },
                { label:'휴일·연장 겹치는 시간', val:holidayOt, set:setHolidayOt, hint:'2.0배 적용' },
              ].map(({ label, val, set, hint }) => (
                <div key={label}>
                  <label style={{ fontSize:12, fontWeight:700, color:mutedColor, display:'block', marginBottom:6 }}>{label}</label>
                  <input type="number" value={val} min={0} step={0.5}
                    onChange={(e) => set(+e.target.value)} style={INPUT_H}/>
                  {hint && <p style={{ fontSize:11, color:'#aeaeb2', marginTop:4 }}>{hint}</p>}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 결과 */}
        <div className="space-y-5">
          {/* 주 52시간 경고 */}
          {result.over52 && (
            <div style={{ padding:'16px 20px', borderRadius:14, background:'#fef2f2', border:'1.5px solid #fca5a5', display:'flex', gap:12, alignItems:'flex-start' }}>
              <AlertTriangle size={18} color="#ef4444" style={{ flexShrink:0 }}/>
              <div>
                <p style={{ fontWeight:800, color:'#ef4444', fontSize:13 }}>주 52시간 초과 가능성</p>
                <p style={{ fontSize:12, color:'#b91c1c', marginTop:2 }}>연장근로가 주 12시간을 초과합니다. 근로기준법 §53 위반에 해당할 수 있습니다.</p>
              </div>
            </div>
          )}

          {/* 통상시급 */}
          <div style={{ padding:24, borderRadius:18, background:'linear-gradient(135deg,#eef2ff,#fdf4ff)', border:'1.5px solid rgba(99,102,241,0.2)', textAlign:'center' }}>
            <p style={{ fontSize:12, color:mutedColor, fontWeight:700, marginBottom:8 }}>통상시급</p>
            <p className="num" style={{ fontSize:34, fontWeight:900, color:'#6366f1', letterSpacing:'-0.03em' }}>
              {fmt(result.normalHourly)}
            </p>
          </div>

          {/* 항목별 수당 */}
          <Card title="항목별 수당">
            <div className="space-y-3" style={{ marginTop:8, fontSize:13 }}>
              {[
                { label:'연장근로 수당 (×1.5)',  val:result.overtimePay,  color:'#6366f1' },
                { label:'야간근로 수당 (×0.5)',  val:result.nightPay,     color:'#8b5cf6' },
                { label:'휴일근로 수당 (×1.5~2)', val:result.holidayPay,   color:'#f59e0b' },
                { label:'휴일+연장 수당 (×2.0)', val:result.holidayOtPay, color:'#ef4444' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', paddingBottom:10, borderBottom:'1px solid #f2f2f7' }}>
                  <span style={{ color:mutedColor }}>{label}</span>
                  <span style={{ fontWeight:700, color }}>{fmt(val)}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:4 }}>
                <span style={{ fontWeight:800, fontSize:14 }}>합계</span>
                <span style={{ fontWeight:900, fontSize:16, color:'#6366f1' }}>{fmt(result.total)}</span>
              </div>
            </div>
          </Card>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <StatCard label="연장근로 수당" value={fmt(result.overtimePay)} color="#6366f1"/>
            <StatCard label="야간근로 수당" value={fmt(result.nightPay)} color="#8b5cf6"/>
            <StatCard label="휴일근로 수당" value={fmt(result.holidayPay)} color="#f59e0b"/>
            <StatCard label="총 추가 수당" value={fmt(result.total)} color="#10b981"/>
          </div>

          <Card title="알아두세요">
            <div className="space-y-2" style={{ marginTop:8, fontSize:12, color:mutedColor, lineHeight:1.8 }}>
              {[
                '야간수당은 기본급의 추가 0.5배 (기본급은 별도 지급).',
                '휴일 8시간 초과분은 0.5배 추가 적용(총 2.0배).',
                '5인 미만 사업장은 연장·야간·휴일 수당 규정 미적용.',
                '통상임금 범위는 사업장별로 다를 수 있습니다.',
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
