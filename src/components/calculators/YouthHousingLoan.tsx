import React, { useState } from 'react';
import { Users, Home, Key, Calendar, Building2 } from 'lucide-react';
import { Card, StatCard, TOKEN } from '../ui/Base';

const fmt = (n: number) => Math.round(n).toLocaleString('ko-KR');

type Tab = 'sme' | 'rent';
type Region = 'metro' | 'local';

/* ── Toggle button pair ── */
const RegionToggle: React.FC<{ value: Region; onChange: (v: Region) => void }> = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: 0, borderRadius: 12, overflow: 'hidden', border: '1.5px solid #e5e5ea', width: 'fit-content' }}>
    {(['metro', 'local'] as Region[]).map((r) => {
      const active = value === r;
      return (
        <button
          key={r}
          onClick={() => onChange(r)}
          style={{
            padding: '9px 22px',
            fontSize: 13,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: active ? TOKEN.primary : '#f9f9fb',
            color: active ? '#fff' : '#6e6e73',
            transition: 'background 0.15s, color 0.15s',
            fontFamily: 'inherit',
          }}
        >
          {r === 'metro' ? '수도권' : '지방'}
        </button>
      );
    })}
  </div>
);

/* ── Number input field ── */
const Field: React.FC<{ label: string; hint?: string; value: string; onChange: (v: string) => void; unit?: string }> = ({
  label, hint, value, onChange, unit = '만원',
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 48px 12px 16px',
          background: '#f9f9fb',
          border: '1.5px solid #e5e5ea',
          borderRadius: 12,
          fontSize: 14,
          color: '#1d1d1f',
          fontFamily: 'inherit',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s, background 0.15s',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = TOKEN.primary; e.currentTarget.style.background = '#fff'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5ea'; e.currentTarget.style.background = '#f9f9fb'; }}
      />
      <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#8e8e93', fontWeight: 600, pointerEvents: 'none' }}>
        {unit}
      </span>
    </div>
    {hint && <p style={{ fontSize: 12, color: '#8e8e93', lineHeight: 1.6 }}>{hint}</p>}
  </div>
);

/* ── Product 1: 중소기업청년 전월세 ── */
const SmeProduct: React.FC = () => {
  const [deposit, setDeposit] = useState('15000');
  const [region, setRegion] = useState<Region>('metro');

  const depositNum = parseFloat(deposit) || 0;
  const maxDeposit = region === 'metro' ? 30000 : 20000;
  const maxLoan = Math.min(10000, depositNum);
  const rate = 1.2;
  const monthlyInterest = maxLoan * rate / 100 / 12;

  const years = [2, 4, 6, 8, 10];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Input card */}
      <Card title="대출 조건 입력" icon={<Home size={20} />} accentColor={TOKEN.primary}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field
            label="전세 보증금"
            value={deposit}
            onChange={setDeposit}
            hint={`수도권 최대 ${fmt(30000)}만원 / 지방 최대 ${fmt(20000)}만원`}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>거주 지역</label>
            <RegionToggle value={region} onChange={setRegion} />
            <p style={{ fontSize: 12, color: '#8e8e93' }}>
              현재 지역 보증금 한도: <strong style={{ color: TOKEN.primary }}>{fmt(maxDeposit)}만원</strong>
            </p>
          </div>
        </div>
      </Card>

      {/* Result stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <StatCard
          label="최대 대출 가능액"
          value={`${fmt(maxLoan)}만원`}
          sub="보증금 100% 이내"
          color={TOKEN.primary}
          icon={<Key size={18} />}
        />
        <StatCard
          label="적용 금리"
          value={`연 ${rate}%`}
          sub="고정금리"
          color={TOKEN.secondary}
          icon={<Home size={18} />}
        />
        <StatCard
          label="월 이자"
          value={`${fmt(monthlyInterest)}원`}
          sub={`연 ${fmt(monthlyInterest * 12)}원`}
          color={TOKEN.success}
          icon={<Calendar size={18} />}
        />
      </div>

      {/* Period interest table */}
      <Card title="기간별 납부 이자 (이자만 납부 기준)" icon={<Calendar size={20} />} accentColor={TOKEN.secondary}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: `${TOKEN.secondary}10` }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#6e6e73', borderBottom: '1px solid #e5e5ea' }}>기간</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#6e6e73', borderBottom: '1px solid #e5e5ea' }}>월 이자</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#6e6e73', borderBottom: '1px solid #e5e5ea' }}>총 이자</th>
              </tr>
            </thead>
            <tbody>
              {years.map((y, i) => {
                const totalInterest = monthlyInterest * y * 12;
                return (
                  <tr key={y} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '11px 16px', fontWeight: 700, color: TOKEN.secondary, borderBottom: '1px solid #f0f0f5' }}>{y}년</td>
                    <td style={{ padding: '11px 16px', textAlign: 'right', color: '#3a3a3c', borderBottom: '1px solid #f0f0f5' }}>{fmt(monthlyInterest)}원</td>
                    <td style={{ padding: '11px 16px', textAlign: 'right', fontWeight: 700, color: TOKEN.primary, borderBottom: '1px solid #f0f0f5' }}>{fmt(totalInterest)}원</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: '#aeaeb2', marginTop: 12, lineHeight: 1.6 }}>
          * 2년 만기, 최대 4회 연장으로 최장 10년 이용 가능
        </p>
      </Card>
    </div>
  );
};

/* ── Product 2: 청년전용 보증부월세대출 ── */
const RentProduct: React.FC = () => {
  const [deposit, setDeposit] = useState('5000');
  const [monthly, setMonthly] = useState('50');
  const [region, setRegion] = useState<Region>('metro');

  const depositNum = parseFloat(deposit) || 0;
  const monthlyNum = parseFloat(monthly) || 0;

  const maxDepositByRegion = region === 'metro' ? 10000 : 8000;
  const depositLoan = Math.min(3500, depositNum);
  const rentLoan = Math.min(1500, monthlyNum * 12);

  const depositRate = 1.8;
  const rentRate = 1.5;

  const depositMonthly = depositLoan * depositRate / 100 / 12;
  const rentMonthly = rentLoan * rentRate / 100 / 12;
  const combinedMonthly = depositMonthly + rentMonthly;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Input card */}
      <Card title="대출 조건 입력" icon={<Home size={20} />} accentColor={TOKEN.pink}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field
            label="보증금"
            value={deposit}
            onChange={setDeposit}
            hint={`수도권 최대 ${fmt(10000)}만원 / 지방 최대 ${fmt(8000)}만원`}
          />
          <Field
            label="월세"
            value={monthly}
            onChange={setMonthly}
            hint="최대 70만원 이하"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>거주 지역</label>
            <RegionToggle value={region} onChange={setRegion} />
            <p style={{ fontSize: 12, color: '#8e8e93' }}>
              현재 지역 보증금 한도: <strong style={{ color: TOKEN.pink }}>{fmt(maxDepositByRegion)}만원</strong>
            </p>
          </div>
        </div>
      </Card>

      {/* Result stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <StatCard
          label="보증금 대출액"
          value={`${fmt(depositLoan)}만원`}
          sub={`연 ${depositRate}% 고정`}
          color={TOKEN.pink}
          icon={<Key size={18} />}
        />
        <StatCard
          label="월세 대출액 (연간)"
          value={`${fmt(rentLoan)}만원`}
          sub={`연 ${rentRate}% · 12개월 선지급`}
          color={TOKEN.secondary}
          icon={<Home size={18} />}
        />
        <StatCard
          label="보증금 월이자"
          value={`${fmt(depositMonthly)}원`}
          sub={`연 ${fmt(depositMonthly * 12)}원`}
          color={TOKEN.primary}
          icon={<Calendar size={18} />}
        />
        <StatCard
          label="월세대출 월이자"
          value={`${fmt(rentMonthly)}원`}
          sub={`연 ${fmt(rentMonthly * 12)}원`}
          color={TOKEN.warning}
          icon={<Calendar size={18} />}
        />
      </div>

      {/* Combined monthly */}
      <div style={{
        padding: '20px 24px',
        borderRadius: 16,
        background: 'linear-gradient(135deg, #fdf4ff 0%, #eef2ff 100%)',
        border: `1px solid ${TOKEN.pink}25`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#8e8e93', marginBottom: 4 }}>합산 월 이자 (보증금 + 월세 대출)</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: TOKEN.pink, lineHeight: 1 }}>{fmt(combinedMonthly)}원</p>
          <p style={{ fontSize: 12, color: '#aeaeb2', marginTop: 4 }}>연간 합산 이자: {fmt(combinedMonthly * 12)}원</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 12, color: '#6e6e73', lineHeight: 1.8 }}>
            보증금 대출: {fmt(depositLoan)}만원 × {depositRate}%<br />
            월세 대출: {fmt(rentLoan)}만원 × {rentRate}%
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Eligibility card ── */
const EligibilityCard: React.FC<{ tab: Tab }> = ({ tab }) => {
  const items: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: '연령', value: '만 34세 이하', icon: <Users size={16} /> },
    { label: '소득', value: tab === 'sme' ? '연소득 3,500만원 이하' : '연소득 5,000만원 이하', icon: <Home size={16} /> },
    { label: '직장', value: tab === 'sme' ? '중소·중견기업 재직자' : '제한 없음', icon: <Building2 size={16} /> },
    { label: '자산', value: '순자산 3.45억원 이하', icon: <Key size={16} /> },
  ];

  return (
    <Card title="자격 요건" icon={<Users size={20} />} accentColor={TOKEN.success}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              background: `${TOKEN.success}08`,
              border: `1px solid ${TOKEN.success}20`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${TOKEN.success}15`, color: TOKEN.success,
            }}>
              {item.icon}
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8e8e93', marginBottom: 2 }}>{item.label}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f' }}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ── Main Component ── */
export default function YouthHousingLoan() {
  const [tab, setTab] = useState<Tab>('sme');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'sme', label: '중소기업청년 전월세' },
    { id: 'rent', label: '청년 월세대출' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720, margin: '0 auto', padding: '0 4px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1d1d1f', marginBottom: 6, letterSpacing: '-0.02em' }}>
          청년 주거지원 대출 계산기
        </h2>
        <p style={{ fontSize: 14, color: '#6e6e73', lineHeight: 1.6 }}>
          주택도시기금 청년 전용 전월세·월세 대출 상품을 비교하고 예상 이자를 계산해보세요.
        </p>
      </div>

      {/* Tab selector */}
      <div style={{
        display: 'flex',
        gap: 0,
        borderRadius: 16,
        overflow: 'hidden',
        border: '1.5px solid #e5e5ea',
        background: '#f9f9fb',
      }}>
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: '14px 20px',
                fontSize: 14,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: active ? TOKEN.primary : 'transparent',
                color: active ? '#fff' : '#6e6e73',
                transition: 'background 0.2s, color 0.2s',
                fontFamily: 'inherit',
                lineHeight: 1.4,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Product description badge */}
      <div style={{
        padding: '14px 18px',
        borderRadius: 14,
        background: tab === 'sme' ? `${TOKEN.primary}08` : `${TOKEN.pink}08`,
        border: `1px solid ${tab === 'sme' ? TOKEN.primary : TOKEN.pink}20`,
        fontSize: 13,
        color: '#3a3a3c',
        lineHeight: 1.75,
      }}>
        {tab === 'sme' ? (
          <>
            <strong style={{ color: TOKEN.primary }}>중소기업취업청년 전월세보증금 대출</strong> — 중소·중견기업 재직 청년을 위한 초저금리 전월세 보증금 대출입니다.
            보증금의 최대 100% (한도 1억원)를 연 <strong>1.2%</strong> 고정금리로 지원합니다.
          </>
        ) : (
          <>
            <strong style={{ color: TOKEN.pink }}>청년전용 보증부월세대출</strong> — 보증금과 월세를 동시에 지원하는 청년 전용 대출입니다.
            보증금 최대 3,500만원 (연 1.8%), 월세 최대 1,500만원 (연 1.5%)을 12개월치 선지급합니다.
          </>
        )}
      </div>

      {/* Product-specific content */}
      {tab === 'sme' ? <SmeProduct /> : <RentProduct />}

      {/* Eligibility */}
      <EligibilityCard tab={tab} />

      {/* Info box */}
      <div style={{
        padding: '16px 20px',
        borderRadius: 14,
        background: `${TOKEN.warning}08`,
        border: `1px solid ${TOKEN.warning}25`,
        fontSize: 13,
        color: '#3a3a3c',
        lineHeight: 1.75,
      }}>
        <strong style={{ color: TOKEN.warning }}>📋 신청 안내</strong><br />
        실제 신청은 <strong>주택도시기금 (nhuf.molit.go.kr)</strong> 또는 취급 은행에서 가능합니다.<br />
        취급 은행: <strong>우리은행 · 국민은행 · 신한은행 · 하나은행 · 농협은행</strong><br />
        <span style={{ fontSize: 12, color: '#8e8e93' }}>
          ※ 본 계산기는 참고용이며, 실제 대출 가능 여부 및 금리는 심사 결과에 따라 다를 수 있습니다.
        </span>
      </div>
    </div>
  );
}
