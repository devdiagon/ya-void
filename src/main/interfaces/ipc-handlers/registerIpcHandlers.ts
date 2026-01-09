import { ipcMain } from 'electron'

// --- Repositories ---
import { AreaRepository } from '../../data/repositories/AreaRepository'
import { FarmRepository } from '../../data/repositories/FarmRepository'
import { FarmWorkZoneRepository } from '../../data/repositories/FarmWorkZoneRepository'
import { RequesterRepository } from '../../data/repositories/RequesterRepository'
import { WorkZoneRepository } from '../../data/repositories/WorkZoneRepository'
import { WorkZoneSheetRepository } from '../../data/repositories/WorkZoneSheetRepository'

// --- Controllers ---
import { AreaController } from '../../interfaces/controllers/AreaController'
import { FarmController } from '../../interfaces/controllers/FarmController'
import { FarmWorkZoneController } from '../../interfaces/controllers/FarmWorkZoneController'
import { RequesterController } from '../../interfaces/controllers/RequesterController'
import { WorkZoneController } from '../../interfaces/controllers/WorkZoneController'
import { WorkZoneSheetController } from '../../interfaces/controllers/WorkZoneSheetController'

// --- Entities (para tipado en handlers si es necesario) ---
import { FarmWorkZone } from '../../core/entities/FarmWorkZone'
import { WorkZoneSheet } from '../../core/entities/WorkZoneSheet'

export function registerIpcHandlers(): void {
  // 1. Instanciar Repositorios
  const farmRepo = new FarmRepository()
  const areaRepo = new AreaRepository()
  const requesterRepo = new RequesterRepository()
  const workZoneRepo = new WorkZoneRepository()
  const farmWorkZoneRepo = new FarmWorkZoneRepository()
  const workZoneSheetRepo = new WorkZoneSheetRepository()

  // 2. Instanciar Controladores
  const farmCtrl = new FarmController(farmRepo)
  const areaCtrl = new AreaController(areaRepo)
  const requesterCtrl = new RequesterController(requesterRepo)
  const workZoneCtrl = new WorkZoneController(workZoneRepo)
  const farmWorkZoneCtrl = new FarmWorkZoneController(farmWorkZoneRepo)
  const workZoneSheetCtrl = new WorkZoneSheetController(workZoneSheetRepo)

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

  // --- WORK ZONES HANDLERS ---
  ipcMain.handle('workZones:list', () => workZoneCtrl.listWorkZones())
  ipcMain.handle('workZones:getById', (_, id: number) => workZoneCtrl.getWorkZoneById(id))
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
}
