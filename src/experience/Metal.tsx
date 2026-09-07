/* oxlint-disable react/react-compiler -- Geometry buffers are intentionally mutated in R3F useFrame, outside React rendering. */
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'
import { mix,smooth,range } from './timeline'
import { CastIngot, RollerAssembly, MachineFrame, CanLid, CanBase, useBrushedTexture } from './MetalDetails'
import { CocaColaCan } from './CocaColaCan'
export const metalProps={color:'#b5bdc4',metalness:1,roughness:.23}
export function Metal({progress}:{progress:MotionValue<number>}) {
  const ingot=useRef<THREE.Group>(null!),roller=useRef<THREE.Group>(null!),sheet=useRef<THREE.Mesh>(null!),can=useRef<THREE.Group>(null!)
  const caps=useRef<THREE.Group>(null!)
  const frame=useRef<THREE.Group>(null!)
  const shellMaterial=useRef<THREE.MeshPhysicalMaterial>(null!)
  const grain=useBrushedTexture()
  const geometry=useMemo(()=>new THREE.PlaneGeometry(1,1,128,48),[])
  const last=useRef(-1)
  useFrame(()=>{
    const p=progress.get(),lam=smooth(p,.575,.705),curl=smooth(p,.73,.802),reveal=smooth(p,.86,.95)
    ingot.current.visible=p>=.399&&p<.714
    const emerge=smooth(p,.399,.445),handoff=1-smooth(p,.70,.715)
    ingot.current.scale.set(mix(2.8,4.4,lam)*emerge*handoff,mix(.75,.038,lam)*emerge,mix(1.25,1.9,lam)*emerge)
    ingot.current.rotation.set(mix(.15,0,lam),mix(-.25+(p-.43)*1.5,-.42,lam),mix(-.15,0,lam))
    roller.current.visible=p>.58&&p<.746
    const machine=smooth(p,.58,.616)*(1-smooth(p,.703,.746))
    roller.current.scale.setScalar(machine)
    roller.current.rotation.y=-.42
    frame.current.visible=roller.current.visible;frame.current.scale.setScalar(machine)
    roller.current.children.forEach((r,i)=>{r.children[0].children[0].rotation.z=(i===0?1:-1)*range(p,.58,.74)*Math.PI*5;r.position.y=(i===0?1:-1)*(.515+mix(.75,.038,lam)/2)})
    sheet.current.visible=p>=.70&&p<.845
    shellMaterial.current.opacity=1-smooth(p,.813,.845)
    can.current.rotation.set(mix(-Math.PI/2,.1,smooth(p,.712,.765))*(1-reveal),(mix(-.42,0,smooth(p,.71,.77))-.35*smooth(p,.80,.86))*(1-reveal),0)
    can.current.position.set(mix(0,-.7,reveal),mix(0,-.08,reveal),mix(0,-.15,reveal))
    can.current.scale.setScalar(mix(1,.72,reveal))
    if(last.current!==p){
      const pos=geometry.attributes.position
      const width=mix(4.4,Math.PI*1.3,smooth(p,.71,.77)),height=mix(1.9,2.25,smooth(p,.715,.78))
      const angle=Math.max(.0001,curl*Math.PI*2),radius=width/angle
      for(let j=0;j<=48;j++)for(let i=0;i<=128;i++){
        const u=i/128-.5,theta=u*angle
        // Arc-length-preserving bend, flat sheet at zero and closed tube at one.
        const y=(.5-j/48)*height
        const edge=Math.abs(y)/(height/2)
        const neck=1-.13*smooth(edge,.79,1)*curl
        const x=Math.sin(theta)*radius*neck,z=((Math.cos(theta)-1)*radius+curl*.65)*neck
        pos.setXYZ(j*129+i,x,y,z)
      }
      pos.needsUpdate=true;geometry.computeVertexNormals();last.current=p
    }
    sheet.current.scale.setScalar(smooth(p,.70,.714))
    caps.current.visible=p>.79&&p<.827
    caps.current.children.forEach((child,i)=>{
      const t=smooth(p,.795+i*.006,.83+i*.006)
      child.scale.setScalar(t)
      child.position.y=(i%2===0?1:-1)*(1.125+(1-t)*.55)
    })
  })
  return <>
    <group ref={ingot}><CastIngot/></group>
    <group ref={roller}>{[.57,-.57].map((y,i)=><group key={i} position={[0,y,0]}><RollerAssembly/></group>)}</group>
    <group ref={frame} rotation={[0,-.42,0]}><MachineFrame/></group>
    <group ref={can}>
      <mesh ref={sheet} geometry={geometry}><meshPhysicalMaterial ref={shellMaterial} {...metalProps} transparent side={THREE.DoubleSide} roughness={.3} roughnessMap={grain} bumpMap={grain} bumpScale={.0015} clearcoat={.25} clearcoatRoughness={.25}/></mesh>
      <group ref={caps}><group><CanLid/></group><group><CanBase/></group></group>
      <CocaColaCan progress={progress}/>
    </group>
  </>
}
