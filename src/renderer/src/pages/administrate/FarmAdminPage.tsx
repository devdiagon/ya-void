import { ActionButton } from '@renderer/components';
import { ErrorCard, ListCard } from '@renderer/components/Card';
import { AdminFarmForm } from '@renderer/components/Form';
import { Modal } from '@renderer/components/Modal/Modal';
import { useFarms } from '@renderer/hooks/useFarms';
import { FarmFormData } from '@renderer/schemas/farm.schema';
import { PlusIcon, TractorIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const FarmAdminPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { farms, loading, errors, createFarm, clearError } = useFarms();

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = async (data: FarmFormData) => {
    await createFarm(data);
    setIsModalOpen(false);
  };

  const handleEdit = (farmId: number) => {
    console.log('Edit farm', farmId);
  };

  const handleDelete = (farmId: number) => {
    console.log('Delete farm', farmId);
  };

  return (
    <div className="h-full flex flex-col">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <div className="space-y-4">
          <AdminFarmForm
            title="Agregar Finca"
            handleCancel={() => {
              setIsModalOpen(false);
              clearError('create');
            }}
            onConfirm={handleConfirm}
          />
        </div>
      </Modal>

      {/* Header */}
      <div className="px-6 py-4">
        {/* Tittle & Add button */}
        <div className="flex items-center justify-between py-2">
          <h1 className="text-2xl font-black text-gray-900">Administrar Fincas</h1>

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
                onDelete={() => handleDelete(farm.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
