(() => {
  'use strict';
  const VERSION='66.0.0';
  let lossCount=0, restoredCount=0, gestureActive=false, recoveryTimer=0;
  const $=(s,r=document)=>r.querySelector(s);

  function setState(state,message){
    document.body.dataset.v66Webgl=state;
    const badge=$('[data-v66-state]');
    const text=$('[data-v66-message]');
    if(badge)badge.textContent=state.toUpperCase();
    if(text)text.textContent=message;
  }

  function mount(){
    if($('.v66-resilience'))return;
    const host=$('.v65-qa')||$('.v64-sync')||document.body;
    const panel=document.createElement('section');
    panel.className='v66-resilience';
    panel.innerHTML=`<div class="v66-head"><div><small>V66 · RELEASE RESILIENCE</small><b>WebGL recovery · touch intent guard · runtime health</b></div><span data-v66-state>READY</span></div><div class="v66-health"><div><small>CONTEXT</small><b data-v66-message>WebGL context healthy</b><em data-v66-count>0 losses · 0 restores</em></div><div><small>TOUCH MODE</small><b data-v66-touch>SCROLL SAFE</b><em>單指頁面可正常捲動；直接在 Atlas 畫布互動時才進入 map gesture 狀態。</em></div><div><small>RECOVERY</small><button data-v66-reload>RELOAD ATLAS</button><em>若瀏覽器或 GPU 無法自動恢復，可重新載入 Atlas，不影響主站資料。</em></div></div>`;
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
    },false);
    canvas.addEventListener('webglcontextrestored',()=>{
      restoredCount++;
      updateCounts();
      clearTimeout(recoveryTimer);
      document.body.classList.remove('v66-context-lost');
      setState('restored','WebGL context restored · renderer resync requested');
      window.dispatchEvent(new Event('resize'));
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
    const stage=$('#threeStage'); if(!stage)return;
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
    if(document.body.dataset.v66Webgl==='recovering'||document.body.dataset.v66Webgl==='attention')return;
    const rect=canvas.getBoundingClientRect();
    if(rect.width<2||rect.height<2)setState('attention','Canvas size invalid · resize resync requested');
    else if(document.body.dataset.v66Webgl!=='ready')setState('ready','WebGL context healthy');
  }

  function boot(){
    if(!$('#threeStage'))return setTimeout(boot,180);
    mount();
    let tries=0;
    const waitCanvas=setInterval(()=>{
      tries++;
      if(bindContext()||tries>30)clearInterval(waitCanvas);
    },180);
    bindTouch();
    runtimeHealth();
    setInterval(runtimeHealth,2500);
    const badge=$('.v64-badge'); if(badge)badge.textContent='ROUTE GEOMETRY · 66 · RESILIENT';
    const title=$('.v64-top small'); if(title)title.textContent='V66 · CHRONOLOGY ROUTE · RELEASE RESILIENCE';
  }

  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1050));
})();