import React, { useState, useMemo } from 'react';
import { Home, Percent, Calendar, Coins, Shield } from 'lucide-react';
import { Card, StatCard, TOKEN } from '../ui/Base';

/* ── helpers ── */
const fmt = (n: number) => Math.round(n).toLocaleString('ko-KR');

/* ── constants ── */
const TERMS = [10, 15, 20, 30, 40, 50] as const;
type Term = typeof TERMS[number];

type LoanType = 'general' | 'newlywed' | 'firsthome' | 'youth';

const TYPE_LABELS: Record<LoanType, string> = {
  general: '일반',
  newlywed: '신혼부부',
  firsthome: '생애최초',
  youth: '청년',
};

const BASE_RATES: Record<Term, number> = {
  10: 3.95,
  15: 4.15,
  20: 4.25,
  30: 4.35,
  40: 4.40,
  50: 4.45,
};

const DISCOUNTS: Record<LoanType, number> = {
  general:   0.0,
  newlywed:  0.2,
  firsthome: 0.1,
  youth:     0.1,
};

const MAX_LTV: Record<LoanType, number> = {
  general:   70,
  newlywed:  70,
  firsthome: 80,
  youth:     70,
};

/* ── component ── */
export default function BogeumjariLoan() {
  const [loanType, setLoanType] = useState<LoanType>('general');
  const [housePrice, setHousePrice] = useState<number>(40000); // 만원
  const [term, setTerm] = useState<Term>(30);
  const [ltv, setLtv] = useState<number>(70);

  const maxLtv = MAX_LTV[loanType];

  /* derived calculations */
  const calc = useMemo(() => {
    const discount = Math.min(DISCOUNTS[loanType], 0.5);
    const rate = Math.max(BASE_RATES[term] - discount, 1.0);

    const clampedLtv = Math.min(ltv, maxLtv);
    const rawLoan = housePrice * clampedLtv / 100; // 만원
    const maxLoan = Math.min(rawLoan, 50000); // max 5억 = 50000만원

    // annuity formula (monthly)
    const r = rate / 12 / 100;
    const n = term * 12;
    const P = maxLoan * 10000; // convert to 원

    let monthly = 0;
    if (r === 0) {
      monthly = P / n;
    } else {
      const factor = Math.pow(1 + r, n);
      monthly = P * r * factor / (factor - 1);
    }

    const totalPayment = monthly * n;
    const totalInterest = totalPayment - P;

    return { rate, maxLoan, monthly, totalInterest, totalPayment, P, clampedLtv };
  }, [loanType, housePrice, term, ltv, maxLtv]);

  const housePriceOver = housePrice > 60000; // 6억 = 60000만원

  /* ── styles ── */
  const tabStyle = (active: boolean, color: string): React.CSSProperties => ({
    flex: 1,
    padding: '10px 8px',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: active ? 800 : 600,
    background: active ? color : 'transparent',
    color: active ? '#fff' : '#6e6e73',
    transition: 'all 0.18s',
    fontFamily: 'inherit',
  });

  const segBtnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '8px 4px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: active ? 800 : 600,
    background: active ? TOKEN.primary : 'transparent',
    color: active ? '#fff' : '#6e6e73',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: `1.5px solid ${housePriceOver ? TOKEN.danger : '#e5e5ea'}`,
    fontSize: 15,
    fontWeight: 600,
    color: '#1d1d1f',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const ltvInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: `1.5px solid ${ltv > maxLtv ? TOKEN.danger : '#e5e5ea'}`,
    fontSize: 15,
    fontWeight: 600,
    color: '#1d1d1f',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: '#6e6e73',
    marginBottom: 6,
    display: 'block',
  };

  const principalRatio = calc.P > 0 ? calc.P / calc.totalPayment : 0;
  const interestRatio = 1 - principalRatio;

  const typeColors: Record<LoanType, string> = {
    general:   TOKEN.primary,
    newlywed:  TOKEN.pink,
    firsthome: TOKEN.success,
    youth:     TOKEN.secondary,
  };
  const activeColor = typeColors[loanType];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* 유형 탭 */}
      <Card title="보금자리론 계산기" icon={<Home size={20} />} accentColor={TOKEN.primary}>
        <div style={{
          display: 'flex',
          gap: 6,
          background: '#f2f2f7',
          borderRadius: 14,
          padding: 5,
        }}>
          {(Object.keys(TYPE_LABELS) as LoanType[]).map((t) => (
            <button
              key={t}
              style={tabStyle(loanType === t, typeColors[t])}
              onClick={() => {
                setLoanType(t);
                setLtv(Math.min(ltv, MAX_LTV[t]));
              }}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* type description */}
        <div style={{
          marginTop: 14,
          padding: '10px 14px',
          borderRadius: 12,
          background: `${activeColor}10`,
          border: `1px solid ${activeColor}25`,
          fontSize: 13,
          color: activeColor,
          fontWeight: 600,
        }}>
          {loanType === 'general'   && '연소득 7천만원 이하 · 무주택 또는 1주택(처분조건) · LTV 70%'}
          {loanType === 'newlywed'  && '연소득 8.5천만원 이하 · 신혼부부 우대금리 -0.2%p · LTV 70%'}
          {loanType === 'firsthome' && '연소득 7천만원 이하 · 생애최초 우대금리 -0.1%p · LTV 최대 80%'}
          {loanType === 'youth'     && '만 39세 이하 · 청년 우대금리 -0.1%p · LTV 70%'}
        </div>
      </Card>

      {/* 입력 카드 */}
      <Card title="대출 조건 입력" icon={<Calendar size={20} />} accentColor={TOKEN.secondary}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* 주택 가격 */}
          <div>
            <label style={labelStyle}>주택 가격 (만원)</label>
            <input
              type="number"
              style={inputStyle}
              value={housePrice}
              min={0}
              onChange={(e) => setHousePrice(Number(e.target.value))}
            />
            {housePriceOver && (
              <p style={{ fontSize: 12, color: TOKEN.danger, marginTop: 5, fontWeight: 600 }}>
                ⚠ 보금자리론 대상 주택가격은 6억원 이하입니다.
              </p>
            )}
            <p style={{ fontSize: 12, color: '#aeaeb2', marginTop: 5 }}>
              현재: {fmt(housePrice)}만원 ({fmt(housePrice / 10000)}억원)
            </p>
          </div>

          {/* 만기 */}
          <div>
            <label style={labelStyle}>대출 만기</label>
            <div style={{
              display: 'flex',
              gap: 4,
              background: '#f2f2f7',
              borderRadius: 12,
              padding: 4,
            }}>
              {TERMS.map((t) => (
                <button
                  key={t}
                  style={segBtnStyle(term === t)}
                  onClick={() => setTerm(t)}
                >
                  {t}년
                </button>
              ))}
            </div>
          </div>

          {/* LTV */}
          <div>
            <label style={labelStyle}>LTV (%) — 최대 {maxLtv}%</label>
            <input
              type="number"
              style={ltvInputStyle}
              value={ltv}
              min={0}
              max={maxLtv}
              onChange={(e) => setLtv(Number(e.target.value))}
            />
            {ltv > maxLtv && (
              <p style={{ fontSize: 12, color: TOKEN.danger, marginTop: 5, fontWeight: 600 }}>
                ⚠ {TYPE_LABELS[loanType]} 유형의 최대 LTV는 {maxLtv}%입니다.
              </p>
            )}
          </div>

        </div>
      </Card>

      {/* 결과 StatCards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 14,
      }}>
        <StatCard
          label="최대 대출 가능액"
          value={`${fmt(calc.maxLoan)}만`}
          sub={`${fmt(calc.maxLoan / 10000)}억원`}
          color={activeColor}
          icon={<Coins size={18} />}
        />
        <StatCard
          label="적용 금리 (고정)"
          value={`${calc.rate.toFixed(2)}%`}
          sub={`${term}년 고정금리`}
          color={TOKEN.primary}
          icon={<Percent size={18} />}
        />
        <StatCard
          label="월 상환액"
          value={`${fmt(calc.monthly / 10000)}만`}
          sub={`${fmt(calc.monthly)}원/월`}
          color={TOKEN.secondary}
          icon={<Calendar size={18} />}
        />
        <StatCard
          label="총 이자 비용"
          value={`${fmt(calc.totalInterest / 100000000)}억`}
          sub={`${fmt(calc.totalInterest / 10000)}만원`}
          color={TOKEN.warning}
          icon={<Coins size={18} />}
        />
      </div>

      {/* 상환 요약 카드 */}
      <Card title="상환 구조" icon={<Coins size={20} />} accentColor={TOKEN.warning}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* bar */}
          <div style={{ borderRadius: 8, overflow: 'hidden', height: 22, display: 'flex' }}>
            <div style={{
              width: `${(principalRatio * 100).toFixed(1)}%`,
              background: activeColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#fff',
              transition: 'width 0.4s ease',
            }}>
              {(principalRatio * 100).toFixed(0)}%
            </div>
            <div style={{
              flex: 1,
              background: TOKEN.warning,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#fff',
            }}>
              {(interestRatio * 100).toFixed(0)}%
            </div>
          </div>

          {/* legend */}
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 4, background: activeColor }} />
              <div>
                <p style={{ fontSize: 12, color: '#6e6e73', fontWeight: 700 }}>원금</p>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#1d1d1f' }}>{fmt(calc.maxLoan)}만원</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 4, background: TOKEN.warning }} />
              <div>
                <p style={{ fontSize: 12, color: '#6e6e73', fontWeight: 700 }}>총 이자</p>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#1d1d1f' }}>{fmt(calc.totalInterest / 10000)}만원</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 4, background: '#e5e5ea' }} />
              <div>
                <p style={{ fontSize: 12, color: '#6e6e73', fontWeight: 700 }}>총 상환액</p>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#1d1d1f' }}>{fmt(calc.totalPayment / 10000)}만원</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 보금자리론 특징 카드 */}
      <Card title="보금자리론 특징" icon={<Shield size={20} />} accentColor={TOKEN.success}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              icon: '📌',
              title: '고정금리로 금리 변동 위험 없음',
              desc: '대출 기간 전체를 동일한 금리로 유지하여 시장 금리 변동에 영향을 받지 않습니다.',
            },
            {
              icon: '🏛',
              title: '한국주택금융공사(HF) 보증',
              desc: '정부 지원 정책 모기지로 안정적인 운영과 신뢰성이 보장됩니다.',
            },
            {
              icon: '💰',
              title: '중도상환수수료 최대 1.2% (3년 이후 면제)',
              desc: '대출 후 3년 이내 상환 시 중도상환수수료가 발생하며, 3년 이후에는 면제됩니다.',
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                display: 'flex',
                gap: 14,
                padding: '14px 16px',
                borderRadius: 14,
                background: `${TOKEN.success}08`,
                border: `1px solid ${TOKEN.success}20`,
              }}
            >
              <div style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{item.icon}</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#1d1d1f', marginBottom: 3 }}>{item.title}</p>
                <p style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 안내 박스 */}
      <div style={{
        padding: '14px 18px',
        borderRadius: 14,
        background: '#f2f2f7',
        border: '1px solid #e5e5ea',
        fontSize: 13,
        color: '#6e6e73',
        lineHeight: 1.6,
        fontWeight: 500,
      }}>
        ℹ️ 실제 금리는 신청 시점에 따라 다를 수 있습니다. 한국주택금융공사 홈페이지(
        <a
          href="https://www.hf.go.kr"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: TOKEN.primary, fontWeight: 700, textDecoration: 'none' }}
        >
          hf.go.kr
        </a>
        )에서 확인하세요.
      </div>

    </div>
  );
}
