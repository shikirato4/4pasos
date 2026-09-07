import { useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { seed } from './timeline'

export function useBrushedTexture() {
  return useMemo(()=>{
    const pixels=new Uint8Array(512*128*4)
    for(let y=0;y<128;y++)for(let x=0;x<512;x++){
      const i=(y*512+x)*4,v=155+seed(y*23)*24+seed(x+y*512)*13
      pixels[i]=pixels[i+1]=pixels[i+2]=v;pixels[i+3]=255
    }
    const t=new THREE.DataTexture(pixels,512,128)
    t.wrapS=t.wrapT=THREE.RepeatWrapping;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true
    return t
  },[])
}
export function CastIngot(){
  const grain=useBrushedTexture()
  const geometry=useMemo(()=>{
    const shape=new THREE.Shape();shape.moveTo(-.49,-.46);shape.lineTo(.49,-.46);shape.lineTo(.42,.46);shape.lineTo(-.42,.46);shape.closePath()
    const g=new THREE.ExtrudeGeometry(shape,{depth:.9,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:2});g.translate(0,0,-.45);g.computeVertexNormals();return g
  },[])
  const stamp=useMemo(()=>{
    const c=document.createElement('canvas');c.width=512;c.height=256
    const ctx=c.getContext('2d')!;ctx.clearRect(0,0,512,256);ctx.fillStyle='#525b63';ctx.font='bold 105px Arial';ctx.fillText('Al',30,135);ctx.font='24px monospace';ctx.fillText('99.7',225,98);ctx.font='15px monospace';ctx.fillText('ALUMINIO PRIMARIO',225,132);ctx.fillRect(30,169,425,2)
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t
  },[])
  return <group><mesh geometry={geometry}><meshPhysicalMaterial color="#b8c1c9" metalness={1} roughness={.34} roughnessMap={grain} bumpMap={grain} bumpScale={.004} clearcoat={.12}/></mesh><mesh position={[0,0,.486]}><planeGeometry args={[.77,.68]}/><meshStandardMaterial map={stamp} transparent metalness={.8} roughness={.58} depthWrite={false} polygonOffset polygonOffsetFactor={-1}/></mesh></group>
}
function Cylinder({r,length,z,color='#aebac4'}:{r:number,length:number,z:number,color?:string}){
  return <mesh position={[0,0,z]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[r,r,length,64]}/><meshStandardMaterial color={color} metalness={1} roughness={.27}/></mesh>
}
export function RollerAssembly(){
  const grain=useBrushedTexture()
  const geometry=useMemo(()=>new THREE.LatheGeometry([new THREE.Vector2(.13,-1.22),new THREE.Vector2(.42,-1.22),new THREE.Vector2(.465,-1.18),new THREE.Vector2(.48,-1.11),new THREE.Vector2(.48,1.11),new THREE.Vector2(.465,1.18),new THREE.Vector2(.42,1.22),new THREE.Vector2(.13,1.22)],96),[])
  return <group>
    <group><mesh geometry={geometry} rotation={[Math.PI/2,0,0]}><meshPhysicalMaterial color="#a2acb6" metalness={1} roughness={.25} roughnessMap={grain} bumpMap={grain} bumpScale={.002}/></mesh>
      <Cylinder r={.135} length={3.35} z={0}/>
      {[-1.24,1.24].map(z=><group key={z}><Cylinder r={.36} length={.075} z={z} color="#6c7782"/><mesh position={[0,0,z+(z>0?.043:-.043)]}><torusGeometry args={[.30,.009,8,64]}/><meshStandardMaterial color="#d9e0e5" metalness={1} roughness={.2}/></mesh>{Array.from({length:6},(_,i)=><mesh key={i} position={[Math.sin(i*Math.PI/3)*.25,Math.cos(i*Math.PI/3)*.25,z+(z>0?.046:-.046)]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.035,.035,.025,6]}/><meshStandardMaterial color="#c1c8cc" metalness={1} roughness={.3}/></mesh>)}</group>)}
    </group>
    {[-1.48,1.48].map(z=><group key={z} position={[0,0,z]}><RoundedBox args={[.57,.61,.22]} radius={.07} smoothness={3}><meshStandardMaterial color="#26363e" metalness={.55} roughness={.45}/></RoundedBox><mesh position={[0,0,z>0?.12:-.12]}><torusGeometry args={[.185,.04,12,48]}/><meshStandardMaterial color="#859098" metalness={1} roughness={.23}/></mesh>{[-.19,.19].flatMap(x=>[-.21,.21].map(y=><mesh key={`${x}${y}`} position={[x,y,z>0?.12:-.12]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.03,.03,.035,6]}/><meshStandardMaterial color="#a0a8ad" metalness={1} roughness={.3}/></mesh>))}</group>)}
  </group>
}
export function CanLid(){
  const grain=useBrushedTexture()
  const lid=useMemo(()=>new THREE.LatheGeometry([new THREE.Vector2(0,-.015),new THREE.Vector2(.43,-.015),new THREE.Vector2(.48,-.007),new THREE.Vector2(.515,.018),new THREE.Vector2(.543,.035),new THREE.Vector2(.555,.046),new THREE.Vector2(.568,.031)],96),[])
  const pull=useMemo(()=>{
    const shape=new THREE.Shape();shape.absellipse(0,0,.122,.235,0,Math.PI*2,false,0)
    const hole=new THREE.Path();hole.absellipse(0,.062,.078,.115,0,Math.PI*2,true,0);shape.holes.push(hole)
    const g=new THREE.ExtrudeGeometry(shape,{depth:.012,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.01,bevelThickness:.006,curveSegments:24});g.rotateX(-Math.PI/2);return g
  },[])
  return <group>
    <mesh geometry={lid}><meshPhysicalMaterial color="#c4cbd1" metalness={1} roughness={.32} roughnessMap={grain}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.012,-.225]} scale={[1,1.45,1]}><circleGeometry args={[.15,48]}/><meshStandardMaterial color="#4b5962" metalness={.9} roughness={.48}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.008,-.225]} scale={[1,1.45,1]}><torusGeometry args={[.153,.007,8,48]}/><meshStandardMaterial color="#89969f" metalness={1} roughness={.26}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,.035,0]}><torusGeometry args={[.549,.021,12,96]}/><meshStandardMaterial color="#e2e8ec" metalness={1} roughness={.18}/></mesh>
    <mesh geometry={pull} position={[0,.013,.025]} rotation={[0,.15,0]}><meshPhysicalMaterial color="#c8d1d8" metalness={1} roughness={.24}/></mesh>
    <mesh position={[0,.036,-.09]}><cylinderGeometry args={[.027,.034,.022,32]}/><meshStandardMaterial color="#bfc8cf" metalness={1} roughness={.22}/></mesh>
  </group>
}
export function CanBase(){
  const geo=useMemo(()=>new THREE.LatheGeometry([new THREE.Vector2(0,.11),new THREE.Vector2(.32,.095),new THREE.Vector2(.45,.04),new THREE.Vector2(.52,.012),new THREE.Vector2(.555,0),new THREE.Vector2(.575,.018),new THREE.Vector2(.58,.04)],96),[])
  return <mesh geometry={geo}><meshPhysicalMaterial color="#b6c2cc" side={THREE.DoubleSide} metalness={1} roughness={.3}/></mesh>
}
export function MachineFrame(){
  return <group>{[-1.48,1.48].map(z=><group key={z} position={[0,0,z]}>{[-.38,.38].map(x=><RoundedBox key={x} position={[x,0,0]} args={[.14,2.75,.29]} radius={.025} smoothness={2}><meshStandardMaterial color="#23313a" metalness={.65} roughness={.38}/></RoundedBox>)}{[-1.4,1.4].map(y=><RoundedBox key={y} position={[0,y,0]} args={[1.08,.19,.46]} radius={.035} smoothness={2}><meshStandardMaterial color="#344550" metalness={.7} roughness={.33}/></RoundedBox>)}<mesh position={[0,1.1,0]}><cylinderGeometry args={[.08,.08,.64,32]}/><meshStandardMaterial color="#adb8be" metalness={1} roughness={.24}/></mesh></group>)}</group>
}
