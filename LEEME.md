# La Virage Club — web

Sitio estático. Sin dependencias ni build: se sube tal cual.
Dominio principal: https://www.lavirageclub.com

## Estructura

```
index.html        Home: qué hacemos, para quién, cómo trabajamos, manifiesto, CTA
derechos.html     Comercialización de derechos y cómo cobramos (a éxito)
servicios.html    Eventos por encargo, activaciones, servicios a clubes y organizadores
veladas.html      La línea de eventos: manifiesto, la noche hora a hora, principios
contacto.html     Qué contarnos por tipo de cliente + correo (formulario desactivado)
aviso-legal.html  Borrador: faltan los datos [PENDIENTE] del titular
privacidad.html   Borrador: faltan los datos [PENDIENTE] del titular
styles.css        Todos los estilos (compartido)
script.js         Reveals, interludio, deriva, tilt, ?tipo= en contacto, envío del formulario
vercel.json       URLs limpias + 301 del dominio de Vercel y del apex a www
robots.txt        Permite todo y apunta al sitemap
sitemap.xml       Páginas indexables
assets/           og.jpg, iconos y, más adelante, las fotos
scripts/          Generador de og.jpg e iconos (no se publica, ver .vercelignore)
```

Nav, footer y `<head>` se repiten en cada página: si se cambia uno, hay que cambiarlo en todas.

## Pendientes antes de publicar en `main`

1. **Legales.** Rellenar los `[PENDIENTE: …]` de `aviso-legal.html` y `privacidad.html`.
2. **Correo.** `hola@lavirageclub.com` tiene que recibir correo (MX en el dominio).
3. **Formulario.** En `contacto.html` hay un formulario comentado con un TODO: poner el ID
   de Formspree en el `action` y quitar el comentario.
4. **Analítica.** Activar Web Analytics en el proyecto de Vercel (Analytics → Enable).
5. **Instagram.** Confirmar que existe @lavirageclub.

## Imágenes de marca

`sh scripts/genera-imagenes.sh` regenera `assets/og.jpg`, `apple-touch-icon.png` y
`favicon-32.png` desde las plantillas `scripts/og.html` y `scripts/icono.html` (macOS + Chrome).

## Cuando lleguen las fotos

Los bloques `.poster`, `.pola` y `.foto` de `veladas.html` son degradados CSS pensados para
sustituirse por `<img>` con su `alt`. Nada de fotos de stock ni generadas.
