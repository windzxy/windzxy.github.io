(() => {
  'use strict';
  function render(){
    const panel=document.querySelector('.v60-chronology');
    if(panel){
      panel.querySelector('.v66-launch')?.remove();
      let box=panel.querySelector('.v67-launch');
      if(!box){box=document.createElement('div');box.className='v67-launch';panel.append(box);}
      box.innerHTML='<div><small>V67 · ACCESSIBILITY AUDIT</small><b>Keyboard · focus · screen reader · fallback <span>RELEASE QA</span></b><em>新增可見 focus ring、Atlas 鍵盤操作、ARIA label、screen-reader live region、skip link，以及 WebGL 不可用時的文字 chronology fallback；保留 v66 resilience 與 v65 performance guard。</em></div><a href="./atlas-v67.html">OPEN V67 ACCESSIBLE ATLAS →</a>';
    }
    const live=document.querySelector('.v45-live b'); if(live)live.textContent='v67 LIVE';
    const foot=document.querySelector('.v45-footer'); if(foot)foot.textContent='Maydayland v67 · Accessibility Audit · next: v68 evidence closure + content provenance polish';
    const brand=document.querySelector('.v45-brand small'); if(brand)brand.textContent='PRODUCT SYSTEM · v67.0.0';
  }
  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(render,340);
    const app=document.querySelector('#app'); if(app)new MutationObserver(()=>requestAnimationFrame(render)).observe(app,{childList:true,subtree:true});
    window.addEventListener('hashchange',()=>requestAnimationFrame(render));
  });
})();