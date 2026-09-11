(()=>{
'use strict';
const VER='20260911-typhoon-satellite-pan-v1.0-buffered-pan';
if(window.__windzxyTyphoonSatellitePan===VER)return;
window.__windzxyTyphoonSatellitePan=VER;

function installLeafletGuard(){
  if(!window.L?.tileLayer||window.L.tileLayer.__windzxySatelliteGuard)return false;
  const original=window.L.tileLayer;
  function guarded(url,options){
    const isJma=/jma\.go\.jp\/bosai\/himawari\/data\/satimg/i.test(String(url||''));
    if(isJma){
      options=Object.assign({},options||{}, {
        keepBuffer:8,
        updateWhenIdle:true,
        updateWhenZooming:false,
        updateInterval:240,
        crossOrigin:true,
        noWrap:false
      });
    }
    const layer=original.call(this,url,options);
    if(isJma) layer.__windzxyBufferedSatellite=true;
    return layer;
  }
  Object.keys(original).forEach(k=>{try{guarded[k]=original[k]}catch(_){}});
  guarded.__windzxySatelliteGuard=true;
  window.L.tileLayer=guarded;
  return true;
}

function currentLayer(root){
  return root?.__fastSatLayer||root?.__tpSat51?.layer||null;
}
function tuneLayer(layer){
  if(!layer)return;
  layer.options.keepBuffer=8;
  layer.options.updateInterval=240;
  layer.options.noWrap=false;
  layer.options.crossOrigin=true;
}
function bind(root){
  if(root.dataset.tpSatellitePanBound)return;
  const map=root.__tpMap;
  if(!map)return;
  root.dataset.tpSatellitePanBound='1';
  let timer=0;
  const settle=()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>{
      const layer=currentLayer(root);
      tuneLayer(layer);
      try{layer?.bringToFront?.()}catch(_){ }
      root.classList.remove('tp-satellite-map-moving');
    },140);
  };
  map.on('movestart zoomstart',()=>{
    root.classList.add('tp-satellite-map-moving');
    tuneLayer(currentLayer(root));
  });
  map.on('moveend zoomend',settle);
  settle();
}
function style(){
  if(document.getElementById('tpSatellitePanV1Css'))return;
  const s=document.createElement('style');
  s.id='tpSatellitePanV1Css';
  s.textContent=`
[data-typhoon-root] .leaflet-pane img.leaflet-tile{backface-visibility:hidden;image-rendering:auto}
[data-typhoon-root].tp-satellite-map-moving .tpv51-satbar{opacity:.82;transition:opacity .12s ease}
[data-typhoon-root] .leaflet-tile-container{will-change:transform}
`;
  document.head.appendChild(s);
}
function scan(){
  installLeafletGuard();
  document.querySelectorAll('[data-typhoon-root]').forEach(root=>{
    if(root.__tpMap)bind(root);
    tuneLayer(currentLayer(root));
  });
}
function boot(){
  style();
  scan();
  const host=document.getElementById('windowLayer')||document.body;
  new MutationObserver(()=>scan()).observe(host,{childList:true,subtree:true});
  setInterval(scan,1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskTyphoonSatellitePan={version:'v1.0',keepBuffer:8,updateWhenIdle:true,updateWhenZooming:false};
})();