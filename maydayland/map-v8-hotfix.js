(() => {
  'use strict';

  const LOGO = 'https://logowiki.net/wp-content/uploads/imgp/Members-of-Mayday----Band-Logo-1-6457.jpg';
  const BAND_HERO = 'https://www.mayday.jp/blue/img/photo-member.jpg';
  const BLUE_HERO = 'https://www.mayday.jp/blue/img/header-cn.jpg';
  const TOUR_5525 = 'https://www.bin-music.com.tw/album/news/66014db8310af%2Btcw1200h675.jpg';
  const COVER_FALLBACK = 'https://www.mayday.jp/wp-content/uploads/5b5c7eed8c21d28d399c608497ab94561-500x500.jpg';

  // Use verified, larger official/public images instead of the small biography thumbnails.
  const archive = window.MAYDAYLAND_ARCHIVE;
  if (archive?.tours) {
    const heroByTour = {
      jump: BAND_HERO,
      life: BAND_HERO,
      jri: BLUE_HERO,
      blue: BLUE_HERO,
      '5525': TOUR_5525,
      nowhere: 'https://www.mayday.jp/img/biography-oversea-9b.jpg'
    };
    archive.tours.forEach(tour => {
      if (heroByTour[tour.id]) tour.image = heroByTour[tour.id];
    });
  }

  // Replace the intermittently incomplete CARTO tile source before the main map initializes.
  if (window.L?.tileLayer) {
    const originalTileLayer = window.L.tileLayer.bind(window.L);
    window.L.tileLayer = function (_url, options = {}) {
      return originalTileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        ...options,
        subdomains: undefined,
        maxZoom: 19,
        detectRetina: true,
        crossOrigin: true,
        attribution: '&copy; OpenStreetMap contributors'
      });
    };
  }

  // Make the tour path unmistakable on all map themes.
  if (window.L?.polyline) {
    const originalPolyline = window.L.polyline.bind(window.L);
    window.L.polyline = function (latlngs, options = {}) {
      return originalPolyline(latlngs, {
        ...options,
        weight: Math.max(Number(options.weight) || 0, 5),
        opacity: 1,
        dashArray: options.dashArray || '14 10',
        lineCap: 'round',
        lineJoin: 'round',
        className: `${options.className || ''} mayday-route`.trim()
      });
    };
  }

  const normalizeUrl = value => {
    if (!value) return value;
    if (value.startsWith('http://')) return `https://${value.slice(7)}`;
    return value;
  };

  function protectImage(img, fallback) {
    if (!img || img.dataset.maydayProtected === '1') return;
    img.dataset.maydayProtected = '1';
    img.referrerPolicy = 'no-referrer';
    const original = img.getAttribute('src');
    if (original) img.src = normalizeUrl(original);
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied === '1') return;
      img.dataset.fallbackApplied = '1';
      img.removeAttribute('crossorigin');
      img.src = fallback;
    });
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event('error'));
    }
  }

  function protectAllImages(root = document) {
    root.querySelectorAll?.('img').forEach(img => {
      const isLogo = img.classList.contains('brand-logo');
      const isCover = ['miniCover', 'fullCover'].includes(img.id) || img.closest('.player');
      protectImage(img, isLogo ? LOGO : (isCover ? COVER_FALLBACK : BAND_HERO));
    });
  }

  function refreshMapLayout() {
    // Leaflet listens to window resize; repeated refresh fixes maps initialized before side panels settle.
    window.dispatchEvent(new Event('resize'));
  }

  document.addEventListener('DOMContentLoaded', () => {
    protectAllImages();

    const observer = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.matches?.('img')) protectAllImages(node.parentElement || document);
        else protectAllImages(node);
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });

    [120, 450, 1000, 2000].forEach(ms => setTimeout(refreshMapLayout, ms));

    const mapEl = document.getElementById('map');
    if (mapEl && 'ResizeObserver' in window) {
      new ResizeObserver(() => refreshMapLayout()).observe(mapEl);
    }
  });

  window.addEventListener('load', () => {
    protectAllImages();
    setTimeout(refreshMapLayout, 80);
  });
})();
