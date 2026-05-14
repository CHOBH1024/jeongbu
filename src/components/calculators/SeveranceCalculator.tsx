import { useState, useMemo } from 'react';
import { Card, Input } from '../ui/Base';
import { formatCurrency } from '../../utils/finance';
import { Briefcase, Calculator, Calendar } from 'lucide-react';

export const SeveranceCalculator = () => {
  const [data, setData] = useState({
    avgSalary: 4000000,
    bonus: 2000000,
    years: 5,
    months: 6
  });

  const results = useMemo(() => {
    const totalMonths = data.years * 12 + data.months;
    const avgDailyWage = (data.avgSalary + (data.bonus / 12)) / 30;
    const severance = avgDailyWage * 30 * (totalMonths / 12);
    const tax = severance * 0.05; // Very simplified tax estimate

    return { severance, tax, net: severance - tax };
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card title="재직 정보" description="퇴직금 산정을 위한 기본 정보를 입력하세요.">
          <div className="space-y-4">
            <Input label="직전 3개월 평균 월급 (원)" type="number" value={data.avgSalary} onChange={(e) => setData({...data, avgSalary: Number(e.target.value)})} />
            <Input label="연간 상여금 총액 (원)" type="number" value={data.bonus} onChange={(e) => setData({...data, bonus: Number(e.target.value)})} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="재직 년수" type="number" value={data.years} onChange={(e) => setData({...data, years: Number(e.target.value)})} />
              <Input label="재직 개월" type="number" value={data.months} onChange={(e) => setData({...data, months: Number(e.target.value)})} />
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-secondary/5 border-secondary/20">
          <div className="text-center py-6">
            <Briefcase className="mx-auto text-secondary mb-4" size={48} />
            <p className="text-sm text-muted">예상 퇴직금 (세전)</p>
            <h3 className="text-4xl font-extrabold text-secondary">{formatCurrency(results.severance)}</h3>
            <p className="text-xs text-muted mt-2">
              예상 세금: {formatCurrency(results.tax)} | <strong>실수령액: {formatCurrency(results.net)}</strong>
            </p>
          </div>
        </Card>
        
        <div className="flex gap-4">
          <Card className="flex-1 text-center p-4">
            <Calendar className="mx-auto text-primary mb-1" size={20} />
            <p className="text-[10px] text-muted">총 재직일수</p>
            <p className="font-bold">{(data.years * 365 + data.months * 30).toLocaleString()}일</p>
          </Card>
          <Card className="flex-1 text-center p-4">
            <Calculator className="mx-auto text-primary mb-1" size={20} />
            <p className="text-[10px] text-muted">평균 일급</p>
            <p className="font-bold">{formatCurrency((data.avgSalary + (data.bonus/12))/30)}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
