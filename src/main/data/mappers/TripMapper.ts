import { Trip, TripStatus, TripVehicleType } from '../../core/entities/Trip'

export type TripRow = {
  id: number
  vehicle_type: TripVehicleType | null
  status: TripStatus
  trip_date: string | null
  departure_time: string | null
  arrival_time: string | null
  passenger_count: number | null
  cost: number | null
  requester_id: number | null
  area_id: number | null
  work_zone_sheet_id: number | null
  route_id: number | null
  reason_id: number | null
  route_snapshot: string | null
  reason_snapshot: string | null
}

export function mapRowToTrip(raw: TripRow): Trip {
  return {
    id: raw.id,
    vehicleType: raw.vehicle_type,
    status: raw.status,
    tripDate: raw.trip_date,
    departureTime: raw.departure_time,
    arrivalTime: raw.arrival_time,
    passengerCount: raw.passenger_count,
    cost: raw.cost,
    requesterId: raw.requester_id,
    areaId: raw.area_id,
    workZoneSheetId: raw.work_zone_sheet_id,
    routeId: raw.route_id,
    reasonId: raw.reason_id,
    routeSnapshot: raw.route_snapshot,
    reasonSnapshot: raw.reason_snapshot
  }
}
