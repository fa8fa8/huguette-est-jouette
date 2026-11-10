// Hors ligne : la page est d'abord demandée au réseau (pour recevoir les mises à jour),
// la copie locale ne sert que si la tablette n'a pas Internet.
const CACHE='huguette-v7';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-180.png','./mots.txt'];
// La page est indispensable ; les autres fichiers sont mis en cache au mieux (un échec ne bloque pas la mise à jour).
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.add('./index.html')
  .then(()=>Promise.allSettled(FILES.filter(f=>f!=='./index.html').map(f=>c.add(f)))))
  .then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(c=>fetch(e.request,{cache:'no-cache'}).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r;})
    .catch(()=>c.match(e.request,{ignoreSearch:true}).then(h=>h||c.match('./index.html')))));
});
