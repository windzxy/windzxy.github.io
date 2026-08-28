(() => {
  'use strict';
  function render(){
    const panel=document.querySelector('.v60-chronology');
    if(panel){
      panel.querySelector('.v64-launch')?.remove();
      let box=panel.querySelector('.v65-launch');
      if(!box){box=document.createElement('div');box.className='v65-launch';panel.append(box);}
      box.innerHTML='<div><small>V65 · FINAL INTERACTION QA</small><b>Adaptive performance · resize safe · mobile viewport aware <span>QA LAYER</span></b><em>新增 ECO / BALANCED / QUALITY 三段品質預設、持續低 FPS 自動降級、ResizeObserver、orientation / visualViewport 同步，收口 WebGL 長時間與手機端互動穩定性。</em></div><a href="./atlas-v65.html">OPEN V65 QA ATLAS →</a>';
    }
    const live=document.querySelector('.v45-live b'); if(live)live.textContent='v65 LIVE';
    const foot=document.querySelector('.v45-footer'); if(foot)foot.textContent='Maydayland v65 · Final Interaction QA · next: v66 evidence closure + release polish';
    const brand=document.querySelector('.v45-brand small'); if(brand)brand.textContent='PRODUCT SYSTEM · v65.0.0';
  }
  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(render,300);
    const app=document.querySelector('#app'); if(app)new MutationObserver(()=>requestAnimationFrame(render)).observe(app,{childList:true,subtree:true});
    window.addEventListener('hashchange',()=>requestAnimationFrame(render));
  });
})();