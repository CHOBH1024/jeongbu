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
type C = { title:string; body:string; muted:string; border:string; surface:string };

const CATEGORIES: Category[] = [
  {
    id:'viral', name:'재무 시뮬레이터',
    icon:<Rocket size={22}/>, color:'#6366f1', bg:'#eef2ff',
    desc:'대출부터 FIRE까지, 재무 미래를 시뮬레이션합니다',
    calculators:[
      { id:'loan',  name:'대출 이자 · 대환 시뮬레이터',  desc:'현재 대출과 새 대출의 이자 차이를 한눈에 비교',   component:<LoanRefinancing/> },
      { id:'fire',  name:'FIRE(조기은퇴) 시뮬레이터',    desc:'목표 자산과 생존 자금을 역산해 은퇴 시점을 계산', component:<FireSimulator/> },
      { id:'njob',  name:'N잡 · 프리랜서 실소득 계산기', desc:'세금·4대보험 공제 후 실수령액을 정확히 계산',     component:<NJobCalculator/> },
      { id:'lotto', name:'로또 vs S&P500 기회비용',       desc:'로또 구입비를 투자했다면 얼마가 됐을지 비교',    component:<LottoOpportunity/> },
      { id:'remit', name:'해외송금 환율 최적화',          desc:'수수료·환율 포함 실제 수령액 비교',              component:<RemittanceOptimizer/> },
    ],
  },
  {
    id:'hr', name:'인사 · 노무',
    icon:<Building2 size={22}/>, color:'#10b981', bg:'#ecfdf5',
    desc:'퇴직금, 연차 등 근로자가 꼭 알아야 할 계산기',
    calculators:[
      { id:'severance', name:'퇴직금 정밀 계산기',   desc:'평균임금 기준 법정 퇴직금을 정확하게 계산',  component:<SeveranceCalculator/> },
      { id:'annual',    name:'연차 계산기',           desc:'입사일 기준 연차 발생일수 및 잔여일수 계산', component:<AnnualLeave/>, isNew:true },
      { id:'insurance', name:'4대보험 사업자 부담금', desc:'회사 부담 4대보험료를 직종·급여별로 산출',  component:<InsuranceContribution/>, isNew:true },
    ],
  },
  {
    id:'tech', name:'IT 인프라',
    icon:<Monitor size={22}/>, color:'#3b82f6', bg:'#eff6ff',
    desc:'개발자와 IT 매니아를 위한 비용 분석 도구',
    calculators:[
      { id:'nas',   name:'NAS 24시간 전기요금 계산기',   desc:'누진세 포함 월 전기요금과 손익분기점 계산', component:<NasElectricity/> },
      { id:'ai',    name:'Local AI vs Cloud API 가성비', desc:'GPU 구매 vs 클라우드 API 비용 비교',       component:<AiVsCloud/>, isNew:true },
      { id:'cloud', name:'클라우드 vs 물리 서버 손익',   desc:'총 소유비용(TCO) 기준 최적 선택 안내',     component:<ServerTco/>, isNew:true },
    ],
  },
  {
    id:'invest', name:'투자 · 자산',
    icon:<Coins size={22}/>, color:'#f59e0b', bg:'#fffbeb',
    desc:'파킹통장부터 배당 스노우볼까지, 자산을 굴리는 법',
    calculators:[
      { id:'parking', name:'파킹통장 일복리 쪼개기',        desc:'은행별 금리 비교와 복리 수익을 시각화',       component:<ParkingAccount/> },
      { id:'silver',  name:'은(Silver) 현물 평단가 계산기', desc:'분할 매수 시 평균 단가와 손익을 계산',        component:<SilverAvgPrice/>, isNew:true },
      { id:'drip',    name:'배당주 재투자 스노우볼',        desc:'배당금 재투자로 쌓이는 복리 효과 시뮬레이션', component:<DripSnowball/>, isNew:true },
    ],
  },
  {
    id:'estate', name:'부동산 · 이사',
    icon:<Truck size={22}/>, color:'#ec4899', bg:'#fdf2f8',
    desc:'이사 비용부터 중개 수수료까지 한 번에 파악',
    calculators:[
      { id:'moving', name:'포장이사 견적 예측기',    desc:'거리·물량 기준 이사 비용 예상액 산출',  component:<MovingCost/>, isNew:true },
      { id:'broker', name:'중개 수수료 · 등기 비용', desc:'매매·전세 중개보수와 취득세 합산 계산', component:<BrokerFee/>, isNew:true },
    ],
  },
  {
    id:'daily', name:'지출 통제',
    icon:<Wallet size={22}/>, color:'#ef4444', bg:'#fef2f2',
    desc:'무의식 지출을 숫자로 때려잡는 계산기',
    calculators:[
      { id:'carpoor', name:'자동차 할부 vs 카푸어 타이머', desc:'차 할부가 자산에 미치는 실질적 충격 계산',  component:<CarPoorTimer/> },
      { id:'sub',     name:'구독료 누수 탐지기',           desc:'월별 구독 지출이 연간·10년에 얼마인지 계산', component:<SubscriptionLeak/>, isNew:true },
      { id:'coffee',  name:'커피값 노후 연금 환산기',      desc:'매일 커피값을 투자했다면 노후에 얼마가 될까', component:<CoffeeRetirement/>, isNew:true },
    ],
  },
];

const FEATURED = ['loan','annual','fire','severance','drip','broker','sub','insurance','coffee'];
function getFeatured() {
  return CATEGORIES.flatMap((c) =>
    c.calculators.filter((cc) => FEATURED.includes(cc.id) && !cc.status)
      .map((cc) => ({ ...cc, catName:c.name, catColor:c.color, catBg:c.bg }))
  );
}

/* Centered wrapper — same padding everywhere */
function W({ children, className='' }: { children:React.ReactNode; className?:string }) {
  return <div className={`w-full max-w-5xl mx-auto px-5 sm:px-10 ${className}`}>{children}</div>;
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string|null>(null);
  const [activeCalcId,   setActiveCalcId]   = useState<string|null>(null);
  const [isDark,         setIsDark]         = useState(false);
  const [modal,          setModal]          = useState<'privacy'|'about'|'terms'|null>(null);
  const [activeArticle,  setActiveArticle]  = useState<Article|null>(null);

  const selectedCategory = CATEGORIES.find((c) => c.id === activeCategory);
  const selectedCalc     = selectedCategory?.calculators.find((c) => c.id === activeCalcId);
  const reset = () => { setActiveCategory(null); setActiveCalcId(null); };

  const c: C = isDark
    ? { title:'#f5f5f7', body:'rgba(235,235,245,0.8)', muted:'#8e8e93', border:'rgba(255,255,255,0.1)', surface:'#1c1c1e' }
    : { title:'#1d1d1f', body:'#3a3a3c',               muted:'#6e6e73', border:'rgba(0,0,0,0.08)',      surface:'#ffffff' };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-page">

        {/* Nav */}
        <header className="sticky top-0 z-50 nav-bar" role="banner">
          <div className="w-full max-w-5xl mx-auto px-5 sm:px-10 flex items-center justify-between" style={{ height:56 }}>
            <button onClick={reset} className="flex items-center gap-2 shrink-0" aria-label="홈">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center float"
                style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                <Calculator size={16} className="text-white" />
              </div>
              <span className="font-extrabold text-lg text-gradient hidden sm:block" style={{ letterSpacing:'-0.03em' }}>
                별의별 계산기
              </span>
            </button>

            <nav className="hidden lg:flex items-center" aria-label="카테고리">
              {CATEGORIES.map((cat) => (
                <button key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setActiveCalcId(null); }}
                  className="px-3 py-1.5 rounded-xl text-sm font-medium transition-colors"
                  style={{ color: c.muted }}
                  onMouseEnter={(e) => (e.currentTarget.style.color='#6366f1')}
                  onMouseLeave={(e) => (e.currentTarget.style.color=c.muted)}>
                  {cat.name}
                </button>
              ))}
            </nav>

            <button onClick={() => setIsDark(!isDark)} aria-label={isDark?'라이트':'다크'}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ color:c.muted, background:c.border }}>
              {isDark ? <Sun size={17}/> : <Moon size={17}/>}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">

          {/* Home */}
          {!activeCategory && (
            <motion.div key="home" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>

              {/* Hero */}
              <section className="bg-section text-center pt-16 pb-20">
                <W>
                  <motion.span initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.04 }}
                    className="badge mb-6 inline-flex">
                    <Sparkles size={13}/> 완전 무료 · 개인정보 미수집 · 즉시 계산
                  </motion.span>

                  <motion.h1 initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
                    className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.06] mb-5"
                    style={{ color:c.title, letterSpacing:'-0.035em' }}>
                    복잡한 계산,<br/><span className="text-gradient">숫자로 바로 해결</span>
                  </motion.h1>

                  <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }}
                    className="text-lg max-w-sm mx-auto mb-14" style={{ color:c.muted, lineHeight:1.7 }}>
                    대출·퇴직금·연차·FIRE까지.<br/>인터넷 검색 없이 즉시 결과를 확인하세요.
                  </motion.p>

                  <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.16 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                    {([
                      { icon:<Calculator size={20}/>, value:'18+',  label:'계산기 운영 중', color:'#6366f1' },
                      { icon:<Zap size={20}/>,        value:'즉시', label:'실시간 계산',    color:'#10b981' },
                      { icon:<Lock size={20}/>,       value:'0건',  label:'정보 미수집',   color:'#f59e0b' },
                      { icon:<TrendingUp size={20}/>, value:'무료', label:'완전 무료',      color:'#ec4899' },
                    ] as const).map((s) => (
                      <div key={s.label} className="stat-card">
                        <div className="flex justify-center mb-2" style={{ color:s.color }}>{s.icon}</div>
                        <div className="text-2xl font-extrabold num" style={{ color:s.color }}>{s.value}</div>
                        <div className="text-xs mt-0.5 font-medium" style={{ color:c.muted }}>{s.label}</div>
                      </div>
                    ))}
                  </motion.div>
                </W>
              </section>

              {/* Featured */}
              <section className="bg-page py-14">
                <W>
                  <SecTitle title="⭐ 인기 계산기" sub="가장 많이 사용되는 계산기를 바로 이용해보세요" c={c}/>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFeatured().map((calc, idx) => (
                      <motion.button key={calc.id}
                        initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.05 }}
                        onClick={() => {
                          const cat = CATEGORIES.find((cc) => cc.calculators.some((c) => c.id===calc.id));
                          if (cat) { setActiveCategory(cat.id); setActiveCalcId(calc.id); }
                        }}
                        className="surface surface-hover p-5 text-left group">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                            style={{ background:calc.catBg, color:calc.catColor }}>{calc.catName}</span>
                          {calc.isNew && <span className="pill-new">NEW</span>}
                        </div>
                        <h3 className="font-bold text-base leading-snug mb-1.5 group-hover:text-gradient transition-all"
                          style={{ color:c.title }}>{calc.name}</h3>
                        <p className="text-sm leading-relaxed" style={{ color:c.muted }}>{calc.desc}</p>
                        <div className="flex items-center gap-1 mt-4 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color:calc.catColor }}>
                          바로가기 <ArrowRight size={14}/>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </W>
              </section>

              {/* Categories */}
              <section className="bg-section py-14">
                <W>
                  <SecTitle title="📂 전체 카테고리" sub="원하는 분야의 계산기를 골라보세요" c={c}/>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CATEGORIES.map((cat, idx) => {
                      const n = cat.calculators.filter((cc) => !cc.status).length;
                      return (
                        <motion.button key={cat.id}
                          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.06 }}
                          onClick={() => setActiveCategory(cat.id)}
                          className="surface surface-hover p-6 text-left group">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="icon-wrap w-11 h-11" style={{ background:cat.bg, color:cat.color }}>{cat.icon}</div>
                            <div>
                              <p className="font-bold text-sm" style={{ color:c.title }}>{cat.name}</p>
                              <p className="text-xs" style={{ color:c.muted }}>{n}개 이용 가능</p>
                            </div>
                          </div>
                          <p className="text-sm mb-4 leading-relaxed" style={{ color:c.body }}>{cat.desc}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {cat.calculators.map((cc) => (
                              <span key={cc.id} className="cat-tag"
                                style={{ background: cc.status ? (isDark?'#2c2c2e':'#e5e5ea') : cat.color,
                                         color: cc.status ? c.muted : '#fff' }}>
                                {cc.name.split(' ')[0]}{cc.isNew?' ✦':''}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 mt-4 text-sm font-semibold group-hover:gap-2 transition-all"
                            style={{ color:cat.color }}>
                            바로가기 <ChevronRight size={14}/>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </W>
              </section>

              {/* Articles */}
              <section className="bg-page py-14">
                <W>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="icon-wrap w-10 h-10" style={{ background:'#eef2ff', color:'#6366f1' }}>
                        <BookOpen size={18}/>
                      </div>
                      <div>
                        <h2 className="font-extrabold text-lg" style={{ color:c.title }}>알아두면 돈 되는 금융 상식</h2>
                        <p className="text-sm" style={{ color:c.muted }}>계산기와 함께 읽으면 더 유용한 실전 가이드</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold px-3 py-1.5 rounded-full hidden sm:block"
                      style={{ background:'#eef2ff', color:'#6366f1' }}>{ARTICLES.length}개</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ARTICLES.map((article, idx) => (
                      <motion.button key={article.id}
                        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                        transition={{ delay:Math.min(idx*0.025, 0.35) }}
                        onClick={() => setActiveArticle(article)}
                        className="surface surface-hover p-5 text-left group flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                            style={{ background:'#eef2ff', color:'#6366f1' }}>{article.category}</span>
                          <span className="flex items-center gap-1 text-xs" style={{ color:c.muted }}>
                            <Clock size={11}/> {article.readTime}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm leading-snug flex-1 line-clamp-2 group-hover:text-gradient transition-all"
                          style={{ color:c.title }}>{article.title}</h3>
                        <p className="text-xs mt-2 leading-relaxed line-clamp-2" style={{ color:c.muted }}>
                          {article.summary}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </W>
              </section>

              {/* About */}
              <section className="bg-section py-16 text-center">
                <W>
                  <span className="badge mb-4 inline-flex"><Info size={13}/> 별의별 계산기란?</span>
                  <h2 className="text-3xl font-extrabold mb-3" style={{ color:c.title, letterSpacing:'-0.025em' }}>
                    복잡한 금융 계산을<br/>누구나 쉽게
                  </h2>
                  <p className="text-base mb-12 max-w-sm mx-auto leading-relaxed" style={{ color:c.muted }}>
                    일상에서 꼭 필요하지만 계산하기 어려운 금융·생활 계산기를 무료로 제공합니다.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { icon:<Shield size={22}/>,color:'#10b981',bg:'#ecfdf5',title:'개인정보 완전 보호',desc:'서버에 어떤 데이터도 저장하지 않습니다. 모든 계산은 브라우저에서만 이루어집니다.' },
                      { icon:<Zap size={22}/>,   color:'#6366f1',bg:'#eef2ff',title:'실시간 즉시 계산',   desc:'숫자를 입력하는 즉시 결과가 업데이트됩니다. 별도의 버튼 클릭이 필요 없습니다.' },
                      { icon:<Users size={22}/>, color:'#f59e0b',bg:'#fffbeb',title:'전문가 수준 정확도', desc:'금융감독원 기준과 세법을 반영한 정확한 계산 로직으로 신뢰할 수 있는 결과를 제공합니다.' },
                    ].map((item) => (
                      <div key={item.title} className="surface p-6 text-left">
                        <div className="icon-wrap w-11 h-11 mb-4" style={{ background:item.bg, color:item.color }}>{item.icon}</div>
                        <h3 className="font-bold mb-2" style={{ color:c.title }}>{item.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color:c.muted }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </W>
              </section>

            </motion.div>
          )}

          {/* Category list */}
          {activeCategory && !activeCalcId && (
            <motion.div key="cat"
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
              transition={{ duration:0.2 }}>
              <div className="bg-section py-10">
                <W>
                  <div className="flex items-center gap-3 mb-6">
                    <BackBtn onClick={reset} c={c}/>
                    <div>
                      <Crumb parts={[{ label:'홈', onClick:reset },{ label:selectedCategory?.name??'' }]} c={c}/>
                      <h2 className="text-2xl font-extrabold" style={{ color:selectedCategory?.color, letterSpacing:'-0.02em' }}>
                        {selectedCategory?.name}
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm mb-8" style={{ color:c.muted }}>{selectedCategory?.desc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCategory?.calculators.map((calc, idx) => (
                      <motion.button key={calc.id}
                        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.06 }}
                        onClick={() => calc.status !== '준비중' && setActiveCalcId(calc.id)}
                        disabled={calc.status === '준비중'}
                        className={`surface p-6 text-left flex items-start justify-between gap-4 ${calc.status==='준비중'?'opacity-40 cursor-not-allowed':'surface-hover'}`}>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="font-bold text-base" style={{ color:c.title }}>{calc.name}</span>
                            {calc.isNew && <span className="pill-new">NEW</span>}
                            {calc.status && <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background:isDark?'#2c2c2e':'#e5e5ea', color:c.muted }}>준비중</span>}
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color:c.muted }}>{calc.desc}</p>
                        </div>
                        {!calc.status && <ChevronRight size={18} className="flex-shrink-0 mt-0.5" style={{ color:c.muted }}/>}
                      </motion.button>
                    ))}
                  </div>
                </W>
              </div>
            </motion.div>
          )}

          {/* Calculator */}
          {activeCategory && activeCalcId && (
            <motion.div key={activeCalcId}
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-14 }}
              transition={{ duration:0.2 }}>
              <div className="bg-section py-10">
                <W>
                  <div className="flex items-center gap-3 mb-8">
                    <BackBtn onClick={() => setActiveCalcId(null)} c={c}/>
                    <div>
                      <Crumb parts={[
                        { label:'홈', onClick:reset },
                        { label:selectedCategory?.name??'', onClick:()=>setActiveCalcId(null) },
                        { label:selectedCalc?.name??'' },
                      ]} c={c}/>
                      <h2 className="text-2xl font-extrabold" style={{ color:c.title, letterSpacing:'-0.02em' }}>
                        {selectedCalc?.name}
                      </h2>
                      <p className="text-sm mt-0.5" style={{ color:c.muted }}>{selectedCalc?.desc}</p>
                    </div>
                  </div>
                  {selectedCalc?.component}
                </W>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer */}
        <footer className="bg-page border-t" style={{ borderColor:c.border }} role="contentinfo">
          <W className="py-12">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
              <div className="sm:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                    <Calculator size={14} className="text-white"/>
                  </div>
                  <span className="font-extrabold text-gradient">별의별 계산기</span>
                </div>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color:c.muted }}>
                  대출, 퇴직금, 연차, FIRE 등 일상의 복잡한 계산을 무료로 해결하는 스마트 계산기 서비스입니다.
                </p>
                <p className="text-xs mt-4 leading-relaxed" style={{ color:c.muted, opacity:0.65 }}>
                  ※ 계산 결과는 참고용이며 실제 금융 상품·법률과 차이가 있을 수 있습니다.
                </p>
              </div>
              <div>
                <p className="text-sm font-bold mb-3" style={{ color:c.title }}>주요 계산기</p>
                <ul className="space-y-2">
                  {[['loan','viral','대출 이자 계산기'],['fire','viral','FIRE 시뮬레이터'],['severance','hr','퇴직금 계산기'],['annual','hr','연차 계산기'],['parking','invest','파킹통장 계산기']].map(([id,cat,name]) => (
                    <li key={id}>
                      <button onClick={() => { setActiveCategory(cat); setActiveCalcId(id); }}
                        className="text-sm transition-colors hover:text-primary" style={{ color:c.muted }}>{name}</button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-bold mb-3" style={{ color:c.title }}>정보</p>
                <ul className="space-y-2">
                  {([
                    { icon:<Info size={13}/>,      label:'서비스 소개',      act:()=>setModal('about') },
                    { icon:<Shield size={13}/>,    label:'개인정보처리방침', act:()=>setModal('privacy') },
                    { icon:<FileText size={13}/>,  label:'이용약관',         act:()=>setModal('terms') },
                  ] as const).map((item) => (
                    <li key={item.label}>
                      <button onClick={item.act} className="text-sm flex items-center gap-1.5 transition-colors hover:text-primary" style={{ color:c.muted }}>
                        {item.icon} {item.label}
                      </button>
                    </li>
                  ))}
                  {([
                    { icon:<Mail size={13}/>, label:'문의하기', href:'mailto:mirririnside1024@gmail.com' },
                    { icon:<Briefcase size={13}/>, label:'광고 문의', href:'mailto:mirririnside1024@gmail.com' },
                  ] as const).map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className="text-sm flex items-center gap-1.5 transition-colors hover:text-primary" style={{ color:c.muted }}>
                        {item.icon} {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{ borderColor:c.border }}>
              <p className="text-xs" style={{ color:c.muted }}>© 2026 별의별 계산기. All rights reserved.</p>
              <div className="flex items-center gap-4 text-xs" style={{ color:c.muted }}>
                <button onClick={() => setModal('privacy')} className="hover:text-primary transition-colors">개인정보처리방침</button>
                <span>·</span>
                <button onClick={() => setModal('terms')} className="hover:text-primary transition-colors">이용약관</button>
                <span>·</span>
                <button onClick={() => setModal('about')} className="hover:text-primary transition-colors">서비스 소개</button>
              </div>
            </div>
          </W>
        </footer>

        {/* Legal modal */}
        <AnimatePresence>
          {modal && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background:'rgba(0,0,0,0.45)', backdropFilter:'blur(8px)' }}
              onClick={() => setModal(null)}>
              <motion.div initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95, y:20 }}
                onClick={(e) => e.stopPropagation()}
                className="surface max-w-xl w-full max-h-[85vh] overflow-y-auto"
                style={{ background:c.surface }}>
                <div className="flex items-center justify-between p-6 border-b" style={{ borderColor:c.border }}>
                  <h2 className="text-lg font-extrabold" style={{ color:c.title }}>
                    {modal==='privacy'?'개인정보처리방침':modal==='terms'?'이용약관':'서비스 소개'}
                  </h2>
                  <button onClick={() => setModal(null)} className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background:c.border, color:c.muted }}><X size={16}/></button>
                </div>
                <div className="p-6">
                  {modal==='privacy'?<PrivacyPolicy/>:modal==='terms'?<TermsOfService/>:<AboutContent c={c}/>}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Article modal */}
        <AnimatePresence>
          {activeArticle && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)' }}
              onClick={() => setActiveArticle(null)}>
              <motion.div initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95, y:20 }}
                onClick={(e) => e.stopPropagation()}
                className="surface max-w-xl w-full max-h-[90vh] overflow-y-auto"
                style={{ background:c.surface }}>
                <div className="h-1 rounded-t-[20px]"
                  style={{ background:'linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)' }}/>
                <div className="p-6 border-b" style={{ borderColor:c.border }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                          style={{ background:'#eef2ff', color:'#6366f1' }}>{activeArticle.category}</span>
                        <span className="flex items-center gap-1 text-xs" style={{ color:c.muted }}>
                          <Clock size={11}/> {activeArticle.readTime} 읽기
                        </span>
                      </div>
                      <h2 className="text-xl font-extrabold leading-tight" style={{ color:c.title }}>
                        {activeArticle.title}
                      </h2>
                      <p className="text-sm mt-2 leading-relaxed" style={{ color:c.muted }}>
                        {activeArticle.summary}
                      </p>
                    </div>
                    <button onClick={() => setActiveArticle(null)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background:c.border, color:c.muted }}><X size={16}/></button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {activeArticle.content.map((p, i) => (
                    <p key={i} className="text-sm leading-7" style={{ color:c.body }}>{p}</p>
                  ))}
                  <div className="pt-4 border-t flex flex-wrap gap-2" style={{ borderColor:c.border }}>
                    {activeArticle.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                        style={{ background:isDark?'#2c2c2e':'#f2f2f7', color:c.muted }}>
                        <Tag size={10}/> {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs p-3 rounded-2xl leading-relaxed"
                    style={{ background:isDark?'rgba(255,149,0,0.08)':'#fff8ee',
                             color:isDark?'#ff9500':'#92400e',
                             border:`1px solid ${isDark?'rgba(255,149,0,0.15)':'#fde68a'}` }}>
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

/* Sub-components */
function SecTitle({ title, sub, c }: { title:string; sub:string; c:C }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-extrabold mb-0.5" style={{ color:c.title, letterSpacing:'-0.02em' }}>{title}</h2>
      <p className="text-sm" style={{ color:c.muted }}>{sub}</p>
    </div>
  );
}
function BackBtn({ onClick, c }: { onClick:()=>void; c:C }) {
  return (
    <button onClick={onClick} aria-label="뒤로가기"
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background:c.border, color:c.muted }}>
      <ChevronLeft size={20}/>
    </button>
  );
}
function Crumb({ parts, c }: { parts:{label:string; onClick?:()=>void}[]; c:C }) {
  return (
    <nav className="flex items-center gap-1 text-xs mb-0.5" style={{ color:c.muted }} aria-label="브레드크럼">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          {i>0 && <ChevronRight size={10}/>}
          {p.onClick
            ? <button onClick={p.onClick} className="hover:text-primary transition-colors">{p.label}</button>
            : <span>{p.label}</span>}
        </span>
      ))}
    </nav>
  );
}
function AboutContent({ c }: { c:C }) {
  return (
    <div className="space-y-5 text-sm leading-relaxed" style={{ color:c.muted }}>
      {[
        { t:'서비스 소개', d:'별의별 계산기는 대한민국 직장인과 투자자들이 자주 마주치는 복잡한 금융·생활 계산을 쉽고 정확하게 해결할 수 있도록 만들어진 무료 계산기 서비스입니다.' },
        { t:'면책 고지',   d:'본 서비스의 계산 결과는 참고용이며, 실제 금융 상품이나 법률과 차이가 있을 수 있습니다. 중요한 재무적 결정 전에는 전문가(금융 상담사, 세무사, 노무사 등)와 상담하시기 바랍니다.' },
      ].map((s) => (
        <div key={s.t}>
          <h3 className="font-bold mb-1" style={{ color:c.title }}>{s.t}</h3>
          <p>{s.d}</p>
        </div>
      ))}
      <div>
        <h3 className="font-bold mb-1" style={{ color:c.title }}>문의</h3>
        <p>이메일로 연락주세요.{' '}
          <a href="mailto:mirririnside1024@gmail.com" className="font-semibold" style={{ color:'#6366f1' }}>
            mirririnside1024@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
