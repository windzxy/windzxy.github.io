(()=>{
'use strict';
const VER='20260911-typhoon-control-layout-v13.1-single-owner';
if(window.__windzxyTyphoonControlLayoutV13===VER)return;
window.__windzxyTyphoonControlLayoutV13=VER;
window.__windzxyTyphoonLayoutOwner=VER;

const LEGACY_STYLE_IDS=['tpControlLayoutV10Css','tpControlLayoutV11Css','tpControlLayoutV12Css'];
function cleanupLegacyLayouts(){
  LEGACY_STYLE_IDS.forEach(id=>document.getElementById(id)?.remove());
  document.querySelectorAll('script[src*="typhoon-control-layout-v10.js"],script[src*="typhoon-control-layout-v11.js"],script[src*="typhoon-control-layout-v12.js"]').forEach(el=>el.remove());
}
function style(){
 cleanupLegacyLayouts();
 let s=document.getElementById('tpControlLayoutV13Css');
 if(!s){s=document.createElement('style');s.id='tpControlLayoutV13Css';document.head.appendChild(s)}
 s.textContent=`
/* Canonical Global Weather layout. v10-v12 styles are removed before this sheet is applied. */
[data-typhoon-root]>.tp-weather-p0-global{
 left:12px!important;right:auto!important;top:52px!important;bottom:auto!important;transform:none!important;
 width:min(336px,calc(100% - 24px))!important;max-width:none!important;max-height:calc(100% - 76px)!important;
 box-sizing:border-box!important;display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;
 gap:5px!important;padding:7px!important;border-radius:14px!important;overflow:hidden!important;
 background:linear-gradient(180deg,rgba(4,18,30,.92),rgba(5,21,34,.86))!important;
 border:1px solid rgba(180,224,255,.18)!important;box-shadow:0 8px 28px rgba(0,0,0,.28)!important;
 backdrop-filter:blur(14px) saturate(1.06)!important;
}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-title]{grid-column:1/-1!important;display:flex!important;align-items:center!important;min-height:18px!important;padding:0 2px 2px!important;font-size:10px!important;color:#edf8ff!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-title]::after{content:' ';flex:1;height:1px;margin-left:8px;background:linear-gradient(90deg,rgba(125,211,252,.22),transparent)}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-group]{grid-column:1/-1!important;margin:1px 1px -1px!important;font-size:7px!important;line-height:1!important;letter-spacing:.08em!important;color:#77a8c3!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{min-width:0!important;height:29px!important;min-height:29px!important;padding:0 4px!important;border-radius:8px!important;font-size:9px!important;font-weight:760!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="radar"],
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="cloud"]{grid-column:span 3!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="precip"],
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="wind"],
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="gust"],
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="temp"],
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="humidity"],
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode="pressure"]{grid-column:span 2!important}
[data-typhoon-root]>.tp-weather-p0-global [data-layer-freshness],
[data-typhoon-root]>.tp-weather-p0-global [data-layer-fix-status]{grid-column:1/-1!important;min-height:0!important;margin:0!important;padding:3px 2px 0!important;border-top:1px solid rgba(160,210,235,.09)!important;color:#9fc4d7!important;font-size:7.5px!important;line-height:1.2!important}
[data-typhoon-root]>.tp-weather-p0-global .tp-real-v5-bar,
[data-typhoon-root]>.tp-weather-p0-global .tp-zoom21-timeline{grid-column:1/-1!important;margin:1px 0 0!important;padding:4px!important;border-radius:8px!important;background:rgba(10,31,48,.58)!important;border-color:rgba(125,211,252,.10)!important}
[data-typhoon-root]>.tp-weather-p0-global .tp-wind-v3-bar,
[data-typhoon-root]>.tp-weather-p0-global .tp-real-v4-bar,
[data-typhoon-root]>.tp-weather-p0-global .tp-vector-truth{display:none!important}
[data-typhoon-root] .tpv51-satbar{left:12px!important;right:auto!important;top:264px!important;bottom:auto!important;transform:none!important;width:min(336px,calc(100% - 24px))!important;box-sizing:border-box!important}
[data-typhoon-root] .tpv4-panel{right:12px!important;top:48px!important;width:218px!important;max-height:210px!important;padding:9px!important;border-radius:12px!important;overflow:auto!important}
[data-typhoon-root] .tpv4-storms{right:12px!important;top:266px!important;width:218px!important;max-height:120px!important;overflow:auto!important}
[data-typhoon-root] .tpv4-maptools{right:12px!important;bottom:14px!important;top:auto!important;left:auto!important;display:flex!important;flex-direction:column!important;align-items:flex-end!important;gap:6px!important}
[data-typhoon-root] .tpv4-basemap{max-width:310px!important;overflow-x:auto!important;white-space:nowrap!important;scrollbar-width:none!important}
[data-typhoon-root] .tpv4-basemap::-webkit-scrollbar{display:none!important}
[data-typhoon-root] .leaflet-top.leaflet-left{top:52px!important;left:360px!important}
@media(max-width:980px){
 [data-typhoon-root]>.tp-weather-p0-global{width:min(320px,calc(100% - 24px))!important}
 [data-typhoon-root] .tpv51-satbar{width:min(320px,calc(100% - 24px))!important}
 [data-typhoon-root] .leaflet-top.leaflet-left{left:344px!important}
}
@media(max-width:760px){
 [data-typhoon-root]>.tp-weather-p0-global{left:8px!important;right:8px!important;top:46px!important;width:auto!important;max-height:min(205px,40dvh)!important;overflow:auto!important;padding:6px!important;gap:4px!important;border-radius:12px!important;background:rgba(4,18,30,.90)!important}
 [data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{height:27px!important;min-height:27px!important;font-size:8.5px!important}
 [data-typhoon-root] .tpv51-satbar{left:8px!important;right:8px!important;top:auto!important;bottom:8px!important;width:auto!important;grid-template-columns:auto minmax(70px,1fr) auto!important}
 [data-typhoon-root] .tpv51-satbar a{display:none!important}
 [data-typhoon-root] .tpv4-panel{right:8px!important;top:44px!important;width:min(202px,50vw)!important;max-height:148px!important;padding:7px!important}
 [data-typhoon-root] .tpv4-storms{display:none!important}
 [data-typhoon-root] .tpv4-maptools{right:8px!important;bottom:58px!important}
 [data-typhoon-root] .tpv4-basemap{max-width:188px!important}
 [data-typhoon-root] .leaflet-top.leaflet-left{top:258px!important;left:4px!important}
}
@media(max-width:420px){
 [data-typhoon-root]>.tp-weather-p0-global{left:6px!important;right:6px!important;top:44px!important;padding:5px!important;gap:3px!important}
 [data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{height:25px!important;min-height:25px!important;font-size:8px!important}
 [data-typhoon-root] .tpv51-satbar{left:6px!important;right:6px!important;bottom:6px!important}
 [data-typhoon-root] .tpv4-panel{width:min(184px,50vw)!important}
}
`;
}
function annotate(root){
 cleanupLegacyLayouts();
 const box=root.querySelector(':scope > .tp-weather-p0-global');
 if(box){box.dataset.layout='top-left-refined-v13.1';box.dataset.layoutOwner='v13.1'}
}
function scan(){document.querySelectorAll('[data-typhoon-root]').forEach(annotate)}
function boot(){
 style();scan();
 const host=document.getElementById('windowLayer')||document.body;
 new MutationObserver(()=>{cleanupLegacyLayouts();scan()}).observe(host,{childList:true,subtree:true});
 setInterval(()=>{cleanupLegacyLayouts();scan()},1800);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskTyphoonControlLayout={version:'v13.1',desktop:'compact-top-left-refined',mobile:'compact-top',cyclonePanel:'compact-top-right',mapTools:'bottom-right',satelliteTimeline:'under-weather-card',mapFirst:true,singleOwner:true};
})();