import { app, ipcMain } from 'electron'

// --- Repositories ---
import { AreaRepository } from '../../data/repositories/AreaRepository'
import { FarmRepository } from '../../data/repositories/FarmRepository'
import { FarmWorkZoneRepository } from '../../data/repositories/FarmWorkZoneRepository'
import { ReasonRepository } from '../../data/repositories/ReasonRepository'
import { RequesterRepository } from '../../data/repositories/RequesterRepository'
import { RouteRepository } from '../../data/repositories/RouteRepository'
import { SubareaRepository } from '../../data/repositories/SubareaRepository'
import { TripRepository } from '../../data/repositories/TripRepository'
import { WorkZoneRepository } from '../../data/repositories/WorkZoneRepository'
import { WorkZoneSheetRepository } from '../../data/repositories/WorkZoneSheetRepository'

// --- Controllers ---
import { AreaController } from '../../interfaces/controllers/AreaController'
import { FarmController } from '../../interfaces/controllers/FarmController'
import { FarmWorkZoneController } from '../../interfaces/controllers/FarmWorkZoneController'
import { ReasonController } from '../../interfaces/controllers/ReasonController'
import { RequesterController } from '../../interfaces/controllers/RequesterController'
import { RouteController } from '../../interfaces/controllers/RouteController'
import { SubareaController } from '../../interfaces/controllers/SubareaController'
import { TripController } from '../../interfaces/controllers/TripController'
import { WorkZoneController } from '../../interfaces/controllers/WorkZoneController'
import { WorkZoneSheetController } from '../../interfaces/controllers/WorkZoneSheetController'

// --- Entities (para tipado en handlers si es necesario) ---
import { FarmWorkZone } from '../../core/entities/FarmWorkZone'
import { Trip, TripStatus, TripVehicleType } from '../../core/entities/Trip'
import { WorkZoneSheet } from '../../core/entities/WorkZoneSheet'

export function registerIpcHandlers(): void {
  // 1. Instanciar Repositorios
  const farmRepo = new FarmRepository()
  const areaRepo = new AreaRepository()
  const requesterRepo = new RequesterRepository()
  const workZoneRepo = new WorkZoneRepository()
  const farmWorkZoneRepo = new FarmWorkZoneRepository()
  const workZoneSheetRepo = new WorkZoneSheetRepository()
  const routeRepo = new RouteRepository()
  const reasonRepo = new ReasonRepository()
  const subareaRepo = new SubareaRepository()
  const tripRepo = new TripRepository()

  // 2. Instanciar Controladores
  const farmCtrl = new FarmController(farmRepo)
  const areaCtrl = new AreaController(areaRepo)
  const requesterCtrl = new RequesterController(requesterRepo)
  const workZoneCtrl = new WorkZoneController(workZoneRepo)
  const farmWorkZoneCtrl = new FarmWorkZoneController(farmWorkZoneRepo)
  const workZoneSheetCtrl = new WorkZoneSheetController(workZoneSheetRepo)
  const routeCtrl = new RouteController(routeRepo)
  const reasonCtrl = new ReasonController(reasonRepo)
  const subareaCtrl = new SubareaController(subareaRepo)
  const tripCtrl = new TripController(tripRepo)

  // --- META DATA HANDLERS ---
  ipcMain.handle('get-version', () => app.getVersion())

  // --- FARMS HANDLERS ---
  ipcMain.handle('farms:list', () => farmCtrl.list())
  ipcMain.handle('farms:getById', (_, id: number) => farmCtrl.getById(id))
  ipcMain.handle('farms:create', (_, payload: { name: string }) => farmCtrl.create(payload))
  ipcMain.handle('farms:update', (_, id: number, payload: { name: string }) =>
    farmCtrl.update(id, payload)
  )
  ipcMain.handle('farms:delete', (_, id: number) => farmCtrl.delete(id))

  // --- AREAS HANDLERS ---
  ipcMain.handle('areas:listByFarm', (_, farmId: number) => areaCtrl.listByFarm(farmId))
  ipcMain.handle('areas:getById', (_, id: number) => areaCtrl.getById(id))
  ipcMain.handle('areas:create', (_, payload: { name: string; farmId: number }) =>
    areaCtrl.create(payload)
  )
  ipcMain.handle('areas:update', (_, id: number, payload: { name: string; farmId: number }) =>
    areaCtrl.update(id, payload)
  )
  ipcMain.handle('areas:delete', (_, id: number) => areaCtrl.delete(id))

  // --- REQUESTERS HANDLERS ---
  ipcMain.handle('requesters:listAll', () => requesterCtrl.listAll())
  ipcMain.handle('requesters:listByArea', (_, areaId: number) => requesterCtrl.listByArea(areaId))
  ipcMain.handle('requesters:listByFarm', (_, farmId: number) => requesterCtrl.listByFarm(farmId))
  ipcMain.handle('requesters:create', (_, payload: { name: string }) =>
    requesterCtrl.create(payload)
  )
  ipcMain.handle('requesters:update', (_, id: number, payload: { name: string }) =>
    requesterCtrl.update(id, payload)
  )
  ipcMain.handle('requesters:delete', (_, id: number) => requesterCtrl.delete(id))
  ipcMain.handle('requesters:assignToArea', (_, payload: { requesterId: number; areaId: number }) =>
    requesterCtrl.assignToArea(payload)
  )
  ipcMain.handle(
    'requesters:removeFromArea',
    (_, payload: { requesterId: number; areaId: number }) => requesterCtrl.removeFromArea(payload)
  )
  ipcMain.handle('requesters:findOrCreateForArea', (_, payload: { name: string; areaId: number }) =>
    requesterCtrl.findOrCreateForArea(payload)
  )

  // --- WORK ZONES HANDLERS ---
  ipcMain.handle('workZones:list', () => workZoneCtrl.listWorkZones())
  ipcMain.handle('workZones:getById', (_, id: number) => workZoneCtrl.getWorkZoneById(id))
  ipcMain.handle(
    'workZones:getAllWorkZonesTrips',
     (_, workZoneId: number, farmWorkZoneId: number) =>
      workZoneCtrl.getAllFarmRelatedTrips(workZoneId, farmWorkZoneId)
  )
  ipcMain.handle(
    'workZones:create',
    (_, payload: { name: string; startDate: string; endDate: string }) =>
      workZoneCtrl.createWorkZone(payload)
  )
  ipcMain.handle(
    'workZones:update',
    (_, id: number, payload: { name: string; startDate: string; endDate: string }) =>
      workZoneCtrl.updateWorkZone(id, payload)
  )
  ipcMain.handle('workZones:delete', (_, id: number) => workZoneCtrl.deleteWorkZone(id))

  // --- FARM WORK ZONES HANDLERS ---
  ipcMain.handle('farmWorkZones:listByWorkZone', (_, workZoneId: number) =>
    farmWorkZoneCtrl.listByWorkZone(workZoneId)
  )
  ipcMain.handle('farmWorkZones:getById', (_, id: number) => farmWorkZoneCtrl.getById(id))
  ipcMain.handle(
    'farmWorkZones:create',
    (_, payload: { workZoneId: number; farmId: number; name: string }) =>
      farmWorkZoneCtrl.create(payload)
  )
  ipcMain.handle('farmWorkZones:update', (_, payload: FarmWorkZone) =>
    farmWorkZoneCtrl.update(payload)
  )
  ipcMain.handle('farmWorkZones:delete', (_, id: number) => farmWorkZoneCtrl.delete(id))

  // --- WORK ZONE SHEETS HANDLERS ---
  ipcMain.handle('workZoneSheets:listByFarmWorkZone', (_, farmWorkZoneId: number) =>
    workZoneSheetCtrl.listByFarmWorkZone(farmWorkZoneId)
  )
  ipcMain.handle('workZoneSheets:getById', (_, id: number) => workZoneSheetCtrl.getById(id))
  ipcMain.handle('workZoneSheets:create', (_, payload: Omit<WorkZoneSheet, 'id'>) =>
    workZoneSheetCtrl.create(payload)
  )
  ipcMain.handle('workZoneSheets:update', (_, payload: WorkZoneSheet) =>
    workZoneSheetCtrl.update(payload)
  )
  ipcMain.handle('workZoneSheets:delete', (_, id: number) => workZoneSheetCtrl.delete(id))

  // --- ROUTES HANDLERS ---
  ipcMain.handle('routes:listByArea', (_, areaId: number) => routeCtrl.listByArea(areaId))
  ipcMain.handle('routes:getById', (_, id: number) => routeCtrl.getById(id))
  ipcMain.handle('routes:create', (_, payload: { name: string; areaId: number }) =>
    routeCtrl.create(payload)
  )
  ipcMain.handle('routes:update', (_, id: number, payload: { name: string }) =>
    routeCtrl.update(id, payload)
  )
  ipcMain.handle('routes:delete', (_, id: number) => routeCtrl.delete(id))
  ipcMain.handle('routes:findOrCreate', (_, payload: { name: string; areaId: number }) =>
    routeCtrl.findOrCreate(payload)
  )

  // --- REASONS HANDLERS ---
  ipcMain.handle('reasons:listByArea', (_, areaId: number) => reasonCtrl.listByArea(areaId))
  ipcMain.handle('reasons:getById', (_, id: number) => reasonCtrl.getById(id))
  ipcMain.handle('reasons:create', (_, payload: { name: string; areaId: number }) =>
    reasonCtrl.create(payload)
  )
  ipcMain.handle('reasons:update', (_, id: number, payload: { name: string }) =>
    reasonCtrl.update(id, payload)
  )
  ipcMain.handle('reasons:delete', (_, id: number) => reasonCtrl.delete(id))
  ipcMain.handle('reasons:findOrCreate', (_, payload: { name: string; areaId: number }) =>
    reasonCtrl.findOrCreate(payload)
  )

  // --- SUBAREAS HANDLERS ---
  ipcMain.handle('subareas:listByArea', (_, areaId: number) => subareaCtrl.listByArea(areaId))
  ipcMain.handle('subareas:getById', (_, id: number) => subareaCtrl.getById(id))
  ipcMain.handle('subareas:create', (_, payload: { name: string; areaId: number }) =>
    subareaCtrl.create(payload)
  )
  ipcMain.handle('subareas:update', (_, id: number, payload: { name: string }) =>
    subareaCtrl.update(id, payload)
  )
  ipcMain.handle('subareas:delete', (_, id: number) => subareaCtrl.delete(id))
  ipcMain.handle('subareas:findOrCreate', (_, payload: { name: string; areaId: number }) =>
    subareaCtrl.findOrCreate(payload)
  )

  // --- TRIPS HANDLERS ---
  ipcMain.handle(
    'trips:listAll',
    (
      _,
      payload: {
        page: number
        pageSize: number
        query?: string
        fromDate?: string
        toDate?: string
        status?: TripStatus
        vehicleType?: TripVehicleType
        requesterId?: number
        areaId?: number
        farmId?: number
      }
    ) => tripCtrl.listAll(payload)
  )
  ipcMain.handle('trips:listByWorkZoneSheet', (_, workZoneSheetId: number) =>
    tripCtrl.listByWorkZoneSheet(workZoneSheetId)
  )
  ipcMain.handle(
    'trips:listByWorkZoneSheetAndStatus',
    (_, workZoneSheetId: number, status: TripStatus) =>
      tripCtrl.listByWorkZoneSheetAndStatus(workZoneSheetId, status)
  )
  ipcMain.handle('trips:listByArea', (_, areaId: number) => tripCtrl.listByArea(areaId))
  ipcMain.handle('trips:listByDateRange', (_, payload: { from: string; to: string }) =>
    tripCtrl.listByDateRange(payload)
  )
  ipcMain.handle('trips:getById', (_, id: number) => tripCtrl.getById(id))
  ipcMain.handle(
    'trips:create',
    (_, payload: Omit<Trip, 'id' | 'status' | 'routeSnapshot' | 'reasonSnapshot' | 'subareaSnapshot'>) =>
      tripCtrl.create(payload)
  )
  ipcMain.handle('trips:update', (_, payload: Trip) => tripCtrl.update(payload))
  ipcMain.handle('trips:confirm', (_, id: number) => tripCtrl.confirm(id))
  ipcMain.handle('trips:reopen', (_, id: number) => tripCtrl.reopen(id))
  ipcMain.handle('trips:delete', (_, id: number) => tripCtrl.delete(id))
}
