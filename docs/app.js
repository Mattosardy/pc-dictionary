/* Diccionario de Reparación — App estable (sin PWA) */

/* --------- Refs DOM --------- */
const V          = document.getElementById('view');
const Q          = document.getElementById('q');
const BTN_HOME   = document.getElementById('btn-home');
const BTN_ADMIN  = document.getElementById('btn-admin');
const F_WRAPPER  = document.getElementById('filters');
const F_NIVEL    = document.getElementById('f-nivel');
const F_RIESGO   = document.getElementById('f-riesgo');

/* --------- Estado --------- */
let DB = { departments: [], entries: [] };

/* --------- Carga segura de window.DB --------- */
function hydrateDB() {
  try {
    if (window && window.DB && Array.isArray(window.DB.departments)) {
      DB = window.DB;
      return true;
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

/* --------- Iconos y accesos rápidos --------- */
const ICONS = {
  almacenamiento: "💽", ram: "🧠", cpu: "🧩", gpu: "🎮",
  motherboard: "🧷", psu: "🔌", cooling: "🌀", network: "🌐",
  os: "🪟", security: "🛡️"
};
const QUICK = [
  { label: 'DiskPart clean + GPT',        id: 'almacenamiento-diskpart-clean-gpt' },
  { label: 'Reset Winsock/DNS',           id: 'network-stack-reset-dns' },
  { label: 'DDU (limpieza drivers GPU)',  id: 'gpu-ddu-driver-clean' },
  { label: 'TRIM SSD',                    id: 'almacenamiento-trim-ssd' },
  { label: 'Reparar BCD (bootrec)',       id: 'os-bootrec-reparar-arranque' },
  { label: 'Update atascado',             id: 'os-wupdate-reset-componentes' }
];
const CHIPS = ['diskpart','xmp','temperatura','ddu','winsock','dns','wifi','trim','nvme'];

/* --------- Estado de búsqueda + telemetría --------- */
let LAST_RESULTS = []; // se llena en el buscador
const STATS = {
  entryKey: (id)=> 't3_stats_entry_'+id,        // vistas por entrada
  queryKey:       't3_stats_queries'           // mapa {query:count}
};

function trackEntryView(id){
  try{
    const k = STATS.entryKey(id);
    const n = Number(localStorage.getItem(k) || '0') + 1;
    localStorage.setItem(k, String(n));
  }catch(_){}
}
function trackQuery(q){
  if(!q) return;
  try{
    const map = JSON.parse(localStorage.getItem(STATS.queryKey) || '{}');
    map[q] = (map[q]||0)+1;
    localStorage.setItem(STATS.queryKey, JSON.stringify(map));
  }catch(_){}
}
function getTopQueries(n=5){
  try{
    const map = JSON.parse(localStorage.getItem(STATS.queryKey) || '{}');
    return Object.entries(map)
      .sort((a,b)=>b[1]-a[1])
      .slice(0,n)
      .map(([q])=>q);
  }catch(_){ return []; }
}


/* --------- Validador de datos --------- */
function validateDB(){
  const errs = [];
  if(!DB || !Array.isArray(DB.departments)) errs.push("departments no es array");
  if(!Array.isArray(DB.entries)) errs.push("entries no es array");

  const ids = new Set();
  const deptIds = new Set((DB.departments||[]).map(d=>d.id));
  (DB.entries||[]).forEach(e=>{
    if(!e.id) errs.push("Entrada sin id");
    if(ids.has(e.id)) errs.push("ID duplicado: "+e.id);
    ids.add(e.id);
    if(!deptIds.has(e.departamento_id)) errs.push(`Depto inválido en ${e.id}: ${e.departamento_id}`);
  });

  if(errs.length){
    console.error("Validador DB:", errs);
    alert("Errores de datos:\n- " + errs.join("\n- "));
  }
}

/* --------- Router --------- */
function route(){
  const hash = location.hash.slice(1);
  if(!hash){ return renderHome(); }
  const [kind, id] = hash.split('/');
  if(kind==='dept')  return renderDept(id);
  if(kind==='entry') return renderEntry(id);
  if(kind==='faq')   return renderFAQ();
  return renderHome();
}

/* --------- Portada --------- */
function renderHome(){
  F_WRAPPER.style.display = 'none';

  const depts        = (DB.departments||[]);
  const totalEntries = (DB.entries||[]).length;

  const hero = `
    <div class="hero">
      <h1>Diccionario de Reparación — <span style="color:#2bb673">TelecomT3</span></h1>
      <div class="kpis">
        <div class="kpi"><b>${depts.length}</b> departamentos</div>
        <div class="kpi"><b>${totalEntries}</b> playbooks</div>
        <div class="kpi"><b>Offline</b> ready</div>
      </div>
            <div class="chips">
        ${[...new Set([...getTopQueries(5), ...CHIPS])].slice(0,10)
            .map(c=>`<span class="chip" onclick="setQuery('${c}')">#${c}</span>`).join('')}
      </div>
    </div>
    <div class="card" style="margin:12px 0">
      <div style="margin-bottom:6px"><b>Accesos rápidos</b></div>
      <div class="tools">${QUICK.map(q=>`<a class="tool-btn" href="#entry/${q.id}">${q.label}</a>`).join('')}</div>
    </div>
  `;

  const cards = depts.map(d=>`
    <div class="card">
      <div style="font-weight:700;margin-bottom:8px">
        <span class="badge-dept">${ICONS[d.id]||'📦'}</span>${d.nombre}
      </div>
      <a class="btn" href="#dept/${d.id}">Abrir</a>
    </div>
  `).join('');

  V.innerHTML = hero + `<div class="grid">${cards}</div>` + (depts.length ? '' :
    `<div class="card" style="margin:16px">
      <b>No hay departamentos cargados.</b><br>
      Verifica que <code>data.bundle.js</code> empiece con <code>window.DB = { ... }</code> y esté antes de <code>app.js</code>.
    </div>`);
}
function setQuery(q){ Q.value = q; Q.dispatchEvent(new Event('input')); }

/* --------- Departamento (con filtros + orden) --------- */
function renderDept(id){
  const dept     = (DB.departments||[]).find(d=>d.id===id);
  const listBase = (DB.entries||[]).filter(e=>e.departamento_id===id);

  F_WRAPPER.style.display = 'flex';
  F_NIVEL.value  = F_NIVEL.value  || '';
  F_RIESGO.value = F_RIESGO.value || '';

  // Orden: Básico → Intermedio → Avanzado; si empatan, por riesgo BAJO→ALTO y luego alfabético
  const ordenNivel  = { "básico":0, "basico":0, "intermedio":1, "avanzado":2 };
  const ordenRiesgo = { "bajo":0, "medio":1, "alto":2 };
  listBase.sort((a,b)=>{
    const na = ordenNivel[(a.nivel||"").toLowerCase()] ?? 9;
    const nb = ordenNivel[(b.nivel||"").toLowerCase()] ?? 9;
    if(na!==nb) return na-nb;
    const ra = ordenRiesgo[(a.riesgo||"").toLowerCase()] ?? 9;
    const rb = ordenRiesgo[(b.riesgo||"").toLowerCase()] ?? 9;
    if(ra!==rb) return ra-rb;
    return (a.problema||"").localeCompare(b.problema||"");
  });

  function applyFilters(){
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

  F_NIVEL.onchange = F_RIESGO.onchange = applyFilters;
  applyFilters();
}

/* --------- Entrada (detalle) --------- */
function renderEntry(id){
  F_WRAPPER.style.display = 'none';

  const e = (DB.entries||[]).find(x=>x.id===id);
  trackEntryView(id);
  if(!e){ V.innerHTML = '<div class="card" style="margin:16px">No encontrado</div>'; return; }

  const imgs = (e.imagenes && e.imagenes.length)
    ? `<div class="gallery">${e.imagenes.map(src=>`<img src="${src}" loading="lazy" alt="captura" onclick="openLB('${src}')">`).join('')}</div>`
    : '';

  const tools = (e.herramientas && e.herramientas.length)
    ? `<div class="tools">${e.herramientas.map(t=>`<a class="tool-btn" href="${t.url}" target="_blank" rel="noopener">${t.nombre}</a>`).join('')}</div>`
    : '';

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

      <div style="margin-top:10px">
        <button class="btn" onclick="copyCommands(${JSON.stringify(e.solucion||[])})">Copiar pasos</button>
        ${e.comandos?.length?`<button class="btn" onclick='copyCommands(${JSON.stringify(e.comandos||[])})'>Copiar comandos</button>`:''}
      </div>

      <!-- Comentarios (localStorage) -->
      <div class="card" style="margin-top:10px">
        <b>Comentarios</b>
        <textarea id="fb-${e.id}" rows="3" style="width:100%;background:#0d1a26;color:#dfe;border:1px solid #123;border-radius:8px;padding:8px" placeholder="Deja una nota técnica..."></textarea>
        <div style="margin-top:6px">
          <button class="btn" onclick="saveFB('${e.id}')">Guardar</button>
          <small id="fb-msg-${e.id}" style="margin-left:8px;opacity:.8"></small>
        </div>
        <div id="fb-list-${e.id}" style="margin-top:8px"></div>
      </div>
    </div>`;

  renderFB(e.id);
}

/* --------- Utilidades --------- */
function copyCommands(list){
  const txt = Array.isArray(list)?list.join('\n'):String(list||'');
  navigator.clipboard.writeText(txt).then(()=>alert('Copiado al portapapeles'));
}

/* Lightbox */
function openLB(src){
  const m = document.createElement('div');
  m.className = 'lb-mask';
  m.innerHTML = `<img class="lb-img" src="${src}" alt="preview">`;
  m.addEventListener('click', ()=> document.body.removeChild(m));
  document.body.appendChild(m);
}

/* Comentarios: guardar + render (localStorage) */
function saveFB(id){
  const k = 't3_fb_'+id;
  const ta = document.getElementById('fb-'+id);
  const msg = document.getElementById('fb-msg-'+id);
  if(!ta || !ta.value.trim()) return;
  const arr = JSON.parse(localStorage.getItem(k) || '[]');
  arr.unshift({ts: new Date().toISOString(), txt: ta.value.trim()});
  localStorage.setItem(k, JSON.stringify(arr));
  ta.value = '';
  msg.textContent = 'Guardado ✓';
  setTimeout(()=>msg.textContent='',1200);
  renderFB(id);
}
function renderFB(id){
  const k = 't3_fb_'+id;
  const list = JSON.parse(localStorage.getItem(k) || '[]');
  const el = document.getElementById('fb-list-'+id);
  if(!el) return;
  el.innerHTML = list.slice(0,10).map(i=>`
    <div class="entry">
      <small>${new Date(i.ts).toLocaleString()}</small>
      <div>${i.txt}</div>
    </div>`).join('') || '<small>Sin comentarios aún.</small>';
}

/* --------- Búsqueda simple --------- */
Q.addEventListener('input', ()=>{
  const q = Q.value.trim().toLowerCase();
  if(q) trackQuery(q);
  if(!q){ route(); return; }
    const results = (DB.entries||[]).filter(e=>{
    const tools = (e.herramientas||[]).map(h=>h.nombre).join(' ');
    return (e.problema||'').toLowerCase().includes(q) ||
           (e.causa||'').toLowerCase().includes(q) ||
           (e.tags||[]).join(' ').toLowerCase().includes(q) ||
           (e.solucion||[]).join(' ').toLowerCase().includes(q) ||
           tools.toLowerCase().includes(q);
  });
  LAST_RESULTS = results;

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

/* --------- Admin Lite: login + export --------- */
const ADMIN = {
  // Hash SHA-256 de la contraseña "t3admin" (cámbialo por el tuyo)
  hash: "72763fe305fcf07f73a3b87fd08f37409f6647cde4c42da84b762ebe030c3d61",
  unlocked: false
};
async function sha256Hex(str){
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function adminLogin(){
  const pw = prompt("Contraseña de Admin:");
  if(!pw) return;
  const h = await sha256Hex(pw);
  if(h === ADMIN.hash){
    ADMIN.unlocked = true;
    alert("Acceso concedido.");
    openAdminPanel();
  } else {
    alert("Contraseña incorrecta.");
  }
}
function openAdminPanel(){
  if(!ADMIN.unlocked) return alert("Autenticación requerida.");
  const panel = document.createElement('div');
  panel.style = "position:fixed;right:12px;bottom:12px;background:#0d1a26;border:1px solid #0f7a44;padding:12px;border-radius:12px;z-index:9999;min-width:280px";
  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <b>Panel Admin</b>
      <a href="#" onclick="document.body.removeChild(this.closest('div'));return false" class="btn">Cerrar</a>
    </div>
    <div class="tools" style="margin:0">
      <a class="tool-btn" href="#" onclick="quickAddEntry();return false">➕ Añadir entrada rápida</a>
      <a class="tool-btn" href="#" onclick="exportDataBundle();return false">⬇️ Exportar data.bundle.js</a>
    </div>
    <small style="opacity:.8;display:block;margin-top:6px">Sube el archivo exportado a <code>docs/data.bundle.js</code> en GitHub.</small>
  `;
  document.body.appendChild(panel);
}
function exportDataBundle(){
  const js = "window.DB = " + JSON.stringify(DB, null, 2) + ";\n";
  const blob = new Blob([js], {type:"application/javascript"});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "data.bundle.js";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
  alert("Archivo generado. Súbelo a docs/data.bundle.js en GitHub.");
}
function quickAddEntry(){
  if(!ADMIN.unlocked) return;
  const departamento_id = prompt("Departamento (almacenamiento/ram/cpu/gpu/motherboard/psu/cooling/network/os/security):");
  if(!departamento_id) return;
  const departamento = (DB.departments.find(d=>d.id===departamento_id)||{}).nombre || departamento_id;
  const problema   = prompt("Título del problema:");
  const causa      = prompt("Causa probable:");
  const nivel      = prompt("Nivel (Básico/Intermedio/Avanzado):","Básico");
  const riesgo     = prompt("Riesgo (BAJO/MEDIO/ALTO):","BAJO");
  const tiempo_min = Number(prompt("Tiempo estimado (min):","15")||15);

  const id = (departamento_id+"-"+(problema||"nuevo"))
              .toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'');

  const solucion = [ "Paso 1: ...", "Paso 2: ...", "Paso 3: ..." ];
  const entry = { id, departamento_id, departamento, problema, causa, solucion,
                  verificacion:[], riesgo, nivel, tiempo_min, tags:[], imagenes:[], herramientas:[] };

  DB.entries.push(entry);
  alert("Entrada agregada: " + id + ". Ahora exporta el data.bundle.js y súbelo a GitHub.");
  location.hash = "#entry/" + id;
  route();
}

/* --------- FAQ --------- */
function renderFAQ(){
  F_WRAPPER.style.display='none';
  const faq = [
    {q:"¿Puedo usar esto offline?", a:"Sí. Todo está embebido; si cargó una vez, queda en caché del navegador."},
    {q:"¿Cómo agrego un caso nuevo?", a:"Botón Admin → Añadir entrada rápida → Exportar data.bundle.js y subir a GitHub."},
    {q:"¿Cómo cambio la contraseña Admin?", a:"Genera un SHA-256 en la consola (helper en app.js) y sustituye ADMIN.hash."},
    {q:"¿Cómo reporto un error?", a:"Usa Comentarios en la entrada o abre un issue con el data.bundle exportado."}
  ];
  V.innerHTML = `
    <div class="card" style="margin:16px">
      <h3>Preguntas Frecuentes</h3>
      ${faq.map(i=>`<details><summary><b>${i.q}</b></summary><p>${i.a}</p></details>`).join('')}
      <div style="margin-top:10px"><a class="btn" href="#">Volver</a></div>
    </div>`;
}

/* --------- Atajos de teclado --------- */
// '/' o 'Ctrl+K' → enfocar búsqueda
window.addEventListener('keydown',(e)=>{
  // evitar capturar cuando estás escribiendo en inputs/textarea
  const tag = (document.activeElement?.tagName||'').toLowerCase();
  const typing = tag==='input' || tag==='textarea';
  if(!typing && (e.key==='/' || (e.ctrlKey && (e.key==='k' || e.key==='K')))){
    e.preventDefault();
    Q.focus();
    Q.select();
  }
  // Enter global → abre primer resultado si hay resultados visibles
  if(e.key==='Enter' && document.activeElement!==Q && LAST_RESULTS.length>0){
    location.hash = '#entry/' + LAST_RESULTS[0].id;
    route();
  }
});


/* --------- Listeners --------- */
BTN_HOME?.addEventListener('click', (e)=>{ e.preventDefault(); location.hash=''; route(); });
BTN_ADMIN?.addEventListener('click', (e)=>{ e.preventDefault(); ADMIN.unlocked ? openAdminPanel() : adminLogin(); });
window.addEventListener('hashchange', ()=>ensureDBThen(route));
window.addEventListener('load', ()=> ensureDBThen(()=>{ validateDB(); route(); }));
