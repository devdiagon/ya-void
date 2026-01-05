import {
  ActionButton,
  BreadcrumbItem,
  Breadcrumbs,
  IconButton,
  RegisterTable,
  SelectModal,
  SelectOption,
  TableAction,
  TableColumn
} from '@renderer/components';
import { useFarms } from '@renderer/hooks/useFarms';
import { buildCrumbsPaths, getPathSegments } from '@renderer/utils';
import { ArrowLeftIcon, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectModalOptions, setSelectModalOptions] = useState<SelectOption[]>([]);
  const { farms, loading } = useFarms();

  // Breadcrumbs setup
  useEffect(() => {
    const pathSegments = getPathSegments(location.pathname);

    let crumbs: BreadcrumbItem[] = [];

    // Show only if there are more levels of navigation than just /register
    if (pathSegments.length > 1) {
      crumbs = buildCrumbsPaths(pathSegments);

      // Ignore base route 'register'
      setBreadcrumbs(crumbs.slice(1));

      const { label } = crumbs[crumbs.length - 1];
      setTitle(label);

      if (crumbs.length === 2) setModalTitle(`Agregar Área`);
      if (crumbs.length === 3) setModalTitle(`Agregar Viaje`);
    } else {
      setBreadcrumbs([]);
      setTitle('Fincas');
      setModalTitle('Agregar Finca');
    }
  }, [location.pathname]);

  // Fetch options for select modal when opened
  useEffect(() => {
    if (isOpenModal) {
      loadOptions();
    }
  }, [isOpenModal]);

  const loadOptions = async () => {
    const options = farms.map((farm) => {
      return { value: farm.id, label: farm.name };
    });
    setSelectModalOptions(options);
  };

  // Navigation by using breadcrumbs
  const handleGoBack = () => {
    const { path } = breadcrumbs[breadcrumbs.length - 1];
    const prevPath = path.split('/').slice(0, -1).join('/');
    navigate(prevPath);
  };

  // Button to open modal
  const handleAdd = () => {
    setIsOpenModal(true);
  };

  //
  const handleConfirmAdd = (value: string | number) => {
    console.log('Selected value:', value);
    // TODO: send option to be added to the database
  };

  // Table columns configuration
  const columns: TableColumn[] = [{ key: 'name', label: 'Nombre' }];

  // Table actions configuration
  const actions: TableAction[] = [
    {
      label: 'Editar',
      onClick: (row) => console.log('Editar:', row), // TODO: navigate to "this" row page
      className: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
    },
    {
      label: 'Eliminar',
      onClick: (row) => console.log('Eliminar:', row), // TODO: open delete confirmation modal
      className: 'text-red-600 hover:text-red-700 hover:bg-red-50'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <SelectModal
        isOpen={isOpenModal}
        title={modalTitle}
        onClose={() => setIsOpenModal(false)}
        onConfirm={handleConfirmAdd}
        options={selectModalOptions}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        {/* Tittle & Add button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Registrar {title}</h1>

          <ActionButton
            variant="primary"
            size="md"
            icon={<PlusIcon size={18} />}
            onClick={handleAdd}
          >
            Agregar
          </ActionButton>
        </div>

        {/* Navigation with breadcrumbs */}
        <div className="flex items-center gap-2">
          {breadcrumbs.length > 0 && (
            <>
              <IconButton
                ariaLabel="Regresar"
                icon={<ArrowLeftIcon size={20} />}
                onClick={handleGoBack}
              />
              <Breadcrumbs items={breadcrumbs} />
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <RegisterTable
          columns={columns}
          data={farms}
          actions={actions}
          loading={loading}
          emptyMessage="No se han hecho registros aún."
        />
      </div>
    </div>
  );
};
