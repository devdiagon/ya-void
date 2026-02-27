import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@mui/material';
import { WorkZoneFormData, WorkZoneSchema } from '@renderer/schemas/workZone.schema';
import { useForm } from 'react-hook-form';
import { ActionButton, OutlineButton } from '../Button';

interface WorkZoneFormProps {
  title: string;
  initialData?: WorkZoneFormData;
  onCancel: () => void;
  onConfirm: (data: WorkZoneFormData) => Promise<void>;
}

export const WorkZoneForm = ({ title, initialData, onCancel, onConfirm }: WorkZoneFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<WorkZoneFormData>({
    resolver: zodResolver(WorkZoneSchema),
    defaultValues: initialData ?? { name: '', startDate: '', endDate: '' }
  });

  const onFormSubmit = async (data: WorkZoneFormData) => {
    try {
      await onConfirm(data);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      <div className="space-y-4 pt-2">
        <TextField
          fullWidth
          label="Nombre"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message ?? ''}
          disabled={isSubmitting}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Fecha inicio</label>
            <input
              type="date"
              {...register('startDate')}
              disabled={isSubmitting}
              className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
            {errors.startDate && <p className="text-xs text-red-600">{errors.startDate.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Fecha fin</label>
            <input
              type="date"
              {...register('endDate')}
              disabled={isSubmitting}
              className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
            {errors.endDate && <p className="text-xs text-red-600">{errors.endDate.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <OutlineButton type="button" onClick={onCancel} disabled={isSubmitting} variant="primary">
          Cancelar
        </OutlineButton>
        <ActionButton type="submit" variant="primary" disabled={isSubmitting}>
          Guardar
        </ActionButton>
      </div>
    </form>
  );
};
