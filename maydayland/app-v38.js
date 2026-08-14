(() => {
  'use strict';
  const VERSION = '38.0.0';
  const INDEX_URL = './data/data-index-v38.json?v=38.0.0';
  const $ = (sel, root=document) => root.querySelector(sel);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const arr = v => Array.isArray(v) ? v : (v && Array.isArray(v.items) ? v.items : (v && Array.isArray(v.entries) ? v.entries : []));
  const pick = (obj, keys, fallback='') => {
    for (const key of keys) if (obj && obj[key] != null && obj[key] !== '') return obj[key];
    return fallback;
  };

  const fallbackIndex = {
    version: VERSION,
    baseFiles: {
      meta:'./data/meta-v36.json?v=38.0.0', cities:'./data/cities-v36.json?v=38.0.0', venues:'./data/venues-v36.json?v=38.0.0', albums:'./data/albums-v36.json?v=38.0.0', setlists:'./data/setlists-v36.json?v=38.0.0', sources:'./data/sources-v36.json?v=38.0.0', assets:'./data/assets-v36.json?v=38.0.0', roadmap:'./data/roadmap-v36.json?v=38.0.0'
    },
    enrichmentFiles: {
      venueGuides:'./data/venue-guides-v37.json?v=38.0.0', setlistDays:'./data/setlist-days-v37.json?v=38.0.0', cityLanding:'./data/city-landing-v37.json?v=38.0.0', assetManifest:'./data/asset-manifest-v37.json?v=38.0.0', researchQueue:'./data/research-queue-v37.json?v=38.0.0', officialSources:'./data/official-sources-v37.json?v=38.0.0', schema:'./data/schema-v37.json?v=38.0.0'
    },
    currentInternalScore: 81,
    qualityTarget: 85
  };

  const state = { data:null, fileState:{}, view:'overview', city:'taipei', track:'倔強 · 現場心跳版', map:null, index:fallbackIndex };
  const views = { overview:'總覽', map:'巡演地圖', city:'城市專題', venues:'場館攻略', setlists:'逐站歌單', assets:'素材庫', sources:'來源牆', research:'補全隊列' };

  document.addEventListener('DOMContentLoaded', init);

  async function fetchJson(url, key, fallback){
    try{
      const res = await fetch(url, {cache:'no-store'});
      if(!res.ok) throw new Error('HTTP ' + res.status);
      state.fileState[key] = 'ok';
      return await res.json();
    }catch(err){
      console.warn('Maydayland v38 fallback', key, err);
      state.fileState[key] = 'fallback';
      return fallback;
    }
  }

  async function init(){
    state.index = await fetchJson(INDEX_URL, 'index', fallbackIndex);
    const files = {...(state.index.baseFiles || {}), ...(state.index.enrichmentFiles || {})};
    const loaded = await Promise.all(Object.entries(files).map(([key,url]) => fetchJson(url, key, key.includes('setlist') ? {themes:{},playlists:[]} : []).then(json => [key,json])));
    state.data = Object.fromEntries(loaded);
    const firstCity = cityList()[0];
    state.city = (cityList().find(c => c.id === state.city) || firstCity || {id:'taipei'}).id;
    render();
  }

  function cityList(){ return arr(state.data?.cities); }
  function venueList(){ return arr(state.data?.venues); }
  function albumList(){ return arr(state.data?.albums); }
  function sourceList(){ return [...arr(state.data?.sources), ...arr(state.data?.officialSources)]; }
  function currentCity(){ return cityList().find(c => c.id === state.city) || cityList()[0] || {}; }
  function cityVenues(city=currentCity()){
    const ids = arr(city.venueIds);
    return venueList().filter(v => ids.includes(v.id) || v.cityId === city.id);
  }
  function setlistFor(city=currentCity()){
    const theme = city.setlistTheme || 'homecoming';
    const themes = state.data?.setlists?.themes || {};
    if(Array.isArray(themes[theme])) return themes[theme];
    if(Array.isArray(city.setlist)) return city.setlist;
    return ['倔強','知足','乾杯'];
  }
  function landingFor(city=currentCity()){
    const items = arr(state.data?.cityLanding);
    return items.find(x => x.cityId === city.id || x.id === city.id || x.city === city.city) || {};
  }
  function guideFor(venue){
    const items = arr(state.data?.venueGuides);
    return items.find(x => x.venueId === venue.id || x.id === venue.id || x.name === venue.name) || {};
  }
  function setlistDays(){ return arr(state.data?.setlistDays); }
  function assets(){ return state.data?.assetManifest || state.data?.assets || {}; }
  function researchItems(){ return arr(state.data?.researchQueue); }

  function render(){
    if(state.map){ state.map.remove(); state.map = null; }
    const root = $('#app');
    if(!root) return;
    root.innerHTML = `<div class="ml v38">
      <header class="top">
        <a class="brand" href="#" data-view="overview"><img src="./mayday-logo.svg?v=38.0.0" alt="Mayday"><span><b>MAYDAYLAND</b><small>CONNECTED DATA ATLAS · v${VERSION}</small></span></a>
        <nav class="nav">${Object.entries(views).map(([id,label]) => `<button class="${state.view===id?'active':''}" data-view="${id}">${label}</button>`).join('')}</nav>
        <label class="search">⌕<input id="search" placeholder="搜索城市、場館、歌單、來源…" autocomplete="off"></label>
      </header>
      <section class="hero">
        <article class="hero-main glass"><span class="kicker">v38 connected data build</span><h1>把資料真正接進頁面</h1><p>這一版把 v36 拆分資料與 v37 補全資料接到同一套前端，新增城市專題、場館攻略、逐站歌單、素材庫與研究隊列。主架構仍是單入口，不再疊舊 widget。</p><div class="hero-actions"><button class="primary" data-view="city">查看城市專題</button><button class="ghost" data-view="setlists">逐站歌單</button><button class="ghost" data-view="assets">素材庫</button></div></article>
        <aside class="scoreboard glass">${score('資料檔', Object.keys(state.fileState).length, '並行載入', 100)}${score('城市節點', cityList().length, '含海外/資料節點', 82)}${score('場館資料', venueList().length, '攻略待補全', 78)}${score('品質門檻', (state.index.currentInternalScore || 81), '目標 85', state.index.currentInternalScore || 81)}</aside>
      </section>
      <main class="shell">
        <aside class="rail panel glass">${rail()}</aside>
        <section class="stage">${mainView()}${player()}</section>
        <aside class="dossier panel glass">${dossier(currentCity())}</aside>
      </main>
    </div>`;
    bind();
    if(state.view === 'map' || state.view === 'overview') requestAnimationFrame(initMap);
  }

  function score(label, value, note, pct){ return `<article class="score"><span class="kicker">${esc(label)}</span><b>${esc(value)}</b><small>${esc(note)}</small><div class="meter" style="--v:${Number(pct)||0}%"><i></i></div></article>`; }
  function rail(){
    return `<span class="kicker">City index</span><h2>城市資料庫</h2><p class="copy">選城市後，右側 dossier、城市專題、地圖熱點、場館與歌單會同步。</p><div class="pillrow"><span class="pill">${cityList().length} 城市</span><span class="pill">${venueList().length} 場館</span><span class="pill">v38</span></div><div class="citylist">${cityList().map(c => `<button class="city ${c.id===state.city?'active':''}" data-city="${esc(c.id)}"><b>${esc(c.city)}</b><span>${esc(c.heat || c.visitsEstimate || '')}</span><small>${esc(c.level || c.years || '')}</small></button>`).join('')}</div>`;
  }
  function mainView(){
    const mapSection = `<section class="view active">${state.view==='overview'?overview():''}${state.view==='map'?mapView():''}${state.view==='city'?cityLanding():''}${state.view==='venues'?venuesView():''}${state.view==='setlists'?setlistsView():''}${state.view==='assets'?assetsView():''}${state.view==='sources'?sourcesView():''}${state.view==='research'?researchView():''}</section>`;
    return mapSection;
  }
  function overview(){
    const ok = Object.values(state.fileState).filter(x=>x==='ok').length;
    const total = Object.keys(state.fileState).length;
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">Data health</span><h2>資料載入狀態</h2><p class="copy">v38 已把資料從展示層分離，後續補資料不需要改主 JS。</p></div></div><div class="data-health">${Object.entries(state.fileState).map(([k,v])=>`<div class="health-card"><b>${esc(v)}</b><small>${esc(k)}</small></div>`).join('')}</div><p class="load-note">${ok}/${total} 個資料檔載入成功。</p></article>${mapView()}${cityLanding()}`;
  }
  function mapView(){ return `<article class="section glass mapcard"><div class="section-head"><div><span class="kicker">Tour heat map</span><h2>巡演熱度地圖</h2><p class="copy">地圖節點來自城市資料檔；熱度高的城市 marker 更大。</p></div><div class="tabs"><button class="chip" data-layer="street">街道</button><button class="chip" data-layer="dark">深色</button></div></div><div id="tourMap" class="mapwrap"></div><div class="legend"><span><i class="dot"></i>熱度節點</span><span><i class="dot" style="background:var(--gold)"></i>主線城市</span><span><i class="dot" style="background:var(--accent)"></i>資料接入</span></div></article>`; }
  function cityLanding(){
    const c = currentCity(); const land = landingFor(c); const venues = cityVenues(c);
    const modules = arr(land.modules).length ? arr(land.modules) : ['城市主視覺','場館攻略','逐站歌單','照片牆','來源核對'];
    const gaps = arr(land.gaps).length ? arr(land.gaps) : arr(c.todo);
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">City landing page</span><h2>${esc(c.city)}專題</h2><p class="copy">${esc(c.story || c.hero)}</p></div><button class="primary" data-view="venues">看場館攻略</button></div><div class="city-landing"><div class="landing-hero" style="--tone:${esc(c.tone || '#72ffc9')}"><span class="kicker">${esc(c.level || '')}</span><h3>${esc(pick(land,['title','headline'],c.city))}</h3><p>${esc(pick(land,['description','summary'],c.hero || ''))}</p><div class="pillrow"><span class="pill">${esc(c.years || '')}</span><span class="pill">完成度 ${esc(c.score || 0)}%</span><span class="pill">${esc(c.status || 'pending')}</span></div></div><div class="module-card"><h3>專題模組</h3><ul>${modules.map(m=>`<li>${esc(typeof m === 'string' ? m : pick(m,['title','name','label']))}</li>`).join('')}</ul></div><div class="module-card"><h3>關聯場館</h3>${venues.map(v=>`<p><b>${esc(v.name)}</b><br><small>${esc(v.story || '')}</small></p>`).join('') || '<p>待補場館資料</p>'}</div><div class="module-card"><h3>補全缺口</h3><ul>${gaps.map(g=>`<li>${esc(typeof g === 'string' ? g : pick(g,['title','name','task']))}</li>`).join('')}</ul></div></div></article>`;
  }
  function venuesView(){
    const all = venueList();
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">Venue guides</span><h2>場館攻略資料</h2><p class="copy">把場館故事、交通、拍照點和素材需求集中管理。</p></div></div><div class="guide-grid">${all.map(v=>venueCard(v)).join('')}</div></article>`;
  }
  function venueCard(v){
    const g = guideFor(v); const needs = arr(g.needs).length ? arr(g.needs) : arr(v.needs);
    return `<article class="venue-guide"><span class="kicker">${esc(v.type || v.status || '')}</span><h3>${esc(v.name)}</h3><p>${esc(g.summary || g.story || v.story || '')}</p><div class="guide-meta"><span class="tag">${esc(v.cityId || '')}</span><span class="tag">${esc(v.status || 'pending')}</span><span class="tag">P${esc(v.priority || '')}</span></div><ul>${needs.slice(0,5).map(n=>`<li>${esc(typeof n === 'string' ? n : pick(n,['title','name','task']))}</li>`).join('')}</ul></article>`;
  }
  function setlistsView(){
    const days = setlistDays();
    const cards = days.length ? days : cityList().map(c => ({cityId:c.id,title:`${c.city} 主題歌單`,status:'theme-template',tracks:setlistFor(c)}));
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">Setlist days</span><h2>逐站歌單資料</h2><p class="copy">未核對完整曲序的資料只顯示為模板，不標成官方歌單。</p></div></div><div class="setlist-grid">${cards.map(day=>dayCard(day)).join('')}</div></article>`;
  }
  function dayCard(day){
    const title = pick(day,['title','name','date'], '歌單資料');
    const status = pick(day,['status','verification','sourceStatus'], 'needs-verification');
    const tracks = arr(day.tracks).length ? arr(day.tracks) : arr(day.songs);
    return `<article class="day-card"><span class="kicker">${esc(status)}</span><h3>${esc(title)}</h3><p>${esc(pick(day,['city','cityId','venue','note'],'待補場館 / 日期'))}</p><div class="day-tracks">${tracks.slice(0,8).map((t,i)=>`<div class="day-track"><span>${i+1}. ${esc(typeof t === 'string' ? t : pick(t,['title','song','name']))}</span><button data-track="${esc(typeof t === 'string' ? t : pick(t,['title','song','name']))}">播放</button></div>`).join('') || '<div class="empty">待補曲目</div>'}</div></article>`;
  }
  function assetsView(){
    const a = assets();
    const pools = arr(a.cityAssets).concat(arr(a.venueAssets), arr(a.albumAssets), arr(a.items), arr(a.assets));
    const fallback = cityList().map(c=>({id:c.id,title:c.city,type:'city',status:'pending',needs:['主視覺','照片牆','票根','海報']}));
    const list = pools.length ? pools : fallback;
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">Asset library</span><h2>素材庫與缺口</h2><p class="copy">先建立合法素材清單；未確認權利的圖片保持 pending，不亂塞低質圖。</p></div></div><div class="asset-board">${list.map(assetCard).join('')}</div></article>`;
  }
  function assetCard(item){
    const needs = arr(item.needs).length ? arr(item.needs) : ['photoWall','venueMap','ticketStub'];
    return `<article class="asset-card"><span class="kicker">${esc(pick(item,['type','category'],'asset'))}</span><h3>${esc(pick(item,['title','name','id'],'素材項'))}</h3><p>${esc(pick(item,['status','rights','license'],'pending'))}</p><div class="asset-status">${needs.slice(0,6).map(n=>`<div class="asset-slot"><b>${esc(typeof n === 'string' ? n : pick(n,['title','name','slot']))}</b><span>待入庫 / 待授權</span></div>`).join('')}</div></article>`;
  }
  function sourcesView(){
    const list = sourceList();
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">Official sources</span><h2>來源牆</h2><p class="copy">來源與資料分離，城市、專輯、事實都用 sourceId 指向這裡。</p></div></div><div class="source-board">${list.map(s=>`<article class="official-card"><span class="kicker">${esc(pick(s,['type','publisher','category'],'source'))}</span><h3>${esc(pick(s,['title','label','name','id'],'來源'))}</h3><p>${esc(pick(s,['description','usage','note'],'官方資料入口'))}</p>${pick(s,['url','href','link'],'') ? `<a class="source-link" href="${esc(pick(s,['url','href','link']))}" target="_blank" rel="noopener">打開來源</a>` : ''}</article>`).join('')}</div></article>`;
  }
  function researchView(){
    const list = researchItems();
    const road = state.data?.roadmap || {};
    const extra = arr(road.contentRoadmap).map(x=>({title:pick(x,['title','name','task'],'Roadmap'),priority:pick(x,['priority','level'],'P1'),description:pick(x,['description','note'],'待補')}));
    const items = list.length ? list : extra;
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">Research queue</span><h2>補全隊列</h2><p class="copy">把下一步工作變成可追蹤任務，避免又回到隨機補卡片。</p></div></div><div class="research-board">${items.map((x,i)=>`<article class="research-card"><span class="kicker">${esc(pick(x,['priority','level'],'P'+(i+1)))}</span><h3>${esc(pick(x,['title','name','task'],'補全任務'))}</h3><p>${esc(pick(x,['description','note','detail'],'待補細節'))}</p><div class="progress-line" style="--v:${Number(pick(x,['progress','score'],35))||35}%"><i></i></div></article>`).join('') || '<div class="empty">待建立研究隊列</div>'}</div></article>`;
  }
  function dossier(c){
    return `<div class="city-visual" style="background:linear-gradient(135deg,#091426,${esc(c.tone || '#72ffc9')},#13253d)"><div><span class="kicker">City dossier</span><h2>${esc(c.city || '')}</h2><p>${esc(c.level || '')} · ${esc(c.years || '')}</p></div></div><div class="pillrow"><span class="pill">熱度 ${esc(c.heat || c.visitsEstimate || '')}</span><span class="pill">完成度 ${esc(c.score || '')}%</span><span class="pill">${esc(c.status || '')}</span></div><p class="copy">${esc(c.hero || c.story || '')}</p><section><h2>主題歌單</h2><div class="setlist">${setlistFor(c).slice(0,6).map((s,i)=>`<div class="track"><span>${i+1}. ${esc(s)}</span><button data-track="${esc(s)}">播放</button></div>`).join('')}</div></section><section><h2>場館</h2>${cityVenues(c).map(v=>`<p><b>${esc(v.name)}</b><br><small>${esc(v.story || '')}</small></p>`).join('') || '<div class="empty">待補場館</div>'}</section>`;
  }
  function player(){ return `<aside class="player glass"><div class="player-main"><span class="disc"></span><div><b>${esc(state.track)}</b><small>Maydayland queue · demo state</small></div></div><div class="controls"><button>⏮</button><button>▶</button><button>⏭</button></div></aside>`; }

  function bind(){
    document.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', ev => { ev.preventDefault(); state.view = btn.dataset.view; render(); }));
    document.querySelectorAll('[data-city]').forEach(btn => btn.addEventListener('click', () => { state.city = btn.dataset.city; if(state.view === 'overview') state.view = 'city'; render(); }));
    document.querySelectorAll('[data-track]').forEach(btn => btn.addEventListener('click', () => { state.track = btn.dataset.track; render(); }));
    const search = $('#search');
    if(search){
      search.addEventListener('keydown', ev => {
        if(ev.key !== 'Enter') return;
        const q = search.value.trim().toLowerCase();
        const hit = cityList().find(c => [c.city,c.id,c.level,c.years].some(x => String(x||'').toLowerCase().includes(q)));
        if(hit){ state.city = hit.id; state.view = 'city'; render(); }
      });
    }
  }

  function initMap(){
    const el = $('#tourMap');
    if(!el || !window.L) return;
    state.map = L.map(el, {zoomControl:true, scrollWheelZoom:true}).setView([28.5,116.5], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:18, attribution:'&copy; OpenStreetMap contributors'}).addTo(state.map);
    const points = cityList().filter(c => Number(c.lat) && Number(c.lng));
    points.forEach(c => {
      const size = Math.max(24, Math.min(58, 22 + Number(c.heat || c.visitsEstimate || 10) / 2));
      const icon = L.divIcon({className:'', html:`<button class="citypin" style="--s:${size}px;--tone:${esc(c.tone || '#72ffc9')}" title="${esc(c.city)}">${esc(String(c.city || '?').slice(0,1))}</button>`, iconSize:[size,size], iconAnchor:[size/2,size/2]});
      L.marker([c.lat,c.lng], {icon}).addTo(state.map).on('click', () => { state.city = c.id; state.view = 'city'; render(); });
    });
    if(points.length > 1){ L.polyline(points.map(c=>[c.lat,c.lng]), {color:'#72ffc9', weight:2, opacity:.35, dashArray:'8 10'}).addTo(state.map); }
  }
})();
