(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c));

  const officialCovers = [
    ['第一張創作專輯','https://www.bin-music.com.tw/album/artist_album/6256aaa3c124b-lw500h500.jpeg'],
    ['愛情萬歲','https://www.bin-music.com.tw/album/artist_album/5ecf788f0856f-lw420h420.jpg'],
    ['人生海海','https://www.bin-music.com.tw/album/artist_album/5ed7efaf18827-lw500h500.jpg'],
    ['時光機','https://www.bin-music.com.tw/album/artist_album/5ed8e4a2afda5-lw500h500.jpg'],
    ['神的孩子都在跳舞','https://www.bin-music.com.tw/album/artist_album/5ed8f08519147%2Btcw500h500.jpg'],
    ['知足 最真傑作選','https://www.bin-music.com.tw/album/artist_album/5ed80323cb98f-lw500h500.jpg']
  ];

  const cities = [
    {city:'台北', visits:26, venue:'台北大巨蛋 / 台北小巨蛋', years:'1999–2026', state:'主場級', completeness:72, set:['回到那一天','倔強','突然好想你','知足','乾杯'], assets:['大巨蛋主視覺','小巨蛋歷史照片','票根 / 場刊','交通動線'], source:'https://www.bin-music.com.tw/news/2409'},
    {city:'台中', visits:14, venue:'洲際棒球場', years:'2023–2026', state:'起跑/跨年', completeness:66, set:['派對動物','OAOA','倔強','乾杯'], assets:['起跑海報','跨年煙火','場館夜景','逐日歌單'], source:'https://www.bin-music.com.tw/news/1985'},
    {city:'高雄', visits:12, venue:'高雄世運主場館', years:'2024', state:'戶外大場', completeness:63, set:['離開地球表面','戀愛ing','溫柔','乾杯'], assets:['世運場館','港都夜景','五場歌單','交通'], source:'#'},
    {city:'香港', visits:10, venue:'中環海濱活動空間', years:'2024', state:'海港海外線', completeness:61, set:['知足','突然好想你','倔強','溫柔'], assets:['維港夜景','中環海濱','海外票務','歌迷應援'], source:'#'},
    {city:'上海', visits:9, venue:'上海體育場', years:'2024', state:'連場都市', completeness:60, set:['派對動物','夜訪吸血鬼','傷心的人別聽慢歌','乾杯'], assets:['上海體育場','多場日曆','地鐵交通','城市夜景'], source:'#'},
    {city:'北京', visits:8, venue:'國家體育場 鳥巢', years:'2024–2026', state:'超大型場', completeness:59, set:['諾亞方舟','成名在望','頑固','倔強'], assets:['鳥巢夜景','收官專題','票務資料','場館交通'], source:'#'},
    {city:'深圳', visits:5, venue:'深圳大運中心體育場', years:'2024', state:'霓虹城市', completeness:58, set:['OAOA','戀愛ing','派對動物','突然好想你'], assets:['大運中心','城市霓虹','票務','歌單'], source:'#'},
    {city:'成都', visits:4, venue:'東安湖體育公園主體育場', years:'2024', state:'西南慢歌', completeness:57, set:['溫柔','知足','我不願讓你一個人','乾杯'], assets:['東安湖','西南支線','慢歌歌單','交通'], source:'#'}
  ];

  const sourceWall = [
    ['相信音樂 五月天藝人專區','官方身份、作品與藝人介紹入口','https://www.bin-music.com.tw/artist/MAYDAY','官方'],
    ['5525+2 台北大巨蛋新聞','台北大巨蛋 2026 年度場次與主線來源','https://www.bin-music.com.tw/news/2409','官方'],
    ['5525 起跑 / 台中跨年線','補台中起跑、跨年與 5525 主線敘事','https://www.bin-music.com.tw/news/1985','官方'],
    ['Mayday.jp Discography','海外作品、專輯與日文資料入口','https://www.mayday.jp/discography/','官方'],
    ['逐站歌單資料','需要後續逐站補足歌單來源、安可與特殊曲','#','缺口'],
    ['場館照片 / 票根 / 場刊','需要建立素材授權與引用標記','#','缺口']
  ];

  function toast(text){
    let el = $('.v26-toast');
    if(!el){ el = document.createElement('div'); el.className='v26-toast'; document.body.append(el); }
    el.textContent = text; el.classList.add('show');
    clearTimeout(el._t); el._t = setTimeout(()=>el.classList.remove('show'), 1700);
  }

  function addStatus(){
    const views = $('.views');
    if(!views || $('.v26-status')) return;
    const sec = document.createElement('section');
    sec.className = 'v26-status';
    sec.innerHTML = `<article><small>CONTINUOUS ITERATION</small><b>未達 85 分，繼續施工</b><p>v26 開始補真實內容厚度：官方封面入口、城市專題表、逐站素材缺口、來源牆與播放器關聯。</p><div class="v26-meter" style="--v:66%"><i></i></div></article><article><small>MAP</small><b>熱度地圖</b><p>城市到訪次數、圖層、專題檔案。</p></article><article><small>CITY</small><b>8 城表格</b><p>場館、年份、歌單、完整度。</p></article><article><small>ALBUM</small><b>官方封面</b><p>先掛可引用封面入口。</p></article><article><small>NEXT</small><b>素材補完</b><p>照片、票根、場刊、歌單。</p></article>`;
    views.prepend(sec);
  }

  function cityRows(){
    return cities.map(c => `<tr data-v26-city="${esc(c.city)}"><td>${esc(c.city)}</td><td>${esc(c.venue)}</td><td>${esc(c.years)}</td><td><span class="v26-pill">${esc(c.state)}</span></td><td>${c.visits} 次熱度</td><td><div class="v26-meter" style="--v:${c.completeness}%"><i></i></div></td></tr>`).join('');
  }

  function sourceCards(){
    return sourceWall.map(([title,desc,url,type]) => `<article class="v26-card"><em>${esc(type)}</em><b>${esc(title)}</b><p>${esc(desc)}</p>${url==='#'?'<p><span class="v26-pill">待補來源</span></p>':`<p><a class="v26-pill" href="${esc(url)}" target="_blank" rel="noopener">打開來源</a></p>`}</article>`).join('');
  }

  function addTourBoard(){
    const tour = $('#tour .tour-stage');
    if(!tour || $('.v26-tour-board')) return;
    const board = document.createElement('section');
    board.className = 'v26-board v26-tour-board';
    board.innerHTML = `<div class="v26-board-head"><div><span class="v26-kicker">CITY DOSSIER MATRIX</span><h3>城市巡演資料表</h3><p>把地圖點位變成城市級專題：場館、年份、熱度、素材缺口、歌單和來源都要能追蹤。</p></div><button class="v26-open" data-v26-open="台北">打開台北專題</button></div><table class="v26-table"><thead><tr><th>城市</th><th>核心場館</th><th>年份</th><th>定位</th><th>熱度</th><th>完成度</th></tr></thead><tbody>${cityRows()}</tbody></table><div class="v26-mobile-note">手機端目前保留橫向資料表；下一輪會改成卡片式城市專題。</div>`;
    tour.append(board);
    board.querySelectorAll('[data-v26-city]').forEach(row => row.addEventListener('click', () => openDrawer(row.dataset.v26City)));
    board.querySelector('[data-v26-open]')?.addEventListener('click', e => openDrawer(e.currentTarget.dataset.v26Open));
  }

  function addAlbumBoard(){
    const albums = $('#albums');
    if(!albums || $('.v26-album-board')) return;
    const board = document.createElement('section');
    board.className = 'v26-board v26-album-board';
    board.innerHTML = `<div class="v26-board-head"><div><span class="v26-kicker">OFFICIAL COVER WALL</span><h3>官方封面素材入口</h3><p>先把可引用的相信音樂專輯封面入口掛上，後續再做本地快取、授權標記與完整 Discography。</p></div><a class="v26-open" href="https://www.bin-music.com.tw/artist/MAYDAY" target="_blank" rel="noopener">相信音樂來源</a></div><div class="v26-cover-wall">${officialCovers.map(([title,url])=>`<a class="v26-cover" href="${esc(url)}" target="_blank" rel="noopener"><img src="${esc(url)}" alt="${esc(title)}"><span>${esc(title)}</span></a>`).join('')}</div>`;
    albums.append(board);
  }

  function addSongsBoard(){
    const songs = $('#songs');
    if(!songs || $('.v26-song-board')) return;
    const board = document.createElement('section');
    board.className = 'v26-board v26-song-board';
    board.innerHTML = `<div class="v26-board-head"><div><span class="v26-kicker">CITY TO PLAYER</span><h3>城市歌單與播放器隊列</h3><p>每座城市先建立推薦隊列；點擊歌曲會更新底部播放器，下一輪補逐日官方/歌迷資料來源。</p></div></div><div class="v26-grid">${cities.slice(0,6).map(c=>`<article class="v26-card"><em>${esc(c.city)}</em><b>${esc(c.state)}歌單</b><p>${c.set.map(esc).join(' / ')}</p><div class="v26-queue-row">${c.set.map(s=>`<button data-v26-song="${esc(s)}" data-v26-city="${esc(c.city)}">${esc(s)}</button>`).join('')}</div></article>`).join('')}</div>`;
    songs.append(board);
    board.querySelectorAll('[data-v26-song]').forEach(btn => btn.addEventListener('click', () => setPlayer(btn.dataset.v26Song, btn.dataset.v26City)));
  }

  function addArchiveBoards(){
    const books = $('#books');
    if(books && !$('.v26-source-board')){
      const board = document.createElement('section');
      board.className = 'v26-board v26-source-board';
      board.innerHTML = `<div class="v26-board-head"><div><span class="v26-kicker">SOURCE WALL</span><h3>來源牆與素材管線</h3><p>正式完成品不能只靠漂亮卡片，要能清楚標記官方來源、缺口、下一步資料動作。</p></div></div><div class="v26-grid">${sourceCards()}</div>`;
      books.append(board);
    }
    const timeline = $('#timeline');
    if(timeline && !$('.v26-timeline-board')){
      const board = document.createElement('section');
      board.className = 'v26-board v26-timeline-board';
      board.innerHTML = `<div class="v26-board-head"><div><span class="v26-kicker">EDITORIAL ROADMAP</span><h3>時間線升級任務</h3><p>每個年份事件要連回：專輯、巡演、城市、來源、照片與播放器歌單。</p></div></div><div class="v26-grid"><article class="v26-card"><em>1999–2005</em><b>早期作品與 Live House</b><p>補首專、愛情萬歲、人生海海、時光機、神的孩子資料牆。</p></article><article class="v26-card"><em>2011–2019</em><b>大型世界觀巡演</b><p>補第二人生、諾亞方舟、LiFE 的世界線與舞台概念。</p></article><article class="v26-card"><em>2023–2026</em><b>5525 城市主線</b><p>接地圖熱度、城市檔案、逐站歌單與票根場刊。</p></article></div>`;
      timeline.append(board);
    }
  }

  function setPlayer(song, city){
    $('#miniTitle') && ($('#miniTitle').textContent = `${song} · ${city} 城市隊列`);
    $('#miniSub') && ($('#miniSub').textContent = 'v26 已把城市歌單接到底部播放器，下一步補真實音源/歌單來源。');
    $('#sheetTitle') && ($('#sheetTitle').textContent = `${song} · ${city} 推薦現場`);
    $('#sheetText') && ($('#sheetText').textContent = `${city} 專題已接入播放器隊列。正式版要補逐日歌單、來源、版本與現場音訊。`);
    toast(`已加入播放器：${song}`);
  }

  function openDrawer(city='台北'){
    const c = cities.find(x => x.city === city) || cities[0];
    let d = $('.v26-drawer');
    if(!d){ d = document.createElement('aside'); d.className = 'v26-drawer'; document.body.append(d); }
    d.innerHTML = `<div class="v26-drawer-head"><div><span class="v26-kicker">CITY SPECIAL</span><h3>${esc(c.city)} · 巡演專題</h3></div><button data-v26-close>關閉</button></div><div class="v26-drawer-body"><section class="v26-card"><em>${esc(c.state)}</em><b>${esc(c.venue)}</b><p>${esc(c.years)} · 到訪熱度 ${c.visits} · 完成度 ${c.completeness}%</p><div class="v26-meter" style="--v:${c.completeness}%"><i></i></div></section><section class="v26-card"><em>SETLIST QUEUE</em><b>推薦歌單</b><div class="v26-queue-row">${c.set.map(s=>`<button data-v26-song="${esc(s)}" data-v26-city="${esc(c.city)}">${esc(s)}</button>`).join('')}</div></section><section class="v26-card"><em>PHOTO PIPELINE</em><b>照片牆需求</b><div class="v26-gallery">${c.assets.map(a=>`<div class="v26-shot">${esc(a)}</div>`).join('')}</div></section><section class="v26-card"><em>SOURCE</em><b>資料來源狀態</b><div class="v26-source-list">${c.source==='#'?'<span>官方來源待補 <b>缺口</b></span>':`<a href="${esc(c.source)}" target="_blank" rel="noopener">打開官方來源 <b>↗</b></a>`}<span>逐日歌單 / 場刊 / 票根 <b>待補</b></span><span>交通 / 拍照點 / 周邊 <b>待補</b></span></div></section></div>`;
    d.querySelector('[data-v26-close]')?.addEventListener('click', () => d.classList.remove('open'));
    d.querySelectorAll('[data-v26-song]').forEach(btn => btn.addEventListener('click', () => setPlayer(btn.dataset.v26Song, btn.dataset.v26City)));
    requestAnimationFrame(() => d.classList.add('open'));
  }

  function wireSearch(){
    const input = $('#globalSearch');
    if(!input || input.dataset.v26 === '1') return;
    input.dataset.v26 = '1';
    input.addEventListener('keydown', e => {
      if(e.key !== 'Enter') return;
      const q = input.value.trim();
      const c = cities.find(x => q.includes(x.city) || x.venue.includes(q));
      if(c) openDrawer(c.city);
    });
  }

  function boot(){
    $('.md-app')?.classList.add('v26');
    addStatus(); addTourBoard(); addAlbumBoard(); addSongsBoard(); addArchiveBoards(); wireSearch();
    $('#mapTitle') && ($('#mapTitle').textContent = '回到那一天 · 巡演熱度與城市專題');
    const p = $('.tour-rail p');
    if(p) p.textContent = 'v26 繼續補內容厚度：官方封面入口、城市專題表、逐站資料、素材缺口、來源牆與播放器關聯。';
  }

  document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 760));
})();