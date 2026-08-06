(() => {
  'use strict';

  const D = window.MAYDAYLAND_ARCHIVE;
  const $ = id => document.getElementById(id);
  const officialBand = 'https://www.mayday.jp/blue/img/photo-member.jpg';
  const officialBlue = 'https://www.mayday.jp/blue/img/header-cn.jpg';
  const official5525 = 'https://www.bin-music.com.tw/album/news/66014db8310af%2Btcw1200h675.jpg';

  const imageFor = tour => ({
    '5525': official5525,
    blue: officialBlue,
    jri: officialBlue
  }[tour?.id] || officialBand);

  const randomIndex = length => {
    if (length <= 1) return 0;
    if (globalThis.crypto?.getRandomValues) {
      const value = new Uint32Array(1);
      globalThis.crypto.getRandomValues(value);
      return value[0] % length;
    }
    return Math.floor(Math.random() * length);
  };

  let currentId = '';

  function pickRecommendation(excludeCurrent = false) {
    const tours = Array.isArray(D?.tours) ? D.tours.filter(tour => tour?.stops?.length) : [];
    if (!tours.length) return null;
    const pool = excludeCurrent && tours.length > 1 ? tours.filter(tour => tour.id !== currentId) : tours;
    const tour = pool[randomIndex(pool.length)];
    currentId = tour.id;
    return tour;
  }

  function render(tour) {
    if (!tour) return;
    const cover = $('recommendCover');
    const title = $('recommendTitle');
    const meta = $('recommendMeta');
    const play = $('recommendPlay');
    const dots = document.querySelectorAll('.recommend-mini-list i');

    cover.referrerPolicy = 'no-referrer';
    cover.onerror = () => {
      cover.onerror = null;
      cover.src = './mayday-logo.svg?v=10.0.0';
    };
    cover.src = imageFor(tour);
    title.textContent = tour.name;
    meta.textContent = `${tour.years} · ${tour.stops.length} 个路线节点 · 随机推荐`;
    play.dataset.tour = tour.id;
    dots.forEach((dot, index) => dot.classList.toggle('active', index === randomIndex(dots.length)));
  }

  function playRecommended() {
    const play = $('recommendPlay');
    const tourId = play?.dataset.tour;
    if (!tourId) return;
    const panel = $('recommendPanel');
    panel?.classList.add('loading');
    const tourButton = document.querySelector(`[data-tour="${CSS.escape(tourId)}"]`);
    tourButton?.click();
    setTimeout(() => {
      const playTour = document.querySelector('[data-play-tour]');
      if (playTour) playTour.click();
      else $('playButton')?.click();
      panel?.classList.remove('loading');
    }, 120);
  }

  function init() {
    const first = pickRecommendation(false);
    render(first);
    $('recommendRefresh')?.addEventListener('click', () => render(pickRecommendation(true)));
    $('recommendPlay')?.addEventListener('click', playRecommended);
    $('recommendCover')?.addEventListener('click', playRecommended);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
