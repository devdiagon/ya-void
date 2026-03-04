import { IconButton, OutlineButton } from '@renderer/components';
import { AdminFarmForm } from '@renderer/components/Form';
import { Modal } from '@renderer/components/Modal/Modal';
import { useModal, useRequesters } from '@renderer/hooks';
import { FarmFormData } from '@renderer/schemas/farm.schema';
import { Area, Requester } from '@renderer/types';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MapPinIcon,
  PencilIcon,
  Trash2Icon,
  UserMinusIcon,
  UsersIcon
} from 'lucide-react';
import { useState } from 'react';

export interface AreaRowProps {
  area: Area;
  onEditArea: (area: Area) => void;
  onDeleteArea: (area: Area) => void;
}

export const AreaRow = ({ area, onEditArea, onDeleteArea }: AreaRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { requesters, loading, errors, removeRequesterFromArea, updateRequester, clearError } =
    useRequesters(area.id);

  const updateRequesterModal = useModal<Requester>({
    onClose: () => clearError('update')
  });

  const handleEditRequester = async (data: FarmFormData) => {
    if (!updateRequesterModal.data) return;

    await updateRequester({
      id: updateRequesterModal.data.id,
      name: data.name
    });
    updateRequesterModal.close();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div
        className="flex cursor-pointer items-center justify-between px-4 py-3"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDownIcon size={18} className="text-gray-500" />
          ) : (
            <ChevronRightIcon size={18} className="text-gray-500" />
          )}
          <MapPinIcon size={18} className="text-green-600" />
          <span className="text-lg font-semibold text-gray-900">{area.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            ariaLabel="Editar área"
            size="sm"
            icon={<PencilIcon size={16} />}
            onClick={(event) => {
              event.stopPropagation();
              onEditArea(area);
            }}
          />
          <IconButton
            ariaLabel="Eliminar área"
            size="sm"
            variant="danger"
            icon={<Trash2Icon size={16} />}
            onClick={(event) => {
              event.stopPropagation();
              onDeleteArea(area);
            }}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200">
          {errors.fetch ? (
            <div className="px-4 py-3 text-sm text-red-600">
              No se pudieron obtener los solicitantes
            </div>
          ) : loading ? (
            <div className="px-4 py-3 text-sm text-gray-500">Cargando solicitantes...</div>
          ) : requesters.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">Sin solicitantes asociados</div>
          ) : (
            <div>
              {requesters.map((requester) => (
                <div
                  key={requester.id}
                  className="flex items-center justify-between border-b border-gray-100 px-10 py-2 last:border-b-0"
                >
                  <div className="flex items-center gap-3 text-gray-700">
                    <UsersIcon size={16} className="text-violet-600" />
                    <span className="text-2lg">{requester.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconButton
                      ariaLabel="Editar solicitante"
                      size="sm"
                      icon={<PencilIcon size={14} />}
                      onClick={() => updateRequesterModal.open(requester)}
                    />
                    <OutlineButton
                      size="sm"
                      variant="danger"
                      icon={<UserMinusIcon size={14} />}
                      onClick={() => removeRequesterFromArea(requester.id)}
                    >
                      Quitar
                    </OutlineButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal isOpen={updateRequesterModal.isOpen} onClose={updateRequesterModal.close} size="lg">
        {updateRequesterModal.data && (
          <div className="space-y-4">
            <AdminFarmForm
              title="Editar Solicitante"
              initialData={{ name: updateRequesterModal.data.name || '' }}
              handleCancel={() => {
                updateRequesterModal.close();
                clearError('update');
              }}
              onConfirm={handleEditRequester}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
