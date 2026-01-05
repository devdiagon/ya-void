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
  }
})
