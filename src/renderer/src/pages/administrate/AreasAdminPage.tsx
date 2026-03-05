import { ActionButton } from '@renderer/components';
import { Breadcrumbs } from '@renderer/components/Breadcrumbs';
import { ErrorCard } from '@renderer/components/Card';
import { DeleteConfirmation } from '@renderer/components/DeleteConfirmation';
import { AdminAreaForm } from '@renderer/components/Form';
import { Modal } from '@renderer/components/Modal/Modal';
import { useAreas, useModal } from '@renderer/hooks';
import { AreaFormData } from '@renderer/schemas/area.schema';
import { Area } from '@renderer/types';
import { PAGE_TITLE_CLASS } from '@renderer/utils';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AreaRow } from './AreaRow';

export const AreasAdminPage = () => {
  const { farmId } = useParams();
  const [farmName, setFarmName] = useState('');

  const farmIdNumber = Number(farmId);
  const parsedFarmId = Number.isNaN(farmIdNumber) ? 0 : farmIdNumber;

  const { areas, loading, errors, refetch, createArea, updateArea, deleteArea, clearError } =
    useAreas(parsedFarmId);

  const createModal = useModal<void>({
    onClose: () => clearError('create')
  });

  const updateModal = useModal<Area>({
    onClose: () => clearError('update')
  });

  const deleteModal = useModal<Area>({
    onClose: () => clearError('delete')
  });

  const handleCreate = async (data: AreaFormData) => {
    await createArea({
      name: data.name,
      farmId: parsedFarmId,
      managerName: data.managerName || null,
      managerCid: data.managerCid || null
    });
    createModal.close();
    refetch();
  };

  const handleEdit = async (data: AreaFormData) => {
    if (!updateModal.data) return;

    const updateData: Area = {
      id: updateModal.data.id,
      name: data.name,
      farm_id: updateModal.data.farm_id,
      manager_name: data.managerName || null,
      manager_cid: data.managerCid || null
    };

    await updateArea(updateData);
    updateModal.close();
    refetch();
  };

  const handleDelete = () => {
    if (!deleteModal.data) return;

    deleteArea(deleteModal.data.id);
    deleteModal.close();
  };

  const handleAdd = () => {
    createModal.open();
  };

  useEffect(() => {
    if (!parsedFarmId) {
      return;
    }

    window.api.farms
      .getById(parsedFarmId)
      .then((farm) => setFarmName(farm.name))
      .catch(() => setFarmName(farmId || ''));
  }, [parsedFarmId, farmId]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200 bg-white">
        <Breadcrumbs
          items={[
            { label: 'Administración', path: '/administrate/farms' },
            { label: farmName || farmId || '', path: '#' }
          ]}
        />
        {/* Tittle & Add button */}
        <div className="flex items-center justify-between mt-4">
          <h1 className={PAGE_TITLE_CLASS}>
            Áreas de <span className="text-blue-600">{farmName || farmId}</span>
          </h1>

          <ActionButton
            variant="primary"
            size="md"
            icon={<PlusIcon size={18} />}
            onClick={handleAdd}
          >
            Agregar
          </ActionButton>
        </div>
      </div>

      {/*Display error if no items where fetched */}
      <div className="flex-1 px-6 py-4 overflow-auto">
        {errors.fetch ? (
          <div className="h-full flex items-center justify-center">
            <ErrorCard
              message={errors.fetch}
              onRetry={() => window.location.reload()}
              retryText="Reintentar"
            />
          </div>
        ) : (
          // Display list of items
          <div className="flex flex-col gap-4">
            {areas.map((area) => (
              <AreaRow
                key={area.id}
                area={area}
                onEditArea={(selectedArea) => updateModal.open(selectedArea)}
                onDeleteArea={(selectedArea) => deleteModal.open(selectedArea)}
              />
            ))}
            {!loading && areas.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500">
                No hay áreas registradas para esta finca
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* Create Modal */}
      <Modal isOpen={createModal.isOpen} onClose={createModal.close} size="lg">
        <div className="space-y-4">
          <AdminAreaForm
            title="Agregar Área"
            handleCancel={() => {
              createModal.close();
              clearError('create');
            }}
            onConfirm={handleCreate}
          />
        </div>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={updateModal.isOpen} onClose={updateModal.close} size="lg">
        {updateModal.data && (
          <div className="space-y-4">
            <AdminAreaForm
              title="Editar Área"
              initialData={{
                name: updateModal.data.name || '',
                managerName: updateModal.data.manager_name || '',
                managerCid: updateModal.data.manager_cid || ''
              }}
              handleCancel={() => {
                updateModal.close();
                clearError('update');
              }}
              onConfirm={handleEdit}
            />
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} size="lg">
        <div className="space-y-4">
          <DeleteConfirmation
            itemName={deleteModal.data?.name || ''}
            onConfirm={handleDelete}
            onCancel={deleteModal.close}
          />
        </div>
      </Modal>
    </div>
  );
};
