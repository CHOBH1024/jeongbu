import React, { useState, useCallback } from 'react';
import {
  Rocket, Building2, Monitor, Coins, Truck, Wallet,
  Calculator, Moon, Sun, ChevronLeft, ChevronRight,
  ArrowRight, Briefcase, X, Mail, Shield, Info,
  Clock, Tag, Search, Laugh,
  FileText, Sparkles,
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
import DidimdolLoan               from './components/calculators/DidimdolLoan';
import BeotimokJeonse             from './components/calculators/BeotimokJeonse';
import BogeumjariLoan             from './components/calculators/BogeumjariLoan';
import YouthHousingLoan           from './components/calculators/YouthHousingLoan';
import { SubscriptionLeak }      from './components/calculators/SubscriptionLeak';
import { CoffeeRetirement }      from './components/calculators/CoffeeRetirement';
import { AiVsCloud }             from './components/calculators/AiVsCloud';
import { ServerTco }             from './components/calculators/ServerTco';
import { NetSalary }             from './components/calculators/NetSalary';
import { UnemploymentBenefit }   from './components/calculators/UnemploymentBenefit';
import { ParentalLeave }         from './components/calculators/ParentalLeave';
import { HousingSubscription }   from './components/calculators/HousingSubscription';
import { EvVsGas }               from './components/calculators/EvVsGas';
import { LifeTimeCalc }          from './components/calculators/LifeTimeCalc';
import { ChickenCount }          from './components/calculators/ChickenCount';
import { BitcoinWhatIf }         from './components/calculators/BitcoinWhatIf';
import { PrivacyPolicy }         from './components/pages/PrivacyPolicy';
import { TermsOfService }        from './components/pages/TermsOfService';
import { ARTICLES, type Article } from './data/articles';

type CalcDef = {
  id: string; name: string; desc: string; emoji: string;
  component?: React.ReactNode; status?: '준비중'; isNew?: boolean;
  tags?: string[];   // 검색 키워드 태그
};
type Category = {
  id: string; name: string; emoji: string; icon: React.ReactNode;
  color: string; bg: string; desc: string; calculators: CalcDef[];
  highlights: string[];  // 카테고리 주요 기능 설명
};

const CATEGORIES: Category[] = [
  {
    id:'viral', name:'재무 시뮬레이터', emoji:'🚀',
    icon:<Rocket size={24}/>, color:'#6366f1', bg:'#eef2ff',
    desc:'대출부터 FIRE까지, 재무 미래를 숫자로 시뮬레이션합니다',
    highlights:[
      '대출 갈아타기 — 현재 vs 새 대출 이자 차이를 초 단위로 비교',
      '조기은퇴(FIRE) — 목표 자산 도달까지 몇 년 걸리는지 역산',
      'N잡·프리랜서 — 4대보험·세금 공제 후 실제 손에 쥐는 금액',
      '로또 기회비용 — 매주 산 로또 금액을 S&P500에 넣었다면?',
      '해외송금 — 토스·와이즈·카카오페이 실시간 환율 비교',
    ],
    calculators:[
      { id:'loan',  emoji:'🏦', name:'대출 이자 · 대환 시뮬레이터',  desc:'현재 대출과 새 대출의 이자 차이를 한눈에 비교',   component:<LoanRefinancing/>, tags:['대출','이자','대환','금리','갈아타기','원리금','원금'] },
      { id:'fire',  emoji:'🔥', name:'FIRE(조기은퇴) 시뮬레이터',    desc:'목표 자산과 생존 자금을 역산해 은퇴 시점을 계산', component:<FireSimulator/>, tags:['FIRE','조기은퇴','은퇴','노후','자산','독립'] },
      { id:'njob',  emoji:'💼', name:'N잡 · 프리랜서 실소득 계산기', desc:'세금·4대보험 공제 후 실수령액을 정확히 계산',     component:<NJobCalculator/>, tags:['N잡','프리랜서','부업','세금','소득','사업소득'] },
      { id:'lotto', emoji:'🎰', name:'로또 vs S&P500 기회비용',       desc:'로또 구입비를 투자했다면 얼마가 됐을지 비교',    component:<LottoOpportunity/>, tags:['로또','복권','기회비용','투자','S&P500'] },
      { id:'remit', emoji:'✈️', name:'해외송금 환율 최적화',          desc:'실시간 환율 조회로 수수료·환율 포함 실제 수령액 비교', component:<RemittanceOptimizer/>, tags:['송금','환율','해외송금','달러','엔','유로','외환','토스','와이즈','카카오'] },
    ],
  },
  {
    id:'hr', name:'인사 · 노무', emoji:'🏢',
    icon:<Building2 size={24}/>, color:'#10b981', bg:'#ecfdf5',
    desc:'퇴직금, 연차, 실업급여 등 근로자가 꼭 알아야 할 계산기',
    highlights:[
      '퇴직금 — 평균임금 기준 + 퇴직소득세까지 한번에 정확 계산',
      '연차 — 2018년 개정법 반영, 입사 첫해 최대 26일 발생 여부 확인',
      '월급 실수령액 — 4대보험·소득세·지방세 공제 후 통장 입금액',
      '실업급여 — 근속·나이·고용보험 가입 기간별 수급액·수급일수',
      '육아휴직급여 — 3개월 80%, 이후 50% + 아빠 육아휴직 보너스',
    ],
    calculators:[
      { id:'severance',    emoji:'📋', name:'퇴직금 정밀 계산기',       desc:'평균임금 기준 법정 퇴직금 + 퇴직소득세 정확 계산',   component:<SeveranceCalculator/>, tags:['퇴직금','퇴직','해고','권고사직','평균임금','퇴직소득세','DC형','DB형'] },
      { id:'annual',       emoji:'🗓️', name:'연차 계산기',               desc:'2018년 이후 현행법 기준 연차 발생·잔여·수당 계산',    component:<AnnualLeave/>, isNew:true, tags:['연차','휴가','유급휴가','연차수당','입사일','근속'] },
      { id:'insurance',    emoji:'🛡️', name:'4대보험 사업자 부담금',     desc:'회사 부담 4대보험료를 직종·급여별로 산출',            component:<InsuranceContribution/>, isNew:true, tags:['4대보험','국민연금','건강보험','고용보험','산재','사업자'] },
      { id:'netsalary',    emoji:'💸', name:'월급 실수령액 계산기',       desc:'국민연금·건강보험·소득세 공제 후 실수령액 계산',       component:<NetSalary/>, isNew:true, tags:['월급','실수령','연봉','급여','세후','공제','소득세','4대보험'] },
      { id:'unemployment', emoji:'📉', name:'실업급여 계산기',           desc:'고용보험법 기준 구직급여 일수·금액 산출',             component:<UnemploymentBenefit/>, isNew:true, tags:['실업급여','구직급여','실직','해고','권고사직','고용보험','백수'] },
      { id:'parental',     emoji:'👶', name:'육아휴직급여 계산기',       desc:'육아휴직 기간·임금 기준 급여 지급액 계산',            component:<ParentalLeave/>, isNew:true, tags:['육아휴직','육아','출산','아빠','엄마','임신','아기'] },
    ],
  },
  {
    id:'tech', name:'IT 인프라', emoji:'💻',
    icon:<Monitor size={24}/>, color:'#3b82f6', bg:'#eff6ff',
    desc:'개발자와 IT 매니아를 위한 비용 분석 도구',
    highlights:[
      'NAS 전기요금 — 누진세 포함 월 전기세와 클라우드 대비 손익분기',
      'Local AI vs 클라우드 — GPU 직접 구매 vs API 비용 비교',
      '서버 TCO — 물리 서버 vs AWS/GCP 5년 총 소유비용 분석',
      '전기차 vs 내연기관 — 연료·유지·취득 비용 종합 손익분기점',
    ],
    calculators:[
      { id:'nas',    emoji:'🖥️', name:'NAS 24시간 전기요금 계산기',    desc:'누진세 포함 월 전기요금과 손익분기점 계산',     component:<NasElectricity/>, tags:['NAS','전기','전기요금','누진세','서버','하드디스크'] },
      { id:'ai',     emoji:'🤖', name:'Local AI vs Cloud API 가성비',  desc:'GPU 구매 vs 클라우드 API 비용 비교',           component:<AiVsCloud/>, isNew:true, tags:['AI','GPU','ChatGPT','클라우드','API','딥러닝','머신러닝'] },
      { id:'cloud',  emoji:'☁️', name:'클라우드 vs 물리 서버 손익',    desc:'총 소유비용(TCO) 기준 최적 선택 안내',         component:<ServerTco/>, isNew:true, tags:['클라우드','AWS','GCP','서버','TCO','호스팅'] },
      { id:'evvsgas',emoji:'⚡', name:'전기차 vs 내연기관 비교',       desc:'연료비·유지비·취득가 포함 손익분기점 계산',     component:<EvVsGas/>, isNew:true, tags:['전기차','EV','테슬라','아이오닉','주유비','기름','휘발유','손익분기'] },
    ],
  },
  {
    id:'invest', name:'투자 · 자산', emoji:'💰',
    icon:<Coins size={24}/>, color:'#f59e0b', bg:'#fffbeb',
    desc:'파킹통장부터 배당 스노우볼까지, 자산을 굴리는 법',
    highlights:[
      '파킹통장 — 카카오·토스·케이뱅크 금리 비교 + 일복리 시뮬레이션',
      '은 현물 평단가 — 분할 매수 시 평균 단가와 수익률 계산',
      '배당 스노우볼 — 배당금 재투자로 쌓이는 복리 효과 시각화',
    ],
    calculators:[
      { id:'parking', emoji:'🅿️', name:'파킹통장 일복리 쪼개기',        desc:'은행별 금리 비교와 복리 수익을 시각화',       component:<ParkingAccount/>, tags:['파킹통장','예금','적금','금리','복리','이자','저축'] },
      { id:'silver',  emoji:'🥈', name:'은(Silver) 현물 평단가 계산기', desc:'분할 매수 시 평균 단가와 손익을 계산',        component:<SilverAvgPrice/>, isNew:true, tags:['은','실버','silver','현물','귀금속','평단가','분할매수'] },
      { id:'drip',    emoji:'📈', name:'배당주 재투자 스노우볼',        desc:'배당금 재투자로 쌓이는 복리 효과 시뮬레이션', component:<DripSnowball/>, isNew:true, tags:['배당','배당주','재투자','DRIP','복리','주식','ETF'] },
    ],
  },
  {
    id:'estate', name:'부동산 · 이사', emoji:'🏠',
    icon:<Truck size={24}/>, color:'#ec4899', bg:'#fdf2f8',
    desc:'청약 가점부터 주택담보대출·이사비용까지 한 번에',
    highlights:[
      '청약 가점 — 무주택·부양가족·청약통장 기준 84점 만점 계산',
      '디딤돌·버팀목·보금자리론 — 정부지원 대출 한도·월 상환액',
      '청년 전월세 대출 — 중소기업 청년 전월세, 보증부 월세대출',
      '중개 수수료 + 취득세 — 매매·전세 거래 시 총 부대비용',
      '포장이사 견적 — 거리·물량·층수 기반 이사비용 예상액',
    ],
    calculators:[
      { id:'moving',      emoji:'📦', name:'포장이사 견적 예측기',       desc:'거리·물량 기준 이사 비용 예상액 산출',                  component:<MovingCost/>, isNew:true, tags:['이사','포장이사','이삿짐','이사비용','용달'] },
      { id:'broker',      emoji:'🔑', name:'중개 수수료 · 등기 비용',    desc:'매매·전세 중개보수와 취득세 합산 계산',                 component:<BrokerFee/>, isNew:true, tags:['중개수수료','복비','취득세','부동산','공인중개사'] },
      { id:'subscription',emoji:'🏆', name:'청약 가점 계산기',           desc:'무주택·부양가족·청약통장 기준 84점 만점 가점 산출',      component:<HousingSubscription/>, isNew:true, tags:['청약','청약가점','아파트','당첨','무주택','부양가족','청약통장'] },
      { id:'didimdol',    emoji:'🏡', name:'디딤돌 대출 계산기',         desc:'주택도시기금 디딤돌·신생아특례 대출 한도·월 상환액 계산', component:<DidimdolLoan/>, isNew:true, tags:['디딤돌','주택도시기금','신생아특례','정부대출','주담대'] },
      { id:'beotimok',    emoji:'🔐', name:'버팀목 전세자금 대출',       desc:'버팀목·신생아특례 전세자금 한도·이자 계산',              component:<BeotimokJeonse/>, isNew:true, tags:['버팀목','전세','전세자금','전세대출','신생아','보증금'] },
      { id:'bogeumjari',  emoji:'🏘️', name:'보금자리론 계산기',          desc:'HF 보금자리론 유형별 금리·월 상환액 계산',               component:<BogeumjariLoan/>, isNew:true, tags:['보금자리론','HF','주택금융공사','고정금리','주담대'] },
      { id:'youth',       emoji:'🌱', name:'청년 전월세 대출 계산기',    desc:'중소기업 청년 전월세·청년 보증부 월세대출 계산',          component:<YouthHousingLoan/>, isNew:true, tags:['청년','전월세','청년대출','중소기업','월세','보증금'] },
    ],
  },
  {
    id:'daily', name:'지출 통제', emoji:'💳',
    icon:<Wallet size={24}/>, color:'#ef4444', bg:'#fef2f2',
    desc:'무의식 지출을 숫자로 때려잡는 계산기',
    highlights:[
      '구독료 누수 — 넷플릭스·유튜브·카카오 구독료 연간·10년 환산',
      '카푸어 타이머 — 차 할부가 내 자산에 미치는 실제 충격 계산',
      '커피 연금 — 매일 커피값을 30년 투자하면 노후 자금이 얼마?',
    ],
    calculators:[
      { id:'carpoor', emoji:'🚗', name:'자동차 할부 vs 카푸어 타이머', desc:'차 할부가 자산에 미치는 실질적 충격 계산',  component:<CarPoorTimer/>, tags:['자동차','할부','카푸어','차','자산','기회비용'] },
      { id:'sub',     emoji:'📱', name:'구독료 누수 탐지기',           desc:'월별 구독 지출이 연간·10년에 얼마인지 계산', component:<SubscriptionLeak/>, isNew:true, tags:['구독','넷플릭스','유튜브','카카오','구독료','OTT'] },
      { id:'coffee',  emoji:'☕', name:'커피값 노후 연금 환산기',      desc:'매일 커피값을 투자했다면 노후에 얼마가 될까', component:<CoffeeRetirement/>, isNew:true, tags:['커피','스타벅스','노후','연금','투자','절약'] },
    ],
  },
  {
    id:'fun', name:'재미있는 계산기', emoji:'🎉',
    icon:<Laugh size={24}/>, color:'#8b5cf6', bg:'#f5f3ff',
    desc:'숫자로 보는 인생 — 웃기고 진지한 엉뚱 계산기',
    highlights:[
      '치킨 환산기 — 내 연봉으로 치킨·피자·스타벅스 몇 개 살 수 있나',
      '인생 시간 — 남은 인생을 밥·잠·월급날·심장박동수로 환산',
      '비트코인 가정 — 그때 비트코인을 샀다면 지금 얼마가 됐을까?',
    ],
    calculators:[
      { id:'chicken',  emoji:'🍗', name:'연봉 치킨 환산기',           desc:'내 연봉으로 치킨·피자·커피를 몇 개나 살 수 있을까?', component:<ChickenCount/>, isNew:true, tags:['치킨','연봉','환산','재미','피자','커피','스타벅스'] },
      { id:'lifetime', emoji:'⏳', name:'인생 시간 계산기',           desc:'남은 인생을 시간·밥·잠·월급날로 환산해 보세요',    component:<LifeTimeCalc/>, isNew:true, tags:['인생','수명','나이','시간','남은','기대수명','생일'] },
      { id:'bitcoin',  emoji:'₿', name:'비트코인을 샀다면?',          desc:'그때 비트코인을 샀다면 지금 얼마가 됐을지 계산',    component:<BitcoinWhatIf/>, isNew:true, tags:['비트코인','BTC','코인','가상화폐','암호화폐','투자','이더리움'] },
    ],
  },
  {
    id:'fun', name:'재미있는 계산기', emoji:'🎉',
    icon:<Laugh size={24}/>, color:'#8b5cf6', bg:'#f5f3ff',
    desc:'숫자로 보는 인생 — 웃기고 진지한 엉뚱 계산기',
    calculators:[
      { id:'chicken',  emoji:'🍗', name:'연봉 치킨 환산기',           desc:'내 연봉으로 치킨·피자·커피를 몇 개나 살 수 있을까?', component:<ChickenCount/>, isNew:true },
      { id:'lifetime', emoji:'⏳', name:'인생 시간 계산기',           desc:'남은 인생을 시간·밥·잠·월급날로 환산해 보세요',    component:<LifeTimeCalc/>, isNew:true },
      { id:'bitcoin',  emoji:'₿', name:'비트코인을 샀다면?',          desc:'그때 비트코인을 샀다면 지금 얼마가 됐을지 계산',    component:<BitcoinWhatIf/>, isNew:true },
    ],
  },
];

const FEATURED = ['loan','netsalary','annual','severance','unemployment','drip','broker','sub','chicken','bitcoin'];
function getFeatured() {
  return CATEGORIES.flatMap((c) =>
    c.calculators.filter((cc) => FEATURED.includes(cc.id) && !cc.status)
      .map((cc) => ({ ...cc, catName:c.name, catEmoji:c.emoji, catColor:c.color, catBg:c.bg }))
  );
}

function W({ children, className='' }: { children:React.ReactNode; className?:string }) {
  return <div className={`w ${className}`}>{children}</div>;
}

/* Cute pill badge */
function Pill({ children, color, bg }: { children:React.ReactNode; color:string; bg:string }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:4,
      padding:'4px 12px', borderRadius:99, fontSize:12, fontWeight:700,
      background:bg, color:color,
    }}>{children}</span>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string|null>(null);
  const [activeCalcId,   setActiveCalcId]   = useState<string|null>(null);
  const [isDark,         setIsDark]         = useState(false);
  const [modal,          setModal]          = useState<'privacy'|'about'|'terms'|null>(null);
  const [activeArticle,  setActiveArticle]  = useState<Article|null>(null);
  const [showSearch,     setShowSearch]     = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');

  const selectedCategory = CATEGORIES.find((c) => c.id === activeCategory);
  const selectedCalc     = selectedCategory?.calculators.find((c) => c.id === activeCalcId);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* Ctrl+K / Cmd+K to open search */
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') { setShowSearch(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const navigate = useCallback((catId: string, calcId?: string) => {
    setActiveCategory(catId);
    setActiveCalcId(calcId ?? null);
    setShowSearch(false);
    setSearchQuery('');
    scrollTop();
  }, []);

  const reset = () => { setActiveCategory(null); setActiveCalcId(null); scrollTop(); };

  /* Search results — 이름, 설명, 카테고리명, 태그 모두 검색 */
  const searchResults = searchQuery.trim().length >= 1
    ? CATEGORIES.flatMap((c) =>
        c.calculators
          .filter((cc) => {
            if (cc.status) return false;
            const q = searchQuery.trim().toLowerCase();
            return (
              cc.name.toLowerCase().includes(q) ||
              cc.desc.toLowerCase().includes(q) ||
              c.name.toLowerCase().includes(q) ||
              (cc.tags ?? []).some((t) => t.toLowerCase().includes(q))
            );
          })
          .map((cc) => ({ ...cc, catId: c.id, catName: c.name, catEmoji: c.emoji, catColor: c.color, catBg: c.bg }))
      )
    : [];

  const titleColor  = isDark ? '#f5f5f7'               : '#1d1d1f';
  const bodyColor   = isDark ? 'rgba(235,235,245,0.85)' : '#3a3a3c';
  const mutedColor  = isDark ? '#8e8e93'               : '#6e6e73';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)';
  const surfaceBg   = isDark ? '#1c1c1e'               : '#ffffff';
  const pageBg      = isDark ? '#000'                  : '#f2f2f7';
  const altBg       = isDark ? '#0a0a0a'               : '#ffffff';

  return (
    <div className={isDark ? 'dark' : ''}>
      <div style={{ minHeight:'100vh', background:pageBg }}>

        {/* ── Nav ────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 nav" role="banner">
          <div className="w" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>
            <button onClick={reset} style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }} aria-label="홈">
              <div style={{
                width:38, height:38, borderRadius:12,
                background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 0 16px rgba(139,92,246,0.4)',
              }}>
                <Calculator size={18} color="#fff"/>
              </div>
              <div style={{ display:'flex', flexDirection:'column', lineHeight:1.1 }}>
                <span className="text-gradient" style={{ fontWeight:800, fontSize:17, letterSpacing:'-0.03em' }}>별의별 계산기</span>
                <span style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontWeight:500 }}>무료 · 즉시 · 개인정보 0</span>
              </div>
            </button>

            {/* Desktop nav — className only (no inline display so 'hidden' works on mobile) */}
            <nav className="hidden lg:flex items-center" style={{ gap:2 }} aria-label="카테고리">
              {CATEGORIES.map((cat) => (
                <button key={cat.id}
                  onClick={() => navigate(cat.id)}
                  style={{
                    padding:'7px 10px', borderRadius:10, fontSize:12, fontWeight:600,
                    color:'rgba(255,255,255,0.6)', transition:'all 0.15s',
                    display:'flex', alignItems:'center', gap:4, whiteSpace:'nowrap',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(255,255,255,0.09)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color='rgba(255,255,255,0.6)'; e.currentTarget.style.background='transparent'; }}>
                  <span>{cat.emoji}</span> {cat.name}
                </button>
              ))}
            </nav>

            <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
              {/* Search button */}
              <button onClick={() => setShowSearch(true)} aria-label="검색 (Ctrl+K)"
                style={{
                  height:38, borderRadius:12, display:'flex', alignItems:'center',
                  gap:8, padding:'0 12px',
                  background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.55)',
                  border:'1px solid rgba(255,255,255,0.12)',
                }}>
                <Search size={15}/>
                <span style={{ fontSize:12, fontWeight:500 }} className="hidden lg:inline">계산기 검색</span>
                <span style={{
                  fontSize:10, padding:'2px 6px', borderRadius:6, fontWeight:700,
                  background:'rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.4)',
                }} className="hidden lg:inline">⌘K</span>
              </button>
              <button onClick={() => setIsDark(!isDark)} aria-label={isDark?'라이트모드':'다크모드'}
                style={{
                  width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
                  background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.75)',
                  border:'1px solid rgba(255,255,255,0.12)',
                }}>
                {isDark ? <Sun size={17}/> : <Moon size={17}/>}
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">

          {/* ── Home ──────────────────────────────────────────── */}
          {!activeCategory && (
            <motion.div key="home" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>

              {/* Hero */}
              <section className="hero" style={{ paddingTop:96, paddingBottom:104 }}>
                <W>
                  <div style={{ textAlign:'center' }}>
                    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
                      style={{ marginBottom:32 }}>
                      <span className="hero-badge">
                        <Sparkles size={13}/> 완전 무료 &nbsp;·&nbsp; 개인정보 미수집 &nbsp;·&nbsp; 즉시 계산
                      </span>
                    </motion.div>

                    <motion.h1 initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.09 }}
                      style={{
                        fontSize:'clamp(38px,6.5vw,70px)', fontWeight:800, lineHeight:1.1,
                        letterSpacing:'-0.035em', color:'#ffffff', marginBottom:24,
                      }}>
                      복잡한 계산,<br/>
                      <span className="text-gradient">숫자로 바로 해결 ✨</span>
                    </motion.h1>

                    <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.13 }}
                      style={{
                        fontSize:18, color:'rgba(255,255,255,0.58)', lineHeight:1.85,
                        maxWidth:420, margin:'0 auto 64px',
                      }}>
                      대출·퇴직금·연차·FIRE까지.<br/>
                      인터넷 검색 없이 즉시 결과를 확인하세요.
                    </motion.p>

                    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.17 }}
                      className="hero-stats">
                      {([
                        { emoji:'🧮', value:'28+',  label:'계산기 운영 중', color:'#a78bfa' },
                        { emoji:'⚡', value:'즉시', label:'실시간 계산',    color:'#34d399' },
                        { emoji:'🔒', value:'0건',  label:'정보 미수집',   color:'#fbbf24' },
                        { emoji:'🎁', value:'무료', label:'완전 무료',      color:'#f472b6' },
                      ] as const).map((s) => (
                        <div key={s.label} className="stat">
                          <div style={{ fontSize:28, marginBottom:10 }}>{s.emoji}</div>
                          <div className="num" style={{ fontSize:26, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
                          <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginTop:7, fontWeight:500, lineHeight:1.4 }}>{s.label}</div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </W>
              </section>

              {/* Featured calculators */}
              <section style={{ background:altBg, padding:'88px 0' }}>
                <W>
                  <SectionTitle emoji="⭐" title="인기 계산기" sub="가장 많이 찾는 계산기를 바로 사용해보세요" titleColor={titleColor} mutedColor={mutedColor}/>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:20 }}>
                    {getFeatured().map((calc, idx) => (
                      <motion.button key={calc.id}
                        initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.05 }}
                        onClick={() => {
                          const cat = CATEGORIES.find((cc) => cc.calculators.some((c) => c.id===calc.id));
                          if (cat) navigate(cat.id, calc.id);
                        }}
                        className="card"
                        style={{ padding:28, textAlign:'left', width:'100%', display:'flex', flexDirection:'column', gap:0 }}>
                        {/* Top row */}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                          <Pill color={calc.catColor} bg={calc.catBg}>
                            {calc.catEmoji} {calc.catName}
                          </Pill>
                          {calc.isNew && <span className="pill-new">NEW ✦</span>}
                        </div>
                        {/* Emoji + title */}
                        <div style={{ fontSize:36, marginBottom:12, lineHeight:1 }}>{calc.emoji}</div>
                        <h3 style={{ fontWeight:700, fontSize:16, color:titleColor, lineHeight:1.5, marginBottom:10, flex:1 }}>
                          {calc.name}
                        </h3>
                        <p style={{ fontSize:13, color:mutedColor, lineHeight:1.75, marginBottom:20 }}>{calc.desc}</p>
                        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:700, color:calc.catColor }}>
                          바로가기 <ArrowRight size={13}/>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </W>
              </section>

              {/* Categories */}
              <section style={{ background:pageBg, padding:'88px 0' }}>
                <W>
                  <SectionTitle emoji="📂" title="전체 카테고리" sub="원하는 분야의 계산기를 골라보세요" titleColor={titleColor} mutedColor={mutedColor}/>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))', gap:22 }}>
                    {CATEGORIES.map((cat, idx) => {
                      const available = cat.calculators.filter((cc) => !cc.status);
                      return (
                        <motion.button key={cat.id}
                          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.07 }}
                          onClick={() => navigate(cat.id)}
                          className="card"
                          style={{ textAlign:'left', width:'100%', overflow:'hidden', display:'flex', flexDirection:'column' }}>
                          {/* Colored header */}
                          <div className="cat-header" style={{ background:cat.bg }}>
                            <div style={{
                              width:52, height:52, borderRadius:16, flexShrink:0,
                              background:`${cat.color}20`, border:`1.5px solid ${cat.color}35`,
                              display:'flex', alignItems:'center', justifyContent:'center',
                              fontSize:24,
                            }}>
                              {cat.emoji}
                            </div>
                            <div style={{ flex:1 }}>
                              <p style={{ fontWeight:800, fontSize:17, color:cat.color, marginBottom:3, letterSpacing:'-0.01em' }}>
                                {cat.name}
                              </p>
                              <p style={{ fontSize:12, color:`${cat.color}aa`, fontWeight:600 }}>
                                계산기 {available.length}개
                              </p>
                            </div>
                          </div>
                          {/* Body */}
                          <div style={{ padding:'20px 28px 26px', flex:1, display:'flex', flexDirection:'column', gap:16 }}>
                            <p style={{ fontSize:14, color:bodyColor, lineHeight:1.8 }}>{cat.desc}</p>
                            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                              {cat.calculators.slice(0,3).map((cc) => (
                                <span key={cc.id} style={{
                                  display:'inline-flex', alignItems:'center', gap:4,
                                  padding:'5px 13px', borderRadius:99, fontSize:12, fontWeight:600,
                                  background: cc.status ? (isDark?'#2c2c2e':'#ebebef') : `${cat.color}15`,
                                  color: cc.status ? mutedColor : cat.color,
                                  border:`1px solid ${cc.status?(isDark?'#3a3a3c':'#d1d1d6'):`${cat.color}28`}`,
                                }}>
                                  {cc.emoji} {cc.name.split(/[ ·]/)[0]}
                                  {cc.isNew && <span style={{ fontSize:9, fontWeight:800, color:cat.color, opacity:0.8 }}>✦</span>}
                                </span>
                              ))}
                              {cat.calculators.length > 3 && (
                                <span style={{
                                  display:'inline-flex', alignItems:'center', padding:'5px 13px', borderRadius:99,
                                  fontSize:12, fontWeight:600, background:isDark?'#2c2c2e':'#ebebef', color:mutedColor,
                                }}>+{cat.calculators.length - 3}개</span>
                              )}
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13,
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
              <section style={{ background:altBg, padding:'88px 0' }}>
                <W>
                  <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, flexWrap:'wrap', gap:12 }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                        <span style={{ fontSize:28 }}>📚</span>
                        <h2 style={{ fontWeight:800, fontSize:24, color:titleColor, letterSpacing:'-0.02em' }}>
                          알아두면 돈 되는 금융 상식
                        </h2>
                      </div>
                      <p style={{ fontSize:14, color:mutedColor, lineHeight:1.7, paddingLeft:40 }}>
                        계산기와 함께 읽으면 더 유용한 실전 금융 가이드
                      </p>
                    </div>
                    <Pill color="#6366f1" bg="#eef2ff">📖 총 {ARTICLES.length}편</Pill>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:18 }}>
                    {ARTICLES.map((article, idx) => (
                      <motion.button key={article.id}
                        initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                        transition={{ delay:Math.min(idx*0.025, 0.4) }}
                        onClick={() => setActiveArticle(article)}
                        className="card"
                        style={{ padding:26, textAlign:'left', width:'100%', display:'flex', flexDirection:'column', gap:0 }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                          <Pill color="#6366f1" bg="#eef2ff">{article.category}</Pill>
                          <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:mutedColor }}>
                            <Clock size={11}/> {article.readTime}
                          </span>
                        </div>
                        <h3 style={{
                          fontWeight:700, fontSize:14, color:titleColor, lineHeight:1.6,
                          flex:1, marginBottom:12,
                          display:'-webkit-box', WebkitLineClamp:2,
                          WebkitBoxOrient:'vertical', overflow:'hidden',
                        }}>
                          {article.title}
                        </h3>
                        <p style={{
                          fontSize:13, color:mutedColor, lineHeight:1.7,
                          display:'-webkit-box', WebkitLineClamp:2,
                          WebkitBoxOrient:'vertical', overflow:'hidden',
                        }}>
                          {article.summary}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </W>
              </section>

              {/* About */}
              <section style={{ background:pageBg, padding:'96px 0', textAlign:'center' }}>
                <W>
                  <div style={{ marginBottom:24 }}>
                    <span style={{ fontSize:40 }}>✨</span>
                  </div>
                  <span style={{
                    display:'inline-flex', alignItems:'center', gap:6,
                    padding:'6px 18px', borderRadius:99, fontSize:13, fontWeight:700, marginBottom:20,
                    background:'rgba(99,102,241,0.1)', color:'#6366f1',
                    border:'1px solid rgba(99,102,241,0.2)',
                  }}>
                    <Info size={13}/> 별의별 계산기란?
                  </span>
                  <h2 style={{
                    fontSize:'clamp(26px,4vw,38px)', fontWeight:800, color:titleColor,
                    letterSpacing:'-0.025em', lineHeight:1.25, marginBottom:18, marginTop:16,
                  }}>
                    복잡한 금융 계산을<br/>누구나 쉽게 🎯
                  </h2>
                  <p style={{
                    fontSize:16, color:mutedColor, lineHeight:1.9, maxWidth:440,
                    margin:'0 auto 64px',
                  }}>
                    일상에서 꼭 필요하지만 계산하기 어려운 금융·생활 계산기를<br/>
                    완전 무료로 제공합니다.
                  </p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:22 }}>
                    {[
                      { emoji:'🔒', color:'#10b981', bg:'#ecfdf5',
                        title:'개인정보 완전 보호',
                        desc:'서버에 어떤 데이터도 저장하지 않습니다. 모든 계산은 브라우저에서만 이루어집니다.' },
                      { emoji:'⚡', color:'#6366f1', bg:'#eef2ff',
                        title:'실시간 즉시 계산',
                        desc:'숫자를 입력하는 즉시 결과가 업데이트됩니다. 별도의 버튼 클릭이 필요 없습니다.' },
                      { emoji:'🎯', color:'#f59e0b', bg:'#fffbeb',
                        title:'전문가 수준 정확도',
                        desc:'금융감독원 기준과 세법을 반영한 정확한 계산 로직으로 신뢰할 수 있는 결과를 제공합니다.' },
                    ].map((item) => (
                      <div key={item.title} className="card" style={{ padding:36, textAlign:'center' }}>
                        <div style={{
                          width:64, height:64, borderRadius:20,
                          background:item.bg, margin:'0 auto 20px',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:32,
                        }}>
                          {item.emoji}
                        </div>
                        <h3 style={{ fontWeight:800, fontSize:16, color:titleColor, marginBottom:12 }}>{item.title}</h3>
                        <p style={{ fontSize:13, color:mutedColor, lineHeight:1.85 }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </W>
              </section>

            </motion.div>
          )}

          {/* ── Category list ─────────────────────────────────── */}
          {activeCategory && !activeCalcId && selectedCategory && (
            <motion.div key="cat"
              initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
              transition={{ duration:0.22 }}>
              <div style={{ background:pageBg, minHeight:'80vh', paddingBottom:80 }}>
                {/* Category hero banner */}
                <div style={{ background:selectedCategory.bg, padding:'48px 0 40px' }}>
                  <W>
                    <button onClick={reset}
                      style={{
                        display:'inline-flex', alignItems:'center', gap:6, marginBottom:24,
                        fontSize:13, fontWeight:600, color:`${selectedCategory.color}bb`,
                        padding:'6px 14px', borderRadius:99,
                        background:`${selectedCategory.color}15`,
                      }}>
                      <ChevronLeft size={15}/> 홈으로
                    </button>
                    <div style={{ display:'flex', alignItems:'center', gap:18 }}>
                      <div style={{
                        width:68, height:68, borderRadius:20, flexShrink:0,
                        background:`${selectedCategory.color}20`,
                        border:`2px solid ${selectedCategory.color}30`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:34,
                      }}>
                        {selectedCategory.emoji}
                      </div>
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:`${selectedCategory.color}99`, marginBottom:6, letterSpacing:'0.05em' }}>
                          CATEGORY
                        </div>
                        <h2 style={{ fontSize:28, fontWeight:800, color:selectedCategory.color, letterSpacing:'-0.025em', marginBottom:6 }}>
                          {selectedCategory.name}
                        </h2>
                        <p style={{ fontSize:14, color:`${selectedCategory.color}bb`, lineHeight:1.6 }}>
                          {selectedCategory.desc}
                        </p>
                      </div>
                    </div>
                  </W>
                </div>

                <W>
                  {/* 카테고리 기능 하이라이트 */}
                  <div style={{ padding:'32px 0 8px' }}>
                    <p style={{ fontSize:12, fontWeight:800, color:`${selectedCategory.color}99`, letterSpacing:'0.06em', marginBottom:14 }}>
                      이 카테고리에서 할 수 있는 것
                    </p>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:10 }}>
                      {selectedCategory.highlights.map((h, i) => (
                        <div key={i} style={{
                          display:'flex', alignItems:'flex-start', gap:10,
                          padding:'13px 16px', borderRadius:14,
                          background:`${selectedCategory.color}08`,
                          border:`1px solid ${selectedCategory.color}18`,
                        }}>
                          <span style={{
                            width:22, height:22, borderRadius:99, flexShrink:0,
                            background:selectedCategory.color, color:'#fff',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:11, fontWeight:800,
                          }}>{i+1}</span>
                          <span style={{ fontSize:13, color:bodyColor, lineHeight:1.6, fontWeight:500 }}>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ paddingTop:28 }}>
                    <p style={{ fontSize:12, fontWeight:800, color:mutedColor, letterSpacing:'0.06em', marginBottom:16 }}>
                      전체 계산기 {selectedCategory.calculators.filter(c=>!c.status).length}개
                    </p>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:18 }}>
                      {selectedCategory.calculators.map((calc, idx) => (
                        <motion.button key={calc.id}
                          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.07 }}
                          onClick={() => calc.status !== '준비중' && navigate(activeCategory!, calc.id)}
                          disabled={calc.status === '준비중'}
                          className="card"
                          style={{
                            padding:28, textAlign:'left', width:'100%',
                            display:'flex', alignItems:'flex-start', gap:18,
                            opacity:calc.status ? 0.45 : 1,
                            cursor:calc.status ? 'not-allowed' : 'pointer',
                          }}>
                          <div style={{
                            width:54, height:54, borderRadius:16, flexShrink:0,
                            background:calc.status ? (isDark?'#2c2c2e':'#ebebef') : selectedCategory.bg,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:28,
                          }}>
                            {calc.emoji}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap' }}>
                              <span style={{ fontWeight:800, fontSize:15, color:titleColor }}>{calc.name}</span>
                              {calc.isNew && <span className="pill-new">NEW ✦</span>}
                              {calc.status && (
                                <span style={{
                                  fontSize:11, padding:'2px 9px', borderRadius:99, fontWeight:600,
                                  background:isDark?'#2c2c2e':'#ebebef', color:mutedColor,
                                }}>🚧 준비중</span>
                              )}
                            </div>
                            <p style={{ fontSize:13, color:mutedColor, lineHeight:1.75 }}>{calc.desc}</p>
                          </div>
                          {!calc.status && (
                            <ChevronRight size={18} style={{ flexShrink:0, marginTop:4, color:selectedCategory.color, opacity:0.6 }}/>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </W>
              </div>
            </motion.div>
          )}

          {/* ── Calculator ────────────────────────────────────── */}
          {activeCategory && activeCalcId && selectedCategory && selectedCalc && (
            <motion.div key={activeCalcId}
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}
              transition={{ duration:0.2 }}>
              <div style={{ background:pageBg, minHeight:'80vh', paddingBottom:80 }}>
                {/* Calc header */}
                <div style={{ background:selectedCategory.bg, padding:'40px 0 32px' }}>
                  <W>
                    <nav style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:`${selectedCategory.color}99`, marginBottom:20 }}>
                      <button onClick={reset}
                        style={{ fontWeight:600, color:`${selectedCategory.color}aa` }}
                        onMouseEnter={(e) => e.currentTarget.style.color=selectedCategory.color}
                        onMouseLeave={(e) => e.currentTarget.style.color=`${selectedCategory.color}aa`}>
                        🏠 홈
                      </button>
                      <ChevronRight size={11}/>
                      <button onClick={() => setActiveCalcId(null)}
                        style={{ fontWeight:600, color:`${selectedCategory.color}aa` }}
                        onMouseEnter={(e) => e.currentTarget.style.color=selectedCategory.color}
                        onMouseLeave={(e) => e.currentTarget.style.color=`${selectedCategory.color}aa`}>
                        {selectedCategory.emoji} {selectedCategory.name}
                      </button>
                      <ChevronRight size={11}/>
                      <span style={{ color:selectedCategory.color, fontWeight:700 }}>{selectedCalc.name}</span>
                    </nav>
                    <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                      <button onClick={() => setActiveCalcId(null)}
                        style={{
                          width:42, height:42, borderRadius:13, flexShrink:0,
                          background:`${selectedCategory.color}20`,
                          border:`1.5px solid ${selectedCategory.color}30`,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          color:selectedCategory.color,
                        }}>
                        <ChevronLeft size={20}/>
                      </button>
                      <div style={{ fontSize:36, flexShrink:0 }}>{selectedCalc.emoji}</div>
                      <div>
                        <h2 style={{ fontSize:22, fontWeight:800, color:selectedCategory.color, letterSpacing:'-0.02em', marginBottom:4 }}>
                          {selectedCalc.name}
                        </h2>
                        <p style={{ fontSize:13, color:`${selectedCategory.color}bb`, lineHeight:1.6 }}>{selectedCalc.desc}</p>
                      </div>
                    </div>
                  </W>
                </div>
                <W>
                  <div style={{ paddingTop:36 }}>
                    {selectedCalc.component}
                  </div>
                </W>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* ── Footer ────────────────────────────────────────── */}
        <footer style={{ background:altBg, borderTop:`1px solid ${borderColor}` }} role="contentinfo">
          <W>
            <div style={{ padding:'64px 0 40px', display:'grid', gap:40 }} className="footer-grid">
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                  <div style={{
                    width:32, height:32, borderRadius:10,
                    background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Calculator size={15} color="#fff"/>
                  </div>
                  <span className="text-gradient" style={{ fontWeight:800, fontSize:17 }}>별의별 계산기</span>
                </div>
                <p style={{ fontSize:14, color:mutedColor, lineHeight:1.85, maxWidth:300 }}>
                  대출, 퇴직금, 연차, FIRE 등 일상의 복잡한 계산을 무료로 해결하는 스마트 계산기 서비스입니다.
                </p>
                <p style={{ fontSize:11, color:mutedColor, opacity:0.5, marginTop:16, lineHeight:1.7 }}>
                  ※ 계산 결과는 참고용이며 실제 금융 상품·법률과 차이가 있을 수 있습니다.
                </p>
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:800, color:titleColor, marginBottom:18 }}>📌 주요 계산기</p>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12 }}>
                  {[
                    ['loan','viral','🏦 대출 이자 계산기'],
                    ['fire','viral','🔥 FIRE 시뮬레이터'],
                    ['severance','hr','📋 퇴직금 계산기'],
                    ['annual','hr','🗓️ 연차 계산기'],
                    ['parking','invest','🅿️ 파킹통장 계산기'],
                  ].map(([id,cat,name]) => (
                    <li key={id}>
                      <button onClick={() => { setActiveCategory(cat); setActiveCalcId(id); }}
                        style={{ fontSize:13, color:mutedColor, lineHeight:1.6, transition:'color 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color='#6366f1'}
                        onMouseLeave={(e) => e.currentTarget.style.color=mutedColor}>
                        {name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:800, color:titleColor, marginBottom:18 }}>📬 정보</p>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12 }}>
                  {([
                    { icon:<Info size={13}/>,     label:'서비스 소개',      act:()=>setModal('about')   },
                    { icon:<Shield size={13}/>,   label:'개인정보처리방침', act:()=>setModal('privacy') },
                    { icon:<FileText size={13}/>, label:'이용약관',         act:()=>setModal('terms')   },
                  ] as const).map((item) => (
                    <li key={item.label}>
                      <button onClick={item.act}
                        style={{ fontSize:13, color:mutedColor, display:'flex', alignItems:'center', gap:7, transition:'color 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color='#6366f1'}
                        onMouseLeave={(e) => e.currentTarget.style.color=mutedColor}>
                        {item.icon} {item.label}
                      </button>
                    </li>
                  ))}
                  {([
                    { icon:<Mail size={13}/>,      label:'문의하기',  href:'mailto:mirririnside1024@gmail.com' },
                    { icon:<Briefcase size={13}/>, label:'광고 문의', href:'mailto:mirririnside1024@gmail.com' },
                  ] as const).map((item) => (
                    <li key={item.label}>
                      <a href={item.href}
                        style={{ fontSize:13, color:mutedColor, display:'flex', alignItems:'center', gap:7, textDecoration:'none', transition:'color 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color='#6366f1'}
                        onMouseLeave={(e) => e.currentTarget.style.color=mutedColor}>
                        {item.icon} {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{
              padding:'24px 0 32px', borderTop:`1px solid ${borderColor}`,
              display:'flex', flexWrap:'wrap', alignItems:'center',
              justifyContent:'space-between', gap:12,
            }}>
              <p style={{ fontSize:12, color:mutedColor }}>© 2026 별의별 계산기. All rights reserved. 🌟</p>
              <div style={{ display:'flex', alignItems:'center', gap:16, fontSize:12, color:mutedColor }}>
                {(['privacy' as const,'terms' as const,'about' as const]).map((m, i) => (
                  <span key={m} style={{ display:'flex', alignItems:'center', gap:16 }}>
                    {i>0 && <span style={{ opacity:0.3 }}>·</span>}
                    <button onClick={()=>setModal(m)}
                      style={{ color:mutedColor, transition:'color 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color='#6366f1'}
                      onMouseLeave={(e) => e.currentTarget.style.color=mutedColor}>
                      {m==='privacy'?'개인정보처리방침':m==='terms'?'이용약관':'서비스 소개'}
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </W>
        </footer>

        {/* ── Search modal ──────────────────────────────────── */}
        <AnimatePresence>
          {showSearch && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="search-overlay" onClick={() => setShowSearch(false)}>
              <motion.div initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:-20, opacity:0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ width:'100%', maxWidth:600 }}>
                {/* Search input */}
                <div style={{
                  display:'flex', alignItems:'center', gap:12, padding:'14px 20px',
                  background:surfaceBg, borderRadius:18,
                  boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
                  border:`1px solid ${borderColor}`,
                }}>
                  <Search size={18} color="#6366f1"/>
                  <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="계산기 이름 또는 키워드 검색..."
                    style={{
                      flex:1, border:'none', outline:'none', fontSize:16,
                      background:'transparent', color:titleColor, fontFamily:'inherit',
                    }}/>
                  <button onClick={() => setShowSearch(false)}
                    style={{ color:mutedColor, display:'flex', alignItems:'center' }}>
                    <X size={18}/>
                  </button>
                </div>
                {/* Results */}
                {searchResults.length > 0 && (
                  <div style={{
                    marginTop:10, background:surfaceBg, borderRadius:16,
                    boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
                    border:`1px solid ${borderColor}`,
                    maxHeight:480, overflowY:'auto',
                  }}>
                    {searchResults.map((r, i) => (
                      <button key={r.id} onClick={() => navigate(r.catId, r.id)}
                        style={{
                          width:'100%', padding:'14px 20px', textAlign:'left',
                          display:'flex', alignItems:'center', gap:14,
                          borderBottom: i < searchResults.length-1 ? `1px solid ${borderColor}` : 'none',
                          background:'transparent',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = isDark?'#1c1c1e':'#f9f9fb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <div style={{
                          width:42, height:42, borderRadius:12, flexShrink:0, fontSize:22,
                          background:r.catBg, display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          {r.emoji}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontWeight:700, fontSize:14, color:titleColor, marginBottom:2 }}>{r.name}</p>
                          <p style={{ fontSize:12, color:mutedColor }}>{r.catEmoji} {r.catName}</p>
                        </div>
                        <ChevronRight size={14} color={mutedColor}/>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery.trim() && searchResults.length === 0 && (
                  <div style={{
                    marginTop:10, background:surfaceBg, borderRadius:16, padding:'24px',
                    textAlign:'center', color:mutedColor, fontSize:14,
                    boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
                  }}>
                    <p style={{ fontSize:20, marginBottom:8 }}>🔍</p>
                    <p>"{searchQuery}"에 해당하는 계산기를 찾지 못했습니다.</p>
                  </div>
                )}
                {!searchQuery.trim() && (
                  <div style={{
                    marginTop:10, background:surfaceBg, borderRadius:16, padding:'20px',
                    boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
                  }}>
                    <p style={{ fontSize:11, color:mutedColor, fontWeight:700, marginBottom:12 }}>자주 찾는 키워드</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {[
                        '퇴직금','연차','실업급여','월급','육아휴직',
                        '청약','대출','보금자리론','전기차',
                        '치킨','비트코인','인생','FIRE','파킹통장',
                      ].map((kw) => (
                        <button key={kw} onClick={() => setSearchQuery(kw)}
                          style={{
                            padding:'6px 14px', borderRadius:99, fontSize:12, fontWeight:700,
                            background:'#eef2ff', color:'#6366f1', cursor:'pointer',
                            border:'1px solid rgba(99,102,241,0.2)',
                          }}>
                          {kw}
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize:10, color:'#aeaeb2', marginTop:14 }}>
                      💡 Ctrl+K (Mac: ⌘K) 단축키로 검색창을 열 수 있습니다
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Legal modal ───────────────────────────────────── */}
        <AnimatePresence>
          {modal && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{
                position:'fixed', inset:0, zIndex:50, display:'flex',
                alignItems:'center', justifyContent:'center', padding:20,
                background:'rgba(0,0,0,0.5)', backdropFilter:'blur(10px)',
              }}
              onClick={() => setModal(null)}>
              <motion.div initial={{ scale:0.94, y:24 }} animate={{ scale:1, y:0 }} exit={{ scale:0.94, y:24 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background:surfaceBg, borderRadius:28, maxWidth:560, width:'100%',
                  maxHeight:'85vh', overflowY:'auto',
                  boxShadow:'0 32px 96px rgba(0,0,0,0.28)',
                }}>
                <div style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'22px 28px', borderBottom:`1px solid ${borderColor}`,
                }}>
                  <h2 style={{ fontSize:18, fontWeight:800, color:titleColor }}>
                    {modal==='privacy'?'🔒 개인정보처리방침':modal==='terms'?'📄 이용약관':'✨ 서비스 소개'}
                  </h2>
                  <button onClick={() => setModal(null)}
                    style={{
                      width:36, height:36, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center',
                      background:isDark?'#2c2c2e':'#f2f2f7', color:mutedColor,
                    }}>
                    <X size={16}/>
                  </button>
                </div>
                <div style={{ padding:28 }}>
                  {modal==='privacy' ? <PrivacyPolicy/>
                    : modal==='terms' ? <TermsOfService/>
                    : <AboutContent titleColor={titleColor} mutedColor={mutedColor}/>}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Article modal ─────────────────────────────────── */}
        <AnimatePresence>
          {activeArticle && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{
                position:'fixed', inset:0, zIndex:50, display:'flex',
                alignItems:'center', justifyContent:'center', padding:20,
                background:'rgba(0,0,0,0.55)', backdropFilter:'blur(10px)',
              }}
              onClick={() => setActiveArticle(null)}>
              <motion.div initial={{ scale:0.94, y:24 }} animate={{ scale:1, y:0 }} exit={{ scale:0.94, y:24 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background:surfaceBg, borderRadius:28, maxWidth:600, width:'100%',
                  maxHeight:'90vh', overflowY:'auto',
                  boxShadow:'0 32px 96px rgba(0,0,0,0.32)',
                }}>
                <div style={{ height:5, borderRadius:'28px 28px 0 0',
                               background:'linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)'}}/>
                <div style={{ padding:'24px 28px', borderBottom:`1px solid ${borderColor}` }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                        <Pill color="#6366f1" bg="#eef2ff">{activeArticle.category}</Pill>
                        <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:mutedColor }}>
                          <Clock size={11}/> {activeArticle.readTime} 읽기
                        </span>
                      </div>
                      <h2 style={{ fontSize:22, fontWeight:800, color:titleColor, lineHeight:1.45, marginBottom:10 }}>
                        {activeArticle.title}
                      </h2>
                      <p style={{ fontSize:14, color:mutedColor, lineHeight:1.8 }}>
                        {activeArticle.summary}
                      </p>
                    </div>
                    <button onClick={() => setActiveArticle(null)}
                      style={{
                        width:36, height:36, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center',
                        background:isDark?'#2c2c2e':'#f2f2f7', color:mutedColor, flexShrink:0,
                      }}>
                      <X size={16}/>
                    </button>
                  </div>
                </div>
                <div style={{ padding:'28px', display:'flex', flexDirection:'column', gap:18 }}>
                  {activeArticle.content.map((p, i) => (
                    <p key={i} style={{ fontSize:14, color:bodyColor, lineHeight:1.9 }}>{p}</p>
                  ))}
                  <div style={{ paddingTop:20, borderTop:`1px solid ${borderColor}`, display:'flex', flexWrap:'wrap', gap:8 }}>
                    {activeArticle.tags.map((tag) => (
                      <span key={tag} style={{
                        display:'flex', alignItems:'center', gap:5, fontSize:12,
                        padding:'5px 13px', borderRadius:99,
                        background:isDark?'#2c2c2e':'#f2f2f7', color:mutedColor,
                      }}>
                        <Tag size={10}/> {tag}
                      </span>
                    ))}
                  </div>
                  <p style={{
                    fontSize:12, padding:'14px 18px', borderRadius:16, lineHeight:1.75,
                    background:isDark?'rgba(255,149,0,0.08)':'#fff8ee',
                    color:isDark?'#ff9500':'#92400e',
                    border:`1px solid ${isDark?'rgba(255,149,0,0.15)':'#fde68a'}`,
                  }}>
                    ⚠️ 본 가이드는 참고용이며, 중요한 재무·법률 결정 전에는 전문가 상담을 권장합니다.
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

/* ── Sub-components ──────────────────────────────────────── */
function SectionTitle({ emoji, title, sub, titleColor, mutedColor }: {
  emoji:string; title:string; sub:string; titleColor:string; mutedColor:string;
}) {
  return (
    <div style={{ marginBottom:40 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
        <span style={{ fontSize:28 }}>{emoji}</span>
        <h2 style={{ fontSize:26, fontWeight:800, color:titleColor, letterSpacing:'-0.025em' }}>{title}</h2>
      </div>
      <p style={{ fontSize:14, color:mutedColor, lineHeight:1.7, paddingLeft:40 }}>{sub}</p>
    </div>
  );
}

function AboutContent({ titleColor, mutedColor }: { titleColor:string; mutedColor:string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {[
        { emoji:'💡', t:'서비스 소개', d:'별의별 계산기는 대한민국 직장인과 투자자들이 자주 마주치는 복잡한 금융·생활 계산을 쉽고 정확하게 해결할 수 있도록 만들어진 무료 계산기 서비스입니다.' },
        { emoji:'⚠️', t:'면책 고지',   d:'본 서비스의 계산 결과는 참고용이며, 실제 금융 상품이나 법률과 차이가 있을 수 있습니다. 중요한 재무적 결정 전에는 전문가(금융 상담사, 세무사, 노무사 등)와 상담하시기 바랍니다.' },
      ].map((s) => (
        <div key={s.t} style={{ padding:'18px 20px', borderRadius:16, background:'rgba(99,102,241,0.05)', border:'1px solid rgba(99,102,241,0.1)' }}>
          <h3 style={{ fontWeight:800, marginBottom:10, color:titleColor, fontSize:15, display:'flex', alignItems:'center', gap:8 }}>
            {s.emoji} {s.t}
          </h3>
          <p style={{ fontSize:13, color:mutedColor, lineHeight:1.85 }}>{s.d}</p>
        </div>
      ))}
      <div style={{ padding:'18px 20px', borderRadius:16, background:'rgba(99,102,241,0.05)', border:'1px solid rgba(99,102,241,0.1)' }}>
        <h3 style={{ fontWeight:800, marginBottom:10, color:titleColor, fontSize:15, display:'flex', alignItems:'center', gap:8 }}>
          📬 문의
        </h3>
        <p style={{ fontSize:13, color:mutedColor, lineHeight:1.85 }}>이메일로 연락주세요.{' '}
          <a href="mailto:mirririnside1024@gmail.com" style={{ fontWeight:700, color:'#6366f1', textDecoration:'none' }}>
            mirririnside1024@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
