(() => {
  'use strict';
  const VERSION='62.0.0';
  const DATA='./data/route-chronology-v62.json?v='+VERSION;
  let payload=null, flat=[], cursor=0, timer=null, playing=false;
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const fmt=d=>new Intl.DateTimeFormat('zh-Hant',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(d+'T00:00:00'));
  async function boot(){
    payload=await fetch(DATA,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!payload)return;
    flat=(payload.cities||[]).flatMap(c=>(c.events||[]).map((date,seq)=>({...c,date,seq,cityCount:c.events.length}))).sort((a,b)=>a.date.localeCompare(b.date));
    mount();
    const requested=new URLSearchParams(location.hash.replace(/^#/,''));
    const idx=flat.findIndex(e=>e.date===requested.get('date') && (!requested.get('city')||e.id===requested.get('city')));
    focus(idx>=0?idx:0,false);
  }
  function mount(){
    const shell=document.createElement('section'); shell.className='v62-sync';
    shell.innerHTML=`<div class="v62-top"><div><small>V62 · VERIFIED ROUTE PLAYBACK</small><h3>${payload.coverage.verifiedEvents} verified dates · ${payload.coverage.verifiedCities} cities · adaptive pacing</h3></div><div class="v62-actions"><a class="v62-back" href="./index.html">返回 Maydayland</a><button data-v62="prev" aria-label="上一場">◀</button><button data-v62="play">PLAY</button><button data-v62="next" aria-label="下一場">▶</button></div></div><div class="v62-now"><span data-v62-now></span><span data-v62-mode>${reduced?'REDUCED MOTION':'CINEMATIC MODE'}</span></div><div class="v62-track">${(payload.cities||[]).map(c=>`<button class="v62-stop" data-v62-city="${esc(c.id)}" data-index="${firstIndex(c.id)}"><small>${fmt(c.events[0])}</small><b>${esc(c.name)}</b><em>${esc(c.venue)} · ${c.events.length}場</em></button>`).join('')}</div><div class="v62-progress"><i></i><b></b></div>`;
    document.body.append(shell);
    const badge=document.createElement('div'); badge.className='v62-badge'; badge.textContent='VERIFIED ROUTE · 62'; document.body.append(badge);
    document.addEventListener('click',e=>{
      const ctl=e.target.closest('[data-v62]');
      if(ctl){const a=ctl.dataset.v62;if(a==='prev')focus(Math.max(0,cursor-1));if(a==='next')focus(Math.min(flat.length-1,cursor+1));if(a==='play')togglePlay(ctl);}
      const stop=e.target.closest('[data-v62-city]'); if(stop)focus(Number(stop.dataset.index||0));
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='ArrowLeft')focus(Math.max(0,cursor-1));
      if(e.key==='ArrowRight')focus(Math.min(flat.length-1,cursor+1));
      if(e.key===' ' && !/INPUT|TEXTAREA|BUTTON/.test(document.activeElement?.tagName||'')){e.preventDefault();togglePlay(document.querySelector('[data-v62="play"]'));}
    });
  }
  function firstIndex(id){return Math.max(0,flat.findIndex(e=>e.id===id));}
  function focus(i,announce=true){
    if(!flat.length)return;
    const prior=flat[cursor]; cursor=Math.max(0,Math.min(i,flat.length-1)); const item=flat[cursor];
    document.body.classList.add('v62-dim');
    const tour=document.querySelector('[data-tour="t5525"]'); if(tour)tour.click();
    const city=document.querySelector(`[data-city="${CSS.escape(item.id)}"]`); if(city)city.click();
    document.querySelectorAll('.v62-stop').forEach(x=>x.classList.toggle('active',x.dataset.v62City===item.id));
    document.querySelectorAll('[data-city]').forEach(x=>x.classList.toggle('v62-focus',x.dataset.city===item.id));
    if(prior && prior.id!==item.id){document.body.classList.remove('v62-city-hop');void document.body.offsetWidth;document.body.classList.add('v62-city-hop');}
    const bar=document.querySelector('.v62-progress i'); if(bar)bar.style.width=((cursor+1)/flat.length*100).toFixed(2)+'%';
    const marker=document.querySelector('.v62-progress b'); if(marker)marker.style.left=((cursor)/(Math.max(1,flat.length-1))*100).toFixed(2)+'%';
    const now=document.querySelector('[data-v62-now]'); if(now)now.textContent=`${item.name} · ${fmt(item.date)} · ${item.seq+1}/${item.cityCount} · 全程 ${cursor+1}/${flat.length}`;
    const status=document.querySelector('#tourStatus'); if(status)status.textContent=`${item.name} · ${fmt(item.date)} · ${cursor+1}/${flat.length}`;
    document.querySelector('.v62-stop.active')?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'center'});
    if(announce)history.replaceState(null,'',`#date=${item.date}&city=${item.id}`);
  }
  function stepDelay(){
    if(reduced)return 1800;
    const current=flat[cursor], next=flat[cursor+1];
    return next && current && next.id!==current.id ? 2600 : 1150;
  }
  function schedule(btn){
    if(!playing)return;
    if(cursor>=flat.length-1){playing=false;btn.textContent='PLAY';btn.classList.remove('active');return;}
    timer=setTimeout(()=>{focus(cursor+1);schedule(btn);},stepDelay());
  }
  function togglePlay(btn){
    if(!btn)return;
    if(playing){playing=false;clearTimeout(timer);timer=null;btn.textContent='PLAY';btn.classList.remove('active');return;}
    playing=true;btn.textContent='PAUSE';btn.classList.add('active');schedule(btn);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden && playing)togglePlay(document.querySelector('[data-v62="play"]'));});
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,700));
})();