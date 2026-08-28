(() => {
  'use strict';
  const VERSION='55.0.0';
  const DATA_URL='./data/media-registry-v55.json?v=55.0.0';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let registry=null, probes=new Map(), open=false, selected='';

  document.addEventListener('DOMContentLoaded',init);
  async function init(){
    registry=await fetch(DATA_URL,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!registry)return;
    await probeVerified();
    decorate(); render();
    window.addEventListener('hashchange',()=>requestAnimationFrame(()=>{decorate();render();}));
    new MutationObserver(()=>requestAnimationFrame(decorate)).observe(document.body,{subtree:true,childList:true});
  }

  function verified(){return registry.assets.filter(a=>a.rights==='verified-local'&&a.localPath);}
  function probeAsset(a){
    return new Promise(resolve=>{
      const img=new Image();
      const done=(ok,reason='')=>resolve({ok,reason,path:a.localPath});
      const timer=setTimeout(()=>done(false,'timeout'),5000);
      img.onload=()=>{clearTimeout(timer);done(img.naturalWidth>0&&img.naturalHeight>0,img.naturalWidth?`${img.naturalWidth}×${img.naturalHeight}`:'decode-failed');};
      img.onerror=()=>{clearTimeout(timer);done(false,'load-error');};
      img.src=`${a.localPath}?v=${VERSION}`;
    });
  }
  async function probeVerified(){
    const results=await Promise.all(verified().map(async a=>[a.assetId,await probeAsset(a)]));
    probes=new Map(results);
  }

  function decorate(){
    if(!registry)return;
    $$('.v52-media-card').forEach(card=>{
      const title=$('.v52-media-copy b',card)?.textContent?.trim();
      const a=registry.assets.find(x=>x.title===title); if(!a)return;
      card.dataset.assetId=a.assetId;
      card.dataset.v55='1';
      const thumb=$('.v52-media-thumb',card);
      const rights=$('.v52-rights',card);
      const probe=probes.get(a.assetId);
      if(a.rights==='verified-local'&&probe?.ok&&thumb){
        thumb.style.backgroundImage=`url("${a.localPath}?v=${VERSION}")`;
        thumb.classList.add('is-ready','v55-local-ready');
        if(rights)rights.textContent='VERIFIED · LOCAL';
      }else if(a.rights==='verified-local'&&probe&&!probe.ok){
        card.dataset.assetError=probe.reason;
        if(rights)rights.textContent='LOCAL FAILED · FALLBACK';
      }
      let meta=$('.v55-source-chip',card);
      if(!meta){meta=document.createElement('button');meta.className='v55-source-chip';meta.type='button';$('.v52-media-copy',card)?.appendChild(meta);}
      const state=a.rights==='verified-local'?(probe?.ok?'LOCAL OK':'FALLBACK'):'GENERATED';
      meta.textContent=`${state} · ${a.width}×${a.height}`;
      meta.onclick=e=>{e.stopPropagation();selected=a.assetId;open=true;render();};
    });
  }

  function currentPage(){return (location.hash||'#home').replace(/^#/,'').split('/')[0]||'home';}
  function pageAssets(){const p=currentPage(), arr=registry.assets.filter(a=>a.page===p);return arr.length?arr:registry.assets;}
  function state(a){
    if(a.rights!=='verified-local')return 'fallback-ready';
    const p=probes.get(a.assetId); return p?.ok?'verified-local':'load-failed';
  }
  function totals(){
    const out={'verified-local':0,'fallback-ready':0,'load-failed':0};
    registry.assets.forEach(a=>out[state(a)]++); return out;
  }
  function render(){
    if(!registry)return;
    let root=$('#v55Pipeline'); if(!root){root=document.createElement('aside');root.id='v55Pipeline';document.body.appendChild(root);}
    const items=pageAssets(), t=totals(), asset=registry.assets.find(a=>a.assetId===selected)||items[0];
    root.innerHTML=`<button class="v55-badge" id="v55Badge"><span>VERIFIED ASSETS · v${VERSION}</span><b>${t['verified-local']}/${verified().length} local passed</b></button><section class="v55-panel ${open?'is-open':''}"><header><div><small>REAL FILE PROBE + FALLBACK</small><h3>Verified local asset chain</h3></div><button id="v55Close" aria-label="Close">×</button></header><div class="v55-summary"><div><b>${t['verified-local']}</b><span>verified local</span></div><div><b>${t['fallback-ready']}</b><span>generated fallback</span></div><div><b>${t['load-failed']}</b><span>load failed</span></div></div><div class="v55-list">${items.map(a=>`<button data-id="${esc(a.assetId)}" class="${asset?.assetId===a.assetId?'is-active':''}"><i class="s-${state(a)}"></i><span>${esc(a.title)}</span><em>${state(a)}</em></button>`).join('')}</div>${asset?detail(asset):''}</section>`;
    $('#v55Badge',root)?.addEventListener('click',()=>{open=!open;render();});
    $('#v55Close',root)?.addEventListener('click',()=>{open=false;render();});
    $$('.v55-list button',root).forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.id;render();}));
  }
  function detail(a){
    const p=probes.get(a.assetId), s=state(a);
    return `<div class="v55-detail"><small>ASSET EVIDENCE</small><h4>${esc(a.title)}</h4><div><span>${esc(s)}</span><span>${a.width}×${a.height}</span><span>${esc(a.aspectRatio)}</span></div><p><b>${esc(a.assetId)}</b><br>${esc(a.localPath||'runtime generated fallback')}<br>${a.rights==='verified-local'?`Probe: ${esc(p?.reason||'pending')}`:'No local file required yet.'}</p></div>`;
  }
})();