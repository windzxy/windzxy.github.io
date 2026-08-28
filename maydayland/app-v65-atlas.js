(() => {
  'use strict';
  const VERSION='65.0.0';
  const KEY='maydayland-atlas-quality-v65';
  let profile=localStorage.getItem(KEY)||'balanced';
  let lowFpsSamples=0;
  let autoGuard=true;
  let resizeTimer=0;
  const $=(s,r=document)=>r.querySelector(s);
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function setRatio(value){
    const slider=$('#ratioCap');
    if(!slider)return;
    slider.value=String(value);
    slider.dispatchEvent(new Event('input',{bubbles:true}));
  }
  function setBloom(on){
    const text=$('#bloomText');
    const button=$('[data-fx="bloom"]');
    if(!text||!button)return;
    const isOn=/ON/i.test(text.textContent||'');
    if(isOn!==on)button.click();
  }
  function applyProfile(next,reason='manual'){
    profile=next;
    localStorage.setItem(KEY,profile);
    if(profile==='eco'){setRatio(1);setBloom(false);}
    if(profile==='balanced'){setRatio(1.3);setBloom(!reduced);}
    if(profile==='quality'){setRatio(1.8);setBloom(true);}
    document.querySelectorAll('[data-v65-profile]').forEach(b=>b.classList.toggle('active',b.dataset.v65Profile===profile));
    const out=$('[data-v65-quality]');
    if(out)out.textContent=`${profile.toUpperCase()}${reason==='auto'?' · AUTO GUARD':''}`;
    document.body.dataset.v65Profile=profile;
  }

  function forceResize(){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>window.dispatchEvent(new Event('resize')),70);
  }

  function viewportInfo(){
    const stage=$('#threeStage');
    const rect=stage?.getBoundingClientRect();
    const dpr=window.devicePixelRatio||1;
    const vp=window.visualViewport;
    const out=$('[data-v65-viewport]');
    if(out)out.textContent=rect?`${Math.round(rect.width)}×${Math.round(rect.height)} · DPR ${dpr.toFixed(2)} · VP ${Math.round(vp?.width||innerWidth)}×${Math.round(vp?.height||innerHeight)}`:'WAITING FOR WEBGL';
  }

  function perfGuard(){
    const fps=parseFloat($('#fpsText')?.textContent||'');
    const out=$('[data-v65-fps]');
    if(out)out.textContent=Number.isFinite(fps)?`${Math.round(fps)} FPS`:'-- FPS';
    if(!autoGuard||!Number.isFinite(fps)||document.hidden)return;
    if(fps<38)lowFpsSamples++; else lowFpsSamples=Math.max(0,lowFpsSamples-1);
    if(lowFpsSamples>=5&&profile!=='eco'){
      applyProfile('eco','auto');
      lowFpsSamples=0;
      const note=$('[data-v65-note]');
      if(note)note.textContent='偵測到持續低幀率，已自動切換 ECO，保留 Route FX 並關閉 Bloom。';
    }
  }

  function mount(){
    if($('.v65-qa'))return;
    const host=$('.v64-sync')||document.body;
    const panel=document.createElement('section');
    panel.className='v65-qa';
    panel.innerHTML=`<div class="v65-head"><div><small>V65 · FINAL INTERACTION QA</small><b>Adaptive performance · resize safe · mobile viewport aware</b></div><span data-v65-quality>--</span></div><div class="v65-grid"><div><small>RENDER</small><b data-v65-fps>-- FPS</b><em data-v65-viewport>WAITING</em></div><div><small>QUALITY PROFILE</small><div class="v65-profiles"><button data-v65-profile="eco">ECO</button><button data-v65-profile="balanced">BALANCED</button><button data-v65-profile="quality">QUALITY</button></div></div><div><small>GUARD</small><button class="v65-guard active" data-v65-guard>LOW-FPS AUTO GUARD · ON</button><em data-v65-note>${reduced?'系統已啟用 Reduced Motion；BALANCED 預設不開 Bloom。':'連續低於 38 FPS 時自動降到 ECO，避免手機長時間高負載。'}</em></div></div>`;
    host.append(panel);
    panel.addEventListener('click',e=>{
      const p=e.target.closest('[data-v65-profile]'); if(p)applyProfile(p.dataset.v65Profile);
      const g=e.target.closest('[data-v65-guard]'); if(g){autoGuard=!autoGuard;g.classList.toggle('active',autoGuard);g.textContent=`LOW-FPS AUTO GUARD · ${autoGuard?'ON':'OFF'}`;lowFpsSamples=0;}
    });
    applyProfile(profile);
    viewportInfo();
  }

  function bindResizeQA(){
    const stage=$('#threeStage');
    if(stage&&window.ResizeObserver){
      const ro=new ResizeObserver(()=>{viewportInfo();forceResize();});
      ro.observe(stage);
    }
    window.addEventListener('orientationchange',()=>{setTimeout(()=>{viewportInfo();forceResize();},180);},{passive:true});
    window.visualViewport?.addEventListener('resize',()=>{viewportInfo();forceResize();},{passive:true});
    window.addEventListener('resize',viewportInfo,{passive:true});
  }

  function boot(){
    if(!$('#threeStage'))return setTimeout(boot,180);
    mount();
    bindResizeQA();
    setInterval(perfGuard,1200);
    const badge=$('.v64-badge'); if(badge)badge.textContent='ROUTE GEOMETRY · 65 · QA';
    const title=$('.v64-top small'); if(title)title.textContent='V65 · CHRONOLOGY ROUTE · FINAL INTERACTION QA';
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,950));
})();