(()=>{
'use strict';
const VER='20260911-tour-map-stability-v1.2-painted-fallback';
if(window.__maydayTourMapStability===VER)return;
window.__maydayTourMapStability=VER;
const KEY='maydayland-tour-map-mode-v1';
let lastRecovery=0,resizeTimer=0,blankTimer=0,observer=null,recovering=false;
function stage(){return document.querySelector('.map-stage.mayday-real-map')||document.querySelector('.map-stage')}
function activeMode(){return document.querySelector('.mayday-map-modes button.on')?.dataset.mode||'street'}
function buttons(){return [...document.querySelectorAll('.mayday-map-modes button[data-mode]')]}
function interactionBusy(){try{return !!window.MAYDAYLAND_MAP_INTERACTION?.isBusy?.()}catch(_){return false}}
function emitResize(delay=0){clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(interactionBusy())return emitResize(220);window.dispatchEvent(new Event('resize'));requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')))},delay)}
function visibleMap(){const s=stage();if(!s)return false;const r=s.getBoundingClientRect();return r.width>120&&r.height>180&&r.bottom>0&&r.top<innerHeight}
function hasPaint(){const s=stage();if(!s)return true;const tiles=[...s.querySelectorAll('.leaflet-tile')].some(t=>t.complete&&t.naturalWidth>0&&getComputedStyle(t).opacity!=='0');const canvas=[...s.querySelectorAll('canvas')].some(c=>c.width>32&&c.height>32);return tiles||canvas}
function status(msg,hold=1800){const el=stage()?.querySelector('.mayday-map-status');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(el.__stabilityTimer);el.__stabilityTimer=setTimeout(()=>el.classList.remove('show'),hold)}
function fallbackButton(current){const all=buttons();const preferred=current==='street'?'bright':current==='bright'?'street':current==='dark'?'street':current==='terrain'?'street':current==='sat'?'bright':'street';return all.find(b=>b.dataset.mode===preferred)||all.find(b=>b.dataset.mode!==current)}
function recoverBlank(){if(recovering)return;if(interactionBusy()){scheduleBlankCheck(1500);return}if(!visibleMap()||hasPaint())return;if(navigator.onLine===false){status('網絡暫時中斷，恢復連線後會自動重試',2400);scheduleBlankCheck(3000);return}const now=Date.now();if(now-lastRecovery<12000)return;lastRecovery=now;const current=activeMode(),fallback=fallbackButton(current);if(!fallback)return;recovering=true;status('偵測到底圖空白，正在切換可用備援…',2600);fallback.click();setTimeout(()=>{recovering=false;if(interactionBusy()){scheduleBlankCheck(1400);return}emitResize(60);if(hasPaint()){status('已保留可正常顯示的備援底圖',1800);return}status('備援底圖仍未完成載入，繼續恢復…',2000);scheduleBlankCheck(1400)},2800)}
function scheduleBlankCheck(delay=3800){clearTimeout(blankTimer);blankTimer=setTimeout(recoverBlank,delay)}
function rememberMode(e){const b=e.target?.closest?.('.mayday-map-modes button[data-mode]');if(!b)return;if(e.isTrusted){try{sessionStorage.setItem(KEY,b.dataset.mode)}catch(_){}}scheduleBlankCheck(4600)}
function restoreMode(){let wanted='';try{wanted=sessionStorage.getItem(KEY)||''}catch(_){}if(!wanted)return;const b=buttons().find(x=>x.dataset.mode===wanted);if(b&&!b.classList.contains('on'))setTimeout(()=>b.click(),350)}
function mount(){const s=stage();if(!s)return false;emitResize(80);restoreMode();scheduleBlankCheck(4500);if('ResizeObserver'in window){observer?.disconnect?.();observer=new ResizeObserver(()=>{emitResize(80);scheduleBlankCheck(interactionBusy()?2200:1200)});observer.observe(s)}return true}
document.addEventListener('click',rememberMode,true);
window.addEventListener('orientationchange',()=>{emitResize(180);scheduleBlankCheck(2200)});
window.addEventListener('online',()=>{status('網絡已恢復，正在重新檢查地圖…',1600);emitResize(60);scheduleBlankCheck(500)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){emitResize(80);scheduleBlankCheck(1600)}});
window.addEventListener('pageshow',()=>{emitResize(80);scheduleBlankCheck(1600)});
window.addEventListener('hashchange',()=>setTimeout(()=>{mount();},180));
let tries=0;const timer=setInterval(()=>{tries++;if(mount()||tries>40)clearInterval(timer)},250);
})();