import { ActionButton, IconButton, OutlineButton } from '@renderer/components';
import { ErrorCard } from '@renderer/components/Card';
import { DeleteConfirmation } from '@renderer/components/DeleteConfirmation';
import { AdminFarmForm } from '@renderer/components/Form';
import { Modal } from '@renderer/components/Modal/Modal';
import { useAreas, useModal, useRequesters } from '@renderer/hooks';
import { FarmFormData } from '@renderer/schemas/farm.schema';
import { Area, Requester } from '@renderer/types';
import { PAGE_TITLE_CLASS } from '@renderer/utils';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UserMinusIcon,
  UsersIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface AreaRowProps {
  area: Area;
  onEditArea: (area: Area) => void;
  onDeleteArea: (area: Area) => void;
}

const AreaRow = ({ area, onEditArea, onDeleteArea }: AreaRowProps) => {
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

export const AreasAdminPage = () => {
  const navigate = useNavigate();
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

  const handleCreate = async (data: FarmFormData) => {
    await createArea({
      name: data.name,
      farmId: parsedFarmId
    });
    createModal.close();
    refetch();
  };

  const handleEdit = async (data: FarmFormData) => {
    if (!updateModal.data) return;

    const updateData: Area = {
      id: updateModal.data.id,
      name: data.name,
      farm_id: updateModal.data.farm_id
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

  const handleGoBack = () => {
    navigate(`/administrate/farms`);
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
      <div className="px-6 py-4">
        {/* Tittle & Add button */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <IconButton
              ariaLabel="Regresar"
              icon={<ArrowLeftIcon size={20} />}
              onClick={handleGoBack}
            />
            <h1 className={PAGE_TITLE_CLASS}>
              Administrar Áreas de <span className="text-blue-600">{farmName || farmId}</span>
            </h1>
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
          <AdminFarmForm
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
            <AdminFarmForm
              title="Editar Área"
              initialData={{ name: updateModal.data.name || '' }}
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
