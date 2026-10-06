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
- `src/components/ContactForm.astro`: formulario conectado al endpoint PHP de contacto, con estados de envío, error y confirmación animada.
- `src/styles/global.css`: colores y escala tipográfica de UADVirtual. El azul de LBS+ permanece como acento de esa sección; la composición general sigue el PDF de Santander Live.
- `reference/mockup-escritorio.pdf`: copia del PDF comprimido proporcionado para comparar las siguientes iteraciones.

Las fotografías se optimizan con Astro. Los logos e iconos institucionales se extrajeron del PDF como SVG; el hero utiliza AVIF con respaldo WebP. Los enlaces confirmados de ingreso, Facebook, Instagram y WhatsApp están integrados.

## SEO y publicación

El sitio se aloja en cPanel (proveedor de hosting pendiente de confirmar) y el dominio canónico es `https://santanderlive.uad.mx/`. Las 27 páginas públicas incluyen metadatos propios, imágenes sociales y JSON-LD. Astro genera sitemap y el archivo `robots.txt` lo referencia. La página de error se excluye del sitemap y utiliza `noindex`.

Después del build, ejecutar `npm run check:seo` para comprobar el HTML generado, enlaces, datos estructurados, imágenes sociales y destinos del mapa de redirecciones. El inventario de URLs antiguas está en [reference/seo/redirects.csv](reference/seo/redirects.csv). `public/.htaccess` implementa sus 58 redirecciones 301 y cuatro retiradas 410, además de la redirección del sitemap anterior; se copia a `dist/.htaccess` y se activa al publicarlo en Apache.

Ejecutar `npm run check:redirects` después del build para probar los códigos y cabeceras `Location` reales con Apache local aislado. Requiere Python 3 y Apache 2.4 con los módulos `mpm_event`, `authz_core`, `dir`, `mime` y `rewrite`, disponibles en Ubuntu mediante `apache2`. Si los módulos están en otra ruta, definir `APACHE_MODULES_DIR`; el script usa `/etc/mime.types`. No modifica la configuración Apache del sistema, no consulta producción y reemplaza PHP por archivos de prueba para evitar ejecutar el formulario o enviar correos.

La prueba verifica todo el inventario con archivos de Muse todavía presentes, destinos accesibles, parámetros y el fragmento `#contacto`, inicio sin bucles, 404 para rutas desconocidas y una plataforma simulada con sus propias reglas y `index.php`. Astro dev y preview no procesan `.htaccess`.

Consultar [las instrucciones de publicación](reference/seo/publicacion.md) para HTTPS, códigos 301/404/410, previews, caché, preservación de `/plataforma/`, validación de resultados enriquecidos y seguimiento en Search Console. El catálogo conserva la información del sitio anterior y las notas editoriales pendientes de validación institucional.

## Formulario PHP en cPanel

El formulario `contacto` se envía por POST a `/api/contacto.php` sin recargar la página. El servidor valida nombre, teléfono, correo, programa y aceptación de privacidad. Incluye honeypot, tiempo mínimo de 1,8 segundos y un límite de cinco intentos por IP cada quince minutos. El select HTML es la fuente de los datos tanto en escritorio como en dispositivos táctiles.

El endpoint usa `mail()` y el transporte local configurado por el hosting. El remitente visible y el remitente SMTP son `formularios@santanderlive.uad.mx`; el destinatario de producción es `diseno.web@uad.mx` y el correo del aspirante se coloca en `Reply-To`. Se fija el remitente SMTP con el quinto argumento `-f` de `mail()` para evitar el remitente predeterminado `santanderlive@lobito.uad.mx`, que Gmail rechazó con `550 5.7.26` por fallos SPF y DKIM. El asunto identifica la solicitud como Santander Live y el cuerpo incluye sus datos y la aceptación del aviso. La implementación no usa credenciales SMTP. Las direcciones están definidas en `public/api/_bootstrap.php`.

El 5/10/2026 se verificó la corrección en el hosting real: Gmail recibió una prueba en tres segundos, con SPF PASS para la IP `189.197.190.225` y DMARC PASS. El SPF público de `santanderlive.uad.mx` contiene `a` y su registro A coincide con esa IP. El mensaje llegó a Spam y no contiene firma DKIM; no se ha identificado la causa exacta de esa clasificación. Sigue pendiente verificar la recepción en el destinatario institucional. DKIM requiere la clave pública en el DNS autoritativo on premise, al que esta sesión no tiene acceso; marcar un correo como «No es spam» solo ayuda al buzón correspondiente. La recepción de rebotes en la nueva dirección tampoco está verificada, pues los MX del subdominio apuntan a Google.

La API responde JSON `{ "ok": true }` al aceptar el envío, o `{ "ok": false, "message": "…" }` en errores. La interfaz solo muestra la confirmación si tanto el estado HTTP como `ok` indican éxito; conserva los campos al fallar. Los códigos son 405 para métodos distintos de POST, 403 para orígenes rechazados, 422 para datos inválidos, 429 para envíos demasiado rápidos o repetidos, y 500/503 para fallos del correo o del procesamiento. Las respuestas no se almacenan en caché.

Astro dev y preview no ejecutan PHP. Para probar la API localmente, servir `dist/` con PHP después del build y simular el transporte de `mail()` para evitar enviar correos reales. La API permite solicitudes sin `Origin` ni `Referer` para estas pruebas; los navegadores deben enviar desde `https://santanderlive.uad.mx`. Para probar la interfaz desde localhost, simular las respuestas del endpoint en el navegador. La experiencia de envío requiere JavaScript, que inicializa el tiempo del formulario y presenta la respuesta JSON.

## Publicación en cPanel

1. Ejecutar `npm run check`, `npm run build`, `npm run check:seo`, `npm run check:redirects`, `php -l public/api/contacto.php` y `php -l public/api/_bootstrap.php`.
2. En cPanel, confirmar PHP 8.1+ con `mbstring` para `api/`, SSL activo y permiso de escritura en el directorio temporal de PHP. Conservar el selector PHP 7.3 de `plataforma/.htaccess` para el Moodle 3.10.7+ existente; comprobar la versión efectiva por carpeta. Confirmar que el transporte de correo autorice `formularios@santanderlive.uad.mx` como remitente visible y SMTP y que su SPF autorice la IP de salida.
3. Identificar la raíz documental del subdominio `santanderlive.uad.mx` y respaldar el sitio actual. Subir ahí el contenido de `dist/`, con `index.html`, `.htaccess`, `_astro/` y `api/` directamente en esa raíz. Activar «Mostrar archivos ocultos» en File Manager para incluir `.htaccess`. No subir las fuentes ni `node_modules/`.
4. Conservar `/plataforma/`, sus recursos, `php.ini`, `cgi-bin/`, `.well-known/` si existe y las reglas del servidor; no vaciar toda la raíz documental. Se confirmó que el sitio Muse no tiene `.htaccess` en la raíz: publicar el archivo nuevo ahí y conservar cualquier `.htaccess` dentro de la plataforma. El archivo nuevo no cambia PHP, `DirectoryIndex`, HTTPS global, cabeceras ni caché. Si aparece un `.htaccess` de raíz antes de publicar, revisar e integrar sus reglas en lugar de sobrescribirlo.
5. Verificar `/amparo-maestrias.html` y `/phone/amparo-maestria.html`: deben devolver 301 hacia `https://santanderlive.uad.mx/posgrados/maestria-amparo/`, cuyo destino debe devolver 200. Revisar también contacto, inicio, las retiradas 410 y el sitemap. Confirmar que `/plataforma/`, su inicio de sesión y sus recursos mantienen su comportamiento.
6. Verificar el formulario en escritorio y móvil, los errores y una solicitud real. Comprobar recepción en `diseno.web@uad.mx`, spam y que responder al correo utilice la dirección del aspirante. Un resultado exitoso de `mail()` solo confirma que el relay aceptó el mensaje; no demuestra recepción en el buzón.

Publicar siempre `.htaccess`, `api/contacto.php` y `api/_bootstrap.php` junto con el sitio. Revisar los registros de errores PHP en cPanel si el endpoint devuelve un fallo; los detalles técnicos no se muestran al visitante. Si hay que revertir, restaurar los archivos afectados desde el respaldo y retirar el nuevo `.htaccess` si antes no existía, preservando `/plataforma/` y `php.ini`.

Para diagnosticar correo, subir temporalmente `diagnostico-correo.php` de la raíz del proyecto a `public_html/api/` y abrir esa URL. El archivo no se incluye en `dist/` ni en el paquete de publicación. No envía correos: informa la disponibilidad de `mail()`, consulta MX/SPF desde el hosting y lee únicamente el saludo SMTP de `localhost:25`. Que no exista SMTP local no descarta otro transporte de `mail()`. Retirar el archivo después del diagnóstico. Para verificar entrega, buscar la solicitud existente en cPanel → Correo electrónico → Rastrear entrega, filtrando por `diseno.web@uad.mx`, y revisar Resultado, host/IP de entrega y respuesta SMTP. No cambiar SPF, MX ni el proveedor de correo sin identificar el transporte real y el rechazo.
