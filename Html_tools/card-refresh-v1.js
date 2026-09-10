(function(){
'use strict';
const VER='20260910-card-controls-close-only-v2.1-live-i18n-labels';
if(window.__webdeskCardRefresh===VER)return;
window.__webdeskCardRefresh=VER;

/*
 * WebDesk window chrome is intentionally close-only here.
 * Refresh belongs inside an individual widget when that widget needs it;
 * it must never be injected beside or in place of the standard close control.
 * This compatibility shim also removes refresh controls left by older builds.
 */
function removeLabel(){
  const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
  if(/^en/i.test(v))return 'Close card';
  if(/^zh-CN/i.test(v))return '关闭卡片';
  return '關閉卡片';
}

function restoreCardControls(root){
  const scope=root&&root.querySelectorAll?root:document;
  scope.querySelectorAll('.desktop-card .card-bar .card-refresh').forEach(btn=>btn.remove());
  scope.querySelectorAll('.desktop-card').forEach(card=>{
    delete card.dataset.cardRefreshReady;
    const remove=card.querySelector('.card-bar .card-remove');
    if(remove){
      remove.hidden=false;
      remove.removeAttribute('aria-hidden');
      remove.removeAttribute('disabled');
      if(remove.tagName==='BUTTON')remove.type='button';
      remove.tabIndex=0;
      const label=removeLabel();
      remove.setAttribute('aria-label',label);
      remove.setAttribute('title',label);
    }
  });
}

let queued=false;
function schedule(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;restoreCardControls(document);});
}

new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('change',e=>{if(e.target?.matches?.('.lang-select'))restoreCardControls(document);});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>restoreCardControls(document),{once:true});
else restoreCardControls(document);
})();