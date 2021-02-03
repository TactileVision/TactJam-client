import React, { createContext, ReactNode, useContext, useRef, useState, useEffect, MutableRefObject } from 'react';
import * as THREE from 'three';
const TactonContext = createContext<
    {
        actuatorPositions: THREE.Vector3[],
        updateActuators: (actuators: THREE.Vector3[]) => void,
    }>(null);

const TactonProvider = (props: { children: ReactNode }) => {
    const [state, setState] = useState({
        actuatorPositions: [] as THREE.Vector3[],
    });

    useEffect(() => {
        setState({
            actuatorPositions: new Array(8).fill(null).map(() => new THREE.Vector3(0, 0, 0))
        })
    }, [])

    const updateActuatorsPostion = (actuators: THREE.Vector3[]) => {
        setState({
            actuatorPositions: actuators
        })
    }

    return (
        <TactonContext.Provider value={
            {
                actuatorPositions: state.actuatorPositions,
                updateActuators: updateActuatorsPostion
            }}>
            { props.children}
        </TactonContext.Provider>
    )
}

export { TactonContext, TactonProvider }