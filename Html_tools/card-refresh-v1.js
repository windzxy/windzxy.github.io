(function(){
'use strict';
const VER='20260908-card-refresh-v1.6-delete-feedback';
if(window.__webdeskCardRefresh===VER)return;
window.__webdeskCardRefresh=VER;

function lang(){
  return document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';
}
function label(){
  const value=lang();
  if(/^en/i.test(value))return 'Refresh card';
  if(/^zh-CN/i.test(value)||/Hans/i.test(value))return '刷新卡片';
  return '刷新卡片';
}
function doneLabel(){
  const value=lang();
  if(/^en/i.test(value))return 'Card refreshed';
  if(/^zh-CN/i.test(value)||/Hans/i.test(value))return '卡片已刷新';
  return '卡片已刷新';
}
function removedLabel(){
  const value=lang();
  if(/^en/i.test(value))return 'Card removed';
  if(/^zh-CN/i.test(value)||/Hans/i.test(value))return '卡片已刪除';
  return '卡片已刪除';
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
function ensureGlobalLive(){
  let live=document.getElementById('webdesk-card-action-status');
  if(live)return live;
  live=document.createElement('span');
  live.id='webdesk-card-action-status';
  live.setAttribute('role','status');
  live.setAttribute('aria-live','polite');
  live.setAttribute('aria-atomic','true');
  Object.assign(live.style,{position:'fixed',width:'1px',height:'1px',padding:'0',margin:'-1px',overflow:'hidden',clip:'rect(0,0,0,0)',whiteSpace:'nowrap',border:'0'});
  document.body.appendChild(live);
  return live;
}
function announceGlobal(text){
  const live=ensureGlobalLive();
  live.textContent='';
  requestAnimationFrame(()=>{live.textContent=text;});
}
function announce(card,text){
  if(!card||!text)return;
  let live=card.querySelector('.card-refresh-status');
  if(!live){
    live=document.createElement('span');
    live.className='card-refresh-status';
    live.setAttribute('role','status');
    live.setAttribute('aria-live','polite');
    live.setAttribute('aria-atomic','true');
    live.style.position='absolute';
    live.style.width='1px';
    live.style.height='1px';
    live.style.padding='0';
    live.style.margin='-1px';
    live.style.overflow='hidden';
    live.style.clip='rect(0,0,0,0)';
    live.style.whiteSpace='nowrap';
    live.style.border='0';
    card.appendChild(live);
  }
  live.textContent='';
  requestAnimationFrame(()=>{live.textContent=text;});
}
function restoreFocus(key){
  requestAnimationFrame(()=>{
    run();
    const cards=[...document.querySelectorAll('.desktop-card')];
    const target=(key&&cards.find(card=>cardKey(card)===key))||cards.find(card=>card.querySelector('.card-refresh'));
    target?.querySelector('.card-refresh')?.focus({preventScroll:true});
  });
}
function focusAfterRemoval(preferredKey){
  requestAnimationFrame(()=>{
    run();
    const cards=[...document.querySelectorAll('.desktop-card')];
    const target=(preferredKey&&cards.find(card=>cardKey(card)===preferredKey))||cards[0];
    const focusable=target?.querySelector('.card-refresh,.card-remove,button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
    focusable?.focus?.({preventScroll:true});
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
        announce(target,doneLabel());
        restoreFocus(key);
      },700);
    }
  });
  bar.insertBefore(btn,remove);
}
function run(){document.querySelectorAll('.desktop-card').forEach(enhance)}
let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;run()})}

document.addEventListener('click',e=>{
  const remove=e.target?.closest?.('.card-remove');
  if(!remove)return;
  const card=remove.closest('.desktop-card');
  if(!card)return;
  const cards=[...document.querySelectorAll('.desktop-card')];
  const index=cards.indexOf(card);
  const preferred=cards[index+1]||cards[index-1]||null;
  const preferredKey=cardKey(preferred);
  window.setTimeout(()=>{
    if(!document.documentElement.contains(card)){
      announceGlobal(removedLabel());
      focusAfterRemoval(preferredKey);
    }
  },120);
},true);

new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('change',e=>{if(e.target?.matches?.('.lang-select'))schedule()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
