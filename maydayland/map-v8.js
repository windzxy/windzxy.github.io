(() => {
  'use strict';
  const D = window.MAYDAYLAND_ARCHIVE;
  const API = 'https://music-api.gdstudio.xyz/api.php';
  const $ = id => document.getElementById(id);
  const state = {tour:D.tours[D.tours.length-1], map:null, layers:[], tracks:[], index:-1, current:null, lyric:[], lyricIndex:-1, repeat:false, shuffle:true, toastTimer:0};
  const dom = {
    tourList:$('tourList'), map:$('map'), detail:$('detail'), archive:$('archive'), archiveTitle:$('archiveTitle'), archiveBody:$('archiveBody'),
    audio:$('audio'), miniCover:$('miniCover'), miniTitle:$('miniTitle'), miniArtist:$('miniArtist'), miniWorld:$('miniWorld'), play:$('playButton'), prev:$('prevButton'), next:$('nextButton'), progress:$('miniProgress'),
    playerSheet:$('playerSheet'), fullCover:$('fullCover'), fullTitle:$('fullTitle'), fullArtist:$('fullArtist'), fullWorld:$('fullWorld'), fullPlay:$('fullPlay'), range:$('progressInput'), currentTime:$('currentTime'), durationTime:$('durationTime'), lyrics:$('lyrics'),
    unlock:$('soundUnlock'), toast:$('toast'), mobileToggle:$('mobileTourToggle')
  };
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=s=>Number.isFinite(s)?`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`:'0:00';
  function toast(msg){clearTimeout(state.toastTimer);dom.toast.textContent=msg;dom.toast.classList.add('show');state.toastTimer=setTimeout(()=>dom.toast.classList.remove('show'),2400)}
  function initMap(){
    state.map=L.map(dom.map,{zoomControl:true,worldCopyJump:true,minZoom:2,maxZoom:10}).setView([23,112],3);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{subdomains:'abcd',maxZoom:20,attribution:'&copy; OpenStreetMap &copy; CARTO'}).addTo(state.map);
    renderTourList();selectTour(state.tour.id);
  }
  function renderTourList(){dom.tourList.innerHTML=D.tours.map(t=>`<button class="tour-item${t.id===state.tour.id?' active':''}" style="--tour:${t.color}" data-tour="${t.id}"><i class="tour-dot"></i><span><b>${esc(t.name)}</b><small>${esc(t.english)}</small></span><em>${esc(t.years)}</em></button>`).join('')}
  function clearLayers(){state.layers.forEach(l=>state.map.removeLayer(l));state.layers=[]}
  function markerIcon(tour,n,current=false){return L.divIcon({className:'',html:`<span class="city-marker${current?' current':''}" style="--tour:${tour.color}">${n}</span>`,iconSize:[current?38:30,current?38:30],iconAnchor:[current?19:15,current?19:15]})}
  function selectTour(id){
    const tour=D.tours.find(t=>t.id===id);if(!tour)return;state.tour=tour;renderTourList();clearLayers();
    const points=tour.stops.map(s=>[s.lat,s.lng]);
    if(points.length>1){const line=L.polyline(points,{color:tour.color,weight:3,opacity:.82,dashArray:'8 9'}).addTo(state.map);state.layers.push(line)}
    tour.stops.forEach((s,i)=>{const m=L.marker([s.lat,s.lng],{icon:markerIcon(tour,i+1,i===0)}).addTo(state.map).bindTooltip(`${i+1}. ${s.city}`,{direction:'top',className:'city-tip'});m.on('click',()=>openStop(tour,s,i));state.layers.push(m)});
    if(points.length===1)state.map.setView(points[0],7,{animate:true});else state.map.fitBounds(L.latLngBounds(points),{padding:[60,60],maxZoom:5,animate:true});
    openTour(tour);document.querySelector('.sidebar')?.classList.remove('open');
  }
  function openTour(tour){
    dom.detail.classList.add('open');
    dom.detail.innerHTML=`<article class="detail-card" style="--tour:${tour.color}"><div class="detail-hero"><img src="${esc(tour.image)}" alt="${esc(tour.name)}" referrerpolicy="no-referrer"></div><div class="detail-body"><div class="detail-meta"><span>${esc(tour.years)}</span><span>TOUR ROUTE</span></div><h2>${esc(tour.name)}</h2><h3>${esc(tour.english)}</h3><p>${esc(tour.summary)}</p><div class="stats"><div class="stat"><b>${tour.stops.length}</b><small>已核实路线节点</small></div><div class="stat"><b>${new Set(tour.stops.map(s=>s.city)).size}</b><small>地图城市／场馆</small></div></div><div class="source-links"><a href="${tour.source}" target="_blank" rel="noopener">官方资料来源</a>${tour.secondary?`<a href="${tour.secondary}" target="_blank" rel="noopener">补充官方页</a>`:''}<button class="source-play" data-play-tour="${tour.id}">播放巡演歌单</button></div><div class="stops">${tour.stops.map((s,i)=>stopRow(tour,s,i)).join('')}</div></div></article>`;
  }
  function stopRow(t,s,i){return `<button class="stop-row" data-stop="${i}" style="--tour:${t.color};width:100%;border-left:0;border-right:0;border-top:0;background:transparent;color:inherit;text-align:left"><span class="stop-no">${i+1}</span><span><b>${esc(s.city)}</b><small>${esc([s.date,s.venue,s.phase].filter(Boolean).join(' · ')||'官方城市档案未列逐场日期')}</small></span></button>`}
  function openStop(tour,s,i){openTour(tour);const row=dom.detail.querySelector(`[data-stop="${i}"]`);row?.scrollIntoView({block:'center',behavior:'smooth'});state.map.flyTo([s.lat,s.lng],Math.max(state.map.getZoom(),5),{duration:.8})}
  async function getAlbumArt(album){
    try{const r=await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`五月天 ${album.title}`)}&entity=album&country=TW&limit=20`);const j=await r.json();const hit=(j.results||[]).find(x=>/五月天|Mayday/i.test(x.artistName||'')&&(x.collectionName||'').includes(album.title))||(j.results||[]).find(x=>/五月天|Mayday/i.test(x.artistName||''));return hit?.artworkUrl100?.replace('100x100bb','1200x1200bb')||album.image}catch{return album.image}
  }
  async function getAlbumTracks(album){
    try{const r=await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`五月天 ${album.title}`)}&entity=album&country=TW&limit=20`);const j=await r.json();const hit=(j.results||[]).find(x=>/五月天|Mayday/i.test(x.artistName||'')&&(x.collectionName||'').includes(album.title))||(j.results||[])[0];if(!hit?.collectionId)return[];const lr=await fetch(`https://itunes.apple.com/lookup?id=${hit.collectionId}&entity=song&country=TW`);const lj=await lr.json();return (lj.results||[]).filter(x=>x.wrapperType==='track').map(x=>x.trackName)}catch{return[]}
  }
  async function openArchive(type){
    dom.archive.classList.add('open');
    const titles={albums:'专辑与完整曲目',songs:'全曲库搜索与播放',books:'书籍与出版品',timeline:'五月天历程档案'};dom.archiveTitle.textContent=titles[type]||'档案馆';
    if(type==='albums'){
      dom.archiveBody.className='archive-grid';dom.archiveBody.innerHTML=D.albums.map((a,i)=>`<article class="archive-card" data-album-index="${i}"><div class="art"><img src="${a.image}" alt="${esc(a.title)}"></div><div class="copy"><small>${a.date}</small><h3>${esc(a.title)}</h3><p>${esc(a.english)}</p><button data-load-album="${i}">查看完整曲目</button></div></article>`).join('');
      D.albums.forEach(async(a,i)=>{const art=await getAlbumArt(a);const img=dom.archiveBody.querySelector(`[data-album-index="${i}"] img`);if(img)img.src=art});
    }else if(type==='books'){
      dom.archiveBody.className='archive-grid';dom.archiveBody.innerHTML=D.books.map(b=>`<article class="archive-card"><div class="copy"><small>${esc(b.year)} · ${esc(b.publisher)}</small><h3>${esc(b.title)}</h3><p>${esc(b.author)}</p><p>${esc(b.note)}</p><a href="${b.url}" target="_blank" rel="noopener">资料页</a></div></article>`).join('');
    }else if(type==='timeline'){
      dom.archiveBody.className='timeline';dom.archiveBody.innerHTML=D.timeline.map(([y,t,p])=>`<div class="time-row"><time>${y}</time><i></i><div><h3>${esc(t)}</h3><p>${esc(p)}</p></div></div>`).join('');
    }else{
      dom.archiveBody.className='timeline';dom.archiveBody.innerHTML=`<form id="songSearch" style="display:flex;gap:8px"><input id="songQuery" placeholder="搜索五月天歌曲、专辑或现场版本" style="flex:1;min-height:46px;border:1px solid #2b4050;border-radius:14px;background:#0b1722;color:#fff;padding:0 14px"><button class="ghost-btn">搜索</button></form><div id="songResults"></div>`;
    }
  }
  async function loadAlbum(index){const a=D.albums[index];const card=dom.archiveBody.querySelector(`[data-album-index="${index}"] .copy`);card.insertAdjacentHTML('beforeend','<p class="loading">正在核对 Apple Music 曲目…</p>');const tracks=await getAlbumTracks(a);card.querySelector('.loading')?.remove();card.insertAdjacentHTML('beforeend',tracks.length?`<ol>${tracks.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`:'<p>目前无法取得曲目；可使用歌曲搜索。</p>')}
  async function apiJson(url,timeout=12000){const c=new AbortController(),t=setTimeout(()=>c.abort(),timeout);try{const r=await fetch(url,{signal:c.signal,cache:'no-store'});if(!r.ok)throw Error(r.status);return await r.json()}finally{clearTimeout(t)}}
  function normalize(x,source){return{id:String(x.id||''),name:String(x.name||x.title||''),artist:Array.isArray(x.artist)?x.artist.join(' / '):String(x.artist||'五月天'),album:String(x.album||''),pic:x.pic_id||'',source:x.source||source}}
  async function searchSongs(q,count=80){let all=[];for(const source of ['netease','kuwo','qq','migu']){try{const d=await apiJson(`${API}?types=search&source=${source}&name=${encodeURIComponent(q)}&count=${count}&pages=1`);if(Array.isArray(d))all.push(...d.map(x=>normalize(x,source)).filter(x=>x.id&&/五月天|Mayday/i.test(`${x.artist} ${x.album} ${x.name}`)))}catch(e){console.warn(e)}if(all.length>=count)break}const m=new Map;all.forEach(x=>m.set(`${x.source}:${x.id}`,x));return[...m.values()]}
  function cover(t,size=700){return t?.pic?`${API}?types=pic&id=${encodeURIComponent(t.pic)}&source=${t.source}&size=${size}`:'https://www.mayday.jp/wp-content/uploads/5b5c7eed8c21d28d399c608497ab94561-500x500.jpg'}
  async function resolveUrl(t){for(const br of [320,192,128]){try{const d=await apiJson(`${API}?types=url&id=${encodeURIComponent(t.id)}&source=${t.source}&br=${br}`);if(d?.url)return String(d.url).replace(/^http:/,'https:')}catch{}}return''}
  async function startRadio(query='五月天'){toast('正在建立五月天随机歌单');const rows=await searchSongs(query,100);if(!rows.length)return toast('歌源暂时没有回应');state.tracks=rows.sort(()=>Math.random()-.5);state.index=0;await playAt(0,true)}
  async function playAt(index,autoplay=false){if(!state.tracks.length)return;state.index=(index+state.tracks.length)%state.tracks.length;const t=state.tracks[state.index];state.current=t;updateTrack();const url=await resolveUrl(t);if(!url){state.index++;return playAt(state.index,autoplay)}dom.audio.src=url;dom.audio.load();loadLyrics(t);try{await dom.audio.play();dom.unlock.hidden=true}catch(e){if(e?.name==='NotAllowedError')dom.unlock.hidden=false;else{state.index++;playAt(state.index)}}}
  function updateTrack(){const t=state.current,art=cover(t);[dom.miniCover,dom.fullCover].forEach(img=>img.src=art);dom.miniTitle.textContent=dom.fullTitle.textContent=t?.name||'正在建立歌单';dom.miniArtist.textContent=dom.fullArtist.textContent=t?.artist||'五月天';dom.miniWorld.textContent=dom.fullWorld.textContent=state.tour?.name||'MAYDAYLAND RADIO'}
  async function loadLyrics(t){dom.lyrics.innerHTML='<p>正在载入歌词…</p>';state.lyric=[];try{const d=await apiJson(`${API}?types=lyric&id=${encodeURIComponent(t.id)}&source=${t.source}`);const raw=typeof d==='string'?d:(d?.lyric||d?.lrc?.lyric||d?.lrc||'');const lines=[];String(raw).split(/\r?\n/).forEach(line=>{const text=line.replace(/\[[^\]]+\]/g,'').trim();for(const m of line.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g))if(text)lines.push({time:+m[1]*60+ +m[2],text})});lines.sort((a,b)=>a.time-b.time);state.lyric=lines;dom.lyrics.innerHTML=lines.length?lines.map((l,i)=>`<div class="lyric-line" data-lyric="${i}">${esc(l.text)}</div>`).join(''):'<p>目前没有可用的时间轴歌词。</p>'}catch{dom.lyrics.innerHTML='<p>歌词服务暂时没有回应。</p>'}}
  function syncLyric(t){if(!state.lyric.length)return;let i=0;for(let n=0;n<state.lyric.length;n++){if(state.lyric[n].time<=t)i=n;else break}if(i===state.lyricIndex)return;state.lyricIndex=i;dom.lyrics.querySelectorAll('.lyric-line').forEach((x,n)=>x.classList.toggle('active',n===i));dom.lyrics.querySelector(`[data-lyric="${i}"]`)?.scrollIntoView({block:'center',behavior:'smooth'})}
  function bind(){
    dom.tourList.addEventListener('click',e=>{const b=e.target.closest('[data-tour]');if(b)selectTour(b.dataset.tour)});
    dom.detail.addEventListener('click',e=>{const s=e.target.closest('[data-stop]');if(s)openStop(state.tour,state.tour.stops[+s.dataset.stop],+s.dataset.stop);if(e.target.closest('[data-play-tour]'))startRadio(`五月天 ${state.tour.name} Live`)});
    document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b));const v=b.dataset.view;if(v==='map')dom.archive.classList.remove('open');else openArchive(v)}));
    $('archiveClose').onclick=()=>dom.archive.classList.remove('open');$('randomButton').onclick=()=>{const t=D.tours[Math.floor(Math.random()*D.tours.length)];selectTour(t.id)};$('aboutButton').onclick=()=>openArchive('timeline');
    dom.archive.addEventListener('click',e=>{const b=e.target.closest('[data-load-album]');if(b)loadAlbum(+b.dataset.loadAlbum)});
    dom.archive.addEventListener('submit',async e=>{if(e.target.id!=='songSearch')return;e.preventDefault();const q=$('songQuery').value.trim();const box=$('songResults');box.innerHTML='<p>正在搜索…</p>';const rows=await searchSongs(`五月天 ${q}`,60);box.innerHTML=rows.map((t,i)=>`<button class="stop-row" data-song="${i}" style="width:100%;border:0;border-bottom:1px solid #263947;background:transparent;color:#fff;text-align:left"><span class="stop-no">▶</span><span><b>${esc(t.name)}</b><small>${esc(t.artist)} · ${esc(t.album)}</small></span></button>`).join('');box.onclick=ev=>{const r=ev.target.closest('[data-song]');if(r){state.tracks=rows;playAt(+r.dataset.song)}}});
    dom.play.onclick=dom.fullPlay.onclick=()=>dom.audio.paused?(state.current?dom.audio.play().catch(()=>dom.unlock.hidden=false):startRadio()):dom.audio.pause();dom.prev.onclick=()=>playAt(state.index-1);dom.next.onclick=()=>playAt(state.index+1);dom.unlock.onclick=()=>dom.audio.play().then(()=>dom.unlock.hidden=true);
    $('openPlayer').onclick=()=>dom.playerSheet.classList.add('open');$('playerClose').onclick=()=>dom.playerSheet.classList.remove('open');dom.mobileToggle.onclick=()=>document.querySelector('.sidebar').classList.toggle('open');
    dom.audio.addEventListener('play',()=>{dom.play.textContent=dom.fullPlay.textContent='Ⅱ'});dom.audio.addEventListener('pause',()=>{dom.play.textContent=dom.fullPlay.textContent='▶'});dom.audio.addEventListener('ended',()=>playAt(state.shuffle?Math.floor(Math.random()*state.tracks.length):state.index+1));dom.audio.addEventListener('timeupdate',()=>{const d=dom.audio.duration||0,c=dom.audio.currentTime||0;const p=d?c/d:0;dom.progress.style.width=`${p*100}%`;dom.range.value=Math.round(p*1000);dom.currentTime.textContent=fmt(c);dom.durationTime.textContent=fmt(d);syncLyric(c)});dom.range.oninput=()=>{if(dom.audio.duration)dom.audio.currentTime=+dom.range.value/1000*dom.audio.duration};
  }
  function init(){initMap();bind();setTimeout(()=>startRadio(),500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();