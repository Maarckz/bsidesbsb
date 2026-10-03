const tracks = [
  { key:'rabbit', name:'Coelho Branco', tag:'TRILHA 01', role:'KEYNOTE / TALK', accent:'#2dd7ff', bg:'url("assets/crops/city-skyline.jpg")', fig:'assets/crops/titlerabbit-hole.png', figPos:'50% 34%', figZoom:2.3, desc:'Keynotes e talks principais: as grandes ideias que abrem o evento e ficam ecoando na cabeça.', images:[1,2,3,4,5] },
  { key:'cheshire', name:'Gato de Cheshire', tag:'TRILHA 02', role:'RED TEAM / PENTEST', accent:'#ff28dc', bg:'url("assets/crops/cheshire.jpg")', fig:'assets/crops/cheshire.jpg', figPos:'center 30%', desc:'Segurança ofensiva: red team, exploração e pentest. As perguntas certas, feitas com um sorriso no escuro.', images:[6,7,8,9,10] },
  { key:'queen', name:'Rainha de Copas', tag:'TRILHA 03', role:'BLUE TEAM / IR', accent:'#71b9ff', bg:'url("assets/crops/queen.jpg")', fig:'assets/crops/queen.jpg', figPos:'center 25%', desc:'Defesa e resposta: blue team, forense e resposta a incidentes. Aqui não se corta cabeças: se cortam riscos.', images:[1,3,5,7,9] },
  { key:'hatter', name:'Chapeleiro', tag:'TRILHA 04', role:'WORKSHOP / LAB', accent:'#c17aff', bg:'url("assets/crops/hatter.jpg")', fig:'assets/crops/hatter.jpg', figPos:'center 28%', desc:'Workshops e hands-on: labs, lightning talks e aquele chá das cinco malucamente prático.', images:[2,4,6,8,10] }
];
const photoFor = n => `assets/crops/speaker-${String(n).padStart(2,'0')}.jpg`;
const tracksEl = document.getElementById('tracks');
function makeCard(track, n, copyIndex){
  const slot = String(copyIndex).padStart(2,'0');
  const photo = photoFor(n);
  return `<article class="speaker-card" style="--track-accent:${track.accent}" tabindex="0" role="button" aria-label="Posição ${slot} da trilha ${track.name}: ver detalhes" data-photo="${photo}" data-slot="${slot}" data-track-name="${track.name}" data-track-tag="${track.tag}" data-role="${track.role}" data-desc="${track.desc}">
    <div class="speaker-photo"><img src="${photo}" alt="Foto de palestrante · ${track.name}, posição ${copyIndex}" loading="lazy"></div>
    <div class="speaker-body">
      <div class="slot">posição ${slot}</div>
      <div class="speaker-name">Nome em breve</div>
      <div class="speaker-role">${track.role}</div>
      <span class="speaker-chip">em breve</span>
    </div>
  </article>`;
}
function trackMarkup(track){
  const core = track.images.map((n, i) => makeCard(track, n, i+1)).join('');
  return `<section class="track-row" style="--track-accent:${track.accent};--track-bg:${track.bg}">
    <div class="track-info">
      <div class="track-head"><span class="track-fig"><img src="${track.fig}"${track.figZoom ? ` class="fig-zoom" style="object-position:${track.figPos || 'center'};transform:scale(${track.figZoom})"` : ` style="object-position:${track.figPos || 'center'}"`} alt="Personagem da trilha ${track.name}" loading="lazy"></span><div class="track-no">${track.tag} <span class="track-sub">· ${track.name}</span></div></div>
      <p>${track.desc}</p>
      <div class="track-desc-tag">Arraste para os lados <span class="drag-arrow">→</span></div>
    </div>
    <div class="rail-area">
      <div class="rail-head"><div class="rail-title">${track.role}</div><div class="rail-controls"><button type="button" data-dir="prev" aria-label="Anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></svg></button><button type="button" data-dir="next" aria-label="Próximo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg></button></div></div>
      <div class="rail" data-track="${track.key}">${core}${core}${core}</div>
    </div>
  </section>`;
}
tracksEl.innerHTML = tracks.map(trackMarkup).join('');
document.querySelectorAll('.rail[data-sponsor-set]').forEach(rail => {
  const set = rail.dataset.sponsorSet;
  const count = parseInt(rail.dataset.sponsorCount || '5', 10);
  const label = rail.dataset.sponsorLabel || 'PATROCINADOR';
  const accent = set === 'premium' ? '#ff28dc' : '#2dd7ff';
  const cards = Array.from({length: count}, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `<article class="logo-card" style="--track-accent:${accent}">
      <div class="logo-photo"><span class="logo-placeholder">SEU LOGO AQUI</span><img src="assets/sponsors/${set}-${num}.png" alt="Logo do patrocinador: espaço ${num}" loading="lazy" onerror="this.classList.add('image-error')"></div>
      <div class="logo-body"><span class="slot">${label} ${num}</span><div class="logo-name">Espaço disponível</div></div>
    </article>`;
  }).join('');
  rail.innerHTML = cards + cards + cards;
});
const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
document.querySelectorAll('.rail').forEach(rail => {
  const cards = [...rail.children];
  let baseWidth = 0;
  const measure = () => {
    const originals = cards.slice(0, cards.length/3);
    baseWidth = originals.reduce((sum, el, i) => sum + el.getBoundingClientRect().width + (i ? 12 : 0), 0);
    rail.scrollLeft = baseWidth;
  };
  requestAnimationFrame(measure);
  window.addEventListener('resize', () => { if(!rail.dataset.measured){ measure(); rail.dataset.measured='1'; } });
  const normalize = () => {
    if (!baseWidth) return;
    if (rail.scrollLeft < baseWidth * 0.45) rail.scrollLeft += baseWidth;
    if (rail.scrollLeft > baseWidth * 1.55) rail.scrollLeft -= baseWidth;
  };
  rail.addEventListener('scroll', normalize, {passive:true});
  const wrap = rail.closest('.rail-area');
  wrap.querySelector('[data-dir="prev"]').addEventListener('click', () => rail.scrollBy({left:-Math.min(rail.clientWidth*.78,860), behavior:'smooth'}));
  wrap.querySelector('[data-dir="next"]').addEventListener('click', () => rail.scrollBy({left:Math.min(rail.clientWidth*.78,860), behavior:'smooth'}));
  if (!finePointer) return;
  let dragging=false,captured=false,startX=0,startY=0,startScroll=0,suppressClick=false;
  rail.addEventListener('pointerdown', e => { dragging=true; captured=false; suppressClick=false; startX=e.clientX; startY=e.clientY; startScroll=rail.scrollLeft; });
  rail.addEventListener('pointermove', e => {
    if(!dragging) return;
    if(!captured){
      if(Math.abs(e.clientX-startX) < 7 && Math.abs(e.clientY-startY) < 7) return;
      captured=true; suppressClick=true;
      rail.classList.add('is-dragging');
      try{ rail.setPointerCapture(e.pointerId); }catch(_){}
    }
    rail.scrollLeft=startScroll-(e.clientX-startX);
  });
  const endDrag=()=>{dragging=false;rail.classList.remove('is-dragging')};
  rail.addEventListener('pointerup',endDrag); rail.addEventListener('pointercancel',endDrag);
  rail.addEventListener('click', e => { if(suppressClick){ e.stopPropagation(); e.preventDefault(); suppressClick=false; } }, true);
  rail.addEventListener('wheel', e => { if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();rail.scrollLeft+=e.deltaY;} }, {passive:false});
});
const header=document.getElementById('header');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>24),{passive:true});
const menuBtn=document.querySelector('.menu-toggle'); const nav=document.querySelector('.main-nav');
const closeMenu=()=>{ nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); };
menuBtn.addEventListener('click',()=>{ const open=nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded',String(open)); });
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('click',e=>{ if(nav.classList.contains('open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) closeMenu(); });
window.addEventListener('scroll',()=>{ if(nav.classList.contains('open')) closeMenu(); },{passive:true});
document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>img.classList.add('image-error')));
const openModal = id => {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('open');
  m.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const closeBtn = m.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
};
const closeModal = m => {
  m.classList.remove('open');
  m.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};
document.querySelectorAll('.policy-open').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.modal)));
document.querySelectorAll('.modal').forEach(m => {
  m.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => closeModal(m)));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal.open').forEach(closeModal);
});
(function(){
  const modal = document.getElementById('modal-speaker');
  if (!modal) return;
  const dialog = modal.querySelector('.speaker-dialog');
  const img = modal.querySelector('#speaker-modal-img');
  const tagEl = modal.querySelector('#speaker-modal-track');
  const roleEl = modal.querySelector('#speaker-modal-role');
  const descEl = modal.querySelector('#speaker-modal-desc');
  const slotEl = modal.querySelector('#speaker-modal-slot');
  const open = card => {
    const accent = (card.style.getPropertyValue('--track-accent') || '#11d1ff').trim();
    dialog.style.setProperty('--spk-accent', accent);
    img.src = card.dataset.photo;
    img.alt = 'Foto do palestrante da posição ' + card.dataset.slot + ', trilha ' + card.dataset.trackName;
    tagEl.textContent = card.dataset.trackTag + ' · ' + card.dataset.trackName.toUpperCase();
    roleEl.textContent = card.dataset.role;
    descEl.textContent = card.dataset.desc;
    if (slotEl) slotEl.textContent = card.dataset.slot;
    openModal('modal-speaker');
  };
  document.querySelectorAll('.speaker-card').forEach(card => {
    card.addEventListener('click', () => open(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
    });
  });
})();
const cyberCursor = document.getElementById('cyber-cursor');
if (cyberCursor) {
  let inactivityTimer;
  document.addEventListener('mousemove', e => {
    cyberCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    cyberCursor.classList.remove('inactive', 'hidden');
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => cyberCursor.classList.add('inactive'), 2000);
  });
  document.documentElement.addEventListener('mouseleave', () => cyberCursor.classList.add('hidden'));
  document.documentElement.addEventListener('mouseenter', () => cyberCursor.classList.remove('hidden'));
  window.addEventListener('blur', () => cyberCursor.classList.add('hidden'));
  window.addEventListener('focus', () => cyberCursor.classList.remove('hidden'));
  (function triggerRandomGlitch() {
    cyberCursor.classList.add('glitch-active');
    setTimeout(() => cyberCursor.classList.remove('glitch-active'), 250);
    setTimeout(triggerRandomGlitch, Math.random() * 2000 + 1000);
  })();
}
(function(){
  const touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const warp = document.getElementById('warp');
  if (touch || reduced || !warp) return;
  const doc = document.documentElement;
  doc.classList.add('fx-ready');
  const track = document.createElement('div'); track.id = 'fx-sb';
  const thumb = document.createElement('span'); thumb.id = 'fx-sb-thumb';
  track.appendChild(thumb); document.body.appendChild(track);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const sb = { h: 1, thumbH: 0, maxScroll: 1, dragging: false, offY: 0, idleT: 0 };
  function sbMeasure(){
    const docH = Math.max(1, doc.scrollHeight);
    sb.maxScroll = Math.max(1, docH - window.innerHeight);
    sb.h = Math.max(1, window.innerHeight - 20);
    sb.thumbH = Math.max(44, Math.round(sb.h * (window.innerHeight / docH)));
    thumb.style.height = sb.thumbH + 'px';
    track.style.display = (docH - window.innerHeight) > 4 ? '' : 'none';
  }
  const sbPos = () => clamp(window.scrollY / sb.maxScroll, 0, 1) * (sb.h - sb.thumbH);
  function sbUpdate(){ thumb.style.transform = 'translateY(' + sbPos().toFixed(1) + 'px)'; }
  function wake(){
    track.classList.remove('sb-idle');
    clearTimeout(sb.idleT);
    sb.idleT = setTimeout(() => { if (!sb.dragging) track.classList.add('sb-idle'); }, 1200);
  }
  function sbDragTo(y){
    const pos = clamp(y - sb.offY, 0, Math.max(0, sb.h - sb.thumbH));
    const p = sb.h - sb.thumbH > 0 ? pos / (sb.h - sb.thumbH) : 0;
    window.scrollTo(0, p * sb.maxScroll);
  }
  track.addEventListener('pointerdown', e => {
    const r = track.getBoundingClientRect();
    const y = e.clientY - r.top;
    sb.dragging = true; track.classList.add('sb-drag');
    if (y < sbPos() || y > sbPos() + sb.thumbH) sb.offY = sb.thumbH / 2; else sb.offY = y - sbPos();
    sbDragTo(y);
    try { track.setPointerCapture(e.pointerId); } catch (_) {}
    e.preventDefault();
  });
  track.addEventListener('pointermove', e => {
    if (!sb.dragging) return;
    sbDragTo(e.clientY - track.getBoundingClientRect().top);
  });
  const sbRelease = () => { sb.dragging = false; track.classList.remove('sb-drag'); };
  track.addEventListener('pointerup', sbRelease);
  track.addEventListener('pointercancel', sbRelease);
  window.addEventListener('resize', () => { sbMeasure(); sbUpdate(); });
  window.addEventListener('load', () => { sbMeasure(); sbUpdate(); });
  if (window.ResizeObserver) new ResizeObserver(() => { sbMeasure(); sbUpdate(); }).observe(document.body);
  window.addEventListener('scroll', () => { sbUpdate(); wake(); }, {passive:true});
  sbMeasure(); sbUpdate(); wake();
})();
(function(){
  const loader = document.getElementById('bsb-loader');
  if (!loader) return;
  const html = document.documentElement;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  html.classList.add('loader-lock');
  if (!reduced) html.classList.add('js-cine');
  let hidden = false;
  const dust = (function(){
    const none = { burst: function(){}, stop: function(){} };
    if (reduced) return none;
    const cv = loader.querySelector('.loader-dust');
    if (!cv || !cv.getContext) return none;
    const ctx = cv.getContext('2d');
    if (!ctx) return none;
    let W = 0, H = 0, raf = 0, last = 0;
    const t0 = performance.now();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const COLORS = [[69,209,255],[69,209,255],[69,209,255],[255,25,220],[163,92,255],[247,249,252]];
    const sparks = [], pts = [];
    function size(){
      W = cv.width = Math.max(2, Math.round(innerWidth * dpr));
      H = cv.height = Math.max(2, Math.round(innerHeight * dpr));
    }
    function spawn(init){
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      return { x: Math.random() * W, y: init ? Math.random() * H : H + 10 * dpr, r: (.6 + Math.random() * 1.7) * dpr, v: (10 + Math.random() * 24) * dpr, amp: (5 + Math.random() * 17) * dpr, f: .35 + Math.random() * 1.05, ph: Math.random() * 6.2832, a: .18 + Math.random() * .5, tw: .7 + Math.random() * 2.1, c: c };
    }
    const NP = Math.max(26, Math.min(80, Math.round(screen.width * screen.height / 22000)));
    for (let i = 0; i < NP; i++) pts.push(spawn(true));
    function frame(now){
      raf = requestAnimationFrame(frame);
      const t = (now - t0) / 1000;
      const dt = Math.min(.05, (now - (last || now)) / 1000);
      last = now;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++){
        const p = pts[i];
        p.y -= p.v * dt;
        if (p.y < -14 * dpr) pts[i] = spawn(false);
        const q = pts[i];
        const x = q.x + Math.sin(t * q.f + q.ph) * q.amp;
        const a = q.a * (.55 + .45 * Math.sin(t * q.tw + q.ph * 2));
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + q.c[0] + ',' + q.c[1] + ',' + q.c[2] + ',' + a.toFixed(3) + ')';
        ctx.arc(x, q.y, q.r, 0, 6.2832);
        ctx.fill();
      }
      for (let i = sparks.length - 1; i >= 0; i--){
        const s = sparks[i];
        s.life -= dt;
        if (s.life <= 0){ sparks.splice(i, 1); continue; }
        s.x += s.vx * dt; s.y += s.vy * dt;
        s.vx *= .984; s.vy *= .984;
        const k = s.life / s.max;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + s.c[0] + ',' + s.c[1] + ',' + s.c[2] + ',' + (k * .9).toFixed(3) + ')';
        ctx.arc(s.x, s.y, s.r * k + .3 * dpr, 0, 6.2832);
        ctx.fill();
      }
    }
    size();
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', size, { passive: true });
    return {
      burst(cx, cy){
        const x = cx * dpr, y = cy * dpr;
        for (let i = 0; i < 20; i++){
          const a = Math.random() * 6.2832;
          const sp = (60 + Math.random() * 150) * dpr;
          const life = .65 + Math.random() * .4;
          sparks.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: (1.1 + Math.random() * 1.9) * dpr, life: life, max: life, c: COLORS[Math.floor(Math.random() * COLORS.length)] });
        }
      },
      stop(){ if (raf) cancelAnimationFrame(raf); raf = 0; }
    };
  })();
  (function(){
    const img = loader.querySelector('.loader-logo-img');
    if (!img || reduced) return;
    const SRC = img.getAttribute('src') || 'assets/crops/logo.png';
    const stage = loader.querySelector('.loader-stage');
    if (!stage) return;
    let failed = false;
    const fail = () => { failed = true; loader.classList.remove('bsb-write'); };
    loader.classList.add('bsb-write');
    let ready;
    if (img.complete && img.naturalWidth) ready = Promise.resolve(true);
    else ready = new Promise(res => {
      img.addEventListener('load', () => res(true), { once: true });
      img.addEventListener('error', () => res(false), { once: true });
    });
    const giveUp = setTimeout(fail, 1600);
    ready.then(ok => {
      clearTimeout(giveUp);
      if (hidden || failed || !ok || !(img.complete && img.naturalWidth)) return fail();
      const wrap = document.createElement('div');
      wrap.className = 'logo-write';
      wrap.setAttribute('aria-hidden', 'true');
      const N = 9;
      const DIRS = ['ltr', 'rtl', 'ctr', 'rtl', 'ltr', 'ctr', 'ltr', 'rtl', 'ltr'];
      const WRITE_AT = 780, STAG = 132, ease = 'cubic-bezier(.32,.64,.28,1)';
      const strips = [];
      for (let i = 0; i < N; i++){
        const s = document.createElement('div');
        s.className = 'lw-strip';
        s.style.backgroundImage = 'url("' + SRC + '")';
        s.innerHTML = DIRS[i] === 'ltr' ? '<span class="lw-edge l"></span>' : DIRS[i] === 'rtl' ? '<span class="lw-edge r"></span>' : '<span class="lw-edge l"></span><span class="lw-edge r"></span>';
        wrap.appendChild(s);
        strips.push({ el: s, dir: DIRS[i], i: i });
      }
      stage.appendChild(wrap);
      void wrap.offsetHeight;
      const LH = wrap.clientHeight || 280;
      const sh = LH / N;
      let maxEnd = 0;
      strips.forEach(o => {
        const el = o.el;
        el.style.top = (o.i * sh).toFixed(2) + 'px';
        el.style.height = (sh + 1.5).toFixed(2) + 'px';
        el.style.backgroundSize = '100% ' + LH + 'px';
        el.style.backgroundPosition = '0px ' + (-o.i * sh).toFixed(2) + 'px';
        const dur = 470 + ((o.i * 97) % 190);
        const delay = WRITE_AT + o.i * STAG;
        const end = delay + dur;
        if (end > maxEnd) maxEnd = end;
        let kf;
        if (o.dir === 'ltr') kf = [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }];
        else if (o.dir === 'rtl') kf = [{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)' }];
        else kf = [{ clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)' }];
        try {
          el.animate(kf, { duration: dur, delay: delay, easing: ease, fill: 'both' });
          const eL = el.querySelector('.lw-edge.l'), eR = el.querySelector('.lw-edge.r');
          if (o.dir === 'ltr' && eL) eL.animate([{ left: '0%' }, { left: '100%' }], { duration: dur, delay: delay, easing: ease, fill: 'both' });
          if (o.dir === 'rtl' && eR) eR.animate([{ right: '0%' }, { right: '100%' }], { duration: dur, delay: delay, easing: ease, fill: 'both' });
          if (o.dir === 'ctr'){
            if (eL) eL.animate([{ left: '50%' }, { left: '0%' }], { duration: dur, delay: delay, easing: ease, fill: 'both' });
            if (eR) eR.animate([{ right: '50%' }, { right: '0%' }], { duration: dur, delay: delay, easing: ease, fill: 'both' });
          }
          const eo = { duration: dur, delay: delay, easing: 'linear', fill: 'both' };
          if (eL) eL.animate([{ opacity: 0 }, { opacity: 1, offset: .07 }, { opacity: .95, offset: .8 }, { opacity: 0 }], eo);
          if (eR) eR.animate([{ opacity: 0 }, { opacity: 1, offset: .07 }, { opacity: .95, offset: .8 }, { opacity: 0 }], eo);
        } catch (e) {}
      });
      setTimeout(() => {
        if (hidden) return;
        wrap.classList.add('lw-done');
        const shock = loader.querySelector('.loader-shock');
        if (shock){
          shock.style.animation = 'none';
          void shock.offsetHeight;
          shock.style.animation = 'loader-shock 1s cubic-bezier(.2,.7,.3,1) .04s both';
        }
        const r = stage.getBoundingClientRect();
        dust.burst(r.left + r.width / 2, r.top + r.height * .48);
      }, maxEnd + 40);
    });
  })();
  const hide = () => {
    if (hidden) return;
    hidden = true;
    loader.classList.add('done');
    html.classList.remove('loader-lock');
    try { dust.stop(); } catch (e) {}
    if (!reduced) {
      requestAnimationFrame(() => html.classList.add('cine-open'));
      setTimeout(() => {
        html.classList.add('cine-done');
        html.classList.remove('cine-open');
        document.querySelectorAll('.cine-iris,.cine-bar,.cine-sweep').forEach(n => n.remove());
      }, 3250);
    }
    setTimeout(() => loader.remove(), 1250);
    document.dispatchEvent(new CustomEvent('bsb:loaded'));
  };
  const minTime = new Promise(r => setTimeout(r, reduced ? 500 : 3500));
  if (document.readyState === 'complete') minTime.then(hide);
  else window.addEventListener('load', () => minTime.then(hide));
  setTimeout(hide, 6900);
})();
(function(){
  const links = [...document.querySelectorAll('.main-nav a')];
  if (!links.length) return;
  const byId = {};
  links.forEach(a => { const id = (a.getAttribute('href') || '').replace('#',''); if (id) byId[id] = a; });
  const setActive = a => links.forEach(l => l.classList.toggle('active', l === a));
  links.forEach(a => a.addEventListener('click', () => setActive(a)));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) setActive(byId[en.target.id]); });
  }, {rootMargin:'-38% 0px -55% 0px', threshold:0});
  Object.keys(byId).forEach(id => { const s = document.getElementById(id); if (s) spy.observe(s); });
  window.addEventListener('scroll', () => { if (window.scrollY < 160) setActive(null); }, {passive:true});
})();
(function(){
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  const sel = [
    '.section-head-row','.section-intro > *','.glass-card','.check-list li','.ctf-card',
    '.theme-card','.history-card','.sponsor-tiers article','.sponsor-hero','.location-banner',
    '.track-row','.rail-head','.conduta-panel','.program-panel','.policy-card','.footer-inner > *',
    '.contact-card','.keywords-marquee','.stats > div','.poster-panel','.about-copy > *',
    '.objectives-grid > div','.program-card','.sponsor-walls'
  ].join(',');
  document.querySelectorAll(sel).forEach(el => {
    if (el.closest('.rail')) return;
    el.classList.add('reveal');
  });
  document.querySelectorAll('.theme-grid,.history-grid,.sponsor-tiers,.program-grid,.contact-grid,.stats,.objectives-grid,.check-list,.footer-contacts,.sponsor-walls').forEach(grid => {
    [...grid.children].forEach((c, i) => c.style.setProperty('--rd', Math.min(i * 70, 420) + 'ms'));
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
    });
  }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  const heroEls = [...document.querySelectorAll('.hero-meta,.hero-copy,.hero-scroll')];
  heroEls.forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--rd', (i * 170) + 'ms'); });
  const showHero = () => requestAnimationFrame(() => heroEls.forEach(el => el.classList.add('visible')));
  if (document.documentElement.classList.contains('loader-lock')) {
    document.addEventListener('bsb:loaded', showHero, {once:true});
  } else {
    setTimeout(showHero, 300);
  }
})();
(function(){
  const label = document.querySelector('.hero-label-left');
  if (!label || label.dataset.chSplit) return;
  label.dataset.chSplit = '1';
  let i = 0;
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        [...n.textContent].forEach(c => {
          if (c.trim() === '') { frag.appendChild(document.createTextNode(c)); return; }
          const s = document.createElement('span');
          s.className = 'ch'; s.textContent = c; s.style.setProperty('--i', i++);
          frag.appendChild(s);
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === 1 && n.tagName === 'BR') { i += 3; }
    });
  };
  walk(label);
})();
(function(){
  const ghost = document.querySelector('.hero-rabbit-ghost');
  if (!ghost) return;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  const burst = () => {
    ghost.classList.add('glitch-burst');
    setTimeout(() => ghost.classList.remove('glitch-burst'), 600);
  };
  const loop = () => setTimeout(() => { if (!document.hidden) burst(); loop(); }, 3400 + Math.random() * 4200);
  loop();
})();
(function(){
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  const targets = [...document.querySelectorAll('[data-glitch]')];
  if (!targets.length) return;
  const schedule = fn => setTimeout(fn, 2100 + Math.random() * 3900);
  const tick = () => {
    if (!document.hidden) {
      const el = targets[Math.floor(Math.random() * targets.length)];
      el.classList.add('glitch-on');
      setTimeout(() => el.classList.remove('glitch-on'), 320 + Math.random() * 240);
    }
    schedule(tick);
  };
  schedule(tick);
})();
(function(){
  const bar = document.getElementById('ftType');
  if (!bar) return;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phrases = ['Follow The Rabbit', 'Down the rabbit Hole', 'BSIDES_BSB v2026'];
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const start = async () => {
    if (reduced) { bar.textContent = phrases[0]; return; }
    let i = 0;
    for (;;) {
      for (const ch of phrases[i]) { bar.textContent += ch; await wait(34 + Math.random() * 46); }
      await wait(1900);
      while (bar.textContent) { bar.textContent = bar.textContent.slice(0, -1); await wait(22); }
      await wait(420);
      i = (i + 1) % phrases.length;
    }
  };
  if (document.documentElement.classList.contains('loader-lock')) {
    document.addEventListener('bsb:loaded', start, { once: true });
  } else {
    start();
  }
})();
(function(){
  const eyes = document.querySelectorAll('.eyebrow');
  if (!eyes.length) return;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const prep = el => {
    if (el.dataset.ebReady) return;
    el.dataset.ebReady = '1';
    const full = el.textContent.trim();
    el.setAttribute('aria-label', full);
    el.dataset.full = full;
    el.innerHTML = '<span class="eb-text"></span><span class="eb-prompt">:~$</span><span class="eb-caret">_</span>';
  };
  const run = async el => {
    if (el.dataset.ebDone) return;
    el.dataset.ebDone = '1';
    const textEl = el.querySelector('.eb-text');
    const full = el.dataset.full || '';
    if (reduced || !full) { textEl.textContent = full; el.classList.add('eb-done'); return; }
    for (const ch of full) { textEl.textContent += ch; await wait(24 + Math.random() * 30); }
    el.classList.add('eb-done');
  };
  if (!('IntersectionObserver' in window) || reduced) {
    eyes.forEach(el => { prep(el); run(el); });
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      run(en.target);
    });
  }, { threshold: .5 });
  eyes.forEach(el => { prep(el); io.observe(el); });
})();
(function(){
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cmd = document.getElementById('mmCmd');
  let typeToken = 0;
  const vibrate = p => { if (navigator.vibrate) try { navigator.vibrate(p); } catch (_) {} };
  const typeCmd = async () => {
    const token = ++typeToken;
    if (!cmd) return;
    if (reduced) { cmd.textContent = 'ls ../secoes/'; return; }
    cmd.textContent = '';
    for (const ch of 'ls ../secoes/') {
      if (token !== typeToken) return;
      cmd.textContent += ch;
      await new Promise(r => setTimeout(r, 42));
    }
  };
  const openMenu = () => {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    vibrate([12, 40, 18]);
    typeCmd();
    const closeBtn = menu.querySelector('.mm-close');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  };
  const closeMenu = () => {
    if (!menu.classList.contains('open')) return;
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    typeToken++;
  };
  menu.querySelectorAll('[data-mm-close]').forEach(el => el.addEventListener('click', closeMenu));
  menu.querySelectorAll('.mm-nav a').forEach(a => a.addEventListener('click', closeMenu));
  const chatBtn = menu.querySelector('.mm-chat');
  if (chatBtn) chatBtn.addEventListener('click', () => {
    closeMenu();
    setTimeout(() => { if (window.__bsbBotOpen) window.__bsbBotOpen(); }, 220);
  });
  menu.addEventListener('pointerdown', e => { if (e.target === menu) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('scroll', () => { if (menu.classList.contains('open')) closeMenu(); }, { passive: true });
  window.__bsbMenu = { open: openMenu, close: closeMenu, isOpen: () => menu.classList.contains('open') };
})();
(function(){
  'use strict';
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const escapeHtml = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  function norm(s){
    return String(s || '').toLowerCase()
      .replace(/[áàâãä]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[íìîï]/g, 'i')
      .replace(/[óòôõö]/g, 'o').replace(/[úùûü]/g, 'u').replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, ' ');
  }
  function renderRich(text){
    const links = [];
    let src = escapeHtml(text);
    src = src.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    src = src.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, (m, t, u) => {
      links.push('<a href="' + u + '" target="_blank" rel="noopener">' + t + '</a>');
      return '\x00' + (links.length - 1) + '\x00';
    });
    src = src.replace(/\x00(\d+)\x00/g, (m, i) => links[+i]);
    return src.replace(/\n/g, '<br>');
  }
  const WELCOME = "Olá! Eu sou o **White Rabbit Bot**, o coelho-guia do site. Pergunte sobre o **BSidesBSB 2026**: data, local, trilhas, CTF, inscrição, palestrantes, patrocínio ou contato.";
  const CHIPS = ["Quando é o evento?", "Quais são as trilhas?", "Como funciona o CTF?", "Como me inscrevo?"];
  const A_INSC = "As inscrições para 2026 **abrem em breve** e as vagas são limitadas. Acompanhe o [Instagram](https://www.instagram.com/bsidesbsb/) e as redes oficiais para garantir a sua.";
  const A_SPONSOR = "Sua marca em Wonderland em 4 níveis: **White Rabbit** (premium), **Cheshire** (gold), **Mad Hatter** (silver) e **Village** (temático). Preencha o [formulário de parcerias](https://forms.gle/MxmhBLyhL2LkASS87) ou escreva para [bsidesbsb@gmail.com](mailto:bsidesbsb@gmail.com) e peça o mídia kit.";
  const A_CTF = "O **CTF oficial** rola durante o evento, com desafios de **web, pwn, crypto, forense, OSINT e misc** — para todos os níveis, do iniciante ao avançado. Inscrição na hora, individual ou em equipe, e **prêmios para o top 3**.";
  const A_TRACKS = "São **4 trilhas temáticas** inspiradas nos personagens de Alice:\n- **Coelho Branco** — keynotes e talks principais\n- **Gato de Cheshire** — segurança ofensiva (red team / pentest)\n- **Rainha de Copas** — defesa e resposta (blue team / DFIR)\n- **Chapeleiro** — workshops e hands-on\nCada trilha tem 5 posições na lineup.";
  const A_SPEAK = "A **lineup 2026** será anunciada em breve: 4 trilhas, 16+ palestras, keynotes, workshops e lightning talks. Quer uma das posições? Inscreva a sua palestra na chamada de palestras — botão **Quero palestrar** na seção Palestrantes.";
  const A_DATE = "O **BSidesBSB 2026 — Down the Rabbit Hole** acontece em **14 de novembro de 2026**, em **Brasília**. Um dia inteiro de talks, CTF, villages e comunidade hacker.";
  const A_LOCAL = "O evento rola em **Brasília**. O endereço exato será revelado em breve — fique de olho no [Instagram](https://www.instagram.com/bsidesbsb/) para não perder o anúncio.";
  const A_AGENDA = "A **grade completa** será divulgada em breve. No dia do evento: talks em 4 trilhas paralelas, CTF, villages temáticas, labs ao vivo e painel da comunidade.";
  const A_VILLAGE = "Além dos palcos, teremos **villages temáticas e labs ao vivo**: espaço para experimentar, errar, aprender e trocar ideia com a comunidade — do iniciante ao veterano.";
  const A_CONDUTA = "Seguimos um **Código de Conduta**: ideias podem e devem ser questionadas; pessoas não. Assédio ou hostilidade são inaceitáveis. O código completo está na seção **Conduta & Privacidade** do site.";
  const A_HIST = "Em **2025**, a primeira edição provou que Brasília tem cena: **19 palestrantes**, **2 palcos**, **3 villages** e o **primeiro CTF oficial** da BSidesBSB. Em 2026, o país das maravilhas cresce.";
  const A_CONTACT = "Os canais da organização:\n- **E-mail** — [bsidesbsb@gmail.com](mailto:bsidesbsb@gmail.com)\n- **Instagram** — [@bsidesbsb](https://www.instagram.com/bsidesbsb/)\n- **LinkedIn** — [BSidesBSB](https://www.linkedin.com/company/bsides-bsb/)";
  const A_BSIDES = "A **BSides** é uma rede mundial de conferências de segurança **feitas pela comunidade, para a comunidade**, nascida em 2009 em Las Vegas como alternativa à Black Hat / DEF CON. Cada capítulo é independente — a **BSidesBSB** é o capítulo de Brasília.";
  const A_BOT = "Sou o **White Rabbit Bot**, o coelho-guia do site. Não sou uma IA de verdade — só conheço o **BSidesBSB 2026**: data, local, trilhas, CTF, inscrição, palestrantes, patrocínio, conduta e contato.";
  const A_HELP = "Posso falar do **BSidesBSB 2026**: **data e local**, **trilhas**, **CTF**, **inscrição**, **palestrantes**, **patrocínio**, **villages**, **agenda**, **conduta**, **histórico** e **contato**. É só perguntar ou tocar numa das sugestões.";
  const A_HI = "Oi! Bem-vindo à Wonderland. Quer saber da **data**, das **trilhas**, do **CTF** ou da **inscrição**?";
  const A_HOW = "Tudo certo aqui do outro lado do espelho! Enquanto isso posso falar do evento: **data**, **trilhas**, **CTF**, **inscrição**…";
  const A_THX = "Por nada! Nos vemos em Wonderland — **14 de novembro**, Brasília.";
  const A_JOKE = "Clássica da área: existem **10 tipos de pessoas** — as que entendem binário… e as que não entendem. A Rainha de Copas manda decapitar só a segunda metade.";
  const A_FALL = "Essa me deixou tão perdido quanto coelho sem relógio. Só sei falar do **BSidesBSB 2026**: **data**, **local**, **trilhas**, **CTF**, **inscrição**, **palestrantes**, **patrocínio** e **contato**. Tenta uma das sugestões acima!";
  const RULES = [
    [/(inscr|ingresso|vaga|comprar|pagar|preco|valor|custa|gratuit|gratis)/, A_INSC],
    [/(patroc|sponsor|marca|empresa|cotar|cota |midia|imprensa)/, A_SPONSOR],
    [/(ctf|capture the flag|flag|pwn|exploit)/, A_CTF],
    [/(trilha|track|coelho branco|cheshire|rainha de copas|chapeleiro|keynote)/, A_TRACKS],
    [/(palestr|lineup|speaker|chamada de palestras|talk)/, A_SPEAK],
    [/(data|quando|dia do evento|novembro)/, A_DATE],
    [/(local|onde|endereco|cidade|brasilia|chegar|mapa|hospedagem|hotel)/, A_LOCAL],
    [/(agenda|programac|grade|cronograma|schedule)/, A_AGENDA],
    [/(village|lab|workshop|hands ?on)/, A_VILLAGE],
    [/(conduta|privacidade|assedio|respeito|codigo de conduta)/, A_CONDUTA],
    [/(histor|2025|edicao passada|primeira edi)/, A_HIST],
    [/(contato|contact|email|e mail|instagram|linkedin|redes|whatsapp|telegram|discord|falar com)/, A_CONTACT],
    [/(bsides|wonderland|alice|pais das maravilhas|comunidade|evento)/, A_BSIDES],
    [/(quem e voce|voce e um|voce e o|voce e real|e um bot|e robo|chatbot|seu nome|como se chama|white rabbit bot|quem e o bot)/, A_BOT],
    [/(ajuda|help|o que voce (faz|pode|sabe)|opcoes|comandos|menu)/, A_HELP],
    [/(piada|engracad|zoeira|humor)/, A_JOKE],
    [/(tudo bem|tudo bom|como vai|beleza|de boa|como voce esta|como ta)/, A_HOW],
    [/(obrigad|valeu|vlw|brigad|thanks|thank you|grato)/, A_THX],
    [/(^|\s)(oi|ola|opa|hey|hello|hi|salve|eai|e ai|bom dia|boa tarde|boa noite|fala)(\s|$)/, A_HI]
  ];
  function answer(q){
    const t = norm(q);
    if (!t) return A_FALL;
    for (let i = 0; i < RULES.length; i++) if (RULES[i][0].test(t)) return RULES[i][1];
    return A_FALL;
  }
  window.__bsbBotQA = { WELCOME, CHIPS, clean, renderRich, answer };
})();
(function(){
  'use strict';
  const QA = window.__bsbBotQA;
  if (!QA) return;
  const SVG_SEND = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>';
  const SVG_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  const SVG_TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>';
  const LS_HIST = 'bsb_bot_hist_v1', LS_DOCK = 'bsb_bot_dock_v1', LS_TIP = 'bsb_bot_tip_v1', LS_HINT = 'bsb_hold_hint_v1';
  const isMobile = () => window.innerWidth <= 620;
  const dotLabel = () => isMobile() ? 'Voltar ao topo — segure para abrir o menu e o chat' : 'White Rabbit Bot — arraste para mover, toque para abrir';
  function buildOrbit(){
    const PAL = ['#ff19dc', '#a35cff', '#11d1ff', '#f7f9fc'];
    let sd = 7;
    const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    const rings = [[30, 6, 'r1'], [42, 7, 'r2'], [54, 5, 'r3']];
    let html = '';
    for (const [base, count, cls] of rings){
      let parts = '';
      for (let i = 0; i < count; i++){
        const a = (360 / count) * i + rnd() * 26 - 13;
        const r = base + rnd() * 10 - 5;
        const s = (3.5 + rnd() * 4.5).toFixed(1);
        const c = PAL[Math.floor(rnd() * PAL.length)];
        const d = (rnd() * .22).toFixed(2);
        const sq = rnd() > .72 ? ' sq' : '';
        const rad = a * Math.PI / 180;
        const dist = 64 + rnd() * 34;
        const tx = (Math.cos(rad) * dist).toFixed(0);
        const ty = (Math.sin(rad) * dist).toFixed(0);
        parts += '<span class="orb-p' + sq + '" style="--a:' + a.toFixed(1) + 'deg;--r:' + r.toFixed(0) + 'px;--s:' + s + 'px;--c:' + c + ';--d:' + d + 's;--tx:' + tx + 'px;--ty:' + ty + 'px"></span>';
      }
      html += '<span class="orbit-ring ' + cls + '">' + parts + '</span>';
    }
    return '<span class="bot-orbit" aria-hidden="true">' + html + '<span class="orbit-wave"></span><span class="orbit-wave w2"></span></span>';
  }
  let goo, blob, trail, dotBtn, panel, msgsEl, input, sendBtn, tipEl, hintEl;
  let open = false, live = false, pending = false, history = [], hintShown = false;
  const P = { x:0, y:0, tx:0, ty:0, px:0, py:0, ex:0, ey:0, svx:0, svy:0, squash:0, enter:0, enterT:0, hover:0, hoverT:0, dragging:false, side:'right', vw:1, vh:1, open:false };
  const M = 26;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const edgeX = side => side === 'left' ? M : P.vw - M;
  const loadHist = () => { try { const raw = localStorage.getItem(LS_HIST); if (raw) history = JSON.parse(raw) || []; if (!Array.isArray(history)) history = []; } catch (e) { history = []; } };
  const saveHist = () => { try { localStorage.setItem(LS_HIST, JSON.stringify(history.slice(-24))); } catch (e) {} };
  function addMsg(cls, html, text){
    const d = document.createElement('div');
    d.className = 'msg ' + cls;
    if (cls === 'msg--user') d.textContent = text; else d.innerHTML = html;
    msgsEl.appendChild(d);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return d;
  }
  function showTyping(){
    const d = document.createElement('div');
    d.className = 'msg msg--bot msg--typing';
    d.innerHTML = '<span></span><span></span><span></span>';
    msgsEl.appendChild(d);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return d;
  }
  function renderChips(){
    const wrap = panel.querySelector('.bot-chips');
    if (!wrap) return;
    wrap.innerHTML = '';
    QA.CHIPS.forEach(c => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'bot-chip';
      b.textContent = c;
      b.addEventListener('click', () => send(c));
      wrap.appendChild(b);
    });
  }
  function restoreDock(){
    P.vw = Math.max(1, window.innerWidth);
    P.vh = Math.max(1, window.innerHeight);
    P.side = 'right';
    let yr = .58;
    try {
      const raw = localStorage.getItem(LS_DOCK);
      if (raw){
        const j = JSON.parse(raw);
        if (j && (j.side === 'left' || j.side === 'right')) P.side = j.side;
        if (j && typeof j.yr === 'number') yr = clamp(j.yr, .08, .92);
      }
    } catch (e) {}
    P.x = P.tx = edgeX(P.side);
    P.y = P.ty = clamp(P.vh * yr, M, P.vh - M);
    P.px = P.x; P.py = P.y; P.ex = P.x; P.ey = P.y;
  }
  function saveDock(){
    try { localStorage.setItem(LS_DOCK, JSON.stringify({ side: P.side, yr: +(P.y / Math.max(1, P.vh)).toFixed(3) })); } catch (e) {}
  }
  function dock(){
    P.side = P.x < P.vw / 2 ? 'left' : 'right';
    P.tx = edgeX(P.side);
    P.ty = clamp(P.y, M, P.vh - M);
    saveDock();
  }
  function loop(){
    if (document.hidden) { requestAnimationFrame(loop); return; }
    P.enter += (P.enterT - P.enter) * .11;
    if (P.enter < .001 && P.enterT === 0) P.enter = 0;
    const gOp = P.enter < .01 ? 0 : Math.min(1, P.enter * 1.25);
    if (gOp !== P._go) { P._go = gOp; goo.style.opacity = gOp; goo.style.visibility = gOp === 0 ? 'hidden' : 'visible'; }
    P.hover += (P.hoverT - P.hover) * .15;
    if (!P.dragging) { P.x += (P.tx - P.x) * .16; P.y += (P.ty - P.y) * .16; }
    const dx = P.x - P.px, dy = P.y - P.py;
    P.px = P.x; P.py = P.y;
    P.svx += (dx - P.svx) * .28;
    P.svy += (dy - P.svy) * .28;
    if (!P.dragging) {
      const dxE = P.tx - P.x;
      if (Math.abs(dxE) < 2 && Math.abs(P.svx) > 3 && P.squash < .2) P.squash = 1;
    }
    P.squash *= .86;
    P.ex += (P.x - P.ex) * .22;
    P.ey += (P.y - P.ey) * .22;
    let tdx = P.ex - P.x, tdy = P.ey - P.y;
    const tlen0 = Math.hypot(tdx, tdy);
    if (tlen0 > 170) { tdx *= 170 / tlen0; tdy *= 170 / tlen0; P.ex = P.x + tdx; P.ey = P.y + tdy; }
    const tlen = Math.hypot(P.ex - P.x, P.ey - P.y);
    const es = P.enter * (1 + P.hover * .12);
    const sp = Math.hypot(P.svx, P.svy);
    const st = Math.min(sp * .045, .85);
    const settled = sp < .01 && !P.dragging && P.squash < .01 && Math.abs(P.tx - P.x) < .5 && Math.abs(P.ty - P.y) < .5;
    const sx = (1 + st) * es * (1 - P.squash * .3);
    const sy = Math.max(.35, 1 - st * .6) * es * (1 + P.squash * .38);
    const bT = settled
      ? 'rotate(0rad) scale(' + es.toFixed(3) + ',' + Math.max(.35, es).toFixed(3) + ')'
      : 'rotate(' + Math.atan2(P.svy, P.svx).toFixed(3) + 'rad) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
    if (bT !== P._bt) { P._bt = bT; blob.style.transform = bT; }
    const tst = Math.min(tlen * .02, .9);
    const tsx = (1 + tst) * P.enter;
    const tsy = Math.max(.3, 1 - tst * .55) * P.enter;
    const tT = settled
      ? 'scale(' + P.enter.toFixed(3) + ',' + P.enter.toFixed(3) + ')'
      : 'translate(' + tdx.toFixed(1) + 'px,' + tdy.toFixed(1) + 'px) rotate(' + Math.atan2(tdy, tdx).toFixed(3) + 'rad) scale(' + tsx.toFixed(3) + ',' + tsy.toFixed(3) + ')';
    if (tT !== P._tt) { P._tt = tT; trail.style.transform = tT; }
    const gT = 'translate(' + (P.x - 240).toFixed(1) + 'px,' + (P.y - 240).toFixed(1) + 'px)';
    if (gT !== P._gt) { P._gt = gT; goo.style.transform = gT; }
    const dT = 'translate(' + P.x.toFixed(1) + 'px,' + P.y.toFixed(1) + 'px)';
    if (dT !== P._dt) { P._dt = dT; dotBtn.style.transform = dT; }
    if (hintShown) placeHint();
    requestAnimationFrame(loop);
  }
  const drag = { offX: 0, offY: 0, moved: 0, id: null };
  const HOLD = 560, ORBIT_AT = 130;
  let holdT = null, orbitT = null;
  const reducedM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startOrbit = () => {
    dotBtn.classList.add('bot-dot-hold');
    if (goo) goo.classList.add('hold');
    if (navigator.vibrate) try { navigator.vibrate(8); } catch (_) {}
  };
  const clearOrbit = burst => {
    clearTimeout(holdT); clearTimeout(orbitT); holdT = orbitT = null;
    const o = dotBtn.querySelector('.bot-orbit');
    const wasShowing = dotBtn.classList.contains('bot-dot-hold');
    dotBtn.classList.remove('bot-dot-hold');
    if (goo) goo.classList.remove('hold');
    if (!o) return;
    if (burst){ o.classList.add('burst'); setTimeout(() => o.classList.remove('burst'), 700); }
    else if (wasShowing){ o.classList.add('fade'); setTimeout(() => o.classList.remove('fade'), 260); }
  };
  function onDown(e){
    if (!live || P.open || P.dragging) return;
    P.dragging = true; drag.moved = 0; drag.id = e.pointerId;
    drag.offX = e.clientX - P.x; drag.offY = e.clientY - P.y;
    try { dotBtn.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
    if (isMobile() && window.__bsbMenu && !window.__bsbMenu.isOpen()){
      if (!reducedM) orbitT = setTimeout(startOrbit, ORBIT_AT);
      holdT = setTimeout(() => {
        holdT = null;
        P.dragging = false; drag.id = null;
        clearOrbit(true);
        dismissHint(true);
        if (window.__bsbMenu) window.__bsbMenu.open();
      }, HOLD);
    }
  }
  function onMove(e){
    if (!P.dragging || e.pointerId !== drag.id) return;
    const nx = clamp(e.clientX - drag.offX, M, P.vw - M);
    const ny = clamp(e.clientY - drag.offY, M, P.vh - M);
    drag.moved += Math.abs(nx - P.x) + Math.abs(ny - P.y);
    P.x = P.tx = nx; P.y = P.ty = ny;
    if (holdT && drag.moved > 12) clearOrbit(false);
    e.preventDefault();
  }
  function onUp(e){
    if (!P.dragging || e.pointerId !== drag.id) return;
    P.dragging = false; drag.id = null;
    const moved = drag.moved;
    if (holdT) clearOrbit(false);
    if (moved < 8){
      if (isMobile()){ if (navigator.vibrate) try { navigator.vibrate(6); } catch (_) {} window.scrollTo({ top: 0, behavior: 'smooth' }); }
      else togglePanel();
    } else dock();
  }
  function placePanel(){
    if (window.innerWidth <= 620) return;
    const h = panel.offsetHeight || 600;
    const half = h / 2 + 14;
    panel.style.top = clamp(P.y, half, Math.max(half, P.vh - half)).toFixed(0) + 'px';
  }
  function openPanel(){
    if (open) return;
    open = true; P.open = true; P.enterT = 0;
    panel.classList.toggle('side-left', P.side === 'left');
    placePanel();
    panel.classList.add('bot-open');
    dotBtn.classList.add('is-open');
    dotBtn.style.pointerEvents = 'none';
    try { localStorage.setItem(LS_TIP, '1'); } catch (e) {}
    if (tipEl) tipEl.classList.remove('bot-tip-in');
    if (hintShown) dismissHint(true);
    if (!msgsEl.childElementCount){
      loadHist();
      if (history.length) history.forEach(m => addMsg(m.role === 'user' ? 'msg--user' : 'msg--bot', m.role === 'user' ? '' : QA.renderRich(m.content), m.content));
      else addMsg('msg--bot', QA.renderRich(QA.WELCOME));
    }
    setTimeout(() => { try { input.focus(); } catch (e) {} }, 300);
  }
  function closePanel(){
    if (!open) return;
    open = false; P.open = false; P.enterT = 1;
    panel.classList.remove('bot-open');
    dotBtn.classList.remove('is-open');
    dotBtn.style.pointerEvents = 'auto';
  }
  function togglePanel(){ if (open) closePanel(); else openPanel(); }
  window.__bsbBotOpen = openPanel;
  function placeTip(){
    if (!tipEl) return;
    tipEl.style.top = P.y + 'px';
    tipEl.style.transform = 'translateY(-50%)';
    if (P.side === 'right') { tipEl.style.right = (P.vw - P.x + 42) + 'px'; tipEl.style.left = 'auto'; }
    else { tipEl.style.left = (P.x + 42) + 'px'; tipEl.style.right = 'auto'; }
  }
  function placeHint(){
    if (!hintEl || !hintShown) return;
    hintEl.style.left = clamp(P.x, 74, Math.max(74, P.vw - 74)).toFixed(1) + 'px';
    hintEl.style.top = (P.y - 42).toFixed(1) + 'px';
  }
  function dismissHint(persist){
    if (!hintShown) { if (persist) { try { localStorage.setItem(LS_HINT, '1'); } catch (e) {} } return; }
    hintShown = false;
    if (hintEl) hintEl.classList.remove('bot-hint-in');
    if (persist) { try { localStorage.setItem(LS_HINT, '1'); } catch (e) {} }
  }
  function send(forcedText){
    if (pending) return;
    const text = QA.clean(forcedText || input.value);
    if (!text) return;
    if (!forcedText) input.value = '';
    addMsg('msg--user', '', text);
    history.push({ role: 'user', content: text });
    saveHist();
    pending = true; sendBtn.disabled = true;
    const typing = showTyping();
    setTimeout(() => {
      typing.remove();
      const a = QA.answer(text);
      addMsg('msg--bot', QA.renderRich(a));
      history.push({ role: 'assistant', content: a });
      saveHist();
      pending = false; sendBtn.disabled = false;
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }, 480 + Math.random() * 320);
  }
  function buildUI(){
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    svg.innerHTML = '<defs><filter id="bsb-goo">' +
      '<feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/>' +
      '<feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="g"/>' +
      '</filter></defs>';
    document.body.appendChild(svg);
    goo = document.createElement('div');
    goo.id = 'bot-goo';
    goo.setAttribute('aria-hidden', 'true');
    goo.innerHTML = '<div class="bot-float"><div class="bot-trail"></div><div class="bot-blob"></div></div>';
    document.body.appendChild(goo);
    blob = goo.querySelector('.bot-blob');
    trail = goo.querySelector('.bot-trail');
    dotBtn = document.createElement('button');
    dotBtn.id = 'bot-dot';
    dotBtn.type = 'button';
    dotBtn.setAttribute('aria-label', dotLabel());
    dotBtn.innerHTML = buildOrbit();
    document.body.appendChild(dotBtn);
    dotBtn.addEventListener('pointerdown', onDown);
    dotBtn.addEventListener('pointermove', onMove);
    dotBtn.addEventListener('pointerup', onUp);
    dotBtn.addEventListener('pointercancel', onUp);
    dotBtn.addEventListener('mouseenter', () => { P.hoverT = 1; });
    dotBtn.addEventListener('mouseleave', () => { P.hoverT = 0; });
    dotBtn.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('pointerdown', e => {
      if (open && !panel.contains(e.target) && !dotBtn.contains(e.target)) closePanel();
    }, true);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) closePanel(); });
    tipEl = document.createElement('div');
    tipEl.id = 'bot-tip';
    tipEl.textContent = 'me pergunte sobre o evento';
    document.body.appendChild(tipEl);
    hintEl = document.createElement('div');
    hintEl.id = 'bot-hint';
    hintEl.setAttribute('aria-hidden', 'true');
    hintEl.textContent = 'clique e segure';
    hintEl.style.transform = 'translate(-50%,-100%)';
    document.body.appendChild(hintEl);
    panel = document.createElement('div');
    panel.id = 'bot-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat com o White Rabbit Bot do BSidesBSB');
    panel.innerHTML = '<div class="bot-head">' +
      '<span class="bot-status-dot" aria-hidden="true"></span>' +
      '<div class="bot-head-t"><strong>WHITE RABBIT BOT</strong><small>bsidesbsb@wonderland:~$ online</small></div>' +
      '<button type="button" id="bot-clear" aria-label="Limpar conversa" title="Limpar conversa">' + SVG_TRASH + '</button>' +
      '<button type="button" id="bot-close" aria-label="Fechar chat">' + SVG_X + '</button>' +
      '</div>' +
      '<div class="bot-msgs"></div>' +
      '<div class="bot-chips"></div>' +
      '<div class="bot-input-row">' +
      '<input id="bot-input" type="text" maxlength="500" autocomplete="off" placeholder="Pergunte sobre data, trilhas, CTF…">' +
      '<button type="button" id="bot-send" aria-label="Enviar mensagem">' + SVG_SEND + '</button>' +
      '</div>';
    document.body.appendChild(panel);
    msgsEl = panel.querySelector('.bot-msgs');
    input = panel.querySelector('#bot-input');
    sendBtn = panel.querySelector('#bot-send');
    panel.querySelector('#bot-close').addEventListener('click', closePanel);
    panel.querySelector('#bot-clear').addEventListener('click', () => {
      history = []; saveHist(); msgsEl.innerHTML = ''; renderChips();
      addMsg('msg--bot', QA.renderRich(QA.WELCOME));
      input.focus();
    });
    sendBtn.addEventListener('click', () => send());
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
    renderChips();
    restoreDock();
    requestAnimationFrame(loop);
    window.addEventListener('resize', () => {
      P.vw = Math.max(1, window.innerWidth);
      P.vh = Math.max(1, window.innerHeight);
      P.tx = edgeX(P.side);
      P.ty = clamp(P.ty, M, P.vh - M);
      P.y = clamp(P.y, M, P.vh - M);
      P.x = clamp(P.x, M, P.vw - M);
      dotBtn.setAttribute('aria-label', dotLabel());
      if (open) placePanel();
    }, { passive: true });
  }
  function entrance(){
    if (live) return;
    setTimeout(() => {
      live = true;
      P.enterT = 1;
      placeTip();
      if (tipEl) tipEl.textContent = isMobile() ? 'toque: topo · segure: menu + chat' : 'me pergunte sobre o evento';
      let shown = false, hintDone = false;
      try { shown = localStorage.getItem(LS_TIP) === '1'; } catch (e) {}
      try { hintDone = localStorage.getItem(LS_HINT) === '1'; } catch (e) {}
      if (isMobile() && hintEl && !hintDone) {
        setTimeout(() => {
          if (!open && !hintShown && hintEl) { hintShown = true; placeHint(); hintEl.classList.add('bot-hint-in'); }
        }, 1500);
      } else if (!shown) {
        setTimeout(() => {
          if (!open && tipEl) tipEl.classList.add('bot-tip-in');
          setTimeout(() => { if (tipEl) tipEl.classList.remove('bot-tip-in'); }, 6500);
        }, 1200);
      }
    }, 350);
  }
  function init(){
    buildUI();
    if (document.documentElement.classList.contains('loader-lock')) {
      document.addEventListener('bsb:loaded', entrance, { once: true });
      setTimeout(entrance, 4200);
    } else {
      entrance();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
