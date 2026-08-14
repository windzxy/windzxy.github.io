(() => {
  'use strict';
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  const cities = [
    {city:'台北',lat:25.037,lng:121.565,visits:26,venue:'台北大巨蛋 / 台北小巨蛋',years:'1999–2026',level:'核心主場',score:78,tone:'#ff70b7',source:'https://www.bin-music.com.tw/news/2409',mood:'台灣主場、25 週年收官與大型場館記憶核心。',set:['回到那一天','倔強','突然好想你','知足','乾杯'],tasks:['逐日場次核對','官方主視覺與授權照片','交通與拍照點','逐日歌單與彩蛋']},
    {city:'台中',lat:24.179,lng:120.646,visits:14,venue:'洲際棒球場',years:'2023–2026',level:'起跑 / 跨年',score:72,tone:'#ffd36a',source:'https://www.bin-music.com.tw/news/1985',mood:'5525 起跑、跨年敘事與台灣中部大型場館線。',set:['派對動物','OAOA','倔強','乾杯'],tasks:['起跑場圖牆','跨年節點整理','場館交通','年度時間線']},
    {city:'高雄',lat:22.755,lng:120.310,visits:12,venue:'高雄世運主場館',years:'2024',level:'戶外大場',score:67,tone:'#ff9a56',source:'#',mood:'世運主場館、港都夜景與大型戶外舞台。',set:['離開地球表面','戀愛ing','溫柔','乾杯'],tasks:['五場歌單','世運照片','交通資料','港都旅遊延伸']},
    {city:'香港',lat:22.282,lng:114.158,visits:10,venue:'中環海濱活動空間',years:'2024',level:'海港海外線',score:66,tone:'#8f7dff',source:'#',mood:'維港、海風與城市天際線，是海外華語場景的高記憶點。',set:['知足','突然好想你','倔強','溫柔'],tasks:['官方票務','維港照片','交通路線','海外線整理']},
    {city:'上海',lat:31.230,lng:121.474,visits:9,venue:'上海體育場',years:'2024',level:'連場都市',score:64,tone:'#64e8ff',source:'#',mood:'都市密度、連場演出與夜景霓虹。',set:['派對動物','夜訪吸血鬼','傷心的人別聽慢歌','乾杯'],tasks:['多場日曆','城市夜景','交通座位','特殊曲目']},
    {city:'北京',lat:39.904,lng:116.407,visits:8,venue:'國家體育場 鳥巢',years:'2024–2026',level:'超大型場',score:63,tone:'#c96dff',source:'#',mood:'鳥巢級大型場館，適合做北方收官與大型場專題。',set:['諾亞方舟','成名在望','頑固','倔強'],tasks:['2026 場次核對','鳥巢官方圖','收官專題','票務交通']},
    {city:'深圳',lat:22.543,lng:114.057,visits:5,venue:'深圳大運中心體育場',years:'2024',level:'霓虹城市',score:59,tone:'#35d0ff',source:'#',mood:'年輕市場、現代城市與夜景霓虹。',set:['OAOA','戀愛ing','派對動物','突然好想你'],tasks:['場館照片','站點歌單','交通整理','票務來源']}
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
    ['1997','成軍與校園時期','從校園樂團逐步形成五月天的創作核心。'],
    ['1999','第一張創作專輯','正式建立作品入口，也作為唱片室的起點。'],
    ['2003','時光機','時間、青春與記憶成為網站視覺主軸。'],
    ['2011','第二人生','大型概念專輯與巡演視覺升級。'],
    ['2017','LiFE 人生無限公司','世界巡演資料館的重要支線。'],
    ['2023','5525 回到那一天起跑','台中起跑並串接 25 週年敘事。'],
    ['2026','5525+2 年度延伸','台北大巨蛋等大型場館成為高熱度節點。']
  ];

  const state = {view:'map', city:'台北', track:'倔強 · 現場心跳版', map:null, tile:null, markers:[]};
  const labels = {map:'巡演地圖',albums:'時光唱片室',songs:'歌曲宇宙',books:'書籍出版',timeline:'歷程'};
  const activeCity = () => cities.find(item => item.city === state.city) || cities[0];

  function scoreCard(title,big,small,value){
    return `<article class="score"><span class="kicker">${esc(title)}</span><b>${esc(big)}</b><small>${esc(small)}</small><div class="meter" style="--v:${value}%"><i></i></div></article>`;
  }

  function render(){
    const c = activeCity();
    $('#app').innerHTML = `<div class="ml">
      <header class="top">
        <a class="brand" href="#" data-view="map"><img src="./mayday-logo.svg?v=34.0.0" alt="Mayday"><span><b>MAYDAYLAND</b><small>TOUR ATLAS · v34</small></span></a>
        <nav class="nav">${Object.entries(labels).map(([id,label]) => `<button class="${state.view===id?'active':''}" data-view="${id}">${label}</button>`).join('')}</nav>
        <label class="search">⌕<input id="search" placeholder="搜索城市、場館、歌曲…" autocomplete="off"></label>
      </header>

      <section class="hero">
        <article class="hero-main glass">
          <span class="kicker">Clean entertainment product build</span>
          <h1>五月天巡演地圖與時光資料館</h1>
          <p>v34 保持單入口架構，重點提升主視覺、城市故事線和資料可信度。頁面不再堆疊舊 widget，每個區塊都有清楚任務：探索城市、看巡演、進唱片室、接歌單和來源牆。</p>
          <div class="hero-actions"><button class="primary" data-view="map">進入巡演地圖</button><button class="ghost" data-view="albums">查看唱片室</button></div>
        </article>
        <aside class="scoreboard glass">
          ${scoreCard('架構', '1 套入口', '無 v15–v33 疊層', 100)}
          ${scoreCard('視覺', '74 分', '仍需真實素材', 74)}
          ${scoreCard('城市', String(cities.length), '高熱度節點', 78)}
          ${scoreCard('目標', '85 分', '未到收貨', 72)}
        </aside>
      </section>

      <main class="shell">
        <aside class="rail panel glass">${rail()}</aside>
        <section class="stage">${stage()}</section>
        <aside class="dossier panel glass">${cityPanel(c)}</aside>
      </main>
    </div>`;
    bind();
    if (state.view === 'map') requestAnimationFrame(initMap);
  }

  function rail(){
    const total = cities.reduce((sum,c)=>sum+c.visits,0);
    return `<span class="kicker">Route index</span><h2>城市熱度</h2><p class="copy">選一座城市，地圖焦點、右側檔案和歌單會同步。熱度用演出密度視覺化，未核准資料會在 Roadmap 中標記。</p><div class="pillrow"><span class="pill">${total} 熱度</span><span class="pill">${cities.length} 城市</span><span class="pill">v34 清潔版</span></div><div class="citylist">${cities.map(c=>`<button class="city ${c.city===state.city?'active':''}" data-city="${esc(c.city)}"><b>${esc(c.city)}</b><span>${c.visits}</span><small>${esc(c.venue)}</small></button>`).join('')}</div>`;
  }

  function stage(){
    return `<section class="view ${state.view==='map'?'active':''}">${mapView()}</section>
      <section class="view ${state.view==='albums'?'active':''}">${albumsView()}</section>
      <section class="view ${state.view==='songs'?'active':''}">${songsView()}</section>
      <section class="view ${state.view==='books'?'active':''}">${booksView()}</section>
      <section class="view ${state.view==='timeline'?'active':''}">${timelineView()}</section>
      ${player()}`;
  }

  function mapView(){
    return `<article class="section mapcard glass"><div class="section-head"><div><span class="kicker">Live map layer</span><h2>巡演熱度地圖</h2><p class="copy">採用真實 Web 地圖層。圓點大小代表熱度，點擊城市會更新檔案與歌單。</p></div><div class="tabs"><button class="chip active" data-layer="street">街道</button><button class="chip" data-layer="dark">深色</button></div></div><div id="tourMap" class="mapwrap"></div><div class="legend"><span><i class="dot"></i>熱度節點</span><span><i class="dot" style="background:var(--gold)"></i>年度主線</span><span><i class="dot" style="background:var(--pink)"></i>待補資料</span></div></article><article class="section glass"><div class="section-head"><div><span class="kicker">Editorial rules</span><h2>這一版的底線</h2></div></div><div class="widegrid"><div class="card"><h3>不再用浮層硬疊</h3><p>所有內容進入固定版面流，播放器不遮擋地圖與城市卡。</p></div><div class="card"><h3>資料缺口可見</h3><p>還未核對的照片、歌單、場次會明確標記，不用假完成感掩蓋。</p></div></div></article>`;
  }

  function cityPanel(c){
    return `<div class="city-visual" style="background:linear-gradient(135deg,#07101e,${c.tone},#18243c)"><div><span class="kicker">City dossier</span><h2>${esc(c.city)}</h2><p>${esc(c.level)} · ${esc(c.years)}</p></div></div><div class="pillrow"><span class="pill">${c.visits} 次熱度</span><span class="pill">完成度 ${c.score}%</span><span class="pill">${esc(c.venue)}</span></div><p class="copy">${esc(c.mood)}</p><section><h2>推薦歌單</h2><div class="setlist">${c.set.map((song,i)=>`<div class="track"><span>${i+1}. ${esc(song)}</span><button data-track="${esc(song)}">播放</button></div>`).join('')}</div></section><section><h2>補完 Roadmap</h2><ul class="roadmap">${c.tasks.map(task=>`<li>${esc(task)}</li>`).join('')}</ul></section>${c.source !== '#' ? `<a class="primary source" href="${esc(c.source)}" target="_blank" rel="noopener">官方來源</a>` : `<div class="empty">此城市仍需要補官方來源與授權圖片。</div>`}`;
  }

  function albumsView(){
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">Discography room</span><h2>時光唱片室</h2><p class="copy">封面先用官方入口作為素材基底，後續補完整曲目、製作資訊和巡演關聯。</p></div></div><div class="grid">${albums.map(a=>`<article class="album"><span class="cover"><img src="${esc(a[2])}" alt="${esc(a[0])}" loading="lazy"></span><b>${esc(a[0])}</b><small>${esc(a[1])} · ${esc(a[3])}</small></article>`).join('')}</div></article>`;
  }

  function songsView(){
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">City setlists</span><h2>歌曲宇宙</h2><p class="copy">先把城市推薦歌單做成可操作資料，後續補逐日真實歌單。</p></div></div><div class="widegrid">${cities.slice(0,6).map(c=>`<div class="card"><span class="kicker">${esc(c.city)}</span><h3>${esc(c.level)}</h3><div class="setlist">${c.set.map(song=>`<div class="track"><span>${esc(song)}</span><button data-track="${esc(song)}">播放</button></div>`).join('')}</div></div>`).join('')}</div></article>`;
  }

  function booksView(){
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">Publications</span><h2>書籍、場刊與票根</h2><p class="copy">這一頁保留為資料牆，不再亂塞視覺小部件。後續每個出版物都需要來源、年份、封面和城市關聯。</p></div></div><div class="widegrid"><div class="card"><h3>書籍與成員作品</h3><p>補完整書籍封面、ISBN、出版年份、簡介與購買/官方來源。</p></div><div class="card"><h3>演唱會場刊</h3><p>場刊、票根、周邊與城市節點建立關聯，成為巡演記憶資料庫。</p></div></div></article><article class="section glass"><div class="section-head"><div><span class="kicker">Source wall</span><h2>來源牆</h2></div></div><div class="sourcegrid">${sources.map(s=>`<a class="source" href="${esc(s[2])}" target="_blank" rel="noopener"><b>${esc(s[0])}</b><small>${esc(s[1])}</small></a>`).join('')}</div></article>`;
  }

  function timelineView(){
    return `<article class="section glass"><div class="section-head"><div><span class="kicker">Memory timeline</span><h2>歷程展覽牆</h2><p class="copy">時間線不再是簡單文字列表，而是未來所有作品、城市、巡演與出版物的主索引。</p></div></div><div class="timeline">${timeline.map(t=>`<div class="time"><span class="year">${esc(t[0])}</span><div class="card"><h3>${esc(t[1])}</h3><p>${esc(t[2])}</p></div></div>`).join('')}</div></article>`;
  }

  function player(){
    return `<footer class="player glass"><div class="player-main"><span class="disc"></span><span><small>MAYDAYLAND RADIO</small><b id="track">${esc(state.track)}</b></span></div><div class="controls"><button data-skip="-1">‹</button><button data-toggle>▶</button><button data-skip="1">›</button></div></footer>`;
  }

  function bind(){
    $$('[data-view]').forEach(btn => btn.addEventListener('click', evt => {
      evt.preventDefault();
      state.view = btn.dataset.view;
      render();
      window.scrollTo({top:0,behavior:'smooth'});
    }));
    $$('[data-city]').forEach(btn => btn.addEventListener('click', () => {
      state.city = btn.dataset.city;
      state.view = 'map';
      render();
    }));
    $$('[data-track]').forEach(btn => btn.addEventListener('click', () => {
      state.track = `${btn.dataset.track} · ${activeCity().city} 現場記憶`;
      const now = $('#track');
      if(now) now.textContent = state.track;
    }));
    const search = $('#search');
    if(search){
      search.addEventListener('input', () => {
        const q = search.value.trim().toLowerCase();
        if(!q) return;
        const hit = cities.find(c => [c.city,c.venue,c.level].some(v => v.toLowerCase().includes(q)));
        if(hit){ state.city = hit.city; state.view = 'map'; render(); }
      });
    }
  }

  function initMap(){
    const el = $('#tourMap');
    if(!el || !window.L) return;
    state.map = L.map(el, {zoomControl:true, attributionControl:true}).setView([27.6,116.8], 5);
    setTile('street');
    const max = Math.max(...cities.map(c=>c.visits));
    state.markers = cities.map(c => {
      const radius = 10 + (c.visits / max) * 28;
      const marker = L.circleMarker([c.lat,c.lng], {
        radius,
        color:c.tone,
        weight:2,
        fillColor:c.tone,
        fillOpacity:.25 + (c.visits / max) * .45
      }).addTo(state.map);
      marker.bindTooltip(`${c.city} · ${c.visits} 次`, {direction:'top'});
      marker.on('click', () => {state.city = c.city; render();});
      return marker;
    });
    const c = activeCity();
    state.map.setView([c.lat,c.lng], c.city === '北京' ? 5 : 6, {animate:true});
    const active = state.markers.find((_, i) => cities[i].city === c.city);
    if(active) active.openTooltip();
    $$('.chip').forEach(btn => btn.addEventListener('click', () => setTile(btn.dataset.layer)));
  }

  function setTile(mode){
    if(!state.map || !window.L) return;
    if(state.tile) state.map.removeLayer(state.tile);
    const url = mode === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attr = mode === 'dark'
      ? '&copy; OpenStreetMap contributors &copy; CARTO'
      : '&copy; OpenStreetMap contributors';
    state.tile = L.tileLayer(url, {maxZoom:18, attribution:attr}).addTo(state.map);
    $$('.chip').forEach(btn => btn.classList.toggle('active', btn.dataset.layer === mode));
  }

  document.addEventListener('DOMContentLoaded', render);
})();