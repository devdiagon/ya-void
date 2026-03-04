import { ActionButton } from '@renderer/components';
import { Breadcrumbs } from '@renderer/components/Breadcrumbs';
import { ErrorCard, ListCard } from '@renderer/components/Card';
import { DeleteConfirmation } from '@renderer/components/DeleteConfirmation';
import { FarmWorkZoneForm } from '@renderer/components/Form';
import { Modal } from '@renderer/components/Modal';
import { useFarmWorkZones, useFarms, useModal } from '@renderer/hooks';
import { FarmWorkZoneFormData } from '@renderer/schemas/farmWorkZone.schema';
import { FarmWorkZone, WorkZone } from '@renderer/types';
import { formatDate, PAGE_SUBTITLE_CLASS } from '@renderer/utils';
import { LayoutDashboardIcon, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const FarmWorkZonesPage = () => {
  const navigate = useNavigate();
  const { workZoneId } = useParams();

  const workZoneIdNumber = Number(workZoneId);
  const parsedWorkZoneId = Number.isNaN(workZoneIdNumber) ? 0 : workZoneIdNumber;

  const [workZone, setWorkZone] = useState<WorkZone | null>(null);

  const {
    farmWorkZones,
    loading,
    errors,
    refetch,
    createFarmWorkZone,
    updateFarmWorkZone,
    deleteFarmWorkZone,
    clearError
  } = useFarmWorkZones(parsedWorkZoneId);

  const { farms } = useFarms();

  const createModal = useModal<void>({ onClose: () => clearError('create') });
  const updateModal = useModal<FarmWorkZone>({ onClose: () => clearError('update') });
  const deleteModal = useModal<FarmWorkZone>({ onClose: () => clearError('delete') });

  useEffect(() => {
    if (!parsedWorkZoneId) return;
    window.api.workZones
      .getById(parsedWorkZoneId)
      .then(setWorkZone)
      .catch(() => setWorkZone(null));
  }, [parsedWorkZoneId]);

  const resolveName = (data: FarmWorkZoneFormData) => {
    const trimmed = data.name?.trim();
    if (trimmed) return trimmed;
    return farms.find((f) => f.id === data.farmId)?.name ?? '';
  };

  const handleCreate = async (data: FarmWorkZoneFormData) => {
    await createFarmWorkZone({
      workZoneId: parsedWorkZoneId,
      farmId: data.farmId,
      name: resolveName(data)
    });
    createModal.close();
    refetch();
  };

  const handleEdit = async (data: FarmWorkZoneFormData) => {
    if (!updateModal.data) return;
    await updateFarmWorkZone({
      id: updateModal.data.id,
      workZoneId: parsedWorkZoneId,
      farmId: data.farmId,
      name: resolveName(data)
    });
    updateModal.close();
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteModal.data) return;
    await deleteFarmWorkZone(deleteModal.data.id);
    deleteModal.close();
  };

  const handleNavigate = (fwz: FarmWorkZone) => {
    navigate(`/work-zones/${parsedWorkZoneId}/farms/${fwz.id}`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200 bg-white">
        <Breadcrumbs
          items={[
            { label: 'Reportes', path: '/work-zones' },
            { label: workZone?.name ?? workZoneId ?? '', path: '#' }
          ]}
        />

        <div className="flex  items-center justify-between mt-4">
          <>
            {workZone && (
              <p className={PAGE_SUBTITLE_CLASS}>
                {formatDate(workZone.startDate)} - {formatDate(workZone.endDate)}
              </p>
            )}
          </>
          <ActionButton
            variant="primary"
            size="md"
            icon={<PlusIcon size={18} />}
            onClick={() => createModal.open()}
          >
            Añadir Finca
          </ActionButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-auto bg-gray-50">
        {errors.fetch ? (
          <div className="h-full flex items-center justify-center">
            <ErrorCard
              message={errors.fetch}
              onRetry={() => window.location.reload()}
              retryText="Reintentar"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {farmWorkZones.map((fwz) => (
              <ListCard
                key={fwz.id}
                title={fwz.name}
                subtitle="Clic para revisar detalles"
                icon={<LayoutDashboardIcon size={24} />}
                iconBgColor="#60c0eaff"
                loading={loading}
                onNavigate={() => handleNavigate(fwz)}
                onEdit={() => updateModal.open(fwz)}
                onDelete={() => deleteModal.open(fwz)}
              />
            ))}
            {!loading && farmWorkZones.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500">
                No hay fincas registradas para este reporte
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={createModal.isOpen} onClose={createModal.close} size="lg">
        <FarmWorkZoneForm
          title="Añadir Finca a Reporte"
          farms={farms}
          onCancel={createModal.close}
          onConfirm={handleCreate}
        />
      </Modal>

      <Modal isOpen={updateModal.isOpen} onClose={updateModal.close} size="lg">
        {updateModal.data && (
          <FarmWorkZoneForm
            title="Editar Finca en Reporte"
            farms={farms}
            initialData={{
              farmId: updateModal.data.farmId,
              name: updateModal.data.name
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
