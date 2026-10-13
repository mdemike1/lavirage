(function(){
  const LANG = ['ca','en'].includes(document.documentElement.lang) ? document.documentElement.lang : 'es';

  /* Selector ES / CA / EN: recuerda la elección un año (la lee middleware.js) */
  document.querySelectorAll('.idioma a[data-lang]').forEach(a=>{
    a.addEventListener('click', ()=>{
      document.cookie = `lang=${a.dataset.lang}; max-age=31536000; path=/; SameSite=Lax` + (location.protocol === 'https:' ? '; Secure' : '');
    });
  });

  /* Contacto: ?tipo=organizador|piloto|marca|privado (también ?tipus= y ?type=) marca el tipo y pone asunto al correo */
  const ASUNTOS = {
    es: {organizador: 'Organizo un evento', piloto: 'Soy piloto o equipo', marca: 'Soy una marca', privado: 'Quiero una velada privada'},
    ca: {organizador: 'Organitzo un esdeveniment', piloto: 'Soc pilot o equip', marca: 'Soc una marca', privado: 'Vull una vetllada particular'},
    en: {organizador: 'I run an event', piloto: "I'm a driver or a team", marca: "I'm a brand", privado: "I'd like a private evening"}
  }[LANG];
  const ALIAS = {
    organiser:'organizador', organizer:'organizador', driver:'piloto', team:'piloto', brand:'marca', private:'privado',
    organitzador:'organizador', pilot:'piloto', equip:'piloto', particular:'privado'
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
