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
- `src/data/site.ts`: centraliza la identidad institucional, dirección, teléfonos, dominio y redes confirmadas.
- `src/components/ParallaxHero.astro`: hero fijo bajo el contenido, siguiendo el efecto usado en UADVirtual.
- `src/components/Header.astro`: adaptación directa del nav de UADVirtual, conservando estilos, transición del header y paneles, apertura por hover y clic, ocultamiento al bajar, reaparición al subir y submenús móviles animados.
- `src/components/ContactForm.astro`: formulario conectado a Netlify Forms con estados de envío, error y confirmación animada.
- `src/styles/global.css`: colores y escala tipográfica de UADVirtual. El azul de LBS+ permanece como acento de esa sección; la composición general sigue el PDF de Santander Live.
- `reference/mockup-escritorio.pdf`: copia del PDF comprimido proporcionado para comparar las siguientes iteraciones.

Las fotografías se optimizan con Astro. Los logos e iconos institucionales se extrajeron del PDF como SVG; el hero utiliza AVIF con respaldo WebP. Los enlaces confirmados de ingreso, Facebook, Instagram y WhatsApp están integrados.

## SEO y publicación

El dominio canónico es `https://santanderlive.uad.mx/`. Las 27 páginas públicas incluyen metadatos propios, imágenes sociales y JSON-LD. Astro genera sitemap y el archivo `robots.txt` lo referencia. La página de error se excluye del sitemap y utiliza `noindex`.

Después del build, ejecutar `npm run check:seo` para comprobar el HTML generado, enlaces, datos estructurados, imágenes sociales y mapa de redirecciones. El inventario de URLs antiguas está en [reference/seo/redirects.csv](reference/seo/redirects.csv); las redirecciones no se activan hasta elegir alojamiento.

Consultar [las instrucciones de publicación](reference/seo/publicacion.md) para HTTPS, códigos 301/404/410, previews, caché, preservación de `/plataforma/`, validación de resultados enriquecidos y seguimiento en Search Console. El catálogo conserva la información del sitio anterior y las notas editoriales pendientes de validación institucional.

## Formulario en Netlify

El formulario estático `contacto` se envía por POST a `/` sin recargar la página. Incluye `form-name`, consentimiento y un honeypot. El select HTML es la fuente de los datos tanto en escritorio como en dispositivos táctiles.

Antes de desplegar, activa **Forms → Enable form detection** en Netlify. Después del despliegue, comprueba que aparece `contacto` y configura el destinatario en las notificaciones del formulario. No requiere PHP, SMTP ni credenciales en el repositorio.

Astro dev y preview no procesan Netlify Forms: las pruebas locales deben simular las respuestas HTTP. Verifica la recepción de una solicitud y la notificación por correo en Netlify después de publicar. Sin JavaScript se utiliza el POST nativo y la confirmación predeterminada de Netlify.
