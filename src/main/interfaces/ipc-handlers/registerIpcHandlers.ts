import { ipcMain } from 'electron'

// Repositories
import { AreaRepository } from '../../data/repositories/AreaRepository.js'
import { FarmRepository } from '../../data/repositories/FarmRepository.js'
import { RequesterRepository } from '../../data/repositories/RequesterRepository.js'

// Controllers
import { AreaController } from '../../interfaces/controllers/AreaController.js'
import { FarmController } from '../../interfaces/controllers/FarmController.js'
import { RequesterController } from '../../interfaces/controllers/RequesterController.js'

export function registerIpcHandlers(): void {
  // 1. Instanciar Repositorios
  const farmRepo = new FarmRepository()
  const areaRepo = new AreaRepository()
  const requesterRepo = new RequesterRepository()

  // 2. Instanciar Controladores
  const farmCtrl = new FarmController(farmRepo)
  const areaCtrl = new AreaController(areaRepo)
  const requesterCtrl = new RequesterController(requesterRepo)

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

  // Relaciones Muchos a Muchos
  ipcMain.handle('requesters:assignToArea', (_, payload: { requesterId: number; areaId: number }) =>
    requesterCtrl.assignToArea(payload)
  )
  ipcMain.handle(
    'requesters:removeFromArea',
    (_, payload: { requesterId: number; areaId: number }) => requesterCtrl.removeFromArea(payload)
  )
}
