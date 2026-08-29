(() => {
  'use strict';
  const VERSION='68.0.0';
  const ROUTE='./data/route-chronology-v64.json?v='+VERSION;
  const PROV='./data/provenance-v68.json?v='+VERSION;
  let route=null, provenance=null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const classMap={organizer:'ORGANIZER',government:'OFFICIAL / GOV',wire:'NEWS WIRE',media:'MEDIA',guide:'LOCAL GUIDE',social:'OFFICIAL SOCIAL'};

  async function boot(){
    [route,provenance]=await Promise.all([
      fetch(ROUTE,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null),
      fetch(PROV,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
    ]);
    if(!route||!provenance)return;
    render();
    const app=document.querySelector('#app');
    if(app)new MutationObserver(()=>requestAnimationFrame(render)).observe(app,{childList:true,subtree:true});
    window.addEventListener('hashchange',()=>requestAnimationFrame(render));
  }

  function sourcePills(city){
    return (city.evidence||[]).map((s,i)=>`<a class="v68-source v68-source--${esc(s.class)}" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><small>${esc(classMap[s.class]||s.class)}</small><b>${esc(s.label)}</b><span>↗</span></a>`).join('');
  }

  function confidenceLabel(v){return v==='high'?'HIGH':v==='medium-high'?'MED-HIGH':'PENDING';}

  function renderHome(){
    const host=document.querySelector('.v60-chronology'); if(!host)return;
    host.querySelector('.v67-launch')?.remove();
    let panel=host.querySelector('.v68-provenance');
    if(panel)return;
    panel=document.createElement('section'); panel.className='v68-provenance'; panel.id='provenance';
    const verified=(provenance.cities||[]).filter(c=>c.status==='verified');
    const pending=(provenance.cities||[]).filter(c=>c.status==='pending');
    panel.innerHTML=`<div class="v68-head"><div><small>V68 · CONTENT PROVENANCE</small><h3>每一段巡演資料，都知道自己從哪裡來</h3><p>把 chronology 的來源從隱藏 JSON 提升成可見的證據層：來源類型、可信度與 pending 原因全部公開，不用猜測補滿資料。</p></div><div class="v68-kpis"><span><b>${provenance.coverage.verifiedEvents}</b> dates</span><span><b>${verified.length}</b> verified cities</span><span><b>${pending.length}</b> pending</span></div></div><div class="v68-grid">${verified.map(city=>`<article class="v68-city"><div class="v68-city-title"><div><small>${esc(city.id).toUpperCase()}</small><b>${esc((route.cities||[]).find(c=>c.id===city.id)?.name||city.id)}</b></div><span class="v68-confidence">${confidenceLabel(city.confidence)}</span></div><div class="v68-sources">${sourcePills(city)}</div></article>`).join('')}</div><div class="v68-pending"><div><small>PENDING POLICY</small><b>廈門 / 東京仍不發布逐場 chronology</b><p>只有在可與 5525 巡演明確對應、並能交叉核實逐場日期後才會進入 verified route。</p></div>${pending.map(c=>`<span><b>${esc(c.id.toUpperCase())}</b>${esc(c.reason)}</span>`).join('')}</div>`;
    host.append(panel);
  }

  function renderCity(){
    const bits=location.hash.replace('#','').split('/'); if(bits[0]!=='city')return;
    const id=bits[1]||'taipei';
    const city=(provenance.cities||[]).find(c=>c.id===id); if(!city)return;
    const main=document.querySelector('.v45-city-main'); if(!main||main.querySelector('.v68-city-provenance'))return;
    const routeCity=(route.cities||[]).find(c=>c.id===id);
    const panel=document.createElement('section'); panel.className='v68-city-provenance';
    if(city.status==='verified'){
      panel.innerHTML=`<div class="v68-city-prov-head"><div><small>V68 · EVIDENCE LEDGER</small><h3>${esc(routeCity?.name||id)} · ${confidenceLabel(city.confidence)} CONFIDENCE</h3><p>${routeCity?.events?.length||0} 個已核實日期 · ${city.evidence?.length||0} 個公開來源</p></div><span>VERIFIED</span></div><div class="v68-sources v68-sources--city">${sourcePills(city)}</div><p class="v68-policy">來源等級描述 provenance 強度，不代表單一來源絕對正確；日期只有在現有 route dataset 已有交叉證據時才發布。</p>`;
    }else{
      panel.innerHTML=`<div class="v68-city-prov-head"><div><small>V68 · EVIDENCE LEDGER</small><h3>${esc(id.toUpperCase())} · PENDING</h3><p>${esc(city.reason)}</p></div><span class="is-pending">PENDING</span></div>`;
    }
    const anchor=main.querySelector('.v60-city-chronology')||main.querySelector('.v59-matrix')||main.querySelector('.v58-density');
    if(anchor)anchor.insertAdjacentElement('afterend',panel); else main.append(panel);
  }

  function stamp(){
    const live=document.querySelector('.v45-live b'); if(live)live.textContent='v68 LIVE';
    const foot=document.querySelector('.v45-footer'); if(foot)foot.textContent='Maydayland v68 · Content Provenance · next: v69 evidence expansion + release consistency QA';
    const brand=document.querySelector('.v45-brand small'); if(brand)brand.textContent='PRODUCT SYSTEM · v68.0.0';
  }

  function render(){renderHome();renderCity();stamp();}
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0));
})();