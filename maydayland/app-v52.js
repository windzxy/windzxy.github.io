(() => {
  'use strict';
  const VERSION='52.0.0';
  const DATA_URL='./data/media-layer-v52.json?v=52.0.0';
  const $=(s,r=document)=>r.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let data=null,collapsed=false;
  document.addEventListener('DOMContentLoaded',init);
  async function init(){
    data=await fetch(DATA_URL,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!data)return;
    window.addEventListener('hashchange',render);
    new MutationObserver(()=>requestAnimationFrame(render)).observe(document.body,{subtree:true,childList:true});
    render();
  }
  function currentPage(){return (location.hash||'#home').replace(/^#/,'').split('/')[0]||'home';}
  function svg(item){
    const label=esc(item.title).replace(/&/g,'&amp;');
    const sub=esc(item.subtitle).replace(/&/g,'&amp;');
    const tone=item.tone||'#31d7ff';
    const raw=`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="560" viewBox="0 0 960 560"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07101e"/><stop offset=".55" stop-color="${tone}" stop-opacity=".42"/><stop offset="1" stop-color="#02050b"/></linearGradient><radialGradient id="r"><stop stop-color="${tone}" stop-opacity=".5"/><stop offset="1" stop-color="${tone}" stop-opacity="0"/></radialGradient></defs><rect width="960" height="560" fill="url(#g)"/><circle cx="720" cy="130" r="260" fill="url(#r)"/><g fill="none" stroke="${tone}" stroke-opacity=".3"><path d="M0 390 C180 310 320 440 480 350 S760 220 960 320" stroke-width="4"/><path d="M0 430 C220 330 350 480 520 380 S760 260 960 350"/></g><g fill="#fff" opacity=".16"><rect x="74" y="90" width="190" height="190" rx="24"/><rect x="286" y="90" width="72" height="190" rx="24"/><rect x="74" y="300" width="284" height="26" rx="13"/></g><text x="74" y="392" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="40" font-weight="700">${label}</text><text x="74" y="430" fill="#c8d6ea" font-family="Arial,Helvetica,sans-serif" font-size="20">${sub}</text><text x="74" y="500" fill="#8ea8c7" font-family="Arial,Helvetica,sans-serif" font-size="14" letter-spacing="3">MAYDAYLAND · RIGHTS-SAFE GENERATED VISUAL</text></svg>`;
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(raw);
  }
  function render(){
    if(!data)return;
    const page=currentPage();
    const items=data.items.filter(x=>x.page===page).slice(0,4);
    let root=$('#v52MediaDock');
    if(!items.length){root?.remove();return;}
    if(!root){root=document.createElement('aside');root.id='v52MediaDock';document.body.appendChild(root);}
    root.className='v52-media-dock'+(collapsed?' v52-hidden':'');
    root.innerHTML=`<div class="v52-media-shell"><div class="v52-media-head"><div><small>VISUAL & MEDIA LAYER · v${VERSION}</small><b>${pageLabel(page)} · rights-safe media rail</b></div><button id="v52Toggle">${collapsed?'展開':'收起'}</button></div><div class="v52-media-grid">${items.map(x=>`<article class="v52-media-card"><div class="v52-media-thumb v52-lazy" data-src="${esc(svg(x))}"></div><span class="v52-rights">GENERATED · SAFE</span><div class="v52-media-copy"><small>${esc(x.kind)}</small><b>${esc(x.title)}</b><span>${esc(x.subtitle)}</span></div></article>`).join('')}</div></div>`;
    $('#v52Toggle',root)?.addEventListener('click',()=>{collapsed=!collapsed;render();});
    lazyLoad(root);
  }
  function lazyLoad(root){
    const nodes=[...root.querySelectorAll('[data-src]')];
    if(!('IntersectionObserver' in window)){nodes.forEach(load);return;}
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){load(e.target);io.unobserve(e.target);}}),{rootMargin:'120px'});
    nodes.forEach(n=>io.observe(n));
  }
  function load(node){node.style.backgroundImage=`url("${node.dataset.src}")`;node.classList.add('is-ready');}
  function pageLabel(p){return ({city:'City Dossier',album:'Album Room',books:'Books & Publications',timeline:'Timeline / Archive'})[p]||'Maydayland';}
})();