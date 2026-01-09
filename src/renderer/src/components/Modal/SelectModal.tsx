import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { ActionButton, OutlineButton } from '../Button';

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

  useEffect(() => {
    if (isOpen) {
      setSelectedValue(defaultValue || '');
    }
  }, [isOpen, defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (required && !selectedValue) {
      return;
    }

    onConfirm(selectedValue);
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
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <select
            id="select-option"
            value={selectedValue}
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
          <ActionButton type="submit" variant="primary" disabled={required && !selectedValue}>
            Guardar
          </ActionButton>
        </div>
      </form>
    </Modal>
  );
};
