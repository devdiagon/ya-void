import { TripVehicleType } from './trip.type';

// Related Interfaces when the data is fetched from the backend
interface ReadyTrip {
  tripDate: string;
  departureTime: string;
  arrivalTime: string;
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

export interface ExportWorkZoneSheet {
  workSheet: {
    farmName: string;
    areaName: string;
    startDate: string;
    endDate: string;
    name: string;
  };
  trips: ReadyTrip[];
  manager: {
    name: string;
    ci: string;
  };
}

// Related Interfaces to export Trip data to Excel
export interface ExportTripRow {
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
  manager: {
    name: string;
    ci: string;
  };
}
