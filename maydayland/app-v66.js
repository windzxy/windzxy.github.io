(() => {
  'use strict';
  function render(){
    const panel=document.querySelector('.v60-chronology');
    if(panel){
      panel.querySelector('.v65-launch')?.remove();
      let box=panel.querySelector('.v66-launch');
      if(!box){box=document.createElement('div');box.className='v66-launch';panel.append(box);}
      box.innerHTML='<div><small>V66 · RELEASE RESILIENCE</small><b>WebGL recovery · touch intent guard · runtime health <span>RELEASE POLISH</span></b><em>補上 WebGL context-loss / restore 狀態、GPU 無法恢復時的 Atlas reload fallback、手機觸控意圖標記與 runtime health 檢查；保留 v65 的自適應品質與低 FPS guard。</em></div><a href="./atlas-v66.html">OPEN V66 RESILIENT ATLAS →</a>';
    }
    const live=document.querySelector('.v45-live b'); if(live)live.textContent='v66 LIVE';
    const foot=document.querySelector('.v45-footer'); if(foot)foot.textContent='Maydayland v66 · Release Resilience · next: v67 content evidence closure + final accessibility audit';
    const brand=document.querySelector('.v45-brand small'); if(brand)brand.textContent='PRODUCT SYSTEM · v66.0.0';
  }
  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(render,320);
    const app=document.querySelector('#app'); if(app)new MutationObserver(()=>requestAnimationFrame(render)).observe(app,{childList:true,subtree:true});
    window.addEventListener('hashchange',()=>requestAnimationFrame(render));
  });
})();