export type TripVehicleType = 'Camioneta' | 'Furgoneta' | 'Microbus' | 'Bus'

export type TripStatus = 'pending' | 'ready'

export interface Trip {
  id: number
  vehicleType: TripVehicleType | null
  status: TripStatus
  tripDate: string | null
  departureTime: string | null
  arrivalTime: string | null
  passengerCount: number | null
  cost: number | null
  requesterId: number | null
  areaId: number | null
  workZoneSheetId: number | null
  routeId: number | null
  reasonId: number | null
  subareaId: number | null
  routeSnapshot: string | null
  reasonSnapshot: string | null
  subareaSnapshot: string | null
}
