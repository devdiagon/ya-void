import { FormWorkZoneDTO } from '@renderer/types';
import { FormEvent, useMemo, useState } from 'react';
import { ActionButton, OutlineButton } from '../Button';

interface WorkZoneFormProps {
  title: string;
  initialData?: FormWorkZoneDTO;
  onCancel: () => void;
  onConfirm: (data: FormWorkZoneDTO) => Promise<void>;
}

export const WorkZoneForm = ({ title, initialData, onCancel, onConfirm }: WorkZoneFormProps) => {
  const [formData, setFormData] = useState<FormWorkZoneDTO>(
    initialData ?? {
      name: '',
      startDate: '',
      endDate: ''
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isInvalid = useMemo(() => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      return true;
    }

    return new Date(formData.startDate) > new Date(formData.endDate);
  }, [formData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (isInvalid) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      <div className="space-y-4 pt-2">
        <div>
          <label htmlFor="work-zone-name" className="mb-1 block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            id="work-zone-name"
            type="text"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="work-zone-start-date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Fecha inicio
            </label>
            <input
              id="work-zone-start-date"
              type="date"
              value={formData.startDate}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, startDate: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label
              htmlFor="work-zone-end-date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Fecha fin
            </label>
            <input
              id="work-zone-end-date"
              type="date"
              value={formData.endDate}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, endDate: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        {new Date(formData.startDate) > new Date(formData.endDate) && (
          <p className="text-sm text-red-600">
            La fecha de inicio no puede ser mayor que la fecha fin.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <OutlineButton type="button" onClick={onCancel} disabled={isSubmitting} variant="primary">
          Cancelar
        </OutlineButton>
        <ActionButton type="submit" variant="primary" disabled={isSubmitting || isInvalid}>
          Guardar
        </ActionButton>
      </div>
    </form>
  );
};
