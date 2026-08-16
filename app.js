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
  return `<img class="flag-ico" src="https://flagcdn.com/${size}/${iso}.png" alt="${alt||''}">`;
}
function flagImg(code, size){
  const iso = ISO_MAP[code] || (COUNTRY_DB.find(c=>c.code===code)||{}).iso;
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

let TEAM_DATA = [
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

let GROUP_LETTERS = ['A','B','C','D','E','F','G','H'];
const ORIGINAL_TEAM_DATA = TEAM_DATA.slice();
const ORIGINAL_GROUP_LETTERS = GROUP_LETTERS.slice();
function GROUP_LETTERS_FOR(n){ return Array.from({length:n}, (_,i)=> String.fromCharCode(65+i)); }
function shuffleArray(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

/* PRNG determinístico (mulberry32): con la misma semilla siempre da la
   misma secuencia de números. Se usa para el cuadro de 48 equipos, que
   tiene que dar SIEMPRE el mismo resultado para los mismos resultados de
   grupos, en vez de volver a tirar los dados cada vez que se genera. */
function mulberry32(seed){
  let t = seed >>> 0;
  return function(){
    t = (t + 0x6D2B79F5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function seededShuffle(arr, rng){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

/* ---------------- Etapa 1: base de países para "Nuevo Torneo" ---------------- */
const COUNTRY_DB = [
  // UEFA
  {code:'FRA', name:'Francia', iso:'fr', conf:'UEFA'},
  {code:'ESP', name:'España', iso:'es', conf:'UEFA'},
  {code:'ING', name:'Inglaterra', iso:'gb-eng', conf:'UEFA'},
  {code:'ALE', name:'Alemania', iso:'de', conf:'UEFA'},
  {code:'ITA', name:'Italia', iso:'it', conf:'UEFA'},
  {code:'POR', name:'Portugal', iso:'pt', conf:'UEFA'},
  {code:'NED', name:'Países Bajos', iso:'nl', conf:'UEFA'},
  {code:'BEL', name:'Bélgica', iso:'be', conf:'UEFA'},
  {code:'CRO', name:'Croacia', iso:'hr', conf:'UEFA'},
  {code:'DIN', name:'Dinamarca', iso:'dk', conf:'UEFA'},
  {code:'SUI', name:'Suiza', iso:'ch', conf:'UEFA'},
  {code:'SRB', name:'Serbia', iso:'rs', conf:'UEFA'},
  {code:'TUR', name:'Turquía', iso:'tr', conf:'UEFA'},
  {code:'AUT', name:'Austria', iso:'at', conf:'UEFA'},
  {code:'SWE', name:'Suecia', iso:'se', conf:'UEFA'},
  {code:'GEO', name:'Georgia', iso:'ge', conf:'UEFA'},
  {code:'POL', name:'Polonia', iso:'pl', conf:'UEFA'},
  {code:'UKR', name:'Ucrania', iso:'ua', conf:'UEFA'},
  {code:'WAL', name:'Gales', iso:'gb-wls', conf:'UEFA'},
  {code:'SCO', name:'Escocia', iso:'gb-sct', conf:'UEFA'},
  {code:'IRL', name:'Irlanda', iso:'ie', conf:'UEFA'},
  {code:'NOR', name:'Noruega', iso:'no', conf:'UEFA'},
  {code:'BIH', name:'Bosnia y Herzegovina', iso:'ba', conf:'UEFA'},
  {code:'CZE', name:'Chequia', iso:'cz', conf:'UEFA'},
  {code:'HUN', name:'Hungría', iso:'hu', conf:'UEFA'},
  {code:'GRE', name:'Grecia', iso:'gr', conf:'UEFA'},
  {code:'SVK', name:'Eslovaquia', iso:'sk', conf:'UEFA'},
  {code:'ROU', name:'Rumania', iso:'ro', conf:'UEFA'},
  // CONMEBOL
  {code:'ARG', name:'Argentina', iso:'ar', conf:'CONMEBOL'},
  {code:'BRA', name:'Brasil', iso:'br', conf:'CONMEBOL'},
  {code:'URU', name:'Uruguay', iso:'uy', conf:'CONMEBOL'},
  {code:'COL', name:'Colombia', iso:'co', conf:'CONMEBOL'},
  {code:'ECU', name:'Ecuador', iso:'ec', conf:'CONMEBOL'},
  {code:'PER', name:'Perú', iso:'pe', conf:'CONMEBOL'},
  {code:'CHI', name:'Chile', iso:'cl', conf:'CONMEBOL'},
  {code:'PAR', name:'Paraguay', iso:'py', conf:'CONMEBOL'},
  {code:'BOL', name:'Bolivia', iso:'bo', conf:'CONMEBOL'},
  {code:'VEN', name:'Venezuela', iso:'ve', conf:'CONMEBOL'},
  // CAF
  {code:'MAR', name:'Marruecos', iso:'ma', conf:'CAF'},
  {code:'SEN', name:'Senegal', iso:'sn', conf:'CAF'},
  {code:'NGA', name:'Nigeria', iso:'ng', conf:'CAF'},
  {code:'EGI', name:'Egipto', iso:'eg', conf:'CAF'},
  {code:'ALG', name:'Argelia', iso:'dz', conf:'CAF'},
  {code:'CIV', name:'Costa de Marfil', iso:'ci', conf:'CAF'},
  {code:'CMR', name:'Camerún', iso:'cm', conf:'CAF'},
  {code:'GHA', name:'Ghana', iso:'gh', conf:'CAF'},
  {code:'RSA', name:'Sudáfrica', iso:'za', conf:'CAF'},
  {code:'CAB', name:'Cabo Verde', iso:'cv', conf:'CAF'},
  {code:'TUN', name:'Túnez', iso:'tn', conf:'CAF'},
  {code:'MLI', name:'Mali', iso:'ml', conf:'CAF'},
  {code:'ZAM', name:'Zambia', iso:'zm', conf:'CAF'},
  {code:'CON', name:'Congo', iso:'cd', conf:'CAF'},
  {code:'ANG', name:'Angola', iso:'ao', conf:'CAF'},
  // AFC
  {code:'JAP', name:'Japón', iso:'jp', conf:'AFC'},
  {code:'KOR', name:'Corea del Sur', iso:'kr', conf:'AFC'},
  {code:'IRN', name:'Irán', iso:'ir', conf:'AFC'},
  {code:'AUS', name:'Australia', iso:'au', conf:'AFC'},
  {code:'KSA', name:'Arabia Saudita', iso:'sa', conf:'AFC'},
  {code:'UZB', name:'Uzbekistán', iso:'uz', conf:'AFC'},
  {code:'QAT', name:'Catar', iso:'qa', conf:'AFC'},
  {code:'IRQ', name:'Irak', iso:'iq', conf:'AFC'},
  {code:'UAE', name:'Emiratos Árabes Unidos', iso:'ae', conf:'AFC'},
  {code:'JOR', name:'Jordania', iso:'jo', conf:'AFC'},
  {code:'CHN', name:'China', iso:'cn', conf:'AFC'},
  {code:'IND', name:'India', iso:'in', conf:'AFC'},
  {code:'VGB', name:'Islas Vírgenes Británicas', iso:'vg', conf:'AFC'},
  // CONCACAF
  {code:'MEX', name:'México', iso:'mx', conf:'CONCACAF'},
  {code:'EEU', name:'Estados Unidos', iso:'us', conf:'CONCACAF'},
  {code:'CAN', name:'Canadá', iso:'ca', conf:'CONCACAF'},
  {code:'CRC', name:'Costa Rica', iso:'cr', conf:'CONCACAF'},
  {code:'JAM', name:'Jamaica', iso:'jm', conf:'CONCACAF'},
  {code:'PAN', name:'Panamá', iso:'pa', conf:'CONCACAF'},
  {code:'TRI', name:'Trinidad y Tobago', iso:'tt', conf:'CONCACAF'},
  {code:'HAI', name:'Haití', iso:'ht', conf:'CONCACAF'},
  {code:'HON', name:'Honduras', iso:'hn', conf:'CONCACAF'},
  {code:'SLV', name:'El Salvador', iso:'sv', conf:'CONCACAF'},
  {code:'GUA', name:'Guatemala', iso:'gt', conf:'CONCACAF'},
  // OFC
  {code:'NZL', name:'Nueva Zelanda', iso:'nz', conf:'OFC'},
  {code:'FIJ', name:'Fiyi', iso:'fj', conf:'OFC'},
  {code:'PNG', name:'Papúa Nueva Guinea', iso:'pg', conf:'OFC'},
  {code:'SOL', name:'Islas Salomón', iso:'sb', conf:'OFC'},
];

const CURRENT_YEAR = 2042;

function confLabel(conf){
  return {UEFA:'🇪🇺 UEFA', CONMEBOL:'🌎 CONMEBOL', CAF:'🌍 CAF', AFC:'🌏 AFC', CONCACAF:'🌎 CONCACAF', OFC:'🌊 OFC'}[conf] || conf;
}

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
  {year:2042, champion:'Argentina', runnerUp:'Colombia', finalScore:[12,9], third:'Cabo Verde', fourth:'Costa Rica', thirdScore:[3,2],
    balon:null, goleador:'Kendry Páez', fairplay:'Bosnia y Herzegovina',
    muroDefensivo:'Alemania (5 goles recibidos en 3 partidos)', goleada:'Alemania 3-0 Ecuador',
    group:{label:'GRUPO C', teams:[
      {name:'Argentina', pj:3,g:3,e:0,p:0,gf:7,gc:4,pts:9},
      {name:'Costa Rica', pj:3,g:2,e:0,p:1,gf:5,gc:4,pts:6},
      {name:'Italia', pj:3,g:0,e:1,p:2,gf:5,gc:7,pts:1},
      {name:'Croacia', pj:3,g:0,e:1,p:2,gf:4,gc:6,pts:1},
    ]},
    /* Bicampeonato de Argentina. Cuadro completo tal cual se jugó:
       Argentina fue Bélgica -> Japón -> Costa Rica -> Colombia (12-9)
       en la final, y Cabo Verde se quedó el tercer puesto ante Costa Rica. */
    bracket:{
      r16:[
        ['Australia',1,'Japón',3], ['Argentina',7,'Bélgica',5],
        ['Dinamarca',1,'Estados Unidos',3], ['Panamá',2,'Costa Rica',4],
        ['Marruecos',6,'Noruega',8], ['Países Bajos',5,'Colombia',7],
        ['Cabo Verde',12,'Uruguay',10], ['Inglaterra',3,'España',1],
      ],
      qf:[
        ['Japón',1,'Argentina',3], ['Estados Unidos',7,'Costa Rica',9],
        ['Noruega',2,'Colombia',4], ['Cabo Verde',6,'Inglaterra',4],
      ],
      sf:[
        ['Argentina',4,'Costa Rica',2], ['Colombia',7,'Cabo Verde',5],
      ],
    }},
];

/* Identidad visual del Mundial (título, subtítulo, logo y fondo).
   La controla el admin desde Admin / TV y se sincroniza en vivo por
   Firebase igual que los resultados, así que todos los que tengan la
   app abierta ven el cambio apenas se guarda — pensada para "renovarse"
   con cada nueva edición sin tocar código. */
function defaultBranding(){
  return {
    title: 'MUNDIAL 2042',
    subtitle: 'HIELO ETERNO · EDICIÓN POLAR',
    logoEmoji: '❄',
    logoImage: null,
    grad1: '#7c5cff',
    grad2: '#0a1931',
    bgImage: null,
    heroPrefix: 'BIENVENIDO AL',
    heroHighlight: 'HIELO ETERNO',
    heroText: 'Mundial 2042 se juega en estadios climatizados bajo auroras. 32 naciones, -12°C, gloria infinita. Administra resultados, vive el cuadro, honra la historia.',
  };
}

/* Música oficial del Mundial: un link de YouTube que carga el admin desde
   Admin / TV. Se sincroniza en vivo por Firebase igual que branding, así
   que el botón 🎵 de la topbar aparece para todos apenas se guarda. */
function defaultMusic(){
  return { youtubeUrl: null };
}

/* Acepta watch?v=, youtu.be/, embed/ y shorts/ y devuelve solo el ID del
   video (o null si el link no es reconocible). */
function extractYouTubeId(url){
  if(!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for(const re of patterns){
    const m = url.match(re);
    if(m) return m[1];
  }
  return null;
}

function defaultState(format){
  format = format || 32;
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
    settings:{grad1:'#7c5cff', grad2:'#0a1931', device:'desktop', notifications:true},
    admin:{unlocked:false},
    awards:{fairplay:'', goleador:''},
    branding: defaultBranding(),
    music: defaultMusic(),
    format,
    matches,
    knockout: buildEmptyKnockout(format),
    view:'inicio',
  };
}

/* format 48 agrega una ronda de Dieciseisavos (r32, 16 partidos) antes de
   la Ronda de 16 ya existente. Todo lo demás (qf/sf/final/bronze) es igual
   para los dos formatos. */
function buildEmptyKnockout(format){
  const mk = (id)=>({id, homeName:null, awayName:null, hs:null, as:null});
  const base = {
    r16: [mk('P49'), mk('P50'), mk('P51'), mk('P52'), mk('P53'), mk('P54'), mk('P55'), mk('P56')],
    qf: [mk('QF1'), mk('QF2'), mk('QF3'), mk('QF4')],
    sf: [mk('SF1'), mk('SF2')],
    final: mk('FINAL'),
    bronze: mk('BRONZE'),
  };
  if(format === 48){
    base.r32 = Array.from({length:16}, (_,i)=> mk('T'+(i+1)));
  }
  return base;
}

let STATE = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem('mundial2042_state_v1');
    if(raw){
      const parsed = JSON.parse(raw);
      if(parsed.teamData && parsed.teamData.length) TEAM_DATA = parsed.teamData;
      if(parsed.groupLetters && parsed.groupLetters.length) GROUP_LETTERS = parsed.groupLetters;
      // merge with defaults to survive schema changes
      const base = defaultState(parsed.format);
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

/* Use this instead of saveState() for any edit that actually touches
   `matches` or `knockout` (score inputs, bracket generation/reset, etc.)
   — it saves locally AND pushes the change live to Firebase. Profile,
   settings and admin unlock should keep using plain saveState(). */
function saveTournament(){
  saveState();
  syncToFirebase();
}

/* ---------------- Firebase live sync ----------------
   Only `matches` and `knockout` are shared across every viewer — profile,
   settings and admin unlock stay local to each device/browser. */
let fbRef = null;
let fbReady = false;
let applyingRemote = false; // guard to avoid feedback loops
let syncTimer = null;

/* Aplica STATE.branding al DOM: título de la pestaña, nombre/subtítulo
   en la topbar, logo (emoji o imagen) y fondo (colores o imagen). Se
   llama al arrancar la app y cada vez que llega un cambio de branding
   por Firebase, para que se actualice en vivo sin recargar. */
function applyBranding(){
  const b = Object.assign(defaultBranding(), STATE.branding || {});
  document.title = b.subtitle ? `${b.title} · ${b.subtitle}` : b.title;

  const nameEl = document.getElementById('brandName');
  const subEl = document.getElementById('brandSub');
  const markEl = document.getElementById('brandMark');
  if(nameEl) nameEl.textContent = b.title;
  if(subEl) subEl.textContent = b.subtitle;
  if(markEl){
    markEl.innerHTML = b.logoImage
      ? `<img src="${b.logoImage}" alt="Logo" class="brand-mark-img">`
      : escapeHtml(b.logoEmoji || '❄');
  }

  document.documentElement.style.setProperty('--grad1', b.grad1);
  document.documentElement.style.setProperty('--grad2', b.grad2);
  const aurora = document.querySelector('.aurora-bg');
  if(aurora) aurora.style.backgroundImage = b.bgImage ? `url(${b.bgImage})` : '';
}

/* Muestra/oculta el botón 🎵 de la topbar según si el admin cargó un link
   de YouTube válido. Si el panel de música está abierto y cambia (o se
   borra) el link, actualiza el iframe / lo cierra en consecuencia. */
function applyMusicButton(){
  const btn = document.getElementById('btnMusic');
  if(!btn) return;
  const music = STATE.music || defaultMusic();
  const id = extractYouTubeId(music.youtubeUrl);
  btn.style.display = id ? '' : 'none';
  if(!id){
    document.getElementById('musicPanel').classList.remove('open');
    document.getElementById('musicPanelBody').innerHTML = '';
  }else if(document.getElementById('musicPanel').classList.contains('open')){
    renderMusicPanelBody(id);
  }
}

function renderMusicPanelBody(id){
  document.getElementById('musicPanelBody').innerHTML =
    `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" title="Música del Mundial" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}

function setLiveStatus(on, label){
  const dot = document.getElementById('liveDot');
  const text = document.getElementById('liveText');
  if(!dot || !text) return;
  dot.classList.toggle('on', !!on);
  text.textContent = label || (on ? 'EN VIVO' : 'Sin conexión');
}

/* Belt-and-suspenders: force every score field back to a real `null`
   (never `undefined`) right after merging data that came from Firebase,
   since that's exactly the shape that got lost on the way there. */
function normalizeScores(state){
  (state.matches||[]).forEach(m=>{
    if(!hasScore(m.hs)) m.hs = null;
    if(!hasScore(m.as)) m.as = null;
  });
  const K = state.knockout;
  if(K){
    [...(K.r32||[]), ...(K.r16||[]), ...(K.qf||[]), ...(K.sf||[]), K.final, K.bronze].filter(Boolean).forEach(m=>{
      if(!hasScore(m.hs)) m.hs = null;
      if(!hasScore(m.as)) m.as = null;
    });
  }
}

function initFirebaseSync(){
  if(typeof firebase === 'undefined' || typeof db === 'undefined'){
    setLiveStatus(false, 'Sin conexión');
    return;
  }
  fbRef = db.ref('tournament');

  // Connection state (Firebase's built-in presence sentinel).
  db.ref('.info/connected').on('value', (snap)=>{
    if(snap.val()===true) setLiveStatus(true, 'EN VIVO');
    else setLiveStatus(false, 'Reconectando…');
  });

  // Listen for remote changes and merge them into local STATE live.
  fbRef.on('value', (snap)=>{
    const remote = snap.val();
    fbReady = true;
    if(!remote) return; // nothing in the DB yet — local state will seed it below
    if(pendingPush) return; // a newer local edit hasn't been pushed yet — don't overwrite it with this older snapshot
    applyingRemote = true;
    if(remote.matches) STATE.matches = remote.matches;
    if(remote.knockout) STATE.knockout = remote.knockout;
    if(remote.teamData && remote.teamData.length){ TEAM_DATA = remote.teamData; STATE.teamData = remote.teamData; }
    if(remote.groupLetters && remote.groupLetters.length){ GROUP_LETTERS = remote.groupLetters; STATE.groupLetters = remote.groupLetters; }
    if(remote.format) STATE.format = remote.format;
    if(remote.branding) STATE.branding = remote.branding;
    if(remote.music) STATE.music = remote.music;
    normalizeScores(STATE);
    autoFillKnockoutFromGroups();
    try{ localStorage.setItem('mundial2042_state_v1', JSON.stringify(STATE)); }catch(e){}
    applyBranding();
    applyMusicButton();
    render();
    applyingRemote = false;
  });
}

let pendingPush = false; // true while a local edit is waiting to be pushed —
                          // blocks incoming remote snapshots from clobbering it

function syncToFirebase(){
  if(applyingRemote) return; // this save came from a remote update, don't echo it back
  if(!fbRef) return;
  if(!fbReady){
    // We haven't received the server's current data yet — pushing now could
    // overwrite everyone else's live scores with stale/old local data.
    // Once the first remote snapshot arrives, retry.
    setTimeout(syncToFirebase, 300);
    return;
  }
  pendingPush = true;
  clearTimeout(syncTimer);
  // small debounce so rapid score typing doesn't spam the DB
  syncTimer = setTimeout(()=>{
    fbRef.update({ matches: STATE.matches, knockout: STATE.knockout, teamData: TEAM_DATA, groupLetters: GROUP_LETTERS, format: STATE.format||32, branding: STATE.branding||defaultBranding(), music: STATE.music||defaultMusic() }).then(()=>{
      pendingPush = false;
    }).catch(()=>{
      setLiveStatus(false, 'Error de sync');
      pendingPush = false;
    });
  }, 250);
}

/* =========================================================
   SISTEMA SOCIAL — amigos, chat privado, predicciones y logros
   ========================================================= */
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function getMyTag(){
  let t = localStorage.getItem('mundial2042_tag');
  if(!t){
    t = 'DT-' + Math.floor(1000 + Math.random()*9000);
    localStorage.setItem('mundial2042_tag', t);
  }
  return t;
}
const MY_TAG = getMyTag();
let MY_FRIENDS = {};
let FRIEND_REQUESTS_IN = {};
let FRIEND_NAMES = {};
let FRIEND_COLORS = {};
let MY_PREDICTIONS = {};
let MY_GROUPS = {};
let GROUP_INFO = {};
let MY_MANUAL_ACHIEVEMENTS = [];
let ACTIVE_CHAT_FRIEND = null;
let ACTIVE_CHANNEL = {type:null, id:null};
let chatMsgsRefOff = null;

function getMsgCount(){ return Number(localStorage.getItem('mundial2042_msgcount')||0); }
function bumpMsgCount(){ localStorage.setItem('mundial2042_msgcount', String(getMsgCount()+1)); }

/* Rastrea qué secciones de la app visitó este DT (para el logro "Explorador
   Polar"). Se guarda en este navegador, igual que el resto de contadores
   locales usados por los logros. */
function getVisitedViews(){
  try{ return JSON.parse(localStorage.getItem('mundial2042_visited')||'[]'); }catch(e){ return []; }
}
function markViewVisited(view){
  if(!view) return;
  const set = new Set(getVisitedViews());
  if(set.has(view)) return;
  set.add(view);
  try{ localStorage.setItem('mundial2042_visited', JSON.stringify([...set])); }catch(e){}
}

function allKnockoutMatches(){
  const K = STATE.knockout;
  return [...(K.r32||[]), ...K.r16, ...K.qf, ...K.sf, K.final, K.bronze];
}

function correctPredictionsCount(){
  const koMatches = allKnockoutMatches().filter(m=> m.homeName && m.awayName);
  const all = [...STATE.matches, ...koMatches];
  return all.filter(m=>{
    const p = MY_PREDICTIONS[m.id];
    return p && isPlayed(m) && Number(p.hs)===Number(m.hs) && Number(p.as)===Number(m.as);
  }).length;
}

/* ---------------- Logros y rol ---------------- */
const ACHIEVEMENTS = [
  {id:'first_match', icon:'⚽', name:'Primer Partido', desc:'Cargá el resultado de al menos 1 partido de la fase de grupos.', check:()=> playedCount()>=1},
  {id:'groups_done', icon:'▤', name:'Grupos Completos', desc:'Completá los resultados de todos los partidos de la fase de grupos.', check:()=> allGroupsComplete()},
  {id:'bracket_ready', icon:'🧊', name:'Cuadro en Marcha', desc:'Conseguí que los 8 partidos de la ronda de 16 tengan sus equipos definidos.', check:()=> STATE.knockout.r16.every(m=>m.homeName && m.awayName)},
  {id:'quarterfinal_set', icon:'🥶', name:'Quedan los Duros', desc:'Se desbloquea cuando los 4 cuartos de final quedan armados, con sus equipos ya definidos.', check:()=> STATE.knockout.qf.every(m=>m.homeName && m.awayName)},
  {id:'semifinal_set', icon:'🥈', name:'Choque de Titanes', desc:'Se desbloquea cuando las 2 semifinales quedan armadas, con los 4 mejores equipos confirmados.', check:()=> STATE.knockout.sf.every(m=>m.homeName && m.awayName)},
  {id:'final_set', icon:'🎇', name:'La Gran Final', desc:'Se desbloquea cuando la final queda armada, con sus dos finalistas confirmados.', check:()=> !!(STATE.knockout.final && STATE.knockout.final.homeName && STATE.knockout.final.awayName)},
  {id:'bronze_done', icon:'🥉', name:'El Tercer Puesto', desc:'Cargá el resultado del partido por el tercer puesto.', check:()=> !!(STATE.knockout.bronze && hasScore(STATE.knockout.bronze.hs))},
  {id:'champion', icon:'🏆', name:'Campeón Coronado', desc:'Cargá el resultado de la final del torneo.', check:()=> !!(STATE.knockout.final && hasScore(STATE.knockout.final.hs))},
  {id:'fanatic', icon:'🎖', name:'Fanático Total', desc:'Completá TODOS los partidos del torneo, incluida la fase de grupos y el cuadro de eliminación.', check:()=> playedCount()>=STATE.matches.length && STATE.matches.length>0},
  {id:'social', icon:'🤝', name:'Sociable', desc:'Agregá a tu primer amigo con su código DT-XXXX.', check:()=> Object.keys(MY_FRIENDS).length>=1},
  {id:'circle', icon:'❄', name:'Círculo de Hielo', desc:'Sumá 5 amigos en tu lista.', check:()=> Object.keys(MY_FRIENDS).length>=5},
  {id:'ten_friends', icon:'👥', name:'Círculo Ártico', desc:'Sumá 10 amigos en tu lista.', check:()=> Object.keys(MY_FRIENDS).length>=10},
  {id:'icebreaker', icon:'💬', name:'Rompehielos', desc:'Enviá tu primer mensaje de chat.', check:()=> getMsgCount()>=1},
  {id:'chatterbox', icon:'🗨', name:'Charlatán Polar', desc:'Enviá 50 mensajes de chat.', check:()=> getMsgCount()>=50},
  {id:'veteran', icon:'📡', name:'Veterano del Hielo', desc:'Enviá 200 mensajes de chat en total.', check:()=> getMsgCount()>=200},
  {id:'group_founder', icon:'🏕', name:'Fundador de Grupo', desc:'Creá o sumate a tu primer grupo de chat.', check:()=> Object.keys(MY_GROUPS).length>=1},
  {id:'crew', icon:'⛺', name:'Manada Polar', desc:'Formá parte de 3 grupos de chat distintos (creados por vos o a los que te sumaron).', check:()=> Object.keys(MY_GROUPS).length>=3},
  {id:'first_prediction', icon:'📝', name:'Primera Apuesta', desc:'Cargá tu primera predicción de resultado, para cualquier partido.', check:()=> Object.keys(MY_PREDICTIONS).length>=1},
  {id:'oracle', icon:'🔮', name:'Oráculo Polar', desc:'Acertá tu primera predicción de resultado.', check:()=> correctPredictionsCount()>=1},
  {id:'visionary', icon:'🌟', name:'Visionario', desc:'Acertá 5 predicciones de resultado.', check:()=> correctPredictionsCount()>=5},
  {id:'predictor_pro', icon:'📋', name:'Estratega Meticuloso', desc:'Cargá 10 predicciones de partidos, aunque todavía no se hayan jugado.', check:()=> Object.keys(MY_PREDICTIONS).length>=10},
  {id:'perfectionist', icon:'🎯', name:'Predicción Perfecta', desc:'Acertá 10 predicciones de resultado exacto.', check:()=> correctPredictionsCount()>=10},
  {id:'explorer', icon:'🧭', name:'Explorador Polar', desc:'Visitá las 6 secciones de la app al menos una vez: Inicio, Grupos, Cuadro, Salón Fama, Ajustes y Admin.', check:()=> getVisitedViews().length>=6},
];

/* Los logros se pueden desbloquear cumpliendo la condición (check) o porque
   un admin te lo entregó a mano desde Admin / TV (MY_MANUAL_ACHIEVEMENTS,
   sincronizado por Firebase — ver initSocial y grantAchievement). */
function computeAchievements(){
  const manual = MY_MANUAL_ACHIEVEMENTS || [];
  return ACHIEVEMENTS.map(a=>({...a, unlocked: !!a.check() || manual.includes(a.id)}));
}

function roleForCount(n){
  if(n>=13) return 'DT Supremo';
  if(n>=10) return 'Leyenda';
  if(n>=6) return 'Estratega';
  if(n>=3) return 'Hincha';
  return 'Novato';
}

function renderAchievements(){
  const grid = document.getElementById('achvGrid');
  if(!grid) return;
  const list = computeAchievements();
  grid.innerHTML = list.map(a=>`
    <div class="achv-item ${a.unlocked?'unlocked':''}" data-achv="${a.id}" title="Ver cómo conseguirlo">
      <span class="achv-icon">${a.icon}</span>
      <span class="achv-name">${escapeHtml(a.name)}</span>
    </div>
  `).join('');
  grid.querySelectorAll('.achv-item').forEach(el=> el.addEventListener('click', ()=> openAchvDetail(el.dataset.achv)));
  const unlocked = list.filter(a=>a.unlocked).length;
  const roleEl = document.getElementById('profileRoleBadge');
  if(roleEl) roleEl.textContent = roleForCount(unlocked);
  const tagEl = document.getElementById('profileTagValue');
  if(tagEl) tagEl.textContent = MY_TAG;
}

/* Muestra en un modal cómo se consigue un logro puntual (se abre al
   clickear cualquier ícono de logro en el perfil). */
function openAchvDetail(id){
  const list = computeAchievements();
  const a = list.find(x=>x.id===id);
  if(!a) return;
  document.getElementById('achvDetailIcon').textContent = a.icon;
  document.getElementById('achvDetailName').textContent = a.name;
  document.getElementById('achvDetailDesc').textContent = a.desc || '';
  const statusEl = document.getElementById('achvDetailStatus');
  statusEl.textContent = a.unlocked ? '✓ Desbloqueado' : '🔒 Bloqueado';
  statusEl.classList.toggle('locked', !a.unlocked);
  document.getElementById('achvDetailModal').classList.add('open');
}

/* ---------------- Amigos ---------------- */
/* Tope para sincronizar avatar/banner a Firebase (en caracteres base64).
   Evita escrituras gigantes; si la imagen supera esto, se guarda igual
   local (en este navegador) pero otros usuarios verán solo la inicial. */
const MAX_SYNC_IMG_CHARS = 4200000;

function ensureMySocialProfile(){
  if(typeof db==='undefined') return;
  const avatarToSync = (STATE.profile.avatar && STATE.profile.avatar.length <= MAX_SYNC_IMG_CHARS) ? STATE.profile.avatar : null;
  const bannerToSync = (STATE.profile.banner && STATE.profile.banner.length <= MAX_SYNC_IMG_CHARS) ? STATE.profile.banner : null;
  db.ref('social/users/'+MY_TAG).update({
    name: STATE.profile.name,
    color: STATE.profile.color,
    desc: STATE.profile.desc,
    pronouns: STATE.profile.pronouns,
    follows: STATE.profile.follows,
    avatar: avatarToSync,
    banner: bannerToSync,
    role: roleForCount(computeAchievements().filter(a=>a.unlocked).length),
    lastSeen: Date.now()
  });
}

function isAdmin(){ return !!(STATE.admin && STATE.admin.unlocked); }

function initialOf(name){ return (name||'?').trim().charAt(0).toUpperCase() || '?'; }
function avatarCircle(name, color, size){
  size = size || 26;
  const c = color || '#8b6bff';
  return `<span class="fi-avatar" style="width:${size}px;height:${size}px;background:linear-gradient(135deg, ${c}, #1a1400)">${escapeHtml(initialOf(name))}</span>`;
}

function openFriendProfile(tag){
  if(!tag || typeof db==='undefined') return;
  db.ref('social/users/'+tag).once('value').then(snap=>{
    const v = snap.val() || {};
    document.getElementById('fpName').textContent = v.name || tag;
    document.getElementById('fpPronouns').textContent = v.pronouns || '';
    document.getElementById('fpDesc').textContent = v.desc || '';
    document.getElementById('fpFollows').textContent = v.follows ? `🏳 Sigue a ${teamName(v.follows)}` : '';
    document.getElementById('fpTag').textContent = tag;
    document.getElementById('fpRole').textContent = v.role || 'Novato';
    const heroColor = v.color || '#8b6bff';
    const hero = document.getElementById('friendProfileHero');
    const avatarEl = document.getElementById('friendProfileAvatar');
    hero.style.background = v.banner ? `center/cover no-repeat url(${v.banner})` : `linear-gradient(135deg, ${heroColor}, #1a1400)`;
    avatarEl.style.background = v.avatar ? `center/cover no-repeat url(${v.avatar})` : `linear-gradient(135deg, ${heroColor}, #1a1400)`;
    const fpInitial = document.getElementById('fpAvatarInitial');
    if(fpInitial) fpInitial.textContent = v.avatar ? '' : initialOf(v.name || tag);
    FRIEND_COLORS[tag] = heroColor;
    document.getElementById('friendProfileModal').classList.add('open');
  }).catch(()=>{});
}
document.getElementById('closeFriendProfile').addEventListener('click', ()=> document.getElementById('friendProfileModal').classList.remove('open'));
document.getElementById('friendProfileModal').addEventListener('click', (e)=>{ if(e.target.id==='friendProfileModal') document.getElementById('friendProfileModal').classList.remove('open'); });

document.getElementById('closeAchvDetail').addEventListener('click', ()=> document.getElementById('achvDetailModal').classList.remove('open'));
document.getElementById('achvDetailModal').addEventListener('click', (e)=>{ if(e.target.id==='achvDetailModal') document.getElementById('achvDetailModal').classList.remove('open'); });

function updateChatBadge(){
  const badge = document.getElementById('chatFabBadge');
  if(!badge) return;
  const n = Object.keys(FRIEND_REQUESTS_IN||{}).length;
  badge.textContent = n;
  badge.classList.toggle('show', n>0);
}

function renderFriendRequests(){
  const box = document.getElementById('friendRequests');
  if(!box) return;
  const entries = Object.entries(FRIEND_REQUESTS_IN||{});
  box.innerHTML = entries.map(([tag,data])=>`
    <div class="friend-req-item">
      <div class="friend-req-name">${escapeHtml((data&&data.name)||tag)} <span style="color:var(--muted-2)">(${escapeHtml(tag)})</span></div>
      <div class="friend-req-actions">
        <button class="fr-accept" data-tag="${tag}">Aceptar</button>
        <button class="fr-decline" data-tag="${tag}">Ignorar</button>
      </div>
    </div>
  `).join('');
  box.querySelectorAll('.fr-accept').forEach(b=> b.addEventListener('click', ()=> acceptFriendRequest(b.dataset.tag)));
  box.querySelectorAll('.fr-decline').forEach(b=> b.addEventListener('click', ()=> declineFriendRequest(b.dataset.tag)));
}

function renderFriendList(){
  const list = document.getElementById('friendList');
  if(!list) return;
  const tags = Object.keys(MY_FRIENDS||{});
  if(tags.length===0){
    list.innerHTML = '<div class="empty-note" style="padding:8px 4px;">Sin amigos todavía.</div>';
    return;
  }
  const isActive = t => ACTIVE_CHANNEL.type==='friend' && ACTIVE_CHANNEL.id===t;
  list.innerHTML = tags.map(t=>`
    <button class="friend-item ${isActive(t)?'active':''}" data-tag="${t}">
      ${avatarCircle(FRIEND_NAMES[t]||t, FRIEND_COLORS[t])}
      <span class="friend-item-name">${escapeHtml(FRIEND_NAMES[t]||t)}</span>
      <span class="friend-item-info" data-info="${t}" title="Ver perfil">ⓘ</span>
    </button>
  `).join('');
  list.querySelectorAll('.friend-item').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      if(e.target.classList.contains('friend-item-info')){ openFriendProfile(btn.dataset.tag); return; }
      openChat(btn.dataset.tag);
    });
  });
  tags.forEach(t=>{
    if(!FRIEND_NAMES[t] && typeof db!=='undefined'){
      db.ref('social/users/'+t).once('value').then(snap=>{
        const v = snap.val();
        FRIEND_NAMES[t] = (v && v.name) || t;
        FRIEND_COLORS[t] = (v && v.color) || '#8b6bff';
        renderFriendList();
      }).catch(()=>{});
    }
  });
}

function sendFriendRequest(targetTag){
  if(typeof db==='undefined'){ alert('Sin conexión.'); return; }
  db.ref('social/users/'+targetTag).once('value').then(snap=>{
    if(!snap.exists()){ alert('Ese código no existe. Revisá que esté bien escrito.'); return; }
    if(MY_FRIENDS[targetTag]){ alert('Ya son amigos.'); return; }
    db.ref(`social/requests/${targetTag}/${MY_TAG}`).set({name: STATE.profile.name, ts: Date.now()});
    alert('Solicitud enviada ✓');
  }).catch(()=> alert('No se pudo enviar la solicitud.'));
}

function acceptFriendRequest(fromTag){
  if(typeof db==='undefined') return;
  db.ref(`social/friends/${MY_TAG}/${fromTag}`).set(true);
  db.ref(`social/friends/${fromTag}/${MY_TAG}`).set(true);
  db.ref(`social/requests/${MY_TAG}/${fromTag}`).remove();
}

function declineFriendRequest(fromTag){
  if(typeof db==='undefined') return;
  db.ref(`social/requests/${MY_TAG}/${fromTag}`).remove();
}

/* ---------------- Chat (amigos / global / grupos) ---------------- */
function setChatHeader(name, color, clickable){
  const avatarEl = document.getElementById('chatActiveAvatar');
  const nameEl = document.getElementById('chatActiveName');
  const headerEl = document.getElementById('chatActiveHeader');
  if(avatarEl) avatarEl.innerHTML = avatarCircle(name, color, 30);
  if(nameEl) nameEl.textContent = name;
  if(headerEl){
    headerEl.style.cursor = clickable ? 'pointer' : 'default';
    headerEl.title = clickable ? 'Ver perfil' : '';
  }
}

function notifyNewMessage(m, title){
  if(STATE.settings.notifications===false) return;
  if(typeof Notification==='undefined' || Notification.permission!=='granted') return;
  const panelOpen = document.getElementById('chatPanel').classList.contains('open');
  if(panelOpen && !document.hidden) return; // ya lo estás viendo en pantalla
  const body = (m.type==='gif' || m.type==='image') ? '📷 Envió una imagen/GIF' : (m.text||'').slice(0,80);
  try{ new Notification(title, {body, icon:'chat-icon.png'}); }catch(e){ /* ignore */ }
}

function attachMessagesListener(refPath){
  if(chatMsgsRefOff){ chatMsgsRefOff(); chatMsgsRefOff = null; }
  if(typeof db==='undefined') return;
  const ref = db.ref(refPath).limitToLast(200);
  let lastSeenTs = Date.now();
  const chanTitle = (document.getElementById('chatActiveName') && document.getElementById('chatActiveName').textContent) || 'Mundial 2042';
  const handler = (snap)=>{
    const val = snap.val() || {};
    const msgs = Object.entries(val).map(([key,m])=>({...m, key})).sort((a,b)=> a.ts-b.ts);
    msgs.forEach(m=>{
      if(m.from!==MY_TAG && m.ts>lastSeenTs) notifyNewMessage(m, chanTitle);
    });
    if(msgs.length) lastSeenTs = Math.max(lastSeenTs, msgs[msgs.length-1].ts);

    // En chat global / de grupo aparecen mensajes de gente que todavía
    // no es tu amiga, así que su nombre no está en FRIEND_NAMES. Antes
    // de pintar los mensajes, buscamos el nombre real de cualquier
    // remitente que no conozcamos todavía (en vez de mostrar su código).
    const unknownSenders = [...new Set(msgs.map(m=>m.from))].filter(t=> t!==MY_TAG && !FRIEND_NAMES[t]);
    if(unknownSenders.length && typeof db!=='undefined'){
      Promise.all(unknownSenders.map(t=> db.ref('social/users/'+t).once('value').then(s=>{
        const v = s.val();
        FRIEND_NAMES[t] = (v && v.name) || t;
        FRIEND_COLORS[t] = (v && v.color) || '#8b6bff';
      }).catch(()=>{}))).then(()=> handler(snap));
      return;
    }

    const box = document.getElementById('chatMessages');
    if(!box) return;
    box.innerHTML = msgs.map(m=>{
      const time = new Date(m.ts).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
      const mine = m.from===MY_TAG?'mine':'theirs';
      const senderLabel = (ACTIVE_CHANNEL.type!=='friend' && m.from!==MY_TAG) ? `<span class="chat-msg-sender" data-tag="${m.from}">${escapeHtml(FRIEND_NAMES[m.from]||m.from)}</span>` : '';
      const canDelete = m.from===MY_TAG || isAdmin();
      const delBtn = canDelete ? `<button class="msg-del-btn" data-key="${m.key}" title="Borrar mensaje">✕</button>` : '';
      if(m.type==='gif' || m.type==='image'){
        return `<div class="chat-msg ${mine} gif-msg">${delBtn}${senderLabel}<img src="${m.text}" alt="${m.type}" loading="lazy"><span class="chat-msg-time">${time}</span></div>`;
      }
      return `<div class="chat-msg ${mine}">${delBtn}${senderLabel}${escapeHtml(m.text)}<span class="chat-msg-time">${time}</span></div>`;
    }).join('');
    box.querySelectorAll('.msg-del-btn').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.stopPropagation();
        if(!confirm('¿Borrar este mensaje?')) return;
        db.ref(refPath+'/'+btn.dataset.key).remove();
      });
    });
    box.querySelectorAll('.chat-msg-sender').forEach(el=>{
      el.addEventListener('click', (e)=>{
        e.stopPropagation();
        openFriendProfile(el.dataset.tag);
      });
    });
    box.scrollTop = box.scrollHeight;
  };
  ref.on('value', handler);
  chatMsgsRefOff = ()=> ref.off('value', handler);
  attachTypingListener(refPath.replace(/\/messages$/, '/typing'));
}

let typingRefOff = null;
let typingTimeout = null;
function typingBasePath(){
  const refPath = currentSendRef();
  return refPath ? refPath.replace(/\/messages$/, '/typing') : null;
}
function attachTypingListener(basePath){
  if(typingRefOff){ typingRefOff(); typingRefOff = null; }
  if(typeof db==='undefined' || !basePath) return;
  const ref = db.ref(basePath);
  const handler = (snap)=>{
    const val = snap.val() || {};
    const names = Object.keys(val).filter(t=> t!==MY_TAG).map(t=> val[t]);
    const el = document.getElementById('typingIndicator');
    if(!el) return;
    if(names.length===0){ el.textContent=''; el.style.display='none'; return; }
    const text = names.length===1 ? `${names[0]} está escribiendo…` : `${names.slice(0,2).join(', ')} están escribiendo…`;
    el.textContent = text;
    el.style.display = 'block';
  };
  ref.on('value', handler);
  typingRefOff = ()=> ref.off('value', handler);
}

function showActiveChatUI(){
  document.getElementById('chatEmpty').style.display = 'none';
  document.getElementById('chatActive').style.display = 'flex';
}

function openChat(tag){
  ACTIVE_CHAT_FRIEND = tag;
  ACTIVE_CHANNEL = {type:'friend', id:tag};
  renderFriendList();
  renderGroupList();
  showActiveChatUI();
  setChatHeader(FRIEND_NAMES[tag] || tag, FRIEND_COLORS[tag], true);
  document.getElementById('chatActiveHeader').onclick = ()=> openFriendProfile(tag);
  document.getElementById('chatMembersBtn').classList.remove('show');
  const chatId = [MY_TAG, tag].sort().join('__');
  attachMessagesListener('social/chats/'+chatId+'/messages');
}

function openGlobalChat(){
  ACTIVE_CHANNEL = {type:'global', id:'global'};
  renderFriendList();
  renderGroupList();
  showActiveChatUI();
  setChatHeader('Chat Global 🌍', '#2ec4b6', false);
  document.getElementById('chatActiveHeader').onclick = null;
  document.getElementById('chatMembersBtn').classList.add('show');
  attachMessagesListener('social/global/messages');
}

function openGroupChat(groupId){
  ACTIVE_CHANNEL = {type:'group', id:groupId};
  renderFriendList();
  renderGroupList();
  showActiveChatUI();
  const g = GROUP_INFO[groupId];
  setChatHeader((g && g.name) || 'Grupo', '#7c5cff', false);
  document.getElementById('chatActiveHeader').onclick = null;
  document.getElementById('chatMembersBtn').classList.add('show');
  attachMessagesListener('social/groupChats/'+groupId+'/messages');
}

function currentSendRef(){
  if(ACTIVE_CHANNEL.type==='friend'){
    const chatId = [MY_TAG, ACTIVE_CHANNEL.id].sort().join('__');
    return 'social/chats/'+chatId+'/messages';
  }
  if(ACTIVE_CHANNEL.type==='global') return 'social/global/messages';
  if(ACTIVE_CHANNEL.type==='group') return 'social/groupChats/'+ACTIVE_CHANNEL.id+'/messages';
  return null;
}

function sendChatMessage(){
  const refPath = currentSendRef();
  if(!refPath || typeof db==='undefined') return;
  const input = document.getElementById('chatInput');
  const text = input.value.trim().slice(0,500);
  if(!text) return;
  db.ref(refPath).push({from: MY_TAG, text, ts: Date.now()});
  bumpMsgCount();
  input.value = '';
  clearTimeout(typingTimeout);
  const base = typingBasePath();
  if(base) db.ref(base+'/'+MY_TAG).remove();
}

/* ---------------- Grupos ---------------- */
function renderGroupList(){
  const list = document.getElementById('groupList');
  if(!list) return;
  const ids = Object.keys(MY_GROUPS||{});
  if(ids.length===0){
    list.innerHTML = '<div class="empty-note" style="padding:6px 4px;">Sin grupos todavía.</div>';
    return;
  }
  const isActive = id => ACTIVE_CHANNEL.type==='group' && ACTIVE_CHANNEL.id===id;
  list.innerHTML = ids.map(id=>{
    const g = GROUP_INFO[id];
    const name = (g && g.name) || 'Grupo';
    return `<button class="friend-item ${isActive(id)?'active':''}" data-gid="${id}">
      <span class="fi-avatar" style="width:26px;height:26px;background:linear-gradient(135deg,#7c5cff,#1a1400)">👥</span>
      <span class="friend-item-name">${escapeHtml(name)}</span>
    </button>`;
  }).join('');
  list.querySelectorAll('.friend-item[data-gid]').forEach(btn=> btn.addEventListener('click', ()=> openGroupChat(btn.dataset.gid)));
  ids.forEach(id=>{
    if(!GROUP_INFO[id] && typeof db!=='undefined'){
      db.ref('social/groups/'+id).once('value').then(snap=>{
        GROUP_INFO[id] = snap.val() || {};
        renderGroupList();
      }).catch(()=>{});
    }
  });
}

function openGroupModal(){
  const picker = document.getElementById('groupMemberPicker');
  const tags = Object.keys(MY_FRIENDS||{});
  if(tags.length===0){
    picker.innerHTML = '<div class="empty-note" style="padding:6px 0;">Agregá amigos primero para poder sumarlos a un grupo.</div>';
  }else{
    picker.innerHTML = tags.map(t=>`
      <label class="group-member-row">
        <input type="checkbox" value="${t}">
        ${avatarCircle(FRIEND_NAMES[t]||t, FRIEND_COLORS[t], 22)}
        <span>${escapeHtml(FRIEND_NAMES[t]||t)}</span>
      </label>
    `).join('');
  }
  document.getElementById('groupNameInput').value = '';
  document.getElementById('groupModal').classList.add('open');
}

function createGroup(){
  const name = document.getElementById('groupNameInput').value.trim().slice(0,30);
  if(!name){ alert('Ponele un nombre al grupo.'); return; }
  if(typeof db==='undefined'){ alert('Sin conexión.'); return; }
  const checked = Array.from(document.querySelectorAll('#groupMemberPicker input[type=checkbox]:checked')).map(c=>c.value);
  const members = {[MY_TAG]: true};
  checked.forEach(t=> members[t] = true);
  const newRef = db.ref('social/groups').push();
  const groupId = newRef.key;
  newRef.set({name, owner: MY_TAG, members, ts: Date.now()}).then(()=>{
    Object.keys(members).forEach(t=>{
      db.ref('social/userGroups/'+t+'/'+groupId).set(true);
    });
    document.getElementById('groupModal').classList.remove('open');
    openGroupChat(groupId);
  }).catch(()=> alert('No se pudo crear el grupo.'));
}

/* ---------------- GIFs (GIPHY) ---------------- */
let gifSearchTimer = null;
function toggleGifPanel(){
  closeEmojiPanel();
  const panel = document.getElementById('gifPanel');
  const opening = !panel.classList.contains('open');
  panel.classList.toggle('open', opening);
  if(opening){
    document.getElementById('gifSearchInput').value = '';
    loadGifs('futbol');
    document.getElementById('gifSearchInput').focus();
  }
}
function loadGifs(query){
  const grid = document.getElementById('gifPanelGrid');
  if(!grid) return;
  if(typeof GIPHY_API_KEY==='undefined' || !GIPHY_API_KEY){
    grid.innerHTML = '<div class="gif-panel-empty">Falta configurar la API key de GIPHY.</div>';
    return;
  }
  grid.innerHTML = '<div class="gif-panel-empty">Buscando…</div>';
  const endpoint = query ? 'search' : 'trending';
  const url = `https://api.giphy.com/v1/gifs/${endpoint}?api_key=${GIPHY_API_KEY}&limit=12&rating=pg-13${query?`&q=${encodeURIComponent(query)}`:''}`;
  fetch(url).then(r=>r.json()).then(data=>{
    const items = data.data || [];
    if(!items.length){ grid.innerHTML = '<div class="gif-panel-empty">Sin resultados.</div>'; return; }
    grid.innerHTML = items.map(g=>{
      const preview = g.images.fixed_width_small.url;
      const full = g.images.fixed_width.url;
      return `<img src="${preview}" data-full="${full}" loading="lazy">`;
    }).join('');
    grid.querySelectorAll('img').forEach(img=>{
      img.addEventListener('click', ()=> sendMedia(img.dataset.full, 'gif'));
    });
  }).catch(()=>{ grid.innerHTML = '<div class="gif-panel-empty">Error al buscar GIFs.</div>'; });
}
function sendMedia(url, type){
  const refPath = currentSendRef();
  if(!refPath || typeof db==='undefined') return;
  db.ref(refPath).push({from: MY_TAG, text: url, type, ts: Date.now()});
  bumpMsgCount();
  document.getElementById('gifPanel').classList.remove('open');
}

/* ---------------- Imágenes en el chat ---------------- */
const MAX_CHAT_IMG_MB = 1.5;
function sendChatImage(file){
  if(!file) return;
  if(!currentSendRef()){ alert('Elegí un chat primero.'); return; }
  if(!file.type.startsWith('image/')){ alert('Elegí un archivo de imagen.'); return; }
  if(file.size > MAX_CHAT_IMG_MB * 1024 * 1024){
    alert(`La imagen pesa más de ${MAX_CHAT_IMG_MB}MB. Elegí una más liviana.`);
    return;
  }
  const reader = new FileReader();
  reader.onload = (e)=> sendMedia(e.target.result, 'image');
  reader.onerror = ()=> alert('No se pudo leer la imagen.');
  reader.readAsDataURL(file);
}

/* ---------------- Emojis ---------------- */
const EMOJI_LIST = ['😀','😂','😍','😎','🤩','😢','😡','🤔','👍','👎','🙌','👏','🔥','⚽','🏆','🎉','❄','💬','😱','🥶','🤝','💪','🙏','😴','😅','🥳','😤','👀','⭐','💯'];
function renderEmojiPanel(){
  const grid = document.getElementById('emojiPanelGrid');
  if(!grid) return;
  grid.innerHTML = EMOJI_LIST.map(e=>`<button class="emoji-btn" type="button">${e}</button>`).join('');
  grid.querySelectorAll('.emoji-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const input = document.getElementById('chatInput');
      input.value = (input.value + btn.textContent).slice(0,500);
      input.focus();
    });
  });
}
function closeEmojiPanel(){ document.getElementById('emojiPanel').classList.remove('open'); }
function toggleEmojiPanel(){
  document.getElementById('gifPanel').classList.remove('open');
  const panel = document.getElementById('emojiPanel');
  panel.classList.toggle('open');
}
document.getElementById('chatGifBtn').addEventListener('click', toggleGifPanel);
document.getElementById('gifCloseBtn').addEventListener('click', ()=> document.getElementById('gifPanel').classList.remove('open'));
document.getElementById('gifSearchInput').addEventListener('input', (e)=>{
  clearTimeout(gifSearchTimer);
  const q = e.target.value.trim();
  gifSearchTimer = setTimeout(()=> loadGifs(q || 'futbol'), 400);
});
document.getElementById('chatEmojiBtn').addEventListener('click', toggleEmojiPanel);
document.getElementById('chatImgBtn').addEventListener('click', ()=> document.getElementById('chatImgFile').click());
document.getElementById('chatImgFile').addEventListener('change', (e)=>{
  sendChatImage(e.target.files[0]);
  e.target.value = '';
});
document.getElementById('btnGlobalChat').addEventListener('click', openGlobalChat);
document.getElementById('createGroupBtn').addEventListener('click', openGroupModal);
document.getElementById('closeGroupModal').addEventListener('click', ()=> document.getElementById('groupModal').classList.remove('open'));
document.getElementById('groupModal').addEventListener('click', (e)=>{ if(e.target.id==='groupModal') document.getElementById('groupModal').classList.remove('open'); });
document.getElementById('createGroupConfirmBtn').addEventListener('click', createGroup);

/* ---------------- Predicciones ---------------- */
function savePrediction(matchId, hs, as){
  if(typeof db==='undefined') return;
  db.ref(`social/predictions/${MY_TAG}/${matchId}`).set({hs: Number(hs), as: Number(as)});
}

function renderPredictions(){
  const box = document.getElementById('predictionsList');
  if(!box) return;
  let html = '';
  GROUP_LETTERS.forEach(g=>{
    const ms = STATE.matches.filter(m=>m.group===g);
    if(ms.length===0) return;
    html += `<div class="pred-group-label">GRUPO ${g}</div>`;
    ms.forEach(m=>{
      const p = MY_PREDICTIONS[m.id];
      const teamsLabel = `${teamFlag(m.home)} ${teamFlag(m.away)} <span style="font-size:11px;color:var(--muted)">${teamName(m.home)} vs ${teamName(m.away)}</span>`;
      if(isPlayed(m)){
        let resultIcon = '';
        if(p){
          const correct = Number(p.hs)===Number(m.hs) && Number(p.as)===Number(m.as);
          resultIcon = `<span class="pred-result ${correct?'correct':'wrong'}">${correct?'✓':'✗'}</span>`;
        }
        html += `<div class="pred-item">
          <div class="pred-teams">${teamsLabel}</div>
          <div style="font-size:11px;color:var(--muted)">${p?`${p.hs}-${p.as}`:'—'} · Real ${m.hs}-${m.as}</div>
          ${resultIcon}
        </div>`;
      }else{
        html += `<div class="pred-item">
          <div class="pred-teams">${teamsLabel}</div>
          <div class="pred-inputs">
            <input type="number" min="0" max="20" id="predH_${m.id}" value="${p?p.hs:''}">
            <span>-</span>
            <input type="number" min="0" max="20" id="predA_${m.id}" value="${p?p.as:''}">
          </div>
          <button class="pred-save" data-id="${m.id}">Guardar</button>
        </div>`;
      }
    });
  });

  const koRounds = [
    {label:'RONDA DE 16', ms: STATE.knockout.r16},
    {label:'CUARTOS DE FINAL', ms: STATE.knockout.qf},
    {label:'SEMIFINAL', ms: STATE.knockout.sf},
    {label:'FINAL', ms: [STATE.knockout.final]},
    {label:'TERCER PUESTO', ms: [STATE.knockout.bronze]},
  ];
  koRounds.forEach(({label, ms})=>{
    const ready = ms.filter(m=> m.homeName && m.awayName);
    if(ready.length===0) return;
    html += `<div class="pred-group-label">${label}</div>`;
    ready.forEach(m=>{
      const p = MY_PREDICTIONS[m.id];
      const teamsLabel = `${teamFlag(m.homeName)} ${teamFlag(m.awayName)} <span style="font-size:11px;color:var(--muted)">${teamName(m.homeName)} vs ${teamName(m.awayName)}</span>`;
      if(isPlayed(m)){
        let resultIcon = '';
        if(p){
          const correct = Number(p.hs)===Number(m.hs) && Number(p.as)===Number(m.as);
          resultIcon = `<span class="pred-result ${correct?'correct':'wrong'}">${correct?'✓':'✗'}</span>`;
        }
        html += `<div class="pred-item">
          <div class="pred-teams">${teamsLabel}</div>
          <div style="font-size:11px;color:var(--muted)">${p?`${p.hs}-${p.as}`:'—'} · Real ${m.hs}-${m.as}</div>
          ${resultIcon}
        </div>`;
      }else{
        html += `<div class="pred-item">
          <div class="pred-teams">${teamsLabel}</div>
          <div class="pred-inputs">
            <input type="number" min="0" max="20" id="predH_${m.id}" value="${p?p.hs:''}">
            <span>-</span>
            <input type="number" min="0" max="20" id="predA_${m.id}" value="${p?p.as:''}">
          </div>
          <button class="pred-save" data-id="${m.id}">Guardar</button>
        </div>`;
      }
    });
  });

  box.innerHTML = html || '<div class="empty-note">No hay partidos todavía.</div>';
  box.querySelectorAll('.pred-save').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.id;
      const hs = document.getElementById('predH_'+id).value;
      const as = document.getElementById('predA_'+id).value;
      if(hs==='' || as===''){ alert('Completá ambos resultados.'); return; }
      savePrediction(id, hs, as);
      const orig = btn.textContent;
      btn.textContent = '✓';
      setTimeout(()=> btn.textContent = orig, 1200);
    });
  });
}

/* ---------------- Init social + wiring ---------------- */
function initSocial(){
  if(typeof firebase==='undefined' || typeof db==='undefined') return;
  ensureMySocialProfile();
  // Late para que "en línea" (chat global) muestre a todos los que
  // tienen la página abierta, no solo a quien acaba de entrar: sin este
  // pulso, tu propio lastSeen quedaba fresco pero el de todos los demás
  // se volvía viejo a los pocos minutos y desaparecían de la lista.
  setInterval(()=>{ db.ref('social/users/'+MY_TAG).update({lastSeen: Date.now()}); }, 60000);
  renderEmojiPanel();
  db.ref('social/friends/'+MY_TAG).on('value', snap=>{
    MY_FRIENDS = snap.val() || {};
    renderFriendList();
    updateChatBadge();
    renderAchievements();
  });
  db.ref('social/requests/'+MY_TAG).on('value', snap=>{
    FRIEND_REQUESTS_IN = snap.val() || {};
    renderFriendRequests();
    updateChatBadge();
  });
  db.ref('social/predictions/'+MY_TAG).on('value', snap=>{
    MY_PREDICTIONS = snap.val() || {};
    const activeTab = document.querySelector('.chat-tab.active');
    if(activeTab && activeTab.dataset.ctab==='predicciones') renderPredictions();
    renderAchievements();
  });
  db.ref('social/userGroups/'+MY_TAG).on('value', snap=>{
    MY_GROUPS = snap.val() || {};
    renderGroupList();
  });
  db.ref('social/users/'+MY_TAG+'/manualAchievements').on('value', snap=>{
    MY_MANUAL_ACHIEVEMENTS = snap.val() || [];
    renderAchievements();
  });
}

/* Le entrega a mano un logro a cualquier DT por su código, sin que tenga
   que cumplir la condición — lo usa el admin desde Admin / TV. Se guarda
   en social/users/<tag>/manualAchievements, así que el logro aparece
   desbloqueado en vivo apenas ese DT tenga la app abierta (o la próxima
   vez que la abra). */
function grantAchievement(tag, achId, onDone){
  if(typeof db==='undefined'){ onDone && onDone(false, 'sin-conexion'); return; }
  const ref = db.ref('social/users/'+tag+'/manualAchievements');
  ref.once('value').then(snap=>{
    const cur = snap.val() || [];
    if(cur.includes(achId)){ onDone && onDone(false, 'ya-lo-tiene'); return; }
    cur.push(achId);
    return ref.set(cur).then(()=> onDone && onDone(true));
  }).catch(()=> onDone && onDone(false, 'error'));
}

document.getElementById('chatFab').addEventListener('click', ()=>{
  const panel = document.getElementById('chatPanel');
  panel.classList.toggle('open');
  if(panel.classList.contains('open')){
    document.getElementById('myTagValue').textContent = MY_TAG;
    renderFriendList();
    renderFriendRequests();
    renderGroupList();
  }
});
document.getElementById('chatPanelClose').addEventListener('click', ()=> document.getElementById('chatPanel').classList.remove('open'));
document.getElementById('chatPanelExpand').addEventListener('click', ()=>{
  document.getElementById('chatPanel').classList.toggle('expanded');
});

document.querySelectorAll('.chat-tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.chat-tab').forEach(b=> b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.ctab;
    document.getElementById('ctabChat').style.display = tab==='chat' ? 'flex' : 'none';
    document.getElementById('ctabPredicciones').style.display = tab==='predicciones' ? 'flex' : 'none';
    if(tab==='predicciones') renderPredictions();
  });
});

document.getElementById('addFriendBtn').addEventListener('click', ()=>{
  const inp = document.getElementById('addFriendInput');
  const val = inp.value.trim().toUpperCase();
  if(!val) return;
  if(val===MY_TAG){ alert('Ese es tu propio código.'); return; }
  sendFriendRequest(val);
  inp.value = '';
});
document.getElementById('addFriendInput').addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('addFriendBtn').click(); });

document.getElementById('copyTag').addEventListener('click', async ()=>{
  try{ await navigator.clipboard.writeText(MY_TAG); flashButton('copyTag','✓'); }catch(e){ alert(MY_TAG); }
});

document.getElementById('chatSendBtn').addEventListener('click', sendChatMessage);
document.getElementById('chatInput').addEventListener('keydown', e=>{ if(e.key==='Enter') sendChatMessage(); });
document.getElementById('chatInput').addEventListener('input', ()=>{
  const base = typingBasePath();
  if(!base || typeof db==='undefined') return;
  db.ref(base+'/'+MY_TAG).set(STATE.profile.name || MY_TAG);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(()=>{ db.ref(base+'/'+MY_TAG).remove(); }, 2500);
});

function openMembersModal(title, tags){
  document.getElementById('membersModalTitle').textContent = title;
  const list = document.getElementById('membersModalList');
  if(!tags.length){
    list.innerHTML = '<div class="empty-note" style="padding:6px 0;">Sin miembros para mostrar.</div>';
  }else{
    list.innerHTML = tags.map(t=>`
      <button class="friend-item" data-mtag="${t}" style="width:100%;">
        ${avatarCircle(FRIEND_NAMES[t]||t, FRIEND_COLORS[t], 26)}
        <span class="friend-item-name">${escapeHtml(FRIEND_NAMES[t]||t)}</span>
      </button>
    `).join('');
    list.querySelectorAll('[data-mtag]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        document.getElementById('membersModal').classList.remove('open');
        openFriendProfile(btn.dataset.mtag);
      });
    });
  }
  document.getElementById('membersModal').classList.add('open');
}
document.getElementById('closeMembersModal').addEventListener('click', ()=> document.getElementById('membersModal').classList.remove('open'));
document.getElementById('membersModal').addEventListener('click', (e)=>{ if(e.target.id==='membersModal') document.getElementById('membersModal').classList.remove('open'); });

document.getElementById('chatMembersBtn').addEventListener('click', ()=>{
  if(ACTIVE_CHANNEL.type==='group'){
    const g = GROUP_INFO[ACTIVE_CHANNEL.id] || {};
    const tags = Object.keys(g.members||{});
    tags.forEach(t=>{
      if(!FRIEND_NAMES[t] && typeof db!=='undefined'){
        db.ref('social/users/'+t).once('value').then(snap=>{
          const v = snap.val();
          if(v){ FRIEND_NAMES[t]=v.name||t; FRIEND_COLORS[t]=v.color||'#8b6bff'; }
        }).catch(()=>{});
      }
    });
    openMembersModal(`MIEMBROS · ${g.name||'Grupo'}`, tags);
  }else if(ACTIVE_CHANNEL.type==='global'){
    if(typeof db==='undefined') return;
    db.ref('social/users').once('value').then(snap=>{
      const all = snap.val()||{};
      const now = Date.now();
      const online = Object.entries(all).filter(([t,v])=> v && v.lastSeen && (now-v.lastSeen) < 10*60*1000).map(([t])=>t);
      online.forEach(t=>{ FRIEND_NAMES[t]=all[t].name||t; FRIEND_COLORS[t]=all[t].color||'#8b6bff'; });
      openMembersModal(`EN LÍNEA · CHAT GLOBAL (${online.length})`, online);
    }).catch(()=>{});
  }
});

function teamByCode(code){ return TEAM_DATA.find(t=>t.code===code); }
function teamLabel(code){ const t=teamByCode(code); return t ? `<span class="inline-flag">${flagImg(code,'w40')}</span> ${t.name}` : '???'; }
function teamFlag(code){ return flagImg(code,'w40'); }
function teamName(code){ const t=teamByCode(code); return t ? t.name : '???'; }

/* A score field counts as "present" only if it's a real value. Firebase
   Realtime Database silently DROPS any field whose value is `null` when
   it's written, so an unplayed match's hs/as (null locally) comes back
   from the server as `undefined`, not `null`. Every check in this file
   must treat both the same way — hence this single shared helper instead
   of scattered `=== null` comparisons. */
function hasScore(v){ return v!==null && v!==undefined && v!==''; }

/* ---------------- Standings ---------------- */
function computeStandings(group){
  const teams = TEAM_DATA.filter(t=>t.group===group);
  const table = {};
  teams.forEach(t=> table[t.code] = {code:t.code, pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0});

  STATE.matches.filter(m=>m.group===group).forEach(m=>{
    if(!isPlayed(m)) return;
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
  return STATE.matches.filter(m=>m.group===group).every(isPlayed);
}
function allGroupsComplete(){ return GROUP_LETTERS.every(groupComplete); }
function playedCount(){ return STATE.matches.filter(isPlayed).length; }
function isPlayed(m){ return hasScore(m.hs) && hasScore(m.as) && Number.isFinite(Number(m.hs)) && Number.isFinite(Number(m.as)); }

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
  markViewVisited(STATE.view);
  switch(STATE.view){
    case 'inicio': content.innerHTML = renderInicio(); break;
    case 'grupos': content.innerHTML = renderGrupos(); attachGrupoEvents(); break;
    case 'cuadro': content.innerHTML = renderCuadro(); attachCuadroEvents(); break;
    case 'fama': content.innerHTML = renderFama(); attachFamaEvents(); break;
    case 'ajustes': content.innerHTML = renderAjustes(); attachAjustesEvents(); break;
    case 'admin': content.innerHTML = renderAdmin(); attachAdminEvents(); break;
    default: content.innerHTML = renderInicio();
  }
  /* Retriggerea la animación de fade-in en cada cambio de vista: se saca
     y se vuelve a poner la clase (con un reflow en el medio) para que el
     navegador la corra de nuevo, en vez de solo la primera vez. */
  content.classList.remove('view-fade');
  void content.offsetWidth;
  content.classList.add('view-fade');
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

  const brandHero = Object.assign(defaultBranding(), STATE.branding || {});
  return `
  <div class="hero">
    <h1>${escapeHtml(brandHero.heroPrefix||'')} <span>${escapeHtml(brandHero.heroHighlight||'')}</span></h1>
    <p>${escapeHtml(brandHero.heroText||'')}</p>
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
  ${renderBestThirdsTable()}
  `;
}

/* Tabla de "mejores terceros": solo tiene sentido en el formato de 48
   selecciones (12 grupos, clasifican los 8 mejores terceros de 12 para
   llegar a 32). En el formato de 32 (8 grupos de 4) no existe esta
   instancia: clasifican directo los 2 primeros de cada grupo. */
function renderBestThirdsTable(){
  if(STATE.format !== 48) return '';
  const ranking = computeThirdPlaceRanking(); // ya viene ordenado: pts, dg, gf
  if(ranking.length===0) return '';
  const allDone = allGroupsComplete();
  return `
  <div class="panel" style="margin-top:24px;">
    <div class="panel-head">
      <div class="panel-title">Tabla de Mejores Terceros</div>
      <span class="badge ${allDone?'on':''}">${allDone?'✓ Definida':'Provisoria'}</span>
    </div>
    <table>
      <thead><tr>
        <th class="num">Pos.</th><th>Grupo</th><th>Equipo</th>
        <th class="num">PJ</th><th class="num">PG</th><th class="num">PE</th><th class="num">PP</th>
        <th class="num">GF</th><th class="num">GC</th><th class="num">DG</th><th class="num">PTS</th><th></th>
      </tr></thead>
      <tbody>
      ${ranking.map((r,i)=>`<tr class="${i<8?'qualified':''}">
        <td class="num">${i+1}</td>
        <td class="num" style="font-family:var(--font-mono);color:var(--muted);">${r.group}</td>
        <td class="team-cell"><span class="flag">${teamFlag(r.team.code)}</span>${teamName(r.team.code)}</td>
        <td class="num">${r.team.pj}</td><td class="num">${r.team.pg}</td><td class="num">${r.team.pe}</td><td class="num">${r.team.pp}</td>
        <td class="num">${r.team.gf}</td><td class="num">${r.team.gc}</td><td class="num">${r.team.gf-r.team.gc}</td>
        <td class="num pts-cell">${r.team.pts}</td>
        <td class="num"><span class="badge ${i<8?'on':''}" style="font-size:9.5px;">${i<8?'Clasifica':'Eliminado'}</span></td>
      </tr>`).join('')}
      </tbody>
    </table>
    <p style="padding:0 20px 16px;color:var(--muted);font-size:12px;">Clasifican los 8 mejores terceros de los 12 grupos. ${allDone?'':'El orden puede cambiar hasta que terminen todos los grupos.'}</p>
  </div>`;
}

function attachGrupoEvents(){
  content.querySelectorAll('.score-input').forEach(inp=>{
    inp.addEventListener('input', (e)=>{
      const id = e.target.dataset.id, side = e.target.dataset.side;
      const m = STATE.matches.find(mm=>mm.id===id);
      const val = e.target.value;
      m[side] = val === '' ? null : Math.max(0, Math.min(20, Number(val)));
      saveTournament();
      autoFillKnockoutFromGroups();
      updateSideProgress();
    });
  });
}

/* ---------------- CUADRO ELIMINACIÓN ---------------- */
function bTeamRow(m, side){
  const name = side==='home' ? m.homeName : m.awayName;
  const score = side==='home' ? m.hs : m.as;
  const otherScore = side==='home' ? m.as : m.hs;
  const isWinner = (hasScore(score) && hasScore(otherScore) && Number(score)>Number(otherScore));
  const label = name ? teamLabel(name) : '???';
  const editable = STATE.admin.unlocked && name;
  return `<div class="bteam ${isWinner?'winner':''}">
    <span class="tname">${label}</span>
    <input class="bscore" type="number" min="0" max="20" data-match="${m.id}" data-side="${side}" value="${score??''}" placeholder="-" ${editable?'':'disabled'}>
  </div>`;
}

/* ---------- Historial de enfrentamientos (Head-to-Head) ----------
   Junta TODOS los resultados que conoce la app: los cruces del Salón
   de la Fama (finales, terceros puestos, y el cuadro completo de 2038,
   que es la única edición vieja con bracket detallado guardado) más
   los resultados ya jugados del torneo actual (grupos y eliminación).
   Con eso arma, para cualquier par de selecciones, cuántas veces se
   cruzaron antes y cómo les fue. */
function h2hKey(a,b){ return [a,b].sort().join('__'); }

function buildH2HIndex(){
  const idx = {};
  const add = (home, away, hs, as, year, stage) => {
    if(!home || !away || home==='???' || away==='???' || home===away) return;
    hs = Number(hs); as = Number(as);
    if(!Number.isFinite(hs) || !Number.isFinite(as)) return;
    const key = h2hKey(home, away);
    (idx[key] = idx[key] || []).push({home, away, hs, as, year, stage});
  };

  // Salón de la Fama: final y tercer puesto de cada edición
  HISTORY.forEach(h=>{
    if(h.champion && h.runnerUp && h.finalScore) add(h.champion, h.runnerUp, h.finalScore[0], h.finalScore[1], h.year, 'Final');
    if(h.third && h.fourth && h.thirdScore) add(h.third, h.fourth, h.thirdScore[0], h.thirdScore[1], h.year, 'Tercer puesto');
    if(h.bracket){
      const stageLabel = {r16:'Ronda de 16', qf:'Cuartos', sf:'Semifinal'};
      Object.keys(h.bracket).forEach(roundKey=>{
        (h.bracket[roundKey]||[]).forEach(([home,hs,away,as])=>{
          add(home, away, hs, as, h.year, stageLabel[roundKey] || roundKey);
        });
      });
    }
  });

  // Torneo actual: fase de grupos ya jugada
  STATE.matches.forEach(m=>{
    if(isPlayed(m)) add(teamName(m.home), teamName(m.away), m.hs, m.as, CURRENT_YEAR, 'Fase de grupos');
  });

  // Torneo actual: eliminación directa ya jugada
  const K = STATE.knockout;
  const koStages = [
    [K.r32, 'Dieciseisavos'], [K.r16, 'Ronda de 16'], [K.qf, 'Cuartos'],
    [K.sf, 'Semifinal'], [K.final ? [K.final] : [], 'Final'], [K.bronze ? [K.bronze] : [], 'Tercer puesto'],
  ];
  koStages.forEach(([list, stage])=>{
    (list||[]).forEach(m=>{
      if(m && m.homeName && m.awayName && isPlayed(m)) add(teamName(m.homeName), teamName(m.awayName), m.hs, m.as, CURRENT_YEAR, stage);
    });
  });

  return idx;
}

function getH2H(nameA, nameB){
  if(!nameA || !nameB || nameA==='???' || nameB==='???' || nameA===nameB) return null;
  const idx = buildH2HIndex();
  const list = idx[h2hKey(nameA, nameB)];
  if(!list || !list.length) return null;
  return list.sort((a,b)=> a.year - b.year);
}

/* Nota compacta de historial para meter debajo de una tarjeta de partido
   del cuadro. `m` es un match de knockout con homeName/awayName en CÓDIGO. */
function h2hNote(m){
  if(!m || !m.homeName || !m.awayName) return '';
  const aCode = m.homeName, bCode = m.awayName;
  const aName = teamName(aCode), bName = teamName(bCode);
  const meets = getH2H(aName, bName);
  if(!meets) return '';
  const last = meets[meets.length-1];
  const lastIsAHome = last.home === aName;
  const lastScore = lastIsAHome ? `${last.hs}-${last.as}` : `${last.as}-${last.hs}`;
  const count = meets.length;
  const title = meets.slice().reverse()
    .map(x=> `${x.year} · ${x.stage}: ${x.home} ${x.hs}-${x.as} ${x.away}`)
    .join('\n');
  return `<div class="h2h-note" title="${escapeHtml(title)}">🔁${count>1?` (${count})`:''} ${last.year}: ${aCode} ${lastScore} ${bCode}</div>`;
}

function renderCuadro(){
  const K = STATE.knockout;
  const editable = STATE.admin.unlocked;

  const col = (label, items) => `
    <div class="bracket-col">
      <div class="bcol-label">${label}</div>
      ${items.map(m=>`<div class="bmatch">${bTeamRow(m,'home')}${bTeamRow(m,'away')}</div>${h2hNote(m)}`).join('')}
    </div>`;

  const champion = isPlayed(K.final)
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
      <div class="bracket ${K.r32 ? 'bracket-48' : ''}">
        ${K.r32 ? col('Dieciseisavos', K.r32.slice(0,8)) : ''}
        ${col('Ronda de 16 · P49-P52', [K.r16[0],K.r16[1],K.r16[2],K.r16[3]])}
        ${col('Cuartos', [K.qf[0],K.qf[1]])}
        <div class="bracket-col">
          <div class="bcol-label">Semifinal</div>
          <div class="bmatch">${bTeamRow(K.sf[0],'home')}${bTeamRow(K.sf[0],'away')}</div>
          ${h2hNote(K.sf[0])}
        </div>
        <div class="bracket-col bracket-col-final">
          <div class="champion-box">
            <div class="champion-label">WORLD CHAMPION</div>
            <div class="champion-name">${champion ? teamLabel(champion) : '???'}</div>
          </div>
          <div class="bmatch">
            <div class="bcol-label" style="margin:8px 0 0;">Final</div>
            ${bTeamRow(K.final,'home')}${bTeamRow(K.final,'away')}
          </div>
          ${h2hNote(K.final)}
          <div class="trophy">${assetImg('assets/mundiales/trophy.png','Copa del Mundo','trophy-img')}<span class="trophy-fallback">🏆</span></div>
          <div class="bronze-box">
            <div class="bronze-label">TERCER PUESTO</div>
            ${bTeamRow(K.bronze,'home')}${bTeamRow(K.bronze,'away')}
          </div>
          ${h2hNote(K.bronze)}
        </div>
        <div class="bracket-col">
          <div class="bcol-label">Semifinal</div>
          <div class="bmatch">${bTeamRow(K.sf[1],'home')}${bTeamRow(K.sf[1],'away')}</div>
          ${h2hNote(K.sf[1])}
        </div>
        ${col('Cuartos', [K.qf[2],K.qf[3]])}
        ${col('Ronda de 16 · P53-P56', [K.r16[4],K.r16[5],K.r16[6],K.r16[7]])}
        ${K.r32 ? col('Dieciseisavos', K.r32.slice(8,16)) : ''}
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
      const field = side === 'home' ? 'hs' : 'as';
      const val = e.target.value;
      m[field] = val === '' ? null : Math.max(0, Math.min(20, Number(val)));
      propagateBracket();
      saveTournament();
      const selStart = e.target.selectionStart, selEnd = e.target.selectionEnd;
      render();
      const restored = content.querySelector(`.bscore[data-match="${id}"][data-side="${side}"]`);
      if(restored){
        restored.focus();
        try{ restored.setSelectionRange(selStart, selEnd); }catch(err){}
      }
    });
  });
  const genBtn = document.getElementById('genBracket');
  if(genBtn) genBtn.addEventListener('click', generateBracketFromGroups);
  const resetBtn = document.getElementById('resetBracket');
  if(resetBtn) resetBtn.addEventListener('click', ()=>{
    if(confirm('¿Vaciar todo el cuadro de eliminación?')){
      STATE.knockout = buildEmptyKnockout(STATE.format||32);
      saveTournament(); render();
    }
  });
}

function findKnockoutMatch(id){
  const K = STATE.knockout;
  return [...(K.r32||[]), ...K.r16, ...K.qf, ...K.sf, K.final, K.bronze].find(m=>m.id===id);
}

function matchWinner(m){
  if(!isPlayed(m)) return null;
  const hs=Number(m.hs), as=Number(m.as);
  if(hs>as) return m.homeName;
  if(as>hs) return m.awayName;
  return null;
}
function matchLoser(m){
  if(!isPlayed(m)) return null;
  const hs=Number(m.hs), as=Number(m.as);
  if(hs>as) return m.awayName;
  if(as>hs) return m.homeName;
  return null;
}

function propagateBracket(){
  const K = STATE.knockout;
  // dieciseisavos (r32) -> r16, solo en formato 48
  if(K.r32){
    for(let i=0;i<8;i++){
      K.r16[i].homeName = matchWinner(K.r32[i*2]);
      K.r16[i].awayName = matchWinner(K.r32[i*2+1]);
    }
  }
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

/* Va llenando automáticamente la Ronda de 16 apenas un grupo llega al
   100% de partidos jugados, sin esperar a que el admin apriete
   "Generar cuadro desde grupos" ni a que terminen todos los grupos. */
function autoFillKnockoutFromGroups(){
  if(STATE.format === 48){ autoFillKnockoutFromGroups48(); return; }
  const K = STATE.knockout;
  let changed = false;
  const assign = (slotIdx, side, group, which)=>{
    if(!groupComplete(group)) return;
    const st = computeStandings(group);
    const code = which==='winner' ? st[0].code : st[1].code;
    if(K.r16[slotIdx][side] !== code){ K.r16[slotIdx][side] = code; changed = true; }
  };
  assign(0,'homeName','A','winner'); assign(0,'awayName','B','runnerup');
  assign(1,'homeName','C','winner'); assign(1,'awayName','D','runnerup');
  assign(2,'homeName','B','winner'); assign(2,'awayName','A','runnerup');
  assign(3,'homeName','D','winner'); assign(3,'awayName','C','runnerup');
  assign(4,'homeName','E','winner'); assign(4,'awayName','F','runnerup');
  assign(5,'homeName','G','winner'); assign(5,'awayName','H','runnerup');
  assign(6,'homeName','F','winner'); assign(6,'awayName','E','runnerup');
  assign(7,'homeName','H','winner'); assign(7,'awayName','G','runnerup');
  if(changed){ propagateBracket(); saveTournament(); }
}

/* En 48 no se puede rellenar grupo por grupo como en 32 (los 8 mejores
   terceros dependen de que TODOS los grupos hayan terminado), así que
   esto espera a que allGroupsComplete() sea true, y solo corre una vez
   (si ya hay algo cargado en r32 no lo vuelve a sortear). */
function autoFillKnockoutFromGroups48(){
  if(!allGroupsComplete()) return;
  const K = STATE.knockout;
  if(!K.r32) return;
  const alreadyFilled = K.r32.some(m=> m.homeName || m.awayName);
  if(alreadyFilled) return;
  generateBracketFromGroups48();
}

function checkChampionCelebration(){
  const champ = matchWinner(STATE.knockout.final);
  if(champ && !STATE._celebrated){
    STATE._celebrated = true;
    fireConfetti();
    maybeOfferTournamentDownload();
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

function teamGroupOf(code){ const t = TEAM_DATA.find(x=>x.code===code); return t ? t.group : null; }

/* Ranking de terceros para elegir los 8 mejores (formato oficial 2026):
   puntos, luego diferencia de gol, luego goles a favor. */
function computeThirdPlaceRanking(){
  return GROUP_LETTERS
    .map(g=>({group:g, team: computeStandings(g)[2]}))
    .filter(x=>x.team)
    .sort((a,b)=>{
      if(b.team.pts!==a.team.pts) return b.team.pts-a.team.pts;
      const dgA=a.team.gf-a.team.gc, dgB=b.team.gf-b.team.gc;
      if(dgB!==dgA) return dgB-dgA;
      return b.team.gf-a.team.gf;
    });
}

/* Evita, en la medida de lo posible, que dos equipos del mismo grupo se
   crucen ya en dieciseisavos. No es un sorteo oficial FIFA (esa tabla de
   cruces es enorme); es un armado determinístico (misma semilla → mismo
   resultado siempre) con esa única restricción. */
function avoidSameGroupPairs(list, rng){
  const arr = list.slice();
  for(let i=0; i<arr.length; i+=2){
    let guard = 0;
    while(guard < 20 && teamGroupOf(arr[i]) === teamGroupOf(arr[i+1])){
      const j = Math.floor(rng()*arr.length);
      if(j!==i+1 && j!==i){ [arr[i+1], arr[j]] = [arr[j], arr[i+1]]; }
      guard++;
    }
  }
  return arr;
}

/* Grupos cuyo primer puesto enfrenta a un "mejor tercero" en dieciseisavos
   (esquema real del Mundial 2026 de 48 equipos). Los primeros de los otros
   4 grupos (C, F, H, J) enfrentan a un segundo puesto. La tabla oficial de
   la FIFA tiene 495 combinaciones posibles para asignar qué tercero le
   toca a cada uno de estos 8 primeros; acá usamos un criterio propio más
   simple (aleatorio, evitando que un equipo enfrente a otro de su propio
   grupo) en vez de replicar esa tabla completa. */
const THIRD_PLACE_HOST_GROUPS = ['A','B','D','E','G','I','K','L'];

/* Arma los 16 cruces de dieciseisavos según las reglas de arriba. Como el
   armado tiene margen aleatorio, reintenta unas cuantas veces hasta
   conseguir una versión sin ningún cruce entre equipos del mismo grupo
   (o se queda con el mejor intento si tiene mala suerte 40 veces seguidas,
   algo prácticamente imposible). */
function buildBracketMatches48(winners, runnersup, bestThirds, seed){
  const rng = mulberry32(seed);
  const matches = [];

  const hostGroups = seededShuffle(THIRD_PLACE_HOST_GROUPS.slice(), rng);
  const thirdsPool = seededShuffle(bestThirds.slice(), rng);
  hostGroups.forEach(hostGroup=>{
    let idx = thirdsPool.findIndex(t=> t.group!==hostGroup);
    if(idx===-1) idx = 0;
    const third = thirdsPool.splice(idx,1)[0];
    matches.push({home: winners[hostGroup], away: third.team.code});
  });

  const otherWinnerGroups = GROUP_LETTERS.filter(g=> !THIRD_PLACE_HOST_GROUPS.includes(g));
  const runnerUpGroupsLeft = seededShuffle(GROUP_LETTERS.slice(), rng);
  otherWinnerGroups.forEach(wg=>{
    let idx = runnerUpGroupsLeft.findIndex(rg=> rg!==wg);
    if(idx===-1) idx = 0;
    const rg = runnerUpGroupsLeft.splice(idx,1)[0];
    matches.push({home: winners[wg], away: runnersup[rg]});
  });

  const remainingRunnerCodes = runnerUpGroupsLeft.map(g=> runnersup[g]);
  const pairedRunners = avoidSameGroupPairs(seededShuffle(remainingRunnerCodes, rng), rng);
  for(let i=0;i<pairedRunners.length;i+=2){
    matches.push({home: pairedRunners[i], away: pairedRunners[i+1]});
  }

  return matches;
}

/* Cuenta cuántas veces, en un ordenamiento dado de los 16 cruces de
   dieciseisavos, dos equipos del MISMO grupo original terminan del MISMO
   lado del cuadro (los primeros 8 cruces son la mitad izquierda — llevan
   a la semifinal 1 — y los últimos 8 son la mitad derecha — semifinal 2).
   No alcanza con que no se enfrenten directo: si ambos quedan del mismo
   lado, podrían llegar a cruzarse en cuartos o semifinal. */
function halfClashCount(orderedMatches){
  const leftCount = {}, rightCount = {};
  let clashes = 0;
  orderedMatches.forEach((m, i)=>{
    const bucket = i < 8 ? leftCount : rightCount;
    [teamGroupOf(m.home), teamGroupOf(m.away)].forEach(g=>{
      if(!g) return;
      bucket[g] = (bucket[g] || 0) + 1;
      if(bucket[g] > 1) clashes++;
    });
  });
  return clashes;
}

/* Ordena los 16 cruces en las dos mitades del cuadro evitando, en la
   medida de lo posible, que dos equipos del mismo grupo original queden
   del mismo lado (no solo que no se enfrenten directo). Prueba varias
   semillas deterministas (misma entrada -> mismo resultado siempre) y se
   queda con la que menos "choques de mitad" tenga, idealmente cero. */
function orderMatchesAvoidingHalfClashes(matches, baseSeed){
  let best = matches, bestClashes = Infinity;
  for(let attempt=0; attempt<80; attempt++){
    const rng = mulberry32(baseSeed + attempt);
    const candidate = seededShuffle(matches, rng);
    const clashes = halfClashCount(candidate);
    if(clashes < bestClashes){ best = candidate; bestClashes = clashes; }
    if(bestClashes === 0) break;
  }
  return best;
}

function generateBracketFromGroups48(){
  const winners = {}, runnersup = {};
  GROUP_LETTERS.forEach(g=>{
    const st = computeStandings(g);
    winners[g] = st[0].code;
    runnersup[g] = st[1].code;
  });
  const bestThirds = computeThirdPlaceRanking().slice(0,8); // [{group, team}]

  /* Semilla fija: para los mismos resultados de grupos (mismos winners,
     runnersup y bestThirds), este bucle siempre recorre exactamente las
     mismas semillas en el mismo orden y llega al mismo resultado final.
     Nada de esto usa Math.random, así que "Generar cuadro" ya no vuelve
     a tirar los dados — el cuadro queda fijo hasta que cambien los
     resultados de grupos. */
  const BRACKET_BASE_SEED = 480226;
  let matches = null;
  for(let attempt=0; attempt<40; attempt++){
    const candidate = buildBracketMatches48(winners, runnersup, bestThirds, BRACKET_BASE_SEED + attempt);
    const hasClash = candidate.some(m=> teamGroupOf(m.home)===teamGroupOf(m.away));
    matches = candidate;
    if(!hasClash) break;
  }

  const shuffledMatches = orderMatchesAvoidingHalfClashes(matches, BRACKET_BASE_SEED + 1000);
  const K = buildEmptyKnockout(48);
  shuffledMatches.forEach((m,i)=>{
    K.r32[i].homeName = m.home;
    K.r32[i].awayName = m.away;
  });
  STATE.knockout = K;
  propagateBracket();
  saveTournament();
  render();
  if(!allGroupsComplete()){
    alert('Nota: algunos grupos aún no terminaron. El cuadro se armó con las posiciones actuales (incluyendo terceros) y puede cambiar.');
  }
}

function generateBracketFromGroups(){
  if(STATE.format === 48){ generateBracketFromGroups48(); return; }
  const winners = {}, runnersup = {};
  GROUP_LETTERS.forEach(g=>{
    const st = computeStandings(g);
    winners[g] = st[0].code;
    runnersup[g] = st[1].code;
  });
  const K = buildEmptyKnockout(32);
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
  saveTournament();
  render();
  if(!allGroupsComplete()){
    alert('Nota: algunos grupos aún no terminaron. El cuadro se armó con las posiciones actuales y puede cambiar.');
  }
}

/* ---------------- Resumen final del torneo (capturas + .txt) ---------------- */
function allPlayedTeamMatches(){
  const group = STATE.matches.filter(isPlayed).map(m=>({home:m.home, away:m.away, hs:Number(m.hs), as:Number(m.as)}));
  const ko = allKnockoutMatches().filter(m=> m.homeName && m.awayName && isPlayed(m)).map(m=>({home:m.homeName, away:m.awayName, hs:Number(m.hs), as:Number(m.as)}));
  return [...group, ...ko];
}

function biggestBlowoutText(){
  const ms = allPlayedTeamMatches();
  let best = null;
  ms.forEach(m=>{
    const diff = Math.abs(m.hs - m.as);
    if(!best || diff > best.diff) best = {...m, diff};
  });
  if(!best || best.diff<=0) return null;
  const winnerCode = best.hs>best.as ? best.home : best.away;
  const loserCode = best.hs>best.as ? best.away : best.home;
  const winnerScore = Math.max(best.hs,best.as), loserScore = Math.min(best.hs,best.as);
  return `${teamName(winnerCode)} ${winnerScore}-${loserScore} ${teamName(loserCode)}`;
}

function bestDefenseText(){
  const ms = allPlayedTeamMatches();
  const gc = {}, pj = {};
  ms.forEach(m=>{
    gc[m.home] = (gc[m.home]||0) + m.as;
    gc[m.away] = (gc[m.away]||0) + m.hs;
    pj[m.home] = (pj[m.home]||0) + 1;
    pj[m.away] = (pj[m.away]||0) + 1;
  });
  const codes = Object.keys(pj);
  if(!codes.length) return null;
  codes.sort((a,b)=> gc[a]-gc[b]);
  const best = codes[0];
  return `${teamName(best)} (${gc[best]} goles recibidos en ${pj[best]} partidos)`;
}

/* html2canvas no entiende color-mix()/color(srgb ...). En vez de tocar el DOM
   (que no cubre pseudo-elementos ni elementos fuera del área capturada, como
   el fondo .aurora-bg), reescribimos el TEXTO de la hoja de estilos dentro
   del documento clonado, quitando el color-mix() y dejando solo el color
   dominante (pequeña pérdida de mezcla, pero ya no rompe el parser). */
function stripColorMix(cssText){
  if(!cssText) return cssText;
  return cssText.replace(/color-mix\(\s*in\s+[a-z0-9\- ]+,\s*([^,]+?)\s+[\d.]+%\s*,\s*[^)]+\)/gi, '$1');
}

async function rewriteStylesheetsForCapture(clonedDoc, selector){
  const links = Array.from(clonedDoc.querySelectorAll('link[rel="stylesheet"]'));
  await Promise.all(links.map(async (link)=>{
    try{
      const res = await fetch(link.href);
      const cssText = await res.text();
      const fixed = stripColorMix(cssText);
      const styleTag = clonedDoc.createElement('style');
      styleTag.textContent = fixed;
      link.parentNode.insertBefore(styleTag, link);
      link.remove();
    }catch(err){
      console.warn('No se pudo reescribir stylesheet para captura:', link.href, err);
    }
  }));
  /* Algunos elementos (ej. .champion-box) tienen animaciones CSS que hacen
     pulsar un color (box-shadow). Mientras animan, el navegador interpola
     ese color usando el espacio "oklab", que html2canvas no sabe parsear.
     Apagamos animaciones/transiciones SOLO en el documento clonado (la
     página real sigue animando normal) para que el color quede fijo y plano.

     También sacamos TODOS los degradés de fondo dentro del cuadro: alguno
     (línea conectora, resaltado de ganador, caja del campeón) quedaba en
     0px en el momento exacto de la captura y hacía explotar html2canvas
     con "createPattern... width or height of 0". En vez de perseguir cuál
     es el culpable puntual, los sacamos todos y les devolvemos un color
     sólido parecido a mano. */
  const killAnim = clonedDoc.createElement('style');
  killAnim.textContent = `
    *, *::before, *::after{ animation: none !important; transition: none !important; }
    .bracket-wrap, .bracket-wrap *, .bracket-wrap *::before, .bracket-wrap *::after{
      background-image: none !important;
    }
    .bracket-wrap{ background-color: #05060f !important; }
    .bracket-col:not(:last-child):not(.bracket-col-final)::after{ background-color: #2a3550 !important; }
    .bteam.winner{ background-color: rgba(46,204,113,.14) !important; }
    .champion-box{ background-color: rgba(212,175,55,.14) !important; }
  `;
  clonedDoc.head.appendChild(killAnim);

  /* El contenedor del cuadro tiene scroll horizontal (overflow-x:auto) para
     que entre en pantalla. html2canvas por defecto solo capturaba lo que
     entraba en ese ancho visible, así que el PNG salía cortado a la mitad.
     Acá forzamos que, SOLO en el clon usado para la foto, se vea todo el
     ancho real sin scroll ni recorte. */
  if(selector){
    const cloneEl = clonedDoc.querySelector(selector);
    if(cloneEl){
      cloneEl.style.overflow = 'visible';
      cloneEl.style.maxWidth = 'none';
      cloneEl.style.width = cloneEl.scrollWidth + 'px';
    }
  }
}

/* Espera a que TODAS las imágenes (banderas, etc.) dentro de un elemento
   terminen de cargar antes de sacarle una foto con html2canvas. Un timeout
   fijo (ej. 350ms) alcanza para el cuadro de 32, pero el de 48 tiene el
   doble de banderas y es más ancho, así que varias podían seguir sin
   cargar cuando arrancaba la captura y hacían explotar html2canvas. */
async function waitForImages(el, timeoutMs){
  const imgs = Array.from(el.querySelectorAll('img'));
  await Promise.race([
    Promise.all(imgs.map(img=>{
      if(img.complete && img.naturalWidth>0) return Promise.resolve();
      return new Promise(resolve=>{
        img.addEventListener('load', resolve, {once:true});
        img.addEventListener('error', resolve, {once:true});
      });
    })),
    new Promise(resolve=> setTimeout(resolve, timeoutMs||6000))
  ]);
}

async function captureAndDownload(selector, filename){
  try{
    const el = document.querySelector(selector);
    if(!el || typeof html2canvas==='undefined') return false;
    await waitForImages(el, 6000);
    /* El cuadro de 48 selecciones tiene scroll horizontal (más ancho que la
       pantalla) — le pasamos el ancho/alto REALES del contenido (no lo que
       se ve en pantalla) para que la foto salga completa, no cortada. */
    const fullWidth = Math.max(el.scrollWidth, el.offsetWidth);
    const fullHeight = Math.max(el.scrollHeight, el.offsetHeight);
    const canvasPromise = html2canvas(el, {
      backgroundColor:'#0a1220', scale:2, useCORS:true, imageTimeout:8000, logging:false,
      width: fullWidth, height: fullHeight,
      windowWidth: fullWidth, windowHeight: fullHeight,
      onclone: (clonedDoc)=> rewriteStylesheetsForCapture(clonedDoc, selector)
    });
    const timeoutPromise = new Promise((_, reject)=> setTimeout(()=> reject(new Error('Timeout: la captura tardó más de 12s (probablemente una imagen externa no cargó)')), 12000));
    const canvas = await Promise.race([canvasPromise, timeoutPromise]);
    await new Promise((resolve, reject)=>{
      canvas.toBlob(blob=>{
        if(!blob){ reject(new Error('toBlob devolvió vacío')); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    });
    return true;
  }catch(err){
    console.error('captureAndDownload falló para', selector, err);
    return false;
  }
}

function downloadTournamentTxt(){
  const champ = matchWinner(STATE.knockout.final);
  const lines = [
    'MUNDIAL 2042 · HIELO ETERNO — RESUMEN FINAL',
    '',
    `Campeón: ${champ ? teamName(champ) : '—'}`,
    `Fair Play del torneo: ${STATE.awards.fairplay || 'A definir'}`,
    `Goleador del torneo: ${STATE.awards.goleador || 'A definir'}`,
    `Muro defensivo del torneo: ${bestDefenseText() || 'A definir'}`,
    `Goleada del torneo: ${biggestBlowoutText() || 'A definir'}`,
  ];
  const blob = new Blob([lines.join('\n')], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'mundial-2042-premios.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function downloadTournamentSummary(){
  const originalView = STATE.view;
  let ok1 = false, ok2 = false;

  try{
    if(typeof html2canvas === 'undefined'){
      console.error('html2canvas no está disponible.');
    }else{
      STATE.view = 'grupos';
      render();
      await new Promise(r=> setTimeout(r, 350));
      ok1 = await captureAndDownload('#content', 'mundial-2042-fase-grupos.png');

      STATE.view = 'cuadro';
      render();
      await new Promise(r=> setTimeout(r, 350));
      ok2 = await captureAndDownload('.bracket-wrap', 'mundial-2042-cuadro-final.png');
    }
  }finally{
    STATE.view = originalView;
    render();
  }

  downloadTournamentTxt();

  if(!ok1 || !ok2){
    alert('El .txt de premios se descargó, pero una o ambas capturas de imagen fallaron (probablemente por las banderas externas). Abrí la consola del navegador (F12) para ver el detalle exacto.');
  }
}

function maybeOfferTournamentDownload(){
  if(!isAdmin()) return;
  setTimeout(()=>{
    if(confirm('🏆 ¡Se coronó un campeón! ¿Querés descargar las capturas de la fase de grupos, el cuadro final y el resumen de premios del torneo?')){
      downloadTournamentSummary();
    }
  }, 700);
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
  const hs = hasScore(m.hs) ? Number(m.hs) : null;
  const as = hasScore(m.as) ? Number(m.as) : null;
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
  if(!isPlayed(f) || !f.homeName || !f.awayName) return null;
  const hs=Number(f.hs), as=Number(f.as);
  if(hs===as) return null;
  const champCode = hs>as ? f.homeName : f.awayName;
  const runnerCode = hs>as ? f.awayName : f.homeName;
  let third=null, fourth=null, thirdScore=null;
  const br = K.bronze;
  if(isPlayed(br) && br.homeName && br.awayName){
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
  // Si esa edición ya quedó archivada a mano en HISTORY (con su cuadro
  // completo), no la duplicamos con la versión "en vivo" leída del
  // navegador — evita que 2042 aparezca dos veces en el Salón de la Fama.
  if(current && HISTORY.some(h=>h.year===current.year)) return HISTORY;
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
  const totalEditions = all.length;
  return {
    titles: titles.length, subs: subs.length, thirds: thirds.length,
    years: titles.map(h=>h.year).sort((a,b)=>b-a),
    latestTitle,
    isVigente: latestTitle === Math.max(...all.map(h=>h.year)),
    participaciones: PARTICIPATION_OVERRIDES[name] !== undefined ? PARTICIPATION_OVERRIDES[name] : totalEditions,
  };
}

/* ---------- Ranking IPFT por puntos (TODOS los países) ----------
   Sistema de puntos propio de la app, pensado para recompensar tanto
   los logros grandes (títulos, finales, semis) como la participación
   sostenida (partidos jugados). Se recalcula en vivo con cada Mundial:
   apenas HISTORY suma una edición archivada, o el torneo en curso
   registra resultados, el ranking se actualiza solo.

     🏆 Campeón            +100 pts
     🥈 Subcampeón          +60 pts
     🥉 Tercer puesto       +40 pts
     4️⃣ Cuarto puesto       +20 pts
     ⛸ Llegar a Octavos    +10 pts (por cada vez)
     ⚽ Partido jugado       +2 pts (por cada partido, cualquier fase)

   "Todos los países" = todo país que aparece en el roster del torneo
   actual (TEAM_DATA), en la base de selecciones (COUNTRY_DB) o en
   cualquier resultado histórico registrado — así ningún país queda
   afuera del ranking, aunque tenga 0 puntos. */
const IPFT_POINTS = { titulo:100, subcampeon:60, tercero:40, cuarto:20, octavos:10, partido:2 };

function computeIpftRanking(){
  const stats = {};
  const ensure = (name)=>{
    if(!name || name==='???') return null;
    if(!stats[name]) stats[name] = {name, titles:0, subs:0, thirds:0, fourths:0, octavos:0, partidos:0};
    return stats[name];
  };

  // Sembramos con todos los países conocidos por la app, aunque tengan 0 puntos.
  TEAM_DATA.forEach(t=>ensure(t.name));
  COUNTRY_DB.forEach(c=>ensure(c.name));

  const all = allHallEntries();
  all.forEach(h=>{
    if(h.champion) ensure(h.champion).titles++;
    if(h.runnerUp) ensure(h.runnerUp).subs++;
    if(h.third) ensure(h.third).thirds++;
    if(h.fourth) ensure(h.fourth).fourths++;

    // La final y el tercer puesto suman como partido jugado para sus 4 protagonistas.
    if(h.champion && h.runnerUp){ ensure(h.champion).partidos++; ensure(h.runnerUp).partidos++; }
    if(h.third && h.fourth){ ensure(h.third).partidos++; ensure(h.fourth).partidos++; }

    if(h.group && h.group.teams){
      h.group.teams.forEach(t=>{ const s=ensure(t.name); if(s) s.partidos += Number(t.pj)||0; });
    }
    if(h.bracket){
      Object.keys(h.bracket).forEach(roundKey=>{
        (h.bracket[roundKey]||[]).forEach(([home,hs,away,as])=>{
          const sh=ensure(home), sa=ensure(away);
          if(sh) sh.partidos++;
          if(sa) sa.partidos++;
          if(roundKey==='r16'){ if(sh) sh.octavos++; if(sa) sa.octavos++; }
        });
      });
    }
  });

  // Torneo en curso: solo si esa edición todavía no está archivada en HISTORY
  // (evita sumar 2042 dos veces una vez que quede guardada a mano).
  const current = currentChampionEntry();
  const alreadyArchived = current && HISTORY.some(h=>h.year===current.year);
  if(!alreadyArchived){
    STATE.matches.forEach(m=>{
      if(isPlayed(m)){
        const sh=ensure(teamName(m.home)), sa=ensure(teamName(m.away));
        if(sh) sh.partidos++;
        if(sa) sa.partidos++;
      }
    });
    const K = STATE.knockout;
    const stagesList = [
      ['r32', K.r32||[]], ['r16', K.r16||[]], ['qf', K.qf||[]], ['sf', K.sf||[]],
      ['final', K.final?[K.final]:[]], ['bronze', K.bronze?[K.bronze]:[]],
    ];
    stagesList.forEach(([key, list])=>{
      list.forEach(m=>{
        if(m && m.homeName && m.awayName && isPlayed(m)){
          const sh=ensure(teamName(m.homeName)), sa=ensure(teamName(m.awayName));
          if(sh) sh.partidos++;
          if(sa) sa.partidos++;
          if(key==='r16'){ if(sh) sh.octavos++; if(sa) sa.octavos++; }
        }
      });
    });
  }

  Object.values(stats).forEach(s=>{
    s.points = s.titles*IPFT_POINTS.titulo + s.subs*IPFT_POINTS.subcampeon + s.thirds*IPFT_POINTS.tercero
      + s.fourths*IPFT_POINTS.cuarto + s.octavos*IPFT_POINTS.octavos + s.partidos*IPFT_POINTS.partido;
  });

  return Object.values(stats).sort((a,b)=>
    b.points-a.points || b.titles-a.titles || b.subs-a.subs || b.thirds-a.thirds || b.partidos-a.partidos || a.name.localeCompare(b.name));
}

/* Optional local photos: drop files into the paths below (inside the repo)
   and they'll appear automatically; until then a themed gradient shows instead. */
function assetImg(src, alt, cls){
  return `<img src="${src}" alt="${alt}" class="${cls||''}" loading="lazy" onerror="this.classList.add('img-missing')">`;
}

let famaNav = {view:'ranking', country:null, year:null, tab:'grupos', search:'', h2hA:null, h2hB:null};

function renderFama(){
  const current = currentChampionEntry();
  const all = allHallEntries();
  const champions = [...new Set(all.map(h=>h.champion))]
    .map(name=> ({name, ...countryStats(name)}))
    .sort((a,b)=> b.titles-a.titles || b.latestTitle-a.latestTitle);

  const subnav = `
  <div class="fama-topbar">
    <div class="fama-subnav">
      ${['ranking','puntos','historial','todos','stats','historia','acerca'].map(v=>`
        <button class="fama-tab ${famaNav.view===v?'active':''}" data-famanav="${v}">${{
          ranking:'Ranking', puntos:'Ranking IPFT', historial:'Historial', todos:'Todos los Mundiales', stats:'Estadísticas', historia:'Historia', acerca:'Acerca de'
        }[v]}</button>`).join('')}
    </div>
    <div class="fama-search">
      <input type="text" id="famaSearch" placeholder="Buscar país..." value="${famaNav.search}">
    </div>
  </div>`;

  let body = '';
  if(famaNav.view==='country' && famaNav.country) body = renderCountryDetail(famaNav.country, champions, all);
  else if(famaNav.view==='mundial' && famaNav.year) body = renderMundialDetail(famaNav.year, all);
  else if(famaNav.view==='puntos') body = renderFamaPuntos();
  else if(famaNav.view==='historial') body = renderFamaHistorial();
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

function renderFamaPuntos(){
  const ranking = computeIpftRanking();
  const q = (famaNav.search||'').trim().toLowerCase();
  const filtered = q ? ranking.filter(c=>c.name.toLowerCase().includes(q)) : ranking;

  const rows = filtered.map((c,i)=>`
    <tr class="clickable" data-country="${c.name}">
      <td class="num">${ranking.indexOf(c)+1}</td>
      <td class="team-cell"><span class="flag">${flagByCountryName(c.name,'w40')}</span>${c.name}</td>
      <td class="num pts-cell">${c.points}</td>
      <td class="num">${c.titles||''}</td>
      <td class="num">${c.subs||''}</td>
      <td class="num">${c.thirds||''}</td>
      <td class="num">${c.octavos||''}</td>
      <td class="num">${c.partidos||''}</td>
    </tr>`).join('');

  return `
  <div class="panel ipft-legend-panel">
    <div class="panel-title" style="margin-bottom:4px;">Ranking IPFT · Sistema de puntos</div>
    <div class="ranking-sub" style="margin:0 0 14px;">Se actualiza solo con cada Mundial jugado — todos los países cuentan, aunque tengan 0 puntos</div>
    <div class="ipft-points-legend">
      <span>🏆 Campeón <b>+${IPFT_POINTS.titulo}</b></span>
      <span>🥈 Subcampeón <b>+${IPFT_POINTS.subcampeon}</b></span>
      <span>🥉 Tercer puesto <b>+${IPFT_POINTS.tercero}</b></span>
      <span>4️⃣ Cuarto puesto <b>+${IPFT_POINTS.cuarto}</b></span>
      <span>⛸ Llegar a Octavos <b>+${IPFT_POINTS.octavos}</b> c/u</span>
      <span>⚽ Partido jugado <b>+${IPFT_POINTS.partido}</b> c/u</span>
    </div>
  </div>
  <div class="panel">
    <div class="panel-head"><div class="panel-title">Ranking IPFT · Todos los países</div></div>
    <div class="table-scroll">
    <table>
      <thead><tr>
        <th>#</th><th>País</th><th class="num">Puntos</th><th class="num">🏆</th><th class="num">🥈</th><th class="num">🥉</th><th class="num">Octavos</th><th class="num">PJ</th>
      </tr></thead>
      <tbody>${rows || '<tr><td colspan="8" class="empty-note">No se encontraron países.</td></tr>'}</tbody>
    </table>
    </div>
  </div>`;
}

function renderFamaHistorial(){
  const names = [...new Set([...TEAM_DATA.map(t=>t.name), ...COUNTRY_DB.map(c=>c.name)])].sort((a,b)=>a.localeCompare(b));
  const a = (famaNav.h2hA && names.includes(famaNav.h2hA)) ? famaNav.h2hA : names[0];
  let b = (famaNav.h2hB && names.includes(famaNav.h2hB)) ? famaNav.h2hB : names.find(n=>n!==a);
  if(a===b) b = names.find(n=>n!==a);

  const optsA = names.map(n=>`<option value="${escapeHtml(n)}" ${n===a?'selected':''}>${n}</option>`).join('');
  const optsB = names.map(n=>`<option value="${escapeHtml(n)}" ${n===b?'selected':''}>${n}</option>`).join('');

  let body;
  if(!a || !b || a===b){
    body = `<div class="empty-note">Elegí dos países distintos para ver su historial.</div>`;
  } else {
    const meets = getH2H(a, b);
    if(!meets || !meets.length){
      body = `<div class="empty-note">${a} y ${b} nunca se enfrentaron en un Mundial, según los datos registrados.</div>`;
    } else {
      let winsA=0, winsB=0, draws=0;
      meets.forEach(m=>{
        const aIsHome = m.home===a;
        const sa = aIsHome ? m.hs : m.as, sb = aIsHome ? m.as : m.hs;
        if(sa>sb) winsA++; else if(sb>sa) winsB++; else draws++;
      });
      const rows = meets.slice().reverse().map(m=>{
        const aIsHome = m.home===a;
        const sa = aIsHome ? m.hs : m.as, sb = aIsHome ? m.as : m.hs;
        const cls = sa>sb ? 'h2h-win' : sa<sb ? 'h2h-lose' : 'h2h-draw';
        return `<div class="h2h-match-row ${cls}">
          <span class="h2h-year">${m.year}</span>
          <span class="h2h-stage">${m.stage}</span>
          <span class="h2h-score">${flagByCountryName(a,'w40')} <b>${sa} - ${sb}</b> ${flagByCountryName(b,'w40')}</span>
        </div>`;
      }).join('');
      body = `
      <div class="h2h-summary">
        <div class="h2h-summary-team">
          <div class="h2h-summary-flag">${flagByCountryName(a,'w80')}</div>
          <div class="h2h-summary-name">${a}</div>
          <div class="h2h-summary-wins">${winsA} victoria${winsA!==1?'s':''}</div>
        </div>
        <div class="h2h-summary-mid">
          <div class="h2h-summary-count">${meets.length}</div>
          <div class="h2h-summary-label">enfrentamiento${meets.length!==1?'s':''}</div>
          <div class="h2h-summary-draws">${draws} empate${draws!==1?'s':''}</div>
        </div>
        <div class="h2h-summary-team">
          <div class="h2h-summary-flag">${flagByCountryName(b,'w80')}</div>
          <div class="h2h-summary-name">${b}</div>
          <div class="h2h-summary-wins">${winsB} victoria${winsB!==1?'s':''}</div>
        </div>
      </div>
      <div class="panel" style="padding:16px 20px;margin-top:16px;">
        <div class="panel-title" style="margin-bottom:10px;">Historial completo</div>
        ${rows}
      </div>`;
    }
  }

  return `
  <div class="panel" style="padding:20px;margin-bottom:16px;">
    <div class="panel-title" style="margin-bottom:12px;">Historial entre dos países</div>
    <div class="h2h-picker-row">
      <select id="h2hSelectA">${optsA}</select>
      <span class="h2h-vs">VS</span>
      <select id="h2hSelectB">${optsB}</select>
    </div>
  </div>
  ${body}
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

function awardsPanelHtml(entry){
  const rows = [
    entry.balon ? ['🥇 Balón de Oro', entry.balon] : null,
    entry.goleador ? ['🎯 Goleador del Torneo', entry.goleador] : null,
    entry.fairplay ? ['⚖️ Fair Play', entry.fairplay] : null,
    entry.muroDefensivo ? ['🧱 Muro Defensivo', entry.muroDefensivo] : null,
    entry.goleada ? ['💥 Goleada del Torneo', entry.goleada] : null,
  ].filter(Boolean);
  if(!rows.length) return '';
  return `
  <div class="panel awards-panel" style="padding:20px;margin-top:16px;">
    <div class="panel-title" style="margin-bottom:10px;">Premios del Torneo</div>
    <div class="stat-box">${rows.map(([label,val])=>`<div class="stat-row"><span>${label}</span><strong>${escapeHtml(val)}</strong></div>`).join('')}</div>
  </div>`;
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
  ${awardsPanelHtml(entry)}
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
  const decided = hasScore(hs) && hasScore(as);
  const hWin = pen ? pen==='home' : (decided && hs>as);
  const aWin = pen ? pen==='away' : (decided && as>hs);
  const hDisp = hasScore(hs) ? hs : '–';
  const aDisp = hasScore(as) ? as : '–';
  return `<div class="mm">
    <div class="mm-team ${hWin?'win':''}"><span class="flag">${flagByCountryName(hn,'w40')}</span>${hn}<b>${hDisp}${pen==='home'?'*':''}</b></div>
    <div class="mm-team ${aWin?'win':''}"><span class="flag">${flagByCountryName(an,'w40')}</span>${an}<b>${aDisp}${pen==='away'?'*':''}</b></div>
  </div>`;
}

function renderMiniBracket(bracket){
  const f = bracket.final;
  const finalDecided = f && hasScore(f[1]) && hasScore(f[3]);
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

  const h2hA = document.getElementById('h2hSelectA');
  if(h2hA) h2hA.addEventListener('change', (e)=>{ famaNav.h2hA = e.target.value; render(); });
  const h2hB = document.getElementById('h2hSelectB');
  if(h2hB) h2hB.addEventListener('change', (e)=>{ famaNav.h2hB = e.target.value; render(); });
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

    <div class="panel-title" style="margin-bottom:12px;margin-top:22px;">Notificaciones de chat</div>
    <div class="device-options">
      <div class="device-opt ${STATE.settings.notifications!==false?'active':''}" id="notifOn">Activadas</div>
      <div class="device-opt ${STATE.settings.notifications===false?'active':''}" id="notifOff">Pausadas</div>
    </div>
    <p class="hint" style="margin-top:8px;">Te avisa cuando llega un mensaje nuevo y no estás mirando el chat en pantalla.</p>
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

  content.querySelectorAll('.device-opt[data-dev]').forEach(el=>{
    el.addEventListener('click', ()=>{
      setDevice(el.dataset.dev);
    });
  });

  const notifOn = document.getElementById('notifOn');
  const notifOff = document.getElementById('notifOff');
  if(notifOn) notifOn.addEventListener('click', ()=>{
    STATE.settings.notifications = true;
    saveState();
    if(typeof Notification!=='undefined' && Notification.permission==='default') Notification.requestPermission();
    render();
  });
  if(notifOff) notifOff.addEventListener('click', ()=>{
    STATE.settings.notifications = false;
    saveState();
    render();
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
  const brand = Object.assign(defaultBranding(), STATE.branding || {});
  return `
  <h1 class="page-title">Admin / TV <span class="badge on">Edición desbloqueada</span></h1>
  <div class="admin-panel">
    <div class="admin-box">
      <h3>Nuevo torneo</h3>
      <p>Elegí el formato (32 o 48 selecciones), la/s sede/s (1 a 3 países) y qué países participan, por confederación.</p>
      <button class="btn-primary" id="adminNewTournament">Configurar nuevo torneo</button>
    </div>
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
      <h3>Premios del torneo</h3>
      <p>Fair Play y Goleador se cargan a mano (no hay datos de jugadores para calcularlos solos). Se usan en el resumen final.</p>
      <div class="field">
        <label class="mini-label">Fair Play del torneo</label>
        <input type="text" id="awardFairplay" maxlength="40" value="${escapeHtml(STATE.awards.fairplay||'')}" placeholder="Ej: Ghana">
      </div>
      <div class="field" style="margin-top:8px;">
        <label class="mini-label">Goleador del torneo</label>
        <input type="text" id="awardGoleador" maxlength="40" value="${escapeHtml(STATE.awards.goleador||'')}" placeholder="Ej: Julian Alvarez (7 goles)">
      </div>
    </div>
    <div class="admin-box">
      <h3>Descargar resumen del torneo</h3>
      <p>Genera 2 imágenes (fase de grupos completa y cuadro de eliminación completo, ambos con resultados) y un .txt con fair play, goleador, muro defensivo y goleada del torneo.</p>
      <button class="btn-primary" id="adminDownloadSummary">Descargar resumen del torneo</button>
    </div>
    <div class="admin-box branding-box" style="grid-column:1/-1;">
      <h3>Identidad del Mundial</h3>
      <p>Título, subtítulo, logo y fondo de esta edición. Se guarda solo (no hace falta botón) y se ve en vivo por todos los que tengan la app abierta.</p>

      <div class="field">
        <label class="mini-label">Título</label>
        <input type="text" id="brandTitleInput" maxlength="40" value="${escapeHtml(brand.title)}" placeholder="Ej: MUNDIAL 2046">
      </div>
      <div class="field">
        <label class="mini-label">Subtítulo</label>
        <input type="text" id="brandSubtitleInput" maxlength="60" value="${escapeHtml(brand.subtitle)}" placeholder="Ej: FUEGO Y ARENA · EDICIÓN DESIERTO">
      </div>

      <div class="field-row two">
        <div class="field">
          <label class="mini-label">Inicio: texto antes del resaltado</label>
          <input type="text" id="brandHeroPrefixInput" maxlength="40" value="${escapeHtml(brand.heroPrefix)}" placeholder="Ej: BIENVENIDO AL">
        </div>
        <div class="field">
          <label class="mini-label">Inicio: texto resaltado (dorado)</label>
          <input type="text" id="brandHeroHighlightInput" maxlength="40" value="${escapeHtml(brand.heroHighlight)}" placeholder="Ej: HIELO ETERNO">
        </div>
      </div>
      <div class="field">
        <label class="mini-label">Inicio: párrafo de bienvenida</label>
        <textarea id="brandHeroTextInput" maxlength="280" rows="3" placeholder="Texto que ven todos en la pantalla de Inicio">${escapeHtml(brand.heroText)}</textarea>
      </div>

      <div class="field">
        <label class="mini-label">Logo (emoji o imagen)</label>
        <div class="branding-logo-row">
          <div class="branding-logo-preview" id="brandLogoPreview">${brand.logoImage ? `<img src="${brand.logoImage}" alt="Logo">` : escapeHtml(brand.logoEmoji||'❄')}</div>
          <input type="text" id="brandLogoEmojiInput" maxlength="4" value="${brand.logoImage ? '' : escapeHtml(brand.logoEmoji||'')}" placeholder="❄" style="width:70px;text-align:center;" ${brand.logoImage?'disabled':''}>
          <label class="upload-btn" for="brandLogoFileInput"><span>${brand.logoImage?'Cambiar imagen':'Subir imagen (ej: escudo de México)'}</span></label>
          <input type="file" id="brandLogoFileInput" accept="image/*" style="display:none;">
          <button type="button" class="btn-mini-clear" id="brandLogoClearBtn" ${brand.logoImage?'':'style="display:none;"'}>Quitar imagen y usar emoji</button>
        </div>
        <div class="hint">Si subís una imagen, reemplaza al emoji (se usa como logo en la barra superior). Recomendado: cuadrada, menor a 500KB.</div>
      </div>

      <div class="field">
        <label class="mini-label">Colores de fondo</label>
        <div class="branding-grad-row">
          <input type="color" id="brandGrad1Input" value="${brand.grad1}" class="color-block">
          <input type="color" id="brandGrad2Input" value="${brand.grad2}" class="color-block">
          <label class="upload-btn" for="brandBgFileInput"><span>${brand.bgImage?'Cambiar imagen de fondo':'Subir imagen de fondo (opcional)'}</span></label>
          <input type="file" id="brandBgFileInput" accept="image/*" style="display:none;">
          <button type="button" class="btn-mini-clear" id="brandBgClearBtn" ${brand.bgImage?'':'style="display:none;"'}>Quitar imagen de fondo</button>
        </div>
        <div class="hint">La imagen de fondo (si hay) se muestra detrás de las auroras; si no cargás ninguna, se usa el degradé de estos dos colores.</div>
      </div>

      <div class="branding-live-note"><span class="live-dot on"></span> Cambios en vivo para todos · misma sync que los resultados</div>
      <button class="btn-secondary" id="brandResetBtn" style="margin-top:14px;">Restaurar identidad por defecto (Mundial 2042)</button>
    </div>

    <div class="admin-box" style="grid-column:1/-1;">
      <h3>Entregar logros</h3>
      <p>Otorgale a mano un logro a cualquier DT por su código, sin que tenga que cumplir la condición — útil para premiar algo que pasó fuera de la app.</p>
      <div class="field-row two">
        <div class="field">
          <label class="mini-label">Código del DT</label>
          <input type="text" id="grantTagInput" maxlength="12" placeholder="DT-4821">
        </div>
        <div class="field">
          <label class="mini-label">Logro</label>
          <select id="grantAchvSelect">
            ${ACHIEVEMENTS.map(a=>`<option value="${a.id}">${a.icon} ${escapeHtml(a.name)}</option>`).join('')}
          </select>
        </div>
      </div>
      <button class="btn-primary" id="grantAchvBtn">Entregar logro</button>
      <div class="hint" id="grantAchvHint"></div>
    </div>

    <div class="admin-box">
      <h3>Música del Mundial</h3>
      <p>Pegá el link de YouTube del tema/himno de esta edición. Se guarda solo y aparece un botón 🎵 en la barra superior para todos, en vivo.</p>
      <div class="field">
        <label class="mini-label">Link de YouTube</label>
        <input type="text" id="musicUrlInput" maxlength="200" value="${escapeHtml((STATE.music&&STATE.music.youtubeUrl)||'')}" placeholder="https://www.youtube.com/watch?v=...">
      </div>
      <div class="hint" id="musicUrlHint" style="margin-top:6px;"></div>
      <button class="btn-mini-clear" id="musicUrlClearBtn" style="margin-top:10px;">Quitar música</button>
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
  const newTournamentBtn = document.getElementById('adminNewTournament');
  if(newTournamentBtn) newTournamentBtn.addEventListener('click', openNewTournamentModal);
  const genBtn = document.getElementById('adminGen');
  if(genBtn) genBtn.addEventListener('click', generateBracketFromGroups);
  const resetBtn = document.getElementById('adminReset');
  if(resetBtn) resetBtn.addEventListener('click', ()=>{
    if(confirm('¿Seguro que querés reiniciar TODO el torneo? Esta acción no se puede deshacer y vuelve al torneo original de 32 selecciones.')){
      TEAM_DATA = ORIGINAL_TEAM_DATA.slice();
      GROUP_LETTERS = ORIGINAL_GROUP_LETTERS.slice();
      const kept = {profile: STATE.profile, settings: STATE.settings, admin: STATE.admin};
      STATE = Object.assign(defaultState(32), kept);
      STATE.teamData = TEAM_DATA;
      STATE.groupLetters = GROUP_LETTERS;
      saveTournament(); render();
    }
  });
  const exportBtn = document.getElementById('adminExport');
  if(exportBtn) exportBtn.addEventListener('click', exportData);
  const ffInput = document.getElementById('awardFairplay');
  if(ffInput) ffInput.addEventListener('input', ()=>{ STATE.awards.fairplay = ffInput.value; saveState(); });
  const goInput = document.getElementById('awardGoleador');
  if(goInput) goInput.addEventListener('input', ()=>{ STATE.awards.goleador = goInput.value; saveState(); });
  const dlSummaryBtn = document.getElementById('adminDownloadSummary');
  if(dlSummaryBtn) dlSummaryBtn.addEventListener('click', ()=>{
    if(!matchWinner(STATE.knockout.final)){
      if(!confirm('¿Estás seguro? El torneo aún no terminó. Se descargará el resumen con los resultados que haya hasta ahora.')) return;
    }
    downloadTournamentSummary();
  });
  const lockBtn = document.getElementById('adminLock');
  if(lockBtn) lockBtn.addEventListener('click', ()=>{ STATE.admin.unlocked=false; saveState(); render(); });

  attachBrandingEvents();
  attachMusicAdminEvents();
  attachGrantAchievementEvents();
}

function attachGrantAchievementEvents(){
  const btn = document.getElementById('grantAchvBtn');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    const tagInp = document.getElementById('grantTagInput');
    const sel = document.getElementById('grantAchvSelect');
    const hint = document.getElementById('grantAchvHint');
    const tag = tagInp.value.trim().toUpperCase();
    if(!tag){
      hint.textContent = 'Ingresá el código del DT (ej: DT-4821).';
      hint.style.color = 'var(--danger)';
      return;
    }
    const achId = sel.value;
    hint.textContent = 'Entregando…';
    hint.style.color = 'var(--muted)';
    grantAchievement(tag, achId, (ok, reason)=>{
      if(ok){
        hint.textContent = `✓ Logro entregado a ${tag}.`;
        hint.style.color = 'var(--success)';
        tagInp.value = '';
      }else if(reason==='ya-lo-tiene'){
        hint.textContent = `${tag} ya tiene ese logro.`;
        hint.style.color = 'var(--gold)';
      }else if(reason==='sin-conexion'){
        hint.textContent = 'Sin conexión — no se pudo entregar el logro.';
        hint.style.color = 'var(--danger)';
      }else{
        hint.textContent = 'Error al entregar el logro. Probá de nuevo.';
        hint.style.color = 'var(--danger)';
      }
    });
  });
  const tagInp = document.getElementById('grantTagInput');
  if(tagInp) tagInp.addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('grantAchvBtn').click(); });
}

function attachMusicAdminEvents(){
  const urlInput = document.getElementById('musicUrlInput');
  const hint = document.getElementById('musicUrlHint');
  if(!urlInput) return;

  const updateHint = (id)=>{
    if(!hint) return;
    if(!urlInput.value.trim()) hint.textContent = '';
    else hint.textContent = id ? '✓ Link válido' : 'No reconozco ese link de YouTube — probá copiarlo de nuevo.';
  };
  updateHint(extractYouTubeId(urlInput.value));

  urlInput.addEventListener('input', ()=>{
    if(!STATE.music) STATE.music = defaultMusic();
    const val = urlInput.value.trim();
    const id = extractYouTubeId(val);
    STATE.music.youtubeUrl = val || null;
    updateHint(id);
    applyMusicButton();
    saveTournament();
  });

  const clearBtn = document.getElementById('musicUrlClearBtn');
  if(clearBtn) clearBtn.addEventListener('click', ()=>{
    STATE.music = defaultMusic();
    urlInput.value = '';
    updateHint(null);
    applyMusicButton();
    saveTournament();
  });
}

/* ---------------- Identidad del Mundial (branding) — eventos ---------------- */
function ensureBranding(){
  if(!STATE.branding) STATE.branding = defaultBranding();
  return STATE.branding;
}

function readImageFileMax(file, maxMB, onDone){
  if(!file) return;
  if(!file.type.startsWith('image/')){ alert('Elegí un archivo de imagen (PNG, JPG o GIF).'); return; }
  if(file.size > maxMB * 1024 * 1024){
    alert(`La imagen pesa más de ${maxMB}MB. Como se sincroniza en vivo para todos, usá una imagen más liviana.`);
    return;
  }
  const reader = new FileReader();
  reader.onload = (e)=> onDone(e.target.result);
  reader.onerror = ()=> alert('No se pudo leer el archivo. Probá con otra imagen.');
  reader.readAsDataURL(file);
}

function attachBrandingEvents(){
  const titleInput = document.getElementById('brandTitleInput');
  if(titleInput) titleInput.addEventListener('input', ()=>{
    ensureBranding().title = titleInput.value || 'MUNDIAL';
    applyBranding(); saveTournament();
  });

  const subtitleInput = document.getElementById('brandSubtitleInput');
  if(subtitleInput) subtitleInput.addEventListener('input', ()=>{
    ensureBranding().subtitle = subtitleInput.value;
    applyBranding(); saveTournament();
  });

  const heroPrefixInput = document.getElementById('brandHeroPrefixInput');
  if(heroPrefixInput) heroPrefixInput.addEventListener('input', ()=>{
    ensureBranding().heroPrefix = heroPrefixInput.value;
    saveTournament();
    if(STATE.view==='inicio') render();
  });

  const heroHighlightInput = document.getElementById('brandHeroHighlightInput');
  if(heroHighlightInput) heroHighlightInput.addEventListener('input', ()=>{
    ensureBranding().heroHighlight = heroHighlightInput.value;
    saveTournament();
    if(STATE.view==='inicio') render();
  });

  const heroTextInput = document.getElementById('brandHeroTextInput');
  if(heroTextInput) heroTextInput.addEventListener('input', ()=>{
    ensureBranding().heroText = heroTextInput.value;
    saveTournament();
    if(STATE.view==='inicio') render();
  });

  const logoEmojiInput = document.getElementById('brandLogoEmojiInput');
  if(logoEmojiInput) logoEmojiInput.addEventListener('input', ()=>{
    ensureBranding().logoEmoji = logoEmojiInput.value || '❄';
    applyBranding(); saveTournament();
    refreshBrandingPreview();
  });

  const logoFileInput = document.getElementById('brandLogoFileInput');
  if(logoFileInput) logoFileInput.addEventListener('change', (e)=>{
    readImageFileMax(e.target.files[0], 0.8, (dataUrl)=>{
      ensureBranding().logoImage = dataUrl;
      applyBranding(); saveTournament();
      render();
    });
  });

  const logoClearBtn = document.getElementById('brandLogoClearBtn');
  if(logoClearBtn) logoClearBtn.addEventListener('click', ()=>{
    ensureBranding().logoImage = null;
    applyBranding(); saveTournament();
    render();
  });

  const grad1Input = document.getElementById('brandGrad1Input');
  if(grad1Input) grad1Input.addEventListener('input', ()=>{
    ensureBranding().grad1 = grad1Input.value;
    applyBranding(); saveTournament();
  });
  const grad2Input = document.getElementById('brandGrad2Input');
  if(grad2Input) grad2Input.addEventListener('input', ()=>{
    ensureBranding().grad2 = grad2Input.value;
    applyBranding(); saveTournament();
  });

  const bgFileInput = document.getElementById('brandBgFileInput');
  if(bgFileInput) bgFileInput.addEventListener('change', (e)=>{
    readImageFileMax(e.target.files[0], 1.2, (dataUrl)=>{
      ensureBranding().bgImage = dataUrl;
      applyBranding(); saveTournament();
      render();
    });
  });

  const bgClearBtn = document.getElementById('brandBgClearBtn');
  if(bgClearBtn) bgClearBtn.addEventListener('click', ()=>{
    ensureBranding().bgImage = null;
    applyBranding(); saveTournament();
    render();
  });

  const resetBtn = document.getElementById('brandResetBtn');
  if(resetBtn) resetBtn.addEventListener('click', ()=>{
    if(!confirm('¿Restaurar título, subtítulo, logo y fondo a los valores originales del Mundial 2042?')) return;
    STATE.branding = defaultBranding();
    applyBranding(); saveTournament();
    render();
  });
}

/* Actualiza solo la miniatura del logo sin re-renderizar todo el panel,
   para no perder el foco mientras el admin tipea el emoji. */
function refreshBrandingPreview(){
  const preview = document.getElementById('brandLogoPreview');
  const b = STATE.branding || defaultBranding();
  if(preview && !b.logoImage) preview.textContent = b.logoEmoji || '❄';
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
  renderAchievements();
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
  ensureMySocialProfile();
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

document.getElementById('btnMusic').addEventListener('click', ()=>{
  const panel = document.getElementById('musicPanel');
  const willOpen = !panel.classList.contains('open');
  panel.classList.toggle('open', willOpen);
  if(willOpen){
    const id = extractYouTubeId((STATE.music||defaultMusic()).youtubeUrl);
    if(id) renderMusicPanelBody(id);
  }else{
    document.getElementById('musicPanelBody').innerHTML = ''; // corta el audio al cerrar
  }
});
document.getElementById('musicPanelClose').addEventListener('click', ()=>{
  document.getElementById('musicPanel').classList.remove('open');
  document.getElementById('musicPanelBody').innerHTML = '';
});

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
/* ---------------- Etapa 1: modal "Nuevo Torneo" ---------------- */
function openNewTournamentModal(){
  renderNewTournamentPicker();
  document.getElementById('newTournamentModal').classList.add('open');
}

function renderNewTournamentPicker(){
  const hostList = document.getElementById('ntHostPicker');
  const teamList = document.getElementById('ntTeamPicker');
  const prevHosts = ntSelectedHosts();
  const prevTeams = ntSelectedTeams();

  hostList.innerHTML = COUNTRY_DB.map(c=>`
    <label class="group-member-row">
      <input type="checkbox" class="nt-host-cb" value="${c.code}" ${prevHosts.includes(c.code)?'checked':''}>
      ${flagImgIso(c.iso,'w40',c.name)}
      <span>${c.name}</span>
    </label>
  `).join('');

  const byConf = {};
  COUNTRY_DB.forEach(c=>{ (byConf[c.conf] = byConf[c.conf]||[]).push(c); });
  teamList.innerHTML = Object.keys(byConf).map(conf=>`
    <div class="mini-label" style="margin-top:12px;">${confLabel(conf)}</div>
    ${byConf[conf].map(c=>`
      <label class="group-member-row">
        <input type="checkbox" class="nt-team-cb" value="${c.code}" ${prevTeams.includes(c.code)?'checked':''}>
        ${flagImgIso(c.iso,'w40',c.name)}
        <span>${c.name}</span>
      </label>
    `).join('')}
  `).join('');

  updateNtSummary();
}

function ntSelectedHosts(){ return Array.from(document.querySelectorAll('.nt-host-cb:checked')).map(c=>c.value); }
function ntSelectedTeams(){ return Array.from(document.querySelectorAll('.nt-team-cb:checked')).map(c=>c.value); }

function updateNtSummary(){
  const format = Number(document.getElementById('ntFormat').value);
  const hosts = ntSelectedHosts();
  const teams = ntSelectedTeams();
  const okHosts = hosts.length>=1 && hosts.length<=3;
  const okTeams = teams.length === format;
  const hostsNotInTeams = hosts.filter(h=> !teams.includes(h));
  const summary = document.getElementById('ntSummary');
  summary.innerHTML = `
    Sedes elegidas: <b>${hosts.length}</b> (mín 1, máx 3) ${okHosts?'✅':'⚠️'}<br>
    Países elegidos: <b>${teams.length}</b> / ${format} ${okTeams?'✅':'⚠️'}
    ${hostsNotInTeams.length? '<br><span style="color:var(--danger)">⚠️ Las sedes también tienen que estar tildadas en la lista de países.</span>' : ''}
  `;
  document.getElementById('ntCreateBtn').disabled = !(okHosts && okTeams && hostsNotInTeams.length===0);
}

function saveNewTournamentDraft(){
  const format = Number(document.getElementById('ntFormat').value);
  const hosts = ntSelectedHosts();
  const teams = ntSelectedTeams();
  if(!(hosts.length>=1 && hosts.length<=3)){ alert('Elegí entre 1 y 3 sedes.'); return; }
  if(teams.length !== format){ alert(`Elegí exactamente ${format} países.`); return; }
  if(hosts.some(h=> !teams.includes(h))){ alert('Las sedes tienen que estar también tildadas en la lista de países participantes.'); return; }

  const draft = { format, hosts, teams };
  document.getElementById('newTournamentModal').classList.remove('open');
  openSorteoModal(draft);
}

/* ---------------- Sorteo animado ---------------- */

/* Arma la asignación final de grupos: la/s sede/s van todas juntas al
   Grupo A (más otros equipos al azar hasta completar 4), el resto se
   reparte al azar en el resto de los grupos. */
function drawGroupAssignment(draft){
  const numGroups = draft.format / 4;
  const letters = GROUP_LETTERS_FOR(numGroups);
  const pool = shuffleArray(draft.teams.filter(c=> !draft.hosts.includes(c)));

  const groups = {};
  groups[letters[0]] = [...draft.hosts, ...pool.splice(0, 4 - draft.hosts.length)];
  for(let i=1;i<numGroups;i++){ groups[letters[i]] = pool.splice(0,4); }

  const assignment = [];
  letters.forEach(letter=>{
    groups[letter].forEach(code=>{
      const country = COUNTRY_DB.find(c=>c.code===code);
      assignment.push({code, name:country.name, iso:country.iso, group:letter});
    });
  });
  return assignment;
}

function openSorteoModal(draft){
  const assignment = drawGroupAssignment(draft);
  const letters = GROUP_LETTERS_FOR(draft.format/4);
  const grid = document.getElementById('sorteoGrid');

  grid.innerHTML = letters.map(letter=>`
    <div class="sorteo-group">
      <div class="sorteo-group-label">GRUPO ${letter}</div>
      <div class="sorteo-slots" id="sorteoSlots-${letter}">
        ${[0,1,2,3].map(()=>`<div class="sorteo-slot"></div>`).join('')}
      </div>
    </div>
  `).join('');

  document.getElementById('sorteoStatus').textContent = 'Sorteando…';
  document.getElementById('sorteoConfirmBtn').style.display = 'none';
  document.getElementById('sorteoModal').classList.add('open');

  const order = [];
  letters.forEach(letter=> assignment.filter(a=>a.group===letter).forEach(a=> order.push(a)));

  let i = 0;
  const counters = {};
  const timer = setInterval(()=>{
    if(i >= order.length){
      clearInterval(timer);
      document.getElementById('sorteoStatus').textContent = '¡Sorteo terminado!';
      document.getElementById('sorteoConfirmBtn').style.display = 'block';
      return;
    }
    const a = order[i];
    const slotIdx = counters[a.group] || 0;
    counters[a.group] = slotIdx + 1;
    const slots = document.querySelectorAll(`#sorteoSlots-${a.group} .sorteo-slot`);
    const slotEl = slots[slotIdx];
    if(slotEl){
      slotEl.innerHTML = `${flagImgIso(a.iso,'w40',a.name)}<span>${a.name}</span>`;
      slotEl.classList.add('filled');
    }
    i++;
  }, 220);

  document.getElementById('sorteoConfirmBtn').onclick = ()=>{
    document.getElementById('sorteoModal').classList.remove('open');
    startTournamentFromDraft(draft, assignment);
  };

  document.getElementById('closeSorteoModal').onclick = ()=>{
    clearInterval(timer);
    document.getElementById('sorteoModal').classList.remove('open');
  };
}

/* Confirma el sorteo: reemplaza el roster (TEAM_DATA/GROUP_LETTERS), arma
   los partidos de fase de grupos y un cuadro de eliminación vacío del
   formato elegido, y lo sincroniza para todos los que estén mirando. */
function startTournamentFromDraft(draft, assignment){
  TEAM_DATA = assignment.map(a=>({code:a.code, name:a.name, flag:'', group:a.group}));
  GROUP_LETTERS = GROUP_LETTERS_FOR(draft.format/4);

  const matches = [];
  GROUP_LETTERS.forEach(g=>{
    const teams = TEAM_DATA.filter(t=>t.group===g).map(t=>t.code);
    for(let i=0;i<teams.length;i++){
      for(let j=i+1;j<teams.length;j++){
        matches.push({id:`${teams[i]}-${teams[j]}`, group:g, home:teams[i], away:teams[j], hs:null, as:null});
      }
    }
  });

  STATE.format = draft.format;
  STATE.teamData = TEAM_DATA;
  STATE.groupLetters = GROUP_LETTERS;
  STATE.matches = matches;
  STATE.knockout = buildEmptyKnockout(draft.format);
  STATE.awards = {fairplay:'', goleador:''};
  STATE._celebrated = false;
  STATE.newTournamentDraft = null;
  STATE.view = 'grupos';
  saveTournament();
  setView('grupos');
  alert(`¡Arrancó el Mundial de ${draft.format} selecciones! 🏆 Ya podés cargar resultados en Fase de Grupos.`);
}

function attachNewTournamentEvents(){
  document.getElementById('ntFormat').addEventListener('change', renderNewTournamentPicker);
  document.getElementById('ntHostPicker').addEventListener('change', updateNtSummary);
  document.getElementById('ntTeamPicker').addEventListener('change', updateNtSummary);
  document.getElementById('closeNewTournamentModal').addEventListener('click', ()=> document.getElementById('newTournamentModal').classList.remove('open'));
  document.getElementById('ntCreateBtn').addEventListener('click', saveNewTournamentDraft);
}

function init(){
  document.querySelector('.app').classList.toggle('force-mobile', STATE.settings.device==='mobile');
  document.getElementById('btnMobile').classList.toggle('active', STATE.settings.device==='mobile');
  document.getElementById('btnDesktop').classList.toggle('active', STATE.settings.device==='desktop');
  applyBranding();
  applyMusicButton();
  applyAvatar();
  bindProfileLiveUpdate();
  attachNewTournamentEvents();
  render();
  initFirebaseSync();
  initSocial();
}

init();
