import { ipcMain } from 'electron'
import { FarmRepository } from '../../data/repositories/FarmRepository.js'
import { FarmController } from '../../interfaces/controllers/FarmController.js'

export function registerIpcHandlers(): void {
  const farmRepository = new FarmRepository()
  const farmController = new FarmController(farmRepository)

  ipcMain.handle('farms:list', async () => {
    return farmController.list()
  })

  ipcMain.handle('farms:create', async (_evt, payload: { name: string }) => {
    return farmController.create(payload)
  })
}
