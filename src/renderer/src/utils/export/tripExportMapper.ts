import { ExportTripRow, ExportTripWorkSheet, Trip } from '@renderer/types';
import { calcTimeDifference } from '../dateUtils';

interface BuildExportPayloadParams {
  trips: Trip[];
  farmName: string;
  areaName: string;
  startDate: string;
  endDate: string;
  workSheetName: string;
  totalCost: number;
  getRequesterName: (id: number | null) => string; // Parent callback to get requester Name based on on its ID
}

export const buildExportPayload = ({
  trips,
  farmName,
  areaName,
  startDate,
  endDate,
  workSheetName,
  totalCost,
  getRequesterName
}: BuildExportPayloadParams): ExportTripWorkSheet => {
  const rows: ExportTripRow[] = trips.map((trip) => ({
    id: trip.id,
    tripDate: trip.tripDate ?? '-',
    departureTime: trip.departureTime ?? '-',
    arrivalTime: trip.arrivalTime ?? '-',
    waitingTime: calcTimeDifference(trip.departureTime ?? '00:00', trip.arrivalTime ?? '00:00'),
    passengerCount: trip.passengerCount ?? 0,
    reason: trip.reasonSnapshot ?? '-',
    requester: {
      name: getRequesterName(trip.requesterId),
      area: areaName
    },
    route: trip.routeSnapshot ?? '-',
    cost: trip.cost ?? 0,
    vehicleType: trip.vehicleType ?? 'Camioneta'
  }));

  return {
    meta: {
      farmName: farmName,
      areaName: areaName,
      startDate: startDate,
      endDate: endDate,
      workSheetName: workSheetName
    },
    rows,
    totalCost
  };
};
