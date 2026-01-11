// eslint-disable-next-line prettier/prettier
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  // --- FARMS ---
  farms: {
    list: () => ipcRenderer.invoke('farms:list'),
    getById: (id: number) => ipcRenderer.invoke('farms:getById', id),
    create: (payload: { name: string }) => ipcRenderer.invoke('farms:create', payload),
    update: (id: number, payload: { name: string }) =>
      ipcRenderer.invoke('farms:update', id, payload),
    delete: (id: number) => ipcRenderer.invoke('farms:delete', id)
  },

  // --- AREAS ---
  areas: {
    listByFarm: (farmId: number) => ipcRenderer.invoke('areas:listByFarm', farmId),
    getById: (id: number) => ipcRenderer.invoke('areas:getById', id),
    create: (payload: { name: string; farmId: number }) =>
      ipcRenderer.invoke('areas:create', payload),
    update: (id: number, payload: { name: string; farmId: number }) =>
      ipcRenderer.invoke('areas:update', id, payload),
    delete: (id: number) => ipcRenderer.invoke('areas:delete', id)
  },

  // --- REQUESTERS ---
  requesters: {
    listAll: () => ipcRenderer.invoke('requesters:listAll'),
    listByArea: (areaId: number) => ipcRenderer.invoke('requesters:listByArea', areaId),
    listByFarm: (farmId: number) => ipcRenderer.invoke('requesters:listByFarm', farmId),
    create: (payload: { name: string }) => ipcRenderer.invoke('requesters:create', payload),
    update: (id: number, payload: { name: string }) =>
      ipcRenderer.invoke('requesters:update', id, payload),
    delete: (id: number) => ipcRenderer.invoke('requesters:delete', id),
    assignToArea: (payload: { requesterId: number; areaId: number }) =>
      ipcRenderer.invoke('requesters:assignToArea', payload),
    removeFromArea: (payload: { requesterId: number; areaId: number }) =>
      ipcRenderer.invoke('requesters:removeFromArea', payload)
  },

  // --- WORK ZONES ---
  workZones: {
    list: () => ipcRenderer.invoke('workZones:list'),
    getById: (id: number) => ipcRenderer.invoke('workZones:getById', id),
    create: (payload: { name: string; startDate: string; endDate: string }) =>
      ipcRenderer.invoke('workZones:create', payload),
    update: (id: number, payload: { name: string; startDate: string; endDate: string }) =>
      ipcRenderer.invoke('workZones:update', id, payload),
    delete: (id: number) => ipcRenderer.invoke('workZones:delete', id)
  },

  // --- FARM WORK ZONES ---
  farmWorkZones: {
    listByWorkZone: (workZoneId: number) =>
      ipcRenderer.invoke('farmWorkZones:listByWorkZone', workZoneId),
    getById: (id: number) => ipcRenderer.invoke('farmWorkZones:getById', id),
    create: (payload: { workZoneId: number; farmId: number; name: string }) =>
      ipcRenderer.invoke('farmWorkZones:create', payload),
    update: (payload: { id: number; workZoneId: number; farmId: number; name: string }) =>
      ipcRenderer.invoke('farmWorkZones:update', payload),
    delete: (id: number) => ipcRenderer.invoke('farmWorkZones:delete', id)
  },

  // --- WORK ZONE SHEETS ---
  workZoneSheets: {
    listByFarmWorkZone: (farmWorkZoneId: number) =>
      ipcRenderer.invoke('workZoneSheets:listByFarmWorkZone', farmWorkZoneId),
    getById: (id: number) => ipcRenderer.invoke('workZoneSheets:getById', id),
    create: (payload: {
      name: string
      farmWorkZoneId: number
      areaId: number
      totalSheet: number
    }) => ipcRenderer.invoke('workZoneSheets:create', payload),
    update: (payload: {
      id: number
      name: string
      farmWorkZoneId: number
      areaId: number
      totalSheet: number
    }) => ipcRenderer.invoke('workZoneSheets:update', payload),
    delete: (id: number) => ipcRenderer.invoke('workZoneSheets:delete', id)
  }
})
