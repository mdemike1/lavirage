(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reveals */
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.14});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));

  /* ── contacto: ?tipo=organizador|piloto|marca|privado|vidreres ── */
  const ASUNTOS = {
    organizador: 'Organizo un evento',
    piloto: 'Soy piloto o equipo',
    marca: 'Soy una marca',
    privado: 'Quiero una velada privada',
    vidreres: 'Quiero estar en Vidreres'
  };
  const tipo = new URLSearchParams(location.search).get('tipo');
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
      estado.textContent = 'Enviando…';
      try {
        const r = await fetch(form.action, {method:'POST', body:new FormData(form), headers:{Accept:'application/json'}});
        if (!r.ok) throw new Error(r.status);
        form.reset();
        estado.classList.add('ok');
        estado.textContent = 'Recibido. Te contestamos en 24 horas laborables.';
      } catch {
        estado.classList.add('error');
        estado.textContent = 'No se ha podido enviar. Escríbenos a hola@lavirageclub.com.';
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