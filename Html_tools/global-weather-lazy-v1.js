(()=>{
'use strict';
const VERSION='20260911-global-weather-lazy-v1.2-viewport-cache';
if(window.__windzxyGlobalWeatherLazy===VERSION)return;
window.__windzxyGlobalWeatherLazy=VERSION;
let loading=false,loaded=false,observer=null;
const SCRIPTS=[
 ['Html_tools/typhoon-window-p0-fix.js','20260908-typhoon-window-p0-fix7-tile-viewport-repair'],
 ['Html_tools/typhoon-radar-v4-1.js','20260902-typhoon-radar-v4.2-sync'],
 ['Html_tools/typhoon-atmosphere-v5-1.js','20260902-typhoon-atmosphere-v5.2-sync'],
 ['Html_tools/typhoon-openfreemap-v6.js','20260908-typhoon-openfreemap-v6.4-world-wrap'],
 ['Html_tools/typhoon-product-shell-v6.js','20260902-typhoon-product-shell-v6-keyless'],
 ['Html_tools/typhoon-weather-runtime-v11.js','20260902-typhoon-weather-v11-consolidated'],
 ['Html_tools/typhoon-weather-ui-recovery-v11-1.js','20260907-typhoon-weather-ui-recovery-v11.3-self-heal'],
 ['Html_tools/typhoon-weather-p0-remount.js','20260909-typhoon-weather-p0-remount-v9-grouped-controller'],
 ['Html_tools/typhoon-openmeteo-broker-v1.js','20260911-typhoon-weather-hub-v2.6-viewport-cache'],
 ['Html_tools/typhoon-weather-layer-interaction-fix-v1.js','20260910-typhoon-layer-interaction-v6-hub-recovery'],
 ['Html_tools/typhoon-dynamic-city-labels-v1.js','20260910-typhoon-dynamic-city-labels-v1.6-shared-hub'],
 ['Html_tools/typhoon-zoom-motion-v2-1.js','20260910-typhoon-zoom-motion-v2.1-real-vectors'],
 ['Html_tools/mobile-desktop-ux-v1.js','20260910-mobile-desktop-ux-v1.0'],
 ['Html_tools/typhoon-control-layout-v11.js','20260910-typhoon-control-layout-v11.0-bottom-dock']
];
function hasWeather(){return !!document.querySelector('[data-typhoon-root],.typhoon-widget,.desktop-card.t-typhoon')}
function load(src,v){return new Promise(resolve=>{if(document.querySelector('script[data-weather-lazy="'+src+'"]')||document.querySelector('script[src^="'+src+'?"]'))return resolve();const s=document.createElement('script');s.src=src+'?v='+v;s.async=false;s.dataset.weatherLazy=src;s.onload=resolve;s.onerror=resolve;document.body.appendChild(s)})}
function idle(){return new Promise(resolve=>{'requestIdleCallback'in window?requestIdleCallback(()=>resolve(),{timeout:350}):setTimeout(resolve,24)})}
async function activate(){if(loading||loaded||!hasWeather())return;loading=true;observer?.disconnect();observer=null;for(let i=0;i<SCRIPTS.length;i++){const [src,v]=SCRIPTS[i];await load(src,v);if(i===7||i===11)await idle()}loaded=true;loading=false;window.dispatchEvent(new CustomEvent('webdesk-global-weather-ready'))}
function schedule(){if(loading||loaded)return;if('requestIdleCallback'in window)requestIdleCallback(()=>activate(),{timeout:250});else setTimeout(activate,30)}
function boot(){if(hasWeather())schedule();else{const root=document.getElementById('desktopCanvas')||document.body;observer=new MutationObserver(()=>{if(hasWeather())schedule()});observer.observe(root,{childList:true,subtree:true})}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskGlobalWeatherLazy={version:VERSION,get loaded(){return loaded},activate,scripts:SCRIPTS.map(x=>x[0]),performanceProfile:'single-weather-animation-runtime'};
})();