import { useState, useMemo } from 'react';
import { Card, Input, Button } from '../ui/Base';
import { calculateFV, formatCurrency } from '../../utils/finance';
import { Ticket, TrendingUp, Coins } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const LottoOpportunity = () => {
  const [data, setData] = useState({
    weeklyAmount: 10000,
    years: 10,
    sp500Rate: 10, // Historical average around 10%
  });

  const timeline = useMemo(() => {
    const results = [];
    const monthlyAmount = (data.weeklyAmount * 52) / 12;
    
    for (let year = 0; year <= data.years; year++) {
      const totalSpent = data.weeklyAmount * 52 * year;
      const totalInvested = calculateFV(0, data.sp500Rate, year * 12, monthlyAmount);
      
      results.push({
        year,
        '복권 구매비': totalSpent,
        'S&P500 투자시': Math.floor(totalInvested),
      });
    }
    return results;
  }, [data]);

  const finalInvestment = timeline[timeline.length - 1]['S&P500 투자시'];
  const finalSpent = timeline[timeline.length - 1]['복권 구매비'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card title="투자 습관 설정" description="매주 복권에 쓰는 돈을 주식에 넣는다면?">
          <div className="space-y-4">
            <Input 
              label="매주 복권 구매액 (원)" 
              type="number" 
              value={data.weeklyAmount} 
              onChange={(e) => setData({...data, weeklyAmount: Number(e.target.value)})} 
            />
            <Input 
              label="투자 기간 (년)" 
              type="number" 
              value={data.years} 
              onChange={(e) => setData({...data, years: Number(e.target.value)})} 
            />
            <Input 
              label="S&P500 예상 수익률 (%)" 
              type="number" 
              value={data.sp500Rate} 
              onChange={(e) => setData({...data, sp500Rate: Number(e.target.value)})} 
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Card className="flex items-center gap-4 bg-primary/5">
            <div className="p-3 bg-primary rounded-full text-white">
              <Ticket size={24} />
            </div>
            <div>
              <p className="text-xs text-muted">로또 1등 당첨 확률</p>
              <p className="font-bold">1 / 8,145,060</p>
              <p className="text-[10px] text-muted">번벼락 맞을 확률보다 낮습니다.</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 bg-secondary/5">
            <div className="p-3 bg-secondary rounded-full text-white">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs text-muted">S&P500 장기 투자 수익률</p>
              <p className="font-bold">연 평균 ~10%</p>
              <p className="text-[10px] text-muted">지난 100년간의 역사적 기록입니다.</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <Card title="기회비용 시뮬레이션">
          <div className="text-center mb-6">
            <p className="text-sm text-muted">당신이 날린 '미래의 자산'</p>
            <h3 className="text-3xl font-extrabold text-primary">{formatCurrency(finalInvestment - finalSpent)}</h3>
            <p className="text-xs text-muted mt-1">
              {data.years}년 뒤 {formatCurrency(finalInvestment)}가 될 수 있었던 돈입니다.
            </p>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="year" unit="년" />
                <YAxis hide />
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="S&P500 투자시" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.1} strokeWidth={3} />
                <Area type="monotone" dataKey="복권 구매비" stroke="var(--text-muted)" fill="var(--text-muted)" fillOpacity={0.05} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 border-dashed border-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Coins className="text-warning" />
            <span className="text-sm font-medium">지금 당장 로또 대신 'VOO'를 사세요!</span>
          </div>
          <Button variant="outline" className="py-1 px-4 text-xs">종목 보기</Button>
        </Card>
      </div>
    </div>
  );
};
