(function(){
  'use strict';
  const VER='20260902-toolbox-categorized-shelf2-legacy-guard';
  if(window.WebDeskToolboxCategories&&window.WebDeskToolboxCategories.render){
    window.__windzxyToolboxCategorizedShelf='disabled-by-toolbox-categories-v1';
    window.windzxyToolboxCategorizedShelfVersion=VER;
    return;
  }
  if(window.__windzxyToolboxCategorizedShelf===VER)return;
  window.__windzxyToolboxCategorizedShelf=VER;

  const CATS=[
    ['all','全部','All'],
    ['daily','日常','Daily'],
    ['image','圖片','Image'],
    ['data','數據','Data'],
    ['finance','金融','Finance'],
    ['widgets','小組件','Widgets']
  ];
  const APP_CAT={
    weather:'daily',calendar:'daily',note:'daily',todo:'daily',clock:'daily',link:'daily',memo:'daily',typhoon:'daily',
    image:'image',color:'image',
    text:'data',table:'data',json:'data',date:'data',calc:'data',
    metals:'finance','fx-rates':'finance'
  };
  const CAT_ORDER={daily:['weather','calendar','note','todo','clock','link','memo','typhoon'],image:['image','color'],data:['text','table','json','date','calc'],finance:['metals','fx-rates'],widgets:['weather','calendar','note','todo','clock','color','link','memo','metals','fx-rates','typhoon']};
  const KEY='windzxy-toolbox-category';

  function tr(v){try{return window.t?window.t(v):v;}catch(e){return v;}}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function appCategory(app){return APP_CAT[app.id] || (app.kind==='widget'?'widgets':'data');}
  function currentCat(){return localStorage.getItem(KEY)||'all';}
  function setCat(cat){localStorage.setItem(KEY,cat);}
  function ensureUi(){
    const panel=document.querySelector('.drawer-panel[data-panel="tools"]');
    const shelf=document.getElementById('toolShelf');
    if(!panel||!shelf)return;
    if(!document.getElementById('windzxyToolboxCategorizedStyle')){
      const st=document.createElement('style');
      st.id='windzxyToolboxCategorizedStyle';
      st.textContent=`
.toolbox-catbar{display:flex;gap:7px;overflow:auto;padding:2px 0 8px;margin:0 0 8px;scrollbar-width:none}.toolbox-catbar::-webkit-scrollbar{display:none}.toolbox-catbar button{border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.075);color:var(--ink);padding:8px 11px;font-size:12px;font-weight:850;white-space:nowrap;cursor:pointer}.toolbox-catbar button.on{background:linear-gradient(135deg,rgba(255,189,98,.88),rgba(255,123,61,.72));color:#201005;border-color:rgba(255,210,145,.55)}.toolbox-section{margin:9px 0 14px}.toolbox-section-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 7px;color:var(--muted);font-size:11px;font-weight:850;letter-spacing:.04em}.toolbox-section-head b{color:var(--ink);font-size:13px}.toolbox-section-grid{display:grid;gap:8px}.toolbox-empty{padding:18px;border-radius:16px;border:1px dashed rgba(255,255,255,.18);color:var(--muted);text-align:center;background:rgba(255,255,255,.045)}.dock-tool-list.is-categorized{display:block}.dock-tool-list.is-categorized .dock-tool{width:100%;margin:0}.toolbox-section-grid .dock-tool small{font-size:14px}@media(max-width:520px){.toolbox-catbar{gap:6px}.toolbox-catbar button{padding:7px 10px}}
      `;
      document.head.appendChild(st);
    }
    if(!document.getElementById('toolboxCatbar')){
      const bar=document.createElement('div');
      bar.id='toolboxCatbar';
      bar.className='toolbox-catbar';
      bar.setAttribute('role','tablist');
      shelf.parentNode.insertBefore(bar,shelf);
    }
  }
  function labelHtml(v){return '<span data-i18n="'+esc(v)+'">'+esc(tr(v))+'</span>';}
  function toolButton(app){return '<button class="dock-tool '+esc(app.tone||'')+'" type="button" data-id="'+esc(app.id)+'" data-cat="'+esc(appCategory(app))+'"><span class="app-icon">'+esc(app.icon||'')+'</span><span>'+labelHtml(app.title)+'</span><small>＋</small></button>';}
  function ordered(list,cat){
    const order=CAT_ORDER[cat];
    if(!order)return list;
    const rank=new Map(order.map((id,i)=>[id,i]));
    return [...list].sort((a,b)=>(rank.get(a.id)??99)-(rank.get(b.id)??99));
  }
  function drawCatbar(){
    const bar=document.getElementById('toolboxCatbar');
    if(!bar)return;
    const cur=currentCat();
    bar.innerHTML=CATS.map(([id,label])=>'<button type="button" class="'+(cur===id?'on':'')+'" data-toolbox-cat="'+id+'">'+esc(tr(label))+'</button>').join('');
    bar.querySelectorAll('[data-toolbox-cat]').forEach(btn=>{
      btn.onclick=e=>{e.preventDefault();e.stopPropagation();setCat(btn.dataset.toolboxCat);renderShelf();};
    });
  }
  function appMatches(app,q){return !q || [app.title,app.desc,tr(app.title),tr(app.desc),app.id,app.kind,appCategory(app)].join(' ').toLowerCase().includes(q);}
  function renderGrouped(){
    ensureUi();drawCatbar();
    const shelf=document.getElementById('toolShelf');
    if(!shelf||!Array.isArray(window.apps||apps))return;
    const all=(window.apps||apps).filter(Boolean);
    const q=(document.getElementById('deskSearch')?.value||'').trim().toLowerCase();
    const cat=currentCat();
    const groups=cat==='all'?['daily','image','data','finance']:cat==='widgets'?['widgets']:[cat];
    const sections=[];
    groups.forEach(g=>{
      let list=all.filter(a=>(g==='widgets'?a.kind==='widget':appCategory(a)===g)).filter(a=>appMatches(a,q));
      list=ordered(list,g);
      if(list.length){
        const name=(CATS.find(x=>x[0]===g)||[g,g])[1];
        sections.push('<section class="toolbox-section" data-toolbox-section="'+esc(g)+'"><div class="toolbox-section-head"><b>'+esc(tr(name))+'</b><span>'+list.length+'</span></div><div class="toolbox-section-grid">'+list.map(toolButton).join('')+'</div></section>');
      }
    });
    shelf.classList.add('is-categorized');
    shelf.innerHTML=sections.join('')||'<div class="toolbox-empty">'+esc(tr('沒有找到相關工具'))+'</div>';
    shelf.querySelectorAll('.dock-tool').forEach(btn=>{
      btn.onclick=()=>{
        try{localStorage.setItem('windzxy-webdesk-last-manual-add',String(Date.now()));}catch(e){}
        addCard(btn.dataset.id);
      };
    });
  }
  function patch(){
    if(typeof window.renderShelf!=='function'&&typeof renderShelf!=='function')return false;
    if(window.__windzxyRenderShelfCategorized)return true;
    window.__windzxyRenderShelfCategorized=1;
    const old=renderShelf;
    renderShelf=function(){try{return renderGrouped();}catch(e){console.warn('toolbox categorized shelf failed',e);return old.apply(this,arguments);}};
    const search=document.getElementById('deskSearch');
    if(search&&!search.dataset.toolboxCatReady){search.dataset.toolboxCatReady='1';search.addEventListener('input',()=>setTimeout(()=>renderShelf(),0));}
    setTimeout(()=>renderShelf(),0);
    return true;
  }
  function boot(){if(!patch())setTimeout(boot,120);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyToolboxCategorizedShelfVersion=VER;
})();
