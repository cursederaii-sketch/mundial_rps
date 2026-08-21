const fill = document.getElementById('pitchFill');
const tag = document.getElementById('pitchTag');

// Zonas de la cancha, en orden, según el atributo data-zone de cada sección
const zones = Array.from(document.querySelectorAll('[data-zone]'));

// Colores de fondo de body por zona (día = área propia / mediocampo claro, noche = área rival / banco)
const nightZones = ['ÁREA RIVAL', 'EL BANCO'];

window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
  const pct = Math.min(Math.max(scrolled, 0), 1);
  fill.style.width = (pct * 100) + '%';

  // Determina en qué zona de la cancha está el usuario según qué sección cruzó el centro del viewport
  let current = zones[0];
  const probe = window.innerHeight * 0.35;
  for (const z of zones) {
    const rect = z.getBoundingClientRect();
    if (rect.top <= probe) current = z;
  }
  const zoneName = current.dataset.zone;
  tag.textContent = zoneName;

  document.body.style.background = nightZones.includes(zoneName) ? 'var(--night-bg)' : 'var(--day-bg)';
});

// marca las imágenes que aún no fueron reemplazadas
document.querySelectorAll('.img-slot img').forEach(img => {
  img.addEventListener('error', () => img.parentElement.classList.add('missing'));
});
