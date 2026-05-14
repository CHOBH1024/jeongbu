import { useState, useMemo } from 'react';
import { Card, Input } from '../ui/Base';
import { calculateKoreanTax, formatCurrency } from '../../utils/finance';
import { CreditCard, HeartPulse, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const NJobCalculator = () => {
  const [income, setIncome] = useState({
    mainSalary: 50000000,
    sideIncome: 12000000,
    platformFee: 10, // %
  });

  const results = useMemo(() => {
    const platformFeeAmount = income.sideIncome * (income.platformFee / 100);
    const sideIncomeAfterFee = income.sideIncome - platformFeeAmount;
    
    // 3.3% withholding tax for freelancers
    const withholdingTax = sideIncomeAfterFee * 0.033;
    
    // Health Insurance impact (Simplified: 7.09% for income exceeding 20m or as additional regional premium)
    // Here we estimate additional insurance if side income is significant
    const healthInsuranceIncrease = sideIncomeAfterFee > 0 ? sideIncomeAfterFee * 0.0709 : 0;
    
    const totalIncome = income.mainSalary + sideIncomeAfterFee;
    const estimatedYearlyTax = calculateKoreanTax(totalIncome);
    

    return {
      platformFeeAmount,
      withholdingTax,
      healthInsuranceIncrease,
      totalIncome,
      estimatedYearlyTax,
      realTakeHome: sideIncomeAfterFee - withholdingTax - healthInsuranceIncrease
    };
  }, [income]);

  const chartData = [
    { name: '원래 수익', value: income.sideIncome },
    { name: '수수료 제외', value: income.sideIncome - results.platformFeeAmount },
    { name: '세금/건보 제외', value: results.realTakeHome },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card title="소득 정보 입력" description="직장 연봉과 N잡 수익을 입력하세요.">
          <div className="space-y-4">
            <Input 
              label="기본 직장 연봉 (세전/원)" 
              type="number" 
              value={income.mainSalary} 
              onChange={(e) => setIncome({...income, mainSalary: Number(e.target.value)})} 
            />
            <Input 
              label="N잡/프리랜서 연 예상 수익 (원)" 
              type="number" 
              value={income.sideIncome} 
              onChange={(e) => setIncome({...income, sideIncome: Number(e.target.value)})} 
            />
            <Input 
              label="플랫폼 수수료 (%)" 
              type="number" 
              value={income.platformFee} 
              onChange={(e) => setIncome({...income, platformFee: Number(e.target.value)})} 
            />
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 flex flex-col items-center text-center">
            <CreditCard className="text-primary mb-2" size={24} />
            <p className="text-xs text-muted">3.3% 원천징수</p>
            <p className="font-bold">{formatCurrency(results.withholdingTax)}</p>
          </Card>
          <Card className="p-4 flex flex-col items-center text-center border-warning/30 bg-warning/5">
            <HeartPulse className="text-warning mb-2" size={24} />
            <p className="text-xs text-muted">건보료 예상 상승</p>
            <p className="font-bold text-warning">{formatCurrency(results.healthInsuranceIncrease)}</p>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <Card title="내 통장에 꽂히는 '진짜' 금액" className="bg-primary text-white shadow-glow">
          <div className="text-center py-6">
            <Wallet className="mx-auto mb-4" size={48} />
            <div className="text-4xl font-extrabold mb-2">
              {formatCurrency(results.realTakeHome)}
            </div>
            <p className="text-white/80">
              각종 떼일 거 다 떼고 남는 연 순수익입니다.
            </p>
          </div>
        </Card>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" />
              <YAxis hide />
              <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 2 ? 'var(--primary)' : 'var(--text-muted)'} opacity={0.6 + index * 0.2} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
