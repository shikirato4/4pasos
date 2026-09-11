/* oxlint-disable react/react-compiler -- R3F updates Three.js instances outside React rendering. */
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'
import { CanBase, CanLid, useBrushedTexture } from './MetalDetails'
import { mix, smooth } from './timeline'

function CanBody(){
  const grain=useBrushedTexture()
  return <group>
    <mesh><cylinderGeometry args={[.58,.58,2.18,72,1,true]}/><meshPhysicalMaterial color="#b9c4cc" metalness={1} roughness={.24} roughnessMap={grain} bumpMap={grain} bumpScale={.002} clearcoat={.22}/></mesh>
    {[-1.02,1.02].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.555,.026,12,72]}/><meshStandardMaterial color="#dce3e7" metalness={1} roughness={.17}/></mesh>)}
    <group position={[0,1.09,0]}><CanLid/></group>
    <group position={[0,-1.09,0]} rotation={[Math.PI,0,0]}><CanBase/></group>
  </group>
}

export function AluminumCan({progress}:{progress:MotionValue<number>}){
  const root=useRef<THREE.Group>(null!)
  useFrame(()=>{
    const p=progress.get(),t=smooth(p,.805,.842)
    root.current.visible=t>.001
    root.current.scale.setScalar(mix(.82,1,t))
    root.current.rotation.y=.25+smooth(p,.79,.86)*.65
  })
  return <group ref={root}><CanBody/></group>
}

export function ShelfCans({placements}:{placements:THREE.Vector3[]}){
  const body=useRef<THREE.InstancedMesh>(null!),tops=useRef<THREE.InstancedMesh>(null!),rings=useRef<THREE.InstancedMesh>(null!)
  const material=useMemo(()=>new THREE.MeshPhysicalMaterial({color:'#c5cdd1',metalness:.72,roughness:.42,clearcoat:.12,side:THREE.DoubleSide,emissive:'#1b2226',emissiveIntensity:.28}),[])
  useLayoutEffect(()=>{
    const dummy=new THREE.Object3D()
    placements.forEach((pos,i)=>{
      dummy.position.copy(pos);dummy.scale.setScalar(.72);dummy.rotation.set(0,.18,0);dummy.updateMatrix();body.current.setMatrixAt(i,dummy.matrix)
      dummy.position.copy(pos).add(new THREE.Vector3(0,.79,0));dummy.rotation.set(0,.18,0);dummy.scale.setScalar(.72);dummy.updateMatrix();tops.current.setMatrixAt(i,dummy.matrix)
      dummy.position.copy(pos).add(new THREE.Vector3(0,.75,0));dummy.rotation.set(Math.PI/2,0,.18);dummy.scale.setScalar(.72);dummy.updateMatrix();rings.current.setMatrixAt(i,dummy.matrix)
    })
    for(const mesh of [body.current,tops.current,rings.current])mesh.instanceMatrix.needsUpdate=true
  },[placements])
  return <group>
    <instancedMesh ref={body} args={[undefined,material,placements.length]}><cylinderGeometry args={[.58,.58,2.18,36,1,true]}/></instancedMesh>
    <instancedMesh ref={tops} args={[undefined,material,placements.length]}><cylinderGeometry args={[.54,.54,.035,36]}/></instancedMesh>
    <instancedMesh ref={rings} args={[undefined,material,placements.length]}><torusGeometry args={[.555,.026,8,36]}/></instancedMesh>
  </group>
}
