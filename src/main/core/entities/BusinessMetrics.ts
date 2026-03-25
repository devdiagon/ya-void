// Business intelligence metrics definitions for trips and work zone sheets.

export interface GlobalTripMetrics {
  totalLastMonth: number
  totalLastSixMonths: number
}

export interface FarmTripMetrics {
  farmId: number
  farmName: string
  tripsLastMonth: number
  tripsLastSixMonths: number
}

export interface WorkZoneFarmTripMetrics {
  farmWorkZoneId: number
  farmId: number
  farmName: string
  totalTrips: number
}

export interface WorkZoneTripMetrics {
  workZoneId: number
  totalTrips: number
  farms: WorkZoneFarmTripMetrics[]
}

export interface WorkZoneSheetTotalsByFarm {
  farmWorkZoneId: number
  farmId: number
  farmName: string
  totalSheet: number
}

export interface WorkZoneSheetDetailTotal {
  workZoneSheetId: number
  farmWorkZoneId: number
  areaId: number
  name: string
  totalSheet: number
}

export interface WorkZoneSheetTotals {
  workZoneId: number
  totalSheet: number
  byFarm: WorkZoneSheetTotalsByFarm[]
  bySheet: WorkZoneSheetDetailTotal[]
}

export interface BusinessMetrics {
  globalTrips: GlobalTripMetrics
  farmTrips: FarmTripMetrics[]
  workZoneTrips: WorkZoneTripMetrics[]
  workZoneSheets: WorkZoneSheetTotals[]
}
