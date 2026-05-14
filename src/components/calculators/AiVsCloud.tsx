import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Monitor, Zap, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type GpuPreset = { name: string; price: number; watt: number; tokensPerSec: number };

const GPU_PRESETS: GpuPreset[] = [
  { name: 'RTX 4090 (24GB)', price: 2200000, watt: 450, tokensPerSec: 60 },
  { name: 'RTX 4080 (16GB)', price: 1400000, watt: 320, tokensPerSec: 40 },
  { name: 'RTX 3090 (24GB)', price: 900000, watt: 350, tokensPerSec: 35 },
  { name: 'RTX 4070 Ti (12GB)', price: 950000, watt: 285, tokensPerSec: 28 },
  { name: 'MacBook M4 Max', price: 4500000, watt: 60, tokensPerSec: 50 },
];

const API_PRESETS = [
  { name: 'Claude Haiku 4', inputPer1M: 800, outputPer1M: 4000 },
  { name: 'GPT-4o mini', inputPer1M: 150, outputPer1M: 600 },
  { name: 'GPT-4o', inputPer1M: 2500, outputPer1M: 10000 },
  { name: 'Gemini 1.5 Flash', inputPer1M: 75, outputPer1M: 300 },
  { name: 'Claude Sonnet 4', inputPer1M: 3000, outputPer1M: 15000 },
];

function fmt(n: number) {
  return Math.round(n).toLocaleString('ko-KR');
}

export function AiVsCloud() {
  const [gpuIdx, setGpuIdx] = useState(0);
  const [apiIdx, setApiIdx] = useState(0);
  const [monthlyTokens, setMonthlyTokens] = useState(10000000); // 1000만 토큰
  const [inputRatio, setInputRatio] = useState(70); // input 비율 %
  const [elecRate, setElecRate] = useState(120); // 원/kWh
  const [gpuLifeYears, setGpuLifeYears] = useState(3);
  const [usageHoursPerDay, setUsageHoursPerDay] = useState(8);
  const [exchangeRate, setExchangeRate] = useState(1350);

  const result = useMemo(() => {
    const gpu = GPU_PRESETS[gpuIdx];
    const api = API_PRESETS[apiIdx];

    // API 비용 (월)
    const inputTokens = monthlyTokens * (inputRatio / 100);
    const outputTokens = monthlyTokens * (1 - inputRatio / 100);
    const apiCostUsd = (inputTokens / 1_000_000) * api.inputPer1M + (outputTokens / 1_000_000) * api.outputPer1M;
    const apiCostKrw = apiCostUsd * exchangeRate;

    // 로컬 GPU 비용
    // 감가상각 (월)
    const depreciationMonthly = gpu.price / (gpuLifeYears * 12);
    // 전기요금 (월)
    const elecKwhPerMonth = (gpu.watt / 1000) * usageHoursPerDay * 30;
    const elecCost = elecKwhPerMonth * elecRate;
    // 총 로컬 비용
    const localMonthlyCost = depreciationMonthly + elecCost;

    // 손익분기점 (누적)
    const bepMonths = localMonthlyCost <= apiCostKrw
      ? gpu.price / (apiCostKrw - localMonthlyCost)
      : Infinity;

    // 처리 가능 토큰/월 (GPU 기준)
    const localCapacityTokensPerMonth = gpu.tokensPerSec * usageHoursPerDay * 3600 * 30;

    const chartData = Array.from({ length: 24 }, (_, i) => {
      const mo = i + 1;
      return {
        month: `${mo}개월`,
        GPU구입: Math.round(gpu.price + localMonthlyCost * mo),
        API누적: Math.round(apiCostKrw * mo),
      };
    });

    return {
      apiCostKrw,
      localMonthlyCost,
      depreciationMonthly,
      elecCost,
      bepMonths,
      localCapacityTokensPerMonth,
      chartData,
      apiCostUsd,
    };
  }, [gpuIdx, apiIdx, monthlyTokens, inputRatio, elecRate, gpuLifeYears, usageHoursPerDay, exchangeRate]);

  const cheaper = result.bepMonths !== Infinity && result.bepMonths <= gpuLifeYears * 12
    ? 'GPU'
    : result.apiCostKrw < result.localMonthlyCost
    ? 'API'
    : 'GPU (BEP 초과)';

  return (
    <div className="space-y-6">
      <Card title="비교 조건 설정" icon={<Monitor size={18} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">로컬 GPU 설정</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted px-1">GPU 모델</label>
              <select
                value={gpuIdx}
                onChange={(e) => setGpuIdx(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary rounded-xl text-sm"
              >
                {GPU_PRESETS.map((g, i) => (
                  <option key={g.name} value={i}>{g.name} ({fmt(g.price)}원)</option>
                ))}
              </select>
            </div>
            {[
              { label: '일 사용 시간 (시간)', val: usageHoursPerDay, set: setUsageHoursPerDay, min: 1, max: 24, step: 1 },
              { label: 'GPU 교체 주기 (년)', val: gpuLifeYears, set: setGpuLifeYears, min: 1, max: 10, step: 1 },
              { label: '전기요금 (원/kWh)', val: elecRate, set: setElecRate, min: 50, max: 300, step: 10 },
            ].map((f) => (
              <div key={f.label} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted px-1">{f.label}</label>
                <input type="number" min={f.min} max={f.max} step={f.step} value={f.val}
                  onChange={(e) => f.set(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary rounded-xl text-sm"
                />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Cloud API 설정</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted px-1">API 모델</label>
              <select
                value={apiIdx}
                onChange={(e) => setApiIdx(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary rounded-xl text-sm"
              >
                {API_PRESETS.map((a, i) => (
                  <option key={a.name} value={i}>{a.name}</option>
                ))}
              </select>
            </div>
            {[
              { label: '월 사용 토큰 수', val: monthlyTokens, set: setMonthlyTokens, min: 100000, max: 1000000000, step: 1000000 },
              { label: 'Input 비율 (%)', val: inputRatio, set: setInputRatio, min: 0, max: 100, step: 5 },
              { label: '환율 (원/USD)', val: exchangeRate, set: setExchangeRate, min: 1000, max: 2000, step: 10 },
            ].map((f) => (
              <div key={f.label} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted px-1">{f.label}</label>
                <input type="number" min={f.min} max={f.max} step={f.step} value={f.val}
                  onChange={(e) => f.set(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary rounded-xl text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Cloud API 월 비용" value={`${fmt(result.apiCostKrw)}원`} sub={`$${result.apiCostUsd.toFixed(2)}`} color="var(--color-warning)" icon={<Zap size={18} />} />
        <StatCard label="GPU 월 비용" value={`${fmt(result.localMonthlyCost)}원`} sub="감가상각+전기" color="var(--color-primary)" icon={<Monitor size={18} />} />
        <StatCard
          label="GPU 손익분기점"
          value={result.bepMonths === Infinity ? 'API가 유리' : `${result.bepMonths.toFixed(1)}개월`}
          sub={result.bepMonths === Infinity ? 'GPU 구입 불필요' : `약 ${Math.ceil(result.bepMonths / 12)}년`}
          color={result.bepMonths === Infinity ? 'var(--color-danger)' : 'var(--color-secondary)'}
          icon={<Zap size={18} />}
        />
        <StatCard label="GPU 월 처리 한도" value={`${(result.localCapacityTokensPerMonth / 1_000_000).toFixed(0)}M tok`} sub="로컬 최대 처리량" color="#3b82f6" icon={<Monitor size={18} />} />
      </div>

      <Card title="24개월 누적 비용 비교" icon={<Monitor size={18} />}>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.chartData.filter((_, i) => i % 2 === 1)} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} tick={{ fontSize: 11 }} width={55} />
              <Tooltip formatter={(v) => [`${fmt(Number(v))}원`]} labelStyle={{ fontWeight: 700 }} />
              <Legend />
              <Bar dataKey="GPU구입" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="API누적" fill="var(--color-warning)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-start gap-2 text-xs text-muted">
          <Info size={14} className="flex-shrink-0 mt-0.5 text-primary" />
          <p>
            현재 설정에서 <strong className="text-slate-700 dark:text-slate-300">{cheaper}</strong>가 유리합니다.
            로컬 모델 품질은 Cloud API에 비해 낮을 수 있습니다. 보안·레이턴시·유지보수 비용도 고려하세요.
          </p>
        </div>
      </Card>
    </div>
  );
}
