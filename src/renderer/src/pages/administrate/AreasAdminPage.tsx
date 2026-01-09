import { ActionButton, IconButton } from '@renderer/components';
import { ArrowLeftIcon, PlusIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const AreasAdminPage = () => {
  const navigate = useNavigate();
  const { farmId } = useParams();
  const handleAdd = () => {
    //temp - hardcoded
    navigate(`/administrate/farms/${farmId}/areas/1/requesters`);
  };

  const handleGoBack = () => {
    navigate(`/administrate/farms`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        {/* Tittle & Add button */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <IconButton
              ariaLabel="Regresar"
              icon={<ArrowLeftIcon size={20} />}
              onClick={handleGoBack}
            />
            <h1 className="text-2xl font-bold text-gray-900">Administrar Áreas de {farmId}</h1>
          </div>

          <ActionButton
            variant="primary"
            size="md"
            icon={<PlusIcon size={18} />}
            onClick={handleAdd}
          >
            Agregar
          </ActionButton>
        </div>
        <div className="flex flex-col gap-4">Show areas here</div>
      </div>
    </div>
  );
};
