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
    primary: 'bg-transparent hover:bg-blue-100 text-blue-600',
    secondary: 'bg-transparent hover:bg-gray-100 text-gray-600',
    success: 'bg-transparent hover:bg-green-100 text-green-600',
    danger: 'bg-transparent hover:bg-red-100 text-red-600',
    warning: 'bg-transparent hover:bg-yellow-100 text-yellow-500',
    info: 'bg-transparent hover:bg-cyan-100 text-cyan-600',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900'
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
