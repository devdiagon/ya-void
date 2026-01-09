import { AlertTriangleIcon } from 'lucide-react';
import { ActionButton, OutlineButton } from './Button';

interface DeleteConfirmationProps {
  itemName: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  error?: string | null;
  isLoading?: boolean;
  message?: string;
}

export const DeleteConfirmation = ({
  itemName,
  onConfirm,
  onCancel,
  error,
  isLoading = false,
  message = 'Esta acción no se puede deshacer.'
}: DeleteConfirmationProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
          <AlertTriangleIcon className="text-red-600" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-gray-900 mb-2">¡Advertencia!</h3>
          <p className="text-gray-700 mb-2">
            ¿Está seguro de eliminar a <span className="font-semibold">{itemName}</span>?
          </p>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-6">
        <OutlineButton type="button" variant="primary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </OutlineButton>
        <ActionButton
          type="button"
          variant="danger"
          onClick={onConfirm}
          loading={isLoading}
          disabled={isLoading}
        >
          Eliminar
        </ActionButton>
      </div>
    </div>
  );
};
