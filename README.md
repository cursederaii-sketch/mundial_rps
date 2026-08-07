# Mundial 2042 · Hielo Eterno

App de torneo (grupos + cuadro de eliminación + Salón de la Fama) en HTML/CSS/JS puro.
No necesita backend ni build: subís los archivos a cualquier hosting estático (GitHub Pages,
Netlify, Vercel) y funciona.

## Archivos

- `index.html` — estructura de la página
- `style.css` — todo el estilo (tema "Aurora Polar")
- `app.js` — datos, lógica del torneo y del Salón de la Fama
- `assets/` — **acá van tus fotos** (opcional, ver abajo)

## Cómo subirlo a GitHub Pages

1. Creá un repositorio público en GitHub.
2. Subí **todo el contenido de esta carpeta** (`index.html`, `style.css`, `app.js` y la carpeta
   `assets/`) a la raíz del repo — no subas el .zip, subí los archivos sueltos.
3. Settings → Pages → Branch: `main`, carpeta `/root` → Save.
4. Esperá un par de minutos, el link va a ser `https://tu-usuario.github.io/tu-repo/`.

## Fotos reales (opcional)

La app funciona perfecto sin ninguna foto — usa un trofeo dibujado en SVG y las banderas de
[flagcdn.com](https://flagcdn.com) como respaldo. Si querés reemplazar eso por fotos reales
(la copa, estadios, selecciones festejando), subí archivos con **estos nombres exactos** dentro
de la carpeta `assets/` de tu repositorio. La app los detecta solos, no hay que tocar código.

### `assets/mundiales/`

| Archivo | Dónde se usa |
|---|---|
| `trophy.png` | Ícono junto al título "Salón de la Fama" (arriba de todo) |
| `2022.jpg` | Fondo de la fila "2022" en Todos los Mundiales / detalle del mundial |
| `2026.jpg` | ídem para 2026 |
| `2030.jpg` | ídem para 2030 |
| `2034.jpg` | ídem para 2034 |
| `2038.jpg` | ídem para 2038 |
| `2042.jpg` | ídem para 2042 (mundial en curso) |

### `assets/countries/`

Formato: `{codigo-iso}.jpg` (tarjeta chica) y `{codigo-iso}-hero.jpg` (banner grande del perfil
del país). Los códigos son de 2 letras, iguales a los que usa flagcdn.com. Los que hoy tienen
títulos son:

| País | Código | Archivos |
|---|---|---|
| España | `es` | `assets/countries/es.jpg`, `assets/countries/es-hero.jpg` |
| Argentina | `ar` | `assets/countries/ar.jpg`, `assets/countries/ar-hero.jpg` |
| Alemania | `de` | `assets/countries/de.jpg`, `assets/countries/de-hero.jpg` |
| Colombia | `co` | `assets/countries/co.jpg`, `assets/countries/co-hero.jpg` |

Si algún otro país sale campeón en el futuro (mundial 2042 en curso, o cualquier otro que agregues
a `HISTORY` en `app.js`), usá su código ISO de 2 letras. Los 32 equipos del torneo actual y sus
códigos están al principio de `app.js`, en el objeto `ISO_MAP`.

### Recomendaciones de tamaño

- `trophy.png`: imagen cuadrada, fondo transparente, ~200×200px.
- `*.jpg` de países y mundiales: horizontal, ~800×500px, menos de 300KB cada una para que la
  página cargue rápido.

### Importante: derechos de las fotos

Usá fotos que tengas derecho a usar (propias, de bancos de imágenes libres, o con licencia
adecuada). La copa del mundo real, escudos oficiales y fotos de jugadores suelen tener derechos
de autor — si vas a compartir este sitio públicamente, lo más seguro es usar imágenes genéricas
de estadios/celebraciones o ilustraciones propias en vez de fotos oficiales de FIFA.

## Clave de administrador

Para cargar resultados necesitás desbloquear el modo edición en **Admin** con la clave:

```
AURORA2042
```

Podés cambiarla editando la constante `ADMIN_KEY` al principio de `app.js`.
