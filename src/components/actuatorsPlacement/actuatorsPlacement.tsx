import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber';
import {DirectionalLight} from "react-three-fiber/components";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Model from './avatar';
import * as THREE from 'three';

extend({OrbitControls});

// const CameraControls = () => {
//     // Get a reference to the Three.js Camera, and the canvas html element.
//     // We need these to setup the OrbitControls component.
//     // https://threejs.org/docs/#examples/en/controls/OrbitControls
//     const {
//         camera,
//         gl: { domElement },
//     } = useThree();
//     // Ref to the controls, so that we can update them on every frame using useFrame
//     const controls = useRef();
//     useFrame((state) => controls.current.update());
//     return <OrbitControls ref={controls} args={[camera, domElement]} />;
// };

//
// const Box: React.FC<MeshProps> = (props) => {
//     // This reference will give us direct access to the mesh
//     const mesh = useRef()
//
//     // Set up state for the hovered and active state
//     const [hovered, setHover] = useState(false)
//     const [active, setActive] = useState(false)
//
//     // Rotate mesh every frame, this is outside of React without overhead
//     useFrame(() => {
//         if(mesh.current) { // @ts-ignore
//             mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
//         }
//     })
//
//     return (
//         <mesh
//             {...props}
//             ref={mesh}
//             scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
//             onClick={(event) => setActive(!active)}
//             onPointerOver={(event) => setHover(true)}
//             onPointerOut={(event) => setHover(false)}>
//             <boxBufferGeometry args={[1, 1, 1]} />
//             <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//         </mesh>
//     )
// }


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


export default function ActuatorPlacement() {
    //TODO load the glTF data from the file -- not working but I don't know what's wrong
    // useLoader(GLTFLoader, avatar)
    
    //TODO move directional light with camera
    return (
        <Canvas
            camera={{ fov: 35, aspect: 1, near: 0.1, far: 100 , position: [0, 0, 5]}}>
            <CameraControls/>
            <ambientLight color={0xffffff} intensity={0.5}/>
            <Suspense fallback={null}>
                <Model/>
            </Suspense>
            {/*<Box position={[0, 0, 1]}/>*/}
            {/*<mesh visible geometry={avatar.nodes.Default.geometry}>*/}
            {/*    <meshStandardMaterial*/}
            {/*        attach="material"*/}
            {/*        color="white"*/}
            {/*        roughness={1}*/}
            {/*        metalness={0}*/}
            {/*    />*/}
            {/*</mesh>*/}
        </Canvas>
    );
}
