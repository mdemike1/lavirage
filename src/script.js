(function(){
  const LANG = ['ca','en'].includes(document.documentElement.lang) ? document.documentElement.lang : 'es';

  /* Selector ES / CA / EN: recuerda la elección un año (la lee middleware.js) */
  document.querySelectorAll('.idioma a[data-lang]').forEach(a=>{
    a.addEventListener('click', ()=>{
      document.cookie = `lang=${a.dataset.lang}; max-age=31536000; path=/; SameSite=Lax` + (location.protocol === 'https:' ? '; Secure' : '');
    });
  });

  /* Contacto: ?tipo=organizador|marca (también ?tipus= y ?type=) marca el tipo y pone asunto al correo */
  const ASUNTOS = {
    es: {organizador: 'Organizo un evento', marca: 'Soy una marca'},
    ca: {organizador: 'Organitzo un esdeveniment', marca: 'Soc una marca'},
    en: {organizador: 'I run an event', marca: "I'm a brand"}
  }[LANG];
  const ALIAS = {
    organiser:'organizador', organizer:'organizador', brand:'marca',
    organitzador:'organizador',
  };
  const params = new URLSearchParams(location.search);
  let tipo = params.get('tipus') || params.get('tipo') || params.get('type');
  tipo = ALIAS[tipo] || tipo;
  if (tipo && ASUNTOS[tipo]){
    const li = document.querySelector(`.tipos [data-tipo="${tipo}"]`);
    if (li) li.classList.add('activo');
    document.querySelectorAll('a[data-mailto]').forEach(a=>{
      a.href = a.href.split('?')[0] + '?subject=' + encodeURIComponent(ASUNTOS[tipo]);
    });
  }
})();

/* Vídeos de portada: parados si el usuario pide menos movimiento */
(function(){
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.portada-video video').forEach(v=>{ v.removeAttribute('autoplay'); v.pause(); });
})();
