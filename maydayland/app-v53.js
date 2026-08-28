(() => {
  'use strict';
  const VERSION='53.0.0';
  const DATA_URL='./data/media-registry-v53.json?v=53.0.0';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let registry=null, open=false, selected=null;

  document.addEventListener('DOMContentLoaded',init);
  async function init(){
    registry=await fetch(DATA_URL,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!registry)return;
    window.addEventListener('hashchange',()=>{decorate();render();});
    new MutationObserver(()=>requestAnimationFrame(()=>{decorate();renderBadge();})).observe(document.body,{subtree:true,childList:true});
    decorate(); render();
  }

  function currentPage(){return (location.hash||'#home').replace(/^#/,'').split('/')[0]||'home';}
  function pageAssets(){return registry.assets.filter(a=>a.page===currentPage());}

  function decorate(){
    $$('.v52-media-card').forEach(card=>{
      const title=$('.v52-media-copy b',card)?.textContent?.trim();
      const asset=registry.assets.find(a=>a.title===title);
      if(!asset || card.dataset.v53==='1')return;
      card.dataset.v53='1';
      card.dataset.assetId=asset.assetId;
      const rights=$('.v52-rights',card);
      if(rights){rights.textContent='REGISTRY · '+asset.rights.toUpperCase();rights.title=`${asset.width}×${asset.height} · ${asset.sourceType}`;}
      const meta=document.createElement('button');
      meta.className='v53-meta-btn';
      meta.type='button';
      meta.textContent=`${asset.width}×${asset.height} · ${asset.aspectRatio}`;
      meta.addEventListener('click',e=>{e.stopPropagation();selected=asset.assetId;open=true;render();});
      $('.v52-media-copy',card)?.appendChild(meta);
      const thumb=$('.v52-media-thumb',card);
      if(thumb){thumb.setAttribute('role','img');thumb.setAttribute('aria-label',asset.alt||asset.title);}
    });
  }

  function renderBadge(){
    const badge=$('#v53RegistryBadge');
    if(!badge)return;
    const p=pageAssets();
    badge.querySelector('b').textContent=`${p.length} media assets`;
  }

  function render(){
    let root=$('#v53Registry');
    if(!root){root=document.createElement('aside');root.id='v53Registry';document.body.appendChild(root);}
    const p=pageAssets();
    const asset=registry.assets.find(a=>a.assetId===selected)||p[0]||registry.assets[0];
    root.innerHTML=`
      <button id="v53RegistryBadge" class="v53-registry-badge" aria-expanded="${open}">
        <span>MEDIA REGISTRY · v${VERSION}</span><b>${p.length} media assets</b>
      </button>
      <section class="v53-registry-panel ${open?'is-open':''}" aria-hidden="${!open}">
        <div class="v53-registry-head"><div><small>MEDIA SOURCE REGISTRY</small><h3>Rights & provenance</h3></div><button id="v53Close" aria-label="Close">×</button></div>
        <div class="v53-registry-stats">
          <div><b>${registry.summary.assets}</b><span>assets</span></div>
          <div><b>${registry.summary.generatedSafe}</b><span>generated-safe</span></div>
          <div><b>${registry.summary.verifiedLocal}</b><span>verified-local</span></div>
        </div>
        <div class="v53-registry-list">${(p.length?p:registry.assets.slice(0,4)).map(a=>`<button class="v53-asset-row ${asset?.assetId===a.assetId?'is-active':''}" data-id="${esc(a.assetId)}"><span>${esc(a.kind)}</span><b>${esc(a.title)}</b><em>${esc(a.rights)}</em></button>`).join('')}</div>
        ${asset?detail(asset):''}
      </section>`;
    $('#v53RegistryBadge',root)?.addEventListener('click',()=>{open=!open;render();});
    $('#v53Close',root)?.addEventListener('click',()=>{open=false;render();});
    $$('.v53-asset-row',root).forEach(btn=>btn.addEventListener('click',()=>{selected=btn.dataset.id;render();}));
  }

  function detail(a){
    const source=a.sourceUrl?`<a href="${esc(a.sourceUrl)}" target="_blank" rel="noopener">source</a>`:'<span class="v53-none">no external source</span>';
    return `<div class="v53-asset-detail"><small>SELECTED ASSET</small><h4>${esc(a.title)}</h4><dl>
      <div><dt>ID</dt><dd>${esc(a.assetId)}</dd></div>
      <div><dt>Entity</dt><dd>${esc(a.entity)}</dd></div>
      <div><dt>Rights</dt><dd>${esc(a.rights)}</dd></div>
      <div><dt>Source</dt><dd>${esc(a.sourceType)}</dd></div>
      <div><dt>Resolution</dt><dd>${a.width} × ${a.height}</dd></div>
      <div><dt>Aspect</dt><dd>${esc(a.aspectRatio)}</dd></div>
      <div><dt>Local path</dt><dd>${a.localPath?esc(a.localPath):'generated at runtime'}</dd></div>
      <div><dt>Reference</dt><dd>${source}</dd></div>
    </dl><p>${esc(a.alt)}</p></div>`;
  }
})();