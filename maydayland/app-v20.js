(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c));

  const officialLinks = [
    ['相信音樂 五月天藝人專區','https://www.bin-music.com.tw/artist/MAYDAY'],
    ['5525+2 台北大巨蛋官方消息','https://www.bin-music.com.tw/news/2409'],
    ['五月天日本 Discography','https://www.mayday.jp/discography/']
  ];

  const phases = [
    {title:'回到那一天 5525+2', year:'2026', city:'台北 / 北京', focus:'台北大巨蛋、鳥巢級大型場館、25 週年收官敘事', progress:'主線 70%'},
    {title:'回到那一天 5525+1', year:'2025', city:'台北 / 貴陽 / 台中', focus:'年度延伸、跨年場、城市節點補完', progress:'資料 55%'},
    {title:'回到那一天 5525', year:'2023–2024', city:'台中 / 高雄 / 香港 / 北京 / 深圳 / 太原 / 武漢 / 成都 / 上海', focus:'25 週年主路線，需要逐站照片與歌單', progress:'路線 75%'},
    {title:'人生無限公司 LiFE', year:'2017–2019', city:'世界巡迴', focus:'適合做成公司任務支線與大型世界觀檔案', progress:'待補 40%'},
    {title:'諾亞方舟 / DNA / 早期巡演', year:'1999–2014', city:'亞洲 / 世界', focus:'建立從 Live House 到世界舞台的長線敘事', progress:'待補 35%'}
  ];

  const mapStops = [
    ['台北','台北大巨蛋 / 台北小巨蛋','2025–2026','核心城市'],['台中','洲際棒球場','2023–2026','跨年起點'],['高雄','世運主場館','2024','戶外大場'],['香港','中環海濱','2024','海港地標'],['北京','鳥巢','2024–2026','超大型場'],['深圳','大運中心','2024','城市霓虹'],['貴陽','貴陽站','2025','待補'],['太原','山西體育中心','2024','中原站'],['武漢','武漢體育中心','2024','江城站'],['成都','東安湖','2024','西南站'],['上海','上海體育場','2024','都市夜景'],['新加坡','海外巡演入口','歷年','海外線']
  ];

  const albums = [
    ['第一張創作專輯','1999','1990s','青春起點','linear-gradient(135deg,#17486d,#e9cc78,#bd4e7d)',['志明與春嬌','愛情的模樣','軋車','生活'],'從社團、校園與 Live House 出發，保留最粗糙也最珍貴的樂團起點。'],
    ['愛情萬歲','2000','2000s','狂熱青春','linear-gradient(135deg,#2f5e7a,#755178,#c96e84)',['終結孤單','溫柔','愛情萬歲','反而'],'青春、愛情、孤單和城市被寫成更直接的搖滾語言。'],
    ['人生海海','2001','2000s','世界變大','linear-gradient(135deg,#20435b,#eaae57,#8c323d)',['人生海海','候鳥','好不好','相信'],'巡演敘事與人生命題開始變大，適合連接地圖時間線。'],
    ['時光機','2003','2000s','時間感','linear-gradient(135deg,#233958,#83d3f0,#efc77d)',['輕功','恆星的恆心','而我知道','賭神'],'把回憶、時間與成長做成唱片室的核心轉軸。'],
    ['神的孩子都在跳舞','2004','2000s','樂團能量','linear-gradient(135deg,#30224b,#de5a91,#ffd46c)',['孫悟空','倔強','垃圾車','晚安 地球人'],'現場能量與樂團意志最清晰的時代之一。'],
    ['知足 最真傑作選','2005','2000s','珍藏精選','linear-gradient(135deg,#163a50,#e6d4a8,#d45e83)',['知足','志明與春嬌','溫柔','倔強'],'把早期代表作集中成青春檔案，也適合作為新訪客入口。'],
    ['為愛而生','2006','2000s','情感擴張','linear-gradient(135deg,#273a55,#f0cf6c,#55b7a5)',['天使','我又初戀了','香水','為愛而生'],'從熱血走向柔軟，讓「愛」成為整張專輯的核心。'],
    ['後青春期的詩','2008','2000s','長大以後','linear-gradient(135deg,#233949,#4f7fa5,#f0c17d)',['突然好想你','你不是真正的快樂','生存以上 生活以下','笑忘歌'],'成長、失落與和解，是大眾記憶最強的一個時期。'],
    ['第二人生','2011','2010s','世界末日','linear-gradient(135deg,#181d2f,#4a7aff,#f5d365)',['諾亞方舟','我不願讓你一個人','星空','第二人生'],'末日、重生與大型舞台敘事，應與巡演地圖深度聯動。'],
    ['自傳','2016','2010s','人生回望','linear-gradient(135deg,#0e2028,#2a5365,#f7971e)',['派對動物','後來的我們','成名在望','頑固'],'把樂團自身與時代記憶重新整理，是檔案館的總結章。'],
    ['Mayday 2019 Blue','2019','海外/日本','日本作品入口','linear-gradient(135deg,#06162b,#188fe3,#8de8ff)',['新版入口','海外發行','日文資料'],'日本官網 Discography 入口，後續接封面與曲目資料。'],
    ['5525 Live Archive','2023–2026','巡演現場','現場檔案入口','linear-gradient(135deg,#071424,#5beeff,#ff74b8)',['回到那一天','現場歌單','城市版'],'為每一站建立對應歌單、照片與應援檔案。']
  ].map(([title,year,era,type,color,tracks,text]) => ({title,year,era,type,color,tracks,text}));

  const songSections = [
    {title:'現場必唱核心', cover:'linear-gradient(135deg,#071424,#5beeff,#ff74b8)', desc:'為巡演地圖服務：點擊城市後能直接對應現場情緒與歌單。', songs:['倔強','戀愛ing','派對動物','離開地球表面','突然好想你','知足'], tags:['Live','大合唱','安可']},
    {title:'青春與成長線', cover:'linear-gradient(135deg,#283048,#859398,#ffd66b)', desc:'從志明與春嬌到後青春期，讓歌曲頁像一條能聽的時間線。', songs:['志明與春嬌','溫柔','人生海海','笑忘歌','你不是真正的快樂','後來的我們'], tags:['青春','成長','回憶']},
    {title:'世界觀與大型舞台', cover:'linear-gradient(135deg,#000428,#004e92,#9a7cff)', desc:'第二人生、諾亞方舟、LiFE 類型歌曲適合接巡演大型視覺。', songs:['諾亞方舟','第二人生','星空','成名在望','頑固','任意門'], tags:['世界觀','舞台','概念']},
    {title:'溫柔夜歌', cover:'linear-gradient(135deg,#16222a,#3a6073,#ff74b8)', desc:'給唱片室與深夜模式使用的慢歌入口。', songs:['溫柔','如煙','我不願讓你一個人','天使','後來的我們','好好'], tags:['慢歌','深夜','情緒']}
  ];

  const books = [
    ['五月天的素人自拍','書籍','2001 / 典藏紀念','linear-gradient(135deg,#375878,#ded3bc)','第一本書式資料，應做成早期檔案入口。'],
    ['下課後，怪獸家點名！','樂譜特號','樂譜 / 寫真 / 訪談','linear-gradient(135deg,#607aa2,#efdda9)','和音樂學習、樂團創作方法形成連結。'],
    ['Happy.Birth.Day','成員文集','阿信文字作品','linear-gradient(135deg,#8a6b8b,#dfc4cb)','補充五月天文字宇宙，不只看唱片。'],
    ['浪漫的逃亡','旅行文字','成員出版','linear-gradient(135deg,#34495e,#e6b980)','適合做「城市/旅行/巡演」側欄。'],
    ['我的搖滾媽咪','繪本/故事','成員出版','linear-gradient(135deg,#243b55,#d4fc79)','拓展非專輯內容。'],
    ['因為留不住','文字作品','成員出版','linear-gradient(135deg,#2c3e50,#fd746c)','建立五月天文字檔案區。'],
    ['5525 巡演場刊','場刊週邊','待補官方資料','linear-gradient(135deg,#071424,#5beeff,#ff74b8)','下一步應補票根、場刊、城市限定內容。'],
    ['Live Photo Book','影像檔案','待補官方圖片','linear-gradient(135deg,#1d2671,#c33764)','正式版需要接合法公開圖源。']
  ];

  const timeline = [
    ['1997','正式成軍','從校園、社團與地下現場開始，這是 Maydayland 的入口原點。'],
    ['1999','第一張創作專輯','首張作品推出，歌曲與早期巡演可以在唱片室和地圖中互相跳轉。'],
    ['2000','愛情萬歲','青春、城市與孤單形成更鮮明的流行記憶。'],
    ['2001','人生海海','大型巡演敘事開始變重要，網站應把這段做成早期巡演展區。'],
    ['2004','神的孩子都在跳舞','倔強等作品成為現場核心，播放器與歌單區需要重點呈現。'],
    ['2011','第二人生 / 諾亞方舟','大型世界觀和舞台規模提升，適合地圖化與展覽化。'],
    ['2017','人生無限公司 LiFE','把巡演世界觀做成「公司任務地圖」支線。'],
    ['2023','5525 回到那一天起跑','從台中開始的 25 週年路線，需要成為網站主線。'],
    ['2025','5525+1','補年度城市、台北大巨蛋、貴陽、台中等分支。'],
    ['2026','5525+2','建立收官敘事、台北/北京大型場館重點頁。']
  ];

  function enhanceTour(){
    const rail = $('.tour-rail');
    const list = $('#tourList');
    const scene = $('#mapScene');
    if(!rail || !list) return;
    rail.querySelector('h1').textContent = '巡演不只是路線，是一座城市一座城市的記憶檔案';
    rail.querySelector('p').textContent = 'v20 重新整理巡演資訊層級：年份、城市、場館、資料完整度、官方來源與下一步待補資料全部分開。地圖負責導航，右側負責沉浸式檔案。';
    list.innerHTML = phases.map((p,i)=>`<button class="tour-card ${i===0?'active':''}" style="--tour:${i%2?'#ff74b8':'#5beeff'}"><b>${esc(p.title)}</b><small>${esc(p.year)} · ${esc(p.city)}</small><span class="years"><span>${esc(p.progress)}</span><span>${esc(p.focus)}</span></span></button>`).join('');
    rail.insertAdjacentHTML('beforeend', `<div class="v20-kpi"><div><b>12</b><small>城市節點</small></div><div><b>5</b><small>巡演階段</small></div><div><b>3</b><small>圖層模式</small></div></div><div class="v20-tour-card"><h3>下一步補完重點</h3><p>每站需要補官方照片、票務頁、場館交通、歌單、場刊/應援資料，才能從 55 分升到 80+。</p><div class="v20-mini-timeline">${phases.slice(0,4).map(p=>`<span><b>${esc(p.year)}</b>${esc(p.title)}</span>`).join('')}</div></div><div class="v20-source">${officialLinks.map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener"><span>${esc(t)}</span><em>↗</em></a>`).join('')}</div>`);
    if(scene && !$('.v20-map-ribbon', scene)){
      scene.insertAdjacentHTML('beforeend', `<div class="v20-map-ribbon">${mapStops.map((s,i)=>`<button data-city="${esc(s[0])}" class="${i===0?'active':''}"><b>${esc(s[0])}</b><small>${esc(s[1])} · ${esc(s[2])}</small></button>`).join('')}</div>`);
      $$('.v20-map-ribbon button', scene).forEach(btn=>btn.addEventListener('click',()=>{
        $$('.v20-map-ribbon button', scene).forEach(b=>b.classList.toggle('active', b===btn));
        const q = $('#realMapSearchInput');
        if(q){ q.value = btn.dataset.city; q.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'})); }
      }));
    }
  }

  function buildAlbums(){
    const root = $('#albums'); if(!root) return;
    let active = 5, era = '全部';
    root.innerHTML = `<div class="v20-page glass"><div class="v20-head"><div><div class="section-kicker">PREMIUM RECORD ROOM</div><h2>五月天時光唱片室</h2><p>重新做成真正的唱片收藏空間：左側年代策展，中間小 CD 木架，右側專輯檔案、曲目、時代說明與關聯巡演。這不是 demo 卡片，而是可持續擴充的資料層。</p></div><div class="v20-chipbar" id="albumEra"></div></div><div class="v20-grid v20-album-layout"><aside class="v20-panel v20-room-left"><h3>年代策展</h3><p class="v20-note">每張唱片都需要封面、發行資料、曲目、官方連結、相關巡演。現在先把資訊結構補齊。</p><div class="v20-era-list" id="albumEraList"></div></aside><main class="v20-panel v20-record-wall"><h3 id="albumWallTitle">全時期唱片木架</h3><div class="v20-shelf" id="albumWall"></div></main><aside class="v20-panel v20-detail" id="albumInfo"></aside></div></div>`;
    const eras = ['全部','1990s','2000s','2010s','海外/日本','巡演現場'];
    const filter = () => era==='全部' ? albums : albums.filter(a=>a.era===era);
    function draw(){
      $('#albumEra').innerHTML = eras.map(e=>`<button class="${e===era?'active':''}" data-era="${esc(e)}">${esc(e)}</button>`).join('');
      $('#albumEraList').innerHTML = eras.map(e=>`<button class="${e===era?'active':''}" data-era="${esc(e)}"><span>${esc(e)}</span><b>${e==='全部'?albums.length:albums.filter(a=>a.era===e).length}</b></button>`).join('');
      const items = filter(); if(!items.includes(albums[active])) active = albums.indexOf(items[0] || albums[0]);
      $('#albumWallTitle').textContent = era==='全部' ? '1999–2026 唱片收藏木架' : `${era} 唱片收藏木架`;
      $('#albumWall').innerHTML = items.map(a=>`<button class="v20-album ${albums.indexOf(a)===active?'active':''}" data-i="${albums.indexOf(a)}" style="--cover:${a.color}"><span class="cover"></span><b>${esc(a.title)}</b><small>${esc(a.year)}</small></button>`).join('');
      const a = albums[active];
      $('#albumInfo').style.setProperty('--cover', a.color);
      $('#albumInfo').innerHTML = `<div class="big-cover"></div><div class="section-kicker">${esc(a.era)} · ${esc(a.type)}</div><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p><div class="v20-tracklist">${a.tracks.map((t,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><b>${esc(t)}</b><em>▶</em></div>`).join('')}</div><div class="v20-note">關聯：唱片室 → 歌曲宇宙 → 巡演地圖。正式版會補官方封面、完整曲目、MV、Live 版本與來源。</div>`;
      $$('#albumEra button,#albumEraList button').forEach(b=>b.addEventListener('click',()=>{era=b.dataset.era; draw();}));
      $$('.v20-album').forEach(b=>b.addEventListener('click',()=>{active=+b.dataset.i; draw();}));
    }
    draw();
  }

  function buildSongs(){
    const root = $('#songs'); if(!root) return;
    root.innerHTML = `<div class="v20-page glass"><div class="v20-head"><div><div class="section-kicker">EDITORIAL MUSIC UNIVERSE</div><h2>歌曲宇宙</h2><p>不再是幾張歌單卡，而是按「巡演現場、青春成長、世界觀、深夜情緒」組成音樂資料館。每組都有推薦場景、歌曲隊列與可接播放器的入口。</p></div><div class="v20-chipbar"><button class="active">全部主題</button><button>Live</button><button>青春</button><button>慢歌</button><button>世界觀</button></div></div><div class="v20-grid v20-song-layout"><aside class="v20-panel v20-playlist-feature" id="songFeature"></aside><main class="v20-song-matrix" id="songMatrix"></main></div></div>`;
    $('#songFeature').style.setProperty('--cover', songSections[0].cover);
    $('#songFeature').innerHTML = `<div class="disc"></div><div class="section-kicker">FEATURED PLAYLIST</div><h3>${esc(songSections[0].title)}</h3><p>${esc(songSections[0].desc)}</p><div class="v20-song-list">${songSections[0].songs.map((s,i)=>`<button><em>${String(i+1).padStart(2,'0')}</em><span>${esc(s)}<br><small>${esc(songSections[0].tags.join(' · '))}</small></span><b>▶</b></button>`).join('')}</div>`;
    $('#songMatrix').innerHTML = songSections.map((sec,idx)=>`<article class="v20-panel v20-song-card" style="--cover:${sec.cover}"><div class="section-kicker">0${idx+1}</div><h3>${esc(sec.title)}</h3><p>${esc(sec.desc)}</p><div class="tagrow">${sec.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><div class="v20-song-list">${sec.songs.slice(0,4).map((s,i)=>`<button><em>${String(i+1).padStart(2,'0')}</em><span>${esc(s)}<br><small>Maydayland Queue</small></span><b>＋</b></button>`).join('')}</div></article>`).join('');
  }

  function buildBooks(){
    const root = $('#books'); if(!root) return;
    root.innerHTML = `<div class="v20-page glass"><div class="v20-head"><div><div class="section-kicker">BOOKS · SCORES · PUBLICATIONS</div><h2>書籍出版資料館</h2><p>從書籍、樂譜、成員文集到巡演場刊，重新整理成收藏型書架。正式版下一步要補出版社、ISBN、封面、購買/官方資料來源。</p></div><div class="v20-chipbar"><button class="active">全部</button><button>書籍</button><button>樂譜</button><button>成員文集</button><button>場刊週邊</button></div></div><div class="v20-grid v20-book-grid">${books.map(b=>`<article class="v20-panel v20-book" style="--cover:${b[3]}"><span class="cover"></span><div><h3>${esc(b[0])}</h3><p>${esc(b[4])}</p><div class="meta"><span>${esc(b[1])}</span><span>${esc(b[2])}</span></div></div></article>`).join('')}</div></div>`;
  }

  function buildTimeline(){
    const root = $('#timeline'); if(!root) return;
    root.innerHTML = `<div class="v20-page glass"><div class="v20-head"><div><div class="section-kicker">EXHIBITION TIMELINE</div><h2>歷程展覽牆</h2><p>把年代、作品、巡演與網站任務串成一條展覽線。每個事件後續可接專輯、歌曲、巡演城市和官方來源。</p></div><div class="v20-kpi"><div><b>10</b><small>核心年代</small></div><div><b>4</b><small>內容宇宙</small></div><div><b>1</b><small>主線巡演</small></div></div></div><div class="v20-timeline">${timeline.map(t=>`<article class="v20-event"><time>${esc(t[0])}</time><div><h3>${esc(t[1])}</h3><p>${esc(t[2])}</p></div></article>`).join('')}</div></div>`;
  }

  function upgradePlayer(){
    document.body.classList.add('v20-player-upgrade');
    const sheet = $('#playerSheet .sheet-copy');
    if(sheet && !$('#v20Queue')){
      sheet.insertAdjacentHTML('beforeend', `<div class="v20-note">v20 播放器定位：先做穩定、高質感、可控的資料館播放器；真音源需要合法穩定來源，不能再用會無限載入的臨時接口。</div><div class="v20-queue" id="v20Queue">${songSections.flatMap(s=>s.songs.slice(0,2)).slice(0,8).map((s,i)=>`<button><em>${String(i+1).padStart(2,'0')}</em><span>${esc(s)}<br><small>Maydayland curated queue</small></span><b>▶</b></button>`).join('')}</div>`);
    }
    const mini = $('#miniSub'); if(mini) mini.textContent = 'v20 精品播放器：穩定隊列、歌單入口、避免假載入';
  }

  function boot(){
    document.querySelector('.md-app')?.classList.add('v20');
    enhanceTour();
    buildAlbums();
    buildSongs();
    buildBooks();
    buildTimeline();
    upgradePlayer();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 420));
  else setTimeout(boot, 420);
})();