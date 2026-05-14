import React from 'react';

/* ── Design tokens ── */
export const TOKEN = {
  primary:   '#6366f1',
  secondary: '#8b5cf6',
  success:   '#10b981',
  warning:   '#f59e0b',
  danger:    '#ef4444',
  pink:      '#ec4899',
};

/* ── Card ── */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, description, icon, accentColor, onClick }) => {
  const color = accentColor || TOKEN.primary;
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: '#fff',
        borderRadius: 20,
        padding: 28,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={onClick ? (e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.08)';
      } : undefined}
      onMouseLeave={onClick ? (e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'none';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)';
      } : undefined}
    >
      {(title || icon) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          {icon && (
            <div style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${color}15`, color,
            }}>
              {icon}
            </div>
          )}
          <div>
            {title && <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.01em' }}>{title}</h3>}
            {description && <p style={{ fontSize: 13, color: '#6e6e73', marginTop: 2 }}>{description}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

/* ── StatCard ── */
interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, color = TOKEN.primary, icon }) => (
  <div style={{
    background: '#fff',
    borderRadius: 18,
    padding: '22px 18px',
    textAlign: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
  }}>
    {icon && (
      <div style={{
        width: 40, height: 40, borderRadius: 12, marginBottom: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}12`, color,
      }}>
        {icon}
      </div>
    )}
    <p style={{ fontSize: 12, fontWeight: 700, color: '#8e8e93', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</p>
    <p className="num" style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1.1 }}>{value}</p>
    {sub && <p style={{ fontSize: 12, color: '#aeaeb2', fontWeight: 500 }}>{sub}</p>}
  </div>
);

/* ── Button ── */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', size = 'md', style: extStyle, ...props }) => {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontWeight: 700, borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s',
    border: 'none', fontFamily: 'inherit',
  };
  const variantStyles: Record<string, React.CSSProperties> = {
    primary:   { background: TOKEN.primary, color: '#fff', boxShadow: `0 4px 14px ${TOKEN.primary}40` },
    secondary: { background: TOKEN.secondary, color: '#fff' },
    outline:   { background: 'transparent', color: TOKEN.primary, border: `2px solid ${TOKEN.primary}` },
    ghost:     { background: 'rgba(0,0,0,0.04)', color: '#3a3a3c' },
    danger:    { background: TOKEN.danger, color: '#fff' },
  };
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '8px 16px', fontSize: 13 },
    md: { padding: '12px 24px', fontSize: 15 },
    lg: { padding: '16px 32px', fontSize: 17 },
  };
  return (
    <button className={className} style={{ ...base, ...variantStyles[variant], ...sizeStyles[size], ...extStyle }} {...props}>
      {children}
    </button>
  );
};

/* ── Input ── */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  unit?: string;
}

export const Input: React.FC<InputProps> = ({ label, hint, unit, className = '', style: extStyle, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 700, color: '#6e6e73' }}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          className={className}
          style={{
            width: '100%', padding: unit ? '12px 44px 12px 16px' : '12px 16px',
            background: '#f9f9fb', border: '1.5px solid #e5e5ea',
            borderRadius: 12, fontSize: 14, color: '#1d1d1f',
            fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s, background 0.15s',
            boxSizing: 'border-box',
            ...extStyle,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = TOKEN.primary; e.currentTarget.style.background = '#fff'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5ea'; e.currentTarget.style.background = '#f9f9fb'; }}
          {...props}
        />
        {unit && (
          <span style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 13, color: '#8e8e93', fontWeight: 600, pointerEvents: 'none',
          }}>
            {unit}
          </span>
        )}
      </div>
      {hint && <p style={{ fontSize: 12, color: '#8e8e93', lineHeight: 1.6 }}>{hint}</p>}
    </div>
  );
};

/* ── Badge ── */
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'soon' | 'new' }> = ({ children, variant = 'default' }) => {
  const badgeStyles: Record<string, React.CSSProperties> = {
    default: { background: `${TOKEN.primary}15`, color: TOKEN.primary },
    soon:    { background: '#f2f2f7', color: '#8e8e93' },
    new:     { background: `${TOKEN.success}15`, color: TOKEN.success },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700,
      ...badgeStyles[variant],
    }}>
      {children}
    </span>
  );
};

/* ── Divider ── */
export const Divider: React.FC<{ label?: string }> = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
    <div style={{ flex: 1, height: 1, background: '#e5e5ea' }}/>
    {label && <span style={{ fontSize: 12, fontWeight: 700, color: '#aeaeb2', whiteSpace: 'nowrap' }}>{label}</span>}
    <div style={{ flex: 1, height: 1, background: '#e5e5ea' }}/>
  </div>
);

/* ── InfoBox ── */
export const InfoBox: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = TOKEN.primary }) => (
  <div style={{
    padding: '14px 18px', borderRadius: 14, lineHeight: 1.75,
    background: `${color}08`, border: `1px solid ${color}20`,
    fontSize: 13, color: '#3a3a3c',
  }}>
    {children}
  </div>
);

/* ── ResultBox ── */
export const ResultBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    padding: '20px 24px', borderRadius: 16,
    background: 'linear-gradient(135deg, #eef2ff 0%, #fdf4ff 100%)',
    border: '1px solid rgba(99,102,241,0.15)',
    fontSize: 14, color: '#3a3a3c', lineHeight: 1.8,
  }}>
    {children}
  </div>
);
