(() => {
  'use strict';
  const V='70.0.0';
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  async function json(url){try{const r=await fetch(url+'?v='+V,{cache:'no-store'});return r.ok?await r.json():null}catch{return null}}
  async function exists(url){try{const r=await fetch(url+'?v='+V,{cache:'no-store'});return r.ok}catch{return false}}
  function row(label,ok,detail){return `<li class="${ok?'is-pass':'is-warn'}"><span>${ok?'PASS':'WARN'}</span><b>${esc(label)}</b><em>${esc(detail)}</em></li>`}
  async function audit(){
    const manifest=await json('./data/release-integrity-v70.json');
    if(!manifest)return;
    const [route,prov]=await Promise.all([json(manifest.dataset.route),json(manifest.dataset.provenance)]);
    const checks=[];
    const eventCount=(route?.cities||[]).reduce((n,c)=>n+(c.events?.length||0),0);
    const verified=(prov?.cities||[]).filter(c=>c.status==='verified');
    const pending=(prov?.cities||[]).filter(c=>c.status==='pending');
    checks.push(['Chronology totals',!!route&&eventCount===manifest.dataset.expectedEvents&&route.cities?.length===manifest.dataset.expectedVerifiedCities,`${eventCount}/${manifest.dataset.expectedEvents} dates · ${route?.cities?.length||0}/${manifest.dataset.expectedVerifiedCities} cities`]);
    checks.push(['Provenance totals',!!prov&&verified.length===manifest.dataset.expectedVerifiedCities&&pending.length===manifest.dataset.expectedPendingCities,`${verified.length} verified · ${pending.length} pending`]);
    const routeIds=new Set((route?.cities||[]).map(c=>c.id));
    checks.push(['Cross-surface city IDs',verified.every(c=>routeIds.has(c.id))&&routeIds.size===verified.length,'chronology ↔ provenance']);
    const pendingIds=pending.map(c=>c.id);
    checks.push(['Pending evidence gate',manifest.dataset.requiredPending.every(id=>pendingIds.includes(id)),`pending: ${pendingIds.join(', ')||'none'}`]);
    const assets=[manifest.surfaces.atlas,...manifest.coreAssets];
    const assetState=await Promise.all(assets.map(exists));
    checks.push(['Release assets',assetState.every(Boolean),`${assetState.filter(Boolean).length}/${assetState.length} reachable`]);
    const allPass=checks.every(c=>c[1]);
    render(manifest,checks,allPass);
  }
  function render(m,checks,allPass){
    const host=document.querySelector('.v69-release')||document.querySelector('.v60-chronology');
    if(!host||document.querySelector('.v70-integrity'))return;
    const el=document.createElement('section');el.className='v70-integrity';
    el.innerHTML=`<div class="v70-title"><div><small>V70 · FINAL RELEASE INTEGRITY</small><h3>跨頁資料與核心資產自檢</h3><p>以 immutable manifest 驗證 chronology、provenance、Atlas 與 pending policy；東京仍維持 evidence gate，不以推測日期補齊。</p></div><strong class="${allPass?'is-pass':'is-warn'}">${allPass?'INTEGRITY PASS':'REVIEW NEEDED'}</strong></div><ul>${checks.map(c=>row(...c)).join('')}</ul><div class="v70-actions"><a href="./atlas-v70.html">OPEN V70 ATLAS →</a><span>58 verified dates · 9 cities · 8 segments · 1 pending</span></div>`;
    host.append(el);
    const live=document.querySelector('.v45-live b');if(live)live.textContent='v70 LIVE';
    const foot=document.querySelector('.v45-footer');if(foot)foot.textContent='Maydayland v70 · final release integrity · Tokyo evidence gate remains open';
    const brand=document.querySelector('.v45-brand small');if(brand)brand.textContent='PRODUCT SYSTEM · v70.0.0';
    document.querySelectorAll('a[href*="atlas-v69.html"]').forEach(a=>a.href='./atlas-v70.html');
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(audit,0));
})();