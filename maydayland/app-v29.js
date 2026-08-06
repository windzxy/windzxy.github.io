(() => {
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c));
  const cities = [
    {city:'台北',lat:25.037,lng:121.565,visits:26,venue:'台北大巨蛋 / 台北小巨蛋',years:'1999–2026',level:'核心主場',score:72,bg:'linear-gradient(135deg,#102a46,#2186b8,#ff74b8)',source:'https://www.bin-music.com.tw/news/2409',mood:'25 週年收官、台灣主場與大型場館記憶核心。',set:['回到那一天','倔強','突然好想你','知足','乾杯'],tasks:['核對逐日場次','補官方主視覺','補交通與拍照點','補逐日歌單']},
    {city:'台中',lat:24.179,lng:120.646,visits:14,venue:'洲際棒球場',years:'2023–2026',level:'起跑 / 跨年',score:68,bg:'linear-gradient(135deg,#123755,#35a88e,#ffd66b)',source:'https://www.bin-music.com.tw/news/1985',mood:'5525 起跑與跨年敘事，適合做年度專題。',set:['派對動物','OAOA','倔強','乾杯'],tasks:['補起跑場圖牆','整理跨年節點','補場館交通','補年度時間線']},
    {city:'高雄',lat:22.755,lng:120.310,visits:12,venue:'高雄世運主場館',years:'2024',level:'戶外大場',score:64,bg:'linear-gradient(135deg,#12304d,#168bc4,#ff9a56)',source:'#',mood:'世運主場館、港都夜景和大型戶外舞台。',set:['離開地球表面','戀愛ing','溫柔','乾杯'],tasks:['補五場歌單','補世運照片','補交通資料','補港都旅遊延伸']},
    {city:'香港',lat:22.282,lng:114.158,visits:10,venue:'中環海濱活動空間',years:'2024',level:'海港海外線',score:62,bg:'linear-gradient(135deg,#071424,#3374b6,#c96dff)',source:'#',mood:'維港、海風、城市天際線，是海外華語場景的高記憶點。',set:['知足','突然好想你','倔強','溫柔'],tasks:['補官方票務','補維港照片','補交通路線','整理海外線']},
    {city:'上海',lat:31.230,lng:121.474,visits:9,venue:'上海體育場',years:'2024',level:'連場都市',score:61,bg:'linear-gradient(135deg,#10243d,#26709a,#ff74b8)',source:'#',mood:'都市密度、連場演出和夜景霓虹。',set:['派對動物','夜訪吸血鬼','傷心的人別聽慢歌','乾杯'],tasks:['整理多場日曆','補城市夜景','補交通座位','補特殊曲']},
    {city:'北京',lat:39.904,lng:116.407,visits:8,venue:'國家體育場 鳥巢',years:'2024–2026',level:'超大型場',score:60,bg:'linear-gradient(135deg,#291733,#9340c9,#ffd66b)',source:'#',mood:'鳥巢級大型場館，適合做北方收官與大型場專題。',set:['諾亞方舟','成名在望','頑固','倔強'],tasks:['核對 2026 場次','補鳥巢官方圖','補收官專題','補票務交通']}
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
    ['相信音樂 五月天藝人專區','官方身份、作品與藝人介紹入口','https://www.bin-music.com.tw/artist/MAYDAY'],
    ['5525+2 台北大巨蛋新聞','台北大巨蛋 2026 年度場次與主線來源','https://www.bin-music.com.tw/news/2409'],
    ['5525 起跑 / 台中跨年線','補台中起跑、跨年與 5525 主線敘事','https://www.bin-music.com.tw/news/1985'],
    ['Mayday.jp Discography','海外作品、專輯與日文資料入口','https://www.mayday.jp/discography/']
  ];
  let active = cities[0], map = null, markers = [];

  function toast(text){ const t=$('#toast'); if(!t) return; t.textContent=text; t.classList.add('show'); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),1600); }
  function setPlayer(song, city=active.city){ $('#trackTitle').textContent = `${song} · ${city}現場檔案`; $('#trackSub').textContent = '資料型播放器：先保持穩定，不載入外部音源'; toast(`已加入播放器：${song}`); }
  function cityByName(name){ return cities.find(c => c.city === name) || cities[0]; }

  function shell(){
    $('#app').innerHTML = `
      <header class="ml-top">
        <a class="brand" href="#tour"><span class="brand-mark">M</span><span><b>MAYDAYLAND</b><small>Clean Product Build v29</small></span></a>
        <nav class="nav"><button data-view="tour" class="active">巡演地圖</button><button data-view="albums">唱片室</button><button data-view="songs">歌曲宇宙</button><button data-view="books">書籍出版</button><button data-view="timeline">歷程</button></nav>
        <label class="search"><span>⌕</span><input id="search" placeholder="搜尋城市、場館、歌曲…"></label>
      </header>
      <main id="page" class="page"></main>
      <footer class="player"><div><small>MAYDAYLAND RADIO</small><b id="trackTitle">倔強 · 現場心跳版</b><span id="trackSub">乾淨重構後的穩定播放器狀態</span></div><button id="playBtn">▶ 播放狀態</button></footer>
      <div id="toast" class="toast"></div>`;
    document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));
    $('#search').addEventListener('input', e => {
      const q = e.target.value.trim(); if(!q) return;
      const c = cities.find(x => x.city.includes(q) || x.venue.includes(q) || x.set.some(s=>s.includes(q)));
      if(c){ active = c; show('tour'); setTimeout(()=>selectCity(c.city),50); }
    });
    $('#playBtn').addEventListener('click',()=>setPlayer(active.set[0]));
    show('tour');
  }
  function setNav(view){ document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active', b.dataset.view===view)); }
  function show(view){ setNav(view); if(view==='tour') renderTour(); if(view==='albums') renderAlbums(); if(view==='songs') renderSongs(); if(view==='books') renderBooks(); if(view==='timeline') renderTimeline(); }
  function renderHero(){ return `<section class="hero"><span class="kicker">CLEAN RESET · NO MORE STACKED WIDGETS</span><h1>先恢復秩序，再做到驚喜。</h1><p>v29 取消 v15–v27 多版本疊加，只保留一套 CSS / JS。現在每個模組在正常文檔流中排列，不再互相遮擋。</p><div class="score-grid"><span><b>1</b>單一樣式系統</span><span><b>1</b>單一互動入口</span><span><b>0</b>舊 widget 疊層</span><span><b>70</b>暫估分數</span></div></section>`; }

  function renderTour(){
    $('#page').innerHTML = `${renderHero()}<section class="tour-layout"><aside class="panel"><span class="kicker">TOUR HEAT</span><h2>巡演城市</h2><p>點選城市後，地圖、右側詳情與下方 Landing Page 同步更新。</p><div class="city-list">${cities.map(c=>`<button data-city="${c.city}" class="${c.city===active.city?'active':''}"><span><b>${c.city}</b><br><small>${c.level}</small></span><small>${c.visits}</small></button>`).join('')}</div></aside><section class="panel map-card"><div class="map-head"><div><span class="kicker">REAL MAP</span><h2>巡演熱度地圖</h2></div><button class="pill-btn primary" id="fitMap">重置地圖</button></div><div id="tourMap"></div></section><aside class="panel" id="detail"></aside></section><section class="section" id="landing"></section>`;
    document.querySelectorAll('[data-city]').forEach(b=>b.addEventListener('click',()=>selectCity(b.dataset.city)));
    $('#fitMap').addEventListener('click',()=>fitMap());
    renderDetail(); renderLanding(); initMap();
  }
  function initMap(){
    if(map){ map.remove(); map = null; markers = []; }
    if(!window.L) return;
    map = L.map('tourMap',{zoomControl:true,attributionControl:true}).setView([29.5,117],5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
    const line = [];
    cities.forEach(c=>{
      line.push([c.lat,c.lng]);
      const r = Math.max(9, Math.min(28, 6 + c.visits * 0.75));
      const m = L.circleMarker([c.lat,c.lng],{radius:r,color:'#5beeff',weight:2,fillColor:c.visits>12?'#ff74b8':'#ffd66b',fillOpacity:.46}).addTo(map).bindPopup(`<b>${c.city}</b><br>${c.venue}<br>熱度 ${c.visits}`);
      m.on('click',()=>selectCity(c.city)); markers.push(m);
    });
    L.polyline(line,{color:'#5beeff',weight:3,opacity:.65,dashArray:'8 8'}).addTo(map); fitMap();
  }
  function fitMap(){ if(map) map.fitBounds(cities.map(c=>[c.lat,c.lng]),{padding:[35,35]}); }
  function selectCity(name){
    active = cityByName(name);
    document.querySelectorAll('[data-city]').forEach(b=>b.classList.toggle('active', b.dataset.city===active.city));
    renderDetail(); renderLanding();
    if(map){
      map.setView([active.lat,active.lng],8);
      markers.forEach((m,i)=>m.setStyle({weight:cities[i].city===active.city ? 5 : 2, fillOpacity:cities[i].city===active.city ? .75 : .42}));
    }
  }
  function renderDetail(){ $('#detail').innerHTML = `<div class="detail-visual" style="--city-bg:${active.bg}"><b>${active.city}</b></div><span class="kicker">CITY DOSSIER</span><h2>${active.venue}</h2><p>${active.mood}</p><div class="meta-grid"><span><b>${active.visits}</b>熱度</span><span><b>${active.score}%</b>完成度</span><span><b>${active.years}</b>年份</span><span><b>${active.level}</b>定位</span></div><div class="tags">${active.set.map(s=>`<span class="tag">${s}</span>`).join('')}</div><div class="actions"><button class="primary" id="pushSet">推送歌單</button>${active.source==='#'?'<button>來源待補</button>':`<a href="${active.source}" target="_blank" rel="noopener">官方來源</a>`}</div>`; $('#pushSet').addEventListener('click',()=>setPlayer(active.set[0])); }
  function renderLanding(){ $('#landing').innerHTML = `<div class="section-head"><div><span class="kicker">CITY LANDING PAGE</span><h2>${active.city} 專題頁</h2><p>採用正常文檔流，不使用漂浮 widget，避免遮擋。</p></div></div><div class="landing-grid"><div class="cards"><article class="card"><b>逐站歌單</b><div class="track-row">${active.set.map(s=>`<div class="track"><span>${s}</span><button data-song="${s}">播放</button></div>`).join('')}</div></article><article class="card"><b>待補任務</b><p>${active.tasks.map(t=>'· '+t).join('<br>')}</p></article></div><div class="city-card" style="--bgc:${active.bg}"><span class="kicker">VENUE HERO SLOT</span><b>${active.venue}</b><p>此區後續替換為授權或官方來源照片，現在先保留清楚佔位，不冒充真實照片。</p></div></div>`; document.querySelectorAll('[data-song]').forEach(b=>b.addEventListener('click',()=>setPlayer(b.dataset.song))); }
  function renderAlbums(){ $('#page').innerHTML = `${renderHero()}<section class="section"><div class="section-head"><div><span class="kicker">ALBUM ROOM</span><h2>時光唱片室</h2><p>先使用穩定封面牆，不再與城市浮層互相疊加。</p></div></div><div class="cover-grid">${albums.map(a=>`<article class="cover"><img src="${a[2]}" alt="${esc(a[0])}" loading="lazy"><span>${a[0]} · ${a[1]}</span></article>`).join('')}</div></section>`; }
  function renderSongs(){ $('#page').innerHTML = `${renderHero()}<section class="section"><div class="section-head"><div><span class="kicker">SONG UNIVERSE</span><h2>歌曲宇宙</h2><p>歌曲先按城市歌單整理，按鈕只更新播放器，不開新浮窗。</p></div></div><div class="cards">${cities.map(c=>`<article class="card"><b>${c.city} 推薦歌單</b>${c.set.map(s=>`<div class="track"><span>${s}</span><button data-play="${s}" data-cityname="${c.city}">加入</button></div>`).join('')}</article>`).join('')}</div></section>`; document.querySelectorAll('[data-play]').forEach(b=>b.addEventListener('click',()=>setPlayer(b.dataset.play,b.dataset.cityname))); }
  function renderBooks(){ $('#page').innerHTML = `${renderHero()}<section class="section"><span class="kicker">BOOKS & ARCHIVE</span><h2>書籍出版</h2><div class="cards"><article class="card"><b>書籍</b><p>待補封面、出版社、ISBN、官方/館藏來源。</p></article><article class="card"><b>樂譜</b><p>按專輯和歌曲關聯到唱片室。</p></article><article class="card"><b>場刊 / 票根</b><p>按城市專題掛接到巡演資料。</p></article></div></section>`; }
  function renderTimeline(){ $('#page').innerHTML = `${renderHero()}<section class="section"><span class="kicker">TIMELINE</span><h2>歷程與來源牆</h2><div class="table-wrap"><table class="data-table"><thead><tr><th>年份</th><th>事件</th><th>關聯</th><th>狀態</th></tr></thead><tbody><tr><td>1999</td><td>首張創作專輯</td><td>唱片室</td><td><span class="tag">可擴充</span></td></tr><tr><td>2011</td><td>第二人生 / 諾亞方舟</td><td>世界觀與巡演</td><td><span class="tag">待補圖文</span></td></tr><tr><td>2023–2026</td><td>5525 回到那一天</td><td>城市熱度地圖</td><td><span class="tag">持續補完</span></td></tr></tbody></table></div><div class="section-head" style="margin-top:16px"><div><span class="kicker">SOURCES</span><h2>來源入口</h2></div></div><div class="cards">${sources.map(s=>`<article class="card"><b>${s[0]}</b><p>${s[1]}</p><a class="tag" href="${s[2]}" target="_blank" rel="noopener">打開來源</a></article>`).join('')}</div></section>`; }
  document.addEventListener('DOMContentLoaded', shell);
})();
