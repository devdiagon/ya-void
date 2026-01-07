import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { SidebarItem, sidebarItems } from './SidebarItem';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform 
          transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="lg:translate-x-0">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">YA VOID</h1>
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
              <X size={24} />
            </button>
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
    </>
  );
};
