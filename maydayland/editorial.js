(() => {
  'use strict';
  if (document.getElementById('mdlEditorial')) return;

  const albumData = [
    ['1999','五月天第一張創作專輯','五月天 第一張創作專輯'],
    ['2000','愛情萬歲','五月天 愛情萬歲'],
    ['2001','人生海海','五月天 人生海海'],
    ['2003','時光機','五月天 時光機'],
    ['2004','神的孩子都在跳舞','五月天 神的孩子都在跳舞'],
    ['2006','為愛而生','五月天 為愛而生'],
    ['2008','後青春期的詩','五月天 後青春期的詩'],
    ['2011','第二人生','五月天 第二人生'],
    ['2016','自傳','五月天 自傳']
  ];

  const members = [
    ['VOCAL / SONGWRITING','信','阿信','主唱與主要詞曲創作。以貼近日常的敘事、青春與生命議題，建立五月天最具辨識度的文字世界。'],
    ['LEADER / GUITAR','怪','怪獸','團長與吉他手。承接編曲、製作與現場能量，是五月天搖滾骨架的重要核心。'],
    ['GUITAR','石','石頭','吉他手。細膩而具層次的音色，讓抒情與搖滾之間形成更寬廣的情緒景深。'],
    ['BASS','莎','瑪莎','貝斯手。節奏線條與舞台觀點鮮明，「MAYDAY」團名亦源自他曾使用的網路代號。'],
    ['DRUMS','佑','冠佑','鼓手。經典五人陣容確立後，以穩定而強勁的節奏支撐大型現場的推進力。']
  ];

  const timeline = [
    ['1997','成軍與野台開唱','樂團前身 So Band 為參加野台開唱改名「五月天」，3 月 29 日成為重要的成軍紀念日。'],
    ['1999','首張創作專輯','發行《五月天第一張創作專輯》，阿信、怪獸、石頭、瑪莎、冠佑的經典陣容在這一時期確立。'],
    ['2000–2004','作品與現場迅速成長','《愛情萬歲》《人生海海》《時光機》《神的孩子都在跳舞》等作品，逐步擴張樂團聲音與演出規模。'],
    ['2006','相信音樂時期','參與成立相信音樂，從創作、演出到產業製作，開始建立更完整的音樂品牌與內容體系。'],
    ['2008–2011','世代共鳴與主題深化','《後青春期的詩》《第二人生》把青春、成長、環境與終極提問帶入更大型的流行敘事。'],
    ['2016 → NOW','自傳與持續巡演','《自傳》回望樂團與歌迷共同成長的時間，此後持續以巡演、影像與跨界合作延伸五月天世界。']
  ];

  const overlay = document.createElement('section');
  overlay.id = 'mdlEditorial';
  overlay.className = 'mdl-editorial';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <header class="mdl-ed-top">
      <div class="mdl-ed-brand"><i>M</i><span><b>MAYDAYLAND EDITORIAL</b><span>五月天樂團誌 · 非官方內容企劃</span></span></div>
      <button class="mdl-ed-close" type="button" aria-label="關閉樂團誌">×</button>
    </header>
    <main>
      <section class="mdl-ed-hero mdl-ed-shell">
        <div>
          <p class="mdl-ed-kicker">BAND / MUSIC / ERA / LIVE</p>
          <h1>五月天<em>樂團誌</em></h1>
          <p class="mdl-ed-lead">不只整理年份與作品，而是以娛樂產業內容策劃的方式，把人物、專輯、現場與時代背景串成可以持續閱讀的五月天文化入口。</p>
          <div class="mdl-ed-actions"><button class="primary" type="button" data-ed-search="五月天">回到播放器聽歌</button><button type="button" data-ed-scroll="#mdlFormation">閱讀成團故事</button></div>
        </div>
        <div class="mdl-ed-visual" aria-hidden="true"><span class="mdl-ed-orbit-dot"></span><div class="mdl-ed-poster"><small>TAIPEI · 1997</small><b>MAY<br>DAY</b><small>FROM SO BAND TO THE WORLD</small></div></div>
      </section>

      <section class="mdl-ed-section mdl-ed-shell" id="mdlFormation">
        <div class="mdl-ed-head"><div><span class="mdl-ed-label">FORMATION / 1997</span><h2>從校園排練室，走向華語樂壇的大舞台</h2></div><p>首版以公開可核對資料建立內容骨架；後續可逐步擴充巡演、獎項、影像作品、重要合作、造型與舞台製作檔案。</p></div>
        <article class="mdl-ed-feature"><span class="mdl-ed-no">01</span><div class="mdl-ed-feature-copy"><h3>「五月天」從一個網路代號，變成一代人的共同語言</h3><p>樂團前身為學生時期組成的 So Band。1997 年為了報名野台開唱，他們使用瑪莎在網路論壇上的代號「MAYDAY」作為團名；3 月 29 日也因此成為重要的成軍紀念日。其後，阿信、怪獸、石頭、瑪莎與冠佑組成大眾熟悉的五人陣容。</p><div class="mdl-ed-stats"><span><b>1997.03.29</b><span>成軍紀念日</span></span><span><b>5</b><span>經典五人陣容</span></span><span><b>1999</b><span>首張創作專輯</span></span></div></div><div class="mdl-ed-side-poster" aria-hidden="true"><span>SO BAND</span><b>MAY<br>DAY</b><small>ROCK / LIFE / LOVE</small></div></article>
      </section>

      <section class="mdl-ed-section mdl-ed-shell">
        <div class="mdl-ed-head"><div><span class="mdl-ed-label">THE FIVE</span><h2>五個位置，一個共同聲音</h2></div><p>以角色與音樂功能為主，而不是堆砌私人資料；後續可加入各自創作、製作、樂器與代表現場專題。</p></div>
        <div class="mdl-members">${members.map(m => `<article class="mdl-member"><span class="mdl-member-code">${m[0]}</span><div class="mdl-member-mark">${m[1]}</div><h3>${m[2]}</h3><p>${m[3]}</p></article>`).join('')}</div>
      </section>

      <section class="mdl-ed-section mdl-ed-shell">
        <div class="mdl-ed-head"><div><span class="mdl-ed-label">CAREER TIMELINE</span><h2>樂團旅程</h2></div><p>關鍵節點先作為導航，未來每一段都能展開成完整文章、演出檔案與作品關聯圖。</p></div>
        <div class="mdl-timeline">${timeline.map(t => `<article><time>${t[0]}</time><div><b>${t[1]}</b><p>${t[2]}</p></div></article>`).join('')}</div>
      </section>

      <section class="mdl-ed-section mdl-ed-shell">
        <div class="mdl-ed-head"><div><span class="mdl-ed-label">STUDIO ALBUMS</span><h2>創作專輯索引</h2></div><p>點擊專輯即可關閉樂團誌，回到音樂台搜尋相關歌曲。後續會逐張增加製作背景、曲目故事、MV 與巡演關聯。</p></div>
        <div class="mdl-albums">${albumData.map((a,i) => `<button type="button" class="mdl-album" data-ed-search="${a[2]}"><span>${a[0]}</span><b>${a[1]}</b><small>${String(i+1).padStart(2,'0')}</small></button>`).join('')}</div>
      </section>

      <section class="mdl-ed-section mdl-ed-shell">
        <div class="mdl-ed-credit"><i>♫</i><div><span class="mdl-ed-label">MUSIC SOURCE</span><h3>感謝 GD 音樂台提供歌源服務</h3><p>播放器透過 <a href="https://music.gdstudio.xyz/" target="_blank" rel="noopener noreferrer">music.gdstudio.xyz</a> 的公開服務即時取得搜尋、音訊與封面資料。Maydayland 只提供前端介面，不託管、不轉售音樂內容。</p></div></div>
        <div class="mdl-ed-sources"><article><b>互動參考</b><p>播放器功能與資訊架構參考開源專案 <a href="https://github.com/akudamatata/Solara" target="_blank" rel="noopener noreferrer">Solara</a>，Maydayland 的品牌與視覺重新設計。</p></article><article><b>內容資料</b><p>成團與作品資料參考五月天／相信音樂官方渠道、Apple Music 藝人與專輯頁等公開資料，並持續校對。</p></article><article><b>權利說明</b><p>歌曲、封面、藝人名稱及相關內容權利歸原權利人所有；本頁為非官方、非商業的樂迷內容整理。</p></article></div>
      </section>
    </main>
    <footer class="mdl-ed-footer mdl-ed-shell"><span>Maydayland · 非官方五月天內容企劃</span><span>Music makes the planet turn.</span></footer>`;
  document.body.appendChild(overlay);

  const rail = document.querySelector('.rail');
  const spacer = rail?.querySelector('.spacer');
  if (rail && spacer) {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'nav mdl-editorial-trigger';
    trigger.title = '五月天樂團誌';
    trigger.textContent = '★';
    spacer.before(trigger);
    trigger.addEventListener('click', open);
  }

  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileNav) {
    const mobileButton = document.createElement('button');
    mobileButton.type = 'button';
    mobileButton.className = 'mdl-mobile-story';
    mobileButton.innerHTML = '★<br>樂團誌';
    mobileNav.insertBefore(mobileButton, mobileNav.lastElementChild);
    mobileButton.addEventListener('click', open);
  }

  const infoBody = document.querySelector('.info-body');
  if (infoBody) {
    const block = document.createElement('div');
    block.innerHTML = '<div class="label">五月天內容</div><button type="button" class="mdl-story-link"><b>打開五月天樂團誌</b><span>成團、團員、作品與樂團年表</span></button><div class="label">內容參考</div><div class="card"><div class="note">Apple Music · 五月天藝人與專輯頁</div><div class="note">五月天／相信音樂官方公開渠道</div><div class="note">播放器互動參考 Solara 開源專案</div></div>';
    infoBody.appendChild(block);
    block.querySelector('.mdl-story-link').addEventListener('click', open);
  }

  function open() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    overlay.scrollTop = 0;
  }

  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }

  function search(query) {
    const input = document.getElementById('query');
    const form = document.getElementById('searchForm');
    if (!input || !form) return;
    input.value = query;
    close();
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }

  overlay.querySelector('.mdl-ed-close').addEventListener('click', close);
  overlay.addEventListener('click', event => {
    const searchButton = event.target.closest('[data-ed-search]');
    if (searchButton) search(searchButton.dataset.edSearch);
    const scrollButton = event.target.closest('[data-ed-scroll]');
    if (scrollButton) overlay.querySelector(scrollButton.dataset.edScroll)?.scrollIntoView({ behavior: 'smooth' });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && overlay.classList.contains('open')) close();
  });
})();
