(() => {
  'use strict';
  const VERSION='64.0.0';
  const DATA='./data/route-chronology-v64.json?v='+VERSION;
  let payload=null, flat=[], cursor=0, timer=null, playing=false, overlay=null, pathNodes=[];
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[ch]));
  const fmt=d=>new Intl.DateTimeFormat('zh-Hant',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(d+'T00:00:00'));
  const firstIndex=id=>Math.max(0,flat.findIndex(e=>e.id===id));

  async function boot(){
    payload=await fetch(DATA,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!payload)return;
    flat=(payload.cities||[]).flatMap(c=>(c.events||[]).map((date,seq)=>({...c,date,seq,cityCount:c.events.length}))).sort((a,b)=>a.date.localeCompare(b.date));
    mount();
    mountGeometry();
    const requested=new URLSearchParams(location.hash.replace(/^#/,''));
    const idx=flat.findIndex(e=>e.date===requested.get('date')&&(!requested.get('city')||e.id===requested.get('city')));
    focus(idx>=0?idx:0,false);
    requestAnimationFrame(trackGeometry);
  }

  function mount(){
    const shell=document.createElement('section'); shell.className='v64-sync';
    shell.innerHTML=`<div class="v64-top"><div><small>V64 · CHRONOLOGY-DRIVEN ROUTE GEOMETRY</small><h3>${payload.coverage.verifiedEvents} verified dates · ${payload.coverage.verifiedCities} cities · ${payload.coverage.geometrySegments} live map segments</h3></div><div class="v64-actions"><a href="./index.html">返回 Maydayland</a><button data-v64="prev">◀</button><button data-v64="play">PLAY</button><button data-v64="next">▶</button></div></div><div class="v64-now"><span data-v64-now></span><span>${reduced?'REDUCED MOTION':'MAP GEOMETRY LIVE'}</span></div><div class="v64-segment-map">${renderSegments()}</div><div class="v64-track">${(payload.cities||[]).map(c=>`<button class="v64-stop" data-v64-city="${esc(c.id)}" data-index="${firstIndex(c.id)}"><small>${fmt(c.events[0])}</small><b>${esc(c.name)}</b><em>${esc(c.venue)} · ${c.events.length}場</em></button>`).join('')}</div><div class="v64-progress"><i></i><b></b></div>`;
    document.body.append(shell);
    const badge=document.createElement('div'); badge.className='v64-badge'; badge.textContent='ROUTE GEOMETRY · 64'; document.body.append(badge);
    document.addEventListener('click',e=>{
      const ctl=e.target.closest('[data-v64]'); if(ctl){const a=ctl.dataset.v64;if(a==='prev')focus(Math.max(0,cursor-1));if(a==='next')focus(Math.min(flat.length-1,cursor+1));if(a==='play')togglePlay(ctl);}
      const stop=e.target.closest('[data-v64-city]'); if(stop)focus(Number(stop.dataset.index||0));
      const seg=e.target.closest('[data-v64-segment]'); if(seg)focus(Number(seg.dataset.index||0));
    });
    document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')focus(Math.max(0,cursor-1));if(e.key==='ArrowRight')focus(Math.min(flat.length-1,cursor+1));if(e.key===' '&&!/INPUT|TEXTAREA|BUTTON/.test(document.activeElement?.tagName||'')){e.preventDefault();togglePlay(document.querySelector('[data-v64="play"]'));}});
  }

  function renderSegments(){return (payload.cities||[]).map((c,i)=>`<button class="v64-segment" data-v64-segment="${i}" data-index="${firstIndex(c.id)}"><i></i><span>${String(i+1).padStart(2,'0')}</span><b>${esc(c.name)}</b>${i<payload.cities.length-1?'<em>→</em>':''}</button>`).join('');}

  function mountGeometry(){
    const stage=document.querySelector('#threeStage'); if(!stage)return;
    overlay=document.createElementNS('http://www.w3.org/2000/svg','svg'); overlay.setAttribute('class','v64-route-overlay'); overlay.setAttribute('aria-hidden','true');
    const defs=document.createElementNS('http://www.w3.org/2000/svg','defs'); defs.innerHTML='<filter id="v64Glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    overlay.append(defs);
    for(let i=0;i<Math.max(0,(payload.cities||[]).length-1);i++){
      const g=document.createElementNS('http://www.w3.org/2000/svg','g'); g.setAttribute('class','v64-map-segment upcoming'); g.dataset.segment=String(i);
      const base=document.createElementNS('http://www.w3.org/2000/svg','path'); base.setAttribute('class','v64-path-base');
      const live=document.createElementNS('http://www.w3.org/2000/svg','path'); live.setAttribute('class','v64-path-live'); live.setAttribute('filter','url(#v64Glow)');
      const head=document.createElementNS('http://www.w3.org/2000/svg','circle'); head.setAttribute('r','4.5'); head.setAttribute('class','v64-flight-head');
      g.append(base,live,head); overlay.append(g); pathNodes.push({g,base,live,head});
    }
    stage.append(overlay);
  }

  function cityPoint(id,rect){
    const label=document.querySelector(`.v43-city-label[data-city="${CSS.escape(id)}"]`); if(!label)return null;
    const b=label.getBoundingClientRect();
    return {x:b.left+b.width/2-rect.left,y:b.top+b.height/2-rect.top};
  }

  function curvePath(a,b){const dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy),lift=Math.min(92,Math.max(28,dist*.24));const mx=(a.x+b.x)/2,my=(a.y+b.y)/2-lift;return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;}

  function trackGeometry(){
    if(overlay){const stage=document.querySelector('#threeStage'); if(stage){const rect=stage.getBoundingClientRect();overlay.setAttribute('viewBox',`0 0 ${Math.max(1,rect.width)} ${Math.max(1,rect.height)}`);const cities=payload?.cities||[];pathNodes.forEach((node,i)=>{const a=cityPoint(cities[i]?.id,rect),b=cityPoint(cities[i+1]?.id,rect);if(!a||!b){node.g.style.display='none';return;}node.g.style.display='';const d=curvePath(a,b);node.base.setAttribute('d',d);node.live.setAttribute('d',d);const len=node.live.getTotalLength?.()||1;node.live.style.strokeDasharray=String(len);const state=node.g.classList.contains('done')?1:node.g.classList.contains('active')?activeSegmentProgress():0;node.live.style.strokeDashoffset=String(len*(1-state));const p=node.live.getPointAtLength?.(len*state);if(p){node.head.setAttribute('cx',p.x);node.head.setAttribute('cy',p.y);node.head.style.opacity=state>0&&state<1?'1':node.g.classList.contains('active')?'1':'0';}});}}
    requestAnimationFrame(trackGeometry);
  }

  function activeSegmentProgress(){
    const item=flat[cursor]; if(!item)return 0;
    const cityIndex=(payload.cities||[]).findIndex(c=>c.id===item.id);
    if(cityIndex<=0)return 0;
    const city=payload.cities[cityIndex]; return Math.max(.08,Math.min(1,(item.seq+1)/Math.max(1,city.events.length)));
  }

  function syncMapSegments(cityIndex){pathNodes.forEach((node,idx)=>{node.g.classList.remove('done','active','upcoming');node.g.classList.add(idx<cityIndex?'done':idx===cityIndex-1?'active':'upcoming');});}

  function focus(i,announce=true){
    if(!flat.length)return; const prior=flat[cursor]; cursor=Math.max(0,Math.min(i,flat.length-1)); const item=flat[cursor]; const cityIndex=(payload.cities||[]).findIndex(c=>c.id===item.id);
    const tour=document.querySelector('[data-tour="t5525"]'); if(tour&&!tour.classList.contains('active'))tour.click();
    const city=document.querySelector(`[data-city="${CSS.escape(item.id)}"]`); if(city)city.click();
    document.querySelectorAll('.v64-stop').forEach(x=>x.classList.toggle('active',x.dataset.v64City===item.id));
    document.querySelectorAll('[data-city]').forEach(x=>x.classList.toggle('v64-focus',x.dataset.city===item.id));
    document.querySelectorAll('.v64-segment').forEach((x,idx)=>{x.classList.toggle('done',idx<cityIndex);x.classList.toggle('active',idx===cityIndex);x.classList.toggle('upcoming',idx>cityIndex);});
    syncMapSegments(cityIndex);
    if(prior&&prior.id!==item.id){document.body.classList.remove('v64-city-hop');void document.body.offsetWidth;document.body.classList.add('v64-city-hop');}
    const bar=document.querySelector('.v64-progress i'); if(bar)bar.style.width=((cursor+1)/flat.length*100).toFixed(2)+'%';
    const marker=document.querySelector('.v64-progress b'); if(marker)marker.style.left=(cursor/Math.max(1,flat.length-1)*100).toFixed(2)+'%';
    const now=document.querySelector('[data-v64-now]'); if(now)now.textContent=`SEGMENT ${cityIndex+1}/${payload.cities.length} · ${item.name} · ${fmt(item.date)} · ${item.seq+1}/${item.cityCount} · 全程 ${cursor+1}/${flat.length}`;
    const status=document.querySelector('#tourStatus'); if(status)status.textContent=`${item.name} · ${fmt(item.date)} · MAP ${cityIndex+1}/${payload.cities.length}`;
    document.querySelector('.v64-segment.active')?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'center'});
    if(announce)history.replaceState(null,'',`#date=${item.date}&city=${item.id}`);
  }

  function stepDelay(){if(reduced)return 2000;const current=flat[cursor],next=flat[cursor+1];return next&&current&&next.id!==current.id?3000:1050;}
  function schedule(btn){if(!playing)return;if(cursor>=flat.length-1){playing=false;btn.textContent='PLAY';btn.classList.remove('active');return;}timer=setTimeout(()=>{focus(cursor+1);schedule(btn);},stepDelay());}
  function togglePlay(btn){if(!btn)return;if(playing){playing=false;clearTimeout(timer);timer=null;btn.textContent='PLAY';btn.classList.remove('active');return;}playing=true;btn.textContent='PAUSE';btn.classList.add('active');schedule(btn);}
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)togglePlay(document.querySelector('[data-v64="play"]'));});
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,750));
})();