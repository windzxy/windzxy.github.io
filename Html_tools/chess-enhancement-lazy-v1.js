(()=>{
'use strict';
const VERSION='20260911-chess-enhancement-lazy-v1.0';
if(window.__windzxyChessEnhancementLazy===VERSION)return;
window.__windzxyChessEnhancementLazy=VERSION;
let loading=false,loaded=false;
const SCRIPTS=[
  ['Html_tools/chess-academy-v1.js','20260910-chess-academy-v1.0-zero-to-competition'],
  ['Html_tools/chess-fun-learning-v1.js','20260910-chess-fun-learning-v1.0-missions-stars-hints'],
  ['Html_tools/chess-piece-visuals-v1.js','20260910-chess-piece-visuals-v1.2-figurative-dual'],
  ['Html_tools/chess-academy-hero-v1.js','20260910-chess-academy-hero-v1.0-generated-art'],
  ['Html_tools/chess-generated-pieces-v1.js','20260910-chess-generated-pieces-v1.0-image25-renders']
];
function load(src,version){return new Promise(resolve=>{if(document.querySelector('script[data-chess-lazy="'+src+'"]'))return resolve();const s=document.createElement('script');s.src=src+'?v='+version;s.async=true;s.dataset.chessLazy=src;s.onload=resolve;s.onerror=resolve;document.body.appendChild(s)})}
async function activate(){if(loading||loaded||!document.querySelector('.chess-app'))return;loading=true;for(const [src,v] of SCRIPTS)await load(src,v);loaded=true;loading=false;window.dispatchEvent(new CustomEvent('webdesk-chess-enhancements-ready'))}
function schedule(){if(loaded||loading)return;if('requestIdleCallback'in window)requestIdleCallback(()=>activate(),{timeout:900});else setTimeout(activate,120)}
function boot(){if(document.querySelector('.chess-app'))schedule();const root=document.getElementById('desktopCanvas')||document.body;new MutationObserver(records=>{for(const r of records)for(const n of r.addedNodes){if(n.nodeType===1&&(n.matches?.('.chess-app')||n.querySelector?.('.chess-app'))){schedule();return}}}).observe(root,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskChessEnhancementLazy={version:VERSION,get loaded(){return loaded},scripts:SCRIPTS.map(x=>x[0])};
})();