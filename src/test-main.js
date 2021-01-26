let { app, BrowserWindow } = require('electron');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    // frame:false,
    webPreferences: {
        nodeIntegration: true, 
        enableRemoteModule: true
    },
    resizable: false
  });

  if(mainWindow) {
    mainWindow.webContents.openDevTools();
    mainWindow.loadFile('index.html');
    mainWindow.on("closed", function () {
      mainWindow = null;
    });
    mainWindow.webContents.openDevTools();
  }
}

app.on("ready", createWindow);
app.on("browser-window-created",function(el, window) {
  window.setMenu(null);
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});



//TODO add serial port functionalities
const serialConnection = require('./serial/serial');

serialConnection.deviceConnected = (port) => {
  console.log("Device connected!")
}

serialConnection.checkPortsContinuously()
