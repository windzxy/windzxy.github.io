(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const TOUR_STORAGE='maydayland-tour-filter-v1';

function injectStyle(){
  if($('#maydayland-tour-map-product-v1-style')) return;
  const style=document.createElement('style');
  style.id='maydayland-tour-map-product-v1-style';
  style.textContent=`
    .map-card .route{transition:opacity .22s ease,filter .22s ease,stroke-width .22s ease}
    .map-card .route.dim{opacity:.08!important;filter:saturate(.35)}
    .map-card .route:not(.dim){opacity:1!important;filter:drop-shadow(0 0 7px var(--c));stroke-width:4.2px}
    .tour-route-status{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px;padding:11px 13px;border:1px solid rgba(255,255,255,.09);border-radius:14px;background:rgba(255,255,255,.035)}
    .tour-route-status strong{display:block;font-size:13px}.tour-route-status small{display:block;margin-top:2px;color:#8fa4b8;font-size:11px}
    .tour-route-status button{border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:7px 10px;background:rgba(255,255,255,.05);color:inherit;font-size:11px;cursor:pointer}
    .tour-mobile-hint{display:none;margin:8px 2px 0;color:#8fa4b8;font-size:11px;letter-spacing:.02em}
    .map-svg g[data-city]{cursor:pointer;outline:none}.map-svg g[data-city]:focus .city-node,.map-svg g[data-city]:hover .city-node{stroke:#fff;stroke-width:3;filter:drop-shadow(0 0 8px rgba(255,255,255,.7))}
    .legend span[data-route-filter]{cursor:pointer;transition:opacity .18s ease,transform .18s ease,background .18s ease;outline:none}
    .legend span[data-route-filter]:hover,.legend span[data-route-filter]:focus-visible{transform:translateY(-1px)}
    .legend span[data-route-filter][aria-pressed="true"]{opacity:1!important;background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}
    @media(prefers-reduced-motion:reduce){.map-card .route,.legend span[data-route-filter]{transition:none!important}}
    @media(max-width:720px){.tour-route-status{position:sticky;top:0;z-index:2;backdrop-filter:blur(12px)}.tour-mobile-hint{display:block}.map-stage{min-height:360px;overflow:auto;overscroll-behavior-x:contain;scroll-snap-type:x proximity;scrollbar-width:thin}.map-svg{min-width:620px;scroll-snap-align:start}}
  `;
  document.head.appendChild(style);
}

function productizeCopy(){
  const replacements=[
    ['Stable Core Audit','Tour · Music · Time Archive'],
    ['resilient core · no blank screen','巡演 · 城市 · 專輯 · 時間'],
    ['MAYDAYLAND · RECOVERY CORE','MAYDAYLAND · TOUR & MUSIC ARCHIVE'],
    ['先恢復 A–F 六個核心分頁與巡演地圖，再逐項接回歌曲、書籍、時間線與手機增強層。','從巡演路線、城市與場館一路走進專輯、歌曲、出版與五月天的時間檔案。'],
    ['Maydayland · resilient recovery core','Maydayland · 五月天巡演與音樂資料館']
  ];
  $$('small,span,p,footer,.footer').forEach(el=>{
    let text=el.textContent||'';
    replacements.forEach(([a,b])=>{if(text.trim()===a) el.textContent=b;});
  });
  $$('.score div').forEach(card=>{
    const label=$('small',card),value=$('b',card); if(!label||!value) return;
    if(label.textContent==='核心狀態'){label.textContent='巡演路線';value.textContent=String($$('.route').length)+' 條';}
    else if(label.textContent==='分頁'){label.textContent='資料入口';value.textContent='A–F';}
    else if(label.textContent==='外部依賴'){label.textContent='城市節點';value.textContent=String($$('.city-btn').length)+' 城';}
    else if(label.textContent==='首屏策略'){label.textContent='時間跨度';value.textContent='1997–2026';}
  });
  $$('.kv div').forEach(card=>{
    const label=$('small',card),value=$('b',card); if(label&&value&&label.textContent==='核心'&&value.textContent==='Stable'){label.textContent='資料狀態';value.textContent='持續整理';}
  });
}

function connectMapNodes(){
  const cityByName={};
  $$('.city-btn[data-city]').forEach(btn=>cityByName[(btn.textContent||'').trim()]=btn.dataset.city);
  $$('.map-svg .city-label').forEach(label=>{
    const id=cityByName[(label.textContent||'').trim()];
    const group=label.closest('g');
    if(!id||!group) return;
    group.dataset.city=id; group.setAttribute('role','button'); group.setAttribute('tabindex','0');
    group.setAttribute('aria-label','查看 '+label.textContent.trim()+' 城市資料');
    if(group.dataset.cityNodeReady==='1')return;
    group.dataset.cityNodeReady='1';
    const activate=()=>{const btn=$('.city-btn[data-city="'+CSS.escape(id)+'"]');if(btn)btn.click();};
    group.addEventListener('click',activate);
    group.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
  });
}

function wireTourKeyboard(){
  const tours=$$('.tour[data-tour]');
  tours.forEach((btn,index)=>{
    if(btn.dataset.keyboardReady==='1')return;
    btn.dataset.keyboardReady='1';
    btn.addEventListener('keydown',e=>{
      let next=-1;
      if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(index+1)%tours.length;
      else if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(index-1+tours.length)%tours.length;
      else if(e.key==='Home')next=0;
      else if(e.key==='End')next=tours.length-1;
      if(next<0)return;
      e.preventDefault();
      tours[next]?.focus();
      tours[next]?.click();
    });
  });
}

function wireLegend(){
  const buttons={};
  $$('.tour[data-tour]').forEach(btn=>{
    const b=$('b',btn);if(b)buttons[b.textContent.trim()]=btn.dataset.tour;
    btn.setAttribute('aria-pressed',btn.classList.contains('active')?'true':'false');
  });
  wireTourKeyboard();
  $$('.map-card>.legend span,.map-card .legend span').forEach(span=>{
    const name=(span.textContent||'').trim(); const id=buttons[name]; if(!id) return;
    span.dataset.routeFilter=id; span.setAttribute('role','button'); span.setAttribute('tabindex','0'); span.setAttribute('aria-pressed','false');
    span.setAttribute('aria-label','只顯示 '+name+' 路線');
    const activate=()=>{const btn=$('.tour[data-tour="'+id+'"]');if(btn)btn.click();};
    span.addEventListener('click',activate); span.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
  });
}

function routeFromHash(){
  const parts=(location.hash||'').replace(/^#/,'').split('/');
  if(parts[0]!=='home'||!parts[1])return '';
  try{return decodeURIComponent(parts[1]);}catch(e){return parts[1];}
}
function syncRouteHash(id){
  if((location.hash||'#home').replace(/^#/,'').split('/')[0]!=='home')return;
  const next=id&&id!=='all'?'#home/'+encodeURIComponent(id):'#home';
  if(location.hash!==next)history.replaceState(null,'',next);
}
function rememberTour(id){
  const value=id||'all';
  try{localStorage.setItem(TOUR_STORAGE,value);}catch(e){}
  syncRouteHash(value);
}
function applyRouteFromHash(){
  const id=routeFromHash()||'all';
  const btn=$('.tour[data-tour="'+CSS.escape(id)+'"]')||$('.tour[data-tour="all"]');
  if(btn&&!btn.classList.contains('active'))requestAnimationFrame(()=>btn.click());
}
function restoreTour(){
  if(document.documentElement.dataset.maydaylandTourRestored==='1') return;
  document.documentElement.dataset.maydaylandTourRestored='1';
  let id=routeFromHash();
  if(!id){try{id=localStorage.getItem(TOUR_STORAGE)||'all';}catch(e){id='all';}}
  const btn=$('.tour[data-tour="'+CSS.escape(id)+'"]')||$('.tour[data-tour="all"]');
  if(btn&&!btn.classList.contains('active')) requestAnimationFrame(()=>btn.click());
}

function selectedTour(){return $('.tour.active[data-tour]')||$('.tour[data-tour="all"]');}
function syncStatus(){
  const card=$('.map-card'); if(!card) return;
  let status=$('.tour-route-status',card);
  if(!status){
    status=document.createElement('div');status.className='tour-route-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');const head=$('.map-head',card);if(head)head.insertAdjacentElement('afterend',status);else card.prepend(status);
    const stage=$('.map-stage',card);if(stage&&!$('.tour-mobile-hint',card)){const hint=document.createElement('div');hint.className='tour-mobile-hint';hint.textContent='左右滑動瀏覽巡演地圖 · 點城市節點查看資料';stage.insertAdjacentElement('afterend',hint);}
  }
  const active=selectedTour(); if(!active) return;
  const id=active.dataset.tour||'all'; const name=($('b',active)?.textContent||'全部巡演').trim(); const years=($('small',active)?.textContent||'').trim();
  let cities=$$('.city-btn[data-city]').length;
  if(id!=='all'){
    const route=$('.route[data-route="'+id+'"]'); const points=route?.getAttribute('points')?.trim(); if(points)cities=points.split(/\s+/).length;
  }
  status.innerHTML='<div><strong>'+name+'</strong><small>'+(id==='all'?'顯示所有巡演分色路線':'聚焦 '+years+' · '+cities+' 個路線節點 · 網址可直接分享此篩選')+'</small></div>'+(id==='all'?'':'<button type="button" data-show-all-routes>顯示全部</button>');
  const reset=$('[data-show-all-routes]',status); if(reset)reset.onclick=()=>$('.tour[data-tour="all"]')?.click();
  $$('.tour[data-tour]').forEach(btn=>btn.setAttribute('aria-pressed',(btn.dataset.tour||'all')===id?'true':'false'));
  $$('.legend [data-route-filter]').forEach(x=>{
    const selected=id!=='all'&&x.dataset.routeFilter===id;
    x.style.opacity=(id==='all'||selected)?'1':'.38';
    x.setAttribute('aria-pressed',selected?'true':'false');
  });
}

function enhance(){
  if(!$('.map-card')||!$('.tour[data-tour]')) return false;
  injectStyle(); productizeCopy(); connectMapNodes(); wireLegend(); restoreTour(); syncStatus();
  document.documentElement.dataset.maydaylandTourMap='product-v1.7';
  return true;
}

function boot(){
  if(enhance()) return;
  let tries=0; const timer=setInterval(()=>{tries++;if(enhance()||tries>40)clearInterval(timer);},100);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&selectedTour()?.dataset.tour!=='all')$('.tour[data-tour="all"]')?.click();});
document.addEventListener('click',e=>{const tour=e.target.closest?.('[data-tour]');if(tour)rememberTour(tour.dataset.tour||'all');if(e.target.closest?.('[data-tour],[data-city],[data-page]'))requestAnimationFrame(()=>{productizeCopy();syncStatus();});});
window.addEventListener('hashchange',()=>{if((location.hash||'').startsWith('#home'))applyRouteFromHash();});
})();