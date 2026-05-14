import { useState, useMemo } from 'react';
import { Card, Input } from '../ui/Base';
import { formatCurrency } from '../../utils/finance';
import { PiggyBank, Calendar, TrendingUp } from 'lucide-react';

export const ParkingAccount = () => {
  const [data, setData] = useState({
    balance: 50000000,
    rate: 3.5, // Yearly %
    days: 30
  });

  const results = useMemo(() => {
    const dailyRate = data.rate / 100 / 365;
    const dailyInterest = data.balance * dailyRate;
    const totalInterest = dailyInterest * data.days;
    const tax = totalInterest * 0.154; // Standard interest tax in Korea

    return { dailyInterest, totalInterest, tax, net: totalInterest - tax };
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card title="예치 정보" description="파킹통장에 넣어둘 금액과 금리를 입력하세요.">
          <div className="space-y-4">
            <Input label="예치 금액 (원)" type="number" value={data.balance} onChange={(e) => setData({...data, balance: Number(e.target.value)})} />
            <Input label="연 이자율 (%)" type="number" value={data.rate} step="0.1" onChange={(e) => setData({...data, rate: Number(e.target.value)})} />
            <Input label="보관 기간 (일)" type="number" value={data.days} onChange={(e) => setData({...data, days: Number(e.target.value)})} />
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="text-center py-8 bg-secondary/5 border-secondary/20 shadow-glow">
          <PiggyBank className="mx-auto text-secondary mb-4" size={56} />
          <p className="text-sm text-muted">매일 쌓이는 '진짜' 이자</p>
          <h3 className="text-4xl font-extrabold text-secondary">{formatCurrency(results.dailyInterest)}</h3>
          <p className="text-xs text-muted mt-2">
            한 달({data.days}일) 뒤 예상 이자: {formatCurrency(results.net)} (세후)
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <Calendar className="mx-auto text-primary mb-1" size={20} />
            <p className="text-[10px] text-muted">세금(15.4%)</p>
            <p className="font-bold text-danger">-{formatCurrency(results.tax)}</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="mx-auto text-primary mb-1" size={20} />
            <p className="text-[10px] text-muted">연간 환산 이자</p>
            <p className="font-bold">{formatCurrency(data.balance * (data.rate/100))}</p>
          </Card>
        </div>
        
        <p className="text-[10px] text-center text-muted">
          * 토스뱅크, 케이뱅크 등 '지금 이자 받기' 기능을 활용하면 일복리 효과가 극대화됩니다.
        </p>
      </div>
    </div>
  );
};
