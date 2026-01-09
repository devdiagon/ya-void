import { ActionButton } from '@renderer/components';
import { ErrorCard, ListCard } from '@renderer/components/Card';
import { DeleteConfirmation } from '@renderer/components/DeleteConfirmation';
import { AdminFarmForm } from '@renderer/components/Form';
import { Modal } from '@renderer/components/Modal/Modal';
import { useFarms, useModal } from '@renderer/hooks';
import { FarmFormData } from '@renderer/schemas/farm.schema';
import { Farm } from '@renderer/types/farm.type';
import { PlusIcon, TractorIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FarmAdminPage = () => {
  const navigate = useNavigate();
  const { farms, loading, errors, refetch, createFarm, deleteFarm, clearError } = useFarms();

  const createModal = useModal<void>({
    onClose: () => clearError('create')
  });

  const deleteModal = useModal<Farm>({
    onClose: () => clearError('delete')
  });

  const handleCreate = async (data: FarmFormData) => {
    await createFarm(data);
    createModal.close();
    refetch();
  };

  const handleEdit = (farmId: number) => {
    console.log('Edit farm', farmId);
  };

  const handleDelete = () => {
    const farmId = deleteModal.data?.id;
    if (farmId !== undefined) {
      deleteFarm(farmId);
      deleteModal.close();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4">
        {/* Tittle & Add button */}
        <div className="flex items-center justify-between py-2">
          <h1 className="text-2xl font-black text-gray-900">Administrar Fincas</h1>

          <ActionButton
            variant="primary"
            size="md"
            icon={<PlusIcon size={18} />}
            onClick={() => createModal.open()}
          >
            Agregar
          </ActionButton>
        </div>
      </div>
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
          <div className="flex flex-col gap-4">
            {farms.map((farm) => (
              <ListCard
                key={farm.id}
                title={farm.name}
                subtitle="Finca"
                icon={<TractorIcon size={24} />}
                iconBgColor="#60c0eaff"
                loading={loading}
                onNavigate={() => {
                  navigate(`/administrate/farms/${farm.id}/areas`);
                }}
                onEdit={() => handleEdit(farm.id)}
                onDelete={() => deleteModal.open(farm)}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* Create Modal */}
      <Modal isOpen={createModal.isOpen} onClose={createModal.close} size="lg">
        <div className="space-y-4">
          <AdminFarmForm
            title="Agregar Finca"
            handleCancel={() => {
              createModal.close();
              clearError('create');
            }}
            onConfirm={handleCreate}
          />
        </div>
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
