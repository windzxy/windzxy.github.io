(() => {
  const sessionKey = "astra-gallery-mature-session";
  const carouselDelay = 7000;
  const isMatureWork = work => ["16+", "18+"].includes(String(work?.rating || "").toLowerCase());
  const normalWorks = () => (Array.isArray(state.works) ? state.works : []).filter(work => !isMatureWork(work));
  const matureWorks = () => (Array.isArray(state.works) ? state.works : []).filter(isMatureWork);
  const visibleGalleryWorks = () => state.matureUnlocked ? [...normalWorks(), ...matureWorks()] : normalWorks();
  const carouselWorks = () => {
    const safe = normalWorks();
    const featured = safe.filter(work => work.featured === true);
    return (featured.length ? featured : safe).slice(0, 5);
  };

  localStorage.removeItem("astra-gallery-mature");
  state.matureUnlocked = sessionStorage.getItem(sessionKey) === "1";

  function stopAutoPlay(){
    if (state.timer !== null) {
      clearTimeout(state.timer);
      clearInterval(state.timer);
      state.timer = null;
    }
  }

  function preloadNext(){
    if (!Array.isArray(state.featured) || state.featured.length < 2) return;
    const next = state.featured[(state.index + 1) % state.featured.length];
    if (next?.image) {
      const image = new Image();
      image.src = next.image;
    }
  }

  function syncVisibleState(){
    const visible = visibleGalleryWorks();
    if (state.filter !== "all" && state.filter !== "favorites" && !visible.some(work => work.category === state.filter)) state.filter = "all";
    state.featured = carouselWorks();
    state.index = Math.max(0, Math.min(Number(state.index) || 0, Math.max(state.featured.length - 1, 0)));
  }

  startAutoPlay = function(){
    stopAutoPlay();
    syncVisibleState();
    if (document.hidden || state.featured.length < 2) return;
    preloadNext();
    state.timer = window.setTimeout(() => {
      if (document.hidden || state.featured.length < 2) return;
      state.index = (state.index + 1) % state.featured.length;
      renderHero(true);
      startAutoPlay();
    }, carouselDelay);
  };

  selectHero = function(index){
    syncVisibleState();
    if (!state.featured.length) return;
    stopAutoPlay();
    state.index = (Number(index) + state.featured.length) % state.featured.length;
    renderHero(true);
    startAutoPlay();
  };

  renderAll = function(){
    syncVisibleState();
    applyLanguage();
    renderProtection();
    renderRail();
    renderHero(false);
    renderFilters();
    renderGallery();
    updateFavoriteCount();
  };

  renderFilters = function(){
    const row = document.querySelector("#filterRow");
    if (!row) return;
    const categories = [...new Set(visibleGalleryWorks().map(work => work.category))];
    const filters = ["all", ...categories, "favorites"];
    row.innerHTML = filters.map(filter => `<button class="filter-button ${state.filter === filter ? "active" : ""}" type="button" data-filter="${escapeHtml(filter)}">${escapeHtml(text(filter))}</button>`).join("");
    document.querySelectorAll(".filter-button").forEach(button => button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      renderFilters();
      renderGallery();
    }));
  };

  renderGallery = function(){
    const grid = document.querySelector("#galleryGrid");
    if (!grid) return;
    const works = visibleGalleryWorks().filter(work => state.filter === "all" || (state.filter === "favorites" && state.favorites.has(work.id)) || work.category === state.filter);
    const empty = document.querySelector("#emptyState");
    if (empty) empty.hidden = works.length > 0;
    grid.innerHTML = works.map(work => {
      const favorite = state.favorites.has(work.id);
      return `<article class="work-card" data-id="${escapeHtml(work.id)}" tabindex="0" aria-label="${escapeHtml(localized(work.title))}"><img src="${escapeHtml(work.thumb || work.image)}" alt="${escapeHtml(localized(work.title))}" loading="lazy"><div class="card-badges"><span class="rating-badge ${ratingClass(work)}">${ratingLabel(work)}</span><span class="style-badge">${escapeHtml(localized(work.styleLabel))}</span></div><button class="favorite-card ${favorite ? "is-favorite" : ""}" type="button" data-favorite="${escapeHtml(work.id)}" aria-label="${escapeHtml(text(favorite ? "unfavorite" : "favorite"))}">${favorite ? "♥" : "♡"}</button><div class="work-info"><div><span>${escapeHtml(localized(work.categoryLabel))}</span><h3>${escapeHtml(localized(work.title))}</h3></div></div></article>`;
    }).join("");
    document.querySelectorAll(".work-card").forEach(card => {
      card.addEventListener("click", event => { if (!event.target.closest("[data-favorite]")) openLightbox(card.dataset.id); });
      card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openLightbox(card.dataset.id); } });
    });
    document.querySelectorAll("[data-favorite]").forEach(button => button.addEventListener("click", event => {
      event.stopPropagation();
      toggleFavorite(button.dataset.favorite);
    }));
  };

  const baseOpenLightbox = openLightbox;
  openLightbox = function(id){
    const work = state.works.find(item => item.id === id);
    if (work && isMatureWork(work) && !state.matureUnlocked) return;
    stopAutoPlay();
    baseOpenLightbox(id);
  };

  const baseCloseLightbox = closeLightbox;
  closeLightbox = function(){
    baseCloseLightbox();
    startAutoPlay();
  };

  confirmMatureAccess = function(){
    state.matureUnlocked = true;
    sessionStorage.setItem(sessionKey, "1");
    localStorage.removeItem("astra-gallery-mature");
    state.pendingAccess = null;
    const gate = document.querySelector("#ageGate");
    if (gate?.open) gate.close();
    state.index = 0;
    renderAll();
    startAutoPlay();
  };

  lockMatureContent = function(){
    state.matureUnlocked = false;
    sessionStorage.removeItem(sessionKey);
    localStorage.removeItem("astra-gallery-mature");
    if (state.activeLightbox) closeLightbox();
    state.index = 0;
    renderAll();
    startAutoPlay();
  };

  renderAll();
  startAutoPlay();
})();
