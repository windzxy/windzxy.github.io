(() => {
  'use strict';

  const D = window.MAYDAYLAND_ARCHIVE;
  const API = 'https://music-api.gdstudio.xyz/api.php';
  const LOGO = './mayday-logo.svg';
  const WORLD_W = 1400;
  const WORLD_H = 700;
  const LAT_MIN = -60;
  const LAT_MAX = 85;
  const RADIO_CACHE_KEY = 'maydayland-radio-cache-v2';
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const fmt = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';

  const dom = {
    tourList: $('tourList'), map: $('map'), mapCanvas: $('mapCanvas'), routeLayer: $('routeLayer'), markerLayer: $('markerLayer'),
    detail: $('detail'), archive: $('archive'), archiveTitle: $('archiveTitle'), archiveBody: $('archiveBody'),
    audio: $('audio'), miniCover: $('miniCover'), miniTitle: $('miniTitle'), miniArtist: $('miniArtist'), miniWorld: $('miniWorld'),
    play: $('playButton'), prev: $('prevButton'), next: $('nextButton'), progress: $('miniProgress'), playerDock: $('playerDock'),
    playerSheet: $('playerSheet'), fullCover: $('fullCover'), fullTitle: $('fullTitle'), fullArtist: $('fullArtist'), fullWorld: $('fullWorld'),
    fullPlay: $('fullPlay'), range: $('progressInput'), currentTime: $('currentTime'), durationTime: $('durationTime'), lyrics: $('lyrics'),
    unlock: $('soundUnlock'), toast: $('toast'), mobileToggle: $('mobileTourToggle'), mapStatus: $('mapStatus'),
    timeline: $('tourTimeline'), timelinePlay: $('timelinePlay'), timelineRail: $('timelineRail'), timelineProgress: $('timelineProgress'), timelineCaption: $('timelineCaption')
  };

  const state = {
    tour: D?.tours?.[D.tours.length - 1] || null,
    tracks: [], index: -1, current: null, lyric: [], lyricIndex: -1, shuffle: true,
    transform: {scale:1, x:0, y:0}, dragging:false, dragStart:null,
    activeStop: -1, tourTimer: 0, tourPlaying:false, toastTimer:0, radioHydrating:false
  };

  function showFatal(message) {
    if (!dom.mapStatus) return;
    dom.mapStatus.hidden = false;
    dom.mapStatus.innerHTML = `<b>地图资料载入失败</b><span>${esc(message)}</span><button onclick="location.reload()">重新载入</button>`;
  }

  function toast(message) {
    clearTimeout(state.toastTimer);
    dom.toast.textContent = message;
    dom.toast.classList.add('show');
    state.toastTimer = setTimeout(() => dom.toast.classList.remove('show'), 2400);
  }

  function project(lng, lat) {
    const x = (Number(lng) + 180) / 360 * WORLD_W;
    const clampedLat = Math.max(LAT_MIN, Math.min(LAT_MAX, Number(lat)));
    const y = (LAT_MAX - clampedLat) / (LAT_MAX - LAT_MIN) * WORLD_H;
    return [x, y];
  }

  function safeImage(img, primary, fallback = LOGO) {
    if (!img) return;
    img.referrerPolicy = 'no-referrer';
    img.dataset.fallbackDone = '0';
    img.onerror = () => {
      if (img.dataset.fallbackDone === '1') return;
      img.dataset.fallbackDone = '1';
      img.src = fallback;
    };
    img.src = primary || fallback;
  }

  function heroForTour(tour) {
    const officialBand = 'https://www.mayday.jp/blue/img/photo-member.jpg';
    const officialBlue = 'https://www.mayday.jp/blue/img/header-cn.jpg';
    const official5525 = 'https://www.bin-music.com.tw/album/news/66014db8310af%2Btcw1200h675.jpg';
    const map = {
      '5525': official5525,
      blue: officialBlue,
      jri: officialBlue,
      life: officialBand,
      jump: officialBand,
      nowhere: officialBand,
      dna: officialBand,
      finalhome: officialBand,
      back: officialBand,
      sky: officialBand,
      where: officialBand,
      standout: officialBand,
      '168': officialBand
    };
    return map[tour?.id] || officialBand;
  }

  function renderTourList() {
    if (!D?.tours?.length) return showFatal('巡演资料库不存在或尚未完成载入。');
    dom.tourList.innerHTML = D.tours.map(tour => `
      <button class="tour-item${tour.id === state.tour?.id ? ' active' : ''}" style="--tour:${tour.color}" data-tour="${tour.id}">
        <i class="tour-dot"></i><span><b>${esc(tour.name)}</b><small>${esc(tour.english)}</small></span><em>${esc(tour.years)}</em>
      </button>`).join('');
  }

  function routeSegments(stops) {
    const segments = [];
    for (let i = 1; i < stops.length; i++) {
      const a = stops[i - 1], b = stops[i];
      let lng1 = Number(a.lng), lng2 = Number(b.lng);
      const lat1 = Number(a.lat), lat2 = Number(b.lat);
      const diff = lng2 - lng1;
      if (Math.abs(diff) <= 180) {
        segments.push([[lng1, lat1], [lng2, lat2]]);
        continue;
      }
      if (diff > 180) lng2 -= 360;
      if (diff < -180) lng2 += 360;
      const boundary = lng2 > lng1 ? 180 : -180;
      const t = (boundary - lng1) / (lng2 - lng1);
      const crossLat = lat1 + (lat2 - lat1) * t;
      segments.push([[lng1, lat1], [boundary, crossLat]]);
      segments.push([[boundary === 180 ? -180 : 180, crossLat], [Number(b.lng), lat2]]);
    }
    return segments;
  }

  function curvePath(a, b) {
    const [x1, y1] = project(a[0], a[1]);
    const [x2, y2] = project(b[0], b[1]);
    const dx = x2 - x1;
    const lift = Math.min(52, Math.max(10, Math.abs(dx) * 0.055));
    const cy = Math.max(18, Math.min(WORLD_H - 18, Math.min(y1, y2) - lift));
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${(x1 + dx * .33).toFixed(1)} ${cy.toFixed(1)}, ${(x1 + dx * .67).toFixed(1)} ${cy.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }

  function renderRoute(tour) {
    const segments = routeSegments(tour.stops || []);
    dom.routeLayer.innerHTML = segments.map(segment => {
      const path = curvePath(segment[0], segment[1]);
      return `<path class="route-glow" d="${path}" style="--tour:${tour.color}"></path><path class="route-track" d="${path}"></path><path class="route-line" pathLength="1" d="${path}" style="--tour:${tour.color}"></path>`;
    }).join('');

    const last = tour.stops?.[tour.stops.length - 1];
    if (last && tour.stops.length > 1) {
      const [x, y] = project(last.lng, last.lat);
      dom.routeLayer.insertAdjacentHTML('beforeend', `<circle class="route-head" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.7" style="--tour:${tour.color}"></circle>`);
    }

    dom.markerLayer.innerHTML = (tour.stops || []).map((stop, index) => {
      const [x, y] = project(stop.lng, stop.lat);
      const labelX = x > WORLD_W - 130 ? -13 : 13;
      const anchor = x > WORLD_W - 130 ? 'end' : 'start';
      const singleRing = tour.stops.length === 1 ? '<circle class="single-stop-ring" r="24"></circle>' : '';
      return `<g class="map-stop${index === 0 ? ' first' : ''}" data-stop="${index}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})" style="--tour:${tour.color};--delay:${index * 80}ms">
        ${singleRing}<circle class="stop-pulse" r="11"></circle><circle class="stop-disc" r="7"></circle><text y="2.3" text-anchor="middle">${index + 1}</text><text class="city-label" x="${labelX}" y="3" text-anchor="${anchor}">${esc(stop.city)}</text><title>${esc(`${index + 1}. ${stop.city}`)}</title>
      </g>`;
    }).join('');

    dom.markerLayer.querySelectorAll('[data-stop]').forEach(node => node.addEventListener('click', () => selectStop(Number(node.dataset.stop), true)));
    renderTimeline(tour);
  }

  function applyTransform() {
    const {scale, x, y} = state.transform;
    dom.mapCanvas.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
  }

  function fitTour(tour, animate = true) {
    if (!tour?.stops?.length || !dom.map) return;
    const rect = dom.map.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const points = tour.stops.map(stop => {
      const [x, y] = project(stop.lng, stop.lat);
      return [x / WORLD_W * rect.width, y / WORLD_H * rect.height];
    });
    const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const width = Math.max(tour.stops.length === 1 ? rect.width * .34 : 70, maxX - minX);
    const height = Math.max(tour.stops.length === 1 ? rect.height * .34 : 70, maxY - minY);
    const paddingX = Math.min(145, Math.max(60, rect.width * .075));
    const paddingY = Math.min(120, Math.max(55, rect.height * .08));
    const maxScale = tour.stops.length === 1 ? 1.55 : 2.15;
    const scale = Math.max(1, Math.min(maxScale, Math.min((rect.width - paddingX * 2) / width, (rect.height - paddingY * 2) / height)));
    const centerX = (minX + maxX) / 2, centerY = (minY + maxY) / 2;
    state.transform = {scale, x:rect.width / 2 - centerX * scale, y:rect.height / 2 - centerY * scale};
    dom.mapCanvas.classList.toggle('is-animating', animate);
    applyTransform();
    if (animate) setTimeout(() => dom.mapCanvas.classList.remove('is-animating'), 700);
  }

  function resetMap() {
    state.transform = {scale:1, x:0, y:0};
    applyTransform();
  }

  function bindMapGestures() {
    dom.map.addEventListener('wheel', event => {
      event.preventDefault();
      const rect = dom.map.getBoundingClientRect();
      const px = event.clientX - rect.left, py = event.clientY - rect.top;
      const oldScale = state.transform.scale;
      const nextScale = Math.max(1, Math.min(4.5, oldScale * (event.deltaY < 0 ? 1.11 : .9)));
      const worldX = (px - state.transform.x) / oldScale, worldY = (py - state.transform.y) / oldScale;
      state.transform = {scale:nextScale, x:px - worldX * nextScale, y:py - worldY * nextScale};
      applyTransform();
    }, {passive:false});

    dom.map.addEventListener('pointerdown', event => {
      if (event.target.closest('[data-stop]')) return;
      state.dragging = true;
      state.dragStart = {x:event.clientX, y:event.clientY, tx:state.transform.x, ty:state.transform.y};
      dom.map.setPointerCapture?.(event.pointerId);
      dom.map.classList.add('dragging');
    });
    dom.map.addEventListener('pointermove', event => {
      if (!state.dragging) return;
      state.transform.x = state.dragStart.tx + event.clientX - state.dragStart.x;
      state.transform.y = state.dragStart.ty + event.clientY - state.dragStart.y;
      applyTransform();
    });
    const end = () => { state.dragging = false; dom.map.classList.remove('dragging'); };
    dom.map.addEventListener('pointerup', end);
    dom.map.addEventListener('pointercancel', end);
    $('zoomIn')?.addEventListener('click', () => { state.transform.scale = Math.min(4.5, state.transform.scale * 1.22); applyTransform(); });
    $('zoomOut')?.addEventListener('click', () => { state.transform.scale = Math.max(1, state.transform.scale / 1.22); if (state.transform.scale === 1) resetMap(); else applyTransform(); });
    $('fitMap')?.addEventListener('click', () => fitTour(state.tour));
  }

  function renderTimeline(tour) {
    if (!dom.timelineRail) return;
    const count = Math.max(1, tour.stops.length);
    dom.timelineRail.innerHTML = `<i class="timeline-progress" id="timelineProgress" style="--tour:${tour.color}"></i>${tour.stops.map((stop,index) => `<button class="timeline-dot" data-timeline-stop="${index}" style="left:${count === 1 ? 50 : index / (count - 1) * 100}%;--tour:${tour.color}" aria-label="${esc(stop.city)}"></button>`).join('')}`;
    dom.timelineProgress = $('timelineProgress');
    dom.timelineRail.querySelectorAll('[data-timeline-stop]').forEach(button => button.addEventListener('click', () => selectStop(Number(button.dataset.timelineStop), true)));
    selectStop(0, false);
  }

  function updateTimeline() {
    const count = state.tour?.stops?.length || 1;
    const ratio = count === 1 ? 0 : state.activeStop / (count - 1);
    if (dom.timelineProgress) dom.timelineProgress.style.width = `${ratio * 100}%`;
    dom.timelineRail?.querySelectorAll('.timeline-dot').forEach((dot,index) => dot.classList.toggle('visited', index <= state.activeStop));
    dom.markerLayer?.querySelectorAll('.map-stop').forEach((marker,index) => marker.classList.toggle('active', index === state.activeStop));
    const stop = state.tour?.stops?.[state.activeStop];
    if (dom.timelineCaption && stop) dom.timelineCaption.innerHTML = `<b>${state.activeStop + 1}/${count} ${esc(stop.city)}</b><small>${esc(stop.date || stop.venue || state.tour.years)}</small>`;
  }

  function selectStop(index, focus = false) {
    if (!state.tour?.stops?.length) return;
    state.activeStop = Math.max(0, Math.min(index, state.tour.stops.length - 1));
    updateTimeline();
    if (!focus) return;
    const stop = state.tour.stops[state.activeStop];
    openTour(state.tour);
    dom.detail.querySelector(`[data-stop="${state.activeStop}"]`)?.scrollIntoView({block:'center', behavior:'smooth'});
    const rect = dom.map.getBoundingClientRect();
    const [x, y] = project(stop.lng, stop.lat);
    const px = x / WORLD_W * rect.width, py = y / WORLD_H * rect.height;
    const scale = Math.max(1.6, Math.min(2.3, state.transform.scale));
    state.transform = {scale, x:rect.width / 2 - px * scale, y:rect.height / 2 - py * scale};
    applyTransform();
  }

  function toggleTimelinePlay() {
    clearInterval(state.tourTimer);
    state.tourPlaying = !state.tourPlaying;
    dom.timelinePlay.textContent = state.tourPlaying ? 'Ⅱ' : '▶';
    if (!state.tourPlaying) return;
    state.tourTimer = setInterval(() => {
      const next = state.activeStop + 1;
      if (next >= state.tour.stops.length) {
        clearInterval(state.tourTimer);
        state.tourPlaying = false;
        dom.timelinePlay.textContent = '▶';
        return;
      }
      selectStop(next, true);
    }, 1050);
  }

  function stopRow(tour, stop, index) {
    const meta = [stop.date, stop.venue, stop.phase].filter(Boolean).join(' · ') || '官方城市档案未列逐场日期';
    return `<button class="stop-row" data-stop="${index}" style="--tour:${tour.color}"><span class="stop-no">${index + 1}</span><span><b>${esc(stop.city)}</b><small>${esc(meta)}</small></span></button>`;
  }

  function openTour(tour) {
    dom.detail.innerHTML = `<article class="detail-card" style="--tour:${tour.color}">
      <div class="detail-hero"><img id="tourHero" alt="${esc(tour.name)}"><div class="detail-hero-copy"><small>${esc(tour.years)} · TOUR ROUTE</small><b>${esc(tour.name)}</b></div></div>
      <div class="detail-body"><p>${esc(tour.summary)}</p><p class="detail-source-note">主题图片使用五月天官方公开高清素材；早期巡演没有高清主视觉时，以官方团体照呈现。</p>
      <div class="stats"><div class="stat"><b>${tour.stops.length}</b><small>已核实路线节点</small></div><div class="stat"><b>${new Set(tour.stops.map(stop => stop.city)).size}</b><small>地图城市／场馆</small></div></div>
      <div class="source-links"><a href="${esc(tour.source)}" target="_blank" rel="noopener">官方资料来源</a>${tour.secondary ? `<a href="${esc(tour.secondary)}" target="_blank" rel="noopener">补充官方页</a>` : ''}<button data-play-tour="${tour.id}">播放巡演歌单</button></div><div class="stops">${tour.stops.map((stop,index) => stopRow(tour, stop, index)).join('')}</div></div></article>`;
    safeImage($('tourHero'), heroForTour(tour), LOGO);
  }

  function selectTour(id) {
    const tour = D.tours.find(item => item.id === id);
    if (!tour) return;
    clearInterval(state.tourTimer);
    state.tourPlaying = false;
    if (dom.timelinePlay) dom.timelinePlay.textContent = '▶';
    state.tour = tour;
    renderTourList();
    renderRoute(tour);
    openTour(tour);
    requestAnimationFrame(() => fitTour(tour));
    document.querySelector('.sidebar')?.classList.remove('open');
    dom.miniWorld.textContent = dom.fullWorld.textContent = tour.name;
  }

  async function apiJson(url, timeout = 6000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {signal:controller.signal, cache:'no-store'});
      if (!response.ok) throw new Error(String(response.status));
      return await response.json();
    } finally { clearTimeout(timer); }
  }

  function normalizeSong(row, source) {
    return {id:String(row.id || ''), name:String(row.name || row.title || ''), artist:Array.isArray(row.artist) ? row.artist.join(' / ') : String(row.artist || '五月天'), album:String(row.album || ''), pic:row.pic_id || '', source:row.source || source};
  }

  async function searchSource(source, query, count = 30) {
    const data = await apiJson(`${API}?types=search&source=${source}&name=${encodeURIComponent(query)}&count=${count}&pages=1`, 5200);
    if (!Array.isArray(data)) throw new Error(`${source} empty`);
    const rows = data.map(row => normalizeSong(row, source)).filter(song => song.id && /五月天|Mayday/i.test(`${song.artist} ${song.album} ${song.name}`));
    if (!rows.length) throw new Error(`${source} no Mayday`);
    return rows;
  }

  function dedupeTracks(rows) {
    const map = new Map();
    rows.forEach(song => map.set(`${song.source}:${song.id}`, song));
    return [...map.values()];
  }

  function loadRadioCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(RADIO_CACHE_KEY) || 'null');
      if (!cached || Date.now() - cached.time > 36 * 3600 * 1000 || !Array.isArray(cached.tracks) || cached.tracks.length < 5) return [];
      return cached.tracks;
    } catch { return []; }
  }

  function saveRadioCache(tracks) {
    try { localStorage.setItem(RADIO_CACHE_KEY, JSON.stringify({time:Date.now(), tracks:tracks.slice(0,180)})); } catch {}
  }

  function coverUrl(track, size = 900) {
    return track?.pic ? `${API}?types=pic&id=${encodeURIComponent(track.pic)}&source=${encodeURIComponent(track.source)}&size=${size}` : heroForTour(state.tour);
  }

  async function resolveAudio(track) {
    const requests = [320, 192, 128].map(async bitrate => {
      const data = await apiJson(`${API}?types=url&id=${encodeURIComponent(track.id)}&source=${encodeURIComponent(track.source)}&br=${bitrate}`, 5200);
      if (!data?.url) throw new Error('empty url');
      return String(data.url).replace(/^http:/, 'https:');
    });
    try { return await Promise.any(requests); } catch { return ''; }
  }

  function updateTrack() {
    const track = state.current;
    safeImage(dom.miniCover, coverUrl(track), heroForTour(state.tour));
    safeImage(dom.fullCover, coverUrl(track), heroForTour(state.tour));
    dom.miniTitle.textContent = dom.fullTitle.textContent = track?.name || '正在建立五月天歌单';
    dom.miniArtist.textContent = dom.fullArtist.textContent = track?.artist || '五月天';
    dom.miniWorld.textContent = dom.fullWorld.textContent = state.tour?.name || 'MAYDAYLAND RADIO';
  }

  async function attemptPlayback() {
    try {
      dom.audio.muted = false;
      await dom.audio.play();
      dom.unlock.hidden = true;
      return;
    } catch (error) {
      if (error?.name !== 'NotAllowedError') throw error;
    }
    try {
      dom.audio.muted = true;
      await dom.audio.play();
      dom.unlock.textContent = '🔊 正在静音播放 · 点此开启声音';
      dom.unlock.hidden = false;
    } catch {
      dom.unlock.textContent = '▶ 点一下开始播放';
      dom.unlock.hidden = false;
    }
  }

  async function playAt(index, attempt = 0) {
    if (!state.tracks.length || attempt > Math.min(10, state.tracks.length)) return;
    state.index = (index + state.tracks.length) % state.tracks.length;
    state.current = state.tracks[state.index];
    updateTrack();
    const url = await resolveAudio(state.current);
    if (!url) return playAt(state.index + 1, attempt + 1);
    dom.audio.src = url;
    dom.audio.load();
    loadLyrics(state.current);
    try { await attemptPlayback(); } catch { playAt(state.index + 1, attempt + 1); }
  }

  async function hydrateRadio(query = '五月天') {
    if (state.radioHydrating) return;
    state.radioHydrating = true;
    const sources = ['netease','kuwo','qq','migu'];
    const promises = sources.map(source => searchSource(source, query, 35));
    try {
      const firstRows = await Promise.any(promises);
      if (!state.tracks.length) {
        state.tracks = dedupeTracks(firstRows).sort(() => Math.random() - .5);
        await playAt(Math.floor(Math.random() * state.tracks.length));
      }
    } catch {}
    const settled = await Promise.allSettled(promises);
    const merged = dedupeTracks([...state.tracks, ...settled.flatMap(result => result.status === 'fulfilled' ? result.value : [])]);
    if (merged.length) {
      state.tracks = merged;
      saveRadioCache(merged);
    }
    state.radioHydrating = false;
    dom.playerDock?.classList.remove('loading');
  }

  function startRadio(query = '五月天') {
    dom.playerDock?.classList.add('loading');
    const cached = loadRadioCache();
    if (cached.length) {
      state.tracks = cached.sort(() => Math.random() - .5);
      playAt(Math.floor(Math.random() * state.tracks.length));
    }
    hydrateRadio(query);
  }

  async function loadLyrics(track) {
    dom.lyrics.innerHTML = '<p>正在载入歌词…</p>';
    state.lyric = [];
    state.lyricIndex = -1;
    try {
      const data = await apiJson(`${API}?types=lyric&id=${encodeURIComponent(track.id)}&source=${encodeURIComponent(track.source)}`, 6500);
      const raw = typeof data === 'string' ? data : (data?.lyric || data?.lrc?.lyric || data?.lrc || '');
      const lines = [];
      String(raw).split(/\r?\n/).forEach(line => {
        const text = line.replace(/\[[^\]]+\]/g, '').trim();
        for (const match of line.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)) if (text) lines.push({time:Number(match[1]) * 60 + Number(match[2]), text});
      });
      lines.sort((a,b) => a.time - b.time);
      state.lyric = lines;
      dom.lyrics.innerHTML = lines.length ? lines.map((line,index) => `<div class="lyric-line" data-lyric="${index}">${esc(line.text)}</div>`).join('') : '<p>目前没有可用的时间轴歌词。</p>';
    } catch { dom.lyrics.innerHTML = '<p>歌词服务暂时没有回应。</p>'; }
  }

  function syncLyric(time) {
    if (!state.lyric.length) return;
    let nextIndex = 0;
    for (let i = 0; i < state.lyric.length; i++) { if (state.lyric[i].time <= time) nextIndex = i; else break; }
    if (nextIndex === state.lyricIndex) return;
    state.lyricIndex = nextIndex;
    dom.lyrics.querySelectorAll('.lyric-line').forEach((line,index) => line.classList.toggle('active', index === nextIndex));
    dom.lyrics.querySelector(`[data-lyric="${nextIndex}"]`)?.scrollIntoView({block:'center', behavior:'smooth'});
  }

  async function getAlbumArt(album) {
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`五月天 ${album.title}`)}&entity=album&country=TW&limit=20`);
      const data = await response.json();
      const hit = (data.results || []).find(row => /五月天|Mayday/i.test(row.artistName || '') && (row.collectionName || '').includes(album.title)) || (data.results || []).find(row => /五月天|Mayday/i.test(row.artistName || ''));
      return hit?.artworkUrl100?.replace('100x100bb','1200x1200bb') || album.image || LOGO;
    } catch { return album.image || LOGO; }
  }

  async function getAlbumTracks(album) {
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`五月天 ${album.title}`)}&entity=album&country=TW&limit=20`);
      const data = await response.json();
      const hit = (data.results || []).find(row => /五月天|Mayday/i.test(row.artistName || '') && (row.collectionName || '').includes(album.title)) || (data.results || [])[0];
      if (!hit?.collectionId) return [];
      const lookup = await fetch(`https://itunes.apple.com/lookup?id=${hit.collectionId}&entity=song&country=TW`);
      const result = await lookup.json();
      return (result.results || []).filter(row => row.wrapperType === 'track').map(row => row.trackName);
    } catch { return []; }
  }

  async function openArchive(type) {
    dom.archive.classList.add('open');
    const titles = {albums:'专辑与完整曲目',songs:'全曲库搜索与播放',books:'书籍与出版品',timeline:'五月天历程档案'};
    dom.archiveTitle.textContent = titles[type] || '档案馆';
    if (type === 'albums') {
      dom.archiveBody.className = 'archive-grid';
      dom.archiveBody.innerHTML = D.albums.map((album,index) => `<article class="archive-card" data-album-index="${index}"><div class="art"><img alt="${esc(album.title)}"></div><div class="copy"><small>${esc(album.date)}</small><h3>${esc(album.title)}</h3><p>${esc(album.english)}</p><button data-load-album="${index}">查看完整曲目</button></div></article>`).join('');
      D.albums.forEach(async (album,index) => safeImage(dom.archiveBody.querySelector(`[data-album-index="${index}"] img`), await getAlbumArt(album), album.image || LOGO));
    } else if (type === 'books') {
      dom.archiveBody.className = 'archive-grid';
      dom.archiveBody.innerHTML = D.books.map(book => `<article class="archive-card"><div class="copy"><small>${esc(book.year)} · ${esc(book.publisher)}</small><h3>${esc(book.title)}</h3><p>${esc(book.author)}</p><p>${esc(book.note)}</p><a href="${esc(book.url)}" target="_blank" rel="noopener">资料页</a></div></article>`).join('');
    } else if (type === 'timeline') {
      dom.archiveBody.className = 'timeline';
      dom.archiveBody.innerHTML = D.timeline.map(([year,title,description]) => `<div class="time-row"><time>${esc(year)}</time><i></i><div><h3>${esc(title)}</h3><p>${esc(description)}</p></div></div>`).join('');
    } else {
      dom.archiveBody.className = 'song-search-view';
      dom.archiveBody.innerHTML = `<form id="songSearch"><input id="songQuery" placeholder="搜索五月天歌曲、专辑或现场版本"><button>搜索</button></form><div id="songResults"></div>`;
    }
  }

  async function loadAlbum(index) {
    const album = D.albums[index];
    const copy = dom.archiveBody.querySelector(`[data-album-index="${index}"] .copy`);
    if (!album || !copy || copy.dataset.loaded === '1') return;
    copy.dataset.loaded = '1';
    copy.insertAdjacentHTML('beforeend','<p class="loading">正在核对 Apple Music 曲目…</p>');
    const tracks = await getAlbumTracks(album);
    copy.querySelector('.loading')?.remove();
    copy.insertAdjacentHTML('beforeend',tracks.length ? `<ol>${tracks.map(track => `<li>${esc(track)}</li>`).join('')}</ol>` : '<p>目前无法取得曲目；可使用歌曲搜索。</p>');
  }

  function bindLayers() {
    document.querySelectorAll('[data-layer]').forEach(button => button.addEventListener('click', () => {
      button.classList.toggle('active');
      const layer = button.dataset.layer;
      if (layer === 'satellite') dom.mapCanvas.classList.toggle('satellite-hidden', !button.classList.contains('active'));
      if (layer === 'grid') dom.mapCanvas.classList.toggle('grid-hidden', !button.classList.contains('active'));
      if (layer === 'route') dom.routeLayer.style.display = button.classList.contains('active') ? '' : 'none';
    }));
  }

  function bind() {
    dom.tourList.addEventListener('click', event => { const button = event.target.closest('[data-tour]'); if (button) selectTour(button.dataset.tour); });
    dom.detail.addEventListener('click', event => {
      const stop = event.target.closest('[data-stop]');
      if (stop) selectStop(Number(stop.dataset.stop), true);
      if (event.target.closest('[data-play-tour]')) startRadio(`五月天 ${state.tour.name} Live`);
    });
    document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach(item => item.classList.toggle('active',item === button));
      button.dataset.view === 'map' ? dom.archive.classList.remove('open') : openArchive(button.dataset.view);
    }));
    $('archiveClose').onclick = () => dom.archive.classList.remove('open');
    $('randomButton').onclick = () => selectTour(D.tours[Math.floor(Math.random() * D.tours.length)].id);
    $('aboutButton').onclick = () => openArchive('timeline');
    dom.timelinePlay?.addEventListener('click',toggleTimelinePlay);
    bindLayers();

    dom.archive.addEventListener('click', event => { const button = event.target.closest('[data-load-album]'); if (button) loadAlbum(Number(button.dataset.loadAlbum)); });
    dom.archive.addEventListener('submit', async event => {
      if (event.target.id !== 'songSearch') return;
      event.preventDefault();
      const box = $('songResults');
      box.innerHTML = '<p>正在搜索…</p>';
      let rows = [];
      try { rows = dedupeTracks((await Promise.allSettled(['netease','kuwo','qq'].map(source => searchSource(source,`五月天 ${$('songQuery').value.trim()}`,25)))).flatMap(result => result.status === 'fulfilled' ? result.value : [])); } catch {}
      box.innerHTML = rows.map((song,index) => `<button class="stop-row" data-song="${index}"><span class="stop-no">▶</span><span><b>${esc(song.name)}</b><small>${esc(song.artist)} · ${esc(song.album)}</small></span></button>`).join('') || '<p>没有找到结果。</p>';
      box.onclick = click => { const row = click.target.closest('[data-song]'); if (row) { state.tracks = rows; playAt(Number(row.dataset.song)); } };
    });

    const togglePlay = () => dom.audio.paused ? (state.current ? attemptPlayback() : startRadio()) : dom.audio.pause();
    dom.play.onclick = dom.fullPlay.onclick = togglePlay;
    dom.prev.onclick = () => playAt(state.index - 1);
    dom.next.onclick = () => playAt(state.index + 1);
    dom.unlock.onclick = async () => { dom.audio.muted = false; try { await dom.audio.play(); dom.unlock.hidden = true; } catch { startRadio(); } };
    $('openPlayer').onclick = () => dom.playerSheet.classList.add('open');
    $('playerClose').onclick = () => dom.playerSheet.classList.remove('open');
    dom.mobileToggle.onclick = () => document.querySelector('.sidebar').classList.toggle('open');

    document.addEventListener('pointerdown', () => {
      if (dom.audio.muted && !dom.audio.paused) { dom.audio.muted = false; dom.unlock.hidden = true; }
    }, {once:true});

    dom.audio.addEventListener('play', () => { dom.play.textContent = dom.fullPlay.textContent = 'Ⅱ'; dom.playerDock?.classList.remove('loading'); });
    dom.audio.addEventListener('pause', () => { dom.play.textContent = dom.fullPlay.textContent = '▶'; });
    dom.audio.addEventListener('ended', () => playAt(state.shuffle ? Math.floor(Math.random() * state.tracks.length) : state.index + 1));
    dom.audio.addEventListener('timeupdate', () => {
      const duration = dom.audio.duration || 0, current = dom.audio.currentTime || 0, ratio = duration ? current / duration : 0;
      dom.progress.style.width = `${ratio * 100}%`;
      dom.range.value = Math.round(ratio * 1000);
      dom.currentTime.textContent = fmt(current);
      dom.durationTime.textContent = fmt(duration);
      syncLyric(current);
    });
    dom.range.oninput = () => { if (dom.audio.duration) dom.audio.currentTime = Number(dom.range.value) / 1000 * dom.audio.duration; };
    window.addEventListener('resize', () => fitTour(state.tour,false));
  }

  function init() {
    try {
      if (!D?.tours?.length) throw new Error('data-v8.js 未载入或巡演资料为空');
      renderTourList();
      bindMapGestures();
      bind();
      selectTour(state.tour.id);
      if (dom.mapStatus) dom.mapStatus.hidden = true;
      const satellite = $('satelliteMap');
      if (satellite) satellite.onerror = () => dom.mapCanvas.classList.add('satellite-hidden');
    } catch (error) {
      console.error(error);
      showFatal(error.message || String(error));
    }
    startRadio();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
