(() => {
  'use strict';

  const API = 'https://music-api.gdstudio.xyz/api.php';
  const FALLBACK_COVER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="700" height="700" viewBox="0 0 700 700"%3E%3Cdefs%3E%3ClinearGradient id="g" x2="1" y2="1"%3E%3Cstop stop-color="%235777be"/%3E%3Cstop offset=".5" stop-color="%23836abc"/%3E%3Cstop offset="1" stop-color="%23ef7ba6"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="700" height="700" rx="96" fill="url(%23g)"/%3E%3Ccircle cx="350" cy="330" r="170" fill="none" stroke="white" stroke-opacity=".28" stroke-width="28"/%3E%3Ccircle cx="350" cy="330" r="30" fill="white"/%3E%3Ctext x="350" y="590" text-anchor="middle" fill="white" font-family="Arial" font-size="42" font-weight="700"%3EMAYDAYLAND%3C/text%3E%3C/svg%3E';

  const IMG = {
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
    secondAlt: 'https://www.mayday.jp/img/biography-oversea-9b.jpg',
    history: 'https://www.mayday.jp/wp-content/uploads/5b5c7eed8c21d28d399c608497ab94561-500x500.jpg'
  };

  const COLORS = [
    ['#284f72','#7397be'],['#2d425f','#7089ad'],['#4d354e','#ab5e79'],['#28494c','#5b9694'],
    ['#42355c','#8a73b3'],['#5b4130','#b47843'],['#263a55','#607da5'],['#573044','#a65b7e'],['#344c42','#799166'],
    ['#5a3c35','#c26f4e'],['#263f5d','#698bb8']
  ];

  const worlds = [
    {id:'forever',group:'featured',tag:'ALL ERAS',year:'1999 — NOW',title:'Mayday Forever Radio',subtitle:'五月天全宇宙',description:'專輯、現場、OST、合作與特別單曲，讓所有時代在今天重新相遇。',image:IMG.band,queries:['五月天','五月天 Live','五月天 OST','五月天 單曲'],color:0,featured:true},
    {id:'5525',group:'concert',tag:'25TH ANNIVERSARY',year:'2023 — NOW',title:'回到那一天 #5525',subtitle:'二十五週年巡演',description:'搭上時光列車，回看二十五年的相遇，再繼續前往下一站。',image:IMG.history,queries:['五月天 回到那一天 Live','五月天 5525 Live'],color:1,featured:true},
    {id:'nowhere',group:'concert',tag:'NOWHERE',year:'2011 — 2014',title:'諾亞方舟',subtitle:'末日與第二人生',description:'世界沒有末日，我們便有機會選擇自己的第二人生。',image:IMG.second,queries:['五月天 諾亞方舟 Live','五月天 第二人生 Live'],color:2,featured:true},
    {id:'life',group:'concert',tag:'LiFE',year:'2017 — 2019',title:'人生無限公司',subtitle:'第十次大型巡演',description:'把每一夜都活成一部電影，把每一個觀眾都寫進故事。',image:IMG.first,queries:['五月天 人生無限公司 Live','五月天 LiFE Live'],color:3,featured:true},
    {id:'blue',group:'concert',tag:'BACK TO BLUE',year:'2019',title:'Just Rock It!!! BLUE',subtitle:'藍色三部曲二十週年',description:'回到最初的藍，再一次把青春塗滿整座場館。',image:IMG.blue,queries:['五月天 Just Rock It BLUE Live','五月天 藍 Live'],color:4,featured:true},
    {id:'finalhome',group:'concert',tag:'FIRST WORLD TOUR',year:'2004 — 2005',title:'Final Home',subtitle:'當我們混在一起',description:'第一座世界巡迴的家，從台灣一路搭到更多城市。',image:IMG.god,queries:['五月天 Final Home Live','五月天 當我們混在一起 Live'],color:5},
    {id:'jump',group:'concert',tag:'JUMP!',year:'2007 — 2008',title:'離開地球表面',subtitle:'JUMP 世界巡迴',description:'把所有疲憊拋出地表，讓全場一起跳向宇宙。',image:IMG.born,queries:['五月天 離開地球表面 Live','五月天 JUMP Live'],color:6},
    {id:'dna',group:'concert',tag:'CREATE',year:'2009 — 2010',title:'D.N.A. 創造',subtitle:'創造世界巡迴',description:'巨型舞台、工業視覺與全新尺度，重新改寫現場的基因。',image:IMG.poetry,queries:['五月天 DNA Live','五月天 創造 Live'],color:7},
    {id:'goodgood',group:'concert',tag:'MEET AGAIN',year:'2020 — 2023',title:'好好好想見到你',subtitle:'線上與重逢',description:'在無法相見的日子裡，先讓音樂替我們抵達彼此。',image:IMG.time,queries:['五月天 好好好想見到你 Live','五月天 Fly to 2023 Live'],color:8},
    {id:'ost',group:'story',tag:'SCREEN & STORY',year:'ALL YEARS',title:'OST 任意門',subtitle:'電影、戲劇與特別企劃',description:'從銀幕與故事的另一扇門，重新遇見五月天。',image:IMG.best,queries:['五月天 電影主題曲','五月天 電視劇主題曲','五月天 OST'],color:9},
    {id:'party',group:'story',tag:'MOJO PARTY',year:'MAYDAYLAND',title:'卜卜的派對房間',subtitle:'一起跳起來的歌',description:'戀愛ING、OAOA、派對動物與所有適合大合唱的快樂時刻。',image:IMG.viva,queries:['五月天 戀愛ING','五月天 OAOA','五月天 派對動物','五月天 笑忘歌'],color:10}
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

  const CORE_QUERIES = [
    '五月天','五月天 Live','五月天 第一張創作專輯','五月天 愛情萬歲','五月天 人生海海','五月天 時光機',
    '五月天 神的孩子都在跳舞','五月天 為愛而生','五月天 後青春期的詩','五月天 第二人生','五月天 自傳','五月天 OST'
  ];

  const $ = id => document.getElementById(id);
  const dom = {
    audio:$('audio'),songCount:$('songCount'),worldCount:$('worldCount'),portalGrid:$('portalGrid'),concertRail:$('concertRail'),albumGrid:$('albumGrid'),timeline:$('timeline'),
    universeButton:$('universeButton'),nowPanel:$('nowPanel'),liveDot:$('liveDot'),visualizer:$('visualizer'),nowCover:$('nowCover'),nowWorld:$('nowWorld'),nowTitle:$('nowTitle'),nowArtist:$('nowArtist'),
    playerDock:$('playerDock'),miniTrack:$('miniTrack'),miniCover:$('miniCover'),miniTitle:$('miniTitle'),miniArtist:$('miniArtist'),miniProgress:$('miniProgress'),play:$('playButton'),prev:$('prevButton'),next:$('nextButton'),shuffle:$('shuffleButton'),queueButton:$('queueButton'),queueCount:$('queueCount'),
    playerSheet:$('playerSheet'),openPlayer:$('openPlayer'),closePlayer:$('closePlayer'),playerBackdrop:$('playerBackdrop'),fullCover:$('fullCover'),fullWorld:$('fullWorld'),fullTitle:$('fullTitle'),fullArtist:$('fullArtist'),currentTime:$('currentTime'),durationTime:$('durationTime'),progressInput:$('progressInput'),fullPlay:$('fullPlay'),fullPrev:$('fullPrev'),fullNext:$('fullNext'),fullShuffle:$('fullShuffle'),fullRepeat:$('fullRepeat'),lyrics:$('lyrics'),
    searchButton:$('searchButton'),aboutButton:$('aboutButton'),searchModal:$('searchModal'),aboutModal:$('aboutModal'),searchForm:$('searchForm'),searchInput:$('searchInput'),searchResults:$('searchResults'),queueSheet:$('queueSheet'),closeQueue:$('closeQueue'),queueList:$('queueList'),soundUnlock:$('soundUnlock'),toast:$('toast')
  };

  const state = {
    cache:new Map(),universe:[],queue:[],current:null,index:-1,world:worlds[0],shuffle:true,repeat:false,
    lyricLines:[],activeLyric:-1,failed:new Set(),starting:false,toastTimer:0,searchRows:[]
  };

  const esc = (value='') => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key = track => `${track.source}:${track.id}`;
  const artistText = value => Array.isArray(value) ? value.join(' / ') : (value || '五月天');
  const formatTime = value => Number.isFinite(value) ? `${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}` : '0:00';
  const artStyle = index => `--art-a:${COLORS[index%COLORS.length][0]};--art-b:${COLORS[index%COLORS.length][1]}`;
  const songCover = (track,size=700) => track?.pic_id ? `${API}?types=pic&id=${encodeURIComponent(track.pic_id)}&source=${encodeURIComponent(track.source)}&size=${size}` : FALLBACK_COVER;

  function toast(message){
    clearTimeout(state.toastTimer);dom.toast.textContent=message;dom.toast.classList.add('is-show');
    state.toastTimer=setTimeout(()=>dom.toast.classList.remove('is-show'),2600);
  }

  function normalise(raw,source){
    return {id:String(raw.id||''),name:String(raw.name||raw.title||'未知歌曲'),artist:artistText(raw.artist||raw.artists),album:String(raw.album||''),pic_id:raw.pic_id||raw.picId||'',source:raw.source||source};
  }

  function dedupe(list){
    const map=new Map();
    for(const item of list){if(item?.id&&!map.has(key(item)))map.set(key(item),item)}
    return [...map.values()];
  }

  function render(){
    dom.portalGrid.innerHTML=worlds.filter(item=>item.featured).map(item=>worldCard(item,'portal-card')).join('');
    dom.concertRail.innerHTML=worlds.filter(item=>item.group==='concert').map(item=>worldCard(item,'concert-card')).join('');
    dom.albumGrid.innerHTML=albums.map(album=>`<article class="album-card" data-play-album="${album.id}" style="${artStyle(album.color)}"><div class="album-card__art" data-label="${esc(album.title)}"><img src="${esc(album.image)}" alt="${esc(album.title)}" data-static-image></div><h3>${esc(album.title)}</h3><p>${esc(album.year)} · 創作專輯</p></article>`).join('');
    dom.timeline.innerHTML=`<h3>五月天時間線</h3><div class="timeline-list">${timeline.map(([year,title,text])=>`<div class="timeline-item"><time>${year}</time><i></i><div><b>${esc(title)}</b><p>${esc(text)}</p></div></div>`).join('')}</div>`;
    dom.worldCount.textContent=worlds.length+albums.length;
    makeVisualizer();
    protectStaticImages();
  }

  function worldCard(item,className){
    return `<article class="${className}" data-play-world="${item.id}" style="${artStyle(item.color)}"><img src="${esc(item.image)}" alt="${esc(item.title)}" data-static-image><button class="card-play" aria-label="播放 ${esc(item.title)}">▶</button><div class="${className}__copy"><span>${esc(item.year)} · ${esc(item.tag)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></div></article>`;
  }

  function protectStaticImages(){
    document.querySelectorAll('[data-static-image]').forEach(img=>{
      if(img.dataset.protected)return;
      img.dataset.protected='1';img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';
      img.addEventListener('error',()=>{img.hidden=true;(img.closest('.media-art,.portal-card,.concert-card,.album-card__art')||img.parentElement)?.classList.add('is-fallback')},{once:true});
    });
  }

  function makeVisualizer(){
    dom.visualizer.innerHTML=Array.from({length:24},(_,i)=>`<i style="--h:${8+Math.random()*26}px;--d:${-i*43}ms"></i>`).join('');
  }

  async function requestJson(url,timeout=15000){
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeout);
    try{const response=await fetch(url,{signal:controller.signal,cache:'no-store'});if(!response.ok)throw new Error(`HTTP ${response.status}`);return await response.json()}finally{clearTimeout(timer)}
  }

  async function searchQuery(query,count=45){
    const cacheKey=query.trim();if(state.cache.has(cacheKey))return state.cache.get(cacheKey);
    const sources=['netease','kuwo','qq','migu'];let results=[];
    for(const source of sources){
      try{
        const data=await requestJson(`${API}?types=search&source=${source}&name=${encodeURIComponent(query)}&count=${count}&pages=1&v=6`);
        if(!Array.isArray(data))continue;
        const rows=data.map(row=>normalise(row,source)).filter(track=>track.id&&/五月天|Mayday/i.test(`${track.artist} ${track.album} ${track.name}`));
        results.push(...rows);
        if(results.length>=count)break;
      }catch(error){console.warn('search failed',query,source,error)}
    }
    results=dedupe(results);state.cache.set(cacheKey,results);return results;
  }

  async function buildWorld(world){
    const rows=(await Promise.all(world.queries.map(query=>searchQuery(query,38)))).flat();
    const tracks=dedupe(rows);return tracks.length?tracks:state.universe;
  }

  async function loadUniverse(){
    dom.nowTitle.textContent='正在整理五月天歌單';
    const first=await searchQuery('五月天',80);
    state.universe=dedupe(first);
    dom.songCount.textContent=state.universe.length||'—';
    if(state.universe.length){
      state.queue=shuffleCopy(state.universe);state.index=0;state.world=worlds[0];updateQueue();
      await playAt(0,{autoplayAttempt:true});
    }else{
      dom.nowTitle.textContent='歌源暫時沒有回應';toast('歌源暫時繁忙，稍後可再試。');
    }

    let completed=1;
    const more=await Promise.all(CORE_QUERIES.slice(1).map(async query=>{const rows=await searchQuery(query,35);completed+=1;dom.miniArtist.textContent=`正在整理 ${completed}/${CORE_QUERIES.length}`;return rows}));
    const expanded=dedupe([...state.universe,...more.flat()]);
    const oldKeys=new Set(state.queue.map(key));state.universe=expanded;dom.songCount.textContent=expanded.length||'—';
    if(state.world?.id==='forever'){
      const additions=expanded.filter(track=>!oldKeys.has(key(track)));state.queue=dedupe([...state.queue,...shuffleCopy(additions)]);updateQueue();
    }
    if(!state.current)dom.miniArtist.textContent='五月天';
  }

  function shuffleCopy(list){
    const copy=[...list];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy;
  }

  async function resolveAudio(track){
    for(const bitrate of ['320','192','128']){
      try{const data=await requestJson(`${API}?types=url&id=${encodeURIComponent(track.id)}&source=${encodeURIComponent(track.source)}&br=${bitrate}&v=${Date.now().toString(36)}`,12000);const url=data?.url||'';if(url)return String(url).replace(/^http:/,'https:')}catch(error){console.warn('url failed',track.name,bitrate,error)}
    }
    return '';
  }

  async function playAt(index,{autoplayAttempt=false}={}){
    if(!state.queue.length||state.starting)return;
    state.starting=true;
    try{
      let attempts=0;
      while(attempts<Math.min(8,state.queue.length)){
        state.index=(index+state.queue.length)%state.queue.length;
        const track=state.queue[state.index];
        if(state.failed.has(key(track))){index+=1;attempts+=1;continue}
        state.current=track;updateNow();
        const url=await resolveAudio(track);
        if(!url){state.failed.add(key(track));index+=1;attempts+=1;continue}
        dom.audio.src=url;dom.audio.load();
        try{
          await dom.audio.play();dom.soundUnlock.hidden=true;loadLyrics(track);setMediaSession(track);return;
        }catch(error){
          if(error?.name==='NotAllowedError'||/user.*gesture|play\(\) failed/i.test(error?.message||'')){
            dom.soundUnlock.hidden=false;loadLyrics(track);setMediaSession(track);return;
          }
          state.failed.add(key(track));index+=1;attempts+=1;
        }
      }
      toast('目前歌源無法播放這批歌曲，請稍後再試。');
    }finally{state.starting=false}
  }

  async function startWorld(id){
    const world=worlds.find(item=>item.id===id)||albums.find(item=>item.id===id);if(!world)return;
    toast(`正在進入「${world.title}」`);
    const tracks=world.id==='forever'?state.universe:await buildWorld(world);
    if(!tracks.length)return toast('這個世界暫時沒有可用歌曲。');
    state.world=world;state.queue=state.shuffle?shuffleCopy(tracks):[...tracks];state.index=0;updateQueue();await playAt(0);
  }

  function nextTrack(){
    if(!state.queue.length)return;
    const next=state.shuffle?Math.floor(Math.random()*state.queue.length):state.index+1;playAt(next);
  }
  function prevTrack(){if(state.queue.length)playAt(state.index-1)}
  async function togglePlay(){
    if(!state.current){await startWorld('forever');return}
    if(dom.audio.paused){try{await dom.audio.play();dom.soundUnlock.hidden=true}catch{dom.soundUnlock.hidden=false}}else dom.audio.pause();
  }

  function updateNow(){
    const track=state.current,world=state.world||worlds[0],cover=songCover(track);
    [dom.nowCover,dom.miniCover,dom.fullCover].forEach(img=>{img.src=cover;img.onerror=()=>{img.onerror=null;img.src=FALLBACK_COVER}});
    dom.playerBackdrop.style.backgroundImage=`url("${cover}")`;
    dom.nowWorld.textContent=dom.fullWorld.textContent=world.title||'Maydayland';
    dom.nowTitle.textContent=dom.miniTitle.textContent=dom.fullTitle.textContent=track?.name||'尚未播放';
    dom.nowArtist.textContent=dom.miniArtist.textContent=dom.fullArtist.textContent=track?.artist||'五月天';
    renderQueue();
  }

  function updatePlaying(playing){
    dom.nowPanel.classList.toggle('is-playing',playing);dom.play.textContent=dom.fullPlay.textContent=playing?'Ⅱ':'▶';
  }

  function updateQueue(){
    dom.queueCount.textContent=state.queue.length>99?'99+':state.queue.length;renderQueue();
  }

  function renderQueue(){
    dom.queueList.innerHTML=state.queue.length?state.queue.map((track,index)=>`<div class="queue-row${index===state.index?' is-current':''}" data-queue-index="${index}"><img src="${esc(songCover(track,180))}" alt=""><span><b>${esc(track.name)}</b><small>${esc(track.artist)} · ${esc(track.album||'Maydayland')}</small></span><button>${index===state.index?'♪':'▶'}</button></div>`).join(''):'<p>歌單仍在整理中。</p>';
  }

  function parseLrc(raw){
    const timed=[];const plain=[];
    String(raw||'').split(/\r?\n/).forEach(line=>{
      const text=line.replace(/\[[^\]]+\]/g,'').trim();
      const stamps=[...line.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];
      if(stamps.length&&text)stamps.forEach(match=>timed.push({time:Number(match[1])*60+Number(match[2]),text}));
      else if(text&&!/^\[(ar|al|ti|by|offset):/i.test(line))plain.push(text);
    });
    timed.sort((a,b)=>a.time-b.time);return {timed,plain};
  }

  function extractLyrics(data){
    if(typeof data==='string')return {main:data,translation:''};
    if(!data||typeof data!=='object')return {main:'',translation:''};
    const main=data.lyric||data.lrc?.lyric||data.lrc||data.text||'';
    const translation=data.tlyric?.lyric||data.tlyric||data.translation||data.trans||'';
    return {main:typeof main==='string'?main:'',translation:typeof translation==='string'?translation:''};
  }

  async function loadLyrics(track){
    state.lyricLines=[];state.activeLyric=-1;dom.lyrics.innerHTML='<p>正在尋找歌詞…</p>';
    try{
      const data=await requestJson(`${API}?types=lyric&id=${encodeURIComponent(track.id)}&source=${encodeURIComponent(track.source)}&v=6`,12000);
      const {main,translation}=extractLyrics(data);const mainParsed=parseLrc(main);const transParsed=parseLrc(translation);
      if(mainParsed.timed.length){
        const transMap=new Map(transParsed.timed.map(line=>[Math.round(line.time*10),line.text]));
        state.lyricLines=mainParsed.timed.map(line=>({time:line.time,text:line.text,translation:transMap.get(Math.round(line.time*10))||''}));
        dom.lyrics.innerHTML=state.lyricLines.map((line,index)=>`<div class="lyric-line" data-lyric-index="${index}">${esc(line.text)}${line.translation?`<small>${esc(line.translation)}</small>`:''}</div>`).join('');
      }else if(mainParsed.plain.length){
        dom.lyrics.innerHTML=mainParsed.plain.map(line=>`<div class="lyric-line">${esc(line)}</div>`).join('');
      }else dom.lyrics.innerHTML='<p>這首歌目前沒有可用歌詞。</p>';
    }catch(error){console.warn('lyrics failed',error);dom.lyrics.innerHTML='<p>歌詞服務暫時沒有回應。</p>'}
  }

  function syncLyrics(time){
    if(!state.lyricLines.length)return;
    let index=0;for(let i=0;i<state.lyricLines.length;i++){if(state.lyricLines[i].time<=time)index=i;else break}
    if(index===state.activeLyric)return;state.activeLyric=index;
    dom.lyrics.querySelectorAll('.lyric-line').forEach((line,i)=>line.classList.toggle('is-active',i===index));
    dom.lyrics.querySelector(`[data-lyric-index="${index}"]`)?.scrollIntoView({block:'center',behavior:'smooth'});
  }

  function setMediaSession(track){
    if(!('mediaSession'in navigator))return;
    try{
      navigator.mediaSession.metadata=new MediaMetadata({title:track.name,artist:track.artist,album:track.album||'Maydayland',artwork:[{src:songCover(track,700),sizes:'700x700'}]});
      navigator.mediaSession.setActionHandler('play',()=>dom.audio.play());navigator.mediaSession.setActionHandler('pause',()=>dom.audio.pause());navigator.mediaSession.setActionHandler('nexttrack',nextTrack);navigator.mediaSession.setActionHandler('previoustrack',prevTrack);
    }catch(error){console.warn(error)}
  }

  async function runSearch(value){
    const query=value.trim();if(!query)return;
    dom.searchResults.innerHTML='<p>正在穿越歌庫…</p>';
    const rows=await searchQuery(`五月天 ${query}`,50);state.searchRows=rows;
    dom.searchResults.innerHTML=rows.length?rows.map((track,index)=>`<div class="result-row" data-result-index="${index}"><img src="${esc(songCover(track,180))}" alt=""><span><b>${esc(track.name)}</b><small>${esc(track.artist)} · ${esc(track.album)}</small></span><button>▶</button></div>`).join(''):'<p>沒有找到相符的五月天曲目。</p>';
  }

  function openModal(modal){modal.classList.add('is-open');modal.setAttribute('aria-hidden','false')}
  function closeModals(){[dom.searchModal,dom.aboutModal].forEach(modal=>{modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true')})}
  function openPlayer(){dom.playerSheet.classList.add('is-open');dom.playerSheet.setAttribute('aria-hidden','false')}
  function closePlayer(){dom.playerSheet.classList.remove('is-open');dom.playerSheet.setAttribute('aria-hidden','true')}
  function toggleQueue(open){dom.queueSheet.classList.toggle('is-open',open);dom.queueSheet.setAttribute('aria-hidden',String(!open))}

  function installBubuCursor(){
    if(!matchMedia('(pointer:fine)').matches)return;
    const cursor=document.createElement('div');cursor.className='bubu-cursor is-hidden';cursor.setAttribute('aria-hidden','true');document.body.appendChild(cursor);
    let x=-80,y=-80,tx=-80,ty=-80;
    const draw=()=>{x+=(tx-x)*.24;y+=(ty-y)*.24;cursor.style.transform=`translate3d(${x-16}px,${y-13}px,0) rotate(-6deg)`;requestAnimationFrame(draw)};
    addEventListener('mousemove',event=>{tx=event.clientX;ty=event.clientY;cursor.classList.remove('is-hidden')},{passive:true});
    addEventListener('mouseleave',()=>cursor.classList.add('is-hidden'));addEventListener('mousedown',()=>cursor.classList.add('is-pressed'));addEventListener('mouseup',()=>cursor.classList.remove('is-pressed'));
    document.addEventListener('mouseover',event=>cursor.classList.toggle('is-active',Boolean(event.target.closest('button,a,input,[data-play-world],[data-play-album]'))));draw();
  }

  function bind(){
    dom.universeButton.addEventListener('click',()=>startWorld('forever'));
    document.addEventListener('click',event=>{
      const world=event.target.closest('[data-play-world]');if(world)startWorld(world.dataset.playWorld);
      const album=event.target.closest('[data-play-album]');if(album)startWorld(album.dataset.playAlbum);
      const scroll=event.target.closest('[data-scroll]');if(scroll){document.querySelectorAll('[data-scroll]').forEach(button=>button.classList.toggle('is-active',button===scroll));$(scroll.dataset.scroll)?.scrollIntoView({behavior:'smooth'})}
      const group=event.target.closest('[data-play-group]');if(group){
        const collection=group.dataset.playGroup==='album'?albums:worlds.filter(item=>item.group==='concert');
        Promise.all(collection.map(buildWorld)).then(groups=>{state.queue=state.shuffle?shuffleCopy(dedupe(groups.flat())):dedupe(groups.flat());state.world={title:group.dataset.playGroup==='album'?'九張創作專輯':'演唱會世界'};state.index=0;updateQueue();playAt(0)});
      }
    });

    dom.play.addEventListener('click',togglePlay);dom.fullPlay.addEventListener('click',togglePlay);dom.prev.addEventListener('click',prevTrack);dom.fullPrev.addEventListener('click',prevTrack);dom.next.addEventListener('click',nextTrack);dom.fullNext.addEventListener('click',nextTrack);
    const toggleShuffle=()=>{state.shuffle=!state.shuffle;dom.shuffle.classList.toggle('is-active',state.shuffle);dom.fullShuffle.classList.toggle('is-active',state.shuffle);toast(state.shuffle?'已開啟隨機播放':'已改為順序播放')};
    dom.shuffle.addEventListener('click',toggleShuffle);dom.fullShuffle.addEventListener('click',toggleShuffle);dom.fullRepeat.addEventListener('click',()=>{state.repeat=!state.repeat;dom.fullRepeat.classList.toggle('is-active',state.repeat);toast(state.repeat?'單曲循環':'關閉單曲循環')});
    dom.miniTrack.addEventListener('click',openPlayer);dom.openPlayer.addEventListener('click',openPlayer);dom.closePlayer.addEventListener('click',closePlayer);
    dom.searchButton.addEventListener('click',()=>openModal(dom.searchModal));dom.aboutButton.addEventListener('click',()=>openModal(dom.aboutModal));document.querySelectorAll('[data-close-modal]').forEach(button=>button.addEventListener('click',closeModals));
    [dom.searchModal,dom.aboutModal].forEach(modal=>modal.addEventListener('click',event=>{if(event.target===modal)closeModals()}));
    dom.searchForm.addEventListener('submit',event=>{event.preventDefault();runSearch(dom.searchInput.value)});
    dom.searchResults.addEventListener('click',event=>{const row=event.target.closest('[data-result-index]');if(!row)return;state.queue=state.searchRows;state.world={title:`搜尋：${dom.searchInput.value}`};state.index=Number(row.dataset.resultIndex);updateQueue();playAt(state.index);closeModals()});
    dom.queueButton.addEventListener('click',()=>toggleQueue(true));dom.closeQueue.addEventListener('click',()=>toggleQueue(false));dom.queueList.addEventListener('click',event=>{const row=event.target.closest('[data-queue-index]');if(row){playAt(Number(row.dataset.queueIndex));toggleQueue(false)}});
    dom.soundUnlock.addEventListener('click',async()=>{try{await dom.audio.play();dom.soundUnlock.hidden=true}catch{toast('瀏覽器仍未允許播放，請再點一次播放器。')}});

    dom.audio.addEventListener('play',()=>updatePlaying(true));dom.audio.addEventListener('pause',()=>updatePlaying(false));dom.audio.addEventListener('ended',()=>state.repeat?(dom.audio.currentTime=0,dom.audio.play()):nextTrack());
    dom.audio.addEventListener('timeupdate',()=>{const duration=dom.audio.duration||0,current=dom.audio.currentTime||0,ratio=duration?current/duration:0;dom.miniProgress.style.width=`${ratio*100}%`;dom.progressInput.value=Math.round(ratio*1000);dom.currentTime.textContent=formatTime(current);dom.durationTime.textContent=formatTime(duration);syncLyrics(current)});
    dom.audio.addEventListener('error',()=>{if(state.current)state.failed.add(key(state.current));toast('這首歌曲暫時無法播放，已切換下一首。');setTimeout(nextTrack,600)});
    dom.progressInput.addEventListener('input',()=>{if(Number.isFinite(dom.audio.duration))dom.audio.currentTime=Number(dom.progressInput.value)/1000*dom.audio.duration});
    document.addEventListener('keydown',event=>{if(/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;if(event.code==='Space'){event.preventDefault();togglePlay()}if(event.code==='ArrowRight')dom.audio.currentTime+=10;if(event.code==='ArrowLeft')dom.audio.currentTime=Math.max(0,dom.audio.currentTime-10);if(event.code==='Escape'){closePlayer();closeModals();toggleQueue(false)}});
  }

  async function init(){
    render();bind();installBubuCursor();dom.nowCover.src=dom.miniCover.src=dom.fullCover.src=FALLBACK_COVER;
    try{await loadUniverse()}catch(error){console.error(error);dom.nowTitle.textContent='歌源暫時無法連線';dom.miniArtist.textContent='稍後可再試';toast('歌源連線失敗，頁面內容仍可正常瀏覽。')}
  }

  init();
})();
