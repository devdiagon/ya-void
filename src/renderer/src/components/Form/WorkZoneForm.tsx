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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            fullWidth
            label="Fecha inicio"
            type="date"
            {...register('startDate')}
            error={!!errors.startDate}
            helperText={errors.startDate?.message ?? ''}
            disabled={isSubmitting}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            fullWidth
            label="Fecha fin"
            type="date"
            {...register('endDate')}
            error={!!errors.endDate}
            helperText={errors.endDate?.message ?? ''}
            disabled={isSubmitting}
            slotProps={{ inputLabel: { shrink: true } }}
          />
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
