import { BaseButtonProps } from './types';

export const TextButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  ariaLabel
} : BaseButtonProps) => {

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-1.5 text-base',
    lg: 'px-4 py-2 text-lg'
  };
  
  const variantClasses = {
    primary: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
    secondary: 'text-gray-600 hover:text-gray-700 hover:bg-gray-50',
    success: 'text-green-600 hover:text-green-700 hover:bg-green-50',
    danger: 'text-red-600 hover:text-red-700 hover:bg-red-50',
    warning: 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50',
    info: 'text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center gap-2 
        font-medium rounded-lg 
        bg-transparent border-0
        transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'cursor-wait' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
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
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};