import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@mui/material';
import { FarmFormData, FarmSchema } from '@renderer/schemas/farm.schema';
import { useForm } from 'react-hook-form';
import { ActionButton, OutlineButton } from '../Button';

interface AdminFarmFormProps {
  title: string;
  initialData?: FarmFormData;
  handleCancel?: () => void;
  onConfirm: (data: FarmFormData) => void | Promise<void>;
}

export const AdminFarmForm = ({
  title,
  initialData,
  handleCancel,
  onConfirm
}: AdminFarmFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FarmFormData>({
    resolver: zodResolver(FarmSchema),
    defaultValues: initialData || { name: '' }
  });

  const onFormSubmit = async (data: FarmFormData) => {
    try {
      await onConfirm(data);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <h3 className="text-lg font-bold">{title}</h3>
      <TextField
        fullWidth
        label="Nombre"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name ? errors.name.message : ''}
        disabled={isSubmitting}
      />
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
