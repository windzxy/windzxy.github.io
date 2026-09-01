(function(){
  const groups=[
    {id:'image',title:'圖片工具',items:['image']},
    {id:'data',title:'文字與資料',items:['text','table','date','json']},
    {id:'utility',title:'實用工具',items:['note','todo','clock','calc','color','link','memo']},
    {id:'live',title:'即時資訊',items:['metals','fx-rates','calendar','typhoon','weather']}
  ];

  function ensureStyles(){
    if(document.getElementById('webdesk-toolbox-category-style'))return;
    const style=document.createElement('style');
    style.id='webdesk-toolbox-category-style';
    style.textContent=`
      .toolbox-category{display:grid;gap:8px;margin:0 0 18px}
      .toolbox-category-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 3px}
      .toolbox-category-head strong{font-size:12px;letter-spacing:.04em;opacity:.72}
      .toolbox-category-head small{font-size:11px;opacity:.46}
      .toolbox-category-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      .toolbox-category-list .dock-tool{min-width:0}
      .toolbox-search-summary{display:flex;justify-content:space-between;gap:10px;margin:0 0 10px;padding:0 3px;font-size:11px;opacity:.55}
      .toolbox-search-summary kbd{font:inherit;padding:1px 6px;border:1px solid rgba(127,127,127,.24);border-radius:6px;opacity:.8}
      .toolbox-empty{padding:18px 12px;border:1px dashed rgba(127,127,127,.25);border-radius:14px;text-align:center;font-size:12px;opacity:.62}
      @media(max-width:560px){.toolbox-category-list{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function buttonHtml(t){
    return '<button class="dock-tool '+escapeHtml(t.tone||'')+'" type="button" data-id="'+escapeHtml(t.id)+'" aria-label="'+escapeHtml(tr(t.title))+'"><span class="app-icon">'+escapeHtml(t.icon||'')+'</span><span>'+labelHtml(t.title)+'</span><small aria-hidden="true">＋</small></button>';
  }

  function groupedRenderShelf(){
    const shelf=document.getElementById('toolShelf');
    if(!shelf||typeof apps==='undefined')return;
    ensureStyles();
    const q=(document.getElementById('deskSearch')?.value||'').trim().toLowerCase();
    const matches=apps.filter(t=>!q||[t.title,t.desc,tr(t.title),tr(t.desc)].join(' ').toLowerCase().includes(q));
    shelf.setAttribute('aria-live','polite');
    shelf.setAttribute('aria-label',q?tr('搜尋結果'):tr('功能庫'));
    if(q){
      shelf.innerHTML='<div class="toolbox-search-summary" role="status"><span>'+escapeHtml(tr('搜尋結果'))+' · '+matches.length+'</span><span><kbd>Esc</kbd> '+escapeHtml(tr('清除'))+'</span></div>'+(matches.length?'<div class="toolbox-category-list">'+matches.map(buttonHtml).join('')+'</div>':'<div class="toolbox-empty" role="status">'+escapeHtml(tr('沒有符合的工具'))+'</div>');
    }else{
      shelf.innerHTML=groups.map(group=>{
        const items=group.items.map(id=>apps.find(app=>app.id===id)).filter(Boolean);
        if(!items.length)return '';
        const title=tr(group.title);
        return '<section class="toolbox-category" data-toolbox-category="'+group.id+'" aria-label="'+escapeHtml(title)+'"><div class="toolbox-category-head"><strong>'+escapeHtml(title)+'</strong><small aria-label="'+items.length+'">'+items.length+'</small></div><div class="toolbox-category-list">'+items.map(buttonHtml).join('')+'</div></section>';
      }).join('');
    }
    shelf.querySelectorAll('.dock-tool').forEach(btn=>btn.onclick=()=>addCard(btn.dataset.id));
    if(window.applyI18n)window.applyI18n(shelf);
  }

  try{ renderShelf=groupedRenderShelf; }catch(e){}
  const search=document.getElementById('deskSearch');
  if(search&&!search.dataset.categoryShelfBound){
    search.dataset.categoryShelfBound='1';
    search.addEventListener('input',()=>queueMicrotask(groupedRenderShelf));
    search.addEventListener('search',()=>queueMicrotask(groupedRenderShelf));
  }
  if(!document.documentElement.dataset.toolboxCategoryKeysBound){
    document.documentElement.dataset.toolboxCategoryKeysBound='1';
    document.addEventListener('keydown',ev=>{
      const target=ev.target;
      const editing=target&&((target.matches&&target.matches('input,textarea,select'))||target.isContentEditable);
      if(ev.key==='/'&&!editing&&search){
        ev.preventDefault();
        search.focus();
        search.select();
        return;
      }
      if(ev.key==='Escape'&&search&&search.value){
        search.value='';
        groupedRenderShelf();
        search.focus();
      }
    });
  }
  groupedRenderShelf();
  window.WebDeskToolboxCategories={version:'v3',groups:groups.map(g=>g.id),render:groupedRenderShelf,shortcuts:{focusSearch:'/',clearSearch:'Escape'}};
})();