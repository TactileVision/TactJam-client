import React, { createContext, ReactNode, useContext, useRef, useState, useEffect, MutableRefObject } from 'react';

export interface InformProvided {
    slotNumber: number,
    patternProvided: boolean,
    positionProvided: boolean,
}

const InformContext = createContext<
    {
        saveRequested: boolean[]
        informProvidList: InformProvided[],
        requestSave: (slotNumber: number) => void
    }>(null);

const InformProvider = (props: { children: ReactNode }) => {
    const [state, setState] = useState({
        saveRequested: [] as boolean[],
        informProvidList: [] as InformProvided[],
    })

    useEffect(() => {
        const initSaveRequest = new Array(3).fill(null).map(() => false)
        const initProvid = [] as InformProvided[];
        for (let i = 0; i < 3; i++) {
            initProvid.push({
                slotNumber: i + 1,
                patternProvided: false,
                positionProvided: false,
            })

        }
        setState({
            saveRequested: initSaveRequest,
            informProvidList: initProvid,
        })
    }, [])

    const requestSave = (slotNumber: number) => {
        const tempRequest = state.saveRequested;
        tempRequest[slotNumber-1] = true
        setState({
            ...state,
            saveRequested:tempRequest
        })
    }
    return (
        <InformContext.Provider value={
            {
                saveRequested: state.saveRequested,
                informProvidList: state.informProvidList,
                requestSave: requestSave
            }}>
            { props.children}
        </InformContext.Provider>
    )
}

export { InformContext, InformProvider }
