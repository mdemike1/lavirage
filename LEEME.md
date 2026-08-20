# La Virage Club — web

Sitio estático de tres páginas. Sin dependencias ni build: se sube tal cual.

## Estructura

```
index.html      Home — hero, manifiesto, teaser de servicios, el formato, galería, CTA
servicios.html  Qué hacemos, para quién, la noche hora a hora, principios
contacto.html   Formulario + datos de contacto
styles.css      Todos los estilos (compartido por las tres páginas)
script.js       Reveals, deriva de la galería, interludio, tilt (compartido)
vercel.json     URLs limpias + redirección del .com al .club
assets/         Aquí van las fotos cuando las tengas
```

## Antes de publicar

1. **Formulario de contacto.** En `contacto.html`, línea del `<form>`, sustituir
   `TU_ID_AQUI` por tu ID de Formspree (formspree.io — gratis, 50 envíos/mes).
   Mientras tanto el formulario no envía; los enlaces de correo sí funcionan.
2. **Correo.** Configurar `hola@lavirage.club` y `marcas@lavirage.club` como
   redirecciones al Gmail personal (ImprovMX o el propio registrador).
3. **Instagram.** Cuando exista @lavirageclub, los enlaces ya apuntan ahí.

## Despliegue en Vercel

- Subir la carpeta a un repo de GitHub y conectar el repo a Vercel, o
  arrastrar la carpeta en vercel.com/new.
- En el proyecto → Settings → Domains, añadir `lavirage.club` (principal)
  y `lavirageclub.com`. La redirección la aplica `vercel.json`.
- Gracias a `cleanUrls`, las rutas son `/servicios` y `/contacto` sin `.html`.

## Cuando lleguen las fotos

Los bloques `.poster`, `.pola` y `.foto` son degradados CSS pensados para
sustituirse por `<img>`. Meter las imágenes en `assets/` y reemplazar el
contenido de esos divs. La galería de la home es la primera que hay que llenar.
