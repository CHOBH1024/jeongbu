import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Server, Cloud, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CLOUD_PRESETS = [
  { name: 'AWS t3.medium (2vCPU/4GB)', monthly: 35000 },
  { name: 'AWS c5.xlarge (4vCPU/8GB)', monthly: 120000 },
  { name: 'AWS m5.2xlarge (8vCPU/32GB)', monthly: 360000 },
  { name: 'GCP e2-standard-4 (4vCPU/16GB)', monthly: 110000 },
  { name: 'Azure D4s v3 (4vCPU/16GB)', monthly: 130000 },
  { name: '직접 입력', monthly: 0 },
];

const SERVER_PRESETS = [
  { name: '중고 i5 서버 (개인)', price: 500000, watt: 80, maintain: 10000 },
  { name: '중고 Xeon 워크스테이션', price: 1200000, watt: 200, maintain: 20000 },
  { name: '새 NAS + 업그레이드', price: 800000, watt: 30, maintain: 5000 },
  { name: '1U 랙 서버 (Dell/HP)', price: 3000000, watt: 300, maintain: 30000 },
  { name: '직접 입력', price: 0, watt: 0, maintain: 0 },
];

function fmt(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return Math.round(n).toLocaleString('ko-KR');
}

export function ServerTco() {
  const [cloudIdx, setCloudIdx] = useState(1);
  const [serverIdx, setServerIdx] = useState(1);
  const [cloudMonthly, setCloudMonthly] = useState(120000);
  const [serverPrice, setServerPrice] = useState(1200000);
  const [serverWatt, setServerWatt] = useState(200);
  const [serverMaintain, setServerMaintain] = useState(20000);
  const [elecRate, setElecRate] = useState(120);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const cloud = cloudIdx === CLOUD_PRESETS.length - 1 ? cloudMonthly : CLOUD_PRESETS[cloudIdx].monthly;
    const price = serverIdx === SERVER_PRESETS.length - 1 ? serverPrice : SERVER_PRESETS[serverIdx].price;
    const watt = serverIdx === SERVER_PRESETS.length - 1 ? serverWatt : SERVER_PRESETS[serverIdx].watt;
    const maintain = serverIdx === SERVER_PRESETS.length - 1 ? serverMaintain : SERVER_PRESETS[serverIdx].maintain;

    const elecPerMonth = (watt / 1000) * 24 * 30 * elecRate;
    const serverMonthly = maintain + elecPerMonth;

    const bepMonths = serverMonthly < cloud
      ? price / (cloud - serverMonthly)
      : Infinity;

    const data = Array.from({ length: years * 12 }, (_, i) => {
      const mo = i + 1;
      return {
        month: mo % 12 === 0 ? `${mo / 12}년` : mo === 1 ? '1개월' : '',
        mo,
        클라우드: Math.round(cloud * mo),
        자체서버: Math.round(price + serverMonthly * mo),
      };
    }).filter((d) => d.month !== '');

    return { cloud, price, serverPrice: price, elecPerMonth, serverMonthly, bepMonths, data };
  }, [cloudIdx, serverIdx, cloudMonthly, serverPrice, serverWatt, serverMaintain, elecRate, years]);

  return (
    <div className="space-y-6">
      <Card title="비교 조건 설정" icon={<Server size={18} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
          {/* Cloud */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Cloud size={16} className="text-primary" /> 클라우드 서버
            </h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted">클라우드 인스턴스</label>
              <select
                value={cloudIdx}
                onChange={(e) => {
                  const i = Number(e.target.value);
                  setCloudIdx(i);
                  if (i < CLOUD_PRESETS.length - 1) setCloudMonthly(CLOUD_PRESETS[i].monthly);
                }}
                className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary rounded-xl text-sm"
              >
                {CLOUD_PRESETS.map((p, i) => (
                  <option key={p.name} value={i}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted">월 요금 (원)</label>
              <input
                type="number"
                min={0}
                step={10000}
                value={cloudIdx === CLOUD_PRESETS.length - 1 ? cloudMonthly : CLOUD_PRESETS[cloudIdx].monthly}
                disabled={cloudIdx !== CLOUD_PRESETS.length - 1}
                onChange={(e) => setCloudMonthly(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary rounded-xl text-sm disabled:opacity-50"
              />
            </div>
          </div>

          {/* Server */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Server size={16} className="text-warning" /> 자체 물리 서버
            </h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted">서버 유형</label>
              <select
                value={serverIdx}
                onChange={(e) => {
                  const i = Number(e.target.value);
                  setServerIdx(i);
                  if (i < SERVER_PRESETS.length - 1) {
                    const p = SERVER_PRESETS[i];
                    setServerPrice(p.price);
                    setServerWatt(p.watt);
                    setServerMaintain(p.maintain);
                  }
                }}
                className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary rounded-xl text-sm"
              >
                {SERVER_PRESETS.map((p, i) => (
                  <option key={p.name} value={i}>{p.name}</option>
                ))}
              </select>
            </div>
            {[
              { label: '구매 가격 (원)', val: serverPrice, set: setServerPrice, step: 100000 },
              { label: '소비 전력 (W)', val: serverWatt, set: setServerWatt, step: 10 },
              { label: '월 유지비 (원)', val: serverMaintain, set: setServerMaintain, step: 5000 },
            ].map((f) => (
              <div key={f.label} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted">{f.label}</label>
                <input
                  type="number"
                  min={0}
                  step={f.step}
                  value={f.val}
                  disabled={serverIdx !== SERVER_PRESETS.length - 1}
                  onChange={(e) => f.set(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary rounded-xl text-sm disabled:opacity-50"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-muted px-1">전기요금 (원/kWh)</label>
            <input type="number" min={50} max={300} step={10} value={elecRate} onChange={(e) => setElecRate(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary rounded-xl text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-muted px-1">비교 기간 (년)</label>
            <input type="number" min={1} max={10} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary rounded-xl text-sm"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="클라우드 월 비용" value={`${fmt(result.cloud)}원`} sub={`${years}년: ${fmt(result.cloud * 12 * years)}원`} color="var(--color-primary)" icon={<Cloud size={18} />} />
        <StatCard label="서버 월 운영비" value={`${fmt(result.serverMonthly)}원`} sub={`전기 ${fmt(result.elecPerMonth)}원 포함`} color="var(--color-warning)" icon={<Server size={18} />} />
        <StatCard
          label="손익분기점"
          value={result.bepMonths === Infinity ? '서버가 불리' : `${result.bepMonths.toFixed(1)}개월`}
          sub={result.bepMonths === Infinity ? '클라우드 권장' : `약 ${Math.ceil(result.bepMonths / 12)}년 후 이득`}
          color={result.bepMonths === Infinity ? 'var(--color-danger)' : 'var(--color-secondary)'}
          icon={<Server size={18} />}
        />
        <StatCard
          label={`${years}년 절감액`}
          value={result.bepMonths === Infinity ? '절감 없음' : `${fmt(Math.max(0, result.cloud * 12 * years - (result.serverPrice + result.serverMonthly * 12 * years)))}원`}
          sub="서버 구매 시 절감"
          color="var(--color-secondary)"
          icon={<Server size={18} />}
        />
      </div>

      <Card title="누적 비용 비교 (TCO)" icon={<Server size={18} />}>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 11 }} width={55} />
              <Tooltip formatter={(v) => [`${fmt(Number(v))}원`]} labelStyle={{ fontWeight: 700 }} />
              <Legend />
              <Line type="monotone" dataKey="클라우드" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="자체서버" stroke="var(--color-warning)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-start gap-2 text-xs text-muted">
          <Info size={14} className="flex-shrink-0 mt-0.5 text-primary" />
          <p>클라우드는 장애 복구, SLA, 확장성이 포함됩니다. 자체 서버는 관리 인력 비용, 장애 대응 시간 등 숨겨진 비용이 있습니다. 보안·컴플라이언스 요건도 고려하세요.</p>
        </div>
      </Card>
    </div>
  );
}
