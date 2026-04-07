# 🏐 MacroCiclo VB PRO

Sistema profesional de planificación, seguimiento y gestión de volleyball para Liga Nacional.

## Archivos incluidos

```
index.html      ← App principal (30 módulos)
manifest.json   ← Configuración PWA
sw.js           ← Service Worker (modo offline)
icon-192.png    ← Ícono app 192×192
icon-512.png    ← Ícono app 512×512
```

## Despliegue en GitHub Pages

### Paso 1 — Crear repositorio
1. Ve a [github.com](https://github.com) → **New repository**
2. Nombre: `vb-pro` (o el que prefieras)
3. Visibility: **Public** (requerido para GitHub Pages gratuito)
4. Click **Create repository**

### Paso 2 — Subir archivos
1. En el repositorio, click **Add file → Upload files**
2. Arrastra los 5 archivos: `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`
3. Click **Commit changes**

### Paso 3 — Activar GitHub Pages
1. Ve a **Settings** del repositorio
2. Sección **Pages** (menú izquierdo)
3. Source: **Deploy from a branch**
4. Branch: **main** → Folder: **/ (root)**
5. Click **Save**

En 1-2 minutos tu URL estará activa:
```
https://TU-USUARIO.github.io/vb-pro/
```

## Instalar como app

### Android (Chrome)
Abre la URL → aparece banner "Instalar app" → Aceptar  
O: menú ⋮ → "Agregar a pantalla de inicio"

### iPhone/iPad (Safari)
Abre la URL → botón compartir □↑ → "Agregar a pantalla de inicio"

### PC/Mac (Chrome o Edge)
Abre la URL → ícono ⊕ en la barra de direcciones → "Instalar MacroCiclo VB PRO"

## Funciona sin internet

Una vez instalada, la app funciona completamente offline excepto:
- Coach IA (requiere conexión a Anthropic API)
- Asistente de voz (requiere conexión para el modelo de lenguaje)

Los datos se guardan localmente en el navegador (localStorage).  
Usa **⬇ Exportar** regularmente para hacer backup en JSON.

## Actualizar la app

Cuando tengas una versión nueva:
1. Sube el `index.html` actualizado al repositorio
2. En `sw.js`, cambia `CACHE_VERSION = 'vb-pro-v1'` a `'vb-pro-v2'`
3. Sube el `sw.js` actualizado
4. Los usuarios ven automáticamente el banner "Nueva versión disponible"

---

Desarrollado con Claude (Anthropic) · Liga Nacional Honduras
