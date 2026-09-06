export const clamp = (n: number) => Math.max(0, Math.min(1, n))
export const range = (p: number, a: number, b: number) => clamp((p-a)/(b-a))
export const smooth = (p: number, a: number, b: number) => { const t=range(p,a,b); return t*t*(3-2*t) }
export const mix = (a: number,b: number,t: number) => a+(b-a)*t
export const stageAt = (p: number) => p < .43 ? 0 : p < .72 ? 1 : p < .88 ? 2 : 3
export const stops = [.14,.48,.85,.95]
export const seed = (i: number) => { const x=Math.sin(i*127.1+311.7)*43758.5453; return x-Math.floor(x) }
