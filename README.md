# Aluminio — De la tierra a tus manos

Presentación escolar 3D de 850 vh, en español, con un único Canvas sticky y una línea de tiempo reversible. Explica la cadena de la bauxita a la lata y relaciona cada etapa con los sectores primario, secundario y terciario. React + TypeScript + Vite + Tailwind CSS v4 + Motion + Three.js / React Three Fiber / Drei.

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
- `CocaColaCan.tsx`: modelo 3D detallado de una lata Coca-Cola y copias instanciadas para la tienda.
- `Distribution.tsx`: fábrica, envasado, transporte y centro de distribución.
- `Supermarket.tsx`: tienda progresiva y productos instanciados.
- `Scene.tsx`: cámara, iluminación y entorno de reflexión procedural.

El modelo de la lata Coca-Cola fue creado por William Prosser y se usa bajo
[Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).
Los créditos completos están incluidos en `public/models/CREDITS.txt`.
- `App.tsx`: textos y navegación derivados del mismo MotionValue.

Todas las posiciones y rotaciones dependen exclusivamente del progreso, sin física ni tiempo transcurrido. La curvatura de la lámina es una abstracción didáctica: industrialmente el cuerpo de la lata se forma mediante embutición y estirado; no se fabrica enrollando y soldando una lámina. La transformación visual de mineral a metal sintetiza refinación Bayer y electrólisis Hall–Héroult, no describe una conversión mecánica directa.

Respeta movimiento reducido, navegación por teclado y WebGL no disponible. El entorno usa Lightformers, sin HDR descargado. El DPR máximo es 1.5. Tipografías: Barlow Condensed y DM Sans con alternativas locales.

Referencias técnicas: [Motion useScroll](https://motion.dev/docs/react-use-scroll) y [R3F useFrame](https://r3f.docs.pmnd.rs/api/hooks).

Gráficos mejorados: `MetalDetails.tsx` contiene el lingote con perfil de fundición, texturas de cepillado, rodillos torneados, ejes, rodamientos, tornillería y bastidor fijo. La lata de aluminio y las unidades del estante son geometría procedural reutilizada mediante instancing.
