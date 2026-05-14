import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, description, icon, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`glass animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-[var(--radius-md)] p-6 ${className}`}
    >
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>}
          <div>
            {title && <h3 className="text-xl font-bold">{title}</h3>}
            {description && <p className="text-sm text-muted">{description}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }> = ({ 
  children, 
  className = '', 
  variant = 'primary',
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light shadow-glow',
    secondary: 'bg-secondary text-white hover:opacity-90',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary/5',
    ghost: 'text-muted hover:bg-black/5'
  };

  return (
    <button 
      className={`px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-semibold text-muted px-1">{label}</label>}
      <input 
        className={`w-full px-4 py-3 bg-white/50 border-2 border-transparent focus:border-primary/30 rounded-xl transition-all ${className}`}
        {...props}
      />
    </div>
  );
};
