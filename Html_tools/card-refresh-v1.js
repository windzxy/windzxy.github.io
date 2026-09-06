(function(){
'use strict';
const VER='20260906-card-refresh-v1.4';
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
function cardKey(card){
  return card?.dataset?.cardId||card?.dataset?.id||card?.getAttribute?.('data-card-id')||card?.id||'';
}
function restoreFocus(key){
  requestAnimationFrame(()=>{
    run();
    const cards=[...document.querySelectorAll('.desktop-card')];
    const target=(key&&cards.find(card=>cardKey(card)===key))||cards.find(card=>card.querySelector('.card-refresh'));
    target?.querySelector('.card-refresh')?.focus({preventScroll:true});
  });
}
function findWidgetRefresh(card){
  if(!card)return null;
  const selectors=[
    '[data-action="refresh"]',
    '[data-refresh]:not(.card-refresh)',
    '.refresh-btn',
    '.btn-refresh',
    '.widget-refresh',
    'button[aria-label*="刷新"]',
    'button[title*="刷新"]',
    'button[aria-label*="refresh" i]',
    'button[title*="refresh" i]'
  ];
  for(const selector of selectors){
    const el=[...card.querySelectorAll(selector)].find(node=>
      !node.closest('.card-bar')&&
      !node.classList.contains('card-refresh')&&
      !node.disabled&&
      node.getAttribute('aria-disabled')!=='true'
    );
    if(el)return el;
  }
  return null;
}
function refreshCard(card){
  const nativeRefresh=findWidgetRefresh(card);
  if(nativeRefresh){
    nativeRefresh.click();
    return true;
  }
  const refreshEvent=new CustomEvent('webdesk:card-refresh',{bubbles:true,cancelable:true,detail:{cardId:cardKey(card)}});
  const handled=!card.dispatchEvent(refreshEvent);
  if(handled)return true;
  if(typeof window.renderAll==='function')window.renderAll();
  else if(typeof window.renderDesktop==='function')window.renderDesktop();
  return false;
}
function setBusy(btn,busy){
  if(!btn)return;
  btn.disabled=!!busy;
  btn.setAttribute('aria-busy',busy?'true':'false');
  btn.classList.toggle('is-refreshing',!!busy);
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
    if(btn.disabled)return;
    const key=cardKey(card);
    setBusy(btn,true);
    try{refreshCard(card);}finally{
      window.setTimeout(()=>{
        const cards=[...document.querySelectorAll('.desktop-card')];
        const target=(key&&cards.find(item=>cardKey(item)===key))||card;
        const current=target?.querySelector('.card-refresh');
        setBusy(current,false);
        syncLabel(current);
        restoreFocus(key);
      },700);
    }
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
