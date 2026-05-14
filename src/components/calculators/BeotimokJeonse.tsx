import React, { useState, useMemo } from 'react';
import { Home, Key, Calendar, TrendingDown } from 'lucide-react';
import { Card, StatCard, TOKEN } from '../ui/Base';

/* ── helpers ── */
const fmt = (n: number) => Math.round(n).toLocaleString('ko-KR');

const fmtEok = (n: number) => {
  if (n === 0) return '0만원';
  const eok = Math.floor(n / 10000);
  const man = Math.round(n % 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${fmt(man)}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${fmt(man)}만원`;
};

/* ── product config ── */
type LoanType = '일반' | '신혼부부' | '청년' | '신생아특례';

interface TypeConfig {
  label: LoanType;
  incomeCap: number;       // 만원
  limitSudo: number;       // 만원
  limitLocal: number;      // 만원
  depositCapSudo: number;  // 만원 (보증금 조건)
  depositCapLocal: number;
  incomeBreaks: number[];  // 소득 구간 상한 (만원)
  rates: number[];         // 대응 금리 (%)
  incomeLabels: string[];
  ageNote?: string;
}

const TYPES: TypeConfig[] = [
  {
    label: '일반',
    incomeCap: 5000,
    limitSudo: 12000,
    limitLocal: 12000,
    depositCapSudo: 30000,
    depositCapLocal: 20000,
    incomeBreaks: [2000, 4000, 5000],
    rates: [2.3, 2.5, 2.9],
    incomeLabels: ['~2천만원', '~4천만원', '~5천만원'],
  },
  {
    label: '신혼부부',
    incomeCap: 6000,
    limitSudo: 18000,
    limitLocal: 18000,
    depositCapSudo: 30000,
    depositCapLocal: 20000,
    incomeBreaks: [2000, 4000, 6000],
    rates: [1.8, 2.1, 2.7],
    incomeLabels: ['~2천만원', '~4천만원', '~6천만원'],
  },
  {
    label: '청년',
    incomeCap: 5000,
    limitSudo: 10000,
    limitLocal: 10000,
    depositCapSudo: 30000,
    depositCapLocal: 20000,
    incomeBreaks: [2000, 4000, 5000],
    rates: [2.1, 2.3, 2.7],
    incomeLabels: ['~2천만원', '~4천만원', '~5천만원'],
    ageNote: '만 34세 이하',
  },
  {
    label: '신생아특례',
    incomeCap: 10000,
    limitSudo: 30000,
    limitLocal: 30000,
    depositCapSudo: 50000,
    depositCapLocal: 40000,
    incomeBreaks: [5000, 7000, 10000],
    rates: [1.1, 1.5, 2.3],
    incomeLabels: ['~5천만원', '~7천만원', '~1억원'],
  },
];

const YEARS = [2, 4, 6, 8, 10];

export default function BeotimokJeonse() {
  const [typeIdx, setTypeIdx] = useState(0);
  const [jeonse, setJeonse] = useState('');
  const [isSudo, setIsSudo] = useState(true);
  const [incomeIdx, setIncomeIdx] = useState(0);
  const [years, setYears] = useState(2);

  const cfg = TYPES[typeIdx];

  const results = useMemo(() => {
    const deposit = parseFloat(jeonse) || 0;
    const depositCap = isSudo ? cfg.depositCapSudo : cfg.depositCapLocal;
    const typeLimit = isSudo ? cfg.limitSudo : cfg.limitLocal;
    const rate = cfg.rates[incomeIdx];

    const loanableByDeposit = deposit * 0.8;
    const maxLoan = Math.min(typeLimit, loanableByDeposit);
    const monthlyInterest = maxLoan * (rate / 100) / 12;
    const totalInterest = monthlyInterest * 12 * years;
    const depositOk = deposit > 0 && deposit <= depositCap;

    return { deposit, depositCap, maxLoan, rate, monthlyInterest, totalInterest, depositOk, typeLimit };
  }, [jeonse, isSudo, incomeIdx, years, cfg, typeIdx]);

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: '#6e6e73',
    marginBottom: 8,
    display: 'block',
  };

  const inputStyle: React.CSSProperties = {
    padding: '12px 16px',
    background: '#f9f9fb',
    border: '1.5px solid #e5e5ea',
    borderRadius: 12,
    fontSize: 14,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    color: '#1d1d1f',
  };

  const segBtn = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '9px 10px',
    fontSize: 13,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    borderRadius: 10,
    transition: 'all 0.15s',
    fontFamily: 'inherit',
    background: active ? TOKEN.primary : '#f2f2f7',
    color: active ? '#fff' : '#6e6e73',
  });

  const tabBtn = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '10px 6px',
    fontSize: 13,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    borderRadius: 10,
    transition: 'all 0.15s',
    fontFamily: 'inherit',
    background: active ? TOKEN.primary : '#f2f2f7',
    color: active ? '#fff' : '#6e6e73',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* 신청 유형 탭 */}
      <div style={{ display: 'flex', gap: 8, background: '#f2f2f7', borderRadius: 14, padding: 5 }}>
        {TYPES.map((t, i) => (
          <button
            key={t.label}
            style={tabBtn(typeIdx === i)}
            onClick={() => { setTypeIdx(i); setIncomeIdx(0); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 입력 섹션 */}
      <Card title="대출 조건 입력" icon={<Home size={20} />} accentColor={TOKEN.primary}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* 전세 보증금 */}
          <div>
            <label style={labelStyle}>전세 보증금 (만원)</label>
            <input
              type="number"
              placeholder="예: 20000"
              value={jeonse}
              onChange={e => setJeonse(e.target.value)}
              style={inputStyle}
            />
            {jeonse && (
              <p style={{ fontSize: 12, color: '#6e6e73', marginTop: 6 }}>
                = {fmtEok(parseFloat(jeonse) || 0)}
                {results.deposit > 0 && (
                  <span style={{ marginLeft: 8, color: results.depositOk ? TOKEN.success : TOKEN.danger, fontWeight: 700 }}>
                    {results.depositOk
                      ? `✓ 보증금 조건 충족 (${isSudo ? '수도권' : '지방'} 최대 ${fmtEok(isSudo ? cfg.depositCapSudo : cfg.depositCapLocal)})`
                      : `✗ 보증금 초과 (${isSudo ? '수도권' : '지방'} 최대 ${fmtEok(isSudo ? cfg.depositCapSudo : cfg.depositCapLocal)})`}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* 거주 지역 */}
          <div>
            <label style={labelStyle}>거주 지역</label>
            <div style={{ display: 'flex', gap: 8, background: '#f2f2f7', borderRadius: 12, padding: 4 }}>
              <button style={segBtn(isSudo)} onClick={() => setIsSudo(true)}>수도권</button>
              <button style={segBtn(!isSudo)} onClick={() => setIsSudo(false)}>지방</button>
            </div>
          </div>

          {/* 소득 구간 */}
          <div>
            <label style={labelStyle}>연소득 구간 (부부합산)</label>
            <div style={{ display: 'flex', gap: 8, background: '#f2f2f7', borderRadius: 12, padding: 4 }}>
              {cfg.incomeLabels.map((lbl, i) => (
                <button key={i} style={segBtn(incomeIdx === i)} onClick={() => setIncomeIdx(i)}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* 대출 기간 */}
          <div>
            <label style={labelStyle}>대출 기간 (초기 2년 + 연장)</label>
            <div style={{ display: 'flex', gap: 8, background: '#f2f2f7', borderRadius: 12, padding: 4 }}>
              {YEARS.map(y => (
                <button key={y} style={segBtn(years === y)} onClick={() => setYears(y)}>
                  {y}년
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 결과 StatCards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14 }}>
        <StatCard
          label="최대 대출 가능액"
          value={results.maxLoan > 0 ? fmtEok(results.maxLoan) : '-'}
          sub={results.maxLoan > 0 ? `한도 ${fmtEok(results.typeLimit)}` : '보증금을 입력하세요'}
          color={TOKEN.primary}
          icon={<Key size={18} />}
        />
        <StatCard
          label="적용 금리 (연)"
          value={`${results.rate}%`}
          sub={cfg.incomeLabels[incomeIdx]}
          color={TOKEN.secondary}
          icon={<TrendingDown size={18} />}
        />
        <StatCard
          label="월 이자"
          value={results.monthlyInterest > 0 ? `${fmt(results.monthlyInterest)}원` : '-'}
          sub="원리금 균등 기준"
          color={TOKEN.success}
          icon={<Calendar size={18} />}
        />
        <StatCard
          label={`${years}년 총 이자`}
          value={results.totalInterest > 0 ? fmtEok(Math.round(results.totalInterest / 10000) * 10000) : '-'}
          sub={`${years}년 × 12개월`}
          color={TOKEN.warning}
          icon={<Calendar size={18} />}
        />
      </div>

      {/* 대출 조건 요약 */}
      <Card title="대출 조건 요약" icon={<Key size={20} />} accentColor={TOKEN.secondary}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            padding: '16px 20px',
            background: '#fff8ee',
            border: '1px solid #fde68a',
            borderRadius: 14,
            fontSize: 13,
            color: '#92400e',
            lineHeight: 1.75,
          }}>
            <strong>[{cfg.label}] 신청 자격 요약</strong><br />
            • 연소득: 부부합산 {fmt(cfg.incomeCap)}만원 이하{cfg.ageNote ? ` / 나이: ${cfg.ageNote}` : ''}<br />
            • 전세보증금: 수도권 {fmtEok(cfg.depositCapSudo)} 이하, 지방 {fmtEok(cfg.depositCapLocal)} 이하<br />
            • 대출 한도: 최대 {fmtEok(cfg.limitSudo)} (보증금의 80% 이내)<br />
            • 대출 기간: 초기 2년, 최장 10년 (2년씩 4회 연장 가능)<br />
            • 주택 규모: 전용면적 85㎡ 이하 (수도권 제외 읍·면 지역 100㎡ 이하)
          </div>

          {/* 금리표 */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f9f9fb' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#6e6e73', borderBottom: '1.5px solid #e5e5ea' }}>소득 구간</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#6e6e73', borderBottom: '1.5px solid #e5e5ea' }}>금리 (연)</th>
                </tr>
              </thead>
              <tbody>
                {cfg.incomeLabels.map((lbl, i) => (
                  <tr key={i} style={{ background: incomeIdx === i ? `${TOKEN.primary}08` : 'transparent' }}>
                    <td style={{ padding: '9px 14px', borderBottom: '1px solid #f2f2f7', fontWeight: incomeIdx === i ? 700 : 400, color: incomeIdx === i ? TOKEN.primary : '#1d1d1f' }}>
                      {lbl}
                    </td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', borderBottom: '1px solid #f2f2f7', fontWeight: 700, color: incomeIdx === i ? TOKEN.primary : '#3a3a3c' }}>
                      {cfg.rates[i]}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* 안내사항 */}
      <div style={{
        padding: '16px 20px',
        background: '#f9f9fb',
        border: '1px solid #e5e5ea',
        borderRadius: 14,
        fontSize: 12,
        color: '#8e8e93',
        lineHeight: 1.75,
      }}>
        <strong style={{ color: '#6e6e73' }}>유의사항</strong><br />
        • 본 계산기는 2024년 주택도시기금 버팀목 전세자금 대출 기준으로 작성되었으며, 실제 대출 조건은 금융기관 및 심사에 따라 다를 수 있습니다.<br />
        • 월 이자는 이자만 납부하는 방식(만기일시상환) 기준이며, 실제 상환 방식에 따라 달라집니다.<br />
        • 정확한 대출 가능 여부 및 조건은{' '}
        <a
          href="https://nhuf.molit.go.kr"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: TOKEN.primary, fontWeight: 700, textDecoration: 'none' }}
        >
          주택도시기금 포털 (nhuf.molit.go.kr)
        </a>
        에서 확인하시기 바랍니다.
      </div>

    </div>
  );
}
