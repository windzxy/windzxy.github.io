(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const html = (s='') => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  const tours = [
    { id:'back', name:'回到那一天 巡迴演唱會', year:'2023–2026', color:'#47e7ff', years:['2026 台北・台中','2025 台北・貴陽・台中','2024 高雄・香港・北京・深圳・太原・武漢・成都・上海','2023 台中'], desc:'主線巡演，已拆成年份與城市路線。'},
    { id:'life', name:'人生海海巡迴演唱會', year:'2001–2002', color:'#ff6fab', years:['台北','台中','高雄','香港'], desc:'早期大型巡迴，放入時光線索。'},
    { id:'dna', name:'DNA 創造巡迴演唱會', year:'2009–2010', color:'#ffd66b', years:['台北','上海','北京','新加坡','香港'], desc:'舞台視覺與世界巡演意識開始成形。'},
    { id:'just', name:'Just Rock It! 系列', year:'2011–2020', color:'#9a7cff', years:['亞洲','北美','歐洲','大洋洲'], desc:'長線巡演資料入口，後續逐站補圖補來源。'}
  ];

  const stops = [
    {id:'taipei',no:1,city:'台北',lon:121.5654,lat:25.0330,cls:'photo-taipei',venue:'台北小巨蛋',addr:'台北市松山區南京東路四段2號',dates:'2026.07.03 / 07.04 / 07.05 / 08.10 / 08.11 / 08.12',status:'規劃中',tag:'台灣',year:'2026',caption:'走回那一天，從熟悉的台北重新出發。地圖、彈窗與右側照片詳情會同步更新。'},
    {id:'kaohsiung',no:2,city:'高雄',lon:120.3014,lat:22.6273,cls:'photo-kaohsiung',venue:'高雄世運主場館',addr:'高雄市左營區世運大道100號',dates:'2024.03.23 / 03.24 / 03.29 / 03.30 / 03.31',status:'已完成',tag:'台灣',year:'2024',caption:'戶外主場館與港都夜色，是回到那一天路線中最開闊的一站。'},
    {id:'hongkong',no:3,city:'香港',lon:114.1694,lat:22.3193,cls:'photo-hongkong',venue:'中環海濱活動空間',addr:'香港中環龍和道',dates:'2024.04.30 – 2024.05.09',status:'已完成',tag:'香港',year:'2024',caption:'海港天際線與戶外舞台形成強烈的城市記憶。'},
    {id:'beijing',no:4,city:'北京',lon:116.4074,lat:39.9042,cls:'photo-beijing',venue:'國家體育場 鳥巢',addr:'北京市朝陽區國家體育場南路1號',dates:'2024.05.18 / 05.19 / 05.25 / 05.26',status:'已完成',tag:'中國大陸',year:'2024',caption:'鳥巢具備巨大儀式感，右側詳情突出舞台尺度與城市記憶。'},
    {id:'shenzhen',no:5,city:'深圳',lon:114.0579,lat:22.5431,cls:'photo-shenzhen',venue:'深圳大運中心體育場',addr:'深圳市龍崗區青春路',dates:'2024.06.01 / 06.02',status:'已完成',tag:'中國大陸',year:'2024',caption:'現代城市線條、燈光與速度感，對應更銳利的霓虹節點。'},
    {id:'taiyuan',no:6,city:'太原',lon:112.5489,lat:37.8706,cls:'photo-taiyuan',venue:'山西體育中心體育場',addr:'太原市晉源區健康南街',dates:'2024.07.06 / 07.07',status:'已完成',tag:'中國大陸',year:'2024',caption:'以暖色照片卡呈現中原城市的厚重感，和冷色行政地圖形成對比。'},
    {id:'wuhan',no:7,city:'武漢',lon:114.3055,lat:30.5928,cls:'photo-wuhan',venue:'武漢體育中心體育場',addr:'武漢市蔡甸區車城北路',dates:'2024.09.14 / 09.15',status:'已完成',tag:'中國大陸',year:'2024',caption:'江城意象被放入地標相簿，不再只是文字資料。'},
    {id:'chengdu',no:8,city:'成都',lon:104.0665,lat:30.5728,cls:'photo-chengdu',venue:'東安湖體育公園主體育場',addr:'成都市龍泉驛區',dates:'2024.10.05 / 10.06',status:'已完成',tag:'中國大陸',year:'2024',caption:'用綠色與暖光保留成都的鬆弛感，讓路線不只是一條線。'},
    {id:'shanghai',no:9,city:'上海',lon:121.4737,lat:31.2304,cls:'photo-shanghai',venue:'上海體育場',addr:'上海市徐匯區天鑰橋路666號',dates:'2024.11.12 – 2024.11.24',status:'已完成',tag:'中國大陸',year:'2024',caption:'上海站以高密度城市夜景呈現，和播放器與歌單宇宙形成連動。'},
    {id:'taichung',no:10,city:'台中',lon:120.6736,lat:24.1477,cls:'photo-taichung',venue:'洲際棒球場',addr:'台中市北屯區崇德路三段835號',dates:'2023.12.31 / 2025.01.01 / 2026.01.01',status:'進行中',tag:'台灣',year:'2023–2026',caption:'跨年與回憶感最強的一站，作為路線播放的重要節點。'},
    {id:'guiyang',no:11,city:'貴陽',lon:106.6302,lat:26.6470,cls:'photo-guizhou',venue:'貴陽站場館資料整理中',addr:'貴州省貴陽市',dates:'2025 巡演年度資料整理中',status:'資料補齊中',tag:'中國大陸',year:'2025',caption:'新增 2025 年度節點，避免把回到那一天粗略合併成一條線。'}
  ];

  const albums = [
    ['第一張創作專輯','1999','1990 - 1999','青春起點','linear-gradient(135deg,#1e4f6f,#f3d67c,#b64c78)',['志明與春嬌','愛情的模樣','軋車','生活']],
    ['愛情萬歲','2000','2000 - 2009','狂熱青春','linear-gradient(135deg,#355c7d,#6c5b7b,#c06c84)',['終結孤單','溫柔','愛情萬歲','反而']],
    ['人生海海','2001','2000 - 2009','世界變大','linear-gradient(135deg,#20435b,#f0b55b,#95363c)',['人生海海','候鳥','好不好','相信']],
    ['時光機','2003','2000 - 2009','時間感','linear-gradient(135deg,#253a5c,#88d4f2,#f7d08a)',['輕功','恆星的恆心','而我知道','賭神']],
    ['神的孩子都在跳舞','2004','2000 - 2009','樂團能量','linear-gradient(135deg,#33264f,#e35d8f,#ffcf71)',['孫悟空','倔強','垃圾車','晚安 地球人']],
    ['知足 最真傑作選','2005','2000 - 2009','珍藏精選','linear-gradient(135deg,#1b3b52,#e8d6a8,#d05c7b)',['知足','志明與春嬌','溫柔','倔強']],
    ['為愛而生','2006','2000 - 2009','情感擴張','linear-gradient(135deg,#283a55,#f4d06f,#57b8a6)',['天使','我又初戀了','香水','為愛而生']],
    ['後青春期的詩','2008','2000 - 2009','長大以後','linear-gradient(135deg,#243949,#517fa4,#f0c27b)',['突然好想你','你不是真正的快樂','生存以上 生活以下','笑忘歌']],
    ['第二人生','2011','2010 - 2019','世界末日','linear-gradient(135deg,#191d2e,#4d7cff,#f6d365)',['諾亞方舟','我不願讓你一個人','星空','第二人生']],
    ['自傳','2016','2010 - 2019','人生回望','linear-gradient(135deg,#0f2027,#2c5364,#f7971e)',['派對動物','後來的我們','成名在望','頑固']]
  ].map(([title,year,era,type,color,tracks]) => ({title,year,era,type,color,tracks,text:`${title} 被整理成唱片室中的一格小 CD 盒，點擊後右側顯示曲目與時代說明。`}));

  const playlists = ['Live 現場心跳精選','青春不回頭','夜行城市','回到那一天','長大後的我們','安可與大合唱'].map((title,i)=>({title,text:['演唱會開場、萬人大合唱與安可集中成一張現場地圖。','像一本會播放的青春日記。','城市燈光和巡演路線同步發亮。','聚焦近年巡演情緒。','後青春期、自傳與人生海海形成成長線索。','為底部播放器準備的高能隊列。'][i],cover:['linear-gradient(135deg,#09203f,#42e8ff,#ff6dad)','linear-gradient(135deg,#2b5876,#4e4376,#ffd166)','linear-gradient(135deg,#000428,#004e92,#9a7cff)','linear-gradient(135deg,#16222a,#3a6073,#ff6dad)','linear-gradient(135deg,#283048,#859398,#f6d365)','linear-gradient(135deg,#141e30,#243b55,#61ffbc)'][i]}));
  const books = ['五月天的素人自拍','下課後，怪獸家點名！','Happy.Birth.Day','浪漫的逃亡','我的搖滾媽咪','因為留不住'].map((title,i)=>({title,text:'以小封面比例放入資料館書架，避免佔滿整頁。',cover:['linear-gradient(135deg,#375878,#ded3bc)','linear-gradient(135deg,#607aa2,#efdda9)','linear-gradient(135deg,#8a6b8b,#dfc4cb)','linear-gradient(135deg,#34495e,#e6b980)','linear-gradient(135deg,#243b55,#d4fc79)','linear-gradient(135deg,#2c3e50,#fd746c)'][i]}));

  function initNav(){
    $$('[data-nav]').forEach(btn => btn.addEventListener('click', e => { e.preventDefault(); const id=btn.dataset.nav; if(!id) return; $$('.view').forEach(v=>v.classList.toggle('active',v.id===id)); $$('.main-nav button').forEach(b=>b.classList.toggle('active',b.dataset.nav===id)); }));
  }
  function renderTourList(){ const el=$('#tourList'); if(!el) return; el.innerHTML=tours.map((t,i)=>`<button class="tour-card ${i?'':'active'}" style="--tour:${t.color}"><b>${html(t.name)}</b><small>${html(t.year)} · ${html(t.desc)}</small><span class="years">${t.years.map(y=>`<span>${html(y)}</span>`).join('')}</span></button>`).join(''); }

  function initAdminMap(){
    const scene=$('#mapScene'); if(!scene) return;
    scene.classList.add('v16-admin');
    scene.querySelector('.continent-svg')?.setAttribute('aria-hidden','true');
    const canvas=document.createElement('canvas'); canvas.className='admin-map-canvas'; scene.prepend(canvas);
    const markers=document.createElement('div'); markers.className='map-markers'; scene.append(markers);
    const tools=document.createElement('div'); tools.className='map-tools-v16'; tools.innerHTML='<button id="zoomIn">＋</button><button id="zoomOut">－</button><button id="resetMap">◎</button>' ; scene.append(tools);
    const status=document.createElement('div'); status.className='map-status-v16'; status.innerHTML='<b>行政區域地圖 v16</b><br>拖曳旋轉地圖，滾輪縮放；節點基於經緯度投影，不再使用假 SVG 底圖。'; scene.append(status);
    const pop=$('#cityPopover'); const ctx=canvas.getContext('2d'); let features=[]; let active=stops[0]; let raf=0;
    const state={lon:113,lat:28,zoom:2.05,w:1,h:1,dpr:1,drag:false,lastX:0,lastY:0};
    const sources=['https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson','./assets/east-asia-admin-fallback.json'];
    function resize(){ const r=scene.getBoundingClientRect(); state.dpr=Math.min(devicePixelRatio||1,2); state.w=Math.max(320,r.width); state.h=Math.max(320,r.height); canvas.width=state.w*state.dpr; canvas.height=state.h*state.dpr; canvas.style.width=state.w+'px'; canvas.style.height=state.h+'px'; ctx.setTransform(state.dpr,0,0,state.dpr,0,0); draw(); }
    function scale(){ return Math.min(state.w/72,state.h/48)*state.zoom; }
    function project(lon,lat){ let dl=((lon-state.lon+540)%360)-180; return [state.w/2+dl*scale(), state.h/2-(lat-state.lat)*scale()]; }
    function pathRing(ring){ ctx.beginPath(); let started=false; for(const p of ring){ const [x,y]=project(p[0],p[1]); if(!isFinite(x)||!isFinite(y)) continue; if(!started){ctx.moveTo(x,y);started=true}else ctx.lineTo(x,y); } if(started) ctx.closePath(); return started; }
    function polygons(g){ if(!g) return []; return g.type==='Polygon'?g.coordinates:g.type==='MultiPolygon'?g.coordinates.flat():[]; }
    function drawGrid(){ ctx.save(); ctx.strokeStyle='rgba(130,220,255,.07)'; ctx.lineWidth=1; for(let lon=-180;lon<=180;lon+=10){ ctx.beginPath(); for(let lat=-60;lat<=60;lat+=2){ const [x,y]=project(lon,lat); lat===-60?ctx.moveTo(x,y):ctx.lineTo(x,y); } ctx.stroke(); } for(let lat=-60;lat<=60;lat+=10){ ctx.beginPath(); for(let lon=-180;lon<=180;lon+=3){ const [x,y]=project(lon,lat); lon===-180?ctx.moveTo(x,y):ctx.lineTo(x,y); } ctx.stroke(); } ctx.restore(); }
    function drawLand(){ const focus=new Set(['China','Taiwan','Japan','South Korea','North Korea','Vietnam','Thailand','Malaysia','Philippines','Singapore','Hong Kong']); for(const f of features){ const name=f.properties?.NAME_EN||f.properties?.ADMIN||f.properties?.NAME_ZHT||f.properties?.NAME||''; const isFocus=[...focus].some(k=>name.includes(k)) || ['中國','台灣','香港','日本','韓國','新加坡'].includes(f.properties?.NAME_ZHT); ctx.fillStyle=isFocus?'rgba(28,92,116,.82)':'rgba(13,43,62,.48)'; ctx.strokeStyle=isFocus?'rgba(134,230,255,.34)':'rgba(128,190,230,.15)'; ctx.lineWidth=isFocus?1.3:0.7; for(const ring of polygons(f.geometry)){ if(pathRing(ring)){ ctx.fill(); ctx.stroke(); } } } }
    function drawRoutes(){ ctx.save(); ctx.lineCap='round'; ctx.lineJoin='round'; ctx.shadowColor='rgba(71,231,255,.9)'; ctx.shadowBlur=18; ctx.lineWidth=4; const grad=ctx.createLinearGradient(0,0,state.w,0); grad.addColorStop(0,'#47e7ff'); grad.addColorStop(.55,'#fff5b6'); grad.addColorStop(1,'#ff6fab'); ctx.strokeStyle=grad; ctx.beginPath(); stops.forEach((s,i)=>{ const [x,y]=project(s.lon,s.lat); i?ctx.lineTo(x,y):ctx.moveTo(x,y); }); ctx.stroke(); ctx.shadowBlur=0; ctx.strokeStyle='rgba(255,255,255,.3)'; ctx.lineWidth=1; ctx.setLineDash([2,14]); ctx.stroke(); ctx.restore(); }
    function draw(){ cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>{ ctx.clearRect(0,0,state.w,state.h); const bg=ctx.createRadialGradient(state.w*.5,state.h*.48,10,state.w*.5,state.h*.5,Math.max(state.w,state.h)*.72); bg.addColorStop(0,'rgba(19,87,112,.9)'); bg.addColorStop(.55,'rgba(5,16,28,.96)'); bg.addColorStop(1,'rgba(2,6,12,1)'); ctx.fillStyle=bg; ctx.fillRect(0,0,state.w,state.h); drawGrid(); drawLand(); drawRoutes(); placeMarkers(); }); }
    function placeMarkers(){ markers.innerHTML=''; stops.forEach(s=>{ const [x,y]=project(s.lon,s.lat); if(x<-40||x>state.w+40||y<-40||y>state.h+40) return; const b=document.createElement('button'); b.className='marker-v16'+(s.id===active.id?' active':''); b.style.left=x+'px'; b.style.top=y+'px'; b.style.setProperty('--node',s.status==='規劃中'?'#ffd66b':s.status==='進行中'?'#ff6fab':'#47e7ff'); b.innerHTML=`<i>${s.no}</i><em>${html(s.city)}</em>`; b.addEventListener('click',()=>selectStop(s,true)); markers.append(b); }); }
    function selectStop(s,showPop=false){ active=s; updateDetail(s); draw(); const [x,y]=project(s.lon,s.lat); if(pop){ pop.hidden=!showPop; pop.className='city-popover admin-pop'; pop.style.left=x+'px'; pop.style.top=y+'px'; pop.innerHTML=`<div class="pop-photo ${s.cls}"></div><b>${html(s.city)}</b><p>${html(s.venue)}<br>${html(s.dates)}</p><div class="mini-tags"><span>${html(s.year)}</span><span>${html(s.status)}</span><span>${html(s.tag)}</span></div>`; } }
    function updateDetail(s){ $('#detailHero').className='detail-hero '+s.cls; $('#detailBadge').textContent=String(s.no).padStart(2,'0'); $('#detailCity').textContent=s.city; $('#detailDates').textContent=s.dates; $('#detailVenue').textContent=s.venue; $('#detailAddress').textContent=s.addr; $('#detailTour').textContent='回到那一天 巡迴演唱會'; $('#detailStatus').textContent=`${s.year} · ${s.status} · ${s.tag}`; $('#detailCaption').textContent=s.caption; $('#detailTags').innerHTML=[s.year,s.status,s.tag].map(t=>`<span>${html(t)}</span>`).join(''); $('#thumbRow').innerHTML=[0,1,2].map(i=>`<div class="thumb ${i?'':'active'} ${s.cls}"></div>`).join(''); }
    async function loadGeo(){ for(const src of sources){ try{ const r=await fetch(src,{cache:'force-cache'}); if(!r.ok) throw new Error(r.status); const json=await r.json(); features=json.features||[]; status.innerHTML=`<b>行政區域地圖 v16</b><br>底圖：${src.includes('raw.githubusercontent')?'Natural Earth Admin-0':'本地 fallback'} · 拖曳旋轉 / 滾輪縮放 / 點擊城市。`; draw(); return; }catch(e){} } status.innerHTML='<b>地圖資料載入失敗</b><br>仍可操作路線與節點，但行政區底圖暫不可用。'; draw(); }
    scene.addEventListener('pointerdown',e=>{ state.drag=true; state.lastX=e.clientX; state.lastY=e.clientY; scene.setPointerCapture(e.pointerId); scene.classList.add('dragging'); });
    scene.addEventListener('pointermove',e=>{ if(!state.drag) return; const dx=e.clientX-state.lastX, dy=e.clientY-state.lastY; state.lastX=e.clientX; state.lastY=e.clientY; state.lon-=dx/scale(); state.lat+=dy/scale(); state.lat=Math.max(-45,Math.min(60,state.lat)); draw(); pop.hidden=true; });
    scene.addEventListener('pointerup',e=>{ state.drag=false; scene.classList.remove('dragging'); });
    scene.addEventListener('wheel',e=>{ e.preventDefault(); state.zoom*=e.deltaY<0?1.12:.89; state.zoom=Math.max(.65,Math.min(5,state.zoom)); draw(); },{passive:false});
    $('#zoomIn')?.addEventListener('click',()=>{state.zoom=Math.min(5,state.zoom*1.18);draw();}); $('#zoomOut')?.addEventListener('click',()=>{state.zoom=Math.max(.65,state.zoom*.84);draw();}); $('#resetMap')?.addEventListener('click',()=>{state.lon=113;state.lat=28;state.zoom=2.05;draw();});
    $('#randomStop')?.addEventListener('click',()=>selectStop(stops[Math.floor(Math.random()*stops.length)],true));
    $('#routePlay')?.addEventListener('click',()=>{ let i=0; const timer=setInterval(()=>{ selectStop(stops[i],true); i++; if(i>=stops.length) clearInterval(timer); },900); });
    new ResizeObserver(resize).observe(scene); resize(); selectStop(active,false); loadGeo();
  }

  function renderAlbums(){ const shelf=$('#albumShelf'), detail=$('#albumDetail'), era=$('#eraFilter'); if(!shelf) return; let active=5; era.innerHTML=['全部年代','1990 - 1999','2000 - 2009','2010 - 2019'].map((e,i)=>`<button class="${i===2?'active':''}">${e}<span>${e==='全部年代'?albums.length:albums.filter(a=>a.era===e).length}</span></button>`).join(''); function draw(){ shelf.innerHTML=albums.map((a,i)=>`<button class="album-case ${i===active?'active':''}" style="--cover:${a.color}"><span class="album-cover"></span><b>${html(a.title)}</b><small>${a.year}</small></button>`).join(''); $$('.album-case',shelf).forEach((b,i)=>b.onclick=()=>{active=i;draw();}); const a=albums[active]; $('#needleTitle').textContent=a.title; $('#needleYear').textContent=`${a.year} · ${a.type}`; detail.innerHTML=`<div class="album-cover big" style="--cover:${a.color}"></div><div class="vinyl-disc"></div><h2>${html(a.title)}</h2><p>${html(a.year)} · ${html(a.type)}</p><p>${html(a.text)}</p><div class="track-list">${a.tracks.map((t,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><b>${html(t)}</b><em>▶</em></div>`).join('')}</div><button>播放專輯 ▶</button>`; } draw(); }
  function renderOtherPages(){ const pg=$('#playlistGrid'); if(pg) pg.innerHTML=playlists.map(p=>`<article class="playlist-card glass"><span style="background:${p.cover}"></span><h3>${html(p.title)}</h3><p>${html(p.text)}</p><button>播放歌單</button></article>`).join(''); const bc=$('#bookcase'); if(bc) bc.innerHTML=books.map(b=>`<article class="book"><span style="background:${b.cover}"></span><h3>${html(b.title)}</h3><p>${html(b.text)}</p><button>資料頁</button></article>`).join(''); const tw=$('#timelineWall'); if(tw) tw.innerHTML=['1997 正式成軍','1999 首張專輯','2001 人生海海','2009 DNA 創造','2011 第二人生 / 諾亞方舟','2023–2026 回到那一天'].map(x=>{const [y,...t]=x.split(' ');return `<article><time>${y}</time><div><h3>${html(t.join(' '))}</h3><p>以展覽牆方式串連作品、巡演和城市記憶。</p></div></article>`}).join(''); }
  function initPlayer(){ let playing=false, start=0, timer=0, progress=0; const btn=$('#playBtn'), bar=$('#playerProgress'), title=$('#miniTitle'); function tick(){ if(!playing) return; progress=(Date.now()-start)%225000/225000; if(bar) bar.style.width=(progress*100)+'%'; $('#sheetProgress')&&( $('#sheetProgress').style.width=(progress*100)+'%' ); timer=requestAnimationFrame(tick); } btn?.addEventListener('click',()=>{ playing=!playing; btn.textContent=playing?'⏸':'▶'; title.textContent=playing?'倔強 · 正在播放預覽':'倔強 · 現場心跳版'; if(playing){start=Date.now()-progress*225000;tick()} else cancelAnimationFrame(timer); }); $('#openPlayer')?.addEventListener('click',()=>{$('#playerSheet')?.classList.add('open')}); $('#sheetClose')?.addEventListener('click',()=>{$('#playerSheet')?.classList.remove('open')}); }

  document.addEventListener('DOMContentLoaded',()=>{ initNav(); renderTourList(); initAdminMap(); renderAlbums(); renderOtherPages(); initPlayer(); });
})();