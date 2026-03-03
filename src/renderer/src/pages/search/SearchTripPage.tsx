import { Requester, Trip, TripStatus, TripVehicleType } from '@renderer/types';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const VEHICLE_OPTIONS: { value: TripVehicleType; label: string }[] = [
  { value: 'Camioneta', label: 'Camioneta' },
  { value: 'Furgoneta', label: 'Furgoneta' },
  { value: 'Microbus', label: 'Microbús' },
  { value: 'Bus', label: 'Bus' }
];

const VEHICLE_LABELS: Record<string, string> = Object.fromEntries(
  VEHICLE_OPTIONS.map((v) => [v.value, v.label])
);

type StatusFilter = 'all' | TripStatus;

export function SearchTripPage() {
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [requesters, setRequesters] = useState<Requester[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [vehicleFilter, setVehicleFilter] = useState<TripVehicleType | 'all'>('all');
  const [requesterFilter, setRequesterFilter] = useState<number | 'all'>('all');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [trips, reqs] = await Promise.all([
        window.api.trips.listAll(),
        window.api.requesters.listAll()
      ]);
      setAllTrips(trips);
      setRequesters(reqs);
    } catch (err) {
      console.error('Error al obtener viajes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Only show requesters that appear in at least one trip
  const usedRequesters = useMemo(() => {
    const ids = new Set(allTrips.map((t) => t.requesterId).filter(Boolean));
    return requesters.filter((r) => ids.has(r.id));
  }, [allTrips, requesters]);

  const requesterMap = useMemo(() => new Map(requesters.map((r) => [r.id, r.name])), [requesters]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTrips.filter((t) => {
      // Text search
      if (q) {
        const requesterName = t.requesterId != null ? (requesterMap.get(t.requesterId) ?? '') : '';
        const haystack = [t.routeSnapshot, t.reasonSnapshot, t.vehicleType, requesterName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Date range
      if (fromDate && t.tripDate && t.tripDate < fromDate) return false;
      if (toDate && t.tripDate && t.tripDate > toDate) return false;
      // Status
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      // Vehicle type
      if (vehicleFilter !== 'all' && t.vehicleType !== vehicleFilter) return false;
      // Requester
      if (requesterFilter !== 'all' && t.requesterId !== requesterFilter) return false;
      return true;
    });
  }, [
    allTrips,
    query,
    fromDate,
    toDate,
    statusFilter,
    vehicleFilter,
    requesterFilter,
    requesterMap
  ]);

  const totalCost = useMemo(() => filtered.reduce((sum, t) => sum + (t.cost ?? 0), 0), [filtered]);

  const hasActiveFilters =
    !!query ||
    !!fromDate ||
    !!toDate ||
    statusFilter !== 'all' ||
    vehicleFilter !== 'all' ||
    requesterFilter !== 'all';

  const statusBtn = (label: string, value: StatusFilter) => (
    <button
      type="button"
      onClick={() => setStatusFilter(value)}
      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
        statusFilter === value
          ? 'bg-blue-600 text-white'
          : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">Buscar Viaje</h1>

        {/* Filters row 1 */}
        <div className="flex flex-wrap items-end gap-3 mb-3">
          {/* Text search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ruta o motivo…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Vehicle type */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Vehículo</label>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value as TripVehicleType | 'all')}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="all">Todos</option>
              {VEHICLE_OPTIONS.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Requester */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Solicitante</label>
            <select
              value={requesterFilter}
              onChange={(e) =>
                setRequesterFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 bg-white min-w-[160px]"
            >
              <option value="all">Todos</option>
              {usedRequesters.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters row 2 */}
        <div className="flex flex-wrap items-end gap-3">
          {/* From date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Desde</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* To date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Hasta</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1">
            {statusBtn('Todos', 'all')}
            {statusBtn('Pendientes', 'pending')}
            {statusBtn('Confirmados', 'ready')}
          </div>

          {/* Clear button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFromDate('');
                setToDate('');
                setStatusFilter('all');
                setVehicleFilter('all');
                setRequesterFilter('all');
              }}
              className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            Cargando viajes…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
            <Search size={32} className="opacity-30" />
            <span className="text-sm">No se encontraron viajes</span>
          </div>
        ) : (
          <>
            <div className="px-6 pt-3 pb-1 text-xs text-gray-500">
              {filtered.length} {filtered.length === 1 ? 'viaje encontrado' : 'viajes encontrados'}
            </div>
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-blue-600 text-white text-xs">
                  <th className="px-3 py-2 text-left font-medium border border-blue-700">Fecha</th>
                  <th className="px-3 py-2 text-left font-medium border border-blue-700">
                    Vehículo
                  </th>
                  <th className="px-3 py-2 text-left font-medium border border-blue-700">
                    Solicitante
                  </th>
                  <th className="px-3 py-2 text-left font-medium border border-blue-700">Ruta</th>
                  <th className="px-3 py-2 text-left font-medium border border-blue-700">Motivo</th>
                  <th className="px-3 py-2 text-center font-medium border border-blue-700 w-20">
                    Salida
                  </th>
                  <th className="px-3 py-2 text-center font-medium border border-blue-700 w-20">
                    Llegada
                  </th>
                  <th className="px-3 py-2 text-center font-medium border border-blue-700 w-16">
                    #Num
                  </th>
                  <th className="px-3 py-2 text-right font-medium border border-blue-700 w-24">
                    Costo
                  </th>
                  <th className="px-3 py-2 text-center font-medium border border-blue-700 w-24">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((trip) => (
                  <tr
                    key={trip.id}
                    className={`border-b border-gray-100 ${
                      trip.status === 'pending' ? 'bg-yellow-50' : 'bg-white'
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-3 py-1.5 border border-gray-200 whitespace-nowrap">
                      {trip.tripDate ?? '—'}
                    </td>
                    <td className="px-3 py-1.5 border border-gray-200 whitespace-nowrap">
                      {trip.vehicleType ? VEHICLE_LABELS[trip.vehicleType] : '—'}
                    </td>
                    <td className="px-3 py-1.5 border border-gray-200 whitespace-nowrap">
                      {trip.requesterId != null
                        ? (requesterMap.get(trip.requesterId) ?? `#${trip.requesterId}`)
                        : '—'}
                    </td>
                    <td className="px-3 py-1.5 border border-gray-200">
                      {trip.routeSnapshot ?? '—'}
                    </td>
                    <td className="px-3 py-1.5 border border-gray-200">
                      {trip.reasonSnapshot ?? '—'}
                    </td>
                    <td className="px-3 py-1.5 border border-gray-200 text-center whitespace-nowrap">
                      {trip.departureTime ?? '—'}
                    </td>
                    <td className="px-3 py-1.5 border border-gray-200 text-center whitespace-nowrap">
                      {trip.arrivalTime ?? '—'}
                    </td>
                    <td className="px-3 py-1.5 border border-gray-200 text-center">
                      {trip.passengerCount ?? '—'}
                    </td>
                    <td className="px-3 py-1.5 border border-gray-200 text-right whitespace-nowrap">
                      {trip.cost != null ? `$${trip.cost.toFixed(2)}` : '—'}
                    </td>
                    <td className="px-3 py-1.5 border border-gray-200 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          trip.status === 'ready'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {trip.status === 'ready' ? 'Confirmado' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-medium text-sm">
                  <td
                    colSpan={8}
                    className="px-3 py-2 border border-gray-200 text-right text-gray-600"
                  >
                    Total de Costos:
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-right text-gray-800 whitespace-nowrap">
                    ${totalCost.toFixed(2)}
                  </td>
                  <td className="border border-gray-200" />
                </tr>
              </tfoot>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
