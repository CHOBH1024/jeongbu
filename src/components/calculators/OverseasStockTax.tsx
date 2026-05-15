import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { RATES_EFFECTIVE_DATE } from '../../data/rates';
import { TrendingUp, Info, Lightbulb } from 'lucide-react';

/* ── 해외주식 양도소득세 계산 로직 ───────────────────────── */

const BASIC_DEDUCTION = 2500000; // 기본공제 250만 원
const OVERSEAS_TAX_RATE = 0.22;  // 소득세 20% + 지방소득세 2%

function calcOverseasStockTax(profit: number, loss: number) {
  const netProfit = profit - loss;
  const taxBase = Math.max(0, netProfit - BASIC_DEDUCTION);
  const tax = Math.floor(taxBase * OVERSEAS_TAX_RATE);
  const lossSaving = Math.floor(loss * OVERSEAS_TAX_RATE); // 손실 통산으로 절세된 금액

  return { netProfit, taxBase, tax, lossSaving };
}

/* ── 컴포넌트 ─────────────────────────────────────────────── */

const INPUT_H: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: '#f9f9fb', border: '1.5px solid #e5e5ea',
  borderRadius: 10, fontSize: 14, color: '#1d1d1f',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};

const mutedColor = '#6e6e73';

export const OverseasStockTax = () => {
  const [annualProfit, setAnnualProfit]     = useState(10000000);
  const [annualLoss, setAnnualLoss]         = useState(0);
  const [prepaidTax, setPrepaidTax]         = useState(0);

  const result = useMemo(() => {
    if (annualProfit < 0) return null;
    const { netProfit, taxBase, tax, lossSaving } = calcOverseasStockTax(annualProfit, annualLoss);
    const finalTax = Math.max(0, tax - prepaidTax);
    const refund = Math.max(0, prepaidTax - tax);

    // ISA 계좌 적용 시 비교: 200만 비과세 + 초과분 9.9%
    const isaBase = Math.max(0, netProfit - 2000000);
    const isaTax = Math.floor(isaBase * 0.099);
    const isaSaving = Math.max(0, tax - isaTax);

    return { netProfit, taxBase, tax, lossSaving, finalTax, refund, isaTax, isaSaving };
  }, [annualProfit, annualLoss, prepaidTax]);

  const fmt = (n: number) => '₩' + n.toLocaleString('ko-KR');

  return (
    <div className="space-y-6">
      <div style={{
        padding: '12px 18px', borderRadius: 12, fontSize: 12,
        background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e',
        display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong>{RATES_EFFECTIVE_DATE}</strong> 기준 &middot; 소득세법 §94 해외주식 양도소득세 (세율 22%) &middot; 신고기한: 다음 해 5월 &middot; 결과는 참고용입니다.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>
        {/* 입력 */}
        <div className="space-y-5">
          <Card title="연간 해외주식 거래 내역" icon={<TrendingUp size={18} />}>
            <div className="space-y-4" style={{ marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                  연간 매도 수익 합계 (원)
                  <span style={{ color: '#aeaeb2', fontWeight: 400, marginLeft: 4 }}>양도가액 - 취득가액</span>
                </label>
                <input type="number" value={annualProfit} onChange={e => setAnnualProfit(+e.target.value)} style={INPUT_H} step={1000000} min={0} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                  연간 매도 손실 합계 (원)
                  <span style={{ color: '#aeaeb2', fontWeight: 400, marginLeft: 4 }}>손실 통산 적용</span>
                </label>
                <input type="number" value={annualLoss} onChange={e => setAnnualLoss(+e.target.value)} style={INPUT_H} step={1000000} min={0} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                  기납부 세액 (원)
                  <span style={{ color: '#aeaeb2', fontWeight: 400, marginLeft: 4 }}>외국에서 납부한 세금</span>
                </label>
                <input type="number" value={prepaidTax} onChange={e => setPrepaidTax(+e.target.value)} style={INPUT_H} step={100000} min={0} />
              </div>
            </div>
          </Card>
        </div>

        {/* 결과 */}
        <div className="space-y-5">
          {result ? (
            <>
              {result.netProfit <= 0 ? (
                <div style={{
                  padding: '28px', borderRadius: 20,
                  background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)',
                  border: '1.5px solid rgba(16,185,129,0.3)',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: 28, marginBottom: 8 }}>📉</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#065f46' }}>순손실 — 납부세액 없음</p>
                  <p style={{ fontSize: 13, color: '#047857', marginTop: 4 }}>
                    순손실 {fmt(Math.abs(result.netProfit))} → 기본공제 250만 원 초과 이익 없음
                  </p>
                </div>
              ) : result.taxBase === 0 ? (
                <div style={{
                  padding: '28px', borderRadius: 20,
                  background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)',
                  border: '1.5px solid rgba(16,185,129,0.3)',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: 28, marginBottom: 8 }}>🎉</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#065f46' }}>250만 원 공제 적용 — 납부세액 없음</p>
                  <p style={{ fontSize: 13, color: '#047857', marginTop: 4 }}>
                    순이익 {fmt(result.netProfit)} ≤ 기본공제 250만 원
                  </p>
                </div>
              ) : (
                <div style={{
                  padding: '28px', borderRadius: 20,
                  background: 'linear-gradient(135deg,#eef2ff,#fdf4ff)',
                  border: '1.5px solid rgba(99,102,241,0.2)',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: 13, color: mutedColor, fontWeight: 700, marginBottom: 8 }}>납부 양도소득세 (22%)</p>
                  <p className="num" style={{ fontSize: 36, fontWeight: 900, color: '#6366f1', letterSpacing: '-0.03em', marginBottom: 4 }}>
                    {fmt(result.finalTax)}
                  </p>
                  {result.refund > 0 && (
                    <p style={{ fontSize: 13, color: '#10b981', fontWeight: 700 }}>기납부세액 초과 → 환급 {fmt(result.refund)}</p>
                  )}
                  {prepaidTax > 0 && result.refund === 0 && (
                    <p style={{ fontSize: 12, color: mutedColor, marginTop: 4 }}>기납부세액 {fmt(prepaidTax)} 차감 후</p>
                  )}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <StatCard label="순이익" value={fmt(result.netProfit)} color="#6366f1" />
                <StatCard label="과세표준" value={fmt(result.taxBase)} color="#8b5cf6" />
                <StatCard label="산출세액 (22%)" value={fmt(result.tax)} color="#ef4444" />
                {result.lossSaving > 0
                  ? <StatCard label="손실통산 절세액" value={fmt(result.lossSaving)} color="#10b981" />
                  : <StatCard label="기본공제" value={fmt(BASIC_DEDUCTION)} color="#10b981" />
                }
              </div>

              <Card title="세금 계산 근거">
                <div className="space-y-3" style={{ marginTop: 8, fontSize: 13, color: mutedColor }}>
                  {[
                    ['① 연간 수익 합계', fmt(annualProfit)],
                    ['② 연간 손실 합계 (통산)', `-${fmt(annualLoss)}`],
                    ['③ 순이익', fmt(result.netProfit)],
                    ['④ 기본공제', `-${fmt(BASIC_DEDUCTION)}`],
                    ['⑤ 과세표준', fmt(result.taxBase)],
                    ['⑥ 세율', '22% (소득세 20% + 지방소득세 2%)'],
                    ['⑦ 산출세액', fmt(result.tax)],
                    prepaidTax > 0 ? ['⑧ 기납부세액 공제', `-${fmt(prepaidTax)}`] : null,
                    ['⑨ 최종 납부세액', fmt(result.finalTax)],
                  ].filter(Boolean).map((row) => {
                    const [k, v] = row as [string, string];
                    return (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f2f2f7' }}>
                        <span>{k}</span>
                        <span style={{ fontWeight: 700, color: '#1d1d1f' }}>{v}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* ISA 계좌 비교 */}
              {result.taxBase > 0 && (
                <div style={{
                  padding: '20px', borderRadius: 16,
                  background: 'linear-gradient(135deg,#fdf4ff,#ede9fe)',
                  border: '1.5px solid rgba(139,92,246,0.2)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Lightbulb size={16} color="#8b5cf6" />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#5b21b6' }}>ISA 계좌 활용 시 절세 비교</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#6d28d9', lineHeight: 1.7 }}>
                    <p>ISA 계좌 내 해외주식: 200만 원 비과세 + 초과분 9.9% 분리과세</p>
                    <p style={{ marginTop: 4 }}>ISA 적용 세액: <strong>{fmt(result.isaTax)}</strong></p>
                    <p style={{ marginTop: 4 }}>절세 가능 금액: <strong style={{ color: '#10b981' }}>{fmt(result.isaSaving)}</strong></p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: mutedColor, fontSize: 14 }}>
              거래 수익을 입력하면 계산됩니다
            </div>
          )}

          <Card title="250만 원 공제 활용 팁 💡">
            <div className="space-y-3" style={{ marginTop: 8 }}>
              {[
                '해외주식 양도소득세는 매년 1월 1일~12월 31일 기준으로 합산하며, 다음 해 5월에 자진신고합니다.',
                '연간 순이익이 250만 원 이하이면 납부세액이 없습니다. 매년 250만 원씩 실현하는 전략이 유효합니다.',
                '손실이 발생한 해에는 손실 통산을 활용해 세금을 줄일 수 있습니다. 단, 이월 공제는 불가합니다.',
                'ISA(개인종합자산관리계좌) 계좌 내 해외ETF는 200만 원 비과세 + 초과분 9.9%로 절세 효과가 큽니다.',
                '외국에서 납부한 세금은 외국납부세액공제로 이중과세를 방지할 수 있습니다.',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: '#6e6e73' }}>
                  <span style={{ flexShrink: 0, color: '#6366f1', fontWeight: 800 }}>{i + 1}.</span>
                  <span style={{ lineHeight: 1.7 }}>{tip}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
