// Vercel Routing Middleware (sin Next.js): elige idioma al entrar en una página en español.
//
// 1. Cookie `lang` (la pone el selector ES / EN): se respeta siempre.
//    lang=en → 302 a la página equivalente en /en; lang=es → se queda.
// 2. Sin cookie: si el país (x-vercel-ip-country) existe y no es ES → 302 a /en.
//    País ES o desconocido → se queda en español.
// 3. Bots y vistas previas de enlaces nunca se redirigen.
// Las páginas /en no pasan por aquí (matcher): nunca se mandan al español por país.

const EQUIVALENTE_EN = {
  '/': '/en',
  '/derechos': '/en/rights',
  '/servicios': '/en/services',
  '/veladas': '/en/evenings',
  '/contacto': '/en/contact',
};

export const config = {
  matcher: ['/', '/derechos', '/servicios', '/veladas', '/contacto'],
};

const BOTS = /bot\b|bot\/|crawl|spider|slurp|googlebot|google-inspectiontool|bingbot|bingpreview|duckduckbot|baiduspider|yandex|applebot|facebookexternalhit|facebot|meta-externalagent|twitterbot|linkedinbot|slackbot|slack-imgproxy|telegrambot|whatsapp|discordbot|pinterest|embedly|skypeuripreview|redditbot|vkshare|lighthouse|headlesschrome/i;

function leerCookie(cabecera, nombre) {
  for (const parte of (cabecera || '').split(';')) {
    const [clave, ...valor] = parte.trim().split('=');
    if (clave === nombre) return valor.join('=');
  }
  return null;
}

function aIngles(url) {
  const destino = new URL(EQUIVALENTE_EN[url.pathname], url);
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
  if (!(url.pathname in EQUIVALENTE_EN)) return;

  const ua = request.headers.get('user-agent') || '';
  if (!ua || BOTS.test(ua)) return;

  const lang = leerCookie(request.headers.get('cookie'), 'lang');
  if (lang === 'es') return;
  if (lang === 'en') return aIngles(url);

  const pais = (request.headers.get('x-vercel-ip-country') || '').toUpperCase();
  if (pais && pais !== 'ES') return aIngles(url);
  // sin respuesta: la petición sigue y se sirve la página estática en español
}
