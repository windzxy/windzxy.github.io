(()=>{
'use strict';
const VERSION='20260912-webdesk-mobile-responsive-v2.3-targeted-card-observer';
if(window.__webdeskMobileResponsive===VERSION)return;
window.__webdeskMobileResponsive=VERSION;
let activeIndex=0,lastIds=[],touch=null,indicator=null;

function installStyle(){
  let s=document.getElementById('webdesk-mobile-responsive-v2-style');
  if(!s){s=document.createElement('style');s.id='webdesk-mobile-responsive-v2-style';document.head.appendChild(s)}
  s.textContent=`
  .webdesk-mobile-fab,.webdesk-mobile-card-indicator{display:none}
  @media (max-width:820px){
    html,body{width:100%!important;min-height:100%!important;height:auto!important;max-height:none!important;overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important}
    body.desktop-home{position:static!important}
    #desktopApp,.web-desktop{position:relative!important;width:100%!important;min-height:100vh!important;height:auto!important;max-height:none!important;overflow:visible!important;padding-bottom:calc(82px + env(safe-area-inset-bottom))!important;box-sizing:border-box!important}
    #desktopCanvas,.desktop-surface{position:relative!important;inset:auto!important;width:100%!important;min-height:0!important;height:auto!important;max-height:none!important;overflow:visible!important;box-sizing:border-box!important;padding:10px max(10px,env(safe-area-inset-right)) 16px max(10px,env(safe-area-inset-left))!important;touch-action:pan-y!important}
    #windowLayer,.window-layer{position:relative!important;inset:auto!important;width:100%!important;height:auto!important;max-height:none!important;overflow:visible!important;box-sizing:border-box!important}

    /* Only the current card is shown; horizontal swipes switch cards. */
    .desktop-card{display:none!important;position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;width:100%!important;max-width:100%!important;min-width:0!important;height:auto!important;min-height:0!important;max-height:none!important;margin:0!important;box-sizing:border-box!important;overflow:visible!important;border-radius:18px!important}
    .desktop-card.mobile-active-card{display:block!important;animation:webdesk-card-in .18s ease-out}
    @keyframes webdesk-card-in{from{opacity:.35;transform:translateX(10px)}to{opacity:1;transform:none}}
    .desktop-card .card-body,.desktop-card .card-content,.desktop-card .desktop-card-body,.desktop-card [data-card-body]{width:100%!important;max-width:100%!important;min-width:0!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;box-sizing:border-box!important}
    .desktop-card .resize-grip,.desktop-card .card-resize,.desktop-card .resize-handle,[data-card-resize]{display:none!important}

    .weather-card,.calendar-card,.class-schedule-card,.metals-card,.fx-card,.image-workbench,.text-tool,.table-tool,.json-tool,.date-tool,.gomoku-app,.chess-app,.xq-app{width:100%!important;max-width:100%!important;min-width:0!important;height:auto!important;max-height:none!important;box-sizing:border-box!important;overflow:visible!important}
    img,canvas,svg,video,iframe,table{max-width:100%!important}
    .gomoku-main,.chess-main,.xq-main{display:grid!important;grid-template-columns:minmax(0,1fr)!important;width:100%!important;max-width:100%!important;min-width:0!important;height:auto!important;max-height:none!important;overflow:visible!important;gap:10px!important}
    .gomoku-board,.chess-board{width:100%!important;max-width:100%!important;aspect-ratio:1/1!important;margin:0 auto!important;box-sizing:border-box!important}
    .xq-board{width:100%!important;max-width:100%!important;aspect-ratio:9/10!important;margin:0 auto!important;box-sizing:border-box!important}
    .gomoku-app .boardgame-side,.chess-app .boardgame-side,.xq-app .xq-side{position:static!important;width:100%!important;max-width:100%!important;min-width:0!important;height:auto!important;max-height:none!important;overflow:visible!important;box-sizing:border-box!important}

    .webdesk-mobile-card-indicator{display:flex!important;position:sticky!important;bottom:8px!important;z-index:60!important;width:max-content!important;max-width:calc(100vw - 96px)!important;margin:8px auto 0!important;padding:7px 11px!important;border-radius:999px!important;align-items:center!important;gap:8px!important;background:rgba(255,255,255,.88)!important;box-shadow:0 7px 24px rgba(0,0,0,.16)!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;font:700 12px/1 system-ui!important;color:#253047!important}
    html[data-theme='dark'] .webdesk-mobile-card-indicator{background:rgba(25,29,38,.9)!important;color:#eef2ff!important}
    .webdesk-mobile-card-dots{display:flex;gap:4px;align-items:center}
    .webdesk-mobile-card-dots i{display:block;width:5px;height:5px;border-radius:999px;background:currentColor;opacity:.25}.webdesk-mobile-card-dots i.active{width:14px;opacity:.9}

    .desktop-dock{position:fixed!important;right:max(10px,env(safe-area-inset-right))!important;bottom:max(82px,calc(env(safe-area-inset-bottom) + 76px))!important;z-index:12020!important;display:flex!important;flex-direction:column!important;gap:8px!important;padding:9px!important;border-radius:20px!important;background:rgba(250,250,250,.94)!important;box-shadow:0 16px 40px rgba(0,0,0,.28)!important;backdrop-filter:blur(16px) saturate(1.2)!important;-webkit-backdrop-filter:blur(16px) saturate(1.2)!important;transform:translateX(calc(100% + 34px))!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:transform .22s cubic-bezier(.2,.8,.2,1),opacity .18s ease,visibility .18s ease!important}
    html[data-theme='dark'] .desktop-dock{background:rgba(24,28,36,.94)!important}
    body.webdesk-dock-open .desktop-dock{transform:translateX(0)!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important}
    .desktop-dock button{width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;border-radius:14px!important}
    .webdesk-mobile-fab{display:flex!important;position:fixed!important;right:max(12px,env(safe-area-inset-right))!important;bottom:max(18px,calc(env(safe-area-inset-bottom) + 12px))!important;width:54px!important;height:54px!important;z-index:12021!important;align-items:center!important;justify-content:center!important;border:0!important;border-radius:18px!important;background:linear-gradient(145deg,#ff9800,#ff7a00)!important;color:#fff!important;font:800 26px/1 system-ui!important;box-shadow:0 12px 30px rgba(0,0,0,.28)!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
    body.webdesk-dock-open .webdesk-mobile-fab{transform:rotate(45deg)!important}
    .desktop-drawer{max-height:calc(100dvh - 20px)!important;overflow-y:auto!important}
    .desktop-taskbar{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;width:100%!important;box-sizing:border-box!important;z-index:40!important}
  }
  `;
}
function cards(){return [...document.querySelectorAll('#desktopCanvas .desktop-card')]}
function currentWorkspaceKey(){try{return typeof activeWorkspace==='function'?(activeWorkspace()?.id||'default'):'default'}catch(_){return 'default'}}
function savedKey(){return 'webdesk-mobile-card-index:'+currentWorkspaceKey()}
function ensureIndicator(){
  if(indicator?.isConnected)return indicator;
  indicator=document.createElement('div');indicator.className='webdesk-mobile-card-indicator';indicator.setAttribute('aria-live','polite');
  const canvas=document.getElementById('desktopCanvas');canvas?.insertAdjacentElement('afterend',indicator);return indicator;
}
function renderIndicator(list){
  const el=ensureIndicator();if(!el)return;
  if(!list.length){el.style.display='none';return}el.style.removeProperty('display');
  const title=list[activeIndex]?.querySelector('.card-bar h3')?.textContent?.trim()||'卡片';
  const dots=list.length<=8?'<span class="webdesk-mobile-card-dots">'+list.map((_,i)=>'<i class="'+(i===activeIndex?'active':'')+'"></i>').join('')+'</span>':'';
  el.innerHTML='<span>'+escapeHtmlLite(title)+'</span><b>'+(activeIndex+1)+' / '+list.length+'</b>'+dots;
}
function escapeHtmlLite(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function show(index,{scroll=true}={}){
  if(innerWidth>820)return;const list=cards();if(!list.length){activeIndex=0;renderIndicator(list);return}
  activeIndex=Math.max(0,Math.min(list.length-1,index));
  list.forEach((c,i)=>c.classList.toggle('mobile-active-card',i===activeIndex));
  localStorage.setItem(savedKey(),String(activeIndex));renderIndicator(list);
  if(scroll){const canvas=document.getElementById('desktopCanvas');const y=(canvas?.getBoundingClientRect().top||0)+scrollY-8;window.scrollTo({top:Math.max(0,y),behavior:'smooth'})}
}
function syncCards(){
  if(innerWidth>820)return;const list=cards(),ids=list.map(x=>x.dataset.cardId||'');
  const added=ids.filter(id=>id&&!lastIds.includes(id));
  if(added.length&&lastIds.length){const newest=ids.lastIndexOf(added[added.length-1]);activeIndex=newest>=0?newest:activeIndex}
  else if(!lastIds.length){activeIndex=Math.max(0,Math.min(list.length-1,+(localStorage.getItem(savedKey())||0)))}
  else activeIndex=Math.min(activeIndex,Math.max(0,list.length-1));
  lastIds=ids;show(activeIndex,{scroll:false});
}
function bindSwipe(){
  const canvas=document.getElementById('desktopCanvas');if(!canvas||canvas.dataset.mobileSwipeBound==='1')return;canvas.dataset.mobileSwipeBound='1';
  canvas.addEventListener('pointerdown',e=>{if(innerWidth>820||e.pointerType==='mouse'&&e.button!==0)return;if(e.target.closest('input,textarea,select,button,a,[contenteditable=true]'))return;touch={x:e.clientX,y:e.clientY,t:Date.now()}} ,{passive:true});
  canvas.addEventListener('pointerup',e=>{if(!touch||innerWidth>820)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y,dt=Date.now()-touch.t;touch=null;if(dt>900||Math.abs(dx)<48||Math.abs(dx)<Math.abs(dy)*1.2)return;if(dx<0)show(activeIndex+1);else show(activeIndex-1)},{passive:true});
}
function closeDock(){document.body.classList.remove('webdesk-dock-open');const b=document.querySelector('.webdesk-mobile-fab');if(b)b.setAttribute('aria-expanded','false')}
function toggleDock(){const next=!document.body.classList.contains('webdesk-dock-open');document.body.classList.toggle('webdesk-dock-open',next);const b=document.querySelector('.webdesk-mobile-fab');if(b)b.setAttribute('aria-expanded',String(next))}
function installFab(){
  if(document.querySelector('.webdesk-mobile-fab'))return;const b=document.createElement('button');b.type='button';b.className='webdesk-mobile-fab';b.textContent='+';b.setAttribute('aria-label','開啟 WebDesk 功能選單');b.setAttribute('aria-expanded','false');document.body.appendChild(b);
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleDock()});
  document.addEventListener('pointerdown',e=>{if(innerWidth>820||!document.body.classList.contains('webdesk-dock-open'))return;if(e.target.closest('.desktop-dock,.webdesk-mobile-fab'))return;closeDock()},true);
  document.addEventListener('click',e=>{if(innerWidth>820)return;if(e.target.closest('.desktop-dock [data-dock],.desktop-dock [data-random-bg]'))setTimeout(closeDock,0)},true);
  window.addEventListener('keydown',e=>{if(e.key==='Escape')closeDock()});
}
function leaveMobile(){document.querySelectorAll('.desktop-card.mobile-active-card').forEach(x=>x.classList.remove('mobile-active-card'));document.body.classList.remove('webdesk-dock-open')}
let syncFrame=0,resizeTimer=0;
function scheduleSync(){
  if(syncFrame)return;
  syncFrame=requestAnimationFrame(()=>{syncFrame=0;bindSwipe();syncCards()});
}
function boot(){
  installStyle();installFab();bindSwipe();syncCards();
  const canvas=document.getElementById('desktopCanvas');
  if(canvas){
    new MutationObserver(records=>{
      if(records.some(r=>r.type==='childList'&&(r.addedNodes.length||r.removedNodes.length)))scheduleSync();
    }).observe(canvas,{childList:true,subtree:false});
  }
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{if(innerWidth<=820)scheduleSync();else leaveMobile()},120);
  },{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(scheduleSync,140),{passive:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskMobileResponsive={version:VERSION,features:['safe-floating-dock','single-card-mobile-view','swipe-card-switching','natural-card-height','vertical-page-scroll','card-position-indicator']};
})();
