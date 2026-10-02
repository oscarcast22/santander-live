# Publicación y seguimiento SEO

La versión pública utiliza **https://santanderlive.uad.mx/**, con rutas terminadas en `/`. El alojamiento aún no está definido. Estas instrucciones no activan cambios en producción.

## Validación del sitio generado

```sh
npm run check
npm run build
npm run check:seo
```

`check:seo` examina `dist/`: metadatos únicos, canonicals, H1, imágenes sociales, enlaces y fragmentos internos, JSON-LD, sitemap y destinos del inventario de redirecciones. Ejecutarlo después de cada build, sin añadir `dist/` al repositorio.

## Migración de URLs

`redirects.csv` conserva las rutas descubiertas en el inicio, navegación móvil, aviso, Nosotros, contacto y sitemap del sitio anterior, verificadas el 2 de octubre de 2026. Cada fila incluye el estado HTTP observado y la fuente. Un 404 actual puede seguir necesitando redirección por enlaces históricos.

- Activar las filas **301** en el servidor o CDN; llevar directamente al destino final HTTPS. No implementar estas redirecciones con JavaScript, meta refresh ni páginas HTML que devuelvan 200.
- Las cuatro filas **410** no tienen equivalente en el catálogo trasladado: Preguntas frecuentes y Doctorado en Valuación Inmobiliaria, con sus variantes móviles. Son recomendaciones de retirada; no redirigirlas a un programa distinto ni a inicio.
- El sitemap anterior utiliza `santandervirtual.uad.mx`. El inventario guarda sus rutas y fuentes, pero no presupone control de ese dominio. Si la UAD lo conserva, aplicar también allí las correspondencias conocidas.
- Normalizar HTTP a HTTPS y la variante de dominio alternativa, únicamente si DNS y certificado la permiten. Evitar cadenas combinando dominio y ruta en un único salto cuando sea posible.
- Normalizar rutas nuevas sin `/` a su versión con `/`, excepto archivos y `/plataforma/`.
- Mantener `/plataforma/` y sus recursos en el servidor actual o mediante un proxy de la UAD. No publicar una regla `/* → /index.html`: produciría falsos 200 y podría romper la plataforma.
- Conservar estas redirecciones al menos un año, preferiblemente mientras existan enlaces antiguos. Los fragmentos no se envían al servidor: el sitio nuevo conserva las anclas antiguas de oferta y niveles para los enlaces a `index.html#…`.
- Servir `404.html` como documento de error con **estado HTTP 404**, nunca como respuesta 200. La página tiene `noindex`.
- El sitemap anterior `/sitemap.xml` puede redirigirse con 301 a `/sitemap-index.xml`. Este último referencia `/sitemap-0.xml`, generado por Astro. Sustituir el archivo viejo; no conservarlo junto al nuevo.

Adaptar el CSV a reglas nativas del alojamiento elegido (Netlify, Apache, Nginx o CDN). Verificar los códigos con `curl -I`, cada destino sin cadenas, y los fragmentos de contacto en un navegador. No están activadas estas reglas en el repositorio.

## HTTPS, caché y entornos

- Activar TLS y compresión Brotli o Gzip para HTML, CSS, JavaScript, SVG, JSON y XML. No recomprimir AVIF, WebP, JPEG ni WOFF2.
- Para archivos con hash bajo `/_astro/`, usar `Cache-Control: public, max-age=31536000, immutable`. Conservar los recursos del despliegue anterior durante las transiciones y la propagación de caché.
- Para HTML, `robots.txt` y sitemaps, usar revalidación (`Cache-Control: no-cache`); no aplicarles caché inmutable.
- Las previews deben estar protegidas con autenticación o tener `X-Robots-Tag: noindex` en todas sus respuestas HTML. No bloquear su rastreo mediante robots.txt si se depende de que el buscador lea `noindex`. No trasladar esa cabecera a producción.
- El build contiene canonicals del dominio definitivo también en previews. No cambia su hostname según el navegador.
- Comprobar el formulario y `/plataforma/` después de publicar. El formulario actual requiere Netlify Forms o una integración equivalente; otro alojamiento no procesará esos POST por sí solo.

## Datos estructurados y rendimiento

El JSON-LD se produce en HTML: WebSite, CollegeOrUniversity, Brand y WebPage/AboutPage; catálogo ItemList en inicio, Course en cada programa y BreadcrumbList en páginas interiores. Los perfiles sociales son de la UAD; WhatsApp es un canal de contacto, no un perfil institucional `sameAs`. No se incluyen precios, acreditaciones, valoraciones, fechas, instancias ni duración de cursos.

Antes de publicar, pegar el HTML generado de inicio y una ficha de cada nivel en [Rich Results Test](https://search.google.com/test/rich-results) y revisar el grafo completo en [Schema Markup Validator](https://validator.schema.org/). Después de publicar, repetir las pruebas por URL. Que una entidad sea válida no garantiza que Google muestre resultados enriquecidos.

En la implementación se validaron por código inicio, Licenciatura en Psicología, Maestría en Finanzas y Doctorado en Educación en Schema Markup Validator: cero errores y advertencias. Rich Results Test solicitó iniciar sesión y no completó la prueba; su comprobación específica de elegibilidad queda pendiente. La validación local cubre todas las páginas.

Medir inicio y fichas en PageSpeed Insights móvil y escritorio. Los objetivos de campo son LCP < 2,5 s, INP < 200 ms y CLS < 0,1. Una medición local sirve para comparar cambios; no representa a los usuarios reales. Revisar la caché, compresión, TTFB y decodificación de AVIF antes de reducir la resolución o modificar las animaciones aprobadas.

Comparación local controlada, tres cargas nuevas por formato: viewport 390 × 844, DPR 2, red de 1,6 Mbps, latencia de 150 ms y CPU ×4. El hero AVIF pesó 125.941 bytes frente a 244.944 bytes de WebP, conservando dimensiones y encuadre. Mediana LCP: 3,05 s con AVIF y 3,90 s con WebP; CLS 0 en ambas variantes. El servidor de prueba no comprime los recursos textuales. El LCP aún necesita verificarse y optimizarse en el alojamiento definitivo; esta prueba no acredita Core Web Vitals de campo.

## Search Console después de publicar

1. Verificar acceso a la propiedad del dominio/subdominio existente. Al mantenerse el dominio, no solicitar un cambio de dirección.
2. Enviar `https://santanderlive.uad.mx/sitemap-index.xml` y retirar el sitemap antiguo de la propiedad cuando sea posible.
3. Inspeccionar inicio, Nosotros y una ficha por nivel: canonical declarado y elegido, rastreo permitido y respuesta 200.
4. Revisar cobertura, redirecciones, errores 404, páginas duplicadas y Core Web Vitals semanalmente durante el primer mes.
5. Comparar consultas, impresiones, clics y solicitudes de información con los datos anteriores. No se ha instalado analítica ni creado una propiedad de Search Console.

## Límites editoriales

Los metadatos resumen información existente; no sustituyen la validación académica. Se conserva la nota de origen del Doctorado en Materia Fiscal sobre el posible plan de Psicología en la fuente. También existen objetivos compartidos entre Finanzas/Impuestos, Nutrición Clínica/Deportiva y Alta Dirección/Doctorado en Administración. Sus descripciones SEO diferencian el nombre y nivel, sin inventar especializaciones para resolver esas coincidencias.

Las materias, fechas, becas, RVOE, precios y duración de posgrados requieren confirmación institucional antes de ampliarse. El horario nocturno y los tres años anunciados para licenciaturas no se extrapolan a posgrados.
