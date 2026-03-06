import { ExportButton, IconButton } from '@renderer/components';
import { useReasons, useRequesters, useRoutes, useSubareas, useTrips } from '@renderer/hooks';
import { FormTripDTO, Trip, TripVehicleType } from '@renderer/types';
import { buildExportPayload, exportTripsToPDF } from '@renderer/utils';
import { SquarePenIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { emptyTripForm, TripFormData, TripFormRow } from './TripFormRow';

interface TripTableProps {
  workZoneSheetId: number;
  sheetName: string;
  areaId: number;
  parentAreaName: string;
  parentFarmName: string;
  sheetStartDate: string;
  sheetEndDate: string;
}

function toDTO(form: TripFormData, workZoneSheetId: number, areaId: number): FormTripDTO {
  return {
    tripDate: form.tripDate || undefined,
    vehicleType: (form.vehicleType as TripVehicleType) || undefined,
    requesterId: form.requesterId ?? undefined,
    departureTime: form.departureTime || undefined,
    arrivalTime: form.arrivalTime || undefined,
    passengerCount: form.passengerCount ? Number(form.passengerCount) : undefined,
    routeId: form.routeId ?? undefined,
    reasonId: form.reasonId ?? undefined,
    subareaId: form.subareaId ?? undefined,
    cost: form.cost ? Number(form.cost) : undefined,
    workZoneSheetId,
    areaId
  };
}

function formatDate(d: string | null) {
  if (!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
}

const cell = 'border border-gray-200 px-2 py-1.5 text-sm align-middle';
const hdr =
  'border border-blue-700 px-2 py-2 text-xs font-semibold text-white bg-blue-800 whitespace-nowrap';

export function TripTable({
  workZoneSheetId,
  sheetName,
  areaId,
  parentAreaName,
  parentFarmName,
  sheetStartDate,
  sheetEndDate
}: TripTableProps) {
  const { trips, loading, createTrip, updateTrip, confirmTrip, reopenTrip, deleteTrip } =
    useTrips(workZoneSheetId);
  const { routes, findOrCreate: findOrCreateRoute, updateRoute, deleteRoute } = useRoutes(areaId);
  const {
    reasons,
    findOrCreate: findOrCreateReason,
    updateReason,
    deleteReason
  } = useReasons(areaId);
  const { requesters, findOrCreateForArea } = useRequesters(areaId);
  const {
    subareas,
    findOrCreate: findOrCreateSubarea,
    updateSubarea,
    deleteSubarea
  } = useSubareas(areaId);

  const [newForm, setNewForm] = useState<TripFormData>(emptyTripForm());
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<TripFormData>(emptyTripForm());

  const totalReady = trips.filter((t) => t.status === 'ready').length;
  const totalPending = trips.filter((t) => t.status === 'pending').length;
  const totalCost = trips.reduce((sum, t) => sum + (t.cost ?? 0), 0);

  const handleCreate = async () => {
    const created = await createTrip(toDTO(newForm, workZoneSheetId, areaId));
    if (created) await confirmTrip(created.id);
    setNewForm(emptyTripForm());
  };

  const startEdit = (trip: Trip) => {
    setEditId(trip.id);
    setEditForm({
      tripDate: trip.tripDate ?? '',
      vehicleType: (trip.vehicleType as TripVehicleType) ?? '',
      requesterId: trip.requesterId,
      departureTime: trip.departureTime ?? '',
      arrivalTime: trip.arrivalTime ?? '',
      passengerCount: trip.passengerCount != null ? String(trip.passengerCount) : '',
      routeId: trip.routeId,
      reasonId: trip.reasonId,
      subareaId: trip.subareaId,
      cost: trip.cost != null ? String(trip.cost) : ''
    });
  };

  const handleEditSave = async () => {
    if (!editId) return;
    // Reopen first so confirmed trips can be edited, then re-confirm
    await reopenTrip(editId);
    await updateTrip(editId, toDTO(editForm, workZoneSheetId, areaId));
    await confirmTrip(editId);
    setEditId(null);
  };

  const requesterLabel = (id: number | null) =>
    id ? (requesters.find((r) => r.id === id)?.name ?? '—') : '—';
  const routeLabel = (id: number | null, snap: string | null) =>
    snap ?? (id ? (routes.find((r) => r.id === id)?.name ?? '—') : '—');
  const reasonLabel = (id: number | null, snap: string | null) =>
    snap ?? (id ? (reasons.find((r) => r.id === id)?.name ?? '—') : '—');
  const subareaLabel = (id: number | null, snap: string | null) =>
    snap ?? (id ? (subareas.find((s) => s.id === id)?.name ?? '—') : '—');

  const sharedRowProps = {
    routes,
    reasons,
    requesters,
    onFindOrCreateRoute: findOrCreateRoute,
    onFindOrCreateReason: findOrCreateReason,
    onFindOrCreateRequester: (name: string) => findOrCreateForArea(name),
    onEditRoute: async (opt: { id: number; name: string }, newName: string) => {
      await updateRoute(opt.id, newName);
    },
    onDeleteRoute: async (opt: { id: number }) => {
      await deleteRoute(opt.id);
    },
    onEditReason: async (opt: { id: number; name: string }, newName: string) => {
      await updateReason(opt.id, newName);
    },
    onDeleteReason: async (opt: { id: number }) => {
      await deleteReason(opt.id);
    },
    subareas,
    onFindOrCreateSubarea: findOrCreateSubarea,
    onEditSubarea: async (opt: { id: number; name: string }, newName: string) => {
      await updateSubarea(opt.id, newName);
    },
    onDeleteSubarea: async (opt: { id: number }) => {
      await deleteSubarea(opt.id);
    }
  };

  const handlePDFDownloadClick = () => {
    const validTrips = trips.filter((trip) => trip.status === 'ready');

    if (validTrips.length === 0) {
      return;
    }

    // At this point every attribute MUST be non null due to the "ready" status validation
    const payload = buildExportPayload({
      trips: validTrips,
      farmName: parentFarmName,
      areaName: parentAreaName,
      startDate: sheetStartDate,
      endDate: sheetEndDate,
      workSheetName: sheetName,
      totalCost,
      getRequesterName: requesterLabel
    });

    exportTripsToPDF(payload);
  };

  const handleExelDownloadClick = () => {
    const validTrips = trips.filter((trip) => trip.status === 'ready');

    if (validTrips.length === 0) {
      return;
    }

    // At this point every attribute MUST be non null due to the "ready" status validation
    const payload = buildExportPayload({
      trips: validTrips,
      farmName: parentFarmName,
      areaName: parentAreaName,
      startDate: sheetStartDate,
      endDate: sheetEndDate,
      workSheetName: sheetName,
      totalCost,
      getRequesterName: requesterLabel
    });

    //exportTripsToExcel(payload);
  };

  if (loading) {
    return <p className="text-sm text-gray-400 py-4">Cargando viajes…</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}

      <div className="flex justify-between">
        {/* Progress */}
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-base font-semibold text-gray-800">Viajes — {sheetName}</h2>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            Total: {trips.length}
          </span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Realizados: {totalReady}
          </span>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
            Pendientes: {totalPending}
          </span>
        </div>

        {/* Download Button */}
        <ExportButton
          onPDFDownload={handlePDFDownloadClick}
          onExcelDownload={handleExelDownloadClick}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={hdr}>Fecha</th>
              <th className={hdr}>Vehículo</th>
              <th className={hdr}>Llegada</th>
              <th className={hdr}>Salida</th>
              <th className={`${hdr} text-center w-[64px]`}>#Num</th>
              <th className={hdr}>Solicitante</th>
              <th className={`${hdr} min-w-[140px]`}>Área</th>
              <th className={`${hdr} min-w-[300px]`}>Motivo</th>
              <th className={`${hdr} min-w-[300px]`}>Ruta</th>
              <th className={`${hdr} text-right`}>Costo ($)</th>
              <th className={hdr}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {/* ── New trip row (always visible at top) ── */}
            <TripFormRow
              form={newForm}
              setForm={setNewForm}
              onSave={handleCreate}
              onCancel={() => setNewForm(emptyTripForm())}
              {...sharedRowProps}
            />

            {/* ── Existing trips ── */}
            {trips.map((trip) =>
              editId === trip.id ? (
                /* Inline edit row */
                <TripFormRow
                  key={trip.id}
                  form={editForm}
                  setForm={setEditForm}
                  onSave={handleEditSave}
                  onCancel={() => setEditId(null)}
                  {...sharedRowProps}
                />
              ) : (
                /* Read-only row */
                <tr
                  key={trip.id}
                  className={`group ${
                    trip.status === 'pending' ? 'bg-yellow-50' : 'bg-white'
                  } hover:bg-blue-50/20 transition-colors`}
                >
                  <td className={cell}>{formatDate(trip.tripDate)}</td>
                  <td className={cell}>{trip.vehicleType ?? '—'}</td>
                  <td className={cell}>{trip.arrivalTime ?? '—'}</td>
                  <td className={cell}>{trip.departureTime ?? '—'}</td>
                  <td className={`${cell} text-center`}>{trip.passengerCount ?? '—'}</td>
                  <td className={cell}>{requesterLabel(trip.requesterId)}</td>
                  <td className={`${cell} break-words`}>
                    {subareaLabel(trip.subareaId, trip.subareaSnapshot)}
                  </td>
                  <td className={`${cell} break-words`}>
                    {reasonLabel(trip.reasonId, trip.reasonSnapshot)}
                  </td>
                  <td className={`${cell} break-words`}>
                    {routeLabel(trip.routeId, trip.routeSnapshot)}
                  </td>
                  <td className={`${cell} text-right font-medium`}>
                    {trip.cost != null ? `$${trip.cost.toFixed(2)}` : '—'}
                  </td>
                  <td className={cell}>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconButton
                        icon={<SquarePenIcon size={15} />}
                        onClick={() => startEdit(trip)}
                        ariaLabel="Editar"
                        size="xs"
                        variant="info"
                      />
                      <IconButton
                        icon={<Trash2 size={15} />}
                        onClick={() => deleteTrip(trip.id)}
                        ariaLabel="Eliminar"
                        size="xs"
                        variant="danger"
                      />
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>

          {/* Total row */}
          <tfoot>
            <tr className="bg-gray-50">
              <td
                colSpan={9}
                className={`${cell} text-right font-medium text-gray-700 border-t-2 border-gray-300`}
              >
                Total de Costos:
              </td>
              <td
                className={`${cell} text-right font-semibold text-gray-900 border-t-2 border-gray-300`}
              >
                ${totalCost.toFixed(2)}
              </td>
              <td className={`${cell} border-t-2 border-gray-300`} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
