(() => {
  'use strict';

  const D = window.MAYDAYLAND_ARCHIVE;
  const $ = id => document.getElementById(id);
  const LOGO = './mayday-logo.svg?v=11.0.0';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const palettes = [['#b45f4d','#291712'],['#5378a6','#172233'],['#c78c43','#3e2514'],['#7b6aa5','#261e3b'],['#538d75','#182c26'],['#9e596d','#351a26'],['#557f99','#172a36'],['#b17b45','#342315'],['#6d829b','#1a2531']];
  const artCache = new Map();
  const trackCache = new Map();

  async function searchAlbum(album) {
    const key = album.title;
    if (artCache.has(key)) return artCache.get(key);
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`五月天 ${album.title}`)}&entity=album&country=TW&limit=30`);
      const data = await response.json();
      const results = Array.isArray(data.results) ? data.results : [];
      const exact = results.find(row => /五月天|Mayday/i.test(row.artistName || '') && (row.collectionName || '').replace(/\s/g,'').includes(album.title.replace(/\s/g,'')));
      const hit = exact || results.find(row => /五月天|Mayday/i.test(row.artistName || ''));
      const result = {
        id: hit?.collectionId || '',
        art: hit?.artworkUrl100?.replace('100x100bb','1200x1200bb') || album.image || LOGO,
        genre: hit?.primaryGenreName || 'Mandopop',
        count: hit?.trackCount || ''
      };
      artCache.set(key, result);
      return result;
    } catch {
      const result = {id:'', art:album.image || LOGO, genre:'Mandopop', count:''};
      artCache.set(key, result);
      return result;
    }
  }

  async function albumTracks(album) {
    if (trackCache.has(album.title)) return trackCache.get(album.title);
    const info = await searchAlbum(album);
    if (!info.id) return [];
    try {
      const response = await fetch(`https://itunes.apple.com/lookup?id=${info.id}&entity=song&country=TW`);
      const data = await response.json();
      const tracks = (data.results || []).filter(row => row.wrapperType === 'track').map(row => ({name:row.trackName, number:row.trackNumber || 0}));
      trackCache.set(album.title, tracks);
      return tracks;
    } catch { return []; }
  }

  function roomMarkup() {
    const groups = [
      {name:'青春启程', years:'1999 — 2001', albums:D.albums.slice(0,3)},
      {name:'世界展开', years:'2003 — 2008', albums:D.albums.slice(3,6)},
      {name:'第二人生以后', years:'2011 — NOW', albums:D.albums.slice(6)}
    ];
    let cursor = 0;
    return `<section class="album-time-room">
      <header class="record-room-head"><div><small>MAYDAY TIME MACHINE · RECORD ROOM</small><h3>回到那一年，重新拿起那张唱片</h3><p>按发行年代陈列五月天的创作专辑。点击 CD 盒，打开当年的封面、曲目与播放入口。</p></div><div class="room-clock" aria-hidden="true">MAYDAY</div></header>
      <div class="room-scene"><i class="room-wall-light"></i><i class="room-dust"></i>
        ${groups.map(group => `<section class="shelf-row"><div class="shelf-label"><b>${group.name}</b><small>${group.years}</small></div><div class="cd-shelf">${group.albums.map(album => {
          const index = cursor++;
          const [a,b] = palettes[index % palettes.length];
          return `<button class="cd-case" data-room-album="${index}" style="--album-a:${a};--album-b:${b}"><span class="cd-jewel"><img alt="${esc(album.title)} 封面"><span class="cd-fallback"><b>${esc(album.title)}</b><small>${esc(album.date)}</small></span></span><span class="cd-spine"><b>${esc(album.title)}</b><time>${esc(album.date.slice(0,4))}</time></span></button>`;
        }).join('')}</div></section>`).join('')}
        <div class="gramophone" aria-hidden="true"><i class="horn"></i><i class="neck"></i><i class="turntable"></i><i class="base"></i></div>
      </div>
    </section>`;
  }

  function ensureModal() {
    if ($('albumDetailModal')) return $('albumDetailModal');
    document.body.insertAdjacentHTML('beforeend', `<section class="album-detail-modal" id="albumDetailModal" aria-hidden="true"><article class="album-detail-card"><button class="album-modal-close" id="albumModalClose">×</button><div class="album-disc-stage"><i class="vinyl-disc"></i><img class="album-large-cover" id="albumLargeCover" src="${LOGO}" alt="专辑封面"></div><div class="album-detail-copy"><small id="albumDetailDate">MAYDAY ALBUM</small><h2 id="albumDetailTitle">专辑</h2><h3 id="albumDetailEnglish"></h3><div class="album-detail-meta" id="albumDetailMeta"></div><div class="album-detail-actions"><button id="albumPlayAll">▶ 播放这张专辑</button><button class="secondary" id="albumSource">官方唱片资料</button></div><div class="album-track-heading"><b>完整曲目</b><small id="albumTrackCount">载入中</small></div><ol class="album-tracklist" id="albumTracklist"><li class="album-loading">正在打开唱片资料…</li></ol></div></article></section>`);
    const modal = $('albumDetailModal');
    $('albumModalClose').onclick = closeModal;
    modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
    return modal;
  }

  function closeModal() {
    const modal = $('albumDetailModal');
    modal?.classList.remove('open','playing');
    modal?.setAttribute('aria-hidden','true');
  }

  function startSongSearch(query) {
    closeModal();
    const songsButton = document.querySelector('[data-view="songs"]');
    songsButton?.click();
    setTimeout(() => {
      const input = $('songQuery');
      const form = $('songSearch');
      if (!input || !form) return;
      input.value = query;
      form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
      const results = $('songResults');
      if (!results) return;
      const observer = new MutationObserver(() => {
        const first = results.querySelector('[data-song]');
        if (first) { observer.disconnect(); first.click(); }
      });
      observer.observe(results,{childList:true,subtree:true});
      setTimeout(() => observer.disconnect(),12000);
    },80);
  }

  async function openAlbum(index) {
    const album = D.albums[index];
    if (!album) return;
    const modal = ensureModal();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    $('albumDetailDate').textContent = album.date;
    $('albumDetailTitle').textContent = album.title;
    $('albumDetailEnglish').textContent = album.english || '';
    $('albumDetailMeta').innerHTML = '<span>五月天</span><span>录音室专辑</span><span>资料核对中</span>';
    $('albumTrackCount').textContent = '载入中';
    $('albumTracklist').innerHTML = '<li class="album-loading">正在打开唱片资料…</li>';
    const info = await searchAlbum(album);
    const cover = $('albumLargeCover');
    cover.onerror = () => { cover.onerror = null; cover.src = album.image || LOGO; };
    cover.src = info.art;
    $('albumDetailMeta').innerHTML = `<span>五月天</span><span>${esc(info.genre)}</span>${info.count ? `<span>${info.count} 首</span>` : ''}`;
    $('albumSource').onclick = () => window.open(album.source || 'https://www.mayday.jp/discography/','_blank','noopener');
    $('albumPlayAll').onclick = () => { modal.classList.add('playing'); startSongSearch(`五月天 ${album.title}`); };
    const tracks = await albumTracks(album);
    $('albumTrackCount').textContent = tracks.length ? `${tracks.length} 首` : '暂无完整曲目';
    $('albumTracklist').innerHTML = tracks.length ? tracks.map((track,i) => `<li><i>${String(i+1).padStart(2,'0')}</i><span>${esc(track.name)}</span><button data-track-query="${esc(track.name)}" aria-label="播放 ${esc(track.name)}">▶</button></li>`).join('') : '<li><span>目前无法取得完整曲目，可使用“播放这张专辑”搜索歌源。</span></li>';
    $('albumTracklist').querySelectorAll('[data-track-query]').forEach(button => button.onclick = () => startSongSearch(`五月天 ${button.dataset.trackQuery}`));
  }

  async function renderRoom() {
    const body = $('archiveBody');
    if (!body || !Array.isArray(D?.albums)) return;
    $('archiveTitle').textContent = '五月天时光唱片室';
    body.className = '';
    body.innerHTML = roomMarkup();
    body.querySelectorAll('[data-room-album]').forEach(button => button.onclick = () => openAlbum(Number(button.dataset.roomAlbum)));
    D.albums.forEach(async (album,index) => {
      const img = body.querySelector(`[data-room-album="${index}"] img`);
      if (!img) return;
      const info = await searchAlbum(album);
      img.onerror = () => img.classList.add('cover-failed');
      img.src = info.art;
    });
  }

  function init() {
    ensureModal();
    document.querySelectorAll('[data-view="albums"]').forEach(button => button.addEventListener('click', () => requestAnimationFrame(renderRoom)));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
