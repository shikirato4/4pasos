import { useRef } from 'react'
import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'
import { mix, smooth } from './timeline'

const steel = { color: '#74828a', metalness: .72, roughness: .38 }

function Factory() {
  return <group>
    <mesh><boxGeometry args={[1.25, .8, .8]}/><meshStandardMaterial {...steel}/></mesh>
    {[-.35, .3].map((x, i) => <mesh key={x} position={[x, .75, 0]}>
      <cylinderGeometry args={[.12, .16, .8, 16]}/>
      <meshStandardMaterial color={i ? '#8c6b52' : '#66747d'} metalness={.45} roughness={.5}/>
    </mesh>)}
  </group>
}

function Package() {
  return <group>{[-.35, .35].flatMap(x => [-.22, .28].map(y => <mesh key={`${x}${y}`} position={[x, y, 0]}>
    <boxGeometry args={[.62, .43, .65]}/><meshStandardMaterial color="#9d7650" roughness={.78}/>
  </mesh>))}</group>
}

function Wheel({ position }: { position: [number, number, number] }) {
  return <group position={position} rotation={[Math.PI / 2, 0, 0]}>
    <mesh castShadow>
      <cylinderGeometry args={[.19, .19, .12, 28]}/>
      <meshStandardMaterial color="#11171a" metalness={.12} roughness={.74}/>
    </mesh>
    <mesh position={[0, .066, 0]}>
      <cylinderGeometry args={[.085, .085, .014, 20]}/>
      <meshStandardMaterial color="#aeb9be" metalness={.92} roughness={.2}/>
    </mesh>
    <mesh position={[0, .076, 0]}>
      <cylinderGeometry args={[.028, .028, .018, 12]}/>
      <meshStandardMaterial color="#354146" metalness={.8} roughness={.3}/>
    </mesh>
  </group>
}

function Truck({ progress, color = '#b84f36', offset = 0 }: { progress: MotionValue<number>, color?: string, offset?: number }) {
  const root = useRef<THREE.Group>(null!)
  const wheels = useRef<THREE.Group>(null!)
  useFrame(() => {
    const drive = smooth(progress.get(), .848 + offset, .9 + offset)
    root.current.position.x = mix(-.32, .24, drive)
    wheels.current.children.forEach(wheel => { wheel.rotation.x = Math.PI / 2 - drive * Math.PI * 5 })
  })
  const wheelPositions: [number, number, number][] = [
    [-1.02, -.49, -.43], [-1.02, -.49, .43],
    [.12, -.49, -.43], [.12, -.49, .43],
    [.88, -.49, -.43], [.88, -.49, .43],
  ]
  return <group ref={root} scale={.86}>
    <mesh position={[.22, -.28, 0]} castShadow>
      <boxGeometry args={[2.65, .14, .76]}/><meshStandardMaterial color="#263137" metalness={.78} roughness={.3}/>
    </mesh>
    <RoundedBox args={[1.65, .94, .82]} radius={.08} smoothness={3} position={[.48, .25, 0]} castShadow>
      <meshPhysicalMaterial color="#c6d0d3" metalness={.72} roughness={.26} clearcoat={.35}/>
    </RoundedBox>
    {[-.18, .18, .54, .9].map(x => <mesh key={x} position={[x, .25, .416]}>
      <boxGeometry args={[.026, .76, .018]}/><meshStandardMaterial color="#8f9da2" metalness={.9} roughness={.24}/>
    </mesh>)}
    <mesh position={[1.31, -.03, 0]}><boxGeometry args={[.06, .43, .78]}/><meshStandardMaterial color="#7e8b90" metalness={.88} roughness={.23}/></mesh>
    <RoundedBox args={[.72, .87, .8]} radius={.09} smoothness={3} position={[-.91, .17, 0]} castShadow>
      <meshPhysicalMaterial color={color} metalness={.46} roughness={.3} clearcoat={.62}/>
    </RoundedBox>
    <RoundedBox args={[.42, .32, .78]} radius={.07} smoothness={3} position={[-1.43, -.09, 0]} castShadow>
      <meshPhysicalMaterial color={color} metalness={.46} roughness={.28} clearcoat={.62}/>
    </RoundedBox>
    <mesh position={[-1.285, .32, 0]} rotation={[0, 0, -.12]}>
      <boxGeometry args={[.025, .34, .65]}/><meshPhysicalMaterial color="#15262c" metalness={.5} roughness={.16}/>
    </mesh>
    {[-.405, .405].map(z => <mesh key={z} position={[-.9, .32, z]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[.35, .3]}/><meshPhysicalMaterial color="#193039" metalness={.42} roughness={.16} clearcoat={.7}/>
    </mesh>)}
    <mesh position={[-1.655, -.1, 0]} rotation={[0, 0, Math.PI / 2]}>
      <boxGeometry args={[.36, .025, .48]}/><meshStandardMaterial color="#202c31" metalness={.85} roughness={.25}/>
    </mesh>
    {[-.23, .23].map(z => <mesh key={z} position={[-1.676, .01, z]} rotation={[0, Math.PI / 2, 0]}>
      <circleGeometry args={[.055, 20]}/><meshStandardMaterial color="#fff0c1" emissive="#dca65f" emissiveIntensity={1.8}/>
    </mesh>)}
    <mesh position={[-1.68, -.28, 0]}><boxGeometry args={[.09, .08, .82]}/><meshStandardMaterial color="#bcc5c8" metalness={.95} roughness={.18}/></mesh>
    <mesh position={[-.72, -.28, .43]}><capsuleGeometry args={[.1, .38, 5, 14]}/><meshStandardMaterial color="#9aa8ac" metalness={.95} roughness={.2}/></mesh>
    <mesh position={[-.48, .16, .44]}><boxGeometry args={[.12, .05, .035]}/><meshStandardMaterial color="#dae0df" metalness={.9} roughness={.18}/></mesh>
    <group ref={wheels}>{wheelPositions.map((position, i) => <Wheel key={i} position={position}/>)}</group>
  </group>
}

function Warehouse() {
  return <group>
    <mesh><boxGeometry args={[1.35, .9, .82]}/><meshStandardMaterial color="#65747a" metalness={.5} roughness={.55}/></mesh>
    <mesh position={[0, -.05, .42]}><boxGeometry args={[.58, .62, .04]}/><meshStandardMaterial color="#202a2d" metalness={.65} roughness={.35}/></mesh>
  </group>
}

export function Distribution({ progress }: { progress: MotionValue<number> }) {
  const root = useRef<THREE.Group>(null!)
  useFrame(() => {
    const p = progress.get(), enter = smooth(p, .842, .868), exit = 1 - smooth(p, .895, .918)
    root.current.visible = enter * exit > .001
    root.current.scale.setScalar(enter * exit)
    root.current.position.z = (1 - enter) * -3
    root.current.children.forEach((child, i) => child.position.y = -.15 + smooth(p, .842 + i * .008, .87 + i * .008) * .22)
  })
  return <group ref={root} position={[0, -1.25, .2]}>
    <group position={[-4.55, 0, 0]}><Factory/></group>
    <group position={[-2.6, 0, 0]}><Package/></group>
    <group position={[-.35, .14, .5]}><Truck progress={progress}/></group>
    <group position={[2.28, .06, -.7]} scale={.88} rotation={[0, Math.PI, 0]}><Truck progress={progress} color="#617c87" offset={.006}/></group>
    <group position={[4.6, 0, 0]}><Warehouse/></group>
    <mesh position={[0, -.63, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[10.2, .04]}/><meshBasicMaterial color="#d87954"/></mesh>
  </group>
}
