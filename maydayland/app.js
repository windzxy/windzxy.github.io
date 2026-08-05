(() => {
  'use strict';

  const API = 'https://music-api.gdstudio.xyz/api.php';
  const FALLBACK_COVER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Cdefs%3E%3ClinearGradient id="g" x2="1" y2="1"%3E%3Cstop stop-color="%237a9aff"/%3E%3Cstop offset=".55" stop-color="%23865ff6"/%3E%3Cstop offset="1" stop-color="%23ff7faa"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="600" height="600" rx="90" fill="url(%23g)"/%3E%3Ccircle cx="300" cy="300" r="145" fill="none" stroke="white" stroke-opacity=".48" stroke-width="28"/%3E%3Ccircle cx="300" cy="300" r="28" fill="white"/%3E%3Ctext x="300" y="535" text-anchor="middle" fill="white" font-family="Arial" font-size="36" font-weight="700"%3EMAYDAYLAND%3C/text%3E%3C/svg%3E';
  const OFFICIAL = {
    band: 'https://www.mayday.jp/wp-content/uploads/ffb31aec0c0adb49e80f9fc7e18b284f-500x399.jpg',
    blue: 'https://www.mayday.jp/blue/img/header-tw.jpg',
    first: 'https://www.mayday.jp/img/biography-oversea-1.jpg',
    viva: 'https://www.mayday.jp/img/biography-oversea-2.jpg',
    ocean: 'https://www.mayday.jp/img/biography-oversea-3.jpg',
    time: 'https://www.mayday.jp/img/biography-oversea-4.jpg',
    god: 'https://www.mayday.jp/img/biography-oversea-5.jpg',
    best: 'https://www.mayday.jp/img/biography-oversea-6.jpg',
    born: 'https://www.mayday.jp/img/biography-oversea-7.jpg',
    poetry: 'https://www.mayday.jp/img/biography-oversea-8.jpg',
    second: 'https://www.mayday.jp/img/biography-oversea-9a.jpg',
    history: 'https://www.mayday.jp/wp-content/uploads/5b5c7eed8c21d28d399c608497ab94561-500x500.jpg',
    mojo: 'https://twtmsearch.tipo.gov.tw/pic/20160227/102/041/399/pic_102041399_20130730_1.jpg'
  };

  const worlds = [
    {id:'forever',group:'featured',tag:'全宇宙',year:'1999—NOW',title:'Mayday Forever Radio',subtitle:'專輯、現場、OST、特別單曲全時段隨機播放',description:'不按年份，也不需要選擇；讓所有時代的五月天在今天重新相遇。',image:OFFICIAL.band,queries:['五月天','五月天 Live','五月天 單曲','五月天 OST'],featured:true},
    {id:'5525',group:'concert',tag:'25週年巡演',year:'2023—NOW',title:'回到那一天',subtitle:'Mayday #5525',description:'搭上 Mayday Express，回看二十五年的相遇與每一個仍然頑固的今天。',image:OFFICIAL.history,queries:['五月天 回到那一天 Live','五月天 5525 Live','五月天 25週年 Live'],featured:true},
    {id:'nowhere',group:'concert',tag:'末日／重生',year:'2011—2014',title:'諾亞方舟',subtitle:'NOWHERE WORLD TOUR',description:'末日不是終點，而是通往第二人生的入口。',image:OFFICIAL.second,queries:['五月天 諾亞方舟 Live','五月天 第二人生 Live'],featured:true},
    {id:'life',group:'concert',tag:'人生無限',year:'2017—2019',title:'人生無限公司',subtitle:'LiFE WORLD TOUR',description:'把人生變成一間公司，把每一晚變成只招收你的現場。',image:OFFICIAL.history,queries:['五月天 人生無限公司 Live','五月天 LIFE Live'],featured:true},
    {id:'blue',group:'concert',tag:'回歸初衷',year:'2019',title:'Just Rock It!!! BLUE',subtitle:'藍色三部曲二十週年',description:'以五月天的藍，重新塗滿出發時的天空。',image:OFFICIAL.blue,queries:['五月天 Just Rock It BLUE Live','五月天 藍 Live'],featured:true},
    {id:'finalhome',group:'concert',tag:'第一個世界巡迴',year:'2004—2005',title:'Final Home',subtitle:'當我們混在一起',description:'從台灣出發，把第一座世界巡迴的家，搭在每一個城市。',image:OFFICIAL.god,queries:['五月天 Final Home Live','五月天 當我們混在一起 Live']},
    {id:'jump',group:'concert',tag:'離開地球表面',year:'2007—2008',title:'JUMP!',subtitle:'離開地球表面世界巡迴',description:'在最需要逃離的一刻，把所有人一起拋向宇宙。',image:OFFICIAL.born,queries:['五月天 離開地球表面 Live','五月天 JUMP Live']},
    {id:'dna',group:'concert',tag:'創造',year:'2009—2010',title:'D.N.A.',subtitle:'五月天創造世界巡迴',description:'巨型舞台、變形視覺與全新的現場尺度，重新改寫演唱會的基因。',image:OFFICIAL.poetry,queries:['五月天 DNA Live','五月天 創造 Live']},
    {id:'jri',group:'concert',tag:'無限放大',year:'2012—2016',title:'Just Rock It!',subtitle:'就是搖滾',description:'把五個人的樂團排練室，一路放大到世界各地的體育場。',image:OFFICIAL.blue,queries:['五月天 Just Rock It Live','五月天 無限放大版 Live']},
    {id:'fly',group:'concert',tag:'線上與重逢',year:'2020—2023',title:'好好好想見到你',subtitle:'FLY TO 2023',description:'在無法相見的日子裡，先用音樂抵達彼此。',image:OFFICIAL.band,queries:['五月天 好好好想見到你 Live','五月天 Fly to 2023 Live']},
    {id:'ost',group:'story',tag:'電影／戲劇',year:'ALL YEARS',title:'OST 任意門',subtitle:'銀幕與故事裡的五月天',description:'電影、戲劇、主題曲與特別企劃，從另一扇門進入五月天。',image:OFFICIAL.history,queries:['五月天 電影主題曲','五月天 電視劇主題曲','五月天 OST','五月天 星空 入陣曲 步步 任性'],featured:true},
    {id:'mojo',group:'story',tag:'角色居民',year:'MAYDAYLAND',title:'MOJO 小隊',subtitle:'公仔、喵星人與舞台角色',description:'由五個小小分身帶路，播放更俏皮、更適合一起大合唱的五月天。',image:OFFICIAL.mojo,queries:['五月天 派對動物','五月天 OAOA','五月天 戀愛ING','五月天 笑忘歌']}
  ];

  const albums = [
    ['first','1999','五月天第一張創作專輯',OFFICIAL.first],['viva','2000','愛情萬歲',OFFICIAL.viva],['ocean','2001','人生海海',OFFICIAL.ocean],['time','2003','時光機',OFFICIAL.time],['god','2004','神的孩子都在跳舞',OFFICIAL.god],['born','2006','為愛而生',OFFICIAL.born],['poetry','2008','後青春期的詩',OFFICIAL.poetry],['second','2011','第二人生',OFFICIAL.second],['history','2016','自傳',OFFICIAL.history]
  ].map(([id,year,title,image])=>({id:`album-${id}`,group:'album',tag:'創作專輯',year,title,subtitle:'五月天',description:`播放《${title}》相關曲目`,image,queries:[`五月天 ${title}`]}));

  const timeline = [
    ['1997','五月天成軍','在野台與校園場景裡，五個人的樂團故事逐漸成形。'],
    ['1999','第一張創作專輯','正式發片，並以第168場演唱會寫下大型現場起點。'],
    ['2001','人生海海與暫別','在「你要去哪裡」演唱會後暫別舞台，再等待重新集合。'],
    ['2003','天空之城復出','回到舞台，也開啟更大規模的演唱會時代。'],
    ['2004','Final Home','第一次世界巡迴，將「家」帶到更多城市。'],
    ['2011','第二人生／諾亞方舟','末日與重生的世界觀，成為巡演與作品的重要高峰。'],
    ['2017','人生無限公司','以職場宇宙包裝人生，巡演一路跨越世界四大洲。'],
    ['2023','回到那一天','二十五週年的時光列車，繼續駛向更多新的相遇。']
  ];

  const $ = (id) => document.getElementById(id);
  const dom = {
    audio:$('audio'),boot:$('boot'),enter:$('enterButton'),bootProgress:$('bootProgress'),bootStatus:$('bootStatus'),featured:$('featuredGrid'),concerts:$('concertRail'),albums:$('albumGrid'),timeline:$('timeline'),ambient:$('ambientImage'),universeCount:$('universeCount'),worldCount:$('worldCount'),nowCard:$('nowCard'),liveDot:$('liveDot'),wave:$('wave'),nowCoverLarge:$('nowCoverLarge'),nowWorld:$('nowWorld'),nowTitleLarge:$('nowTitleLarge'),nowArtistLarge:$('nowArtistLarge'),miniCover:$('miniCover'),miniTitle:$('miniTitle'),miniArtist:$('miniArtist'),miniProgress:$('miniProgress'),play:$('playButton'),prev:$('prevButton'),next:$('nextButton'),shuffle:$('shuffleButton'),queueButton:$('queueButton'),queueCount:$('queueCount'),queuePanel:$('queuePanel'),queueList:$('queueList'),searchToggle:$('searchToggle'),searchPanel:$('searchPanel'),searchForm:$('searchForm'),searchInput:$('searchInput'),searchResults:$('searchResults'),infoToggle:$('infoToggle'),infoPanel:$('infoPanel'),scrim:$('scrim'),full:$('fullPlayer'),openFull:$('openFullPlayer'),closeFull:$('closeFullPlayer'),fullCover:$('fullCover'),fullWorld:$('fullWorld'),fullTitle:$('fullTitle'),fullArtist:$('fullArtist'),fullCurrent:$('fullCurrent'),fullDuration:$('fullDuration'),fullProgress:$('fullProgress'),fullPlay:$('fullPlay'),fullPrev:$('fullPrev'),fullNext:$('fullNext'),fullShuffle:$('fullShuffle'),fullRepeat:$('fullRepeat'),lyrics:$('lyrics'),toast:$('toast')
  };

  const state = {catalog:new Map(), universe:[], queue:[], current:null, index:-1, world:null, shuffle:true, repeat:false, loading:false, started:false, lyricLines:[], lyricTimer:0};
  const esc = (s='') => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const artist = (a) => Array.isArray(a) ? a.join(' / ') : (a || '五月天');
  const key = (s) => `${s.source}:${s.id}`;
  const cover = (s,size=600) => s?.pic_id ? `${API}?types=pic&id=${encodeURIComponent(s.pic_id)}&source=${encodeURIComponent(s.source)}&size=${size}` : (s?.image || FALLBACK_COVER);
  const format = (n) => !Number.isFinite(n) ? '0:00' : `${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`;
  const song = (raw, source='netease') => ({id:String(raw.id||''),name:String(raw.name||raw.title||'未知歌曲'),artist:artist(raw.artist||raw.artists),album:String(raw.album||''),pic_id:raw.pic_id||raw.picId||'',source:raw.source||source});
  const sleep = (ms) => new Promise(r=>setTimeout(r,ms));

  function toast(message){clearTimeout(state.toastTimer);dom.toast.textContent=message;dom.toast.classList.add('is-show');state.toastTimer=setTimeout(()=>dom.toast.classList.remove('is-show'),2500)}
  function setBoot(progress,text){dom.bootProgress.style.width=`${Math.max(0,Math.min(100,progress))}%`;dom.bootStatus.textContent=text}
  function makeWave(){dom.wave.innerHTML=Array.from({length:24},(_,i)=>`<i style="--h:${8+Math.random()*25}px;--d:${-i*42}ms"></i>`).join('')}
  function render(){
    dom.featured.innerHTML=worlds.filter(w=>w.featured).slice(0,5).map(worldCard).join('');
    dom.concerts.innerHTML=worlds.filter(w=>w.group==='concert').map(w=>`<article class="rail-card" data-play-world="${w.id}"><img src="${esc(w.image)}" alt="${esc(w.title)}" referrerpolicy="no-referrer"><div class="rail-card__copy"><span>${esc(w.year)} · ${esc(w.tag)}</span><h3>${esc(w.title)}</h3><p>${esc(w.description)}</p></div></article>`).join('');
    dom.albums.innerHTML=albums.map(a=>`<article class="album-card" data-play-album="${a.id}"><div class="album-card__cover"><img src="${esc(a.image)}" alt="${esc(a.title)}" referrerpolicy="no-referrer"><button aria-label="播放 ${esc(a.title)}">▶</button></div><h3>${esc(a.title)}</h3><p>${esc(a.year)} · 創作專輯</p></article>`).join('');
    dom.timeline.innerHTML=`<h3>五月天時間線</h3><div class="timeline-list">${timeline.map(([year,title,text])=>`<div class="timeline-item"><time>${year}</time><i></i><div><b>${title}</b><p>${text}</p></div></div>`).join('')}</div>`;
    dom.worldCount.textContent=worlds.length+albums.length;
  }
  function worldCard(w){return `<article class="world-card" data-play-world="${w.id}"><img src="${esc(w.image)}" alt="${esc(w.title)}" referrerpolicy="no-referrer"><div class="world-card__top"><span class="world-card__tag">${esc(w.tag)}</span><button class="world-card__play" aria-label="播放 ${esc(w.title)}">▶</button></div><div class="world-card__content"><p>${esc(w.year)} · ${esc(w.subtitle)}</p><h3>${esc(w.title)}</h3><p>${esc(w.description)}</p></div></article>`}

  async function request(url, timeout=15000){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeout);try{const r=await fetch(url,{signal:controller.signal});if(!r.ok)throw new Error(`HTTP ${r.status}`);return await r.json()}finally{clearTimeout(timer)}}
  async function searchQuery(query,count=28){
    const cacheKey=query.trim(); if(state.catalog.has(cacheKey)) return state.catalog.get(cacheKey);
    const sources=['netease','kuwo']; let result=[];
    for(const source of sources){
      try{const data=await request(`${API}?types=search&source=${source}&name=${encodeURIComponent(query)}&count=${count}&pages=1&v=${Date.now().toString(36)}`);if(Array.isArray(data)){result=data.map(x=>song(x,source)).filter(x=>x.id&&(/五月天|Mayday/i.test(`${x.artist} ${x.album} ${x.name}`)));if(result.length)break}}catch(e){console.warn('Search failed',query,source,e)}
    }
    state.catalog.set(cacheKey,result); return result;
  }
  function dedupe(list){const m=new Map();list.forEach(s=>{if(s?.id&&!m.has(key(s)))m.set(key(s),s)});return [...m.values()]}
  async function loadUniverse(){
    const queries=['五月天','五月天 Live','五月天 第一張創作專輯','五月天 愛情萬歲','五月天 人生海海','五月天 時光機','五月天 神的孩子都在跳舞','五月天 為愛而生','五月天 後青春期的詩','五月天 第二人生','五月天 自傳','五月天 Final Home Live','五月天 離開地球表面 Live','五月天 DNA Live','五月天 諾亞方舟 Live','五月天 人生無限公司 Live','五月天 回到那一天 Live','五月天 OST','五月天 電影主題曲','五月天 單曲'];
    const all=[]; for(let i=0;i<queries.length;i++){setBoot(8+Math.round((i/queries.length)*82),`正在整理：${queries[i].replace('五月天 ','')}`);const rows=await searchQuery(queries[i],22);all.push(...rows);if(i%3===0)await sleep(60)}
    state.universe=dedupe(all); dom.universeCount.textContent=state.universe.length||'—'; setBoot(96,`已整理 ${state.universe.length} 首歌曲`);dom.enter.disabled=!state.universe.length;dom.enter.querySelector('span:last-child').textContent=state.universe.length?'進入 Maydayland':'重新連線';
    if(!state.universe.length)toast('歌源暫時繁忙，可稍後重新整理。');
  }

  async function buildWorld(world){
    const lists=[];for(const q of world.queries){lists.push(...await searchQuery(q,32))}
    let tracks=dedupe(lists);if(!tracks.length&&world.id!=='forever')tracks=state.universe.filter(s=>world.queries.some(q=>`${s.name} ${s.album}`.includes(q.replace('五月天 ',''))));
    return tracks.length?tracks:state.universe;
  }
  async function startWorld(worldId, auto=true){
    const world=worlds.find(w=>w.id===worldId)||albums.find(w=>w.id===worldId);if(!world)return;
    toast(`正在進入「${world.title}」`);const tracks=world.id==='forever'?state.universe:await buildWorld(world);if(!tracks.length)return toast('這個世界暫時沒有可用歌曲。');
    state.world=world;state.queue=[...tracks];state.index=state.shuffle?Math.floor(Math.random()*state.queue.length):0;updateQueue();if(auto)await playAt(state.index);document.querySelector('#home').scrollIntoView({behavior:'smooth'});
  }
  async function playAt(index){
    if(!state.queue.length)return;state.index=(index+state.queue.length)%state.queue.length;const track=state.queue[state.index];state.current=track;updateNow();toast(`正在連接：${track.name}`);
    try{let audioUrl='';for(const br of ['320','192','128']){const data=await request(`${API}?types=url&id=${encodeURIComponent(track.id)}&source=${encodeURIComponent(track.source)}&br=${br}&v=${Date.now().toString(36)}`,12000);audioUrl=data?.url||'';if(audioUrl)break}if(!audioUrl)throw new Error('No audio URL');dom.audio.src=String(audioUrl).replace(/^http:/,'https:');await dom.audio.play();loadLyrics(track);setMediaSession(track)}catch(e){console.warn(e);toast('此曲目暫時無法播放，已自動嘗試下一首。');setTimeout(()=>nextTrack(),900)}
  }
  function nextTrack(){if(!state.queue.length)return;const next=state.shuffle?Math.floor(Math.random()*state.queue.length):state.index+1;playAt(next)}
  function prevTrack(){if(!state.queue.length)return;playAt(state.index-1)}
  function togglePlay(){if(!state.current){return startWorld('forever')}dom.audio.paused?dom.audio.play().catch(()=>toast('請再次點擊播放')):dom.audio.pause()}
  function updateNow(){
    const t=state.current,w=state.world||worlds[0],img=cover(t);dom.nowCoverLarge.src=img;dom.miniCover.src=img;dom.fullCover.src=img;dom.ambient.style.backgroundImage=`url("${img}")`;dom.full.style.setProperty('--full-bg',`url("${img}")`);dom.nowWorld.textContent=w.title;dom.fullWorld.textContent=w.title;dom.nowTitleLarge.textContent=t?.name||'等待進入世界';dom.miniTitle.textContent=t?.name||'Mayday Forever Radio';dom.fullTitle.textContent=t?.name||'尚未播放';dom.nowArtistLarge.textContent=t?.artist||'五月天';dom.miniArtist.textContent=t?.artist||'等待進入世界';dom.fullArtist.textContent=t?.artist||'五月天';renderQueue();
  }
  function updatePlaying(on){dom.nowCard.classList.toggle('is-playing',on);dom.liveDot.classList.toggle('is-live',on);dom.play.textContent=on?'Ⅱ':'▶';dom.fullPlay.textContent=on?'Ⅱ':'▶'}
  function updateQueue(){dom.queueCount.textContent=state.queue.length>99?'99+':state.queue.length;renderQueue()}
  function renderQueue(){dom.queueList.innerHTML=state.queue.length?state.queue.map((t,i)=>`<div class="queue-row${i===state.index?' is-current':''}" data-queue-index="${i}"><img src="${esc(cover(t,180))}" alt=""><span><b>${esc(t.name)}</b><small>${esc(t.artist)} · ${esc(t.album||'Maydayland')}</small></span><button>${i===state.index?'♪':'▶'}</button></div>`).join(''):'<p>歌單仍在整理中。</p>'}
  async function loadLyrics(track){
    dom.lyrics.textContent='正在尋找歌詞…';state.lyricLines=[];try{const data=await request(`${API}?types=lyric&id=${encodeURIComponent(track.id)}&source=${encodeURIComponent(track.source)}`,10000);const raw=typeof data==='string'?data:(data?.lyric||data?.lrc||'');state.lyricLines=parseLyric(raw);dom.lyrics.innerHTML=state.lyricLines.length?state.lyricLines.map((l,i)=>`<span data-line="${i}">${esc(l.text)}</span>`).join('\n'):'這首歌暫時沒有可顯示的歌詞。'}catch{dom.lyrics.textContent='歌詞服務暫時沒有回應。'}
  }
  function parseLyric(raw){return String(raw||'').split(/\r?\n/).flatMap(line=>{const text=line.replace(/\[[^\]]+\]/g,'').trim();const times=[...line.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];return text?times.map(m=>({time:+m[1]*60+ +m[2],text})):[]}).sort((a,b)=>a.time-b.time)}
  function syncLyrics(time){if(!state.lyricLines.length)return;let idx=0;for(let i=0;i<state.lyricLines.length;i++){if(state.lyricLines[i].time<=time)idx=i;else break}dom.lyrics.querySelectorAll('span').forEach((el,i)=>el.classList.toggle('active',i===idx));const active=dom.lyrics.querySelector(`[data-line="${idx}"]`);active?.scrollIntoView({block:'center',behavior:'smooth'})}
  function setMediaSession(t){if(!('mediaSession'in navigator))return;try{navigator.mediaSession.metadata=new MediaMetadata({title:t.name,artist:t.artist,album:t.album||'Maydayland',artwork:[{src:cover(t,600),sizes:'600x600'}]});navigator.mediaSession.setActionHandler('play',()=>dom.audio.play());navigator.mediaSession.setActionHandler('pause',()=>dom.audio.pause());navigator.mediaSession.setActionHandler('nexttrack',nextTrack);navigator.mediaSession.setActionHandler('previoustrack',prevTrack)}catch(e){console.warn(e)}}

  async function runSearch(q){q=q.trim();if(!q)return;dom.searchResults.innerHTML='<p>正在穿越歌庫…</p>';const rows=await searchQuery(`五月天 ${q}`,40);dom.searchResults.innerHTML=rows.length?rows.map((t,i)=>`<div class="result-row" data-result-index="${i}"><img src="${esc(cover(t,180))}" alt=""><span><b>${esc(t.name)}</b><small>${esc(t.artist)} · ${esc(t.album)}</small></span><button>▶</button></div>`).join(''):'<p>沒有找到相符的五月天曲目。</p>';dom.searchResults._rows=rows}
  function openPanel(panel){[dom.searchPanel,dom.infoPanel,dom.queuePanel].forEach(p=>p.classList.remove('is-open'));panel.classList.add('is-open');panel.setAttribute('aria-hidden','false');dom.scrim.classList.add('is-open')}
  function closePanels(){[dom.searchPanel,dom.infoPanel,dom.queuePanel].forEach(p=>{p.classList.remove('is-open');p.setAttribute('aria-hidden','true')});dom.scrim.classList.remove('is-open')}

  function bind(){
    dom.enter.onclick=async()=>{if(!state.universe.length){dom.enter.disabled=true;await loadUniverse();return}state.started=true;localStorage.setItem('maydayland-entered','1');dom.boot.classList.add('is-hidden');await startWorld('forever')};
    $('playUniverse').onclick=()=>startWorld('forever');document.addEventListener('click',e=>{const w=e.target.closest('[data-play-world]');if(w)startWorld(w.dataset.playWorld);const a=e.target.closest('[data-play-album]');if(a)startWorld(a.dataset.playAlbum);const group=e.target.closest('[data-play-group]');if(group){const list=group.dataset.playGroup==='album'?albums:worlds.filter(x=>x.group===group.dataset.playGroup);const merged=[];Promise.all(list.map(buildWorld)).then(rows=>{rows.forEach(r=>merged.push(...r));state.queue=dedupe(merged);state.world={title:group.dataset.playGroup==='album'?'專輯星系':'演唱會世界'};state.index=0;updateQueue();playAt(0)})}const open=e.target.closest('[data-open-world]');if(open)document.getElementById(open.dataset.openWorld)?.scrollIntoView({behavior:'smooth'})});
    dom.play.onclick=dom.fullPlay.onclick=togglePlay;dom.next.onclick=dom.fullNext.onclick=nextTrack;dom.prev.onclick=dom.fullPrev.onclick=prevTrack;dom.shuffle.onclick=dom.fullShuffle.onclick=()=>{state.shuffle=!state.shuffle;dom.shuffle.classList.toggle('is-active',state.shuffle);dom.fullShuffle.classList.toggle('is-active',state.shuffle);toast(state.shuffle?'已開啟隨機播放':'已改為順序播放')};dom.fullRepeat.onclick=()=>{state.repeat=!state.repeat;dom.fullRepeat.classList.toggle('is-active',state.repeat);toast(state.repeat?'單曲循環':'關閉單曲循環')};
    dom.queueButton.onclick=()=>openPanel(dom.queuePanel);dom.searchToggle.onclick=()=>openPanel(dom.searchPanel);dom.infoToggle.onclick=()=>openPanel(dom.infoPanel);dom.scrim.onclick=closePanels;document.querySelectorAll('[data-close-panel]').forEach(b=>b.onclick=closePanels);dom.openFull.onclick=()=>{dom.full.classList.add('is-open');dom.full.setAttribute('aria-hidden','false')};dom.closeFull.onclick=()=>{dom.full.classList.remove('is-open');dom.full.setAttribute('aria-hidden','true')};
    dom.searchForm.onsubmit=e=>{e.preventDefault();runSearch(dom.searchInput.value)};dom.searchResults.onclick=e=>{const row=e.target.closest('[data-result-index]');if(!row)return;const tracks=dom.searchResults._rows||[];state.queue=tracks;state.world={title:`搜尋：${dom.searchInput.value}`};state.index=+row.dataset.resultIndex;updateQueue();playAt(state.index);closePanels()};dom.queueList.onclick=e=>{const row=e.target.closest('[data-queue-index]');if(row){playAt(+row.dataset.queueIndex);closePanels()}};
    document.querySelectorAll('[data-section]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-section]').forEach(x=>x.classList.remove('is-active'));b.classList.add('is-active');document.getElementById(b.dataset.section)?.scrollIntoView({behavior:'smooth'})});
    dom.audio.onplay=()=>updatePlaying(true);dom.audio.onpause=()=>updatePlaying(false);dom.audio.onended=()=>state.repeat?(dom.audio.currentTime=0,dom.audio.play()):nextTrack();dom.audio.ontimeupdate=()=>{const d=dom.audio.duration||0,c=dom.audio.currentTime||0,p=d?c/d:0;dom.miniProgress.style.width=`${p*100}%`;dom.fullProgress.value=Math.round(p*1000);dom.fullCurrent.textContent=format(c);dom.fullDuration.textContent=format(d);syncLyrics(c)};dom.fullProgress.oninput=()=>{if(Number.isFinite(dom.audio.duration))dom.audio.currentTime=dom.fullProgress.value/1000*dom.audio.duration};dom.audio.onerror=()=>{updatePlaying(false);toast('音訊載入失敗，正在切換下一首。')};
    document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();togglePlay()}if(e.code==='ArrowRight')dom.audio.currentTime+=10;if(e.code==='ArrowLeft')dom.audio.currentTime=Math.max(0,dom.audio.currentTime-10)});
  }

  async function init(){render();makeWave();bind();dom.nowCoverLarge.src=dom.miniCover.src=dom.fullCover.src=FALLBACK_COVER;setBoot(3,'正在喚醒 Maydayland…');await loadUniverse();setBoot(100,'世界準備完成');await sleep(380);if(localStorage.getItem('maydayland-entered')==='1'&&state.universe.length){dom.enter.disabled=false;dom.enter.querySelector('span:last-child').textContent='再次進入 Maydayland'} }
  init().catch(e=>{console.error(e);setBoot(100,'歌源暫時無法連線');dom.enter.disabled=false;dom.enter.querySelector('span:last-child').textContent='以離線畫面進入';dom.enter.onclick=()=>dom.boot.classList.add('is-hidden')});
})();
