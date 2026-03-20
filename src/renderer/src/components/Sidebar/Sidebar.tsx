import logo from '@renderer/assets/logo.png';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarItem, sidebarItems } from './SidebarItem';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const [version, setVersion] = useState('');

  useEffect(() => {
    window.app.getVersion().then(setVersion);
  }, []);

  return (
    <aside
      className={`shrink-0 bg-gray-900 border-r border-gray-800 h-full overflow-y-auto flex flex-col transition-[width] duration-300 ${
        collapsed ? 'w-16' : 'w-52 xl:w-56'
      }`}
    >
      <div className="flex-1">
        <div className={`border-b border-gray-800 ${collapsed ? 'p-2' : 'p-4'}`}>
          <div className={`flex ${collapsed ? 'justify-center' : 'justify-end'} mb-2`}>
            <button
              type="button"
              onClick={onToggle}
              aria-label={collapsed ? 'Mostrar sidebar' : 'Ocultar sidebar'}
              className="rounded-md p-1.5 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <img
              src={logo}
              alt="VOY logo"
              className={collapsed ? 'h-10 w-10 object-contain' : 'h-24 w-24 object-contain'}
            />
          </div>
        </div>

        <nav className={`flex-1 space-y-2 ${collapsed ? 'p-2' : 'p-4'}`}>
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={location.pathname.startsWith(item.path)}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>

      {version && (
        <div className={`border-t border-gray-800 ${collapsed ? 'p-2' : 'p-4'}`}>
          {!collapsed && <p className="text-xs text-gray-500 text-center">v{version}</p>}
        </div>
      )}
    </aside>
  );
};
