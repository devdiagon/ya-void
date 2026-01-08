import { TextField } from '@mui/material';
import { ActionButton, OutlineButton } from '../Button';

interface AdminFarmFormProps {
  title: string;
  required?: boolean;
  handleCancel?: () => void;
  onConfirm?: () => void;
}

export const AdminFarmForm = ({
  title,
  required = true,
  handleCancel,
  onConfirm
}: AdminFarmFormProps) => {
  return (
    <form action={onConfirm} className="space-y-4">
      <h3 className="text-lg font-bold">{title}</h3>
      <TextField fullWidth label="Nombre" name="name" required={required} />
      <div className="flex justify-end gap-3 pt-4">
        <OutlineButton type="button" variant="primary" onClick={handleCancel}>
          Cancelar
        </OutlineButton>
        <ActionButton type="submit" variant="primary" disabled={required}>
          Guardar
        </ActionButton>
      </div>
    </form>
  );
};
