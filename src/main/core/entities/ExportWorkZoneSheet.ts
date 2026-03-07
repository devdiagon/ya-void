import { TripVehicleType } from "./Trip";

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