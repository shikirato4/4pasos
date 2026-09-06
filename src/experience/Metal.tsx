/* oxlint-disable react/react-compiler -- Geometry buffers are intentionally mutated in R3F useFrame, outside React rendering. */
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'
import { mix,smooth,range } from './timeline'
export const metalProps={color:'#b5bdc4',metalness:1,roughness:.23}
export function Metal({progress}:{progress:MotionValue<number>}) {
  const ingot=useRef<THREE.Group>(null!),roller=useRef<THREE.Group>(null!),sheet=useRef<THREE.Mesh>(null!),can=useRef<THREE.Group>(null!)
  const caps=useRef<THREE.Group>(null!),tab=useRef<THREE.Mesh>(null!)
  const geometry=useMemo(()=>new THREE.PlaneGeometry(1,1,96,12),[])
  const last=useRef(-1)
  useFrame(()=>{
    const p=progress.get(),lam=smooth(p,.575,.705),curl=smooth(p,.73,.802),reveal=smooth(p,.86,.95)
    ingot.current.visible=p>=.399&&p<.714
    const emerge=smooth(p,.399,.445),handoff=1-smooth(p,.70,.715)
    ingot.current.scale.set(mix(2.8,4.4,lam)*emerge*handoff,mix(.75,.038,lam)*emerge,mix(1.25,1.9,lam)*emerge)
    ingot.current.rotation.set(mix(.15,0,lam),mix(-.25+(p-.43)*1.5,0,lam),mix(-.15,0,lam))
    roller.current.visible=p>.58&&p<.746
    const machine=smooth(p,.58,.616)*(1-smooth(p,.703,.746))
    roller.current.scale.setScalar(machine)
    roller.current.children.forEach((r,i)=>{r.rotation.z=(i===0?1:-1)*range(p,.58,.74)*Math.PI*5;r.position.y=(i===0?1:-1)*(.515+mix(.75,.038,lam)/2)})
    sheet.current.visible=p>=.70
    can.current.rotation.set(mix(-Math.PI/2,.1,smooth(p,.712,.765))*(1-reveal),mix(0,-.35,smooth(p,.80,.86))*(1-reveal),0)
    can.current.position.set(mix(0,-.7,reveal),mix(0,-.08,reveal),mix(0,-.15,reveal))
    can.current.scale.setScalar(mix(1,.72,reveal))
    if(last.current!==p){
      const pos=geometry.attributes.position
      const width=mix(4.4,Math.PI*1.3,smooth(p,.71,.77)),height=mix(1.9,2.25,smooth(p,.715,.78))
      const angle=Math.max(.0001,curl*Math.PI*2),radius=width/angle
      for(let j=0;j<=12;j++)for(let i=0;i<=96;i++){
        const u=i/96-.5,theta=u*angle
        // Arc-length-preserving bend, flat sheet at zero and closed tube at one.
        const x=Math.sin(theta)*radius,z=(Math.cos(theta)-1)*radius+curl*.65
        pos.setXYZ(j*97+i,x,(.5-j/12)*height,z)
      }
      pos.needsUpdate=true;geometry.computeVertexNormals();last.current=p
    }
    sheet.current.scale.setScalar(smooth(p,.70,.714))
    caps.current.visible=p>.79
    caps.current.children.forEach((child,i)=>{
      const t=smooth(p,.791+i*.004,.824+i*.004)
      child.scale.setScalar(t)
      child.position.y=(i%2===0?1:-1)*(1.125+(1-t)*.55)
    })
    tab.current.scale.set(smooth(p,.817,.84)*.16,smooth(p,.817,.84)*.28,smooth(p,.817,.84)*.15)
    tab.current.position.y=1.151+(1-smooth(p,.817,.84))*.6
  })
  return <>
    <group ref={ingot}><RoundedBox args={[1,1,1]} radius={.09} smoothness={4}><meshStandardMaterial {...metalProps}/></RoundedBox></group>
    <group ref={roller}>{[.57,-.57].map((y,i)=><group key={i} position={[0,y,0]}><mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.48,.48,2.8,48]}/><meshStandardMaterial {...metalProps} color="#727b83" roughness={.3}/></mesh><mesh position={[.02,.47,0]}><boxGeometry args={[.035,.015,2.8]}/><meshStandardMaterial color="#333b42" metalness={.7} roughness={.3}/></mesh>{[-1.5,1.5].map(z=><mesh key={z} position={[0,0,z]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.16,.16,.32,20]}/><meshStandardMaterial {...metalProps}/></mesh>)}</group>)}</group>
    <group ref={can}>
      <mesh ref={sheet} geometry={geometry}><meshStandardMaterial {...metalProps} side={THREE.DoubleSide} roughness={.27}/></mesh>
      <group ref={caps}>{[1,-1].map((_,i)=><mesh key={`cap${i}`} rotation={[Math.PI/2,0,0]}><circleGeometry args={[.647,64]}/><meshStandardMaterial {...metalProps} side={THREE.DoubleSide} roughness={.32}/></mesh>)}{[1,-1].map((_,i)=><mesh key={`rim${i}`} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.637,.035,12,64]}/><meshStandardMaterial {...metalProps} roughness={.19}/></mesh>)}{[1,-1].map((_,i)=><mesh key={`groove${i}`} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.53,.009,8,64]}/><meshStandardMaterial color="#626e76" metalness={1} roughness={.3}/></mesh>)}</group>
      <mesh ref={tab} rotation={[Math.PI/2,0,-.15]} position={[0,1.16,.08]}><torusGeometry args={[1,.24,10,28]}/><meshStandardMaterial {...metalProps}/></mesh>
    </group>
  </>
}
