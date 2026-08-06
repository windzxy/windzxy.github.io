(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c));

  const cityDossiers = {
    '台北': {visits:26, venue:'台北大巨蛋 / 台北小巨蛋', years:'1999–2026', heat:'超高熱度', score:'A', mood:'核心主場、年度收官、資料優先補完', setlist:['倔強','突然好想你','知足','乾杯','回到那一天'], albums:['神的孩子都在跳舞','知足 最真傑作選','自傳','5525 Live Archive'], source:['相信音樂 5525+2 台北大巨蛋','五月天日本官網 Discography','相信音樂 五月天藝人專區'], tasks:['補 2026 台北大巨蛋完整日期與場次圖','建立台北大巨蛋 / 小巨蛋雙場館資料','補官方主視覺、票務頁、場刊、歌單','新增交通、周邊住宿與拍照點'], shots:['舞台主視覺','場館外觀','歌迷應援']},
    '台中': {visits:14, venue:'洲際棒球場', years:'2023–2026', heat:'高熱度', score:'A-', mood:'5525 起跑、跨年、台灣中部核心', setlist:['派對動物','OAOA','乾杯','倔強'], albums:['自傳','第二人生','5525 Live Archive'], source:['相信音樂 5525 新聞','場館資料','歌迷應援素材'], tasks:['補 2023 起跑場資料','補 2025–2026 跨年場資料','建立台中跨年專題'], shots:['棒球場夜景','跨年煙火','觀眾席']},
    '高雄': {visits:12, venue:'高雄世運主場館', years:'2024', heat:'高熱度', score:'A-', mood:'大型戶外場、港都夜色、世運舞台', setlist:['離開地球表面','戀愛ing','乾杯','溫柔'], albums:['為愛而生','後青春期的詩','5525 Live Archive'], source:['相信音樂巡演新聞','場館交通','票務資料'], tasks:['補世運主場館照片牆','補高雄站每日歌單','補港都旅遊延伸'], shots:['世運主場館','港口夜景','舞台燈光']},
    '香港': {visits:10, venue:'中環海濱活動空間', years:'2024', heat:'高熱度', score:'B+', mood:'海港城市、夜景、海外華語市場', setlist:['知足','突然好想你','倔強','溫柔'], albums:['知足 最真傑作選','後青春期的詩','5525 Live Archive'], source:['公開票務頁','官方巡演公告','城市資料'], tasks:['補中環海濱地圖與交通','補香港站照片牆','建立維港夜色視覺模組'], shots:['維港夜景','中環海濱','演唱會人潮']},
    '北京': {visits:8, venue:'國家體育場 鳥巢', years:'2024–2026', heat:'高熱度', score:'B+', mood:'鳥巢級大型場、收官敘事、北方核心', setlist:['倔強','諾亞方舟','成名在望','頑固'], albums:['第二人生','自傳','5525 Live Archive'], source:['官方新聞','場館資料','票務資訊'], tasks:['補鳥巢官方圖與票務','建立大型場館專題','補城市收官線'], shots:['鳥巢夜景','超大型舞台','城市道路']},
    '上海': {visits:9, venue:'上海體育場', years:'2024', heat:'高熱度', score:'B+', mood:'都市密度、連場演出、夜景視覺', setlist:['派對動物','夜訪吸血鬼','傷心的人別聽慢歌','乾杯'], albums:['自傳','第二人生','5525 Live Archive'], source:['官方巡演資訊','場館交通','票務頁'], tasks:['補上海多場次日曆','補城市夜景牆','建立場館座位與交通資料'], shots:['上海體育場','城市夜景','地鐵交通']},
    '深圳': {visits:5, venue:'深圳大運中心體育場', years:'2024', heat:'中熱度', score:'B', mood:'現代城市、霓虹、年輕市場', setlist:['OAOA','戀愛ing','派對動物','突然好想你'], albums:['後青春期的詩','自傳','5525 Live Archive'], source:['官方巡演資訊','票務平台','場館資料'], tasks:['補大運中心照片','補深圳站歌單','建立城市霓虹視覺'], shots:['大運中心','城市霓虹','舞台遠景']},
    '成都': {visits:4, venue:'東安湖體育公園主體育場', years:'2024', heat:'中熱度', score:'B', mood:'西南城市、生活感、慢歌記憶', setlist:['溫柔','知足','我不願讓你一個人','乾杯'], albums:['愛情萬歲','後青春期的詩','自傳'], source:['官方巡演資料','場館資訊','旅遊交通'], tasks:['補東安湖場館資料','建立城市慢歌歌單','補西南巡演支線'], shots:['東安湖','城市夜色','觀眾合唱']},
    '武漢': {visits:3, venue:'武漢體育中心體育場', years:'2024', heat:'中低熱度', score:'B-', mood:'江城、內地巡演重要節點', setlist:['倔強','乾杯','離開地球表面'], albums:['神的孩子都在跳舞','第二人生','5525 Live Archive'], source:['巡演公告','場館交通','城市資料'], tasks:['補武漢站場館照片','補歌單與票根','建立江城資料卡'], shots:['武漢體育中心','城市橋樑','演出現場']},
    '太原': {visits:2, venue:'山西體育中心體育場', years:'2024', heat:'低熱度', score:'C+', mood:'中原支線，資料需要補強', setlist:['倔強','知足','戀愛ing'], albums:['知足 最真傑作選','5525 Live Archive'], source:['公開巡演資訊','票務資料','場館資料'], tasks:['補太原官方資料','補場館照片與交通','整理站點日期'], shots:['山西體育中心','城市天際線','歌迷入場']},
    '貴陽': {visits:1, venue:'貴陽站', years:'2025', heat:'待補', score:'C', mood:'資料缺口站，需要官方來源補齊', setlist:['待補歌單','回到那一天','倔強'], albums:['5525 Live Archive'], source:['待補官方頁','場館資料','票務資訊'], tasks:['確認場館與日期','補官方公告','建立站點資料底稿'], shots:['城市山景','場館待補','票務截圖']},
    '新加坡': {visits:3, venue:'海外巡演入口', years:'海外線', heat:'海外入口', score:'B-', mood:'海外巡演支線，適合做世界地圖延伸', setlist:['知足','突然好想你','倔強'], albums:['海外/日本作品入口','5525 Live Archive'], source:['海外巡演資料','日本官網','公開新聞'], tasks:['建立海外地圖圖層','補新加坡場館資料','補海外巡演歌單'], shots:['城市天際線','海外場館','歌迷合照']}
  };

  const sourceLinks = {
    '相信音樂 5525+2 台北大巨蛋':'https://www.bin-music.com.tw/news/2409',
    '五月天日本官網 Discography':'https://www.mayday.jp/discography/',
    '相信音樂 五月天藝人專區':'https://www.bin-music.com.tw/artist/MAYDAY',
    '相信音樂 5525 新聞':'https://www.bin-music.com.tw/news/1985'
  };

  function toast(text){
    let el = $('.v24-toast');
    if(!el){ el = document.createElement('div'); el.className = 'v24-toast'; document.body.append(el); }
    el.textContent = text; el.classList.add('show');
    clearTimeout(el._t); el._t = setTimeout(()=>el.classList.remove('show'), 1800);
  }

  function currentCity(){ return $('#detailCity')?.textContent?.trim() || '台北'; }
  function dossierFor(city){ return cityDossiers[city] || cityDossiers['台北']; }

  function addCommand(){
    const mapScene = $('#mapScene');
    if(!mapScene || $('.v24-command')) return;
    const el = document.createElement('div');
    el.className = 'v24-command';
    el.innerHTML = [
      ['CITY DOSSIER','城市級巡演檔案','每個點位都有場館、年份、歌單、素材任務。'],
      ['HEAT LOGIC','到訪越多越深','台北 / 台中 / 高雄等核心城市顏色更重。'],
      ['MEDIA WALL','照片牆佔位','下一步可逐站掛官方圖與場館圖。'],
      ['LINKED CONTENT','跨頁聯動','城市 → 歌單 → 專輯 → 歷程。'],
      ['GATE','58 → 65+','先把骨架從 demo 拉向產品。']
    ].map(x=>`<article><small>${x[0]}</small><b>${x[1]}</b><p>${x[2]}</p></article>`).join('');
    mapScene.append(el);
  }

  function createDrawer(){
    if($('.v24-drawer')) return;
    const drawer = document.createElement('aside');
    drawer.className = 'v24-drawer';
    drawer.innerHTML = `<div class="v24-drawer-head"><button id="v24DrawerClose">×</button><small>CITY DOSSIER</small><h3 id="v24DrawerCity">台北</h3></div><div class="v24-drawer-body" id="v24DrawerBody"></div>`;
    document.body.append(drawer);
    $('#v24DrawerClose')?.addEventListener('click',()=>drawer.classList.remove('open'));
  }

  function renderDrawer(city=currentCity()){
    createDrawer();
    const d = dossierFor(city);
    $('#v24DrawerCity').textContent = city;
    $('#v24DrawerBody').innerHTML = `
      <div class="v24-metrics"><span><b>${d.visits}</b>估算到訪熱度</span><span><b>${d.score}</b>資料完整度</span><span><b>${d.years}</b>年份跨度</span></div>
      <section class="v24-panel"><h4>${esc(d.venue)}</h4><p>${esc(d.mood)}</p><div class="v24-pill-row"><span>${esc(d.heat)}</span><span>${esc(d.years)}</span><span>${esc(d.score)}</span></div></section>
      <section class="v24-media-wall">${d.shots.map((s,i)=>`<div class="v24-shot" data-label="${esc(s)}" style="--shot:${shotGradient(city,i)}"></div>`).join('')}</section>
      <section class="v24-panel"><h4>建議歌單</h4><div class="v24-linked">${d.setlist.map(song=>`<button data-v24-song="${esc(song)}">${esc(song)}<small>加入城市歌單</small></button>`).join('')}</div></section>
      <section class="v24-panel"><h4>關聯專輯 / 現場檔案</h4><div class="v24-linked">${d.albums.map(a=>`<button data-v24-album="${esc(a)}">${esc(a)}<small>跳到唱片室整理</small></button>`).join('')}</div></section>
      <section class="v24-panel"><h4>資料補完任務</h4><div class="v24-archive-list">${d.tasks.map((t,i)=>`<div><time>Task ${String(i+1).padStart(2,'0')}</time><span><b>${esc(t)}</b><p>這是後續正式資料上線前必補項。</p></span></div>`).join('')}</div></section>
      <section class="v24-panel"><h4>來源入口</h4><div class="v24-source">${d.source.map(s=>`<a href="${sourceLinks[s] || '#'}" target="_blank" rel="noopener"><span>${esc(s)}</span><b>↗</b></a>`).join('')}</div></section>`;
    $$('.v24-drawer [data-v24-song]').forEach(b=>b.addEventListener('click',()=>{ setRadio(b.dataset.v24Song, city); toast(`已把「${b.dataset.v24Song}」加入 ${city} 城市歌單視覺`); }));
    $$('.v24-drawer [data-v24-album]').forEach(b=>b.addEventListener('click',()=>{ document.querySelector('[data-nav="albums"]')?.click(); toast(`跳到唱片室：${b.dataset.v24Album}`); }));
    $('.v24-drawer').classList.add('open');
  }

  function shotGradient(city, i){
    const palettes = {
      '台北':['linear-gradient(135deg,#071424,#5beeff,#ff74b8)','linear-gradient(135deg,#10182c,#ffd66b,#5beeff)','linear-gradient(135deg,#27123a,#ff74b8,#f7fdff)'],
      '高雄':['linear-gradient(135deg,#09203f,#ffb347,#ff5f6d)','linear-gradient(135deg,#0b486b,#f56217,#ffe000)','linear-gradient(135deg,#071424,#00c6ff,#f7797d)'],
      '香港':['linear-gradient(135deg,#0f2027,#2c5364,#ff4e88)','linear-gradient(135deg,#141e30,#ffd452,#ff7676)','linear-gradient(135deg,#02111d,#1cb5e0,#ff74b8)'],
      '北京':['linear-gradient(135deg,#23074d,#cc5333,#ffd66b)','linear-gradient(135deg,#101010,#434343,#ffd66b)','linear-gradient(135deg,#1a2a6c,#b21f1f,#fdbb2d)']
    };
    return (palettes[city] || ['linear-gradient(135deg,#071424,#5beeff,#ff74b8)','linear-gradient(135deg,#0b1d2c,#1c7fb4,#f7739a)','linear-gradient(135deg,#24243e,#302b63,#0f0c29)'])[i%3];
  }

  function enhanceDetailCard(){
    const body = $('.detail-body');
    if(!body || $('.v24-city-dossier')) return;
    const box = document.createElement('section');
    box.className = 'v24-city-dossier';
    box.innerHTML = `<div class="v24-tabs"><button class="active" data-tab="archive">檔案</button><button data-tab="setlist">歌單</button><button data-tab="media">照片</button><button data-tab="source">來源</button></div><div class="v24-panel" id="v24InlinePanel"></div><button class="v24-open-dossier" id="v24OpenDossier">打開城市完整檔案 →</button>`;
    body.append(box);
    box.addEventListener('click', e=>{
      const btn = e.target.closest('[data-tab]');
      if(btn){ $$('.v24-tabs button', box).forEach(b=>b.classList.toggle('active', b===btn)); renderInline(btn.dataset.tab); }
    });
    $('#v24OpenDossier')?.addEventListener('click',()=>renderDrawer(currentCity()));
    renderInline('archive');
    const cityNode = $('#detailCity');
    if(cityNode) new MutationObserver(()=>renderInline($('.v24-tabs button.active')?.dataset.tab || 'archive')).observe(cityNode,{childList:true,characterData:true,subtree:true});
  }

  function renderInline(tab){
    const city = currentCity();
    const d = dossierFor(city);
    const panel = $('#v24InlinePanel'); if(!panel) return;
    if(tab === 'archive') panel.innerHTML = `<h4>${esc(city)} 城市檔案</h4><p>${esc(d.mood)}</p><div class="v24-pill-row"><span>${d.visits} 次熱度</span><span>${d.heat}</span><span>${d.score}</span></div>`;
    if(tab === 'setlist') panel.innerHTML = `<h4>建議現場歌單</h4><ul>${d.setlist.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
    if(tab === 'media') panel.innerHTML = `<h4>照片牆需求</h4><ul>${d.shots.map(s=>`<li>${esc(s)}：待接官方 / 場館 / 歌迷公開素材</li>`).join('')}</ul>`;
    if(tab === 'source') panel.innerHTML = `<h4>來源入口</h4><div class="v24-source">${d.source.map(s=>`<a href="${sourceLinks[s] || '#'}" target="_blank" rel="noopener"><span>${esc(s)}</span><b>↗</b></a>`).join('')}</div>`;
  }

  function setRadio(song, city){
    $('#miniTitle') && ($('#miniTitle').textContent = `${song} · ${city} 城市歌單`);
    $('#miniSub') && ($('#miniSub').textContent = 'v24 城市檔案已接到播放器狀態');
    $('#sheetTitle') && ($('#sheetTitle').textContent = `${song} · ${city} 城市歌單`);
    $('#sheetText') && ($('#sheetText').textContent = `這裡會承接 ${city} 站的現場版本、歌單、專輯來源與官方音源入口。`);
  }

  function enhancePages(){
    enhanceAlbumPage(); enhanceSongPage(); enhanceBooksPage(); enhanceTimelinePage(); enhancePlayer();
  }

  function enhanceAlbumPage(){
    const root = $('#albums .v23-product-view, #albums .room-view'); if(!root || root.dataset.v24) return; root.dataset.v24 = '1';
    const div = document.createElement('section'); div.className = 'v24-cross-module';
    div.innerHTML = `<article class="v24-cross-card"><small>LINK TO MAP</small><b>專輯 × 巡演城市</b><p>每張專輯後續都要能看到曾在哪些城市被大量演唱。</p></article><article class="v24-cross-card"><small>ROOM STORY</small><b>早期房間氛圍</b><p>下一步會用木質、海報、CD、樂器、排練室元素繼續深化。</p></article><article class="v24-cross-card"><small>DATA GAP</small><b>封面與曲目來源</b><p>需要把相信音樂、唱片公司與日本官網資料接入。</p></article>`;
    root.append(div);
  }
  function enhanceSongPage(){
    const root = $('#songs .v23-product-view, #songs .library-page'); if(!root || root.dataset.v24) return; root.dataset.v24 = '1';
    const div = document.createElement('section'); div.className = 'v24-cross-module';
    div.innerHTML = `<article class="v24-cross-card"><small>LIVE VERSION</small><b>城市歌單模式</b><p>點擊城市後可自動推薦該站應補的現場歌單。</p></article><article class="v24-cross-card"><small>QUEUE</small><b>播放器隊列</b><p>播放器不再只是底部裝飾，而是每頁都能把歌曲推進去。</p></article><article class="v24-cross-card"><small>MOOD</small><b>按情緒瀏覽</b><p>青春、熱血、末日、慢歌、安可等分類要更完整。</p></article>`;
    root.append(div);
  }
  function enhanceBooksPage(){
    const root = $('#books .v23-product-view, #books .library-page'); if(!root || root.dataset.v24) return; root.dataset.v24 = '1';
    const div = document.createElement('section'); div.className = 'v24-cross-module';
    div.innerHTML = `<article class="v24-cross-card"><small>PUBLICATION</small><b>出版品資料欄位</b><p>每本書都應補出版社、ISBN、年份、封面、內容索引。</p></article><article class="v24-cross-card"><small>TOUR GOODS</small><b>票根與場刊</b><p>巡演城市頁要能掛載場刊、票根、海報與應援品。</p></article><article class="v24-cross-card"><small>COLLECTION</small><b>收藏室視覺</b><p>書籍頁下一步要像收藏櫃，而不是普通列表。</p></article>`;
    root.append(div);
  }
  function enhanceTimelinePage(){
    const root = $('#timeline .v23-product-view, #timeline .library-page'); if(!root || root.dataset.v24) return; root.dataset.v24 = '1';
    const div = document.createElement('section'); div.className = 'v24-stage-flow';
    div.innerHTML = [
      ['1997','成軍起點','建立樂團人物、校園、Live House 章節。'],
      ['1999','首專與巡演','連到唱片室第一張專輯與早期城市。'],
      ['2011','第二人生 / 諾亞方舟','世界觀與大型巡演章節。'],
      ['2023–2026','5525 熱度地圖','每站做城市檔案、照片牆、歌單與場館資料。']
    ].map(x=>`<article><time>${x[0]}</time><span><b>${x[1]}</b><p>${x[2]}</p></span></article>`).join('');
    root.append(div);
  }
  function enhancePlayer(){
    const sheet = $('.sheet-copy'); if(!sheet || $('.v24-player-pro')) return;
    const div = document.createElement('section'); div.className = 'v24-player-pro';
    div.innerHTML = `<i></i><span><b>播放器產品化方向</b><p>播放器要承接城市歌單、專輯曲目、巡演現場版本；目前先完成 UI 狀態與跨頁觸發，正式音源需後續合法來源。</p></span>`;
    sheet.append(div);
  }

  function hookNavigation(){
    $$('[data-nav]').forEach(btn=>btn.addEventListener('click',()=>setTimeout(enhancePages,80)));
    $('#globalSearch')?.addEventListener('input', e=>{
      const q = e.target.value.trim();
      const city = Object.keys(cityDossiers).find(c=>c.includes(q));
      if(q.length >= 1 && city){ renderDrawer(city); }
    });
  }

  function init(){
    document.querySelector('.md-app')?.classList.add('v24');
    addCommand(); createDrawer(); enhanceDetailCard(); enhancePages(); hookNavigation();
    setTimeout(()=>{ enhanceDetailCard(); enhancePages(); }, 1000);
  }
  document.addEventListener('DOMContentLoaded', init);
})();