(() => {
  'use strict';
  const VERSION = '36.0.0';
  const FILES = {
    meta: './data/meta-v36.json?v=36.0.0',
    cities: './data/cities-v36.json?v=36.0.0',
    venues: './data/venues-v36.json?v=36.0.0',
    albums: './data/albums-v36.json?v=36.0.0',
    setlists: './data/setlists-v36.json?v=36.0.0',
    sources: './data/sources-v36.json?v=36.0.0',
    assets: './data/assets-v36.json?v=36.0.0',
    roadmap: './data/roadmap-v36.json?v=36.0.0'
  };
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const fallback = {
    meta:{version:VERSION,title:'Maydayland · Data Atlas',qualityGate:85,currentScore:76,dataPrinciple:'資料檔載入失敗，使用備援資料。',dataFiles:Object.keys(FILES),scoreModel:[]},
    cities:[{id:'taipei',city:'台北',lat:25.037,lng:121.565,heat:100,visitsEstimate:26,venueIds:['taipei-dome'],years:'1999–2026',level:'核心主場',score:76,tone:'#ff70b7',status:'fallback',hero:'台灣主場',story:'資料載入失敗時的備援模板。',setlistTheme:'homecoming',albumRefs:[],sourceIds:[],todo:['重新載入資料檔']}],
    venues:[], albums:[], setlists:{themes:{homecoming:['倔強','知足','乾杯']},playlists:[]}, sources:[], assets:{cityAssets:[],venueAssets:[],albumAssets:[]}, roadmap:{timeline:[],publications:[],contentRoadmap:[]}
  };
  const state = {data:fallback,fileState:{},view:'map',city:'taipei',track:'倔強 · 現場心跳版',map:null,layer:'street'};
  const viewLabels = {map:'巡演地圖',albums:'時光唱片室',songs:'歌曲宇宙',venues:'場館資料',sources:'來源牆',roadmap:'補全路線'};

  document.addEventListener('DOMContentLoaded', init);

  async function init(){
    const entries = Object.entries(FILES);
    const results = await Promise.all(entries.map(async ([key,url]) => {
      try{
        const res = await fetch(url,{cache:'no-store'});
        if(!res.ok) throw new Error('HTTP '+res.status);
        const json = await res.json();
        state.fileState[key] = 'ok';
        return [key,json];
      }catch(err){
        console.warn('Maydayland data file fallback', key, err);
        state.fileState[key] = 'fallback';
        return [key,fallback[key]];
      }
    }));
    state.data = Object.assign({}, fallback, Object.fromEntries(results));
    state.city = city()?.id || state.data.cities[0].id;
    render();
  }

  function d(){ return state.data || fallback; }
  function city(id=state.city){ return (d().cities || []).find(c => c.id === id) || (d().cities || [])[0]; }
  function source(id){ return (d().sources || []).find(s => s.id === id); }
  function venue(id){ return (d().venues || []).find(v => v.id === id); }
  function venuesFor(c){ return (c.venueIds || []).map(venue).filter(Boolean); }
  function songsFor(c){ const themes = d().setlists?.themes || {}; return themes[c.setlistTheme] || themes.homecoming || []; }
  function albumsFor(c){ const ids = new Set(c.albumRefs || []); return (d().albums || []).filter(a => ids.has(a.id)); }
  function assetSummary(c){
    const assets = d().assets || {}; const list = [...(assets.cityAssets || []), ...(assets.venueAssets || [])];
    return list.filter(a => a.cityId === c.id || venuesFor(c).some(v => v.assetKey === a.key || v.id === a.venueId));
  }

  function render(){
    if(state.map){ state.map.remove(); state.map = null; }
    const root = $('#app'); if(!root) return;
    const meta = d().meta || fallback.meta; const c = city();
    root.innerHTML = `<div class="ml">
      <header class="top">
        <a class="brand" href="#" data-view="map"><img src="./mayday-logo.svg?v=${VERSION}" alt="Mayday"><span><b>MAYDAYLAND</b><small>DATA SPLIT · v${esc(meta.version || VERSION)}</small></span></a>
        <nav class="nav">${Object.entries(viewLabels).map(([id,label])=>`<button class="${state.view===id?'active':''}" data-view="${id}">${label}</button>`).join('')}</nav>
        <label class="search">⌕<input id="search" placeholder="搜索城市、場館、歌單…" autocomplete="off"></label>
      </header>
      ${hero(meta)}
      <main class="shell">
        <aside class="rail panel glass">${rail()}</aside>
        <section class="stage">${views()}</section>
        <aside class="dossier panel glass">${cityPanel(c)}</aside>
      </main>
    </div>`;
    bind();
    if(state.view === 'map') requestAnimationFrame(initMap);
  }

  function hero(meta){
    const ok = Object.values(state.fileState).filter(v=>v==='ok').length;
    const total = Object.keys(FILES).length;
    const facts = meta.officialFacts || [];
    return `<section class="hero">
      <article class="hero-main glass"><span class="kicker">Data engineering build</span><h1>資料拆分後的五月天巡演資料館</h1><p>${esc(meta.dataPrinciple || '')}</p><div class="hero-actions"><a class="primary" href="#" data-view="sources">查看來源牆</a><button class="ghost" data-view="roadmap">補全路線</button></div><div class="datafile-grid">${Object.keys(FILES).map(k=>`<div class="datafile ${state.fileState[k] || 'fallback'}"><b>${esc(k)}.json</b><span>${state.fileState[k]==='ok'?'已載入':'fallback'}</span></div>`).join('')}</div></article>
      <aside class="scoreboard glass"><div class="score"><span class="kicker">Data files</span><b>${ok}/${total}</b><small>拆分資料檔載入狀態</small><div class="meter" style="--v:${Math.round(ok/total*100)}%"><i></i></div></div><div class="score"><span class="kicker">Quality gate</span><b>${esc(meta.currentScore || 0)}/${esc(meta.qualityGate || 85)}</b><small>未達 85 不叫收貨</small><div class="meter" style="--v:${esc(meta.currentScore || 0)}%"><i></i></div></div>${facts.slice(0,2).map(f=>`<div class="score"><span class="kicker">${esc(f.label)}</span><b>${esc(f.value)}</b><small>${esc(f.sourceId)}</small></div>`).join('')}</aside>
    </section>`;
  }

  function rail(){
    const cities = d().cities || [];
    const total = cities.reduce((sum,c)=>sum+(c.visitsEstimate || 0),0);
    return `<span class="kicker">Route index</span><h2>城市熱度</h2><p class="copy">城市資料已拆到 <b>cities-v36.json</b>；場館、歌單、來源和素材缺口由其他資料檔補充。</p><div class="pillrow"><span class="pill">${cities.length} 城市</span><span class="pill">${total} 熱度估算</span><span class="pill">${Object.keys(FILES).length} 資料檔</span></div><div class="citylist">${cities.map(c=>`<button class="city ${c.id===state.city?'active':''}" data-city="${esc(c.id)}"><b>${esc(c.city)}</b><span>${esc(c.visitsEstimate || c.heat || 0)}</span><small>${esc(c.level)} · ${esc(c.years)}</small></button>`).join('')}</div>`;
  }

  function views(){
    return `<section class="view ${state.view==='map'?'active':''}">${mapView()}</section><section class="view ${state.view==='albums'?'active':''}">${albumsView()}</section><section class="view ${state.view==='songs'?'active':''}">${songsView()}</section><section class="view ${state.view==='venues'?'active':''}">${venuesView()}</section><section class="view ${state.view==='sources'?'active':''}">${sourcesView()}</section><section class="view ${state.view==='roadmap'?'active':''}">${roadmapView()}</section>${player()}`;
  }

  function mapView(){
    return `<article class="section mapcard glass"><div class="section-head"><div><span class="kicker">Split data map</span><h2>巡演熱度地圖</h2><p class="copy">地圖讀取 cities、venues、sources 三組資料；點城市會同步右側城市檔案。</p></div><div class="tabs"><button class="chip ${state.layer==='street'?'active':''}" data-layer="street">街道</button><button class="chip ${state.layer==='dark'?'active':''}" data-layer="dark">深色</button></div></div><div id="tourMap" class="mapwrap"></div><div class="legend"><span><i class="dot"></i>熱度估算</span><span><i class="dot" style="background:var(--gold)"></i>官方資料較完整</span><span><i class="dot" style="background:var(--pink)"></i>待補素材</span></div></article><article class="section glass"><div class="section-head"><div><span class="kicker">Data layer</span><h2>資料分層狀態</h2></div></div>${fileStatus()}</article>`;
  }

  function cityPanel(c){
    if(!c) return '';
    const vs = venuesFor(c); const tracks = songsFor(c); const albums = albumsFor(c); const assets = assetSummary(c);
    return `<div class="city-visual" style="background:linear-gradient(135deg,#091426,${esc(c.tone)},#13253d)"><div><span class="kicker">City dossier</span><h2>${esc(c.city)}</h2><p>${esc(c.level)} · ${esc(c.years)}</p></div></div><div class="citymetric"><div class="metricbox"><b>${esc(c.heat)}</b><small>熱度</small></div><div class="metricbox"><b>${esc(c.score)}</b><small>資料分</small></div><div class="metricbox"><b>${esc(vs.length)}</b><small>場館</small></div></div><p class="copy">${esc(c.story || c.hero)}</p><section><div class="section-head"><h2>代表歌單</h2></div><div class="setlist">${tracks.map((s,i)=>`<div class="track"><span>${i+1}. ${esc(s)}</span><button data-track="${esc(s)}">播放</button></div>`).join('')}</div></section><section><div class="section-head"><h2>關聯專輯</h2></div><div class="pillrow">${albums.map(a=>`<span class="pill">${esc(a.title)}</span>`).join('') || '<span class="pill">待補</span>'}</div></section><section><div class="section-head"><h2>場館</h2></div><div class="sourcegrid">${vs.map(v=>`<div class="asset"><b>${esc(v.name)}</b><span>${esc(v.story)}</span></div>`).join('') || '<div class="empty">待補場館資料</div>'}</div></section><section><div class="section-head"><h2>素材狀態</h2></div><div class="asset-status">${assets.map(a=>`<div class="asset"><b>${esc(a.key || a.target)}</b><span>${esc(a.status)} · ${esc(a.need || a.target || '')}</span></div>`).join('') || '<div class="empty">待補素材清單</div>'}</div></section><section><div class="section-head"><h2>補完 Roadmap</h2></div><ul class="roadmap">${(c.todo||[]).map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section>${sourceLinks(c.sourceIds)}`;
  }

  function albumsView(){
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">Albums data</span><h2>時光唱片室</h2><p class="copy">專輯資料已拆到 albums-v36.json；缺封面者會明確顯示，不用空白硬撐。</p></div></div><div class="grid">${(d().albums||[]).map(a=>`<article class="album"><span class="cover ${a.cover?'':'pending'}">${a.cover?`<img src="${esc(a.cover)}" alt="${esc(a.title)}" loading="lazy">`:'NEEDS COVER'}</span><b>${esc(a.title)}</b><small>${esc(a.year)} · ${esc(a.tag)} · ${esc(a.status)}</small><div class="pillrow">${(a.tracks||[]).slice(0,3).map(t=>`<span class="pill">${esc(t)}</span>`).join('')}</div></article>`).join('')}</div></article>`;
  }

  function songsView(){
    const playlists = d().setlists?.playlists || [];
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">Setlists data</span><h2>歌曲宇宙</h2><p class="copy">目前為代表歌單與主題歌單，未聲稱完整逐日官方歌單。下一步在 setlists-v36.json 補日期與來源。</p></div></div><div class="widegrid">${playlists.map(p=>`<article class="card"><span class="kicker">${esc(p.mood)}</span><h3>${esc(p.title)}</h3><div class="setlist">${(p.tracks||[]).map(t=>`<div class="track"><span>${esc(t)}</span><button data-track="${esc(t)}">播放</button></div>`).join('')}</div></article>`).join('')}</div></article>`;
  }

  function venuesView(){
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">Venues data</span><h2>場館資料</h2><p class="copy">場館獨立到 venues-v36.json，之後可以接交通、座位、照片牆與周邊路線。</p></div></div><div class="venuegrid">${(d().venues||[]).map(v=>`<article class="venuecard"><span class="kicker">${esc(v.type)} · ${esc(v.status)}</span><h3>${esc(v.name)}</h3><p class="copy">${esc(v.story)}</p><small>City: ${esc(v.cityId)} · Asset: ${esc(v.assetKey)}</small><div class="pillrow">${(v.needs||[]).map(n=>`<span class="pill">${esc(n)}</span>`).join('')}</div></article>`).join('')}</div></article>`;
  }

  function sourcesView(){
    const facts = d().meta?.officialFacts || [];
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">Sources</span><h2>來源牆</h2><p class="copy">來源已獨立到 sources-v36.json，城市、專輯、時間線只保存 sourceId。</p></div></div><div class="factgrid">${facts.map(f=>`<article class="fact"><span class="kicker">${esc(f.label)}</span><b>${esc(f.value)}</b><small>${esc(f.sourceId)}</small></article>`).join('')}</div><div class="sourcegrid" style="margin-top:14px">${(d().sources||[]).map(s=>`<article class="sourcecard"><strong>${esc(s.name)}</strong><small>${esc(s.type)} · ${esc(s.status)}</small><p class="copy">${(s.useFor||[]).map(esc).join(' / ')}</p><a href="${esc(s.url)}" target="_blank" rel="noopener">打開來源</a></article>`).join('')}</div></article>`;
  }

  function roadmapView(){
    const r = d().roadmap || {};
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">Completion roadmap</span><h2>補全路線</h2><p class="copy">v36 已完成資料拆分；下一步不是亂加 UI，而是逐項補資料和素材。</p></div></div><div class="roadcards">${(r.contentRoadmap||[]).map(p=>`<article class="card phase ${esc(p.status)}"><span class="kicker">${esc(p.status)} · ${esc(p.scoreTarget)}分</span><h3>${esc(p.phase)}</h3><ul class="roadmap">${(p.items||[]).map(i=>`<li>${esc(i)}</li>`).join('')}</ul></article>`).join('')}</div></article><article class="section glass"><div class="section-head"><h2>時間線 / 出版資料</h2></div><div class="timeline">${(r.timeline||[]).map(t=>`<div class="time"><div class="year">${esc(t.year)}</div><div><b>${esc(t.title)}</b><p class="copy">${esc(t.detail)}</p></div></div>`).join('')}</div><div class="widegrid" style="margin-top:16px">${(r.publications||[]).map(p=>`<article class="card"><span class="kicker">${esc(p.type)} · ${esc(p.status)}</span><h3>${esc(p.title)}</h3><p>${esc(p.need)}</p></article>`).join('')}</div></article>`;
  }

  function sourceLinks(ids=[]){
    const cards = ids.map(id => source(id)).filter(Boolean);
    return `<section><div class="section-head"><h2>來源</h2></div>${cards.map(s=>`<a class="source" href="${esc(s.url)}" target="_blank" rel="noopener"><b>${esc(s.name)}</b><small>${esc(s.status)}</small></a>`).join('') || '<div class="empty">待補來源</div>'}</section>`;
  }

  function fileStatus(){
    return `<div class="datafile-grid">${Object.keys(FILES).map(k=>`<div class="datafile ${state.fileState[k] || 'fallback'}"><b>${esc(k)}</b><span>${esc(FILES[k])}</span></div>`).join('')}</div><div class="dataset-note">資料讀取失敗時會使用 fallback，不會讓頁面白屏；後續補資料優先改 data/*.json。</div>`;
  }

  function player(){
    return `<footer class="player glass"><div class="player-main"><span class="disc"></span><span><small>MAYDAYLAND RADIO</small><b id="nowTrack">${esc(state.track)}</b></span></div><div class="controls"><button data-play="prev">‹</button><button data-play="play">▶</button><button data-play="next">›</button></div></footer>`;
  }

  function nav(id,label){ return `<button class="${state.view===id?'active':''}" data-view="${id}">${label}</button>`; }

  function bind(){
    $$('[data-view]').forEach(btn => btn.addEventListener('click', e => {e.preventDefault(); const v=btn.dataset.view; if(viewLabels[v]){state.view=v; render();}}));
    $$('[data-city]').forEach(btn => btn.addEventListener('click', () => {state.city=btn.dataset.city; state.view='map'; render();}));
    $$('[data-track]').forEach(btn => btn.addEventListener('click', () => {state.track=btn.dataset.track+' · Maydayland queue'; const n=$('#nowTrack'); if(n) n.textContent=state.track;}));
    $$('[data-layer]').forEach(btn => btn.addEventListener('click', () => {state.layer=btn.dataset.layer; render();}));
    const search = $('#search');
    if(search){ search.addEventListener('keydown', e => { if(e.key !== 'Enter') return; const q=search.value.trim().toLowerCase(); const hit=(d().cities||[]).find(c => c.city.toLowerCase().includes(q) || c.id.includes(q)); if(hit){ state.city=hit.id; state.view='map'; render(); }}); }
  }

  function initMap(){
    const el = $('#tourMap'); if(!el || !window.L) return;
    const cities = d().cities || [];
    state.map = L.map(el,{zoomControl:true,scrollWheelZoom:true}).setView([25.8,118.5],4);
    const url = state.layer === 'dark' ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attr = state.layer === 'dark' ? '&copy; OpenStreetMap &copy; CARTO' : '&copy; OpenStreetMap contributors';
    L.tileLayer(url,{maxZoom:18,attribution:attr}).addTo(state.map);
    const pts = [];
    cities.forEach(c => {
      const size = Math.max(28, Math.min(68, 24 + (c.heat || c.visitsEstimate || 10) * .42));
      const icon = L.divIcon({className:'',html:`<div class="citypin v36" style="--s:${size}px;--tone:${esc(c.tone)}">${esc(c.city.slice(0,1))}</div>`,iconSize:[size,size],iconAnchor:[size/2,size/2]});
      const marker = L.marker([c.lat,c.lng],{icon}).addTo(state.map);
      marker.bindPopup(`<b>${esc(c.city)}</b><br>${esc(c.level)}<br>資料分：${esc(c.score)}`);
      marker.on('click',()=>{state.city=c.id; render();});
      pts.push([c.lat,c.lng]);
    });
    if(pts.length > 1) L.polyline(pts,{color:'#ffd36a',weight:2,opacity:.48,dashArray:'6 10'}).addTo(state.map);
    setTimeout(()=> state.map && state.map.invalidateSize(), 120);
  }
})();
