(()=>{
'use strict';
const VER='20260911-typhoon-control-layout-v12.0-centered-controls';
if(window.__windzxyTyphoonControlLayoutV12===VER)return;
window.__windzxyTyphoonControlLayoutV12=VER;
function style(){
  let s=document.getElementById('tpControlLayoutV12Css');
  if(!s){s=document.createElement('style');s.id='tpControlLayoutV12Css';document.head.appendChild(s)}
  s.textContent=`
/* Center weather layers, separate basemap/zoom tools, and keep the map interaction area open. */
[data-typhoon-root]>.tp-weather-p0-global{
  left:50%!important;right:auto!important;top:auto!important;bottom:14px!important;
  transform:translateX(-50%)!important;width:min(760px,calc(100% - 360px))!important;max-width:none!important;
  max-height:168px!important;box-sizing:border-box!important;display:grid!important;
  grid-template-columns:repeat(8,minmax(52px,1fr))!important;gap:5px!important;padding:6px!important;
  border-radius:15px!important;overflow:auto!important;background:linear-gradient(180deg,rgba(4,18,30,.93),rgba(5,21,34,.88))!important;
  border:1px solid rgba(180,224,255,.18)!important;box-shadow:0 8px 28px rgba(0,0,0,.28)!important;
  backdrop-filter:blur(16px) saturate(1.08)!important;
}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-title],
[data-typhoon-root]>.tp-weather-p0-global [data-p0-group]{display:none!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{
  grid-column:span 1!important;min-width:0!important;height:31px!important;min-height:31px!important;padding:0 5px!important;
  border-radius:9px!important;font-size:9px!important;font-weight:780!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
}
[data-typhoon-root]>.tp-weather-p0-global [data-layer-fix-status],
[data-typhoon-root]>.tp-weather-p0-global [data-layer-freshness]{
  grid-column:1/-1!important;min-height:0!important;margin:0!important;padding:2px 3px!important;border-top:1px solid rgba(160,210,235,.09)!important;
  font-size:7.5px!important;line-height:1.2!important;color:#a9c9da!important;
}
[data-typhoon-root]>.tp-weather-p0-global .tp-real-v5-bar,
[data-typhoon-root]>.tp-weather-p0-global .tp-zoom21-timeline{
  grid-column:1/-1!important;margin:0!important;padding:4px!important;border-radius:8px!important;background:rgba(8,29,46,.62)!important;
}
[data-typhoon-root]>.tp-weather-p0-global .tp-wind-v3-bar,
[data-typhoon-root]>.tp-weather-p0-global .tp-real-v4-bar,
[data-typhoon-root]>.tp-weather-p0-global .tp-vector-truth{display:none!important}

/* Satellite timeline follows the centered weather dock instead of floating on the far left. */
[data-typhoon-root] .tpv51-satbar{
  left:50%!important;right:auto!important;bottom:66px!important;transform:translateX(-50%)!important;
  width:min(720px,calc(100% - 400px))!important;box-sizing:border-box!important;
}
/* Cyclone info remains top-right and no longer competes with map style controls. */
[data-typhoon-root] .tpv4-panel{right:12px!important;top:48px!important;width:218px!important;max-height:210px!important;padding:9px!important;border-radius:12px!important;overflow:auto!important}
[data-typhoon-root] .tpv4-storms{right:12px!important;top:266px!important;width:218px!important;max-height:120px!important;overflow:auto!important}

/* Basemap and zoom are one compact right-side stack. */
[data-typhoon-root] .tpv4-maptools{
  right:12px!important;bottom:14px!important;top:auto!important;left:auto!important;
  display:flex!important;flex-direction:column!important;align-items:flex-end!important;gap:6px!important;
}
[data-typhoon-root] .tpv4-basemap{max-width:310px!important;overflow-x:auto!important;white-space:nowrap!important;scrollbar-width:none!important}
[data-typhoon-root] .tpv4-basemap::-webkit-scrollbar{display:none!important}
[data-typhoon-root] .leaflet-top.leaflet-left{top:46px!important;left:8px!important}

@container(max-width:1100px){
 [data-typhoon-root]>.tp-weather-p0-global{width:min(560px,calc(100% - 290px))!important;grid-template-columns:repeat(4,minmax(54px,1fr))!important;max-height:188px!important}
 [data-typhoon-root] .tpv51-satbar{width:min(540px,calc(100% - 310px))!important;bottom:98px!important}
 [data-typhoon-root] .tpv4-panel,[data-typhoon-root] .tpv4-storms{width:202px!important}
}
@media(max-width:760px){
 [data-typhoon-root]>.tp-weather-p0-global{
   left:8px!important;right:8px!important;bottom:8px!important;transform:none!important;width:auto!important;
   grid-template-columns:repeat(4,minmax(0,1fr))!important;max-height:min(184px,42dvh)!important;gap:4px!important;padding:5px!important;border-radius:13px!important;
 }
 [data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{height:28px!important;min-height:28px!important;font-size:8.5px!important;padding:0 3px!important}
 [data-typhoon-root] .tpv51-satbar{left:8px!important;right:8px!important;bottom:166px!important;transform:none!important;width:auto!important;grid-template-columns:auto minmax(70px,1fr) auto!important}
 [data-typhoon-root] .tpv51-satbar a{display:none!important}
 [data-typhoon-root] .tpv4-panel{right:8px!important;top:44px!important;width:min(204px,52vw)!important;max-height:150px!important;padding:7px!important}
 [data-typhoon-root] .tpv4-storms{display:none!important}
 [data-typhoon-root] .tpv4-maptools{right:8px!important;bottom:202px!important;gap:5px!important}
 [data-typhoon-root] .tpv4-basemap{max-width:190px!important}
}
@media(max-width:420px){
 [data-typhoon-root]>.tp-weather-p0-global{left:6px!important;right:6px!important;bottom:6px!important;gap:3px!important;padding:4px!important;max-height:174px!important}
 [data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{height:26px!important;min-height:26px!important;font-size:8px!important}
 [data-typhoon-root] .tpv51-satbar{left:6px!important;right:6px!important;bottom:158px!important}
 [data-typhoon-root] .tpv4-panel{width:min(186px,52vw)!important}
 [data-typhoon-root] .tpv4-maptools{bottom:194px!important}
}
`;
}
function annotate(root){const box=root.querySelector(':scope > .tp-weather-p0-global');if(box)box.dataset.layout='centered-controls-v12'}
function scan(){document.querySelectorAll('[data-typhoon-root]').forEach(annotate)}
function boot(){style();scan();const host=document.getElementById('windowLayer')||document.body;new MutationObserver(()=>scan()).observe(host,{childList:true,subtree:true});setInterval(scan,1600)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskTyphoonControlLayout={version:'v12.0',desktop:'centered-weather-dock',mobile:'bottom-thumb-dock',cyclonePanel:'compact-top-right',mapTools:'right-stack',satelliteTimeline:'centered-above-weather',mapFirst:true};
})();