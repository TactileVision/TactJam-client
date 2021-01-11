import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber';
import {DirectionalLight} from "react-three-fiber/components";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Model from './avatar';
import * as THREE from 'three';


/*** camera control section ***/
extend({OrbitControls});

function rotateLight(camera: THREE.Camera) {
    const v3 = new THREE.Vector3(4, 4, 4);
    const lightMatrix = new THREE.Matrix4().makeRotationFromQuaternion(camera.quaternion);
    return v3.applyMatrix4(lightMatrix);
}

const CameraControls = () => {
    // Get a reference to the Three.js Camera, and the canvas html element.
    // We need these to setup the OrbitControls component.
    // https://threejs.org/docs/#examples/en/controls/OrbitControls
    const {
        camera,
        gl: { domElement },
    } = useThree();
    // Ref to the controls, so that we can update them on every frame using useFrame
    const controls = useRef();
    // @ts-ignore
    useFrame((state) => controls.current.update());
    // @ts-ignore
    return  (
        <group>
            {/* @ts-ignore */}
            <orbitControls ref={controls} args={[camera, domElement]} />
            <DirectionalLight position={rotateLight(camera)} />
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
        <mesh ref={ref} material={new THREE.MeshLambertMaterial({ color: props.color })}
              onPointerDown={(event) => props.setSelectedActuator(props.id) }
        />
    );
});


interface ActuatorControlsProps {
    selectedActuator: number,
    setSelectedActuator: SetSelectedActuator,
    avatar: React.Ref<any>
}

const ActuatorControls = (props: ActuatorControlsProps) => {
    let actuators: React.Ref<any>[] = [];

    const createActuators = () => {
        const colors = [ 0xab2056, 0x5454ff, 0x24ab24, 0x9a9a9a, 0x9a34ff, 0x21abab, 0xffff00, 0xdf8100 ];
        return new Array(8).fill(null).map((el, i) => {
            let ref = React.createRef();
            actuators.push(ref);
            return <Actuator ref={ref} key={"actuator"+i} color={colors[i]} id={i} setSelectedActuator={props.setSelectedActuator}/>
        });
    };

    let dummy = useRef(null);

    // instantiate the actuators right after the render of this component
    useEffect(() => {
        for(let i = 0; i < actuators.length; i++) {
            // instantiate all actuators
            //TODO deal with types here
            // @ts-ignore
            actuators[i].current.geometry = new THREE.BoxBufferGeometry(0.05, 0.01, 0.05);
            // @ts-ignore
            actuators[i].current.geometry.translate((i*2/actuators.length)-1, 0.25, 0).rotateX(Math.PI/2);
        }
    }, []);

    // update every frame ==> used to move actuators around
    useFrame((state) => {
        if(props.selectedActuator > -1) {
            //TODO deal with types
            // @ts-ignore
            const mesh = actuators[props.selectedActuator].current;
            // console.log(mesh);
            state.raycaster.setFromCamera(state.mouse, state.camera);
            // const intersection = state.raycaster.intersectObjects(props.avatar, true)[0];
            //TODO deal with types
            // @ts-ignore
            const intersection = state.raycaster.intersectObjects([props.avatar.current], true)[0];

            if (intersection && intersection.face) {
                mesh.geometry.translate(0,0,0);
                mesh.position.copy(intersection.point);
                const lookPos = intersection.point.add(intersection.face.normal);
                mesh.geometry.lookAt(lookPos);
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
    const [ move, setMove ] = useState(false);
    const [ actuators, setActuators ] = useState(false);
    const [ selectedActuator, setSelectedActuator ] = useState(-1);

    let avatar: React.Ref<any> = useRef(null);

    return (
        <Canvas
            camera={{fov: 35, aspect: 1, near: 0.1, far: 100}}
            className={move ? "moveCursor" : "pointerCursor"}
            id="canvas3D"
            onPointerUp={() => setSelectedActuator(-1) }>
            <CameraControls/>
            <ambientLight color={0xffffff} intensity={0.5}/>
            <Suspense fallback={null}>
                {/*TODO not sure what's happening here
                @ts-ignore */}
                <Model ref={avatar} setActuators={setActuators}/>
                {(() => {
                    if(actuators) return (
                        <ActuatorControls
                            selectedActuator={selectedActuator}
                            setSelectedActuator={setSelectedActuator}
                            avatar={avatar}/>
                    );
                })()}
            </Suspense>
        </Canvas>
    );
}
