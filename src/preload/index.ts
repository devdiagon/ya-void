import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  getFarms: () => ipcRenderer.invoke('farms:list'),
  createFarm: (name: string) => ipcRenderer.invoke('farms:create', { name })
})
