(() => {
  'use strict';
  const VERSION='69.0.0';
  const ROUTE='./data/route-chronology-v69.json?v='+VERSION;
  const PROV='./data/provenance-v69.json?v='+VERSION;
  let route=null, provenance=null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const classMap={organizer:'ORGANIZER',government:'OFFICIAL / GOV',wire:'NEWS WIRE',media:'MEDIA',guide:'LOCAL GUIDE',social:'OFFICIAL SOCIAL'};
  const confidence=v=>v==='high'?'HIGH':v==='medium-high'?'MED-HIGH':'PENDING';

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
    return (city.evidence||[]).map(s=>`<a class="v69-source v69-source--${esc(s.class)}" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><small>${esc(classMap[s.class]||s.class)}</small><b>${esc(s.label)}</b><span>↗</span></a>`).join('');
  }

  function removeLegacy(){
    document.querySelectorAll('.v68-provenance,.v68-city-provenance').forEach(el=>el.remove());
  }

  function renderHome(){
    const host=document.querySelector('.v60-chronology'); if(!host)return;
    if(host.querySelector('.v69-release'))return;
    const verified=(provenance.cities||[]).filter(c=>c.status==='verified');
    const pending=(provenance.cities||[]).filter(c=>c.status==='pending');
    const panel=document.createElement('section'); panel.className='v69-release'; panel.id='provenance';
    panel.innerHTML=`<div class="v69-head"><div><small>V69 · EVIDENCE CLOSURE + RELEASE CONSISTENCY</small><h3>廈門已轉為 verified，首頁、City Dossier、Atlas 使用同一份 chronology</h3><p>2025/10/24、10/25、10/26 三場已由相信音樂官方資訊與廈門活動資訊交叉核實。東京仍保持 pending，不以推測補資料。</p></div><div class="v69-kpis"><span><b>${provenance.coverage.verifiedEvents}</b> dates</span><span><b>${verified.length}</b> cities</span><span><b>${route.coverage.geometrySegments}</b> route segments</span><span><b>${pending.length}</b> pending</span></div></div><div class="v69-city-strip">${verified.map(city=>{const rc=(route.cities||[]).find(c=>c.id===city.id);return `<article class="v69-city ${city.id==='xiamen'?'is-new':''}"><div><small>${esc(city.id).toUpperCase()}</small><b>${esc(rc?.name||city.id)}</b><em>${rc?.events?.length||0} dates · ${confidence(city.confidence)}</em></div>${city.id==='xiamen'?'<span>NEW VERIFIED</span>':''}<div class="v69-sources">${sourcePills(city)}</div></article>`}).join('')}</div><div class="v69-pending"><div><small>ONLY REMAINING PENDING CITY</small><b>東京 / TOKYO</b><p>${esc(pending[0]?.reason||'仍待可交叉核實的 5525 逐場資料。')}</p></div><a href="./atlas-v69.html">OPEN 58-DATE SYNCHRONIZED ATLAS →</a></div>`;
    host.append(panel);
  }

  function renderCity(){
    const bits=location.hash.replace('#','').split('/'); if(bits[0]!=='city')return;
    const id=bits[1]||'taipei';
    const city=(provenance.cities||[]).find(c=>c.id===id); if(!city)return;
    const main=document.querySelector('.v45-city-main'); if(!main||main.querySelector('.v69-city-prov'))return;
    const rc=(route.cities||[]).find(c=>c.id===id);
    const panel=document.createElement('section'); panel.className='v69-city-prov';
    if(city.status==='verified'){
      panel.innerHTML=`<div class="v69-city-head"><div><small>V69 · EVIDENCE LEDGER</small><h3>${esc(rc?.name||id)} · ${confidence(city.confidence)} CONFIDENCE</h3><p>${rc?.events?.length||0} 個已核實日期 · ${city.evidence?.length||0} 個公開來源 · 與 Atlas chronology 同步</p></div><span>${id==='xiamen'?'NEW VERIFIED':'VERIFIED'}</span></div><div class="v69-sources">${sourcePills(city)}</div>`;
    } else {
      panel.innerHTML=`<div class="v69-city-head"><div><small>V69 · EVIDENCE LEDGER</small><h3>${esc(id.toUpperCase())} · PENDING</h3><p>${esc(city.reason)}</p></div><span class="is-pending">PENDING</span></div>`;
    }
    const anchor=main.querySelector('.v60-city-chronology')||main.querySelector('.v59-matrix')||main.querySelector('.v58-density');
    if(anchor)anchor.insertAdjacentElement('afterend',panel); else main.append(panel);
  }

  function patchLinks(){
    document.querySelectorAll('a[href*="atlas-v6"]').forEach(a=>a.setAttribute('href','./atlas-v69.html'));
  }

  function stamp(){
    const live=document.querySelector('.v45-live b'); if(live)live.textContent='v69 LIVE';
    const foot=document.querySelector('.v45-footer'); if(foot)foot.textContent='Maydayland v69 · 58 verified dates · 9 cities · next: v70 final release integrity';
    const brand=document.querySelector('.v45-brand small'); if(brand)brand.textContent='PRODUCT SYSTEM · v69.0.0';
  }

  function render(){removeLegacy();renderHome();renderCity();patchLinks();stamp();}
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0));
})();