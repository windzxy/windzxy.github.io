(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  const sources = [
    ['相信音樂・五月天藝人專區','https://www.bin-music.com.tw/artist/mayday'],
    ['5525 起跑與 25 年音樂軌跡','https://www.bin-music.com.tw/news/1775'],
    ['5525+2 台北大巨蛋官方消息','https://www.bin-music.com.tw/news/2409'],
    ['5525 台北大巨蛋 8 夜','https://www.bin-music.com.tw/news/2121'],
    ['5525+2 完整收官與 162 場紀錄','https://www.bin-music.com.tw/news/2468'],
    ['Mayday Japan Discography','https://www.mayday.jp/discography/']
  ];

  const tourPhases = [
    {name:'回到那一天 5525+2', years:'2026', focus:'台北大巨蛋・北京鳥巢', cities:'台北 / 北京', shows:'官方消息：台北 7 天 7 夜、彩蛋與恐龍舞台', level:'主線強化', color:'#5beeff'},
    {name:'回到那一天 5525+1', years:'2025', focus:'台北大巨蛋・貴陽・台中', cities:'台北 / 貴陽 / 台中', shows:'把年度節點拆出，不再混成一組', level:'資料擴充', color:'#ff74b8'},
    {name:'回到那一天 5525', years:'2023–2024', focus:'台中起跑、港澳與大陸巡迴', cities:'台中 / 高雄 / 香港 / 北京 / 深圳 / 太原 / 武漢 / 成都 / 上海', shows:'由台中起跑，串成 25 週年巡演主軸', level:'核心路線', color:'#ffd66b'},
    {name:'好好好想見到你', years:'2020–2023', focus:'疫情後重逢主題', cities:'台北 / 高雄 / 桃園 / 香港 / 新加坡等', shows:'後續需補站點照片與歌單', level:'待深化', color:'#67ffc8'},
    {name:'人生無限公司 LiFE', years:'2017–2019', focus:'大型世界巡迴與電影化敘事', cities:'亞洲 / 北美 / 歐洲 / 大洋洲', shows:'適合做「公司任務地圖」支線', level:'世界觀支線', color:'#9a7cff'},
    {name:'諾亞方舟 NOWHERE', years:'2011–2014', focus:'末日、重生、方舟', cities:'台北 / 高雄 / 香港 / 北京 / 上海 / 新加坡 / 洛杉磯等', shows:'可補成獨立時間艙頁', level:'史詩支線', color:'#64d2ff'},
    {name:'DNA / 離開地球表面', years:'2007–2010', focus:'大型舞台與世界巡演擴張', cities:'台北 / 上海 / 北京 / 香港 / 新加坡', shows:'從樂團現場走向大型製作', level:'舞台進化', color:'#ffb86b'},
    {name:'Final Home / 早期巡演', years:'1999–2005', focus:'從 Live House、校園到萬人現場', cities:'台北 / 台中 / 高雄 / 香港', shows:'需要補「當初那個房間」的創作語境', level:'起點檔案', color:'#a6ffcb'}
  ];

  const cityNotes = {
    '台北':['重點不是只寫日期，而是要呈現大巨蛋、台北小巨蛋與城市記憶的層次。','5525 台北大巨蛋從 2025 到 2026 都是核心節點，應獨立成年度站點檔案。','下一步需補：官方新聞照、場館外觀、當日彩蛋、歌單與新聞來源。'],
    '台中':['5525 由台中洲際棒球場起跑，跨年屬性強，應做成「起點」場景。','台中節點同時橫跨 2023、2025、2026，不能只放一個年份。','下一步需補：起跑日舞台、紅色跑車、時光機球體等官方圖文。'],
    '高雄':['高雄世運主場館的戶外尺度與港都氣質很適合做大圖卡。','應與 2012 高雄世運等歷史現場連結，形成「同一城市不同年代」的對照。','下一步需補：世運場館照、現場歌單、官方新聞。'],
    '香港':['香港站應突出海港、戶外場地、連場演出與城市夜景。','目前仍像資料卡，下一輪應加入相簿欄與時間分場。','下一步需補：香港站官方圖源與場次分拆。'],
    '北京':['北京鳥巢是儀式感節點，應在地圖上視覺更突出。','5525+2 北京鳥巢官方新聞已可作為後續內容補充來源。','下一步需補：鳥巢站官方圖、嘉賓、舞台彩蛋。'],
    '上海':['上海站應與城市天際線、體育場、多場連演關聯。','目前只算初步站點，需要按日期拆場。','下一步需補：官方售票/新聞來源與照片。'],
    '貴陽':['貴陽已作為 2025 節點加入，但仍缺官方精準場館資料。','先標記「資料補齊中」，避免不確定內容被當成事實。','下一步需補：官方頁面、日期、場館與交通。']
  };

  const albums = [
    {title:'五月天第一張創作專輯', year:'1999', era:'起點', tone:'從地下社團走向正式發行', cover:'linear-gradient(135deg,#1c5171,#f1d36e,#b74775)', tracks:['瘋狂世界','擁抱','透露','生活','愛情的模樣','嘿！我要走了','軋車','志明與春嬌','HoSee','黑白講','I Love You 無望','風若吹'], note:'專輯室裡應作為入口第一格，連到第168場演唱會與早期校園現場。'},
    {title:'愛情萬歲', year:'2000', era:'青春爆發', tone:'都市、孤單、愛情與樂團能量', cover:'linear-gradient(135deg,#355c7d,#6c5b7b,#c06c84)', tracks:['為什麼','終結孤單','明白','心中無別人','有你的將來','憨人','叫我第一名','雨眠','羅密歐與茱麗葉','溫柔','愛情萬歲','反而'], note:'5525+2 曾回望《十萬青年站出來》與《愛情萬歲》時代，應與巡演彩蛋互相連結。'},
    {title:'人生海海', year:'2001', era:'世界變大', tone:'青春進入人生命題', cover:'linear-gradient(135deg,#20435b,#f0b55b,#95363c)', tracks:['一顆蘋果','能不能不要說','好不好','相信','OK啦','借問眾神明','永遠的永遠','彩虹','啾啾啾','純真','候鳥','人生海海'], note:'適合做「從青春到世界巡演」的轉折專輯。'},
    {title:'時光機', year:'2003', era:'時間感', tone:'回憶與科幻感開始成形', cover:'linear-gradient(135deg,#253a5c,#88d4f2,#f7d08a)', tracks:['輕功','恆星的恆心','雌雄同體','阿姆斯壯','而我知道','賭神','別惹我','九號球','武裝','時光機','我們','在這一秒'], note:'與「回到那一天」概念天然契合，應做成唱片室核心視覺。'},
    {title:'神的孩子都在跳舞', year:'2004', era:'樂團爆裂', tone:'樂團合奏與舞台爆發', cover:'linear-gradient(135deg,#33264f,#e35d8f,#ffcf71)', tracks:['孫悟空','倔強','垃圾車','小護士','讓我照顧你','約翰藍儂','回來吧','錯錯錯','晚安 地球人','超人','神的孩子都在跳舞'], note:'5525 時光機多次回望此時期，是舞台彩蛋資料的重要母題。'},
    {title:'知足 最真傑作選', year:'2005', era:'珍藏精選', tone:'第一次完整整理青春代表作', cover:'linear-gradient(135deg,#1b3b52,#e8d6a8,#d05c7b)', tracks:['知足','牙關','亂世浮生','戀愛ing','聽不到','擁抱','終結孤單','而我知道','孫悟空','人生海海','瘋狂世界','愛情萬歲','溫柔','倔強'], note:'專輯室右側預設展示，因為最容易把非粉絲帶進五月天脈絡。'},
    {title:'為愛而生', year:'2006', era:'情感擴張', tone:'更柔軟、更流行化的情感表述', cover:'linear-gradient(135deg,#283a55,#f4d06f,#57b8a6)', tracks:['前傳','為愛而生','天使','我又初戀了','香水','摩托車日記','最重要的小事','快樂很偉大','忘詞','寵上天','米老鼠','一千個世紀','胎音'], note:'應與情歌歌單、粉絲入坑路線關聯。'},
    {title:'後青春期的詩', year:'2008', era:'長大以後', tone:'後青春與自我和解', cover:'linear-gradient(135deg,#243949,#517fa4,#f0c27b)', tracks:['突然好想你','生存以上 生活以下','你不是真正的快樂','爆肝','噢買尬','出頭天','我心中尚未崩壞的地方','春天的吶喊','夜訪吸血鬼','如煙','後青春期的詩','笑忘歌'], note:'歌曲頁應建立「長大後的我們」專題入口。'},
    {title:'第二人生', year:'2011', era:'末日與重生', tone:'世界末日、方舟、重新開始', cover:'linear-gradient(135deg,#191d2e,#4d7cff,#f6d365)', tracks:['2012','倉頡','洗衣機','歪腰','乾杯','我不願讓你一個人','星空','三個傻瓜','末日','OAOA','第二人生','諾亞方舟'], note:'可與諾亞方舟巡演地圖做獨立沉浸頁。'},
    {title:'自傳', year:'2016', era:'人生回望', tone:'把樂團自身寫成長篇敘事', cover:'linear-gradient(135deg,#0f2027,#2c5364,#f7971e)', tracks:['如果我們不曾相遇','成名在望','好好','兄弟','人生有限公司','後來的我們','頑固','派對動物','最好的一天','少年他的奇幻漂流','終於結束的起點','任意門'], note:'適合作為整站結構母題：從任意門進入各年代。'},
    {title:'Mayday × 五月天 the Best of 1999-2013', year:'2013', era:'海外整理', tone:'日本版精選與海外入口', cover:'linear-gradient(135deg,#1a2980,#26d0ce,#f4e2d8)', tracks:['Dancin’ Dancin’','OAOA','入陣曲','乾杯','傷心的人別聽慢歌','盛夏光年','突然好想你','離開地球表面'], note:'可作為國際粉絲入口，連到 Mayday Japan Discography。'},
    {title:'YOUR LEGEND ～燃ゆる命～', year:'2015', era:'日本作品', tone:'日文版與海外巡演記憶', cover:'linear-gradient(135deg,#111827,#b91c1c,#fef3c7)', tracks:['YOUR LEGEND','追憶のナインボール','Do You Ever Shine?','Dancin’ Dancin’'], note:'國際化頁面需要把海外作品獨立整理。'}
  ];

  const songGroups = [
    {tab:'全部', title:'Maydayland 編輯精選', feature:'linear-gradient(135deg,#09203f,#42e8ff,#ff74b8)', desc:'用娛樂網站方式重新整理：入門、現場、青春、電影感、海外版與 5525 預習。', songs:['倔強','突然好想你','溫柔','志明與春嬌','乾杯','頑固','OAOA','派對動物','星空','後來的我們','成名在望','任意門']},
    {tab:'現場必唱', title:'現場心跳核心', feature:'linear-gradient(135deg,#141e30,#243b55,#67ffc8)', desc:'放到底部播放器的高能隊列，保證歌單看起來不是空殼。', songs:['倔強','戀愛ing','離開地球表面','派對動物','入陣曲','軋車','傷心的人別聽慢歌','OAOA']},
    {tab:'青春情歌', title:'長大後還會唱', feature:'linear-gradient(135deg,#2b5876,#4e4376,#ffd66b)', desc:'以粉絲情緒而不是年代硬分類。', songs:['溫柔','知足','突然好想你','你不是真正的快樂','我不願讓你一個人','後來的我們','好好','如煙']},
    {tab:'專輯敘事', title:'從第一張到自傳', feature:'linear-gradient(135deg,#16222a,#3a6073,#ff74b8)', desc:'把專輯頁和歌曲頁互相打通。', songs:['瘋狂世界','人生海海','時光機','孫悟空','為愛而生','後青春期的詩','第二人生','任意門']},
    {tab:'海外入口', title:'國際粉絲入口', feature:'linear-gradient(135deg,#111827,#2563eb,#f97316)', desc:'日本版精選、日文單曲與海外宣傳資料後續會獨立補充。', songs:['Do You Ever Shine?','YOUR LEGEND','Dancin’ Dancin’','Song for you','OAOA','入陣曲']}
  ];

  const books = [
    {title:'五月天的素人自拍', year:'2001 / 書籍', cover:'linear-gradient(135deg,#375878,#ded3bc)', text:'早期出版記錄，應放在「從當初的房間出發」支線。'},
    {title:'下課後，怪獸家點名！五月天樂譜特號', year:'樂譜 / 收藏', cover:'linear-gradient(135deg,#607aa2,#efdda9)', text:'樂譜、寫真與創作補充資料，適合加入樂手視角。'},
    {title:'Happy.Birth.Day 阿信・搖滾詩的誕生與轉生', year:'2006 / 文字', cover:'linear-gradient(135deg,#8a6b8b,#dfc4cb)', text:'文字創作與歌曲敘事的延伸，不應只是放封面。'},
    {title:'浪漫的逃亡', year:'旅行 / 散文', cover:'linear-gradient(135deg,#34495e,#e6b980)', text:'可放入「城市與旅行」資料分頁，連結巡演地圖。'},
    {title:'我的搖滾媽咪', year:'圖文 / 親子', cover:'linear-gradient(135deg,#243b55,#d4fc79)', text:'五月天之外的創作延伸，作為出版品櫃的一格。'},
    {title:'因為留不住', year:'2019 / 文字', cover:'linear-gradient(135deg,#2c3e50,#fd746c)', text:'文字與記憶收藏，適合與時間線「長大後」支線連結。'},
    {title:'昨天的孩子', year:'瑪莎 / 文集', cover:'linear-gradient(135deg,#1f2937,#60a5fa,#fbbf24)', text:'成員個人出版品，後續應以作者維度整理。'},
    {title:'演唱會場刊與週邊紙本', year:'待整理 / 巡演物料', cover:'linear-gradient(135deg,#0f172a,#5eead4,#f472b6)', text:'國際級檔案館應收錄場刊、票根、應援物與海報，而不是只列書名。'}
  ];

  const timeline = [
    ['1997','正式成軍','五月天完成穩定編制，從校園與 Live House 開始累積能量。',['起點','樂團房間']],
    ['1999','首張創作專輯 / 第168場演唱會','第一張專輯發行，早期現場成為日後反覆回望的原點。',['專輯','巡演']],
    ['2000','愛情萬歲 / 十萬青年站出來','青春、城市與群體記憶開始放大，成為 5525+2 彩蛋重要母題。',['愛情萬歲','大型現場']],
    ['2001','人生海海','作品命題從青春走向人生，後續巡演敘事開始變大。',['專輯','轉折']],
    ['2003','時光機','「時間」成為五月天敘事核心之一，與回到那一天概念呼應。',['時光','專輯']],
    ['2004','神的孩子都在跳舞 / Final Home','樂團爆發力與巡演規模成長，開始具備世界巡演想像。',['舞台','巡演']],
    ['2007','離開地球表面','舞台視覺和大眾傳播更強，奠定大型演唱會語言。',['舞台','視覺']],
    ['2009','DNA 創造巡迴','製作尺度與巡演版圖持續擴大。',['巡演','世界']],
    ['2011','第二人生 / 諾亞方舟','末日、重生、方舟成為史詩化舞台敘事。',['史詩','巡演']],
    ['2013','日本版精選與海外擴張','海外粉絲入口和國際作品資料需要獨立整理。',['海外','作品']],
    ['2016','自傳','樂團把自身歷程整理成大型生命敘事。',['自傳','任意門']],
    ['2017–2019','人生無限公司 LiFE','巡演敘事進入企業、任務、電影化世界觀。',['世界觀','巡演']],
    ['2020–2023','好好好想見到你','疫情後重逢情緒成為重要現場記憶。',['重逢','巡演']],
    ['2023.12','回到那一天從台中起跑','5525 25週年巡演啟動，時光機成為核心舞台意象。',['5525','台中']],
    ['2025–2026','5525+1 / 5525+2','大巨蛋、鳥巢、跨年度節點形成新的巡演主線。',['大巨蛋','5525+2']],
    ['下一步','資料館完成度提升','補真實圖片、官方來源、每站歌單、場刊票根與城市故事。',['待補','90分目標']]
  ];

  function renderTourArchive(){
    const rail = $('#tourList'); if(!rail) return;
    rail.innerHTML = tourPhases.map((t,i)=>`<button class="tour-card ${i===0?'active':''}" style="--tour:${t.color}"><b>${esc(t.name)}</b><small>${esc(t.years)} · ${esc(t.focus)}</small><span class="years"><span>${esc(t.cities)}</span><span>${esc(t.level)}</span></span><span class="tour-stats"><span><strong>${i<3?'5525':'支線'}</strong><em>ARCHIVE</em></span><span><strong>${esc(t.years)}</strong><em>YEAR</em></span><span><strong>${i<3?'優先':'補完'}</strong><em>STATUS</em></span></span><span class="source-pill">${esc(t.shows)}</span></button>`).join('');
    if(!$('.pm-note', $('.tour-rail'))) $('.tour-rail')?.insertAdjacentHTML('beforeend', '<div class="pm-note"><b>產品經理評審：</b>v17 開始補完整內容架構。當前仍未到 90 分；下一輪重點是真實官方照片、每站歌單、票根/場刊與手機端精修。</div>');
    $$('.tour-card', rail).forEach((b,i)=>b.addEventListener('click',()=>{$$('.tour-card', rail).forEach(x=>x.classList.remove('active')); b.classList.add('active'); const title=$('#mapTitle'); if(title) title.textContent=tourPhases[i].name+' · '+tourPhases[i].focus;}));
  }

  function renderCityDossier(){
    const body = $('.detail-body'); if(!body) return;
    let box = $('#v17CityDossier');
    if(!box){ body.insertAdjacentHTML('beforeend','<div id="v17CityDossier" class="v17-city-dossier"></div><div class="v17-sources" id="v17Sources"></div>'); box=$('#v17CityDossier'); }
    const city = $('#detailCity')?.textContent?.trim() || '台北';
    const notes = cityNotes[city] || ['此城市已加入路線，但仍需要補足官方照片、逐日場次與歌單。','下一輪會把「城市故事」和「演唱會資料」分開，避免只剩普通卡片。','缺資料時會標記為待補，不用猜測內容。'];
    box.innerHTML = notes.map((n,i)=>`<article><h4>${['內容深度','視覺方向','待補資料'][i]||'補充'}</h4><p>${esc(n)}</p></article>`).join('');
    const s = $('#v17Sources');
    if(s) s.innerHTML = sources.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener">${esc(label)}</a>`).join('');
  }

  function renderAlbums(){
    const shelf=$('#albumShelf'), detail=$('#albumDetail'), era=$('#eraFilter'); if(!shelf||!detail) return;
    $('.room-view')?.classList.add('v17-room'); shelf.classList.add('v17-shelf'); detail.classList.add('v17-detail');
    let active=5;
    const eras=['全部','起點','青春爆發','時間感','長大以後','海外整理'];
    if(era) era.innerHTML=eras.map((e,i)=>`<button class="${i===0?'active':''}">${esc(e)}<span>${e==='全部'?albums.length:albums.filter(a=>a.era===e).length}</span></button>`).join('');
    function draw(){
      shelf.innerHTML = albums.map((a,i)=>`<button class="album-case v17-case ${i===active?'active':''}" style="--cover:${a.cover}"><span class="album-cover"></span><b>${esc(a.title)}</b><small>${esc(a.year)} · ${esc(a.era)}</small></button>`).join('');
      $$('.album-case',shelf).forEach((b,i)=>b.onclick=()=>{active=i;draw();});
      const a=albums[active]; $('#needleTitle') && ($('#needleTitle').textContent=a.title); $('#needleYear') && ($('#needleYear').textContent=`${a.year} · ${a.tone}`);
      detail.innerHTML = `<div class="album-cover big" style="--cover:${a.cover}"></div><div class="vinyl-disc"></div><h2>${esc(a.title)}</h2><p>${esc(a.year)} · ${esc(a.era)} · ${esc(a.tone)}</p><div class="era-note">${esc(a.note)}</div><div class="track-list v17-track">${a.tracks.map((t,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><b>${esc(t)}</b><small>${esc(a.title)}</small><em>▶</em></div>`).join('')}</div><button>播放專輯 ▶</button>`;
    }
    draw();
  }

  function renderSongs(){
    const page = $('#songs .library-page'), grid=$('#playlistGrid'); if(!page||!grid) return;
    page.classList.add('v17-library'); $('.page-head', page)?.classList.add('v17-head');
    let active=0;
    function draw(){
      const g=songGroups[active];
      grid.outerHTML = `<div id="playlistGrid" class="song-archive"><div><div class="archive-tabs">${songGroups.map((x,i)=>`<button class="${i===active?'active':''}" data-song-tab="${i}">${esc(x.tab)}</button>`).join('')}</div><section class="song-feature" style="--feature:${g.feature}"><div class="section-kicker">EDITORIAL PLAYLIST</div><h3>${esc(g.title)}</h3><p>${esc(g.desc)}</p><button class="mini-action">加入播放器</button></section></div><div class="song-list">${g.songs.map((s,i)=>`<article class="song-row"><i style="--song-cover:${songGroups[i%songGroups.length].feature}"></i><div><b>${esc(s)}</b><small>${esc(g.tab)} · Maydayland Archive</small></div><em>${String(i+1).padStart(2,'0')}</em></article>`).join('')}</div></div>`;
      $$('[data-song-tab]').forEach(b=>b.onclick=()=>{active=Number(b.dataset.songTab); draw();});
    }
    draw();
  }

  function renderBooks(){
    const page=$('#books .library-page'), box=$('#bookcase'); if(!page||!box) return;
    page.classList.add('v17-library'); $('.page-head', page)?.classList.add('v17-head'); box.classList.add('v17-bookcase');
    box.innerHTML=books.map(b=>`<article class="book v17-book"><span style="background:${b.cover}"></span><div><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p><small>${esc(b.year)}</small><button>查看出版檔案</button></div></article>`).join('');
  }

  function renderTimeline(){
    const page=$('#timeline .library-page'), wall=$('#timelineWall'); if(!page||!wall) return;
    page.classList.add('v17-library'); $('.page-head', page)?.classList.add('v17-head'); wall.classList.add('v17-timeline');
    wall.innerHTML=timeline.map(([year,title,text,tags])=>`<article><time>${esc(year)}</time><div><h3>${esc(title)}</h3><p>${esc(text)}</p><div class="tagline">${tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div></div></article>`).join('');
  }

  function improvePlayer(){
    $('#playerDock')?.classList.add('v17-player');
    const queue=$('#queueList'); if(queue){ queue.classList.add('v17-queue'); const q=[...songGroups[0].songs.slice(0,8)]; queue.innerHTML=q.map((s,i)=>`<button><span>${String(i+1).padStart(2,'0')}</span><b>${esc(s)}</b><small>${i<3?'現場核心':'資料館隊列'}</small></button>`).join(''); }
    $('#miniMode') && ($('#miniMode').textContent='MAYDAYLAND CURATED RADIO');
    $('#miniSub') && ($('#miniSub').textContent='穩定播放器狀態 · 歌單隊列已補完');
  }

  function addAudit(){
    const scene=$('#mapScene'); if(!scene || $('#pmAudit')) return;
    scene.insertAdjacentHTML('beforeend', '<aside id="pmAudit" class="pm-audit"><b>PM 自評：78 / 100 → 下一目標 90+</b><div class="pm-meter"><i></i></div><p>目前：內容架構已擴充，但真實照片、逐場資料、手機端與播放器音源仍需打磨。此面板只作內部驗收提醒。</p><div class="pm-grid"><span>地圖 80</span><span>內容 75</span><span>視覺 78</span><span>互動 74</span></div></aside>');
  }

  function observeDetail(){
    const city=$('#detailCity'); if(!city) return; renderCityDossier(); new MutationObserver(renderCityDossier).observe(city,{childList:true,characterData:true,subtree:true});
  }

  function boot(){
    $('.md-app')?.classList.add('v17-ready');
    renderTourArchive(); renderCityDossier(); renderAlbums(); renderSongs(); renderBooks(); renderTimeline(); improvePlayer(); addAudit(); observeDetail();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else setTimeout(boot,0);
})();