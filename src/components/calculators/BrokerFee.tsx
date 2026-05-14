import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Home, Info, DollarSign } from 'lucide-react';

type TxType = '매매' | '전세' | '월세';

function fmt(n: number) {
  return Math.round(n).toLocaleString('ko-KR');
}

function fmtW(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(2)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return `${Math.round(n).toLocaleString('ko-KR')}`;
}

// 공인중개사법 시행규칙 기준 상한 요율 (2021.10.19 개정)
function getBrokerRate(type: TxType, price: number): { rate: number; maxFee: number | null } {
  if (type === '매매') {
    if (price < 50000000) return { rate: 0.006, maxFee: 250000 };
    if (price < 200000000) return { rate: 0.005, maxFee: 800000 };
    if (price < 600000000) return { rate: 0.004, maxFee: null };
    if (price < 900000000) return { rate: 0.005, maxFee: null };
    return { rate: 0.009, maxFee: null };
  }
  if (type === '전세') {
    if (price < 50000000) return { rate: 0.005, maxFee: 200000 };
    if (price < 100000000) return { rate: 0.004, maxFee: 300000 };
    if (price < 300000000) return { rate: 0.003, maxFee: null };
    if (price < 600000000) return { rate: 0.004, maxFee: null };
    return { rate: 0.008, maxFee: null };
  }
  // 월세
  return { rate: 0.008, maxFee: null };
}

// 취득세 (매매 시)
function getAcquisitionTax(price: number, isAdjusted: boolean): number {
  // 조정대상지역 1주택 기준
  if (isAdjusted) {
    if (price <= 600000000) return price * 0.01;
    if (price <= 900000000) return price * 0.02;
    return price * 0.03;
  }
  // 비조정지역
  if (price <= 600000000) return price * 0.01;
  if (price <= 900000000) return price * 0.02;
  return price * 0.03;
}

export function BrokerFee() {
  const [txType, setTxType] = useState<TxType>('매매');
  const [price, setPrice] = useState(500000000);
  const [monthlyRent, setMonthlyRent] = useState(100);
  const [deposit, setDeposit] = useState(10000);
  const [isAdjusted, setIsAdjusted] = useState(false);

  const result = useMemo(() => {
    let calcPrice = price;
    if (txType === '월세') {
      // 월세 환산 가격 = 보증금 + (월세 × 100)
      calcPrice = deposit * 10000 + monthlyRent * 10000 * 100;
    }

    const { rate, maxFee } = getBrokerRate(txType, calcPrice);
    let brokerFee = calcPrice * rate;
    if (maxFee !== null && brokerFee > maxFee) brokerFee = maxFee;

    // 부가세 10%
    const brokerVat = brokerFee * 0.1;

    // 취득세 (매매만)
    const acqui = txType === '매매' ? getAcquisitionTax(price, isAdjusted) : 0;
    const eduTax = acqui * 0.1;
    const farmTax = price <= 600000000 ? 0 : acqui * 0.2; // 농특세

    // 등기비용
    const regFee = txType === '매매' ? price * 0.002 + 72000 : price * 0.001 + 12000;

    const total = brokerFee + brokerVat + acqui + eduTax + farmTax + regFee;

    return { brokerFee, brokerVat, acqui, eduTax, farmTax, regFee, total, rate, calcPrice };
  }, [txType, price, monthlyRent, deposit, isAdjusted]);

  return (
    <div className="space-y-6">
      <Card title="거래 정보 입력" icon={<Home size={18} />}>
        <div className="mt-3 mb-4 flex gap-2">
          {(['매매', '전세', '월세'] as TxType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTxType(t)}
              className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                background: txType === t ? 'var(--color-primary)' : 'transparent',
                color: txType === t ? '#fff' : '#64748b',
                border: `2px solid ${txType === t ? 'var(--color-primary)' : '#e2e8f0'}`,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {txType !== '월세' ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-muted px-1">
                {txType === '매매' ? '매매가' : '전세금'} (원)
              </label>
              <input
                type="number"
                min={0}
                step={10000000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
              />
              <span className="text-xs text-muted px-1">{fmtW(price)}원</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-muted px-1">보증금 (만원)</label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-muted px-1">월세 (만원)</label>
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
                />
              </div>
            </>
          )}
          {txType === '매매' && (
            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="adjusted"
                checked={isAdjusted}
                onChange={(e) => setIsAdjusted(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="adjusted" className="text-sm font-semibold text-muted">
                조정대상지역 여부
              </label>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="중개보수 (부가세 포함)" value={`${fmt(result.brokerFee + result.brokerVat)}원`} sub={`상한 요율 ${(result.rate * 100).toFixed(2)}%`} color="var(--color-primary)" icon={<Home size={18} />} />
        {txType === '매매' && <StatCard label="취득세 합계" value={`${fmt(result.acqui + result.eduTax + result.farmTax)}원`} sub="취득세+교육세+농특세" color="var(--color-warning)" icon={<DollarSign size={18} />} />}
        <StatCard label="등기비용 (예상)" value={`${fmt(result.regFee)}원`} sub="법무사 보수 별도" color="#3b82f6" icon={<Home size={18} />} />
      </div>

      <Card title="비용 상세 내역" icon={<DollarSign size={18} />}>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="text-left py-2 px-3 text-muted font-semibold">항목</th>
                <th className="text-right py-2 px-3 text-muted font-semibold">금액</th>
                <th className="text-left py-2 px-3 text-muted font-semibold hidden md:table-cell">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2.5 px-3">중개보수</td>
                <td className="py-2.5 px-3 text-right tabular-nums">{fmt(result.brokerFee)}원</td>
                <td className="py-2.5 px-3 text-xs text-muted hidden md:table-cell">상한 요율 {(result.rate * 100).toFixed(2)}% 적용</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2.5 px-3">부가가치세 (중개보수의 10%)</td>
                <td className="py-2.5 px-3 text-right tabular-nums">{fmt(result.brokerVat)}원</td>
                <td className="py-2.5 px-3 text-xs text-muted hidden md:table-cell">과세 중개사 해당 시</td>
              </tr>
              {txType === '매매' && (
                <>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2.5 px-3">취득세</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">{fmt(result.acqui)}원</td>
                    <td className="py-2.5 px-3 text-xs text-muted hidden md:table-cell">1주택 기준</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2.5 px-3">지방교육세</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">{fmt(result.eduTax)}원</td>
                    <td className="py-2.5 px-3 text-xs text-muted hidden md:table-cell">취득세의 10%</td>
                  </tr>
                  {result.farmTax > 0 && (
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2.5 px-3">농어촌특별세</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">{fmt(result.farmTax)}원</td>
                      <td className="py-2.5 px-3 text-xs text-muted hidden md:table-cell">6억 초과 시 취득세의 20%</td>
                    </tr>
                  )}
                </>
              )}
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2.5 px-3">등기비용 (예상)</td>
                <td className="py-2.5 px-3 text-right tabular-nums">{fmt(result.regFee)}원</td>
                <td className="py-2.5 px-3 text-xs text-muted hidden md:table-cell">법무사 보수 미포함</td>
              </tr>
              <tr className="bg-primary/5 font-bold">
                <td className="py-3 px-3">총 합계</td>
                <td className="py-3 px-3 text-right tabular-nums text-primary">{fmt(result.total)}원</td>
                <td className="hidden md:table-cell" />
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-start gap-2 text-xs text-muted">
          <Info size={14} className="flex-shrink-0 mt-0.5 text-primary" />
          <p>중개보수는 법정 상한 요율이며 협의 가능합니다. 법무사 보수는 지역·난이도에 따라 별도 발생합니다. 취득세는 1주택자 기준이며 다주택자는 세율이 상이합니다.</p>
        </div>
      </Card>
    </div>
  );
}
