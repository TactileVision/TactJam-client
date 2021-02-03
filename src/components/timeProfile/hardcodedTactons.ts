let VTP = require('vtp.js/dist/vtp.cjs');

//only for debug purpose
let hardcodedTacton: object[] = [
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

const tactons: object[][] = [VTP.writeInstructionWords(hardcodedTacton)];

export default tactons;
