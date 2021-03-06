/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei/useGLTF'
// @ts-ignore
import * as avatar from 'assets/avatar.gltf';

interface SetActuators { (set: boolean): void }
interface ModelProps {
  setActuators: SetActuators
}

const Model = React.forwardRef((props: ModelProps, ref: React.Ref<any>) => {
  const group = useRef()
  // @ts-ignore
  // const { nodes, materials } = useGLTF('/avatar.gltf')
  // console.log(avatar);
  // @ts-ignore
  const { nodes, materials } = useGLTF(avatar.default)

  useEffect(() => props.setActuators(true), []);

  return (
      // <group ref={group} {...props} dispose={null}>
      // @ts-ignore
      <mesh ref={ref} material={materials.DefaultMaterial} geometry={nodes.Mesh.geometry} />
      // </group>
  );
  //
  // return (
  //   <group ref={group} {...props} dispose={null}>
  //     <mesh material={materials.DefaultMaterial} geometry={nodes.Mesh.geometry} />
  //   </group>
  // )
});

// useGLTF.preload('/avatar.gltf')
useGLTF.preload(avatar.default);

export default Model;
