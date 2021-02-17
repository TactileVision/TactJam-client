import { app, BrowserWindow, ipcMain } from 'electron';

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    //height: 800,
    height: 720,
    // frame:false,
    webPreferences: {
        nodeIntegration: true, 
        enableRemoteModule: true
    },
    resizable: false
  });

  if(mainWindow) {
    // mainWindow.webContents.openDevTools();
    mainWindow.loadFile(__dirname + '/index.html');
    mainWindow.on("closed", function () {
      mainWindow = null;
  });
    // mainWindow.webContents.openDevTools();
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
const Readline = require('@serialport/parser-readline')
const serialConnection = require('./serial/serial')
let serialPort: any = null

serialConnection.onDeviceConnect = (port: any) => {
  console.log("Device connected!")
  mainWindow?.webContents.send('deviceConnection', true);

  // read data coming from connected device
  serialPort = port
  const parser = new Readline()
  serialPort.pipe(parser)
  parser.on('data', (line: any) => {
    console.log(typeof(line), line);

    // only listening to tacton's received for now
    // if(!line.startsWith("<tacton")) return
    //
    // const tacton: {slotNb: number, rawData: string} = { slotNb: 0, rawData: null };
    // // get slot number to update
    // tacton.slotNb = +line.match(/"[1-3]"/)[0][1]
    // // get bytes string
    // const bytes = line.match(/>.*</)[0]
    // //TODO translate string into Byte array
    // tacton.rawData = bytes.substring(1, bytes.length-2)
    // console.log("Received tacton: ")
    // console.log(tacton)
    // mainWindow?.webContents.send('tactonReceived', tacton)
  })
}

serialConnection.onDeviceDisconnect = () => {
  mainWindow?.webContents.send('deviceConnection', false)
  serialPort = null
}

ipcMain.on('isDeviceConnected', (event) => {
  event.reply('deviceConnection', serialConnection.deviceConnected);
});

// start checking ports continuously
serialConnection.checkPortsContinuously()


// sending tacton information to device
ipcMain.on('sendingTacton', (event, tactonData: any) => {
  //TODO translate ArrayBuffer into string to send
  const msg = '<tacton lengthBytes="int" slotNumber="'+tactonData.slotNb+'">' + tactonData.rawData + '</tacton>'
  console.log(msg)
  serialPort?.write(msg)
})
