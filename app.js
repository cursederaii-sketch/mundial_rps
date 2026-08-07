/* =========================================================
   MUNDIAL 2042 · HIELO ETERNO — app.js
   ========================================================= */

const ADMIN_KEY = "AURORA2042";

/* ISO country codes for real flag images (flagcdn.com) — fixes flags not
   rendering on Windows/Chrome, where flag emoji show as empty boxes. */
const ISO_MAP = {
  ALE:'de', EEU:'us', AUS:'au', ECU:'ec',
  CON:'cd', JAP:'jp', PAR:'py', DIN:'dk',
  CRC:'cr', ITA:'it', CRO:'hr', ARG:'ar',
  CHI:'cl', BEL:'be', FRA:'fr', PAN:'pa',
  MAR:'ma', URU:'uy', BRA:'br', GEO:'ge',
  CAB:'cv', POR:'pt', BIH:'ba', NOR:'no',
  EGI:'eg', ESP:'es', NED:'nl', MEX:'mx',
  GHA:'gh', ING:'gb-eng', NGA:'ng', COL:'co',
};

function flagImgIso(iso, size, alt){
  size = size || 'w40';
  if(!iso) return '<span class="flag-fallback">🏳</span>';
  return `<img class="flag-ico" src="https://flagcdn.com/${size}/${iso}.png" alt="${alt||''}" loading="lazy">`;
}
function flagImg(code, size){
  const iso = ISO_MAP[code];
  const t = teamByCode(code);
  return flagImgIso(iso, size, t?t.name:code);
}
function flagByName(name, size){
  const t = TEAM_DATA.find(x=>x.name===name);
  return t ? flagImg(t.code, size) : '<span class="flag-fallback">🏳</span>';
}

/* Extra countries that appear in historical/fictional data but aren't part
   of the current 32-team roster, plus a couple of common aliases. */
const EXTRA_ISO = {
  'Canadá':'ca', 'Suiza':'ch', 'Polonia':'pl', 'Holanda':'nl',
  'EEUU':'us', 'Corea del Sur':'kr', 'Senegal':'sn', 'Serbia':'rs',
};
function isoForName(name){
  const t = TEAM_DATA.find(x=>x.name===name);
  if(t) return ISO_MAP[t.code];
  if(EXTRA_ISO[name]) return EXTRA_ISO[name];
  return null;
}
function flagByCountryName(name, size){ return flagImgIso(isoForName(name), size, name); }

const TEAM_DATA = [
  // group A
  {code:'ALE', name:'Alemania', flag:'🇩🇪', group:'A'},
  {code:'EEU', name:'Estados Unidos', flag:'🇺🇸', group:'A'},
  {code:'AUS', name:'Australia', flag:'🇦🇺', group:'A'},
  {code:'ECU', name:'Ecuador', flag:'🇪🇨', group:'A'},
  // group B
  {code:'CON', name:'Congo', flag:'🇨🇩', group:'B'},
  {code:'JAP', name:'Japón', flag:'🇯🇵', group:'B'},
  {code:'PAR', name:'Paraguay', flag:'🇵🇾', group:'B'},
  {code:'DIN', name:'Dinamarca', flag:'🇩🇰', group:'B'},
  // group C
  {code:'CRC', name:'Costa Rica', flag:'🇨🇷', group:'C'},
  {code:'ITA', name:'Italia', flag:'🇮🇹', group:'C'},
  {code:'CRO', name:'Croacia', flag:'🇭🇷', group:'C'},
  {code:'ARG', name:'Argentina', flag:'🇦🇷', group:'C'},
  // group D
  {code:'CHI', name:'Chile', flag:'🇨🇱', group:'D'},
  {code:'BEL', name:'Bélgica', flag:'🇧🇪', group:'D'},
  {code:'FRA', name:'Francia', flag:'🇫🇷', group:'D'},
  {code:'PAN', name:'Panamá', flag:'🇵🇦', group:'D'},
  // group E
  {code:'MAR', name:'Marruecos', flag:'🇲🇦', group:'E'},
  {code:'URU', name:'Uruguay', flag:'🇺🇾', group:'E'},
  {code:'BRA', name:'Brasil', flag:'🇧🇷', group:'E'},
  {code:'GEO', name:'Georgia', flag:'🇬🇪', group:'E'},
  // group F
  {code:'CAB', name:'Cabo Verde', flag:'🇨🇻', group:'F'},
  {code:'POR', name:'Portugal', flag:'🇵🇹', group:'F'},
  {code:'BIH', name:'Bosnia y Herzegovina', flag:'🇧🇦', group:'F'},
  {code:'NOR', name:'Noruega', flag:'🇳🇴', group:'F'},
  // group G
  {code:'EGI', name:'Egipto', flag:'🇪🇬', group:'G'},
  {code:'ESP', name:'España', flag:'🇪🇸', group:'G'},
  {code:'NED', name:'Países Bajos', flag:'🇳🇱', group:'G'},
  {code:'MEX', name:'México', flag:'🇲🇽', group:'G'},
  // group H
  {code:'GHA', name:'Ghana', flag:'🇬🇭', group:'H'},
  {code:'ING', name:'Inglaterra', flag:'🏴', group:'H'},
  {code:'NGA', name:'Nigeria', flag:'🇳🇬', group:'H'},
  {code:'COL', name:'Colombia', flag:'🇨🇴', group:'H'},
];

const GROUP_LETTERS = ['A','B','C','D','E','F','G','H'];

const HISTORY = [
  {year:2022, champion:'Colombia', runnerUp:'Francia', finalScore:[2,0], third:'Croacia', fourth:'Marruecos', thirdScore:[2,1], balon:null, goleador:null, fairplay:null},
  {year:2026, champion:'España', runnerUp:'Francia', finalScore:[2,0], third:'Holanda', fourth:'Paraguay', thirdScore:[3,1], balon:null, goleador:null, fairplay:null,
    group:{label:'GRUPO B', teams:[
      {name:'España', pj:3,g:2,e:1,p:0,gf:7,gc:2,pts:7},
      {name:'Japón', pj:3,g:1,e:1,p:1,gf:4,gc:3,pts:4},
      {name:'Costa Rica', pj:3,g:1,e:1,p:1,gf:3,gc:4,pts:4},
      {name:'Nigeria', pj:3,g:0,e:1,p:2,gf:2,gc:7,pts:1},
    ]}},
  {year:2030, champion:'Alemania', runnerUp:'Francia', finalScore:[2,1], third:'Estados Unidos', fourth:'España', thirdScore:[3,2], balon:null, goleador:null, fairplay:null},
  {year:2034, champion:'España', runnerUp:'Ghana', finalScore:[3,2], third:'Colombia', fourth:'México', thirdScore:[3,2], balon:'Julian Alvarez', goleador:'Julian Alvarez', fairplay:'Ghana'},
  {year:2038, champion:'Argentina', runnerUp:'Inglaterra', finalScore:[3,0], third:'Costa Rica', fourth:'Uruguay', thirdScore:[3,1], balon:'Nico Paz', goleador:'Nico Paz', fairplay:'Argentina',
    group:{label:'GRUPO F', teams:[
      {name:'Argentina', pj:3,g:2,e:1,p:0,gf:7,gc:2,pts:7},
      {name:'Croacia', pj:3,g:2,e:1,p:0,gf:6,gc:2,pts:7},
      {name:'Japón', pj:3,g:1,e:0,p:2,gf:3,gc:5,pts:3},
      {name:'Canadá', pj:3,g:0,e:0,p:3,gf:3,gc:8,pts:0},
    ]},
    /* Bracket matches the official IPFT World Cup 2038 poster exactly:
       Argentina's road was Senegal -> Italia -> Costa Rica -> Inglaterra (3-0),
       and Costa Rica beat Uruguay 3-1 for third place. */
    bracket:{
      r16:[
        ['Holanda',2,'Bélgica',1], ['Uruguay',2,'Colombia',0],
        ['Inglaterra',3,'Australia',1], ['Egipto',1,'Japón',0],
        ['Costa Rica',2,'España',1], ['Croacia',2,'Corea del Sur',0],
        ['Argentina',3,'Senegal',1], ['Italia',2,'Portugal',1],
      ],
      qf:[
        ['Uruguay',1,'Holanda',0], ['Inglaterra',2,'Egipto',1],
        ['Costa Rica',1,'Croacia',0], ['Argentina',2,'Italia',0],
      ],
      sf:[
        ['Inglaterra',2,'Uruguay',1], ['Argentina',3,'Costa Rica',1],
      ],
    }},
];

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
    profile:{name:'DT IPFT', color:'#f2c230', desc:'Estratega polar. Cazador de auroras.', pronouns:'él/he', follows:'ARG', avatar:null, banner:null},
    settings:{grad1:'#7c5cff', grad2:'#0a1931', device:'desktop'},
    admin:{unlocked:false},
    matches,
    knockout: buildEmptyKnockout(),
    view:'inicio',
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
      // merge with defaults to survive schema changes
      const base = defaultState();
      return Object.assign(base, parsed, {matches: parsed.matches || base.matches, knockout: parsed.knockout || base.knockout});
    }
  }catch(e){ /* ignore */ }
  return defaultState();
}

function saveState(){
  try{
    localStorage.setItem('mundial2042_state_v1', JSON.stringify(STATE));
    return true;
  }catch(e){
    return false; // storage unavailable or quota exceeded (e.g. GIF too heavy)
  }
}

function teamByCode(code){ return TEAM_DATA.find(t=>t.code===code); }
function teamLabel(code){ const t=teamByCode(code); return t ? `<span class="inline-flag">${flagImg(code,'w40')}</span> ${t.name}` : '???'; }
function teamFlag(code){ return flagImg(code,'w40'); }
function teamName(code){ const t=teamByCode(code); return t ? t.name : '???'; }

/* ---------------- Standings ---------------- */
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

/* ---------------- Router / Render ---------------- */
const content = document.getElementById('content');

function setView(view){
  STATE.view = view;
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
    case 'fama': content.innerHTML = renderFama(); attachFamaEvents(); break;
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

/* ---------------- INICIO ---------------- */
function renderInicio(){
  const clasificados = GROUP_LETTERS.filter(groupComplete).length * 2;
  const played = playedCount();
  const groupsHtml = GROUP_LETTERS.slice(0,4).map(g=>{
    const st = computeStandings(g);
    return `
    <div class="panel">
      <div class="panel-head">
        <div class="panel-title">Grupo ${g}</div>
        <span class="badge ${groupComplete(g)?'on':''}">${groupComplete(g)?'Completo':'Pendiente'}</span>
      </div>
      <table>
        <tbody>
        ${st.map(r=>`<tr><td class="team-cell"><span class="flag">${teamFlag(r.code)}</span>${teamName(r.code)}</td><td class="num pts-cell">${r.pts} pts</td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  }).join('');

  return `
  <div class="hero">
    <h1>BIENVENIDO AL <span>HIELO ETERNO</span></h1>
    <p>Mundial 2042 se juega en estadios climatizados bajo auroras. 32 naciones, -12°C, gloria infinita. Administra resultados, vive el cuadro, honra la historia.</p>
  </div>

  <div class="stat-grid">
    <div class="stat-card"><div class="stat-value">32</div><div class="stat-label">Equipos</div></div>
    <div class="stat-card"><div class="stat-value">8</div><div class="stat-label">Grupos</div></div>
    <div class="stat-card"><div class="stat-value">${clasificados}</div><div class="stat-label">Clasificados</div></div>
    <div class="stat-card"><div class="stat-value">${played}/${STATE.matches.length}</div><div class="stat-label">Partidos jugados</div></div>
  </div>

  <div class="page-title" style="font-size:20px;margin-bottom:14px;">Vista rápida de grupos</div>
  <div class="group-preview-grid">${groupsHtml}</div>
  `;
}

/* ---------------- GRUPOS ---------------- */
function renderGrupos(){
  const editable = STATE.admin.unlocked;
  const groupsHtml = GROUP_LETTERS.map(g=>{
    const st = computeStandings(g);
    const matches = STATE.matches.filter(m=>m.group===g);
    return `
    <div class="panel">
      <div class="panel-head">
        <div class="panel-title">Grupo ${g}</div>
        <span class="badge ${groupComplete(g)?'on':''}">${groupComplete(g)?'✓ Completo':'Pendiente'}</span>
      </div>
      <table>
        <thead><tr>
          <th>Equipo</th><th class="num">PJ</th><th class="num">PG</th><th class="num">PE</th><th class="num">PP</th><th class="num">GF</th><th class="num">GC</th><th class="num">PTS</th>
        </tr></thead>
        <tbody>
        ${st.map((r,i)=>`<tr class="${i<2?'qualified':''}">
          <td class="team-cell"><span class="flag">${teamFlag(r.code)}</span>${teamName(r.code)}</td>
          <td class="num">${r.pj}</td><td class="num">${r.pg}</td><td class="num">${r.pe}</td><td class="num">${r.pp}</td>
          <td class="num">${r.gf}</td><td class="num">${r.gc}</td><td class="num pts-cell">${r.pts}</td>
        </tr>`).join('')}
        </tbody>
      </table>
      <div class="match-list">
        ${matches.map(m=>`
          <div class="match-row" data-match="${m.id}">
            <div class="match-team"><span class="flag">${teamFlag(m.home)}</span>${teamName(m.home)}</div>
            <div class="score-box">
              <input class="score-input" type="number" min="0" max="20" data-side="hs" data-id="${m.id}" value="${m.hs??''}" placeholder="-" ${editable?'':'disabled'}>
              <span class="vs-label">VS</span>
              <input class="score-input" type="number" min="0" max="20" data-side="as" data-id="${m.id}" value="${m.as??''}" placeholder="-" ${editable?'':'disabled'}>
            </div>
            <div class="match-team right">${teamName(m.away)}<span class="flag">${teamFlag(m.away)}</span></div>
          </div>
        `).join('')}
      </div>
    </div>`;
  }).join('');

  return `
  <h1 class="page-title">Fase de Grupos ${editable?'':'<span class="badge">MODO TV</span>'}</h1>
  <div class="group-preview-grid">${groupsHtml}</div>
  `;
}

function attachGrupoEvents(){
  content.querySelectorAll('.score-input').forEach(inp=>{
    inp.addEventListener('input', (e)=>{
      const id = e.target.dataset.id, side = e.target.dataset.side;
      const m = STATE.matches.find(mm=>mm.id===id);
      const val = e.target.value;
      m[side] = val === '' ? null : Math.max(0, Math.min(20, Number(val)));
      saveState();
      updateSideProgress();
    });
  });
}

/* ---------------- CUADRO ELIMINACIÓN ---------------- */
function bTeamRow(m, side){
  const name = side==='home' ? m.homeName : m.awayName;
  const score = side==='home' ? m.hs : m.as;
  const otherScore = side==='home' ? m.as : m.hs;
  const isWinner = (score!==null && otherScore!==null && score!=='' && otherScore!=='' && Number(score)>Number(otherScore));
  const label = name ? teamLabel(name) : '???';
  const editable = STATE.admin.unlocked && name;
  return `<div class="bteam ${isWinner?'winner':''}">
    <span class="tname">${label}</span>
    <input class="bscore" type="number" min="0" max="20" data-match="${m.id}" data-side="${side}" value="${score??''}" placeholder="-" ${editable?'':'disabled'}>
  </div>`;
}

function renderCuadro(){
  const K = STATE.knockout;
  const editable = STATE.admin.unlocked;

  const col = (label, items) => `
    <div class="bracket-col">
      <div class="bcol-label">${label}</div>
      ${items.map(m=>`<div class="bmatch">${bTeamRow(m,'home')}${bTeamRow(m,'away')}</div>`).join('')}
    </div>`;

  const champion = (K.final.hs!==null && K.final.as!==null && K.final.hs!=='' && K.final.as!=='')
    ? (Number(K.final.hs)>Number(K.final.as) ? K.final.homeName : (Number(K.final.as)>Number(K.final.hs) ? K.final.awayName : null))
    : null;

  return `
  <h1 class="page-title">Cuadro de Eliminación ${editable?'':'<span class="badge">MODO TV</span>'}</h1>
  <div class="panel">
    <div class="bracket-actions">
      <button class="btn-primary" id="genBracket" ${editable?'':'disabled'}>Generar cuadro desde grupos</button>
      <button class="btn-secondary" id="resetBracket" ${editable?'':'disabled'}>Vaciar cuadro</button>
    </div>
    <div class="bracket-wrap">
      <div class="bracket">
        ${col('Ronda de 16 · P49-P52', [K.r16[0],K.r16[1],K.r16[2],K.r16[3]])}
        ${col('Cuartos', [K.qf[0],K.qf[1]])}
        <div class="bracket-col">
          <div class="bcol-label">Semifinal</div>
          <div class="bmatch">${bTeamRow(K.sf[0],'home')}${bTeamRow(K.sf[0],'away')}</div>
        </div>
        <div class="bracket-col">
          <div class="champion-box">
            <div class="champion-label">WORLD CHAMPION</div>
            <div class="champion-name">${champion ? teamLabel(champion) : '???'}</div>
          </div>
          <div class="bmatch">
            <div class="bcol-label" style="margin:8px 0 0;">Final</div>
            ${bTeamRow(K.final,'home')}${bTeamRow(K.final,'away')}
          </div>
          <div class="trophy">🏆</div>
          <div class="bronze-box">
            <div class="bronze-label">TERCER PUESTO</div>
            ${bTeamRow(K.bronze,'home')}${bTeamRow(K.bronze,'away')}
          </div>
        </div>
        <div class="bracket-col">
          <div class="bcol-label">Semifinal</div>
          <div class="bmatch">${bTeamRow(K.sf[1],'home')}${bTeamRow(K.sf[1],'away')}</div>
        </div>
        ${col('Cuartos', [K.qf[2],K.qf[3]])}
        ${col('Ronda de 16 · P53-P56', [K.r16[4],K.r16[5],K.r16[6],K.r16[7]])}
      </div>
    </div>
    <p style="padding:0 20px 20px;color:var(--muted);font-size:12px;">Todo en ??? hasta terminar grupos · Estilo oficial Hielo Eterno.</p>
  </div>
  `;
}

function attachCuadroEvents(){
  content.querySelectorAll('.bscore').forEach(inp=>{
    inp.addEventListener('input', (e)=>{
      const id = e.target.dataset.match, side = e.target.dataset.side;
      const m = findKnockoutMatch(id);
      const val = e.target.value;
      m[side] = val === '' ? null : Math.max(0, Math.min(20, Number(val)));
      propagateBracket();
      saveState();
      render();
    });
  });
  const genBtn = document.getElementById('genBracket');
  if(genBtn) genBtn.addEventListener('click', generateBracketFromGroups);
  const resetBtn = document.getElementById('resetBracket');
  if(resetBtn) resetBtn.addEventListener('click', ()=>{
    if(confirm('¿Vaciar todo el cuadro de eliminación?')){
      STATE.knockout = buildEmptyKnockout();
      saveState(); render();
    }
  });
}

function findKnockoutMatch(id){
  const K = STATE.knockout;
  return [...K.r16, ...K.qf, ...K.sf, K.final, K.bronze].find(m=>m.id===id);
}

function matchWinner(m){
  if(m.hs===null||m.as===null||m.hs===''||m.as==='') return null;
  const hs=Number(m.hs), as=Number(m.as);
  if(hs>as) return m.homeName;
  if(as>hs) return m.awayName;
  return null;
}
function matchLoser(m){
  if(m.hs===null||m.as===null||m.hs===''||m.as==='') return null;
  const hs=Number(m.hs), as=Number(m.as);
  if(hs>as) return m.awayName;
  if(as>hs) return m.homeName;
  return null;
}

function propagateBracket(){
  const K = STATE.knockout;
  // r16 -> qf  (P49+P50 -> QF1, P51+P52 -> QF2, P53+P54 -> QF3, P55+P56 -> QF4)
  const pairs = [[0,1,0],[2,3,1],[4,5,2],[6,7,3]];
  pairs.forEach(([a,b,qi])=>{
    K.qf[qi].homeName = matchWinner(K.r16[a]);
    K.qf[qi].awayName = matchWinner(K.r16[b]);
  });
  // qf -> sf
  K.sf[0].homeName = matchWinner(K.qf[0]);
  K.sf[0].awayName = matchWinner(K.qf[1]);
  K.sf[1].homeName = matchWinner(K.qf[2]);
  K.sf[1].awayName = matchWinner(K.qf[3]);
  // sf -> final / bronze
  K.final.homeName = matchWinner(K.sf[0]);
  K.final.awayName = matchWinner(K.sf[1]);
  K.bronze.homeName = matchLoser(K.sf[0]);
  K.bronze.awayName = matchLoser(K.sf[1]);
  checkChampionCelebration();
}

function checkChampionCelebration(){
  const champ = matchWinner(STATE.knockout.final);
  if(champ && !STATE._celebrated){
    STATE._celebrated = true;
    fireConfetti();
  }else if(!champ){
    STATE._celebrated = false;
  }
}

function fireConfetti(){
  if(typeof confetti !== 'function') return;
  const colors = ['#2dd9c0', '#8b6bff', '#f2c230', '#45a8ff'];
  const duration = 2200;
  const end = Date.now() + duration;
  (function frame(){
    confetti({ particleCount: 4, angle: 60, spread: 65, origin:{x:0}, colors });
    confetti({ particleCount: 4, angle: 120, spread: 65, origin:{x:1}, colors });
    if(Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount: 120, spread: 100, origin:{y:0.5}, colors, startVelocity: 45 });
}

function generateBracketFromGroups(){
  const winners = {}, runnersup = {};
  GROUP_LETTERS.forEach(g=>{
    const st = computeStandings(g);
    winners[g] = st[0].code;
    runnersup[g] = st[1].code;
  });
  const K = buildEmptyKnockout();
  // Left side: groups A B C D
  K.r16[0].homeName = winners['A']; K.r16[0].awayName = runnersup['B']; // P49
  K.r16[1].homeName = winners['C']; K.r16[1].awayName = runnersup['D']; // P50
  K.r16[2].homeName = winners['B']; K.r16[2].awayName = runnersup['A']; // P51
  K.r16[3].homeName = winners['D']; K.r16[3].awayName = runnersup['C']; // P52
  // Right side: groups E F G H
  K.r16[4].homeName = winners['E']; K.r16[4].awayName = runnersup['F']; // P53
  K.r16[5].homeName = winners['G']; K.r16[5].awayName = runnersup['H']; // P54
  K.r16[6].homeName = winners['F']; K.r16[6].awayName = runnersup['E']; // P55
  K.r16[7].homeName = winners['H']; K.r16[7].awayName = runnersup['G']; // P56
  STATE.knockout = K;
  propagateBracket();
  saveState();
  render();
  if(!allGroupsComplete()){
    alert('Nota: algunos grupos aún no terminaron. El cuadro se armó con las posiciones actuales y puede cambiar.');
  }
}

/* ---------------- SALÓN DE LA FAMA ---------------- */

/* Deterministic PRNG so generated (fictional) brackets/groups stay stable
   across re-renders instead of reshuffling on every click. */
function seededRandom(seed){
  let t = seed >>> 0;
  return function(){
    t |= 0; t = (t + 0x6D2B79F5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffledPool(seed, exclude){
  const rng = seededRandom(seed);
  const pool = TEAM_DATA.map(t=>t.name).filter(n=> !exclude.includes(n));
  for(let i=pool.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
  return {pool, rng};
}
function winScore(rng){ const w=1+Math.floor(rng()*3); const l=Math.max(0,w-1-Math.floor(rng()*2)); return [w,l]; }

function generateGroupTable(year, championName){
  const {pool} = shuffledPool(year*3+1, [championName]);
  const fillers = pool.slice(0,3);
  const letter = String.fromCharCode(65 + (year % 8));
  return {label:`GRUPO ${letter}`, teams:[
    {name:championName, pj:3,g:2,e:1,p:0,gf:7,gc:2,pts:7},
    {name:fillers[0], pj:3,g:1,e:1,p:1,gf:4,gc:3,pts:4},
    {name:fillers[1], pj:3,g:1,e:1,p:1,gf:3,gc:4,pts:4},
    {name:fillers[2], pj:3,g:0,e:1,p:2,gf:2,gc:7,pts:1},
  ]};
}

function generateBracket(year, championName, runnerUpName, finalScore, thirdName, fourthName, thirdScore){
  const exclude = [championName, runnerUpName, thirdName, fourthName].filter(Boolean);
  const {pool, rng} = shuffledPool(year*11+5, exclude);
  const f = pool.slice(0,12);
  thirdName = thirdName || f[10];
  fourthName = fourthName || f[11];

  const m = (a,b)=>{ const [w,l]=winScore(rng); return rng()<0.5 ? [a,w,b,l] : [b,l,a,w]; };
  // force a name to win a match against a filler
  const win = (winner, loser)=>{ const [w,l]=winScore(rng); return [winner,w,loser,l]; };

  const r16 = [
    win(championName, f[0]), m(f[1],f[2]),
    win(thirdName, f[3]), m(f[4],f[5]),
    win(runnerUpName, f[6]), m(f[7],f[8]),
    win(fourthName, f[9]), m(f[10],f[11]),
  ];

  const qfA1 = win(championName, r16[1][1]>r16[1][3] ? r16[1][0] : r16[1][2]);
  const qfA2 = win(thirdName, r16[3][1]>r16[3][3] ? r16[3][0] : r16[3][2]);
  const qfB1 = win(runnerUpName, r16[5][1]>r16[5][3] ? r16[5][0] : r16[5][2]);
  const qfB2 = win(fourthName, r16[7][1]>r16[7][3] ? r16[7][0] : r16[7][2]);
  const qf = [qfA1, qfA2, qfB1, qfB2];

  const sfA = win(championName, thirdName);
  const sfB = win(runnerUpName, fourthName);
  const sf = [sfA, sfB];

  return {
    r16, qf, sf,
    final:[championName, finalScore[0], runnerUpName, finalScore[1]],
    bronze: thirdScore ? [thirdName, thirdScore[0], fourthName, thirdScore[1]] : win(thirdName, fourthName),
  };
}

function getYearDetail(entry){
  if(entry.isLive){
    return { group: liveGroupFor(entry.champion), bracket: liveBracketData() };
  }
  if(!entry._cache){
    entry._cache = {
      group: entry.group || generateGroupTable(entry.year, entry.champion),
      bracket: entry.bracket ? {
        ...entry.bracket,
        final: [entry.champion, entry.finalScore[0], entry.runnerUp, entry.finalScore[1]],
        bronze: (entry.third && entry.thirdScore) ? [entry.third, entry.thirdScore[0], entry.fourth, entry.thirdScore[1]] : null,
      } : generateBracket(entry.year, entry.champion, entry.runnerUp, entry.finalScore, entry.third, entry.fourth, entry.thirdScore),
    };
  }
  return entry._cache;
}

/* For the current, still-being-played 2042 tournament we show the REAL
   live data from Grupos / Cuadro Eliminación instead of fictional filler. */
function liveGroupFor(championName){
  const t = TEAM_DATA.find(x=>x.name===championName);
  if(!t) return generateGroupTable(2042, championName);
  const st = computeStandings(t.group);
  return {label:`GRUPO ${t.group}`, teams: st.map(r=>({name:teamName(r.code), pj:r.pj,g:r.pg,e:r.pe,p:r.pp,gf:r.gf,gc:r.gc,pts:r.pts}))};
}
function codeMatchToTuple(m){
  const hn = m.homeName ? teamName(m.homeName) : '???';
  const an = m.awayName ? teamName(m.awayName) : '???';
  const hs = (m.hs!==null && m.hs!=='') ? Number(m.hs) : null;
  const as = (m.as!==null && m.as!=='') ? Number(m.as) : null;
  return [hn, hs, an, as];
}
function liveBracketData(){
  const K = STATE.knockout;
  return {
    r16: K.r16.map(codeMatchToTuple),
    qf: K.qf.map(codeMatchToTuple),
    sf: K.sf.map(codeMatchToTuple),
    final: codeMatchToTuple(K.final),
    bronze: (K.bronze.homeName && K.bronze.awayName) ? codeMatchToTuple(K.bronze) : null,
  };
}

function currentChampionEntry(){
  const K = STATE.knockout;
  const f = K.final;
  if(f.hs===null||f.as===null||f.hs===''||f.as==='' || !f.homeName || !f.awayName) return null;
  const hs=Number(f.hs), as=Number(f.as);
  if(hs===as) return null;
  const champCode = hs>as ? f.homeName : f.awayName;
  const runnerCode = hs>as ? f.awayName : f.homeName;
  let third=null, fourth=null, thirdScore=null;
  const br = K.bronze;
  if(br.hs!==null && br.as!==null && br.hs!=='' && br.as!=='' && br.homeName && br.awayName){
    const bhs=Number(br.hs), bas=Number(br.as);
    if(bhs!==bas){
      third = bhs>bas ? teamName(br.homeName) : teamName(br.awayName);
      fourth = bhs>bas ? teamName(br.awayName) : teamName(br.homeName);
      thirdScore = bhs>bas ? [bhs,bas] : [bas,bhs];
    }
  }
  return {
    year:2042, champion:teamName(champCode), runnerUp:teamName(runnerCode),
    finalScore: hs>as?[hs,as]:[as,hs], third, fourth, thirdScore,
    balon:null, goleador:null, fairplay:null, current:true, isLive:true,
  };
}

function allHallEntries(){
  const current = currentChampionEntry();
  return current ? [...HISTORY, current] : HISTORY;
}

/* Every champion has taken part in all 5 World Cups held so far (6 once
   2042 is added). Germany is the one exception — missed one edition. */
const PARTICIPATION_OVERRIDES = { 'Alemania': 4 };

function countryStats(name){
  const all = allHallEntries();
  const titles = all.filter(h=>h.champion===name);
  const subs = all.filter(h=>h.runnerUp===name);
  const thirds = all.filter(h=>h.third===name);
  const latestTitle = titles.length ? Math.max(...titles.map(h=>h.year)) : null;
  const totalEditions = HISTORY.length + (currentChampionEntry() ? 1 : 0);
  return {
    titles: titles.length, subs: subs.length, thirds: thirds.length,
    years: titles.map(h=>h.year).sort((a,b)=>b-a),
    latestTitle,
    isVigente: latestTitle === Math.max(...all.map(h=>h.year)),
    participaciones: PARTICIPATION_OVERRIDES[name] !== undefined ? PARTICIPATION_OVERRIDES[name] : totalEditions,
  };
}

/* Optional local photos: drop files into the paths below (inside the repo)
   and they'll appear automatically; until then a themed gradient shows instead. */
function assetImg(src, alt, cls){
  return `<img src="${src}" alt="${alt}" class="${cls||''}" loading="lazy" onerror="this.classList.add('img-missing')">`;
}

let famaNav = {view:'ranking', country:null, year:null, tab:'grupos', search:''};

function renderFama(){
  const current = currentChampionEntry();
  const all = allHallEntries();
  const champions = [...new Set(all.map(h=>h.champion))]
    .map(name=> ({name, ...countryStats(name)}))
    .sort((a,b)=> b.titles-a.titles || b.latestTitle-a.latestTitle);

  const subnav = `
  <div class="fama-topbar">
    <div class="fama-subnav">
      ${['ranking','todos','stats','historia','acerca'].map(v=>`
        <button class="fama-tab ${famaNav.view===v?'active':''}" data-famanav="${v}">${{
          ranking:'Ranking', todos:'Todos los Mundiales', stats:'Estadísticas', historia:'Historia', acerca:'Acerca de'
        }[v]}</button>`).join('')}
    </div>
    <div class="fama-search">
      <input type="text" id="famaSearch" placeholder="Buscar país..." value="${famaNav.search}">
    </div>
  </div>`;

  let body = '';
  if(famaNav.view==='country' && famaNav.country) body = renderCountryDetail(famaNav.country, champions, all);
  else if(famaNav.view==='mundial' && famaNav.year) body = renderMundialDetail(famaNav.year, all);
  else if(famaNav.view==='todos') body = renderFamaTodos(all);
  else if(famaNav.view==='stats') body = renderFamaStats(champions, all);
  else if(famaNav.view==='historia') body = renderFamaHistoria(all);
  else if(famaNav.view==='acerca') body = renderFamaAcerca();
  else body = renderFamaRanking(champions, current);

  return `
  <div class="fama-hero">
    <div class="fama-hero-trophy">${assetImg('assets/mundiales/trophy.png','Copa del Mundo','fama-trophy-img')}<span class="fama-trophy-fallback">🏆</span></div>
    <div>
      <h1 class="page-title" style="margin-bottom:4px;">Salón de la Fama</h1>
      <div class="fama-hero-sub">de los Mundiales</div>
    </div>
  </div>
  ${subnav}
  ${body}
  <div class="fama-footer-note">Los datos y resultados son ficticios y con fines de entretenimiento.</div>
  `;
}

function renderFamaRanking(champions, current){
  const top = champions.slice(0,4);
  const cards = top.map((c,i)=>`
    <div class="rank-card" data-country="${c.name}">
      <div class="rank-num">${i+1}</div>
      <div class="rank-flag">${flagByCountryName(c.name,'w80')}</div>
      <div class="rank-name">${c.name}</div>
      <div class="rank-titles">${c.titles} MUNDIAL${c.titles!==1?'ES':''}</div>
      ${c.isVigente ? '<div class="rank-badge">VIGENTE CAMPEÓN</div>' : ''}
      <div class="rank-years">${c.years.join(' · ')}</div>
    </div>`).join('');

  const gridCards = champions.map(c=>`
    <div class="country-card" data-country="${c.name}">
      <div class="country-card-bg">${assetImg(`assets/countries/${isoForName(c.name)||'xx'}.jpg`, c.name, 'country-bg-img')}</div>
      <div class="country-card-flag">${flagByCountryName(c.name,'w80')}</div>
      <div class="country-card-name">${c.name.toUpperCase()}</div>
    </div>`).join('');

  return `
  <div class="ranking-title">
    <span class="ranking-deco">✦</span> RANKING HISTÓRICO <span class="ranking-deco">✦</span>
  </div>
  <div class="ranking-sub">Los países que hicieron historia en la Copa del Mundo</div>
  <div class="rank-grid">${cards}</div>
  <div class="section-label">Tocá un país para ver su historia</div>
  <div class="country-grid">${gridCards}</div>
  `;
}

function renderFamaTodos(all){
  const sorted = [...all].sort((a,b)=>b.year-a.year);
  const rows = sorted.map(h=>`
    <div class="mundial-row" data-year="${h.year}">
      <div class="mundial-row-year">${h.year}</div>
      <div class="mundial-row-flag">${h.champion ? flagByCountryName(h.champion,'w40') : '<span class="flag-fallback">❔</span>'}</div>
      <div class="mundial-row-info">
        <div class="mundial-row-champ">${h.champion || '¿Por definir?'}</div>
        <div class="mundial-row-tag">${h.isLive ? (h.champion?'Vigente':'En curso') : 'Campeón'}</div>
      </div>
      <div class="mundial-row-arrow">›</div>
    </div>`).join('');
  return `
  <div class="panel" style="padding:20px;">
    <div class="panel-title" style="margin-bottom:4px;">Todos los Mundiales</div>
    <div class="ranking-sub" style="margin:0 0 16px;">Explorá la historia completa de la Copa del Mundo</div>
    <div class="mundial-list">${rows}</div>
  </div>`;
}

function renderFamaStats(champions, all){
  const totalTitles = all.filter(h=>h.champion).length;
  const rows = champions.map(c=>`
    <tr class="clickable" data-country="${c.name}">
      <td class="team-cell"><span class="flag">${flagByCountryName(c.name,'w40')}</span>${c.name}</td>
      <td class="num">${c.titles}</td>
      <td class="num">${c.subs}</td>
      <td class="num">${c.thirds}</td>
      <td class="num">${c.participaciones}</td>
    </tr>`).join('');
  return `
  <div class="stat-grid" style="margin-bottom:20px;">
    <div class="stat-card"><div class="stat-value">${totalTitles}</div><div class="stat-label">Ediciones jugadas</div></div>
    <div class="stat-card"><div class="stat-value">${champions.length}</div><div class="stat-label">Países campeones</div></div>
    <div class="stat-card"><div class="stat-value">${champions[0]?champions[0].name:'—'}</div><div class="stat-label">Máximo ganador</div></div>
    <div class="stat-card"><div class="stat-value">32</div><div class="stat-label">Selecciones en 2042</div></div>
  </div>
  <div class="panel">
    <div class="panel-head"><div class="panel-title">Tabla histórica</div></div>
    <table>
      <thead><tr><th>País</th><th class="num">Títulos</th><th class="num">Subcamp.</th><th class="num">3ºs puestos</th><th class="num">Particip.</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function renderFamaHistoria(all){
  const sorted = [...all].filter(h=>h.champion).sort((a,b)=>a.year-b.year);
  const items = sorted.map(h=>`
    <div class="history-item">
      <div class="history-year">${h.year}</div>
      <div class="history-dot"></div>
      <div class="history-content">
        <div class="history-title">${flagByCountryName(h.champion,'w40')} ${h.champion} se consagra campeón</div>
        <div class="history-desc">Venció en la final a ${h.runnerUp} por ${h.finalScore[0]}-${h.finalScore[1]}${h.third?`, con ${h.third} quedándose el tercer puesto`:''}.</div>
      </div>
    </div>`).join('');
  return `
  <div class="panel" style="padding:24px;">
    <div class="panel-title" style="margin-bottom:16px;">Línea de tiempo</div>
    <div class="history-timeline">${items}</div>
  </div>`;
}

function renderFamaAcerca(){
  return `
  <div class="panel" style="padding:28px;max-width:640px;">
    <div class="panel-title" style="margin-bottom:12px;">Acerca del Salón de la Fama</div>
    <p style="color:var(--muted);line-height:1.7;font-size:14px;">
      El Salón de la Fama reúne la historia completa del Mundial 2042 y sus ediciones anteriores:
      campeones, finales, tablas de grupo y cuadros de eliminación directa. Es la sección de
      honor de la app <strong style="color:var(--ice)">Hielo Eterno</strong>, pensada para revivir
      cada título con estilo de transmisión oficial.
    </p>
    <p style="color:var(--muted);line-height:1.7;font-size:14px;margin-top:10px;">
      ¿Querés sumar fotos reales de estadios, la copa o las celebraciones? Subí tus imágenes a la
      carpeta <code>assets/</code> del repositorio (mirá el detalle de nombres de archivo en el
      README) y van a aparecer automáticamente acá.
    </p>
  </div>`;
}

function renderCountryDetail(name, champions, all){
  const stats = countryStats(name);
  const years = stats.years;
  const selYear = famaNav.year && years.includes(famaNav.year) ? famaNav.year : years[0];
  const entry = all.find(h=>h.year===selYear && h.champion===name);
  const iso = isoForName(name);

  return `
  <button class="back-link" data-back="ranking">← Volver al ranking</button>
  <div class="detail-hero">
    <div class="detail-hero-bg">${assetImg(`assets/countries/${iso||'xx'}-hero.jpg`, name, 'detail-bg-img')}</div>
    <div class="detail-hero-content">
      <div class="detail-flag">${flagByCountryName(name,'w160')}</div>
      <div>
        <h2 class="detail-name">${name} ${stats.isVigente?'<span class="rank-badge inline">VIGENTE CAMPEÓN</span>':''}</h2>
        <div class="detail-titles">${stats.titles} MUNDIAL${stats.titles!==1?'ES':''} <span class="detail-star">★</span> ${years.join(' · ')}</div>
      </div>
    </div>
  </div>

  <div class="detail-grid">
    <div class="panel stat-box">
      <div class="panel-title" style="margin-bottom:12px;">Sobre ${name} en los mundiales</div>
      <div class="stat-row"><span>Participaciones</span><strong>${stats.participaciones}</strong></div>
      <div class="stat-row"><span>Títulos</span><strong>${stats.titles}</strong></div>
      <div class="stat-row"><span>Subcampeonatos</span><strong>${stats.subs}</strong></div>
      <div class="stat-row"><span>Tercer puesto</span><strong>${stats.thirds}</strong></div>
      <div class="stat-row"><span>Mejor actuación</span><strong>Campeón (${stats.latestTitle})</strong></div>
    </div>

    <div class="panel year-picker-panel">
      <div class="panel-title" style="margin-bottom:12px;">Elegí un mundial para explorar</div>
      <div class="year-chip-row">
        ${years.map(y=>`<button class="year-chip ${y===selYear?'active':''}" data-year="${y}">${y} <span class="trophy-mini">🏆</span></button>`).join('')}
      </div>
      ${entry ? renderYearTabs(entry) : ''}
    </div>
  </div>
  `;
}

function renderMundialDetail(year, all){
  const entry = all.find(h=>h.year===year);
  if(!entry) return `<div class="empty-note">No hay datos para ${year}.</div>`;
  return `
  <button class="back-link" data-back="todos">← Volver a todos los mundiales</button>
  <div class="detail-hero small">
    <div class="detail-hero-bg">${assetImg(`assets/mundiales/${year}.jpg`, `Mundial ${year}`, 'detail-bg-img')}</div>
    <div class="detail-hero-content">
      <div>
        <h2 class="detail-name">Copa del Mundo ${year}</h2>
        <div class="detail-titles">Campeón: ${entry.champion ? `${flagByCountryName(entry.champion,'w40')} ${entry.champion}` : 'Por definir'}</div>
      </div>
    </div>
  </div>
  <div class="panel year-picker-panel">${renderYearTabs(entry)}</div>
  `;
}

function renderYearTabs(entry){
  const detail = getYearDetail(entry);
  const tab = famaNav.tab === 'eliminatoria' ? 'eliminatoria' : 'grupos';
  return `
  <div class="year-tabs">
    <button class="year-tab-btn ${tab==='grupos'?'active':''}" data-yeartab="grupos">Fase de Grupos</button>
    <button class="year-tab-btn ${tab==='eliminatoria'?'active':''}" data-yeartab="eliminatoria">Fase Eliminatoria</button>
  </div>
  ${tab==='grupos' ? renderMiniGroup(detail.group, entry.year) : renderMiniBracket(detail.bracket)}
  `;
}

function renderMiniGroup(group, year){
  const rows = group.teams.map((t,i)=>`
    <tr class="${i<2?'qualified':''}">
      <td class="num">${i+1}</td>
      <td class="team-cell"><span class="flag">${flagByCountryName(t.name,'w40')}</span>${t.name}</td>
      <td class="num">${t.pj}</td><td class="num">${t.g}</td><td class="num">${t.e}</td><td class="num">${t.p}</td>
      <td class="num">${t.gf}</td><td class="num">${t.gc}</td><td class="num">${t.gf-t.gc>=0?'+':''}${t.gf-t.gc}</td>
      <td class="num pts-cell">${t.pts}</td>
    </tr>`).join('');
  return `
  <div class="mini-group-label">${group.label} · MUNDIAL ${year}</div>
  <table>
    <thead><tr><th>POS</th><th>PAÍS</th><th class="num">PJ</th><th class="num">G</th><th class="num">E</th><th class="num">P</th><th class="num">GF</th><th class="num">GC</th><th class="num">DG</th><th class="num">PTS</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function miniMatch(match){
  if(!match) return `<div class="mm"><div class="mm-team">???</div><div class="mm-team">???</div></div>`;
  const [hn,hs,an,as,pen] = match;
  const decided = hs!==null && as!==null && hs!=='' && as!=='';
  const hWin = pen ? pen==='home' : (decided && hs>as);
  const aWin = pen ? pen==='away' : (decided && as>hs);
  const hDisp = (hs===null||hs==='') ? '–' : hs;
  const aDisp = (as===null||as==='') ? '–' : as;
  return `<div class="mm">
    <div class="mm-team ${hWin?'win':''}"><span class="flag">${flagByCountryName(hn,'w40')}</span>${hn}<b>${hDisp}${pen==='home'?'*':''}</b></div>
    <div class="mm-team ${aWin?'win':''}"><span class="flag">${flagByCountryName(an,'w40')}</span>${an}<b>${aDisp}${pen==='away'?'*':''}</b></div>
  </div>`;
}

function renderMiniBracket(bracket){
  const f = bracket.final;
  const finalDecided = f && f[1]!==null && f[3]!==null && f[1]!=='' && f[3]!=='';
  const champName = finalDecided ? (f[1]>f[3]?f[0]:f[2]) : null;
  return `
  <div class="mini-bracket">
    <div class="mb-col"><div class="mb-label">Octavos</div>${bracket.r16.map(miniMatch).join('')}</div>
    <div class="mb-col"><div class="mb-label">Cuartos</div>${bracket.qf.map(miniMatch).join('')}</div>
    <div class="mb-col"><div class="mb-label">Semifinales</div>${bracket.sf.map(miniMatch).join('')}</div>
    <div class="mb-col final">
      <div class="mb-label">Final</div>
      ${miniMatch(bracket.final)}
      ${champName ? `<div class="mb-champion">🏆 <span>${champName}</span></div>` : `<div class="mb-champion pending">🏆 <span>Por definir</span></div>`}
      ${bracket.bronze?`<div class="mb-bronze-label">Tercer puesto</div>${miniMatch(bracket.bronze)}`:''}
    </div>
  </div>`;
}

function attachFamaEvents(){
  content.querySelectorAll('[data-famanav]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ famaNav.view = btn.dataset.famanav; famaNav.country=null; famaNav.year=null; render(); });
  });
  const search = document.getElementById('famaSearch');
  if(search) search.addEventListener('input', (e)=>{ famaNav.search = e.target.value; /* filtering hook available for future use */ });

  content.querySelectorAll('[data-country]').forEach(el=>{
    el.addEventListener('click', ()=>{ famaNav.view='country'; famaNav.country=el.dataset.country; famaNav.year=null; famaNav.tab='grupos'; render(); });
  });
  content.querySelectorAll('[data-year].mundial-row, .mundial-row[data-year]').forEach(el=>{
    el.addEventListener('click', ()=>{ famaNav.view='mundial'; famaNav.year=Number(el.dataset.year); famaNav.tab='grupos'; render(); });
  });
  content.querySelectorAll('.year-chip').forEach(el=>{
    el.addEventListener('click', ()=>{ famaNav.year=Number(el.dataset.year); famaNav.tab='grupos'; render(); });
  });
  content.querySelectorAll('[data-yeartab]').forEach(el=>{
    el.addEventListener('click', ()=>{ famaNav.tab=el.dataset.yeartab; render(); });
  });
  content.querySelectorAll('[data-back]').forEach(el=>{
    el.addEventListener('click', ()=>{ famaNav.view=el.dataset.back; famaNav.country=null; famaNav.year=null; render(); });
  });
}



/* ---------------- AJUSTES ---------------- */
function renderAjustes(){
  return `
  <h1 class="page-title">Ajustes</h1>
  <div class="panel" style="padding:22px;">
    <div class="panel-title" style="margin-bottom:16px;">Gradiente de fondo (tiempo real)</div>
    <div class="color-row">
      <div class="color-field">
        <label>Color 1</label>
        <div class="color-input-wrap">
          <input type="color" id="setGrad1" value="${STATE.settings.grad1}">
          <span id="setGrad1Text" style="font-family:var(--font-mono);font-size:12px;">${STATE.settings.grad1}</span>
        </div>
      </div>
      <div class="color-field">
        <label>Color 2</label>
        <div class="color-input-wrap">
          <input type="color" id="setGrad2" value="${STATE.settings.grad2}">
          <span id="setGrad2Text" style="font-family:var(--font-mono);font-size:12px;">${STATE.settings.grad2}</span>
        </div>
      </div>
    </div>
    <div class="grad-preview" id="gradPreview" style="background:linear-gradient(90deg, ${STATE.settings.grad1}, ${STATE.settings.grad2});"></div>

    <div class="panel-title" style="margin-bottom:12px;">Dispositivo</div>
    <div class="device-options">
      <div class="device-opt ${STATE.settings.device==='desktop'?'active':''}" data-dev="desktop">PC · Sidebar 250px · 2 cols</div>
      <div class="device-opt ${STATE.settings.device==='mobile'?'active':''}" data-dev="mobile">Celular · Bottom Nav · 1 col</div>
    </div>
  </div>
  `;
}

function attachAjustesEvents(){
  const g1 = document.getElementById('setGrad1');
  const g2 = document.getElementById('setGrad2');
  const preview = document.getElementById('gradPreview');
  const t1 = document.getElementById('setGrad1Text');
  const t2 = document.getElementById('setGrad2Text');

  function applyGrad(){
    document.documentElement.style.setProperty('--grad1', g1.value);
    document.documentElement.style.setProperty('--grad2', g2.value);
    preview.style.background = `linear-gradient(90deg, ${g1.value}, ${g2.value})`;
    t1.textContent = g1.value; t2.textContent = g2.value;
    STATE.settings.grad1 = g1.value; STATE.settings.grad2 = g2.value;
    saveState();
  }
  g1.addEventListener('input', applyGrad);
  g2.addEventListener('input', applyGrad);

  content.querySelectorAll('.device-opt').forEach(el=>{
    el.addEventListener('click', ()=>{
      setDevice(el.dataset.dev);
    });
  });
}

function setDevice(dev){
  STATE.settings.device = dev;
  document.getElementById('btnMobile').classList.toggle('active', dev==='mobile');
  document.getElementById('btnDesktop').classList.toggle('active', dev==='desktop');
  document.querySelector('.app').classList.toggle('force-mobile', dev==='mobile');
  saveState();
  if(STATE.view==='ajustes') render();
}

/* ---------------- ADMIN ---------------- */
function renderAdmin(){
  if(!STATE.admin.unlocked){
    return `
    <h1 class="page-title">Admin / TV</h1>
    <div class="admin-lock">
      <div class="mini-label">MODO TV · Solo visualización</div>
      <p style="color:var(--muted);font-size:13px;margin-top:6px;">No se pueden editar resultados. Ingresá la clave secreta para desbloquear la edición completa.</p>
      <input type="text" id="adminKeyInput" placeholder="CLAVE SECRETA" autocomplete="off">
      <button class="btn-primary full" id="adminUnlock">Ingresar clave secreta</button>
      <p class="hint" style="margin-top:14px;">Pista: la clave se te compartió junto con esta app.</p>
    </div>`;
  }
  return `
  <h1 class="page-title">Admin / TV <span class="badge on">Edición desbloqueada</span></h1>
  <div class="admin-panel">
    <div class="admin-box">
      <h3>Generar cuadro</h3>
      <p>Arma automáticamente la ronda de 16 usando los 2 primeros de cada grupo.</p>
      <button class="btn-primary" id="adminGen">Generar cuadro desde grupos</button>
    </div>
    <div class="admin-box">
      <h3>Reiniciar torneo</h3>
      <p>Borra todos los resultados de grupos y el cuadro de eliminación. No se puede deshacer.</p>
      <button class="btn-danger" id="adminReset">Reiniciar todo el torneo</button>
    </div>
    <div class="admin-box">
      <h3>Exportar datos</h3>
      <p>Descarga un archivo JSON con el estado actual del torneo (resultados, cuadro y perfil).</p>
      <button class="btn-secondary" id="adminExport">Descargar JSON</button>
    </div>
    <div class="admin-box">
      <h3>Bloquear edición</h3>
      <p>Volver a Modo TV: solo lectura, sin poder tocar resultados.</p>
      <button class="btn-secondary" id="adminLock">Volver a Modo TV</button>
    </div>
  </div>`;
}

function attachAdminEvents(){
  const unlockBtn = document.getElementById('adminUnlock');
  if(unlockBtn){
    unlockBtn.addEventListener('click', tryUnlock);
    document.getElementById('adminKeyInput').addEventListener('keydown', e=>{ if(e.key==='Enter') tryUnlock(); });
  }
  const genBtn = document.getElementById('adminGen');
  if(genBtn) genBtn.addEventListener('click', generateBracketFromGroups);
  const resetBtn = document.getElementById('adminReset');
  if(resetBtn) resetBtn.addEventListener('click', ()=>{
    if(confirm('¿Seguro que querés reiniciar TODO el torneo? Esta acción no se puede deshacer.')){
      const kept = {profile: STATE.profile, settings: STATE.settings, admin: STATE.admin};
      STATE = Object.assign(defaultState(), kept);
      saveState(); render();
    }
  });
  const exportBtn = document.getElementById('adminExport');
  if(exportBtn) exportBtn.addEventListener('click', exportData);
  const lockBtn = document.getElementById('adminLock');
  if(lockBtn) lockBtn.addEventListener('click', ()=>{ STATE.admin.unlocked=false; saveState(); render(); });
}

function tryUnlock(){
  const val = document.getElementById('adminKeyInput').value.trim().toUpperCase();
  if(val === ADMIN_KEY){
    STATE.admin.unlocked = true;
    saveState();
    render();
  }else{
    const inp = document.getElementById('adminKeyInput');
    inp.style.borderColor = 'var(--danger)';
    inp.value='';
    inp.placeholder='CLAVE INCORRECTA';
    setTimeout(()=>{ inp.style.borderColor=''; inp.placeholder='CLAVE SECRETA'; }, 1400);
  }
}

function exportData(){
  const blob = new Blob([JSON.stringify(STATE, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'mundial-2042-datos.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------------- PROFILE MODAL ---------------- */
const profileModal = document.getElementById('profileModal');
const MAX_IMAGE_MB = 3;

// undefined = no change made this session, null = explicitly cleared, string = new dataURL
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
}
function closeProfile(){ profileModal.classList.remove('open'); }

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
  if(!file.type.startsWith('image/')){ alert('Elegí un archivo de imagen (GIF, PNG o JPG).'); return; }
  if(file.size > MAX_IMAGE_MB * 1024 * 1024){
    alert(`La imagen pesa más de ${MAX_IMAGE_MB}MB. Elegí un GIF más liviano para que se pueda guardar en el navegador.`);
    return;
  }
  const reader = new FileReader();
  reader.onload = (e)=> onDone(e.target.result);
  reader.onerror = ()=> alert('No se pudo leer el archivo. Probá con otra imagen.');
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
    alert('El perfil se aplicó pero no se pudo guardar en el navegador (la imagen puede ser muy pesada). Probá con un GIF más liviano.');
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

/* ---------------- Top bar actions ---------------- */
document.getElementById('btnMobile').addEventListener('click', ()=> setDevice('mobile'));
document.getElementById('btnDesktop').addEventListener('click', ()=> setDevice('desktop'));

document.getElementById('btnShare').addEventListener('click', async ()=>{
  const text = `Mundial 2042 · Hielo Eterno — ${playedCount()}/${STATE.matches.length} partidos jugados. ¡Seguí el torneo!`;
  try{
    if(navigator.share){ await navigator.share({title:'Mundial 2042', text}); return; }
  }catch(e){ /* user cancelled */ }
  try{
    await navigator.clipboard.writeText(text);
    flashButton('btnShare', 'Copiado ✓');
  }catch(e){ alert(text); }
});

document.getElementById('btnDownload').addEventListener('click', exportData);

function flashButton(id, msg){
  const btn = document.getElementById(id);
  const original = btn.textContent;
  btn.textContent = msg;
  setTimeout(()=> btn.textContent = original, 1400);
}

/* ---------------- Sidebar / bottomnav nav wiring ---------------- */
document.querySelectorAll('.nav-item, .bn-item').forEach(btn=>{
  btn.addEventListener('click', ()=> setView(btn.dataset.view));
});

/* ---------------- Init ---------------- */
function init(){
  document.documentElement.style.setProperty('--grad1', STATE.settings.grad1);
  document.documentElement.style.setProperty('--grad2', STATE.settings.grad2);
  document.querySelector('.app').classList.toggle('force-mobile', STATE.settings.device==='mobile');
  document.getElementById('btnMobile').classList.toggle('active', STATE.settings.device==='mobile');
  document.getElementById('btnDesktop').classList.toggle('active', STATE.settings.device==='desktop');
  applyAvatar();
  bindProfileLiveUpdate();
  render();
}

init();
