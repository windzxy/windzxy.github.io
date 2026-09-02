(()=>{'use strict';
const VER='20260902-typhoon-keyless-basemap-v5.1';
if(window.__windzxyTyphoonKeylessBase===VER)return;
window.__windzxyTyphoonKeylessBase=VER;
function style(){if(document.getElementById('tpKeylessBaseStyle'))return;const s=document.createElement('style');s.id='tpKeylessBaseStyle';s.textContent=`
[data-typhoon-root] .ze-keyless-dark{filter:invert(90%) hue-rotate(170deg) brightness(.64) saturate(.72) contrast(1.08)}
`;document.head.appendChild(s)}
function apply(root){if(!root||!document.body.contains(root)||!root.__tpMap||!window.L)return;const map=root.__tpMap;if(root.dataset.zeKeylessBase==='1')return;root.dataset.zeKeylessBase='1';root.dataset.zeDarkBase='1';try{const old=root.__tpBase?.map;const keyless=window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,className:'ze-keyless-dark',attribution:'© OpenStreetMap contributors'});root.__tpBase=root.__tpBase||{};root.__tpBase.map=keyless;if(root.__tpBaseName==='map'){if(old&&map.hasLayer(old))map.removeLayer(old);keyless.addTo(map)}}catch(e){root.dataset.zeKeylessBase='0'}}
function mount(root){if(!root||!document.body.contains(root))return;if(root.__tpMap){apply(root);return}let n=0;const wait=()=>{if(!document.body.contains(root))return;if(root.__tpMap){apply(root);return}if(n++<120)setTimeout(wait,100)};wait()}
function scan(scope=document){scope.querySelectorAll?.('[data-typhoon-root]').forEach(mount)}
function boot(){style();scan();const host=document.getElementById('windowLayer')||document.body;new MutationObserver(ms=>{for(const m of ms){const o=m.target?.closest?.('[data-typhoon-root]');if(o)mount(o);for(const n of m.addedNodes)if(n.nodeType===1){if(n.matches?.('[data-typhoon-root]'))mount(n);scan(n)}}}).observe(host,{childList:true,subtree:true});setInterval(()=>scan(),1500);window.WebDeskTyphoonKeylessBase={version:'v5.1',provider:'OpenStreetMap',apiKey:false,darkFilter:true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();