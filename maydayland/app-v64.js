(() => {
  'use strict';
  function render(){
    const panel=document.querySelector('.v60-chronology');
    if(panel){
      panel.querySelector('.v63-launch')?.remove();
      let box=panel.querySelector('.v64-launch');
      if(!box){box=document.createElement('div');box.className='v64-launch';panel.append(box);}
      box.innerHTML='<div><small>V64 · CHRONOLOGY-DRIVEN MAP GEOMETRY</small><b>55 verified dates · 8 cities · 7 live route segments <span>WEBGL MAP SYNC</span></b><em>completed / active / upcoming 不再只停留在控制列；現在直接投射到 Atlas 地圖飛線，並跟隨相機與城市標記位置更新。</em></div><a href="./atlas-v64.html">OPEN V64 GEOMETRY ATLAS →</a>';
    }
    const live=document.querySelector('.v45-live b'); if(live)live.textContent='v64 LIVE';
    const foot=document.querySelector('.v45-footer'); if(foot)foot.textContent='Maydayland v64 · Chronology Route Geometry · next: v65 evidence closure + final interaction QA';
    const brand=document.querySelector('.v45-brand small'); if(brand)brand.textContent='PRODUCT SYSTEM · v64.0.0';
  }
  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(render,280);
    const app=document.querySelector('#app'); if(app)new MutationObserver(()=>requestAnimationFrame(render)).observe(app,{childList:true,subtree:true});
    window.addEventListener('hashchange',()=>requestAnimationFrame(render));
  });
})();