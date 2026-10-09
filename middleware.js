// Vercel Routing Middleware (sin Next.js): elige idioma al entrar en una página en castellano.
//
// Prioridad:
// 1. Cookie `lang` (la pone el selector ES / CA / EN): se respeta siempre.
//    lang=ca → /ca · lang=en → /en · lang=es → se queda.
// 2. Sin cookie: el primer idioma del navegador (Accept-Language, por orden y peso q)
//    que sea es, ca o en. Si es catalán → /ca, también fuera de España.
// 3. Sin cookie y país AD (Andorra) → /ca.
// 4. Sin cookie y país conocido distinto de ES y AD → /en.
// 5. En cualquier otro caso se queda en castellano.
// Bots y vistas previas de enlaces nunca se redirigen.
// Las páginas /ca y /en no pasan por aquí (matcher): nunca cambian de idioma solas.

const EQUIVALENTE = {
  ca: {
    '/': '/ca',
    '/derechos': '/ca/drets',
    '/servicios': '/ca/serveis',
    '/veladas': '/ca/vetllades',
    '/contacto': '/ca/contacte',
  },
  en: {
    '/': '/en',
    '/derechos': '/en/rights',
    '/servicios': '/en/services',
    '/veladas': '/en/evenings',
    '/contacto': '/en/contact',
  },
};

export const config = {
  matcher: ['/', '/derechos', '/servicios', '/veladas', '/contacto'],
};

const BOTS = /bot\b|bot\/|crawl|spider|slurp|googlebot|google-inspectiontool|bingbot|bingpreview|duckduckbot|baiduspider|yandex|applebot|facebookexternalhit|facebot|meta-externalagent|twitterbot|linkedinbot|slackbot|slack-imgproxy|telegrambot|whatsapp|discordbot|pinterest|embedly|skypeuripreview|redditbot|vkshare|lighthouse|headlesschrome/i;

const IDIOMAS = ['es', 'ca', 'en'];

function leerCookie(cabecera, nombre) {
  for (const parte of (cabecera || '').split(';')) {
    const [clave, ...valor] = parte.trim().split('=');
    if (clave === nombre) return valor.join('=');
  }
  return null;
}

// Primer idioma del navegador que sea es, ca o en, respetando q y, a igual q, el orden.
function idiomaNavegador(cabecera) {
  const opciones = (cabecera || '').split(',').map((trozo, orden) => {
    const [etiqueta, ...params] = trozo.trim().split(';');
    let q = 1;
    for (const p of params) {
      const [k, v] = p.trim().split('=');
      if (k === 'q') q = Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v);
    }
    return { idioma: etiqueta.trim().toLowerCase().split('-')[0], q, orden };
  });
  opciones.sort((a, b) => b.q - a.q || a.orden - b.orden);
  const primero = opciones.find(o => o.q > 0 && IDIOMAS.includes(o.idioma));
  return primero ? primero.idioma : null;
}

function redirige(url, idioma) {
  const destino = new URL(EQUIVALENTE[idioma][url.pathname], url);
  destino.search = url.search;
  return new Response(null, {
    status: 302,
    headers: {
      Location: destino.toString(),
      // depende de quién visita: que nadie la guarde en caché
      'Cache-Control': 'private, no-store',
    },
  });
}

export default function middleware(request) {
  const url = new URL(request.url);
  if (!(url.pathname in EQUIVALENTE.en)) return;

  const ua = request.headers.get('user-agent') || '';
  if (!ua || BOTS.test(ua)) return;

  const lang = leerCookie(request.headers.get('cookie'), 'lang');
  if (lang === 'es') return;
  if (lang === 'ca' || lang === 'en') return redirige(url, lang);

  if (idiomaNavegador(request.headers.get('accept-language')) === 'ca') return redirige(url, 'ca');

  const pais = (request.headers.get('x-vercel-ip-country') || '').toUpperCase();
  if (pais === 'AD') return redirige(url, 'ca');
  if (pais && pais !== 'ES') return redirige(url, 'en');
  // sin respuesta: la petición sigue y se sirve la página estática en castellano
}
