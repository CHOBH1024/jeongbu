import { useState, useMemo } from 'react';
import { Card, Input, Button } from '../ui/Base';
import { formatCurrency } from '../../utils/finance';
import { Car, AlertTriangle, Skull, Timer } from 'lucide-react';

export const CarPoorTimer = () => {
  const [data, setData] = useState({
    salary: 3000000, // Monthly net income
    carPrice: 50000000, // Car price (e.g., GV70 or BMW 3 series)
    installment: 60, // Months
    interest: 6.5, // %
    insurance: 1500000, // Yearly
    fuel: 300000, // Monthly
  });

  const results = useMemo(() => {
    const monthlyRate = data.interest / 100 / 12;
    const monthlyInstallment = (data.carPrice * monthlyRate * Math.pow(1 + monthlyRate, data.installment)) / (Math.pow(1 + monthlyRate, data.installment) - 1);
    
    const monthlyInsurance = data.insurance / 12;
    const totalMonthlyCost = monthlyInstallment + monthlyInsurance + data.fuel + 100000; // +100k for maintenance
    
    const disposableIncome = data.salary - totalMonthlyCost;
    const survivalMonths = disposableIncome > 0 ? '안전' : Math.abs(Math.floor(10000000 / disposableIncome)); // Assuming 10m buffer

    return {
      monthlyInstallment,
      totalMonthlyCost,
      costRatio: (totalMonthlyCost / data.salary) * 100,
      disposableIncome,
      survivalMonths
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card title="차량 및 소득 정보" description="내 월급으로 이 차를 유지할 수 있을까?">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="월 실수령액 (원)" type="number" value={data.salary} onChange={(e) => setData({...data, salary: Number(e.target.value)})} />
            <Input label="차량 가격 (원)" type="number" value={data.carPrice} onChange={(e) => setData({...data, carPrice: Number(e.target.value)})} />
            <Input label="할부 기간 (개월)" type="number" value={data.installment} onChange={(e) => setData({...data, installment: Number(e.target.value)})} />
            <Input label="할부 금리 (%)" type="number" value={data.interest} onChange={(e) => setData({...data, interest: Number(e.target.value)})} />
          </div>
        </Card>

        <Card className="bg-danger/5 border-danger/20">
          <div className="flex gap-4">
            <AlertTriangle className="text-danger shrink-0" size={32} />
            <div>
              <h4 className="font-bold text-danger">카푸어 지수: {results.costRatio.toFixed(1)}%</h4>
              <p className="text-sm text-danger/80">
                {results.costRatio > 50 ? '심각한 카푸어 상태입니다. 숨만 쉬어도 적자입니다.' : 
                 results.costRatio > 30 ? '위험 수준입니다. 저축이 불가능해집니다.' : '안정적인 유지 가능 범위입니다.'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="text-center py-8">
          <Car className={`mx-auto mb-4 ${results.costRatio > 50 ? 'text-danger' : 'text-primary'}`} size={64} />
          <p className="text-muted mb-1">매달 자동차에 바치는 돈</p>
          <h3 className="text-4xl font-extrabold text-primary">{formatCurrency(results.totalMonthlyCost)}</h3>
          <p className="text-sm text-muted mt-2">
            남는 돈: {formatCurrency(results.disposableIncome)}
          </p>
        </Card>

        {results.disposableIncome < 0 && (
          <Card className="bg-dark text-white border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Timer size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-danger">
                <Skull size={20} />
                <span className="font-bold uppercase tracking-widest">Bankruptcy Timer</span>
              </div>
              <h4 className="text-2xl font-bold">파산까지 약 {results.survivalMonths}개월</h4>
              <p className="text-white/60 text-sm mt-2">
                비상금 1,000만원이 바닥나는 시점입니다. <br />
                지금 당장 중고차 매물을 알아보세요.
              </p>
            </div>
          </Card>
        )}

        <Button variant="outline" className="w-full">친구에게 공유해서 뼈 때리기 🦴</Button>
      </div>
    </div>
  );
};
