const tracks = [
  { key:'rabbit', name:'Coelho Branco', tag:'TRILHA 01', role:'KEYNOTE / TALK', accent:'#2dd7ff', bg:'url("assets/crops/city-skyline.jpg")', fig:'assets/crops/titlerabbit-hole.png', figPos:'50% 34%', figZoom:2.3, desc:'Keynotes e talks principais: as grandes ideias que abrem a toca e guiam a comunidade pelo buraco abaixo.', images:[1,2,3,4,5] },
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
      <div class="track-head"><span class="track-fig"><img src="${track.fig}"${track.figZoom ? ` class="fig-zoom" style="object-position:${track.figPos || 'center'};transform:scale(${track.figZoom})"` : ` style="object-position:${track.figPos || 'center'}"`} alt="Personagem da trilha ${track.name}" loading="lazy"></span><div class="track-no">${track.tag} · 5 POSIÇÕES</div></div>
      <h3>${track.name}</h3>
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
  const hide = () => {
    if (hidden) return;
    hidden = true;
    loader.classList.add('done');
    html.classList.remove('loader-lock');
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
  const minTime = new Promise(r => setTimeout(r, reduced ? 500 : 2300));
  if (document.readyState === 'complete') minTime.then(hide);
  else window.addEventListener('load', () => minTime.then(hide));
  setTimeout(hide, 5600);
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
