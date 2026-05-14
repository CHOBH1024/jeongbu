import { useMemo, useState } from 'react';
import { Card, StatCard } from '../ui/Base';
import { Truck, Info } from 'lucide-react';

type RoomSize = '원룸' | '1.5룸' | '2룸' | '3룸' | '4룸이상';
type MoveType = '일반이사' | '반포장' | '포장이사';
type Season = '비수기' | '수기';

const BASE_COST: Record<RoomSize, Record<MoveType, [number, number]>> = {
  '원룸': { '일반이사': [200000, 350000], '반포장': [350000, 550000], '포장이사': [500000, 750000] },
  '1.5룸': { '일반이사': [280000, 450000], '반포장': [450000, 700000], '포장이사': [650000, 950000] },
  '2룸': { '일반이사': [380000, 600000], '반포장': [600000, 900000], '포장이사': [900000, 1300000] },
  '3룸': { '일반이사': [600000, 1000000], '반포장': [900000, 1400000], '포장이사': [1300000, 2000000] },
  '4룸이상': { '일반이사': [1000000, 1600000], '반포장': [1400000, 2200000], '포장이사': [2000000, 3500000] },
};

// 거리 가산 (100km 이상부터)
function distanceSurcharge(km: number): [number, number] {
  if (km <= 30) return [0, 0];
  if (km <= 100) return [50000, 100000];
  if (km <= 200) return [150000, 250000];
  if (km <= 300) return [250000, 400000];
  return [350000, 600000];
}

function fmt(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString('ko-KR');
}

export function MovingCost() {
  const [roomSize, setRoomSize] = useState<RoomSize>('2룸');
  const [moveType, setMoveType] = useState<MoveType>('포장이사');
  const [distance, setDistance] = useState(15);
  const [season, setSeason] = useState<Season>('비수기');
  const [fromFloor, setFromFloor] = useState(5);
  const [toFloor, setToFloor] = useState(3);
  const [fromElev, setFromElev] = useState(true);
  const [toElev, setToElev] = useState(true);

  const result = useMemo(() => {
    const [baseMin, baseMax] = BASE_COST[roomSize][moveType];
    const [distMin, distMax] = distanceSurcharge(distance);

    // 엘리베이터 없으면 층당 추가비
    const floorExtra = (fl: boolean, floor: number) =>
      fl ? 0 : Math.max(0, floor - 1) * 15000;

    const fromExtra = floorExtra(fromElev, fromFloor);
    const toExtra = floorExtra(toElev, toFloor);

    // 성수기 (봄: 3~5월, 가을: 9~11월) 20% 가산
    const seasonMul = season === '수기' ? 1.2 : 1.0;

    const low = Math.round((baseMin + distMin + fromExtra + toExtra) * seasonMul);
    const high = Math.round((baseMax + distMax + fromExtra + toExtra) * seasonMul);
    const midpoint = Math.round((low + high) / 2);

    return { low, high, midpoint, fromExtra, toExtra };
  }, [roomSize, moveType, distance, season, fromFloor, toFloor, fromElev, toElev]);

  return (
    <div className="space-y-6">
      <Card title="이사 정보 입력" icon={<Truck size={18} />}>
        {/* 방 크기 */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-muted mb-2 block">이삿짐 규모</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(BASE_COST) as RoomSize[]).map((r) => (
              <button
                key={r}
                onClick={() => setRoomSize(r)}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: roomSize === r ? 'var(--color-primary)' : 'transparent',
                  color: roomSize === r ? '#fff' : '#64748b',
                  border: `2px solid ${roomSize === r ? 'var(--color-primary)' : '#e2e8f0'}`,
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 이사 방식 */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-muted mb-2 block">이사 방식</label>
          <div className="flex flex-wrap gap-2">
            {(['일반이사', '반포장', '포장이사'] as MoveType[]).map((m) => (
              <button
                key={m}
                onClick={() => setMoveType(m)}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: moveType === m ? 'var(--color-primary)' : 'transparent',
                  color: moveType === m ? '#fff' : '#64748b',
                  border: `2px solid ${moveType === m ? 'var(--color-primary)' : '#e2e8f0'}`,
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-muted px-1">이사 거리 (km)</label>
            <input
              type="number"
              min={0}
              step={5}
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-muted px-1">이사 시기</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value as Season)}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
            >
              <option value="비수기">비수기 (6~8월, 12~2월)</option>
              <option value="수기">성수기 (3~5월, 9~11월)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {[
            { label: '출발지 층수', val: fromFloor, set: setFromFloor, elev: fromElev, setElev: setFromElev, elevLabel: '출발지 엘리베이터' },
            { label: '도착지 층수', val: toFloor, set: setToFloor, elev: toElev, setElev: setToElev, elevLabel: '도착지 엘리베이터' },
          ].map((f) => (
            <div key={f.label} className="space-y-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-muted px-1">{f.label}</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={f.val}
                  onChange={(e) => f.set(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                <input type="checkbox" checked={f.elev} onChange={(e) => f.setElev(e.target.checked)} className="accent-primary" />
                {f.elevLabel} 있음
              </label>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="최저 예상 견적" value={`${fmt(result.low)}원`} sub="저가 업체 기준" color="#3b82f6" icon={<Truck size={18} />} />
        <StatCard label="평균 예상 견적" value={`${fmt(result.midpoint)}원`} sub="일반 업체 기준" color="var(--color-primary)" icon={<Truck size={18} />} />
        <StatCard label="최고 예상 견적" value={`${fmt(result.high)}원`} sub="프리미엄 기준" color="var(--color-warning)" icon={<Truck size={18} />} />
      </div>

      <Card title="견적 산정 기준" icon={<Info size={18} />}>
        <div className="space-y-2 mt-2 text-sm">
          {[
            { label: '기본 이사비 (이삿짐·방식)', value: `${fmt(BASE_COST[roomSize][moveType][0])} ~ ${fmt(BASE_COST[roomSize][moveType][1])}원` },
            { label: '거리 추가비', value: distanceSurcharge(distance)[0] === 0 ? '없음 (30km 이내)' : `${fmt(distanceSurcharge(distance)[0])} ~ ${fmt(distanceSurcharge(distance)[1])}원` },
            { label: '출발지 계단 추가', value: result.fromExtra > 0 ? `${fmt(result.fromExtra)}원` : '없음' },
            { label: '도착지 계단 추가', value: result.toExtra > 0 ? `${fmt(result.toExtra)}원` : '없음' },
            { label: '성수기 가산', value: season === '수기' ? '+20%' : '없음' },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-muted">{row.label}</span>
              <span className="font-semibold">{row.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 text-xs text-muted">
          <Info size={14} className="flex-shrink-0 mt-0.5 text-primary" />
          <p>실제 견적은 이삿짐 양, 포장재, 특수 가구(피아노, 대형 TV 등) 유무에 따라 달라집니다. 반드시 업체에서 직접 견적을 받아보세요.</p>
        </div>
      </Card>
    </div>
  );
}
