(() => {
  'use strict';
  const VERSION='83.0.0';
  const DATA_URL='./data/publications-v48.json?v=83.0.0';
  let data=null, type='all', era='all', selected=null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const $=(s,r=document)=>r.querySelector(s);
  document.addEventListener('DOMContentLoaded',init);
  async function init(){
    data=await fetch(DATA_URL,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!data)return;
    selected=data.items?.[0]?.id||null;
    enhanceWhenBooksVisible();
    document.addEventListener('click',onClick,true);
    window.addEventListener('hashchange',enhanceWhenBooksVisible);
    new MutationObserver(enhanceWhenBooksVisible).observe(document.body,{subtree:true,childList:true});
  }
  function onClick(e){
    const p=e.target.closest('[data-page="books"]');
    if(p)setTimeout(enhanceWhenBooksVisible,0);
    const t=e.target.closest('[data-v48-type]'); if(t){type=t.dataset.v48Type;ensureSelection();render();e.stopPropagation();return;}
    const er=e.target.closest('[data-v48-era]'); if(er){era=er.dataset.v48Era;ensureSelection();render();e.stopPropagation();return;}
    const it=e.target.closest('[data-v48-item]'); if(it){selected=it.dataset.v48Item;render();e.stopPropagation();}
  }
  function filtered(){return (data.items||[]).filter(x=>(type==='all'||x.type===type)&&(era==='all'||x.era===era));}
  function ensureSelection(){const list=filtered();if(!list.some(x=>x.id===selected))selected=list[0]?.id||null;}
  function enhanceWhenBooksVisible(){
    const sec=$('.v45-section.active');
    if(!sec||!location.hash.startsWith('#books'))return;
    render();
  }
  function render(){
    const sec=[...document.querySelectorAll('.v45-section')].find(s=>s.classList.contains('active'));
    if(!sec||!location.hash.startsWith('#books'))return;
    const list=filtered(); const item=(data.items||[]).find(x=>x.id===selected)||list[0]||null;
    sec.innerHTML=`<div class="v48-books-shell"><aside class="v45-card v48-books-nav"><small>PUBLICATION FILTER</small><div class="v48-filter-title">Type</div>${data.types.map(x=>`<button data-v48-type="${esc(x.id)}" class="${type===x.id?'active':''}">${esc(x.label)}</button>`).join('')}<div class="v48-filter-title">Era</div><button data-v48-era="all" class="${era==='all'?'active':''}">全部年代</button>${data.eras.map(x=>`<button data-v48-era="${esc(x.id)}" class="${era===x.id?'active':''}">${esc(x.label)}</button>`).join('')}</aside><div class="v48-books-main"><section class="v45-card v48-archive-head"><div><small>BOOKS & PUBLICATIONS · v${VERSION}</small><h2>出版物檔案館</h2><p>從「六張占位卡」升級成可按類型與年代探索的收藏檔案。未完成書目核驗的項目會明確標示，不把產品模型冒充官方版本。</p></div><div class="v48-count"><b>${list.length}</b><span>items in view</span></div></section><div class="v48-shelf">${list.map(x=>`<button class="v48-pub-card ${item&&x.id===item.id?'active':''}" data-v48-item="${esc(x.id)}" style="--pub:${esc(x.accent)}"><div class="v48-spine"></div><div class="v48-cover"><small>${esc(x.year)} · ${esc(x.type)}</small><b>${esc(x.title)}</b></div><div class="v48-card-meta"><span>${esc(x.en)}</span><strong>${esc(x.publisher)}</strong></div></button>`).join('')}</div>${item?drawer(item):'<section class="v45-card v48-drawer">目前篩選沒有項目。</section>'}</div></div>`;
  }
  function drawer(x){return `<section class="v45-card v48-drawer" style="--pub:${esc(x.accent)}"><div class="v48-book-object"><span>${esc(x.title)}</span></div><article class="v48-drawer-copy"><small>ARCHIVE DRAWER · ${esc(x.type)}</small><h3>${esc(x.title)}<span>${esc(x.en)}</span></h3><div class="v48-chipline"><span>${esc(x.year)}</span><span>${esc(x.era)}</span><span>${esc(x.publisher)}</span></div><p>${esc(x.summary)}</p><div class="v48-link-grid">${(x.links||[]).map(l=>`<div><b>${esc(l)}</b><span>cross-link target</span></div>`).join('')}</div><div class="v48-status"><b>資料狀態：</b> ${esc(x.status)}</div></article></section>`;}
})();

(() => {
  'use strict';
  const VERSION='83.0.0';
  const DATA_URL='./data/timeline-v49.json?v=83.0.0';
  let data=null, category='all', era='all', selected=null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const $=(s,r=document)=>r.querySelector(s);
  document.addEventListener('DOMContentLoaded',init);
  async function init(){
    data=await fetch(DATA_URL,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!data)return;
    selected=data.events?.[0]?.id||null;
    enhanceWhenVisible();
    document.addEventListener('click',onClick,true);
    window.addEventListener('hashchange',()=>setTimeout(enhanceWhenVisible,0));
    new MutationObserver(()=>setTimeout(enhanceWhenVisible,0)).observe(document.body,{subtree:true,childList:true});
  }
  function onClick(e){
    const page=e.target.closest('[data-page="timeline"]');
    if(page)setTimeout(enhanceWhenVisible,0);
    const c=e.target.closest('[data-v49-category]');
    if(c){category=c.dataset.v49Category;ensureSelection();render(true);e.stopPropagation();return;}
    const er=e.target.closest('[data-v49-era]');
    if(er){era=er.dataset.v49Era;ensureSelection();render(true);e.stopPropagation();return;}
    const ev=e.target.closest('[data-v49-event]');
    if(ev){selected=ev.dataset.v49Event;history.replaceState(null,'','#timeline/'+selected);render(true);e.stopPropagation();}
  }
  function filtered(){return (data.events||[]).filter(x=>(category==='all'||x.category===category)&&(era==='all'||x.era===era));}
  function ensureSelection(){const list=filtered();if(!list.some(x=>x.id===selected))selected=list[0]?.id||null;}
  function enhanceWhenVisible(){
    if(!location.hash.startsWith('#timeline'))return;
    const sec=[...document.querySelectorAll('.v45-section')].find(s=>s.classList.contains('active'));
    if(!sec||sec.dataset.v49Enhanced==='1')return;
    const bits=location.hash.replace('#','').split('/');
    if(bits[1]&&(data.events||[]).some(x=>x.id===bits[1]))selected=bits[1];
    render(false,sec);
  }
  function render(force=false,target=null){
    const sec=target||[...document.querySelectorAll('.v45-section')].find(s=>s.classList.contains('active'));
    if(!sec||!location.hash.startsWith('#timeline'))return;
    if(!force&&sec.dataset.v49Enhanced==='1')return;
    sec.dataset.v49Enhanced='1';
    const list=filtered();
    const item=(data.events||[]).find(x=>x.id===selected)||list[0]||null;
    sec.innerHTML=`<div class="v49-timeline-shell"><aside class="v45-card v49-timeline-nav"><small>TIMELINE FILTER</small><div class="v49-filter-title">Category</div>${data.categories.map(x=>`<button data-v49-category="${esc(x.id)}" class="${category===x.id?'active':''}">${esc(x.label)}</button>`).join('')}<div class="v49-filter-title">Era</div><button data-v49-era="all" class="${era==='all'?'active':''}">全部年代</button>${data.eras.map(x=>`<button data-v49-era="${esc(x.id)}" class="${era===x.id?'active':''}">${esc(x.label)}</button>`).join('')}</aside><div class="v49-main"><section class="v45-card v49-head"><div><small>TIMELINE / ARCHIVE · v${VERSION}</small><h2>歷程檔案館</h2><p>把年份清單升級成可按年代與事件類型探索的檔案時間軸，並把巡演、城市、專輯、歌曲和出版物連到同一條敘事主線。</p></div><div class="v49-count"><b>${list.length}</b><span>events in view</span></div></section><div class="v49-track">${list.map(x=>eventCard(x,item)).join('')}</div>${item?drawer(item):'<section class="v45-card v49-drawer">目前篩選沒有事件。</section>'}</div></div>`;
  }
  function eventCard(x,item){return `<button class="v49-event ${item&&x.id===item.id?'active':''}" data-v49-event="${esc(x.id)}" style="--event:${esc(x.accent)}"><div class="v49-year"><b>${esc(x.year)}</b><small>${esc(x.dateLabel)}</small></div><div class="v49-event-copy"><h3>${esc(x.title)}</h3><p>${esc(x.subtitle)}</p></div><span class="v49-status">${esc(x.status)}</span></button>`;}
  function drawer(x){return `<section class="v45-card v49-drawer" style="--event:${esc(x.accent)}"><div class="v49-orbit"><span>${esc(x.year)}</span></div><article class="v49-drawer-copy"><small>ARCHIVE EVENT · ${esc(x.category)}</small><h3>${esc(x.title)}<span>${esc(x.subtitle)}</span></h3><div class="v49-chipline"><span>${esc(x.dateLabel)}</span><span>${esc(x.era)}</span><span>${esc(x.category)}</span></div><p>${esc(x.summary)}</p><div class="v49-link-grid">${(x.links||[]).map(l=>`<div><b>${esc(l)}</b><span>cross-page index</span></div>`).join('')}</div><div class="v49-note"><b>資料狀態：</b> ${esc(x.status)} · ${esc(data.principle)}</div></article></section>`;}
})();

document.documentElement.dataset.v83Archives='ready';
window.dispatchEvent(new CustomEvent('maydayland:archives-ready',{detail:{version:'v83',modules:['books','timeline']}}));
