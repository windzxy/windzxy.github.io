(() => {
  'use strict';
  const VERSION='61.0.0';
  const DATA='./data/route-chronology-v60.json?v='+VERSION;
  let payload=null, flat=[], cursor=0, timer=null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const fmt=d=>new Intl.DateTimeFormat('zh-Hant',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(d+'T00:00:00'));
  async function boot(){
    payload=await fetch(DATA,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!payload)return;
    flat=(payload.cities||[]).flatMap(c=>(c.events||[]).map((date,seq)=>({...c,date,seq}))).sort((a,b)=>a.date.localeCompare(b.date));
    mount(); focus(0,false);
  }
  function mount(){
    const shell=document.createElement('section');
    shell.className='v61-sync';
    shell.innerHTML=`<div class="v61-top"><div><small>V61 · VERIFIED SHADER SYNCHRONIZATION</small><h3>36 verified dates → 5 cities → live route focus</h3></div><div class="v61-actions"><a class="v61-back" href="./index.html">返回 Maydayland</a><button data-v61="prev">◀</button><button data-v61="play">PLAY</button><button data-v61="next">▶</button></div></div><div class="v61-track">${(payload.cities||[]).map((c,i)=>`<button class="v61-stop" data-v61-city="${esc(c.id)}" data-index="${firstIndex(c.id)}"><small>${fmt(c.events[0])}</small><b>${esc(c.name)}</b><em>${esc(c.venue)} · ${c.events.length}場</em></button>`).join('')}</div><div class="v61-progress"><i></i></div>`;
    document.body.append(shell);
    const badge=document.createElement('div'); badge.className='v61-badge'; badge.textContent='CHRONOLOGY SYNC · 61'; document.body.append(badge);
    document.addEventListener('click',e=>{
      const ctl=e.target.closest('[data-v61]');
      if(ctl){ const a=ctl.dataset.v61; if(a==='prev')focus(Math.max(0,cursor-1)); if(a==='next')focus(Math.min(flat.length-1,cursor+1)); if(a==='play')togglePlay(ctl); }
      const stop=e.target.closest('[data-v61-city]'); if(stop)focus(Number(stop.dataset.index||0));
    });
  }
  function firstIndex(id){return Math.max(0,flat.findIndex(e=>e.id===id));}
  function focus(i,announce=true){
    if(!flat.length)return; cursor=Math.max(0,Math.min(i,flat.length-1)); const item=flat[cursor];
    document.body.classList.add('v61-dim');
    const tour=document.querySelector('[data-tour="t5525"]'); if(tour)tour.click();
    const city=document.querySelector(`[data-city="${CSS.escape(item.id)}"]`); if(city)city.click();
    document.querySelectorAll('.v61-stop').forEach(x=>x.classList.toggle('active',x.dataset.v61City===item.id));
    document.querySelectorAll('[data-city]').forEach(x=>x.classList.toggle('v61-focus',x.dataset.city===item.id));
    const bar=document.querySelector('.v61-progress i'); if(bar)bar.style.width=((cursor+1)/flat.length*100).toFixed(2)+'%';
    const status=document.querySelector('#tourStatus'); if(status)status.textContent=`${item.name} · ${fmt(item.date)} · ${cursor+1}/${flat.length}`;
    if(announce)history.replaceState(null,'',`#date=${item.date}&city=${item.id}`);
  }
  function togglePlay(btn){
    if(timer){clearInterval(timer);timer=null;btn.textContent='PLAY';btn.classList.remove('active');return;}
    btn.textContent='PAUSE';btn.classList.add('active');
    timer=setInterval(()=>{if(cursor>=flat.length-1){clearInterval(timer);timer=null;btn.textContent='PLAY';btn.classList.remove('active');return;}focus(cursor+1);},1400);
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,700));
})();
