import { TripVehicleType } from '@renderer/types';
import { Save, X } from 'lucide-react';
import { useState } from 'react';
import { AutocompleteOption, CellAutocomplete } from './CellAutocomplete';

/** Valida formato HH:MM con horas 00-23 y minutos 00-59. Acepta vacío. */
function validateTime(value: string): string | null {
  if (!value) return null;
  const match = value.match(/^([0-9]{2}):([0-9]{2})$/);
  if (!match) return 'Formato inválido (HH:MM)';
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23) return 'Hora debe ser 00–23';
  if (m > 59) return 'Minutos deben ser 00–59';
  return null;
}

export const VEHICLE_TYPES: TripVehicleType[] = ['Camioneta', 'Furgoneta', 'Microbus', 'Bus'];

export interface TripFormData {
  tripDate: string;
  vehicleType: TripVehicleType | '';
  requesterId: number | null;
  departureTime: string;
  arrivalTime: string;
  passengerCount: string;
  routeId: number | null;
  reasonId: number | null;
  cost: string;
}

export const emptyTripForm = (): TripFormData => ({
  tripDate: '',
  vehicleType: '',
  requesterId: null,
  departureTime: '',
  arrivalTime: '',
  passengerCount: '',
  routeId: null,
  reasonId: null,
  cost: ''
});

interface TripFormRowProps {
  form: TripFormData;
  setForm: (f: TripFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  routes: AutocompleteOption[];
  reasons: AutocompleteOption[];
  requesters: AutocompleteOption[];
  onFindOrCreateRoute: (name: string) => Promise<AutocompleteOption | null>;
  onFindOrCreateReason: (name: string) => Promise<AutocompleteOption | null>;
  onFindOrCreateRequester: (name: string) => Promise<AutocompleteOption | null>;
  onEditRoute?: (opt: AutocompleteOption, newName: string) => Promise<void>;
  onDeleteRoute?: (opt: AutocompleteOption) => Promise<void>;
  onEditReason?: (opt: AutocompleteOption, newName: string) => Promise<void>;
  onDeleteReason?: (opt: AutocompleteOption) => Promise<void>;
}

const cell = 'border border-gray-200 px-2 py-1 align-top';

export function TripFormRow({
  form,
  setForm,
  onSave,
  onCancel,
  routes,
  reasons,
  requesters,
  onFindOrCreateRoute,
  onFindOrCreateReason,
  onFindOrCreateRequester,
  onEditRoute,
  onDeleteRoute,
  onEditReason,
  onDeleteReason
}: TripFormRowProps) {
  const set = <K extends keyof TripFormData>(key: K, val: TripFormData[K]) =>
    setForm({ ...form, [key]: val });

  const inputCls = 'w-full bg-transparent border-0 outline-none text-sm py-0';

  const [timeErrors, setTimeErrors] = useState({
    departure: null as string | null,
    arrival: null as string | null
  });

  const handleTimeChange = (
    field: 'departureTime' | 'arrivalTime',
    errorKey: 'departure' | 'arrival',
    raw: string
  ) => {
    let v = raw.replace(/[^0-9:]/g, '');
    const prev = field === 'departureTime' ? form.departureTime : form.arrivalTime;
    if (v.length === 2 && !v.includes(':') && prev.length < 2) v += ':';
    set(field, v);
    setTimeErrors((e) => ({ ...e, [errorKey]: validateTime(v) }));
  };

  return (
    <tr className="bg-white ring-1 ring-inset ring-blue-400">
      {/* Fecha */}
      <td className={`${cell} min-w-[120px]`}>
        <input
          type="date"
          className={inputCls}
          value={form.tripDate}
          onChange={(e) => set('tripDate', e.target.value)}
        />
      </td>

      {/* Vehículo */}
      <td className={`${cell} min-w-[110px]`}>
        <select
          className="w-full bg-transparent border-0 outline-none text-sm py-0 cursor-pointer"
          value={form.vehicleType}
          onChange={(e) => set('vehicleType', e.target.value as TripVehicleType | '')}
        >
          <option value="">—</option>
          {VEHICLE_TYPES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </td>

      {/* Solicitante */}
      <td className={`${cell} min-w-[140px]`}>
        <CellAutocomplete
          options={requesters}
          value={form.requesterId}
          placeholder="Buscar solicitante..."
          onChange={(id) => set('requesterId', id)}
          onFindOrCreate={onFindOrCreateRequester}
        />
      </td>

      {/* Salida */}
      <td className={`${cell} min-w-[100px] ${timeErrors.departure ? 'bg-red-50' : ''}`}>
        <input
          type="text"
          className={`${inputCls} ${timeErrors.departure ? 'text-red-600' : ''}`}
          value={form.departureTime}
          placeholder="HH:MM"
          maxLength={5}
          onChange={(e) => handleTimeChange('departureTime', 'departure', e.target.value)}
        />
        {timeErrors.departure && (
          <p className="text-[10px] text-red-500 mt-0.5 leading-tight">{timeErrors.departure}</p>
        )}
      </td>

      {/* Llegada */}
      <td className={`${cell} min-w-[100px] ${timeErrors.arrival ? 'bg-red-50' : ''}`}>
        <input
          type="text"
          className={`${inputCls} ${timeErrors.arrival ? 'text-red-600' : ''}`}
          value={form.arrivalTime}
          placeholder="HH:MM"
          maxLength={5}
          onChange={(e) => handleTimeChange('arrivalTime', 'arrival', e.target.value)}
        />
        {timeErrors.arrival && (
          <p className="text-[10px] text-red-500 mt-0.5 leading-tight">{timeErrors.arrival}</p>
        )}
      </td>

      {/* Pasajeros */}
      <td className={`${cell} min-w-[56px] w-[60px]`}>
        <input
          type="number"
          min={0}
          className={`${inputCls} text-center`}
          value={form.passengerCount}
          onChange={(e) => set('passengerCount', e.target.value)}
        />
      </td>

      {/* Ruta */}
      <td className={`${cell} min-w-[220px]`}>
        <CellAutocomplete
          options={routes}
          value={form.routeId}
          placeholder="Buscar ruta..."
          onChange={(id) => set('routeId', id)}
          onFindOrCreate={onFindOrCreateRoute}
          onEditOption={onEditRoute}
          onDeleteOption={onDeleteRoute}
        />
      </td>

      {/* Motivo */}
      <td className={`${cell} min-w-[220px]`}>
        <CellAutocomplete
          options={reasons}
          value={form.reasonId}
          placeholder="Buscar motivo..."
          onChange={(id) => set('reasonId', id)}
          onFindOrCreate={onFindOrCreateReason}
          onEditOption={onEditReason}
          onDeleteOption={onDeleteReason}
        />
      </td>

      {/* Costo */}
      <td className={`${cell} min-w-[90px]`}>
        <div className="flex items-center gap-0.5">
          <span className="text-gray-400 text-xs">$</span>
          <input
            type="number"
            min={0}
            step={0.01}
            className={inputCls}
            value={form.cost}
            onChange={(e) => set('cost', e.target.value)}
          />
        </div>
      </td>

      {/* Acciones */}
      <td className={`${cell} min-w-[72px]`}>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onSave}
            disabled={!!(timeErrors.departure || timeErrors.arrival)}
            className="p-1 rounded text-green-600 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Guardar"
          >
            <Save size={15} />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded text-red-500 hover:bg-red-50"
            title="Cancelar"
          >
            <X size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
