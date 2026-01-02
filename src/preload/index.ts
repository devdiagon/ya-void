import { exposeElectronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

const api = {
  getFarms: () => ipcRenderer.invoke('farms:list'),
  createFarm: (name: string) => ipcRenderer.invoke('farms:create', { name })
}

if (process.contextIsolated) {
  try {
    exposeElectronAPI() // Expone process, ipcRenderer, etc (opcional)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (fallback para cuando no hay aislamiento)
  window.api = api
}
