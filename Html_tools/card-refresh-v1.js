(function(){
'use strict';
const VER='20260904-card-refresh-v1.1';
if(window.__webdeskCardRefresh===VER)return;
window.__webdeskCardRefresh=VER;

function label(){
  const lang=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
  if(/^en/i.test(lang))return 'Refresh card';
  if(/^zh-CN/i.test(lang)||/Hans/i.test(lang))return '刷新卡片';
  return '刷新卡片';
}
function syncLabel(btn){
  if(!btn)return;
  const text=label();
  btn.title=text;
  btn.setAttribute('aria-label',text);
}
function enhance(card){
  if(!card)return;
  const bar=card.querySelector('.card-bar');
  const remove=bar?.querySelector('.card-remove');
  if(!bar||!remove)return;
  let btn=bar.querySelector('.card-refresh');
  if(btn){
    card.dataset.cardRefreshReady=VER;
    syncLabel(btn);
    return;
  }
  card.dataset.cardRefreshReady=VER;
  btn=document.createElement('button');
  btn.type='button';
  btn.className='card-refresh';
  btn.dataset.cardRefresh='1';
  btn.textContent='↻';
  syncLabel(btn);
  btn.addEventListener('pointerdown',e=>e.stopPropagation());
  btn.addEventListener('mousedown',e=>e.stopPropagation());
  btn.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    if(typeof window.renderAll==='function')window.renderAll();
    else if(typeof window.renderDesktop==='function')window.renderDesktop();
  });
  bar.insertBefore(btn,remove);
}
function run(){document.querySelectorAll('.desktop-card').forEach(enhance)}
let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;run()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('change',e=>{if(e.target?.matches?.('.lang-select'))schedule()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
