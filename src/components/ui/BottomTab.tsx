import { Home, Clock, Share2, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function BottomTab({ isDark }: { isDark: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isBlog = location.pathname === '/blog' || location.pathname.startsWith('/blog/');

  const tabColor = isDark ? 'rgba(255,255,255,0.4)' : '#a1a1aa';
  const activeColor = '#6366f1';
  const bg = isDark ? '#1c1c1e' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)';

  const tabs = [
    { id: 'home', icon: Home, label: '홈', action: () => navigate('/'), active: isHome },
    { id: 'blog', icon: BookOpen, label: '가이드', action: () => navigate('/blog'), active: isBlog },
    { id: 'history', icon: Clock, label: '최근기록', action: () => {
      // We can emit a custom event to open the modal from App.tsx
      window.dispatchEvent(new CustomEvent('open-history'));
    }, active: false },
    { id: 'share', icon: Share2, label: '공유', action: () => {
        if (navigator.share) {
          navigator.share({
            title: '별의별 계산기',
            url: window.location.href,
          }).catch(() => {});
        } else {
          navigator.clipboard.writeText(window.location.href);
          window.dispatchEvent(new CustomEvent('show-toast', { detail: '링크가 복사되었습니다!' }));
        }
      }, active: false
    }
  ];

  return (
    <div className="lg:hidden" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 65, background: bg, borderTop: `1px solid ${border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
    }}>
      {tabs.map((t) => (
        <button key={t.id}
          onClick={t.action}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 4, color: t.active ? activeColor : tabColor,
            flex: 1, padding: '10px 0',
            transition: 'color 0.2s'
          }}>
          <t.icon size={22} strokeWidth={t.active ? 2.5 : 2} />
          <span style={{ fontSize: 10, fontWeight: t.active ? 700 : 500 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
