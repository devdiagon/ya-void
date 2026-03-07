import { ExportWorkZoneSheet } from '../../core/entities/ExportWorkZoneSheet'
import { TripVehicleType } from '../../core/entities/Trip';

export type ExportTripRow = {
  work_zone_sheet_id: number;
  farm_name: string;
  area_name: string;
  start_date: string;
  end_date: string;
  work_sheet_name: string;
  manager_name: string;
  manager_ci: string;
  trip_id: number;
  trip_date: string;
  departure_time: string;
  arrival_time: string;
  passenger_count: number;
  reason: string;
  route: string;
  subarea: string;
  cost: number;
  vehicle_type: TripVehicleType;
  requester_name: string;
  requester_area: string;
}

export function mapRowToExportWorkZoneSheet(rows: ExportTripRow[]): ExportWorkZoneSheet[] {
  const sheetsMap = new Map<number, ExportWorkZoneSheet>();

  for (const row of rows) {
    // Si la sheet aún no existe en el mapa, inicializarla
    if (!sheetsMap.has(row.work_zone_sheet_id)) {
      sheetsMap.set(row.work_zone_sheet_id, {
        workSheet: {
          farmName:  row.farm_name,
          areaName:  row.area_name,
          startDate: row.start_date,
          endDate:   row.end_date,
          name:      row.work_sheet_name,
        },
        manager: {
          name: row.manager_name,
          ci:   row.manager_ci,
        },
        trips: [],
      });
    }

    // Agrega el trip a la sheet correspondiente (poblar cada área con trips)
    sheetsMap.get(row.work_zone_sheet_id)!.trips.push({
      tripDate:       row.trip_date,
      departureTime:  row.departure_time,
      arrivalTime:    row.arrival_time,
      passengerCount: row.passenger_count,
      reason:         row.reason,
      route:          row.route,
      cost:           row.cost,
      vehicleType:    row.vehicle_type,
      requester: {
        name: row.requester_name,
        area: row.requester_area,
      },
    });
  }

  return Array.from(sheetsMap.values());
}
