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
    mainWindow.webContents.openDevTools();
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
const ReadLine = require('@serialport/parser-readline')
const Delimiter = require('@serialport/parser-delimiter')
const serialConnection = require('./serial/serial')
let serialPort: any = null

interface SerialMessage {
  type: number,
  slot: number,
  byteLength: number,
  content: ArrayBuffer
}

serialConnection.onDeviceConnect = (port: any) => {
  console.log("Device connected!")
  mainWindow?.webContents.send('deviceConnection', true);

  // read data coming from connected device
  serialPort = port;
  
  const parser = new Delimiter({ delimiter: '\r\n' });
  serialPort.pipe(parser);
  
  parser.on('data', (line: Buffer) => {
    let fullMsg = new DataView(line.buffer.slice(line.byteOffset, line.byteOffset + line.byteLength));

    if(fullMsg.byteLength < 6) { return; }

    const msg: SerialMessage = {
      type: fullMsg.getUint8(0),
      slot: fullMsg.getUint8(1),
      byteLength: fullMsg.getUint32(2, true),
      content: null
  }
  if(msg.byteLength) msg.content = fullMsg.buffer.slice(6);

  if(msg.type === 1 || msg.type === 2)
    console.log("Device msg: " + msg.type + " " + msg.slot + " " + msg.byteLength + " " + msg.content?.byteLength);

  if(msg.type === 1) { // TactJam device is sending a tacton
    console.log("setting tacton on slot #"+msg.slot);
    console.log(msg.content);
    mainWindow?.webContents.send('setTacton', { slot: msg.slot, byteArray: msg.content });
  }
  if(msg.type === 2) { // TactJam device is asking for a tacton
    console.log("getting tacton from slot #"+msg.slot);
    mainWindow?.webContents.send('getTacton', msg.slot);
  }
  })

  const parser2 = new ReadLine();
  serialPort.pipe(parser2);
  parser2.on('data', console.log);
}

// render can ask for update about the connection, in which case we send the current state
ipcMain.on("checkConnection", () => {
  mainWindow?.webContents.send('deviceConnection', serialPort !== null);
})

serialConnection.onDeviceDisconnect = () => {
  mainWindow?.webContents.send('deviceConnection', false)
  serialPort = null
}

// start checking ports continuously
serialConnection.checkPortsContinuously()


// sending tacton information to device
ipcMain.on('sendTactonToDevice', (event, args: { slot: number, byteArray: ArrayBuffer }) => {
  console.log("sending tacton to device on slot #"+args.slot);
  console.log(args.byteArray);
  const buf1 = Buffer.alloc(6);
  buf1.writeInt8(2, 0); // receive msg type
  buf1.writeInt8(args.slot, 1); // no slot related
  const tactonSize = (args.byteArray ? args.byteArray.byteLength : 0);
  buf1.writeUInt32LE(tactonSize, 2); // no slot attached
  // console.log(buf1.slice());
  if(args.byteArray !== null) {
    const buf2 = Buffer.from(args.byteArray, 0, tactonSize);
    // console.log(buf2.slice(0));
    const concBuf = Buffer.concat([buf1, buf2], 6 + tactonSize);
    serialPort?.write(concBuf);
    // console.log(concBuf.slice(0));
  } else {
    serialPort?.write(buf1);
  }
})
