import { zodResolver } from '@hookform/resolvers/zod';
import { WorkZoneSheetFormData, WorkZoneSheetSchema } from '@renderer/schemas/workZoneSheet.schema';
import { Area } from '@renderer/types';
import { FileTextIcon } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ActionButton, OutlineButton } from '../Button';

interface WorkZoneSheetFormProps {
  title: string;
  submitLabel?: string;
  areas: Area[];
  initialData?: WorkZoneSheetFormData;
  onCancel: () => void;
  onConfirm: (data: WorkZoneSheetFormData) => Promise<void>;
}

export const WorkZoneSheetForm = ({
  title,
  submitLabel = 'Crear Hoja',
  areas,
  initialData,
  onCancel,
  onConfirm
}: WorkZoneSheetFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<WorkZoneSheetFormData>({
    resolver: zodResolver(WorkZoneSheetSchema),
    defaultValues: initialData ?? { name: '', areaId: 0 }
  });

  const selectedAreaId = useWatch({ control, name: 'areaId' });
  const selectedAreaName = areas.find((a) => a.id === selectedAreaId)?.name ?? '';

  const onFormSubmit = async (data: WorkZoneSheetFormData) => {
    try {
      await onConfirm(data);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      <div className="space-y-4">
        {/* Area select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Área <span className="text-red-500">*</span>
          </label>
          <Controller
            name="areaId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                disabled={isSubmitting}
                className={`w-full rounded-md border px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  errors.areaId ? 'border-red-400' : 'border-gray-300'
                }`}
              >
                <option value={0} disabled>
                  — Seleccione un área —
                </option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.areaId ? (
            <p className="text-xs text-red-500">{errors.areaId.message}</p>
          ) : (
            <p className="text-xs text-gray-500">
              El nombre de la hoja se asignará automáticamente según el área seleccionada
            </p>
          )}
        </div>

        {/* Name (optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Nombre de la Hoja <span className="font-normal text-gray-400">(opcional)</span>
          </label>
          <input
            type="text"
            {...register('name')}
            placeholder={selectedAreaName || 'Ej: Empaque, Logística, etc.'}
            disabled={isSubmitting}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <p className="text-xs text-gray-500">
            Por defecto se usará el nombre del área seleccionada
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <ActionButton
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          icon={<FileTextIcon size={16} />}
          disabled={isSubmitting}
        >
          {submitLabel}
        </ActionButton>
        <OutlineButton type="button" size="md" variant="primary" onClick={onCancel}>
          Cancelar
        </OutlineButton>
      </div>
    </form>
  );
};
