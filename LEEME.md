# La Virage Club — web

Sitio estático de tres páginas. Sin dependencias ni build: se sube tal cual.

## Estructura

```
index.html      Home — hero con CTA, manifiesto, capacidades, teaser de servicios,
                los tres encargos, el formato, galería, CTA
servicios.html  Qué hacemos, para quién, la noche hora a hora, qué incluye
                un encargo, principios
contacto.html   Formulario + datos de contacto
styles.css      Todos los estilos (compartido por las tres páginas)
script.js       Reveals, deriva de la galería, interludio, tilt (compartido)
vercel.json     URLs limpias + redirección del .com al .club
assets/         og.jpg (imagen al compartir) y las fotos cuando las tengas
```

## Antes de publicar

1. **Formulario de contacto.** En `contacto.html`, línea del `<form>`, sustituir
   `TU_ID_AQUI` por tu ID de Formspree (formspree.io — gratis, 50 envíos/mes).
   Mientras tanto el formulario no envía; los enlaces de correo sí funcionan.
2. **Correo.** Configurar `hola@lavirage.club` como redirección al Gmail
   personal (ImprovMX o el propio registrador). Es el único correo del sitio.
3. **Redes.** Los enlaces apuntan a Instagram (@mdemike__) y YouTube (@mdemikee).
4. **Imagen para compartir.** Añadir `assets/og.jpg` (1200 × 630 px). Sin ella,
   al pegar el enlace en WhatsApp o Instagram no sale previsualización.

## Despliegue en Vercel

- Subir la carpeta a un repo de GitHub y conectar el repo a Vercel, o
  arrastrar la carpeta en vercel.com/new.
- El sitio vive en https://lavirage.vercel.app/ (dominio de Vercel).
- Si algún día se compra un dominio propio: proyecto → Settings → Domains,
  añadirlo como principal y actualizar los `canonical`, `og:url` y las
  redirecciones de `vercel.json`.
- Gracias a `cleanUrls`, las rutas son `/servicios` y `/contacto` sin `.html`.

## Cuando lleguen las fotos

Los bloques `.poster`, `.pola` y `.foto` son degradados CSS pensados para
sustituirse por `<img>`. Meter las imágenes en `assets/` y reemplazar el
contenido de esos divs. La galería de la home es la primera que hay que llenar.
