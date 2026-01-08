import { ActionButton } from '@renderer/components';
import { ErrorCard, ListCard } from '@renderer/components/Card';
import { Modal } from '@renderer/components/Modal/Modal';
import { useFarms } from '@renderer/hooks/useFarms';
import { PlusIcon, TractorIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const FarmAdminPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { farms, loading, error } = useFarms();

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <div className="space-y-4">
          <p className="text-gray-700">Test</p>
          <p className="text-gray-700">Test</p>
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
          >
            Cerrar
          </button>
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
        {error ? (
          <div className="h-full flex items-center justify-center">
            <ErrorCard
              message={error}
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
