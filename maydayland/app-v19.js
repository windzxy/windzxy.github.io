(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c));

  const stops = [
    {id:'taipei',no:1,city:'台北',lat:25.0330,lng:121.5654,cls:'photo-taipei',venue:'台北小巨蛋 / 台北大巨蛋',addr:'台北市',dates:'2025–2026 台北年度場次',status:'規劃中 / 已公布',tag:'台灣',year:'2025–2026',caption:'台北站應作為核心城市詳情頁，後續補官方照片、票務、場館、歌單與應援資料。'},
    {id:'taichung',no:2,city:'台中',lat:24.1477,lng:120.6736,cls:'photo-taichung',venue:'洲際棒球場',addr:'台中市北屯區崇德路三段835號',dates:'2023.12.31 / 2025–2026 跨年節點',status:'進行中',tag:'台灣',year:'2023–2026',caption:'台中是 5525 起跑與跨年敘事重點，需做獨立年度卡。'},
    {id:'kaohsiung',no:3,city:'高雄',lat:22.6273,lng:120.3014,cls:'photo-kaohsiung',venue:'高雄世運主場館',addr:'高雄市左營區世運大道100號',dates:'2024.03.23 / 03.24 / 03.29 / 03.30 / 03.31',status:'已完成',tag:'台灣',year:'2024',caption:'高雄站需要呈現大型戶外場館、舞台規模與港都夜色。'},
    {id:'hongkong',no:4,city:'香港',lat:22.3193,lng:114.1694,cls:'photo-hongkong',venue:'中環海濱活動空間',addr:'香港中環龍和道',dates:'2024.04.30 – 2024.05.09',status:'已完成',tag:'香港',year:'2024',caption:'香港站要用海港與城市天際線建立強記憶點。'},
    {id:'beijing',no:5,city:'北京',lat:39.9042,lng:116.4074,cls:'photo-beijing',venue:'國家體育場 鳥巢',addr:'北京市朝陽區國家體育場南路1號',dates:'2024 / 2026 相關年度場次',status:'主線城市',tag:'中國大陸',year:'2024–2026',caption:'北京站需要和鳥巢場館、收官/大型場次敘事綁定。'},
    {id:'shenzhen',no:6,city:'深圳',lat:22.5431,lng:114.0579,cls:'photo-shenzhen',venue:'深圳大運中心體育場',addr:'深圳市龍崗區青春路',dates:'2024.06.01 / 06.02',status:'已完成',tag:'中國大陸',year:'2024',caption:'深圳站用現代城市與霓虹感呈現。'},
    {id:'guiyang',no:7,city:'貴陽',lat:26.6470,lng:106.6302,cls:'photo-guizhou',venue:'貴陽站',addr:'貴州省貴陽市',dates:'2025 年度節點',status:'資料補齊中',tag:'中國大陸',year:'2025',caption:'貴陽節點需要補完整官方來源與場館資料。'},
    {id:'taiyuan',no:8,city:'太原',lat:37.8706,lng:112.5489,cls:'photo-taiyuan',venue:'山西體育中心體育場',addr:'太原市晉源區健康南街',dates:'2024.07.06 / 07.07',status:'已完成',tag:'中國大陸',year:'2024',caption:'太原站需要補票務圖、官方宣傳圖與城市照片。'},
    {id:'wuhan',no:9,city:'武漢',lat:30.5928,lng:114.3055,cls:'photo-wuhan',venue:'武漢體育中心體育場',addr:'武漢市蔡甸區車城北路',dates:'2024.09.14 / 09.15',status:'已完成',tag:'中國大陸',year:'2024',caption:'武漢站要強化江城地標與場館記憶。'},
    {id:'chengdu',no:10,city:'成都',lat:30.5728,lng:104.0665,cls:'photo-chengdu',venue:'東安湖體育公園主體育場',addr:'成都市龍泉驛區',dates:'2024.10.05 / 10.06',status:'已完成',tag:'中國大陸',year:'2024',caption:'成都站需要更溫暖、更有生活感的影像語言。'},
    {id:'shanghai',no:11,city:'上海',lat:31.2304,lng:121.4737,cls:'photo-shanghai',venue:'上海體育場',addr:'上海市徐匯區天鑰橋路666號',dates:'2024.11.12 – 2024.11.24',status:'已完成',tag:'中國大陸',year:'2024',caption:'上海站應該有都市夜景與高密度場次資訊。'},
    {id:'singapore',no:12,city:'新加坡',lat:1.3521,lng:103.8198,cls:'photo-singapore',venue:'新加坡站',addr:'Singapore',dates:'歷年海外巡演入口',status:'海外資料入口',tag:'海外',year:'海外線',caption:'海外線可作為後續世界巡演圖層。'}
  ];

  const layerDefs = {
    street: {
      name: '街道',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      opt: { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }
    },
    dark: {
      name: '深色',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      opt: { maxZoom: 20, attribution: '&copy; OpenStreetMap contributors &copy; CARTO' }
    },
    satellite: {
      name: '衛星',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      opt: { maxZoom: 18, attribution: 'Tiles &copy; Esri' }
    }
  };

  let map, activeLayer, routeLine, activeStop = stops[0], markerRefs = new Map();

  function updateDetail(s){
    const hero = $('#detailHero'); if(hero) hero.className = 'detail-hero ' + s.cls;
    $('#detailBadge') && ($('#detailBadge').textContent = String(s.no).padStart(2,'0'));
    $('#detailCity') && ($('#detailCity').textContent = s.city);
    $('#detailDates') && ($('#detailDates').textContent = s.dates);
    $('#detailVenue') && ($('#detailVenue').textContent = s.venue);
    $('#detailAddress') && ($('#detailAddress').textContent = s.addr);
    $('#detailTour') && ($('#detailTour').textContent = 'Maydayland 巡演檔案');
    $('#detailStatus') && ($('#detailStatus').textContent = `${s.year} · ${s.status} · ${s.tag}`);
    $('#detailCaption') && ($('#detailCaption').textContent = s.caption);
    $('#detailTags') && ($('#detailTags').innerHTML = [s.year,s.status,s.tag].map(t=>`<span>${esc(t)}</span>`).join(''));
    $('#thumbRow') && ($('#thumbRow').innerHTML = [0,1,2].map(i=>`<div class="thumb ${i?'':'active'} ${s.cls}"></div>`).join(''));
  }

  function markerHtml(s, active=false){
    const color = s.status.includes('規劃') ? '#ffd66b' : s.status.includes('進行') ? '#ff74b8' : '#5beeff';
    return `<div class="md-marker ${active?'active':''}" style="--m:${color}"><span>${s.no}</span></div><div class="md-marker-label" style="--m:${color}">${esc(s.city)}</div>`;
  }

  function popupHtml(s){
    return `<div class="popup-photo ${s.cls}"></div><div class="popup-title">${esc(s.city)}</div><div class="popup-meta">${esc(s.venue)}<br>${esc(s.dates)}</div><div class="popup-tags"><span>${esc(s.year)}</span><span>${esc(s.status)}</span><span>${esc(s.tag)}</span></div>`;
  }

  function setActiveStop(s, fly=true){
    activeStop = s;
    updateDetail(s);
    markerRefs.forEach((m, id) => {
      const stop = stops.find(x => x.id === id);
      if(stop) m.setIcon(L.divIcon({ className:'md-div-icon', html:markerHtml(stop, stop.id===s.id), iconSize:[80,46], iconAnchor:[17,17], popupAnchor:[0,-18] }));
    });
    const m = markerRefs.get(s.id);
    if(m){
      m.bindPopup(popupHtml(s), { closeButton:true, offset:[0,-12] }).openPopup();
    }
    if(map && fly){ map.flyTo([s.lat, s.lng], Math.max(map.getZoom(), 8), { duration:.55 }); }
  }

  function setLayer(name){
    if(!map || !layerDefs[name]) return;
    if(activeLayer) map.removeLayer(activeLayer);
    const def = layerDefs[name];
    activeLayer = L.tileLayer(def.url, def.opt).addTo(map);
    $$('.real-layer-switch button').forEach(b => b.classList.toggle('active', b.dataset.layer === name));
  }

  function initRealMap(){
    const scene = $('#mapScene');
    if(!scene || !window.L) return showError(scene, 'Leaflet 地圖庫未載入，暫時保留舊地圖。');
    scene.classList.add('real-map-mode');
    scene.innerHTML += `<div class="real-map-shell"><div id="realTourMap" class="real-map"></div><div class="real-map-overlay"><div class="map-chip"><strong>REAL MAP v19</strong> · 街道 / 深色 / 衛星</div><label class="map-chip real-map-search"><span>⌕</span><input id="realMapSearch" placeholder="搜索城市 / 場館"></label></div><div class="real-layer-switch"><button class="active" data-layer="street">街道</button><button data-layer="dark">深色</button><button data-layer="satellite">衛星</button></div><div class="real-map-footer"><div class="route-summary"><b>5525 巡演真實地圖模式</b>地圖改成可縮放、可拖曳、帶道路與地名標註的瓦片地圖；路線、節點與右側詳情同步。</div><div class="map-score"><span>真實瓦片</span><span>路線折線</span><span>城市彈窗</span><span>圖層切換</span></div></div></div>`;
    map = L.map('realTourMap', { zoomControl:true, preferCanvas:true, worldCopyJump:false, attributionControl:true }).setView([28.4, 114.3], 5);
    setLayer('street');
    const route = stops.map(s => [s.lat, s.lng]);
    routeLine = L.polyline(route, { color:'#5beeff', weight:4, opacity:.88, lineCap:'round', lineJoin:'round' }).addTo(map);
    L.polyline(route, { color:'#ff74b8', weight:10, opacity:.12, lineCap:'round', lineJoin:'round' }).addTo(map);
    stops.forEach(s => {
      const icon = L.divIcon({ className:'md-div-icon', html:markerHtml(s, s.id===activeStop.id), iconSize:[80,46], iconAnchor:[17,17], popupAnchor:[0,-18] });
      const marker = L.marker([s.lat, s.lng], { icon, title:s.city }).addTo(map);
      marker.on('click', () => setActiveStop(s, false));
      markerRefs.set(s.id, marker);
    });
    map.fitBounds(L.latLngBounds(route), { padding:[42,42] });
    $$('.real-layer-switch button').forEach(b => b.addEventListener('click', () => setLayer(b.dataset.layer)));
    const input = $('#realMapSearch');
    if(input){
      input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if(!q) return;
        const s = stops.find(x => [x.city,x.venue,x.addr,x.tag,x.year].join(' ').toLowerCase().includes(q));
        if(s) setActiveStop(s, true);
      });
    }
    $('#randomStop')?.addEventListener('click', () => setActiveStop(stops[Math.floor(Math.random()*stops.length)], true));
    $('#routePlay')?.addEventListener('click', () => {
      let i = 0;
      const timer = setInterval(() => { setActiveStop(stops[i], true); i++; if(i >= stops.length) clearInterval(timer); }, 950);
    });
    setTimeout(() => { map.invalidateSize(); setActiveStop(activeStop, false); }, 350);
  }

  function showError(scene, text){
    if(!scene) return;
    const div = document.createElement('div');
    div.className = 'real-map-error';
    div.textContent = text;
    scene.append(div);
  }

  function patchLabels(){
    $('#mapTitle') && ($('#mapTitle').textContent = '回到那一天 · 真實 Web 地圖路線');
    const p = $('.tour-rail p');
    if(p) p.textContent = 'v19 已把地圖改成類似 Google / Bing 的真實瓦片地圖：可拖曳、縮放、切換街道/深色/衛星圖層，城市節點與右側詳情同步。';
    $('#modeFlat') && ($('#modeFlat').textContent = '街道地圖');
    $('#modeAlbum') && ($('#modeAlbum').textContent = '深色地圖');
  }

  document.addEventListener('DOMContentLoaded', () => {
    patchLabels();
    initRealMap();
  });
})();