import { Check, Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface AutocompleteOption {
  id: number;
  name: string;
}

interface ContextMenu {
  opt: AutocompleteOption;
  top: number;
  left: number;
}

interface CellAutocompleteProps {
  options: AutocompleteOption[];
  value: number | null;
  placeholder?: string;
  onChange: (id: number, name: string) => void;
  /** When provided, shows a "Crear: …" option for unmatched text */
  onFindOrCreate?: (name: string) => Promise<AutocompleteOption | null>;
  /** Called when the user clears the input and blurs without selecting anything */
  onClear?: () => void;
  /** When provided, shows "Editar" on right-click of an option */
  onEditOption?: (opt: AutocompleteOption, newName: string) => Promise<void>;
  /** When provided, shows "Eliminar" on right-click of an option */
  onDeleteOption?: (opt: AutocompleteOption) => Promise<void>;
  disabled?: boolean;
}

export function CellAutocomplete({
  options,
  value,
  placeholder,
  onChange,
  onFindOrCreate,
  onClear,
  onEditOption,
  onDeleteOption,
  disabled
}: CellAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedName = value != null ? (options.find((o) => o.id === value)?.name ?? '') : '';

  const filtered = query.trim()
    ? options.filter((o) => o.name.toLowerCase().includes(query.toLowerCase().trim()))
    : options;

  const hasExactMatch = options.some((o) => o.name.toLowerCase() === query.toLowerCase().trim());
  const showCreate = !!onFindOrCreate && query.trim().length > 0 && !hasExactMatch;

  const displayValue = open ? query : selectedName;

  // Auto-resize textarea height to fit content
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [displayValue]);

  const openDropdown = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: 'fixed',
      top: rect.bottom + 1,
      left: rect.left,
      minWidth: Math.max(rect.width, 180),
      zIndex: 9999
    });
    setOpen(true);
  };

  const focusNext = () => {
    const el = textareaRef.current;
    if (!el) return;
    const focusable = Array.from(
      document.querySelectorAll<HTMLElement>(
        'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((f) => !f.closest('[data-dropdown]'));
    const idx = focusable.indexOf(el);
    if (idx !== -1 && focusable[idx + 1]) focusable[idx + 1].focus();
  };

  const handleSelect = (opt: AutocompleteOption, andFocusNext = false) => {
    onChange(opt.id, opt.name);
    setQuery('');
    setOpen(false);
    if (andFocusNext) setTimeout(focusNext, 0);
  };

  const handleCreate = async (andFocusNext = false) => {
    if (!onFindOrCreate || !query.trim()) return;
    setBusy(true);
    const result = await onFindOrCreate(query.trim());
    setBusy(false);
    if (result) onChange(result.id, result.name);
    setQuery('');
    setOpen(false);
    if (andFocusNext) setTimeout(focusNext, 0);
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        if (query === '' && value != null) onClear?.();
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, query, value, onClear]);

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu) return;
    const handler = () => setContextMenu(null);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [contextMenu]);

  const handleOptionContextMenu = (opt: AutocompleteOption, e: React.MouseEvent) => {
    if (!onEditOption && !onDeleteOption) return;
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ opt, top: e.clientY + 4, left: e.clientX });
  };

  const handleEditConfirm = async () => {
    if (!onEditOption || editingId === null || !editingName.trim()) return;
    const opt = options.find((o) => o.id === editingId);
    if (opt) await onEditOption(opt, editingName.trim());
    setEditingId(null);
    setEditingName('');
    setContextMenu(null);
  };

  return (
    <div ref={containerRef} className="w-full">
      <textarea
        ref={textareaRef}
        rows={1}
        disabled={disabled}
        placeholder={placeholder}
        value={displayValue}
        className="w-full bg-transparent border-0 outline-none text-sm py-0 placeholder:text-gray-400 disabled:opacity-40 resize-none overflow-hidden leading-snug"
        onFocus={(e) => {
          setQuery(selectedName);
          openDropdown();
          // Select all text so the user can immediately replace it
          e.target.select();
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!open) openDropdown();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false);
            setQuery('');
            return;
          }
          if (e.key === 'Tab') {
            // Close dropdown and let the browser move focus to the next field
            setOpen(false);
            setQuery('');
            return;
          }
          if (e.key === 'Enter') {
            e.preventDefault();
            if (!query.trim()) return;
            const exactMatch = options.find(
              (o) => o.name.toLowerCase() === query.toLowerCase().trim()
            );
            if (exactMatch) {
              handleSelect(exactMatch, true);
            } else if (filtered.length === 1) {
              handleSelect(filtered[0], true);
            } else if (showCreate) {
              handleCreate(true);
            }
          }
        }}
      />

      {open &&
        createPortal(
          <div
            style={dropdownStyle}
            className="bg-white border border-gray-200 shadow-lg rounded overflow-hidden max-h-52 overflow-y-auto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {filtered.length === 0 && !showCreate && (
              <div className="px-3 py-2 text-xs text-gray-400">Sin resultados</div>
            )}
            {filtered.map((opt) =>
              editingId === opt.id ? (
                /* Inline rename input */
                <div
                  key={opt.id}
                  className="flex items-center gap-1 px-2 py-1"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <input
                    autoFocus
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEditConfirm();
                      if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditingName('');
                      }
                    }}
                    className="flex-1 text-sm border border-blue-400 rounded px-1.5 py-0.5 outline-none"
                  />
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleEditConfirm();
                    }}
                    className="p-0.5 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Check size={13} />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setEditingId(null);
                      setEditingName('');
                    }}
                    className="p-0.5 text-gray-400 hover:bg-gray-50 rounded"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <button
                  key={opt.id}
                  type="button"
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 truncate"
                  onMouseDown={(e) => {
                    if (e.button !== 0) return; // ignore right-click
                    e.preventDefault();
                    handleSelect(opt);
                  }}
                  onContextMenu={(e) => handleOptionContextMenu(opt, e)}
                >
                  {opt.name}
                </button>
              )
            )}
            {showCreate && (
              <button
                type="button"
                disabled={busy}
                className="w-full text-left px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-100 disabled:opacity-50"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleCreate();
                }}
              >
                {busy ? 'Creando...' : `Crear: "${query.trim()}"`}
              </button>
            )}
          </div>,
          document.body
        )}

      {/* Right-click context menu portal */}
      {contextMenu &&
        createPortal(
          <div
            style={{ top: contextMenu.top, left: contextMenu.left }}
            className="fixed z-[10000] bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[130px]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {onEditOption && (
              <button
                type="button"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setEditingId(contextMenu.opt.id);
                  setEditingName(contextMenu.opt.name);
                  setContextMenu(null);
                }}
              >
                <Pencil size={13} />
                Editar
              </button>
            )}
            {onDeleteOption && (
              <button
                type="button"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                onClick={async () => {
                  await onDeleteOption(contextMenu.opt);
                  setContextMenu(null);
                }}
              >
                <Trash2 size={13} />
                Eliminar
              </button>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
