import { Area, FormAreaDTO } from './area.type';
import { Farm, FormFarmDTO } from './farm.type';
import { FarmWorkZone, FormFarmWorkZoneDTO } from './farmWorkZone.type';
import { FormRequesterDTO, Requester } from './requester.type';
import { FormWorkZoneDTO, WorkZone } from './workZone.type';

export interface ElectronAPI {
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
  };
  workZones: {
    list: () => Promise<WorkZone[]>;
    getById: (id: number) => Promise<WorkZone>;
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
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}
