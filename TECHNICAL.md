# Documentación Técnica - MUNDIAL 2042

## 📐 Arquitectura

### Stack Tecnológico

```
Frontend:
├── HTML5 (Semántica)
├── CSS3 (Grid, Flexbox, Animaciones)
├── Vanilla JavaScript (ES6)
└── LocalStorage API

Fuentes:
├── Rajdhani (Display)
├── Inter (Body)
└── JetBrains Mono (Code)

Hosting:
└── GitHub Pages (Opcional)
```

### No hay frameworks

A propósito, todo es vanilla JavaScript para:
- Máxima portabilidad
- Zero dependencias
- Menor tamaño de bundle
- Máximo control

## 🗂️ Estructura de Archivos

```
mundial2042/
├── index.html          # Estructura HTML
├── style.css           # Estilos CSS
├── app.js              # Lógica JavaScript
├── README.md           # Documentación usuario
├── TECHNICAL.md        # Este archivo
└── .gitignore          # (Opcional)
```

## 🔧 API de JavaScript

### Estado Global

```javascript
STATE = {
  profile: {
    name: string,
    color: hex,
    desc: string,
    pronouns: string,
    follows: teamCode,
    avatar: dataURL | null,
    banner: dataURL | null
  },
  settings: {
    grad1: hex,
    grad2: hex,
    device: 'desktop' | 'mobile'
  },
  admin: {
    unlocked: boolean
  },
  matches: Match[],
  knockout: Knockout,
  view: string
}
```

### Funciones Principales

#### State Management

```javascript
loadState()      // Carga estado de localStorage
saveState()      // Guarda estado a localStorage
defaultState()   // Devuelve estado inicial
```

#### Utilidades

```javascript
teamByCode(code)           // Busca equipo por código
teamLabel(code)            // Devuelve "flag nombre"
teamFlag(code)             // Devuelve solo el emoji
teamName(code)             // Devuelve solo el nombre
```

#### Lógica de Torneos

```javascript
computeStandings(group)    // Calcula tabla de posiciones
groupComplete(group)       // Verifica si grupo terminó
allGroupsComplete()        // Verifica si todas completadas
playedCount()              // Cuenta partidos jugados
```

#### Renderizado

```javascript
render()                   // Re-renderiza vista actual
setView(view)              // Cambia de vista
updateSideProgress()       // Actualiza barra lateral
updateAdminDot()           // Actualiza indicador admin
```

#### Vistas

```javascript
renderInicio()             // Dashboard principal
renderGrupos()             // Fase de grupos
renderCuadro()             // Cuadro eliminación
renderFama()               // Histórico
renderAjustes()            // Configuración
renderAdmin()              // Panel admin
```

#### Notificaciones

```javascript
showToast(msg, type, duration)
  // type: 'info' | 'success' | 'error' | 'warning'
  // duration: ms (default 3000)
```

### Estructura de Datos

#### Team

```typescript
{
  code: string     // 'ARG', 'BRA', etc
  name: string     // 'Argentina'
  flag: string     // '🇦🇷'
  group: string    // 'A', 'B', etc
}
```

#### Match

```typescript
{
  id: string       // 'ALE-EEU'
  group: string    // 'A'
  home: string     // Código del equipo local
  away: string     // Código del equipo visitante
  hs: number|null  // Goles local
  as: number|null  // Goles visitante
}
```

#### Standing

```typescript
{
  code: string     // 'ARG'
  pj: number       // Partidos jugados
  pg: number       // Partidos ganados
  pe: number       // Partidos empatados
  pp: number       // Partidos perdidos
  gf: number       // Goles a favor
  gc: number       // Goles en contra
  pts: number      // Puntos
}
```

## 🎨 CSS Architecture

### Variables CSS

```css
/* Colores */
--grad1, --grad2           // Aurora gradiente
--bg-void                  // Fondo oscuro
--panel, --panel-solid     // Paneles
--ice, --muted             // Texto

/* Tokens */
--radius: 14px
--radius-lg: 22px
--font-display: 'Rajdhani'
--font-body: 'Inter'
--font-mono: 'JetBrains Mono'
```

### Convenciones de Clases

```
.page-title        // Títulos de página
.badge             // Badges/etiquetas
.stat-card         // Tarjetas de estadísticas
.btn-primary       // Botón primario
.btn-secondary     // Botón secundario
.btn-danger        // Botón peligroso
.modal-overlay     // Modal background
.toast             // Notificaciones
```

### Grid del Topbar

```
[Brand] [Device Toggle] ... [Actions]
└─────────────────────────────────┘
        sticky: top 0
```

### Layout Principal

```
┌─────────────────────────┐
│      TOPBAR             │
├─────────────────────────┤
│        │                │
│ SIDEBAR │   CONTENT     │
│        │                │
├─────────────────────────┤
│      BOTTOM NAV         │ (mobile only)
└─────────────────────────┘
```

## 💾 LocalStorage

### Clave de almacenamiento

```
mundial2042_state_v1
```

### Límites

- Máximo ~5-10MB según navegador
- Almacena: estado + imágenes en base64
- Imágenes: máximo 2MB cada una
- Total: ~10-15MB con imágenes pesadas

### Migración de Esquema

Cuando cambios el esquema:

```javascript
function loadState(){
  const base = defaultState();  // Nuevo esquema
  return Object.assign(base, parsed); // Merge con anterior
}
```

## 🔐 Administración

### Contraseña

```javascript
const ADMIN_KEY = "AURORA2042"
```

Para cambiar:
1. Busca `ADMIN_KEY` en `app.js`
2. Reemplaza el valor
3. Redeploy

### Funcionalidades Admin

- Exportar JSON
- Reiniciar datos
- Ver estado de BD
- Cerrar sesión

## 📊 Algoritmo de Tablas

Las tablas se calculan con:

1. **Orden principal**: Puntos (3 victoria, 1 empate)
2. **Desempate 1**: Diferencia de goles
3. **Desempate 2**: Goles a favor

```javascript
sort((a,b) => {
  if(b.pts !== a.pts) return b.pts - a.pts;
  const dgA = a.gf - a.gc, dgB = b.gf - b.gc;
  if(dgB !== dgA) return dgB - dgA;
  return b.gf - a.gf;
})
```

## 🎬 Event Handling

### Delegación de eventos

Algunos eventos se delegan:

```javascript
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => setView(btn.dataset.view));
});
```

### Eventos personalizados (potencial)

```javascript
// Podría usarse para custom events:
window.addEventListener('mundial:save', (e) => {
  console.log('Datos guardados:', e.detail);
});
```

## 🚀 Performance Optimizations

### CSS Optimizaciones

```css
/* GPU acceleration */
.ribbon { will-change: transform; }
.aurora-bg .ribbon { filter: blur(60px); }

/* Animaciones eficientes */
@keyframes drift1 {
  /* Solo transform, no layout shifts */
  transform: translate(-5%, 0) rotate(-3deg);
}
```

### JavaScript Optimizaciones

```javascript
// Deduplicación en búsquedas
const team = TEAM_DATA.find(t => t.code === code);

// Caché de funciones puras
function teamByCode(code) { /* cached */ }

// Batch updates
function render() { /* único repaint */ }
```

## 🔄 Flujo de Datos

```
User Input
   ↓
Event Listener
   ↓
Actualiza STATE
   ↓
saveState() → localStorage
   ↓
render() → regenera HTML
   ↓
Browser repaint
```

## 🐛 Debugging

### Consola JavaScript

```javascript
// Ver estado actual
console.log(STATE);

// Ver matches específicas
console.log(STATE.matches.filter(m => m.group === 'A'));

// Ver standings
console.log(computeStandings('A'));

// Logs de inicialización
// "🎮 Mundial 2042 initialized"
```

### DevTools

- Abre Inspector (F12)
- Pestaña Application → Local Storage
- Busca `mundial2042_state_v1`
- Edita/copia JSON

### Modo debug (future)

```javascript
// Podría agregarse
const DEBUG = true;
if(DEBUG) {
  console.log('🎮 Debug mode ON');
  window.STATE = STATE;
  window.showToast = showToast;
}
```

## 🌐 API Externas

Ninguna. Todo es local.

Opcional (futuro):
- Google Analytics
- Firebase para sincronización
- PWA manifest para instalable

## 📱 Responsive Design

### Breakpoints

```css
/* Desktop */
@media (max-width: 980px) {
  /* Tablet */
}

@media (max-width: 768px) {
  /* Mobile */
}
```

### Modo Force Mobile

```javascript
document.querySelector('.app').classList.add('force-mobile');
// Oculta sidebar, muestra bottomnav
```

## ♿ Accesibilidad

### ARIA Labels

```html
<button aria-label="Cerrar perfil">✕</button>
<button aria-pressed="false">Celular</button>
<div role="dialog" aria-hidden="true">...</div>
```

### Semantic HTML

```html
<header class="topbar">
<nav class="sidebar">
<main class="content">
<footer class="bottomnav">
```

## 🔮 Extensiones Futuras

### Agregar nueva vista

```javascript
case 'nueva-vista':
  content.innerHTML = renderNuevaVista();
  attachNuevaVistaEvents();
  break;
```

### Agregar nuevo campo a perfil

```javascript
profile: {
  // ... existing
  nuevoField: 'valor'
}
```

### Agregar nuevos equipos

```javascript
TEAM_DATA.push({
  code: 'XXX',
  name: 'País',
  flag: '🏳️',
  group: 'X'
});
```

## 📚 Referencias

- [MDN Web Docs](https://developer.mozilla.org)
- [CSS Tricks](https://css-tricks.com)
- [Web.dev](https://web.dev)
- [Can I Use](https://caniuse.com)

## 🎯 Checklist de Desarrollo

- [ ] Probar en Chrome, Firefox, Safari
- [ ] Probar en móvil (iPhone, Android)
- [ ] Verificar localStorage
- [ ] Exportar/importar datos
- [ ] Cambiar tema
- [ ] Cargar imágenes
- [ ] Panel admin (con contraseña correcta)
- [ ] Responsive (desktop → mobile)
- [ ] Consola sin errores

## 🚀 Deploy

### GitHub Pages

1. Crea repo `mundial2042`
2. Sube archivos
3. Settings → Pages → Main branch
4. Espera 1-2 minutos

### Netlify

1. Conecta repo
2. Build: (leave empty)
3. Publish: ./
4. Deploy

### Servidor propio

1. Sube archivos a `public_html/`
2. Asegúrate de CORS si es necesario
3. Listo

---

**Versión**: 2.0.0  
**Última actualización**: Julio 2026  
**Mantenedor**: [@tu-usuario]
