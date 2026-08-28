(() => {
  'use strict';
  function render(){
    const panel=document.querySelector('.v60-chronology');
    if(panel){
      panel.querySelector('.v62-launch')?.remove();
      let box=panel.querySelector('.v63-launch');
      if(!box){box=document.createElement('div');box.className='v63-launch';panel.append(box);}
      box.innerHTML='<div><small>V63 · REMAINING CITY EVIDENCE + ROUTE SEGMENTS</small><b>55 verified dates · 8 cities · 新加坡 +2 / 廣州 +6 <span>+8 VERIFIED</span></b><em>Atlas 新增逐城市 segment 狀態：completed / active / upcoming，播放進度與 Shader 城市 focus 同步。</em></div><a href="./atlas-v63.html">OPEN V63 SEGMENT ATLAS →</a>';
    }
    const live=document.querySelector('.v45-live b'); if(live)live.textContent='v63 LIVE';
    const foot=document.querySelector('.v45-footer'); if(foot)foot.textContent='Maydayland v63 · Verified Segment Route · next: v64 Xiamen/Tokyo evidence + deeper route geometry';
    const brand=document.querySelector('.v45-brand small'); if(brand)brand.textContent='PRODUCT SYSTEM · v63.0.0';
  }
  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(render,260);
    const app=document.querySelector('#app'); if(app)new MutationObserver(()=>requestAnimationFrame(render)).observe(app,{childList:true,subtree:true});
    window.addEventListener('hashchange',()=>requestAnimationFrame(render));
  });
})();