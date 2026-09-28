# Iconos SVG del mockup

Agregar los iconos oficiales en las carpetas y con los nombres siguientes.
Cada archivo debe tener `viewBox`, fondo transparente y el color/trazo final que
usa el mockup, ya que se carga como imagen SVG externa.

Beneficios, en `benefits/`:

- `classroom.svg`
- `clock.svg`
- `book.svg`

Redes sociales, en `social/`:

- `facebook.svg`
- `instagram.svg`
- `x.svg`
- `tiktok.svg`
- `whatsapp.svg`

`SiteIcon.astro` los detecta automáticamente. Mientras falte alguno, muestra su
icono provisional para evitar imágenes rotas; al añadirlo, el siguiente build
usa el SVG del mockup.
