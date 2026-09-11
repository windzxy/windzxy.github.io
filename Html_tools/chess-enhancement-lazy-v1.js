(()=>{
'use strict';
const VERSION='20260911-chess-enhancement-lazy-v1.1-explicit-tutorial';
if(window.__windzxyChessEnhancementLazy===VERSION)return;
window.__windzxyChessEnhancementLazy=VERSION;
let loading=false,loaded=false;
const SCRIPTS=[
  ['Html_tools/chess-academy-v1.js','20260910-chess-academy-v1.0-zero-to-competition'],
  ['Html_tools/chess-fun-learning-v1.js','20260910-chess-fun-learning-v1.0-missions-stars-hints']
];
function load(src,version){return new Promise(resolve=>{if(document.querySelector('script[data-chess-lazy="'+src+'"]')||document.querySelector('script[src^="'+src+'?"]'))return resolve();const s=document.createElement('script');s.src=src+'?v='+version;s.async=true;s.dataset.chessLazy=src;s.onload=resolve;s.onerror=resolve;document.body.appendChild(s)})}
async function activate(){if(loading||loaded)return;loading=true;for(const [src,v] of SCRIPTS)await load(src,v);loaded=true;loading=false;window.dispatchEvent(new CustomEvent('webdesk-chess-enhancements-ready'))}
function schedule(){if(loaded||loading)return;if('requestIdleCallback'in window)requestIdleCallback(()=>activate(),{timeout:600});else setTimeout(activate,60)}
function boot(){document.addEventListener('click',e=>{const btn=e.target.closest?.('.chess-app [data-chess-mode="tutorial"]');if(btn)setTimeout(schedule,0)},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskChessEnhancementLazy={version:VERSION,get loaded(){return loaded},activate,scripts:SCRIPTS.map(x=>x[0]),autoload:false};
})();