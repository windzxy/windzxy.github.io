(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c));
  const visits = {台北:26,台中:14,高雄:12,香港:10,上海:9,北京:8,深圳:5,成都:4,武漢:3,新加坡:3,太原:2,貴陽:1};
  const logs = [
    ['13:35','巡演熱度圖','已加入 Zoom Earth 式熱度光斑：去過越多次，顏色越深、範圍越大。'],
    ['13:31','主界面升級','地圖主畫面加入 Tracker 式 Activity Log、底部功能 dock、右側任務面板。'],
    ['13:20','真實地圖','Leaflet 真實瓦片地圖保留，街道 / 深色 / 衛星仍可切換。'],
    ['下一步','資料補完','需要逐站官方照片、歌單、票務頁、場館交通、場刊與應援資料。']
  ];
  const dock = [
    ['activity','ACTIVITY LOG','巡演更新、資料補完、近期修改會在這裡像追蹤器一樣展開。'],
    ['heat','TOUR HEAT','參考 Zoom Earth 的溫度圖邏輯，用熱度表示城市到訪次數。'],
    ['albums','ALBUM ROOM','打開時光唱片室，按年代查看專輯與曲目。'],
    ['songs','SONG WATCH','歌曲宇宙，按現場、青春、世界觀和慢歌整理。'],
    ['books','ARCHIVE','書籍、樂譜、成員文集、場刊週邊。'],
    ['timeline','TIMELINE','從成軍、首專到 5525 的展覽牆。']
  ];
  const max = Math.max(...Object.values(visits));
  const pct = v => Math.max(.18, Math.min(1, v / max));

  function addHeatToMarkers(){
    $$('.md-div-icon').forEach(icon => {
      const label = icon.querySelector('.md-marker-label');
      const city = label?.childNodes?.[0]?.textContent?.trim() || label?.textContent?.replace(/×\d+/,'').trim();
      if(!city || icon.dataset.v22 === '1') return;
      const n = visits[city] || 1, p = pct(n);
      const halo = document.createElement('div');
      halo.className = 'v22-heat ' + (n >= 18 ? 'super' : n >= 8 ? 'hot' : '');
      halo.style.setProperty('--heat-size', `${58 + p * 120}px`);
      halo.style.setProperty('--heat-a', `${.30 + p * .55}`);
      halo.style.setProperty('--heat-b', `${.18 + p * .45}`);
      halo.style.setProperty('--heat-c', `${.10 + p * .36}`);
      halo.style.setProperty('--heat-d', `${.06 + p * .16}`);
      icon.prepend(halo);
      if(label) label.innerHTML = `${esc(city)} <small style="color:#ffd66b;text-shadow:0 2px 8px #000">×${n}</small>`;
      icon.dataset.v22 = '1';
    });
  }

  function addHeatUI(){
    const shell = $('.real-map-shell');
    if(!shell || $('#v22HeatLegend')) return;
    shell.classList.add('heat-mode');
    const sorted = Object.entries(visits).sort((a,b)=>b[1]-a[1]);
    shell.insertAdjacentHTML('beforeend', `
      <div class="v22-heat-switch"><button id="heatToggle" class="active">熱度</button><button id="heatClear">清爽</button></div>
      <div class="v22-heat-legend" id="v22HeatLegend"><b>巡演熱度圖層</b>參考 Zoom Earth 溫度圖的視覺邏輯：五月天到訪越多次，城市光斑越大、顏色越深。<div class="v22-gradient"></div><span><i>少次到訪</i><i>高頻城市</i></span><div class="v22-heat-stats"><span><strong>${sorted[0][1]}</strong>${esc(sorted[0][0])}最高</span><span><strong>${sorted.length}</strong>城市節點</span><span><strong>80</strong>地圖目標分</span></div></div>
      <div class="v22-heat-rank" id="v22HeatRank"><b>城市熱度排行</b>${sorted.slice(0,7).map(([city,n])=>`<button data-city="${esc(city)}"><span>${esc(city)}</span><i style="--w:${Math.round(n/max*100)}%"></i><em>×${n}</em></button>`).join('')}</div>
      <div class="v22-tracker-shell"><div class="v22-tracker-card"><div class="v22-tracker-head"><span>MAYDAY TRACKER</span><button class="v22-tracker-close" id="trackerMin">−</button></div><div class="v22-tracker-body">${logs.map(([t,h,d])=>`<div class="v22-log"><time>${esc(t)}</time><span><b>${esc(h)}</b><small>${esc(d)}</small></span></div>`).join('')}</div></div></div>
      <div class="v22-panel" id="v22Panel"><h3>ACTIVITY LOG</h3><p>主界面改成追蹤器形式：地圖是主角，巡演熱度、城市更新、活動記錄和分頁入口都圍繞地圖展開。</p><div class="v22-panel-grid"><span><b>12</b>城市節點</span><span><b>26</b>台北最高熱度</span><span><b>3</b>地圖圖層</span><span><b>6</b>追蹤入口</span></div></div>
      <div class="v22-dock" id="v22Dock">${dock.map((d,i)=>`<button class="${i?'':'active'}" data-panel="${d[0]}">${d[1]}</button>`).join('')}</div>
    `);
    $('#heatToggle')?.addEventListener('click', () => { shell.classList.add('heat-mode'); $$('.v22-heat').forEach(h=>h.classList.remove('off')); $('#heatToggle').classList.add('active'); $('#heatClear').classList.remove('active'); });
    $('#heatClear')?.addEventListener('click', () => { shell.classList.remove('heat-mode'); $$('.v22-heat').forEach(h=>h.classList.add('off')); $('#heatClear').classList.add('active'); $('#heatToggle').classList.remove('active'); });
    $$('#v22HeatRank button').forEach(btn => btn.addEventListener('click', () => searchCity(btn.dataset.city)));
    $('#trackerMin')?.addEventListener('click', () => $('.v22-tracker-card')?.remove());
    $$('#v22Dock button').forEach(btn => btn.addEventListener('click', () => selectDock(btn.dataset.panel, btn)));
  }

  function searchCity(city){
    const input = $('#realMapSearch');
    if(input){ input.value = city; input.dispatchEvent(new Event('input', {bubbles:true})); }
  }
  function selectDock(key, btn){
    $$('#v22Dock button').forEach(b=>b.classList.toggle('active', b===btn));
    const found = dock.find(d=>d[0]===key) || dock[0];
    const panel = $('#v22Panel');
    if(panel){
      panel.innerHTML = `<h3>${esc(found[1])}</h3><p>${esc(found[2])}</p><div class="v22-panel-grid"><span><b>${Object.keys(visits).length}</b>城市</span><span><b>${Object.values(visits).reduce((a,b)=>a+b,0)}</b>到訪熱度</span><span><b>5525</b>主線</span><span><b>80</b>目標分</span></div>`;
    }
    if(['albums','songs','books','timeline'].includes(key)) document.querySelector(`[data-nav="${key}"]`)?.click();
  }

  function polishText(){
    document.querySelector('.md-app')?.classList.add('v22');
    const h = $('.tour-rail h1'); if(h) h.textContent = 'Mayday Tracker：用地圖追蹤每座城市的巡演熱度';
    const p = $('.tour-rail p'); if(p) p.textContent = '參考 Zoom Earth 的熱度圖與 Spidey Tracker 的地圖主界面：城市去過越多次，顏色越深；所有分頁從地圖追蹤器展開。';
    const title = $('#mapTitle'); if(title) title.textContent = '回到那一天 · 巡演熱度追蹤地圖';
  }

  function boot(){
    polishText();
    addHeatToMarkers();
    addHeatUI();
    let tries = 0;
    const timer = setInterval(() => {
      addHeatToMarkers(); addHeatUI();
      if(++tries > 12) clearInterval(timer);
    }, 500);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 900));
  else setTimeout(boot, 900);
})();