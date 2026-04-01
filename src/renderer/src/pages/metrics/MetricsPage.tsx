import { ActionButton } from '@renderer/components';
import { ErrorCard } from '@renderer/components/Card';
import { useMetrics, useWorkZones } from '@renderer/hooks';
import { PAGE_SUBTITLE_CLASS, PAGE_TITLE_CLASS } from '@renderer/utils';
import {
  BarChart2Icon,
  BarChart3Icon,
  LayersIcon,
  MapPinIcon,
  RefreshCwIcon,
  TrendingUpIcon
} from 'lucide-react';
import { ReactNode, useMemo, useState } from 'react';

type RangeFilter = '1m' | '6m';

type StatCardProps = {
  label: string;
  value: number | string;
  helper?: string;
  icon?: ReactNode;
};

const StatCard = ({ label, value, helper, icon }: StatCardProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-start gap-3">
      {icon && <div className="text-blue-600 mt-0.5">{icon}</div>}
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 text-3xl font-extrabold text-blue-600">{value}</p>
        {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
      </div>
    </div>
  );
};

type CombinedFarmMetrics = {
  farmWorkZoneId: number;
  farmId: number;
  farmName: string;
  totalTrips: number;
  totalSheet: number;
  sheets: {
    workZoneSheetId: number;
    name: string;
    totalSheet: number;
  }[];
};

export const MetricsPage = () => {
  const { metrics, loading: metricsLoading, errors, refetch, clearError } = useMetrics();
  const { workZones, loading: workZonesLoading } = useWorkZones();

  const [range, setRange] = useState<RangeFilter>('1m');
  const [selectedWorkZoneId, setSelectedWorkZoneId] = useState<number | null>(null);

  const resolvedWorkZoneId = selectedWorkZoneId ?? workZones[0]?.id ?? null;

  const selectedWorkZone = useMemo(
    () => workZones.find((wz) => wz.id === resolvedWorkZoneId) ?? null,
    [resolvedWorkZoneId, workZones]
  );

  const selectedWorkZoneTrips = useMemo(
    () => metrics?.workZoneTrips.find((wz) => wz.workZoneId === resolvedWorkZoneId),
    [metrics, resolvedWorkZoneId]
  );

  const selectedWorkZoneSheets = useMemo(
    () => metrics?.workZoneSheets.find((wz) => wz.workZoneId === resolvedWorkZoneId),
    [metrics, resolvedWorkZoneId]
  );

  const farmTrips = metrics?.farmTrips ?? [];
  const isLoading = metricsLoading || workZonesLoading;

  const workZoneFarmMetrics: CombinedFarmMetrics[] = useMemo(() => {
    if (!selectedWorkZoneTrips && !selectedWorkZoneSheets) return [];

    const byFarm = new Map<number, CombinedFarmMetrics>();

    const sheetsByFarm: Record<number, CombinedFarmMetrics['sheets']> = {};
    (selectedWorkZoneSheets?.bySheet ?? []).forEach((sheet) => {
      if (!sheetsByFarm[sheet.farmWorkZoneId]) sheetsByFarm[sheet.farmWorkZoneId] = [];
      sheetsByFarm[sheet.farmWorkZoneId].push({
        workZoneSheetId: sheet.workZoneSheetId,
        name: sheet.name,
        totalSheet: sheet.totalSheet
      });
    });

    (selectedWorkZoneTrips?.farms ?? []).forEach((farm) => {
      byFarm.set(farm.farmWorkZoneId, {
        farmWorkZoneId: farm.farmWorkZoneId,
        farmId: farm.farmId,
        farmName: farm.farmName,
        totalTrips: farm.totalTrips,
        totalSheet: 0,
        sheets: sheetsByFarm[farm.farmWorkZoneId] ?? []
      });
    });

    (selectedWorkZoneSheets?.byFarm ?? []).forEach((farm) => {
      const existing = byFarm.get(farm.farmWorkZoneId);
      if (existing) {
        existing.totalSheet = farm.totalSheet;
        existing.sheets = sheetsByFarm[farm.farmWorkZoneId] ?? existing.sheets;
      } else {
        byFarm.set(farm.farmWorkZoneId, {
          farmWorkZoneId: farm.farmWorkZoneId,
          farmId: farm.farmId,
          farmName: farm.farmName,
          totalTrips: 0,
          totalSheet: farm.totalSheet,
          sheets: sheetsByFarm[farm.farmWorkZoneId] ?? []
        });
      }
    });

    return Array.from(byFarm.values()).sort((a, b) => a.farmName.localeCompare(b.farmName));
  }, [selectedWorkZoneSheets, selectedWorkZoneTrips]);

  const rangeButton = (value: RangeFilter, label: string) => {
    const isActive = range === value;
    return (
      <button
        type="button"
        onClick={() => setRange(value)}
        className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
          isActive
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        {label}
      </button>
    );
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value == null || Number.isNaN(value)) return '—';
    return value.toLocaleString('es-ES');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-6 border-b border-gray-200 bg-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <BarChart3Icon size={18} />
              <span className="text-xs font-semibold uppercase tracking-wide">Panel</span>
            </div>
            <h1 className={PAGE_TITLE_CLASS}>Panel de métricas</h1>
            <p className={PAGE_SUBTITLE_CLASS}>Visualiza viajes y totales por zona de trabajo</p>
          </div>

          <ActionButton
            variant="primary"
            size="md"
            icon={<RefreshCwIcon size={18} />}
            onClick={() => {
              clearError('fetch');
              refetch();
            }}
            loading={metricsLoading}
          >
            Actualizar
          </ActionButton>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 overflow-auto bg-gray-50">
        {errors.fetch ? (
          <div className="h-full flex items-center justify-center">
            <ErrorCard
              message={errors.fetch}
              onRetry={() => {
                clearError('fetch');
                refetch();
              }}
              retryText="Reintentar"
            />
          </div>
        ) : isLoading ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            Cargando métricas…
          </div>
        ) : !metrics ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            No hay datos de métricas disponibles
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Bloque 1: resumen global */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Resumen global</h2>
                  <p className="text-sm text-gray-500">
                    Viajes confirmados y distribución por finca
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {rangeButton('1m', 'Último mes')}
                  {rangeButton('6m', 'Últimos 6 meses')}
                </div>
              </div>

              <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2">
                <StatCard
                  label="Viajes del último mes"
                  value={formatNumber(metrics.globalTrips.totalLastMonth)}
                  helper="Estado confirmado"
                  icon={<TrendingUpIcon size={22} />}
                />
                <StatCard
                  label="Viajes de los últimos 6 meses"
                  value={formatNumber(metrics.globalTrips.totalLastSixMonths)}
                  helper="Estado confirmado"
                  icon={<BarChart2Icon size={22} />}
                />
              </div>

              <div className="px-4 pb-4">
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Viajes por finca</h3>
                  {farmTrips.length === 0 ? (
                    <div className="text-sm text-gray-500">No hay viajes registrados.</div>
                  ) : (
                    <table className="w-full table-auto text-sm">
                      <thead>
                        <tr className="text-left text-gray-600 text-xs uppercase tracking-wide">
                          <th className="px-3 py-2">Finca</th>
                          <th className="px-3 py-2 text-right">
                            {range === '1m' ? 'Viajes 1 mes' : 'Viajes 6 meses'}
                          </th>
                          <th className="px-3 py-2 text-right">Viajes 6 meses</th>
                        </tr>
                      </thead>
                      <tbody>
                        {farmTrips.map((farm) => (
                          <tr key={farm.farmId} className="border-t border-gray-100 hover:bg-white">
                            <td className="px-3 py-2 text-gray-800">{farm.farmName}</td>
                            <td className="px-3 py-2 text-right font-semibold text-gray-900">
                              {formatNumber(
                                range === '1m' ? farm.tripsLastMonth : farm.tripsLastSixMonths
                              )}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-600">
                              {formatNumber(farm.tripsLastSixMonths)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </section>

            {/* Bloque 2: zona y métricas asociadas */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Zonas de trabajo</h2>
                  <p className="text-sm text-gray-500">
                    Selecciona una zona para ver viajes y hojas asociadas
                  </p>
                </div>

                <div className="flex items-center gap-2 min-w-[240px]">
                  <MapPinIcon size={18} className="text-blue-600" />
                  <select
                    value={resolvedWorkZoneId ?? ''}
                    onChange={(e) =>
                      setSelectedWorkZoneId(e.target.value ? Number(e.target.value) : null)
                    }
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 bg-white w-full"
                    disabled={workZonesLoading || workZones.length === 0}
                  >
                    <option value="" disabled>
                      {workZonesLoading ? 'Cargando zonas…' : 'Selecciona una zona'}
                    </option>
                    {workZones.map((wz) => (
                      <option key={wz.id} value={wz.id}>
                        {wz.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!selectedWorkZone ? (
                <div className="p-4 text-sm text-gray-500">
                  Seleccione una zona de trabajo para ver métricas.
                </div>
              ) : (
                <div className="p-4 flex flex-col gap-4">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <StatCard
                      label="Viajes en zona seleccionada"
                      value={formatNumber(selectedWorkZoneTrips?.totalTrips)}
                      helper={selectedWorkZone.name}
                      icon={<TrendingUpIcon size={20} />}
                    />
                    <StatCard
                      label="Total de hojas (zona seleccionada)"
                      value={formatNumber(selectedWorkZoneSheets?.totalSheet)}
                      helper={selectedWorkZone.name}
                      icon={<LayersIcon size={20} />}
                    />
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <BarChart2Icon size={16} className="text-blue-600" />
                      <span>Fincas en la zona</span>
                    </div>

                    {workZoneFarmMetrics.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">No hay datos para esta zona.</div>
                    ) : (
                      <table className="w-full table-auto text-sm">
                        <thead>
                          <tr className="bg-white text-left text-gray-600 text-xs uppercase tracking-wide">
                            <th className="px-3 py-2">Finca</th>
                            <th className="px-3 py-2 text-right">Viajes</th>
                            <th className="px-3 py-2 text-right">Total hojas</th>
                            <th className="px-3 py-2">Hojas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workZoneFarmMetrics.map((farm) => (
                            <tr
                              key={farm.farmWorkZoneId}
                              className="border-t border-gray-100 align-top hover:bg-gray-50"
                            >
                              <td className="px-3 py-2 text-gray-800 font-medium">
                                {farm.farmName}
                              </td>
                              <td className="px-3 py-2 text-right text-gray-900 font-semibold">
                                {formatNumber(farm.totalTrips)}
                              </td>
                              <td className="px-3 py-2 text-right text-gray-900 font-semibold">
                                {formatNumber(farm.totalSheet)}
                              </td>
                              <td className="px-3 py-2 text-gray-700">
                                {farm.sheets.length === 0 ? (
                                  <span className="text-gray-500">Sin hojas</span>
                                ) : (
                                  <ul className="space-y-1">
                                    {farm.sheets.map((sheet) => (
                                      <li
                                        key={sheet.workZoneSheetId}
                                        className="flex items-center justify-between gap-3"
                                      >
                                        <span className="text-sm">{sheet.name}</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                          {formatNumber(sheet.totalSheet)}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
