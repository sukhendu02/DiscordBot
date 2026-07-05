import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-surface-100 text-surface-900 hover:bg-surface-200 focus:ring-surface-500',
  danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
  ghost: 'bg-transparent text-surface-600 hover:bg-surface-100 focus:ring-surface-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-5 py-2.5 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        variants[variant]
      } ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
