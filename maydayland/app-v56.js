(() => {
  'use strict';
  const VERSION='56.0.0';
  const DATA_URL='./data/media-registry-v56.json?v=56.0.0';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let registry=null, checks=new Map(), open=false, selected='';

  document.addEventListener('DOMContentLoaded',init);
  async function init(){
    registry=await fetch(DATA_URL,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!registry)return;
    await verifyAll();
    decorate(); render();
    $('#v55Pipeline')?.remove();
    window.addEventListener('hashchange',()=>requestAnimationFrame(()=>{decorate();render();}));
    new MutationObserver(()=>requestAnimationFrame(()=>{decorate();$('#v55Pipeline')?.remove();})).observe(document.body,{subtree:true,childList:true});
  }

  async function digest(buf){
    if(!crypto?.subtle)return 'unsupported';
    const hash=await crypto.subtle.digest('SHA-256',buf);
    return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  async function verifyAsset(a){
    try{
      const res=await fetch(`${a.localPath}?v=${VERSION}`,{cache:'no-store'});
      if(!res.ok)return {ok:false,reason:`HTTP ${res.status}`,hash:''};
      const buf=await res.arrayBuffer();
      const hash=await digest(buf);
      const imgOk=await new Promise(resolve=>{const img=new Image();const timer=setTimeout(()=>resolve(false),5000);img.onload=()=>{clearTimeout(timer);resolve(img.naturalWidth>=960&&img.naturalHeight>=560)};img.onerror=()=>{clearTimeout(timer);resolve(false)};img.src=`${a.localPath}?v=${VERSION}`;});
      return {ok:imgOk,reason:imgOk?'decoded':'decode-or-size-failed',hash,bytes:buf.byteLength};
    }catch(e){return {ok:false,reason:'fetch-failed',hash:''};}
  }
  async function verifyAll(){
    const pairs=await Promise.all(registry.assets.map(async a=>[a.assetId,await verifyAsset(a)]));
    checks=new Map(pairs);
  }
  function duplicates(){
    const groups={};
    registry.assets.forEach(a=>{const h=checks.get(a.assetId)?.hash;if(h&&h!=='unsupported')(groups[h]??=[]).push(a.assetId);});
    return Object.entries(groups).filter(([,ids])=>ids.length>1);
  }
  function state(a){const c=checks.get(a.assetId);return c?.ok?'verified':'failed';}
  function totals(){const ok=registry.assets.filter(a=>checks.get(a.assetId)?.ok).length;return {ok,failed:registry.assets.length-ok,duplicates:duplicates().length,coverage:Math.round(ok/registry.assets.length*100)};}
  function currentPage(){return (location.hash||'#home').replace(/^#/,'').split('/')[0]||'home';}
  function pageAssets(){const p=currentPage(),arr=registry.assets.filter(a=>a.page===p);return arr.length?arr:registry.assets;}

  function decorate(){
    $$('.v52-media-card').forEach(card=>{
      const title=$('.v52-media-copy b',card)?.textContent?.trim();
      const a=registry.assets.find(x=>x.title===title); if(!a)return;
      const c=checks.get(a.assetId),thumb=$('.v52-media-thumb',card),rights=$('.v52-rights',card);
      card.dataset.assetId=a.assetId; card.dataset.v56='1';
      if(c?.ok&&thumb){thumb.style.backgroundImage=`url("${a.localPath}?v=${VERSION}")`;thumb.classList.add('is-ready','v56-verified');}
      if(rights)rights.textContent=c?.ok?'VERIFIED · LOCAL · SHA256':'LOCAL VERIFY FAILED';
      $('.v55-source-chip',card)?.remove();
      let chip=$('.v56-integrity-chip',card);
      if(!chip){chip=document.createElement('button');chip.type='button';chip.className='v56-integrity-chip';$('.v52-media-copy',card)?.appendChild(chip);}
      chip.textContent=c?.ok?`${a.width}×${a.height} · ${c.hash.slice(0,8)}`:'VERIFY FAILED';
      chip.onclick=e=>{e.stopPropagation();selected=a.assetId;open=true;render();};
    });
  }

  function render(){
    const t=totals(), items=pageAssets(), asset=registry.assets.find(a=>a.assetId===selected)||items[0];
    let root=$('#v56Integrity');if(!root){root=document.createElement('aside');root.id='v56Integrity';document.body.appendChild(root);}
    root.innerHTML=`<button class="v56-badge" id="v56Badge"><span>ASSET INTEGRITY · v${VERSION}</span><b>${t.coverage}% verified · ${t.duplicates} duplicates</b></button><section class="v56-panel ${open?'is-open':''}"><header><div><small>LOCAL FILE + SHA-256 + DECODE CHECK</small><h3>Asset integrity coverage</h3></div><button id="v56Close" aria-label="Close">×</button></header><div class="v56-summary"><div><b>${t.ok}</b><span>verified</span></div><div><b>${t.failed}</b><span>failed</span></div><div><b>${t.coverage}%</b><span>coverage</span></div><div><b>${t.duplicates}</b><span>duplicate hashes</span></div></div><div class="v56-list">${items.map(a=>`<button data-id="${esc(a.assetId)}" class="${asset?.assetId===a.assetId?'is-active':''}"><i class="s-${state(a)}"></i><span>${esc(a.title)}</span><em>${state(a)}</em></button>`).join('')}</div>${asset?detail(asset):''}</section>`;
    $('#v56Badge',root)?.addEventListener('click',()=>{open=!open;render();});
    $('#v56Close',root)?.addEventListener('click',()=>{open=false;render();});
    $$('.v56-list button',root).forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.id;render();}));
  }
  function detail(a){const c=checks.get(a.assetId)||{};return `<div class="v56-detail"><small>ASSET FINGERPRINT</small><h4>${esc(a.title)}</h4><div><span>${state(a)}</span><span>${a.width}×${a.height}</span><span>${esc(a.aspectRatio)}</span></div><p><b>${esc(a.assetId)}</b><br>${esc(a.localPath)}<br>SHA-256: <code>${esc(c.hash||'unavailable')}</code><br>${c.bytes?`${c.bytes.toLocaleString()} bytes · `:''}${esc(c.reason||'pending')}</p></div>`;}
})();