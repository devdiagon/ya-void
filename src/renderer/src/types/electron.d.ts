import { Area, FormAreaDTO } from './area.type';
import { Farm, FormFarmDTO } from './farm.type';
import { FormRequesterDTO, Requester } from './requester.type';

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
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}
