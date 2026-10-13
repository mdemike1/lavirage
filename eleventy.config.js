// Eleventy: monta la web a partir de los archivos de contenido/ (los que edita el panel).
// Cada archivo de contenido/paginas/<idioma>/ es una página; contenido/noticias/ son las noticias.
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ assets: 'assets' });
  eleventyConfig.addPassthroughCopy({ media: 'media' });
  eleventyConfig.addPassthroughCopy({ 'src/styles.css': 'styles.css', 'src/script.js': 'script.js', 'robots.txt': 'robots.txt' });
  eleventyConfig.addWatchTarget('contenido/');

  // Títulos: los saltos de línea se respetan y **así** se pinta en rojo.
  eleventyConfig.addFilter('titulo', (texto) => {
    if (!texto) return '';
    const esc = String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return esc.replace(/\*\*(.+?)\*\*/g, '<span class="acento">$1</span>').replace(/\n/g, '<br>');
  });
  eleventyConfig.addFilter('lineas', (texto) =>
    String(texto || '').split('\n').map((l) => l.trim()).filter(Boolean));
  eleventyConfig.addFilter('fecha', (iso, idioma) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString({ es: 'es-ES', ca: 'ca-ES', en: 'en-GB' }[idioma] || 'es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  });
  eleventyConfig.addFilter('dosCifras', (n) => String(n).padStart(2, '0'));
  eleventyConfig.addFilter('json', (v) => JSON.stringify(v));
  eleventyConfig.addFilter('deIdioma', (lista, idioma) => (lista || []).filter((x) => x.idioma === idioma));
  eleventyConfig.addFilter('primeros', (lista, n) => (lista || []).slice(0, Number(n) || 3));

  return {
    dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' },
    templateFormats: ['njk'],
    htmlTemplateEngine: 'njk',
  };
}
