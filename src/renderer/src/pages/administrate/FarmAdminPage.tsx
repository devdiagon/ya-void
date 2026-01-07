import { ActionButton } from '@renderer/components';
import { ListCard } from '@renderer/components/Card';
import { useFarms } from '@renderer/hooks/useFarms';
import { PlusIcon, TractorIcon } from 'lucide-react';

export const FarmAdminPage = () => {
  const { farms } = useFarms();

  const handleAdd = () => {
    /*TODO*/
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        {/* Tittle & Add button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Administrar Fincas</h1>

          <ActionButton
            variant="primary"
            size="md"
            icon={<PlusIcon size={18} />}
            onClick={handleAdd}
          >
            Agregar
          </ActionButton>
        </div>
        <div className="flex-1 overflow-auto p-6 gap-2">
          {farms.map((farm) => (
            <ListCard
              key={farm.id}
              title={farm.name}
              subtitle="Finca"
              icon={<TractorIcon size={24} />}
              iconBgColor="#60c0eaff"
              onNavigate={() => {
                console.log(`Click en finca con id: ${farm.id}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
