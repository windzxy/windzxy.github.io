(() => {
  const ROTATE_MS = 6500;
  const LAST_HERO_KEY = "astra-gallery-last-safe-hero";
  const isMatureWork = work => ["16+", "18+"].includes(String(work?.rating || "").toLowerCase());

  let queue = [];
  let carouselTimer = null;
  let initialized = false;

  function buildQueue(preserveCurrent = true) {
    const currentId = preserveCurrent ? state.featured?.[state.index]?.id : null;
    const safeWorks = (Array.isArray(state.works) ? state.works : []).filter(work => !isMatureWork(work));
    const featuredSafe = safeWorks.filter(work => work.featured === true);
    const source = featuredSafe.length >= 2 ? featuredSafe : safeWorks;

    queue = [...source];
    if (!queue.length) {
      state.featured = [];
      state.index = 0;
      return;
    }

    let startIndex = currentId ? queue.findIndex(work => work.id === currentId) : -1;
    if (startIndex < 0 && queue.length > 1) {
      const lastId = sessionStorage.getItem(LAST_HERO_KEY);
      startIndex = Math.floor(Math.random() * queue.length);
      if (queue[startIndex]?.id === lastId) startIndex = (startIndex + 1) % queue.length;
    }
    if (startIndex < 0) startIndex = 0;

    queue = [...queue.slice(startIndex), ...queue.slice(0, startIndex)];
    state.featured = queue;
    state.index = 0;
  }

  function preloadNext() {
    if (queue.length < 2) return;
    const next = queue[(state.index + 1) % queue.length];
    if (!next?.image) return;
    const image = new Image();
    image.src = next.image;
  }

  function showHero(index, animate = true) {
    if (!queue.length) buildQueue(false);
    if (!queue.length) return;

    state.featured = queue;
    state.index = (Number(index) + queue.length) % queue.length;
    renderHero(animate);

    const active = queue[state.index];
    if (active?.id) sessionStorage.setItem(LAST_HERO_KEY, active.id);
    preloadNext();
  }

  function stopCarousel() {
    clearInterval(carouselTimer);
    clearInterval(state.timer);
    clearTimeout(state.timer);
    carouselTimer = null;
    state.timer = null;
  }

  function scheduleCarousel() {
    stopCarousel();
    if (queue.length < 2 || document.hidden) return;
    carouselTimer = window.setInterval(() => showHero(state.index + 1, true), ROTATE_MS);
    state.timer = carouselTimer;
  }

  startAutoPlay = function () {
    if (!queue.length && Array.isArray(state.works) && state.works.length) buildQueue(true);
    scheduleCarousel();
  };

  selectHero = function (index) {
    showHero(index, true);
    scheduleCarousel();
  };

  const previousRenderAll = renderAll;
  renderAll = function () {
    previousRenderAll();
    if (!Array.isArray(state.works) || !state.works.length) return;
    buildQueue(true);
    renderRail();
    renderHero(false);
    scheduleCarousel();
  };

  function initialize(attempt = 0) {
    if (!Array.isArray(state.works) || !state.works.length) {
      if (attempt < 80) window.setTimeout(() => initialize(attempt + 1), 100);
      return;
    }

    buildQueue(false);
    showHero(0, false);
    scheduleCarousel();
    initialized = true;

    const heroImage = document.querySelector("#heroImage");
    if (heroImage) {
      heroImage.onerror = () => {
        if (queue.length > 1) {
          showHero(state.index + 1, false);
          scheduleCarousel();
        }
      };
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopCarousel();
    else if (initialized) scheduleCarousel();
  });

  window.addEventListener("pageshow", () => {
    if (initialized) scheduleCarousel();
  });

  initialize();
})();
