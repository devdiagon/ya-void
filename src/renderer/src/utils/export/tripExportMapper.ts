import { ExportTripWorkSheet, ExportWorkZoneSheet } from '@renderer/types';
import { calcTimeDifference, formatDate, formatDateNoYear, formatShortDate } from '../dateUtils';

// From ExportWorkZoneSheet[] (backend) ------> ExportTripWorkSheet (frontend export use) with formatted date
export const buildExportPayload = (data: ExportWorkZoneSheet[]): ExportTripWorkSheet[] => {
  return data.map((sheet) => ({
    meta: {
      farmName: sheet.workSheet.farmName,
      areaName: sheet.workSheet.areaName,
      startDate: formatDateNoYear(sheet.workSheet.startDate),
      endDate: formatDate(sheet.workSheet.endDate),
      workSheetName: sheet.workSheet.name
    },
    rows: sheet.trips.map((trip) => ({
      tripDate: formatShortDate(trip.tripDate),
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      waitingTime: calcTimeDifference(trip.arrivalTime, trip.departureTime),
      passengerCount: trip.passengerCount,
      reason: trip.reason,
      requester: trip.requester,
      route: trip.route,
      cost: trip.cost,
      vehicleType: trip.vehicleType
    })),
    manager: sheet.manager
  }));
};
