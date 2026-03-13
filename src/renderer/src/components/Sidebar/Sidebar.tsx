import logo from '@renderer/assets/logo.png';
import { useLocation } from 'react-router-dom';
import { SidebarItem, sidebarItems } from './SidebarItem';

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-52 xl:w-56 shrink-0 bg-gray-900 border-r border-gray-800 h-full overflow-y-auto">
      <div>
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col items-center gap-2">
            <img src={logo} alt="VOY logo" className="h-24 w-24 object-contain" />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={location.pathname.startsWith(item.path)}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
};
