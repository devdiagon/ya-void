import { useState } from 'react';
import { ActionButton, OutlineButton } from '../Button';
import { Modal } from './Modal';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectModalProps {
  isOpen: boolean;
  title: string;
  defaultValue?: string;
  required?: boolean;
  options: SelectOption[];
  onConfirm: (selectedValue: string | number) => void;
  onClose: () => void;
}

export const SelectModal = ({
  isOpen,
  title,
  defaultValue,
  required = true,
  options,
  onConfirm,
  onClose
}: SelectModalProps) => {
  const [selectedValue, setSelectedValue] = useState<string | number>('');

  const currentValue = selectedValue || defaultValue || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (required && !currentValue) {
      return;
    }

    onConfirm(currentValue);
    handleClose();
  };

  const handleClose = () => {
    setSelectedValue('');
    onClose();
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div>
          <select
            id="select-option"
            value={currentValue}
            onChange={handleSelectChange}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <OutlineButton type="button" variant="primary" onClick={handleClose}>
            Cancelar
          </OutlineButton>
          <ActionButton type="submit" variant="primary" disabled={required && !currentValue}>
            Guardar
          </ActionButton>
        </div>
      </form>
    </Modal>
  );
};
