import { BarChart3Icon, ClipboardIcon, FileSlidersIcon, SearchIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface SidebarItemConfig {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
}

export const sidebarItems: SidebarItemConfig[] = [
  {
    id: 'panel',
    label: 'Panel',
    icon: <BarChart3Icon size={20} />,
    path: '/panel'
  },
  {
    id: 'work-zones',
    label: 'Reportes',
    icon: <ClipboardIcon size={20} />,
    path: '/work-zones'
  },
  {
    id: 'search-trip',
    label: 'Buscar Viaje',
    icon: <SearchIcon size={20} />,
    path: '/search-trip'
  },
  {
    id: 'administrate',
    label: 'Administrar',
    icon: <FileSlidersIcon size={20} />,
    path: '/administrate/farms'
  }
];

interface SidebarItemProps {
  item: SidebarItemConfig;
  isActive: boolean;
  collapsed?: boolean;
}

export const SidebarItem = ({ item, isActive, collapsed = false }: SidebarItemProps) => {
  const activeStyles = isActive
    ? 'bg-blue-600 text-white'
    : 'text-gray-300 hover:bg-gray-800 hover:text-white';

  return (
    <Link
      to={item.path}
      title={collapsed ? item.label : undefined}
      className={`flex items-center rounded-lg transition-colors ${
        collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'
      } ${activeStyles}`}
    >
      {item.icon}
      {!collapsed && <span className="font-medium">{item.label}</span>}
    </Link>
  );
};
