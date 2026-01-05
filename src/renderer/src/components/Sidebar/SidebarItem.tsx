import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { ClipboardPlusIcon, ChartColumnBigIcon } from 'lucide-react';

interface SidebarItemConfig {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
}

export const sidebarItems: SidebarItemConfig[] = [
  { id: 'reportes', label: 'Reportes', icon: <ChartColumnBigIcon size={20} />, path: '/reports' },
  { id: 'registro', label: 'Registro', icon: <ClipboardPlusIcon size={20} />, path: '/register' }
];

interface SidebarItemProps {
  item: SidebarItemConfig;
  isActive: boolean;
}

export const SidebarItem = ({ item, isActive }: SidebarItemProps) => {
  const activeStyles = isActive
    ? 'bg-blue-600 text-white'
    : 'text-gray-300 hover:bg-gray-800 hover:text-white';

  return (
    <Link
      to={item.path}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeStyles}`}
    >
      {item.icon}
      <span className="font-medium">{item.label}</span>
    </Link>
  );
};
