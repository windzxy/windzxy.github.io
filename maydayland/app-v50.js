(() => {
  'use strict';
  const VERSION='50.0.0';
  const DATA_URL='./data/source-registry-v50.json?v=50.0.0';
  let data=null, open=false, query='';
  const $=(s,r=document)=>r.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  document.addEventListener('DOMContentLoaded',init);

  async function init(){
    data=await fetch(DATA_URL,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!data)return;
    injectLauncher();
    document.addEventListener('click',onClick,true);
    document.addEventListener('keydown',onKey,true);
  }

  function injectLauncher(){
    if($('#v50SearchLauncher'))return;
    const b=document.createElement('button');
    b.id='v50SearchLauncher'; b.className='v50-search-launcher'; b.type='button';
    b.innerHTML='<span>⌕</span><b>Search Maydayland</b><small>⌘ K</small>';
    document.body.appendChild(b);
    const trust=document.createElement('div'); trust.id='v50TrustBadge'; trust.className='v50-trust-badge';
    trust.innerHTML='<i></i><span>Source-aware archive</span><b>v50</b>';
    document.body.appendChild(trust);
  }

  function onKey(e){
    if((e.metaKey||e.ctrlKey)&&String(e.key).toLowerCase()==='k'){e.preventDefault();toggle(true);}
    if(e.key==='Escape'&&open){toggle(false);}
  }
  function onClick(e){
    if(e.target.closest('#v50SearchLauncher')){toggle(true);return;}
    if(e.target.closest('[data-v50-close]')){toggle(false);return;}
    const result=e.target.closest('[data-v50-target]');
    if(result){location.hash=result.dataset.v50Target.replace(/^#/,'');toggle(false);return;}
  }

  function toggle(next){open=typeof next==='boolean'?next:!open;renderOverlay();}
  function searchIndex(q){
    const s=q.trim().toLowerCase();
    if(!s)return data.index.slice(0,10);
    return data.index.map(x=>{
      const hay=[x.title,x.subtitle,x.type,x.page,...(x.keywords||[])].join(' ').toLowerCase();
      let score=0;
      if(x.title.toLowerCase()===s)score+=100;
      if(x.title.toLowerCase().includes(s))score+=60;
      if(hay.includes(s))score+=30;
      for(const part of s.split(/\s+/))if(part&&hay.includes(part))score+=8;
      return {x,score};
    }).filter(o=>o.score>0).sort((a,b)=>b.score-a.score).map(o=>o.x).slice(0,12);
  }

  function renderOverlay(){
    let root=$('#v50Overlay');
    if(!open){if(root)root.remove();return;}
    if(!root){root=document.createElement('div');root.id='v50Overlay';document.body.appendChild(root);}
    root.className='v50-overlay';
    root.innerHTML=`<div class="v50-backdrop" data-v50-close></div><section class="v50-command"><header><div><small>GLOBAL KNOWLEDGE GRAPH · v${VERSION}</small><h2>搜尋 Maydayland</h2></div><button data-v50-close>ESC</button></header><div class="v50-input-wrap"><span>⌕</span><input id="v50SearchInput" autocomplete="off" placeholder="搜尋城市、專輯、歌曲、巡演、出版物、年份…" value="${esc(query)}"><kbd>⌘ K</kbd></div><div class="v50-command-body"><aside><small>SOURCE TRUST</small>${data.levels.map(l=>`<div class="v50-level v50-${esc(l.id)}"><b>${esc(l.label)}</b><span>${esc(l.score)}%</span><p>${esc(l.note)}</p></div>`).join('')}</aside><main id="v50Results">${renderResults(searchIndex(query))}</main></div><footer><span>${esc(data.principle)}</span><b>${data.index.length} indexed nodes</b></footer></section>`;
    const input=$('#v50SearchInput',root); input?.focus(); input?.setSelectionRange(query.length,query.length);
    input?.addEventListener('input',e=>{query=e.target.value;const box=$('#v50Results',root);if(box)box.innerHTML=renderResults(searchIndex(query));});
  }

  function renderResults(items){
    if(!items.length)return '<div class="v50-empty"><b>沒有匹配項目</b><span>試試「台北」、「時光機」、「倔強」、「1997」或「巡演」。</span></div>';
    return `<div class="v50-result-list">${items.map(x=>{const level=data.levels.find(l=>l.id===x.confidence);const source=data.sources.find(s=>s.id===x.sourceId);return `<button class="v50-result" data-v50-target="${esc(x.target)}"><div class="v50-result-icon">${icon(x.type)}</div><div class="v50-result-copy"><small>${esc(x.type.toUpperCase())} · ${esc(x.page)}</small><h3>${esc(x.title)}</h3><p>${esc(x.subtitle)}</p></div><div class="v50-result-trust v50-${esc(x.confidence)}"><b>${esc(level?.label||x.confidence)}</b><span>${esc(source?.name||'source pending')}</span></div><i>↗</i></button>`;}).join('')}</div>`;
  }
  function icon(type){return ({city:'城',album:'CD',song:'♪',tour:'線',publication:'書',timeline:'年'})[type]||'·';}
})();
