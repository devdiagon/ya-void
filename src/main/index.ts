import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import path, { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { registerIpcHandlers } from './interfaces/ipc-handlers/registerIpcHandlers'

// Dev ONLY -TESTING TMP
if (!app.isPackaged) {
  autoUpdater.updateConfigPath = path.join(__dirname, '../../dev-update.yml')
  Object.defineProperty(app, 'isPackaged', { get: () => true })
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    center: true,
    title: 'VOY!',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

    checkForUpdates(mainWindow)
}

// Auto Updates - Check
function checkForUpdates(mainWindow: BrowserWindow) {
  autoUpdater.autoDownload = false
  autoUpdater.checkForUpdates()

  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update-available', info)
  })

  autoUpdater.on('download-progress', (progress) => {
    mainWindow.webContents.send('download-progress', Math.floor(progress.percent))
  })

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-downloaded')
  })

  autoUpdater.on('error', (err) => {
    mainWindow.webContents.send('update-error', err.message)
  })

  // Listeners from renderer
  ipcMain.on('download-update', () => autoUpdater.downloadUpdate())
  ipcMain.on('install-update', () => autoUpdater.quitAndInstall())
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // --- INICIALIZACIÓN DE LA CAPA DE DATOS E IPC ---
  registerIpcHandlers()

  // IPC test existente
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
