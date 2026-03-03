import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface AutocompleteOption {
  id: number;
  name: string;
}

interface CellAutocompleteProps {
  options: AutocompleteOption[];
  value: number | null;
  placeholder?: string;
  onChange: (id: number, name: string) => void;
  /** When provided, shows a "Crear: …" option for unmatched text */
  onFindOrCreate?: (name: string) => Promise<AutocompleteOption | null>;
  disabled?: boolean;
}

export function CellAutocomplete({
  options,
  value,
  placeholder,
  onChange,
  onFindOrCreate,
  disabled
}: CellAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
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

  const handleSelect = (opt: AutocompleteOption) => {
    onChange(opt.id, opt.name);
    setQuery('');
    setOpen(false);
  };

  const handleCreate = async () => {
    if (!onFindOrCreate || !query.trim()) return;
    setBusy(true);
    const result = await onFindOrCreate(query.trim());
    setBusy(false);
    if (result) onChange(result.id, result.name);
    setQuery('');
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={containerRef} className="w-full">
      <textarea
        ref={textareaRef}
        rows={1}
        disabled={disabled}
        placeholder={placeholder}
        value={displayValue}
        className="w-full bg-transparent border-0 outline-none text-sm py-0 placeholder:text-gray-400 disabled:opacity-40 resize-none overflow-hidden leading-snug"
        onFocus={() => {
          setQuery('');
          openDropdown();
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!open) openDropdown();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false);
            setQuery('');
          }
          // Prevent newline on Enter
          if (e.key === 'Enter') e.preventDefault();
        }}
      />

      {open &&
        createPortal(
          <div
            style={dropdownStyle}
            className="bg-white border border-gray-200 shadow-lg rounded overflow-hidden max-h-52 overflow-y-auto"
          >
            {filtered.length === 0 && !showCreate && (
              <div className="px-3 py-2 text-xs text-gray-400">Sin resultados</div>
            )}
            {filtered.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 truncate"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(opt);
                }}
              >
                {opt.name}
              </button>
            ))}
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
    </div>
  );
}
