/* oxlint-disable react/react-compiler -- R3F updates Three.js material instances outside React rendering. */
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'
import { smooth } from './timeline'

export const CAN_MODEL='./models/coca-cola-can.glb'
useGLTF.preload(CAN_MODEL)
export function useCanParts(){
  const {scene}=useGLTF(CAN_MODEL)
  return useMemo(()=>{
    scene.updateMatrixWorld(true)
    const box=new THREE.Box3().setFromObject(scene),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3())
    const normalization=new THREE.Matrix4().makeScale(1.3/size.x,2.3/size.y,1.3/size.z).multiply(new THREE.Matrix4().makeTranslation(-center.x,-center.y,-center.z))
    const parts:{geometry:THREE.BufferGeometry,material:THREE.MeshStandardMaterial}[]=[]
    scene.traverse(node=>{
      if(node instanceof THREE.Mesh){
        const geometry=node.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(normalization,node.matrixWorld))
        const material=(node.material as THREE.MeshStandardMaterial).clone();material.envMapIntensity=1.1
        if(material.map)material.map.anisotropy=8
        parts.push({geometry,material})
      }
    })
    return parts
  },[scene])
}
export function CocaColaCan({progress}:{progress:MotionValue<number>}){
  const parts=useCanParts(),root=useRef<THREE.Group>(null!)
  useFrame(()=>{
    const t=smooth(progress.get(),.805,.832);root.current.visible=t>0
    for(const part of parts){part.material.transparent=t<1;part.material.opacity=t;part.material.depthWrite=t>.99}
  })
  return <group ref={root} rotation={[0,Math.PI/4,0]}>{parts.map((part,i)=><mesh key={i} geometry={part.geometry} material={part.material}/>)}</group>
}
export function ShelfCans({placements}:{placements:THREE.Vector3[]}){
  const parts=useCanParts(),refs=useRef<THREE.InstancedMesh[]>([])
  useLayoutEffect(()=>{
    const dummy=new THREE.Object3D()
    parts.forEach((_,part)=>{
      placements.forEach((pos,i)=>{dummy.position.copy(pos);dummy.scale.setScalar(.72);dummy.rotation.y=Math.PI/4;dummy.updateMatrix();refs.current[part].setMatrixAt(i,dummy.matrix)})
      refs.current[part].instanceMatrix.needsUpdate=true
    })
  },[parts,placements])
  return <>{parts.map((part,i)=><instancedMesh key={i} ref={node=>{if(node)refs.current[i]=node}} args={[part.geometry,part.material,placements.length]}/>)}</>
}
