# Logos SVG

Agregar aquí los lockups oficiales de Santander Live y UAD como SVG, con fondo
transparente y vectores (sin imágenes raster incrustadas):

- `santander-live-light.svg`: versión clara para fondos oscuros.
- `santander-live-dark.svg`: versión oscura para fondos claros.

`BrandLogo.astro` detecta estos nombres automáticamente y mantiene el tamaño
según su contexto (encabezado, pie de página o hero). Si la identidad solo tiene
una versión a color, solicitar además sus variantes clara y oscura para los
fondos de la página.
