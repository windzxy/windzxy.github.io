(() => {
  'use strict';
  const VERSION='58.0.0';
  const DATA='./data/city-dossiers-v45.json?v='+VERSION;
  let cityData=null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const currentId=()=>{const b=location.hash.replace('#','').split('/');return b[0]==='city'?(b[1]||'taipei'):null;};
  async function boot(){
    cityData=await fetch(DATA,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!cityData)return;
    enhance();
    const mo=new MutationObserver(()=>requestAnimationFrame(enhance));
    const app=document.querySelector('#app'); if(app)mo.observe(app,{childList:true,subtree:true});
    window.addEventListener('hashchange',()=>requestAnimationFrame(enhance));
  }
  function enhance(){
    const id=currentId(); if(!id)return;
    const city=(cityData.cities||[]).find(c=>c.id===id); if(!city)return;
    const main=document.querySelector('.v45-city-main'); if(!main)return;
    let panel=main.querySelector('.v58-density');
    if(panel?.dataset.city===id)return;
    if(panel)panel.remove();
    panel=document.createElement('section');
    panel.className='v45-card v58-density'; panel.dataset.city=id;
    panel.innerHTML=`<div class="v58-head"><div><small>V58 · CITY DENSITY LAYER</small><h3>${esc(city.name)} Venue Intelligence</h3><p>把場館、交通、城市情緒與資料可信度放進同一個可掃讀版面；未核實內容保持 archive-model 標記。</p></div><div class="v58-score"><b>${city.venues.length}</b><span>venues</span><em>${city.tourLinks.length} tour links</em></div></div><div class="v58-venue-grid">${city.venues.map(v=>`<article class="v58-venue"><header><span>${esc(v.format||v.type)}</span><em>${esc(v.status)}</em></header><h4>${esc(v.name)}</h4><p>${esc(v.role)}</p><dl><div><dt>DISTRICT</dt><dd>${esc(v.district||'—')}</dd></div><div><dt>SCALE</dt><dd>${esc(v.capacity||'—')}</dd></div><div><dt>ACCESS</dt><dd>${esc(v.access||'—')}</dd></div></dl></article>`).join('')}</div><div class="v58-lower"><section><small>CITY SIGNALS</small><div class="v58-chips">${(city.citySignals||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div></section><section><small>ARRIVAL / EXIT</small><div class="v58-chips">${(city.transport||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div></section><section class="v58-source"><small>SOURCE STATUS</small><p>${esc(city.sourceStatus)}</p></section></div>`;
    const anchor=main.querySelector('.v45-moments');
    if(anchor)anchor.insertAdjacentElement('afterend',panel); else main.append(panel);
    stampHeader();
  }
  function stampHeader(){
    const live=document.querySelector('.v45-live b'); if(live)live.textContent='v58 LIVE';
    const foot=document.querySelector('.v45-footer'); if(foot)foot.textContent='Maydayland v58 · City / Venue Content Density · next: v59 tour-date evidence matrix';
    const brand=document.querySelector('.v45-brand small'); if(brand)brand.textContent='PRODUCT SYSTEM · v58.0.0';
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0));
})();
