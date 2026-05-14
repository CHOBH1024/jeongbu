import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Plus, Trash2, TrendingUp, Info } from 'lucide-react';

type Purchase = { id: number; grams: number; pricePerGram: number };

let nextId = 10;

function fmt(n: number, decimals = 0) {
  return n.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function SilverAvgPrice() {
  const [purchases, setPurchases] = useState<Purchase[]>([
    { id: 1, grams: 100, pricePerGram: 1250 },
    { id: 2, grams: 50, pricePerGram: 1180 },
  ]);
  const [currentPrice, setCurrentPrice] = useState(1300);
  const [newGrams, setNewGrams] = useState<number | ''>('');
  const [newPrice, setNewPrice] = useState<number | ''>('');

  const result = useMemo(() => {
    if (purchases.length === 0) return null;
    const totalGrams = purchases.reduce((s, p) => s + p.grams, 0);
    const totalCost = purchases.reduce((s, p) => s + p.grams * p.pricePerGram, 0);
    const avgPrice = totalCost / totalGrams;
    const currentValue = totalGrams * currentPrice;
    const profitLoss = currentValue - totalCost;
    const profitRate = (profitLoss / totalCost) * 100;
    return { totalGrams, totalCost, avgPrice, currentValue, profitLoss, profitRate };
  }, [purchases, currentPrice]);

  const addPurchase = () => {
    if (!newGrams || !newPrice || newGrams <= 0 || newPrice <= 0) return;
    setPurchases((prev) => [...prev, { id: nextId++, grams: Number(newGrams), pricePerGram: Number(newPrice) }]);
    setNewGrams('');
    setNewPrice('');
  };

  const removePurchase = (id: number) => setPurchases((prev) => prev.filter((p) => p.id !== id));

  const isProfit = (result?.profitLoss ?? 0) >= 0;

  return (
    <div className="space-y-6">
      <Card title="매수 내역 입력" icon={<TrendingUp size={18} />}>
        <div className="space-y-2 mt-3">
          {purchases.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
              <span className="text-xs text-muted w-6">{i + 1}</span>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-muted">수량 (g)</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={p.grams}
                    onChange={(e) =>
                      setPurchases((prev) => prev.map((x) => x.id === p.id ? { ...x, grams: Number(e.target.value) } : x))
                    }
                    className="w-full px-3 py-1.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-right tabular-nums"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-muted">매수가 (원/g)</label>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={p.pricePerGram}
                    onChange={(e) =>
                      setPurchases((prev) => prev.map((x) => x.id === p.id ? { ...x, pricePerGram: Number(e.target.value) } : x))
                    }
                    className="w-full px-3 py-1.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-right tabular-nums"
                  />
                </div>
              </div>
              <span className="text-xs text-muted w-24 text-right tabular-nums hidden md:block">
                {fmt(p.grams * p.pricePerGram)}원
              </span>
              <button onClick={() => removePurchase(p.id)} className="text-danger hover:opacity-70 transition-opacity">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Add row */}
        <div className="flex gap-2 mt-3">
          <input
            type="number"
            placeholder="수량 (g)"
            value={newGrams}
            onChange={(e) => setNewGrams(e.target.value ? Number(e.target.value) : '')}
            onKeyDown={(e) => e.key === 'Enter' && addPurchase()}
            className="flex-1 px-4 py-2.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-right"
          />
          <input
            type="number"
            placeholder="매수가 (원/g)"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value ? Number(e.target.value) : '')}
            onKeyDown={(e) => e.key === 'Enter' && addPurchase()}
            className="flex-1 px-4 py-2.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-right"
          />
          <button
            onClick={addPurchase}
            className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors flex items-center gap-1"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Current price */}
        <div className="mt-4 flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-muted px-1">현재 시세 (원/g)</label>
          <input
            type="number"
            min={0}
            step={10}
            value={currentPrice}
            onChange={(e) => setCurrentPrice(Number(e.target.value))}
            className="w-full md:w-64 px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
          />
        </div>
      </Card>

      {result && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="총 보유량" value={`${fmt(result.totalGrams)}g`} sub={`${purchases.length}회 매수`} color="var(--color-primary)" icon={<TrendingUp size={18} />} />
            <StatCard label="평균 매수가" value={`${fmt(result.avgPrice, 1)}원/g`} sub="가중평균" color="#3b82f6" icon={<TrendingUp size={18} />} />
            <StatCard label="현재 평가액" value={`${fmt(result.currentValue)}원`} sub={`${fmt(currentPrice)}원/g 기준`} color="var(--color-secondary)" icon={<TrendingUp size={18} />} />
            <StatCard
              label="평가 손익"
              value={`${isProfit ? '+' : ''}${fmt(result.profitLoss)}원`}
              sub={`${isProfit ? '+' : ''}${result.profitRate.toFixed(2)}%`}
              color={isProfit ? 'var(--color-secondary)' : 'var(--color-danger)'}
              icon={<TrendingUp size={18} />}
            />
          </div>

          <Card title="매수 내역 요약" icon={<TrendingUp size={18} />}>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left py-2 px-3 text-muted font-semibold">회차</th>
                    <th className="text-right py-2 px-3 text-muted font-semibold">수량(g)</th>
                    <th className="text-right py-2 px-3 text-muted font-semibold">매수가(원/g)</th>
                    <th className="text-right py-2 px-3 text-muted font-semibold">투자금액</th>
                    <th className="text-right py-2 px-3 text-muted font-semibold">현재가치</th>
                    <th className="text-right py-2 px-3 text-muted font-semibold">손익</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p, i) => {
                    const cost = p.grams * p.pricePerGram;
                    const curr = p.grams * currentPrice;
                    const pl = curr - cost;
                    return (
                      <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 px-3 text-muted">{i + 1}회</td>
                        <td className="py-2 px-3 text-right tabular-nums">{fmt(p.grams)}g</td>
                        <td className="py-2 px-3 text-right tabular-nums">{fmt(p.pricePerGram)}원</td>
                        <td className="py-2 px-3 text-right tabular-nums">{fmt(cost)}원</td>
                        <td className="py-2 px-3 text-right tabular-nums">{fmt(curr)}원</td>
                        <td className="py-2 px-3 text-right tabular-nums font-semibold" style={{ color: pl >= 0 ? 'var(--color-secondary)' : 'var(--color-danger)' }}>
                          {pl >= 0 ? '+' : ''}{fmt(pl)}원
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-primary/5 font-bold">
                    <td className="py-2.5 px-3">합계</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">{fmt(result.totalGrams)}g</td>
                    <td className="py-2.5 px-3 text-right text-primary">{fmt(result.avgPrice, 1)}원</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">{fmt(result.totalCost)}원</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">{fmt(result.currentValue)}원</td>
                    <td className="py-2.5 px-3 text-right tabular-nums" style={{ color: isProfit ? 'var(--color-secondary)' : 'var(--color-danger)' }}>
                      {isProfit ? '+' : ''}{fmt(result.profitLoss)}원
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-start gap-2 text-xs text-muted">
              <Info size={14} className="flex-shrink-0 mt-0.5 text-primary" />
              <p>은 현물 거래 시 부가세(10%), 수수료, 스프레드가 발생합니다. 실제 수익률은 다를 수 있습니다. 한국거래소(KRX) 금 시장에서 은도 거래 가능합니다.</p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
