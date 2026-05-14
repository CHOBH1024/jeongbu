import { useState } from 'react';
import {
  Rocket,
  Building2,
  Monitor,
  Coins,
  Truck,
  Wallet,
  Calculator,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Briefcase,
  X,
  Mail,
  Shield,
  Info,
  TrendingUp,
  Users,
  Zap,
  Star,
  BookOpen,
  Clock,
  Tag,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { LoanRefinancing } from './components/calculators/LoanRefinancing';
import { FireSimulator } from './components/calculators/FireSimulator';
import { NJobCalculator } from './components/calculators/NJobCalculator';
import { LottoOpportunity } from './components/calculators/LottoOpportunity';
import { RemittanceOptimizer } from './components/calculators/RemittanceOptimizer';
import { CarPoorTimer } from './components/calculators/CarPoorTimer';
import { SeveranceCalculator } from './components/calculators/SeveranceCalculator';
import { NasElectricity } from './components/calculators/NasElectricity';
import { ParkingAccount } from './components/calculators/ParkingAccount';
import { AnnualLeave } from './components/calculators/AnnualLeave';
import { PrivacyPolicy } from './components/pages/PrivacyPolicy';
import { TermsOfService } from './components/pages/TermsOfService';
import { ARTICLES, type Article } from './data/articles';

type CalcDef = {
  id: string;
  name: string;
  desc: string;
  component?: React.ReactNode;
  status?: '준비중';
  isNew?: boolean;
};

type Category = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  desc: string;
  calculators: CalcDef[];
};

const CATEGORIES: Category[] = [
  {
    id: 'viral',
    name: '재무 시뮬레이터',
    icon: <Rocket size={20} />,
    color: '#6366f1',
    desc: '대출부터 FIRE까지, 당신의 재무 미래를 시뮬레이션합니다',
    calculators: [
      { id: 'loan', name: '대출 이자 · 대환 시뮬레이터', desc: '현재 대출과 새 대출의 이자 차이를 한눈에 비교', component: <LoanRefinancing /> },
      { id: 'fire', name: 'FIRE(조기은퇴) 시뮬레이터', desc: '목표 자산과 생존 자금을 역산해 은퇴 시점을 계산', component: <FireSimulator /> },
      { id: 'njob', name: 'N잡 · 프리랜서 실소득 계산기', desc: '세금·4대보험 공제 후 실수령액을 정확히 계산', component: <NJobCalculator /> },
      { id: 'lotto', name: '로또 vs S&P500 기회비용', desc: '로또 구입비를 투자했다면 얼마가 됐을지 비교', component: <LottoOpportunity /> },
      { id: 'remit', name: '해외송금 환율 최적화', desc: '수수료·환율 포함 실제 수령액 비교', component: <RemittanceOptimizer /> },
    ],
  },
  {
    id: 'hr',
    name: '인사 · 노무',
    icon: <Building2 size={20} />,
    color: '#10b981',
    desc: '퇴직금, 연차 등 근로자가 꼭 알아야 할 계산기',
    calculators: [
      { id: 'severance', name: '퇴직금 정밀 계산기', desc: '평균임금 기준 법정 퇴직금을 정확하게 계산', component: <SeveranceCalculator /> },
      { id: 'annual', name: '연차 계산기', desc: '입사일 기준 연차 발생일수 및 잔여일수 계산', component: <AnnualLeave />, isNew: true },
      { id: 'insurance', name: '4대보험 사업자 부담금', desc: '회사 부담 4대보험료를 직종·급여별로 산출', status: '준비중' },
    ],
  },
  {
    id: 'tech',
    name: 'IT 인프라',
    icon: <Monitor size={20} />,
    color: '#3b82f6',
    desc: '개발자와 IT 매니아를 위한 비용 분석 도구',
    calculators: [
      { id: 'nas', name: 'NAS 24시간 전기요금 계산기', desc: '누진세 포함 월 전기요금과 손익분기점 계산', component: <NasElectricity /> },
      { id: 'ai', name: 'Local AI vs Cloud API 가성비', desc: 'GPU 구매 vs 클라우드 API 비용 비교', status: '준비중' },
      { id: 'cloud', name: '클라우드 vs 물리 서버 손익', desc: '총 소유비용(TCO) 기준 최적 선택 안내', status: '준비중' },
    ],
  },
  {
    id: 'invest',
    name: '투자 · 자산',
    icon: <Coins size={20} />,
    color: '#f59e0b',
    desc: '파킹통장부터 배당 스노우볼까지, 자산을 굴리는 법',
    calculators: [
      { id: 'parking', name: '파킹통장 일복리 쪼개기', desc: '은행별 금리 비교와 복리 수익을 시각화', component: <ParkingAccount /> },
      { id: 'silver', name: '은(Silver) 현물 평단가 계산기', desc: '분할 매수 시 평균 단가와 손익을 계산', status: '준비중' },
      { id: 'drip', name: '배당주 재투자 스노우볼', desc: '배당금 재투자로 쌓이는 복리 효과 시뮬레이션', status: '준비중' },
    ],
  },
  {
    id: 'estate',
    name: '부동산 · 이사',
    icon: <Truck size={20} />,
    color: '#ec4899',
    desc: '이사 비용부터 중개 수수료까지 한 번에 파악',
    calculators: [
      { id: 'moving', name: '포장이사 견적 예측기', desc: '거리·물량 기준 이사 비용 예상액 산출', status: '준비중' },
      { id: 'broker', name: '중개 수수료 · 등기 비용', desc: '매매·전세 중개보수와 취득세 합산 계산', status: '준비중' },
    ],
  },
  {
    id: 'daily',
    name: '지출 통제',
    icon: <Wallet size={20} />,
    color: '#ef4444',
    desc: '무의식 지출을 숫자로 때려잡는 뼈 때리기 계산기',
    calculators: [
      { id: 'carpoor', name: '자동차 할부 vs 카푸어 타이머', desc: '차 할부가 자산에 미치는 실질적 충격 계산', component: <CarPoorTimer /> },
      { id: 'sub', name: '구독료 누수 탐지기', desc: '월별 구독 지출이 연간·10년에 얼마인지 계산', status: '준비중' },
      { id: 'coffee', name: '커피값 노후 연금 환산기', desc: '매일 커피값을 투자했다면 노후에 얼마가 될까', status: '준비중' },
    ],
  },
];

const STATS = [
  { icon: <Calculator size={18} />, value: '9+', label: '계산기 운영 중' },
  { icon: <TrendingUp size={18} />, value: '무료', label: '완전 무료 서비스' },
  { icon: <Zap size={18} />, value: '실시간', label: '즉시 계산 결과' },
  { icon: <Shield size={18} />, value: '100%', label: '개인정보 미수집' },
];

const FEATURED = ['loan', 'annual', 'fire', 'severance', 'carpoor', 'parking'];

function getFeatured() {
  return CATEGORIES.flatMap((c) =>
    c.calculators
      .filter((calc) => FEATURED.includes(calc.id) && !calc.status)
      .map((calc) => ({ ...calc, categoryName: c.name, categoryColor: c.color }))
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCalcId, setActiveCalcId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [modal, setModal] = useState<'privacy' | 'about' | 'terms' | null>(null);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const selectedCategory = CATEGORIES.find((c) => c.id === activeCategory);
  const selectedCalc = selectedCategory?.calculators.find((c) => c.id === activeCalcId);

  const reset = () => {
    setActiveCategory(null);
    setActiveCalcId(null);
  };

  const featured = getFeatured();

  return (
    <div className={isDark ? 'dark' : ''} style={{ minHeight: '100vh' }}>
      <div
        className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300"
        style={{ backgroundColor: isDark ? '#080b14' : '#f8fafc' }}
      >
        {/* ── Navigation ───────────────────────────────── */}
        <header
          className="sticky top-0 z-50 glass-nav"
          role="banner"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <button
              onClick={reset}
              className="flex items-center gap-2.5 group"
              aria-label="홈으로"
            >
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-glow animate-float">
                <Calculator size={18} className="text-white" />
              </div>
              <span className="text-xl font-extrabold text-gradient">별의별 계산기</span>
            </button>

            <nav className="hidden md:flex items-center gap-1" aria-label="사이트 메뉴">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setActiveCalcId(null); }}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted transition-colors"
                aria-label={isDark ? '라이트 모드' : '다크 모드'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* ── Main Content ─────────────────────────────── */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10" id="main-content">
          <AnimatePresence mode="wait">
            {/* ─ Home Dashboard ─ */}
            {!activeCategory && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {/* Hero */}
                <section className="text-center pt-8 pb-16" aria-labelledby="hero-heading">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                    <Star size={14} />
                    완전 무료 · 광고 없이 계산 결과만
                  </div>
                  <h1
                    id="hero-heading"
                    className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight"
                  >
                    복잡한 계산,<br />
                    <span className="text-gradient">숫자로 바로 해결</span>
                  </h1>
                  <p className="text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                    대출 이자, 퇴직금, 연차, FIRE 시뮬레이터까지.<br />
                    인터넷 검색 없이 바로 결과를 확인하세요.
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-16">
                    {STATS.map((s) => (
                      <div
                        key={s.label}
                        className="glass rounded-2xl p-4 text-center"
                      >
                        <div className="flex justify-center mb-1 text-primary">{s.icon}</div>
                        <div className="text-xl font-extrabold text-primary">{s.value}</div>
                        <div className="text-xs text-muted mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Featured calculators */}
                  <div className="text-left mb-4">
                    <h2 className="text-xl font-bold mb-1">⭐ 인기 계산기</h2>
                    <p className="text-sm text-muted">가장 많이 사용되는 계산기를 바로 이용해보세요</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                    {featured.map((calc, idx) => (
                      <motion.button
                        key={calc.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        onClick={() => {
                          const cat = CATEGORIES.find((c) =>
                            c.calculators.some((cc) => cc.id === calc.id)
                          );
                          if (cat) {
                            setActiveCategory(cat.id);
                            setActiveCalcId(calc.id);
                          }
                        }}
                        className="glass rounded-2xl p-5 text-left hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
                        style={{ borderTop: `3px solid ${(calc as any).categoryColor}` }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-semibold mb-1.5" style={{ color: (calc as any).categoryColor }}>
                              {(calc as any).categoryName}
                              {calc.isNew && (
                                <span className="ml-2 px-1.5 py-0.5 bg-secondary/15 text-secondary rounded text-xs">NEW</span>
                              )}
                            </div>
                            <h3 className="font-bold text-sm leading-tight mb-1">{calc.name}</h3>
                            <p className="text-xs text-muted">{calc.desc}</p>
                          </div>
                          <ArrowRight
                            size={16}
                            className="flex-shrink-0 mt-1 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                          />
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* All categories */}
                  <div className="text-left mb-4">
                    <h2 className="text-xl font-bold mb-1">📂 전체 카테고리</h2>
                    <p className="text-sm text-muted">원하는 분야의 계산기를 골라보세요</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {CATEGORIES.map((cat, idx) => {
                      const available = cat.calculators.filter((c) => !c.status).length;
                      return (
                        <motion.button
                          key={cat.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.07 }}
                          onClick={() => setActiveCategory(cat.id)}
                          className="glass rounded-2xl p-6 text-left hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{ background: `${cat.color}1a`, color: cat.color }}
                            >
                              {cat.icon}
                            </div>
                            <div>
                              <h3 className="font-bold">{cat.name}</h3>
                              <span className="text-xs text-muted">
                                {available}개 이용 가능
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted mb-4 leading-relaxed">{cat.desc}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {cat.calculators.map((c) => (
                              <span
                                key={c.id}
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  c.status
                                    ? 'bg-slate-100 dark:bg-slate-800 text-muted'
                                    : 'text-white'
                                }`}
                                style={!c.status ? { backgroundColor: cat.color } : {}}
                              >
                                {c.name.split(' ')[0]}
                                {c.isNew && ' ✨'}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 mt-4 text-xs font-semibold group-hover:gap-2 transition-all" style={{ color: cat.color }}>
                            바로가기 <ChevronRight size={14} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </section>

                {/* Articles / Guide section */}
                <section className="mb-16" aria-labelledby="articles-heading">
                  <div className="text-left mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen size={20} className="text-primary" />
                      <h2 id="articles-heading" className="text-xl font-bold">알아두면 돈 되는 금융 상식</h2>
                    </div>
                    <p className="text-sm text-muted ml-7">계산기와 함께 읽으면 더 유용한 실전 가이드</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ARTICLES.slice(0, 6).map((article, idx) => (
                      <motion.button
                        key={article.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.055 }}
                        onClick={() => setActiveArticle(article)}
                        className="glass rounded-2xl p-5 text-left hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {article.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted">
                            <Clock size={11} /> {article.readTime}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs text-muted leading-relaxed line-clamp-3">
                          {article.summary}
                        </p>
                        <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          자세히 읽기 <ArrowRight size={12} />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {ARTICLES.length > 6 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {ARTICLES.slice(6).map((article, idx) => (
                        <motion.button
                          key={article.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.33 + idx * 0.055 }}
                          onClick={() => setActiveArticle(article)}
                          className="glass rounded-2xl p-5 text-left hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group flex gap-4"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-primary">{article.category}</span>
                              <span className="flex items-center gap-1 text-xs text-muted"><Clock size={11} /> {article.readTime}</span>
                            </div>
                            <h3 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </section>

                {/* About section for AdSense */}
                <section
                  className="glass rounded-3xl p-8 md:p-12 mb-12"
                  aria-labelledby="about-heading"
                >
                  <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 text-primary mb-4">
                      <Info size={20} />
                      <span className="font-bold">별의별 계산기란?</span>
                    </div>
                    <h2 id="about-heading" className="text-2xl md:text-3xl font-extrabold mb-4">
                      복잡한 금융 계산을 누구나 쉽게
                    </h2>
                    <p className="text-muted leading-relaxed mb-6">
                      별의별 계산기는 대출 이자, 퇴직금, 연차, 해외송금, FIRE 시뮬레이터 등
                      일상에서 꼭 필요하지만 계산하기 어려운 금융·생활 계산기를 무료로 제공합니다.
                      복잡한 공식을 몰라도, 숫자를 입력하면 즉시 정확한 결과를 확인할 수 있습니다.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                      {[
                        {
                          icon: <Shield size={20} />,
                          title: '개인정보 완전 보호',
                          desc: '서버에 어떤 데이터도 저장하지 않습니다. 모든 계산은 브라우저에서만 이루어집니다.',
                        },
                        {
                          icon: <Zap size={20} />,
                          title: '실시간 즉시 계산',
                          desc: '숫자를 입력하는 즉시 결과가 업데이트됩니다. 버튼을 누를 필요도 없습니다.',
                        },
                        {
                          icon: <Users size={20} />,
                          title: '전문가 수준의 정확도',
                          desc: '금융감독원 기준과 세법을 반영한 정확한 계산 로직을 사용합니다.',
                        },
                      ].map((item) => (
                        <div key={item.title} className="flex gap-3">
                          <div className="flex-shrink-0 mt-1 text-primary">{item.icon}</div>
                          <div>
                            <h3 className="font-bold mb-1">{item.title}</h3>
                            <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {/* ─ Category List ─ */}
            {activeCategory && !activeCalcId && (
              <motion.div
                key="category"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={reset}
                    className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-muted transition-colors"
                    aria-label="뒤로가기"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <div>
                    <nav className="text-xs text-muted mb-0.5" aria-label="브레드크럼">
                      <button onClick={reset} className="hover:text-primary">홈</button>
                      {' › '}
                      <span>{selectedCategory?.name}</span>
                    </nav>
                    <h2 className="text-2xl font-extrabold">{selectedCategory?.name}</h2>
                  </div>
                </div>
                <p className="text-muted mb-8 ml-12">{selectedCategory?.desc}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCategory?.calculators.map((calc, idx) => (
                    <motion.button
                      key={calc.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      onClick={() => calc.status !== '준비중' && setActiveCalcId(calc.id)}
                      disabled={calc.status === '준비중'}
                      className={`glass rounded-2xl p-6 text-left transition-all duration-300 ${
                        calc.status === '준비중'
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold">{calc.name}</h3>
                            {calc.isNew && (
                              <span className="px-1.5 py-0.5 bg-secondary/15 text-secondary rounded text-xs font-bold">NEW</span>
                            )}
                            {calc.status && (
                              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-muted rounded-full text-xs">
                                준비중
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted">{calc.desc}</p>
                        </div>
                        {!calc.status && (
                          <ChevronRight size={18} className="flex-shrink-0 mt-1 text-muted" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─ Calculator View ─ */}
            {activeCategory && activeCalcId && (
              <motion.div
                key={activeCalcId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.22 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <button
                    onClick={() => setActiveCalcId(null)}
                    className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-muted transition-colors"
                    aria-label="뒤로가기"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <div>
                    <nav className="text-xs text-muted mb-0.5" aria-label="브레드크럼">
                      <button onClick={reset} className="hover:text-primary">홈</button>
                      {' › '}
                      <button onClick={() => setActiveCalcId(null)} className="hover:text-primary">
                        {selectedCategory?.name}
                      </button>
                      {' › '}
                      <span>{selectedCalc?.name}</span>
                    </nav>
                    <h2 className="text-2xl font-extrabold">{selectedCalc?.name}</h2>
                    <p className="text-sm text-muted mt-0.5">{selectedCalc?.desc}</p>
                  </div>
                </div>

                {selectedCalc?.component}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ── Footer ───────────────────────────────────── */}
        <footer
          className="mt-20 border-t border-slate-200 dark:border-slate-800"
          role="contentinfo"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-glow">
                    <Calculator size={16} className="text-white" />
                  </div>
                  <span className="text-lg font-extrabold text-gradient">별의별 계산기</span>
                </div>
                <p className="text-sm text-muted leading-relaxed max-w-xs">
                  대출, 퇴직금, 연차, FIRE 등 일상의 복잡한 계산을 무료로 해결하는
                  스마트 계산기 서비스입니다.
                </p>
                <p className="text-xs text-muted mt-4">
                  ※ 본 서비스의 계산 결과는 참고용이며, 실제 금융 상품·법률과 차이가 있을 수 있습니다.
                  중요한 결정 전에는 전문가 상담을 권장합니다.
                </p>
              </div>

              {/* Calculators */}
              <div>
                <h3 className="text-sm font-bold mb-3 text-slate-700 dark:text-slate-300">주요 계산기</h3>
                <ul className="space-y-2">
                  {[
                    { id: 'loan', cat: 'viral', name: '대출 이자 계산기' },
                    { id: 'fire', cat: 'viral', name: 'FIRE 시뮬레이터' },
                    { id: 'severance', cat: 'hr', name: '퇴직금 계산기' },
                    { id: 'annual', cat: 'hr', name: '연차 계산기' },
                    { id: 'parking', cat: 'invest', name: '파킹통장 계산기' },
                  ].map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => { setActiveCategory(item.cat); setActiveCalcId(item.id); }}
                        className="text-sm text-muted hover:text-primary transition-colors"
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal & Info */}
              <div>
                <h3 className="text-sm font-bold mb-3 text-slate-700 dark:text-slate-300">정보</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setModal('about')}
                      className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Info size={14} /> 서비스 소개
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setModal('privacy')}
                      className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Shield size={14} /> 개인정보처리방침
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setModal('terms')}
                      className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <FileText size={14} /> 이용약관
                    </button>
                  </li>
                  <li>
                    <a
                      href="mailto:mirririnside1024@gmail.com"
                      className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Mail size={14} /> 문의하기
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:mirririnside1024@gmail.com"
                      className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Briefcase size={14} /> 광고 문의
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
              <p>© 2026 별의별 계산기. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setModal('privacy')} className="hover:text-primary transition-colors">
                  개인정보처리방침
                </button>
                <span>·</span>
                <button onClick={() => setModal('terms')} className="hover:text-primary transition-colors">
                  이용약관
                </button>
                <span>·</span>
                <button onClick={() => setModal('about')} className="hover:text-primary transition-colors">
                  서비스 소개
                </button>
              </div>
            </div>
          </div>
        </footer>

        {/* ── Modals ───────────────────────────────────── */}
        <AnimatePresence>
          {modal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={() => setModal(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-extrabold">
                    {modal === 'privacy' ? '개인정보처리방침' : modal === 'terms' ? '이용약관' : '서비스 소개'}
                  </h2>
                  <button
                    onClick={() => setModal(null)}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-muted transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6">
                  {modal === 'privacy' ? (
                    <PrivacyPolicy />
                  ) : modal === 'terms' ? (
                    <TermsOfService />
                  ) : (
                    <AboutContent />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Article Detail Modal ─────────────────────── */}
        <AnimatePresence>
          {activeArticle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
              onClick={() => setActiveArticle(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 24 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 24 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {activeArticle.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted">
                          <Clock size={11} /> {activeArticle.readTime} 읽기
                        </span>
                      </div>
                      <h2 className="text-xl font-extrabold leading-tight">{activeArticle.title}</h2>
                      <p className="text-sm text-muted mt-2 leading-relaxed">{activeArticle.summary}</p>
                    </div>
                    <button
                      onClick={() => setActiveArticle(null)}
                      className="flex-shrink-0 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-muted transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  {activeArticle.content.map((paragraph, i) => (
                    <p key={i} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {paragraph}
                    </p>
                  ))}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap gap-2">
                      {activeArticle.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-muted"
                        >
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted">
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

function AboutContent() {
  return (
    <div className="space-y-6 text-sm text-muted leading-relaxed">
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">서비스 소개</h3>
        <p>
          별의별 계산기는 대한민국 직장인과 투자자들이 자주 마주치는 복잡한 금융·생활 계산을
          쉽고 정확하게 해결할 수 있도록 만들어진 무료 계산기 서비스입니다.
        </p>
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">주요 특징</h3>
        <ul className="list-disc list-inside space-y-1.5">
          <li>대출 이자, 대환 비교, 상환 스케줄 시뮬레이션</li>
          <li>FIRE(조기은퇴) 달성 시점 및 필요 자산 계산</li>
          <li>퇴직금·연차 정확 계산 (근로기준법 기준)</li>
          <li>N잡·프리랜서 실수령액 (세금 공제 반영)</li>
          <li>파킹통장 일복리·은행 비교</li>
          <li>NAS 전기요금 누진세 계산</li>
        </ul>
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">면책 고지</h3>
        <p>
          본 서비스의 계산 결과는 참고용이며, 실제 금융 상품이나 법률과 차이가 있을 수 있습니다.
          중요한 재무적 결정을 내리기 전에는 반드시 전문가(금융 상담사, 세무사, 노무사 등)와
          상담하시기 바랍니다.
        </p>
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">문의</h3>
        <p>
          서비스 이용 중 문의사항이 있으시면 이메일로 연락주세요.
          <br />
          <a href="mailto:mirririnside1024@gmail.com" className="text-primary font-semibold">
            mirririnside1024@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
