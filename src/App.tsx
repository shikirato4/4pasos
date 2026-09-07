import { Component, Suspense, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useTransform, useMotionValueEvent, type MotionValue } from 'motion/react'
import { Scene } from './experience/Scene'
import { useStoryProgress } from './hooks/useStoryProgress'
import { stageAt, stops } from './experience/timeline'
const stages = [
  { label:'ORIGEN', title:'Bauxita.', text:'La bauxita es el principal mineral utilizado para producir aluminio.', note:'TIERRA · ÓXIDOS · MINERALES', a:.065,b:.32 },
  { label:'MATERIAL OBTENIDO', title:'Aluminio.', text:'La bauxita se refina para obtener alúmina. Mediante electrólisis, la alúmina se transforma en aluminio.', note:'REFINACIÓN · ELECTRÓLISIS',a:.405,b:.69 },
  { label:'PRODUCTO TRANSFORMADO', title:'Una nueva\nforma.', text:'El aluminio se lamina y moldea para fabricar envases ligeros y resistentes.', note:'LATA DE ALUMINIO',a:.715,b:.875 },
  { label:'COMERCIALIZACIÓN', title:'Parte de\ntu día.', text:'El producto terminado se distribuye y comercializa en supermercados hasta llegar al consumidor.', note:'SUPERMERCADO · DEL ESTANTE A TUS MANOS',a:.88,b:.965 },
]
function Chapter({index,progress}:{index:number,progress:MotionValue<number>}) {
  const s=stages[index]
  const opacity=useTransform(progress,[s.a,s.a+.018,s.b-.018,s.b],[0,1,1,0])
  const y=useTransform(progress,[s.a,s.a+.024,s.b-.018,s.b],[22,0,0,-18])
  const noteOpacity=useTransform(progress,[.565,.585],index===1?[1,0]:[1,1])
  return <motion.section className="chapter" style={{opacity,y}} aria-label={`${index+1}. ${s.label}`}><div className="chapter-eyebrow"><span className="accent">0{index+1}</span><span className="hairline"/>{s.label}</div><h2>{s.title}</h2><p>{s.text}</p><motion.div className="material-note" style={{opacity:noteOpacity}}><span/> {s.note}</motion.div></motion.section>
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
    <motion.section className="intro" style={{opacity:introOpacity,y:introY}}><div className="eyebrow"><span className="small-line"/> LO EXTRAORDINARIO EMPIEZA EN LA TIERRA</div><h1>DE LA TIERRA<br/><span>A TUS MANOS</span></h1><p>El proceso productivo del aluminio</p><button onClick={()=>go(stops[0])} className="explore" disabled={percent>9}>SCROLL PARA EXPLORAR <span>↓</span></button></motion.section>
    {stages.map((_,i)=><Chapter key={i} index={i} progress={progress}/>)}
    <motion.div className="process-caption" style={{opacity:transition}}><span>LA MATERIA CAMBIA.</span><p>Fragmentación y refinación</p></motion.div><motion.div className="rolling-caption" style={{opacity:roll}}>LAMINADO <span>→</span> UNA LÁMINA, INFINITAS POSIBILIDADES</motion.div>
    <motion.div className="ending-shade" style={{opacity:dark}}/><motion.section className="outro" style={{opacity:outro}}><div className="eyebrow">CUATRO ETAPAS. UNA TRANSFORMACIÓN.</div><h2>DE LA MATERIA PRIMA<br/><span>AL PRODUCTO FINAL.</span></h2><p>BAUXITA <span>→</span> ALUMINIO <span>→</span> LATA <span>→</span> COMERCIALIZACIÓN</p><button onClick={()=>go(0)} disabled={percent<97}>VOLVER AL ORIGEN <span>↗</span></button></motion.section>
    <a className="asset-credit" href="/models/CREDITS.txt" target="_blank" rel="noreferrer">Lata 3D: William Prosser · CC BY 4.0 ↗</a><aside className="side-note">MATERIA EN TRANSFORMACIÓN <span> / </span> Al — 26.98</aside><footer><div className="footer-top"><span>EL RECORRIDO</span><span>{String(percent).padStart(3,'0')}<i> %</i></span></div><nav aria-label="Etapas del proceso" className="stage-nav"><div className="track"/><motion.div className="track fill" style={{scaleX:raw}}/>{['Bauxita','Aluminio','Lata','Comercialización'].map((s,i)=><button key={s} onClick={()=>go(stops[i])} aria-current={stage===i?'step':undefined}><span className="nav-dot"/><span className="nav-number">0{i+1}</span><span className="nav-label">{s}</span></button>)}</nav></footer>
  </div></main>
}
