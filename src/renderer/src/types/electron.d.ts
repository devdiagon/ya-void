import { Area, FormAreaDTO } from './area.type';
import { ExportWorkZoneSheet } from './export.trip.type';
import { Farm, FormFarmDTO } from './farm.type';
import { FarmWorkZone, FormFarmWorkZoneDTO } from './farmWorkZone.type';
import { FormReasonDTO, Reason } from './reason.type';
import { FormRequesterDTO, Requester } from './requester.type';
import { FormRouteDTO, Route } from './route.type';
import { FormSubareaDTO, Subarea } from './subarea.type';
import { FormTripDTO, Trip, TripStatus } from './trip.type';
import { FormWorkZoneDTO, WorkZone } from './workZone.type';
import { FormWorkZoneSheetDTO, WorkZoneSheet } from './workZoneSheet.type';

export interface VoyAppAPI {
  farms: {
    list: () => Promise<Farm[]>;
    getById: (id: number) => Promise<Farm>;
    create: (payload: FormFarmDTO) => Promise<Farm>;
    update: (id: number, payload: { name: string }) => Promise<Farm>;
    delete: (id: number) => Promise<void>;
  };
  areas: {
    listByFarm: (farmId: number) => Promise<Area[]>;
    getById: (id: number) => Promise<Area>;
    create: (payload: FormAreaDTO) => Promise<Area>;
    update: (id: number, payload: FormAreaDTO) => Promise<Area>;
    delete: (id: number) => Promise<void>;
  };
  requesters: {
    listAll: () => Promise<Requester[]>;
    listByArea: (areaId: number) => Promise<Requester[]>;
    listByFarm: (farmId: number) => Promise<Requester[]>;
    create: (payload: FormRequesterDTO) => Promise<Requester>;
    update: (id: number, payload: FormRequesterDTO) => Promise<Requester>;
    delete: (id: number) => Promise<void>;
    assignToArea: (payload: { requesterId: number; areaId: number }) => Promise<void>;
    removeFromArea: (payload: { requesterId: number; areaId: number }) => Promise<void>;
    findOrCreateForArea: (payload: { name: string; areaId: number }) => Promise<Requester>;
  };
  workZones: {
    list: () => Promise<WorkZone[]>;
    getById: (id: number) => Promise<WorkZone>;
    getAllWorkZonesTrips: (
      workZoneId: number,
      farmWorkZoneId: number
    ) => Promise<ExportWorkZoneSheet[]>;
    create: (payload: FormWorkZoneDTO) => Promise<WorkZone>;
    update: (id: number, payload: FormWorkZoneDTO) => Promise<void>;
    delete: (id: number) => Promise<void>;
  };
  farmWorkZones: {
    listByWorkZone: (workZoneId: number) => Promise<FarmWorkZone[]>;
    getById: (id: number) => Promise<FarmWorkZone>;
    create: (payload: FormFarmWorkZoneDTO) => Promise<FarmWorkZone>;
    update: (payload: { id: number } & FormFarmWorkZoneDTO) => Promise<FarmWorkZone>;
    delete: (id: number) => Promise<void>;
  };
  workZoneSheets: {
    listByFarmWorkZone: (farmWorkZoneId: number) => Promise<WorkZoneSheet[]>;
    getById: (id: number) => Promise<WorkZoneSheet>;
    create: (payload: FormWorkZoneSheetDTO) => Promise<WorkZoneSheet>;
    update: (payload: { id: number } & FormWorkZoneSheetDTO) => Promise<WorkZoneSheet>;
    delete: (id: number) => Promise<void>;
  };
  routes: {
    listByArea: (areaId: number) => Promise<Route[]>;
    getById: (id: number) => Promise<Route>;
    create: (payload: FormRouteDTO) => Promise<Route>;
    update: (id: number, payload: { name: string }) => Promise<boolean>;
    delete: (id: number) => Promise<void>;
    findOrCreate: (payload: { name: string; areaId: number }) => Promise<Route>;
  };
  reasons: {
    listByArea: (areaId: number) => Promise<Reason[]>;
    getById: (id: number) => Promise<Reason>;
    create: (payload: FormReasonDTO) => Promise<Reason>;
    update: (id: number, payload: { name: string }) => Promise<boolean>;
    delete: (id: number) => Promise<void>;
    findOrCreate: (payload: { name: string; areaId: number }) => Promise<Reason>;
  };
  subareas: {
    listByArea: (areaId: number) => Promise<Subarea[]>;
    getById: (id: number) => Promise<Subarea>;
    create: (payload: FormSubareaDTO) => Promise<Subarea>;
    update: (id: number, payload: { name: string }) => Promise<boolean>;
    delete: (id: number) => Promise<void>;
    findOrCreate: (payload: { name: string; areaId: number }) => Promise<Subarea>;
  };
  trips: {
    listAll: (payload: {
      page: number;
      pageSize: number;
      query?: string;
      fromDate?: string;
      toDate?: string;
      status?: TripStatus;
      vehicleType?: TripVehicleType;
      requesterId?: number;
      areaId?: number;
      farmId?: number;
    }) => Promise<{ trips: Trip[]; total: number }>;
    listByWorkZoneSheet: (workZoneSheetId: number) => Promise<Trip[]>;
    listByWorkZoneSheetAndStatus: (workZoneSheetId: number, status: TripStatus) => Promise<Trip[]>;
    listByArea: (areaId: number) => Promise<Trip[]>;
    listByDateRange: (startDate: string, endDate: string) => Promise<Trip[]>;
    getById: (id: number) => Promise<Trip>;
    create: (payload: FormTripDTO) => Promise<Trip>;
    update: (id: number, payload: FormTripDTO) => Promise<boolean>;
    confirm: (id: number) => Promise<{ success: true } | { success: false; missing: string[] }>;
    reopen: (id: number) => Promise<boolean>;
    delete: (id: number) => Promise<void>;
  };
}

export interface VoyAppUpdater {
  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => void;
  onUpdateDownloaded: (callback: () => void) => void;
  onDownloadProgress: (callback: (progress: number) => void) => void;
  onError: (callback: (err: string) => void) => void;
  downloadUpdate: () => void;
  installUpdate: () => void;
}

declare global {
  interface Window {
    api: VoyAppAPI;
    updater: VoyAppUpdater;
  }
}
