(()=>{
'use strict';
const VER='20260911-tour-map-stability-v1.3-fast-recovery';
if(window.__maydayTourMapStability===VER)return;
window.__maydayTourMapStability=VER;
const KEY='maydayland-tour-map-mode-v1';
let lastRecovery=0,resizeTimer=0,blankTimer=0,observer=null,recovering=false,blankSince=0;
function stage(){return document.querySelector('.map-stage.mayday-real-map')||document.querySelector('.map-stage')}
function activeMode(){return document.querySelector('.mayday-map-modes button.on')?.dataset.mode||'street'}
function buttons(){return [...document.querySelectorAll('.mayday-map-modes button[data-mode]')]}
function interactionBusy(){try{return !!window.MAYDAYLAND_MAP_INTERACTION?.isBusy?.()}catch(_){return false}}
function emitResize(delay=0){clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(interactionBusy())return emitResize(180);window.dispatchEvent(new Event('resize'));requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')))},delay)}
function visibleMap(){const s=stage();if(!s)return false;const r=s.getBoundingClientRect();return r.width>120&&r.height>180&&r.bottom>0&&r.top<innerHeight}
function hasPaint(){const s=stage();if(!s)return true;const tiles=[...s.querySelectorAll('.leaflet-tile')].some(t=>t.complete&&t.naturalWidth>0&&getComputedStyle(t).opacity!=='0');const canvas=[...s.querySelectorAll('canvas')].some(c=>c.width>32&&c.height>32&&getComputedStyle(c).visibility!=='hidden'&&getComputedStyle(c).opacity!=='0');return tiles||canvas}
function status(msg,hold=1800){const el=stage()?.querySelector('.mayday-map-status');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(el.__stabilityTimer);el.__stabilityTimer=setTimeout(()=>el.classList.remove('show'),hold)}
function fallbackButton(current){const all=buttons();const preferred=current==='street'?'bright':current==='bright'?'street':current==='dark'?'street':current==='terrain'?'street':current==='sat'?'bright':'street';return all.find(b=>b.dataset.mode===preferred)||all.find(b=>b.dataset.mode!==current)}
function recoverBlank(){if(recovering)return;if(interactionBusy()){blankSince=0;scheduleBlankCheck(1100);return}if(!visibleMap()||hasPaint()){blankSince=0;return}const now=Date.now();if(!blankSince){blankSince=now;scheduleBlankCheck(900);return}if(now-blankSince<850){scheduleBlankCheck(900);return}if(navigator.onLine===false){status('網絡暫時中斷，恢復連線後會自動重試',2400);scheduleBlankCheck(2600);return}if(now-lastRecovery<8000){scheduleBlankCheck(1200);return}lastRecovery=now;blankSince=0;const current=activeMode(),fallback=fallbackButton(current);if(!fallback)return;recovering=true;status('底圖持續空白，正在切換可用備援…',2200);fallback.click();setTimeout(()=>{recovering=false;if(interactionBusy()){scheduleBlankCheck(1000);return}emitResize(40);if(hasPaint()){status('已切換至可正常顯示的備援底圖',1600);return}status('備援底圖仍未完成載入，繼續恢復…',1800);scheduleBlankCheck(900)},2100)}
function scheduleBlankCheck(delay=2600){clearTimeout(blankTimer);blankTimer=setTimeout(recoverBlank,delay)}
function rememberMode(e){const b=e.target?.closest?.('.mayday-map-modes button[data-mode]');if(!b)return;if(e.isTrusted){try{sessionStorage.setItem(KEY,b.dataset.mode)}catch(_){}}blankSince=0;scheduleBlankCheck(2300)}
function restoreMode(){let wanted='';try{wanted=sessionStorage.getItem(KEY)||''}catch(_){}if(!wanted)return;const b=buttons().find(x=>x.dataset.mode===wanted);if(b&&!b.classList.contains('on'))setTimeout(()=>b.click(),280)}
function mount(){const s=stage();if(!s)return false;emitResize(60);restoreMode();scheduleBlankCheck(2400);if('ResizeObserver'in window){observer?.disconnect?.();observer=new ResizeObserver(()=>{emitResize(60);scheduleBlankCheck(interactionBusy()?1700:900)});observer.observe(s)}return true}
document.addEventListener('click',rememberMode,true);
window.addEventListener('orientationchange',()=>{emitResize(140);scheduleBlankCheck(1500)});
window.addEventListener('online',()=>{status('網絡已恢復，正在重新檢查地圖…',1500);emitResize(40);scheduleBlankCheck(350)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){emitResize(60);scheduleBlankCheck(1100)}});
window.addEventListener('pageshow',()=>{emitResize(60);scheduleBlankCheck(1100)});
window.addEventListener('hashchange',()=>setTimeout(()=>{mount();},150));
let tries=0;const timer=setInterval(()=>{tries++;if(mount()||tries>40)clearInterval(timer)},250);
})();