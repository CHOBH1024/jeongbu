import React, { useState, useMemo } from 'react';
import { Home, TrendingDown, Percent, Calendar, Coins } from 'lucide-react';
import { Card, StatCard, TOKEN } from '../ui/Base';

/* ── Types ── */
type LoanType = '일반' | '신혼부부' | '생애최초' | '신생아특례';

interface TypeConfig {
  label: string;
  maxLoan: number;        // 만원
  maxHousePrice: number;  // 만원
  maxLtv: number;         // %
  incomeSteps: { label: string; rate: number }[];
}

/* ── Product configuration ── */
const TYPE_CONFIG: Record<LoanType, TypeConfig> = {
  일반: {
    label: '일반',
    maxLoan: 25000,
    maxHousePrice: 50000,
    maxLtv: 70,
    incomeSteps: [
      { label: '~2천만원', rate: 2.15 },
      { label: '~4천만원', rate: 2.35 },
      { label: '~6천만원', rate: 2.65 },
    ],
  },
  신혼부부: {
    label: '신혼부부',
    maxLoan: 40000,
    maxHousePrice: 50000,
    maxLtv: 70,
    incomeSteps: [
      { label: '~2천만원', rate: 1.85 },
      { label: '~4천만원', rate: 2.05 },
      { label: '~7천만원', rate: 2.35 },
    ],
  },
  생애최초: {
    label: '생애최초',
    maxLoan: 30000,
    maxHousePrice: 60000,
    maxLtv: 80,
    incomeSteps: [
      { label: '~2천만원', rate: 2.15 },
      { label: '~4천만원', rate: 2.35 },
      { label: '~6천만원', rate: 2.45 },
    ],
  },
  신생아특례: {
    label: '신생아특례',
    maxLoan: 50000,
    maxHousePrice: 90000,
    maxLtv: 70,
    incomeSteps: [
      { label: '~8천만원', rate: 1.6 },
      { label: '~1억원', rate: 1.95 },
      { label: '~1.3억원', rate: 2.7 },
    ],
  },
};

const LOAN_TYPES: LoanType[] = ['일반', '신혼부부', '생애최초', '신생아특례'];
const TERMS = [10, 15, 20, 25, 30];

/* ── Helpers ── */
const fmt = (n: number) => Math.round(n).toLocaleString('ko-KR');

function calcMonthly(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || annualRate <= 0) return 0;
  const r = annualRate / 12 / 100;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/* ── Component ── */
const DidimdolLoan: React.FC = () => {
  const [loanType, setLoanType] = useState<LoanType>('일반');
  const [housePrice, setHousePrice] = useState<number>(30000);
  const [incomeIdx, setIncomeIdx] = useState<number>(0);
  const [term, setTerm] = useState<number>(30);
  const [ltv, setLtv] = useState<number>(70);

  const cfg = TYPE_CONFIG[loanType];

  /* Reset income index when type changes */
  const handleTypeChange = (t: LoanType) => {
    setLoanType(t);
    setIncomeIdx(0);
    setLtv(TYPE_CONFIG[t].maxLtv);
  };

  const results = useMemo(() => {
    const rate = cfg.incomeSteps[incomeIdx].rate;
    const ltvCapped = Math.min(ltv, cfg.maxLtv);
    const ltvBased = Math.floor((housePrice * ltvCapped) / 100);
    const maxLoan = Math.min(cfg.maxLoan, ltvBased);
    const monthly = calcMonthly(maxLoan * 10000, rate, term); // convert 만원 → 원
    const totalPayment = monthly * term * 12;
    const totalInterest = totalPayment - maxLoan * 10000;
    return { rate, maxLoan, monthly, totalPayment, totalInterest };
  }, [loanType, housePrice, incomeIdx, term, ltv, cfg]);

  /* ── Shared styles ── */
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

  const segBtnStyle = (active: boolean, color = TOKEN.primary): React.CSSProperties => ({
    flex: 1,
    padding: '10px 0',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 13,
    fontFamily: 'inherit',
    transition: 'all 0.15s',
    background: active ? color : '#f2f2f7',
    color: active ? '#fff' : '#6e6e73',
    boxShadow: active ? `0 2px 8px ${color}40` : 'none',
  });

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '12px 0',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 14,
    fontFamily: 'inherit',
    transition: 'all 0.18s',
    background: active ? TOKEN.primary : '#f2f2f7',
    color: active ? '#fff' : '#6e6e73',
    boxShadow: active ? `0 3px 12px ${TOKEN.primary}40` : 'none',
  });

  const houseOk = housePrice <= cfg.maxHousePrice;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 680, margin: '0 auto' }}>

      {/* ── 1. 대출 유형 탭 ── */}
      <div style={{ display: 'flex', gap: 8, background: '#f2f2f7', borderRadius: 16, padding: 6 }}>
        {LOAN_TYPES.map((t) => (
          <button key={t} style={tabBtnStyle(loanType === t)} onClick={() => handleTypeChange(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* ── 2. 입력 섹션 ── */}
      <Card title="대출 조건 입력" icon={<Home size={20} />} accentColor={TOKEN.primary}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* 주택 가격 */}
          <div>
            <label style={labelStyle}>
              주택 가격 (만원)
              {!houseOk && (
                <span style={{ marginLeft: 8, color: TOKEN.danger, fontWeight: 600 }}>
                  ※ 한도 초과 ({fmt(cfg.maxHousePrice)}만원 이하)
                </span>
              )}
            </label>
            <input
              type="number"
              style={{ ...inputStyle, borderColor: houseOk ? '#e5e5ea' : TOKEN.danger }}
              value={housePrice}
              min={0}
              step={100}
              onChange={(e) => setHousePrice(Number(e.target.value))}
            />
            <div style={{ marginTop: 6, fontSize: 12, color: '#aeaeb2' }}>
              ≈ {fmt(housePrice)}만원&nbsp;|&nbsp;상한: {fmt(cfg.maxHousePrice)}만원
            </div>
          </div>

          {/* 소득 구간 */}
          <div>
            <label style={labelStyle}>소득 구간</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {cfg.incomeSteps.map((step, i) => (
                <button
                  key={i}
                  style={segBtnStyle(incomeIdx === i, TOKEN.secondary)}
                  onClick={() => setIncomeIdx(i)}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          {/* 대출 기간 */}
          <div>
            <label style={labelStyle}>대출 기간</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {TERMS.map((y) => (
                <button key={y} style={segBtnStyle(term === y, TOKEN.primary)} onClick={() => setTerm(y)}>
                  {y}년
                </button>
              ))}
            </div>
          </div>

          {/* LTV */}
          <div>
            <label style={labelStyle}>
              LTV (%)&nbsp;
              <span style={{ fontWeight: 500, color: '#aeaeb2' }}>최대 {cfg.maxLtv}%</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="range"
                min={10}
                max={cfg.maxLtv}
                step={5}
                value={Math.min(ltv, cfg.maxLtv)}
                onChange={(e) => setLtv(Number(e.target.value))}
                style={{ flex: 1, accentColor: TOKEN.primary }}
              />
              <span style={{
                minWidth: 52,
                textAlign: 'center',
                fontWeight: 800,
                fontSize: 15,
                color: TOKEN.primary,
                background: `${TOKEN.primary}12`,
                borderRadius: 8,
                padding: '6px 10px',
              }}>
                {Math.min(ltv, cfg.maxLtv)}%
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ── 3. 결과 StatCards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14 }}>
        <StatCard
          label="최대 대출 가능액"
          value={`${fmt(results.maxLoan)}만`}
          sub="원"
          color={TOKEN.primary}
          icon={<Home size={18} />}
        />
        <StatCard
          label="적용 금리 (연)"
          value={`${results.rate.toFixed(2)}%`}
          sub={cfg.incomeSteps[incomeIdx].label}
          color={TOKEN.secondary}
          icon={<Percent size={18} />}
        />
        <StatCard
          label="월 상환액"
          value={`${fmt(Math.round(results.monthly / 10000))}만`}
          sub="원리금균등"
          color={TOKEN.success}
          icon={<Calendar size={18} />}
        />
        <StatCard
          label="총 이자 비용"
          value={`${fmt(Math.round(results.totalInterest / 10000))}만`}
          sub="원"
          color={TOKEN.warning}
          icon={<Coins size={18} />}
        />
      </div>

      {/* ── 4. 상환 정보 카드 ── */}
      <Card title="상환 정보 요약" icon={<TrendingDown size={20} />} accentColor={TOKEN.success}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: '대출 원금', value: `${fmt(results.maxLoan)}만원`, color: TOKEN.primary },
            { label: '총 이자', value: `${fmt(Math.round(results.totalInterest / 10000))}만원`, color: TOKEN.warning },
            { label: '총 상환액 (원금 + 이자)', value: `${fmt(Math.round(results.totalPayment / 10000))}만원`, color: TOKEN.success },
            { label: '상환 기간', value: `${term}년 (${term * 12}회)`, color: TOKEN.secondary },
            { label: '월 상환액', value: `${fmt(Math.round(results.monthly))}원`, color: TOKEN.success },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: '#f9f9fb',
                borderRadius: 10,
              }}
            >
              <span style={{ fontSize: 14, color: '#6e6e73', fontWeight: 600 }}>{label}</span>
              <span className="num" style={{ fontSize: 15, fontWeight: 800, color }}>{value}</span>
            </div>
          ))}

          {/* 원금/이자 비율 바 */}
          <div style={{ marginTop: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: TOKEN.primary }}>
                원금 {results.totalPayment > 0 ? ((results.maxLoan * 10000 / results.totalPayment) * 100).toFixed(1) : 0}%
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: TOKEN.warning }}>
                이자 {results.totalPayment > 0 ? ((results.totalInterest / results.totalPayment) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div style={{ height: 10, borderRadius: 8, background: '#f2f2f7', overflow: 'hidden', display: 'flex' }}>
              <div style={{
                width: results.totalPayment > 0
                  ? `${(results.maxLoan * 10000 / results.totalPayment) * 100}%`
                  : '0%',
                background: TOKEN.primary,
                transition: 'width 0.4s ease',
              }} />
              <div style={{
                flex: 1,
                background: TOKEN.warning,
              }} />
            </div>
          </div>
        </div>
      </Card>

      {/* ── 5. 안내사항 ── */}
      <Card accentColor={TOKEN.secondary}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${TOKEN.secondary}15`, color: TOKEN.secondary, fontSize: 18,
            }}>
              ℹ️
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#1d1d1f' }}>신청 자격 및 유의사항</span>
          </div>
          {[
            '디딤돌 대출은 주택도시기금(HUG)에서 운영하는 정책 모기지 상품입니다.',
            '일반: 부부합산 연소득 6천만원 이하, 주택가격 5억원 이하',
            '신혼부부: 혼인 7년 이내 또는 3개월 이내 혼인 예정자, 소득 7천만원 이하',
            '생애최초: 생애 최초 주택 구입자, 소득 7천만원 이하, LTV 최대 80%',
            '신생아특례: 2023. 1. 1. 이후 출산 가구, 소득 1.3억원 이하',
            'DTI 60% 이내 조건 충족 필요 (실제 대출 가능액은 소득에 따라 달라질 수 있음)',
            '본 계산기는 참고용이며 실제 금리·한도는 금융기관 심사에 따라 다를 수 있습니다.',
          ].map((note, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{
                flexShrink: 0,
                marginTop: 2,
                width: 5, height: 5, borderRadius: '50%',
                background: i === 0 ? TOKEN.secondary : '#aeaeb2',
                marginLeft: 2,
              }} />
              <span style={{
                fontSize: 13,
                color: i === 0 ? '#3a3a3c' : '#6e6e73',
                fontWeight: i === 0 ? 600 : 400,
                lineHeight: 1.6,
              }}>
                {note}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DidimdolLoan;
