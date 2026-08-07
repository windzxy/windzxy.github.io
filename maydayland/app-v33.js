(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  const cities = [
    { city:'台北', lat:25.037, lng:121.565, visits:26, venue:'台北大巨蛋 / 台北小巨蛋', years:'1999–2026', level:'核心主場', score:76, tone:'#ff70b7', source:'https://www.bin-music.com.tw/news/2409', mood:'台灣主場、25 週年收官與大型場館記憶核心。', set:['回到那一天','倔強','突然好想你','知足','乾杯'], tasks:['逐日場次核對','官方主視覺與授權照片','交通與拍照點','逐日歌單與彩蛋'] },
    { city:'台中', lat:24.179, lng:120.646, visits:14, venue:'洲際棒球場', years:'2023–2026', level:'起跑 / 跨年', score:70, tone:'#ffd36a', source:'https://www.bin-music.com.tw/news/1985', mood:'5525 起跑、跨年敘事與台灣中部大型場館線。', set:['派對動物','OAOA','倔強','乾杯'], tasks:['起跑場圖牆','跨年節點整理','場館交通','年度時間線'] },
    { city:'高雄', lat:22.755, lng:120.310, visits:12, venue:'高雄世運主場館', years:'2024', level:'戶外大場', score:66, tone:'#ff9a56', source:'#', mood:'世運主場館、港都夜景與大型戶外舞台。', set:['離開地球表面','戀愛ing','溫柔','乾杯'], tasks:['五場歌單','世運照片','交通資料','港都旅遊延伸'] },
    { city:'香港', lat:22.282, lng:114.158, visits:10, venue:'中環海濱活動空間', years:'2024', level:'海港海外線', score:64, tone:'#8f7dff', source:'#', mood:'維港、海風與城市天際線，是海外華語場景的高記憶點。', set:['知足','突然好想你','倔強','溫柔'], tasks:['官方票務','維港照片','交通路線','海外線整理'] },
    { city:'上海', lat:31.230, lng:121.474, visits:9, venue:'上海體育場', years:'2024', level:'連場都市', score:63, tone:'#64e8ff', source:'#', mood:'都市密度、連場演出與夜景霓虹。', set:['派對動物','夜訪吸血鬼','傷心的人別聽慢歌','乾杯'], tasks:['多場日曆','城市夜景','交通座位','特殊曲目'] },
    { city:'北京', lat:39.904, lng:116.407, visits:8, venue:'國家體育場 鳥巢', years:'2024–2026', level:'超大型場', score:62, tone:'#c96dff', source:'#', mood:'鳥巢級大型場館，適合做北方收官與大型場專題。', set:['諾亞方舟','成名在望','頑固','倔強'], tasks:['2026 場次核對','鳥巢官方圖','收官專題','票務交通'] },
    { city:'深圳', lat:22.543, lng:114.057, visits:5, venue:'深圳大運中心體育場', years:'2024', level:'霓虹城市', score:58, tone:'#35d0ff', source:'#', mood:'年輕市場、現代城市與夜景霓虹。', set:['OAOA','戀愛ing','派對動物','突然好想你'], tasks:['場館照片','站點歌單','交通整理','票務來源'] }
  ];

  const albums = [
    ['第一張創作專輯','1999','https://www.bin-music.com.tw/album/artist_album/6256aaa3c124b-lw500h500.jpeg','青春起點'],
    ['愛情萬歲','2000','https://www.bin-music.com.tw/album/artist_album/5ecf788f0856f-lw420h420.jpg','早期搖滾記憶'],
    ['人生海海','2001','https://www.bin-music.com.tw/album/artist_album/5ed7efaf18827-lw500h500.jpg','成長與海風'],
    ['時光機','2003','https://www.bin-music.com.tw/album/artist_album/5ed8e4a2afda5-lw500h500.jpg','時間主題'],
    ['神的孩子都在跳舞','2004','https://www.bin-music.com.tw/album/artist_album/5ed8f08519147%2Btcw500h500.jpg','大型現場核心'],
    ['知足 最真傑作選','2005','https://www.bin-music.com.tw/album/artist_album/5ed80323cb98f-lw500h500.jpg','入門精選']
  ];

  const sources = [
    ['相信音樂 五月天藝人專區','官方身份、作品與藝人介紹入口','https://www.bin-music.com.tw/artist/MAYDAY'],
    ['5525+2 台北大巨蛋新聞','台北大巨蛋年度場次與主線來源','https://www.bin-music.com.tw/news/2409'],
    ['5525 起跑 / 台中跨年線','台中起跑、跨年與 5525 主線敘事','https://www.bin-music.com.tw/news/1985'],
    ['Mayday.jp Discography','海外作品與日文資料入口','https://www.mayday.jp/discography/']
  ];

  const timeline = [
    ['1997','成軍與校園時期','以樂團身份建立早期現場能量。'],
    ['1999','第一張創作專輯','作品資料館的起點。'],
    ['2003','時光機','時間與青春記憶成為核心敘事。'],
    ['2011','第二人生','概念專輯與大型巡演語言成熟。'],
    ['2017','LiFE 人生無限公司','世界巡演與場館敘事升級。'],
    ['2023','5525 回到那一天起跑','25 週年主線展開。'],
    ['2026','5525+2 年度延伸','台北大巨蛋與年度延伸節點。']
  ];

  const state = { view:'map', city:'台北', track:'倔強 · 現場心跳版', map:null, tile:null, markers:[] };
  const viewLabels = { map:'巡演地圖', albums:'時光唱片室', songs:'歌曲宇宙', books:'書籍出版', timeline:'歷程' };
  const activeCity = () => cities.find(item => item.city === state.city) || cities[0];
  const app = () => $('#app');

  function render() {
    app().innerHTML = `<div class="site-shell">
      <header class="topbar surface">
        <a class="brand" href="#" data-view="map"><img src="./mayday-logo.svg?v=33.0.0" alt="Mayday"><span><b>MAYDAYLAND</b><small>Tour Atlas · v33</small></span></a>
        <nav class="main-nav">${Object.entries(viewLabels).map(([id,label]) => `<button class="${state.view === id ? 'active' : ''}" data-view="${id}">${label}</button>`).join('')}</nav>
        <label class="search">⌕<input id="searchBox" placeholder="搜索城市、場館、歌曲…" autocomplete="off"></label>
      </header>
      <section class="hero surface">
        <div class="hero-copy"><span class="eyebrow">Clean rebuild / no stacked widgets</span><h1>五月天巡演地圖與時光資料館</h1><p>v33 繼續基於單一架構：地圖負責城市探索，唱片室負責作品，歌曲頁負責歌單，來源牆負責可信度。所有內容留在文檔流，不再互相遮擋。</p></div>
        <div class="scoreboard">${metric('架構','單一入口','app-v33',100)}${metric('遮擋風險','已止血','無舊版疊層',88)}${metric('內容深度','仍需補強','約 72 分',72)}${metric('驗收門檻','未達','85 分',72)}</div>
      </section>
      <main class="layout">
        <aside class="rail surface">${railHtml()}</aside>
        <section class="stage">${viewHtml()}${playerHtml()}</section>
        <aside class="dossier surface">${cityPanel(activeCity())}</aside>
      </main>
    </div>`;
    bind();
    if (state.view === 'map') requestAnimationFrame(initMap);
  }

  function metric(label, value, note, percent) {
    return `<article class="metric"><span>${esc(label)}</span><b>${esc(value)}</b><small>${esc(note)}</small><i style="--p:${percent}%"></i></article>`;
  }

  function railHtml() {
    const total = cities.reduce((sum, item) => sum + item.visits, 0);
    return `<span class="eyebrow">Route index</span><h2>城市熱度</h2><p class="muted">點選城市會同步地圖、右側詳情與歌單；高頻城市以更大熱點呈現。</p><div class="mini-stats"><span>${total} 熱度</span><span>${cities.length} 城市</span></div><div class="city-list">${cities.map(item => `<button class="city-button ${item.city === state.city ? 'active' : ''}" data-city="${esc(item.city)}"><b>${esc(item.city)}</b><em>${item.visits}</em><small>${esc(item.venue)}</small></button>`).join('')}</div>`;
  }

  function viewHtml() {
    const map = `<section class="view ${state.view === 'map' ? 'active' : ''}">${mapView()}</section>`;
    const albumsViewHtml = `<section class="view ${state.view === 'albums' ? 'active' : ''}">${albumsView()}</section>`;
    const songsViewHtml = `<section class="view ${state.view === 'songs' ? 'active' : ''}">${songsView()}</section>`;
    const booksViewHtml = `<section class="view ${state.view === 'books' ? 'active' : ''}">${booksView()}</section>`;
    const timelineViewHtml = `<section class="view ${state.view === 'timeline' ? 'active' : ''}">${timelineView()}</section>`;
    return map + albumsViewHtml + songsViewHtml + booksViewHtml + timelineViewHtml;
  }

  function mapView() {
    return `<article class="panel surface"><div class="section-head"><div><span class="eyebrow">Real web map</span><h2>巡演熱度地圖</h2><p class="muted">基於真實地圖瓦片與城市經緯度；到訪越多，節點越大、光暈越深。</p></div><div class="tabs"><button data-layer="street">街道</button><button data-layer="dark">深色</button></div></div><div id="tourMap" class="map"></div><div class="legend"><span><i></i>高熱度</span><span><i class="gold"></i>主場 / 起跑</span><span><i class="pink"></i>素材待補</span></div></article><article class="panel surface editorial"><span class="eyebrow">Product rule</span><h2>每頁只保留一個主任務</h2><div class="two-col"><p>地圖頁只處理城市、熱度與巡演路線，不再把唱片室、播放器抽屜和來源牆全部浮在同一層。</p><p>下一階段再補真正的授權圖片、逐站歌單與場館資料，不用 widget 堆砌替代內容深度。</p></div></article>`;
  }

  function cityPanel(city) {
    return `<div class="city-hero" style="--tone:${city.tone}"><span class="eyebrow">City dossier</span><h2>${esc(city.city)}</h2><p>${esc(city.level)} · ${esc(city.years)}</p></div><div class="badges"><span>${city.visits} 次熱度</span><span>完成度 ${city.score}%</span><span>${esc(city.venue)}</span></div><p class="muted">${esc(city.mood)}</p><section><h3>推薦歌單</h3><div class="setlist">${city.set.map((song,index) => `<div class="track"><span>${index + 1}. ${esc(song)}</span><button data-track="${esc(song)}">播放</button></div>`).join('')}</div></section><section><h3>補完 Roadmap</h3><ul class="roadmap">${city.tasks.map(task => `<li>${esc(task)}</li>`).join('')}</ul></section>${city.source !== '#' ? `<a class="source-link" href="${esc(city.source)}" target="_blank" rel="noopener">官方來源</a>` : `<div class="empty">此城市仍需要補官方來源與授權圖片。</div>`}`;
  }

  function albumsView() {
    return `<article class="panel surface"><div class="section-head"><div><span class="eyebrow">Discography room</span><h2>時光唱片室</h2><p class="muted">封面、年代與巡演記憶放入同一版式，避免像 demo 卡片散落。</p></div></div><div class="album-grid">${albums.map(album => `<article class="album"><img src="${esc(album[2])}" alt="${esc(album[0])}" loading="lazy"><div><b>${esc(album[0])}</b><small>${esc(album[1])} · ${esc(album[3])}</small></div></article>`).join('')}</div></article>`;
  }

  function songsView() {
    return `<article class="panel surface"><div class="section-head"><div><span class="eyebrow">Setlist universe</span><h2>歌曲宇宙</h2><p class="muted">先按城市整理推薦曲；後續再補逐日歌單、安可、嘉賓與特殊曲。</p></div></div><div class="playlist-grid">${cities.slice(0, 6).map(city => `<article class="playlist"><span>${esc(city.city)}</span><h3>${esc(city.level)}</h3>${city.set.map(song => `<button data-track="${esc(song)}">${esc(song)}</button>`).join('')}</article>`).join('')}</div></article>`;
  }

  function booksView() {
    return `<article class="panel surface"><div class="section-head"><div><span class="eyebrow">Books / tickets / tour books</span><h2>書籍出版與實體收藏</h2><p class="muted">這頁保留乾淨的資料位：書籍、場刊、票根、歌詞本與官方周邊，等待授權素材補入。</p></div></div><div class="source-grid">${['書籍封面','巡演場刊','票根與手幅','樂譜 / 歌詞本'].map((item,index) => `<article class="source-card"><span>0${index + 1}</span><h3>${esc(item)}</h3><p>需補來源、年份、圖片授權與城市關聯。</p></article>`).join('')}</div></article>`;
  }

  function timelineView() {
    return `<article class="panel surface"><div class="section-head"><div><span class="eyebrow">Memory timeline</span><h2>歷程展覽牆</h2><p class="muted">把作品、巡演與城市檔案串成一條可擴充的編年線。</p></div></div><div class="timeline">${timeline.map(item => `<article><b>${esc(item[0])}</b><h3>${esc(item[1])}</h3><p>${esc(item[2])}</p></article>`).join('')}</div></article><article class="panel surface"><div class="section-head"><div><span class="eyebrow">Source wall</span><h2>官方來源牆</h2></div></div><div class="source-grid">${sources.map(source => `<a class="source-card" href="${esc(source[2])}" target="_blank" rel="noopener"><span>OFFICIAL</span><h3>${esc(source[0])}</h3><p>${esc(source[1])}</p></a>`).join('')}</div></article>`;
  }

  function playerHtml() {
    return `<footer class="player surface"><div><span class="eyebrow">Maydayland radio</span><b id="nowTrack">${esc(state.track)}</b><small>頁內播放器，不使用 fixed 浮層，避免遮擋。</small></div><div class="controls"><button data-player="prev">‹</button><button data-player="play">▶</button><button data-player="next">›</button></div></footer>`;
  }

  function bind() {
    $$('[data-view]').forEach(button => button.addEventListener('click', event => {
      event.preventDefault();
      const view = button.dataset.view;
      if (viewLabels[view]) {
        state.view = view;
        render();
      }
    }));
    $$('[data-city]').forEach(button => button.addEventListener('click', () => {
      state.city = button.dataset.city;
      state.view = 'map';
      render();
    }));
    $$('[data-track]').forEach(button => button.addEventListener('click', () => {
      state.track = `${button.dataset.track} · ${state.city}`;
      const now = $('#nowTrack');
      if (now) now.textContent = state.track;
    }));
    $('#searchBox')?.addEventListener('input', event => {
      const value = event.target.value.trim().toLowerCase();
      const match = cities.find(city => `${city.city}${city.venue}${city.level}`.toLowerCase().includes(value));
      if (value && match) {
        state.city = match.city;
        render();
      }
    });
    $$('[data-layer]').forEach(button => button.addEventListener('click', () => switchLayer(button.dataset.layer)));
  }

  function initMap() {
    const target = $('#tourMap');
    if (!target) return;
    if (!window.L) {
      target.innerHTML = '<div class="map-fallback">地圖庫載入中；若網路阻擋 CDN，仍可使用左側城市索引。</div>';
      return;
    }
    if (state.map) {
      state.map.remove();
      state.map = null;
    }
    const map = L.map(target, { zoomControl: true, attributionControl: true }).setView([28.2, 118.7], 5);
    state.map = map;
    switchLayer('street');
    const points = cities.map(city => [city.lat, city.lng]);
    L.polyline(points, { color:'#8ee7ff', weight:2, opacity:.55, dashArray:'6 10' }).addTo(map);
    cities.forEach(city => {
      const size = Math.max(24, Math.min(58, 18 + city.visits * 1.35));
      const marker = L.marker([city.lat, city.lng], { icon: L.divIcon({ className:'heat-marker', html:`<span style="--size:${size}px;--tone:${city.tone}"><b>${esc(city.city)}</b></span>`, iconSize:[size,size], iconAnchor:[size/2,size/2] }) }).addTo(map);
      marker.on('click', () => { state.city = city.city; render(); });
      marker.bindPopup(`<b>${esc(city.city)}</b><br>${esc(city.venue)}<br>熱度 ${city.visits}`);
    });
    const current = activeCity();
    map.setView([current.lat, current.lng], current.visits > 18 ? 8 : 6, { animate:false });
  }

  function switchLayer(type) {
    if (!state.map || !window.L) return;
    if (state.tile) state.map.removeLayer(state.tile);
    const layers = {
      street: ['https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', '&copy; OpenStreetMap contributors'],
      dark: ['https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', '&copy; OpenStreetMap contributors &copy; CARTO']
    };
    const selected = layers[type] || layers.street;
    state.tile = L.tileLayer(selected[0], { maxZoom:18, attribution:selected[1] }).addTo(state.map);
  }

  document.addEventListener('DOMContentLoaded', render);
})();
