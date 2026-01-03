import { ActionButton, BreadcrumbItem, Breadcrumbs, IconButton, RegisterTable, TableAction, TableColumn } from "@renderer/components";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  // Breadcrumbs setup
  useEffect(() => {
    const pathSegments = location.pathname
      .split('/')
      .filter(segment => segment !== '');

    // Show only if there are more levels of navigation than just /register
    if (pathSegments.length > 1) {
      const crumbs: BreadcrumbItem[] = pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        
        return { label, path };
      });
      
      // Ignore base route 'register'
      setBreadcrumbs(crumbs.slice(1));
    } else {
      setBreadcrumbs([]);
    }
  }, [location.pathname]);

  // Fetch data from DB
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // mockData
        const mockData = Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          name: `Item ${i + 1} para ${location.pathname}`,
          status: i % 2 === 0 ? 'active' : 'inactive',
          date: new Date().toLocaleDateString()
        }));

        setData(mockData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAdd = () => {
    console.log('Click agregar');
  };

  // Table columns configuration
  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { 
      key: 'status', 
      label: 'Estado',
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      )
    },
    { key: 'date', label: 'Fecha' }
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
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        
        {/* Tittle & Add button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Registro</h1>

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
          data={data}
          actions={actions}
          loading={loading}
          emptyMessage="No se han hecho registros aún."
        />
      </div>
    </div>
  );
}