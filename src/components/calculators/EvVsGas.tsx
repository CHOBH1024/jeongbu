import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';

function fmt(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(2)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return Math.round(n).toLocaleString('ko-KR');
}

export function EvVsGas() {
  const [annualKm, setAnnualKm] = useState(15000);
  const [evPrice, setEvPrice] = useState(50000000);
  const [gasPrice, setGasPrice] = useState(30000000);
  const [evEfficiency, setEvEfficiency] = useState(6.5);
  const [gasEfficiency, setGasEfficiency] = useState(12);
  const [electricPrice, setElectricPrice] = useState(173);
  const [gasolinePrice, setGasolinePrice] = useState(1750);
  const [evMaintenance, setEvMaintenance] = useState(150000);
  const [gasMaintenance, setGasMaintenance] = useState(500000);

  const calc = useMemo(() => {
    const evFuelAnnual = (annualKm / evEfficiency) * electricPrice;
    const gasFuelAnnual = (annualKm / gasEfficiency) * gasolinePrice;
    const annualSaving = (gasFuelAnnual - evFuelAnnual) + (gasMaintenance - evMaintenance);
    const premium = evPrice - gasPrice;
    const breakEvenYears = annualSaving > 0 ? premium / annualSaving : Infinity;

    const tco5ev = evPrice + (evFuelAnnual + evMaintenance) * 5;
    const tco5gas = gasPrice + (gasFuelAnnual + gasMaintenance) * 5;
    const tco10ev = evPrice + (evFuelAnnual + evMaintenance) * 10;
    const tco10gas = gasPrice + (gasFuelAnnual + gasMaintenance) * 10;

    return {
      evFuelAnnual,
      gasFuelAnnual,
      annualSaving,
      premium,
      breakEvenYears,
      tco5ev, tco5gas,
      tco10ev, tco10gas,
    };
  }, [annualKm, evPrice, gasPrice, evEfficiency, gasEfficiency, electricPrice, gasolinePrice, evMaintenance, gasMaintenance]);

  const breakEvenLabel = () => {
    if (calc.premium <= 0) return '전기차가 처음부터 저렴합니다';
    if (calc.annualSaving <= 0) return '전기차가 유리하지 않습니다';
    if (calc.breakEvenYears > 20) return '손익분기점 20년 초과';
    return `약 ${calc.breakEvenYears.toFixed(1)}년`;
  };

  const fields = [
    { label: '연간 주행거리 (km)', value: annualKm, set: setAnnualKm, step: 1000, min: 1000, max: 100000 },
    { label: '전기차 구매가 (원)', value: evPrice, set: setEvPrice, step: 1000000, min: 0 },
    { label: '내연기관 구매가 (원)', value: gasPrice, set: setGasPrice, step: 1000000, min: 0 },
    { label: '전기차 연비 (km/kWh)', value: evEfficiency, set: setEvEfficiency, step: 0.1, min: 1, max: 20 },
    { label: '내연기관 연비 (km/L)', value: gasEfficiency, set: setGasEfficiency, step: 0.5, min: 1, max: 30 },
    { label: '전기 단가 (원/kWh)', value: electricPrice, set: setElectricPrice, step: 1, min: 50, max: 500 },
    { label: '휘발유 단가 (원/L)', value: gasolinePrice, set: setGasolinePrice, step: 10, min: 500, max: 5000 },
    { label: '전기차 유지보수 (원/년)', value: evMaintenance, set: setEvMaintenance, step: 10000, min: 0 },
    { label: '내연기관 유지보수 (원/년)', value: gasMaintenance, set: setGasMaintenance, step: 10000, min: 0 },
  ];

  const maxTco10 = Math.max(calc.tco10ev, calc.tco10gas);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card title="전기차 vs 내연기관 비교 계산기" icon={<span style={{ fontSize: 20 }}>⚡</span>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginTop: 8 }}>
          {fields.map((f) => (
            <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>{f.label}</label>
              <input
                type="number"
                min={f.min}
                max={f.max}
                step={f.step}
                value={f.value}
                onChange={(e) => f.set(Number(e.target.value))}
                style={{
                  width: '100%', padding: '10px 14px', background: '#f9f9fb',
                  border: '1.5px solid #e5e5ea', borderRadius: 12, fontSize: 14,
                  color: '#1d1d1f', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#fff'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5ea'; e.currentTarget.style.background = '#f9f9fb'; }}
              />
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard label="연간 전기차 연료비" value={`${fmt(calc.evFuelAnnual)}원`} sub={`${(annualKm / evEfficiency).toFixed(0)} kWh`} color="#6366f1" icon={<span>⚡</span>} />
        <StatCard label="연간 내연기관 연료비" value={`${fmt(calc.gasFuelAnnual)}원`} sub={`${(annualKm / gasEfficiency).toFixed(0)} L`} color="#f59e0b" icon={<span>⛽</span>} />
        <StatCard label="연간 절감액" value={`${fmt(calc.annualSaving)}원`} sub="연료 + 유지보수 포함" color="#10b981" icon={<span>💰</span>} />
        <StatCard label="손익분기점" value={breakEvenLabel()} sub={calc.premium > 0 ? `가격차 ${fmt(calc.premium)}원` : '초기비용 유리'} color={calc.breakEvenYears <= 10 ? '#10b981' : '#f59e0b'} icon={<span>📈</span>} />
      </div>

      <Card title="5년 / 10년 TCO 비교" icon={<span style={{ fontSize: 18 }}>📊</span>}>
        {[
          { label: '5년 TCO', ev: calc.tco5ev, gas: calc.tco5gas, max: Math.max(calc.tco5ev, calc.tco5gas) },
          { label: '10년 TCO', ev: calc.tco10ev, gas: calc.tco10gas, max: maxTco10 },
        ].map((row) => (
          <div key={row.label} style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#3a3a3c', marginBottom: 10 }}>{row.label}</p>
            {[
              { name: '⚡ 전기차', value: row.ev, color: '#6366f1' },
              { name: '⛽ 내연기관', value: row.gas, color: '#f59e0b' },
            ].map((item) => (
              <div key={item.name} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#3a3a3c' }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: item.color }}>{fmt(item.value)}원</span>
                </div>
                <div style={{ height: 10, borderRadius: 99, background: '#f2f2f7', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    width: `${(item.value / row.max) * 100}%`,
                    background: item.color,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            ))}
            <p style={{ fontSize: 12, color: '#8e8e93', marginTop: 6 }}>
              {row.ev < row.gas
                ? `전기차가 ${fmt(row.gas - row.ev)}원 더 저렴합니다`
                : `내연기관이 ${fmt(row.ev - row.gas)}원 더 저렴합니다`}
            </p>
          </div>
        ))}

        <div style={{
          padding: '14px 18px', borderRadius: 14, marginTop: 8,
          background: '#eef2ff', border: '1px solid rgba(99,102,241,0.2)',
          fontSize: 13, color: '#3a3a3c', lineHeight: 1.75,
        }}>
          💡 TCO(총 소유비용)는 구매가 + 연료비 + 유지보수비 합계입니다. 보조금·세금·보험료는 미포함입니다.
        </div>
      </Card>
    </div>
  );
}
