(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c));

  const albums = [
    {title:'第一張創作專輯',year:'1999',era:'1990s',type:'起點',cover:'linear-gradient(135deg,#17486d,#e9cc78,#bd4e7d)',tracks:['志明與春嬌','愛情的模樣','軋車','生活'],note:'樂團、校園、Live House 的原點。這頁應該讓人一眼看到五月天的起跑線。'},
    {title:'愛情萬歲',year:'2000',era:'2000s',type:'青春',cover:'linear-gradient(135deg,#253f63,#a35a7e,#ffba6a)',tracks:['終結孤單','溫柔','愛情萬歲','反而'],note:'把孤單、溫柔、城市與青春寫成更直接的搖滾語言。'},
    {title:'人生海海',year:'2001',era:'2000s',type:'命題',cover:'linear-gradient(135deg,#254763,#f2a64d,#7a2739)',tracks:['人生海海','候鳥','好不好','相信'],note:'從校園記憶走向人生與世界，適合與巡演時間線聯動。'},
    {title:'時光機',year:'2003',era:'2000s',type:'時間',cover:'linear-gradient(135deg,#192a45,#83d3f0,#efc77d)',tracks:['輕功','恆星的恆心','而我知道','雌雄同體'],note:'整站「回到那一天」的概念核心，可作為唱片室的時光入口。'},
    {title:'神的孩子都在跳舞',year:'2004',era:'2000s',type:'現場能量',cover:'linear-gradient(135deg,#30224b,#de5a91,#ffd46c)',tracks:['孫悟空','倔強','垃圾車','晚安 地球人'],note:'現場能量、樂團意志、安可大合唱的核心專輯。'},
    {title:'知足 最真傑作選',year:'2005',era:'2000s',type:'精選',cover:'linear-gradient(135deg,#163a50,#e6d4a8,#d45e83)',tracks:['知足','志明與春嬌','溫柔','倔強'],note:'給新訪客的最佳入口：快速理解早期代表作品和大合唱情緒。'},
    {title:'為愛而生',year:'2006',era:'2000s',type:'情感',cover:'linear-gradient(135deg,#273a55,#f0cf6c,#55b7a5)',tracks:['天使','我又初戀了','香水','為愛而生'],note:'從熱血走向柔軟，讓唱片室不只是收藏，也有情感層次。'},
    {title:'後青春期的詩',year:'2008',era:'2000s',type:'成長',cover:'linear-gradient(135deg,#233949,#4f7fa5,#f0c17d)',tracks:['突然好想你','你不是真正的快樂','生存以上 生活以下','笑忘歌'],note:'長大以後的失落與和解，是大眾記憶最強的章節之一。'},
    {title:'第二人生',year:'2011',era:'2010s',type:'世界觀',cover:'linear-gradient(135deg,#181d2f,#4a7aff,#f5d365)',tracks:['諾亞方舟','我不願讓你一個人','星空','第二人生'],note:'末日、重生、大型舞台敘事，應與巡演地圖深度串接。'},
    {title:'自傳',year:'2016',era:'2010s',type:'回望',cover:'linear-gradient(135deg,#0e2028,#2a5365,#f7971e)',tracks:['派對動物','後來的我們','成名在望','頑固'],note:'樂團自身與時代記憶的整理，是檔案館的總結章。'},
    {title:'5525 Live Archive',year:'2023–2026',era:'現場',type:'巡演檔案',cover:'linear-gradient(135deg,#071424,#5beeff,#ff74b8)',tracks:['回到那一天','倔強','突然好想你','乾杯'],note:'每一站都應建立照片、歌單、票務、場館、應援與交通資料。'}
  ];

  const playlists = [
    {title:'現場必唱核心',cover:'linear-gradient(135deg,#071424,#5beeff,#ff74b8)',desc:'為地圖服務：點擊城市後能快速匹配該站的現場情緒與歌單。',songs:['倔強','戀愛ing','派對動物','離開地球表面','突然好想你','知足'],tags:['Live','大合唱','安可']},
    {title:'青春情歌記憶',cover:'linear-gradient(135deg,#163a50,#e6d4a8,#d45e83)',desc:'把愛情、孤單、錯過與成長做成更適合瀏覽的主題館。',songs:['溫柔','知足','突然好想你','我不願讓你一個人','後來的我們','天使'],tags:['情歌','青春','回憶']},
    {title:'世界觀與末日感',cover:'linear-gradient(135deg,#181d2f,#4a7aff,#f5d365)',desc:'適合與諾亞方舟、第二人生、LiFE 巡演做世界線關聯。',songs:['諾亞方舟','第二人生','星空','成名在望','頑固','任意門'],tags:['世界觀','舞台','電影感']},
    {title:'城市夜跑歌單',cover:'linear-gradient(135deg,#0b1d2c,#1c7fb4,#f7739a)',desc:'給巡演城市頁的延伸體驗：台北、上海、香港、新加坡等夜景場景。',songs:['夜訪吸血鬼','離開地球表面','OAOA','派對動物','乾杯','傷心的人別聽慢歌'],tags:['城市','速度','夜景']}
  ];

  const books = [
    {title:'五月天的素人自拍',meta:'早期書籍 / 圖文記錄',type:'樂團起點',cover:'linear-gradient(135deg,#315070,#d8d6bf)',note:'需要補封面、出版社、ISBN、購書/館藏連結。'},
    {title:'下課後，怪獸家點名！',meta:'樂譜特號 / 訪談',type:'樂譜資料',cover:'linear-gradient(135deg,#6079a0,#f0d9a5)',note:'適合拆成樂譜、照片、成員訪談三個資料頁。'},
    {title:'Happy.Birth.Day',meta:'阿信文字作品',type:'成員文集',cover:'linear-gradient(135deg,#836786,#dcc1c8)',note:'可與歌詞、創作脈絡、文學感頁面相連。'},
    {title:'浪漫的逃亡',meta:'成員出版 / 旅行文字',type:'周邊書籍',cover:'linear-gradient(135deg,#254763,#eaae57)',note:'需要補完整出版資訊與封面。'},
    {title:'因為留不住',meta:'文字作品 / 創作延伸',type:'成員作品',cover:'linear-gradient(135deg,#142335,#4c76b8,#f0d06d)',note:'適合連到「歌詞與文字」專區。'},
    {title:'巡演場刊與票根',meta:'待建立 / 站點關聯',type:'演唱會檔案',cover:'linear-gradient(135deg,#071424,#5beeff,#ff74b8)',note:'每個城市頁都應該能掛載場刊、票根、海報與應援物。'}
  ];

  const eras = [
    {year:'1997',title:'正式成軍',text:'從樂團編制與校園現場開始，建立 Maydayland 的起點。',side:'人物 / 成軍 / Live House'},
    {year:'1999',title:'首張專輯與巡演起點',text:'作品、演出、城市初步連起，應做成第一張地圖與唱片室入口。',side:'首專 / 台北 / 青春'},
    {year:'2003',title:'復出與時光機',text:'「時間」成為網站主題語言，適合串接回到那一天。',side:'時光 / 復出 / 創作'},
    {year:'2011',title:'第二人生與諾亞方舟',text:'世界觀、末日、重生和大型巡演真正成形。',side:'世界觀 / 舞台 / 電影感'},
    {year:'2017',title:'人生無限公司',text:'巡演故事可以拆成任務、部門、城市任務牆。',side:'LiFE / 世界巡演 / 任務制'},
    {year:'2023',title:'5525 回到那一天',text:'用熱度地圖、逐站資料、歌單與場館檔案，構成目前主體。',side:'5525 / 熱度地圖 / 城市檔案'},
    {year:'2026',title:'5525+2 收官延伸',text:'台北、北京等大型場次應做成重點專題頁。',side:'收官 / 大型場館 / 專題'}
  ];

  function toast(text){
    let el = $('.v23-toast');
    if(!el){ el = document.createElement('div'); el.className='v23-toast'; document.body.append(el); }
    el.textContent = text; el.classList.add('show');
    clearTimeout(el._t); el._t = setTimeout(()=>el.classList.remove('show'), 1800);
  }

  function addCommandStrip(){
    const views = $('.views');
    if(!views || $('.v23-command-strip')) return;
    const div = document.createElement('section');
    div.className = 'v23-command-strip';
    div.innerHTML = `
      <article class="v23-command-card main"><small>PRODUCT GATE</small><b>80 分門檻重構中</b><p>這一輪重點是讓每個分頁都像正式內容產品，而不是 demo。</p></article>
      <article class="v23-command-card"><small>MAP</small><b>熱度追蹤</b><p>城市到訪越多，地圖顏色越重。</p></article>
      <article class="v23-command-card"><small>ROOM</small><b>唱片室</b><p>專輯、曲目、年代和巡演關聯。</p></article>
      <article class="v23-command-card"><small>ARCHIVE</small><b>出版檔案</b><p>書籍、樂譜、場刊、票根入口。</p></article>
      <article class="v23-command-card"><small>SCORE</small><div class="v23-score-ring"><i class="v23-ring"><span>80</span></i><p>先以 80 分作為下一個可看門檻。</p></div></article>`;
    views.prepend(div);
  }

  function installAlbumRoom(){
    const root = $('#albums'); if(!root) return;
    let active = albums[5];
    const render = (era='all') => {
      const list = era === 'all' ? albums : albums.filter(a => a.era === era || a.era === '現場');
      root.innerHTML = `<div class="v23-product-view"><div class="v23-head"><div><small>ALBUM ROOM · EDITORIAL ARCHIVE</small><h2>五月天時光唱片室</h2><p>不再只是 CD 格子：每張唱片都帶年代、曲目、時代說明，後續可掛官方封面、巡演、歌單和購買/串流入口。</p></div><div class="v23-actions"><button class="active" data-era="all">全部</button><button data-era="1990s">1990s</button><button data-era="2000s">2000s</button><button data-era="2010s">2010s</button><button data-era="現場">現場</button></div></div><div class="v23-room-grid"><aside class="v23-side"><h3>唱片室索引</h3><p>用年代與敘事分類，而不是把專輯當普通圖片列表。</p><div class="v23-filter"><button><span>唱片數</span><b>${albums.length}</b></button><button><span>核心曲目</span><b>${albums.reduce((n,a)=>n+a.tracks.length,0)}</b></button><button><span>待補官方封面</span><b>高優先</b></button></div><div class="v23-metrics"><span><b>1999</b>起點</span><span><b>5525</b>現場檔案</span><span><b>4</b>內容入口</span><span><b>80%</b>架構完成</span></div></aside><main class="v23-shelf">${list.map(a=>`<button class="v23-album ${a.title===active.title?'active':''}" data-album="${esc(a.title)}" style="--cover:${a.cover}"><span class="v23-cover"></span><b>${esc(a.title)}</b><small>${esc(a.year)} · ${esc(a.type)}</small></button>`).join('')}</main><aside class="v23-detail" id="v23AlbumDetail"></aside></div></div>`;
      $$('.v23-actions button', root).forEach(b=>b.addEventListener('click',()=>render(b.dataset.era)));
      $$('.v23-album', root).forEach(b=>b.addEventListener('click',()=>{ active = albums.find(a=>a.title===b.dataset.album) || active; render(era); }));
      renderAlbumDetail(active);
    };
    render();
  }

  function renderAlbumDetail(a){
    const box = $('#v23AlbumDetail'); if(!box) return;
    box.innerHTML = `<h3>${esc(a.title)}</h3><p><b>${esc(a.year)} · ${esc(a.era)} · ${esc(a.type)}</b></p><div class="v23-cover" style="--cover:${a.cover};height:220px;margin:12px 0"></div><p>${esc(a.note)}</p><div class="v23-tracklist">${a.tracks.map((t,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><span>${esc(t)}</span><em>檔案</em></div>`).join('')}</div><div class="v23-link-grid"><button data-play-album="${esc(a.title)}">播放隊列</button><button>關聯巡演</button><a href="https://www.mayday.jp/discography/" target="_blank" rel="noreferrer">Discography</a><a href="https://www.bin-music.com.tw/artist/MAYDAY" target="_blank" rel="noreferrer">相信音樂</a></div>`;
    box.querySelector('[data-play-album]')?.addEventListener('click',()=>toast(`已把「${a.title}」加入播放器隊列`));
  }

  function installSongs(){
    const root = $('#songs'); if(!root) return;
    root.innerHTML = `<div class="v23-product-view"><div class="v23-head"><div><small>SONG WATCH · MAYDAY RADIO</small><h2>歌曲宇宙</h2><p>把歌曲頁從 demo 歌單改成可操作的編輯型音樂資料館：每個主題都有隊列、標籤、播放器入口。</p></div><div class="v23-actions"><button class="active">現場</button><button>青春</button><button>世界觀</button><button>城市</button></div></div><div class="v23-playlist-layout"><main class="v23-playlist-list">${playlists.map((p,i)=>`<article class="v23-playlist" style="--cover:${p.cover}"><div class="v23-play-art"></div><div><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p><div class="v23-tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div></div><button class="v23-play-btn" data-playlist="${i}">▶</button></article>`).join('')}</main><aside class="v23-panel v23-now"><h3>播放器隊列</h3><p>點擊任一主題會同步到右側隊列，讓歌曲頁真正和底部播放器聯動。</p><div class="v23-player-pro"><div class="v23-player-cover"></div><div><b id="v23QueueTitle">現場必唱核心</b><div class="v23-wave">${Array.from({length:28},(_,i)=>`<i style="--h:${10+Math.abs(Math.sin(i))*24}px"></i>`).join('')}</div><div class="v23-player-controls"><button class="primary">播放</button><button>隨機</button><button>收藏</button></div></div></div><div class="v23-queue" id="v23Queue"></div></aside></div></div>`;
    const setQueue = i => { const p = playlists[i] || playlists[0]; $('#v23QueueTitle') && ($('#v23QueueTitle').textContent = p.title); $('#v23Queue') && ($('#v23Queue').innerHTML = p.songs.map((s,n)=>`<div><span>${String(n+1).padStart(2,'0')}</span><b>${esc(s)}</b><em>${n%2?'Live':'Studio'}</em></div>`).join('')); toast(`已切換到「${p.title}」`); };
    $$('.v23-play-btn', root).forEach(b=>b.addEventListener('click',()=>setQueue(+b.dataset.playlist)));
    setQueue(0);
  }

  function installBooks(){
    const root = $('#books'); if(!root) return;
    root.innerHTML = `<div class="v23-product-view"><div class="v23-head"><div><small>BOOKS · PUBLICATIONS · TICKETS</small><h2>書籍與出版品</h2><p>書籍頁升級成檔案館書架：正式書籍、樂譜、成員文集、巡演場刊與票根都納入同一套資料模型。</p></div><div class="v23-actions"><button class="active">全部</button><button>書籍</button><button>樂譜</button><button>場刊</button></div></div><div class="v23-book-grid">${books.map(b=>`<article class="v23-book" style="--cover:${b.cover}"><div class="v23-book-cover"></div><div><small>${esc(b.type)}</small><h3>${esc(b.title)}</h3><p>${esc(b.meta)}</p><p>${esc(b.note)}</p><div class="v23-tags"><span>待補封面</span><span>待補來源</span></div></div></article>`).join('')}</div></div>`;
  }

  function installTimeline(){
    const root = $('#timeline'); if(!root) return;
    root.innerHTML = `<div class="v23-product-view"><div class="v23-head"><div><small>TIMELINE · EXHIBITION WALL</small><h2>歷程展覽牆</h2><p>時間線不再只是年份列表，而是把作品、巡演、城市、歌曲與出版檔案連成可擴充的展覽牆。</p></div><div class="v23-actions"><button class="active">長線敘事</button><button>作品</button><button>巡演</button><button>城市</button></div></div><div class="v23-timeline">${eras.map(e=>`<article class="v23-era"><div class="v23-year">${esc(e.year)}</div><div class="v23-era-main"><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p><div class="v23-tags"><span>作品關聯</span><span>巡演關聯</span><span>城市檔案</span></div></div><aside class="v23-era-side"><b>關聯入口</b><p>${esc(e.side)}</p></aside></article>`).join('')}</div></div>`;
  }

  function enhancePlayer(){
    const sheet = $('#playerSheet .sheet-inner');
    if(sheet && !sheet.dataset.v23){
      sheet.dataset.v23 = '1';
      sheet.insertAdjacentHTML('beforeend', `<div class="v23-panel" style="position:static;width:auto;max-height:none;margin-top:14px"><h3>Maydayland Radio Pro</h3><p>播放器下一步要接入真正歌單資料：城市頁 → 該站歌單 → 現場版本 → 專輯來源。現在先完成 UI 狀態與隊列架構。</p><div class="v23-link-grid"><button>城市歌單</button><button>專輯來源</button><button>現場版本</button><button>收藏隊列</button></div></div>`);
    }
  }

  function bindNavBridge(){
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-nav-target]');
      if(!btn) return;
      const target = btn.dataset.navTarget;
      document.querySelector(`[data-nav="${target}"]`)?.click();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.md-app')?.classList.add('v23');
    addCommandStrip();
    installAlbumRoom();
    installSongs();
    installBooks();
    installTimeline();
    enhancePlayer();
    bindNavBridge();
    toast('v23：其他分頁已升級為正式產品架構');
  });
})();