(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c));

  const sourceMatrix = [
    {area:'官方身份與作品', status:'可引用', owner:'相信音樂 / Mayday.jp', url:'https://www.bin-music.com.tw/artist/MAYDAY', next:'補完整藝人介紹、作品索引、官方作品圖。'},
    {area:'5525 台北大巨蛋', status:'可引用', owner:'相信音樂新聞', url:'https://www.bin-music.com.tw/news/2409', next:'拆出台北 5525+2 專題頁、日期、場館、交通。'},
    {area:'5525 起跑與跨年', status:'可引用', owner:'相信音樂新聞', url:'https://www.bin-music.com.tw/news/1985', next:'補台中 2023–2026 年度線與跨年視覺。'},
    {area:'專輯 Discography', status:'可引用', owner:'Mayday.jp', url:'https://www.mayday.jp/discography/', next:'補專輯封面、發行年份、曲目和海外作品入口。'},
    {area:'逐站歌單', status:'缺口', owner:'待整理', url:'#', next:'每站至少建立主歌單、安可、特殊曲、資料來源。'},
    {area:'官方照片 / 場館圖', status:'缺口', owner:'待授權 / 公開來源', url:'#', next:'優先建立城市照片牆素材位與來源標記。'}
  ];

  const cityEvidence = {
    '台北': {score:68, gaps:['官方大巨蛋主視覺圖','逐日歌單','交通與拍照點','票務頁備份'], now:['城市檔案已建立','5525+2 source link 已放入','歌單可推送播放器']},
    '台中': {score:64, gaps:['跨年視覺','2023 起跑專題','洲際棒球場照片','逐日場次'], now:['起跑城市已標記','熱度高權重','跨年任務已列出']},
    '高雄': {score:62, gaps:['世運主場館官方圖','五場完整歌單','港都夜景照片','場館交通'], now:['大型戶外場定位完成','熱度圖已加權','城市檔案已建立']},
    '香港': {score:60, gaps:['中環海濱照片','維港視覺','官方票務資料','海外站整理'], now:['海港城市敘事已加入','歌單與相簿位已建立']},
    '北京': {score:59, gaps:['鳥巢官方場館圖','2026 場次核對','收官專題','票務/交通'], now:['超大型場定位完成','熱度排行已加入']},
    '上海': {score:60, gaps:['上海多場次日曆','城市夜景官方素材','體育場交通','歌單補完'], now:['連場都市節點已加入','高熱度標記已加入']}
  };
  const defaultEvidence = {score:56,gaps:['官方照片','完整日期','逐站歌單','場館交通'],now:['城市檔案底稿已建立','熱度圖已加入','可繼續掛載來源']};

  function toast(text){
    let el = $('.v25-toast');
    if(!el){ el = document.createElement('div'); el.className='v25-toast'; document.body.append(el); }
    el.textContent = text; el.classList.add('show');
    clearTimeout(el._t); el._t = setTimeout(()=>el.classList.remove('show'), 1800);
  }

  function gate(){
    const views = $('.views');
    if(!views || $('.v25-gate')) return;
    const div = document.createElement('section');
    div.className = 'v25-gate';
    div.innerHTML = `
      <article><small>85 GATE · NOT READY</small><b>目前仍低於 85 分</b><p>不再高估分數。85 分前持續迭代：先補資料可信度、城市深度、素材缺口和跨頁聯動。</p><div class="v25-meter" style="--v:64%"><i></i></div></article>
      <article><small>MAP</small><b>熱度 + 真地圖</b><p>接近地圖產品，但還要補真實照片和逐站檔案。</p></article>
      <article><small>CITY</small><b>城市專題</b><p>每個點位需要變成可讀、可查、可擴充的頁。</p></article>
      <article><small>SOURCE</small><b>來源矩陣</b><p>官方資料、待補項、缺口全部可見。</p></article>
      <article><small>NEXT</small><b>素材管線</b><p>封面、場館、票根、場刊、歌單要逐步補齊。</p></article>`;
    views.prepend(div);
  }

  function addMapHud(){
    const scene = $('#mapScene');
    if(!scene || $('.v25-map-hud')) return;
    const hud = document.createElement('div');
    hud.className = 'v25-map-hud';
    hud.innerHTML = `<span>85 分門檻：未達</span><span>底圖：真實瓦片</span><span>熱度：到訪次數加權</span><span>缺口：官方照片 / 逐站歌單</span>`;
    scene.append(hud);
  }

  function currentCity(){ return $('#detailCity')?.textContent?.trim() || '台北'; }
  function evidenceFor(city){ return cityEvidence[city] || defaultEvidence; }

  function renderEvidence(){
    const body = $('#detailCard .detail-body');
    if(!body) return;
    let box = $('.v25-dossier', body);
    if(!box){ box = document.createElement('section'); box.className='v25-dossier'; body.append(box); }
    const city = currentCity();
    const ev = evidenceFor(city);
    box.innerHTML = `<h3>${esc(city)} · 完成度與來源檢查</h3>
      <div class="v25-meter" style="--v:${ev.score}%"><i></i></div>
      <div class="v25-tabs"><button class="active" data-v25-tab="now">已完成</button><button data-v25-tab="gaps">待補缺口</button><button data-v25-tab="sources">來源矩陣</button><button data-v25-open>完整資料管線</button></div>
      <div class="v25-panel" data-v25-panel>${renderList(ev.now)}</div>`;
    box.querySelectorAll('[data-v25-tab]').forEach(btn => btn.addEventListener('click', () => {
      box.querySelectorAll('[data-v25-tab]').forEach(b=>b.classList.toggle('active', b===btn));
      const panel = box.querySelector('[data-v25-panel]');
      const tab = btn.dataset.v25Tab;
      if(tab === 'now') panel.innerHTML = renderList(ev.now);
      if(tab === 'gaps') panel.innerHTML = renderList(ev.gaps);
      if(tab === 'sources') panel.innerHTML = `<div class="v25-source-grid">${sourceMatrix.slice(0,4).map(sourceCard).join('')}</div>`;
    }));
    box.querySelector('[data-v25-open]')?.addEventListener('click', openDrawer);
  }
  function renderList(items){ return `<ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`; }
  function sourceCard(s){ return `<article class="v25-source"><small>${esc(s.status)}</small><b>${esc(s.area)}</b><p>${esc(s.next)}</p>${s.url==='#'?'<em>待補來源</em>':`<a href="${esc(s.url)}" target="_blank" rel="noopener">打開來源</a>`}</article>`; }

  function openDrawer(){
    let d = $('.v25-drawer');
    if(!d){
      d = document.createElement('section'); d.className='v25-drawer';
      d.innerHTML = `<div class="v25-drawer-inner"><div class="v25-drawer-head"><div><small class="section-kicker">SOURCE / ASSET PIPELINE</small><h2>Maydayland 85 分前資料補完管線</h2><p>把目前所有「看起來像 demo」的地方拆成可執行清單：來源、素材、城市、歌單、場館、出版品。</p></div><button class="v25-close" aria-label="關閉">×</button></div><div class="v25-matrix">${sourceMatrix.map(s=>`<article><b>${esc(s.area)}</b><p>${esc(s.next)}</p><small>${esc(s.owner)} · ${esc(s.status)}</small>${s.url==='#'?'<p>尚未掛載可靠來源</p>':`<a href="${esc(s.url)}" target="_blank" rel="noopener">查看來源</a>`}</article>`).join('')}</div></div>`;
      document.body.append(d);
      d.querySelector('.v25-close').addEventListener('click',()=>d.classList.remove('show'));
      d.addEventListener('click', e => { if(e.target === d) d.classList.remove('show'); });
    }
    d.classList.add('show');
  }

  function enhancePages(){
    const data = {
      albums:['補官方封面與發行資訊','建立專輯 ↔ 巡演 ↔ 歌曲關係','給每張專輯增加來源與曲目完整度'],
      songs:['每個主題歌單補來源','建立城市站點歌單','播放器接入可用音源前先保證隊列邏輯'],
      books:['補 ISBN / 出版社 / 封面','區分書籍、樂譜、場刊、票根','和城市頁掛接場刊與票根'],
      timeline:['補官方事件來源','把 1997–2026 拆成可點擊專題','和地圖、專輯、歌曲互相跳轉']
    };
    Object.entries(data).forEach(([id,items])=>{
      const root = document.getElementById(id); if(!root || root.querySelector('.v25-page-card')) return;
      const card = document.createElement('section'); card.className='v25-page-card';
      card.innerHTML = `<small class="section-kicker">85 GATE MODULE</small><h3>${titleFor(id)} · 待升級管線</h3><p>這一頁仍未達 85 分，以下是下一步必須補到正式產品感的內容。</p><div class="v25-roadmap">${items.map((x,i)=>`<div><b>Step ${i+1}</b><span>${esc(x)}</span></div>`).join('')}</div>`;
      root.append(card);
    });
  }
  function titleFor(id){ return {albums:'時光唱片室',songs:'歌曲宇宙',books:'書籍出版',timeline:'歷程展覽牆'}[id] || id; }

  function wireSearch(){
    const input = $('#globalSearch');
    if(!input) return;
    input.addEventListener('keydown', e => {
      if(e.key !== 'Enter') return;
      const q = input.value.trim();
      if(!q) return;
      if(Object.keys(cityEvidence).some(c=>q.includes(c))){ renderEvidence(); openDrawer(); toast('已打開城市與來源補完管線'); }
    });
  }

  function observeDetail(){
    const city = $('#detailCity');
    if(city){ new MutationObserver(renderEvidence).observe(city,{childList:true,subtree:true}); }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.md-app')?.classList.add('v25');
    gate(); addMapHud(); renderEvidence(); enhancePages(); wireSearch(); observeDetail();
    $('#mapTitle') && ($('#mapTitle').textContent = '回到那一天 · 熱度追蹤與城市檔案');
    $('.tour-rail p') && ($('.tour-rail p').textContent = 'v25 進入 85 分前資料補完：每個城市都要有來源、素材缺口、歌單、照片牆、場館與補完任務。');
  });
})();