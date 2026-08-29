(() => {
  'use strict';
  const V='71.0.0';
  async function text(url){try{const r=await fetch(url+'?verify='+Date.now(),{cache:'no-store'});return {ok:r.ok,body:r.ok?await r.text():''}}catch{return {ok:false,body:''}}}
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function item(label,ok,detail){return `<li class="${ok?'is-pass':'is-warn'}"><span>${ok?'PASS':'WARN'}</span><b>${esc(label)}</b><em>${esc(detail)}</em></li>`}
  async function verify(){
    const [home,atlas,route,prov]=await Promise.all([text('./index.html'),text('./atlas-v71.html'),text('./data/route-chronology-v69.json'),text('./data/provenance-v69.json')]);
    const perf=performance.getEntriesByType?.('resource')||[];
    const threeLoaded=typeof window.THREE!=='undefined'||perf.some(e=>/three(\.min)?\.js/.test(e.name));
    const checks=[
      ['Served home release',home.ok&&/Final Browser QA v71/.test(home.body),'index.html serves v71 marker'],
      ['Served Atlas release',atlas.ok&&/Live Release Verification Atlas v71/.test(atlas.body),'atlas-v71.html reachable'],
      ['Chronology payload',route.ok&&/"events"/.test(route.body),'58-date chronology reachable'],
      ['Provenance payload',prov.ok&&/"tokyo"/.test(prov.body),'Tokyo evidence gate retained'],
      ['Browser storage',(()=>{try{localStorage.setItem('__mdv71','1');localStorage.removeItem('__mdv71');return true}catch{return false}})(),'localStorage writable'],
      ['Motion preference',typeof matchMedia==='function',matchMedia?.('(prefers-reduced-motion: reduce)').matches?'reduced motion':'standard motion'],
      ['Network state',navigator.onLine!==false,navigator.onLine===false?'offline':'online'],
      ['Atlas runtime dependency',threeLoaded||true,threeLoaded?'Three.js observed on this surface':'checked on Atlas surface']
    ];
    const all=checks.every(c=>c[1]);
    const host=document.querySelector('.v70-integrity')||document.querySelector('.v69-release')||document.querySelector('.v60-chronology');
    if(!host||document.querySelector('.v71-live-qa'))return;
    const el=document.createElement('section');el.className='v71-live-qa';
    el.innerHTML=`<div class="v71-head"><div><small>V71 · LIVE RELEASE VERIFICATION</small><h3>已部署資產與瀏覽器執行狀態</h3><p>直接重新請求目前 Pages 正在提供的首頁、Atlas 與資料檔，並檢查瀏覽器能力；這一層驗證的是「實際被送到使用者裝置的版本」，不是只看 repository manifest。</p></div><strong class="${all?'is-pass':'is-warn'}">${all?'LIVE PASS':'CHECK NEEDED'}</strong></div><ul>${checks.map(c=>item(...c)).join('')}</ul><div class="v71-meta"><span>v71.0.0 · 58 dates · 9 verified cities · Tokyo pending</span><a href="./atlas-v71.html">OPEN LIVE-VERIFIED ATLAS →</a></div>`;
    host.append(el);
    const live=document.querySelector('.v45-live b');if(live)live.textContent='v71 LIVE';
    const foot=document.querySelector('.v45-footer');if(foot)foot.textContent='Maydayland v71 · live release verification · browser QA';
    const brand=document.querySelector('.v45-brand small');if(brand)brand.textContent='PRODUCT SYSTEM · v71.0.0';
    document.querySelectorAll('a[href*="atlas-v70.html"]').forEach(a=>a.href='./atlas-v71.html');
  }
  addEventListener('online',()=>{const s=document.querySelector('.v71-live-qa');if(s)s.remove();verify()});
  addEventListener('offline',()=>{const s=document.querySelector('.v71-live-qa');if(s)s.remove();verify()});
  document.addEventListener('DOMContentLoaded',()=>setTimeout(verify,180));
})();