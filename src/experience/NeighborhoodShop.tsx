import { useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'

function Sign({title,subtitle,width,height,position,color='#164c43'}:{title:string,subtitle:string,width:number,height:number,position:[number,number,number],color?:string}){
  const texture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256
    const ctx=canvas.getContext('2d')!;ctx.fillStyle=color;ctx.fillRect(0,0,1024,256);ctx.fillStyle='#f5e9d3';ctx.textAlign='center';ctx.font='bold 100px Arial';ctx.fillText(title,512,130);ctx.font='26px Arial';ctx.fillText(subtitle,512,198)
    const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;return map
  },[title,subtitle,color])
  return <mesh position={position}><planeGeometry args={[width,height]}/><meshBasicMaterial map={texture}/></mesh>
}
export function NeighborhoodShop(){
  return <group>
    <mesh position={[0,1.1,-2.45]}><boxGeometry args={[16.6,8.5,.3]}/><meshStandardMaterial color="#b4b0a0" roughness={.9}/></mesh>
    {[-8.15,8.15].map(x=><mesh key={x} position={[x,.7,.2]}><boxGeometry args={[.3,7.6,5.5]}/><meshStandardMaterial color="#aaa898" roughness={.9}/></mesh>)}
    <mesh position={[0,4.65,-.9]}><boxGeometry args={[16.7,1.6,3.3]}/><meshStandardMaterial color="#174a40" roughness={.55}/></mesh>
    <Sign title="LA ESQUINA" subtitle="ABARROTES · BEBIDAS · TU TIENDA DE BARRIO" width={14.8} height={1.5} position={[0,4.7,.77]}/>
    <mesh position={[0,3.76,.4]}><boxGeometry args={[16.8,.13,2.5]}/><meshStandardMaterial color="#d7d2bc" roughness={.55}/></mesh>
    {Array.from({length:24},(_,i)=><mesh key={i} position={[-8.05+i*.7,3.51,1.58]}><boxGeometry args={[.7,.45,.11]}/><meshStandardMaterial color={i%2?'#dad1b8':'#a84e36'} roughness={.7}/></mesh>)}
    <group position={[6.45,-1.98,1.65]}>
      <RoundedBox args={[2.85,2.18,1.65]} radius={.07} smoothness={3}><meshStandardMaterial color="#956e48" roughness={.75}/></RoundedBox>
      <RoundedBox position={[0,1.16,0]} args={[3.06,.2,1.87]} radius={.04} smoothness={2}><meshStandardMaterial color="#303d3b" metalness={.35} roughness={.3}/></RoundedBox>
      <Sign title="CAJA" subtitle="GRACIAS POR TU VISITA" width={2.2} height={.65} position={[0,.08,.835]}/>
      <mesh position={[-.5,1.36,-.1]}><boxGeometry args={[.75,.2,.7]}/><meshStandardMaterial color="#232b2e" roughness={.5}/></mesh>
      <mesh position={[-.5,1.67,-.31]} rotation={[-.23,0,0]}><boxGeometry args={[.7,.52,.09]}/><meshStandardMaterial color="#151f22" roughness={.35}/></mesh>
      <mesh position={[-.5,1.67,-.247]} rotation={[-.23,0,0]}><planeGeometry args={[.56,.36]}/><meshBasicMaterial color="#8db6a6"/></mesh>
      <mesh position={[.73,1.35,.1]}><boxGeometry args={[.47,.28,.5]}/><meshStandardMaterial color="#bd9270" roughness={.8}/></mesh>
    </group>
    <group position={[-6.43,.02,-.35]}>
      <RoundedBox args={[2.62,5.95,1.5]} radius={.08} smoothness={3}><meshStandardMaterial color="#d6d5c9" metalness={.15} roughness={.4}/></RoundedBox>
      <mesh position={[0,-.07,.765]}><boxGeometry args={[2.22,4.7,.08]}/><meshStandardMaterial color="#21474e" metalness={.5} roughness={.22}/></mesh>
      <Sign title="FRÍAS" subtitle="BEBIDAS" width={2.32} height={.58} position={[0,2.58,.78]} color="#922e29"/>
      {[-1.65,-.4,.85].map(y=><group key={y}>{[-.68,0,.68].map((x,i)=><mesh key={x} position={[x,y,.83]}><cylinderGeometry args={[.16,.19,.68,16]}/><meshStandardMaterial color={i===1?'#987a30':'#6d2925'} roughness={.33}/></mesh>)}<mesh position={[0,y-.39,.8]}><boxGeometry args={[2.08,.045,.09]}/><meshStandardMaterial color="#bac4c0" metalness={.7} roughness={.3}/></mesh></group>)}
      <mesh position={[.91,.1,.88]}><boxGeometry args={[.045,.95,.075]}/><meshStandardMaterial color="#e5e8e1" metalness={1} roughness={.25}/></mesh>
    </group>
    <Sign title="ABIERTO" subtitle="BIENVENIDO" width={2.45} height={.73} position={[6.38,2.16,-2.25]} color="#8d3d2d"/>
    <mesh position={[0,-3.03,1.3]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[16.3,7.4]}/><meshStandardMaterial color="#96978a" roughness={.7}/></mesh>
    <mesh position={[0,-3.12,4.72]}><boxGeometry args={[17,.2,.85]}/><meshStandardMaterial color="#b1b1a2" roughness={.8}/></mesh>
    <pointLight position={[0,3.2,2]} color="#ffe0a6" intensity={95} distance={18}/>
  </group>
}
