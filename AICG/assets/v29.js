(() => {
  const sessionKey = "astra-gallery-mature-session";
  const delay = 7000;
  const isMature = work => ["16+", "18+"].includes(String(work?.rating || "").toLowerCase());
  const safeWorks = () => (Array.isArray(state.works) ? state.works : []).filter(work => !isMature(work));
  const matureWorks = () => (Array.isArray(state.works) ? state.works : []).filter(isMature);
  const visibleWorks = () => state.matureUnlocked ? [...safeWorks(), ...matureWorks()] : safeWorks();
  const heroWorks = () => {
    const safe = safeWorks();
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

  function syncState(){
    const visible = visibleWorks();
    if (state.filter !== "all" && state.filter !== "favorites" && !visible.some(work => work.category === state.filter)) state.filter = "all";
    state.featured = heroWorks();
    state.index = Math.max(0, Math.min(Number(state.index) || 0, Math.max(state.featured.length - 1, 0)));
  }

  startAutoPlay = function(){
    stopAutoPlay();
    syncState();
    if (document.hidden || state.featured.length < 2) return;
    const next = state.featured[(state.index + 1) % state.featured.length];
    if (next?.image) new Image().src = next.image;
    state.timer = window.setTimeout(() => {
      if (document.hidden || state.featured.length < 2) return;
      state.index = (state.index + 1) % state.featured.length;
      renderHero(true);
      startAutoPlay();
    }, delay);
  };

  selectHero = function(index){
    syncState();
    if (!state.featured.length) return;
    stopAutoPlay();
    state.index = (Number(index) + state.featured.length) % state.featured.length;
    renderHero(true);
    startAutoPlay();
  };

  renderAll = function(){
    syncState();
    applyLanguage();
    renderProtection();
    renderRail();
    renderHero(false);
    renderFilters();
    renderGallery();
    updateFavoriteCount();
  };

  renderHero = function(animate = true){
    syncState();
    const work = state.featured[state.index];
    if (!work) return;
    const hero = document.querySelector(".hero");
    if (animate) hero.classList.add("is-changing");
    const update = () => {
      document.querySelector("#heroImage").src = work.image;
      document.querySelector("#heroImage").alt = localized(work.title);
      document.querySelector("#heroIndex").textContent = String(state.index + 1).padStart(2, "0");
      document.querySelector("#heroCategory").textContent = localized(work.categoryLabel).toUpperCase();
      document.querySelector("#heroTitle").textContent = localized(work.title);
      document.querySelector("#heroDescription").textContent = localized(work.description);
      document.querySelector("#heroDate").textContent = formatDate(work.date);
      document.querySelector("#heroRating").textContent = ratingLabel(work);
      document.querySelector("#heroRating").className = `rating-badge ${ratingClass(work)}`;
      document.querySelector("#heroStyle").textContent = localized(work.styleLabel);
      document.querySelector("#heroCounter").textContent = `${String(state.index + 1).padStart(2, "0")} / ${String(state.featured.length).padStart(2, "0")}`;
      document.querySelector("#heroProgress").style.width = `${((state.index + 1) / state.featured.length) * 100}%`;
      const favorite = state.favorites.has(work.id);
      document.querySelector("#favoriteHero").classList.toggle("is-favorite", favorite);
      document.querySelector("#favoriteHero .heart").textContent = favorite ? "♥" : "♡";
      document.querySelector("#favoriteHero [data-i18n]").textContent = text(favorite ? "unfavorite" : "favorite");
      hero.classList.remove("is-restricted");
      document.querySelector("#heroLock").hidden = true;
      document.querySelector("#openHero").querySelector("[data-i18n]").textContent = text("viewWork");
      renderRail();
      hero.classList.remove("is-changing");
    };
    animate ? setTimeout(update, 220) : update();
  };

  renderFilters = function(){
    const row = document.querySelector("#filterRow");
    if (!row) return;
    const categories = [...new Set(visibleWorks().map(work => work.category))];
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
    const works = visibleWorks().filter(work => state.filter === "all" || (state.filter === "favorites" && state.favorites.has(work.id)) || work.category === state.filter);
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
    if (work && isMature(work) && !state.matureUnlocked) return;
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
