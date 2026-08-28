(() => {
  'use strict';
  const VERSION='61.0.0';
  function render(){
    const panel=document.querySelector('.v60-chronology');
    if(panel && !panel.querySelector('.v61-launch')){
      const box=document.createElement('div'); box.className='v61-launch';
      box.innerHTML='<div><small>V61 · SHADER ROUTE SYNCHRONIZATION</small><b>讓 36 個 verified dates 直接驅動 Atlas 城市聚焦與播放進度 <span class="v61-chip">LIVE SYNC</span></b></div><a href="./atlas-v61.html">OPEN SYNCHRONIZED ATLAS →</a>';
      panel.append(box);
    }
    const live=document.querySelector('.v45-live b'); if(live)live.textContent='v61 LIVE';
    const foot=document.querySelector('.v45-footer'); if(foot)foot.textContent='Maydayland v61 · Shader Route Synchronization · next: v62 evidence expansion + route playback polish';
    const brand=document.querySelector('.v45-brand small'); if(brand)brand.textContent='PRODUCT SYSTEM · v61.0.0';
  }
  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(render,250);
    const app=document.querySelector('#app'); if(app)new MutationObserver(()=>requestAnimationFrame(render)).observe(app,{childList:true,subtree:true});
    window.addEventListener('hashchange',()=>requestAnimationFrame(render));
  });
})();
