# MUNDIAL 2042 · Hielo Eterno

> 🏆 Aplicación web interactiva para gestionar un torneo de fútbol futurista en la era glacial.

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-production-brightgreen)

## 📖 Descripción

**MUNDIAL 2042** es una aplicación web moderna, elegante y funcional diseñada para gestionar un torneo de fútbol internacional. Con una interfaz inspirada en la Aurora Boreal, permite:

- 📊 Registrar resultados de partidos
- 🏅 Generar tablas de posiciones automáticamente
- 👤 Personalizar tu perfil como Director Técnico
- 🎨 Personalizar temas y colores
- 📱 Modo responsive (desktop y mobile)
- 💾 Almacenamiento local persistente
- 📥 Exportar/importar datos

## 🚀 Características v2.0

### ✨ Mejoras Implementadas

- **Mejor estructura de código** - Organización clara y comentarios
- **Toast notifications** - Sistema de notificaciones mejorado
- **Mejor manejo de errores** - Validaciones robustas
- **Optimizaciones de rendimiento** - Animaciones suaves, menos rerenders
- **Accesibilidad mejorada** - ARIA labels, roles semánticos
- **Almacenamiento optimizado** - Mejor gestión de localStorage
- **Interfaz refinada** - UX/UI pulida

## 🛠️ Instalación

### Opción 1: Clonar del repositorio

```bash
git clone https://github.com/tu-usuario/mundial2042.git
cd mundial2042
```

### Opción 2: Descarga manual

Descarga los archivos:
- `index.html`
- `style.css`
- `app.js`

Colócalos en la misma carpeta.

### Opción 3: GitHub Pages (Recomendado)

1. Crea un repositorio en GitHub
2. Sube los archivos HTML, CSS, JS
3. En Settings → Pages, selecciona `main` como rama
4. Tu app estará disponible en: `https://tu-usuario.github.io/mundial2042`

## 💻 Uso

### Abrir la aplicación

Abre `index.html` en tu navegador o accede a la URL de GitHub Pages.

### Navegar

- **Inicio**: Resumen del torneo
- **Fase Grupos**: Ingresa resultados de partidos
- **Cuadro Eliminación**: Próximamente
- **Salón Fama**: Histórico de ediciones pasadas
- **Ajustes**: Personaliza colores y tema
- **Admin**: Panel administrativo (contraseña requerida)

### Ingreso de Resultados

1. Ve a "Fase Grupos"
2. Selecciona el grupo (A-H)
3. Ingresa los goles en cada partido
4. Los cambios se guardan automáticamente
5. Las tablas se actualizan en tiempo real

### Panel Admin

**Contraseña**: `AURORA2042`

Funcionalidades:
- 📥 Exportar datos a JSON
- 🔄 Reiniciar torneo completo
- 🔍 Ver estado de la BD
- 🔒 Cerrar sesión

## 🎨 Personalización

### Cambiar Colores

1. Ve a "Ajustes"
2. Modifica "Gradiente 1" y "Gradiente 2"
3. Haz clic en "Guardar Tema"

### Personalizar Perfil

1. Haz clic en el avatar (arriba a la derecha)
2. Edita:
   - Nombre y color
   - Avatar (GIF/PNG/JPG)
   - Banner
   - Descripción
   - Pronombres
   - Equipo que sigues
3. Guarda cambios

### Temas Presets

```css
/* Tema Default (Aurora) */
--grad1: #7c5cff
--grad2: #0a1931

/* Tema Oceáno */
--grad1: #00d4ff
--grad2: #0a1931

/* Tema Fuego */
--grad1: #ff6b35
--grad2: #004e89
```

## 📊 Estructura de Datos

### Estado Local

Se almacena en `localStorage` bajo la clave `mundial2042_state_v1`:

```json
{
  "profile": {
    "name": "DT IPFT",
    "color": "#f2c230",
    "desc": "Estratega polar",
    "pronouns": "él/he",
    "follows": "ARG",
    "avatar": null,
    "banner": null
  },
  "settings": {
    "grad1": "#7c5cff",
    "grad2": "#0a1931",
    "device": "desktop"
  },
  "admin": {
    "unlocked": false
  },
  "matches": [...],
  "knockout": {...},
  "view": "inicio"
}
```

## 📱 Compatibilidad

- ✅ Chrome/Chromium (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Edge (v90+)
- ✅ Mobile (iOS Safari, Chrome Mobile)

## 🔒 Seguridad

- No se envían datos a servidores
- Todo se almacena localmente en el navegador
- Las imágenes se comprimen en base64
- Máximo 2MB por imagen

## ⚡ Optimizaciones

- Zero dependencias externas (excepto Google Fonts)
- Bundle size: ~50KB
- Tiempo de carga: <1s
- Animaciones GPU-accelerated
- Media queries para responsive
- LocalStorage para persistencia

## 🐛 Troubleshooting

### "No se guardan los datos"

- Comprueba que localStorage no esté deshabilitado
- Modo incógnito/privado no persiste datos entre sesiones
- Intenta limpiar cookies/caché

### "Las imágenes son muy pesadas"

- Máximo 2MB recomendado
- Usa compresión: https://tinypng.com
- Convierte a GIF para mejor compresión

### "Las banderas no se ven bien"

- Es un issue conocido de emojis en Windows
- Solución: Usar imágenes SVG en futuras versiones
- Actualiza Windows a la versión más reciente

## 📈 Roadmap

- [ ] Cuadro de eliminación interactivo
- [ ] Estadísticas avanzadas
- [ ] Sistema de predicciones
- [ ] Sincronización en la nube
- [ ] App nativa (Electron)
- [ ] Multijugador en tiempo real
- [ ] Banderas como imágenes SVG

## 💡 Tips de Uso

1. **Exporta regularmente** - Haz backup de tus datos
2. **Personaliza tu perfil** - Refleja tu estilo de DT
3. **Usa vista mobile** - Prueba en diferentes dispositivos
4. **Comparte el torneo** - Botón "Compartir" en la barra superior
5. **Lee la consola** - Útil para debugging

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios significativos:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -am 'Agrega mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - Ver `LICENSE` para detalles

## 👨‍💻 Autor

Desarrollado con ❄️ para amantes del fútbol futurista.

---

**¿Problemas o sugerencias?** Abre un issue o contacta al desarrollador.

**Última actualización**: Julio 2026  
**Versión actual**: 2.0.0
