/* =========================================================
   MUNDIAL 2042 · HIELO ETERNO — app.js (v2.0)
   Aplicación web mejorada para gestión de torneos
   ========================================================= */

const ADMIN_KEY = "AURORA2042";
const MAX_IMAGE_MB = 2;
const MAX_IMAGE_SIZE = MAX_IMAGE_MB * 1024 * 1024;

/* ============ TEAM DATA ============ */
const TEAM_DATA = [
  // Group A
  {code:'ALE', name:'Alemania', flag:'🇩🇪', group:'A'},
  {code:'EEU', name:'Estados Unidos', flag:'🇺🇸', group:'A'},
  {code:'AUS', name:'Australia', flag:'🇦🇺', group:'A'},
  {code:'ECU', name:'Ecuador', flag:'🇪🇨', group:'A'},
  // Group B
  {code:'CON', name:'Congo', flag:'🇨🇩', group:'B'},
  {code:'JAP', name:'Japón', flag:'🇯🇵', group:'B'},
  {code:'PAR', name:'Paraguay', flag:'🇵🇾', group:'B'},
  {code:'DIN', name:'Dinamarca', flag:'🇩🇰', group:'B'},
  // Group C
  {code:'CRC', name:'Costa Rica', flag:'🇨🇷', group:'C'},
  {code:'ITA', name:'Italia', flag:'🇮🇹', group:'C'},
  {code:'CRO', name:'Croacia', flag:'🇭🇷', group:'C'},
  {code:'ARG', name:'Argentina', flag:'🇦🇷', group:'C'},
  // Group D
  {code:'CHI', name:'Chile', flag:'🇨🇱', group:'D'},
  {code:'BEL', name:'Bélgica', flag:'🇧🇪', group:'D'},
  {code:'FRA', name:'Francia', flag:'🇫🇷', group:'D'},
  {code:'PAN', name:'Panamá', flag:'🇵🇦', group:'D'},
  // Group E
  {code:'MAR', name:'Marruecos', flag:'🇲🇦', group:'E'},
  {code:'URU', name:'Uruguay', flag:'🇺🇾', group:'E'},
  {code:'BRA', name:'Brasil', flag:'🇧🇷', group:'E'},
  {code:'GEO', name:'Georgia', flag:'🇬🇪', group:'E'},
  // Group F
  {code:'CAB', name:'Cabo Verde', flag:'🇨🇻', group:'F'},
  {code:'POR', name:'Portugal', flag:'🇵🇹', group:'F'},
  {code:'BIH', name:'Bosnia y Herzegovina', flag:'🇧🇦', group:'F'},
  {code:'NOR', name:'Noruega', flag:'🇳🇴', group:'F'},
  // Group G
  {code:'EGI', name:'Egipto', flag:'🇪🇬', group:'G'},
  {code:'ESP', name:'España', flag:'🇪🇸', group:'G'},
  {code:'NED', name:'Países Bajos', flag:'🇳🇱', group:'G'},
  {code:'MEX', name:'México', flag:'🇲🇽', group:'G'},
  // Group H
  {code:'GHA', name:'Ghana', flag:'🇬🇭', group:'H'},
  {code:'ING', name:'Inglaterra', flag:'🏴', group:'H'},
  {code:'NGA', name:'Nigeria', flag:'🇳🇬', group:'H'},
  {code:'COL', name:'Colombia', flag:'🇨🇴', group:'H'},
];

const GROUP_LETTERS = ['A','B','C','D','E','F','G','H'];

const HISTORY = [
  {year:2022, host:'Colombia', flag:'🇨🇴', final:'2-0 Francia', third:null, balon:null, goleador:null, fairplay:null, star:1},
  {year:2026, host:'España', flag:'🇪🇸', final:'2-0 Francia', third:'Holanda 3-1 Paraguay', balon:null, goleador:null, fairplay:null, star:1},
  {year:2030, host:'Alemania', flag:'🇩🇪', final:'2-1 Francia', third:'EEUU 3-2 España', balon:null, goleador:null, fairplay:null, star:1},
  {year:2034, host:'España', flag:'🇪🇸', final:'3-2 Ghana', third:'Colombia 3-2 Mexico', balon:'Julian Alvarez', goleador:'Julian Alvarez', fairplay:'Ghana', star:2},
];

/* ============ STATE MANAGEMENT ============ */
function defaultState(){
  const matches = [];
  GROUP_LETTERS.forEach(g=>{
    const teams = TEAM_DATA.filter(t=>t.group===g).map(t=>t.code);
    for(let i=0;i<teams.length;i++){
      for(let j=i+1;j<teams.length;j++){
        matches.push({id:`${teams[i]}-${teams[j]}`, group:g, home:teams[i], away:teams[j], hs:null, as:null});
      }
    }
  });

  return {
    profile: {name:'DT IPFT', color:'#f2c230', desc:'Estratega polar. Cazador de auroras.', pronouns:'él/he', follows:'ARG', avatar:null, banner:null},
    settings: {grad1:'#7c5cff', grad2:'#0a1931', device:'desktop'},
    admin: {unlocked:false},
    matches,
    knockout: buildEmptyKnockout(),
    view: 'inicio',
  };
}

function buildEmptyKnockout(){
  const mk = (id)=>({id, homeName:null, awayName:null, hs:null, as:null});
  return {
    r16: [mk('P49'), mk('P50'), mk('P51'), mk('P52'), mk('P53'), mk('P54'), mk('P55'), mk('P56')],
    qf: [mk('QF1'), mk('QF2'), mk('QF3'), mk('QF4')],
    sf: [mk('SF1'), mk('SF2')],
    final: mk('FINAL'),
    bronze: mk('BRONZE'),
  };
}

let STATE = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem('mundial2042_state_v1');
    if(raw){
      const parsed = JSON.parse(raw);
      const base = defaultState();
      return Object.assign(base, parsed, {matches: parsed.matches || base.matches, knockout: parsed.knockout || base.knockout});
    }
  }catch(e){
    console.warn('Error loading state:', e);
  }
  return defaultState();
}

function saveState(){
  try{
    localStorage.setItem('mundial2042_state_v1', JSON.stringify(STATE));
    return true;
  }catch(e){
    console.error('Storage error:', e);
    return false;
  }
}

/* ============ UTILITY FUNCTIONS ============ */
function teamByCode(code){ return TEAM_DATA.find(t=>t.code===code); }
function teamLabel(code){ const t=teamByCode(code); return t ? `${t.flag} ${t.name}` : '???'; }
function teamFlag(code){ const t=teamByCode(code); return t ? t.flag : '🏳'; }
function teamName(code){ const t=teamByCode(code); return t ? t.name : '???'; }

/* ============ TOAST NOTIFICATIONS ============ */
function showToast(message, type='info', duration=3000) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ============ STANDINGS ============ */
function computeStandings(group){
  const teams = TEAM_DATA.filter(t=>t.group===group);
  const table = {};
  teams.forEach(t=> table[t.code] = {code:t.code, pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0});

  STATE.matches.filter(m=>m.group===group).forEach(m=>{
    if(m.hs===null || m.as===null || m.hs==='' || m.as==='') return;
    const hs = Number(m.hs), as = Number(m.as);
    const H = table[m.home], A = table[m.away];
    H.pj++; A.pj++; H.gf+=hs; H.gc+=as; A.gf+=as; A.gc+=hs;
    if(hs>as){ H.pg++; H.pts+=3; A.pp++; }
    else if(hs<as){ A.pg++; A.pts+=3; H.pp++; }
    else { H.pe++; A.pe++; H.pts++; A.pts++; }
  });

  return Object.values(table).sort((a,b)=>{
    if(b.pts!==a.pts) return b.pts-a.pts;
    const dgA = a.gf-a.gc, dgB = b.gf-b.gc;
    if(dgB!==dgA) return dgB-dgA;
    return b.gf-a.gf;
  });
}

function groupComplete(group){
  return STATE.matches.filter(m=>m.group===group).every(m=> m.hs!==null && m.as!==null && m.hs!=='' && m.as!=='');
}

function allGroupsComplete(){ return GROUP_LETTERS.every(groupComplete); }

function playedCount(){ return STATE.matches.filter(m=>m.hs!==null && m.as!==null && m.hs!=='' && m.as!=='').length; }

/* ============ ROUTER / RENDER ============ */
const content = document.getElementById('content');

function setView(view){
  STATE.view = view;
  saveState();
  document.querySelectorAll('.nav-item').forEach(b=> b.classList.toggle('active', b.dataset.view===view));
  document.querySelectorAll('.bn-item').forEach(b=> b.classList.toggle('active', b.dataset.view===view));
  render();
  window.scrollTo({top:0, behavior:'smooth'});
}

function render(){
  updateSideProgress();
  updateAdminDot();
  switch(STATE.view){
    case 'inicio': content.innerHTML = renderInicio(); break;
    case 'grupos': content.innerHTML = renderGrupos(); attachGrupoEvents(); break;
    case 'cuadro': content.innerHTML = renderCuadro(); attachCuadroEvents(); break;
    case 'fama': content.innerHTML = renderFama(); break;
    case 'ajustes': content.innerHTML = renderAjustes(); attachAjustesEvents(); break;
    case 'admin': content.innerHTML = renderAdmin(); attachAdminEvents(); break;
    default: content.innerHTML = renderInicio();
  }
}

function updateSideProgress(){
  const played = playedCount();
  const total = STATE.matches.length;
  document.getElementById('sideProgressText').textContent = `${played}/${total} Partidos`;
  document.getElementById('sideProgressFill').style.width = `${(played/total*100).toFixed(1)}%`;
}

function updateAdminDot(){
  const dot = document.getElementById('adminDot');
  dot.classList.toggle('off', false);
  dot.style.background = STATE.admin.unlocked ? 'var(--success)' : 'var(--gold)';
}

/* ============ RENDER: INICIO ============ */
function renderInicio(){
  const clasificados = GROUP_LETTERS.filter(groupComplete).length * 2;
  const played = playedCount();
  const total = STATE.matches.length;
  const progPercent = (played/total*100).toFixed(0);
  
  return `
    <div class="hero">
      <h1 class="page-title">
        <span>⛸ MUNDIAL 2042</span>
        <span class="badge highlight">Hielo Eterno</span>
      </h1>
      <p style="color:var(--muted); font-size:15px; margin:0 0 24px;">
        Torneo internacional de fútbol en la era glacial. Fase de grupos en curso.
      </p>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-label">Partidos</div>
        <div class="stat-value">${played}/${total}</div>
        <div class="stat-sub">Progreso: ${progPercent}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Grupos Completos</div>
        <div class="stat-value">${GROUP_LETTERS.filter(groupComplete).length}/8</div>
        <div class="stat-sub">Fase de Grupos</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Clasificados</div>
        <div class="stat-value">${clasificados}/16</div>
        <div class="stat-sub">A Cuartos</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Tu perfil</div>
        <div class="stat-value">${STATE.profile.name.substring(0,4)}</div>
        <div class="stat-sub"><a href="javascript:openProfile()" style="color:var(--teal); text-decoration:none;">Editar</a></div>
      </div>
    </div>
  `;
}

/* ============ RENDER: GRUPOS ============ */
function renderGrupos(){
  let html = `<div class="page-title">Fase de Grupos</div>`;
  
  GROUP_LETTERS.forEach(group=>{
    html += `<div style="margin-bottom:40px;">
      <h2 style="font-size:20px; margin:0 0 16px; font-family:var(--font-display); color:var(--gold);">Grupo ${group}</h2>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
        ${renderGroupMatches(group)}
      </div>
      <div style="margin-top:16px; padding-top:16px; border-top:1px solid var(--line);">
        <table style="width:100%; font-size:12px;">
          <thead>
            <tr style="color:var(--muted); font-family:var(--font-mono);">
              <th style="text-align:left; padding:8px 0;">Equipo</th>
              <th style="text-align:center; padding:8px;">PJ</th>
              <th style="text-align:center; padding:8px;">GF</th>
              <th style="text-align:center; padding:8px;">GC</th>
              <th style="text-align:center; padding:8px;">PTS</th>
            </tr>
          </thead>
          <tbody>
            ${computeStandings(group).map((t,i)=>`
              <tr style="border-top:1px solid var(--line);">
                <td style="padding:8px 0;"><strong>${i+1}. ${teamFlag(t.code)} ${teamName(t.code)}</strong></td>
                <td style="text-align:center; padding:8px;">${t.pj}</td>
                <td style="text-align:center; padding:8px;">${t.gf}</td>
                <td style="text-align:center; padding:8px;">${t.gc}</td>
                <td style="text-align:center; padding:8px; font-weight:700; color:var(--gold);">${t.pts}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  });
  
  return html;
}

function renderGroupMatches(group){
  return STATE.matches.filter(m=>m.group===group).map(m=>`
    <div style="background:var(--panel-2); border:1px solid var(--line); border-radius:var(--radius); padding:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div style="text-align:center;">
          <div style="font-weight:600; font-size:13px;">${teamFlag(m.home)} ${teamName(m.home)}</div>
        </div>
        <div style="font-family:var(--font-display); font-weight:700; font-size:20px; color:var(--teal);">
          ${m.hs !== null ? `${m.hs} - ${m.as}` : 'VS'}
        </div>
        <div style="text-align:center;">
          <div style="font-weight:600; font-size:13px;">${teamFlag(m.away)} ${teamName(m.away)}</div>
        </div>
      </div>
      <input type="text" data-match="${m.id}" data-score="home" placeholder="0" style="width:48%; padding:8px; font-size:14px; margin-right:4%;" value="${m.hs || ''}">
      <input type="text" data-match="${m.id}" data-score="away" placeholder="0" style="width:48%; padding:8px; font-size:14px;" value="${m.as || ''}">
    </div>
  `).join('');
}

function attachGrupoEvents(){
  document.querySelectorAll('input[data-match]').forEach(input=>{
    input.addEventListener('change', (e)=>{
      const matchId = e.target.dataset.match;
      const score = e.target.dataset.score;
      const value = e.target.value.trim();
      
      const match = STATE.matches.find(m=>m.id===matchId);
      if(match){
        if(score==='home') match.hs = value === '' ? null : value;
        else match.as = value === '' ? null : value;
        saveState();
        render();
      }
    });
  });
}

/* ============ RENDER: CUADRO ============ */
function renderCuadro(){
  return `<div class="page-title">Cuadro de Eliminación</div><p style="color:var(--muted);">Sección Cuadro - Próximamente</p>`;
}

function attachCuadroEvents(){}

/* ============ RENDER: FAMA ============ */
function renderFama(){
  return `
    <div class="page-title">Salón de la Fama</div>
    ${HISTORY.map(h=>`
      <div style="background:var(--panel-2); border:1px solid var(--line); border-radius:var(--radius); padding:20px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:start;">
          <div>
            <div style="font-size:14px; color:var(--muted); margin-bottom:4px;">MUNDIAL 🏆</div>
            <div style="font-family:var(--font-display); font-weight:700; font-size:24px; margin-bottom:8px;">${h.year}</div>
            <div style="font-size:14px; margin-bottom:6px;"><strong>Campeón:</strong> ${h.final}</div>
            ${h.third ? `<div style="font-size:12px; color:var(--muted);">Tercero: ${h.third}</div>` : ''}
          </div>
          <div style="text-align:right;">
            <div style="font-size:32px; margin-bottom:8px;">${h.flag}</div>
            <div style="color:var(--muted); font-size:12px;">Sede: ${h.host}</div>
          </div>
        </div>
      </div>
    `).join('')}
  `;
}

/* ============ RENDER: AJUSTES ============ */
function renderAjustes(){
  return `
    <div class="page-title">Ajustes</div>
    <div style="background:var(--panel-2); border:1px solid var(--line); border-radius:var(--radius); padding:20px; margin-bottom:16px;">
      <h3 style="font-size:16px; margin:0 0 14px; font-family:var(--font-display);">Colores & Tema</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div>
          <label style="display:block; font-family:var(--font-mono); font-size:10px; letter-spacing:1px; color:var(--muted); margin-bottom:8px; text-transform:uppercase;">Gradiente 1</label>
          <input type="color" id="settGrad1" value="${STATE.settings.grad1}" style="width:100%; height:50px; border:1px solid var(--line); border-radius:10px; cursor:pointer;">
        </div>
        <div>
          <label style="display:block; font-family:var(--font-mono); font-size:10px; letter-spacing:1px; color:var(--muted); margin-bottom:8px; text-transform:uppercase;">Gradiente 2</label>
          <input type="color" id="settGrad2" value="${STATE.settings.grad2}" style="width:100%; height:50px; border:1px solid var(--line); border-radius:10px; cursor:pointer;">
        </div>
      </div>
    </div>
    <button class="btn-primary" id="btnSaveTheme" style="width:100%;">Guardar Tema</button>
  `;
}

function attachAjustesEvents(){
  document.getElementById('btnSaveTheme').addEventListener('click', ()=>{
    STATE.settings.grad1 = document.getElementById('settGrad1').value;
    STATE.settings.grad2 = document.getElementById('settGrad2').value;
    document.documentElement.style.setProperty('--grad1', STATE.settings.grad1);
    document.documentElement.style.setProperty('--grad2', STATE.settings.grad2);
    saveState();
    showToast('Tema guardado ✓', 'success');
  });
}

/* ============ RENDER: ADMIN ============ */
function renderAdmin(){
  if(!STATE.admin.unlocked){
    return `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px;">
        <div style="background:var(--panel); border:1px solid var(--line); border-radius:var(--radius-lg); padding:40px; text-align:center; max-width:420px;">
          <div style="font-size:36px; margin-bottom:16px;">⛨</div>
          <h2 style="font-size:18px; margin-bottom:20px; font-family:var(--font-display);">Acceso de Administrador</h2>
          <input type="password" id="adminPassInput" placeholder="Ingresa código de acceso" style="width:100%; padding:12px; border:1px solid var(--line); background:var(--bg-void); color:var(--ice); border-radius:10px; text-align:center; letter-spacing:2px; margin-bottom:16px; font-family:var(--font-mono);">
          <button class="btn-primary full" id="btnUnlockAdmin">Desbloquear</button>
        </div>
      </div>
    `;
  }
  
  return `
    <div class="page-title">Panel Admin</div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px;">
      <div style="background:var(--panel); border:1px solid var(--line); border-radius:var(--radius); padding:20px;">
        <h3 style="font-family:var(--font-display); margin:0 0 8px; font-size:16px;">Gestión de Datos</h3>
        <p style="color:var(--muted); font-size:13px; line-height:1.6; margin:0 0 14px;">Descarga o reinicia el estado del torneo.</p>
        <button class="btn-secondary" id="btnExportData" style="width:100%; margin-bottom:8px;">📥 Exportar JSON</button>
        <button class="btn-danger" id="btnResetData" style="width:100%;">🔄 Reiniciar Todo</button>
      </div>
      <div style="background:var(--panel); border:1px solid var(--line); border-radius:var(--radius); padding:20px;">
        <h3 style="font-family:var(--font-display); margin:0 0 8px; font-size:16px;">Estado del Torneo</h3>
        <p style="color:var(--muted); font-size:13px; line-height:1.6; margin:0 0 14px;">Partidos jugados: ${playedCount()}/${STATE.matches.length}</p>
        <button class="btn-secondary" id="btnCheckDB" style="width:100%; margin-bottom:8px;">🔍 Ver Estado</button>
        <button class="btn-secondary" id="btnLogOut" style="width:100%;">🔒 Cerrar Sesión Admin</button>
      </div>
    </div>
  `;
}

function attachAdminEvents(){
  if(!STATE.admin.unlocked){
    document.getElementById('btnUnlockAdmin').addEventListener('click', ()=>{
      const pass = document.getElementById('adminPassInput').value;
      if(pass === ADMIN_KEY){
        STATE.admin.unlocked = true;
        saveState();
        render();
        showToast('Admin desbloqueado ✓', 'success');
      }else{
        showToast('Código incorrecto', 'error');
        document.getElementById('adminPassInput').value = '';
      }
    });
  }else{
    document.getElementById('btnExportData').addEventListener('click', exportData);
    document.getElementById('btnResetData').addEventListener('click', ()=>{
      if(confirm('¿Estás seguro? Esto borrará todo.')){
        STATE = defaultState();
        saveState();
        render();
        showToast('Datos reiniciados', 'success');
      }
    });
    document.getElementById('btnLogOut').addEventListener('click', ()=>{
      STATE.admin.unlocked = false;
      saveState();
      render();
      showToast('Sesión cerrada', 'success');
    });
  }
}

/* ============ EXPORT / DOWNLOAD ============ */
function exportData(){
  const json = JSON.stringify(STATE, null, 2);
  const blob = new Blob([json], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mundial2042_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Descargado ✓', 'success');
}

/* ============ PROFILE MODAL ============ */
const profileModal = document.getElementById('profileModal');
let pendingAvatar = undefined;
let pendingBanner = undefined;

function openProfile(){
  pendingAvatar = undefined;
  pendingBanner = undefined;
  document.getElementById('inName').value = STATE.profile.name;
  document.getElementById('inColor').value = STATE.profile.color;
  document.getElementById('inDesc').value = STATE.profile.desc;
  document.getElementById('inPronouns').value = STATE.profile.pronouns;
  const sel = document.getElementById('inFollows');
  sel.innerHTML = TEAM_DATA.map(t=>`<option value="${t.code}">${t.flag} ${t.name}</option>`).join('');
  sel.value = STATE.profile.follows;
  document.getElementById('inGrad1b').value = STATE.settings.grad1;
  document.getElementById('inGrad2b').value = STATE.settings.grad2;
  document.getElementById('inAvatarFile').value = '';
  document.getElementById('inBannerFile').value = '';
  refreshUploadUI();
  updatePreview();
  profileModal.classList.add('open');
  profileModal.setAttribute('aria-hidden', 'false');
}

function closeProfile(){
  profileModal.classList.remove('open');
  profileModal.setAttribute('aria-hidden', 'true');
}

function currentAvatarSrc(){
  return pendingAvatar !== undefined ? pendingAvatar : STATE.profile.avatar;
}

function currentBannerSrc(){
  return pendingBanner !== undefined ? pendingBanner : STATE.profile.banner;
}

function refreshUploadUI(){
  const avatarSrc = currentAvatarSrc();
  const bannerSrc = currentBannerSrc();

  const avatarLabelBtn = document.querySelector('label[for="inAvatarFile"]');
  const bannerLabelBtn = document.querySelector('label[for="inBannerFile"]');
  document.getElementById('avatarUploadLabel').textContent = avatarSrc ? 'Cambiar Avatar GIF' : 'Subir Avatar GIF';
  document.getElementById('bannerUploadLabel').textContent = bannerSrc ? 'Cambiar Banner GIF' : 'Subir Banner GIF';
  avatarLabelBtn.classList.toggle('has-image', !!avatarSrc);
  bannerLabelBtn.classList.toggle('has-image', !!bannerSrc);

  const hero = document.getElementById('profileHero');
  const heroAvatar = document.getElementById('profileHeroAvatar');
  hero.style.backgroundImage = bannerSrc ? `url(${bannerSrc})` : '';
  heroAvatar.style.backgroundImage = avatarSrc ? `url(${avatarSrc})` : '';

  const previewAvatar = document.getElementById('previewAvatar');
  previewAvatar.style.backgroundImage = avatarSrc ? `url(${avatarSrc})` : '';
}

function readImageFile(file, onDone){
  if(!file) return;
  if(!file.type.startsWith('image/')){ 
    showToast('Elegí un archivo de imagen', 'error');
    return;
  }
  if(file.size > MAX_IMAGE_SIZE){
    showToast(`Imagen muy pesada. Máximo ${MAX_IMAGE_MB}MB`, 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e)=> onDone(e.target.result);
  reader.onerror = ()=> showToast('Error al leer archivo', 'error');
  reader.readAsDataURL(file);
}

document.getElementById('inAvatarFile').addEventListener('change', (e)=>{
  readImageFile(e.target.files[0], (dataUrl)=>{
    pendingAvatar = dataUrl;
    refreshUploadUI();
  });
});

document.getElementById('inBannerFile').addEventListener('change', (e)=>{
  readImageFile(e.target.files[0], (dataUrl)=>{
    pendingBanner = dataUrl;
    refreshUploadUI();
  });
});

document.getElementById('clearAvatar').addEventListener('click', ()=>{
  pendingAvatar = null;
  document.getElementById('inAvatarFile').value = '';
  refreshUploadUI();
});

document.getElementById('clearBanner').addEventListener('click', ()=>{
  pendingBanner = null;
  document.getElementById('inBannerFile').value = '';
  refreshUploadUI();
});

function updatePreview(){
  const name = document.getElementById('inName').value || 'DT IPFT';
  const color = document.getElementById('inColor').value;
  const desc = document.getElementById('inDesc').value;
  const pronouns = document.getElementById('inPronouns').value;
  const follows = document.getElementById('inFollows').value;
  document.getElementById('previewName').textContent = name;
  document.getElementById('previewName').style.color = color;
  document.getElementById('previewPronouns').textContent = pronouns;
  document.getElementById('previewDesc').textContent = desc;
  document.getElementById('previewFollows').textContent = teamName(follows);
  const av = document.getElementById('previewAvatar');
  if(!currentAvatarSrc()) av.style.background = `linear-gradient(135deg, ${color}, #1a1400)`;
}

function bindProfileLiveUpdate(){
  ['inName','inColor','inDesc','inPronouns','inFollows'].forEach(id=>{
    document.getElementById(id).addEventListener('input', updatePreview);
  });
}

document.getElementById('btnAvatar').addEventListener('click', openProfile);
document.getElementById('closeProfile').addEventListener('click', closeProfile);
profileModal.addEventListener('click', (e)=>{ if(e.target===profileModal) closeProfile(); });

document.getElementById('saveProfile').addEventListener('click', ()=>{
  STATE.profile.name = document.getElementById('inName').value || 'DT IPFT';
  STATE.profile.color = document.getElementById('inColor').value;
  STATE.profile.desc = document.getElementById('inDesc').value;
  STATE.profile.pronouns = document.getElementById('inPronouns').value;
  STATE.profile.follows = document.getElementById('inFollows').value;
  if(pendingAvatar !== undefined) STATE.profile.avatar = pendingAvatar;
  if(pendingBanner !== undefined) STATE.profile.banner = pendingBanner;
  STATE.settings.grad1 = document.getElementById('inGrad1b').value;
  STATE.settings.grad2 = document.getElementById('inGrad2b').value;
  document.documentElement.style.setProperty('--grad1', STATE.settings.grad1);
  document.documentElement.style.setProperty('--grad2', STATE.settings.grad2);
  applyAvatar();
  const ok = saveState();
  closeProfile();
  if(ok === false){
    showToast('Perfil guardado pero imagen muy pesada', 'warning');
  }else{
    showToast('Perfil guardado ✓', 'success');
  }
  if(STATE.view==='ajustes') render();
});

function applyAvatar(){
  const initial = (STATE.profile.name||'D').trim().charAt(0).toUpperCase();
  document.getElementById('avatarInitial').textContent = initial || 'D';
  const btn = document.getElementById('btnAvatar');
  btn.style.borderColor = STATE.profile.color;
  if(STATE.profile.avatar){
    btn.style.backgroundImage = `url(${STATE.profile.avatar})`;
    btn.classList.add('has-image');
  }else{
    btn.style.backgroundImage = '';
    btn.classList.remove('has-image');
    btn.style.background = `linear-gradient(135deg, ${STATE.profile.color}, #1a1400)`;
  }
}

/* ============ DEVICE TOGGLE ============ */
function setDevice(device){
  STATE.settings.device = device;
  saveState();
  document.querySelector('.app').classList.toggle('force-mobile', device==='mobile');
  document.getElementById('btnMobile').classList.toggle('active', device==='mobile');
  document.getElementById('btnDesktop').classList.toggle('active', device==='desktop');
  document.getElementById('btnMobile').setAttribute('aria-pressed', device==='mobile');
  document.getElementById('btnDesktop').setAttribute('aria-pressed', device==='desktop');
}

/* ============ TOP BAR ACTIONS ============ */
document.getElementById('btnMobile').addEventListener('click', ()=> setDevice('mobile'));
document.getElementById('btnDesktop').addEventListener('click', ()=> setDevice('desktop'));

document.getElementById('btnShare').addEventListener('click', async ()=>{
  const text = `Mundial 2042 · Hielo Eterno — ${playedCount()}/${STATE.matches.length} partidos jugados. ¡Seguí el torneo!`;
  try{
    if(navigator.share){
      await navigator.share({title:'Mundial 2042', text});
      return;
    }
  }catch(e){ /* user cancelled */ }
  try{
    await navigator.clipboard.writeText(text);
    showToast('Copiado al portapapeles ✓', 'success');
  }catch(e){
    showToast(text, 'info');
  }
});

document.getElementById('btnDownload').addEventListener('click', exportData);

document.querySelectorAll('.nav-item, .bn-item').forEach(btn=>{
  btn.addEventListener('click', ()=> setView(btn.dataset.view));
});

/* ============ INIT ============ */
function init(){
  document.documentElement.style.setProperty('--grad1', STATE.settings.grad1);
  document.documentElement.style.setProperty('--grad2', STATE.settings.grad2);
  document.querySelector('.app').classList.toggle('force-mobile', STATE.settings.device==='mobile');
  document.getElementById('btnMobile').classList.toggle('active', STATE.settings.device==='mobile');
  document.getElementById('btnDesktop').classList.toggle('active', STATE.settings.device==='desktop');
  document.getElementById('btnMobile').setAttribute('aria-pressed', STATE.settings.device==='mobile');
  document.getElementById('btnDesktop').setAttribute('aria-pressed', STATE.settings.device==='desktop');
  applyAvatar();
  bindProfileLiveUpdate();
  render();
  console.log('🎮 Mundial 2042 initialized');
}

init();
