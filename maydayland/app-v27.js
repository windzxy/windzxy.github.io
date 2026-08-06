(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c));

  const cities = [
    {city:'台北', venue:'台北大巨蛋 / 台北小巨蛋', visits:26, level:'核心主場', years:'1999–2026', score:72, source:'https://www.bin-music.com.tw/news/2409', mood:'25 週年收官、台灣主場、大型場館記憶核心。', palette:'linear-gradient(135deg,#102a46,#2186b8,#ff74b8)', set:['回到那一天','倔強','突然好想你','知足','乾杯'], shots:['大巨蛋外觀','小巨蛋歷史','票根場刊'], albums:['神的孩子都在跳舞','知足 最真傑作選','自傳'], tasks:['核對逐日場次','補官方主視覺','補交通與拍照點','補逐日歌單']},
    {city:'台中', venue:'洲際棒球場', visits:14, level:'起跑 / 跨年', years:'2023–2026', score:68, source:'https://www.bin-music.com.tw/news/1985', mood:'5525 起跑與跨年敘事，適合做成年度專題。', palette:'linear-gradient(135deg,#123755,#35a88e,#ffd66b)', set:['派對動物','OAOA','倔強','乾杯'], shots:['棒球場夜景','跨年煙火','歌迷入場'], albums:['自傳','第二人生','5525 Live Archive'], tasks:['補起跑場圖牆','整理跨年節點','補場館交通','補年度時間線']},
    {city:'高雄', venue:'高雄世運主場館', visits:12, level:'戶外大場', years:'2024', score:64, source:'#', mood:'世運主場館、港都夜景和大型戶外舞台。', palette:'linear-gradient(135deg,#12304d,#168bc4,#ff9a56)', set:['離開地球表面','戀愛ing','溫柔','乾杯'], shots:['世運主場館','港口夜色','舞台遠景'], albums:['為愛而生','後青春期的詩','5525 Live Archive'], tasks:['補五場歌單','補世運照片','補交通資料','補港都旅遊延伸']},
    {city:'香港', venue:'中環海濱活動空間', visits:10, level:'海港海外線', years:'2024', score:62, source:'#', mood:'維港、海風、城市天際線，是海外華語場景的高記憶點。', palette:'linear-gradient(135deg,#071424,#3374b6,#c96dff)', set:['知足','突然好想你','倔強','溫柔'], shots:['維港夜景','中環海濱','海外應援'], albums:['知足 最真傑作選','後青春期的詩','5525 Live Archive'], tasks:['補官方票務','補維港照片','補交通路線','整理海外線']},
    {city:'上海', venue:'上海體育場', visits:9, level:'連場都市', years:'2024', score:61, source:'#', mood:'都市密度、連場演出和夜景霓虹，是巡演高頻城市之一。', palette:'linear-gradient(135deg,#10243d,#26709a,#ff74b8)', set:['派對動物','夜訪吸血鬼','傷心的人別聽慢歌','乾杯'], shots:['上海體育場','城市夜景','地鐵交通'], albums:['自傳','第二人生','5525 Live Archive'], tasks:['整理多場日曆','補城市夜景','補交通座位','補特殊曲']},
    {city:'北京', venue:'國家體育場 鳥巢', visits:8, level:'超大型場', years:'2024–2026', score:60, source:'#', mood:'鳥巢級大型場館，適合做成北方收官與大型場專題。', palette:'linear-gradient(135deg,#291733,#9340c9,#ffd66b)', set:['諾亞方舟','成名在望','頑固','倔強'], shots:['鳥巢夜景','超大舞台','城市道路'], albums:['第二人生','自傳','5525 Live Archive'], tasks:['核對 2026 場次','補鳥巢官方圖','補收官專題','補票務交通']}
  ];
  const albumColors = {
    '神的孩子都在跳舞':'linear-gradient(135deg,#30224b,#de5a91,#ffd46c)',
    '知足 最真傑作選':'linear-gradient(135deg,#163a50,#e6d4a8,#d45e83)',
    '自傳':'linear-gradient(135deg,#0e2028,#2a5365,#f7971e)',
    '第二人生':'linear-gradient(135deg,#181d2f,#4a7aff,#f5d365)',
    '5525 Live Archive':'linear-gradient(135deg,#071424,#5beeff,#ff74b8)',
    '為愛而生':'linear-gradient(135deg,#273a55,#f0cf6c,#55b7a5)',
    '後青春期的詩':'linear-gradient(135deg,#233949,#4f7fa5,#f0c17d)'
  };
  let active = cities[0];

  function toast(text){
    let el = $('.v27-toast');
    if(!el){ el = document.createElement('div'); el.className='v26-toast v27-toast'; document.body.append(el); }
    el.textContent = text; el.classList.add('show');
    clearTimeout(el._t); el._t = setTimeout(()=>el.classList.remove('show'), 1700);
  }

  function install(){
    document.querySelector('.md-app')?.classList.add('v27');
    const tour = $('#tour');
    if(!tour || $('.v27-landing')) return;
    const landing = document.createElement('section');
    landing.className = 'v27-landing';
    tour.append(landing);
    render(landing, active);
    hookExternalClicks(landing);
  }

  function render(root, c){
    active = c;
    root.innerHTML = `
      <div class="v27-mobile-bar">手機端已改成單欄：城市專題、歌單、照片牆和來源牆會按閱讀順序排列。</div>
      <div class="v27-hero">
        <div>
          <span class="v27-kicker">CITY LANDING PAGE · 85 GATE BUILD</span>
          <h2>${esc(c.city)} 巡演城市專題</h2>
          <p>${esc(c.mood)} 這一輪把城市從「地圖上的一個點」升級成正式娛樂網站的 Landing Page，後續可以接官方照片、票根、場刊、交通、逐日歌單和應援資料。</p>
          <div class="v27-stats"><span><b>${c.visits}</b>估算到訪熱度</span><span><b>${c.score}%</b>目前完成度</span><span><b>${esc(c.years)}</b>年份跨度</span><span><b>${esc(c.level)}</b>城市定位</span></div>
          <div class="v27-actions"><button data-v27-play>推送城市歌單</button><button class="secondary" data-v27-map>回到地圖定位</button>${c.source !== '#' ? `<a href="${esc(c.source)}" target="_blank" rel="noopener">官方來源</a>` : '<a class="secondary" href="#">來源待補</a>'}</div>
        </div>
        <div class="v27-stage" style="background:${c.palette}"><div class="v27-stage-label"><span class="v27-kicker">VENUE HERO SLOT</span><b>${esc(c.venue)}</b><small>此區後續替換為官方場館/主視覺/演唱會照片。</small></div></div>
      </div>
      <div class="v27-city-tabs">${cities.map(x=>`<button class="${x.city===c.city?'active':''}" data-v27-city="${esc(x.city)}">${esc(x.city)} · ${x.visits}</button>`).join('')}</div>
      <div class="v27-content">
        <section class="v27-panel"><h3>逐站歌單表</h3><div class="v27-setlist">${c.set.map((s,i)=>`<div class="v27-track"><i>${i+1}</i><b>${esc(s)}</b><button data-v27-track="${esc(s)}">播放</button></div>`).join('')}</div></section>
        <section class="v27-panel"><h3>場館照片牆需求</h3><div class="v27-gallery">${c.shots.map(s=>`<div class="v27-shot" style="background:${c.palette}">${esc(s)}</div>`).join('')}</div></section>
        <section class="v27-panel"><h3>關聯專輯牆</h3><div class="v27-album-strip">${c.albums.map(a=>`<div class="v27-album" style="--c:${albumColors[a]||c.palette}">${esc(a)}</div>`).join('')}</div></section>
        <section class="v27-panel"><h3>補完 Roadmap</h3><div class="v27-roadmap">${c.tasks.map((t,i)=>`<span><b>STEP ${i+1}</b>${esc(t)}</span>`).join('')}</div></section>
        <section class="v27-panel"><h3>來源牆</h3><div class="v27-source">${c.source !== '#' ? `<a href="${esc(c.source)}" target="_blank" rel="noopener">${esc(c.city)} 主要官方資料入口 <b>↗</b></a>` : '<span>此城市官方照片 / 票務 / 歌單來源待補</span>'}<a href="https://www.bin-music.com.tw/artist/MAYDAY" target="_blank" rel="noopener">相信音樂 五月天藝人專區 <b>↗</b></a><a href="https://www.mayday.jp/discography/" target="_blank" rel="noopener">Mayday.jp Discography <b>↗</b></a></div></section>
        <section class="v27-panel"><h3>85 分前判斷</h3><p>這個城市頁還不能算完成，因為官方圖片、逐日歌單、票根場刊與場館交通尚未完全補齊。v27 先把正式頁面結構搭起來，後續逐站填充真實資料。</p></section>
      </div>`;
    root.querySelectorAll('[data-v27-city]').forEach(btn => btn.addEventListener('click', () => render(root, cities.find(x=>x.city===btn.dataset.v27City) || c)));
    root.querySelector('[data-v27-play]')?.addEventListener('click', () => pushPlaylist(c));
    root.querySelector('[data-v27-map]')?.addEventListener('click', () => {
      $('#globalSearch') && ($('#globalSearch').value = c.city);
      $('#globalSearch')?.dispatchEvent(new Event('input', {bubbles:true}));
      toast(`已定位 ${c.city}`);
    });
    root.querySelectorAll('[data-v27-track]').forEach(btn => btn.addEventListener('click', () => playTrack(btn.dataset.v27Track, c.city)));
  }

  function pushPlaylist(c){
    c.set.forEach((s,i)=>setTimeout(()=>playTrack(s,c.city), i ? 120 : 0));
    toast(`${c.city} 城市歌單已推送到播放器`);
  }
  function playTrack(song, city){
    $('#miniTitle') && ($('#miniTitle').textContent = `${song} · ${city} 現場頁`);
    $('#miniSub') && ($('#miniSub').textContent = 'v27 城市 Landing Page 歌單聯動');
    $('#sheetTitle') && ($('#sheetTitle').textContent = `${song} · ${city}`);
    $('#sheetText') && ($('#sheetText').textContent = `此曲已從 ${city} 城市專題推送，後續可接真實音源、逐站歌單與現場版本。`);
  }
  function hookExternalClicks(root){
    document.addEventListener('click', e => {
      const text = e.target?.textContent?.trim();
      const city = cities.find(c => text?.includes(c.city));
      if(city && !e.target.closest('.v27-landing')){
        render(root, city);
      }
    });
    const input = $('#globalSearch');
    input?.addEventListener('input', () => {
      const q = input.value.trim();
      const city = cities.find(c => q && c.city.includes(q));
      if(city) render(root, city);
    });
  }

  document.addEventListener('DOMContentLoaded', () => setTimeout(install, 500));
})();