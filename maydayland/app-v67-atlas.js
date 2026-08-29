(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  function announce(msg){
    let live=$('#v67Live');
    if(!live){live=document.createElement('div');live.id='v67Live';live.className='v67-sr';live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');document.body.append(live);}
    live.textContent=''; setTimeout(()=>live.textContent=msg,20);
  }
  function mountSkip(){
    if($('.v67-skip'))return;
    const a=document.createElement('a');a.className='v67-skip';a.href='#threeStage';a.textContent='跳到巡演地圖';document.body.prepend(a);
  }
  function labelControls(){
    const stage=$('#threeStage');
    if(stage){stage.setAttribute('role','application');stage.setAttribute('aria-label','五月天巡演互動地圖。可用方向鍵切換場次，空白鍵播放或暫停。');stage.setAttribute('tabindex','0');}
    const map={
      '[data-v61-prev]':'上一場','[data-v61-next]':'下一場','[data-v61-play]':'播放或暫停巡演時間線',
      '[data-v65-quality]':'切換顯示品質','[data-v66-reload]':'重新載入巡演地圖'
    };
    Object.entries(map).forEach(([sel,label])=>document.querySelectorAll(sel).forEach(el=>{if(!el.getAttribute('aria-label'))el.setAttribute('aria-label',label);}));
  }
  function keyboardHelp(){
    if($('.v67-access'))return;
    const host=$('.v66-resilience')||$('.v65-qa')||document.body;
    const panel=document.createElement('section');panel.className='v67-access';panel.setAttribute('aria-labelledby','v67Title');
    panel.innerHTML=`<div class="v67-head"><div><small>V67 · ACCESSIBILITY AUDIT</small><b id="v67Title">Keyboard · focus · fallback · screen reader</b></div><span>AA READY</span></div><div class="v67-grid"><div><small>KEYBOARD</small><b>← / → 切場 · Space 播放/暫停</b><em>Atlas 可取得鍵盤焦點，操作時會透過 live region 回報。</em></div><div><small>FOCUS</small><b>Visible focus ring</b><em>所有按鈕與地圖焦點都有清楚的鍵盤輪廓。</em></div><div><small>FALLBACK</small><b data-v67-fallback>WebGL route available</b><em>若 Canvas / WebGL 不可用，提供 chronology 文字導覽入口。</em></div></div><a class="v67-text-route" href="./index.html#tourChronology">OPEN TEXT CHRONOLOGY</a>`;
    host.append(panel);
  }
  function fallbackCheck(){
    const stage=$('#threeStage'), canvas=stage&&stage.querySelector('canvas'), out=$('[data-v67-fallback]');
    if(canvas){if(out)out.textContent='WebGL route available';document.body.classList.remove('v67-no-webgl');return;}
    document.body.classList.add('v67-no-webgl'); if(out)out.textContent='WebGL unavailable · text chronology active'; announce('互動地圖目前不可用，已提供文字巡演時間線入口。');
  }
  function bindKeys(){
    document.addEventListener('keydown',e=>{
      const tag=(e.target.tagName||'').toLowerCase(); if(['input','textarea','select'].includes(tag))return;
      if(e.key==='ArrowLeft'){const b=$('[data-v61-prev]');if(b){b.click();announce('已切換到上一場巡演。');}}
      if(e.key==='ArrowRight'){const b=$('[data-v61-next]');if(b){b.click();announce('已切換到下一場巡演。');}}
      if(e.code==='Space'){const b=$('[data-v61-play]');if(b){e.preventDefault();b.click();announce('巡演時間線播放狀態已切換。');}}
      if(e.key==='Escape'){const stage=$('#threeStage');if(stage===document.activeElement){stage.blur();announce('已離開地圖鍵盤焦點。');}}
    });
  }
  function boot(){
    mountSkip();keyboardHelp();labelControls();fallbackCheck();bindKeys();
    const mo=new MutationObserver(()=>{labelControls();fallbackCheck();});mo.observe(document.body,{childList:true,subtree:true});
    setInterval(fallbackCheck,3000);
    const badge=$('.v64-badge');if(badge)badge.textContent='ROUTE GEOMETRY · 67 · ACCESSIBLE';
    const title=$('.v64-top small');if(title)title.textContent='V67 · CHRONOLOGY ROUTE · ACCESSIBILITY AUDIT';
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1150));
})();