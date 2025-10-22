/* App robusta con re-hidratación de DB */
const V = document.getElementById('view');
const Q = document.getElementById('q');
const BTN_HOME = document.getElementById('btn-home');
const F_WRAPPER = document.getElementById('filters');
const F_NIVEL   = document.getElementById('f-nivel');
const F_RIESGO  = document.getElementById('f-riesgo');


let DB = { departments: [], entries: [] };

function hydrateDB() {
  try {
    if (window && window.DB && Array.isArray(window.DB.departments)) {
      DB = window.DB; return true;
    }
  } catch(e){}
  return false;
}
function ensureDBThen(fn) {
  if (hydrateDB()) { fn(); return; }
  let tries = 0;
  const t = setInterval(() => {
    if (hydrateDB() || ++tries > 40) { clearInterval(t); fn(); }
  }, 50);
}

function route(){
  const hash = location.hash.slice(1);
  if(!hash){ return renderHome(); }
  const [kind, id] = hash.split('/');
  if(kind==='dept') return renderDept(id);
  if(kind==='entry') return renderEntry(id);
  return renderHome();
}

function renderHome(){
  const depts = (DB.departments||[]);
  const cards = depts.map(d=>`
    <div class="card">
      <div style="font-weight:700;margin-bottom:8px">${d.nombre}</div>
      <a class="btn" href="#dept/${d.id}">Abrir</a>
    </div>
  `).join('');
  V.innerHTML = `<div class="grid">${cards}</div>` + (depts.length ? '' :
    `<div class="card" style="margin:16px">
      <b>No hay departamentos cargados.</b><br>
      Verifica que <code>data.bundle.js</code> empiece con <code>window.DB = { ... }</code> y esté antes de <code>app.js</code>.
    </div>`);
}
function renderDept(id){
  const dept = (DB.departments||[]).find(d=>d.id===id);
  const listBase = (DB.entries||[]).filter(e=>e.departamento_id===id);

  // Mostrar contenedor de filtros
  F_WRAPPER.style.display = 'flex';

  // Normalizar valores actuales (si venís de otro depto)
  F_NIVEL.value  = F_NIVEL.value  || '';
  F_RIESGO.value = F_RIESGO.value || '';

  function applyFilters(){
    // Clonamos la lista original para no mutar
    let list = listBase.slice();

    const nv = (F_NIVEL.value||'').trim().toLowerCase();
    const rz = (F_RIESGO.value||'').trim().toLowerCase();

    if(nv) list = list.filter(e => String(e.nivel||'').toLowerCase().includes(nv));
    if(rz) list = list.filter(e => String(e.riesgo||'').toLowerCase().includes(rz));

    V.innerHTML = `
      <div class="card" style="margin:16px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><b>${dept?dept.nombre:id}</b> <small>(${list.length}/${listBase.length})</small></div>
          <a class="btn" href="#">Volver</a>
        </div>
      </div>
      <div class="list">
        ${list.map(e=>`
          <div class="entry">
            <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">
              <div><b>${e.problema}</b> <small>[${e.nivel} • ${e.riesgo}]</small></div>
              <a class="btn" href="#entry/${e.id}">Ver</a>
            </div>
            <small>${e.causa}</small>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Recalcular al cambiar selects
  F_NIVEL.onchange = F_RIESGO.onchange = applyFilters;

  // Primer render
  applyFilters();
}

function renderEntry(id){
  const e = (DB.entries||[]).find(x=>x.id===id);
  if(!e){ V.innerHTML = '<div class="card" style="margin:16px">No encontrado</div>'; return; }

  const imgs = (e.imagenes && e.imagenes.length)
  ? `<div class="gallery">${e.imagenes.map(src=>`<img src="${src}" loading="lazy" alt="captura" onclick="openLB('${src}')">`).join('')}</div>`
  : '';

  const tools = (e.herramientas&&e.herramientas.length)
    ? `<div class="tools">${e.herramientas.map(t=>`<a class="tool-btn" href="${t.url}" target="_blank" rel="noopener">${t.nombre}</a>`).join('')}</div>`:'';

  V.innerHTML = `
    <div class="card" style="margin:16px">
      <a class="btn" href="#dept/${e.departamento_id}">← Volver</a>
      <h3 style="margin:12px 0 6px 0">${e.problema}</h3>
      <small>${e.departamento} • ${e.nivel} • ${e.riesgo} • ${e.tiempo_min} min</small>
      ${imgs}
      <p style="margin-top:8px"><b>Causa probable:</b> ${e.causa}</p>
      <div><b>Solución directa:</b><pre>${(e.solucion||[]).join('\n')}</pre></div>
      ${e.verificacion?.length?`<div><b>Verificación:</b><pre>${e.verificacion.join('\n')}</pre></div>`:''}
      ${e.comandos?.length?`<div><b>Comandos:</b><pre>${e.comandos.join('\n')}</pre></div>`:''}
      ${tools?`<div style="margin-top:6px"><b>Herramientas gratuitas y seguras:</b>${tools}</div>`:''}
    </div>`;
}
function copyCommands(list){
  /* Lightbox */
function openLB(src){
  const m = document.createElement('div');
  m.className = 'lb-mask';
  m.innerHTML = `<img class="lb-img" src="${src}" alt="preview">`;
  m.addEventListener('click', ()=> document.body.removeChild(m));
  document.body.appendChild(m);
}

  const txt = Array.isArray(list)?list.join('\n'):String(list||'');
  navigator.clipboard.writeText(txt).then(()=>alert('Copiado al portapapeles'));
}

Q.addEventListener('input', ()=>{
  const q = Q.value.trim().toLowerCase();
  if(!q){ route(); return; }
  const results = (DB.entries||[]).filter(e=>{
    const tools = (e.herramientas||[]).map(h=>h.nombre).join(' ');
    return (e.problema||'').toLowerCase().includes(q) ||
           (e.causa||'').toLowerCase().includes(q) ||
           (e.tags||[]).join(' ').toLowerCase().includes(q) ||
           (e.solucion||[]).join(' ').toLowerCase().includes(q) ||
           tools.toLowerCase().includes(q);
  });
  V.innerHTML = `
    <div class="card" style="margin:16px"><div><b>Resultados</b> <small>(${results.length})</small></div></div>
    <div class="list">${results.map(e=>`
      <div class="entry">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><b>${e.problema}</b> <small>[${e.departamento}]</small></div>
          <a class="btn" href="#entry/${e.id}">Ver</a>
        </div>
        <small>${e.causa}</small>
      </div>`).join('')}
    </div>`;
});

BTN_HOME?.addEventListener('click', (e)=>{ e.preventDefault(); location.hash=''; route(); });
window.addEventListener('hashchange', ()=>ensureDBThen(route));
window.addEventListener('load', ()=> ensureDBThen(route));
