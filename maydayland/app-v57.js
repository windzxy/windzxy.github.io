(() => {
  'use strict';
  const VERSION='57.0.0';
  const DATA_URL='./data/media-evidence-v57.json?v=57.0.0';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let data=null,open=false,selected='';
  document.addEventListener('DOMContentLoaded',init);
  async function init(){
    data=await fetch(DATA_URL,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!data)return;
    decorate();render();
    window.addEventListener('hashchange',()=>requestAnimationFrame(()=>{decorate();render();}));
    new MutationObserver(()=>requestAnimationFrame(decorate)).observe(document.body,{subtree:true,childList:true});
  }
  function currentPage(){return (location.hash||'#home').replace(/^#/,'').split('/')[0]||'home';}
  function registryAsset(id){return data.assets.find(a=>a.assetId===id);}
  function currentAssets(){
    const cards=$$('.v52-media-card[data-asset-id]');
    const ids=[...new Set(cards.map(c=>c.dataset.assetId).filter(Boolean))];
    const arr=ids.map(registryAsset).filter(Boolean);
    return arr.length?arr:data.assets;
  }
  function decorate(){
    $$('.v52-media-card[data-asset-id]').forEach(card=>{
      const ev=registryAsset(card.dataset.assetId); if(!ev)return;
      card.dataset.evidence=ev.evidenceLevel;
      let badge=$('.v57-evidence-chip',card);
      if(!badge){badge=document.createElement('button');badge.type='button';badge.className='v57-evidence-chip';$('.v52-media-copy',card)?.appendChild(badge);}
      badge.textContent=`${ev.evidenceLevel} · evidence`;
      badge.title=ev.note;
      badge.onclick=e=>{e.stopPropagation();selected=ev.assetId;open=true;render();};
    });
  }
  function render(){
    const assets=currentAssets();
    const chosen=registryAsset(selected)||assets[0];
    let root=$('#v57Evidence');if(!root){root=document.createElement('aside');root.id='v57Evidence';document.body.appendChild(root);}
    const e3=data.assets.filter(a=>a.evidenceLevel==='E3').length;
    root.innerHTML=`<button id="v57Badge" class="v57-badge"><span>MEDIA EVIDENCE · v${VERSION}</span><b>${data.summary.editorialCoveragePercent}% editorial evidence</b></button><section class="v57-panel ${open?'is-open':''}"><header><div><small>PROVENANCE ≠ FILE INTEGRITY</small><h3>Media evidence registry</h3></div><button id="v57Close" aria-label="Close">×</button></header><div class="v57-summary"><div><b>${data.assets.length}</b><span>assets</span></div><div><b>${e3}</b><span>E3 local original</span></div><div><b>${data.summary.externalReusableAssets}</b><span>external reusable</span></div><div><b>${data.summary.editorialCoveragePercent}%</b><span>evidence coverage</span></div></div><p class="v57-policy">${esc(data.policy.externalMediaRule)}</p><div class="v57-list">${assets.map(a=>`<button data-id="${esc(a.assetId)}" class="${chosen?.assetId===a.assetId?'is-active':''}"><i>${esc(a.evidenceLevel)}</i><span>${esc(a.assetId.replace(/^media-/,''))}</span><em>${esc(a.reviewStatus)}</em></button>`).join('')}</div>${chosen?detail(chosen):''}</section>`;
    $('#v57Badge',root)?.addEventListener('click',()=>{open=!open;render();});
    $('#v57Close',root)?.addEventListener('click',()=>{open=false;render();});
    $$('.v57-list button',root).forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.id;render();}));
  }
  function detail(a){return `<div class="v57-detail"><small>EDITORIAL EVIDENCE</small><h4>${esc(a.assetId)}</h4><div><span>${esc(a.evidenceLevel)}</span><span>${esc(a.ownershipBasis)}</span><span>${esc(a.reviewedAt)}</span></div><p><b>${esc(a.creator)}</b> · ${esc(a.createdFor)}<br>${esc(a.note)}<br><code>${esc(a.technicalRegistry)}</code></p></div>`;}
})();