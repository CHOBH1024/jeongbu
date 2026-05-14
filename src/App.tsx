import { useState } from 'react';
import { 
  Rocket, 
  Building2, 
  Monitor, 
  Coins, 
  Truck, 
  Wallet,
  Sparkles,
  Moon,
  Sun,
  ChevronLeft
} from 'lucide-react';
import { Card, Button } from './components/ui/Base';
import { motion, AnimatePresence } from 'framer-motion';

// Calculators
import { LoanRefinancing } from './components/calculators/LoanRefinancing';
import { FireSimulator } from './components/calculators/FireSimulator';
import { NJobCalculator } from './components/calculators/NJobCalculator';
import { LottoOpportunity } from './components/calculators/LottoOpportunity';
import { RemittanceOptimizer } from './components/calculators/RemittanceOptimizer';
import { CarPoorTimer } from './components/calculators/CarPoorTimer';
import { SeveranceCalculator } from './components/calculators/SeveranceCalculator';
import { NasElectricity } from './components/calculators/NasElectricity';
import { ParkingAccount } from './components/calculators/ParkingAccount';

const CATEGORIES = [
  { 
    id: 'viral', 
    name: '트래픽 폭발', 
    icon: <Rocket />, 
    color: 'var(--primary)', 
    calculators: [
      { id: 'loan', name: '대출 이자 및 대환 시뮬레이터', component: <LoanRefinancing /> },
      { id: 'fire', name: '생존 자금(은퇴/파이어) 시뮬레이터', component: <FireSimulator /> },
      { id: 'njob', name: 'N잡/프리랜서 실소득 계산기', component: <NJobCalculator /> },
      { id: 'lotto', name: '로또 vs S&P500 기회비용', component: <LottoOpportunity /> },
      { id: 'remit', name: '해외송금 환율 최적화', component: <RemittanceOptimizer /> },
    ] 
  },
  { 
    id: 'b2b', 
    name: 'B2B/인사 행정', 
    icon: <Building2 />, 
    color: 'var(--secondary)', 
    calculators: [
      { id: 'severance', name: '퇴직금 정밀 계산기', component: <SeveranceCalculator /> },
      { id: 'workshop', name: '워크숍 예산 산출기', status: '준비중' },
      { id: 'insurance', name: '4대보험 사업자 부담금', status: '준비중' },
    ] 
  },
  { 
    id: 'tech', 
    name: 'IT 인프라', 
    icon: <Monitor />, 
    color: '#3b82f6', 
    calculators: [
      { id: 'nas', name: 'NAS 24시간 누진세 계산기', component: <NasElectricity /> },
      { id: 'ai', name: 'Local AI vs Cloud API 가성비', status: '준비중' },
      { id: 'cloud', name: '클라우드 vs 물리 하드 손익', status: '준비중' },
    ] 
  },
  { 
    id: 'invest', 
    name: '투자/경제', 
    icon: <Coins />, 
    color: '#f59e0b', 
    calculators: [
      { id: 'parking', name: '파킹통장 일복리 쪼개기', component: <ParkingAccount /> },
      { id: 'silver', name: '은(Silver) 현물 매집 평단가', status: '준비중' },
      { id: 'drip', name: '배당주 재투자 스노우볼', status: '준비중' },
    ] 
  },
  { 
    id: 'estate', 
    name: '부동산/이사', 
    icon: <Truck />, 
    color: '#ec4899', 
    calculators: [
      { id: 'moving', name: '장거리 포장이사 견적 예측', status: '준비중' },
      { id: 'broker', name: '중개 수수료 및 등기 비용', status: '준비중' },
    ] 
  },
  { 
    id: 'daily', 
    name: '지출 통제 (뼈 때리기)', 
    icon: <Wallet />, 
    color: '#ef4444', 
    calculators: [
      { id: 'carpoor', name: '자동차 할부 vs 카푸어 파산 타이머', component: <CarPoorTimer /> },
      { id: 'sub', name: '구독료 누수 탐지기', status: '준비중' },
      { id: 'coffee', name: '커피값 노후 연금 환산기', status: '준비중' },
    ] 
  },
];

function App() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCalcId, setActiveCalcId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const selectedCategory = CATEGORIES.find(c => c.id === activeCategory);
  const selectedCalc = selectedCategory?.calculators.find(c => c.id === activeCalcId);

  const reset = () => {
    setActiveCategory(null);
    setActiveCalcId(null);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-main text-main transition-colors`}>
      <header className="sticky top-0 z-50 glass border-b border-white/10 py-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-glow animate-float">
              <Sparkles size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gradient">별의별 계산기</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted transition-colors"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <AnimatePresence mode="wait">
          {!activeCategory ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                  당신의 모든 궁금증을 <br /> 
                  <span className="text-primary">숫자로 해결해 드립니다</span>
                </h2>
                <p className="text-muted text-lg max-w-2xl mx-auto">
                  단순한 계산을 넘어, 사용자의 호기심과 미래를 시뮬레이션하는 20종 이상의 스마트 계산기 패키지.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CATEGORIES.map((cat, idx) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -8 }}
                  >
                    <Card 
                      className="h-full cursor-pointer hover:shadow-lg transition-all group"
                      title={cat.name}
                      icon={cat.icon}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <div className="flex flex-wrap gap-2 mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
                        {cat.calculators.map(calc => (
                          <span key={calc.id} className="px-3 py-1 bg-primary/5 dark:bg-white/5 rounded-full text-xs font-medium text-primary">
                            {calc.name.split(' ')[0]}
                          </span>
                        ))}
                        {cat.calculators.length === 0 && <span className="text-xs text-muted">업데이트 예정</span>}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : !activeCalcId ? (
            <motion.div 
              key="category"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" onClick={() => setActiveCategory(null)} className="p-2">
                  <ChevronLeft size={24} />
                </Button>
                <h2 className="text-3xl font-bold">{selectedCategory?.name}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCategory?.calculators.map(calc => (
                  <Card 
                    key={calc.id}
                    className={`cursor-pointer hover:bg-primary/5 transition-colors ${calc.status === '준비중' ? 'opacity-60 grayscale' : ''}`}
                    onClick={() => calc.status !== '준비중' && setActiveCalcId(calc.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">{calc.name}</span>
                      {calc.status === '준비중' ? (
                        <span className="text-xs bg-muted/20 px-2 py-1 rounded">Soon</span>
                      ) : (
                        <Rocket size={18} className="text-primary" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" onClick={() => setActiveCalcId(null)} className="p-2">
                  <ChevronLeft size={24} />
                </Button>
                <div>
                  <h2 className="text-2xl font-bold">{selectedCalc?.name}</h2>
                  <p className="text-muted text-sm">{selectedCategory?.name}</p>
                </div>
              </div>
              
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {selectedCalc?.component}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-white/10 mt-20">
        <div className="container text-center text-muted">
          <p>© 2026 별의별 계산기. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
