export interface WorkZoneTripsByFarmMetric {
  farmId: number;
  farmName: string;
  totalTrips: number;
}

export interface WorkZoneSheetTotalsByFarmWorkZoneMetric {
  farmWorkZoneId: number;
  farmWorkZoneName: string;
  farmId: number;
  farmName: string;
  totalSheet: number;
}

export interface WorkZonePanelMetrics {
  workZoneId: number;
  totalTrips: number;
  tripsByFarm: WorkZoneTripsByFarmMetric[];
  totalSheetByFarmWorkZone: WorkZoneSheetTotalsByFarmWorkZoneMetric[];
}
