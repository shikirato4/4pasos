import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'
import { smooth } from './timeline'
import { ShelfCans } from './AluminumCan'
import { NeighborhoodShop } from './NeighborhoodShop'
export function Supermarket({progress}:{progress:MotionValue<number>}) {
  const group=useRef<THREE.Group>(null!)
  const placements=useMemo(()=>{
    const arr:THREE.Vector3[]=[]
    for(let shelf=0;shelf<3;shelf++)for(let row=0;row<2;row++)for(let col=0;col<9;col++){
      if(shelf===1&&row===0&&col===3)continue
      arr.push(new THREE.Vector3(-3.4+col*.9,-2.08+shelf*2,-.15-row*.9))
    }
    return arr
  },[])
  useFrame(()=>{
    const p=progress.get(),r=smooth(p,.862,.951)
    group.current.visible=p>.862
    group.current.children.forEach((obj,i)=>{
      if(i<2){obj.scale.setScalar(smooth(p,.886,.939));return}
      obj.scale.y=smooth(p,.862+(i%4)*.008,.918+(i%4)*.008)
    })
    group.current.position.z=(1-r)*-6
  })
  return <group ref={group}>
    <ShelfCans placements={placements}/>
    <NeighborhoodShop/>
    {[-2.91,-.91,1.09,3.09].map(y=><group key={y} position={[.2,y,-.62]}><mesh><boxGeometry args={[9.2,.1,2.65]}/><meshStandardMaterial color="#77776e" metalness={.65} roughness={.4}/></mesh><mesh position={[0,-.12,1.3]}><boxGeometry args={[9.2,.2,.06]}/><meshStandardMaterial color="#d6d2c3" roughness={.5}/></mesh>{[-3.2,-1.4,.4,2.2,4].map(x=><mesh key={x} position={[x,-.12,1.338]}><planeGeometry args={[.3,.095]}/><meshStandardMaterial color="#2e3435"/></mesh>)}</group>)}
    {[-4.35,4.7].map(x=><mesh key={x} position={[x,.2,-1.73]}><boxGeometry args={[.12,7.7,.15]}/><meshStandardMaterial color="#5b6260" metalness={.65} roughness={.4}/></mesh>)}
    <mesh position={[0,.3,-2]}><boxGeometry args={[9.5,7.6,.08]}/><meshStandardMaterial color="#333b3a" roughness={.8}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-3.1,1]}><planeGeometry args={[35,32]}/><meshStandardMaterial color="#494b45" metalness={.2} roughness={.4}/></mesh>
    {[-4,0,4].map(x=><mesh key={x} position={[x,5,1]} rotation={[Math.PI/2,0,0]}><planeGeometry args={[.15,12]}/><meshBasicMaterial color="#fff0cf"/></mesh>)}
  </group>
}
