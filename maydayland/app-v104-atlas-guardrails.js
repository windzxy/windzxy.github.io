/* Maydayland · Atlas v104 guardrails
 * Consolidates WebGL resilience/touch intent and accessibility/fallback behaviour
 * previously split across app-v66-atlas.js and app-v67-atlas.js.
 */
(() => {
  'use strict';
  const VERSION='104.0.0';
  const $=(s,r=document)=>r.querySelector(s);
  let lossCount=0, restoredCount=0, gestureActive=false, recoveryTimer=0;

  function announce(msg){
    let live=$('#v104Live');
    if(!live){
      live=document.createElement('div');
      live.id='v104Live';
      live.className='v67-sr';
      live.setAttribute('aria-live','polite');
      live.setAttribute('aria-atomic','true');
      document.body.append(live);
    }
    live.textContent='';
    setTimeout(()=>live.textContent=msg,20);
  }

  function setState(state,message){
    document.body.dataset.v104Webgl=state;
    const badge=$('[data-v66-state]');
    const text=$('[data-v66-message]');
    if(badge)badge.textContent=state.toUpperCase();
    if(text)text.textContent=message;
  }

  function mountResilience(){
    if($('.v66-resilience'))return;
    const host=$('.v65-qa')||$('.v64-sync')||document.body;
    const panel=document.createElement('section');
    panel.className='v66-resilience';
    panel.innerHTML=`<div class="v66-head"><div><small>V104 · RUNTIME GUARDRAILS</small><b>WebGL recovery · touch intent · runtime health</b></div><span data-v66-state>READY</span></div><div class="v66-health"><div><small>CONTEXT</small><b data-v66-message>WebGL context healthy</b><em data-v66-count>0 losses · 0 restores</em></div><div><small>TOUCH MODE</small><b data-v66-touch>SCROLL SAFE</b><em>單指頁面可正常捲動；直接在 Atlas 畫布互動時才進入 map gesture 狀態。</em></div><div><small>RECOVERY</small><button data-v66-reload>RELOAD ATLAS</button><em>若瀏覽器或 GPU 無法自動恢復，可重新載入 Atlas，不影響主站資料。</em></div></div>`;
    host.append(panel);
    panel.addEventListener('click',e=>{if(e.target.closest('[data-v66-reload]'))location.reload();});
  }

  function updateCounts(){
    const out=$('[data-v66-count]');
    if(out)out.textContent=`${lossCount} losses · ${restoredCount} restores`;
  }

  function bindContext(){
    const canvas=$('#threeStage canvas');
    if(!canvas)return false;
    canvas.addEventListener('webglcontextlost',e=>{
      e.preventDefault();
      lossCount++;
      updateCounts();
      clearTimeout(recoveryTimer);
      setState('recovering','WebGL context lost · waiting for browser recovery');
      document.body.classList.add('v66-context-lost');
      recoveryTimer=setTimeout(()=>setState('attention','Context has not recovered · use Reload Atlas'),6500);
      announce('WebGL context lost. Atlas recovery is in progress.');
    },false);
    canvas.addEventListener('webglcontextrestored',()=>{
      restoredCount++;
      updateCounts();
      clearTimeout(recoveryTimer);
      document.body.classList.remove('v66-context-lost');
      setState('restored','WebGL context restored · renderer resync requested');
      window.dispatchEvent(new Event('resize'));
      announce('WebGL context restored.');
      setTimeout(()=>setState('ready','WebGL context healthy'),1800);
    },false);
    return true;
  }

  function setTouch(active){
    gestureActive=active;
    document.body.classList.toggle('v66-map-gesture',active);
    const out=$('[data-v66-touch]');
    if(out)out.textContent=active?'MAP GESTURE':'SCROLL SAFE';
  }

  function bindTouch(){
    const stage=$('#threeStage');
    if(!stage)return;
    stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.pointerType==='pen')setTouch(true);},{passive:true});
    stage.addEventListener('pointerup',()=>setTouch(false),{passive:true});
    stage.addEventListener('pointercancel',()=>setTouch(false),{passive:true});
    stage.addEventListener('pointerleave',()=>{if(gestureActive)setTouch(false);},{passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)setTouch(false);});
  }

  function runtimeHealth(){
    const stage=$('#threeStage');
    if(!stage)return;
    const canvas=stage.querySelector('canvas');
    if(!canvas){setState('attention','WebGL canvas unavailable · renderer fallback required');return;}
    if(['recovering','attention'].includes(document.body.dataset.v104Webgl))return;
    const rect=canvas.getBoundingClientRect();
    if(rect.width<2||rect.height<2)setState('attention','Canvas size invalid · resize resync requested');
    else if(document.body.dataset.v104Webgl!=='ready')setState('ready','WebGL context healthy');
  }

  function mountSkip(){
    if($('.v67-skip'))return;
    const a=document.createElement('a');
    a.className='v67-skip';
    a.href='#threeStage';
    a.textContent='跳到巡演地圖';
    document.body.prepend(a);
  }

  function labelControls(){
    const stage=$('#threeStage');
    if(stage){
      stage.setAttribute('role','application');
      stage.setAttribute('aria-label','五月天巡演互動地圖。可用方向鍵切換場次，空白鍵播放或暫停。');
      stage.setAttribute('tabindex','0');
    }
    const map={
      '[data-v61-prev]':'上一場',
      '[data-v61-next]':'下一場',
      '[data-v61-play]':'播放或暫停巡演時間線',
      '[data-v65-quality]':'切換顯示品質',
      '[data-v66-reload]':'重新載入巡演地圖'
    };
    Object.entries(map).forEach(([sel,label])=>document.querySelectorAll(sel).forEach(el=>{if(!el.getAttribute('aria-label'))el.setAttribute('aria-label',label);}));
  }

  function mountAccessibility(){
    if($('.v67-access'))return;
    const host=$('.v66-resilience')||$('.v65-qa')||document.body;
    const panel=document.createElement('section');
    panel.className='v67-access';
    panel.setAttribute('aria-labelledby','v104AccessTitle');
    panel.innerHTML=`<div class="v67-head"><div><small>V104 · ACCESSIBILITY + FALLBACK</small><b id="v104AccessTitle">Keyboard · focus · fallback · screen reader</b></div><span>AA READY</span></div><div class="v67-grid"><div><small>KEYBOARD</small><b>← / → 切場 · Space 播放/暫停</b><em>Atlas 可取得鍵盤焦點，操作時會透過 live region 回報。</em></div><div><small>FOCUS</small><b>Visible focus ring</b><em>所有按鈕與地圖焦點都有清楚的鍵盤輪廓。</em></div><div><small>FALLBACK</small><b data-v67-fallback>WebGL route available</b><em>若 Canvas / WebGL 不可用，提供 chronology 文字導覽入口。</em></div></div><a class="v67-text-route" href="./index.html#tourChronology">OPEN TEXT CHRONOLOGY</a>`;
    host.append(panel);
  }

  function fallbackCheck(){
    const stage=$('#threeStage'), canvas=stage&&stage.querySelector('canvas'), out=$('[data-v67-fallback]');
    if(canvas){
      if(out)out.textContent='WebGL route available';
      document.body.classList.remove('v67-no-webgl');
      return;
    }
    document.body.classList.add('v67-no-webgl');
    if(out)out.textContent='WebGL unavailable · text chronology active';
    announce('互動地圖目前不可用，已提供文字巡演時間線入口。');
  }

  function bindKeys(){
    document.addEventListener('keydown',e=>{
      const tag=(e.target.tagName||'').toLowerCase();
      if(['input','textarea','select'].includes(tag))return;
      if(e.key==='ArrowLeft'){
        const b=$('[data-v61-prev]');
        if(b){b.click();announce('已切換到上一場巡演。');}
      }
      if(e.key==='ArrowRight'){
        const b=$('[data-v61-next]');
        if(b){b.click();announce('已切換到下一場巡演。');}
      }
      if(e.code==='Space'){
        const b=$('[data-v61-play]');
        if(b){e.preventDefault();b.click();announce('巡演時間線播放狀態已切換。');}
      }
      if(e.key==='Escape'){
        const stage=$('#threeStage');
        if(stage===document.activeElement){stage.blur();announce('已離開地圖鍵盤焦點。');}
      }
    });
  }

  function boot(){
    if(!$('#threeStage'))return setTimeout(boot,180);
    mountResilience();
    mountSkip();
    mountAccessibility();
    let tries=0;
    const waitCanvas=setInterval(()=>{
      tries++;
      if(bindContext()||tries>30)clearInterval(waitCanvas);
    },180);
    bindTouch();
    labelControls();
    fallbackCheck();
    bindKeys();
    runtimeHealth();
    const mo=new MutationObserver(()=>{labelControls();fallbackCheck();});
    mo.observe(document.body,{childList:true,subtree:true});
    setInterval(runtimeHealth,2500);
    setInterval(fallbackCheck,3000);
    const badge=$('.v64-badge');if(badge)badge.textContent='ROUTE GEOMETRY · 104 · GUARDED';
    const title=$('.v64-top small');if(title)title.textContent='V104 · CHRONOLOGY ROUTE · CONSOLIDATED GUARDRAILS';
    document.documentElement.dataset.v104AtlasGuardrails='ready';
    window.MAYDAYLAND_ATLAS_GUARDRAILS_V104=Object.freeze({
      version:VERSION,
      health:()=>({webgl:document.body.dataset.v104Webgl||'pending',lossCount,restoredCount,gestureActive,accessibility:!!$('.v67-access'),fallback:document.body.classList.contains('v67-no-webgl')?'text':'webgl'})
    });
  }

  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1050),{once:true});
})();