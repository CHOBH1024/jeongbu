import { useState, useMemo } from 'react';
import { Card, StatCard } from '../ui/Base';
import { RATES_EFFECTIVE_DATE, INCOME_TAX_BRACKETS } from '../../data/rates';
import { Home, Info } from 'lucide-react';

/* ── 양도소득세 계산 로직 ─────────────────────────────────── */

/** 종합소득세 누진세 */
function incomeTax(taxBase: number): number {
  for (const b of INCOME_TAX_BRACKETS) {
    if (taxBase <= b.max) return Math.max(0, taxBase * b.rate - b.deduct);
  }
  return 0;
}

/** 단기 보유 세율 */
function shortTermRate(holdingYears: number): number | null {
  if (holdingYears < 1) return 0.70;
  if (holdingYears < 2) return 0.60;
  return null; // 2년 이상 → 기본세율
}

/** 일반 장기보유특별공제 (3년부터 매년 2%, 최대 30%) */
function generalLtd(years: number): number {
  if (years < 3) return 0;
  return Math.min(0.02 * Math.floor(years), 0.30);
}

/** 1세대 1주택 장기보유특별공제 (최대 80%) */
function oneHouseLtd(years: number): number {
  // 보유 + 거주 각각 4%씩, 최대 40%+40% = 80%
  // 단순화: 보유 기간 기준 매년 8%, 최대 80%
  if (years < 3) return 0;
  return Math.min(0.08 * Math.floor(years), 0.80);
}

interface CalcResult {
  gain: number;
  taxableGain: number;
  ltdRate: number;
  ltdAmt: number;
  basicDeduction: number;
  taxBase: number;
  tax: number;
  localTax: number;
  totalTax: number;
  exempt: boolean;
  exemptMsg?: string;
  surchargeRate: number;
}

function calcCapitalGainsTax(params: {
  acquisitionPrice: number;
  transferPrice: number;
  necessaryCost: number;
  holdingYears: number;
  isOneHousehold: boolean;
  isMultiHouse: boolean;
  isRegulatedArea: boolean;
}): CalcResult {
  const { acquisitionPrice, transferPrice, necessaryCost, holdingYears, isOneHousehold, isMultiHouse, isRegulatedArea } = params;

  const gain = Math.max(0, transferPrice - acquisitionPrice - necessaryCost);
  const BASIC_DEDUCTION = 2500000;
  const HIGH_PRICE_THRESHOLD = 1200000000; // 12억

  // 1세대 1주택 비과세 판정
  if (isOneHousehold && holdingYears >= 2 && transferPrice <= HIGH_PRICE_THRESHOLD) {
    return {
      gain, taxableGain: 0, ltdRate: 0, ltdAmt: 0, basicDeduction: 0,
      taxBase: 0, tax: 0, localTax: 0, totalTax: 0,
      exempt: true, exemptMsg: '1세대 1주택 비과세 (보유 2년 이상, 양도가액 12억 이하)',
      surchargeRate: 0,
    };
  }

  let taxableGain = gain;
  let exemptMsg: string | undefined;

  // 1세대 1주택 고가주택: 12억 초과분만 과세
  if (isOneHousehold && holdingYears >= 2 && transferPrice > HIGH_PRICE_THRESHOLD) {
    const exemptPart = Math.floor(gain * (HIGH_PRICE_THRESHOLD / transferPrice));
    taxableGain = gain - exemptPart;
    exemptMsg = `고가주택: 12억 비과세 후 과세차익 ₩${taxableGain.toLocaleString('ko-KR')}`;
  }

  // 장기보유특별공제
  const ltdRate = isOneHousehold && holdingYears >= 2 ? oneHouseLtd(holdingYears) : generalLtd(holdingYears);
  const ltdAmt = Math.floor(taxableGain * ltdRate);
  const afterLtd = taxableGain - ltdAmt;

  // 기본공제
  const basicDeduction = Math.min(BASIC_DEDUCTION, afterLtd);
  const taxBase = Math.max(0, afterLtd - basicDeduction);

  // 세율 결정
  const short = shortTermRate(holdingYears);
  let surchargeRate = 0;
  if (isMultiHouse && isRegulatedArea) surchargeRate = 0.20;

  let tax: number;
  if (short !== null) {
    tax = Math.floor(taxBase * short);
  } else {
    // 기본세율 + 중과 (다주택+규제지역)
    if (surchargeRate > 0) {
      // 중과: 기본세율에 20%p 가산
      // 각 구간별 계산
      let baseTaxAmt = incomeTax(taxBase);
      tax = Math.floor(baseTaxAmt + taxBase * surchargeRate);
    } else {
      tax = Math.floor(incomeTax(taxBase));
    }
  }

  const localTax = Math.floor(tax * 0.10);
  const totalTax = tax + localTax;

  return {
    gain, taxableGain, ltdRate, ltdAmt, basicDeduction, taxBase,
    tax, localTax, totalTax,
    exempt: false, exemptMsg,
    surchargeRate,
  };
}

/* ── 컴포넌트 ─────────────────────────────────────────────── */

const INPUT_H: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: '#f9f9fb', border: '1.5px solid #e5e5ea',
  borderRadius: 10, fontSize: 14, color: '#1d1d1f',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};

const mutedColor = '#6e6e73';

export const CapitalGainsTax = () => {
  const [acquisitionPrice, setAcquisitionPrice] = useState(500000000);
  const [transferPrice, setTransferPrice] = useState(900000000);
  const [necessaryCost, setNecessaryCost] = useState(0); // 취득세·중개수수료 등 실제 입력
  const [holdingYears, setHoldingYears] = useState(5);
  const [isOneHousehold, setIsOneHousehold] = useState(true);
  const [isMultiHouse, setIsMultiHouse] = useState(false);
  const [isRegulatedArea, setIsRegulatedArea] = useState(false);

  const isHighPrice = transferPrice > 1200000000;

  const result = useMemo(() => {
    if (acquisitionPrice <= 0 || transferPrice <= 0) return null;
    return calcCapitalGainsTax({
      acquisitionPrice, transferPrice, necessaryCost, holdingYears,
      isOneHousehold, isMultiHouse, isRegulatedArea,
    });
  }, [acquisitionPrice, transferPrice, holdingYears, isOneHousehold, isMultiHouse, isRegulatedArea]);

  const fmt = (n: number) => '₩' + n.toLocaleString('ko-KR');
  const fmtPct = (r: number) => (r * 100).toFixed(0) + '%';

  return (
    <div className="space-y-6">
      <div style={{
        padding: '12px 18px', borderRadius: 12, fontSize: 12,
        background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e',
        display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong>{RATES_EFFECTIVE_DATE}</strong> 기준 &middot; 소득세법 §94~§121 적용 &middot; 결과는 참고용이며 실제와 차이가 있을 수 있습니다.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>
        {/* 입력 */}
        <div className="space-y-5">
          <Card title="부동산 정보" icon={<Home size={18} />}>
            <div className="space-y-4" style={{ marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>취득가액 (원)</label>
                <input type="number" value={acquisitionPrice} onChange={e => setAcquisitionPrice(+e.target.value)} style={INPUT_H} step={10000000} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                  양도가액 (원)
                  {isHighPrice && <span style={{ marginLeft: 8, color: '#ef4444', fontSize: 11 }}>고가주택 (12억 초과)</span>}
                </label>
                <input type="number" value={transferPrice} onChange={e => setTransferPrice(+e.target.value)} style={INPUT_H} step={10000000} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>보유 기간 (년)</label>
                <input type="number" value={holdingYears} onChange={e => setHoldingYears(+e.target.value)} style={INPUT_H} step={0.5} min={0} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: mutedColor, display: 'block', marginBottom: 6 }}>
                  필요경비 (원)
                  <span style={{ marginLeft: 6, fontWeight: 400, color: '#aeaeb2', fontSize: 11 }}>취득세·중개수수료 등 실납부액</span>
                </label>
                <input type="number" value={necessaryCost} onChange={e => setNecessaryCost(+e.target.value)} style={INPUT_H} step={1000000} min={0} />
              </div>
            </div>
          </Card>

          <Card title="주택 유형">
            <div className="space-y-3" style={{ marginTop: 8 }}>
              {[
                { label: '1세대 1주택', state: isOneHousehold, set: (v: boolean) => { setIsOneHousehold(v); if (v) setIsMultiHouse(false); } },
                { label: '다주택자', state: isMultiHouse, set: (v: boolean) => { setIsMultiHouse(v); if (v) setIsOneHousehold(false); } },
                { label: '규제지역 내 주택 (다주택 중과)', state: isRegulatedArea, set: setIsRegulatedArea, disabled: !isMultiHouse },
              ].map(({ label, state, set, disabled }) => (
                <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1 }}>
                  <input type="checkbox" checked={state} onChange={e => !disabled && set(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: '#6366f1' }} disabled={disabled} />
                  <span style={{ fontSize: 14, color: '#1d1d1f', fontWeight: 600 }}>{label}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>

        {/* 결과 */}
        <div className="space-y-5">
          {result ? (
            result.exempt ? (
              <div style={{
                padding: 28, borderRadius: 20,
                background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)',
                border: '1.5px solid rgba(16,185,129,0.3)',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: 32, marginBottom: 12 }}>🎉</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#065f46', marginBottom: 8 }}>비과세</p>
                <p style={{ fontSize: 13, color: '#047857' }}>{result.exemptMsg}</p>
                <p style={{ fontSize: 13, color: '#047857', marginTop: 4 }}>양도소득세 납부 의무 없음</p>
              </div>
            ) : (
              <>
                {result.exemptMsg && (
                  <div style={{
                    padding: '12px 16px', borderRadius: 12, fontSize: 12,
                    background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534',
                  }}>
                    {result.exemptMsg}
                  </div>
                )}

                <div style={{
                  padding: '28px', borderRadius: 20,
                  background: 'linear-gradient(135deg,#eef2ff,#fdf4ff)',
                  border: '1.5px solid rgba(99,102,241,0.2)',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: 13, color: mutedColor, fontWeight: 700, marginBottom: 8 }}>최종 납부세액</p>
                  <p className="num" style={{ fontSize: 36, fontWeight: 900, color: '#6366f1', letterSpacing: '-0.03em', marginBottom: 4 }}>
                    {fmt(result.totalTax)}
                  </p>
                  <p style={{ fontSize: 12, color: mutedColor }}>
                    양도소득세 {fmt(result.tax)} + 지방소득세 {fmt(result.localTax)}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <StatCard label="양도차익" value={fmt(result.gain)} color="#6366f1" />
                  <StatCard label="과세표준" value={fmt(result.taxBase)} color="#8b5cf6" />
                  <StatCard label="양도소득세" value={fmt(result.tax)} color="#ef4444" />
                  <StatCard label="지방소득세" value={fmt(result.localTax)} color="#f59e0b" />
                </div>

                <Card title="세금 계산 근거">
                  <div className="space-y-3" style={{ marginTop: 8, fontSize: 13, color: mutedColor }}>
                    {[
                      ['① 양도가액', fmt(transferPrice)],
                      ['② 취득가액', `-${fmt(acquisitionPrice)}`],
                      ['③ 필요경비', `-${fmt(necessaryCost)}`],
                      ['④ 양도차익', fmt(result.gain)],
                      ['⑤ 과세 대상 차익', fmt(result.taxableGain)],
                      [`⑥ 장기보유특별공제 (${fmtPct(result.ltdRate)})`, `-${fmt(result.ltdAmt)}`],
                      ['⑦ 기본공제', `-${fmt(result.basicDeduction)}`],
                      ['⑧ 과세표준', fmt(result.taxBase)],
                      ['⑨ 산출세액', fmt(result.tax)],
                      ['⑩ 지방소득세 (10%)', fmt(result.localTax)],
                    ].map(([k, v]) => (
                      <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f2f2f7' }}>
                        <span>{k as string}</span>
                        <span style={{ fontWeight: 700, color: '#1d1d1f' }}>{v as string}</span>
                      </div>
                    ))}
                    {result.surchargeRate > 0 && (
                      <div style={{ padding: '8px 12px', borderRadius: 8, background: '#fef2f2', color: '#dc2626', fontSize: 12 }}>
                        ⚠️ 다주택 규제지역 중과세율 +20%p 적용됨
                      </div>
                    )}
                  </div>
                </Card>
              </>
            )
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: mutedColor, fontSize: 14 }}>
              취득가액과 양도가액을 입력하면 계산됩니다
            </div>
          )}

          <Card title="알아두세요 💡">
            <div className="space-y-3" style={{ marginTop: 8 }}>
              {[
                '1세대 1주택 비과세는 보유 2년 이상 & 양도가액 12억 이하 조건을 모두 충족해야 합니다.',
                '고가주택(12억 초과)은 12억 초과분 비율에 해당하는 차익만 과세됩니다.',
                '장기보유특별공제는 보유 3년 이상부터 적용됩니다.',
                '다주택자가 규제지역 내 주택을 양도 시 기본세율에 20%p가 가산됩니다.',
                '필요경비(중개수수료, 취득세 등)는 실제 지출 금액을 반영하세요.',
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
