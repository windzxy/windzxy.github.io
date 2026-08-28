(() => {
  'use strict';
  const VERSION='63.0.0';
  const DATA='./data/route-chronology-v63.json?v='+VERSION;
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
  function firstIndex(id){return Math.max(0,flat.findIndex(e=>e.id===id));}
  function mount(){
    const shell=document.createElement('section'); shell.className='v63-sync';
    shell.innerHTML=`<div class="v63-top"><div><small>V63 · VERIFIED SEGMENT ROUTE</small><h3>${payload.coverage.verifiedEvents} verified dates · ${payload.coverage.verifiedCities} cities · segment-synced shader playback</h3></div><div class="v63-actions"><a href="./index.html">返回 Maydayland</a><button data-v63="prev">◀</button><button data-v63="play">PLAY</button><button data-v63="next">▶</button></div></div><div class="v63-now"><span data-v63-now></span><span>${reduced?'REDUCED MOTION':'CINEMATIC MODE'}</span></div><div class="v63-segment-map">${renderSegments()}</div><div class="v63-track">${(payload.cities||[]).map(c=>`<button class="v63-stop" data-v63-city="${esc(c.id)}" data-index="${firstIndex(c.id)}"><small>${fmt(c.events[0])}</small><b>${esc(c.name)}</b><em>${esc(c.venue)} · ${c.events.length}場</em></button>`).join('')}</div><div class="v63-progress"><i></i><b></b></div>`;
    document.body.append(shell);
    const badge=document.createElement('div');badge.className='v63-badge';badge.textContent='VERIFIED SEGMENTS · 63';document.body.append(badge);
    document.addEventListener('click',e=>{
      const ctl=e.target.closest('[data-v63]'); if(ctl){const a=ctl.dataset.v63;if(a==='prev')focus(Math.max(0,cursor-1));if(a==='next')focus(Math.min(flat.length-1,cursor+1));if(a==='play')togglePlay(ctl);}
      const stop=e.target.closest('[data-v63-city]'); if(stop)focus(Number(stop.dataset.index||0));
      const seg=e.target.closest('[data-v63-segment]'); if(seg)focus(Number(seg.dataset.index||0));
    });
    document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')focus(Math.max(0,cursor-1));if(e.key==='ArrowRight')focus(Math.min(flat.length-1,cursor+1));if(e.key===' '&&!/INPUT|TEXTAREA|BUTTON/.test(document.activeElement?.tagName||'')){e.preventDefault();togglePlay(document.querySelector('[data-v63="play"]'));}});
  }
  function renderSegments(){
    const cities=payload.cities||[];
    return cities.map((c,i)=>`<button class="v63-segment" data-v63-segment="${i}" data-index="${firstIndex(c.id)}" aria-label="${esc(c.name)} route segment"><i></i><span>${String(i+1).padStart(2,'0')}</span><b>${esc(c.name)}</b>${i<cities.length-1?'<em>→</em>':''}</button>`).join('');
  }
  function focus(i,announce=true){
    if(!flat.length)return;
    const prior=flat[cursor]; cursor=Math.max(0,Math.min(i,flat.length-1)); const item=flat[cursor];
    const cityIndex=(payload.cities||[]).findIndex(c=>c.id===item.id);
    const tour=document.querySelector('[data-tour="t5525"]'); if(tour)tour.click();
    const city=document.querySelector(`[data-city="${CSS.escape(item.id)}"]`); if(city)city.click();
    document.querySelectorAll('.v63-stop').forEach(x=>x.classList.toggle('active',x.dataset.v63City===item.id));
    document.querySelectorAll('[data-city]').forEach(x=>x.classList.toggle('v63-focus',x.dataset.city===item.id));
    document.querySelectorAll('.v63-segment').forEach((x,idx)=>{x.classList.toggle('done',idx<cityIndex);x.classList.toggle('active',idx===cityIndex);x.classList.toggle('upcoming',idx>cityIndex);});
    if(prior&&prior.id!==item.id){document.body.classList.remove('v63-city-hop');void document.body.offsetWidth;document.body.classList.add('v63-city-hop');}
    const bar=document.querySelector('.v63-progress i'); if(bar)bar.style.width=((cursor+1)/flat.length*100).toFixed(2)+'%';
    const marker=document.querySelector('.v63-progress b'); if(marker)marker.style.left=(cursor/Math.max(1,flat.length-1)*100).toFixed(2)+'%';
    const now=document.querySelector('[data-v63-now]'); if(now)now.textContent=`SEGMENT ${cityIndex+1}/${payload.cities.length} · ${item.name} · ${fmt(item.date)} · ${item.seq+1}/${item.cityCount} · 全程 ${cursor+1}/${flat.length}`;
    const status=document.querySelector('#tourStatus'); if(status)status.textContent=`${item.name} · ${fmt(item.date)} · ${cursor+1}/${flat.length}`;
    document.querySelector('.v63-segment.active')?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'center'});
    if(announce)history.replaceState(null,'',`#date=${item.date}&city=${item.id}`);
  }
  function stepDelay(){if(reduced)return 1900;const current=flat[cursor],next=flat[cursor+1];return next&&current&&next.id!==current.id?2800:1100;}
  function schedule(btn){if(!playing)return;if(cursor>=flat.length-1){playing=false;btn.textContent='PLAY';btn.classList.remove('active');return;}timer=setTimeout(()=>{focus(cursor+1);schedule(btn);},stepDelay());}
  function togglePlay(btn){if(!btn)return;if(playing){playing=false;clearTimeout(timer);timer=null;btn.textContent='PLAY';btn.classList.remove('active');return;}playing=true;btn.textContent='PAUSE';btn.classList.add('active');schedule(btn);}
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)togglePlay(document.querySelector('[data-v63="play"]'));});
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,700));
})();