// Lee todo lo que edita el panel (carpeta contenido/) y lo prepara para las plantillas.
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve('contenido');
const IDIOMAS = ['es', 'ca', 'en'];
const URL_BASE = 'https://www.lavirageclub.com';

const leer = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const jsons = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => ({ f, d: leer(path.join(dir, f)) })) : []);

// "/" → index.html · "/ca" → ca/index.html · "/derechos" → derechos.html
function salida(ruta) {
  const r = '/' + String(ruta || '').replace(/^\/+|\/+$/g, '');
  if (r === '/') return 'index.html';
  if (IDIOMAS.includes(r.slice(1))) return r.slice(1) + '/index.html';
  return r.slice(1) + '.html';
}
const normal = (ruta) => '/' + String(ruta || '').replace(/^\/+|\/+$/g, '');

export default function () {
  const ajustes = Object.fromEntries(IDIOMAS.map((l) => [l, leer(path.join(RAIZ, 'ajustes', l + '.json'))]));

  const noticias = jsons(path.join(RAIZ, 'noticias'))
    .map(({ f, d }) => {
      const slug = f.replace(/\.json$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
      const idioma = IDIOMAS.includes(d.idioma) ? d.idioma : 'es';
      const ruta = normal(ajustes[idioma].ruta_noticias) + '/' + slug;
      return { ...d, idioma, slug, ruta, salida: salida(ruta) };
    })
    .filter((n) => n.publicada !== false)
    .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));

  const paginas = [];
  for (const l of IDIOMAS) {
    for (const { d } of jsons(path.join(RAIZ, 'paginas', l))) {
      if (d.publicada === false) continue;
      paginas.push({ ...d, idioma: l, ruta: normal(d.ruta), salida: salida(d.ruta) });
    }
  }

  // Archivo de noticias por idioma, solo si hay noticias en ese idioma
  const archivos = IDIOMAS.filter((l) => noticias.some((n) => n.idioma === l)).map((l) => ({
    idioma: l,
    ruta: normal(ajustes[l].ruta_noticias),
    salida: salida(ajustes[l].ruta_noticias),
  }));

  const menu = Object.fromEntries(IDIOMAS.map((l) => {
    const items = paginas.filter((p) => p.idioma === l && p.en_menu).sort((a, b) => (a.orden_menu || 0) - (b.orden_menu || 0))
      .map((p) => ({ texto: p.texto_menu, ruta: p.ruta }));
    if (archivos.some((a) => a.idioma === l)) items.push({ texto: ajustes[l].titulo_noticias, ruta: normal(ajustes[l].ruta_noticias) });
    return [l, items];
  }));
  const pie = Object.fromEntries(IDIOMAS.map((l) => [l, paginas.filter((p) => p.idioma === l && p.texto_menu)
    .sort((a, b) => (a.orden_menu || 0) - (b.orden_menu || 0)).map((p) => ({ texto: p.texto_menu, ruta: p.ruta }))]));

  // Equivalentes en otros idiomas (por "clave")
  const inicio = Object.fromEntries(IDIOMAS.map((l) => [l, (paginas.find((p) => p.idioma === l && p.clave === 'inicio') || { ruta: l === 'es' ? '/' : '/' + l }).ruta]));
  for (const p of paginas) {
    p.alternas = IDIOMAS.map((l) => {
      const otra = paginas.find((q) => q.idioma === l && q.clave && q.clave === p.clave);
      return { idioma: l, ruta: otra ? otra.ruta : inicio[l], existe: !!otra };
    });
  }

  // Noticias y archivos: el selector de idioma lleva a la portada de cada idioma
  for (const x of [...noticias, ...archivos]) {
    x.alternas = IDIOMAS.map((l) => ({ idioma: l, ruta: l === x.idioma ? x.ruta : inicio[l], existe: l === x.idioma }));
  }

  return { anio: new Date().getFullYear(), URL_BASE, IDIOMAS, ajustes, paginas, noticias, archivos, menu, pie, inicio };
}
