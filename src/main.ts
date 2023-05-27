import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'path'
import url from 'url'

// import * as remoteMain from '@electron/remote/main';
// remoteMain.initialize();

let mainWindow: Electron.BrowserWindow | null

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      devTools: true,
      preload: path.join(__dirname, './preload.bundle.js'),
      webSecurity: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    } as Electron.WebPreferences,
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html').finally(() => { /* no action */ });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows.length === 0) createWindow();
  });
}).finally(() => { /* no action */ });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('renderer-ready', () => {
  // eslint-disable-next-line no-console
  console.log('Renderer is ready.');
});

ipcMain.on('clipMp4', (event, message) => {
  // TODO: clip the mp4 and save to disk!!!
  console.log(`Clipping MP4: ${JSON.stringify(message)}`)
})

// Add the following lines to make opencv-js available in the main process
import cv from "@techstark/opencv-js";
(global as unknown as { cv: unknown }).cv = cv
