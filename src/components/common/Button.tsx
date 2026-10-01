import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'whatsapp' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';

  const variantStyles = {
    primary: 'bg-actionBlue hover:bg-blue-700 text-white rounded-sm shadow-sm hover:shadow',
    secondary: 'bg-brandNavy hover:bg-slate-800 text-white rounded-sm shadow-sm',
    outline: 'bg-white hover:bg-canvas text-brandNavy border border-cardBorder rounded-sm',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-sm',
    whatsapp: 'bg-green-500 hover:bg-green-600 text-white rounded-sm shadow-sm',
    ghost: 'hover:bg-slate-100 text-mutedText hover:text-brandNavy rounded-sm',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
