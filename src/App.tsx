import { Component, Suspense, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useTransform, useMotionValueEvent, type MotionValue } from 'motion/react'
import { Scene } from './experience/Scene'
import { useStoryProgress } from './hooks/useStoryProgress'
import { stageAt, stops } from './experience/timeline'
const stages = [
  { label:'ORIGEN · SECTOR PRIMARIO', title:'Bauxita.', text:'Roca rica en minerales de aluminio y principal materia prima para producir este metal.', note:'RECURSO NATURAL → EXTRACCIÓN → SECTOR PRIMARIO', a:.065,b:.31 },
  { label:'TRANSFORMACIÓN · SECTOR SECUNDARIO', title:'Aluminio.', text:'El proceso Bayer refina la bauxita en alúmina. Después, el proceso Hall-Héroult usa electrólisis para obtener aluminio.', note:'BAYER → ALÚMINA → HALL-HÉROULT → ALUMINIO',a:.405,b:.69 },
  { label:'PRODUCTO FINAL', title:'Lata de\naluminio.', text:'El aluminio se funde, se lamina y se moldea hasta convertirse en una lata ligera y resistente.', note:'TRANSFORMACIÓN INDUSTRIAL · SECTOR SECUNDARIO',a:.715,b:.865 },
  { label:'DISTRIBUCIÓN Y COMERCIALIZACIÓN', title:'Sector\nterciario.', text:'Tras el envasado, los productos se transportan por centros de distribución hasta comercios y consumidores.', note:'TRANSPORTE + DISTRIBUCIÓN + COMERCIALIZACIÓN',a:.875,b:.963 },
]
function Chapter({index,progress}:{index:number,progress:MotionValue<number>}) {
  const s=stages[index]
  const opacity=useTransform(progress,[s.a,s.a+.018,s.b-.018,s.b],[0,1,1,0])
  const y=useTransform(progress,[s.a,s.a+.024,s.b-.018,s.b],[22,0,0,-18])
  const noteOpacity=useTransform(progress,[.565,.585],index===1?[1,0]:[1,1])
  return <motion.section className="chapter" style={{opacity,y}} aria-label={`${index+1}. ${s.label}`}><div className="chapter-eyebrow"><span className="accent">0{index+1}</span><span className="hairline"/>{s.label}</div><h2>{s.title}</h2><p>{s.text}</p><motion.div className="material-note" style={{opacity:noteOpacity}}><span/> {s.note}</motion.div></motion.section>
}
function StoryNote({progress,a,b,className,children}:{progress:MotionValue<number>,a:number,b:number,className:string,children:ReactNode}){
  const opacity=useTransform(progress,[a,a+.018,b-.018,b],[0,1,1,0])
  const y=useTransform(progress,[a,a+.025],[16,0])
  return <motion.div className={className} style={{opacity,y}}>{children}</motion.div>
}
class CanvasBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  render(){return this.state.failed ? <div className="fallback">La vista 3D necesita WebGL. Puedes seguir explorando las cuatro etapas con los controles inferiores.</div> : this.props.children}
}
export function App() {
  const {progress,raw,reduced}=useStoryProgress()
  const [stage,setStage]=useState(0)
  const [percent,setPercent]=useState(0)
  useMotionValueEvent(progress,'change',p=>{setStage(old=>old===stageAt(p)?old:stageAt(p));setPercent(Math.round(p*100))})
  const introOpacity=useTransform(progress,[0,.035,.085],[1,1,0])
  const introY=useTransform(progress,[0,.085],[0,-35])
  const outro=useTransform(progress,[.96,.989],[0,1])
  const dark=useTransform(progress,[.955,1],[0,.88])
  const transition=useTransform(progress,[.29,.32,.385,.41],[0,1,1,0])
  const roll=useTransform(progress,[.58,.60,.68,.715],[0,1,1,0])
  const go=(p:number)=>window.scrollTo({top:p*(document.documentElement.scrollHeight-window.innerHeight),behavior:reduced?'instant':'smooth'})
  return <main className="story" aria-label="El proceso productivo del aluminio"><div className="stage-viewport">
    <div className="canvas-wrap" aria-hidden="true"><CanvasBoundary><Suspense fallback={<div className="loading">Preparando el viaje…</div>}><Canvas camera={{position:[0,0,8],fov:38}} dpr={[1,1.5]} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}} fallback={<div className="fallback">Activa WebGL para ver la transformación 3D.</div>}><Scene progress={progress} reduced={reduced}/></Canvas></Suspense></CanvasBoundary></div><div className="vignette"/>
    <header className="absolute inset-x-0 top-0 flex items-start justify-between"><button className="brand" onClick={()=>go(0)} aria-label="Volver al inicio"><span className="brand-symbol">Al<span>13</span></span><span>PROCESO PRODUCTIVO<strong>ALUMINIO</strong></span></button><div className="top-right"><span className="edition">UNA HISTORIA DE TRANSFORMACIÓN</span><span className="counter">0{stage+1}<i> / 04</i></span></div></header>
    <motion.section className="intro" style={{opacity:introOpacity,y:introY}}><div className="eyebrow"><span className="small-line"/> LO EXTRAORDINARIO EMPIEZA EN LA TIERRA</div><h1>DE LA TIERRA<br/><span>AL PRODUCTO</span></h1><p>Proceso productivo del aluminio</p><button onClick={()=>go(stops[0])} className="explore" disabled={percent>9}>SCROLL PARA EXPLORAR <span>↓</span></button></motion.section>
    {stages.map((_,i)=><Chapter key={i} index={i} progress={progress}/>)}
    <StoryNote progress={progress} a={.18} b={.315} className="fact-card"><b>OBTENCIÓN</b><span>Se extrae de yacimientos mediante minería, generalmente a cielo abierto.</span></StoryNote>
    <motion.div className="process-caption" style={{opacity:transition}}><span>TRANSFORMACIÓN DE LA MATERIA</span><p>BAUXITA <i>↓</i> ALÚMINA <i>↓</i> ALUMINIO</p></motion.div>
    <motion.div className="rolling-caption" style={{opacity:roll}}>LINGOTE <span>→</span> RODILLOS <span>→</span> LÁMINA DE ALUMINIO</motion.div>
    <StoryNote progress={progress} a={.842} b={.915} className="distribution-chain"><b>FÁBRICA</b><i>→</i><b>ENVASADO</b><i>→</i><b>TRANSPORTE</b><i>→</i><b>CENTRO DE DISTRIBUCIÓN</b><i>→</i><b>SUPERMERCADO</b></StoryNote>
    <motion.div className="ending-shade" style={{opacity:dark}}/><motion.section className="outro" style={{opacity:outro}}><div className="eyebrow">LA CADENA PRODUCTIVA COMPLETA</div><div className="sector-summary"><span><b>SECTOR PRIMARIO</b>Extracción de bauxita</span><i>↓</i><span><b>SECTOR SECUNDARIO</b>Alúmina, aluminio y fabricación de la lata</span><i>↓</i><span><b>SECTOR TERCIARIO</b>Distribución y comercialización</span></div><h2>DE LA MATERIA PRIMA<br/><span>AL PRODUCTO FINAL.</span></h2><p>BAUXITA <span>→</span> ALÚMINA <span>→</span> ALUMINIO <span>→</span> LATA <span>→</span> DISTRIBUCIÓN <span>→</span> CONSUMIDOR</p><button onClick={()=>go(0)} disabled={percent<97}>VOLVER AL ORIGEN <span>↗</span></button></motion.section>
    <aside className="sector-rail" aria-label={`Sector activo: ${percent<43?'primario':percent<86?'secundario':'terciario'}`}>{['PRIMARIO','SECUNDARIO','TERCIARIO'].map((s,i)=><span key={s} className={(i===0&&percent<43)||(i===1&&percent>=43&&percent<86)||(i===2&&percent>=86)?'active':''}>{s}</span>)}</aside><aside className="side-note">MATERIA EN TRANSFORMACIÓN <span> / </span> Al — 26.98</aside><footer><div className="footer-top"><span>EL RECORRIDO</span><span>{String(percent).padStart(3,'0')}<i> %</i></span></div><nav aria-label="Etapas del proceso" className="stage-nav"><div className="track"/><motion.div className="track fill" style={{scaleX:raw}}/>{['Bauxita','Aluminio','Lata','Distribución'].map((s,i)=><button key={s} onClick={()=>go(stops[i])} aria-current={stage===i?'step':undefined}><span className="nav-dot"/><span className="nav-number">0{i+1}</span><span className="nav-label">{s}</span></button>)}</nav></footer>
  </div></main>
}
