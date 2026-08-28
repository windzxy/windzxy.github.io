(() => {
  'use strict';
  const VERSION='60.0.0';
  const DATA='./data/route-chronology-v60.json?v='+VERSION;
  let payload=null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const fmt=d=>new Intl.DateTimeFormat('zh-Hant',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(d+'T00:00:00'));
  async function boot(){
    payload=await fetch(DATA,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!payload)return;
    render();
    const app=document.querySelector('#app');
    if(app)new MutationObserver(()=>requestAnimationFrame(render)).observe(app,{childList:true,subtree:true});
    window.addEventListener('hashchange',()=>requestAnimationFrame(render));
  }
  function flatten(){return (payload.cities||[]).flatMap(c=>(c.events||[]).map((date,i)=>({...c,date,seq:i+1}))).sort((a,b)=>a.date.localeCompare(b.date));}
  function render(){
    renderHome(); renderCity(); stamp();
  }
  function renderHome(){
    const atlas=document.querySelector('.v45-atlas'); if(!atlas)return;
    let panel=atlas.parentElement?.querySelector('.v60-chronology');
    if(panel)return;
    const events=flatten(), first=events[0], last=events[events.length-1];
    panel=document.createElement('section'); panel.className='v45-card v60-chronology';
    panel.innerHTML=`<div class="v60-head"><div><small>V60 · VERIFIED ROUTE CHRONOLOGY</small><h3>時間驅動的巡演路線</h3><p>只使用已核實日期驅動節點，點擊任一城市可直接進入 City Dossier；未核城市不進入時間線。</p></div><div class="v60-kpis"><span><b>${events.length}</b> verified dates</span><span><b>${payload.coverage.verifiedCities}</b> verified cities</span><span><b>${payload.coverage.pendingCities}</b> pending cities</span></div></div><div class="v60-range"><span>${fmt(first.date)}</span><i></i><span>${fmt(last.date)}</span></div><div class="v60-route">${payload.cities.map((c,i)=>cityNode(c,i)).join('')}</div>`;
    atlas.insertAdjacentElement('afterend',panel);
    bind(panel);
  }
  function cityNode(c,i){
    const first=c.events[0], last=c.events[c.events.length-1];
    return `<button class="v60-node" data-v60-city="${esc(c.id)}" style="--i:${i}"><span class="v60-dot"></span><small>${fmt(first)}${first!==last?' → '+fmt(last):''}</small><b>${esc(c.name)}</b><em>${esc(c.venue)}</em><strong>${c.events.length}場</strong></button>`;
  }
  function renderCity(){
    const bits=location.hash.replace('#','').split('/'); if(bits[0]!=='city')return;
    const id=bits[1]||'taipei', city=(payload.cities||[]).find(c=>c.id===id); if(!city)return;
    const main=document.querySelector('.v45-city-main'); if(!main)return;
    if(main.querySelector('.v60-city-chronology'))return;
    const panel=document.createElement('section'); panel.className='v60-city-chronology';
    panel.innerHTML=`<div class="v60-city-head"><div><small>V60 · ROUTE CHRONOLOGY</small><h3>${esc(city.name)} · ${city.events.length} 場已核實</h3><p>${esc(city.edition)} · ${esc(city.venue)}</p></div><div class="v60-source-state">VERIFIED · ${city.sources.length} SOURCES</div></div><div class="v60-dates">${city.events.map((d,i)=>`<span><small>${String(i+1).padStart(2,'0')}</small><b>${fmt(d)}</b></span>`).join('')}</div><div class="v60-source-links">${city.sources.map((u,i)=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">SOURCE ${i+1}</a>`).join('')}</div>`;
    const anchor=main.querySelector('.v59-matrix')||main.querySelector('.v58-density');
    if(anchor)anchor.insertAdjacentElement('afterend',panel); else main.append(panel);
  }
  function bind(root){root.querySelectorAll('[data-v60-city]').forEach(btn=>btn.addEventListener('click',()=>{location.hash='#city/'+btn.dataset.v60City;}));}
  function stamp(){
    const live=document.querySelector('.v45-live b'); if(live)live.textContent='v60 LIVE';
    const foot=document.querySelector('.v45-footer'); if(foot)foot.textContent='Maydayland v60 · Verified Route Chronology · next: v61 shader route synchronization and richer evidence coverage';
    const brand=document.querySelector('.v45-brand small'); if(brand)brand.textContent='PRODUCT SYSTEM · v60.0.0';
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0));
})();