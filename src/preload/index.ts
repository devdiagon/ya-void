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
    create: (payload: { name: string; farmId: number; managerName?: string | null; managerCid?: string | null }) =>
      ipcRenderer.invoke('areas:create', payload),
    update: (id: number, payload: { name: string; farmId: number; managerName?: string | null; managerCid?: string | null }) =>
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
      ipcRenderer.invoke('requesters:removeFromArea', payload),
    findOrCreateForArea: (payload: { name: string; areaId: number }) =>
      ipcRenderer.invoke('requesters:findOrCreateForArea', payload)
  },

  // --- WORK ZONES ---
  workZones: {
    list: () => ipcRenderer.invoke('workZones:list'),
    getById: (id: number) => ipcRenderer.invoke('workZones:getById', id),
    getAllWorkZonesTrips: (workZoneId: number, farmWorkZoneId: number) => 
      ipcRenderer.invoke('workZones:getAllWorkZonesTrips', workZoneId, farmWorkZoneId),
    getPanelMetrics: (workZoneId: number) =>
      ipcRenderer.invoke('workZones:getPanelMetrics', workZoneId),
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
  },

  // --- ROUTES ---
  routes: {
    listByArea: (areaId: number) => ipcRenderer.invoke('routes:listByArea', areaId),
    getById: (id: number) => ipcRenderer.invoke('routes:getById', id),
    create: (payload: { name: string; areaId: number }) =>
      ipcRenderer.invoke('routes:create', payload),
    update: (id: number, payload: { name: string }) =>
      ipcRenderer.invoke('routes:update', id, payload),
    delete: (id: number) => ipcRenderer.invoke('routes:delete', id),
    findOrCreate: (payload: { name: string; areaId: number }) =>
      ipcRenderer.invoke('routes:findOrCreate', payload)
  },

  // --- REASONS ---
  reasons: {
    listByArea: (areaId: number) => ipcRenderer.invoke('reasons:listByArea', areaId),
    getById: (id: number) => ipcRenderer.invoke('reasons:getById', id),
    create: (payload: { name: string; areaId: number }) =>
      ipcRenderer.invoke('reasons:create', payload),
    update: (id: number, payload: { name: string }) =>
      ipcRenderer.invoke('reasons:update', id, payload),
    delete: (id: number) => ipcRenderer.invoke('reasons:delete', id),
    findOrCreate: (payload: { name: string; areaId: number }) =>
      ipcRenderer.invoke('reasons:findOrCreate', payload)
  },

  // --- SUBAREAS ---
  subareas: {
    listByArea: (areaId: number) => ipcRenderer.invoke('subareas:listByArea', areaId),
    getById: (id: number) => ipcRenderer.invoke('subareas:getById', id),
    create: (payload: { name: string; areaId: number }) =>
      ipcRenderer.invoke('subareas:create', payload),
    update: (id: number, payload: { name: string }) =>
      ipcRenderer.invoke('subareas:update', id, payload),
    delete: (id: number) => ipcRenderer.invoke('subareas:delete', id),
    findOrCreate: (payload: { name: string; areaId: number }) =>
      ipcRenderer.invoke('subareas:findOrCreate', payload)
  },

  // --- TRIPS ---
  trips: {
    listAll: (payload: {
      page: number
      pageSize: number
      query?: string
      fromDate?: string
      toDate?: string
      status?: 'pending' | 'ready'
      vehicleType?: 'Camioneta' | 'Furgoneta' | 'Microbus' | 'Bus'
      requesterId?: number
      areaId?: number
      farmId?: number
    }) => ipcRenderer.invoke('trips:listAll', payload),
    listByWorkZoneSheet: (workZoneSheetId: number) =>
      ipcRenderer.invoke('trips:listByWorkZoneSheet', workZoneSheetId),
    listByWorkZoneSheetAndStatus: (
      workZoneSheetId: number,
      status: 'pending' | 'ready'
    ) => ipcRenderer.invoke('trips:listByWorkZoneSheetAndStatus', workZoneSheetId, status),
    listByArea: (areaId: number) => ipcRenderer.invoke('trips:listByArea', areaId),
    listByDateRange: (payload: { from: string; to: string }) =>
      ipcRenderer.invoke('trips:listByDateRange', payload),
    getById: (id: number) => ipcRenderer.invoke('trips:getById', id),
    create: (payload: {
      vehicleType: 'Camioneta' | 'Furgoneta' | 'Microbus' | 'Bus' | null
      tripDate: string | null
      departureTime: string | null
      arrivalTime: string | null
      passengerCount: number | null
      cost: number | null
      requesterId: number | null
      areaId: number | null
      workZoneSheetId: number | null
      routeId: number | null
      reasonId: number | null
      subareaId?: number | null
    }) => ipcRenderer.invoke('trips:create', payload),
    update: (
      id: number,
      payload: {
        vehicleType?: 'Camioneta' | 'Furgoneta' | 'Microbus' | 'Bus'
        tripDate?: string
        departureTime?: string
        arrivalTime?: string
        passengerCount?: number
        cost?: number
        requesterId?: number
        areaId?: number
        workZoneSheetId?: number
        routeId?: number
        reasonId?: number
        subareaId?: number | null
      }
    ) => ipcRenderer.invoke('trips:update', { id, ...payload }),
    confirm: (id: number) => ipcRenderer.invoke('trips:confirm', id),
    reopen: (id: number) => ipcRenderer.invoke('trips:reopen', id),
    delete: (id: number) => ipcRenderer.invoke('trips:delete', id)
  }
})

// --- UPDATER ---
contextBridge.exposeInMainWorld('updater', {
  onUpdateAvailable: (callback: (info: unknown) => void) =>
    ipcRenderer.on('update-available', (_, info) => callback(info)),

  onUpdateDownloaded: (callback: () => void) =>
    ipcRenderer.on('update-downloaded', () => callback()),

  onDownloadProgress: (callback: (progress: number) => void) =>
    ipcRenderer.on('download-progress', (_, progress) => callback(progress)),

  onError: (callback: (err: string) => void) =>
    ipcRenderer.on('update-error', (_, err) => callback(err)),

  downloadUpdate: () => ipcRenderer.send('download-update'),
  installUpdate: () => ipcRenderer.send('install-update')
})

// --- APP-META ---
contextBridge.exposeInMainWorld('app', {
  getVersion: () => ipcRenderer.invoke('get-version')
})