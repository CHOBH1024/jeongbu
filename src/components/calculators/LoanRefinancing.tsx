import { useState, useMemo } from 'react';
import { Card, Input, Button } from '../ui/Base';
import { calculatePMT, formatCurrency } from '../../utils/finance';
import { TrendingDown, ArrowRight, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const LoanRefinancing = () => {
  const [current, setCurrent] = useState({ principal: 200000000, rate: 5.5, years: 30 });
  const [target, setTarget] = useState({ principal: 200000000, rate: 3.2, years: 30 });

  const currentResults = useMemo(() => {
    const monthlyRate = current.rate / 100 / 12;
    const nper = current.years * 12;
    const pmt = calculatePMT(monthlyRate, nper, current.principal);
    const total = pmt * nper;
    return { pmt, total, interest: total - current.principal };
  }, [current]);

  const targetResults = useMemo(() => {
    const monthlyRate = target.rate / 100 / 12;
    const nper = target.years * 12;
    const pmt = calculatePMT(monthlyRate, nper, target.principal);
    const total = pmt * nper;
    return { pmt, total, interest: total - target.principal };
  }, [target]);

  const savings = currentResults.total - targetResults.total;

  const chartData = [
    { name: '절감된 이자', value: Math.max(0, savings), color: 'var(--primary)' },
    { name: '새로운 총 납입액', value: targetResults.total, color: 'var(--secondary)' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card title="현재 대출 정보" description="보유 중인 대출의 상세 내역을 입력하세요.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="잔액 (원)" 
              type="number" 
              value={current.principal} 
              onChange={(e) => setCurrent({...current, principal: Number(e.target.value)})} 
            />
            <Input 
              label="금리 (%)" 
              type="number" 
              value={current.rate} 
              step="0.1"
              onChange={(e) => setCurrent({...current, rate: Number(e.target.value)})} 
            />
            <Input 
              label="남은 기간 (년)" 
              type="number" 
              value={current.years} 
              onChange={(e) => setCurrent({...current, years: Number(e.target.value)})} 
            />
          </div>
        </Card>

        <div className="flex justify-center -my-4 relative z-10">
          <div className="bg-primary text-white p-3 rounded-full shadow-lg">
            <ArrowRight size={24} />
          </div>
        </div>

        <Card title="새로운 대출 정보" description="갈아탈 대출(예: 신생아 특례)의 정보를 입력하세요.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="대출 원금 (원)" 
              type="number" 
              value={target.principal} 
              onChange={(e) => setTarget({...target, principal: Number(e.target.value)})} 
            />
            <Input 
              label="금리 (%)" 
              type="number" 
              value={target.rate} 
              step="0.1"
              onChange={(e) => setTarget({...target, rate: Number(e.target.value)})} 
            />
            <Input 
              label="기간 (년)" 
              type="number" 
              value={target.years} 
              onChange={(e) => setTarget({...target, years: Number(e.target.value)})} 
            />
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <div className="text-center py-8">
            <TrendingDown className="mx-auto text-primary mb-4" size={48} />
            <h3 className="text-2xl font-bold mb-2">총 이자 절감액</h3>
            <div className="text-4xl font-extrabold text-primary mb-4">
              {formatCurrency(savings)}
            </div>
            <p className="text-muted">
              매달 {formatCurrency(currentResults.pmt - targetResults.pmt)} 만큼 <br />
              지갑을 더 지킬 수 있습니다! 🚀
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center p-4">
            <p className="text-xs text-muted mb-1">현재 월 납입금</p>
            <p className="font-bold">{formatCurrency(currentResults.pmt)}</p>
          </Card>
          <Card className="text-center p-4">
            <p className="text-xs text-muted mb-1">변경 월 납입금</p>
            <p className="font-bold text-secondary">{formatCurrency(targetResults.pmt)}</p>
          </Card>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <Button className="w-full flex items-center justify-center gap-2">
          <Zap size={20} /> 상세 상환 스케줄 보기
        </Button>
      </div>
    </div>
  );
};
