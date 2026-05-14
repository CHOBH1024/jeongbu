import { useState, useMemo } from 'react';
import { Card, Input } from '../ui/Base';
import { calculateFV, formatCurrency } from '../../utils/finance';
import { TrendingUp, Skull, Coffee } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const FireSimulator = () => {
  const [data, setData] = useState({
    currentAssets: 100000000,
    monthlySavings: 2000000,
    monthlyExpense: 3000000,
    roi: 7,
    inflation: 3,
    currentAge: 35
  });

  const timeline = useMemo(() => {
    const results = [];
    let assets = data.currentAssets;
    const realRoi = (1 + data.roi / 100) / (1 + data.inflation / 100) - 1;
    const monthlyRealRoi = realRoi / 12;
    const netMonthly = data.monthlySavings - data.monthlyExpense;

    for (let month = 0; month <= 600; month++) { // 50 years
      if (month % 12 === 0) {
        results.push({
          age: data.currentAge + month / 12,
          assets: Math.max(0, assets),
          isZero: assets <= 0
        });
      }
      assets = assets * (1 + monthlyRealRoi) + netMonthly;
    }
    return results;
  }, [data]);

  const zeroAge = timeline.find(d => d.assets <= 0)?.age;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card title="현재 재무 상태" description="당신의 현재 자산과 소비 습관을 입력하세요.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="현재 자산 (원)" 
              type="number" 
              value={data.currentAssets} 
              onChange={(e) => setData({...data, currentAssets: Number(e.target.value)})} 
            />
            <Input 
              label="월 저축액 (원)" 
              type="number" 
              value={data.monthlySavings} 
              onChange={(e) => setData({...data, monthlySavings: Number(e.target.value)})} 
            />
            <Input 
              label="월 생활비 (원)" 
              type="number" 
              value={data.monthlyExpense} 
              onChange={(e) => setData({...data, monthlyExpense: Number(e.target.value)})} 
            />
            <Input 
              label="목표 수익률 (%)" 
              type="number" 
              value={data.roi} 
              onChange={(e) => setData({...data, roi: Number(e.target.value)})} 
            />
          </div>
        </Card>

        {zeroAge && (
          <Card className="bg-danger/10 border-danger/20">
            <div className="flex gap-4 items-start">
              <Skull className="text-danger shrink-0" size={32} />
              <div>
                <h4 className="font-bold text-danger">자산 고갈 경고!</h4>
                <p className="text-sm text-danger/80">
                  지금처럼 소비하시면 당신의 자산은 <span className="font-bold">{zeroAge}세</span>에 정확히 0원이 됩니다. <br />
                  노후 준비가 시급합니다!
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card title="자산 성장 시뮬레이션">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="age" label={{ value: '나이', position: 'insideBottomRight', offset: -5 }} />
                <YAxis hide />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="assets" 
                  stroke="var(--primary)" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 8 }}
                />
                {zeroAge && <ReferenceLine x={zeroAge} stroke="var(--danger)" strokeDasharray="3 3" label="0원 시점" />}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-full text-secondary">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs text-muted">인플레이션을 반영한 실질 수익률</p>
              <p className="font-bold">{((1 + data.roi / 100) / (1 + data.inflation / 100) - 1).toFixed(2)}%</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-full text-warning">
              <Coffee size={24} />
            </div>
            <div>
              <p className="text-xs text-muted">하루 커피 한 잔(5천원) 아끼면 은퇴 시점 자산</p>
              <p className="font-bold text-primary">+{formatCurrency(calculateFV(0, data.roi, (65 - data.currentAge) * 12, 150000))}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
