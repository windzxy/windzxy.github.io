(() => {
  'use strict';

  const API = 'https://music-api.gdstudio.xyz/api.php';
  const FALLBACK_COVER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="700" height="700" viewBox="0 0 700 700"%3E%3Cdefs%3E%3ClinearGradient id="g" x2="1" y2="1"%3E%3Cstop stop-color="%232b416d"/%3E%3Cstop offset=".52" stop-color="%23644b8d"/%3E%3Cstop offset="1" stop-color="%23d56891"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="700" height="700" rx="100" fill="url(%23g)"/%3E%3Ccircle cx="350" cy="330" r="170" fill="none" stroke="white" stroke-opacity=".25" stroke-width="28"/%3E%3Ccircle cx="350" cy="330" r="30" fill="white" fill-opacity=".86"/%3E%3Ctext x="350" y="590" text-anchor="middle" fill="white" font-family="Arial" font-size="42" font-weight="700"%3EMAYDAYLAND%3C/text%3E%3C/svg%3E';

  const IMG = {
    band: 'https://www.mayday.jp/wp-content/uploads/ffb31aec0c0adb49e80f9fc7e18b284f-500x399.jpg',
    blue: 'https://www.mayday.jp/blue/img/header-tw.jpg',
    first: 'https://www.mayday.jp/img/biography-oversea-1.jpg',
    viva: 'https://www.mayday.jp/img/biography-oversea-2.jpg',
    ocean: 'https://www.mayday.jp/img/biography-oversea-3.jpg',
    time: 'https://www.mayday.jp/img/biography-oversea-4.jpg',
    god: 'https://www.mayday.jp/img/biography-oversea-5.jpg',
    born: 'https://www.mayday.jp/img/biography-oversea-7.jpg',
    poetry: 'https://www.mayday.jp/img/biography-oversea-8.jpg',
    second: 'https://www.mayday.jp/img/biography-oversea-9a.jpg',
    secondAlt: 'https://www.mayday.jp/img/biography-oversea-9b.jpg',
    history: 'https://www.mayday.jp/wp-content/uploads/5b5c7eed8c21d28d399c608497ab94561-500x500.jpg',
    tour5525: 'https://news-images.tvbs.com.tw/legacy/img/upload/2026/05/13/20260513105831-1aab606f.jpg?h=900&w=900',
    life: 'https://5b0988e595225.cdn.sohucs.com/images/20190513/24f36efde35e45c882044eca33ef9805.png',
    nowhere: 'https://res.klook.com/image/upload/v1666009165/lmtcitpzq6ldrijmflrm.jpg',
    dna: 'https://lh6.ggpht.com/_uJZCB0zHST4/Sr2MhTRzs4I/AAAAAAAAIX8/Op6QsOIpKs4/s800/20090926_Mayday.jpg'
  };

  const COLORS = [
    ['#243c65','#78518e'],['#233e50','#3578a9'],['#55344a','#a34c69'],['#31433b','#6b8b57'],
    ['#3d345e','#7567a2'],['#533d2e','#a06a3e'],['#26384f','#566f91'],['#452c3f','#925270'],['#253f42','#4c8584']
  ];

  const worlds = [
    {id:'forever',group:'featured',tag:'ALL ERAS',year:'1999 — NOW',title:'Mayday Forever Radio',subtitle:'五月天全宇宙',description:'專輯、現場、OST、合作與特別單曲，讓所有時代在今天重新相遇。',image:IMG.band,queries:['五月天','五月天 Live','五月天 OST','五月天 單曲'],color:0,featured:true},
    {id:'5525',group:'concert',tag:'25TH ANNIVERSARY',year:'2023 — NOW',title:'回到那一天 #5525',subtitle:'二十五週年巡演',description:'搭上時光列車，回看二十五年的相遇，然後繼續去往下一站。',image:IMG.tour5525,queries:['五月天 回到那一天 Live','五月天 5525 Live'],color:1,featured:true},
    {id:'nowhere',group:'concert',tag:'NOWHERE',year:'2011 — 2014',title:'諾亞方舟',subtitle:'末日與第二人生',description:'世界沒有末日，我們便有機會選擇自己的第二人生。',image:IMG.nowhere,queries:['五月天 諾亞方舟 Live','五月天 第二人生 Live'],color:2,featured:true},
    {id:'life',group:'concert',tag:'LiFE',year:'2017 — 2019',title:'人生無限公司',subtitle:'十號大型巡演',description:'把每一夜都活成一部電影，把每一個觀眾都寫進故事。',image:IMG.life,queries:['五月天 人生無限公司 Live','五月天 LIFE Live'],color:3,featured:true},
    {id:'blue',group:'concert',tag:'BACK TO BLUE',year:'2019',title:'Just Rock It!!! BLUE',subtitle:'藍色三部曲二十週年',description:'回到最初的藍，再一次把青春塗滿整座場館。',image:IMG.blue,queries:['五月天 Just Rock It BLUE Live','五月天 藍 Live'],color:4,featured:true},
    {id:'finalhome',group:'concert',tag:'FIRST WORLD TOUR',year:'2004 — 2005',title:'Final Home',subtitle:'當我們混在一起',description:'第一座世界巡迴的家，從台灣一路搭到更多城市。',image:IMG.god,queries:['五月天 Final Home Live','五月天 當我們混在一起 Live'],color:5},
    {id:'jump',group:'concert',tag:'JUMP!',year:'2007 — 2008',title:'離開地球表面',subtitle:'JUMP 世界巡迴',description:'把所有疲憊拋出地表，讓全場一起跳向宇宙。',image:IMG.born,queries:['五月天 離開地球表面 Live','五月天 JUMP Live'],color:6},
    {id:'dna',group:'concert',tag:'CREATE',year:'2009 — 2010',title:'D.N.A. 創造',subtitle:'創造世界巡迴',description:'巨型舞台、工業視覺與全新尺度，重新改寫現場的基因。',image:IMG.dna,queries:['五月天 DNA Live','五月天 創造 Live'],color:7},
    {id:'goodgood',group:'concert',tag:'MEET AGAIN',year:'2020 — 2023',title:'好好好想見到你',subtitle:'線上與重逢',description:'在無法相見的日子裡，先讓音樂替我們抵達彼此。',image:IMG.secondAlt,queries:['五月天 好好好想見到你 Live','五月天 Fly to 2023 Live'],color:8},
    {id:'ost',group:'story',tag:'SCREEN & STORY',year:'ALL YEARS',title:'OST 任意門',subtitle:'電影、戲劇與特別企劃',description:'從銀幕與故事的另一扇門，重新遇見五月天。',image:IMG.history,queries:['五月天 電影主題曲','五月天 電視劇主題曲','五月天 OST'],color:1},
    {id:'party',group:'story',tag:'MOJO PARTY',year:'MAYDAYLAND',title:'卜卜的派對房間',subtitle:'一起跳起來的歌',description:'戀愛ING、OAOA、派對動物與所有適合大合唱的快樂時刻。',image:IMG.viva,queries:['五月天 戀愛ING','五月天 OAOA','五月天 派對動物','五月天 笑忘歌'],color:5}
  ];

  const albums = [
    ['first','1999','五月天第一張創作專輯',IMG.first],['viva','2000','愛情萬歲',IMG.viva],['ocean','2001','人生海海',IMG.ocean],
    ['time','2003','時光機',IMG.time],['god','2004','神的孩子都在跳舞',IMG.god],['born','2006','為愛而生',IMG.born],
    ['poetry','2008','後青春期的詩',IMG.poetry],['second','2011','第二人生',IMG.second],['history','2016','自傳',IMG.history]
  ].map(([id,year,title,image],index)=>({id:`album-${id}`,group:'album',year,title,image,queries:[`五月天 ${title}`],color:index}));

  const timeline = [
    ['1997','五月天成軍','從校園與野台開始，五個人的樂團故事逐漸成形。'],
    ['1999','第一張創作專輯','正式發片，並以第168場演唱會寫下大型現場起點。'],
    ['2001','人生海海與暫別','在「你要去哪裡」之後暫別舞台，等待再次集合。'],
    ['2003','天空之城復出','回到舞台，開啟更大規模的演唱會時代。'],
    ['2004','Final Home','第一次世界巡迴，把「家」帶到更多城市。'],
    ['2011','第二人生／諾亞方舟','末日與重生的世界觀，成為作品與巡演的重要高峰。'],
    ['2017','人生無限公司','用舞台、電影與人生企劃，連結世界各地的五迷。'],
    ['2023','回到那一天','二十五週年的時光列車，繼續駛往新的相遇。']
  ];

  const $ = id => document.getElementById(id);
  const dom = {
    gateway:$('gateway'),enter:$('enterButton'),gatewayStatus:$('gatewayStatus'),gatewayProgress:$('gatewayProgress'),
    feature:$('featureGrid'),concerts:$('concertGrid'),albums:$('albumFlow'),timeline:$('timeline'),songCount:$('songCount'),worldCount:$('worldCount'),
    nowCard:$('nowCard'),liveDot:$('liveDot'),wave:$('wave'),nowCover:$('nowCover'),nowWorld:$('nowWorld'),nowTitle:$('nowTitle'),nowArtist:$('nowArtist'),
    miniPlayer:$('miniPlayer'),miniTrack:$('miniTrack'),miniCover:$('miniCover'),miniTitle:$('miniTitle'),miniArtist:$('miniArtist'),miniProgress:$('miniProgress'),
    play:$('playButton'),prev:$('prevButton'),next:$('nextButton'),queueButton:$('queueButton'),queueCount:$('queueCount'),
    drawer:$('drawer'),drawerClose:$('drawerClose'),openPlayer:$('openPlayer'),fullCover:$('fullCover'),fullWorld:$('fullWorld'),fullTitle:$('fullTitle'),fullArtist:$('fullArtist'),
    currentTime:$('currentTime'),durationTime:$('durationTime'),progressInput:$('progressInput'),fullPlay:$('fullPlay'),fullPrev:$('fullPrev'),fullNext:$('fullNext'),shuffle:$('shuffleButton'),repeat:$('repeatButton'),lyrics:$('lyrics'),queueList:$('queueList'),
    searchButton:$('searchButton'),aboutButton:$('aboutButton'),searchModal:$('searchModal'),aboutModal:$('aboutModal'),searchForm:$('searchForm'),searchInput:$('searchInput'),searchResults:$('searchResults'),
    toast:$('toast'),audio:$('audio')
  };

  const state = {cache:new Map(),universe:[],queue:[],current:null,index:-1,world:null,shuffle:true,repeat:false,lyrics:[],toastTimer:0};
  const esc = (value='') => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key = track => `${track.source}:${track.id}`;
  const artistText = value => Array.isArray(value) ? value.join(' / ') : (value || '五月天');
  const formatTime = value => Number.isFinite(value) ? `${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}` : '0:00';
  const artStyle = index => `--art-a:${COLORS[index%COLORS.length][0]};--art-b:${COLORS[index%COLORS.length][1]}`;
  const songCover = (track,size=700) => track?.pic_id ? `${API}?types=pic&id=${encodeURIComponent(track.pic_id)}&source=${encodeURIComponent(track.source)}&size=${size}` : FALLBACK_COVER;

  function toast(message){clearTimeout(state.toastTimer);dom.toast.textContent=message;dom.toast.classList.add('is-show');state.toastTimer=setTimeout(()=>dom.toast.classList.remove('is-show'),2500)}
  function setGateway(progress,message){dom.gatewayProgress.style.width=`${Math.max(0,Math.min(100,progress))}%`;dom.gatewayStatus.textContent=message}
  function dedupe(list){const map=new Map();for(const item of list){if(item?.id&&!map.has(key(item)))map.set(key(item),item)}return [...map.values()]}
  function normalise(raw,source){return {id:String(raw.id||''),name:String(raw.name||raw.title||'未知歌曲'),artist:artistText(raw.artist||raw.artists),album:String(raw.album||''),pic_id:raw.pic_id||raw.picId||'',source:raw.source||source}}

  function render(){
    dom.feature.innerHTML=worlds.filter(item=>item.featured).map(world=>worldCard(world,'feature-card')).join('');
    dom.concerts.innerHTML=worlds.filter(item=>item.group==='concert').map(world=>worldCard(world,'concert-card')).join('');
    dom.albums.innerHTML=albums.map(album=>`<article class="album-card" data-play-album="${album.id}" style="${artStyle(album.color)}"><div class="album-cover" data-label="${esc(album.title)}"><img src="${esc(album.image)}" alt="${esc(album.title)}" loading="lazy"><button aria-label="播放 ${esc(album.title)}">▶</button></div><h3>${esc(album.title)}</h3><p>${album.year} · 五月天創作專輯</p></article>`).join('');
    dom.timeline.innerHTML=`<h3>五月天時間線</h3><div class="timeline-list">${timeline.map(([year,title,text])=>`<div class="timeline-item"><time>${year}</time><i></i><div><b>${esc(title)}</b><p>${esc(text)}</p></div></div>`).join('')}</div>`;
    dom.worldCount.textContent=worlds.length+albums.length;
    attachImageFallbacks();
  }

  function worldCard(world,className){
    return `<article class="${className}" data-play-world="${world.id}" data-label="${esc(world.title)}" style="${artStyle(world.color)}"><img src="${esc(world.image)}" alt="${esc(world.title)}" loading="lazy"><button class="card-play" aria-label="播放 ${esc(world.title)}">▶</button><div class="card-copy"><small>${esc(world.year)} · ${esc(world.tag)}</small><h3>${esc(world.title)}</h3><p>${esc(world.description)}</p></div></article>`;
  }

  function attachImageFallbacks(){
    document.querySelectorAll('.feature-card img,.concert-card img,.album-cover img,.media-fallback img,.orbit-card img').forEach(img=>{
      if(img.dataset.bound)return;img.dataset.bound='1';
      img.addEventListener('error',()=>{const holder=img.closest('.feature-card,.concert-card,.album-cover,.media-fallback,.orbit-card');holder?.classList.add('no-image');img.remove()},{once:true});
    });
  }

  function makeWave(){dom.wave.innerHTML=Array.from({length:24},(_,index)=>`<i style="--h:${9+Math.random()*31}px;--d:${-index*40}ms"></i>`).join('')}

  async function request(url,timeout=15000){
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeout);
    try{const response=await fetch(url,{signal:controller.signal});if(!response.ok)throw new Error(`HTTP ${response.status}`);return await response.json()}finally{clearTimeout(timer)}
  }

  async function searchMusic(query,count=40){
    const cacheKey=`${query}:${count}`;if(state.cache.has(cacheKey))return state.cache.get(cacheKey);
    for(const source of ['netease','kuwo','qq']){
      try{
        const data=await request(`${API}?types=search&source=${source}&name=${encodeURIComponent(query)}&count=${count}&pages=1&v=5`);
        if(!Array.isArray(data))continue;
        const rows=data.map(item=>normalise(item,source)).filter(item=>item.id&&/五月天|Mayday/i.test(`${item.artist} ${item.album} ${item.name}`));
        if(rows.length){state.cache.set(cacheKey,rows);return rows}
      }catch(error){console.warn('search failed',query,source,error)}
    }
    state.cache.set(cacheKey,[]);return [];
  }

  async function loadUniverse(){
    const queries=['五月天','五月天 Live','五月天 第一張創作專輯','五月天 愛情萬歲','五月天 人生海海','五月天 時光機','五月天 後青春期的詩','五月天 第二人生','五月天 自傳','五月天 OST'];
    const collected=[];let done=0;
    const batches=queries.map(async query=>{const rows=await searchMusic(query,42);collected.push(...rows);done++;setGateway(8+Math.round(done/queries.length*88),`正在整理：${query.replace('五月天 ','')}`)});
    await Promise.all(batches);
    state.universe=dedupe(collected);dom.songCount.textContent=state.universe.length||'—';dom.enter.disabled=false;
    setGateway(100,state.universe.length?`已整理 ${state.universe.length} 首歌曲`:'歌源暫時未回應，仍可先進入瀏覽');
  }

  async function buildWorld(world){
    if(world.id==='forever')return state.universe;
    const lists=[];for(const query of world.queries)lists.push(...await searchMusic(query,34));
    const result=dedupe(lists);return result.length?result:state.universe;
  }

  async function startWorld(id){
    const world=worlds.find(item=>item.id===id)||albums.find(item=>item.id===id);if(!world)return;
    toast(`正在進入「${world.title}」`);
    const tracks=await buildWorld(world);if(!tracks.length)return toast('目前沒有取得可播放歌曲。');
    state.world=world;state.queue=[...tracks];state.index=state.shuffle?Math.floor(Math.random()*tracks.length):0;updateQueue();await playAt(state.index);
  }

  async function playGroup(group){
    const items=group==='album'?albums:worlds.filter(item=>item.group===group);toast('正在整理完整歌單…');
    const rows=await Promise.all(items.map(buildWorld));state.queue=dedupe(rows.flat());state.world={title:group==='album'?'專輯星系':'演唱會宇宙'};state.index=0;updateQueue();if(state.queue.length)playAt(0);
  }

  async function playAt(index){
    if(!state.queue.length)return;
    state.index=(index+state.queue.length)%state.queue.length;state.current=state.queue[state.index];updateNow();toast(`正在連接：${state.current.name}`);
    try{
      let audioUrl='';
      for(const bitrate of ['320','192','128']){
        const data=await request(`${API}?types=url&id=${encodeURIComponent(state.current.id)}&source=${encodeURIComponent(state.current.source)}&br=${bitrate}&v=${Date.now().toString(36)}`,12000);
        audioUrl=data?.url||'';if(audioUrl)break;
      }
      if(!audioUrl)throw new Error('No audio URL');
      dom.audio.src=String(audioUrl).replace(/^http:/,'https:');await dom.audio.play();loadLyrics(state.current);setMediaSession(state.current);
    }catch(error){console.warn(error);toast('此曲目暫時無法播放，正在切換下一首。');setTimeout(nextTrack,850)}
  }

  function nextTrack(){if(!state.queue.length)return;playAt(state.shuffle?Math.floor(Math.random()*state.queue.length):state.index+1)}
  function previousTrack(){if(!state.queue.length)return;playAt(state.index-1)}
  function togglePlay(){if(!state.current){startWorld('forever');return}dom.audio.paused?dom.audio.play().catch(()=>toast('請再次點擊播放')):dom.audio.pause()}

  function updateNow(){
    const track=state.current;const world=state.world||worlds[0];const cover=songCover(track);
    [dom.nowCover,dom.miniCover,dom.fullCover].forEach(img=>{img.src=cover;img.onerror=()=>{img.onerror=null;img.src=FALLBACK_COVER}});
    dom.nowWorld.textContent=world.title;dom.fullWorld.textContent=world.title;
    dom.nowTitle.textContent=track?.name||'等待進入世界';dom.miniTitle.textContent=track?.name||'Mayday Forever Radio';dom.fullTitle.textContent=track?.name||'尚未播放';
    dom.nowArtist.textContent=track?.artist||'五月天';dom.miniArtist.textContent=track?.artist||'等待進入世界';dom.fullArtist.textContent=track?.artist||'五月天';renderQueue();
  }

  function updatePlaying(isPlaying){dom.nowCard.classList.toggle('is-playing',isPlaying);dom.play.textContent=isPlaying?'Ⅱ':'▶';dom.fullPlay.textContent=isPlaying?'Ⅱ':'▶'}
  function updateQueue(){dom.queueCount.textContent=state.queue.length>99?'99+':state.queue.length;renderQueue()}
  function renderQueue(){dom.queueList.innerHTML=state.queue.length?state.queue.map((track,index)=>`<div class="queue-row" data-queue-index="${index}"><img src="${esc(songCover(track,180))}" alt=""><span><b>${esc(track.name)}</b><small>${esc(track.artist)} · ${esc(track.album||'Maydayland')}</small></span><button>${index===state.index?'♪':'▶'}</button></div>`).join(''):'<p>歌單仍在整理中。</p>'}

  async function loadLyrics(track){
    dom.lyrics.textContent='正在尋找歌詞…';state.lyrics=[];
    try{
      const data=await request(`${API}?types=lyric&id=${encodeURIComponent(track.id)}&source=${encodeURIComponent(track.source)}`,10000);
      const raw=typeof data==='string'?data:(data?.lyric||data?.lrc||'');state.lyrics=parseLyrics(raw);
      dom.lyrics.innerHTML=state.lyrics.length?state.lyrics.map((line,index)=>`<span data-line="${index}">${esc(line.text)}</span>`).join(''):'這首歌暫時沒有可顯示的歌詞。';
    }catch{dom.lyrics.textContent='歌詞服務暫時沒有回應。'}
  }
  function parseLyrics(raw){return String(raw||'').split(/\r?\n/).flatMap(line=>{const text=line.replace(/\[[^\]]+\]/g,'').trim();const times=[...line.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];return text?times.map(match=>({time:+match[1]*60+ +match[2],text})):[]}).sort((a,b)=>a.time-b.time)}
  function syncLyrics(time){if(!state.lyrics.length)return;let active=0;for(let i=0;i<state.lyrics.length;i++){if(state.lyrics[i].time<=time)active=i;else break}dom.lyrics.querySelectorAll('span').forEach((item,index)=>item.classList.toggle('active',index===active));dom.lyrics.querySelector(`[data-line="${active}"]`)?.scrollIntoView({block:'center',behavior:'smooth'})}

  function setMediaSession(track){
    if(!('mediaSession' in navigator))return;
    try{navigator.mediaSession.metadata=new MediaMetadata({title:track.name,artist:track.artist,album:track.album||'Maydayland',artwork:[{src:songCover(track),sizes:'700x700'}]});navigator.mediaSession.setActionHandler('play',()=>dom.audio.play());navigator.mediaSession.setActionHandler('pause',()=>dom.audio.pause());navigator.mediaSession.setActionHandler('nexttrack',nextTrack);navigator.mediaSession.setActionHandler('previoustrack',previousTrack)}catch(error){console.warn(error)}
  }

  function openDrawer(){dom.drawer.classList.add('is-open');dom.drawer.setAttribute('aria-hidden','false')}
  function closeDrawer(){dom.drawer.classList.remove('is-open');dom.drawer.setAttribute('aria-hidden','true')}
  function openModal(modal){modal.classList.add('is-open');modal.setAttribute('aria-hidden','false')}
  function closeModals(){[dom.searchModal,dom.aboutModal].forEach(modal=>{modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true')})}

  async function runSearch(query){
    const value=query.trim();if(!value)return;dom.searchResults.innerHTML='<p>正在穿越歌庫…</p>';
    const rows=await searchMusic(`五月天 ${value}`,45);dom.searchResults._rows=rows;
    dom.searchResults.innerHTML=rows.length?rows.map((track,index)=>`<div class="result-row" data-result-index="${index}"><img src="${esc(songCover(track,180))}" alt=""><span><b>${esc(track.name)}</b><small>${esc(track.artist)} · ${esc(track.album)}</small></span><button>▶</button></div>`).join(''):'<p>沒有找到相符的五月天曲目。</p>';
  }

  function installBubuCursor(){
    if(!matchMedia('(pointer:fine)').matches)return;
    const cursor=document.createElement('div');cursor.className='bubu-cursor is-hidden';cursor.setAttribute('aria-hidden','true');
    cursor.innerHTML=`<svg viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg"><g fill="#5dcd3b"><path d="M35 29C24 18 23 7 29 2c9 7 11 17 6 27Z"/><path d="M39 30c0-15 7-25 15-25 2 12-3 21-15 25Z"/><path d="M34 30c-11-6-20-4-24 3 10 5 18 3 24-3Z"/></g><ellipse cx="36" cy="60" rx="28" ry="31" fill="#ff8518"/><ellipse cx="26" cy="53" rx="6" ry="9" fill="#eef7ff"/><ellipse cx="26" cy="53" rx="3.4" ry="6.5" fill="#2362a9"/><ellipse cx="46" cy="53" rx="6" ry="9" fill="#eef7ff"/><ellipse cx="46" cy="53" rx="3.4" ry="6.5" fill="#2362a9"/><path d="M20 68c6 7 12 3 16 0 4 3 10 7 16 0" fill="none" stroke="#231d1b" stroke-width="5" stroke-linecap="round"/></svg>`;
    document.body.appendChild(cursor);let x=-100,y=-100,tx=-100,ty=-100;
    const draw=()=>{x+=(tx-x)*.28;y+=(ty-y)*.28;cursor.style.transform=`translate3d(${x-12}px,${y-5}px,0) rotate(-7deg)`;requestAnimationFrame(draw)};
    addEventListener('mousemove',event=>{tx=event.clientX;ty=event.clientY;cursor.classList.remove('is-hidden')},{passive:true});addEventListener('mouseleave',()=>cursor.classList.add('is-hidden'));addEventListener('mousedown',()=>cursor.classList.add('is-pressed'));addEventListener('mouseup',()=>cursor.classList.remove('is-pressed'));document.addEventListener('mouseover',event=>cursor.classList.toggle('is-active',Boolean(event.target.closest('button,a,input,[data-play-world],[data-play-album]'))));draw();
  }

  function bind(){
    dom.enter.onclick=async()=>{dom.gateway.classList.add('is-hidden');localStorage.setItem('maydayland-entered','1');if(state.universe.length)await startWorld('forever');else toast('歌源暫時繁忙，你仍可先瀏覽世界。')};
    document.addEventListener('click',event=>{
      const world=event.target.closest('[data-play-world]');if(world)startWorld(world.dataset.playWorld);
      const album=event.target.closest('[data-play-album]');if(album)startWorld(album.dataset.playAlbum);
      const group=event.target.closest('[data-play-group]');if(group)playGroup(group.dataset.playGroup);
      const scroll=event.target.closest('[data-scroll]');if(scroll){document.querySelectorAll('[data-scroll]').forEach(item=>item.classList.remove('is-active'));scroll.classList.add('is-active');document.getElementById(scroll.dataset.scroll)?.scrollIntoView({behavior:'smooth'})}
    });
    dom.play.onclick=dom.fullPlay.onclick=togglePlay;dom.next.onclick=dom.fullNext.onclick=nextTrack;dom.prev.onclick=dom.fullPrev.onclick=previousTrack;
    dom.miniTrack.onclick=dom.openPlayer.onclick=openDrawer;dom.queueButton.onclick=openDrawer;dom.drawerClose.onclick=closeDrawer;
    dom.shuffle.onclick=()=>{state.shuffle=!state.shuffle;dom.shuffle.classList.toggle('is-active',state.shuffle);toast(state.shuffle?'已開啟隨機播放':'已改為順序播放')};
    dom.repeat.onclick=()=>{state.repeat=!state.repeat;dom.repeat.classList.toggle('is-active',state.repeat);toast(state.repeat?'已開啟單曲循環':'已關閉單曲循環')};
    dom.queueList.onclick=event=>{const row=event.target.closest('[data-queue-index]');if(row)playAt(+row.dataset.queueIndex)};
    dom.searchButton.onclick=()=>openModal(dom.searchModal);dom.aboutButton.onclick=()=>openModal(dom.aboutModal);document.querySelectorAll('[data-close-modal]').forEach(button=>button.onclick=closeModals);[dom.searchModal,dom.aboutModal].forEach(modal=>modal.onclick=event=>{if(event.target===modal)closeModals()});
    dom.searchForm.onsubmit=event=>{event.preventDefault();runSearch(dom.searchInput.value)};
    dom.searchResults.onclick=event=>{const row=event.target.closest('[data-result-index]');if(!row)return;const rows=dom.searchResults._rows||[];state.queue=rows;state.world={title:`搜尋：${dom.searchInput.value}`};state.index=+row.dataset.resultIndex;updateQueue();playAt(state.index);closeModals()};
    dom.audio.onplay=()=>updatePlaying(true);dom.audio.onpause=()=>updatePlaying(false);dom.audio.onended=()=>state.repeat?(dom.audio.currentTime=0,dom.audio.play()):nextTrack();dom.audio.onerror=()=>{updatePlaying(false);toast('音訊載入失敗，正在嘗試下一首。')};
    dom.audio.ontimeupdate=()=>{const duration=dom.audio.duration||0;const current=dom.audio.currentTime||0;const ratio=duration?current/duration:0;dom.miniProgress.style.width=`${ratio*100}%`;dom.progressInput.value=Math.round(ratio*1000);dom.currentTime.textContent=formatTime(current);dom.durationTime.textContent=formatTime(duration);syncLyrics(current)};
    dom.progressInput.oninput=()=>{if(Number.isFinite(dom.audio.duration))dom.audio.currentTime=dom.progressInput.value/1000*dom.audio.duration};
    document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeDrawer();closeModals()}if(/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;if(event.code==='Space'){event.preventDefault();togglePlay()}if(event.code==='ArrowRight')dom.audio.currentTime+=10;if(event.code==='ArrowLeft')dom.audio.currentTime=Math.max(0,dom.audio.currentTime-10)});
  }

  async function init(){
    render();makeWave();bind();installBubuCursor();[dom.nowCover,dom.miniCover,dom.fullCover].forEach(img=>img.src=FALLBACK_COVER);
    setGateway(3,'正在喚醒 Maydayland…');await loadUniverse();if(localStorage.getItem('maydayland-entered')==='1')dom.enter.querySelector('b').textContent='再次進入世界';
  }

  init().catch(error=>{console.error(error);dom.enter.disabled=false;setGateway(100,'歌源暫時無法連線，仍可先進入瀏覽');});
})();
