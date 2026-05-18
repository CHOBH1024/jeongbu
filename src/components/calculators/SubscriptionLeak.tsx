import { useMemo, useState } from 'react';
import { Card, StatCard, TOKEN } from '../ui/Base';
import { CreditCard, Trash2, TrendingUp, Info, Plus } from 'lucide-react';

type Sub = { id: number; name: string; monthly: number; emoji: string };

let nextId = 200;

const fmt  = (n: number) => Math.round(n).toLocaleString('ko-KR');
const fmtEok = (n: number) => {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`;
  if (n >= 10_000)      return `${(n / 10_000).toFixed(0)}만`;
  return fmt(n);
};

const PRESET_GROUPS = [
  {
    label: '📺 영상 스트리밍', color: TOKEN.primary,
    items: [
      { name: '넷플릭스 광고형',      monthly:  5500, emoji: '🎬', tier: '광고형 스탠다드' },
      { name: '넷플릭스 스탠다드',    monthly: 13500, emoji: '🎬', tier: '스탠다드' },
      { name: '넷플릭스 프리미엄',    monthly: 17000, emoji: '🎬', tier: '프리미엄 (4K)' },
      { name: '유튜브 프리미엄 개인', monthly: 14900, emoji: '▶️', tier: '개인' },
      { name: '유튜브 프리미엄 학생', monthly:  8690, emoji: '▶️', tier: '학생 할인' },
      { name: '유튜브 프리미엄 가족', monthly: 22900, emoji: '▶️', tier: '가족 (최대 6명)' },
      { name: '티빙 광고형',          monthly:  5500, emoji: '📡', tier: '광고형' },
      { name: '티빙 스탠다드',        monthly:  7900, emoji: '📡', tier: '스탠다드' },
      { name: '티빙 프리미엄',        monthly: 10900, emoji: '📡', tier: '프리미엄' },
      { name: '웨이브 베이직',        monthly:  7900, emoji: '🌊', tier: '베이직' },
      { name: '웨이브 스탠다드',      monthly: 10900, emoji: '🌊', tier: '스탠다드' },
      { name: '쿠팡플레이',           monthly:  4990, emoji: '🎥', tier: '단일' },
      { name: '왓챠',                 monthly: 12900, emoji: '🎞️', tier: '단일' },
      { name: '디즈니+ 스탠다드',     monthly:  9900, emoji: '🏰', tier: '스탠다드' },
      { name: '디즈니+ 프리미엄',     monthly: 13900, emoji: '🏰', tier: '프리미엄' },
      { name: 'Apple TV+',            monthly:  9900, emoji: '🍏', tier: '단일' },
    ],
  },
  {
    label: '🎵 음악', color: TOKEN.success,
    items: [
      { name: '스포티파이 개인',  monthly: 10900, emoji: '🎧', tier: '개인' },
      { name: '스포티파이 학생',  monthly:  5500, emoji: '🎧', tier: '학생 50% 할인' },
      { name: '스포티파이 듀오',  monthly: 14900, emoji: '🎧', tier: '듀오 (2인)' },
      { name: '스포티파이 가족',  monthly: 16900, emoji: '🎧', tier: '가족 (6인)' },
      { name: '유튜브 뮤직 개인', monthly: 10900, emoji: '🎵', tier: '개인' },
      { name: '유튜브 뮤직 가족', monthly: 16900, emoji: '🎵', tier: '가족' },
      { name: '애플 뮤직 개인',   monthly: 10900, emoji: '🍎', tier: '개인' },
      { name: '애플 뮤직 가족',   monthly: 16900, emoji: '🍎', tier: '가족 (6인)' },
      { name: '멜론',              monthly: 10900, emoji: '🍈', tier: '스트리밍' },
      { name: '지니뮤직',          monthly:  8900, emoji: '🎶', tier: '스트리밍' },
    ],
  },
  {
    label: '🛍️ 쇼핑 · 혜택', color: TOKEN.warning,
    items: [
      { name: '쿠팡 로켓와우',          monthly:  7890, emoji: '📦', tier: '월정액' },
      { name: '쿠팡 로켓와우 (연환산)',  monthly:  4908, emoji: '📦', tier: '연간 58,900원÷12' },
      { name: '네이버 플러스',           monthly:  6900, emoji: '🟢', tier: '월정액' },
      { name: '카카오 이모티콘 플러스',  monthly:  4900, emoji: '💬', tier: '단일' },
      { name: 'SSG 유니버스클럽',        monthly:  3900, emoji: '🛒', tier: '월정액' },
      { name: 'Apple One 개인',          monthly: 16900, emoji: '🍏', tier: 'TV+·뮤직·Arcade·iCloud' },
    ],
  },
  {
    label: '📚 독서 · 교육', color: TOKEN.pink,
    items: [
      { name: '밀리의서재',    monthly:  9900, emoji: '📖', tier: '기본' },
      { name: '리디셀렉트',    monthly:  6500, emoji: '📕', tier: '기본' },
      { name: '클래스101+',    monthly: 12900, emoji: '🎓', tier: '구독' },
      { name: 'Duolingo Plus', monthly:  9900, emoji: '🦜', tier: '월정액' },
      { name: '콘텐츠플러스',  monthly:  4900, emoji: '🧠', tier: '기본' },
    ],
  },
];

const INIT_SUBS: Sub[] = [
  { id: 1, name: '넷플릭스 스탠다드',    monthly: 13500, emoji: '🎬' },
  { id: 2, name: '유튜브 프리미엄 개인', monthly: 14900, emoji: '▶️' },
  { id: 3, name: '쿠팡 로켓와우',        monthly:  7890, emoji: '📦' },
];

type CustomSlot = { name: string; monthly: number | '' };
const INIT_CUSTOM: CustomSlot[] = [
  { name: '', monthly: '' },
  { name: '', monthly: '' },
  { name: '', monthly: '' },
];

export function SubscriptionLeak() {
  const [subs,       setSubs]       = useState<Sub[]>(INIT_SUBS);
  const [custom,     setCustom]     = useState<CustomSlot[]>(INIT_CUSTOM);
  const [investRate, setInvestRate] = useState(7);
  const [investYears,setInvestYears]= useState(10);
  const [activeGroup,setActiveGroup]= useState(0);

  /* ── derived totals ── */
  const customTotal = useMemo(
    () => custom.reduce((s, c) => s + (Number(c.monthly) || 0), 0),
    [custom],
  );
  const totalMonthly = useMemo(
    () => subs.reduce((s, x) => s + x.monthly, 0) + customTotal,
    [subs, customTotal],
  );
  const { annual, decade, invested } = useMemo(() => {
    const annual  = totalMonthly * 12;
    const decade  = annual * investYears;
    const r       = investRate / 100 / 12;
    const n       = investYears * 12;
    const invested = r > 0
      ? totalMonthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
      : totalMonthly * n;
    return { annual, decade, invested };
  }, [totalMonthly, investRate, investYears]);

  const addPreset = (item: { name: string; monthly: number; emoji: string }) => {
    if (subs.some((s) => s.name === item.name)) return;
    setSubs((prev) => [...prev, { id: nextId++, ...item }]);
  };
  const removeSub = (id: number) => setSubs((prev) => prev.filter((s) => s.id !== id));
  const updateCustom = (i: number, field: 'name' | 'monthly', val: string) => {
    setCustom((prev) => prev.map((c, idx) =>
      idx === i ? { ...c, [field]: field === 'monthly' ? (val === '' ? '' : Number(val)) : val } : c,
    ));
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px', background: '#f9f9fb', border: '1.5px solid #e5e5ea',
    borderRadius: 10, fontSize: 14, color: '#1d1d1f', fontFamily: 'inherit',
    outline: 'none', transition: 'border-color 0.15s',
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = TOKEN.primary;
    e.currentTarget.style.background  = '#fff';
  };
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#e5e5ea';
    e.currentTarget.style.background  = '#f9f9fb';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── 설명 배너 ── */}
      <div style={{
        padding: '20px 24px', borderRadius: 16,
        background: 'linear-gradient(135deg,#eef2ff,#fdf4ff)',
        border: '1px solid rgba(99,102,241,0.15)',
      }}>
        <p style={{ fontSize: 14, color: '#3a3a3c', lineHeight: 1.8, margin: 0 }}>
          💡 <strong>구독료 누수 탐지기</strong>란? 매달 자동 결제되는 구독 서비스들을 한눈에 파악하고,
          연간·장기 지출 규모와 투자했을 때의 기회비용을 계산합니다.<br/>
          <span style={{ color: '#6e6e73', fontSize: 13 }}>
            아래에서 이용 중인 서비스를 선택하거나, 기타란에 직접 입력해 총 구독 지출을 확인하세요.
          </span>
        </p>
      </div>

      {/* ── 빠른 추가 (탭 방식) ── */}
      <Card title="빠른 추가" icon={<Plus size={18}/>} accentColor={TOKEN.primary}>
        {/* 카테고리 탭 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {PRESET_GROUPS.map((g, i) => (
            <button key={i} onClick={() => setActiveGroup(i)}
              style={{
                padding: '7px 16px', borderRadius: 99, fontSize: 13, fontWeight: 700,
                background: activeGroup === i ? g.color : '#f2f2f7',
                color: activeGroup === i ? '#fff' : '#6e6e73',
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              }}>
              {g.label}
            </button>
          ))}
        </div>
        {/* 프리셋 버튼들 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {PRESET_GROUPS[activeGroup].items.map((p) => {
            const added = subs.some((s) => s.name === p.name);
            const color = PRESET_GROUPS[activeGroup].color;
            return (
              <button key={p.name} onClick={() => addPreset(p)} disabled={added}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4,
                  padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                  background: added ? '#f2f2f7' : `${color}10`,
                  color:      added ? '#aeaeb2' : color,
                  border:     `1.5px solid ${added ? '#e5e5ea' : `${color}35`}`,
                  cursor: added ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                  minWidth: 130,
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{p.emoji}</span>
                  <span style={{ fontWeight: 700 }}>{fmt(p.monthly)}원</span>
                  {added && <span style={{ fontSize: 11 }}>✓</span>}
                </div>
                <span style={{ fontSize: 11, color: added ? '#c7c7cc' : `${color}bb`, fontWeight: 500, lineHeight: 1.3 }}>
                  {p.name.replace(p.emoji, '').trim()}
                </span>
                {'tier' in p && (
                  <span style={{ fontSize: 10, color: added ? '#c7c7cc' : `${color}88`, fontWeight: 600 }}>
                    {(p as { tier: string }).tier}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* ── 구독 목록 ── */}
      <Card title="📋 내 구독 목록" icon={<CreditCard size={18}/>} accentColor={TOKEN.primary}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* 등록된 구독들 */}
          {subs.length === 0 && (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#aeaeb2', fontSize: 14 }}>
              위에서 서비스를 선택해 추가하세요 👆
            </div>
          )}
          {subs.map((sub) => (
            <div key={sub.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 20px', background: '#f9f9fb',
              borderRadius: 14, border: '1.5px solid #e5e5ea',
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{sub.emoji}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#1d1d1f' }}>{sub.name}</span>
              <span className="num" style={{ fontSize: 15, fontWeight: 800, color: TOKEN.primary, minWidth: 90, textAlign: 'right' }}>
                {fmt(sub.monthly)}원
              </span>
              <span style={{ fontSize: 12, color: '#aeaeb2', minWidth: 60, textAlign: 'right' }}>
                /월
              </span>
              <button onClick={() => removeSub(sub.id)}
                style={{ color: TOKEN.danger, flexShrink: 0, opacity: 0.7, padding: 4 }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}>
                <Trash2 size={16}/>
              </button>
            </div>
          ))}

          {/* 기타 슬롯 */}
          <div style={{ marginTop: 8, marginBottom: 4 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#8e8e93', marginBottom: 10 }}>
              ➕ 기타 (직접 입력)
            </p>
            {custom.map((slot, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', background: '#fff',
                borderRadius: 12, border: '1.5px dashed #d1d1d6', marginBottom: 8,
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>📌</span>
                <input
                  type="text"
                  placeholder={`기타 ${i + 1} — 서비스명`}
                  value={slot.name}
                  onChange={(e) => updateCustom(i, 'name', e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={onFocus} onBlur={onBlur}
                />
                <input
                  type="number"
                  placeholder="월 금액"
                  value={slot.monthly}
                  min={0}
                  onChange={(e) => updateCustom(i, 'monthly', e.target.value)}
                  style={{ ...inputStyle, width: 110, textAlign: 'right' }}
                  onFocus={onFocus} onBlur={onBlur}
                />
                <span style={{ fontSize: 13, color: '#8e8e93', flexShrink: 0, fontWeight: 600 }}>원/월</span>
              </div>
            ))}
          </div>

          {/* 합계 */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 20px', borderRadius: 14,
            background: `${TOKEN.primary}08`, border: `1.5px solid ${TOKEN.primary}20`,
            marginTop: 4,
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#3a3a3c' }}>
              🧮 월 구독 합계 ({subs.length + custom.filter(c => Number(c.monthly) > 0).length}개)
            </span>
            <span className="num" style={{ fontSize: 22, fontWeight: 800, color: TOKEN.primary }}>
              {fmt(totalMonthly)}원
            </span>
          </div>
        </div>
      </Card>

      {/* ── 결과 StatCards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14 }}>
        <StatCard label="월 구독 합계"        value={`${fmt(totalMonthly)}원`}          sub={`${subs.length + custom.filter(c=>Number(c.monthly)>0).length}개 서비스`}  color={TOKEN.primary}   icon={<CreditCard size={18}/>}/>
        <StatCard label="연간 지출"           value={`${fmt(annual)}원`}                sub="1년 기준"              color={TOKEN.warning}   icon={<CreditCard size={18}/>}/>
        <StatCard label={`${investYears}년 누적 지출`} value={`${fmtEok(decade)}원`}    sub="단순 합산"             color={TOKEN.danger}    icon={<TrendingUp size={18}/>}/>
        <StatCard label={`투자했다면`}         value={`${fmtEok(invested)}원`}           sub={`연 ${investRate}% 복리`} color={TOKEN.success} icon={<TrendingUp size={18}/>}/>
      </div>

      {/* ── 투자 가정 설정 ── */}
      <Card title="📊 투자 기회비용 설정" icon={<TrendingUp size={18}/>} accentColor={TOKEN.success}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73', display: 'block', marginBottom: 8 }}>
              연 수익률 (%)
            </label>
            <input type="number" min={0} max={30} step={0.5} value={investRate}
              onChange={(e) => setInvestRate(Number(e.target.value))}
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
              onFocus={onFocus} onBlur={onBlur}/>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73', display: 'block', marginBottom: 8 }}>
              비교 기간 (년)
            </label>
            <input type="number" min={1} max={40} step={1} value={investYears}
              onChange={(e) => setInvestYears(Number(e.target.value))}
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
              onFocus={onFocus} onBlur={onBlur}/>
          </div>
        </div>

        {/* 기회비용 결과 */}
        <div style={{
          padding: '18px 22px', borderRadius: 14,
          background: 'linear-gradient(135deg,#ecfdf5,#f0fdf4)',
          border: `1px solid ${TOKEN.success}25`,
        }}>
          <p style={{ fontSize: 14, color: '#1d1d1f', lineHeight: 1.9, margin: 0 }}>
            매월 <strong style={{ color: TOKEN.primary }}>{fmt(totalMonthly)}원</strong>의 구독료를
            대신 연 <strong style={{ color: TOKEN.success }}>{investRate}%</strong>로
            <strong style={{ color: '#1d1d1f' }}> {investYears}년</strong> 투자하면
            → <strong style={{ color: TOKEN.success, fontSize: 17 }}>{fmtEok(invested)}원</strong><br/>
            <span style={{ fontSize: 13, color: '#6e6e73' }}>
              실제 지출 {fmtEok(decade)}원 대비{' '}
              <strong style={{ color: TOKEN.danger }}>+{fmtEok(invested - decade)}원</strong> 차이
            </span>
          </p>
        </div>
      </Card>

      {/* ── 활용 팁 ── */}
      <Card title="💡 활용 예시 & 절약 팁" icon={<Info size={18}/>} accentColor={TOKEN.warning}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { emoji: '🔍', title: '미사용 구독 발견',     desc: '실제로 한 달에 몇 번 사용했는지 떠올려보세요. 한 번도 사용 안 했다면 즉시 해지 후보입니다.' },
            { emoji: '👫', title: '가족·지인과 계정 공유', desc: '넷플릭스·유튜브 등 다인 요금제를 가족과 나누면 1인 비용이 절반 이하로 줄어듭니다.' },
            { emoji: '📅', title: '연간 결제로 전환',      desc: '연간 결제 시 보통 2개월 분 할인(약 17% 절약). 스포티파이·유튜브 등이 대표적입니다.' },
            { emoji: '🔄', title: '돌려쓰기 전략',         desc: '한 번에 2~3개를 구독하지 말고 시즌별로 콘텐츠 많은 서비스 1개만 유지합니다.' },
          ].map((tip) => (
            <div key={tip.title} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              padding: '16px 20px', background: '#f9f9fb', borderRadius: 14,
            }}>
              <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1 }}>{tip.emoji}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1d1d1f', marginBottom: 4 }}>{tip.title}</p>
                <p style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.7, margin: 0 }}>{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}
