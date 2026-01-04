import { 
  ActionButton, 
  BreadcrumbItem, 
  Breadcrumbs, 
  IconButton, 
  Modal, 
  RegisterTable, 
  TableAction, 
  TableColumn 
} from "@renderer/components";
import { useFarms } from "@renderer/hooks/useFarms";
import { buildCrumbsPaths, getPathSegments } from "@renderer/utils";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [modalTitle, setModalTitle] = useState('Agregar');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
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

      const {label} = crumbs[crumbs.length - 1];
      setTitle(label);
      
      if(crumbs.length === 2) setModalTitle(`Agregar Área`);
      if(crumbs.length === 3) setModalTitle(`Agregar Viaje`);
    } else {
      setBreadcrumbs([]);
      setTitle('Fincas');
      setModalTitle('Agregar Finca');
    }
  }, [location.pathname]);

  const handleGoBack = () => {
    const { path } = breadcrumbs[breadcrumbs.length - 1];
    const prevPath = path.split('/').slice(0, -1).join('/');
    navigate(prevPath);
  };

  const handleAdd = () => {
    setIsOpenModal(true);
  };

  // Table columns configuration
  const columns: TableColumn[] = [
    { key: 'name', label: 'Nombre' },
  ];

  // Table actions configuration
  const actions: TableAction[] = [
    {
      label: 'Editar',
      onClick: (row) => console.log('Editar:', row),
      className: 'text-blue-600 hover:text-blue-900'
    },
    {
      label: 'Eliminar',
      onClick: (row) => console.log('Eliminar:', row),
      className: 'text-gray-600 hover:text-gray-900'
    }
  ];

  return (
    <div className="h-full flex flex-col">

      <Modal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        title={modalTitle}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Simple modal content
          </p>
        </div>
      </Modal>
      
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
}