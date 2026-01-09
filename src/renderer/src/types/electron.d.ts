import { CreateFarmDTO, Farm } from './farm.type';

export interface ElectronAPI {
  farms: {
    list: () => Promise<Farm[]>;
    getById: (id: string) => Promise<Farm>;
    create: (payload: CreateFarmDTO) => Promise<Farm>;
    update: (id: number, payload: { name: string }) => Promise<Farm>;
    delete: (id: number) => Promise<void>;
  };
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}
