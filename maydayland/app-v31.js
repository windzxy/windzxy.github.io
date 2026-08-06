(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = value => String(value ?? '').replace(/[&<>\"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[ch] || ch));

  const cities = [
    { city:'台北', lat:25.037, lng:121.565, visits:26, venue:'台北大巨蛋 / 台北小巨蛋', years:'1999–2026', level:'核心主場', score:72, tone:'#ff74b8', source:'https://www.bin-music.com.tw/news/2409', mood:'25 週年收官、台灣主場與大型場館記憶核心。', set:['回到那一天','倔強','突然好想你','知足','乾杯'], tasks:['核對逐日場次','補官方主視覺','補交通與拍照點','補逐日歌單'] },
    { city:'台中', lat:24.179, lng:120.646, visits:14, venue:'洲際棒球場', years:'2023–2026', level:'起跑 / 跨年', score:68, tone:'#ffd66b', source:'https://www.bin-music.com.tw/news/1985', mood:'5525 起跑與跨年敘事，適合做年度專題。', set:['派對動物','OAOA','倔強','乾杯'], tasks:['補起跑場圖牆','整理跨年節點','補場館交通','補年度時間線'] },
    { city:'高雄', lat:22.755, lng:120.310, visits:12, venue:'高雄世運主場館', years:'2024', level:'戶外大場', score:64, tone:'#ff9a56', source:'#', mood:'世運主場館、港都夜景和大型戶外舞台。', set:['離開地球表面','戀愛ing','溫柔','乾杯'], tasks:['補五場歌單','補世運照片','補交通資料','補港都旅遊延伸'] },
    { city:'香港', lat:22.282, lng:114.158, visits:10, venue:'中環海濱活動空間', years:'2024', level:'海港海外線', score:62, tone:'#8f7dff', source:'#', mood:'維港、海風、城市天際線，是海外華語場景的高記憶點。', set:['知足','突然好想你','倔強','溫柔'], tasks:['補官方票務','補維港照片','補交通路線','整理海外線'] },
    { city:'上海', lat:31.230, lng:121.474, visits:9, venue:'上海體育場', years:'2024', level:'連場都市', score:61, tone:'#5beeff', source:'#', mood:'都市密度、連場演出和夜景霓虹。', set:['派對動物','夜訪吸血鬼','傷心的人別聽慢歌','乾杯'], tasks:['整理多場日曆','補城市夜景','補交通座位','補特殊曲'] },
    { city:'北京', lat:39.904, lng:116.407, visits:8, venue:'國家體育場 鳥巢', years:'2024–2026', level:'超大型場', score:60, tone:'#c96dff', source:'#', mood:'鳥巢級大型場館，適合做北方收官與大型場專題。', set:['諾亞方舟','成名在望','頑固','倔強'], tasks:['核對 2026 場次','補鳥巢官方圖','補收官專題','補票務交通'] },
    { city:'深圳', lat:22.543, lng:114.057, visits:5, venue:'深圳大運中心體育場', years:'2024', level:'霓虹城市', score:58, tone:'#35d0ff', source:'#', mood:'年輕市場、現代城市和夜景霓虹。', set:['OAOA','戀愛ing','派對動物','突然好想你'], tasks:['補場館照片','補站點歌單','整理交通','補票務來源'] }
  ];

  const albums = [
    ['第一張創作專輯','1999','https://www.bin-music.com.tw/album/artist_album/6256aaa3c124b-lw500h500.jpeg'],
    ['愛情萬歲','2000','https://www.bin-music.com.tw/album/artist_album/5ecf788f0856f-lw420h420.jpg'],
    ['人生海海','2001','https://www.bin-music.com.tw/album/artist_album/5ed7efaf18827-lw500h500.jpg'],
    ['時光機','2003','https://www.bin-music.com.tw/album/artist_album/5ed8e4a2afda5-lw500h500.jpg'],
    ['神的孩子都在跳舞','2004','https://www.bin-music.com.tw/album/artist_album/5ed8f08519147%2Btcw500h500.jpg'],
    ['知足 最真傑作選','2005','https://www.bin-music.com.tw/album/artist_album/5ed80323cb98f-lw500h500.jpg']
  ];

  const sourceLinks = [
    ['相信音樂 五月天藝人專區','官方身份、作品與藝人介紹入口','https://www.bin-music.com.tw/artist/MAYDAY'],
    ['5525+2 台北大巨蛋新聞','台北大巨蛋年度場次與主線來源','https://www.bin-music.com.tw/news/2409'],
    ['5525 起跑 / 台中跨年線','台中起跑、跨年與 5525 主線敘事','https://www.bin-music.com.tw/news/1985'],
    ['Mayday.jp Discography','海外作品與日文資料入口','https://www.mayday.jp/discography/']
  ];

  const state = { view:'map', city:'台北', query:'', track:'倔強 · 現場心跳版', map:null, layer:null, markers:[] };
  const views = ['map', 'albums', 'songs', 'books', 'timeline'];
  const viewLabels = { map:'巡演地圖', albums:'時光唱片室', songs:'歌曲宇宙', books:'書籍出版', timeline:'歷程' };

  function currentCity(){ return cities.find(item => item.city === state.city) || cities[0]; }
  function filteredCities(){
    const q = state.query.trim().toLowerCase();
    if(!q) return cities;
    return cities.filter(c => [c.city, c.venue, c.level, c.years].some(v => String(v).toLowerCase().includes(q)));
  }

  function appTemplate(){
    return `<div class="page">
      <header class="topbar">
        <a class="brand" href="#" data-view="map"><img src="./mayday-logo.svg?v=31.0.0" alt="Mayday"><span><b>MAYDAYLAND</b><small>Clean Product Build · v31</small></span></a>
        <nav class="nav">${views.map(id => `<button class="${state.view === id ? 'active' : ''}" data-view="${id}">${viewLabels[id]}</button>`).join('')}</nav>
        <label class="search"><span>⌕</span><input id="searchBox" value="${esc(state.query)}" placeholder="搜尋城市、場館、歌曲…"></label>
      </header>
      <section class="audit-strip">
        <article><small>Architecture</small><b>單一 CSS / JS</b><p>v31 只用一套產品殼，避免舊 widget 疊層。</p></article>
        <article><small>Layout</small><b>三欄清晰</b><p>城市索引、主內容、詳情面板互不遮擋。</p></article>
        <article><small>Mobile</small><b>單欄閱讀</b><p>播放器進入內容流，不再壓住正文。</p></article>
        <article><small>Score</small><b>約 68 分</b><p>先穩住版面，再補素材與真實資料。</p></article>
      </section>
      <main class="shell">
        <aside class="rail">${railTemplate()}</aside>
        <section class="content">${contentTemplate()}</section>
      </main>
    </div>`;
  }

  function railTemplate(){
    const list = filteredCities();
    return `<section class="rail-card intro">
      <span class="kicker">City Index</span><h1>城市不再是浮層</h1><p>每座城市都固定在索引中，點擊後只更新右側資料，不新增重疊 widget。</p>
      <div class="meter" style="--value:${Math.round(cities.reduce((a,b)=>a+b.score,0)/cities.length)}%"><i></i></div>
    </section>
    <section class="rail-card"><div class="rail-title"><b>巡演熱度城市</b><span>${list.length}/${cities.length}</span></div><div class="city-list">${list.map(c => cityButton(c)).join('')}</div></section>`;
  }

  function cityButton(c){
    return `<button class="city-button ${c.city === state.city ? 'active' : ''}" data-city="${esc(c.city)}" style="--tone:${esc(c.tone)}">
      <span><b>${esc(c.city)}</b><small>${esc(c.level)} · ${esc(c.years)}</small></span><em>${c.visits}</em>
    </button>`;
  }

  function contentTemplate(){
    if(state.view === 'map') return mapView();
    if(state.view === 'albums') return albumsView();
    if(state.view === 'songs') return songsView();
    if(state.view === 'books') return booksView();
    return timelineView();
  }

  function mapView(){
    const c = currentCity();
    return `<section class="view active">
      <div class="hero-card">
        <div><span class="kicker">World Tour Heatmap</span><h2>巡演地圖先回到產品秩序</h2><p>地圖、城市檔案、歌單和來源分區固定，不再用抽屜和浮層互相覆蓋。城市到訪越多，地圖標記越大越亮。</p></div>
        <div class="hero-score"><b>${cities.reduce((sum, item) => sum + item.visits, 0)}</b><span>估算到訪熱度</span></div>
      </div>
      <div class="map-layout">
        <section class="map-card">
          <div class="section-head"><div><span class="kicker">Map Layer</span><h3>真實地圖 + 熱度標記</h3></div><div class="layer-tabs"><button data-layer="street">街道</button><button data-layer="dark">深色</button></div></div>
          <div id="tourMap" class="map-box"></div>
        </section>
        ${cityPanel(c)}
      </div>
      ${playerCard()}
    </section>`;
  }

  function cityPanel(c){
    return `<aside class="city-panel" style="--tone:${esc(c.tone)}">
      <div class="city-hero"><span class="kicker">City Dossier</span><h2>${esc(c.city)}</h2><p>${esc(c.level)} · ${esc(c.venue)}</p></div>
      <div class="facts"><span><b>${c.visits}</b>熱度</span><span><b>${c.score}%</b>完成度</span><span><b>${esc(c.years)}</b>年份</span></div>
      <p class="city-copy">${esc(c.mood)}</p>
      <section><div class="section-head compact"><h3>推薦歌單</h3></div><div class="track-list">${c.set.map((song, i) => `<button data-track="${esc(song)}"><span>${i + 1}. ${esc(song)}</span><small>推送播放器</small></button>`).join('')}</div></section>
      <section><div class="section-head compact"><h3>補完 Roadmap</h3></div><ul class="roadmap">${c.tasks.map(task => `<li>${esc(task)}</li>`).join('')}</ul></section>
      ${c.source === '#' ? '<p class="source-note">官方來源待補，暫不偽裝完整。</p>' : `<a class="primary" href="${esc(c.source)}" target="_blank" rel="noopener">查看官方來源</a>`}
    </aside>`;
  }

  function albumsView(){
    return `<section class="view active"><div class="section-head"><div><span class="kicker">Album Room</span><h2>時光唱片室</h2><p>保留乾淨封面牆，不再用多個舊唱片室 widget 疊在一起。</p></div></div><div class="album-grid">${albums.map(([title, year, url]) => `<article class="album"><img src="${esc(url)}" alt="${esc(title)}" loading="lazy"><b>${esc(title)}</b><small>${esc(year)} · 官方封面入口</small></article>`).join('')}</div>${sourceWall()}</section>`;
  }

  function songsView(){
    return `<section class="view active"><div class="section-head"><div><span class="kicker">Song Universe</span><h2>歌曲宇宙</h2><p>每個城市歌單在固定卡片中呈現，按鈕只更新播放器，不新增浮動彈窗。</p></div></div><div class="song-grid">${cities.slice(0, 6).map(c => `<article class="song-card" style="--tone:${esc(c.tone)}"><span class="kicker">${esc(c.city)} Setlist</span><h3>${esc(c.level)}</h3><div class="track-list">${c.set.map(song => `<button data-track="${esc(song)}"><span>${esc(song)}</span><small>播放</small></button>`).join('')}</div></article>`).join('')}</div>${playerCard()}</section>`;
  }

  function booksView(){
    return `<section class="view active"><div class="section-head"><div><span class="kicker">Books & Publications</span><h2>書籍出版</h2><p>此頁先建立資料欄位：出版品、場刊、票根、來源與城市關聯。後續補真實素材，不再用假圖填滿。</p></div></div><div class="publication-grid"><article><b>書籍 / 成員文集</b><p>補書籍封面、ISBN、出版年份與官方來源。</p></article><article><b>巡演場刊</b><p>按巡演與城市分類，接入城市檔案。</p></article><article><b>票根 / 周邊</b><p>建立素材位與授權狀態，不再混入未核實圖片。</p></article></div>${sourceWall()}</section>`;
  }

  function timelineView(){
    const rows = [['1997','成軍與校園時期'],['1999','第一張創作專輯'],['2000','愛情萬歲'],['2003','時光機與大型巡演記憶'],['2011','第二人生與世界觀擴張'],['2016','自傳與回望敘事'],['2023–2026','5525 回到那一天']];
    return `<section class="view active"><div class="section-head"><div><span class="kicker">Timeline</span><h2>歷程與大事記</h2><p>時間線改成單一縱向結構，後續每個節點可連回作品、巡演與城市。</p></div></div><div class="timeline">${rows.map(([year, text]) => `<article><time>${year}</time><b>${text}</b><p>待補官方圖片、新聞來源、關聯專輯與城市節點。</p></article>`).join('')}</div></section>`;
  }

  function sourceWall(){
    return `<section class="source-wall"><div class="section-head compact"><h3>來源牆</h3></div><div class="source-grid">${sourceLinks.map(([title, desc, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener"><b>${esc(title)}</b><small>${esc(desc)}</small></a>`).join('')}</div></section>`;
  }

  function playerCard(){
    return `<section class="player-card"><div><span class="kicker">Player</span><b id="nowTrack">${esc(state.track)}</b><small>穩定頁內播放器，不使用 fixed 浮層。</small></div><div><button data-track="倔強">倔強</button><button data-track="知足">知足</button><button data-track="乾杯">乾杯</button></div></section>`;
  }

  function bindEvents(){
    $$('[data-view]').forEach(btn => btn.addEventListener('click', event => {
      event.preventDefault();
      state.view = btn.dataset.view || 'map';
      render();
    }));
    $$('[data-city]').forEach(btn => btn.addEventListener('click', () => {
      state.city = btn.dataset.city || state.city;
      if(state.view !== 'map') state.view = 'map';
      render();
    }));
    $$('[data-track]').forEach(btn => btn.addEventListener('click', () => {
      state.track = `${btn.dataset.track} · ${currentCity().city} 推薦版`;
      const now = $('#nowTrack');
      if(now) now.textContent = state.track;
      toast(`已加入播放器：${btn.dataset.track}`);
    }));
    $$('[data-layer]').forEach(btn => btn.addEventListener('click', () => setLayer(btn.dataset.layer || 'street')));
    const search = $('#searchBox');
    if(search){
      search.addEventListener('input', () => {
        state.query = search.value;
        const match = cities.find(c => c.city.includes(state.query.trim()));
        if(match) state.city = match.city;
        render();
      });
      search.focus({preventScroll:true});
      search.setSelectionRange(search.value.length, search.value.length);
    }
  }

  function toast(message){
    let node = $('.toast');
    if(!node){ node = document.createElement('div'); node.className = 'toast'; document.body.append(node); }
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(node._timer);
    node._timer = setTimeout(() => node.classList.remove('show'), 1600);
  }

  function initMap(){
    const el = $('#tourMap');
    if(!el || state.view !== 'map') return;
    if(!window.L){
      el.innerHTML = '<div class="map-fallback">地圖庫載入中或被阻擋，頁面其餘內容仍可使用。</div>';
      return;
    }
    if(state.map){
      try { state.map.remove(); } catch(e) {}
      state.map = null;
    }
    state.map = L.map(el, { zoomControl:true, attributionControl:true }).setView([28.2, 116.8], 5);
    setLayer('street');
    const maxVisits = Math.max(...cities.map(c => c.visits));
    const latlngs = [];
    cities.forEach(c => {
      const radius = 8 + Math.round((c.visits / maxVisits) * 18);
      const marker = L.circleMarker([c.lat, c.lng], {
        radius,
        color: c.tone,
        fillColor: c.tone,
        fillOpacity: c.city === state.city ? 0.78 : 0.48,
        weight: c.city === state.city ? 3 : 2,
        opacity: 0.95
      }).addTo(state.map);
      marker.bindPopup(`<b>${esc(c.city)}</b><br>${esc(c.venue)}<br>熱度 ${c.visits}`);
      marker.on('click', () => { state.city = c.city; render(); });
      state.markers.push(marker);
      latlngs.push([c.lat, c.lng]);
    });
    L.polyline(latlngs, { color:'#5beeff', opacity:.48, weight:3, dashArray:'8 12' }).addTo(state.map);
    const c = currentCity();
    state.map.setView([c.lat, c.lng], Math.max(state.map.getZoom(), 6), { animate:false });
  }

  function setLayer(layerName){
    if(!state.map || !window.L) return;
    if(state.layer) state.map.removeLayer(state.layer);
    const configs = {
      street: ['https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', '© OpenStreetMap contributors'],
      dark: ['https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', '© OpenStreetMap contributors © CARTO']
    };
    const [url, attr] = configs[layerName] || configs.street;
    state.layer = L.tileLayer(url, { maxZoom: 19, attribution: attr }).addTo(state.map);
    $$('[data-layer]').forEach(btn => btn.classList.toggle('active', btn.dataset.layer === layerName));
  }

  function render(){
    if(state.map){
      try { state.map.remove(); } catch(e) {}
      state.map = null;
      state.markers = [];
      state.layer = null;
    }
    const root = $('#app');
    if(!root) return;
    root.innerHTML = appTemplate();
    bindEvents();
    if(state.view === 'map') setTimeout(initMap, 0);
  }

  document.addEventListener('DOMContentLoaded', render);
})();