import { CreateFarmDTO, Farm } from './farm.type';

export interface ElectronAPI {
  farms: {
    list: () => Promise<Farm[]>;
    getById: (id: string) => Promise<Farm>;
    create: (payload: CreateFarmDTO) => Promise<Farm>;
    update: (payload: UpdateFarmDTO) => Promise<Farm>;
    delete: (id: string) => Promise<void>;
  };
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}
