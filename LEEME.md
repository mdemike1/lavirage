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
styles.css        Todos los estilos (compartido)
script.js         Reveals, interludio, deriva, tilt, ?tipo= en contacto, envío del formulario
middleware.js     Idioma por cookie, navegador y país (302 a /ca o /en)
ca/               Versión en catalán
en/               Versión en inglés
vercel.json       URLs limpias + 301 del dominio de Vercel y del apex a www
robots.txt        Permite todo y apunta al sitemap
sitemap.xml       Páginas indexables
assets/           og.jpg (es), og-ca.jpg (ca), og-en.jpg (en), iconos y, más adelante, las fotos
scripts/          Generador de og.jpg e iconos (no se publica, ver .vercelignore)
```

Nav, footer y `<head>` se repiten en cada página: si se cambia uno, hay que cambiarlo en todas.

## Idiomas

- Castellano en la raíz; catalán en `/ca` (`/ca`, `/ca/drets`, `/ca/serveis`, `/ca/vetllades`,
  `/ca/contacte`); inglés en `/en` (`/en`, `/en/rights`, `/en/services`, `/en/evenings`, `/en/contact`).
  Cada página existe tres veces: si se cambia el texto de una, hay que cambiar sus equivalentes.
- `middleware.js` (Vercel Routing Middleware) decide el idioma al entrar en una página en castellano:
  cookie `lang` → navegador en catalán (Accept-Language) → país AD → país distinto de ES (inglés)
  → castellano. No toca `/ca` ni `/en`, ni a bots. El selector ES / CA / EN guarda la cookie `lang` un año.
- hreflang es / ca / en / x-default (→ castellano) en cada página y en `sitemap.xml`.
- El claim va traducido: «Más curvas. Menos tribuna.» (castellano), «Més revolts. Menys tribuna.» (`/ca`)
  y «More bends. Less grandstand.» (`/en`), cada uno con su imagen para compartir.
- El selector de idioma va en el nav; por debajo de 360 px pasa al pie.

## Pendientes

1. **Legales.** Aviso legal y política de privacidad están en la rama `legales`, retirados hasta
   tener los datos del titular. Al completarlos, volver a enlazarlos en el pie y en el sitemap.
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
