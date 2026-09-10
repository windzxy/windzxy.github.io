(()=>{
'use strict';
const VER='20260911-tour-map-interaction-guard-v1.0';
if(window.__maydayTourMapInteractionGuard===VER)return;
window.__maydayTourMapInteractionGuard=VER;
const QUIET_AFTER_POINTER=1100;
const QUIET_AFTER_WHEEL=850;
let lastInteraction=0,activePointers=0,settleTimer=0,observer=null;
function stage(){return document.querySelector('.map-stage.mayday-real-map')||document.querySelector('.map-stage')}
function mark(extra=0){lastInteraction=Date.now()+extra}
function busy(){return activePointers>0||Date.now()<lastInteraction}
function resizePulse(delay=0){clearTimeout(settleTimer);settleTimer=setTimeout(()=>{if(busy())return resizePulse(180);window.dispatchEvent(new Event('resize'));requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')))},delay)}
function bind(s){if(!s||s.dataset.interactionGuard==='1')return;s.dataset.interactionGuard='1';
 const down=()=>{activePointers++;mark(QUIET_AFTER_POINTER)};
 const up=()=>{activePointers=Math.max(0,activePointers-1);mark(QUIET_AFTER_POINTER);resizePulse(QUIET_AFTER_POINTER)};
 s.addEventListener('pointerdown',down,{passive:true});s.addEventListener('pointerup',up,{passive:true});s.addEventListener('pointercancel',up,{passive:true});
 s.addEventListener('touchstart',()=>mark(QUIET_AFTER_POINTER),{passive:true});s.addEventListener('touchmove',()=>mark(QUIET_AFTER_POINTER),{passive:true});s.addEventListener('touchend',()=>{mark(QUIET_AFTER_POINTER);resizePulse(QUIET_AFTER_POINTER)},{passive:true});
 s.addEventListener('wheel',()=>{mark(QUIET_AFTER_WHEEL);resizePulse(QUIET_AFTER_WHEEL)},{passive:true});
 s.addEventListener('dblclick',()=>{mark(QUIET_AFTER_POINTER);resizePulse(QUIET_AFTER_POINTER)},{passive:true});
}
function mount(){const s=stage();if(!s)return false;bind(s);if('ResizeObserver'in window){observer?.disconnect?.();observer=new ResizeObserver(()=>{if(!busy())resizePulse(120)});observer.observe(s)}return true}
// Expose a small compatibility signal so other recovery runtimes can avoid acting mid-gesture.
window.MAYDAYLAND_MAP_INTERACTION={version:VER,isBusy:busy,lastInteraction:()=>lastInteraction};
document.addEventListener('click',e=>{if(e.target?.closest?.('.mayday-map-modes button[data-mode]')){mark(1600);resizePulse(1750)}},true);
window.addEventListener('orientationchange',()=>{mark(1400);resizePulse(1550)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){mark(500);resizePulse(650)}});
window.addEventListener('pageshow',()=>{mark(500);resizePulse(650)});
window.addEventListener('hashchange',()=>setTimeout(mount,160));
let tries=0;const timer=setInterval(()=>{tries++;if(mount()||tries>48)clearInterval(timer)},250);
})();