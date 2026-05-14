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
    icon:<Rocket size={24}/>, color:'#6366f1', bg:'#eef2ff',
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
    icon:<Building2 size={24}/>, color:'#10b981', bg:'#ecfdf5',
    desc:'퇴직금, 연차 등 근로자가 꼭 알아야 할 계산기',
    calculators:[
      { id:'severance', name:'퇴직금 정밀 계산기',   desc:'평균임금 기준 법정 퇴직금을 정확하게 계산',  component:<SeveranceCalculator/> },
      { id:'annual',    name:'연차 계산기',           desc:'입사일 기준 연차 발생일수 및 잔여일수 계산', component:<AnnualLeave/>, isNew:true },
      { id:'insurance', name:'4대보험 사업자 부담금', desc:'회사 부담 4대보험료를 직종·급여별로 산출',  component:<InsuranceContribution/>, isNew:true },
    ],
  },
  {
    id:'tech', name:'IT 인프라',
    icon:<Monitor size={24}/>, color:'#3b82f6', bg:'#eff6ff',
    desc:'개발자와 IT 매니아를 위한 비용 분석 도구',
    calculators:[
      { id:'nas',   name:'NAS 24시간 전기요금 계산기',   desc:'누진세 포함 월 전기요금과 손익분기점 계산', component:<NasElectricity/> },
      { id:'ai',    name:'Local AI vs Cloud API 가성비', desc:'GPU 구매 vs 클라우드 API 비용 비교',       component:<AiVsCloud/>, isNew:true },
      { id:'cloud', name:'클라우드 vs 물리 서버 손익',   desc:'총 소유비용(TCO) 기준 최적 선택 안내',     component:<ServerTco/>, isNew:true },
    ],
  },
  {
    id:'invest', name:'투자 · 자산',
    icon:<Coins size={24}/>, color:'#f59e0b', bg:'#fffbeb',
    desc:'파킹통장부터 배당 스노우볼까지, 자산을 굴리는 법',
    calculators:[
      { id:'parking', name:'파킹통장 일복리 쪼개기',        desc:'은행별 금리 비교와 복리 수익을 시각화',       component:<ParkingAccount/> },
      { id:'silver',  name:'은(Silver) 현물 평단가 계산기', desc:'분할 매수 시 평균 단가와 손익을 계산',        component:<SilverAvgPrice/>, isNew:true },
      { id:'drip',    name:'배당주 재투자 스노우볼',        desc:'배당금 재투자로 쌓이는 복리 효과 시뮬레이션', component:<DripSnowball/>, isNew:true },
    ],
  },
  {
    id:'estate', name:'부동산 · 이사',
    icon:<Truck size={24}/>, color:'#ec4899', bg:'#fdf2f8',
    desc:'이사 비용부터 중개 수수료까지 한 번에 파악',
    calculators:[
      { id:'moving', name:'포장이사 견적 예측기',    desc:'거리·물량 기준 이사 비용 예상액 산출',  component:<MovingCost/>, isNew:true },
      { id:'broker', name:'중개 수수료 · 등기 비용', desc:'매매·전세 중개보수와 취득세 합산 계산', component:<BrokerFee/>, isNew:true },
    ],
  },
  {
    id:'daily', name:'지출 통제',
    icon:<Wallet size={24}/>, color:'#ef4444', bg:'#fef2f2',
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

function W({ children, className='' }: { children:React.ReactNode; className?:string }) {
  return <div className={`w ${className}`}>{children}</div>;
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

  const titleColor  = isDark ? '#f5f5f7'              : '#1d1d1f';
  const bodyColor   = isDark ? 'rgba(235,235,245,0.8)' : '#3a3a3c';
  const mutedColor  = isDark ? '#8e8e93'              : '#6e6e73';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)': 'rgba(0,0,0,0.08)';
  const surfaceBg   = isDark ? '#1c1c1e'              : '#ffffff';

  return (
    <div className={isDark ? 'dark' : ''}>
      <div style={{ minHeight:'100vh', background: isDark ? '#000' : '#f2f2f7' }}>

        {/* Nav */}
        <header className="sticky top-0 z-50 nav" role="banner">
          <div className="w" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:60 }}>
            <button onClick={reset} style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }} aria-label="홈">
              <div style={{
                width:36, height:36, borderRadius:12,
                background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Calculator size={18} color="#fff" />
              </div>
              <span className="text-gradient" style={{ fontWeight:800, fontSize:18, letterSpacing:'-0.03em' }}>
                별의별 계산기
              </span>
            </button>

            <nav style={{ display:'flex', alignItems:'center', gap:4 }} aria-label="카테고리" className="hidden lg:flex">
              {CATEGORIES.map((cat) => (
                <button key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setActiveCalcId(null); }}
                  style={{
                    padding:'6px 14px', borderRadius:10, fontSize:13, fontWeight:600,
                    color:'rgba(255,255,255,0.65)', transition:'color 0.15s, background 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(255,255,255,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color='rgba(255,255,255,0.65)'; e.currentTarget.style.background='transparent'; }}>
                  {cat.name}
                </button>
              ))}
            </nav>

            <button onClick={() => setIsDark(!isDark)} aria-label={isDark?'라이트모드':'다크모드'}
              style={{
                width:38, height:38, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
                background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.12)',
              }}>
              {isDark ? <Sun size={17}/> : <Moon size={17}/>}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">

          {/* Home */}
          {!activeCategory && (
            <motion.div key="home" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>

              {/* Hero */}
              <section className="hero" style={{ paddingTop:80, paddingBottom:96 }}>
                <W>
                  <div style={{ textAlign:'center' }}>
                    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
                      style={{ marginBottom:28 }}>
                      <span className="hero-badge">
                        <Sparkles size={13}/> 완전 무료 · 개인정보 미수집 · 즉시 계산
                      </span>
                    </motion.div>

                    <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.09 }}
                      style={{ fontSize:'clamp(40px,7vw,72px)', fontWeight:800, lineHeight:1.08,
                               letterSpacing:'-0.035em', color:'#ffffff', marginBottom:20 }}>
                      복잡한 계산,<br/><span className="text-gradient">숫자로 바로 해결</span>
                    </motion.h1>

                    <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.13 }}
                      style={{ fontSize:18, color:'rgba(255,255,255,0.6)', lineHeight:1.75,
                               maxWidth:380, margin:'0 auto 56px' }}>
                      대출·퇴직금·연차·FIRE까지.<br/>인터넷 검색 없이 즉시 결과를 확인하세요.
                    </motion.p>

                    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.17 }}
                      style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12,
                               maxWidth:560, margin:'0 auto' }}>
                      {([
                        { icon:<Calculator size={22}/>, value:'18+',  label:'계산기', color:'#a78bfa' },
                        { icon:<Zap size={22}/>,        value:'즉시', label:'실시간 계산', color:'#34d399' },
                        { icon:<Lock size={22}/>,       value:'0건',  label:'정보 미수집', color:'#fbbf24' },
                        { icon:<TrendingUp size={22}/>, value:'무료', label:'완전 무료', color:'#f472b6' },
                      ] as const).map((s) => (
                        <div key={s.label} className="stat">
                          <div style={{ color:s.color, marginBottom:8, display:'flex', justifyContent:'center' }}>{s.icon}</div>
                          <div className="num" style={{ fontSize:26, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
                          <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginTop:5, fontWeight:500 }}>{s.label}</div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </W>
              </section>

              {/* Featured calculators */}
              <section style={{ background: isDark ? '#0a0a0a' : '#fff', padding:'72px 0' }}>
                <W>
                  <SectionTitle
                    emoji="⭐" title="인기 계산기"
                    sub="가장 많이 찾는 계산기를 바로 사용해보세요"
                    titleColor={titleColor} mutedColor={mutedColor}/>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
                    {getFeatured().map((calc, idx) => (
                      <motion.button key={calc.id}
                        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.05 }}
                        onClick={() => {
                          const cat = CATEGORIES.find((cc) => cc.calculators.some((c) => c.id===calc.id));
                          if (cat) { setActiveCategory(cat.id); setActiveCalcId(calc.id); }
                        }}
                        className="card"
                        style={{ padding:24, textAlign:'left', width:'100%', display:'flex', flexDirection:'column' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                          <span style={{
                            fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99,
                            background:calc.catBg, color:calc.catColor,
                          }}>{calc.catName}</span>
                          {calc.isNew && <span className="pill-new">NEW</span>}
                        </div>
                        <h3 style={{ fontWeight:700, fontSize:15, color:titleColor, lineHeight:1.45,
                                     marginBottom:8, flex:1 }}>{calc.name}</h3>
                        <p style={{ fontSize:13, color:mutedColor, lineHeight:1.65, marginBottom:16 }}>{calc.desc}</p>
                        <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:13,
                                      fontWeight:700, color:calc.catColor }}>
                          바로가기 <ArrowRight size={13}/>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </W>
              </section>

              {/* Categories */}
              <section style={{ background: isDark ? '#111' : '#f2f2f7', padding:'72px 0' }}>
                <W>
                  <SectionTitle
                    emoji="📂" title="전체 카테고리"
                    sub="원하는 분야의 계산기를 골라보세요"
                    titleColor={titleColor} mutedColor={mutedColor}/>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
                    {CATEGORIES.map((cat, idx) => {
                      const available = cat.calculators.filter((cc) => !cc.status);
                      return (
                        <motion.button key={cat.id}
                          initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.07 }}
                          onClick={() => setActiveCategory(cat.id)}
                          className="card"
                          style={{ textAlign:'left', width:'100%', overflow:'hidden', display:'flex', flexDirection:'column' }}>

                          {/* Colored header */}
                          <div className="cat-header" style={{ background:cat.bg }}>
                            <div className="icon-box" style={{
                              width:46, height:46, background:`${cat.color}18`,
                              border:`1.5px solid ${cat.color}30`,
                            }}>
                              <span style={{ color:cat.color }}>{cat.icon}</span>
                            </div>
                            <div>
                              <p style={{ fontWeight:800, fontSize:16, color:cat.color, marginBottom:2 }}>{cat.name}</p>
                              <p style={{ fontSize:12, color:`${cat.color}99`, fontWeight:500 }}>
                                {available.length}개 계산기
                              </p>
                            </div>
                          </div>

                          {/* Body */}
                          <div style={{ padding:'16px 24px 20px', flex:1, display:'flex', flexDirection:'column', gap:12 }}>
                            <p style={{ fontSize:13, color:bodyColor, lineHeight:1.65 }}>{cat.desc}</p>
                            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                              {cat.calculators.slice(0,3).map((cc) => (
                                <span key={cc.id} className="tag-badge" style={{
                                  background: cc.status ? (isDark?'#2c2c2e':'#e5e5ea') : `${cat.color}18`,
                                  color: cc.status ? mutedColor : cat.color,
                                  border:`1px solid ${cc.status?(isDark?'#3a3a3c':'#d1d1d6'):`${cat.color}30`}`,
                                }}>
                                  {cc.name.split(/[ ·]/)[0]}{cc.isNew&&<span className="pill-new" style={{ marginLeft:3 }}>N</span>}
                                </span>
                              ))}
                              {cat.calculators.length > 3 && (
                                <span className="tag-badge" style={{
                                  background:isDark?'#2c2c2e':'#e5e5ea',
                                  color:mutedColor, border:`1px solid ${isDark?'#3a3a3c':'#d1d1d6'}`
                                }}>+{cat.calculators.length-3}</span>
                              )}
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:13,
                                          fontWeight:700, color:cat.color, marginTop:'auto' }}>
                              전체 보기 <ChevronRight size={14}/>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </W>
              </section>

              {/* Articles */}
              <section style={{ background: isDark ? '#0a0a0a' : '#fff', padding:'72px 0' }}>
                <W>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                      <div className="icon-box" style={{
                        width:48, height:48, background:'#eef2ff', borderRadius:14,
                      }}>
                        <BookOpen size={20} color="#6366f1"/>
                      </div>
                      <div>
                        <h2 style={{ fontWeight:800, fontSize:20, color:titleColor, letterSpacing:'-0.02em', marginBottom:3 }}>
                          알아두면 돈 되는 금융 상식
                        </h2>
                        <p style={{ fontSize:13, color:mutedColor }}>계산기와 함께 읽으면 더 유용한 실전 가이드</p>
                      </div>
                    </div>
                    <span style={{
                      fontSize:13, fontWeight:700, padding:'6px 14px', borderRadius:99,
                      background:'#eef2ff', color:'#6366f1',
                    }}>{ARTICLES.length}개</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
                    {ARTICLES.map((article, idx) => (
                      <motion.button key={article.id}
                        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                        transition={{ delay:Math.min(idx*0.025, 0.4) }}
                        onClick={() => setActiveArticle(article)}
                        className="card"
                        style={{ padding:22, textAlign:'left', width:'100%', display:'flex', flexDirection:'column' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                          <span style={{
                            fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99,
                            background:'#eef2ff', color:'#6366f1',
                          }}>{article.category}</span>
                          <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:mutedColor }}>
                            <Clock size={11}/> {article.readTime}
                          </span>
                        </div>
                        <h3 style={{ fontWeight:700, fontSize:14, color:titleColor, lineHeight:1.5,
                                     flex:1, display:'-webkit-box', WebkitLineClamp:2,
                                     WebkitBoxOrient:'vertical', overflow:'hidden', marginBottom:8 }}>
                          {article.title}
                        </h3>
                        <p style={{ fontSize:12, color:mutedColor, lineHeight:1.6,
                                    display:'-webkit-box', WebkitLineClamp:2,
                                    WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                          {article.summary}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </W>
              </section>

              {/* About */}
              <section style={{ background: isDark ? '#111' : '#f2f2f7', padding:'80px 0', textAlign:'center' }}>
                <W>
                  <span className="hero-badge" style={{ marginBottom:24, display:'inline-flex',
                    background:'rgba(99,102,241,0.12)', color:'#6366f1',
                    border:'1px solid rgba(99,102,241,0.25)' }}>
                    <Info size={13}/> 별의별 계산기란?
                  </span>
                  <h2 style={{ fontSize:'clamp(26px,4vw,36px)', fontWeight:800, color:titleColor,
                               letterSpacing:'-0.025em', marginBottom:14, marginTop:16 }}>
                    복잡한 금융 계산을<br/>누구나 쉽게
                  </h2>
                  <p style={{ fontSize:16, color:mutedColor, lineHeight:1.75, maxWidth:400,
                               margin:'0 auto 56px' }}>
                    일상에서 꼭 필요하지만 계산하기 어려운 금융·생활 계산기를 무료로 제공합니다.
                  </p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
                    {[
                      { icon:<Shield size={24}/>,    color:'#10b981', bg:'#ecfdf5',
                        title:'개인정보 완전 보호',
                        desc:'서버에 어떤 데이터도 저장하지 않습니다. 모든 계산은 브라우저에서만 이루어집니다.' },
                      { icon:<Zap size={24}/>,       color:'#6366f1', bg:'#eef2ff',
                        title:'실시간 즉시 계산',
                        desc:'숫자를 입력하는 즉시 결과가 업데이트됩니다. 별도의 버튼 클릭이 필요 없습니다.' },
                      { icon:<Users size={24}/>,     color:'#f59e0b', bg:'#fffbeb',
                        title:'전문가 수준 정확도',
                        desc:'금융감독원 기준과 세법을 반영한 정확한 계산 로직으로 신뢰할 수 있는 결과를 제공합니다.' },
                    ].map((item) => (
                      <div key={item.title} className="card" style={{ padding:28, textAlign:'center' }}>
                        <div className="icon-box" style={{
                          width:56, height:56, background:item.bg,
                          borderRadius:16, margin:'0 auto 18px',
                        }}>
                          <span style={{ color:item.color }}>{item.icon}</span>
                        </div>
                        <h3 style={{ fontWeight:700, fontSize:16, color:titleColor, marginBottom:10 }}>{item.title}</h3>
                        <p style={{ fontSize:13, color:mutedColor, lineHeight:1.7 }}>{item.desc}</p>
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
              <div style={{ background: isDark ? '#0a0a0a' : '#f2f2f7', padding:'48px 0', minHeight:'70vh' }}>
                <W>
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:32 }}>
                    <button onClick={reset} aria-label="뒤로가기"
                      style={{
                        width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
                        background: isDark ? '#2c2c2e' : '#e5e5ea', color:mutedColor, flexShrink:0,
                      }}>
                      <ChevronLeft size={20}/>
                    </button>
                    <div>
                      <Crumb parts={[{ label:'홈', onClick:reset }, { label:selectedCategory?.name??'' }]}
                        titleColor={titleColor} mutedColor={mutedColor}/>
                      <h2 style={{ fontSize:26, fontWeight:800, color:selectedCategory?.color, letterSpacing:'-0.02em' }}>
                        {selectedCategory?.name}
                      </h2>
                    </div>
                  </div>
                  <p style={{ fontSize:14, color:mutedColor, marginBottom:28, lineHeight:1.65 }}>{selectedCategory?.desc}</p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
                    {selectedCategory?.calculators.map((calc, idx) => (
                      <motion.button key={calc.id}
                        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.06 }}
                        onClick={() => calc.status !== '준비중' && setActiveCalcId(calc.id)}
                        disabled={calc.status === '준비중'}
                        className="card"
                        style={{
                          padding:24, textAlign:'left', width:'100%',
                          display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16,
                          opacity: calc.status ? 0.45 : 1,
                          cursor: calc.status ? 'not-allowed' : 'pointer',
                        }}>
                        <div style={{ minWidth:0, flex:1 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap' }}>
                            <span style={{ fontWeight:700, fontSize:15, color:titleColor }}>{calc.name}</span>
                            {calc.isNew && <span className="pill-new">NEW</span>}
                            {calc.status && (
                              <span style={{
                                fontSize:11, padding:'2px 8px', borderRadius:99,
                                background: isDark?'#2c2c2e':'#e5e5ea', color:mutedColor,
                              }}>준비중</span>
                            )}
                          </div>
                          <p style={{ fontSize:13, color:mutedColor, lineHeight:1.65 }}>{calc.desc}</p>
                        </div>
                        {!calc.status && (
                          <ChevronRight size={18} style={{ flexShrink:0, marginTop:3, color:mutedColor }}/>
                        )}
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
              <div style={{ background: isDark ? '#0a0a0a' : '#f2f2f7', padding:'48px 0', minHeight:'70vh' }}>
                <W>
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:36 }}>
                    <button onClick={() => setActiveCalcId(null)} aria-label="뒤로가기"
                      style={{
                        width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
                        background: isDark ? '#2c2c2e' : '#e5e5ea', color:mutedColor, flexShrink:0,
                      }}>
                      <ChevronLeft size={20}/>
                    </button>
                    <div>
                      <Crumb parts={[
                        { label:'홈', onClick:reset },
                        { label:selectedCategory?.name??'', onClick:()=>setActiveCalcId(null) },
                        { label:selectedCalc?.name??'' },
                      ]} titleColor={titleColor} mutedColor={mutedColor}/>
                      <h2 style={{ fontSize:24, fontWeight:800, color:titleColor, letterSpacing:'-0.02em' }}>
                        {selectedCalc?.name}
                      </h2>
                      <p style={{ fontSize:13, color:mutedColor, marginTop:3 }}>{selectedCalc?.desc}</p>
                    </div>
                  </div>
                  {selectedCalc?.component}
                </W>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer */}
        <footer style={{ background: isDark ? '#000' : '#fff', borderTop:`1px solid ${borderColor}` }} role="contentinfo">
          <W className="py-12">
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:40, marginBottom:40 }}
              className="footer-grid">
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <div style={{
                    width:30, height:30, borderRadius:10,
                    background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Calculator size={15} color="#fff"/>
                  </div>
                  <span className="text-gradient" style={{ fontWeight:800, fontSize:16 }}>별의별 계산기</span>
                </div>
                <p style={{ fontSize:13, color:mutedColor, lineHeight:1.75, maxWidth:280 }}>
                  대출, 퇴직금, 연차, FIRE 등 일상의 복잡한 계산을 무료로 해결하는 스마트 계산기 서비스입니다.
                </p>
                <p style={{ fontSize:11, color:mutedColor, opacity:0.6, marginTop:14, lineHeight:1.7 }}>
                  ※ 계산 결과는 참고용이며 실제 금융 상품·법률과 차이가 있을 수 있습니다.
                </p>
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:titleColor, marginBottom:14 }}>주요 계산기</p>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
                  {[['loan','viral','대출 이자 계산기'],['fire','viral','FIRE 시뮬레이터'],
                    ['severance','hr','퇴직금 계산기'],['annual','hr','연차 계산기'],
                    ['parking','invest','파킹통장 계산기']].map(([id,cat,name]) => (
                    <li key={id}>
                      <button onClick={() => { setActiveCategory(cat); setActiveCalcId(id); }}
                        style={{ fontSize:13, color:mutedColor, transition:'color 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color='#6366f1'}
                        onMouseLeave={(e) => e.currentTarget.style.color=mutedColor}>
                        {name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:titleColor, marginBottom:14 }}>정보</p>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
                  {([
                    { icon:<Info size={13}/>,      label:'서비스 소개',      act:()=>setModal('about') },
                    { icon:<Shield size={13}/>,    label:'개인정보처리방침', act:()=>setModal('privacy') },
                    { icon:<FileText size={13}/>,  label:'이용약관',         act:()=>setModal('terms') },
                    { icon:<Mail size={13}/>,      label:'문의하기',         href:'mailto:mirririnside1024@gmail.com' },
                    { icon:<Briefcase size={13}/>, label:'광고 문의',        href:'mailto:mirririnside1024@gmail.com' },
                  ] as const).map((item) => (
                    <li key={item.label}>
                      {'act' in item ? (
                        <button onClick={item.act}
                          style={{ fontSize:13, color:mutedColor, display:'flex', alignItems:'center', gap:6, transition:'color 0.15s' }}
                          onMouseEnter={(e) => e.currentTarget.style.color='#6366f1'}
                          onMouseLeave={(e) => e.currentTarget.style.color=mutedColor}>
                          {item.icon} {item.label}
                        </button>
                      ) : (
                        <a href={item.href}
                          style={{ fontSize:13, color:mutedColor, display:'flex', alignItems:'center', gap:6, textDecoration:'none', transition:'color 0.15s' }}
                          onMouseEnter={(e) => e.currentTarget.style.color='#6366f1'}
                          onMouseLeave={(e) => e.currentTarget.style.color=mutedColor}>
                          {item.icon} {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ paddingTop:24, borderTop:`1px solid ${borderColor}`,
                          display:'flex', flexWrap:'wrap', alignItems:'center',
                          justifyContent:'space-between', gap:12 }}>
              <p style={{ fontSize:12, color:mutedColor }}>© 2026 별의별 계산기. All rights reserved.</p>
              <div style={{ display:'flex', alignItems:'center', gap:16, fontSize:12, color:mutedColor }}>
                <button onClick={() => setModal('privacy')}
                  onMouseEnter={(e) => e.currentTarget.style.color='#6366f1'}
                  onMouseLeave={(e) => e.currentTarget.style.color=mutedColor}>
                  개인정보처리방침
                </button>
                <span>·</span>
                <button onClick={() => setModal('terms')}
                  onMouseEnter={(e) => e.currentTarget.style.color='#6366f1'}
                  onMouseLeave={(e) => e.currentTarget.style.color=mutedColor}>
                  이용약관
                </button>
                <span>·</span>
                <button onClick={() => setModal('about')}
                  onMouseEnter={(e) => e.currentTarget.style.color='#6366f1'}
                  onMouseLeave={(e) => e.currentTarget.style.color=mutedColor}>
                  서비스 소개
                </button>
              </div>
            </div>
          </W>
        </footer>

        {/* Legal modal */}
        <AnimatePresence>
          {modal && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{
                position:'fixed', inset:0, zIndex:50, display:'flex',
                alignItems:'center', justifyContent:'center', padding:16,
                background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)',
              }}
              onClick={() => setModal(null)}>
              <motion.div initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95, y:20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background:surfaceBg, borderRadius:24, maxWidth:560, width:'100%',
                  maxHeight:'85vh', overflowY:'auto',
                  boxShadow:'0 24px 80px rgba(0,0,0,0.25)',
                }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                               padding:'20px 24px', borderBottom:`1px solid ${borderColor}` }}>
                  <h2 style={{ fontSize:18, fontWeight:800, color:titleColor }}>
                    {modal==='privacy'?'개인정보처리방침':modal==='terms'?'이용약관':'서비스 소개'}
                  </h2>
                  <button onClick={() => setModal(null)}
                    style={{
                      width:34, height:34, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
                      background: isDark ? '#2c2c2e' : '#f2f2f7', color:mutedColor,
                    }}>
                    <X size={16}/>
                  </button>
                </div>
                <div style={{ padding:24 }}>
                  {modal==='privacy'
                    ? <PrivacyPolicy/>
                    : modal==='terms'
                    ? <TermsOfService/>
                    : <AboutContent titleColor={titleColor} mutedColor={mutedColor}/>}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Article modal */}
        <AnimatePresence>
          {activeArticle && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{
                position:'fixed', inset:0, zIndex:50, display:'flex',
                alignItems:'center', justifyContent:'center', padding:16,
                background:'rgba(0,0,0,0.55)', backdropFilter:'blur(8px)',
              }}
              onClick={() => setActiveArticle(null)}>
              <motion.div initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95, y:20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background:surfaceBg, borderRadius:24, maxWidth:580, width:'100%',
                  maxHeight:'90vh', overflowY:'auto',
                  boxShadow:'0 24px 80px rgba(0,0,0,0.3)',
                }}>
                <div style={{ height:4, borderRadius:'24px 24px 0 0',
                               background:'linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)'}}/>
                <div style={{ padding:'20px 24px', borderBottom:`1px solid ${borderColor}` }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                        <span style={{
                          fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99,
                          background:'#eef2ff', color:'#6366f1',
                        }}>{activeArticle.category}</span>
                        <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:mutedColor }}>
                          <Clock size={11}/> {activeArticle.readTime} 읽기
                        </span>
                      </div>
                      <h2 style={{ fontSize:20, fontWeight:800, color:titleColor, lineHeight:1.4 }}>
                        {activeArticle.title}
                      </h2>
                      <p style={{ fontSize:13, color:mutedColor, marginTop:8, lineHeight:1.65 }}>
                        {activeArticle.summary}
                      </p>
                    </div>
                    <button onClick={() => setActiveArticle(null)}
                      style={{
                        width:34, height:34, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
                        background: isDark ? '#2c2c2e' : '#f2f2f7', color:mutedColor, flexShrink:0,
                      }}>
                      <X size={16}/>
                    </button>
                  </div>
                </div>
                <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
                  {activeArticle.content.map((p, i) => (
                    <p key={i} style={{ fontSize:14, color:bodyColor, lineHeight:1.8 }}>{p}</p>
                  ))}
                  <div style={{ paddingTop:16, borderTop:`1px solid ${borderColor}`,
                                 display:'flex', flexWrap:'wrap', gap:8 }}>
                    {activeArticle.tags.map((tag) => (
                      <span key={tag} style={{
                        display:'flex', alignItems:'center', gap:5, fontSize:12,
                        padding:'4px 12px', borderRadius:99,
                        background: isDark ? '#2c2c2e' : '#f2f2f7', color:mutedColor,
                      }}>
                        <Tag size={10}/> {tag}
                      </span>
                    ))}
                  </div>
                  <p style={{
                    fontSize:12, padding:'12px 16px', borderRadius:16, lineHeight:1.7,
                    background: isDark ? 'rgba(255,149,0,0.08)' : '#fff8ee',
                    color: isDark ? '#ff9500' : '#92400e',
                    border:`1px solid ${isDark ? 'rgba(255,149,0,0.15)' : '#fde68a'}`,
                  }}>
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
function SectionTitle({ emoji, title, sub, titleColor, mutedColor }: {
  emoji:string; title:string; sub:string; titleColor:string; mutedColor:string;
}) {
  return (
    <div style={{ marginBottom:32 }}>
      <h2 style={{ fontSize:24, fontWeight:800, color:titleColor, letterSpacing:'-0.02em', marginBottom:6 }}>
        {emoji} {title}
      </h2>
      <p style={{ fontSize:14, color:mutedColor }}>{sub}</p>
    </div>
  );
}

function Crumb({ parts, titleColor, mutedColor }: {
  parts:{label:string; onClick?:()=>void}[];
  titleColor:string; mutedColor:string;
}) {
  return (
    <nav style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:mutedColor, marginBottom:4 }}
      aria-label="브레드크럼">
      {parts.map((p, i) => (
        <span key={i} style={{ display:'flex', alignItems:'center', gap:5 }}>
          {i > 0 && <ChevronRight size={10}/>}
          {p.onClick
            ? <button onClick={p.onClick}
                style={{ color:mutedColor, transition:'color 0.15s' }}
                onMouseEnter={(e) => e.currentTarget.style.color='#6366f1'}
                onMouseLeave={(e) => e.currentTarget.style.color=mutedColor}>
                {p.label}
              </button>
            : <span style={{ color:titleColor }}>{p.label}</span>}
        </span>
      ))}
    </nav>
  );
}

function AboutContent({ titleColor, mutedColor }: { titleColor:string; mutedColor:string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, fontSize:14, lineHeight:1.75, color:mutedColor }}>
      {[
        { t:'서비스 소개', d:'별의별 계산기는 대한민국 직장인과 투자자들이 자주 마주치는 복잡한 금융·생활 계산을 쉽고 정확하게 해결할 수 있도록 만들어진 무료 계산기 서비스입니다.' },
        { t:'면책 고지',   d:'본 서비스의 계산 결과는 참고용이며, 실제 금융 상품이나 법률과 차이가 있을 수 있습니다. 중요한 재무적 결정 전에는 전문가(금융 상담사, 세무사, 노무사 등)와 상담하시기 바랍니다.' },
      ].map((s) => (
        <div key={s.t}>
          <h3 style={{ fontWeight:700, marginBottom:6, color:titleColor }}>{s.t}</h3>
          <p>{s.d}</p>
        </div>
      ))}
      <div>
        <h3 style={{ fontWeight:700, marginBottom:6, color:titleColor }}>문의</h3>
        <p>이메일로 연락주세요.{' '}
          <a href="mailto:mirririnside1024@gmail.com" style={{ fontWeight:600, color:'#6366f1', textDecoration:'none' }}>
            mirririnside1024@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
