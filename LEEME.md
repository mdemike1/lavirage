# La Virage Club — web

Web en tres idiomas (castellano, catalán, inglés) que se edita desde un panel, sin tocar código.
Dominio principal: https://www.lavirageclub.com

## Cómo se edita: el panel

1. Entra en https://app.pagescms.org con tu cuenta de GitHub.
2. Abre el repositorio `mdemike1/lavirage` (rama `main`).
3. En la barra lateral tienes:
   - **Páginas · Castellano / Català / English**: cada página, con sus secciones. Puedes cambiar textos,
     subir fotos, añadir, quitar y reordenar secciones, y crear páginas nuevas.
   - **Noticias**: entradas con fecha, foto y texto. La sección «Actualidad» y su enlace en el menú
     aparecen solos cuando hay al menos una noticia publicada en ese idioma.
   - **Ajustes generales**: correo, Instagram, claim y textos comunes de cada idioma.
   - **Fotos**: la biblioteca de imágenes (se guardan en `media/fotos`).
4. Al **Guardar**, el panel hace un commit en GitHub y Vercel publica la web sola en uno o dos minutos.

Trucos de los títulos: un salto de línea en el campo es un salto en la web, y `**así**` se pinta en rojo.

Para dar acceso a alguien (Dani): invítalo como colaborador del repositorio en GitHub; con eso ya entra al panel.

### Antes de subir fotos

- JPG, de 2000 px de lado largo como mucho y menos de 1 MB. Las fotos pesadas ralentizan la web y llenan el repo.
- Rellena siempre la descripción de la foto (para accesibilidad y Google).
- Nada de fotos de stock ni generadas: solo fotos reales de La Virage.

### Una página en tres idiomas

Cada página existe una vez por idioma. La **clave interna** (inicio, derechos, servicios…) las une: tiene que ser
igual en los tres para que el selector ES / CA / EN y Google sepan que son la misma página.
Si creas una página nueva, créala en los tres idiomas con la misma clave (o el selector llevará a la portada de ese idioma).

## Cómo está hecho

```
contenido/paginas/<es|ca|en>/*.json   Lo que edita el panel: cada archivo es una página
contenido/noticias/*.json             Noticias
contenido/ajustes/<idioma>.json       Ajustes por idioma
media/                                Fotos y documentos subidos desde el panel
src/                                  Plantillas (Eleventy), styles.css y script.js
  _includes/secciones.njk             Cómo se pinta cada tipo de sección
  _data/sitio.js                      Lee contenido/ y monta menú, idiomas y noticias
.pages.yml                            Configuración del panel (qué campos tiene cada sección)
middleware.js                         Idioma por cookie, navegador y país (302 a /ca o /en)
vercel.json                           Build (npm run build → _site) + 301 del dominio de Vercel y del apex a www
assets/                               Favicon, iconos e imágenes para compartir
scripts/                              Generador de og.jpg e iconos (no se publica)
```

Para probarla en local: `npm install` y `npm run dev` (abre http://localhost:8080).

Para añadir un tipo de sección nuevo: plantilla en `src/_includes/secciones.njk`, estilos en `src/styles.css`
y campos en `.pages.yml`.

## Pendientes

1. **Correo.** `hola@lavirageclub.com` tiene que recibir correo (MX en el dominio, por ejemplo con ImprovMX).
2. **Legales.** Aviso legal y privacidad en la rama `legales`, retirados hasta tener los datos del titular.
   Cuando estén, enlazarlos desde Ajustes generales → «Enlaces legales en el pie».
3. **Formulario de contacto.** Desactivado hasta tener Formspree y la política de privacidad publicada.
4. **Analítica.** Activar Web Analytics en el proyecto de Vercel.
5. **Fotos.** La portada de inicio muestra un panel negro con el claim hasta que se suba la foto real.
