import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'
import { smooth } from './timeline'

const steel={color:'#74828a',metalness:.72,roughness:.38}
function Factory(){return <group><mesh><boxGeometry args={[1.25,.8,.8]}/><meshStandardMaterial {...steel}/></mesh>{[-.35,.3].map((x,i)=><mesh key={x} position={[x,.75,0]}><cylinderGeometry args={[.12,.16,.8,16]}/><meshStandardMaterial color={i?'#8c6b52':'#66747d'} metalness={.45} roughness={.5}/></mesh>)}</group>}
function Package(){return <group>{[-.35,.35].flatMap(x=>[-.22,.28].map(y=><mesh key={`${x}${y}`} position={[x,y,0]}><boxGeometry args={[.62,.43,.65]}/><meshStandardMaterial color="#9d7650" roughness={.78}/></mesh>))}</group>}
function Truck(){return <group><mesh><boxGeometry args={[1.15,.64,.7]}/><meshStandardMaterial color="#b8c2c7" metalness={.72} roughness={.3}/></mesh><mesh position={[-.8,-.08,0]}><boxGeometry args={[.48,.48,.68]}/><meshStandardMaterial color="#9b573f" metalness={.3} roughness={.52}/></mesh>{[-.63,.38].map(x=><mesh key={x} position={[x,-.42,.38]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.16,.16,.09,20]}/><meshStandardMaterial color="#202528" roughness={.7}/></mesh>)}</group>}
function Warehouse(){return <group><mesh><boxGeometry args={[1.35,.9,.82]}/><meshStandardMaterial color="#65747a" metalness={.5} roughness={.55}/></mesh><mesh position={[0,-.05,.42]}><boxGeometry args={[.58,.62,.04]}/><meshStandardMaterial color="#202a2d" metalness={.65} roughness={.35}/></mesh></group>}

export function Distribution({progress}:{progress:MotionValue<number>}){
  const root=useRef<THREE.Group>(null!)
  useFrame(()=>{
    const p=progress.get(),enter=smooth(p,.842,.868),exit=1-smooth(p,.895,.918)
    root.current.visible=enter*exit>.001
    root.current.scale.setScalar(enter*exit)
    root.current.position.z=(1-enter)*-3
    root.current.children.forEach((child,i)=>child.position.y=-.15+smooth(p,.842+i*.01,.87+i*.01)*.22)
  })
  return <group ref={root} position={[0,-1.55,.2]}>
    <group position={[-4.2,0,0]}><Factory/></group><group position={[-1.45,0,0]}><Package/></group><group position={[1.35,0,0]}><Truck/></group><group position={[4.25,0,0]}><Warehouse/></group>
    <mesh position={[0,-.63,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[10.2,.04]}/><meshBasicMaterial color="#d87954"/></mesh>
  </group>
}
