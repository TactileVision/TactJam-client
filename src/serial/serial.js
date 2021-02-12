const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const Delimiter = require('@serialport/parser-delimiter')

function SerialConnection() {
    let tactjamPort = null;
    let serialPorts = {};

    const connection = {
        checkPortsContinuously: () => {},
        // callback once device is connected and detected
        onDeviceConnect: (port) => {},
        onDeviceDisconnect: (port) => {},
        deviceConnected: false
    }

    const openPortAndListen = (port) => {
        // if we already listen to the port, we don't do anything
        if(serialPorts[port] !== undefined) { return; }

        // close previous instance
        const serialPort = new SerialPort(port, {
            baudRate: 9600,
            databits: 8,
            parity: 'none',
            stopBits: 1,
            flowControl: false,
            autoOpen: false
        });
        serialPorts[port] = serialPort;

        // opens the port in flow mode to read data indefinitely
        serialPort.open((err) => {
            // socket.emit('shoe_connected', true);
            if (err) {
                console.log("Could not open " + port);
                return;
            }
            console.log("connected to port " + port);
            // const parser = new Readline();
            // console.log('buffer', Buffer.alloc(1, 0));
            const parser = new Delimiter({ delimiter: '\n' });
            serialPort.pipe(parser);

            parser.on('data', (line) => {
                // console.log(typeof(line), line.buffer.slice(line.byteOffset, line.byteOffset + line.byteLength));
                const msg = line.toString();
                // welcome message = tactjam
                if(msg.trim() === "tactjam") {
                    // console.log("yeah");
                    tactjamPort = serialPort;
                    connection.onDeviceConnect(tactjamPort);
                    connection.deviceConnected = true;
                    tactjamPort.write("received");
                }
            });
        });
    }

    const connectToDevice = (list) => {
        let ports = [];
        // console.log(list);
        list.forEach((x) => ports.push(x.path));
        // console.log("Available ports: " + ports.join(' ; '));

        if (ports.length === 0) {
            console.log("No ports connected.");
            // if no device connected => close all former connections
            const ports = Object.keys(serialPorts);
            if (ports.length > 0) ports.forEach(port => delete serialPorts[port]);
            if(tactjamPort) connection.onDeviceDisconnect();
            tactjamPort = null;
            connection.deviceConnected = false;
        } else if(tactjamPort === null) {
            // if no device is connected, listen to all ports
            let serialPorts = ports.map((port, i) => openPortAndListen(port));
        }

        // always listen to all ports to detect device plug/unplug
        setTimeout(connection.checkPortsContinuously, 1000);
    }

    connection.checkPortsContinuously = () => {
        // console.log("### Checking ports... ###");
        SerialPort.list().then(connectToDevice)
    }

    return connection;
}

module.exports = SerialConnection()
