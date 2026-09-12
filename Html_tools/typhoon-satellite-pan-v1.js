(()=>{
'use strict';
const VER='20260912-typhoon-satellite-pan-v1.4-visibility-idle';
if(window.__windzxyTyphoonSatellitePan===VER)return;
window.__windzxyTyphoonSatellitePan=VER;
let io=null,scanFrame=0,leafletRetry=0;

function installLeafletGuard(){
  if(!window.L?.tileLayer||window.L.tileLayer.__windzxySatelliteGuard)return false;
  const original=window.L.tileLayer;
  function guarded(url,options){
    const isJma=/jma\.go\.jp\/bosai\/himawari\/data\/satimg/i.test(String(url||''));
    if(isJma){
      options=Object.assign({},options||{}, {
        keepBuffer:10,
        updateWhenIdle:true,
        updateWhenZooming:false,
        updateInterval:320,
        crossOrigin:true,
        noWrap:false,
        opacity:options?.opacity??.74
      });
    }
    const layer=original.call(this,url,options);
    if(isJma)layer.__windzxyBufferedSatellite=true;
    return layer;
  }
  Object.keys(original).forEach(k=>{try{guarded[k]=original[k]}catch(_){}});
  guarded.__windzxySatelliteGuard=true;
  window.L.tileLayer=guarded;
  return true;
}
function currentLayer(root){return root?.__fastSatLayer||root?.__tpSat51?.layer||null}
function tuneLayer(layer){
  if(!layer)return;
  layer.options.keepBuffer=10;
  layer.options.updateInterval=320;
  layer.options.updateWhenIdle=true;
  layer.options.updateWhenZooming=false;
  layer.options.noWrap=false;
  layer.options.crossOrigin=true;
}
function rootVisible(root){
  if(document.hidden||!root?.isConnected)return false;
  const r=root.getBoundingClientRect();
  return r.width>0&&r.height>0&&r.bottom>-96&&r.top<innerHeight+96;
}
function unbind(root){const s=root?.__tpSatellitePanV1;if(!s)return;try{root.removeEventListener('typhoon-overlay-motion-start',s.onStart);root.removeEventListener('typhoon-overlay-motion-settled',s.onEnd)}catch(_){}root.__tpSatellitePanV1=null;root?.classList?.remove('tp-satellite-map-moving')}
function bind(root){const map=root.__tpMap;if(!map||!rootVisible(root))return;const old=root.__tpSatellitePanV1;if(old?.map===map)return;if(old)unbind(root);const s={map,generation:0,moving:false,onStart:null,onEnd:null};s.onStart=e=>{if(!rootVisible(root)){unbind(root);return}s.moving=true;s.generation=e.detail?.generation||s.generation+1;root.classList.add('tp-satellite-map-moving');tuneLayer(currentLayer(root))};s.onEnd=e=>{s.moving=false;s.generation=e.detail?.generation||s.generation+1;if(root.__tpSatellitePanV1!==s||root.__tpMap!==map||!rootVisible(root)){if(!rootVisible(root))unbind(root);return}tuneLayer(currentLayer(root));root.classList.remove('tp-satellite-map-moving')};root.__tpSatellitePanV1=s;root.addEventListener('typhoon-overlay-motion-start',s.onStart);root.addEventListener('typhoon-overlay-motion-settled',s.onEnd);if(root.__tpOverlayMotion?.moving)s.onStart({detail:root.__tpOverlayMotion});else s.onEnd({detail:root.__tpOverlayMotion||{generation:0}})}
function style(){
  let s=document.getElementById('tpSatellitePanV1Css');
  if(!s){s=document.createElement('style');s.id='tpSatellitePanV1Css';document.head.appendChild(s)}
  s.textContent=`
[data-typhoon-root] .leaflet-pane img.leaflet-tile{
  backface-visibility:hidden!important;
  image-rendering:auto!important;
  transition:none!important;
  animation:none!important;
}
[data-typhoon-root] .leaflet-fade-anim .leaflet-tile,
[data-typhoon-root].leaflet-fade-anim .leaflet-tile{transition:none!important}
[data-typhoon-root] .leaflet-tile-container{will-change:auto!important}
[data-typhoon-root].tp-satellite-map-moving .tpv51-satbar{opacity:1!important;transition:none!important}
`;
}
function maintain(root){
  if(!rootVisible(root)){unbind(root);return}
  if(root.__tpMap)bind(root);else if(root.__tpSatellitePanV1)unbind(root);
  tuneLayer(currentLayer(root));
}
function watchRoot(root){
  if(!root||root.dataset.tpSatVisibilityWatched==='1')return;
  root.dataset.tpSatVisibilityWatched='1';
  io?.observe(root);
  maintain(root);
}
function scan(){
  installLeafletGuard();
  document.querySelectorAll('[data-typhoon-root]').forEach(watchRoot);
}
function scheduleScan(){
  if(scanFrame||document.hidden)return;
  scanFrame=requestAnimationFrame(()=>{scanFrame=0;scan()});
}
function ensureLeafletGuard(){
  if(installLeafletGuard())return;
  if(document.hidden||leafletRetry>=24)return;
  leafletRetry++;
  setTimeout(()=>{if(!document.hidden){installLeafletGuard();scan()}},Math.min(1200,80+leafletRetry*45));
}
function sleep(){
  document.querySelectorAll('[data-typhoon-root]').forEach(unbind);
}
function boot(){
  style();
  io=new IntersectionObserver(entries=>entries.forEach(entry=>{const root=entry.target;if(entry.isIntersecting&&!document.hidden)maintain(root);else unbind(root)}),{rootMargin:'96px'});
  scan();ensureLeafletGuard();
  const hosts=[document.getElementById('desktopCanvas'),document.getElementById('windowLayer')].filter(Boolean);
  hosts.forEach(host=>new MutationObserver(records=>{if(records.some(r=>r.type==='childList'&&(r.addedNodes.length||r.removedNodes.length)))scheduleScan()}).observe(host,{childList:true,subtree:true}));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)sleep();else{leafletRetry=0;scan();ensureLeafletGuard()}});
  window.addEventListener('resize',scheduleScan,{passive:true});
  window.addEventListener('webdesk-global-weather-ready',scheduleScan,{once:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskTyphoonSatellitePan={version:'v1.4',keepBuffer:10,updateWhenIdle:true,updateWhenZooming:false,noTileFade:true,noBringToFront:true,generationGuard:true,listenerCleanup:true,sharedMotionCoordinator:true,visibilityIdle:true,eventDrivenMaintenance:true};
})();