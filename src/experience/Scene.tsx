import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'
import { Bauxite } from './Bauxite'
import { Metal } from './Metal'
import { Supermarket } from './Supermarket'
import { mix, seed, smooth } from './timeline'
function Dust({progress,reduced}:{progress:MotionValue<number>,reduced:boolean}) {
  const group=useRef<THREE.Points>(null!),mat=useRef<THREE.PointsMaterial>(null!)
  const geometry=useMemo(()=>{
    const a=new Float32Array((reduced?28:100)*3)
    for(let i=0;i<a.length;i+=3){a[i]=(seed(i)-.5)*13;a[i+1]=(seed(i+1)-.5)*8;a[i+2]=(seed(i+2)-.5)*6}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(a,3));return g
  },[reduced])
  useFrame(()=>{const p=progress.get();group.current.rotation.y=p*(reduced?.1:.7);group.current.position.y=p*.3;mat.current.opacity=.25*(1-smooth(p,.35,.51))})
  return <points ref={group} geometry={geometry}><pointsMaterial ref={mat} color="#c7a28a" size={.012} transparent opacity={.2} depthWrite={false}/></points>
}
export function Scene({progress,reduced}:{progress:MotionValue<number>,reduced:boolean}) {
  const world=useRef<THREE.Group>(null!),key=useRef<THREE.PointLight>(null!),fill=useRef<THREE.PointLight>(null!)
  const {size}=useThree()
  const colors=useMemo(()=>({warm:new THREE.Color('#ed8755'),cool:new THREE.Color('#dcecff'),shop:new THREE.Color('#fff1d4'),bg1:new THREE.Color('#0d0b0a'),bg2:new THREE.Color('#080e13'),bg3:new THREE.Color('#151916'),bg:new THREE.Color(),light:new THREE.Color()}),[])
  const target=useMemo(()=>new THREE.Vector3(),[])
  useFrame(({camera,scene})=>{
    const p=progress.get(),metal=smooth(p,.29,.46),shop=smooth(p,.86,.95),close=smooth(p,.04,.2),mobile=size.width<650
    colors.bg.copy(colors.bg1).lerp(colors.bg2,metal).lerp(colors.bg3,shop);scene.background=colors.bg
    colors.light.copy(colors.warm).lerp(colors.cool,metal).lerp(colors.shop,shop);key.current.color.copy(colors.light)
    key.current.intensity=mix(mix(25,55,close),95,metal)+shop*65
    key.current.position.x=mix(-1,4,smooth(p,.44,.57))
    fill.current.intensity=mix(17,55,metal)
    const compact=size.width<1000
    const shopDistance=Math.max(mobile?20:21,(mobile?6:11.8)/(size.width/size.height*Math.tan((mobile?48:38)*Math.PI/360)))
    const x=mobile?.05:mix(1.6,compact?0:2.9,shop)
    world.current.position.set(x,mobile?-1.5-shop*1.4:compact?-shop*2:0,0)
    world.current.scale.setScalar(mobile?.65:1)
    camera.position.set(reduced?0:Math.sin(p*4)*.32,mix(.3,1.35,metal)+shop*.8,mix(mix(8.7,7.5,close),shopDistance,shop))
    target.set(0,mobile?-.1:shop*.3,0);camera.lookAt(target)
    if(camera instanceof THREE.PerspectiveCamera){camera.fov=mobile?48:38;camera.updateProjectionMatrix()}
  })
  return <>
    <ambientLight intensity={.17}/><pointLight ref={key} position={[-1,4,4]} intensity={70} distance={30} decay={2}/><pointLight ref={fill} position={[5,1,-3]} color="#8fa2b6" intensity={25} distance={25}/><directionalLight position={[2,5,3]} intensity={.55} color="#fff0df"/>
    <Environment resolution={256} frames={1}><mesh><sphereGeometry args={[40,16,16]}/><meshBasicMaterial color="#535d68" side={THREE.BackSide}/></mesh><Lightformer form="rect" intensity={1.2} position={[0,1,7]} rotation={[0,Math.PI,0]} scale={[8,5,1]}/><Lightformer form="rect" intensity={4} position={[-4,3,5]} scale={[2,8,1]} rotation={[0,Math.PI*.75,0]}/><Lightformer form="rect" intensity={3} position={[5,1,2]} scale={[1,7,1]} rotation={[0,-Math.PI*.65,0]}/><Lightformer form="rect" intensity={2.5} position={[0,5,0]} scale={[8,2,1]} rotation={[Math.PI/2,0,0]}/></Environment>
    <Dust progress={progress} reduced={reduced}/><group ref={world}><Bauxite progress={progress}/><Metal progress={progress}/><Supermarket progress={progress}/></group>
  </>
}
