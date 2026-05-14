import { useState, useMemo } from 'react';
import { Card, StatCard, Input } from '../ui/Base';
import { AlertCircle, Briefcase, Calendar, DollarSign, Info } from 'lucide-react';

function fmt(n: number) {
  return Math.round(n).toLocaleString('ko-KR') + '원';
}

function getBenefitDays(age: number, insuredMonths: number): number {
  const senior = age >= 50;
  if (!senior) {
    if (insuredMonths < 12) return 120;
    if (insuredMonths < 36) return 150;
    if (insuredMonths < 60) return 180;
    if (insuredMonths < 120) return 210;
    return 240;
  } else {
    if (insuredMonths < 12) return 120;
    if (insuredMonths < 36) return 180;
    if (insuredMonths < 60) return 210;
    if (insuredMonths < 120) return 240;
    return 270;
  }
}

export function UnemploymentBenefit() {
  const [monthlyWage, setMonthlyWage] = useState(3_000_000);
  const [yearsWorked, setYearsWorked] = useState(2);
  const [age, setAge] = useState(35);
  const [reason, setReason] = useState<'involuntary' | 'voluntary'>('involuntary');
  const [insuredMonths, setInsuredMonths] = useState(24);

  const result = useMemo(() => {
    const dailyWage = monthlyWage / 30;
    const benefitDaily = Math.min(dailyWage * 0.6, 66_000);
    const finalDaily = Math.max(benefitDaily, 63_104);
    const benefitDays = getBenefitDays(age, insuredMonths);
    const totalBenefit = finalDaily * benefitDays;
    const monthlyEquiv = (totalBenefit / benefitDays) * 30;
    return { dailyWage, benefitDaily, finalDaily, benefitDays, totalBenefit, monthlyEquiv };
  }, [monthlyWage, age, insuredMonths]);

  const isVoluntary = reason === 'voluntary';
  const meetsInsurance = insuredMonths >= 6;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: '#f9f9fb', border: '1.5px solid #e5e5ea',
    borderRadius: 12, fontSize: 14, color: '#1d1d1f',
    fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Inputs */}
      <Card title="근로 정보 입력" icon={<Briefcase size={18} />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <Input
            label="월 급여 (세전)"
            type="number"
            min={0}
            step={100000}
            value={monthlyWage}
            unit="원"
            onChange={(e) => setMonthlyWage(Number(e.target.value))}
          />
          <Input
            label="근속연수"
            type="number"
            min={0}
            step={0.5}
            value={yearsWorked}
            unit="년"
            onChange={(e) => setYearsWorked(Number(e.target.value))}
          />
          <Input
            label="나이"
            type="number"
            min={18}
            max={70}
            value={age}
            unit="세"
            onChange={(e) => setAge(Number(e.target.value))}
          />
          <Input
            label="고용보험 가입 기간"
            type="number"
            min={0}
            value={insuredMonths}
            unit="개월"
            onChange={(e) => setInsuredMonths(Number(e.target.value))}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>퇴직 사유</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as 'involuntary' | 'voluntary')}
              style={{ ...inputStyle }}
            >
              <option value="involuntary">비자발적 (권고사직·계약만료)</option>
              <option value="voluntary">자발적 퇴사</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Voluntary warning */}
      {isVoluntary && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '16px 20px', borderRadius: 14,
          background: '#fff7ed', border: '1px solid #fed7aa',
        }}>
          <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#92400e', marginBottom: 4 }}>
              자발적 퇴사는 원칙적으로 실업급여 수급 불가
            </p>
            <p style={{ fontSize: 13, color: '#b45309', lineHeight: 1.6 }}>
              자발적 퇴사의 경우 실업급여(구직급여)를 받을 수 없습니다.
              단, 임금체불·직장 내 괴롭힘·건강 악화 등 정당한 이직 사유가 있으면 예외적으로 수급 가능합니다.
            </p>
          </div>
        </div>
      )}

      {/* Insurance eligibility warning */}
      {!meetsInsurance && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '16px 20px', borderRadius: 14,
          background: '#fef2f2', border: '1px solid #fecaca',
        }}>
          <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 13, color: '#b91c1c', lineHeight: 1.6 }}>
            고용보험 가입 기간이 최소 180일(약 6개월) 이상이어야 수급 자격이 됩니다.
            현재 입력값({insuredMonths}개월)은 요건 미충족입니다.
          </p>
        </div>
      )}

      {/* Results */}
      {!isVoluntary && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            <StatCard
              label="일 수급액"
              value={fmt(result.finalDaily)}
              sub={`상한 66,000원 / 하한 63,104원`}
              color="#6366f1"
              icon={<DollarSign size={18} />}
            />
            <StatCard
              label="수급 일수"
              value={`${result.benefitDays}일`}
              sub={age >= 50 ? '50세 이상 기준' : '50세 미만 기준'}
              color="#8b5cf6"
              icon={<Calendar size={18} />}
            />
            <StatCard
              label="총 수령액"
              value={fmt(result.totalBenefit)}
              sub="실업급여 합계"
              color="#10b981"
              icon={<Briefcase size={18} />}
            />
            <StatCard
              label="월 환산액"
              value={fmt(result.monthlyEquiv)}
              sub="30일 기준"
              color="#f59e0b"
              icon={<DollarSign size={18} />}
            />
          </div>

          {/* Calculation detail */}
          <Card title="계산 상세" icon={<Info size={18} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: '일 평균 임금', value: fmt(result.dailyWage), note: '월급 ÷ 30일' },
                { label: '기초 일액 (60%)', value: fmt(result.benefitDaily), note: '일 평균 임금 × 60%' },
                { label: '적용 일액', value: fmt(result.finalDaily), note: '상한(66,000) / 하한(63,104) 반영' },
                { label: '소정 급여일수', value: `${result.benefitDays}일`, note: `나이 ${age}세, 가입 ${insuredMonths}개월 기준` },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid #f2f2f7' : 'none',
                }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f' }}>{row.label}</p>
                    <p style={{ fontSize: 12, color: '#aeaeb2' }}>{row.note}</p>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#3a3a3c' }}>{row.value}</p>
                </div>
              ))}
            </div>

            {/* Benefit days table */}
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73', marginBottom: 12 }}>소정 급여일수 기준표</p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #e5e5ea' }}>
                      <th style={{ textAlign: 'left', padding: '8px 10px', color: '#6e6e73', fontWeight: 700 }}>가입 기간</th>
                      <th style={{ textAlign: 'center', padding: '8px 10px', color: '#6e6e73', fontWeight: 700 }}>50세 미만</th>
                      <th style={{ textAlign: 'center', padding: '8px 10px', color: '#6e6e73', fontWeight: 700 }}>50세 이상</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: '1년 미만', young: 120, senior: 120 },
                      { label: '1~3년', young: 150, senior: 180 },
                      { label: '3~5년', young: 180, senior: 210 },
                      { label: '5~10년', young: 210, senior: 240 },
                      { label: '10년 이상', young: 240, senior: 270 },
                    ].map((row) => {
                      const currentDays = result.benefitDays;
                      const isCurrentYoung = age < 50 && currentDays === row.young;
                      const isCurrentSenior = age >= 50 && currentDays === row.senior;
                      return (
                        <tr key={row.label} style={{ borderBottom: '1px solid #f2f2f7' }}>
                          <td style={{ padding: '9px 10px', color: '#3a3a3c' }}>{row.label}</td>
                          <td style={{
                            padding: '9px 10px', textAlign: 'center', fontWeight: isCurrentYoung ? 800 : 500,
                            color: isCurrentYoung ? '#6366f1' : '#3a3a3c',
                            background: isCurrentYoung ? '#eef2ff' : 'transparent',
                            borderRadius: 6,
                          }}>
                            {row.young}일{isCurrentYoung ? ' ←' : ''}
                          </td>
                          <td style={{
                            padding: '9px 10px', textAlign: 'center', fontWeight: isCurrentSenior ? 800 : 500,
                            color: isCurrentSenior ? '#6366f1' : '#3a3a3c',
                            background: isCurrentSenior ? '#eef2ff' : 'transparent',
                            borderRadius: 6,
                          }}>
                            {row.senior}일{isCurrentSenior ? ' ←' : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{
              marginTop: 16, padding: '12px 16px', borderRadius: 10,
              background: '#f2f2f7', fontSize: 12, color: '#6e6e73', lineHeight: 1.7,
            }}>
              ※ 고용보험 피보험 단위기간 180일 이상 요건 필요<br />
              ※ 수급 기간은 퇴직일 다음날부터 12개월 이내<br />
              ※ 일 수급액 상한: 66,000원 / 하한: 최저임금의 80% (2024년 기준 63,104원)
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
