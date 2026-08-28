(() => {
  'use strict';
  const VERSION='51.0.0';
  const DATA_URL='./data/source-registry-v51.json?v=51.0.0';
  const $=(s,r=document)=>r.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let data=null, open=false, query='';
  document.addEventListener('DOMContentLoaded',init);

  async function init(){
    data=await fetch(DATA_URL,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!data)return;
    injectGlobalUI();
    document.addEventListener('click',onClick,true);
    document.addEventListener('keydown',onKey,true);
    window.addEventListener('hashchange',renderEntityRail);
    new MutationObserver(()=>requestAnimationFrame(renderEntityRail)).observe(document.body,{subtree:true,childList:true});
    renderEntityRail();
  }

  function injectGlobalUI(){
    $('#v50SearchLauncher')?.remove(); $('#v50TrustBadge')?.remove(); $('#v50Overlay')?.remove();
    if(!$('#v51SearchLauncher')){
      const b=document.createElement('button'); b.id='v51SearchLauncher'; b.className='v51-search-launcher'; b.type='button';
      b.innerHTML='<span>⌕</span><b>Search Entity Network</b><small>⌘ K</small>'; document.body.appendChild(b);
    }
    if(!$('#v51TrustBadge')){
      const badge=document.createElement('div'); badge.id='v51TrustBadge'; badge.className='v51-trust-badge';
      badge.innerHTML=`<i></i><span>Entity network · ${data.index.length} nodes</span><b>v51</b>`; document.body.appendChild(badge);
    }
  }

  function onKey(e){
    if((e.metaKey||e.ctrlKey)&&String(e.key).toLowerCase()==='k'){e.preventDefault();toggle(true);}
    if(e.key==='Escape'&&open)toggle(false);
  }
  function onClick(e){
    if(e.target.closest('#v51SearchLauncher')){toggle(true);return;}
    if(e.target.closest('[data-v51-close]')){toggle(false);return;}
    const target=e.target.closest('[data-v51-target]');
    if(target){navigate(target.dataset.v51Target);toggle(false);e.preventDefault();return;}
  }
  function navigate(target){
    if(!target)return;
    const next=target.startsWith('#')?target:'#'+target;
    if(location.hash===next){window.dispatchEvent(new HashChangeEvent('hashchange'));}
    else location.hash=next;
  }

  function toggle(next){open=typeof next==='boolean'?next:!open;renderOverlay();}
  function searchIndex(q){
    const s=q.trim().toLowerCase(); if(!s)return data.index.slice(0,14);
    return data.index.map(x=>{
      const hay=[x.title,x.subtitle,x.type,x.page,...(x.keywords||[])].join(' ').toLowerCase(); let score=0;
      if(x.title.toLowerCase()===s)score+=120;
      if(x.title.toLowerCase().startsWith(s))score+=75;
      if(x.title.toLowerCase().includes(s))score+=55;
      if(hay.includes(s))score+=30;
      for(const part of s.split(/\s+/))if(part&&hay.includes(part))score+=7;
      return {x,score};
    }).filter(o=>o.score>0).sort((a,b)=>b.score-a.score||a.x.title.localeCompare(b.x.title)).map(o=>o.x).slice(0,18);
  }
  function renderOverlay(){
    let root=$('#v51Overlay'); if(!open){root?.remove();return;}
    if(!root){root=document.createElement('div');root.id='v51Overlay';document.body.appendChild(root);}
    root.className='v51-overlay';
    root.innerHTML=`<div class="v51-backdrop" data-v51-close></div><section class="v51-command"><header><div><small>ENTITY NETWORK · v${VERSION}</small><h2>搜尋 Maydayland</h2></div><button data-v51-close>ESC</button></header><div class="v51-input-wrap"><span>⌕</span><input id="v51SearchInput" autocomplete="off" placeholder="城市、專輯、歌曲、巡演、出版物、年代…" value="${esc(query)}"><kbd>⌘ K</kbd></div><div class="v51-command-body"><aside><small>SOURCE TRUST</small>${data.levels.map(l=>`<div class="v51-level v51-${esc(l.id)}"><b>${esc(l.label)}</b><span>${esc(l.score)}%</span><p>${esc(l.note)}</p></div>`).join('')}<div class="v51-network-stat"><b>${data.index.length}</b><span>indexed entities</span><b>${data.relations.length}</b><span>cross-links</span></div></aside><main id="v51Results">${renderResults(searchIndex(query))}</main></div><footer><span>${esc(data.principle)}</span><b>${data.index.length} nodes · ${data.relations.length} links</b></footer></section>`;
    const input=$('#v51SearchInput',root); input?.focus(); input?.setSelectionRange(query.length,query.length);
    input?.addEventListener('input',e=>{query=e.target.value;const box=$('#v51Results',root);if(box)box.innerHTML=renderResults(searchIndex(query));});
  }
  function renderResults(items){
    if(!items.length)return '<div class="v51-empty"><b>沒有匹配項目</b><span>試試「台北」、「自傳」、「倔強」、「諾亞方舟」或「2011」。</span></div>';
    return `<div class="v51-result-list">${items.map(x=>{const level=data.levels.find(l=>l.id===x.confidence);const source=data.sources.find(s=>s.id===x.sourceId);const count=relationCount(x.id);return `<button class="v51-result" data-v51-target="${esc(x.target)}"><div class="v51-result-icon">${icon(x.type)}</div><div class="v51-result-copy"><small>${esc(x.type.toUpperCase())} · ${esc(x.page)}</small><h3>${esc(x.title)}</h3><p>${esc(x.subtitle)}</p></div><div class="v51-result-trust v51-${esc(x.confidence)}"><b>${esc(level?.label||x.confidence)}</b><span>${count} links · ${esc(source?.name||'source pending')}</span></div><i>↗</i></button>`;}).join('')}</div>`;
  }

  function currentEntity(){
    const h=location.hash||'#home';
    let exact=data.index.find(x=>x.target===h);
    if(exact)return exact;
    const page=h.replace(/^#/,'').split('/')[0]||'home';
    return data.index.find(x=>x.page===page)||null;
  }
  function relationsFor(id){
    return data.relations.filter(r=>r.from===id||r.to===id).map(r=>({rel:r,node:data.index.find(x=>x.id===(r.from===id?r.to:r.from))})).filter(x=>x.node);
  }
  function relationCount(id){return data.relations.filter(r=>r.from===id||r.to===id).length;}
  function renderEntityRail(){
    if(!data)return;
    let rail=$('#v51EntityRail');
    const entity=currentEntity();
    if(!entity){rail?.remove();return;}
    const rels=relationsFor(entity.id).slice(0,6);
    if(!rels.length){rail?.remove();return;}
    if(!rail){rail=document.createElement('aside');rail.id='v51EntityRail';document.body.appendChild(rail);}
    rail.className='v51-entity-rail';
    rail.innerHTML=`<div class="v51-rail-head"><span>${icon(entity.type)}</span><div><small>RELATED ENTITIES</small><b>${esc(entity.title)}</b></div><em>${rels.length} links</em></div><div class="v51-rail-links">${rels.map(({rel,node})=>`<button data-v51-target="${esc(node.target)}"><span>${icon(node.type)}</span><div><small>${esc(rel.label)} · ${esc(node.type)}</small><b>${esc(node.title)}</b></div><i>↗</i></button>`).join('')}</div>`;
  }
  function icon(type){return ({city:'城',album:'CD',song:'♪',tour:'線',publication:'書',timeline:'年'})[type]||'·';}
})();
