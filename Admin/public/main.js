const { app, BrowserWindow } = require('electron');
const path = require('path');
require('@electron/remote/main').initialize();

async function createWindow() {
  const isDev = (await import('electron-is-dev')).default;

  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Disable for compatibility with nodeIntegration
      enableRemoteModule: true,
    },
    autoHideMenuBar: true, // Optional
  });

  // Load the React app
  win.loadURL(
    isDev
      ? 'http://localhost:3000' // Development server URL
      : `file://${path.join(__dirname, '../build/index.html')}` // Production build path
  );

  // Open dev tools in development mode inspect element (optional)
  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
