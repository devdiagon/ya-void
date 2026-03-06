import { ActionButton } from '@renderer/components';
import { Breadcrumbs } from '@renderer/components/Breadcrumbs';
import { DeleteConfirmation } from '@renderer/components/DeleteConfirmation';
import { WorkZoneSheetForm } from '@renderer/components/Form';
import { Modal } from '@renderer/components/Modal';
import { useAreas, useModal, useWorkZoneSheets } from '@renderer/hooks';
import { WorkZoneSheetFormData } from '@renderer/schemas/workZoneSheet.schema';
import { FarmWorkZone, WorkZone, WorkZoneSheet } from '@renderer/types';
import { formatDate, PAGE_SUBTITLE_CLASS } from '@renderer/utils';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SheetTabs } from './SheetTabs';
import { TripTable } from './TripTable';

export const WorkZoneSheetsPage = () => {
  const { workZoneId, farmWorkZoneId } = useParams();

  const parsedWorkZoneId = Number.isNaN(Number(workZoneId)) ? 0 : Number(workZoneId);
  const parsedFarmWorkZoneId = Number.isNaN(Number(farmWorkZoneId)) ? 0 : Number(farmWorkZoneId);

  const [workZone, setWorkZone] = useState<WorkZone | null>(null);
  const [farmWorkZone, setFarmWorkZone] = useState<FarmWorkZone | null>(null);
  const [activeSheetId, setActiveSheetId] = useState<number | null>(null);

  const { areas, createArea, refetch: refetchAreas } = useAreas(farmWorkZone?.farmId ?? 0);

  const {
    workZoneSheets,
    loading,
    errors,
    refetch,
    createWorkZoneSheet,
    updateWorkZoneSheet,
    deleteWorkZoneSheet,
    clearError
  } = useWorkZoneSheets(parsedFarmWorkZoneId);

  const createModal = useModal<void>({ onClose: () => clearError('create') });
  const updateModal = useModal<WorkZoneSheet>({ onClose: () => clearError('update') });
  const deleteModal = useModal<WorkZoneSheet>({ onClose: () => clearError('delete') });

  // Load context entities
  useEffect(() => {
    if (!parsedWorkZoneId) return;
    window.api.workZones
      .getById(parsedWorkZoneId)
      .then(setWorkZone)
      .catch(() => setWorkZone(null));
  }, [parsedWorkZoneId]);

  useEffect(() => {
    if (!parsedFarmWorkZoneId) return;
    window.api.farmWorkZones
      .getById(parsedFarmWorkZoneId)
      .then(setFarmWorkZone)
      .catch(() => setFarmWorkZone(null));
  }, [parsedFarmWorkZoneId]);

  // Derive the effective active id: keep selection if still valid, else default to first sheet
  const effectiveActiveSheetId =
    activeSheetId !== null && workZoneSheets.some((s) => s.id === activeSheetId)
      ? activeSheetId
      : (workZoneSheets[0]?.id ?? null);

  const activeSheet = workZoneSheets.find((s) => s.id === effectiveActiveSheetId) ?? null;

  const resolveName = (data: WorkZoneSheetFormData) => {
    const trimmed = data.name?.trim();
    if (trimmed) return trimmed;
    return areas.find((a) => a.id === data.areaId)?.name ?? '';
  };

  const handleCreate = async (data: WorkZoneSheetFormData) => {
    await createWorkZoneSheet({
      name: resolveName(data),
      farmWorkZoneId: parsedFarmWorkZoneId,
      areaId: data.areaId,
      totalSheet: 0
    });
    createModal.close();
    refetch();
    refetchAreas();
  };

  const handleEdit = async (data: WorkZoneSheetFormData) => {
    if (!updateModal.data) return;
    await updateWorkZoneSheet({
      id: updateModal.data.id,
      name: resolveName(data),
      farmWorkZoneId: parsedFarmWorkZoneId,
      areaId: data.areaId,
      totalSheet: updateModal.data.totalSheet
    });
    updateModal.close();
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteModal.data) return;
    await deleteWorkZoneSheet(deleteModal.data.id);
    deleteModal.close();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200 bg-white">
        <Breadcrumbs
          items={[
            { label: 'Reportes', path: '/work-zones' },
            {
              label: workZone?.name ?? workZoneId ?? '',
              path: `/work-zones/${parsedWorkZoneId}/farms`
            },
            { label: farmWorkZone?.name ?? farmWorkZoneId ?? '', path: '#' }
          ]}
        />

        <div className="flex items-center justify-between mt-4">
          {workZone && (
            <p className={PAGE_SUBTITLE_CLASS}>
              {formatDate(workZone.startDate)} - {formatDate(workZone.endDate)}
            </p>
          )}

          <ActionButton
            variant="primary"
            size="md"
            icon={<PlusIcon size={18} />}
            onClick={() => createModal.open()}
          >
            Nueva Hoja
          </ActionButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Tab bar */}
        {!loading && workZoneSheets.length > 0 && (
          <div className="px-6 pt-4">
            <SheetTabs
              sheets={workZoneSheets}
              activeSheetId={effectiveActiveSheetId}
              onSelect={setActiveSheetId}
              onEdit={(sheet) => updateModal.open(sheet)}
              onDelete={(sheet) => deleteModal.open(sheet)}
            />
          </div>
        )}

        {/* Sheet content or empty state */}
        <div className="flex-1 px-6 py-6 overflow-auto">
          {errors.fetch ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-red-500">{errors.fetch}</p>
            </div>
          ) : !loading && workZoneSheets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
              <p className="text-gray-400 text-sm">No hay hojas de trabajo registradas</p>
              <ActionButton
                variant="primary"
                size="md"
                icon={<PlusIcon size={18} />}
                onClick={() => createModal.open()}
              >
                Crear primera hoja
              </ActionButton>
            </div>
          ) : activeSheet ? (
            <TripTable
              workZoneSheetId={activeSheet.id}
              sheetName={activeSheet.name}
              areaId={activeSheet.areaId}
              parentAreaName={areas.find((a) => a.id === activeSheet.areaId)?.name ?? ''}
              parentFarmName={farmWorkZone?.name ?? ''}
              sheetStartDate={formatDate(workZone?.startDate ?? '')}
              sheetEndDate={formatDate(workZone?.endDate ?? '')}
            />
          ) : null}
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={createModal.isOpen} onClose={createModal.close} size="lg">
        <WorkZoneSheetForm
          title="Nueva Hoja"
          areas={areas}
          farmId={farmWorkZone?.farmId}
          onCreateArea={createArea}
          onCancel={createModal.close}
          onConfirm={handleCreate}
        />
      </Modal>

      <Modal isOpen={updateModal.isOpen} onClose={updateModal.close} size="lg">
        {updateModal.data && (
          <WorkZoneSheetForm
            title="Editar Hoja"
            submitLabel="Guardar Hoja"
            areas={areas}
            initialData={{
              name: updateModal.data.name,
              areaId: updateModal.data.areaId
            }}
            onCancel={updateModal.close}
            onConfirm={handleEdit}
          />
        )}
      </Modal>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} size="lg">
        <DeleteConfirmation
          itemName={deleteModal.data?.name ?? ''}
          onConfirm={handleDelete}
          onCancel={deleteModal.close}
        />
      </Modal>
    </div>
  );
};
