import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  description,
  icon,
  accentColor,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl p-6 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-1' : ''
      } ${className}`}
    >
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-5">
          {icon && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: accentColor
                  ? `${accentColor}18`
                  : 'rgba(99,102,241,0.1)',
                color: accentColor || 'var(--color-primary)',
              }}
            >
              {icon}
            </div>
          )}
          <div>
            {title && <h3 className="text-lg font-bold leading-tight">{title}</h3>}
            {description && (
              <p className="text-sm text-muted mt-0.5">{description}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-dark shadow-glow hover:shadow-lg active:scale-95',
    secondary:
      'bg-secondary text-white hover:opacity-90 active:scale-95',
    outline:
      'border-2 border-primary text-primary bg-transparent hover:bg-primary/5 active:scale-95',
    ghost:
      'text-muted hover:bg-black/5 dark:hover:bg-white/5 active:scale-95',
    danger:
      'bg-danger text-white hover:opacity-90 active:scale-95',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  return (
    <button
      className={`font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  unit?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  hint,
  unit,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-muted px-1">{label}</label>
      )}
      <div className="relative">
        <input
          className={`w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-sm ${unit ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted font-medium">
            {unit}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-muted px-1">{hint}</p>}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sub,
  color = 'var(--color-primary)',
  icon,
}) => (
  <div className="glass rounded-2xl p-5 text-center space-y-1">
    {icon && (
      <div className="flex justify-center mb-2" style={{ color }}>
        {icon}
      </div>
    )}
    <p className="text-xs font-semibold text-muted uppercase tracking-wide">{label}</p>
    <p className="text-2xl font-extrabold" style={{ color }}>
      {value}
    </p>
    {sub && <p className="text-xs text-muted">{sub}</p>}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'soon' | 'new' }> = ({
  children,
  variant = 'default',
}) => {
  const styles = {
    default: 'bg-primary/10 text-primary',
    soon: 'bg-slate-100 dark:bg-slate-800 text-muted',
    new: 'bg-secondary/10 text-secondary',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
};
