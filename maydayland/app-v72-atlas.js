(() => {
  'use strict';
  const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  const reduced=matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
  const memory=Number(navigator.deviceMemory||0),cores=Number(navigator.hardwareConcurrency||0);
  const constrained=conn?.saveData===true||/^(slow-2g|2g)$/.test(conn?.effectiveType||'')||(memory>0&&memory<=4)||(cores>0&&cores<=4);
  const profile=constrained?'eco':reduced?'balanced':'auto';
  function applyGuard(){
    if(profile==='eco'){
      const eco=document.querySelector('[data-v65-profile="eco"]');if(eco&&!eco.classList.contains('active'))eco.click();
      document.body.dataset.v72Atlas='eco';
    }else document.body.dataset.v72Atlas=profile;
  }
  function mount(){
    if(document.querySelector('.v72-atlas-guard'))return;
    const host=document.querySelector('.v71-atlas-live')||document.querySelector('.v70-atlas-integrity')||document.querySelector('.v65-qa');
    if(!host)return;
    const box=document.createElement('section');box.className='v72-atlas-guard';
    box.innerHTML=`<div><small>V72 · ADAPTIVE ATLAS DELIVERY</small><b>${profile.toUpperCase()}</b><em>${constrained?'Save-Data / 網路 / 裝置能力已觸發 ECO，Bloom 與 DPR 由既有 v65 guard 接管。':reduced?'Reduced Motion 已套用 BALANCED。':'裝置能力正常，保留自動 FPS guard。'}</em></div><span>${memory?memory+'GB RAM':'RAM N/A'} · ${cores||'--'} cores · ${conn?.effectiveType||'net n/a'}</span>`;
    host.append(box);
    const badge=document.querySelector('.v64-badge');if(badge)badge.textContent='ROUTE GEOMETRY · 72 · ADAPTIVE';
    const title=document.querySelector('.v64-top small');if(title)title.textContent='V72 · PRODUCTION LOAD POLISH · ADAPTIVE ATLAS';
  }
  function boot(){if(!document.querySelector('#threeStage'))return setTimeout(boot,180);applyGuard();mount();}
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1250));
})();