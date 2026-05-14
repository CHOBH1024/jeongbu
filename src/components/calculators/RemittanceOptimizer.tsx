import { useState, useMemo } from 'react';
import { Card, Input, Button } from '../ui/Base';
import { formatCurrency } from '../../utils/finance';
import { RefreshCcw, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PROVIDERS = [
  { id: 'toss', name: '토스뱅크', fee: 0, rateAdjust: -1.2, best: false },
  { id: 'kakao', name: '카카오페이', fee: 5000, rateAdjust: -0.5, best: false },
  { id: 'wire', name: '와이어바알리', fee: 0, rateAdjust: 0, best: true }, // Optimized route
  { id: 'bank', name: '일반 은행(모바일)', fee: 10000, rateAdjust: -2.5, best: false },
];

export const RemittanceOptimizer = () => {
  const [amount, setAmount] = useState(1000000); // 1,000,000 KRW
  const [baseRate] = useState(9.15); // KRW to JPY (100 JPY = 915 KRW simplified)

  const results = useMemo(() => {
    return PROVIDERS.map(p => {
      const actualRate = baseRate + p.rateAdjust / 100;
      const receiveAmount = (amount - p.fee) / (actualRate * 10); // Simplified calculation
      return { ...p, receiveAmount };
    }).sort((a, b) => b.receiveAmount - a.receiveAmount);
  }, [amount, baseRate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card title="송금 정보" description="보내실 금액과 현재 환율을 확인하세요.">
          <div className="space-y-4">
            <Input 
              label="보내는 금액 (KRW)" 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))} 
            />
            <div className="p-4 bg-black/5 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">현재 환율 (매매기준율)</p>
                <p className="text-xl font-bold">100 JPY = {baseRate * 100} KRW</p>
              </div>
              <Button variant="ghost" className="p-2"><RefreshCcw size={18} /></Button>
            </div>
          </div>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <div className="flex gap-3">
            <AlertCircle className="text-primary shrink-0" />
            <p className="text-sm text-primary/80">
              한-일 송금의 경우, 중개 은행 수수료가 없는 <strong>라우팅 경로</strong>를 선택하는 것이 가장 유리합니다. 본 시뮬레이션은 실제 플랫폼별 평균 수수료를 반영합니다.
            </p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold px-2">최종 수취 금액 비교</h3>
        {results.map((res, idx) => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={`relative overflow-hidden ${idx === 0 ? 'border-secondary bg-secondary/5' : ''}`}>
              {idx === 0 && (
                <div className="absolute top-0 right-0 bg-secondary text-white text-[10px] px-3 py-1 rounded-bl-lg font-bold">
                  BEST OPTION
                </div>
              )}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-secondary text-white' : 'bg-black/5'}`}>
                    <Send size={20} />
                  </div>
                  <div>
                    <p className="font-bold">{res.name}</p>
                    <p className="text-xs text-muted">수수료: {formatCurrency(res.fee)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold">{Math.floor(res.receiveAmount).toLocaleString()} JPY</p>
                  {idx === 0 ? (
                    <p className="text-[10px] text-secondary font-bold flex items-center justify-end gap-1">
                      <CheckCircle2 size={12} /> 가장 많이 받아요!
                    </p>
                  ) : (
                    <p className="text-[10px] text-danger">
                      -{Math.floor(results[0].receiveAmount - res.receiveAmount).toLocaleString()} JPY 차이
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        
        <Button className="w-full mt-4 bg-secondary shadow-lg hover:bg-secondary/90">
          지금 바로 송금하기
        </Button>
      </div>
    </div>
  );
};
