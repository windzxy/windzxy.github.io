(()=>{
'use strict';
const VER='20260910-typhoon-control-layout-v10.0-compact-responsive';
if(window.__windzxyTyphoonControlLayoutV10===VER)return;
window.__windzxyTyphoonControlLayoutV10=VER;

function style(){
  let s=document.getElementById('tpControlLayoutV10Css');
  if(!s){s=document.createElement('style');s.id='tpControlLayoutV10Css';document.head.appendChild(s)}
  s.textContent=`
/* Weather controls: compact, map-first, two-section layout. */
[data-typhoon-root]>.tp-weather-p0-global{
  left:12px!important;top:54px!important;width:min(328px,calc(100% - 24px))!important;
  max-height:calc(100% - 76px)!important;box-sizing:border-box!important;
  grid-template-columns:repeat(6,minmax(0,1fr))!important;
  gap:5px!important;padding:7px!important;border-radius:14px!important;
  background:linear-gradient(180deg,rgba(4,18,30,.92),rgba(5,21,34,.86))!important;
  border:1px solid rgba(180,224,255,.18)!important;
  box-shadow:0 8px 28px rgba(0,0,0,.28)!important;
  backdrop-filter:blur(16px) saturate(1.08)!important;
  overflow:hidden!important;
}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-title]{
  grid-column:1/-1!important;display:flex!important;align-items:center!important;
  min-height:18px!important;padding:0 2px 2px!important;font-size:10px!important;
  color:#edf8ff!important;letter-spacing:.01em!important;
}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-title]::after{
  content:' ';flex:1;height:1px;margin-left:8px;background:linear-gradient(90deg,rgba(125,211,252,.22),transparent);
}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-group]{
  grid-column:1/-1!important;margin:1px 1px -1px!important;gap:5px!important;
  font-size:7px!important;line-height:1!important;letter-spacing:.10em!important;color:#77a8c3!important;
}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-group]::after{background:rgba(160,210,235,.10)!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{
  min-width:0!important;min-height:29px!important;height:29px!important;padding:0 4px!important;
  border-radius:8px!important;font-size:9px!important;font-weight:760!important;
  overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;
}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="radar"],
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="cloud"]{grid-column:span 3!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="precip"],
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="wind"],
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="gust"],
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="temp"],
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="humidity"],
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="pressure"]{grid-column:span 2!important}
[data-typhoon-root]>.tp-weather-p0-global [data-layer-freshness],
[data-typhoon-root]>.tp-weather-p0-global [data-layer-fix-status]{
  grid-column:1/-1!important;min-height:0!important;margin:0!important;padding:3px 2px 0!important;
  border-top:1px solid rgba(160,210,235,.09)!important;color:#9fc4d7!important;font-size:7.5px!important;line-height:1.2!important;
}
/* Timeline belongs visually to the selected weather layer, not as a second large panel. */
[data-typhoon-root]>.tp-weather-p0-global .tp-wind-v3-bar,
[data-typhoon-root]>.tp-weather-p0-global .tp-real-v4-bar,
[data-typhoon-root]>.tp-weather-p0-global .tp-zoom21-timeline{
  grid-column:1/-1!important;margin:1px 0 0!important;padding:4px!important;border-radius:8px!important;
  background:rgba(10,31,48,.58)!important;border-color:rgba(125,211,252,.10)!important;
}
[data-typhoon-root]>.tp-weather-p0-global .tp-vector-truth,
[data-typhoon-root]>.tp-weather-p0-global .tp-wind-v3-source,
[data-typhoon-root]>.tp-weather-p0-global .tp-real-v4-source{font-size:7px!important;line-height:1.15!important}
/* Keep Leaflet map buttons away from the weather panel. */
[data-typhoon-root] .leaflet-top.leaflet-left{top:158px!important;left:4px!important}
[data-typhoon-root] .leaflet-control-zoom{margin-top:8px!important}

@media(max-width:760px){
  [data-typhoon-root]>.tp-weather-p0-global{
    left:8px!important;right:8px!important;top:48px!important;width:auto!important;
    max-height:min(44%,230px)!important;padding:6px!important;gap:4px!important;border-radius:12px!important;
    background:rgba(4,18,30,.88)!important;overflow:auto!important;
  }
  [data-typhoon-root]>.tp-weather-p0-global [data-p0-title]{font-size:9px!important;min-height:15px!important;padding-bottom:1px!important}
  [data-typhoon-root]>.tp-weather-p0-global [data-p0-group]{font-size:6.5px!important;margin-top:0!important}
  [data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{height:27px!important;min-height:27px!important;font-size:8.5px!important}
  [data-typhoon-root]>.tp-weather-p0-global [data-layer-freshness],
  [data-typhoon-root]>.tp-weather-p0-global [data-layer-fix-status]{font-size:7px!important;padding-top:2px!important}
  [data-typhoon-root] .leaflet-top.leaflet-left{top:178px!important;left:2px!important}
}
@media(max-width:420px){
  [data-typhoon-root]>.tp-weather-p0-global{left:6px!important;right:6px!important;top:46px!important;gap:3px!important;padding:5px!important}
  [data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{height:25px!important;min-height:25px!important;font-size:8px!important}
  [data-typhoon-root]>.tp-weather-p0-global .tp-wind-v3-bar,
  [data-typhoon-root]>.tp-weather-p0-global .tp-real-v4-bar,
  [data-typhoon-root]>.tp-weather-p0-global .tp-zoom21-timeline{padding:3px!important;gap:3px!important}
}
@media(max-height:520px){
  [data-typhoon-root]>.tp-weather-p0-global{top:42px!important;max-height:calc(100% - 50px)!important}
  [data-typhoon-root]>.tp-weather-p0-global [data-p0-title]{display:none!important}
  [data-typhoon-root]>.tp-weather-p0-global [data-p0-group]{display:none!important}
  [data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{height:24px!important;min-height:24px!important}
}
`;
}
function annotate(root){const box=root.querySelector(':scope > .tp-weather-p0-global');if(!box)return;box.dataset.layout='compact-v10';box.setAttribute('aria-description','Compact weather layer controls designed to keep the map visible');}
function scan(){document.querySelectorAll('[data-typhoon-root]').forEach(annotate)}
function boot(){style();scan();const host=document.getElementById('windowLayer')||document.body;new MutationObserver(()=>scan()).observe(host,{childList:true,subtree:true});setInterval(scan,1800)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskTyphoonControlLayout={version:'v10.0',desktop:'compact-6-column',mobile:'full-width-compact-top',mapFirst:true,liveButtons:2,forecastButtons:6};
})();