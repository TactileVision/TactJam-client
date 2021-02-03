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



// const regexp = /"[0-9]+"/
// const bytes = '<tacton lengthBytes="int" slotNumber="1">owklnvnsoijsdf sdfjoj;lwkldsjf; ojsdafojflslfj;</tacton>'.match(regexp)
// console.log(bytes[0][1])


//only for debug purpose
let VTP = require('vtp.js/dist/vtp.cjs')
let hardcodedTacton = [
  {
    type: 'SetAmplitude',
    channelSelect: 0,
    timeOffset: 0,
    amplitude: 650
  },
  {
    type: 'SetAmplitude',
    channelSelect: 0,
    timeOffset: 300,
    amplitude: 0
  },
  {
    type: 'SetAmplitude',
    channelSelect: 1,
    timeOffset: 250,
    amplitude: 800
  },
  {
    type: 'SetAmplitude',
    channelSelect: 4,
    timeOffset: 100,
    amplitude: 350
  },
  {
    type: 'SetAmplitude',
    channelSelect: 7,
    timeOffset: 300,
    amplitude: 750
  },
  {
    type: 'SetAmplitude',
    channelSelect: 0,
    timeOffset: 250,
    amplitude: 0
  }
]

hardcodedTacton = hardcodedTacton.map(VTP.encodeInstruction);

const instructionWord = VTP.writeInstructionWords(hardcodedTacton)
const dataView = new DataView(instructionWord)
const decoder = new TextDecoder('utf-8')
console.log("decoded data: "+ decoder.decode(dataView))
// console.log(new Uint8Array([
//   0x10, 0x00, 0x00, 0xEA, 0x20, 0x00, 0x00, 0x7B, 0x10, 0x20, 0x01, 0x59,
//   0x10, 0x20, 0xC9, 0xC8, 0x10, 0x10, 0x03, 0x15, 0x00, 0x00, 0x07, 0xD0,
//   0x20, 0x00, 0x00, 0xEA, 0x10, 0x20, 0x02, 0x37
// ]).buffer)

// const encoder = new TextEncoder()

