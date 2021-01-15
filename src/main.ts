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



//TODO add serial port functionalities

/* reading serial */
// const SerialPort = require('serialport')
// const Readline = require('@serialport/parser-readline')
// let serialPort: any = null;
// // let parser = null;
//
// interface SerialPortAttrs {
//   path: string
// }
//
// /* TODO enable users to choose the port they want to connect to */
// function connectToDevice(list: SerialPortAttrs[]) {
//   let ports: string[] = [];
//   list.forEach((x: SerialPortAttrs) => ports.push(x.path));
//   console.log("Available ports: " + ports.join(' ; '));
//
//   if(ports.length === 0) {
//     console.log("No ports connected.");
//     return;
//   }
//
//   serialPort = new SerialPort(ports[0], {
//     baudRate: 9600,
//     autoOpen: false
//   });
//
//   // opens the port in flow mode to read data indefinitely
//   serialPort.open((err: any) => {
//     // socket.emit('shoe_connected', true);
//     if (err) {
//       console.log("Could not open " + ports[0]);
//       return;
//     }
//
//     // if (debug) {
//     const parser = new Readline();
//     serialPort.pipe(parser);
//
//     parser.on('data', (line: string) => console.log('> ' + line));
//     // }
//   });
// }
//
// // read list of devices connect through serial
// SerialPort.list().then(connectToDevice);

// const port = new SerialPort(path, { baudRate: 256000 })



// testing vtp library
// let vtp = require("vtp.js/dist/vtp.cjs");
// console.log(vtp);
