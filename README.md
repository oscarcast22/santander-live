# Santander Live

Base en Astro y TypeScript para iterar el sitio de Santander Live a partir del mockup de escritorio de tres páginas.

## Desarrollo

Requiere Node.js 22.12 o posterior y npm 9.6.5 o posterior.

```bash
npm ci
npm run dev
```

La vista local abre en `http://localhost:4321`. Para validar antes de integrar cambios:

```bash
npm run check
npm run build
```

## Estructura

- `src/pages/index.astro`: inicio, beneficios, LBS+, oferta educativa y formulario visual.
- `src/pages/nosotros.astro`: hero institucional y acordeón.
- `src/pages/[nivel]/[slug].astro`: plantilla compartida de licenciaturas y posgrados con pestañas.
- `src/data/site.ts`: contenido y catálogo de programas. Arquitectura toma su texto del PDF; los demás nombres de licenciatura aparecen en el mockup. No se añadieron nombres de posgrados sin fuente.
- `src/components/ParallaxHero.astro`: hero fijo bajo el contenido, siguiendo el efecto usado en UADVirtual.
- `src/components/Header.astro`: navegación adaptable con megamenú para licenciaturas y posgrados.
- `reference/mockup-escritorio.pdf`: copia del PDF comprimido proporcionado para comparar las siguientes iteraciones.

Las fotografías de `src/assets/` se extrajeron del PDF original de 18 MB compartido junto al comprimido y se convirtieron a WebP. Astro genera tamaños optimizados al compilar. Los logos y los iconos actuales son marcadores de posición en texto/CSS; se sustituirán por los SVG finales.

## Pendiente para la siguiente iteración

1. Integrar logos, iconos y enlaces oficiales de ingreso y redes sociales.
2. Confirmar oferta de posgrados, textos de todos los programas, planes de estudio, perfiles de egreso y contenido de los cuatro apartados de Nosotros.
3. Conectar el formulario a un destino real y agregar el aviso de privacidad. El botón está deshabilitado hasta contar con ese destino.
4. Ajustar el diseño con las medidas, tipografía y recursos finales; el PDF solo muestra escritorio, así que la composición móvil actual es una propuesta inicial.

El repositorio no tiene remoto ni despliegue configurados. El dominio final puede añadirse en `astro.config.mjs` para generar metadatos canónicos y sitemap más adelante.
