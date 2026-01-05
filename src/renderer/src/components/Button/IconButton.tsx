import { ReactNode } from 'react';

export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'ghost';

export interface IconButtonProps {
  icon: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  rounded?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel: string;
  tooltip?: string;
}

export const IconButton = ({
  icon,
  onClick,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'ghost',
  rounded = false,
  className = '',
  type = 'button',
  ariaLabel,
  tooltip
}: IconButtonProps) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-14 h-14 text-xl'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
    info: 'bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus:ring-gray-400'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      title={tooltip || ariaLabel}
      className={`
        inline-flex items-center justify-center
        flex-shrink-0
        font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${rounded ? 'rounded-full' : 'rounded-lg'}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${loading ? 'cursor-wait' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <span className="flex items-center justify-center">{icon}</span>
      )}
    </button>
  );
};
