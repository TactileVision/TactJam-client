import React, { createContext, ReactNode, useContext, useRef, useState, useEffect, MutableRefObject } from 'react';
import * as THREE from 'three';
import { ipcRenderer } from 'electron';
import tactons from '../timeProfile/hardcodedTactons';
import { InformContext } from './InformContext';
let VTP = require('vtp.js/dist/vtp.cjs');

interface Position {
    x: number,
    y: number,
    z: number
}

interface Tag {
    name: string,
    id: number,
    creator_id: string
}

type PositionList = Position[]
type TagList = Tag[]

export interface Tacton {
    id: string,
    title: string,
    description: string,
    libvtp: string,
    last_update_at: string,
    user: {
        name: string,
        id: string
    },
    motorpositions: {
        id: number,
        positions: PositionList,
    }
    tags: TagList,
    bodytags: TagList,

}

interface VTPInstruction {
    type: string,
    channelSelect: number,
    timeOffset: number,
    amplitude: number,
    frequency: number
};

interface tactonAttributes {
    duration: number,
    actuators: { [key: number]: { [key: string]: number }[] }
}

const TactonContext = createContext<
    {
        slotNb: number,
        actuatorPositions: THREE.Vector3[],
        updateActuators: (actuators: THREE.Vector3[]) => void,
        rawTacton: ArrayBufferLike,
        encodedTacton: tactonAttributes,
        tactonMetadata: Tacton,
        setTactonDemo: () => void,
        setTacton: (tacton: Tacton) => void,
        setTactonMetadata: (tacton: Tacton) => void,
    }>(null);

const TactonProvider = (props: { slotNb: number, children: ReactNode }) => {
    const [state, setState] = useState({
        actuatorPositions: [] as THREE.Vector3[],
        rawTacton: null,
        encodedTacton: null,
        tactonMetadata: null,
    })

    const { tactonReceived } = useContext(InformContext)

    useEffect(() => {
        setState({
            ...state,
            actuatorPositions: new Array(8).fill(null).map(() => new THREE.Vector3(0, 0, 0))
        })

        ipcRenderer.on('tactonReceived', (event, tactonData) => {
            // update tacton information if this slot is the one targeted
            if (tactonData.slotNb == props.slotNb) {
                tactonReceived(tactonData.slotNb)
                setState({ ...state, rawTacton: tactonData.rawData })
            }
        })
    }, [])

    const updateActuatorsPosition = (actuators: THREE.Vector3[]) => {
        console.log('updateActuatorsPosition')
        console.log(actuators)
        setState({
            ...state,
            actuatorPositions: actuators
        })
    }

    const encodeTacton = (instructionWords: ArrayBufferLike): tactonAttributes => {
        const actuators: tactonAttributes["actuators"] = {};
        for (let i = 1; i <= 8; i++) { actuators[i] = []; }
        let currentTime = 0;

        VTP.readInstructionWords(tactons[0]).map((el: object, i: number) => VTP.decodeInstruction(el))
            .map((instruction: VTPInstruction) => {
                currentTime += instruction.timeOffset;
                if (instruction.type == 'SetAmplitude') {
                    if (instruction.channelSelect !== 0) {
                        actuators[instruction.channelSelect + 1].push({ amplitude: instruction.amplitude, time: currentTime });
                    }
                    // channel = 0 means all actuators must change
                    else {
                        Object.keys(actuators).forEach((key, i) => actuators[+key].push({ amplitude: instruction.amplitude, time: currentTime }));
                    }
                }
            });

        return { duration: currentTime, actuators };
    }

    const setTactonMetadata = (tacton: Tacton) => {
        setState({
            ...state,
            tactonMetadata: tacton,
        })
    }
    const setTacton = (tacton: Tacton) => {
        console.log("maybe crash if encode Tacton works correct")
        //encode the tactonPattern from the server
        const hashEncoding = "hex"
        const buffer = Buffer.from(tacton.libvtp, hashEncoding);
        const encodedTacton: tactonAttributes = encodeTacton(buffer)
        console.log(encodedTacton);

        //get the correct motorpositions
        let positions: THREE.Vector3[] = [];
        for (let i = 0; i < 8; i++) {
            const numberMotors = tacton.motorpositions?.positions?.length;
            if (i < numberMotors) {
                positions.push(new THREE.Vector3(tacton.motorpositions.positions[i].x, tacton.motorpositions.positions[i].y, tacton.motorpositions.positions[i].z))
            } else {
                positions.push(state.actuatorPositions[i])
            }
        }

        tactonReceived(props.slotNb)
        setState({
            actuatorPositions: positions,
            rawTacton: buffer,
            encodedTacton: encodedTacton,
            tactonMetadata: tacton,
        })
    }

    const setNewTactonDemo = () => {
        const instructionWords = new Uint8Array([
            0x10, 0x00, 0x00, 0xEA, 0x20, 0x00, 0x00, 0x7B, 0x10, 0x20, 0x01, 0x59,
            0x10, 0x20, 0xC9, 0xC8, 0x10, 0x10, 0x03, 0x15, 0x00, 0x00, 0x07, 0xD0,
            0x20, 0x00, 0x00, 0xEA, 0x10, 0x20, 0x02, 0x37
        ]).buffer;

        const encodedTacton: tactonAttributes = encodeTacton(instructionWords)
        tactonReceived(props.slotNb)
        setState({
            ...state,
            rawTacton: instructionWords,
            encodedTacton: encodedTacton
        })
    }

    return (
        <TactonContext.Provider value={
            {
                slotNb: props.slotNb,
                actuatorPositions: state.actuatorPositions,
                updateActuators: updateActuatorsPosition,
                rawTacton: state.rawTacton,
                encodedTacton: state.encodedTacton,
                tactonMetadata: state.tactonMetadata,
                setTactonDemo: setNewTactonDemo,
                setTacton: setTacton,
                setTactonMetadata:setTactonMetadata
            }}>
            { props.children}
        </TactonContext.Provider>
    )
}

export { TactonContext, TactonProvider }
