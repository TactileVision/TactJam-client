import React, { useRef, useState, useEffect, Suspense, useContext } from 'react';
import { Canvas, useFrame, useThree, extend, MeshProps } from 'react-three-fiber';
import { DirectionalLight } from "react-three-fiber/components";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Model from './avatar';
import * as THREE from 'three';
import { Grid, Button, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import { TactonContext } from '../centralComponents/TactonContext';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        // flexGrow: 1,
        width: '100%',
        height: '100%',
        position: "relative"
    },
    canvas: {
        minHeight: 600,
        maxHeight: 720
    },
    fixed: {
        position: 'absolute',
        bottom: -30,
        right: 5,
        zIndex: 1
    },
    controlCamCursor: {
        cursor: "all-scroll"
    },
    controlActuatorsCursor: {
        cursor: "grab"
    },
    grabActuator: {
        cursor: "grabbing"
    },
    instructions: {
        position: 'fixed',
        right: 5,
        bottom: 55,
        width: 550,
        color: '#0000008a',
    }
}));



/*** camera control section ***/
extend({ OrbitControls });

function rotateLight(camera: THREE.Camera) {
    const v3 = new THREE.Vector3(4, 4, 4);
    const lightMatrix = new THREE.Matrix4().makeRotationFromQuaternion(camera.quaternion);
    return v3.applyMatrix4(lightMatrix);
}

interface CameraControlsProps {
    enableControl: boolean
}
const CameraControls = (props: CameraControlsProps) => {
    // Get a reference to the Three.js Camera, and the canvas html element.
    // We need these to setup the OrbitControls component.
    // https://threejs.org/docs/#examples/en/controls/OrbitControls
    const {
        camera,
        gl: { domElement },
    } = useThree();
    // Ref to the controls, so that we can update them on every frame using useFrame
    const controls = useRef();
    const light = useRef();
    useFrame((state) => {
        // @ts-ignore
        controls.current.update();
        // @ts-ignore
        light.current.position.copy(rotateLight(state.camera));
    });
    // @ts-ignore
    return (
        <group>
            {/* @ts-ignore */}
            <orbitControls ref={controls}
                args={[camera, domElement]}
                target={[0, 1, 0]}
                enabled={props.enableControl} />
            <DirectionalLight ref={light} position={camera.position} />
        </group>
    );
};
/*** end of camera control section ***/



/*** actuator section ***/
interface SetSelectedActuator { (id: number): void; }
interface ActuatorProps {
    setSelectedActuator: SetSelectedActuator,
    color: number,
    id: number
}

// small box representing an actuator
const Actuator = React.forwardRef((props: ActuatorProps, ref: React.Ref<any>) => {
    return (
        <mesh ref={ref}
            onPointerDown={(event) => props.setSelectedActuator(props.id)}>
            {/*<cylinderBufferGeometry args={[0.03, 0.03, 0.015, 50]}/>*/}
            <sphereBufferGeometry args={[0.025, 32, 32]} />
            <meshStandardMaterial color={props.color} />
        </mesh>
    );
});


interface ActuatorControlsProps {
    selectedActuator: number,
    setSelectedActuator: SetSelectedActuator,
    avatar: React.Ref<any>,
    controlCamera: boolean,
    actuatorPositions: THREE.Vector3[],
    updatePositions: (positions: THREE.Vector3[]) => void
    updateFromServer: boolean,
    needUpdateFromServer: (update: boolean) => void
}

const ActuatorControls = (props: ActuatorControlsProps) => {
    let actuators = new Array(8).fill(null).map((el, i) => {
        return useRef<MeshProps>(null);
    });
    let initialPos: number[][] = [];
    let needUpdate = false; // flag to update actuators positions in parent

    const createActuators = () => {
        const colors = [0xab2056, 0x5454ff, 0x24ab24, 0x9a9a9a, 0x9a34ff, 0x21abab, 0xffff00, 0xdf8100];
        return new Array(8).fill(null).map((el, i) => {
            initialPos.push([(i * 0.25) - 1, 0.25, 0]);
            return <Actuator ref={actuators[i]} key={"actuator" + i} color={colors[i]} id={i} setSelectedActuator={props.setSelectedActuator} />
        });
    };

    let dummy = useRef(null);

    // instantiate the actuators right after the render of this component
    useEffect(() => {
        for (let i = 0; i < actuators.length; i++) {
            //TODO fix types issues
            // @ts-ignore
            actuators[i].current?.position.set(initialPos[i][0], initialPos[i][1], initialPos[i][2]);
            // @ts-ignore
            // actuators[i].current?.geometry.rotateX(Math.PI / 2);
            props.updatePositions(actuators.map<any>((el, i) => el.current ? el.current.position : null));
        }
    }, []);

    // update every frame ==> used to move actuators around
    useFrame((state) => {
        //TODO optimize number of updates
        if (needUpdate) {
            console.log("update")
            props.updatePositions(actuators.map<any>((el, i) => el.current ? el.current.position : null));
            needUpdate = false;
        }
        
        // if actuators positions changed externally (e.g., loading tacton file)
        if(props.updateFromServer) {
            // console.log('updating positions')
            props.actuatorPositions.map((el, i) => {
                //@ts-ignore
                actuators[i].current?.position.set(el.x, el.y, el.z);
            });
            // console.log(actuators.map((el, i) => el.current?.position))
            props.needUpdateFromServer(false);
        }

        if (props.selectedActuator > -1 && !props.controlCamera) {
            const mesh = actuators[props.selectedActuator].current;
            state.raycaster.setFromCamera(state.mouse, state.camera);
            //TODO deal with types
            // @ts-ignore
            const intersection = state.raycaster.intersectObjects([props.avatar.current], true)[0];

            if (intersection && intersection.face) {
                //TODO fix types issues
                // @ts-ignore
                mesh.position.copy(intersection.point);
                needUpdate = true;
                // const lookPos = intersection.point.add(intersection.face.normal);
                // // @ts-ignore
                // mesh.geometry.lookAt(lookPos);
            } else {
                const pos = initialPos[props.selectedActuator];
                // @ts-ignore
                mesh.position.set(pos[0], pos[1], pos[2]);
            }
        }
    });

    return (
        <group>
            { createActuators() }
        </group>
    );
}
/*** end of actuator section ***/



export default function ActuatorPlacement() {
    // change cursor mode (move actuator or move view)
    const [actuators, setActuators] = useState(false);
    const [selectedActuator, setSelectedActuator] = useState(-1);
    const [controlCamera, enableControlCamera] = useState(true);
    let avatar: React.Ref<MeshProps> = useRef(null);

    const classes = useStyles();

    return (
        <TactonContext.Consumer>
            { ({ actuatorPositions, updateActuators, updateFromServer, needUpdateFromServer}) => (
            <Grid item className={classes.root} xs={12}>
                <Typography className={classes.instructions} align="right" unselectable="on" hidden={!controlCamera}>
                    Rotate - drag with left mouse button<br/>
                    Move - drag with right mouse button<br/>
                    Zoom - mouse wheel or two fingers up and down on the trackpad
                </Typography>
                <Typography className={classes.instructions} align="right" unselectable="on" hidden={controlCamera}>
                    Drag actuators on the body with the left mouse button to position them
                </Typography>
                <Button
                    className={classes.fixed}
                    variant="outlined"
                    onClick={() => { enableControlCamera(!controlCamera) }} >
                    {(() => controlCamera ? "Switch to actuator control" : "Switch to camera control")()}
                </Button>
                <Canvas
                    camera={{ fov: 45, aspect: 1, near: 0.1, far: 100, position: [0, 2.5, 2.5]}}
                    className={clsx(classes.canvas, controlCamera ? classes.controlCamCursor : (selectedActuator >= 0 ? classes.grabActuator : classes.controlActuatorsCursor))}
                    id="canvas3D"
                    // onPointerUp={() => { setSelectedActuator(-1); console.log(actuatorPositions); }}>
                    onPointerUp={() => setSelectedActuator(-1)}
                    onMouseOut={() => setSelectedActuator(-1)}>
                    <CameraControls enableControl={controlCamera} />
                    <ambientLight color={0xffffff} intensity={0.5} />
                    <Suspense fallback={null}>
                        {/*TODO not sure what's happening here
                        @ts-ignore */}
                        <Model ref={avatar} setActuators={setActuators} />
                        {(() => {
                            if (actuators) return (
                                <ActuatorControls
                                    selectedActuator={selectedActuator}
                                    setSelectedActuator={setSelectedActuator}
                                    avatar={avatar}
                                    controlCamera={controlCamera}
                                    actuatorPositions={actuatorPositions}
                                    updateFromServer={updateFromServer}
                                    needUpdateFromServer={needUpdateFromServer}
                                    updatePositions={updateActuators} />
                            );
                        })()}
                    </Suspense>
                </Canvas>
            </Grid>
            )}
        </TactonContext.Consumer>
    );
}
