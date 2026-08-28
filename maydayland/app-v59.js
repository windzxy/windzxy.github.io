(() => {
  'use strict';
  const VERSION='59.0.0';
  const DATA='./data/tour-date-evidence-v59.json?v='+VERSION;
  let payload=null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const cityId=()=>{const p=location.hash.replace('#','').split('/');return p[0]==='city'?(p[1]||'taipei'):null;};
  async function boot(){
    payload=await fetch(DATA,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!payload)return;
    render();
    const app=document.querySelector('#app');
    if(app)new MutationObserver(()=>requestAnimationFrame(render)).observe(app,{childList:true,subtree:true});
    window.addEventListener('hashchange',()=>requestAnimationFrame(render));
  }
  function render(){
    const id=cityId(); if(!id||!payload)return;
    const main=document.querySelector('.v45-city-main'); if(!main)return;
    let panel=main.querySelector('.v59-matrix');
    if(panel?.dataset.city===id)return;
    if(panel)panel.remove();
    const rows=(payload.events||[]).filter(e=>e.cityId===id);
    const verified=rows.filter(e=>e.status==='verified-published');
    const pending=rows.length-verified.length;
    panel=document.createElement('section');
    panel.className='v59-matrix'; panel.dataset.city=id;
    panel.innerHTML=`<div class="v59-head"><div><small>V59 · TOUR-DATE EVIDENCE MATRIX</small><h3>City ↔ Venue ↔ Tour</h3><p>日期只在來源足夠時顯示；尚未逐筆核實的城市關聯保留 archive-model，不以猜測日期填滿檔案。</p></div><div class="v59-kpis"><div class="v59-kpi"><b>${rows.length}</b><span>records</span></div><div class="v59-kpi"><b>${verified.length}</b><span>verified</span></div><div class="v59-kpi"><b>${pending}</b><span>pending</span></div></div></div><div class="v59-list">${rows.length?rows.map(rowHTML).join(''):'<div class="v59-empty">此城市尚未建立場次矩陣。</div>'}</div>`;
    const anchor=main.querySelector('.v58-density');
    if(anchor)anchor.insertAdjacentElement('afterend',panel); else main.append(panel);
    stamp();
  }
  function rowHTML(e){
    const ok=e.status==='verified-published';
    const links=(e.sources||[]).map((u,i)=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">SOURCE ${i+1}</a>`).join('');
    return `<article class="v59-row"><time>${esc(e.date||'DATE PENDING')}</time><div><small>${esc(e.city)}</small><h4>${esc(e.venue)}</h4></div><div><h4>${esc(e.tour)}</h4><p>${esc(e.theme)}</p>${links?`<div class="v59-sources">${links}</div>`:''}</div><span class="v59-status ${ok?'verified':'pending'}">${ok?'VERIFIED':'ARCHIVE-MODEL'}</span></article>`;
  }
  function stamp(){
    const live=document.querySelector('.v45-live b'); if(live)live.textContent='v59 LIVE';
    const foot=document.querySelector('.v45-footer'); if(foot)foot.textContent='Maydayland v59 · Tour-Date Evidence Matrix · next: v60 route chronology and coverage expansion';
    const brand=document.querySelector('.v45-brand small'); if(brand)brand.textContent='PRODUCT SYSTEM · v59.0.0';
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0));
})();