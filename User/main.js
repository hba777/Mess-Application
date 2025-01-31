const path = require("path");
const { app, BrowserWindow } = require("electron");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      devTools: false, // Disable DevTools explicitly
    },
  });

  mainWindow.loadFile(path.join(__dirname, "build", "index.html"));

  // Prevent opening DevTools via keyboard shortcuts
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (
      (input.control || input.meta) &&
      (input.key.toLowerCase() === "i" || input.key.toLowerCase() === "j")
    ) {
      event.preventDefault();
    }
  });

  // Disable right-click context menu to prevent opening DevTools
  mainWindow.webContents.on("context-menu", (event) => {
    event.preventDefault();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
