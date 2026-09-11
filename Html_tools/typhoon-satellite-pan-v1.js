(()=>{
'use strict';
const VER='20260912-typhoon-satellite-pan-v1.2-generation-guard-cleanup';
if(window.__windzxyTyphoonSatellitePan===VER)return;
window.__windzxyTyphoonSatellitePan=VER;

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
function unbind(root){
  const s=root?.__tpSatellitePanV1;
  if(!s)return;
  if(s.timer){clearTimeout(s.timer);s.timer=0}
  try{
    s.map?.off('movestart zoomstart',s.onStart);
    s.map?.off('moveend zoomend',s.onEnd);
  }catch(_){}
  root.__tpSatellitePanV1=null;
  root?.classList?.remove('tp-satellite-map-moving');
}
function bind(root){
  const map=root.__tpMap;if(!map)return;
  const old=root.__tpSatellitePanV1;
  if(old?.map===map)return;
  if(old)unbind(root);
  const s={map,timer:0,generation:0,moving:false,onStart:null,onEnd:null};
  s.onStart=()=>{
    s.moving=true;
    ++s.generation;
    if(s.timer){clearTimeout(s.timer);s.timer=0}
    root.classList.add('tp-satellite-map-moving');
    tuneLayer(currentLayer(root));
  };
  s.onEnd=()=>{
    s.moving=false;
    const gen=++s.generation;
    if(s.timer)clearTimeout(s.timer);
    s.timer=setTimeout(()=>{
      s.timer=0;
      if(root.__tpSatellitePanV1!==s||root.__tpMap!==map||s.moving||gen!==s.generation)return;
      tuneLayer(currentLayer(root));
      root.classList.remove('tp-satellite-map-moving');
    },260);
  };
  root.__tpSatellitePanV1=s;
  map.on('movestart zoomstart',s.onStart);
  map.on('moveend zoomend',s.onEnd);
  s.onEnd();
}
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
function scan(){
  installLeafletGuard();
  document.querySelectorAll('[data-typhoon-root]').forEach(root=>{
    if(root.__tpMap)bind(root);
    else if(root.__tpSatellitePanV1)unbind(root);
    tuneLayer(currentLayer(root));
  });
}
function boot(){
  style();scan();
  const host=document.getElementById('windowLayer')||document.body;
  new MutationObserver(()=>scan()).observe(host,{childList:true,subtree:true});
  setInterval(scan,1400);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskTyphoonSatellitePan={version:'v1.2',keepBuffer:10,updateWhenIdle:true,updateWhenZooming:false,noTileFade:true,noBringToFront:true,generationGuard:true,listenerCleanup:true,settleDelay:260};
})();