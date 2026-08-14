(() => {
  'use strict';
  const DATA_URL = './data/maydayland-v35.json?v=35.0.0';
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const fallback = {version:'35.0.0',meta:{qualityGate:85,currentScore:76,principle:'資料載入中'},officialFacts:[],cities:[{id:'taipei',city:'台北',lat:25.037,lng:121.565,visits:26,venue:'台北大巨蛋 / 台北小巨蛋',years:'1999–2026',level:'核心主場',score:76,tone:'#ff70b7',status:'fallback',hero:'台灣主場',story:'資料載入失敗時的備援模板。',setlist:['倔強','知足','乾杯'],albums:['知足 最真傑作選'],todo:['重新載入資料檔'],assets:{photoWall:'pending'},sourceIds:[]}],albums:[],playlists:[],publications:[],timeline:[],sources:[],contentRoadmap:[]};
  const state = {data:null,view:'map',city:'taipei',track:'倔強 · 現場心跳版',layer:'street',map:null,load:'loading'};

  document.addEventListener('DOMContentLoaded', init);

  async function init(){
    try{
      const res = await fetch(DATA_URL,{cache:'no-store'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      state.data = await res.json();
      state.load = 'loaded';
      state.city = cityById(state.city)?.id || state.data.cities[0].id;
    }catch(err){
      console.warn('Maydayland data fallback', err);
      state.data = fallback;
      state.load = 'fallback';
      state.city = fallback.cities[0].id;
    }
    render();
  }

  function data(){return state.data || fallback;}
  function cityById(id=state.city){return data().cities.find(c=>c.id===id) || data().cities[0];}
  function sourceById(id){return data().sources.find(s=>s.id===id);}

  function render(){
    if(state.map){state.map.remove();state.map=null;}
    const root = $('#app');
    if(!root) return;
    const d = data();
    root.innerHTML = `<div class="ml">
      <header class="top">
        <a class="brand" href="#" data-view="map"><img src="./mayday-logo.svg?v=35.0.0" alt="Mayday"><span><b>MAYDAYLAND</b><small>DATA ATLAS · v${esc(d.version)}</small></span></a>
        <nav class="nav">${nav('map','巡演地圖')}${nav('albums','時光唱片室')}${nav('songs','歌曲宇宙')}${nav('books','書籍出版')}${nav('timeline','歷程')}${nav('sources','來源牆')}</nav>
        <label class="search">⌕<input id="search" placeholder="搜尋城市、場館、歌曲…" autocomplete="off"></label>
      </header>
      <section class="hero">
        <article class="hero-main glass"><span class="data-badge">DATA FOLDER · maydayland/data</span><h1>五月天巡演地圖與時光資料館</h1><p>v35 已把城市、專輯、歌單、出版、時間線與來源拆到資料檔。後續補資料只改 data，不再破壞介面結構。</p><div class="hero-actions"><button class="primary" data-view="map">查看巡演地圖</button><button class="ghost" data-view="sources">查看來源牆</button></div><p class="load-note">資料狀態：${state.load==='loaded'?'已讀取 data/maydayland-v35.json':'使用備援資料'}</p></article>
        <aside class="scoreboard glass">${score('品質門檻', d.meta.qualityGate+' 分','未到收貨標準', d.meta.qualityGate)}${score('目前完成', d.meta.currentScore+' 分','資料工程化後再補素材', d.meta.currentScore)}${score('城市資料', d.cities.length+' 個','城市檔案模板',82)}${score('資料狀態', state.load==='loaded'?'已載入':'備援','data/maydayland-v35.json', state.load==='loaded'?100:45)}</aside>
      </section>
      <main class="shell"><aside class="rail panel glass">${rail()}</aside><section class="stage">${viewMarkup()}${player()}</section><aside class="dossier panel glass">${cityPanel(cityById())}</aside></main>
    </div>`;
    bind();
    if(state.view==='map') requestAnimationFrame(initMap);
  }

  function nav(id,label){return `<button class="${state.view===id?'active':''}" data-view="${id}">${label}</button>`;}
  function score(title,big,small,val){return `<div class="score"><span class="kicker">${esc(title)}</span><b>${esc(big)}</b><small>${esc(small)}</small><div class="meter" style="--v:${Number(val)||0}%"><i></i></div></div>`;}

  function rail(){
    const d=data();
    const total=d.cities.reduce((sum,c)=>sum+Number(c.visits||0),0);
    return `<span class="kicker">Route index</span><h2>城市熱度</h2><p class="copy">點選城市會同步地圖、右側 dossier 和歌曲播放器。熱度越高，地圖節點越醒目。</p><div class="pillrow"><span class="pill">${total} 熱度</span><span class="pill">${d.cities.length} 城市</span><span class="pill">v${esc(d.version)}</span></div><div class="citylist">${d.cities.map(c=>`<button class="city ${c.id===state.city?'active':''}" data-city="${esc(c.id)}"><b>${esc(c.city)}</b><span>${esc(c.visits)}</span><small>${esc(c.venue)}</small></button>`).join('')}</div><div class="statusline"><span>下一步：逐站日期、官方照片、場館交通、票根資料</span><b>${esc(d.meta.currentScore)}/85</b></div>`;
  }

  function viewMarkup(){
    if(state.view==='albums') return albumsView();
    if(state.view==='songs') return songsView();
    if(state.view==='books') return booksView();
    if(state.view==='timeline') return timelineView();
    if(state.view==='sources') return sourcesView();
    return mapView();
  }

  function mapView(){
    const d=data();
    return `<section class="view active"><article class="section mapcard glass"><div class="section-head"><div><span class="kicker">Tour heat map</span><h2>巡演熱度地圖</h2><p class="copy">地圖與城市節點由 data 資料驅動，避免再把資料硬寫在 JS 裡。</p></div><div class="tabs"><button class="chip ${state.layer==='street'?'active':''}" data-layer="street">街道</button><button class="chip ${state.layer==='dark'?'active':''}" data-layer="dark">深色</button></div></div><div id="tourMap" class="mapwrap"></div><div class="legend"><span><i class="dot"></i>熱度節點</span><span><i class="dot" style="background:var(--gold)"></i>官方資料較完整</span><span><i class="dot" style="background:var(--pink)"></i>素材待補</span></div></article><article class="section glass"><div class="section-head"><div><span class="kicker">Verified facts</span><h2>已接入官方事實</h2><p class="copy">每條事實都以 sourceId 指向來源牆。</p></div></div><div class="factgrid">${d.officialFacts.map(f=>{const s=sourceById(f.sourceId);return `<div class="fact"><span class="kicker">${esc(f.label)}</span><b>${esc(f.value)}</b><small>${s?esc(s.name):'source pending'}</small></div>`}).join('')}</div></article><article class="section glass"><div class="section-head"><div><span class="kicker">Content roadmap</span><h2>資料補全路線</h2></div></div><div class="roadcards">${d.contentRoadmap.map(r=>`<div class="card"><h3>${esc(r.area)}</h3><p>已完成：${esc((r.done||[]).join(' / '))}</p><p>下一步：${esc((r.next||[]).join(' / '))}</p></div>`).join('')}</div></article></section>`;
  }

  function cityPanel(c){
    const citySources=(c.sourceIds||[]).map(sourceById).filter(Boolean);
    return `<div class="city-visual" style="background:linear-gradient(135deg,#091426,${esc(c.tone)},#13253d)"><div><span class="kicker">City dossier</span><h2>${esc(c.city)}</h2><p>${esc(c.level)} · ${esc(c.years)}</p></div></div><div class="pillrow"><span class="pill">${esc(c.visits)} 次熱度</span><span class="pill">完成度 ${esc(c.score)}%</span><span class="pill">${esc(c.status)}</span></div><p class="copy">${esc(c.story||c.hero)}</p><section><h2>推薦歌單</h2><div class="setlist">${(c.setlist||[]).map((song,i)=>`<div class="track"><span>${i+1}. ${esc(song)}</span><button data-track="${esc(song)}">播放</button></div>`).join('')}</div></section><section><h2>素材狀態</h2><div class="assetgrid">${Object.entries(c.assets||{}).map(([k,v])=>`<div class="asset"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('')}</div></section><section><h2>補完 Roadmap</h2><div class="roadmap">${(c.todo||[]).map(t=>`<div class="track"><span>${esc(t)}</span></div>`).join('')}</div></section><section><h2>城市來源</h2>${citySources.length?citySources.map(s=>`<a class="source" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}<small>${esc(s.type)}</small></a>`).join(''):'<div class="empty">此城市仍需要補官方來源與授權圖片。</div>'}</section>`;
  }

  function albumsView(){
    const d=data();
    return `<section class="view active"><article class="section glass"><div class="section-head"><div><span class="kicker">Discography room</span><h2>時光唱片室</h2><p class="copy">專輯資料已從 JS 拆到 data 檔，封面、曲目、來源與狀態可以逐步補全。</p></div></div><div class="grid">${d.albums.map(a=>`<article class="album"><span class="cover ${a.cover?'':'pending'}">${a.cover?`<img src="${esc(a.cover)}" alt="${esc(a.title)}" loading="lazy">`:'COVER PENDING'}</span><b>${esc(a.title)}</b><small>${esc(a.year)} · ${esc(a.tag)} · ${esc(a.status)}</small><div class="setlist">${(a.tracks||[]).slice(0,3).map(song=>`<div class="track"><span>${esc(song)}</span><button data-track="${esc(song)}">播放</button></div>`).join('')}</div></article>`).join('')}</div></article></section>`;
  }

  function songsView(){
    const d=data();
    return `<section class="view active"><article class="section glass"><div class="section-head"><div><span class="kicker">Playlist universe</span><h2>歌曲宇宙</h2><p class="copy">先用主題歌單承接播放器，後續補逐日 setlist、嘉賓、彩蛋與現場版本。</p></div></div><div class="widegrid">${d.playlists.map(list=>`<div class="card"><span class="kicker">${esc(list.mood)}</span><h3>${esc(list.title)}</h3><div class="setlist">${list.songs.map(song=>`<div class="track"><span>${esc(song)}</span><button data-track="${esc(song)}">播放</button></div>`).join('')}</div></div>`).join('')}</div></article><article class="section glass"><div class="section-head"><div><span class="kicker">City setlists</span><h2>城市歌單入口</h2></div></div><div class="widegrid">${d.cities.slice(0,6).map(c=>`<div class="card"><h3>${esc(c.city)}</h3><p>${esc(c.level)}</p><div class="setlist">${(c.setlist||[]).slice(0,4).map(song=>`<div class="track"><span>${esc(song)}</span><button data-track="${esc(song)}">播放</button></div>`).join('')}</div></div>`).join('')}</div></article></section>`;
  }

  function booksView(){
    const d=data();
    return `<section class="view active"><article class="section glass"><div class="section-head"><div><span class="kicker">Books & publications</span><h2>書籍出版 / 場刊 / 票根</h2><p class="copy">這一頁已資料化，後續可以直接加入封面縮圖、出版資訊、票根模板與城市關聯。</p></div></div><div class="widegrid">${d.publications.map(item=>`<div class="card"><span class="kicker">${esc(item.type)}</span><h3>${esc(item.title)}</h3><p>${esc(item.status)}</p><div class="roadmap">${(item.todo||[]).map(t=>`<div class="track"><span>${esc(t)}</span></div>`).join('')}</div></div>`).join('')}</div></article></section>`;
  }

  function timelineView(){
    const d=data();
    return `<section class="view active"><article class="section glass"><div class="section-head"><div><span class="kicker">Memory timeline</span><h2>歷程展覽牆</h2><p class="copy">時間線已改由資料檔管理，之後可以補事件來源、關聯作品、巡演節點與照片牆。</p></div></div><div class="timeline">${d.timeline.map(t=>`<div class="time"><div class="year">${esc(t.year)}</div><div class="card"><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div></div>`).join('')}</div></article></section>`;
  }

  function sourcesView(){
    const d=data();
    return `<section class="view active"><article class="section glass"><div class="section-head"><div><span class="kicker">Source matrix</span><h2>來源牆</h2><p class="copy">城市、專輯、事實都用 sourceId 連到這裡，避免內容沒有出處。</p></div></div><div class="sourcegrid">${d.sources.map(s=>`<div class="sourcecard"><span class="kicker">${esc(s.type)}</span><h3>${esc(s.name)}</h3><a href="${esc(s.url)}" target="_blank" rel="noopener">打開來源</a></div>`).join('')}</div></article></section>`;
  }

  function player(){return `<footer class="player glass"><div class="player-main"><span class="disc"></span><span><small>MAYDAYLAND RADIO</small><b id="nowTrack">${esc(state.track)}</b></span></div><div class="controls"><button>‹</button><button>▶</button><button>›</button></div></footer>`;}

  function bind(){
    $$('[data-view]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();state.view=el.dataset.view;render();}));
    $$('[data-city]').forEach(el=>el.addEventListener('click',()=>{state.city=el.dataset.city;state.view='map';render();}));
    $$('[data-track]').forEach(el=>el.addEventListener('click',()=>{state.track=`${el.dataset.track} · Maydayland queue`;const now=$('#nowTrack');if(now)now.textContent=state.track;}));
    $$('[data-layer]').forEach(el=>el.addEventListener('click',()=>{state.layer=el.dataset.layer;render();}));
    const search=$('#search');
    if(search) search.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const q=search.value.trim().toLowerCase();const hit=data().cities.find(c=>[c.city,c.venue,c.level,c.country].some(x=>String(x).toLowerCase().includes(q)));if(hit){state.city=hit.id;state.view='map';render();}});
  }

  function initMap(){
    const el=$('#tourMap');
    if(!el || !window.L){if(el)el.innerHTML='<div class="empty">地圖資源未載入，稍後重試。</div>';return;}
    const c=cityById();
    state.map=L.map(el,{zoomControl:true,scrollWheelZoom:true}).setView([c.lat,c.lng],5);
    const street='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const dark='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    L.tileLayer(state.layer==='dark'?dark:street,{maxZoom:18,attribution:'&copy; OpenStreetMap contributors & CARTO'}).addTo(state.map);
    const line=[];
    data().cities.forEach(city=>{
      line.push([city.lat,city.lng]);
      const size=Math.max(24,Math.min(60,18+Number(city.visits||0)*1.4));
      const icon=L.divIcon({className:'city-marker',html:`<button class="citypin" style="--s:${size}px;--tone:${esc(city.tone)}" title="${esc(city.city)}">${esc(city.visits)}</button>`,iconSize:[size,size],iconAnchor:[size/2,size/2]});
      L.marker([city.lat,city.lng],{icon}).addTo(state.map).on('click',()=>{state.city=city.id;render();});
    });
    if(line.length>1)L.polyline(line,{color:'#63e7ff',weight:2,opacity:.42,dashArray:'6 8'}).addTo(state.map);
  }
})();
