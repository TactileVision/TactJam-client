import { app, BrowserWindow, ipcMain } from 'electron';

let mainWindow: Electron.BrowserWindow | null;

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
app.on("browser-window-created",function(e: any, window: Electron.BrowserWindow) {
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


// testing out ipc messages

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log("received an IPC message");
});


//TODO add serial port functionalities
const serialConnection = require('./serial/serial');

serialConnection.onDeviceConnect = (port: any) => {
  console.log("Device connected!")
  //TODO listen to tactons and send their configurations to the GUI
  mainWindow?.webContents.send('deviceConnection', true);
}

serialConnection.onDeviceDisconnect = () => {
  mainWindow?.webContents.send('deviceConnection', false);
}

ipcMain.on('isDeviceConnected', (event) => {
  event.reply('deviceConnection', serialConnection.deviceConnected);
});

// start checking ports continuously
serialConnection.checkPortsContinuously()


