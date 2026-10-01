'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'golden' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-agri-green focus-visible:ring-offset-2 focus-visible:ring-offset-agri-cream disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-6 py-3 gap-2.5 shadow-sm',
    };

    const variantStyles = {
      primary:
        'bg-agri-green text-white hover:bg-agri-green-dark shadow-sm hover:shadow-subtle active:bg-agri-green-dark',
      secondary:
        'bg-agri-pale text-agri-green-dark hover:bg-emerald-100/80 border border-emerald-200/60',
      golden:
        'bg-agri-yellow text-agri-dark hover:bg-amber-400 shadow-sm font-bold',
      outline:
        'bg-white text-agri-dark border border-agri-border hover:border-agri-green hover:bg-agri-pale/40 hover:text-agri-green-dark',
      ghost:
        'text-agri-secondary hover:text-agri-green-dark hover:bg-agri-pale/50',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
