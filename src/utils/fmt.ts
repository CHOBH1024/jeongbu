/** 원 단위 숫자를 한국식 억/만 단위로 축약 */
export function fmtKRW(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000_000_000) return sign + (abs / 1_000_000_000_000).toFixed(1) + '조';
  if (abs >= 100_000_000) return sign + (abs / 100_000_000).toFixed(1) + '억';
  if (abs >= 10_000) return sign + (abs / 10_000).toFixed(0) + '만';
  return sign + Math.round(abs).toLocaleString('ko-KR');
}

/** 원 단위 전체 표시 (콤마 포함, ₩ 접두사) */
export function fmtKRWFull(n: number): string {
  return '₩' + Math.round(n).toLocaleString('ko-KR');
}

/** 원 단위 전체 표시 (콤마 포함, 원 접미사) */
export function fmtWon(n: number): string {
  return Math.round(n).toLocaleString('ko-KR') + '원';
}

/** 퍼센트 표시 */
export function fmtPct(r: number, decimals = 1): string {
  return (r * 100).toFixed(decimals) + '%';
}

/** 숫자 콤마 표시 */
export function fmtNum(n: number): string {
  return Math.round(n).toLocaleString('ko-KR');
}

/** 억/만원 레이블 포함 표시 */
export function fmtKRWLabel(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 100_000_000) {
    const uk = abs / 100_000_000;
    const man = (abs % 100_000_000) / 10_000;
    if (man > 0) return sign + uk.toFixed(0) + '억 ' + man.toFixed(0) + '만원';
    return sign + uk.toFixed(1) + '억원';
  }
  if (abs >= 10_000) return sign + (abs / 10_000).toFixed(0) + '만원';
  return sign + Math.round(abs).toLocaleString('ko-KR') + '원';
}
