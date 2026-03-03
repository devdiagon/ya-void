import { ActionButton } from '@renderer/components';
import { ErrorCard, ListCard } from '@renderer/components/Card';
import { DeleteConfirmation } from '@renderer/components/DeleteConfirmation';
import { WorkZoneForm } from '@renderer/components/Form';
import { Modal } from '@renderer/components/Modal';
import { useModal, useWorkZones } from '@renderer/hooks';
import { WorkZoneFormData } from '@renderer/schemas/workZone.schema';
import { WorkZone } from '@renderer/types';
import { PAGE_SUBTITLE_CLASS, PAGE_TITLE_CLASS } from '@renderer/utils';
import { CalendarDaysIcon, PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formatDate = (value: string | Date) => {
  const parsedDate = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  return parsedDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const WorkZonesPage = () => {
  const navigate = useNavigate();
  const {
    workZones,
    loading,
    errors,
    refetch,
    createWorkZone,
    updateWorkZone,
    deleteWorkZone,
    clearError
  } = useWorkZones();

  const createModal = useModal<void>({
    onClose: () => clearError('create')
  });

  const updateModal = useModal<WorkZone>({
    onClose: () => clearError('update')
  });

  const deleteModal = useModal<WorkZone>({
    onClose: () => clearError('delete')
  });

  const handleCreate = async (data: WorkZoneFormData) => {
    await createWorkZone(data);
    createModal.close();
    refetch();
  };

  const handleNavigate = (workZone: WorkZone) => {
    navigate(`/work-zones/${workZone.id}/farms`);
  };

  const toInputDate = (value: string | Date) => {
    const parsedDate = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    const month = `${parsedDate.getMonth() + 1}`.padStart(2, '0');
    const day = `${parsedDate.getDate()}`.padStart(2, '0');
    return `${parsedDate.getFullYear()}-${month}-${day}`;
  };

  const handleEdit = async (data: WorkZoneFormData) => {
    if (!updateModal.data) return;

    await updateWorkZone({
      id: updateModal.data.id,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate
    });
    updateModal.close();
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteModal.data) return;

    await deleteWorkZone(deleteModal.data.id);
    deleteModal.close();
    refetch();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-6 border-b border-gray-200 bg-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className={PAGE_TITLE_CLASS}>Reportes</h1>
            <p className={PAGE_SUBTITLE_CLASS}>
              Seleccione un reporte para ver las fincas asociadas
            </p>
          </div>

          <ActionButton
            variant="primary"
            size="md"
            icon={<PlusIcon size={18} />}
            onClick={() => createModal.open()}
          >
            Nuevo Reporte
          </ActionButton>
        </div>
      </div>

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
          <div className="flex flex-col gap-4">
            {workZones.map((workZone) => (
              <ListCard
                key={workZone.id}
                title={workZone.name}
                subtitle={`${formatDate(workZone.startDate)} - ${formatDate(workZone.endDate)}`}
                icon={<CalendarDaysIcon size={24} />}
                iconBgColor="#60c0eaff"
                loading={loading}
                onNavigate={() => handleNavigate(workZone)}
                onEdit={() => updateModal.open(workZone)}
                onDelete={() => deleteModal.open(workZone)}
              />
            ))}
            {!loading && workZones.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500">
                No hay zonas de trabajo registradas
              </div>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={createModal.isOpen} onClose={createModal.close} size="lg">
        <WorkZoneForm
          title="Agregar Zona de Trabajo"
          onCancel={createModal.close}
          onConfirm={handleCreate}
        />
      </Modal>

      <Modal isOpen={updateModal.isOpen} onClose={updateModal.close} size="lg">
        {updateModal.data && (
          <WorkZoneForm
            title="Editar Zona de Trabajo"
            initialData={{
              name: updateModal.data.name || '',
              startDate: toInputDate(updateModal.data.startDate),
              endDate: toInputDate(updateModal.data.endDate)
            }}
            onCancel={() => {
              updateModal.close();
              clearError('update');
            }}
            onConfirm={handleEdit}
          />
        )}
      </Modal>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} size="lg">
        <DeleteConfirmation
          itemName={deleteModal.data?.name || ''}
          onConfirm={handleDelete}
          onCancel={deleteModal.close}
        />
      </Modal>
    </div>
  );
};
