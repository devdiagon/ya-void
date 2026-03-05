import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@mui/material';
import { AreaFormData, AreaSchema } from '@renderer/schemas/area.schema';
import { useForm } from 'react-hook-form';
import { ActionButton, OutlineButton } from '../Button';

interface AdminAreaFormProps {
  title: string;
  initialData?: Partial<AreaFormData>;
  handleCancel?: () => void;
  onConfirm: (data: AreaFormData) => void | Promise<void>;
}

export const AdminAreaForm = ({
  title,
  initialData,
  handleCancel,
  onConfirm
}: AdminAreaFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AreaFormData>({
    resolver: zodResolver(AreaSchema),
    defaultValues: initialData || { name: '', managerName: '', managerCid: '' }
  });

  const onFormSubmit = async (data: AreaFormData) => {
    try {
      await onConfirm(data);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <h3 className="text-lg font-bold">{title}</h3>

      <div className="space-y-4 pt-4">
        <TextField
          fullWidth
          label="Nombre"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name ? errors.name.message : ''}
          disabled={isSubmitting}
        />
        <TextField
          fullWidth
          label="Nombre del encargado"
          {...register('managerName')}
          error={!!errors.managerName}
          helperText={errors.managerName ? errors.managerName.message : ''}
          disabled={isSubmitting}
        />
        <TextField
          fullWidth
          label="Cédula del encargado"
          {...register('managerCid')}
          error={!!errors.managerCid}
          helperText={errors.managerCid ? errors.managerCid.message : ''}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <OutlineButton type="button" variant="primary" onClick={handleCancel}>
          Cancelar
        </OutlineButton>
        <ActionButton type="submit" variant="primary" disabled={isSubmitting}>
          Guardar
        </ActionButton>
      </div>
    </form>
  );
};
