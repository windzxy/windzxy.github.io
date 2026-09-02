(()=>{'use strict';
const VER='20260902-typhoon-zoomearth-sync-v4.1-live';
if(window.__windzxyTyphoonZoomEarthSync===VER)return;
window.__windzxyTyphoonZoomEarthSync=VER;
function style(){if(document.getElementById('tpZoomEarthSyncStyle'))return;const s=document.createElement('style');s.id='tpZoomEarthSyncStyle';s.textContent=`
.tp-layer-toolbar{display:none!important}.tpv55-wrap{display:none!important}
[data-typhoon-root] .tpwx-canvas,[data-typhoon-root] .tpwx-particles{transition:none!important;will-change:transform}
`;document.head.appendChild(s)}
function clearNative(root){root.__tpNativeMode=null;root.__tpNativeHour=root.__tpNativeHour||0;const pane=root.__tpMap?.getPane?.('tpWxPane');for(const sel of ['.tpwx-canvas','.tpwx-particles']){const el=pane?.querySelector(sel);if(el){el.getContext?.('2d')?.clearRect(0,0,el.width||0,el.height||0)}}cancelAnimationFrame(root.__tpWxRAF||0);root.__tpWxRAF=0;root.querySelectorAll('[data-tp-native-mode]').forEach(b=>b.classList.remove('on'));root.querySelector('.tp-native-weather .time')?.classList.remove('show')}
function ensureExclusive(root,keep){if(keep!=='radar'&&root.__tpRadar41)root.querySelector('[data-tpv41-radar]')?.click();if(keep!=='cloud'&&root.__tpSat51)root.querySelector('[data-tpv51-cloud]')?.click()}
function bind(root){if(!root||!document.body.contains(root))return;if(root.dataset.tpZeSyncClicks==='1')return;root.dataset.tpZeSyncClicks='1';root.addEventListener('click',e=>{const ext=e.target.closest('[data-tp-native-ext]');if(ext){e.preventDefault();e.stopImmediatePropagation();const kind=ext.dataset.tpNativeExt;clearNative(root);ensureExclusive(root,kind);if(kind==='radar'){if(!root.__tpRadar41)root.querySelector('[data-tpv41-radar]')?.click()}else if(kind==='cloud'){if(!root.__tpSat51)root.querySelector('[data-tpv51-cloud]')?.click()}return}const mode=e.target.closest('[data-tp-native-mode]');if(mode)ensureExclusive(root,'native')},true)}
function scan(scope=document){scope.querySelectorAll?.('[data-typhoon-root]').forEach(bind)}
function boot(){style();scan();const host=document.getElementById('windowLayer')||document.body;new MutationObserver(ms=>{for(const m of ms){const o=m.target?.closest?.('[data-typhoon-root]');if(o)bind(o);for(const n of m.addedNodes){if(n.nodeType!==1)continue;if(n.matches?.('[data-typhoon-root]'))bind(n);scan(n)}}}).observe(host,{childList:true,subtree:true});setInterval(()=>scan(),1500);window.WebDeskTyphoonZoomEarthSync={version:'v4.1-live',exclusiveLayers:true,mapSync:'leaflet-pane',radarFix:true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();