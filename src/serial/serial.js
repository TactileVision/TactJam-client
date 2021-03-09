const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const Delimiter = require('@serialport/parser-delimiter')
const ByteLength = require('@serialport/parser-delimiter')


// code fetched from https://github.com/doomjs/dataview-getstring/blob/master/index.js
DataView.prototype.getString = function(offset, length){
    var end = typeof length == 'number' ? offset + length : this.byteLength;
    var text = '';
    var val = -1;

    while (offset < this.byteLength && offset < end){
        val = this.getUint8(offset++);
        if (val === 0) break;
        text += String.fromCharCode(val);
    }

    return text;
};


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
            baudRate: 115200,
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
                console.log(err);
                return;
            }
            console.log("connected to port " + port);
            // const parser = new Readline();
            // console.log('buffer', Buffer.alloc(1, 0));
            const parser = new Delimiter({ delimiter: '\r\n' });
            serialPort.pipe(parser);

            // not working...
            // const parser = serialPort.pipe(new ByteLength({ length: 6 }));
            
            parser.on('data', (line) => {
                // console.log(typeof(line), line.buffer.slice(line.byteOffset, line.byteOffset + line.byteLength));
                let fullMsg = new DataView(line.buffer.slice(line.byteOffset, line.byteOffset + line.byteLength));
                // console.log("Full message: " + fullMsg);
                if(fullMsg.byteLength > 6) {
                    const msg = {
                        type: fullMsg.getUint8(0),
                        slot: fullMsg.getUint8(1),
                        byteLength: fullMsg.getUint32(2, true),
                        content: ""
                    }
                    if(msg.byteLength) msg.content = fullMsg.getString(6, msg.byteLength)

                    // console.log("Device msg: " + msg.type + " " + msg.slot + " " + msg.byteLength + " " + msg.content);
                    if(msg.type === 3 && msg.content === "asking" && !connection.deviceConnected) {
                        tactjamPort = serialPort;
                        connection.onDeviceConnect(tactjamPort);
                        connection.deviceConnected = true;
                        
                        const buf = Buffer.alloc(13);
                        buf.writeInt8(3, 0); // connection msg type
                        buf.writeInt8(0, 1); // no slot related
                        buf.writeUInt32LE(7, 2);
                        buf.write("granted", 6, "utf-8");
                        tactjamPort.write(buf);
                    }
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
           // console.log("No ports connected.");
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
