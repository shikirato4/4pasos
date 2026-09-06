import { useScroll, useSpring, useReducedMotion } from 'motion/react'
export function useStoryProgress() {
  const { scrollYProgress } = useScroll()
  const reduced = useReducedMotion() ?? false
  const spring = useSpring(scrollYProgress, { stiffness: 190, damping: 34, restDelta: .00001 })
  return { progress: reduced ? scrollYProgress : spring, raw: scrollYProgress, reduced }
}
