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
  {year:2022, host:'Colombia', iso:'co', final:'2-0 Francia', third:null, balon:null, goleador:null, fairplay:null, star:1},
  {year:2026, host:'España', iso:'es', final:'2-0 Francia', third:'Holanda 3-1 Paraguay', balon:null, goleador:null, fairplay:null, star:1},
  {year:2030, host:'Alemania', iso:'de', final:'2-1 Francia', third:'EEUU 3-2 España', balon:null, goleador:null, fairplay:null, star:1},
  {year:2034, host:'España', iso:'es', final:'3-2 Ghana', third:'Colombia 3-2 Mexico', balon:'Julian Alvarez', goleador:'Julian Alvarez', fairplay:'Ghana', star:2},
  {year:2038, host:'Argentina', iso:'ar', final:'3-0 Inglaterra', third:'Costa Rica 3-2 Uruguay', balon:'Nico Paz', goleador:'Nico Paz', fairplay:'Argentina', star:1},
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
function currentChampionEntry(){
  const K = STATE.knockout;
  const f = K.final;
  if(f.hs===null||f.as===null||f.hs===''||f.as==='' || !f.homeName || !f.awayName) return null;
  const hs=Number(f.hs), as=Number(f.as);
  if(hs===as) return null;
  const champCode = hs>as ? f.homeName : f.awayName;
  const runnerCode = hs>as ? f.awayName : f.homeName;
  const finalScore = hs>as ? `${hs}-${as} ${teamName(runnerCode)}` : `${as}-${hs} ${teamName(runnerCode)}`;
  let thirdText = null;
  const br = K.bronze;
  if(br.hs!==null && br.as!==null && br.hs!=='' && br.as!=='' && br.homeName && br.awayName){
    const bhs=Number(br.hs), bas=Number(br.as);
    if(bhs!==bas){
      thirdText = bhs>bas ? `${teamName(br.homeName)} ${bhs}-${bas} ${teamName(br.awayName)}` : `${teamName(br.awayName)} ${bas}-${bhs} ${teamName(br.homeName)}`;
    }
  }
  return {year:2042, host:teamName(champCode), iso:ISO_MAP[champCode], final:finalScore, third:thirdText, balon:null, goleador:null, fairplay:null, star:1, current:true};
}

function renderFama(){
  const current = currentChampionEntry();
  const all = [...HISTORY, current || {year:2042, host:null, iso:null, final:null, third:null, pending:true}];

  const cardsHtml = all.map(h=>{
    if(h.pending){
      return `
      <div class="fama-card current pending">
        <div class="fama-year-bg">2042</div>
        <div class="fama-year">2042 · MUNDIAL EN CURSO</div>
        <div class="fama-title">¿QUIÉN LEVANTARÁ LA COPA?</div>
        <div class="fama-result">Torneo en disputa · ${playedCount()}/${STATE.matches.length} partidos jugados</div>
        <div class="fama-pending">Completá la final en el Cuadro de Eliminación para revelar al campeón.</div>
      </div>`;
    }
    return `
    <div class="fama-card ${h.current?'current':''}">
      <div class="fama-year-bg">${h.year}</div>
      <div class="fama-flag">${flagImgIso(h.iso, 'w80', h.host)}</div>
      ${h.star ? `<div class="fama-star">${'★'.repeat(h.star)}</div>` : ''}
      <div class="fama-year">${h.year} ${h.host.toUpperCase()}</div>
      <div class="fama-title">Final</div>
      <div class="fama-result">${h.final}</div>
      ${h.third ? `<div class="fama-sub">Tercero ${h.third}</div>` : ''}
      <div class="fama-tags">
        <div class="fama-tag ${h.balon?'gold':''}"><div class="fama-tag-label">Balón</div><div class="fama-tag-value">${h.balon||'Sin datos'}</div></div>
        <div class="fama-tag ${h.goleador?'gold':''}"><div class="fama-tag-label">Goleador</div><div class="fama-tag-value">${h.goleador||'Sin datos'}</div></div>
        <div class="fama-tag ${h.fairplay?'gold':''}"><div class="fama-tag-label">Fair Play</div><div class="fama-tag-value">${h.fairplay||'Sin datos'}</div></div>
      </div>
    </div>`;
  }).join('');

  const champCounts = {};
  HISTORY.forEach(h=> champCounts[h.host] = (champCounts[h.host]||0)+1);
  if(current) champCounts[current.host] = (champCounts[current.host]||0)+1;
  const chipsHtml = Object.entries(champCounts).map(([name,count])=>{
    const entry = [...HISTORY, current].find(h=>h && h.host===name);
    return `<div class="champ-chip">${flagImgIso(entry.iso,'w40',name)} ${name} ${'★'.repeat(count)}</div>`;
  }).join('');

  return `
  <h1 class="page-title">Salón de la Fama</h1>
  <div class="panel" style="padding:18px 20px;margin-bottom:22px;">
    <div class="panel-title" style="margin-bottom:12px;">Campeones de la historia</div>
    <div class="champions-strip">${chipsHtml || '<span style="color:var(--muted)">Aún sin campeones registrados.</span>'}</div>
  </div>
  <div class="fama-grid">${cardsHtml}</div>
  `;
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
