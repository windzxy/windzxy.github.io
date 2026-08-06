(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  const tours = [
    { id:'back', name:'回到那一天 巡迴演唱會', year:'2023–2026', color:'#42e8ff', years:['2026 台北・台中','2025 台北・貴陽・台中','2024 高雄・香港・北京・深圳・太原・武漢・成都・上海','2023 台中'], desc:'近期主線巡演，適合用路線播放與城市詳情呈現。'},
    { id:'life', name:'人生海海巡迴演唱會', year:'2001–2002', color:'#ff6dad', years:['台北','台中','高雄','香港'], desc:'早期大型巡迴，保留作為時光路線資料入口。'},
    { id:'dna', name:'DNA 創造巡迴演唱會', year:'2009–2010', color:'#ffd166', years:['台北','上海','北京','新加坡','香港'], desc:'舞台視覺與世界巡演意識開始更完整。'},
    { id:'just', name:'Just Rock It! 巡迴演唱會', year:'2011–2020', color:'#9a7cff', years:['亞洲','北美','歐洲','大洋洲'], desc:'長線巡演資料，可逐站補齊歌單與照片。'},
    { id:'history', name:'第一張創作專輯巡迴', year:'1999–2000', color:'#61ffbc', years:['台北','校園','Live House'], desc:'把起點放回資料館，做成「從房間到世界」的敘事。'}
  ];

  const stops = [
    { id:'taipei', no:1, city:'台北', x:895, y:470, cls:'photo-taipei', venue:'台北小巨蛋', addr:'台北市松山區南京東路四段2號', dates:'2026.07.03 / 07.04 / 07.05 / 08.10 / 08.11 / 08.12', status:'規劃中', tag:'台灣', caption:'走回那一天，讓巡演從熟悉的台北重新出發。右側照片卡、下方縮圖與地圖彈窗同步更新。'},
    { id:'kaohsiung', no:2, city:'高雄', x:850, y:505, cls:'photo-kaohsiung', venue:'高雄世運主場館', addr:'高雄市左營區世運大道100號', dates:'2024.03.23 / 03.24 / 03.29 / 03.30 / 03.31', status:'已完成', tag:'台灣', caption:'大型戶外場館與港都夜色，是地圖路線上最有開闊感的一站。'},
    { id:'hongkong', no:3, city:'香港', x:710, y:437, cls:'photo-hongkong', venue:'中環海濱活動空間', addr:'香港中環龍和道', dates:'2024.04.30 – 2024.05.09', status:'已完成', tag:'香港', caption:'海港天際線與戶外舞台形成強烈的城市記憶，點開數字後會呈現地標相簿感。'},
    { id:'beijing', no:4, city:'北京', x:855, y:365, cls:'photo-beijing', venue:'國家體育場 鳥巢', addr:'北京市朝陽區國家體育場南路1號', dates:'2024.05.18 / 05.19 / 05.25 / 05.26', status:'已完成', tag:'中國大陸', caption:'鳥巢場館具備巨大儀式感，適合在右側詳情中突出場景與舞台尺度。'},
    { id:'shenzhen', no:5, city:'深圳', x:724, y:505, cls:'photo-shenzhen', venue:'深圳大運中心體育場', addr:'深圳市龍崗區青春路', dates:'2024.06.01 / 06.02', status:'已完成', tag:'中國大陸', caption:'現代城市線條、燈光與速度感，對應地圖中更銳利的霓虹節點。'},
    { id:'taiyuan', no:6, city:'太原', x:790, y:294, cls:'photo-taiyuan', venue:'山西體育中心體育場', addr:'太原市晉源區健康南街', dates:'2024.07.06 / 07.07', status:'已完成', tag:'中國大陸', caption:'將中原城市的厚重感做成暖色照片卡，與冷色地圖形成對比。'},
    { id:'wuhan', no:7, city:'武漢', x:635, y:478, cls:'photo-wuhan', venue:'武漢體育中心體育場', addr:'武漢市蔡甸區車城北路', dates:'2024.09.14 / 09.15', status:'已完成', tag:'中國大陸', caption:'江城意象被放進相簿色塊，不再只是文字資料。'},
    { id:'chengdu', no:8, city:'成都', x:512, y:585, cls:'photo-chengdu', venue:'東安湖體育公園主體育場', addr:'成都市龍泉驛區', dates:'2024.10.05 / 10.06', status:'已完成', tag:'中國大陸', caption:'以綠色與暖光保留成都的鬆弛感，讓路線不只是一條線。'},
    { id:'shanghai', no:9, city:'上海', x:827, y:318, cls:'photo-shanghai', venue:'上海體育場', addr:'上海市徐匯區天鑰橋路666號', dates:'2024.11.12 – 2024.11.24', status:'已完成', tag:'中國大陸', caption:'上海站以高密度城市夜景呈現，適合和播放器、歌單宇宙形成連動。'},
    { id:'taichung', no:10, city:'台中', x:876, y:486, cls:'photo-taichung', venue:'洲際棒球場', addr:'台中市北屯區崇德路三段835號', dates:'2023.12.31 / 2025.01.01 / 2026.01.01', status:'進行中', tag:'台灣', caption:'跨年與回憶感最強的一站，作為路線播放結尾。'}
  ];

  const routePath = 'M895 470 C870 416 864 392 855 365 S827 318 790 294 S725 316 710 437 S678 470 635 478 S560 522 512 585 M512 585 C602 560 646 525 724 505 S805 513 850 505 S870 494 876 486 M876 486 C867 474 858 468 895 470';

  const albums = [
    {title:'第一張創作專輯', year:'1999', era:'1990 - 1999', type:'青春起點', color:'linear-gradient(135deg,#1e4f6f,#f3d67c,#b64c78)', text:'從地下社團與校園現場出發，保留最原始的創作衝動。', tracks:['志明與春嬌','愛情的模樣','軋車','生活']},
    {title:'愛情萬歲', year:'2000', era:'2000 - 2009', type:'狂熱青春', color:'linear-gradient(135deg,#355c7d,#6c5b7b,#c06c84)', text:'情緒更直接，城市、友情與戀愛都被放進歌曲裡。', tracks:['終結孤單','溫柔','愛情萬歲','反而']},
    {title:'人生海海', year:'2001', era:'2000 - 2009', type:'世界變大', color:'linear-gradient(135deg,#20435b,#f0b55b,#95363c)', text:'從青春走向更大的命題，也是巡演敘事的重要起點。', tracks:['人生海海','候鳥','好不好','相信']},
    {title:'時光機', year:'2003', era:'2000 - 2009', type:'時間感', color:'linear-gradient(135deg,#253a5c,#88d4f2,#f7d08a)', text:'以時間、回憶與成長作為主題，適合放在唱片室核心。', tracks:['輕功','恆星的恆心','而我知道','賭神']},
    {title:'神的孩子都在跳舞', year:'2004', era:'2000 - 2009', type:'樂團能量', color:'linear-gradient(135deg,#33264f,#e35d8f,#ffcf71)', text:'樂團聲響、舞台與現場張力都更鮮明。', tracks:['孫悟空','倔強','垃圾車','晚安 地球人']},
    {title:'知足 最真傑作選', year:'2005', era:'2000 - 2009', type:'珍藏精選', color:'linear-gradient(135deg,#1b3b52,#e8d6a8,#d05c7b)', text:'把成軍至當時最具代表性的創作集中成青春檔案。', tracks:['知足','志明與春嬌','溫柔','倔強']},
    {title:'為愛而生', year:'2006', era:'2000 - 2009', type:'情感擴張', color:'linear-gradient(135deg,#283a55,#f4d06f,#57b8a6)', text:'更柔軟也更開闊，讓「愛」成為整張專輯的核心。', tracks:['天使','我又初戀了','香水','為愛而生']},
    {title:'後青春期的詩', year:'2008', era:'2000 - 2009', type:'長大以後', color:'linear-gradient(135deg,#243949,#517fa4,#f0c27b)', text:'把青春後半段的困惑、勇氣和和解寫成詩。', tracks:['突然好想你','你不是真正的快樂','生存以上 生活以下','笑忘歌']},
    {title:'第二人生', year:'2011', era:'2010 - 2019', type:'世界末日', color:'linear-gradient(135deg,#191d2e,#4d7cff,#f6d365)', text:'以末日和重生建立宏大的舞台敘事。', tracks:['諾亞方舟','我不願讓你一個人','星空','第二人生']},
    {title:'自傳', year:'2016', era:'2010 - 2019', type:'人生回望', color:'linear-gradient(135deg,#0f2027,#2c5364,#f7971e)', text:'把樂團自身、青春與時代記憶重新整理。', tracks:['派對動物','後來的我們','成名在望','頑固']}
  ];

  const playlists = [
    {title:'Live 現場心跳精選', cover:'linear-gradient(135deg,#09203f,#42e8ff,#ff6dad)', text:'把演唱會最有衝擊力的開場、萬人大合唱與安可集中成一張現場地圖。'},
    {title:'青春不回頭', cover:'linear-gradient(135deg,#2b5876,#4e4376,#ffd166)', text:'志明與春嬌、溫柔、倔強到突然好想你，像一本會播放的青春日記。'},
    {title:'夜行城市', cover:'linear-gradient(135deg,#000428,#004e92,#9a7cff)', text:'適合放在地圖頁旁邊的夜晚歌單，城市燈光和巡演路線同步發亮。'},
    {title:'回到那一天', cover:'linear-gradient(135deg,#16222a,#3a6073,#ff6dad)', text:'聚焦近年巡演情緒，讓每一站城市卡都能有對應的歌單入口。'},
    {title:'長大後的我們', cover:'linear-gradient(135deg,#283048,#859398,#f6d365)', text:'後青春期、自傳、人生海海這類歌曲被整理為成長線索。'},
    {title:'安可與大合唱', cover:'linear-gradient(135deg,#141e30,#243b55,#61ffbc)', text:'為底部播放器準備的高能隊列，不再讓播放器空轉。'}
  ];

  const books = [
    {title:'五月天的素人自拍', cover:'linear-gradient(135deg,#375878,#ded3bc)', text:'第一本書式資料，適合做成書架小封面而非巨大縮圖。'},
    {title:'下課後，怪獸家點名！', cover:'linear-gradient(135deg,#607aa2,#efdda9)', text:'樂譜、訪談、玩具與影像記錄，偏向創作幕後。'},
    {title:'Happy.Birth.Day', cover:'linear-gradient(135deg,#8a6b8b,#dfc4cb)', text:'文字、創作和個人敘事資料入口。'},
    {title:'搖滾本事', cover:'linear-gradient(135deg,#202020,#b48b5c,#e8d6a8)', text:'把電影與樂團精神資料化，連到歷程頁。'},
    {title:'巡演紀念冊', cover:'linear-gradient(135deg,#0e2a47,#42e8ff,#ff6dad)', text:'為巡演地圖保留可擴充的出版物欄位。'}
  ];

  const memories = [
    ['1997','正式成軍','五位團員完成穩定編制，開始從校園與 Live House 走向更大的舞台。'],
    ['1999','首張創作專輯','以創作樂團姿態進入主流視野，Maydayland 的時間線從這裡展開。'],
    ['2001','人生海海','歌曲、專輯與巡演開始形成更完整的世界觀。'],
    ['2004','Final Home','大型巡演意識成熟，舞台和城市開始成為記憶的一部分。'],
    ['2011','第二人生','以大型概念巡演和視覺系統建立更宏大的舞台語言。'],
    ['2023–2026','回到那一天','用城市、場館、照片和路線把「回憶」重新做成可探索地圖。']
  ];

  const radio = [
    {title:'倔強 · 現場心跳版', sub:'資料館環境聲預覽', cover:'linear-gradient(135deg,#09203f,#42e8ff,#ff6dad)'},
    {title:'突然好想你 · 夜行版', sub:'城市夜景情緒', cover:'linear-gradient(135deg,#000428,#004e92,#9a7cff)'},
    {title:'知足 · 時光唱片室版', sub:'木質房間與黑膠氛圍', cover:'linear-gradient(135deg,#1b3b52,#e8d6a8,#d05c7b)'},
    {title:'回到那一天 · 路線版', sub:'巡演地圖專用', cover:'linear-gradient(135deg,#16222a,#3a6073,#ff6dad)'}
  ];

  let activeTour = tours[0], activeStop = stops[0], activeAlbum = albums[5], trackIndex = 0;
  let playing = false, progress = 0, lastTick = 0, audioCtx, oscA, oscB, gain;

  function toast(text){ const t=$('#toast'); t.textContent=text; t.classList.add('show'); clearTimeout(t._timer); t._timer=setTimeout(()=>t.classList.remove('show'),1800); }

  function renderTours(){
    const list = $('#tourList');
    list.innerHTML = tours.map(t => `<button class="tour-card ${t.id===activeTour.id?'active':''}" data-tour="${t.id}" style="--tour:${t.color}"><b>${t.name}</b><small>${t.year} · ${t.desc}</small><span class="years">${t.years.map(y=>`<span>${y}</span>`).join('')}</span></button>`).join('');
    $$('.tour-card',list).forEach(btn=>btn.addEventListener('click',()=>{activeTour=tours.find(t=>t.id===btn.dataset.tour); renderTours(); $('#mapTitle').textContent = activeTour.name + ' · 路線檔案'; selectStop(activeStop.id); toast('已切換：'+activeTour.name); }));
  }

  function renderMap(){
    $('#routeLayer').innerHTML = `<path class="route-shadow" d="${routePath}"></path><path class="route-line" d="${routePath}"></path>`;
    $('#nodeLayer').innerHTML = stops.map(s => `<g class="node-marker ${s.id===activeStop.id?'active':''}" data-stop="${s.id}" style="--node:${s.status==='進行中'?'#ffd166':s.status==='規劃中'?'#ff6dad':'#42e8ff'}" transform="translate(${s.x} ${s.y})"><circle class="outer" r="17"/><circle class="inner" r="9"/><text y=".5">${s.no}</text><text class="label" y="-28">${s.city}</text></g>`).join('');
    $$('.node-marker').forEach(n=>n.addEventListener('click',()=>selectStop(n.dataset.stop,true)));
    positionPopover();
  }

  function positionPopover(){
    const pop = $('#cityPopover'); if(!pop || !activeStop) return;
    const x = activeStop.x / 1400 * 96 + 2, y = activeStop.y / 780 * 91 + 3;
    pop.style.left = x + '%'; pop.style.top = y + '%'; pop.hidden = false;
    pop.innerHTML = `<div class="pop-photo ${activeStop.cls}"></div><b>${activeStop.city}</b><p>${activeStop.venue}<br>${activeStop.dates}</p>`;
  }

  function selectStop(id, user=false){
    activeStop = stops.find(s=>s.id===id) || stops[0];
    $$('.node-marker').forEach(n=>n.classList.toggle('active',n.dataset.stop===activeStop.id));
    $('#detailBadge').textContent = String(activeStop.no).padStart(2,'0');
    $('#detailHero').className = 'detail-hero ' + activeStop.cls;
    $('#detailCity').textContent = activeStop.city; $('#detailDates').textContent = activeStop.dates;
    $('#detailVenue').textContent = activeStop.venue; $('#detailAddress').textContent = activeStop.addr;
    $('#detailTour').textContent = activeTour.name; $('#detailStatus').textContent = activeStop.status + ' · ' + activeTour.year;
    $('#detailCaption').textContent = activeStop.caption;
    $('#detailTags').innerHTML = `<span>${activeStop.tag}</span><span>${activeStop.status}</span><span>第 ${activeStop.no} 站</span>`;
    $('#thumbRow').innerHTML = [0,1,2].map((_,i)=>`<button class="thumb ${i===0?'active':''} ${stops[(stops.indexOf(activeStop)+i)%stops.length].cls}" aria-label="${activeStop.city} 縮圖 ${i+1}"></button>`).join('');
    positionPopover(); if(user) toast('已打開：' + activeStop.city + ' 詳情照片卡');
  }

  function renderAlbums(era='2000 - 2009'){
    const eras = ['全部年代','1990 - 1999','2000 - 2009','2010 - 2019'];
    $('#eraFilter').innerHTML = eras.map(e=>`<button class="${e===era?'active':''}" data-era="${e}">${e}<span>${e==='全部年代'?albums.length:albums.filter(a=>a.era===e).length}</span></button>`).join('');
    $$('#eraFilter button').forEach(b=>b.addEventListener('click',()=>renderAlbums(b.dataset.era)));
    const shown = era==='全部年代'?albums:albums.filter(a=>a.era===era);
    $('#shelfTitle').textContent = (era==='全部年代'?'全部年代唱片架':era + ' 青春木架');
    $('#albumShelf').innerHTML = shown.map(a=>`<button class="album-tile ${a.title===activeAlbum.title?'active':''}" data-album="${a.title}"><span class="album-cover" style="--cover:${a.color}"></span><b>${a.title}</b><small>${a.year} · ${a.type}</small></button>`).join('');
    $$('.album-tile').forEach(btn=>btn.addEventListener('click',()=>selectAlbum(btn.dataset.album,true)));
    if(!shown.some(a=>a.title===activeAlbum.title)) activeAlbum=shown[0]||albums[0];
    selectAlbum(activeAlbum.title,false);
  }

  function selectAlbum(title,user=false){
    activeAlbum = albums.find(a=>a.title===title) || albums[0];
    $$('.album-tile').forEach(t=>t.classList.toggle('active',t.dataset.album===activeAlbum.title));
    $('#needleTitle').textContent = activeAlbum.title; $('#needleYear').textContent = `${activeAlbum.year} · ${activeAlbum.type}`;
    $('#albumDetail').innerHTML = `<div class="big-cover" style="--cover:${activeAlbum.color}"></div><div class="section-kicker">ALBUM FILE</div><h2>${activeAlbum.title}</h2><p><b>${activeAlbum.year}</b> · ${activeAlbum.type}</p><p>${activeAlbum.text}</p><div class="track-list">${activeAlbum.tracks.map((t,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><span>${t}</span><span>0${4+i}:2${i}</span></div>`).join('')}</div><button>播放專輯 ▶</button>`;
    if(user) toast('已切換專輯：' + activeAlbum.title);
  }

  function renderPlaylists(){ $('#playlistGrid').innerHTML = playlists.map(p=>`<article class="playlist-card"><div class="playlist-art" style="--cover:${p.cover}"></div><div><h3>${p.title}</h3><p>${p.text}</p><button>加入播放器</button></div></article>`).join(''); }
  function renderBooks(){ $('#bookcase').innerHTML = books.map(b=>`<article class="book"><span class="book-cover" style="--cover:${b.cover}"></span><div><h3>${b.title}</h3><p>${b.text}</p><button>資料頁</button></div></article>`).join(''); }
  function renderTimeline(){ $('#timelineWall').innerHTML = memories.map(m=>`<article class="memory"><time>${m[0]}</time><i></i><div><h3>${m[1]}</h3><p>${m[2]}</p></div></article>`).join(''); }

  function switchView(id){ $$('.view').forEach(v=>v.classList.toggle('active',v.id===id)); $$('.main-nav button').forEach(b=>b.classList.toggle('active',b.dataset.nav===id)); if(id==='albums') renderAlbums(); }

  function setupNav(){
    $$('[data-nav]').forEach(el=>el.addEventListener('click',e=>{ e.preventDefault(); switchView(el.dataset.nav); }));
    $('#modeAlbum').addEventListener('click',()=>{$('#mapScene').classList.toggle('album-mode'); $('#modeAlbum').classList.toggle('active'); toast('地標相簿視覺已切換');});
    $('#modeFlat').addEventListener('click',()=>{$('#mapScene').classList.remove('album-mode'); $('#modeAlbum').classList.remove('active'); toast('已回到平面地圖');});
    $('#routePlay').addEventListener('click',playRoute);
    $('#randomStop').addEventListener('click',()=>selectStop(stops[Math.floor(Math.random()*stops.length)].id,true));
    $('#randomPlaylist').addEventListener('click',()=>{ trackIndex=Math.floor(Math.random()*radio.length); setTrack(); toast('已隨機切換播放器隊列'); });
    $('#closeDetail').addEventListener('click',()=>toast('桌面版保留右側詳情；手機版可向下查看'));
    $('#globalSearch').addEventListener('input',e=>{ const q=e.target.value.trim(); if(!q) return; const hit=stops.find(s=>s.city.includes(q)||s.venue.includes(q)); if(hit) selectStop(hit.id,false); });
  }

  function playRoute(){ let i=0; toast('開始路線播放'); const timer=setInterval(()=>{ selectStop(stops[i].id,false); i++; if(i>=stops.length){clearInterval(timer); toast('路線播放完成');}},900); }

  function setupPlayer(){
    $('#playBtn').addEventListener('click',togglePlay);
    $('#prevBtn').addEventListener('click',()=>{trackIndex=(trackIndex+radio.length-1)%radio.length; setTrack();});
    $('#nextBtn').addEventListener('click',()=>{trackIndex=(trackIndex+1)%radio.length; setTrack();});
    $('#shuffleBtn').addEventListener('click',()=>{trackIndex=Math.floor(Math.random()*radio.length); setTrack(); toast('已隨機切歌');});
    $('#repeatBtn').addEventListener('click',()=>toast('已開啟資料館循環模式'));
    $('#muteBtn').addEventListener('click',()=>{ if(gain){ gain.gain.value = gain.gain.value > .001 ? 0 : .045; toast(gain.gain.value ? '已恢復聲音' : '已靜音'); }});
    $('#openPlayer').addEventListener('click',()=>openSheet()); $('#queueBtn').addEventListener('click',()=>openSheet()); $('#sheetClose').addEventListener('click',()=>$('#playerSheet').classList.remove('active'));
    setTrack(); requestAnimationFrame(tick);
  }

  function ensureAudio(){
    if(audioCtx) return; audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gain = audioCtx.createGain(); gain.gain.value = 0; gain.connect(audioCtx.destination);
    oscA = audioCtx.createOscillator(); oscB = audioCtx.createOscillator(); oscA.type='sine'; oscB.type='triangle'; oscA.frequency.value=196; oscB.frequency.value=246.94;
    const lfo = audioCtx.createOscillator(), lfoGain = audioCtx.createGain(); lfo.frequency.value=.08; lfoGain.gain.value=22; lfo.connect(lfoGain); lfoGain.connect(oscA.frequency);
    oscA.connect(gain); oscB.connect(gain); oscA.start(); oscB.start(); lfo.start();
  }

  function togglePlay(){ ensureAudio(); audioCtx.resume(); playing=!playing; if(gain) gain.gain.value = playing ? .045 : 0; $('#playBtn').textContent=playing?'Ⅱ':'▶'; toast(playing?'已播放環境聲預覽，不再載入外部歌曲':'已暫停'); }

  function setTrack(){
    const t=radio[trackIndex]; $('#miniTitle').textContent=t.title; $('#miniSub').textContent=t.sub + ' · 不載入外部音源'; $('#miniCover').style.setProperty('--cover',t.cover);
    $('#sheetTitle').textContent=t.title; $('#sheetCover').style.setProperty('--cover',t.cover);
    $('#queueList').innerHTML = radio.map((r,i)=>`<button class="${i===trackIndex?'active':''}" data-i="${i}"><span>${String(i+1).padStart(2,'0')}</span><b>${r.title}</b><small>${r.sub}</small></button>`).join('');
    $$('#queueList button').forEach(b=>b.addEventListener('click',()=>{trackIndex=Number(b.dataset.i); setTrack();})); progress=0; updateProgress();
  }

  function openSheet(){ $('#playerSheet').classList.add('active'); setTrack(); }
  function tick(now){ if(!lastTick) lastTick=now; const dt=(now-lastTick)/1000; lastTick=now; if(playing){ progress=(progress+dt/225)%1; updateProgress(); } requestAnimationFrame(tick); }
  function updateProgress(){ const pct=(progress*100).toFixed(2)+'%'; $('#playerProgress').style.width=pct; $('#sheetProgress').style.width=pct; const sec=Math.floor(progress*225); $('#currentTime').textContent=`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`; }

  function init(){ renderTours(); renderMap(); selectStop(activeStop.id); renderAlbums(); renderPlaylists(); renderBooks(); renderTimeline(); setupNav(); setupPlayer(); window.addEventListener('resize', positionPopover); setTimeout(()=>toast('v15 高保真重構已載入：地圖、照片卡、唱片室、播放器均可互動'),500); }
  document.addEventListener('DOMContentLoaded', init);
})();
