(() => {
  'use strict';
  const VERSION='62.0.0';
  function render(){
    const panel=document.querySelector('.v60-chronology');
    if(panel){
      const old=panel.querySelector('.v61-launch'); if(old)old.remove();
      let box=panel.querySelector('.v62-launch');
      if(!box){box=document.createElement('div');box.className='v62-launch';panel.append(box);}
      box.innerHTML='<div><small>V62 · EVIDENCE EXPANSION + ROUTE PLAYBACK POLISH</small><b>47 verified dates · 6 cities · 上海 11 場已納入 <span class="v62-chip">+11 VERIFIED</span></b><em>Atlas 改為城市切換長停留、同城場次短節奏，支援 reduced-motion 與鍵盤方向鍵。</em></div><a href="./atlas-v62.html">OPEN V62 ROUTE ATLAS →</a>';
    }
    const live=document.querySelector('.v45-live b'); if(live)live.textContent='v62 LIVE';
    const foot=document.querySelector('.v45-footer'); if(foot)foot.textContent='Maydayland v62 · Evidence Expansion + Route Playback Polish · next: v63 remaining city evidence + route segment rendering';
    const brand=document.querySelector('.v45-brand small'); if(brand)brand.textContent='PRODUCT SYSTEM · v62.0.0';
  }
  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(render,260);
    const app=document.querySelector('#app'); if(app)new MutationObserver(()=>requestAnimationFrame(render)).observe(app,{childList:true,subtree:true});
    window.addEventListener('hashchange',()=>requestAnimationFrame(render));
  });
})();