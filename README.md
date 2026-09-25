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

- `src/pages/index.astro`: inicio, beneficios, LBS+ y oferta educativa.
- `src/pages/nosotros.astro`: hero institucional y acordeón con la animación de UADVirtual.
- `src/pages/[nivel]/[slug].astro`: plantilla compartida de licenciaturas y posgrados con pestañas.
- `src/data/site.ts`: contenido y catálogo de programas. Arquitectura toma su texto del PDF; los demás nombres de licenciatura aparecen en el mockup. Los nombres de maestrías y doctorados se tomaron del catálogo local de UADVirtual para reproducir su megamenú; su disponibilidad en Santander Live sigue pendiente de confirmar.
- `src/components/ParallaxHero.astro`: hero fijo bajo el contenido, siguiendo el efecto usado en UADVirtual.
- `src/components/Header.astro`: adaptación directa del nav de UADVirtual, conservando estilos, transición del header y paneles, apertura por hover y clic, ocultamiento al bajar, reaparición al subir y submenús móviles animados.
- `src/components/ContactForm.astro`: formulario visual con los campos, foco y botón del sistema de UADVirtual.
- `src/styles/global.css`: colores y escala tipográfica de UADVirtual. El azul de LBS+ permanece como acento de esa sección; la composición general sigue el PDF de Santander Live.
- `reference/mockup-escritorio.pdf`: copia del PDF comprimido proporcionado para comparar las siguientes iteraciones.

Las fotografías de `src/assets/` se extrajeron del PDF original de 18 MB compartido junto al comprimido y se convirtieron a WebP. Astro genera tamaños optimizados al compilar. Los logos y los iconos actuales son marcadores de posición en texto/CSS; se sustituirán por los SVG finales.

## Pendiente para la siguiente iteración

1. Integrar logos, iconos y enlaces oficiales de ingreso y redes sociales.
2. Confirmar qué posgrados de UADVirtual forman parte de Santander Live, además de los textos de programas, planes de estudio, perfiles de egreso y contenido de los cuatro apartados de Nosotros.
3. Conectar el formulario a un destino real y agregar el aviso de privacidad. El botón está deshabilitado hasta contar con ese destino.
4. Ajustar el diseño con las medidas, tipografía y recursos finales; el PDF solo muestra escritorio, así que la composición móvil actual es una propuesta inicial.

El repositorio no tiene remoto ni despliegue configurados. El dominio final puede añadirse en `astro.config.mjs` para generar metadatos canónicos y sitemap más adelante.
