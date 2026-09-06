/* oxlint-disable react/react-compiler -- Three.js resources are intentionally mutated in useFrame; this subtree is not compiled by React Compiler. */
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import type { MotionValue } from 'motion/react'
import { mix, seed, smooth } from './timeline'

// Closed tetrahedral wedges share the same deformed surface vertices. Every
// piece therefore returns to exactly the same unbroken mineral on reverse.
function makeFragments() {
  const shell=new THREE.IcosahedronGeometry(1.45,4)
  const pos=shell.attributes.position
  const point=new THREE.Vector3()
  const vertices:THREE.Vector3[]=[]
  for(let i=0;i<pos.count;i++){
    point.fromBufferAttribute(pos,i)
    const n=1+.13*Math.sin(point.x*4.1+point.y*2.7)*Math.cos(point.z*3.7)+.055*Math.sin(point.y*13+point.x*8)*Math.cos(point.z*9)
    vertices.push(point.clone().multiplyScalar(n).multiply(new THREE.Vector3(1.06,.89,.96)))
  }
  const pieces=[]
  for(let i=0;i<vertices.length;i+=3){
    const a=vertices[i],b=vertices[i+1],c=vertices[i+2]
    const center=a.clone().add(b).add(c).multiplyScalar(1/4)
    const zero=new THREE.Vector3()
    const triangles=[a,b,c,zero,b,a,zero,c,b,zero,a,c]
    const coords=triangles.flatMap(v=>v.clone().sub(center).toArray())
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(coords,3));geo.computeVertexNormals()
    const normals=geo.attributes.normal
    for(let j=0;j<3;j++){const n=triangles[j].clone().normalize();normals.setXYZ(j,n.x,n.y,n.z)}
    const mineral=new THREE.Color().setHSL(.042+seed(i)*.025,.38+seed(i+2)*.22,.16+seed(i+6)*.12)
    const colors=triangles.flatMap((_,j)=>mineral.clone().multiplyScalar(j<3?1:.68).toArray())
    geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3))
    geo.setAttribute('uv',new THREE.Float32BufferAttribute(triangles.flatMap(v=>[Math.atan2(v.z,v.x)/Math.PI/2+.5,Math.acos(v.y/Math.max(v.length(),.001))/Math.PI]),2))
    pieces.push({geo,center,scatter:center.clone().normalize().multiplyScalar(.55+seed(i+3)*.8),target:new THREE.Vector3((seed(i+4)-.5)*2.8,(seed(i+5)-.5)*.65,(seed(i+7)-.5)*1.1),rotation:new THREE.Vector3(seed(i+8)*3,seed(i+9)*4,seed(i+10)*2)})
  }
  shell.dispose()
  return pieces
}
export function Bauxite({progress}:{progress:MotionValue<number>}) {
  const pieces=useMemo(()=>makeFragments(),[])
  const group=useRef<THREE.Mesh>(null!)
  const combined=useMemo(()=>{
    const geo=mergeGeometries(pieces.map(f=>f.geo))
    geo.boundingSphere=new THREE.Sphere(new THREE.Vector3(),6)
    return {geo,positions:Float32Array.from(geo.attributes.position.array),normals:Float32Array.from(geo.attributes.normal.array),vertex:new THREE.Vector3(),normal:new THREE.Vector3(),offset:new THREE.Vector3(),rotation:new THREE.Euler(),quaternion:new THREE.Quaternion()}
  },[pieces])
  const previous=useRef(-1)
  const material=useMemo(()=>{
    const data=new Uint8Array(512*512*4)
    const noise=(x:number,y:number,f:number)=>{const xx=x/f,yy=y/f,ix=Math.floor(xx),iy=Math.floor(yy),fx=xx-ix,fy=yy-iy;return mix(mix(seed(ix+iy*133),seed(ix+1+iy*133),fx),mix(seed(ix+(iy+1)*133),seed(ix+1+(iy+1)*133),fx),fy)}
    for(let y=0;y<512;y++)for(let x=0;x<512;x++){
      const i=(y*512+x)*4,n=noise(x,y,45)*.38+noise(x,y,12)*.29+noise(x,y,3)*.21+seed(i)*.12
      const fleck=seed(i+1)>.975?1.5:1
      data[i]=(43+n*139)*fleck;data[i+1]=(24+n*85)*fleck;data[i+2]=(16+n*56)*fleck;data[i+3]=255
    }
    const texture=new THREE.DataTexture(data,512,512);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.magFilter=THREE.LinearFilter;texture.needsUpdate=true
    return new THREE.MeshStandardMaterial({roughness:.96,metalness:.03,map:texture,bumpMap:texture,bumpScale:.18})
  },[])
  useFrame(()=>{
    const p=progress.get(),explode=smooth(p,.27,.345),converge=smooth(p,.345,.445)
    if(previous.current===p)return
    previous.current=p
    group.current.visible=p<.45
    if(!group.current.visible)return
    group.current.rotation.set(.15+p*.8,p*1.8,-.18+p*.4)
    const size=mix(.86,1.1,smooth(p,0,.18));group.current.scale.setScalar(size)
    const position=combined.geo.attributes.position,normal=combined.geo.attributes.normal
    pieces.forEach((f,i)=>{
      combined.offset.copy(f.center).addScaledVector(f.scatter,explode*(1-converge)).lerp(f.target,converge)
      combined.rotation.set(f.rotation.x*explode*(1-converge),f.rotation.y*explode*(1-converge),f.rotation.z*explode*(1-converge))
      combined.quaternion.setFromEuler(combined.rotation)
      const scale=1-smooth(p,.414,.449)
      for(let j=0;j<12;j++){
        const v=i*12+j
        combined.vertex.fromArray(combined.positions,v*3).multiplyScalar(scale).applyQuaternion(combined.quaternion).add(combined.offset)
        position.setXYZ(v,combined.vertex.x,combined.vertex.y,combined.vertex.z)
        combined.normal.fromArray(combined.normals,v*3).applyQuaternion(combined.quaternion)
        normal.setXYZ(v,combined.normal.x,combined.normal.y,combined.normal.z)
      }
    });position.needsUpdate=true;normal.needsUpdate=true
    material.metalness=mix(.03,.95,converge);material.roughness=mix(.95,.25,converge)
  })
  return <mesh ref={group} geometry={combined.geo} material={material}/>
}
