(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reveals */
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.14});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));

  const LANG = ['ca','en'].includes(document.documentElement.lang) ? document.documentElement.lang : 'es';
  const T = (es, ca, en) => ({es, ca, en})[LANG];

  /* ── selector ES / CA / EN: recuerda la elección un año (la lee middleware.js) ── */
  document.querySelectorAll('.idioma a[data-lang]').forEach(a=>{
    a.addEventListener('click', ()=>{
      document.cookie = `lang=${a.dataset.lang}; max-age=31536000; path=/; SameSite=Lax` + (location.protocol === 'https:' ? '; Secure' : '');
    });
  });

  /* ── contacto: ?tipo=organizador|piloto|marca|privado
        (también ?tipus=organitzador|pilot|marca|particular y ?type=organiser|driver|brand|private) ── */
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
    const sel = document.getElementById('tipo');
    if (sel && sel.querySelector(`option[value="${tipo}"]`)) sel.value = tipo;
    document.querySelectorAll('a[data-mailto]').forEach(a=>{
      a.href = 'mailto:hola@lavirageclub.com?subject=' + encodeURIComponent(ASUNTOS[tipo]);
    });
  }

  /* ── formulario (Formspree): envío sin salir de la página ── */
  const form = document.querySelector('form[data-formspree]');
  if (form){
    const estado = form.querySelector('.form-estado');
    form.addEventListener('submit', async e=>{
      e.preventDefault();
      const boton = form.querySelector('button[type="submit"]');
      boton.disabled = true;
      estado.className = 'form-estado';
      estado.textContent = T('Enviando…', 'Enviant…', 'Sending…');
      try {
        const r = await fetch(form.action, {method:'POST', body:new FormData(form), headers:{Accept:'application/json'}});
        if (!r.ok) throw new Error(r.status);
        form.reset();
        estado.classList.add('ok');
        estado.textContent = T('Recibido. Te contestamos en 48 horas laborables.', 'Rebut. Et responem en 48 hores laborables.', 'Got it. We reply within 48 working hours.');
      } catch {
        estado.classList.add('error');
        estado.textContent = T('No se ha podido enviar. Escríbenos a hola@lavirageclub.com.', "No s'ha pogut enviar. Escriu-nos a hola@lavirageclub.com.", "It didn't go through. Write to us at hola@lavirageclub.com.");
      } finally {
        boton.disabled = false;
      }
    });
  }

  if (reduce) return;   // a partir de aquí, solo efectos de movimiento

  /* ── interludio: la frase se enciende palabra a palabra ── */
  const inter = document.getElementById('interludio');
  const palabras = inter ? [...inter.querySelectorAll('.w')] : [];
  const mini = document.getElementById('frase-mini');

  /* ── deriva horizontal de la galería ── */
  const drift = document.getElementById('drift');

  /* ── parallax de numerales fantasma ── */
  const ghosts = [...document.querySelectorAll('.ghost')];

  function onScroll(){
    /* interludio */
    if (inter && palabras.length){
      const r = inter.getBoundingClientRect();
      const total = r.height - innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      const enc = Math.floor(p * (palabras.length + 1));
      palabras.forEach((w,i)=> w.classList.toggle('on', i < enc));
      if (mini) mini.classList.toggle('on', p > .92);
    }
    /* deriva */
    if (drift){
      const r = drift.getBoundingClientRect();
      const total = innerHeight + r.height;
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / total));
      const max = Math.max(0, drift.scrollWidth - innerWidth + 120);
      drift.style.transform = `translateX(${(-p * max).toFixed(1)}px)`;
    }
    /* ghosts */
    ghosts.forEach(g=>{
      const r = g.getBoundingClientRect();
      const off = (r.top + r.height/2 - innerHeight/2) * .1;
      g.style.transform = `translateY(${off.toFixed(1)}px)`;
    });
  }
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', onScroll);
  onScroll();

  /* ── tilt 3D suave en los posters (solo desktop) ── */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.tilt').forEach(card=>{
      card.addEventListener('pointermove', e=>{
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5;
        const py = (e.clientY - r.top) / r.height - .5;
        card.style.setProperty('--ry', (px * 7).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (-py * 7).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', ()=>{
        card.style.setProperty('--ry','0deg');
        card.style.setProperty('--rx','0deg');
      });
    });
  }
})();