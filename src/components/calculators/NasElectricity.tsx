import { useState, useMemo } from 'react';
import { Card, Input } from '../ui/Base';
import { formatCurrency } from '../../utils/finance';
import { Zap, HardDrive, AlertTriangle } from 'lucide-react';

export const NasElectricity = () => {
  const [data, setData] = useState({
    watts: 30, // Average NAS consumption
    homeBaseUsage: 300, // Monthly base usage in kWh
    kwhPrice: 120, // Simplified base price
  });

  const results = useMemo(() => {
    const monthlyKwh = (data.watts * 24 * 30) / 1000;
    const totalKwh = data.homeBaseUsage + monthlyKwh;
    
    // Simplified Korean Progressive Electricity Tax (Residential)
    // 1st: 0-200kWh (120 won), 2nd: 201-400kWh (214 won), 3rd: 401+ (307 won)
    const calculateCost = (kwh: number) => {
      let cost = 0;
      if (kwh <= 200) cost = kwh * 120;
      else if (kwh <= 400) cost = 200 * 120 + (kwh - 200) * 214;
      else cost = 200 * 120 + 200 * 214 + (kwh - 400) * 307;
      return cost;
    };

    const baseCost = calculateCost(data.homeBaseUsage);
    const totalCost = calculateCost(totalKwh);
    const nasImpact = totalCost - baseCost;

    return { monthlyKwh, totalKwh, nasImpact, totalCost };
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card title="기기 및 전력 정보" description="NAS나 홈 서버의 전력 소모량을 입력하세요.">
          <div className="space-y-4">
            <Input label="기기 소비 전력 (W)" type="number" value={data.watts} onChange={(e) => setData({...data, watts: Number(e.target.value)})} />
            <Input label="우리집 월평균 전력 사용량 (kWh)" type="number" value={data.homeBaseUsage} onChange={(e) => setData({...data, homeBaseUsage: Number(e.target.value)})} />
            <p className="text-[10px] text-muted px-1">* 일반적인 2베이 NAS는 20~40W 정도를 소모합니다.</p>
          </div>
        </Card>

        {results.totalKwh > 400 && (
          <Card className="bg-warning/10 border-warning/20">
            <div className="flex gap-3 text-warning">
              <AlertTriangle className="shrink-0" />
              <p className="text-sm font-medium">누진세 3단계 진입! 전력 요금이 폭등하는 구간입니다.</p>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card className="text-center py-6 bg-primary/5">
          <Zap className="mx-auto text-primary mb-4" size={48} />
          <p className="text-sm text-muted">NAS 한 달 유지를 위한 '진짜' 추가 비용</p>
          <h3 className="text-4xl font-extrabold text-primary">{formatCurrency(results.nasImpact)}</h3>
          <p className="text-xs text-muted mt-2">
            월간 소모 전력: {results.monthlyKwh.toFixed(1)} kWh
          </p>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Card className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <HardDrive className="text-muted" size={20} />
              <span className="text-sm">클라우드 2TB 월 구독료</span>
            </div>
            <span className="font-bold">약 11,900원</span>
          </Card>
          <p className="text-[10px] text-center text-muted">
            전기세가 1만원을 넘는다면 구글 원/드라이브가 더 경제적일 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};
