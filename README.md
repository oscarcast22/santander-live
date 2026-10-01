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
- `src/content.config.ts`: colecciones nativas de Astro con esquema validado para programas y el modelo educativo compartido.
- `src/content/programas/`: una ficha Markdown por programa, con información transcrita de Santander Live, plan agrupado por periodo y su imagen local de hero optimizada por Astro.
- `src/content/modelos/`: texto común del modelo educativo, compartido por todas las fichas.
- `src/data/site.ts`: conserva únicamente la introducción institucional de Nosotros.
- `src/components/ParallaxHero.astro`: hero fijo bajo el contenido, siguiendo el efecto usado en UADVirtual.
- `src/components/Header.astro`: adaptación directa del nav de UADVirtual, conservando estilos, transición del header y paneles, apertura por hover y clic, ocultamiento al bajar, reaparición al subir y submenús móviles animados.
- `src/components/ContactForm.astro`: formulario conectado a Netlify Forms con estados de envío, error y confirmación animada.
- `src/styles/global.css`: colores y escala tipográfica de UADVirtual. El azul de LBS+ permanece como acento de esa sección; la composición general sigue el PDF de Santander Live.
- `reference/mockup-escritorio.pdf`: copia del PDF comprimido proporcionado para comparar las siguientes iteraciones.

Las fotografías de `src/assets/` se extrajeron del PDF original de 18 MB compartido junto al comprimido y se convirtieron a WebP. El logotipo combinado se extrajo del mockup de escritorio como PNG transparente; Astro genera tamaños optimizados al compilar. Los iconos de beneficios y redes se dibujan como SVG inline. Los iconos sociales son decorativos hasta que se confirmen sus destinos.

## Pendiente para la siguiente iteración

1. Integrar logos, iconos y enlaces oficiales de ingreso y redes sociales.
2. Confirmar los textos de los cuatro apartados de Nosotros y completar los enlaces institucionales finales.
3. Configurar las notificaciones de Netlify Forms y completar el aviso de privacidad.
4. Ajustar el diseño con las medidas, tipografía y recursos finales; el PDF solo muestra escritorio, así que la composición móvil actual es una propuesta inicial.

El repositorio no tiene remoto ni despliegue configurados. El dominio final puede añadirse en `astro.config.mjs` para generar metadatos canónicos y sitemap más adelante.

## Formulario en Netlify

El formulario estático `contacto` se envía por POST a `/` sin recargar la página. Incluye `form-name`, consentimiento y un honeypot. El select HTML es la fuente de los datos tanto en escritorio como en dispositivos táctiles.

Antes de desplegar, activa **Forms → Enable form detection** en Netlify. Después del despliegue, comprueba que aparece `contacto` y configura el destinatario en las notificaciones del formulario. No requiere PHP, SMTP ni credenciales en el repositorio.

Astro dev y preview no procesan Netlify Forms: las pruebas locales deben simular las respuestas HTTP. Verifica la recepción de una solicitud y la notificación por correo en Netlify después de publicar. Sin JavaScript se utiliza el POST nativo y la confirmación predeterminada de Netlify.
