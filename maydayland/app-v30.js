(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c));
  const cities = [
    {city:'台北', lat:25.037, lng:121.565, visits:26, venue:'台北大巨蛋 / 台北小巨蛋', years:'1999–2026', level:'核心主場', score:72, bg:'linear-gradient(135deg,#102a46,#2186b8,#ff74b8)', source:'https://www.bin-music.com.tw/news/2409', mood:'25 週年收官、台灣主場與大型場館記憶核心。', set:['回到那一天','倔強','突然好想你','知足','乾杯'], tasks:['核對逐日場次','補官方主視覺','補交通與拍照點','補逐日歌單']},
    {city:'台中', lat:24.179, lng:120.646, visits:14, venue:'洲際棒球場', years:'2023–2026', level:'起跑 / 跨年', score:68, bg:'linear-gradient(135deg,#123755,#35a88e,#ffd66b)', source:'https://www.bin-music.com.tw/news/1985', mood:'5525 起跑與跨年敘事，適合做年度專題。', set:['派對動物','OAOA','倔強','乾杯'], tasks:['補起跑場圖牆','整理跨年節點','補場館交通','補年度時間線']},
    {city:'高雄', lat:22.755, lng:120.310, visits:12, venue:'高雄世運主場館', years:'2024', level:'戶外大場', score:64, bg:'linear-gradient(135deg,#12304d,#168bc4,#ff9a56)', source:'#', mood:'世運主場館、港都夜景和大型戶外舞台。', set:['離開地球表面','戀愛ing','溫柔','乾杯'], tasks:['補五場歌單','補世運照片','補交通資料','補港都旅遊延伸']},
    {city:'香港', lat:22.282, lng:114.158, visits:10, venue:'中環海濱活動空間', years:'2024', level:'海港海外線', score:62, bg:'linear-gradient(135deg,#071424,#3374b6,#c96dff)', source:'#', mood:'維港、海風、城市天際線，是海外華語場景的高記憶點。', set:['知足','突然好想你','倔強','溫柔'], tasks:['補官方票務','補維港照片','補交通路線','整理海外線']},
    {city:'上海', lat:31.230, lng:121.474, visits:9, venue:'上海體育場', years:'2024', level:'連場都市', score:61, bg:'linear-gradient(135deg,#10243d,#26709a,#ff74b8)', source:'#', mood:'都市密度、連場演出和夜景霓虹。', set:['派對動物','夜訪吸血鬼','傷心的人別聽慢歌','乾杯'], tasks:['整理多場日曆','補城市夜景','補交通座位','補特殊曲']},
    {city:'北京', lat:39.904, lng:116.407, visits:8, venue:'國家體育場 鳥巢', years:'2024–2026', level:'超大型場', score:60, bg:'linear-gradient(135deg,#291733,#9340c9,#ffd66b)', source:'#', mood:'鳥巢級大型場館，適合做北方收官與大型場專題。', set:['諾亞方舟','成名在望','頑固','倔強'], tasks:['核對 2026 場次','補鳥巢官方圖','補收官專題','補票務交通']},
    {city:'深圳', lat:22.543, lng:114.057, visits:5, venue:'深圳大運中心體育場', years:'2024', level:'霓虹城市', score:58, bg:'linear-gradient(135deg,#0b2633,#287e9a,#77f0ff)', source:'#', mood:'年輕市場、現代城市和夜景霓虹。', set:['OAOA','戀愛ing','派對動物','突然好想你'], tasks:['補場館照片','補站點歌單','整理交通','補票務來源']}
  ];
  const albums = [
    ['第一張創作專輯','1999','https://www.bin-music.com.tw/album/artist_album/6256aaa3c124b-lw500h500.jpeg'],
    ['愛情萬歲','2000','https://www.bin-music.com.tw/album/artist_album/5ecf788f0856f-lw420h420.jpg'],
    ['人生海海','2001','https://www.bin-music.com.tw/album/artist_album/5ed7efaf18827-lw500h500.jpg'],
    ['時光機','2003','https://www.bin-music.com.tw/album/artist_album/5ed8e4a2afda5-lw500h500.jpg'],
    ['神的孩子都在跳舞','2004','https://www.bin-music.com.tw/album/artist_album/5ed8f08519147%2Btcw500h500.jpg'],
    ['知足 最真傑作選','2005','https://www.bin-music.com.tw/album/artist_album/5ed80323cb98f-lw500h500.jpg']
  ];
  const sources = [
    ['相信音樂 五月天藝人專區','官方藝人介紹與作品入口','https://www.bin-music.com.tw/artist/MAYDAY'],
    ['5525+2 台北大巨蛋新聞','台北大巨蛋年度場次與主線來源','https://www.bin-music.com.tw/news/2409'],
    ['5525 起跑 / 台中跨年線','台中起跑、跨年與 5525 主線敘事','https://www.bin-music.com.tw/news/1985'],
    ['Mayday.jp Discography','海外作品與日文資料入口','https://www.mayday.jp/discography/']
  ];
  const state = {view:'map', city:cities[0].city, track:'倔強 · 現場心跳版', map:null, markers:new Map(), layer:'street'};
  function city(){ return cities.find(c => c.city === state.city) || cities[0]; }
  function appHtml(){
    return `<div class="ml-app">
      <header class="ml-top"><a class="brand" href="#"><img src="./mayday-logo.svg?v=30.0.0" alt="Mayday"><span><b>MAYDAYLAND</b><small>Clean Product Build</small></span></a><nav class="ml-nav">${navButton('map','巡演地圖')}${navButton('albums','時光唱片室')}${navButton('songs','歌曲宇宙')}${navButton('books','書籍出版')}${navButton('timeline','歷程')}</nav><label class="ml-search">⌕<input id="search" placeholder="搜索城市、場館、歌曲…"></label></header>
      <main class="ml-shell"><aside class="ml-rail">${railHtml()}</aside><section class="ml-main">${mapView()}${albumsView()}${songsView()}${booksView()}${timelineView()}<footer class="ml-player"><div class="player-main"><span class="player-cover"></span><span><small>MAYDAYLAND RADIO</small><b id="nowTrack">${esc(state.track)}</b></span></div><div class="player-actions"><button data-play="prev">‹</button><button data-play="play">▶</button><button data-play="next">›</button></div></footer></section></main>
    </div>`;
  }
  function navButton(id, text){ return `<button class="${state.view===id?'active':''}" data-view="${id}">${text}</button>`; }
  function railHtml(){
    return `<section class="score"><span class="kicker">Layout audit</span><b>v30 清潔重構</b><p>只保留一套 CSS / JS，移除 v15–v27 疊層，先解決遮擋與重複初始化。</p><div class="meter" style="--v:68%"><i></i></div></section><section><span class="kicker">Cities</span><div class="rail-list">${cities.map(c => `<button class="rail-city ${c.city===state.city?'active':''}" data-city="${esc(c.city)}"><b>${esc(c.city)}</b><span>${c.visits} 次</span><small>${esc(c.venue)}</small></button>`).join('')}</div></section>`;
  }
  function mapView(){
    return `<section class="view ${state.view==='map'?'active':''}" id="view-map"><div class="hero"><div class="hero-copy"><span class="kicker">World tour archive</span><h1>乾淨、可讀、不遮擋的五月天巡演資料館</h1><p>v30 先把產品骨架整理好：地圖、城市、唱片室、歌單、出版與時間線各自有清楚區域，不再把不同版本 widget 疊在同一頁上。</p><div class="stats"><div class="stat"><b>${cities.length}</b><small>城市節點</small></div><div class="stat"><b>${cities.reduce((a,b)=>a+b.visits,0)}</b><small>估算熱度</small></div><div class="stat"><b>1</b><small>JS 入口</small></div><div class="stat"><b>0</b><small>舊版疊層</small></div></div></div><div class="hero-visual"><b>NO STACKED WIDGETS</b></div></div><div class="map-grid"><section class="map-card"><div class="map-head"><div><span class="kicker">Real map layer</span><b>巡演熱度地圖</b></div><div class="map-tabs"><button data-layer="street">街道</button><button data-layer="dark">深色</button></div></div><div id="tourMap" role="application" aria-label="五月天巡演熱度地圖"></div></section>${cityPanel(city())}</div></section>`;
  }
  function cityPanel(c){
    return `<aside class="city-panel"><div class="city-hero" style="background:${c.bg}"><div><span class="kicker">City dossier</span><h2>${esc(c.city)}</h2><p>${esc(c.level)} · ${esc(c.years)}</p></div></div><div class="pills"><span class="pill">${c.visits} 次熱度</span><span class="pill">完成度 ${c.score}%</span><span class="pill">${esc(c.venue)}</span></div><p>${esc(c.mood)}</p><section><div class="section-title"><h3>推薦歌單</h3></div><div class="setlist">${c.set.map((s,i)=>`<div class="track"><span>${i+1}. ${esc(s)}</span><button data-track="${esc(s)}">播放</button></div>`).join('')}</div></section><section><div class="section-title"><h3>補完 Roadmap</h3></div><ul class="roadmap">${c.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section>${c.source!=='#'?`<a class="primary" href="${esc(c.source)}" target="_blank" rel="noopener">官方來源</a>`:`<div class="empty-note">此城市仍需要補官方來源與授權圖片。</div>`}</aside>`;
  }
  function albumsView(){ return `<section class="view ${state.view==='albums'?'active':''}"><div class="section-title"><div><span class="kicker">Albums</span><h2>時光唱片室</h2></div><button class="ghost" data-view="map">回到地圖</button></div><div class="grid">${albums.map(a=>`<article class="album-card"><span class="cover"><img src="${esc(a[2])}" alt="${esc(a[0])}" loading="lazy"></span><div><b>${esc(a[0])}</b><small>${esc(a[1])} · 官方封面入口</small></div></article>`).join('')}</div></section>`; }
  function songsView(){ return `<section class="view ${state.view==='songs'?'active':''}"><div class="section-title"><div><span class="kicker">Songs</span><h2>歌曲宇宙</h2></div></div><div class="wide-grid">${cities.slice(0,4).map(c=>`<article class="card" style="padding:16px"><span class="kicker">${esc(c.city)} setlist</span><h3>${esc(c.level)}</h3><div class="setlist">${c.set.map(s=>`<div class="track"><span>${esc(s)}</span><button data-track="${esc(s)}">播放</button></div>`).join('')}</div></article>`).join('')}</div></section>`; }
  function booksView(){ return `<section class="view ${state.view==='books'?'active':''}"><div class="section-title"><div><span class="kicker">Books & publications</span><h2>書籍出版</h2></div></div><div class="wide-grid"><article class="card" style="padding:16px"><h3>場刊 / 票根 / 書籍</h3><p>這一頁先保留乾淨版位，後續只往資料結構內補，不再以浮層方式堆 widget。</p></article><article class="card" style="padding:16px"><h3>來源要求</h3><p>所有封面、場刊、票務與照片都需要來源標記或本地素材授權。</p></article></div></section>`; }
  function timelineView(){ return `<section class="view ${state.view==='timeline'?'active':''}"><div class="section-title"><div><span class="kicker">Timeline</span><h2>歷程</h2></div></div><div class="timeline">${[['1997','成軍與校園時期'],['1999','第一張創作專輯'],['2000','愛情萬歲'],['2011','第二人生'],['2023–2026','回到那一天 5525']].map(x=>`<article class="timeline-item"><b>${x[0]}</b><span>${x[1]}</span></article>`).join('')}</div><div class="section-title" style="margin-top:18px"><div><span class="kicker">Sources</span><h2>來源牆</h2></div></div><div class="source-list">${sources.map(s=>`<a class="source" href="${esc(s[2])}" target="_blank" rel="noopener"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></a>`).join('')}</div></section>`; }
  function bind(){
    document.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => { state.view = btn.dataset.view; render(); }));
    document.querySelectorAll('[data-city]').forEach(btn => btn.addEventListener('click', () => { state.city = btn.dataset.city; state.view = 'map'; render(); }));
    document.querySelectorAll('[data-track]').forEach(btn => btn.addEventListener('click', () => { state.track = `${btn.dataset.track} · ${state.city} 現場`; const now = $('#nowTrack'); if(now) now.textContent = state.track; }));
    const search = $('#search');
    if(search) search.addEventListener('input', () => { const q = search.value.trim().toLowerCase(); const found = cities.find(c => [c.city,c.venue,c.level].join(' ').toLowerCase().includes(q)); if(q && found){ state.city = found.city; state.view = 'map'; render(); } });
  }
  function initMap(){
    const el = $('#tourMap');
    if(!el || !window.L) return;
    state.map = L.map(el, {zoomControl:true, attributionControl:true}).setView([26.5, 118.5], 5);
    const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:18, attribution:'&copy; OpenStreetMap contributors'});
    const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {maxZoom:19, attribution:'&copy; OpenStreetMap contributors &copy; CARTO'});
    state.layers = {street, dark}; street.addTo(state.map);
    cities.forEach(c => { const size = Math.max(16, Math.min(48, 14 + c.visits)); const icon = L.divIcon({className:'', html:`<span class="heat-marker" style="width:${size}px;height:${size}px;display:block"></span>`, iconSize:[size,size], iconAnchor:[size/2,size/2]}); const m = L.marker([c.lat,c.lng], {icon}).addTo(state.map).bindPopup(`<b>${esc(c.city)}</b><br>${esc(c.venue)}<br>${c.visits} 次熱度`); m.on('click', () => { state.city = c.city; render(); }); state.markers.set(c.city, m); });
    L.polyline(cities.map(c=>[c.lat,c.lng]), {color:'#66e7ff', weight:2, opacity:.68}).addTo(state.map);
    document.querySelectorAll('[data-layer]').forEach(b => b.addEventListener('click', () => { const next = b.dataset.layer; Object.values(state.layers).forEach(layer => state.map.removeLayer(layer)); state.layers[next].addTo(state.map); state.layer = next; }));
    const active = city(); state.map.setView([active.lat, active.lng], active.visits > 15 ? 9 : 6);
  }
  function render(){
    const root = $('#app');
    if(!root) return;
    if(state.map){ state.map.remove(); state.map = null; state.markers.clear(); }
    root.innerHTML = appHtml();
    bind();
    if(state.view === 'map') setTimeout(initMap, 0);
  }
  render();
})();