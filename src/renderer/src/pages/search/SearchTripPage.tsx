import { Area, Farm, Requester, Trip, TripStatus, TripVehicleType } from '@renderer/types';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const PAGE_SIZE = 50;

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
  const [trips, setTrips] = useState<Trip[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Catalog data
  const [farms, setFarms] = useState<Farm[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [requesters, setRequesters] = useState<Requester[]>([]);

  // Filters
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [vehicleFilter, setVehicleFilter] = useState<TripVehicleType | 'all'>('all');
  const [farmFilter, setFarmFilter] = useState<number | 'all'>('all');
  const [areaFilter, setAreaFilter] = useState<number | 'all'>('all');
  const [requesterFilter, setRequesterFilter] = useState<number | 'all'>('all');

  // Pagination
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Debounce query input
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(value);
      setPage(1);
    }, 350);
  };

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const result = await window.api.trips.listAll({
        page,
        pageSize: PAGE_SIZE,
        query: debouncedQuery.trim() || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        vehicleType: vehicleFilter !== 'all' ? vehicleFilter : undefined,
        // Si hay área seleccionada, el área ya implica la finca — no enviar ambos
        farmId: farmFilter !== 'all' && areaFilter === 'all' ? farmFilter : undefined,
        areaId: areaFilter !== 'all' ? areaFilter : undefined,
        requesterId: requesterFilter !== 'all' ? requesterFilter : undefined
      });
      setTrips(result.trips);
      setTotal(result.total);
    } catch (err) {
      console.error('Error al obtener viajes:', err);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    debouncedQuery,
    fromDate,
    toDate,
    statusFilter,
    vehicleFilter,
    farmFilter,
    areaFilter,
    requesterFilter
  ]);

  // Load farms once on mount
  useEffect(() => {
    window.api.farms.list().then(setFarms).catch(console.error);
  }, []);

  // Load areas when farm changes
  useEffect(() => {
    setAreaFilter('all');
    setRequesterFilter('all');
    setAreas([]);
    setRequesters([]);
    if (farmFilter !== 'all') {
      window.api.areas.listByFarm(farmFilter).then(setAreas).catch(console.error);
    }
    setPage(1);
  }, [farmFilter]);

  // Load requesters when area changes
  useEffect(() => {
    setRequesterFilter('all');
    setRequesters([]);
    if (areaFilter !== 'all') {
      window.api.requesters.listByArea(areaFilter).then(setRequesters).catch(console.error);
    }
    setPage(1);
  }, [areaFilter]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const requesterMap = useMemo(() => new Map(requesters.map((r) => [r.id, r.name])), [requesters]);

  const totalCost = useMemo(() => trips.reduce((sum, t) => sum + (t.cost ?? 0), 0), [trips]);

  const hasActiveFilters =
    !!query ||
    !!fromDate ||
    !!toDate ||
    statusFilter !== 'all' ||
    vehicleFilter !== 'all' ||
    farmFilter !== 'all' ||
    areaFilter !== 'all' ||
    requesterFilter !== 'all';

  const clearFilters = () => {
    setQuery('');
    setDebouncedQuery('');
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setFromDate('');
    setToDate('');
    setStatusFilter('all');
    setVehicleFilter('all');
    setFarmFilter('all');
    setAreaFilter('all');
    setRequesterFilter('all');
    setPage(1);
  };

  // Build a combined requester lookup: if no area selected, we can't show names
  // (trips in search may span areas; show id as fallback)
  const resolveRequesterName = (id: number | null) => {
    if (id == null) return '—';
    return requesterMap.get(id) ?? `#${id}`;
  };

  const statusBtn = (label: string, value: StatusFilter) => (
    <button
      type="button"
      onClick={() => {
        setStatusFilter(value);
        setPage(1);
      }}
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
              onChange={(e) => handleQueryChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Vehicle type */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Vehículo</label>
            <select
              value={vehicleFilter}
              onChange={(e) => {
                setVehicleFilter(e.target.value as TripVehicleType | 'all');
                setPage(1);
              }}
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

          {/* Farm */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Finca</label>
            <select
              value={farmFilter}
              onChange={(e) =>
                setFarmFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 bg-white min-w-[150px]"
            >
              <option value="all">Todas</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Area — visible only when a farm is selected */}
          {farmFilter !== 'all' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Área</label>
              <select
                value={areaFilter}
                onChange={(e) =>
                  setAreaFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 bg-white min-w-[150px]"
              >
                <option value="all">Todas</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Requester — visible only when an area is selected */}
          {areaFilter !== 'all' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Solicitante</label>
              <select
                value={requesterFilter}
                onChange={(e) => {
                  setRequesterFilter(e.target.value === 'all' ? 'all' : Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 bg-white min-w-[160px]"
              >
                <option value="all">Todos</option>
                {requesters.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Filters row 2 */}
        <div className="flex flex-wrap items-end gap-3">
          {/* From date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Desde</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* To date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Hasta</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
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
              onClick={clearFilters}
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
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
            <Search size={32} className="opacity-30" />
            <span className="text-sm">No se encontraron viajes</span>
          </div>
        ) : (
          <>
            <div className="px-6 pt-3 pb-1 text-xs text-gray-500">
              {total} {total === 1 ? 'viaje encontrado' : 'viajes encontrados'} · página {page} de{' '}
              {totalPages}
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
                {trips.map((trip) => (
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
                      {resolveRequesterName(trip.requesterId)}
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
                    Total de Costos (página):
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-right text-gray-800 whitespace-nowrap">
                    ${totalCost.toFixed(2)}
                  </td>
                  <td className="border border-gray-200" />
                </tr>
              </tfoot>
            </table>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 px-6 py-3 border-t border-gray-200 bg-white">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-600">
                  Página <span className="font-semibold text-gray-800">{page}</span> de{' '}
                  <span className="font-semibold text-gray-800">{totalPages}</span>
                </span>
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
