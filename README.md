# 🏐 MacroCiclo VB PRO

Sistema profesional de planificación, seguimiento y gestión de volleyball para Liga Nacional.

## Archivos incluidos

```
index.html      ← App principal (30 módulos)
manifest.json   ← Configuración PWA
   // MacroCiclo VB PRO — Service Worker
// Versión del cache — incrementar para forzar actualización
const CACHE_VERSION = 'vb-pro-v2';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_CDN = `${CACHE_VERSION}-cdn`;

// Recursos locales a cachear siempre
const STATIC_ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// Recursos CDN a cachear
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap',
];

// ── INSTALL: pre-cache recursos estáticos ──
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_STATIC).then(cache => {
        console.log('[SW] Cacheando recursos estáticos...');
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.warn('[SW] Error cacheando estáticos:', err);
        });
      }),
      caches.open(CACHE_CDN).then(cache => {
        console.log('[SW] Cacheando CDN...');
        return Promise.allSettled(
          CDN_ASSETS.map(url =>
            fetch(url)
              .then(res => { if (res.ok) cache.put(url, res); })
              .catch(err => console.warn('[SW] CDN no disponible:', url))
          )
        );
      }),
    ]).then(() => {
      console.log('[SW] Instalación completa.');
      self.skipWaiting();
    })
  );
});

// ── ACTIVATE: limpiar caches viejas ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key.startsWith('vb-pro-') && key !== CACHE_STATIC && key !== CACHE_CDN)
          .map(key => {
            console.log('[SW] Eliminando cache antigua:', key);
            return caches.delete(key);
          })
      );
    }).then(() => {
      console.log('[SW] Activado. Controlando todas las pestañas.');
      return self.clients.claim();
    })
  );
});

// ── FETCH: estrategia por tipo de recurso ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignorar peticiones no-GET y chrome-extension
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // API de Anthropic — siempre network, nunca cache
  if (url.hostname === 'api.anthropic.com') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Google Fonts — cache-first
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(event.request, CACHE_CDN));
    return;
  }

  // CDN (Chart.js, etc.) — cache-first con fallback
  if (url.hostname === 'cdnjs.cloudflare.com') {
    event.respondWith(cacheFirst(event.request, CACHE_CDN));
    return;
  }

  // App local — network-first para siempre tener la versión más reciente
  // con fallback a cache si no hay internet
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(event.request, CACHE_STATIC));
    return;
  }

  // Todo lo demás — network con fallback a cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// ── Estrategia Cache-First ──
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    console.warn('[SW] Sin red y sin cache para:', request.url);
    return new Response('Sin conexión y recurso no cacheado.', { status: 503 });
  }
}

// ── Estrategia Network-First ──
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) {
      console.log('[SW] Sin red — sirviendo desde cache:', request.url);
      return cached;
    }
    // Fallback final: página offline
    return caches.match('./index.html') || new Response(
      `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Sin conexión</title>
      <style>body{font-family:sans-serif;background:#060D18;color:#E6EEF8;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px;}
      h1{color:#E6A817;font-size:28px;}p{color:#607A95;text-align:center;max-width:340px;}</style></head>
      <body><h1>🏐 MacroCiclo VB PRO</h1>
      <p>Sin conexión a internet. Los datos registrados están guardados localmente. Conéctate para sincronizar y usar el Coach IA.</p>
      <button onclick="location.reload()" style="background:#E6A817;color:#000;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:700">Reintentar</button>
      </body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// ── MESSAGE: forzar actualización desde la app ──
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});
[sw.js](https://github.com/user-attachments/files/26525518/sw.js)
        ← Service Worker (modo offline)
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
