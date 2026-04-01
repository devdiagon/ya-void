import { zodResolver } from '@hookform/resolvers/zod';
import { WorkZoneSheetFormData, WorkZoneSheetSchema } from '@renderer/schemas/workZoneSheet.schema';
import { Area, FormAreaDTO, WorkZoneSheet } from '@renderer/types';
import { CircleXIcon, FileTextIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ActionButton, OutlineButton } from '../Button';
import { checkActiveWorkZoneSheetsName, resolveName } from '@renderer/utils';

interface WorkZoneSheetFormProps {
  title: string;
  submitLabel?: string;
  areas: Area[];
  activeWorkZoneSheets: WorkZoneSheet[];
  farmId?: number;
  initialData?: WorkZoneSheetFormData;
  onCancel: () => void;
  onConfirm: (data: WorkZoneSheetFormData) => Promise<void>;
  onCreateArea?: (data: FormAreaDTO) => Promise<Area>;
}

export const WorkZoneSheetForm = ({
  title,
  submitLabel = 'Crear Hoja',
  areas,
  activeWorkZoneSheets,
  farmId,
  initialData,
  onCancel,
  onConfirm,
  onCreateArea
}: WorkZoneSheetFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<WorkZoneSheetFormData>({
    resolver: zodResolver(WorkZoneSheetSchema),
    defaultValues: initialData ?? { name: '', areaId: 0 }
  });

  const [addNewArea, setAddNewArea] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaManager, setNewAreaManager] = useState('');
  const [newAreaCid, setNewAreaCid] = useState('');
  const [newAreaError, setNewAreaError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedAreaId = useWatch({ control, name: 'areaId' });
  const selectedAreaName = areas.find((a) => a.id === selectedAreaId)?.name ?? '';

  const onFormSubmit = async (data: WorkZoneSheetFormData) => {
    try {
      // Check if the area name doesn't exist in the same work zone sheet
      if (checkActiveWorkZoneSheetsName(activeWorkZoneSheets, resolveName(areas, data))) {
        setSubmitError(
          `Ya existe una hoja con el nombre '${resolveName(areas, data)}'. Utilice otro nombre.`
        );
        return;
      }

      // Clear previous error message
      setSubmitError(null);

      if (addNewArea) {
        if (!newAreaName.trim()) {
          setNewAreaError('El nombre del área es obligatorio');
          return;
        }
        if (!onCreateArea || !farmId) return;
        setNewAreaError(null);
        const created = await onCreateArea({
          name: newAreaName.trim(),
          farmId,
          managerName: newAreaManager.trim() || null,
          managerCid: newAreaCid.trim() || null
        });
        // Pass the area name directly so the parent doesn't need to look it up in stale state
        await onConfirm({ name: data.name?.trim() || created.name, areaId: created.id });
      } else {
        await onConfirm(data);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  // When addNewArea is active bypass RHF's areaId validation entirely
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (addNewArea) {
      onFormSubmit({ name: getValues('name') ?? '', areaId: 0 });
    } else {
      handleSubmit(onFormSubmit)(e);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      <div className="space-y-4">
        {/* Area select or new area form */}
        {!addNewArea ? (
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
        ) : (
          <div className="flex flex-col gap-3 rounded-md border border-blue-200 bg-blue-50 p-3">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
              Nueva área
            </p>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newAreaName}
                onChange={(e) => {
                  setNewAreaName(e.target.value);
                  setNewAreaError(null);
                }}
                placeholder="Ej: Empaque Norte"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {newAreaError && <p className="text-xs text-red-500">{newAreaError}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Encargado</label>
              <input
                type="text"
                value={newAreaManager}
                onChange={(e) => setNewAreaManager(e.target.value)}
                placeholder="Nombre del encargado"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Cédula encargado</label>
              <input
                type="text"
                value={newAreaCid}
                onChange={(e) => setNewAreaCid(e.target.value)}
                placeholder="Cédula"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Checkbox toggle */}
        {onCreateArea && (
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={addNewArea}
              onChange={(e) => {
                setAddNewArea(e.target.checked);
                setNewAreaError(null);
              }}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Añadir nueva área</span>
          </label>
        )}

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

      {/* Error Feedback */}
      {submitError && (
        <div className="flex items-center justify-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-1 max-w-md w-full">
            <div className="flex items-center text-center gap-2">
              <div className="p-3 m-6">
                <CircleXIcon className="text-red-600" size={32} />
              </div>
              <p className="text-red-700 text-sm text-left mb-8">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
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
