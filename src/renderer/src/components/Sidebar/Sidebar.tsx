import { useLocation } from 'react-router-dom';
import { SidebarItem, sidebarItems } from './SidebarItem';

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 shrink-0 bg-gray-900 border-r border-gray-800 h-full overflow-y-auto">
      <div>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">YA VOID</h1>
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
