import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react';
import { ActionButton } from '../Button';

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorCard = ({ message, onRetry, retryText }: ErrorCardProps) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md w-full">
        <div className="flex flex-col items-center text-center gap-2">
          {/* Icon */}
          <div className="bg-red-100 rounded-full p-3 m-6">
            <AlertCircleIcon className="text-red-600" size={34} />
          </div>

          {/* Tittle */}
          <h3 className="text-lg font-semibold text-red-900 mb-3">¡Ha ocurrido un error!</h3>

          {/* Message */}
          <p className="text-red-700 text-sm mb-8">{message}</p>

          {/* Retry button */}
          {onRetry && (
            <ActionButton
              onClick={onRetry}
              variant="danger"
              size="sm"
              icon={<RefreshCwIcon size={16} />}
            >
              {retryText || 'Reintentar'}
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  );
};
