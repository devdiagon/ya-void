import { WorkZoneSheet } from '@renderer/types';
import { EditIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface SheetTabsProps {
  sheets: WorkZoneSheet[];
  activeSheetId: number | null;
  onSelect: (id: number) => void;
  onEdit: (sheet: WorkZoneSheet) => void;
  onDelete: (sheet: WorkZoneSheet) => void;
}

interface MenuState {
  sheetId: number;
  top: number;
  left: number;
}

export const SheetTabs = ({
  sheets,
  activeSheetId,
  onSelect,
  onEdit,
  onDelete
}: SheetTabsProps) => {
  const [menu, setMenu] = useState<MenuState | null>(null);
  const tabRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      setMenu((prev) => {
        if (!prev) return null;
        const el = tabRefs.current.get(prev.sheetId);
        if (el && el.contains(e.target as Node)) return prev;
        return null;
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabClick = (sheet: WorkZoneSheet, e: React.MouseEvent<HTMLDivElement>) => {
    onSelect(sheet.id);
    if (menu?.sheetId === sheet.id) {
      setMenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenu({ sheetId: sheet.id, top: rect.bottom + 4, left: rect.left });
  };

  return (
    <>
      <div className="flex items-center gap-1 overflow-x-auto border border-gray-200 rounded-xl bg-white px-2 py-2">
        {sheets.map((sheet) => (
          <div
            key={sheet.id}
            ref={(el) => {
              if (el) tabRefs.current.set(sheet.id, el);
              else tabRefs.current.delete(sheet.id);
            }}
            className={`flex items-center px-4 py-1.5 rounded-lg cursor-pointer select-none transition-all text-sm font-medium whitespace-nowrap ${
              activeSheetId === sheet.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={(e) => handleTabClick(sheet, e)}
          >
            {sheet.name}
          </div>
        ))}
      </div>

      {/* Dropdown portal — renders in document.body to escape overflow/stacking context */}
      {menu &&
        createPortal(
          <div
            style={{ top: menu.top, left: menu.left }}
            className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-32"
          >
            {(() => {
              const sheet = sheets.find((s) => s.id === menu.sheetId);
              if (!sheet) return null;
              return (
                <>
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => {
                      setMenu(null);
                      onEdit(sheet);
                    }}
                  >
                    <EditIcon size={14} />
                    Editar
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => {
                      setMenu(null);
                      onDelete(sheet);
                    }}
                  >
                    <Trash2Icon size={14} />
                    Eliminar
                  </button>
                </>
              );
            })()}
          </div>,
          document.body
        )}
    </>
  );
};
