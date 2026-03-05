import { TripVehicleType } from './trip.type';

export interface ExportTripRow {
  id: number;
  tripDate: string;
  departureTime: string;
  arrivalTime: string;
  waitingTime: string;
  passengerCount: number;
  reason: string;
  requester: {
    name: string;
    area: string;
  };
  route: string;
  cost: number;
  vehicleType: TripVehicleType;
}

export interface ExportTripWorkSheet {
  meta: {
    farmName: string;
    areaName: string;
    startDate: string;
    endDate: string;
    workSheetName: string;
  };
  rows: ExportTripRow[];
  totalCost: number;
}
