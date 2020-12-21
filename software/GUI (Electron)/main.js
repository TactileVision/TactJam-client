const { app, BrowserWindow, ipcMain, Menu } = require('electron');
// does not load like this
// const VTP = import('vtp.js');

function createWindow () {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            webviewTag: true
        },
        resizable: false
    });

    // win.loadFile('login.html');
    win.loadFile('tabs.html');
    // win.loadFile('index.html');
    // win.loadFile('save.html');
    win.webContents.openDevTools();
}

// disable default menu
Menu.setApplicationMenu(null);

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});


/* channel to execute back-end actions from the front-end (renderer) */
ipcMain.handle('perform-action', (event, txt) => {
    console.log(txt);
});



/* reading serial */
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
let serialPort = null;
// let parser = null;

/* TODO enable users to choose the port they want to connect to */
function connectToDevice(list) {
    let ports = [];
    list.forEach(x => ports.push(x.path));
    console.log("Available ports: " + ports.join(' ; '));

    if(ports.length === 0) { return; }

    serialPort = new SerialPort(ports[0], {
        baudRate: 9600,
        autoOpen: false
    });

    // opens the port in flow mode to read data indefinitely
    serialPort.open((err) => {
        // socket.emit('shoe_connected', true);
        if (err) {
            console.log("Could not open " + ports[0]);
            return;
        }

        // if (debug) {
        const parser = new Readline();
        serialPort.pipe(parser);

        parser.on('data', line => console.log('> ' + line));
        // }
    });
}

// read list of devices connect through serial
SerialPort.list().then(connectToDevice);

// const port = new SerialPort(path, { baudRate: 256000 })

