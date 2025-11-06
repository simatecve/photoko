import React from 'react';

// Icon Component
interface IconProps {
  name: string;
  className?: string;
}
export const Icon: React.FC<IconProps> = ({ name, className }) => (
  <i className={`fa-solid fa-${name} ${className || ''}`}></i>
);

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  className?: string;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, className, ...props }, ref) => {
    const baseClasses = 'px-6 py-3 font-semibold rounded-xl text-base transition-all duration-200 ease-out focus-ring flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'gradient-primary text-white shadow-lg hover:shadow-cyan-500/20 active:translate-y-px',
      secondary: 'bg-[#0F172A] text-slate-200 border border-white/10 hover:bg-white/5 active:bg-white/10',
      ghost: 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200',
    };

    return (
      <button ref={ref} className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// Spinner Component
export const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-spin rounded-full border-2 border-slate-500 border-t-cyan-500 h-5 w-5 ${className}`}></div>
);
