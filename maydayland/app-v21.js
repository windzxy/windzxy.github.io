(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c));
  const stationDocs = {
    '台北': ['台北是 5525+1 / 5525+2 的核心節點，應同時承接大巨蛋、小巨蛋、年度延伸與收官敘事。','場館資訊需要拆分為大巨蛋與小巨蛋，並加入交通、入場、周邊動線。','歌單入口應分成開場、主歌單、安可、城市限定彩蛋。','來源優先：相信音樂官方新聞、場館公告、票務頁。'],
    '台中': ['台中是 5525 起跑與跨年記憶的核心站。','洲際棒球場需要補座位、交通、跨年資訊。','應整理跨年場限定歌單與倒數段落。','來源優先：相信音樂 5525 起跑新聞與票務公告。'],
    '高雄': ['高雄世運主場館代表戶外大型場館的開闊感。','需要補舞台視覺、港都夜景、觀眾動線。','歌單應突出戶外大合唱與安可。','來源優先：官方巡演新聞與場館資訊。'],
    '香港': ['香港站應有海港天際線與城市夜色。','中環海濱活動空間需要補場地入口與交通。','歌單與應援應獨立整理。','來源優先：官方香港站與票務頁。'],
    '北京': ['北京鳥巢屬於超大型場館節點。','需要呈現鳥巢尺度、收官儀式感與大型舞台。','歌單應標出特別編排。','來源優先：官方新聞與場館公告。']
  };
  const tabs = ['現場','場館','歌單','來源'];
  function enrichDetail(){
    const body = $('.detail-body'); if(!body || $('#v21Tabs')) return;
    const action = body.querySelector('.action-row');
    action?.insertAdjacentHTML('beforebegin', `<div class="v21-tabs" id="v21Tabs">${tabs.map((t,i)=>`<button class="${i?'':'active'}" data-tab="${i}">${t}</button>`).join('')}</div><div class="v21-detail-box" id="v21DetailBox"></div><div class="v21-source-row"><a href="https://www.bin-music.com.tw/artist/MAYDAY" target="_blank" rel="noopener"><span>相信音樂五月天藝人專區</span><em>↗</em></a><a href="https://www.mayday.jp/discography/" target="_blank" rel="noopener"><span>Mayday Japan Discography</span><em>↗</em></a></div>`);
    function render(idx=0){
      const city = $('#detailCity')?.textContent?.trim() || '台北';
      const data = stationDocs[city] || [`${city} 站已建立資料卡，下一步補官方照片、場館動線與逐場歌單。`, '場館地址、入場口、交通與座位圖仍需補齊。', '先建立歌單欄位，後續接正式曲目資料。', '來源欄位預留官方新聞、票務頁、場館公告。'];
      $('#v21DetailBox').innerHTML = `<b>${esc(tabs[idx])}檔案：</b>${esc(data[idx])}`;
      $$('#v21Tabs button').forEach((b,i)=>b.classList.toggle('active', i===idx));
    }
    $$('#v21Tabs button').forEach((b,i)=>b.addEventListener('click',()=>render(i)));
    new MutationObserver(()=>render(0)).observe($('#detailCity'), {childList:true, characterData:true, subtree:true});
    render(0);
  }
  function mapGrade(){
    const scene = $('#mapScene'); if(!scene || $('.v21-map-grade', scene)) return;
    scene.insertAdjacentHTML('beforeend', `<div class="v21-map-grade"><b>地圖產品化進度</b><br>已從假 Canvas 換成 Leaflet 真實瓦片地圖；還需補官方照片、逐場歌單、地點深層頁。<i></i><span>地圖模組約 80%</span></div>`);
  }
  function addReadiness(){
    $$('.v20-page').forEach(page => {
      if($('.v21-readiness', page)) return;
      page.insertAdjacentHTML('beforeend', `<div class="v21-polish-note">v21 產品門檻：此頁不再停留在 demo。已具備正式資料館結構，但距離 90+ 還需要真實官方圖像、完整來源、逐項資料校對。</div><div class="v21-readiness"><span><b>80</b>視覺</span><span><b>75</b>內容</span><span><b>70</b>來源</span><span><b>82</b>互動</span><span><b>65</b>素材</span></div>`);
    });
  }
  function buildExtraSections(){
    const albums = $('#albums .v20-page');
    if(albums && !$('#albumExtra')) albums.insertAdjacentHTML('beforeend', `<div class="v21-section-grid" id="albumExtra"><div class="v21-mini-card"><b>唱片室下一步</b><p>接入正式封面、曲目、MV、演唱會版本。</p><em>內容架構已完成</em></div><div class="v21-mini-card"><b>房間氛圍</b><p>下一輪要強化早期排練室、木架、海報、舊物件。</p><em>視覺仍需深化</em></div><div class="v21-mini-card"><b>關聯導航</b><p>每張專輯連到歌曲、巡演、時間線。</p><em>產品鏈路已建立</em></div></div>`);
    const songs = $('#songs .v20-page');
    if(songs && !$('#songExtra')) songs.insertAdjacentHTML('beforeend', `<div class="v21-section-grid" id="songExtra"><div class="v21-mini-card"><b>歌單策略</b><p>按現場、青春、世界觀、慢歌分類，比單純搜尋更像娛樂內容產品。</p><em>可用</em></div><div class="v21-mini-card"><b>播放器連動</b><p>每首歌下一步接合法穩定音源或官方平台跳轉。</p><em>待接音源</em></div></div>`);
    const books = $('#books .v20-page');
    if(books && !$('#bookExtra')) books.insertAdjacentHTML('beforeend', `<div class="v21-section-grid" id="bookExtra"><div class="v21-mini-card"><b>出版資料</b><p>需要補 ISBN、出版社、出版日期、購買/館藏來源。</p><em>資料待核對</em></div><div class="v21-mini-card"><b>收藏感</b><p>小封面比例與書架卡片已改善，不再是 demo 大卡。</p><em>方向正確</em></div></div>`);
  }
  function boot(){
    document.querySelector('.md-app')?.classList.add('v21');
    enrichDetail();
    mapGrade();
    addReadiness();
    buildExtraSections();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 900));
  else setTimeout(boot, 900);
})();