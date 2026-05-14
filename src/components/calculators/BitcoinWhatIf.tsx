import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';

const BTC_PRICE_KRW: Record<number, number> = {
  2014: 400000, 2015: 300000, 2016: 900000, 2017: 15000000,
  2018: 7000000, 2019: 8500000, 2020: 15000000, 2021: 60000000,
  2022: 23000000, 2023: 43000000, 2024: 95000000, 2025: 140000000,
};

const SP500_ANNUAL_RETURN = 0.10;
const DEPOSIT_RATE = 0.035;
const CURRENT_BTC_KRW = 140000000;
const CURRENT_YEAR = 2025;

const START_YEARS = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

function fmt(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(2)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return Math.round(n).toLocaleString('ko-KR');
}

function fmtFull(n: number) {
  return Math.round(n).toLocaleString('ko-KR');
}

export function BitcoinWhatIf() {
  const [monthlyAmount, setMonthlyAmount] = useState(100000);
  const [startYear, setStartYear] = useState(2020);

  const calc = useMemo(() => {
    const months: number[] = [];
    for (let y = startYear; y <= CURRENT_YEAR; y++) {
      const count = y === CURRENT_YEAR ? 1 : 12; // use 1 month for current year simplification
      for (let m = 0; m < count; m++) {
        months.push(y);
      }
    }

    // BTC DCA
    let totalBtc = 0;
    let totalInvested = 0;
    months.forEach((year) => {
      const price = BTC_PRICE_KRW[year] ?? CURRENT_BTC_KRW;
      totalBtc += monthlyAmount / price;
      totalInvested += monthlyAmount;
    });
    const btcValue = totalBtc * CURRENT_BTC_KRW;

    // S&P500 compound monthly
    const sp500MonthlyReturn = SP500_ANNUAL_RETURN / 12;
    let sp500Value = 0;
    months.forEach((_, idx) => {
      const monthsLeft = months.length - 1 - idx;
      sp500Value += monthlyAmount * Math.pow(1 + sp500MonthlyReturn, monthsLeft);
    });

    // Deposit compound monthly
    const depositMonthlyRate = DEPOSIT_RATE / 12;
    let depositValue = 0;
    months.forEach((_, idx) => {
      const monthsLeft = months.length - 1 - idx;
      depositValue += monthlyAmount * Math.pow(1 + depositMonthlyRate, monthsLeft);
    });

    const numMonths = months.length;

    return {
      totalInvested,
      btcValue,
      sp500Value,
      depositValue,
      numMonths,
      btcReturn: ((btcValue / totalInvested - 1) * 100),
      sp500Return: ((sp500Value / totalInvested - 1) * 100),
      depositReturn: ((depositValue / totalInvested - 1) * 100),
    };
  }, [monthlyAmount, startYear]);

  const maxValue = Math.max(calc.btcValue, calc.sp500Value, calc.depositValue);

  const bars = [
    { name: '₿ 비트코인', value: calc.btcValue, ret: calc.btcReturn, color: '#f59e0b', emoji: '₿' },
    { name: '📈 S&P500 ETF', value: calc.sp500Value, ret: calc.sp500Return, color: '#6366f1', emoji: '📈' },
    { name: '🏦 정기예금', value: calc.depositValue, ret: calc.depositReturn, color: '#10b981', emoji: '🏦' },
  ].sort((a, b) => b.value - a.value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card title="비트코인을 샀다면?" icon={<span style={{ fontSize: 20 }}>₿</span>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>월 투자금액 (원)</label>
            <input
              type="number"
              step={10000}
              min={10000}
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              style={{
                padding: '10px 14px', background: '#f9f9fb', border: '1.5px solid #e5e5ea',
                borderRadius: 12, fontSize: 14, color: '#1d1d1f', fontFamily: 'inherit',
                outline: 'none', boxSizing: 'border-box', width: '100%',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = '#fff'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5ea'; e.currentTarget.style.background = '#f9f9fb'; }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>투자 시작 시점</label>
            <select
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              style={{
                padding: '10px 14px', background: '#f9f9fb', border: '1.5px solid #e5e5ea',
                borderRadius: 12, fontSize: 14, color: '#1d1d1f', fontFamily: 'inherit',
                outline: 'none', boxSizing: 'border-box', width: '100%', cursor: 'pointer',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = '#fff'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5ea'; e.currentTarget.style.background = '#f9f9fb'; }}
            >
              {START_YEARS.map((y) => (
                <option key={y} value={y}>{y}년부터</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{
          marginTop: 16, padding: '12px 16px', borderRadius: 12,
          background: '#fff9eb', border: '1px solid #f59e0b30',
          fontSize: 13, color: '#6e6e73',
        }}>
          📅 {startYear}년부터 2025년까지 매달 {fmtFull(monthlyAmount)}원씩, 총 {calc.numMonths}개월 투자
          · 총 투자금 <strong style={{ color: '#1d1d1f' }}>{fmt(calc.totalInvested)}원</strong>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard
          label="총 투자금"
          value={`${fmt(calc.totalInvested)}원`}
          sub={`${calc.numMonths}개월`}
          color="#6e6e73"
          icon={<span>💵</span>}
        />
        <StatCard
          label="비트코인 최종가치"
          value={`${fmt(calc.btcValue)}원`}
          sub={`+${calc.btcReturn.toFixed(0)}%`}
          color="#f59e0b"
          icon={<span>₿</span>}
        />
        <StatCard
          label="S&P500 최종가치"
          value={`${fmt(calc.sp500Value)}원`}
          sub={`+${calc.sp500Return.toFixed(0)}%`}
          color="#6366f1"
          icon={<span>📈</span>}
        />
        <StatCard
          label="정기예금 최종가치"
          value={`${fmt(calc.depositValue)}원`}
          sub={`+${calc.depositReturn.toFixed(0)}%`}
          color="#10b981"
          icon={<span>🏦</span>}
        />
      </div>

      <Card title="수익률 비교" icon={<span style={{ fontSize: 18 }}>📊</span>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          {bars.map((bar, rank) => (
            <div key={bar.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {rank === 0 && (
                    <span style={{
                      fontSize: 11, fontWeight: 800, color: '#fff',
                      background: bar.color, borderRadius: 6, padding: '2px 7px',
                    }}>1위</span>
                  )}
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#3a3a3c' }}>{bar.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: bar.color }}>{fmt(bar.value)}원</span>
                  <span style={{ fontSize: 12, color: '#aeaeb2', marginLeft: 8 }}>+{bar.ret.toFixed(0)}%</span>
                </div>
              </div>
              <div style={{ height: 12, borderRadius: 99, background: '#f2f2f7', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  width: `${(bar.value / maxValue) * 100}%`,
                  background: bar.color,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 20, padding: '14px 18px', borderRadius: 14,
          background: 'linear-gradient(135deg, #fff9eb 0%, #fef3c7 100%)',
          border: '1px solid #f59e0b30',
          fontSize: 13, color: '#3a3a3c', lineHeight: 1.75,
        }}>
          🧮 BTC 환산: {startYear}년 시작가 기준, 매달 매수 DCA 전략 적용.
          현재 BTC 가격 <strong style={{ color: '#f59e0b' }}>1억 4천만원</strong> 기준.
          <br />
          ⚠️ <strong>과거 수익률은 미래를 보장하지 않습니다 😅</strong> 투자에는 항상 손실 위험이 따릅니다.
        </div>

        <div style={{
          marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
        }}>
          {[
            { label: 'BTC 수익', profit: calc.btcValue - calc.totalInvested, color: '#f59e0b' },
            { label: 'S&P500 수익', profit: calc.sp500Value - calc.totalInvested, color: '#6366f1' },
            { label: '예금 수익', profit: calc.depositValue - calc.totalInvested, color: '#10b981' },
          ].map((item) => (
            <div key={item.label} style={{
              borderRadius: 14, padding: '14px 12px', textAlign: 'center',
              background: `${item.color}10`, border: `1.5px solid ${item.color}25`,
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8e8e93', marginBottom: 4 }}>{item.label}</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: item.color }}>+{fmt(item.profit)}원</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
