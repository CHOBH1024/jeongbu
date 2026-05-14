import { useState } from 'react';
import {
  Rocket, Building2, Monitor, Coins, Truck, Wallet,
  Calculator, Moon, Sun, ChevronLeft, ChevronRight,
  ArrowRight, Briefcase, X, Mail, Shield, Info,
  TrendingUp, Users, Zap, BookOpen, Clock, Tag,
  FileText, Sparkles, Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { LoanRefinancing }       from './components/calculators/LoanRefinancing';
import { FireSimulator }         from './components/calculators/FireSimulator';
import { NJobCalculator }        from './components/calculators/NJobCalculator';
import { LottoOpportunity }      from './components/calculators/LottoOpportunity';
import { RemittanceOptimizer }   from './components/calculators/RemittanceOptimizer';
import { CarPoorTimer }          from './components/calculators/CarPoorTimer';
import { SeveranceCalculator }   from './components/calculators/SeveranceCalculator';
import { NasElectricity }        from './components/calculators/NasElectricity';
import { ParkingAccount }        from './components/calculators/ParkingAccount';
import { AnnualLeave }           from './components/calculators/AnnualLeave';
import { InsuranceContribution } from './components/calculators/InsuranceContribution';
import { DripSnowball }          from './components/calculators/DripSnowball';
import { SilverAvgPrice }        from './components/calculators/SilverAvgPrice';
import { MovingCost }            from './components/calculators/MovingCost';
import { BrokerFee }             from './components/calculators/BrokerFee';
import { SubscriptionLeak }      from './components/calculators/SubscriptionLeak';
import { CoffeeRetirement }      from './components/calculators/CoffeeRetirement';
import { AiVsCloud }             from './components/calculators/AiVsCloud';
import { ServerTco }             from './components/calculators/ServerTco';
import { PrivacyPolicy }         from './components/pages/PrivacyPolicy';
import { TermsOfService }        from './components/pages/TermsOfService';
import { ARTICLES, type Article } from './data/articles';

type CalcDef = {
  id: string; name: string; desc: string;
  component?: React.ReactNode; status?: '준비중'; isNew?: boolean;
};
type Category = {
  id: string; name: string; icon: React.ReactNode;
  color: string; bg: string; desc: string; calculators: CalcDef[];
};

const CATEGORIES: Category[] = [
  {
    id: 'viral', name: '재무 시뮬레이터',
    icon: <Rocket size={20} />, color: '#6366f1', bg: '#eef2ff',
    desc: '대출부터 FIRE까지, 당신의 재무 미래를 시뮬레이션합니다',
    calculators: [
      { id: 'loan',  name: '대출 이자 · 대환 시뮬레이터',  desc: '현재 대출과 새 대출의 이자 차이를 한눈에 비교',    component: <LoanRefinancing /> },
      { id: 'fire',  name: 'FIRE(조기은퇴) 시뮬레이터',    desc: '목표 자산과 생존 자금을 역산해 은퇴 시점을 계산', component: <FireSimulator /> },
      { id: 'njob',  name: 'N잡 · 프리랜서 실소득 계산기', desc: '세금·4대보험 공제 후 실수령액을 정확히 계산',     component: <NJobCalculator /> },
      { id: 'lotto', name: '로또 vs S&P500 기회비용',       desc: '로또 구입비를 투자했다면 얼마가 됐을지 비교',    component: <LottoOpportunity /> },
      { id: 'remit', name: '해외송금 환율 최적화',          desc: '수수료·환율 포함 실제 수령액 비교',              component: <RemittanceOptimizer /> },
    ],
  },
  {
    id: 'hr', name: '인사 · 노무',
    icon: <Building2 size={20} />, color: '#10b981', bg: '#ecfdf5',
    desc: '퇴직금, 연차 등 근로자가 꼭 알아야 할 계산기',
    calculators: [
      { id: 'severance', name: '퇴직금 정밀 계산기',   desc: '평균임금 기준 법정 퇴직금을 정확하게 계산',    component: <SeveranceCalculator /> },
      { id: 'annual',    name: '연차 계산기',           desc: '입사일 기준 연차 발생일수 및 잔여일수 계산',   component: <AnnualLeave />, isNew: true },
      { id: 'insurance', name: '4대보험 사업자 부담금', desc: '회사 부담 4대보험료를 직종·급여별로 산출',    component: <InsuranceContribution />, isNew: true },
    ],
  },
  {
    id: 'tech', name: 'IT 인프라',
    icon: <Monitor size={20} />, color: '#3b82f6', bg: '#eff6ff',
    desc: '개발자와 IT 매니아를 위한 비용 분석 도구',
    calculators: [
      { id: 'nas',   name: 'NAS 24시간 전기요금 계산기',   desc: '누진세 포함 월 전기요금과 손익분기점 계산', component: <NasElectricity /> },
      { id: 'ai',    name: 'Local AI vs Cloud API 가성비', desc: 'GPU 구매 vs 클라우드 API 비용 비교',       component: <AiVsCloud />, isNew: true },
      { id: 'cloud', name: '클라우드 vs 물리 서버 손익',   desc: '총 소유비용(TCO) 기준 최적 선택 안내',     component: <ServerTco />, isNew: true },
    ],
  },
  {
    id: 'invest', name: '투자 · 자산',
    icon: <Coins size={20} />, color: '#f59e0b', bg: '#fffbeb',
    desc: '파킹통장부터 배당 스노우볼까지, 자산을 굴리는 법',
    calculators: [
      { id: 'parking', name: '파킹통장 일복리 쪼개기',        desc: '은행별 금리 비교와 복리 수익을 시각화',       component: <ParkingAccount /> },
      { id: 'silver',  name: '은(Silver) 현물 평단가 계산기', desc: '분할 매수 시 평균 단가와 손익을 계산',        component: <SilverAvgPrice />, isNew: true },
      { id: 'drip',    name: '배당주 재투자 스노우볼',        desc: '배당금 재투자로 쌓이는 복리 효과 시뮬레이션', component: <DripSnowball />, isNew: true },
    ],
  },
  {
    id: 'estate', name: '부동산 · 이사',
    icon: <Truck size={20} />, color: '#ec4899', bg: '#fdf2f8',
    desc: '이사 비용부터 중개 수수료까지 한 번에 파악',
    calculators: [
      { id: 'moving', name: '포장이사 견적 예측기',    desc: '거리·물량 기준 이사 비용 예상액 산출',     component: <MovingCost />, isNew: true },
      { id: 'broker', name: '중개 수수료 · 등기 비용', desc: '매매·전세 중개보수와 취득세 합산 계산',    component: <BrokerFee />, isNew: true },
    ],
  },
  {
    id: 'daily', name: '지출 통제',
    icon: <Wallet size={20} />, color: '#ef4444', bg: '#fef2f2',
    desc: '무의식 지출을 숫자로 때려잡는 뼈 때리기 계산기',
    calculators: [
      { id: 'carpoor', name: '자동차 할부 vs 카푸어 타이머', desc: '차 할부가 자산에 미치는 실질적 충격 계산',  component: <CarPoorTimer /> },
      { id: 'sub',     name: '구독료 누수 탐지기',           desc: '월별 구독 지출이 연간·10년에 얼마인지 계산', component: <SubscriptionLeak />, isNew: true },
      { id: 'coffee',  name: '커피값 노후 연금 환산기',      desc: '매일 커피값을 투자했다면 노후에 얼마가 될까', component: <CoffeeRetirement />, isNew: true },
    ],
  },
];

const FEATURED = ['loan', 'annual', 'fire', 'severance', 'drip', 'broker', 'sub', 'insurance', 'coffee'];
function getFeatured() {
  return CATEGORIES.flatMap((c) =>
    c.calculators
      .filter((cc) => FEATURED.includes(cc.id) && !cc.status)
      .map((cc) => ({ ...cc, catName: c.name, catColor: c.color, catBg: c.bg }))
  );
}

/* ─── App ───────────────────────────────────────────────── */
export default function App() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCalcId,   setActiveCalcId]   = useState<string | null>(null);
  const [isDark,         setIsDark]         = useState(false);
  const [modal,          setModal]          = useState<'privacy' | 'about' | 'terms' | null>(null);
  const [activeArticle,  setActiveArticle]  = useState<Article | null>(null);

  const selectedCategory = CATEGORIES.find((c) => c.id === activeCategory);
  const selectedCalc     = selectedCategory?.calculators.find((c) => c.id === activeCalcId);
  const reset = () => { setActiveCategory(null); setActiveCalcId(null); };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen transition-colors duration-300" style={{ background: isDark ? '#0a0a0f' : '#ffffff' }}>

        {/* ── Nav ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 glass-nav" role="banner">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4" style={{ height: 60 }}>
            <button onClick={reset} className="flex items-center gap-2.5 shrink-0" aria-label="홈으로">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center animate-float"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
              >
                <Calculator size={16} className="text-white" />
              </div>
              <span className="font-extrabold text-lg text-gradient" style={{ letterSpacing: '-0.02em' }}>
                별의별 계산기
              </span>
            </button>

            <nav className="hidden lg:flex items-center gap-0.5" aria-label="사이트 메뉴">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setActiveCalcId(null); }}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted hover:text-primary transition-colors"
                  style={{ color: isDark ? '#94a3b8' : '#374151' }}
                >
                  {cat.name}
                </button>
              ))}
            </nav>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: isDark ? '#94a3b8' : '#6b7280', background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6' }}
              aria-label={isDark ? '라이트 모드' : '다크 모드'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* ── Main ────────────────────────────────────────── */}
        <main id="main-content">
          <AnimatePresence mode="wait">

            {/* ── Home ──────────────────────────────────── */}
            {!activeCategory && (
              <motion.div key="home" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>

                {/* Hero */}
                <section className="relative pt-16 pb-20 px-4 sm:px-6 overflow-hidden" aria-labelledby="hero-heading">
                  {/* Background decoration */}
                  <div
                    className="absolute inset-x-0 top-0 h-1 hero-strip"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.07] pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse,#6366f1,transparent 70%)' }}
                    aria-hidden="true"
                  />

                  <div className="max-w-6xl mx-auto text-center relative z-10">
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
                      className="inline-flex items-center gap-1.5 mb-6 badge-primary"
                    >
                      <Sparkles size={12} />
                      완전 무료 · 개인정보 미수집 · 즉시 계산
                    </motion.div>

                    {/* H1 */}
                    <motion.h1
                      id="hero-heading"
                      initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-5"
                      style={{ color: isDark ? '#f1f5f9' : '#111827', letterSpacing: '-0.025em' }}
                    >
                      복잡한 계산,<br />
                      <span className="text-gradient">숫자로 바로 해결</span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }}
                      className="text-base sm:text-lg max-w-xl mx-auto mb-14 leading-relaxed"
                      style={{ color: isDark ? '#94a3b8' : '#4b5563' }}
                    >
                      대출 이자, 퇴직금, 연차, FIRE 시뮬레이터까지.<br />
                      인터넷 검색 없이 바로 정확한 결과를 확인하세요.
                    </motion.p>

                    {/* Stats — solid colored boxes */}
                    <motion.div
                      initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.16 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-20"
                    >
                      {[
                        { cls:'stat-indigo', value:'18+',  label:'계산기 운영 중',    icon:<Calculator size={20}/> },
                        { cls:'stat-green',  value:'즉시', label:'실시간 계산 결과', icon:<Zap size={20}/> },
                        { cls:'stat-amber',  value:'0건',  label:'개인정보 미수집',  icon:<Lock size={20}/> },
                        { cls:'stat-pink',   value:'무료', label:'완전 무료 서비스', icon:<TrendingUp size={20}/> },
                      ].map((s) => (
                        <div key={s.label} className={`${s.cls} rounded-2xl px-4 py-5 text-center text-white`}>
                          <div className="flex justify-center mb-1.5 opacity-90">{s.icon}</div>
                          <div className="text-2xl font-extrabold tabular">{s.value}</div>
                          <div className="text-xs mt-0.5 opacity-85 font-medium leading-snug">{s.label}</div>
                        </div>
                      ))}
                    </motion.div>

                    {/* Featured calcs */}
                    <SectionHeader title="⭐ 인기 계산기" sub="가장 많이 사용되는 계산기를 바로 이용해보세요" isDark={isDark} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
                      {getFeatured().map((calc, idx) => (
                        <motion.button
                          key={calc.id}
                          initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay: idx*0.05 }}
                          onClick={() => {
                            const cat = CATEGORIES.find((c) => c.calculators.some((cc) => cc.id === calc.id));
                            if (cat) { setActiveCategory(cat.id); setActiveCalcId(calc.id); }
                          }}
                          className="card card-hover rounded-2xl p-5 text-left group relative"
                        >
                          {/* Left accent bar */}
                          <div
                            className="card-accent-bar"
                            style={{ background: calc.catColor }}
                          />
                          <div className="pl-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                                style={{ color: calc.catColor, background: calc.catBg }}
                              >
                                {calc.catName}
                              </span>
                              {calc.isNew && <span className="tag-new">NEW</span>}
                            </div>
                            <h3
                              className="font-bold text-base leading-snug mb-1.5 group-hover:text-primary transition-colors"
                              style={{ color: isDark ? '#f1f5f9' : '#111827' }}
                            >
                              {calc.name}
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                              {calc.desc}
                            </p>
                          </div>
                          <div
                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5"
                            style={{ color: calc.catColor }}
                          >
                            <ArrowRight size={16} />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Categories grid — gray bg section */}
                <section className="section-gray py-16 px-4 sm:px-6">
                  <div className="max-w-6xl mx-auto">
                    <SectionHeader title="📂 전체 카테고리" sub="원하는 분야의 계산기를 골라보세요" isDark={isDark} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {CATEGORIES.map((cat, idx) => {
                        const available = cat.calculators.filter((c) => !c.status).length;
                        return (
                          <motion.button
                            key={cat.id}
                            initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay: idx*0.06 }}
                            onClick={() => setActiveCategory(cat.id)}
                            className="card card-hover rounded-2xl p-6 text-left group"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center"
                                style={{ background: cat.bg, color: cat.color }}
                              >
                                {cat.icon}
                              </div>
                              <div>
                                <h3
                                  className="font-bold text-sm"
                                  style={{ color: isDark ? '#f1f5f9' : '#111827' }}
                                >
                                  {cat.name}
                                </h3>
                                <span className="text-xs" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                                  {available}개 이용 가능
                                </span>
                              </div>
                            </div>
                            <p
                              className="text-xs mb-4 leading-relaxed"
                              style={{ color: isDark ? '#94a3b8' : '#4b5563' }}
                            >
                              {cat.desc}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {cat.calculators.map((c) => (
                                <span
                                  key={c.id}
                                  className="tag"
                                  style={
                                    c.status
                                      ? { background: isDark ? '#1e293b' : '#f3f4f6', color: isDark ? '#94a3b8' : '#9ca3af' }
                                      : { background: cat.color }
                                  }
                                >
                                  {c.name.split(' ')[0]}{c.isNew ? ' ✦' : ''}
                                </span>
                              ))}
                            </div>
                            <div
                              className="flex items-center gap-1 mt-4 text-xs font-semibold group-hover:gap-2 transition-all"
                              style={{ color: cat.color }}
                            >
                              바로가기 <ChevronRight size={13} />
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* Articles */}
                <section className="py-16 px-4 sm:px-6">
                  <div className="max-w-6xl mx-auto">
                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <BookOpen size={19} style={{ color: '#6366f1' }} />
                          <h2
                            className="text-xl font-extrabold"
                            style={{ color: isDark ? '#f1f5f9' : '#111827' }}
                          >
                            알아두면 돈 되는 금융 상식
                          </h2>
                        </div>
                        <p className="text-sm ml-7" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                          계산기와 함께 읽으면 더 유용한 실전 가이드
                        </p>
                      </div>
                      <span className="hidden sm:block text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#eef2ff', color: '#6366f1' }}>
                        {ARTICLES.length}개 가이드
                      </span>
                    </div>

                    {/* Top 6 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {ARTICLES.slice(0, 6).map((article, idx) => (
                        <motion.button
                          key={article.id}
                          initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay: idx*0.05 }}
                          onClick={() => setActiveArticle(article)}
                          className="card card-hover rounded-2xl p-5 text-left group"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#eef2ff', color: '#6366f1' }}>
                              {article.category}
                            </span>
                            <span className="flex items-center gap-1 text-xs" style={{ color: isDark ? '#94a3b8' : '#9ca3af' }}>
                              <Clock size={11} /> {article.readTime}
                            </span>
                          </div>
                          <h3
                            className="font-bold text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2"
                            style={{ color: isDark ? '#f1f5f9' : '#111827' }}
                          >
                            {article.title}
                          </h3>
                          <p
                            className="text-xs leading-relaxed line-clamp-3"
                            style={{ color: isDark ? '#94a3b8' : '#4b5563' }}
                          >
                            {article.summary}
                          </p>
                          <div className="flex items-center gap-1 mt-4 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#6366f1' }}>
                            자세히 읽기 <ArrowRight size={11} />
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Rest as rows */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {ARTICLES.slice(6).map((article, idx) => (
                        <motion.button
                          key={article.id}
                          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.30 + idx*0.035 }}
                          onClick={() => setActiveArticle(article)}
                          className="card card-hover rounded-xl p-3.5 text-left group flex gap-3 items-center"
                        >
                          <div
                            className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ background: '#eef2ff', color: '#6366f1' }}
                          >
                            <FileText size={15} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#6366f1' }}>
                                {article.category}
                              </span>
                              <span className="flex items-center gap-1 text-[11px]" style={{ color: isDark ? '#94a3b8' : '#9ca3af' }}>
                                <Clock size={10} /> {article.readTime}
                              </span>
                            </div>
                            <h3
                              className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors"
                              style={{ color: isDark ? '#f1f5f9' : '#111827' }}
                            >
                              {article.title}
                            </h3>
                          </div>
                          <ChevronRight size={15} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#6366f1' }} />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* About */}
                <section className="section-indigo py-16 px-4 sm:px-6 relative overflow-hidden" aria-labelledby="about-heading">
                  <div className="absolute inset-0 grid-dots opacity-40 pointer-events-none" aria-hidden="true" />
                  <div className="max-w-6xl mx-auto relative">
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-2 mb-3 badge-primary">
                        <Info size={12} />
                        별의별 계산기란?
                      </div>
                      <h2
                        id="about-heading"
                        className="text-2xl md:text-3xl font-extrabold leading-tight"
                        style={{ color: isDark ? '#f1f5f9' : '#111827', letterSpacing: '-0.02em' }}
                      >
                        복잡한 금융 계산을<br />누구나 쉽게
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { icon:<Shield size={22}/>, color:'#10b981', bg:'#ecfdf5', title:'개인정보 완전 보호',    desc:'서버에 어떤 데이터도 저장하지 않습니다. 모든 계산은 브라우저에서만 이루어집니다.' },
                        { icon:<Zap size={22}/>,    color:'#6366f1', bg:'#eef2ff', title:'실시간 즉시 계산',      desc:'숫자를 입력하는 즉시 결과가 업데이트됩니다. 별도의 버튼 클릭이 필요 없습니다.' },
                        { icon:<Users size={22}/>,  color:'#f59e0b', bg:'#fffbeb', title:'전문가 수준 정확도',    desc:'금융감독원 기준과 세법을 반영한 정확한 계산 로직으로 신뢰할 수 있는 결과를 제공합니다.' },
                      ].map((item) => (
                        <div key={item.title} className="card rounded-2xl p-6 flex gap-4">
                          <div
                            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                            style={{ background: item.bg, color: item.color }}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <h3
                              className="font-bold mb-1.5"
                              style={{ color: isDark ? '#f1f5f9' : '#111827' }}
                            >
                              {item.title}
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: isDark ? '#94a3b8' : '#4b5563' }}>
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

              </motion.div>
            )}

            {/* ── Category List ────────────────────────── */}
            {activeCategory && !activeCalcId && (
              <motion.div
                key="category"
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                transition={{ duration:0.2 }}
                className="max-w-6xl mx-auto px-4 sm:px-6 py-10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <BackButton onClick={reset} isDark={isDark} />
                  <div>
                    <Breadcrumb parts={[{ label:'홈', onClick:reset },{ label: selectedCategory?.name ?? '' }]} isDark={isDark} />
                    <h2 className="text-2xl font-extrabold" style={{ color: selectedCategory?.color }}>
                      {selectedCategory?.name}
                    </h2>
                  </div>
                </div>
                <p className="text-sm ml-14 mb-8" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                  {selectedCategory?.desc}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCategory?.calculators.map((calc, idx) => (
                    <motion.button
                      key={calc.id}
                      initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: idx*0.06 }}
                      onClick={() => calc.status !== '준비중' && setActiveCalcId(calc.id)}
                      disabled={calc.status === '준비중'}
                      className={`card rounded-2xl p-6 text-left relative ${
                        calc.status === '준비중' ? 'opacity-50 cursor-not-allowed' : 'card-hover cursor-pointer'
                      }`}
                    >
                      <div
                        className="card-accent-bar"
                        style={{ background: selectedCategory?.color }}
                      />
                      <div className="pl-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3
                              className="font-bold"
                              style={{ color: isDark ? '#f1f5f9' : '#111827' }}
                            >
                              {calc.name}
                            </h3>
                            {calc.isNew && <span className="tag-new">NEW</span>}
                            {calc.status && (
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{ background: isDark ? '#1e293b' : '#f3f4f6', color: isDark ? '#94a3b8' : '#9ca3af' }}
                              >
                                준비중
                              </span>
                            )}
                          </div>
                          <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#4b5563' }}>{calc.desc}</p>
                        </div>
                        {!calc.status && (
                          <ChevronRight size={18} className="flex-shrink-0 mt-0.5" style={{ color: isDark ? '#94a3b8' : '#9ca3af' }} />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Calculator View ─────────────────────── */}
            {activeCategory && activeCalcId && (
              <motion.div
                key={activeCalcId}
                initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-14 }}
                transition={{ duration:0.2 }}
                className="max-w-6xl mx-auto px-4 sm:px-6 py-10"
              >
                <div className="flex items-center gap-3 mb-8">
                  <BackButton onClick={() => setActiveCalcId(null)} isDark={isDark} />
                  <div>
                    <Breadcrumb
                      parts={[
                        { label:'홈', onClick:reset },
                        { label: selectedCategory?.name ?? '', onClick:() => setActiveCalcId(null) },
                        { label: selectedCalc?.name ?? '' },
                      ]}
                      isDark={isDark}
                    />
                    <h2
                      className="text-2xl font-extrabold"
                      style={{ color: isDark ? '#f1f5f9' : '#111827' }}
                    >
                      {selectedCalc?.name}
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                      {selectedCalc?.desc}
                    </p>
                  </div>
                </div>
                {selectedCalc?.component}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ── Footer ──────────────────────────────────────── */}
        <footer
          className="mt-0 border-t"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb' }}
          role="contentinfo"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                    <Calculator size={14} className="text-white" />
                  </div>
                  <span className="font-extrabold text-gradient">별의별 계산기</span>
                </div>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: isDark ? '#94a3b8' : '#4b5563' }}>
                  대출, 퇴직금, 연차, FIRE 등 일상의 복잡한 계산을 무료로 해결하는 스마트 계산기 서비스입니다.
                </p>
                <p className="text-xs mt-4 leading-relaxed" style={{ color: isDark ? '#64748b' : '#9ca3af' }}>
                  ※ 계산 결과는 참고용이며 실제 금융 상품·법률과 차이가 있을 수 있습니다. 중요한 결정 전 전문가 상담을 권장합니다.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold mb-3" style={{ color: isDark ? '#e2e8f0' : '#374151' }}>주요 계산기</h3>
                <ul className="space-y-2">
                  {[
                    { id:'loan',      cat:'viral',  name:'대출 이자 계산기' },
                    { id:'fire',      cat:'viral',  name:'FIRE 시뮬레이터' },
                    { id:'severance', cat:'hr',     name:'퇴직금 계산기' },
                    { id:'annual',    cat:'hr',     name:'연차 계산기' },
                    { id:'parking',   cat:'invest', name:'파킹통장 계산기' },
                  ].map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => { setActiveCategory(item.cat); setActiveCalcId(item.id); }}
                        className="text-sm hover:text-primary transition-colors"
                        style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold mb-3" style={{ color: isDark ? '#e2e8f0' : '#374151' }}>정보</h3>
                <ul className="space-y-2">
                  {[
                    { icon:<Info size={13}/>,      label:'서비스 소개',      action:() => setModal('about'),   href:null },
                    { icon:<Shield size={13}/>,    label:'개인정보처리방침', action:() => setModal('privacy'), href:null },
                    { icon:<FileText size={13}/>,  label:'이용약관',          action:() => setModal('terms'),   href:null },
                    { icon:<Mail size={13}/>,      label:'문의하기',          action:null, href:'mailto:mirririnside1024@gmail.com' },
                    { icon:<Briefcase size={13}/>, label:'광고 문의',         action:null, href:'mailto:mirririnside1024@gmail.com' },
                  ].map((item) => (
                    <li key={item.label}>
                      {item.href ? (
                        <a href={item.href} className="text-sm hover:text-primary transition-colors flex items-center gap-1.5" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                          {item.icon} {item.label}
                        </a>
                      ) : (
                        <button onClick={item.action!} className="text-sm hover:text-primary transition-colors flex items-center gap-1.5" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                          {item.icon} {item.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div
              className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb', color: isDark ? '#64748b' : '#9ca3af' }}
            >
              <p>© 2026 별의별 계산기. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setModal('privacy')} className="hover:text-primary transition-colors">개인정보처리방침</button>
                <span>·</span>
                <button onClick={() => setModal('terms')} className="hover:text-primary transition-colors">이용약관</button>
                <span>·</span>
                <button onClick={() => setModal('about')} className="hover:text-primary transition-colors">서비스 소개</button>
              </div>
            </div>
          </div>
        </footer>

        {/* ── Legal Modals ─────────────────────────────────── */}
        <AnimatePresence>
          {modal && (
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)' }}
              onClick={() => setModal(null)}
            >
              <motion.div
                initial={{ scale:0.96, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.96, y:20 }}
                onClick={(e) => e.stopPropagation()}
                className="rounded-2xl shadow-elevated max-w-2xl w-full max-h-[85vh] overflow-y-auto"
                style={{ background: isDark ? '#14161f' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb' }}
              >
                <div
                  className="flex items-center justify-between p-6 border-b"
                  style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb' }}
                >
                  <h2 className="text-xl font-extrabold" style={{ color: isDark ? '#f1f5f9' : '#111827' }}>
                    {modal === 'privacy' ? '개인정보처리방침' : modal === 'terms' ? '이용약관' : '서비스 소개'}
                  </h2>
                  <button
                    onClick={() => setModal(null)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: isDark ? '#94a3b8' : '#6b7280', background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6' }}
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  {modal === 'privacy' ? <PrivacyPolicy /> : modal === 'terms' ? <TermsOfService /> : <AboutContent isDark={isDark} />}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Article Modal ─────────────────────────────────── */}
        <AnimatePresence>
          {activeArticle && (
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }}
              onClick={() => setActiveArticle(null)}
            >
              <motion.div
                initial={{ scale:0.96, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.96, y:20 }}
                onClick={(e) => e.stopPropagation()}
                className="rounded-2xl shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                style={{ background: isDark ? '#14161f' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb' }}
              >
                {/* Colored header strip */}
                <div className="h-1 hero-strip rounded-t-2xl" />
                <div className="p-6 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background:'#eef2ff', color:'#6366f1' }}>
                          {activeArticle.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: isDark ? '#94a3b8' : '#9ca3af' }}>
                          <Clock size={11} /> {activeArticle.readTime} 읽기
                        </span>
                      </div>
                      <h2 className="text-xl font-extrabold leading-tight" style={{ color: isDark ? '#f1f5f9' : '#111827' }}>
                        {activeArticle.title}
                      </h2>
                      <p className="text-sm mt-2 leading-relaxed" style={{ color: isDark ? '#94a3b8' : '#4b5563' }}>
                        {activeArticle.summary}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveArticle(null)}
                      className="flex-shrink-0 p-2 rounded-lg transition-colors"
                      style={{ color: isDark ? '#94a3b8' : '#6b7280', background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6' }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {activeArticle.content.map((p, i) => (
                    <p key={i} className="text-sm leading-7" style={{ color: isDark ? '#cbd5e1' : '#374151' }}>
                      {p}
                    </p>
                  ))}
                  <div
                    className="pt-4 border-t"
                    style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb' }}
                  >
                    <div className="flex flex-wrap gap-2">
                      {activeArticle.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                          style={{ background: isDark ? '#1e293b' : '#f3f4f6', color: isDark ? '#94a3b8' : '#6b7280' }}
                        >
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p
                    className="text-xs p-3 rounded-xl leading-relaxed"
                    style={{ background: isDark ? 'rgba(245,158,11,0.08)' : '#fffbeb', color: isDark ? '#d97706' : '#92400e', border: isDark ? '1px solid rgba(245,158,11,0.15)' : '1px solid #fde68a' }}
                  >
                    ※ 본 가이드는 참고용이며, 중요한 재무·법률 결정 전에는 전문가 상담을 권장합니다.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */
function SectionHeader({ title, sub, isDark }: { title: string; sub: string; isDark: boolean }) {
  return (
    <div className="text-left mb-6">
      <h2 className="text-xl font-extrabold mb-0.5" style={{ color: isDark ? '#f1f5f9' : '#111827' }}>
        {title}
      </h2>
      <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>{sub}</p>
    </div>
  );
}

function BackButton({ onClick, isDark }: { onClick: () => void; isDark: boolean }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg transition-colors"
      style={{ color: isDark ? '#94a3b8' : '#6b7280', background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6' }}
      aria-label="뒤로가기"
    >
      <ChevronLeft size={20} />
    </button>
  );
}

function Breadcrumb({ parts, isDark }: { parts: { label: string; onClick?: () => void }[]; isDark: boolean }) {
  return (
    <nav className="text-xs flex items-center gap-1 mb-0.5" style={{ color: isDark ? '#64748b' : '#9ca3af' }} aria-label="브레드크럼">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={10} />}
          {p.onClick
            ? <button onClick={p.onClick} className="hover:text-primary transition-colors">{p.label}</button>
            : <span style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>{p.label}</span>
          }
        </span>
      ))}
    </nav>
  );
}

function AboutContent({ isDark }: { isDark: boolean }) {
  const titleColor = isDark ? '#f1f5f9' : '#111827';
  const textColor  = isDark ? '#94a3b8' : '#4b5563';
  return (
    <div className="space-y-6 text-sm leading-relaxed" style={{ color: textColor }}>
      {[
        { title:'서비스 소개', content:'별의별 계산기는 대한민국 직장인과 투자자들이 자주 마주치는 복잡한 금융·생활 계산을 쉽고 정확하게 해결할 수 있도록 만들어진 무료 계산기 서비스입니다.' },
        { title:'면책 고지',   content:'본 서비스의 계산 결과는 참고용이며, 실제 금융 상품이나 법률과 차이가 있을 수 있습니다. 중요한 재무적 결정을 내리기 전에는 반드시 전문가(금융 상담사, 세무사, 노무사 등)와 상담하시기 바랍니다.' },
      ].map((s) => (
        <div key={s.title}>
          <h3 className="text-base font-bold mb-2" style={{ color: titleColor }}>{s.title}</h3>
          <p>{s.content}</p>
        </div>
      ))}
      <div>
        <h3 className="text-base font-bold mb-2" style={{ color: titleColor }}>주요 특징</h3>
        <ul className="list-disc list-inside space-y-1.5">
          {['대출 이자, 대환 비교, 상환 스케줄 시뮬레이션','FIRE(조기은퇴) 달성 시점 및 필요 자산 계산','퇴직금·연차 정확 계산 (근로기준법 기준)','N잡·프리랜서 실수령액 (세금 공제 반영)','파킹통장 일복리·은행 비교','NAS 전기요금 누진세 계산'].map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
      <div>
        <h3 className="text-base font-bold mb-2" style={{ color: titleColor }}>문의</h3>
        <p>서비스 이용 중 문의사항이 있으시면 이메일로 연락주세요.{' '}
          <a href="mailto:mirririnside1024@gmail.com" className="font-semibold" style={{ color:'#6366f1' }}>mirririnside1024@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
