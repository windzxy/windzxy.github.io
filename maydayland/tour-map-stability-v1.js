(()=>{
'use strict';
const VER='20260911-tour-map-stability-v1.1-interaction-aware';
if(window.__maydayTourMapStability===VER)return;
window.__maydayTourMapStability=VER;
const KEY='maydayland-tour-map-mode-v1';
let lastRecovery=0,resizeTimer=0,blankTimer=0,observer=null;
function stage(){return document.querySelector('.map-stage.mayday-real-map')||document.querySelector('.map-stage')}
function activeMode(){return document.querySelector('.mayday-map-modes button.on')?.dataset.mode||'street'}
function buttons(){return [...document.querySelectorAll('.mayday-map-modes button[data-mode]')]}
function interactionBusy(){try{return !!window.MAYDAYLAND_MAP_INTERACTION?.isBusy?.()}catch(_){return false}}
function emitResize(delay=0){clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(interactionBusy())return emitResize(220);window.dispatchEvent(new Event('resize'));requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')))},delay)}
function visibleMap(){const s=stage();if(!s)return false;const r=s.getBoundingClientRect();return r.width>120&&r.height>180&&r.bottom>0&&r.top<innerHeight}
function hasPaint(){const s=stage();if(!s)return true;const tiles=[...s.querySelectorAll('.leaflet-tile')].some(t=>t.complete&&t.naturalWidth>0&&getComputedStyle(t).opacity!=='0');const canvas=[...s.querySelectorAll('canvas')].some(c=>c.width>32&&c.height>32);return tiles||canvas}
function status(msg){const el=stage()?.querySelector('.mayday-map-status');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(el.__stabilityTimer);el.__stabilityTimer=setTimeout(()=>el.classList.remove('show'),1800)}
function recoverBlank(){if(interactionBusy()){scheduleBlankCheck(1500);return}if(!visibleMap()||hasPaint())return;const now=Date.now();if(now-lastRecovery<15000)return;lastRecovery=now;const current=activeMode(),all=buttons();const fallback=all.find(b=>b.dataset.mode===(current==='street'?'bright':'street'))||all.find(b=>b.dataset.mode!==current);if(!fallback)return;status('偵測到底圖空白，正在自動恢復…');fallback.click();setTimeout(()=>{if(interactionBusy()){scheduleBlankCheck(1200);return}const original=buttons().find(b=>b.dataset.mode===current);if(original)original.click();emitResize(120)},2600)}
function scheduleBlankCheck(delay=3800){clearTimeout(blankTimer);blankTimer=setTimeout(recoverBlank,delay)}
function rememberMode(e){const b=e.target?.closest?.('.mayday-map-modes button[data-mode]');if(!b)return;try{sessionStorage.setItem(KEY,b.dataset.mode)}catch(_){};scheduleBlankCheck(4600)}
function restoreMode(){let wanted='';try{wanted=sessionStorage.getItem(KEY)||''}catch(_){};if(!wanted)return;const b=buttons().find(x=>x.dataset.mode===wanted);if(b&&!b.classList.contains('on'))setTimeout(()=>b.click(),350)}
function mount(){const s=stage();if(!s)return false;emitResize(80);restoreMode();scheduleBlankCheck(4500);if('ResizeObserver'in window){observer?.disconnect?.();observer=new ResizeObserver(()=>{emitResize(80);scheduleBlankCheck(interactionBusy()?2200:1200)});observer.observe(s)}return true}
document.addEventListener('click',rememberMode,true);
window.addEventListener('orientationchange',()=>{emitResize(180);scheduleBlankCheck(2200)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){emitResize(80);scheduleBlankCheck(1600)}});
window.addEventListener('pageshow',()=>{emitResize(80);scheduleBlankCheck(1600)});
window.addEventListener('hashchange',()=>setTimeout(()=>{mount();},180));
let tries=0;const timer=setInterval(()=>{tries++;if(mount()||tries>40)clearInterval(timer)},250);
})();