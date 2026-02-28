import { zodResolver } from '@hookform/resolvers/zod';
import { FarmWorkZoneFormData, FarmWorkZoneSchema } from '@renderer/schemas/farmWorkZone.schema';
import { Farm } from '@renderer/types';
import { LayoutDashboardIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { ActionButton, OutlineButton } from '../Button';

interface FarmWorkZoneFormProps {
  title: string;
  farms: Farm[];
  initialData?: FarmWorkZoneFormData;
  onCancel: () => void;
  onConfirm: (data: FarmWorkZoneFormData) => Promise<void>;
}

export const FarmWorkZoneForm = ({
  title,
  farms,
  initialData,
  onCancel,
  onConfirm
}: FarmWorkZoneFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FarmWorkZoneFormData>({
    resolver: zodResolver(FarmWorkZoneSchema),
    defaultValues: initialData ?? { farmId: 0, name: '' }
  });

  const onFormSubmit = async (data: FarmWorkZoneFormData) => {
    try {
      await onConfirm(data);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      <div className="space-y-4">
        {/* Farm select */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Finca <span className="text-red-500">*</span>
          </label>
          <Controller
            name="farmId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                disabled={isSubmitting}
                className={`w-full rounded-md border px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  errors.farmId ? 'border-red-400' : 'border-gray-300'
                }`}
              >
                <option value={0} disabled>
                  — Seleccione una finca —
                </option>
                {farms.map((farm) => (
                  <option key={farm.id} value={farm.id}>
                    {farm.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.farmId ? (
            <p className="text-xs text-red-500">{errors.farmId.message}</p>
          ) : (
            <p className="text-xs text-gray-500">
              Seleccione la finca que desea añadir a esta zona de trabajo
            </p>
          )}
        </div>

        {/* Name field (optional) */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Nombre para esta relación <span className="font-normal text-gray-400">(opcional)</span>
          </label>
          <input
            type="text"
            {...register('name')}
            placeholder="Ej: Cosecha Principal, Zona Norte, etc."
            disabled={isSubmitting}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <p className="text-xs text-gray-500">
            Por defecto se usará el nombre de la finca seleccionada
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <ActionButton
          type="submit"
          variant="primary"
          fullWidth
          icon={<LayoutDashboardIcon size={16} />}
          disabled={isSubmitting}
        >
          Añadir Finca
        </ActionButton>
        <OutlineButton type="button" variant="primary" onClick={onCancel}>
          Cancelar
        </OutlineButton>
      </div>
    </form>
  );
};
