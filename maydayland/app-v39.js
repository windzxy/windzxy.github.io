(() => {
  'use strict';
  const VERSION = '39.0.0';
  const INDEX_URL = './data/data-index-v39.json?v=39.0.0';
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const arr = v => Array.isArray(v) ? v : (v && Array.isArray(v.items) ? v.items : (v && Array.isArray(v.entries) ? v.entries : []));
  const pick = (obj, keys, fallback='') => { for (const k of keys) if (obj && obj[k] != null && obj[k] !== '') return obj[k]; return fallback; };

  const fallbackIndex = {
    version: VERSION,
    baseFiles: {
      meta:'./data/meta-v36.json?v=39.0.0', cities:'./data/cities-v36.json?v=39.0.0', venues:'./data/venues-v36.json?v=39.0.0', albums:'./data/albums-v36.json?v=39.0.0', setlists:'./data/setlists-v36.json?v=39.0.0', sources:'./data/sources-v36.json?v=39.0.0', assets:'./data/assets-v36.json?v=39.0.0', roadmap:'./data/roadmap-v36.json?v=39.0.0'
    },
    enrichmentFiles: {
      venueGuides:'./data/venue-guides-v37.json?v=39.0.0', setlistDays:'./data/setlist-days-v37.json?v=39.0.0', cityLanding:'./data/city-landing-v37.json?v=39.0.0', assetManifest:'./data/asset-manifest-v37.json?v=39.0.0', researchQueue:'./data/research-queue-v37.json?v=39.0.0', officialSources:'./data/official-sources-v37.json?v=39.0.0', visualAssets:'./data/visual-assets-v39.json?v=39.0.0'
    },
    qualityTarget:85,
    currentInternalScore:83
  };
  const fallbackData = {meta:{version:VERSION,currentScore:83,qualityGate:85},cities:[{id:'taipei',city:'台北',lat:25.037,lng:121.565,heat:100,visitsEstimate:26,level:'核心主場',venueIds:['taipei-dome'],years:'1999–2026',tone:'#ff70b7',story:'資料載入中。',todo:['補資料檔']}],venues:[],albums:[],setlists:{themes:{homecoming:['倔強','知足','乾杯']}},sources:[],assets:{},roadmap:{timeline:[],contentRoadmap:[]},venueGuides:[],setlistDays:[],cityLanding:[],assetManifest:{},researchQueue:[],officialSources:[],visualAssets:{items:[]}};
  const state = {index:fallbackIndex,data:fallbackData,fileState:{},view:'overview',city:'taipei',track:'倔強 · 現場心跳版',map:null};
  const views = {overview:'總覽',map:'巡演地圖',city:'城市專題',venues:'場館攻略',setlists:'逐站歌單',assets:'素材庫',sources:'來源牆',research:'補全隊列'};

  document.addEventListener('DOMContentLoaded', init);

  async function fetchJson(url, key, fallback){
    try{
      const res = await fetch(url,{cache:'no-store'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      state.fileState[key] = 'ok';
      return await res.json();
    }catch(err){
      console.warn('Maydayland v39 fallback', key, err);
      state.fileState[key] = 'fallback';
      return fallback;
    }
  }

  async function init(){
    state.index = await fetchJson(INDEX_URL, 'index', fallbackIndex);
    const files = {...(state.index.baseFiles || {}), ...(state.index.enrichmentFiles || {})};
    const loaded = await Promise.all(Object.entries(files).map(([key,url]) => fetchJson(url, key, fallbackData[key])));
    Object.keys(files).forEach((key, i) => state.data[key] = loaded[i]);
    state.data.meta = state.data.meta || fallbackData.meta;
    state.data.cities = arr(state.data.cities).length ? arr(state.data.cities) : fallbackData.cities;
    if(!cityById(state.city)) state.city = state.data.cities[0].id;
    render();
  }

  function cityById(id=state.city){ return state.data.cities.find(c => c.id === id) || state.data.cities[0]; }
  function venuesFor(city){ const ids = city.venueIds || []; return arr(state.data.venues).filter(v => ids.includes(v.id) || v.cityId === city.id); }
  function landingFor(city){ return arr(state.data.cityLanding).find(x => (x.cityId || x.id) === city.id) || {}; }
  function cityVisual(city){
    const items = arr(state.data.visualAssets);
    return items.find(x => x.cityId === city.id && x.type === 'city-hero') || items.find(x => x.type === 'poster') || null;
  }
  function globalVisuals(){ return arr(state.data.visualAssets); }
  function setlistTheme(city){ const themes = state.data.setlists && state.data.setlists.themes || {}; return themes[city.setlistTheme] || city.setlist || ['倔強','知足','乾杯']; }
  function statusText(key){ return state.fileState[key] === 'ok' ? 'OK' : 'fallback'; }

  function render(){
    if(state.map){ state.map.remove(); state.map = null; }
    const root = $('#app');
    if(!root) return;
    const city = cityById();
    const visual = cityVisual(city);
    root.innerHTML = `<div class="ml">
      <header class="top">
        <a class="brand" href="#" data-view="overview"><img src="./mayday-logo.svg?v=${VERSION}" alt="Mayday"><span><b>MAYDAYLAND</b><small>VISUAL DATA ATLAS · v${VERSION}</small></span></a>
        <nav class="nav">${Object.entries(views).map(([id,label]) => `<button class="${state.view===id?'active':''}" data-view="${id}">${label}</button>`).join('')}</nav>
        <label class="search">⌕<input id="search" placeholder="搜尋城市 / 場館 / 歌曲 / 素材" autocomplete="off"></label>
      </header>
      <section class="hero">
        <article class="hero-main glass"><span class="kicker">Rights-safe visual layer</span><h1>資料不亂堆，素材先安全入庫。</h1><p>v39 新增原創 SVG 占位素材，讓城市專題、場館攻略、票根與海報先有穩定視覺，不用未授權圖片，也不再破壞單入口架構。</p><div class="hero-actions"><button class="primary" data-view="assets">看素材庫</button><button class="ghost" data-view="city">看城市專題</button></div><div class="audit-strip"><span class="audit-pill">資料檔 ${Object.keys(state.fileState).length} 個</span><span class="audit-pill">視覺素材 ${globalVisuals().length} 個</span><span class="audit-pill">自評 ${state.index.currentInternalScore || 83}/85</span></div></article>
        <aside class="scoreboard glass">${score('架構','單入口','v39',100)}${score('資料','拆分載入','v36+v37',84)}${score('視覺','原創占位','可替換',82)}${score('目標','85 分','未收貨',83)}</aside>
      </section>
      <main class="shell">
        <aside class="rail panel glass">${rail()}</aside>
        <section class="stage">${viewContent()}</section>
        <aside class="dossier panel glass">${dossier(city, visual)}</aside>
      </main>
    </div>`;
    bind();
    if(state.view === 'map') requestAnimationFrame(initMap);
  }

  function score(k,b,s,v){ return `<article class="score"><span class="kicker">${esc(k)}</span><b>${esc(b)}</b><small>${esc(s)}</small><div class="meter" style="--v:${v}%"><i></i></div></article>`; }
  function rail(){ return `<span class="kicker">City index</span><h2>城市熱度</h2><p class="copy">城市、場館、素材和歌單現在由資料檔驅動；點選城市會同步右側 dossier 和城市專題。</p><div class="citylist">${state.data.cities.map(c => `<button class="city ${c.id===state.city?'active':''}" data-city="${esc(c.id)}"><b>${esc(c.city)}</b><span>${esc(c.visitsEstimate || c.heat || '')}</span><small>${esc(c.level || c.years || '')}</small></button>`).join('')}</div>`; }
  function dossier(city, visual){
    const venues = venuesFor(city);
    return `${visual ? `<div class="visual-hero"><img src="${esc(visual.src)}" alt="${esc(visual.label)}" loading="lazy"></div>` : `<div class="city-visual" style="background:${esc(city.tone || '#26314c')}"><div><span class="kicker">City dossier</span><h2>${esc(city.city)}</h2></div></div>`}<div class="pillrow"><span class="pill">${esc(city.level || '城市節點')}</span><span class="pill">熱度 ${esc(city.heat || city.visitsEstimate || '-')}</span><span class="pill">場館 ${venues.length}</span></div><p class="copy">${esc(city.story || city.hero || '')}</p><section><h2>歌單核心</h2><div class="setlist">${setlistTheme(city).slice(0,6).map((s,i)=>`<div class="track"><span>${i+1}. ${esc(s)}</span><button data-track="${esc(s)}">播放</button></div>`).join('')}</div></section><section><h2>照片牆缺口</h2><div class="photo-slots"><div class="photo-slot"><b>場館外觀</b><span>pending licensed image</span></div><div class="photo-slot"><b>票根 / 場刊</b><span>pending verified asset</span></div></div></section>`;
  }

  function viewContent(){
    const city = cityById();
    return `<section class="view ${state.view==='overview'?'active':''}">${overview()}</section><section class="view ${state.view==='map'?'active':''}">${mapView()}</section><section class="view ${state.view==='city'?'active':''}">${cityView(city)}</section><section class="view ${state.view==='venues'?'active':''}">${venuesView()}</section><section class="view ${state.view==='setlists'?'active':''}">${setlistsView()}</section><section class="view ${state.view==='assets'?'active':''}">${assetsView()}</section><section class="view ${state.view==='sources'?'active':''}">${sourcesView()}</section><section class="view ${state.view==='research'?'active':''}">${researchView()}</section>${player()}`;
  }
  function overview(){
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">v39 overview</span><h2>資料 + 素材連接狀態</h2><p class="copy">這裡顯示資料檔、補全資料與原創素材是否載入。後面補照片、票根、場刊時，只改 data/ 與 assets/。</p></div></div><div class="factgrid">${Object.keys({...state.index.baseFiles,...state.index.enrichmentFiles}).map(k=>`<div class="fact"><span class="kicker">${esc(k)}</span><b>${statusText(k)}</b><small>${state.fileState[k]==='ok'?'已載入':'使用 fallback 或待檢查'}</small></div>`).join('')}</div></article>${assetsPreview()}`;
  }
  function mapView(){ return `<article class="section glass mapcard"><div class="section-head"><div><span class="kicker">Tour heat map</span><h2>巡演熱度地圖</h2><p class="copy">保留真實地圖層；城市視覺和資料改由外部 JSON 驅動。</p></div></div><div id="tourMap" class="mapwrap"></div></article>`; }
  function cityView(city){ const land = landingFor(city); const visual = cityVisual(city); const modules = arr(land.modules || land.sections || land.blocks); return `<article class="section glass"><div class="section-head"><div><span class="kicker">City landing</span><h2>${esc(city.city)}專題頁</h2><p class="copy">${esc(land.story || city.story || city.hero || '')}</p></div></div><div class="city-landing-visual">${visual ? `<div class="visual-hero"><img src="${esc(visual.src)}" alt="${esc(visual.label)}" loading="lazy"></div>` : ''}<div class="card"><h3>專題模組</h3><ul class="roadmap">${(modules.length?modules:city.todo || []).map(m=>`<li>${esc(pick(m,['title','label','name'],m))}</li>`).join('')}</ul></div></div></article><article class="section glass"><div class="widegrid">${venuesFor(city).map(v=>`<div class="card"><h3>${esc(v.name)}</h3><p>${esc(v.story || '')}</p><small>${esc((v.needs || []).join(' / '))}</small></div>`).join('') || '<div class="empty">此城市需要補場館資料。</div>'}</div></article>`; }
  function venuesView(){ const guides = arr(state.data.venueGuides); const venues = arr(state.data.venues); const cards = (guides.length?guides:venues).map(v=>`<article class="guide-card"><span class="kicker">${esc(pick(v,['city','cityId','type'],'venue'))}</span><h3>${esc(pick(v,['name','venue','title','id']))}</h3><p class="copy">${esc(pick(v,['story','summary','position'],'待補場館攻略。'))}</p><ul>${arr(v.needs || v.todo || v.access || v.modules).slice(0,6).map(n=>`<li>${esc(pick(n,['title','label','name'],n))}</li>`).join('')}</ul></article>`).join(''); return `<article class="section glass"><div class="section-head"><div><span class="kicker">Venue guide</span><h2>場館攻略資料</h2></div></div><div class="venue-guide">${cards}</div></article>`; }
  function setlistsView(){ const days = arr(state.data.setlistDays); const city = cityById(); const fallbackDays = [{title:city.city+' 歌單模板',status:'needs-verification',songs:setlistTheme(city)}]; const list = days.length ? days : fallbackDays; return `<article class="section glass"><div class="section-head"><div><span class="kicker">Setlist days</span><h2>逐站歌單</h2><p class="warning">未核對完整曲序的歌單只顯示為模板，不標官方完整歌單。</p></div></div><div class="setlist-table">${list.map(d=>{const songs=arr(d.songs || d.setlist || d.tracks || d.coreSongs);return `<article class="setlist-day"><header><b>${esc(pick(d,['title','date','city','id'],'Setlist'))}</b><span class="pill">${esc(pick(d,['status','verification'],'needs-verification'))}</span></header><ol>${songs.slice(0,12).map(s=>`<li>${esc(s)}</li>`).join('')}</ol></article>`;}).join('')}</div></article>`; }
  function assetsPreview(){ const items = globalVisuals().slice(0,3); return `<article class="section glass"><div class="section-head"><div><span class="kicker">Visual preview</span><h2>原創素材預覽</h2></div></div><div class="visual-grid">${items.map(assetCard).join('')}</div></article>`; }
  function assetsView(){ const items = globalVisuals(); return `<article class="section glass"><div class="section-head"><div><span class="kicker">Asset library</span><h2>素材庫</h2><p class="copy">這批是原創 SVG 安全占位；可直接展示，不碰未授權照片。</p></div></div><div class="visual-grid">${items.map(assetCard).join('')}</div></article>`; }
  function assetCard(x){ return `<article class="visual-card"><img src="${esc(x.src)}" alt="${esc(x.label)}" loading="lazy"><div><b>${esc(x.label || x.id)}</b><small>${esc(x.status || '')} · ${esc(x.replaceWhen || '')}</small></div></article>`; }
  function sourcesView(){ const src = [...arr(state.data.sources),...arr(state.data.officialSources)]; return `<article class="section glass"><div class="section-head"><div><span class="kicker">Official sources</span><h2>來源牆</h2></div></div><div class="sourcegrid">${src.map(s=>`<article class="sourcecard"><b>${esc(pick(s,['title','label','name','id']))}</b><small>${esc(pick(s,['summary','description','note','type'],''))}</small>${pick(s,['url','href'],null)?`<a href="${esc(pick(s,['url','href']))}" target="_blank" rel="noopener">查看來源</a>`:''}</article>`).join('')}</div></article>`; }
  function researchView(){ const q = arr(state.data.researchQueue); const road = arr(state.data.roadmap && state.data.roadmap.contentRoadmap); const list = q.length?q:road; return `<article class="section glass"><div class="section-head"><div><span class="kicker">Research queue</span><h2>補全隊列</h2></div></div><div class="roadcards">${list.map(t=>`<article class="card"><span class="kicker">${esc(pick(t,['priority','level','status'],'todo'))}</span><h3>${esc(pick(t,['title','label','name','id'],'補全任務'))}</h3><p>${esc(pick(t,['summary','description','note'],'繼續補官方核對資料與素材。'))}</p></article>`).join('')}</div></article>`; }
  function player(){ return `<aside class="player glass"><div class="player-main"><div class="disc"></div><div><b>${esc(state.track)}</b><small>Maydayland queue · v39</small></div></div><div class="controls"><button>⏮</button><button>▶</button><button>⏭</button></div></aside>`; }

  function initMap(){
    const el = $('#tourMap');
    if(!el || !window.L) return;
    state.map = L.map(el,{zoomControl:true,scrollWheelZoom:true}).setView([25.8,119.8],5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap'}).addTo(state.map);
    state.data.cities.forEach(c => {
      const size = Math.max(22, Math.min(58, 18 + Number(c.heat || c.visitsEstimate || 10) / 2));
      const icon = L.divIcon({className:'',html:`<span class="citypin" style="--s:${size}px;--tone:${esc(c.tone || '#ffd36a')}">${esc(c.city.slice(0,1))}</span>`,iconSize:[size,size],iconAnchor:[size/2,size/2]});
      L.marker([c.lat,c.lng],{icon}).addTo(state.map).on('click',()=>{state.city=c.id;state.view='city';render();});
    });
  }
  function bind(){
    $$('[data-view]').forEach(btn => btn.addEventListener('click', e => {e.preventDefault(); state.view = btn.dataset.view; render();}));
    $$('[data-city]').forEach(btn => btn.addEventListener('click', () => {state.city = btn.dataset.city; state.view = state.view === 'overview' ? 'city' : state.view; render();}));
    $$('[data-track]').forEach(btn => btn.addEventListener('click', () => {state.track = btn.dataset.track; render();}));
    const search = $('#search');
    if(search) search.addEventListener('keydown', e => { if(e.key !== 'Enter') return; const q = search.value.trim().toLowerCase(); const hit = state.data.cities.find(c => (c.city + ' ' + c.id).toLowerCase().includes(q)); if(hit){state.city = hit.id; state.view = 'city'; render();} });
  }
})();
