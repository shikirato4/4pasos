# Aluminio — De la tierra a tus manos

Experiencia de 850 vh, en español, con un único Canvas sticky y una timeline reversible. React + TypeScript + Vite + Tailwind CSS v4 + Motion + Three.js / React Three Fiber / Drei. Sin animación automática de la historia. Lata externa de Coca-Cola incorporada a petición del usuario; crédito y licencia en public/models/CREDITS.txt.

## Desarrollo

```sh
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

## Estructura

- `src/hooks/useStoryProgress.ts`: única fuente canónica `useScroll`, suavizada con Motion.
- `src/experience/timeline.ts`: rangos, funciones puras y navegación.
- `Bauxite.tsx`: roca procedural dividida en tetraedros cerrados; fragmentación determinista.
- `Metal.tsx`: lingote, laminadora, malla de lámina curvada por longitud de arco, tapa y anilla.
- `Supermarket.tsx`: estante progresivo y productos instanciados.
- `Scene.tsx`: cámara, iluminación y entorno de reflexión procedural.
- `App.tsx`: textos y navegación derivados del mismo MotionValue.

Todas las posiciones y rotaciones dependen exclusivamente del progreso, sin física ni tiempo transcurrido. La curvatura de la lámina es una abstracción didáctica: industrialmente el cuerpo de la lata se forma mediante embutición y estirado; no se fabrica enrollando y soldando una lámina. La transformación visual de mineral a metal sintetiza refinación Bayer y electrólisis Hall–Héroult, no describe una conversión mecánica directa.

Respeta movimiento reducido, navegación por teclado y WebGL no disponible. El entorno usa Lightformers, sin HDR descargado. El DPR máximo es 1.5. Tipografías: Barlow Condensed y DM Sans con alternativas locales.

Referencias técnicas: [Motion useScroll](https://motion.dev/docs/react-use-scroll) y [R3F useFrame](https://r3f.docs.pmnd.rs/api/hooks).

Gráficos mejorados: MetalDetails.tsx contiene lingote con perfil de fundición, texturas de cepillado, rodillos torneados, ejes, rodamientos, tornillería y bastidor fijo. CocaColaCan.tsx normaliza el GLB descargado de William Prosser (CC BY 4.0), conserva texturas 2K y comparte geometría mediante instancing en el supermercado.
