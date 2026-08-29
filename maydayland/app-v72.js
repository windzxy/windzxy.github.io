(() => {
  'use strict';
  const V='72.0.0';
  const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  const reduced=matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
  const saveData=conn?.saveData===true;
  const memory=Number(navigator.deviceMemory||0);
  const cores=Number(navigator.hardwareConcurrency||0);
  const slowNet=/^(slow-2g|2g)$/.test(conn?.effectiveType||'');
  const constrained=saveData||slowNet||(memory>0&&memory<=4)||(cores>0&&cores<=4);
  const profile=constrained?'lite':reduced?'calm':'full';
  document.documentElement.dataset.v72Profile=profile;

  function optimizeMedia(){
    const vh=innerHeight||800;
    document.querySelectorAll('img').forEach((img,i)=>{
      if(i>2 || img.getBoundingClientRect().top>vh*1.25) img.loading='lazy';
      img.decoding='async';
      img.fetchPriority=i<2?'high':'low';
    });
    if(constrained){
      document.querySelectorAll('video').forEach(v=>{v.preload='metadata'; if(v.autoplay){v.autoplay=false; try{v.pause()}catch{}}});
    }
  }

  function prefetchAtlas(){
    if(constrained||saveData)return;
    const run=()=>{
      if(document.querySelector('link[data-v72-prefetch]'))return;
      const l=document.createElement('link');l.rel='prefetch';l.href='./atlas-v72.html';l.as='document';l.dataset.v72Prefetch='1';document.head.append(l);
    };
    if('requestIdleCallback' in window)requestIdleCallback(run,{timeout:3500});else setTimeout(run,1800);
  }

  function metrics(){
    const nav=performance.getEntriesByType?.('navigation')?.[0];
    const res=performance.getEntriesByType?.('resource')||[];
    const css=res.filter(r=>/\.css(?:\?|$)/.test(r.name));
    const js=res.filter(r=>/\.js(?:\?|$)/.test(r.name));
    return {dom:nav?Math.round(nav.domContentLoadedEventEnd):0,load:nav?Math.round(nav.loadEventEnd):0,css:css.length,js:js.length};
  }

  function mount(){
    if(document.querySelector('.v72-load-polish'))return;
    const host=document.querySelector('.v71-live-qa')||document.querySelector('.v70-integrity')||document.querySelector('.v69-release');
    if(!host)return;
    const m=metrics();
    const el=document.createElement('section');el.className='v72-load-polish';
    el.innerHTML=`<div class="v72-head"><div><small>V72 · PRODUCTION LOAD POLISH</small><h3>Adaptive delivery profile</h3><p>依裝置記憶體、CPU、Save-Data、網路與 Reduced Motion 自動降低非必要動畫與媒體預載；高能力裝置則在 idle 時預取 Atlas。</p></div><strong>${profile.toUpperCase()}</strong></div><div class="v72-grid"><div><small>PROFILE</small><b>${profile.toUpperCase()}</b><em>${constrained?'低負載策略啟用':'完整體驗'}</em></div><div><small>RUNTIME REQUESTS</small><b>${m.css} CSS · ${m.js} JS</b><em>歷史層仍保留相容性，v72 開始做 delivery guard</em></div><div><small>BROWSER TIMING</small><b>${m.dom||'--'} ms DOM</b><em>${m.load?`${m.load} ms load`:'等待 load sample'}</em></div></div><div class="v72-meta"><span>v${V} · media lazy decode · idle prefetch · constrained-device guard</span><a href="./atlas-v72.html">OPEN v72 ATLAS →</a></div>`;
    host.append(el);
    document.querySelectorAll('a[href*="atlas-v71.html"]').forEach(a=>a.href='./atlas-v72.html');
    const live=document.querySelector('.v45-live b');if(live)live.textContent='v72 LIVE';
    const brand=document.querySelector('.v45-brand small');if(brand)brand.textContent='PRODUCT SYSTEM · v72.0.0';
    const foot=document.querySelector('.v45-footer');if(foot)foot.textContent='Maydayland v72 · production load polish · adaptive delivery';
  }

  addEventListener('load',()=>setTimeout(()=>{optimizeMedia();prefetchAtlas();mount();},220),{once:true});
  document.addEventListener('DOMContentLoaded',()=>{optimizeMedia();setTimeout(mount,420);});
})();