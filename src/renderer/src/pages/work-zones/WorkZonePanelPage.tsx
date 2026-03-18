import { ErrorCard } from '@renderer/components/Card';
import { useWorkZones } from '@renderer/hooks';
import { WorkZonePanelMetrics } from '@renderer/types';
import { PAGE_SUBTITLE_CLASS, PAGE_TITLE_CLASS } from '@renderer/utils';
import { BarChart3Icon, Building2Icon, FileSpreadsheetIcon, RouteIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const WorkZonePanelPage = () => {
  const { workZones, loading: loadingWorkZones, errors: workZoneErrors } = useWorkZones();

  const [selectedWorkZoneId, setSelectedWorkZoneId] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<WorkZonePanelMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  const effectiveWorkZoneId = selectedWorkZoneId ?? workZones[0]?.id ?? null;

  const fetchMetrics = useCallback(async (workZoneId: number) => {
    setLoadingMetrics(true);
    setMetricsError(null);

    try {
      const response = await window.api.workZones.getPanelMetrics(workZoneId);
      setMetrics(response);
    } catch (err) {
      console.error(err);
      setMetrics(null);
      setMetricsError('No se pudieron obtener las métricas del panel');
    } finally {
      setLoadingMetrics(false);
    }
  }, []);

  useEffect(() => {
    if (!effectiveWorkZoneId) return;
    void fetchMetrics(effectiveWorkZoneId);
  }, [effectiveWorkZoneId, fetchMetrics]);

  const selectedWorkZoneName = useMemo(() => {
    if (!effectiveWorkZoneId) return '';
    return workZones.find((zone) => zone.id === effectiveWorkZoneId)?.name ?? '';
  }, [effectiveWorkZoneId, workZones]);

  const totalFarmTrips = useMemo(() => {
    if (!metrics) return 0;
    return metrics.tripsByFarm.reduce((sum, farmMetric) => sum + farmMetric.totalTrips, 0);
  }, [metrics]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-6 border-b border-gray-200 bg-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className={PAGE_TITLE_CLASS}>Panel</h1>
            <p className={PAGE_SUBTITLE_CLASS}>
              Visualiza indicadores de viajes por zona de trabajo, finca y farm work zone
            </p>
          </div>

          <div className="min-w-64">
            <label
              htmlFor="work-zone-panel-selector"
              className="text-xs font-semibold text-gray-600"
            >
              Zona de trabajo
            </label>
            <select
              id="work-zone-panel-selector"
              value={effectiveWorkZoneId ?? ''}
              onChange={(event) => setSelectedWorkZoneId(Number(event.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={loadingWorkZones || workZones.length === 0}
            >
              {workZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50 px-6 py-6">
        {workZoneErrors.fetch ? (
          <div className="h-full flex items-center justify-center">
            <ErrorCard
              message={workZoneErrors.fetch}
              onRetry={() => window.location.reload()}
              retryText="Reintentar"
            />
          </div>
        ) : metricsError ? (
          <div className="h-full flex items-center justify-center">
            <ErrorCard
              message={metricsError}
              onRetry={() => (effectiveWorkZoneId ? void fetchMetrics(effectiveWorkZoneId) : null)}
              retryText="Reintentar"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <RouteIcon size={18} />
                  <p className="text-sm font-semibold">Viajes realizados (total)</p>
                </div>
                <p className="mt-3 text-3xl font-black text-gray-900">
                  {loadingMetrics ? '...' : (metrics?.totalTrips ?? 0)}
                </p>
                <p className="mt-1 text-xs text-gray-500">Estado considerado: ready</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2Icon size={18} />
                  <p className="text-sm font-semibold">Viajes sumados por finca</p>
                </div>
                <p className="mt-3 text-3xl font-black text-gray-900">
                  {loadingMetrics ? '...' : totalFarmTrips}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {selectedWorkZoneName || 'Sin zona seleccionada'}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FileSpreadsheetIcon size={18} />
                  <p className="text-sm font-semibold">Farm work zones con sheets</p>
                </div>
                <p className="mt-3 text-3xl font-black text-gray-900">
                  {loadingMetrics ? '...' : (metrics?.totalSheetByFarmWorkZone.length ?? 0)}
                </p>
                <p className="mt-1 text-xs text-gray-500">Sumatoria desde total_sheet por sheet</p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <BarChart3Icon size={18} className="text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-800">Viajes realizados por finca</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Finca</th>
                      <th className="px-4 py-3 text-right">Viajes realizados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics?.tripsByFarm.map((row) => (
                      <tr key={row.farmId} className="border-t border-gray-100 text-gray-800">
                        <td className="px-4 py-3">{row.farmName}</td>
                        <td className="px-4 py-3 text-right font-semibold">{row.totalTrips}</td>
                      </tr>
                    ))}
                    {!loadingMetrics && (metrics?.tripsByFarm.length ?? 0) === 0 && (
                      <tr>
                        <td className="px-4 py-4 text-center text-gray-500" colSpan={2}>
                          No hay datos para la zona seleccionada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <FileSpreadsheetIcon size={18} className="text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-800">
                  Total por farm work zone (suma de total_sheet)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Finca</th>
                      <th className="px-4 py-3">Farm Work Zone</th>
                      <th className="px-4 py-3 text-right">Total Sheet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics?.totalSheetByFarmWorkZone.map((row) => (
                      <tr
                        key={row.farmWorkZoneId}
                        className="border-t border-gray-100 text-gray-800"
                      >
                        <td className="px-4 py-3">{row.farmName}</td>
                        <td className="px-4 py-3">{row.farmWorkZoneName}</td>
                        <td className="px-4 py-3 text-right font-semibold">{row.totalSheet}</td>
                      </tr>
                    ))}
                    {!loadingMetrics && (metrics?.totalSheetByFarmWorkZone.length ?? 0) === 0 && (
                      <tr>
                        <td className="px-4 py-4 text-center text-gray-500" colSpan={3}>
                          No hay datos para la zona seleccionada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
