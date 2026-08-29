(() => {
  'use strict';
  const V='70.0.0';
  async function load(url){try{const r=await fetch(url+'?v='+V,{cache:'no-store'});return r.ok?await r.json():null}catch{return null}}
  async function run(){
    const [m,r,p]=await Promise.all([load('./data/release-integrity-v70.json'),load('./data/route-chronology-v69.json'),load('./data/provenance-v69.json')]);
    if(!m)return;
    const events=(r?.cities||[]).reduce((n,c)=>n+(c.events?.length||0),0);
    const verified=(p?.cities||[]).filter(c=>c.status==='verified').length;
    const pending=(p?.cities||[]).filter(c=>c.status==='pending').map(c=>c.id);
    const pass=events===m.dataset.expectedEvents&&verified===m.dataset.expectedVerifiedCities&&m.dataset.requiredPending.every(id=>pending.includes(id));
    const badge=document.createElement('div');badge.className='v70-atlas-integrity';badge.setAttribute('role','status');badge.innerHTML=`<small>V70 RELEASE INTEGRITY</small><b>${pass?'PASS':'WARN'}</b><span>${events} dates · ${verified} cities · ${pending.length} pending</span>`;
    document.body.append(badge);
    document.title='Maydayland · Final Release Integrity Atlas v70';
    document.querySelectorAll('a[href*="index.html"],a[href="./"]').forEach(a=>a.setAttribute('href','./index.html'));
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(run,120));
})();