import { useEffect, useRef } from 'react';

interface Props {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

const PUB = 'ca-pub-9992037844935954';

export function AdUnit({ slot, format = 'auto', fullWidth = false, style }: Props) {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch (_) { /* ignore */ }
  }, [slot]);

  if (!slot) return null;

  return (
    <div style={{ textAlign: 'center', overflow: 'hidden', ...style }}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block', ...(fullWidth && { width: '100%' }) }}
        data-ad-client={PUB}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidth ? 'true' : 'false'}
      />
    </div>
  );
}

/** 계산기 결과 하단 — 직사각형 반응형 */
export function AdResult() {
  const slot = import.meta.env.VITE_AD_SLOT_RESULT ?? '';
  return <AdUnit slot={slot} format="rectangle" fullWidth style={{ margin: '28px 0 0' }} />;
}

/** 카테고리 목록 중간 — 가로형 배너 */
export function AdBanner() {
  const slot = import.meta.env.VITE_AD_SLOT_BANNER ?? '';
  return <AdUnit slot={slot} format="horizontal" fullWidth style={{ margin: '24px 0' }} />;
}
