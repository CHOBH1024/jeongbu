import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, StatCard } from '../ui/Base';
import { RefreshCcw, Send, CheckCircle2, AlertCircle, Loader } from 'lucide-react';

/* ── 통화 목록 ──────────────────────────────────────────── */
const CURRENCIES = [
  { code: 'JPY', label: '일본 엔 (JPY)', flag: '🇯🇵', unit: 100 },
  { code: 'USD', label: '미국 달러 (USD)', flag: '🇺🇸', unit: 1 },
  { code: 'EUR', label: '유로 (EUR)', flag: '🇪🇺', unit: 1 },
  { code: 'CNY', label: '중국 위안 (CNY)', flag: '🇨🇳', unit: 1 },
  { code: 'THB', label: '태국 바트 (THB)', flag: '🇹🇭', unit: 100 },
  { code: 'VND', label: '베트남 동 (VND)', flag: '🇻🇳', unit: 1000 },
  { code: 'PHP', label: '필리핀 페소 (PHP)', flag: '🇵🇭', unit: 100 },
];

/* ── 송금 서비스 설정 (수수료, 환율 마진) ─────────────────── */
const PROVIDERS = [
  { id: 'toss',   name: '토스뱅크',       flag: '🏦', fee: 0,     marginPct: 0.0065, best: false },
  { id: 'wire',   name: '와이어바알리',   flag: '✈️', fee: 0,     marginPct: 0.003,  best: false },
  { id: 'wise',   name: '와이즈(Wise)',   flag: '🌐', fee: 3500,  marginPct: 0.005,  best: false },
  { id: 'kakao',  name: '카카오페이',     flag: '💛', fee: 5000,  marginPct: 0.01,   best: false },
  { id: 'bank',   name: '시중은행(창구)', flag: '🏢', fee: 10000, marginPct: 0.017,  best: false },
];

const INPUT_H: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: '#f9f9fb', border: '1.5px solid #e5e5ea',
  borderRadius: 10, fontSize: 14, color: '#1d1d1f',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};

export const RemittanceOptimizer = () => {
  const [amount,   setAmount]   = useState(1000000);
  const [currency, setCurrency] = useState('JPY');
  const [rate,     setRate]     = useState<number | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [error,    setError]    = useState('');

  const fetchRate = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/KRW`);
      if (!res.ok) throw new Error('API 오류');
      const data = await res.json();
      if (data.result !== 'success') throw new Error('환율 조회 실패');
      const r = data.rates[currency];
      if (!r) throw new Error(`${currency} 환율 없음`);
      setRate(r);
      const now = new Date();
      setLastUpdate(`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')} 업데이트`);
    } catch {
      // fallback rates (rough approximation)
      const fallback: Record<string, number> = {
        JPY: 0.109, USD: 0.00073, EUR: 0.00067, CNY: 0.0053,
        THB: 0.0256, VND: 18.5, PHP: 0.041,
      };
      setRate(fallback[currency] ?? null);
      setError('실시간 조회 실패 — 최근 평균 환율을 표시합니다');
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => { fetchRate(); }, [fetchRate]);

  const cur = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  const rateDisplay = rate ? (rate * cur.unit).toFixed(cur.unit >= 100 ? 2 : 4) : '—';

  const results = useMemo(() => {
    if (!rate) return [];
    return PROVIDERS.map((p) => {
      const netKrw     = amount - p.fee;
      const appliedRate = rate * (1 - p.marginPct);
      const received   = Math.floor(netKrw * appliedRate);
      return { ...p, received, appliedRate };
    }).sort((a, b) => b.received - a.received);
  }, [amount, rate]);

  const bestReceived = results[0]?.received ?? 0;

  const fmt = (n: number) => n.toLocaleString('ko-KR');
  const mutedColor = '#6e6e73';

  return (
    <div className="space-y-6">

      {/* 환율 조회 오류 */}
      {error && (
        <div style={{
          padding: '10px 16px', borderRadius: 10, fontSize: 12,
          background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertCircle size={14}/> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>

        {/* 왼쪽: 입력 */}
        <div className="space-y-5">
          <Card title="송금 정보" icon={<Send size={18}/>}>
            <div className="space-y-4" style={{ marginTop: 8 }}>
              {/* 통화 선택 */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 8 }}>받는 통화</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {CURRENCIES.map((c) => (
                    <button key={c.code} onClick={() => setCurrency(c.code)}
                      style={{
                        padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                        border: '1.5px solid',
                        background:   currency === c.code ? '#6366f1' : 'transparent',
                        color:        currency === c.code ? '#fff'    : mutedColor,
                        borderColor:  currency === c.code ? '#6366f1' : '#e5e5ea',
                        cursor: 'pointer',
                      }}>
                      {c.flag} {c.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* 금액 */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>보내는 금액 (KRW)</label>
                <input
                  type="number" value={amount} step={100000}
                  onChange={(e) => setAmount(+e.target.value)}
                  style={INPUT_H}/>
              </div>
            </div>
          </Card>

          {/* 실시간 환율 */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 11, color: mutedColor, fontWeight: 600, marginBottom: 4 }}>
                  현재 매매기준율 (실시간)
                </p>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: mutedColor, fontSize: 13 }}>
                    <Loader size={14}/> 불러오는 중...
                  </div>
                ) : (
                  <p className="num" style={{ fontSize: 22, fontWeight: 800, color: '#1d1d1f' }}>
                    {cur.unit > 1 ? `${cur.unit.toLocaleString()} ` : '1 '}{cur.code} = {rateDisplay ? `₩${(Number(rateDisplay) === 0 ? '' : (1/parseFloat(rateDisplay)).toFixed(2))}` : '—'}
                  </p>
                )}
                {lastUpdate && !loading && (
                  <p style={{ fontSize: 10, color: '#aeaeb2', marginTop: 3 }}>📡 {lastUpdate} (open.er-api.com)</p>
                )}
              </div>
              <button onClick={fetchRate} disabled={loading}
                style={{
                  width: 38, height: 38, borderRadius: 10, border: '1.5px solid #e5e5ea',
                  background: '#f9f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: mutedColor,
                }}>
                <RefreshCcw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}/>
              </button>
            </div>
          </Card>

          {rate && (
            <StatCard
              label={`보낼 수 있는 총액 (수수료 없을 경우)`}
              value={`${fmt(Math.floor(amount * rate))} ${cur.code}`}
              color="#6366f1"
            />
          )}
        </div>

        {/* 오른쪽: 비교 결과 */}
        <div className="space-y-4">
          <p style={{ fontSize: 14, fontWeight: 800, color: '#1d1d1f' }}>
            {cur.flag} 수취 금액 비교 ({cur.label})
          </p>
          {results.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: mutedColor, fontSize: 13 }}>
              {loading ? '환율 로딩 중...' : '위에서 금액을 입력하세요'}
            </div>
          ) : (
            results.map((res, idx) => {
              const diff = res.received - bestReceived;
              const isBest = idx === 0;
              return (
                <div key={res.id} style={{
                  padding: '18px 20px', borderRadius: 16,
                  background: isBest ? 'linear-gradient(135deg,#eef2ff,#fdf4ff)' : '#fff',
                  border: `1.5px solid ${isBest ? 'rgba(99,102,241,0.3)' : '#e5e5ea'}`,
                  position: 'relative', overflow: 'hidden',
                }}>
                  {isBest && (
                    <div style={{
                      position: 'absolute', top: 0, right: 0,
                      background: '#6366f1', color: '#fff',
                      fontSize: 10, fontWeight: 800, padding: '3px 12px',
                      borderRadius: '0 0 0 10px', letterSpacing: '0.05em',
                    }}>
                      BEST ✦
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12, flexShrink: 0, fontSize: 18,
                        background: isBest ? '#6366f115' : '#f2f2f7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {res.flag}
                      </div>
                      <div>
                        <p style={{ fontWeight: 800, fontSize: 14, color: '#1d1d1f' }}>{res.name}</p>
                        <p style={{ fontSize: 11, color: mutedColor, marginTop: 2 }}>
                          수수료 {res.fee ? `₩${res.fee.toLocaleString()}` : '없음'} · 환율 마진 {(res.marginPct * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="num" style={{ fontSize: 18, fontWeight: 900, color: isBest ? '#6366f1' : '#1d1d1f' }}>
                        {fmt(res.received)} {cur.code}
                      </p>
                      {isBest ? (
                        <p style={{ fontSize: 10, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
                          <CheckCircle2 size={10}/> 가장 많이 받아요!
                        </p>
                      ) : (
                        <p style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>
                          -{fmt(Math.abs(diff))} {cur.code} 차이
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div style={{
            padding: '12px 16px', borderRadius: 12, fontSize: 11,
            background: '#f9f9fb', color: mutedColor, lineHeight: 1.7,
          }}>
            ⚠️ 수수료·환율은 각사 정책에 따라 수시로 변경됩니다. 실제 거래 전 해당 앱에서 최종 확인하세요.
            환율 데이터: open.er-api.com
          </div>
        </div>
      </div>
    </div>
  );
};
