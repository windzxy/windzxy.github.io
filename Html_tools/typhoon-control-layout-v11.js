(()=>{
'use strict';
const VER='20260910-typhoon-control-layout-v11.0-bottom-dock';
if(window.__windzxyTyphoonControlLayoutV11===VER)return;
window.__windzxyTyphoonControlLayoutV11=VER;
function style(){
 let s=document.getElementById('tpControlLayoutV11Css');
 if(!s){s=document.createElement('style');s.id='tpControlLayoutV11Css';document.head.appendChild(s)}
 s.textContent=`
/* Map-first desktop layout: weather becomes a bottom dock, not a tall map blocker. */
[data-typhoon-root]>.tp-weather-p0-global{
  left:14px!important;right:auto!important;top:auto!important;bottom:14px!important;
  width:min(760px,calc(100% - 326px))!important;max-width:none!important;max-height:min(184px,calc(100% - 72px))!important;
  box-sizing:border-box!important;display:grid!important;grid-template-columns:repeat(8,minmax(52px,1fr))!important;
  gap:5px!important;padding:6px!important;border-radius:15px!important;overflow:auto!important;
  background:linear-gradient(180deg,rgba(4,18,30,.91),rgba(5,21,34,.86))!important;
  border:1px solid rgba(180,224,255,.18)!important;box-shadow:0 8px 28px rgba(0,0,0,.28)!important;
  backdrop-filter:blur(16px) saturate(1.08)!important;
}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-title],
[data-typhoon-root]>.tp-weather-p0-global [data-p0-group]{display:none!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{
  grid-column:span 1!important;min-width:0!important;height:31px!important;min-height:31px!important;padding:0 5px!important;
  border-radius:9px!important;font-size:9px!important;font-weight:780!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="precip"]{border-left-color:rgba(125,211,252,.40)!important}
[data-typhoon-root]>.tp-weather-p0-global [data-layer-fix-status],
[data-typhoon-root]>.tp-weather-p0-global [data-layer-freshness]{
  grid-column:1/-1!important;min-height:0!important;margin:0!important;padding:2px 3px!important;border-top:1px solid rgba(160,210,235,.09)!important;
  font-size:7.5px!important;line-height:1.2!important;color:#a9c9da!important;
}
[data-typhoon-root]>.tp-weather-p0-global .tp-real-v5-bar,
[data-typhoon-root]>.tp-weather-p0-global .tp-zoom21-timeline{
  grid-column:1/-1!important;margin:0!important;padding:4px!important;border-radius:8px!important;background:rgba(8,29,46,.62)!important;
}
/* Superseded failed playback controls must never remain visible. */
[data-typhoon-root]>.tp-weather-p0-global .tp-wind-v3-bar,
[data-typhoon-root]>.tp-weather-p0-global .tp-real-v4-bar,
[data-typhoon-root]>.tp-weather-p0-global .tp-vector-truth{display:none!important}
/* Right-side cyclone card is compact and separate from the map interaction zone. */
[data-typhoon-root] .tpv4-panel{right:12px!important;top:48px!important;width:218px!important;max-height:210px!important;padding:9px!important;border-radius:12px!important;overflow:auto!important}
[data-typhoon-root] .tpv4-panel h3{font-size:14px!important;line-height:1.15!important}
[data-typhoon-root] .tpv4-storms{right:12px!important;top:266px!important;width:218px!important;max-height:120px!important;overflow:auto!important}
/* Base-map and zoom tools stay in a single thumb/mouse corner, clear of forecast dock. */
[data-typhoon-root] .tpv4-maptools{right:12px!important;bottom:14px!important;top:auto!important;gap:5px!important}
[data-typhoon-root] .tpv4-basemap{max-width:260px!important;overflow-x:auto!important;white-space:nowrap!important}
[data-typhoon-root] .leaflet-top.leaflet-left{top:42px!important;left:4px!important}

@container(max-width:1100px){
 [data-typhoon-root]>.tp-weather-p0-global{width:min(520px,calc(100% - 272px))!important;grid-template-columns:repeat(4,minmax(54px,1fr))!important;max-height:196px!important}
 [data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{height:29px!important;min-height:29px!important}
 [data-typhoon-root] .tpv4-panel{width:202px!important}
 [data-typhoon-root] .tpv4-storms{width:202px!important}
}
@media(max-width:760px){
 [data-typhoon-root]>.tp-weather-p0-global{
   left:8px!important;right:8px!important;bottom:8px!important;top:auto!important;width:auto!important;
   grid-template-columns:repeat(4,minmax(0,1fr))!important;max-height:min(190px,42dvh)!important;
   gap:4px!important;padding:5px!important;border-radius:13px!important;background:rgba(4,18,30,.90)!important;
 }
 [data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{height:28px!important;min-height:28px!important;font-size:8.5px!important;padding:0 3px!important}
 [data-typhoon-root]>.tp-weather-p0-global [data-layer-fix-status],
 [data-typhoon-root]>.tp-weather-p0-global [data-layer-freshness]{font-size:7px!important;padding:2px!important}
 [data-typhoon-root] .tpv4-panel{right:8px!important;top:44px!important;width:min(204px,52vw)!important;max-height:150px!important;padding:7px!important}
 [data-typhoon-root] .tpv4-storms{display:none!important}
 [data-typhoon-root] .tpv4-maptools{right:8px!important;bottom:176px!important}
 [data-typhoon-root] .tpv4-basemap{max-width:180px!important}
}
@media(max-width:420px){
 [data-typhoon-root]>.tp-weather-p0-global{left:6px!important;right:6px!important;bottom:6px!important;gap:3px!important;padding:4px!important;max-height:178px!important}
 [data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{height:26px!important;min-height:26px!important;font-size:8px!important}
 [data-typhoon-root] .tpv4-panel{width:min(186px,52vw)!important}
 [data-typhoon-root] .tpv4-maptools{bottom:166px!important}
}
`;
}
function annotate(root){const box=root.querySelector(':scope > .tp-weather-p0-global');if(box)box.dataset.layout='bottom-dock-v11'}
function scan(){document.querySelectorAll('[data-typhoon-root]').forEach(annotate)}
function boot(){style();scan();const host=document.getElementById('windowLayer')||document.body;new MutationObserver(()=>scan()).observe(host,{childList:true,subtree:true});setInterval(scan,1600)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskTyphoonControlLayout={version:'v11.0',desktop:'bottom-weather-dock',mobile:'bottom-thumb-dock',cyclonePanel:'compact-top-right',mapTools:'bottom-right',mapFirst:true};
})();