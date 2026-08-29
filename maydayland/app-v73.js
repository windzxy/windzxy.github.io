(() => {
  'use strict';
  const V='73.0.0';
  const ROUTE='./data/route-chronology-v69.json';
  const PROV='./data/provenance-v69.json';
  const MANIFEST='./data/release-integrity-v70.json';
  const ATLAS='./atlas-v73.html';
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const classMap={organizer:'ORGANIZER',government:'OFFICIAL / GOV',wire:'NEWS WIRE',media:'MEDIA',guide:'LOCAL GUIDE',social:'OFFICIAL SOCIAL'};
  const confidence=v=>v==='high'?'HIGH':v==='medium-high'?'MED-HIGH':'PENDING';
  const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  const reduced=matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
  const saveData=conn?.saveData===true;
  const memory=Number(navigator.deviceMemory||0), cores=Number(navigator.hardwareConcurrency||0);
  const slowNet=/^(slow-2g|2g)$/.test(conn?.effectiveType||'');
  const constrained=saveData||slowNet||(memory>0&&memory<=4)||(cores>0&&cores<=4);
  const profile=constrained?'lite':reduced?'calm':'full';
  document.documentElement.dataset.v72Profile=profile;
  document.documentElement.dataset.maydaylandBundle='v73';
  let route=null, provenance=null, manifest=null;

  async function json(url){try{const r=await fetch(url+'?v='+V,{cache:'no-store'});return r.ok?await r.json():null}catch{return null}}
  async function text(url){try{const r=await fetch(url+'?verify='+Date.now(),{cache:'no-store'});return {ok:r.ok,body:r.ok?await r.text():''}}catch{return {ok:false,body:''}}}
  async function exists(url){try{const r=await fetch(url+'?v='+V,{cache:'no-store'});return r.ok}catch{return false}}
  function sourcePills(city){return (city.evidence||[]).map(s=>`<a class="v69-source v69-source--${esc(s.class)}" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><small>${esc(classMap[s.class]||s.class)}</small><b>${esc(s.label)}</b><span>↗</span></a>`).join('')}
  function row(label,ok,detail){return `<li class="${ok?'is-pass':'is-warn'}"><span>${ok?'PASS':'WARN'}</span><b>${esc(label)}</b><em>${esc(detail)}</em></li>`}

  function removeSuperseded(){document.querySelectorAll('.v68-provenance,.v68-city-provenance,.v69-release,.v70-integrity,.v71-live-qa,.v72-load-polish,.v73-bundle-audit').forEach(el=>el.remove())}

  function renderEvidence(){
    const host=document.querySelector('.v60-chronology'); if(!host||!route||!provenance)return null;
    const verified=(provenance.cities||[]).filter(c=>c.status==='verified');
    const pending=(provenance.cities||[]).filter(c=>c.status==='pending');
    const panel=document.createElement('section'); panel.className='v69-release'; panel.id='provenance';
    panel.innerHTML=`<div class="v69-head"><div><small>V73 · VERIFIED TOUR EVIDENCE</small><h3>58 個已核實日期，9 個 verified 城市</h3><p>首頁、City Dossier 與 Atlas 共用同一份 chronology / provenance。東京仍維持 evidence gate，不以推測補日期。</p></div><div class="v69-kpis"><span><b>${provenance.coverage.verifiedEvents}</b> dates</span><span><b>${verified.length}</b> cities</span><span><b>${route.coverage.geometrySegments}</b> route segments</span><span><b>${pending.length}</b> pending</span></div></div><div class="v69-city-strip">${verified.map(city=>{const rc=(route.cities||[]).find(c=>c.id===city.id);return `<article class="v69-city ${city.id==='xiamen'?'is-new':''}"><div><small>${esc(city.id).toUpperCase()}</small><b>${esc(rc?.name||city.id)}</b><em>${rc?.events?.length||0} dates · ${confidence(city.confidence)}</em></div>${city.id==='xiamen'?'<span>VERIFIED</span>':''}<div class="v69-sources">${sourcePills(city)}</div></article>`}).join('')}</div><div class="v69-pending"><div><small>EVIDENCE GATE</small><b>東京 / TOKYO</b><p>${esc(pending[0]?.reason||'仍待可交叉核實的 5525 逐場資料。')}</p></div><a href="${ATLAS}">OPEN SYNCHRONIZED ATLAS →</a></div>`;
    host.append(panel); return panel;
  }

  function renderCity(){
    const bits=location.hash.replace('#','').split('/'); if(bits[0]!=='city'||!route||!provenance)return;
    const id=bits[1]||'taipei', city=(provenance.cities||[]).find(c=>c.id===id); if(!city)return;
    const main=document.querySelector('.v45-city-main'); if(!main)return;
    main.querySelectorAll('.v68-city-provenance,.v69-city-prov').forEach(el=>el.remove());
    const rc=(route.cities||[]).find(c=>c.id===id), panel=document.createElement('section'); panel.className='v69-city-prov';
    if(city.status==='verified') panel.innerHTML=`<div class="v69-city-head"><div><small>V73 · EVIDENCE LEDGER</small><h3>${esc(rc?.name||id)} · ${confidence(city.confidence)} CONFIDENCE</h3><p>${rc?.events?.length||0} 個已核實日期 · ${city.evidence?.length||0} 個公開來源 · 與 Atlas chronology 同步</p></div><span>VERIFIED</span></div><div class="v69-sources">${sourcePills(city)}</div>`;
    else panel.innerHTML=`<div class="v69-city-head"><div><small>V73 · EVIDENCE LEDGER</small><h3>${esc(id.toUpperCase())} · PENDING</h3><p>${esc(city.reason)}</p></div><span class="is-pending">PENDING</span></div>`;
    const anchor=main.querySelector('.v60-city-chronology')||main.querySelector('.v59-matrix')||main.querySelector('.v58-density');
    if(anchor)anchor.insertAdjacentElement('afterend',panel); else main.append(panel);
  }

  async function renderIntegrity(host){
    if(!host||!manifest||!route||!provenance)return null;
    const checks=[], eventCount=(route.cities||[]).reduce((n,c)=>n+(c.events?.length||0),0);
    const verified=(provenance.cities||[]).filter(c=>c.status==='verified'), pending=(provenance.cities||[]).filter(c=>c.status==='pending');
    checks.push(['Chronology totals',eventCount===manifest.dataset.expectedEvents&&route.cities?.length===manifest.dataset.expectedVerifiedCities,`${eventCount}/${manifest.dataset.expectedEvents} dates · ${route.cities?.length||0}/${manifest.dataset.expectedVerifiedCities} cities`]);
    checks.push(['Provenance totals',verified.length===manifest.dataset.expectedVerifiedCities&&pending.length===manifest.dataset.expectedPendingCities,`${verified.length} verified · ${pending.length} pending`]);
    const routeIds=new Set((route.cities||[]).map(c=>c.id)); checks.push(['Cross-surface city IDs',verified.every(c=>routeIds.has(c.id))&&routeIds.size===verified.length,'chronology ↔ provenance']);
    checks.push(['Tokyo evidence gate',pending.some(c=>c.id==='tokyo'),`pending: ${pending.map(c=>c.id).join(', ')||'none'}`]);
    const core=[ROUTE,PROV,ATLAS,'./app-v73.css','./app-v73.js']; const assetState=await Promise.all(core.map(exists));
    checks.push(['Production assets',assetState.every(Boolean),`${assetState.filter(Boolean).length}/${assetState.length} reachable`]);
    const all=checks.every(c=>c[1]), el=document.createElement('section'); el.className='v70-integrity';
    el.innerHTML=`<div class="v70-title"><div><small>V73 · RELEASE INTEGRITY</small><h3>資料、Atlas 與 production bundle 自檢</h3><p>v73 不再依賴 v68–v72 五組獨立首頁 runtime；核心 release 層已合併成單一 production bundle。</p></div><strong class="${all?'is-pass':'is-warn'}">${all?'INTEGRITY PASS':'REVIEW NEEDED'}</strong></div><ul>${checks.map(c=>row(...c)).join('')}</ul><div class="v70-actions"><a href="${ATLAS}">OPEN V73 ATLAS →</a><span>58 dates · 9 cities · 8 segments · Tokyo pending</span></div>`;
    host.append(el); return el;
  }

  function optimizeMedia(){
    const vh=innerHeight||800;
    document.querySelectorAll('img').forEach((img,i)=>{if(i>2||img.getBoundingClientRect().top>vh*1.25)img.loading='lazy';img.decoding='async';img.fetchPriority=i<2?'high':'low'});
    if(constrained)document.querySelectorAll('video').forEach(v=>{v.preload='metadata';if(v.autoplay){v.autoplay=false;try{v.pause()}catch{}}});
  }
  function prefetchAtlas(){if(constrained||saveData)return;const run=()=>{if(document.querySelector('link[data-v73-prefetch]'))return;const l=document.createElement('link');l.rel='prefetch';l.href=ATLAS;l.as='document';l.dataset.v73Prefetch='1';document.head.append(l)};'requestIdleCallback'in window?requestIdleCallback(run,{timeout:3500}):setTimeout(run,1800)}
  function metrics(){const nav=performance.getEntriesByType?.('navigation')?.[0],res=performance.getEntriesByType?.('resource')||[];return {dom:nav?Math.round(nav.domContentLoadedEventEnd):0,load:nav?Math.round(nav.loadEventEnd):0,css:res.filter(r=>/\.css(?:\?|$)/.test(r.name)).length,js:res.filter(r=>/\.js(?:\?|$)/.test(r.name)).length}}
  function renderLoad(host){if(!host)return null;const m=metrics(),el=document.createElement('section');el.className='v72-load-polish';el.innerHTML=`<div class="v72-head"><div><small>V73 · ADAPTIVE DELIVERY</small><h3>Production delivery profile</h3><p>保留 v72 的裝置能力、Save-Data、網路與 Reduced Motion guard，同時把近五版首頁 release runtime 收斂為單一 bundle。</p></div><strong>${profile.toUpperCase()}</strong></div><div class="v72-grid"><div><small>PROFILE</small><b>${profile.toUpperCase()}</b><em>${constrained?'低負載策略啟用':'完整體驗'}</em></div><div><small>RUNTIME REQUESTS</small><b>${m.css} CSS · ${m.js} JS</b><em>v73 合併 v69–v72 release layer</em></div><div><small>BROWSER TIMING</small><b>${m.dom||'--'} ms DOM</b><em>${m.load?`${m.load} ms load`:'等待 load sample'}</em></div></div><div class="v72-meta"><span>v${V} · lazy decode · idle Atlas prefetch · constrained-device guard</span><a href="${ATLAS}">OPEN v73 ATLAS →</a></div>`;host.append(el);return el}

  async function renderBundleAudit(host){
    if(!host)return; const [home,atlas]=await Promise.all([text('./index.html'),text(ATLAS)]), m=metrics();
    const homeOk=home.ok&&/Asset Consolidation v73/.test(home.body), atlasOk=atlas.ok&&/Production Runtime Audit v73/.test(atlas.body);
    const localCss=m.css, localJs=m.js, all=homeOk&&atlasOk&&localCss<=19&&localJs<=20;
    const el=document.createElement('section'); el.className='v73-bundle-audit'+(all?'':' is-warn');
    el.innerHTML=`<div class="v73-bundle-head"><div><small>V73 · ASSET CONSOLIDATION</small><h3>Release layers consolidated</h3><p>移除首頁 v68–v72 的獨立 CSS/JS 請求，以 app-v73.css / app-v73.js 接管現有 evidence、integrity、adaptive delivery 與 live release audit。</p></div><strong>${all?'BUNDLE PASS':'AUDIT ACTIVE'}</strong></div><div class="v73-bundle-grid"><div><small>HOME MARKER</small><b>${homeOk?'v73 PASS':'CHECK'}</b></div><div><small>ATLAS MARKER</small><b>${atlasOk?'v73 PASS':'CHECK'}</b></div><div><small>REQUEST BUDGET</small><b>${localCss} CSS · ${localJs} JS</b></div></div><div class="v73-bundle-meta">Target budget: ≤19 CSS / ≤20 JS on home · obsolete v68 runtime removed · Tokyo evidence gate retained.</div>`;
    host.append(el);
  }

  function stamp(){
    document.querySelectorAll('a[href*="atlas-v69.html"],a[href*="atlas-v70.html"],a[href*="atlas-v71.html"],a[href*="atlas-v72.html"]').forEach(a=>a.setAttribute('href',ATLAS));
    const live=document.querySelector('.v45-live b');if(live)live.textContent='v73 LIVE';
    const brand=document.querySelector('.v45-brand small');if(brand)brand.textContent='PRODUCT SYSTEM · v73.0.0';
    const foot=document.querySelector('.v45-footer');if(foot)foot.textContent='Maydayland v73 · consolidated production bundle · runtime audit';
  }

  async function render(){removeSuperseded();const evidence=renderEvidence();renderCity();const integrity=await renderIntegrity(evidence);const load=renderLoad(integrity||evidence);await renderBundleAudit(load||integrity||evidence);stamp()}
  async function boot(){[route,provenance,manifest]=await Promise.all([json(ROUTE),json(PROV),json(MANIFEST)]);if(!route||!provenance)return;optimizeMedia();await render();prefetchAtlas();const app=document.querySelector('#app');if(app)new MutationObserver(()=>{if(location.hash.startsWith('#city/'))requestAnimationFrame(renderCity)}).observe(app,{childList:true,subtree:true});addEventListener('hashchange',()=>requestAnimationFrame(renderCity))}
  addEventListener('load',()=>setTimeout(()=>{optimizeMedia();renderLoad(document.querySelector('.v70-integrity'));},220),{once:true});
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,60));
})();