(() => {
  const isMatureWork = work => matureRatings.has(work?.rating);
  const visibleWorks = () => {
    const works = [...state.works];
    if (!state.matureUnlocked) return works.filter(work => !isMatureWork(work));
    return works.sort((a, b) => Number(isMatureWork(b)) - Number(isMatureWork(a)));
  };

  const ensureVisibleFilter = () => {
    if (state.filter === "all" || state.filter === "favorites") return;
    if (!visibleWorks().some(work => work.category === state.filter)) state.filter = "all";
  };

  const refreshFeatured = () => {
    ensureVisibleFilter();
    const visible = visibleWorks();
    const featured = visible.filter(work => work.featured);
    state.featured = (featured.length ? featured : visible).slice(0, 5);
    if (!state.featured.length) state.featured = visible.slice(0, 5);
    state.index = Math.max(0, Math.min(state.index, Math.max(state.featured.length - 1, 0)));
  };

  renderAll = function () {
    refreshFeatured();
    applyLanguage();
    renderProtection();
    renderRail();
    renderHero(false);
    renderFilters();
    renderGallery();
    updateFavoriteCount();
  };

  renderHero = function (animate = true) {
    const work = state.featured[state.index];
    const hero = $(".hero");
    if (!work) {
      $("#heroImage").removeAttribute("src");
      $("#heroTitle").textContent = "";
      $("#heroDescription").textContent = "";
      $("#heroCounter").textContent = "00 / 00";
      $("#heroProgress").style.width = "0%";
      $("#heroLock").hidden = true;
      hero.classList.remove("is-restricted");
      return;
    }
    if (animate) hero.classList.add("is-changing");
    const update = () => {
      $("#heroImage").src = work.image;
      $("#heroImage").alt = localized(work.title);
      $("#heroIndex").textContent = String(state.index + 1).padStart(2, "0");
      $("#heroCategory").textContent = localized(work.categoryLabel).toUpperCase();
      $("#heroTitle").textContent = localized(work.title);
      $("#heroDescription").textContent = localized(work.description);
      $("#heroDate").textContent = formatDate(work.date);
      $("#heroRating").textContent = ratingLabel(work);
      $("#heroRating").className = `rating-badge ${ratingClass(work)}`;
      $("#heroStyle").textContent = localized(work.styleLabel);
      $("#heroCounter").textContent = `${String(state.index + 1).padStart(2, "0")} / ${String(state.featured.length).padStart(2, "0")}`;
      $("#heroProgress").style.width = `${((state.index + 1) / state.featured.length) * 100}%`;
      const favorite = state.favorites.has(work.id);
      $("#favoriteHero").classList.toggle("is-favorite", favorite);
      $("#favoriteHero .heart").textContent = favorite ? "♥" : "♡";
      $("#favoriteHero [data-i18n]").textContent = text(favorite ? "unfavorite" : "favorite");
      $("#heroLock").hidden = true;
      hero.classList.remove("is-restricted");
      $("#openHero").querySelector("[data-i18n]").textContent = text("viewWork");
      renderRail();
      hero.classList.remove("is-changing");
    };
    animate ? setTimeout(update, 220) : update();
  };

  renderFilters = function () {
    ensureVisibleFilter();
    const categories = [...new Set(visibleWorks().map(work => work.category))];
    const filters = ["all", ...categories, "favorites"];
    $("#filterRow").innerHTML = filters.map(filter => `<button class="filter-button ${state.filter === filter ? "active" : ""}" type="button" data-filter="${escapeHtml(filter)}">${escapeHtml(text(filter))}</button>`).join("");
    $$(".filter-button").forEach(button => button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      renderFilters();
      renderGallery();
    }));
  };

  renderGallery = function () {
    const works = visibleWorks().filter(work => state.filter === "all" || state.filter === "favorites" && state.favorites.has(work.id) || work.category === state.filter);
    $("#emptyState").hidden = works.length > 0;
    $("#galleryGrid").innerHTML = works.map(work => {
      const favorite = state.favorites.has(work.id);
      return `<article class="work-card" data-id="${escapeHtml(work.id)}" tabindex="0" aria-label="${escapeHtml(localized(work.title))}">
        <img src="${escapeHtml(work.thumb || work.image)}" alt="${escapeHtml(localized(work.title))}" loading="lazy">
        <div class="card-badges"><span class="rating-badge ${ratingClass(work)}">${ratingLabel(work)}</span><span class="style-badge">${escapeHtml(localized(work.styleLabel))}</span></div>
        <button class="favorite-card ${favorite ? "is-favorite" : ""}" type="button" data-favorite="${escapeHtml(work.id)}" aria-label="${escapeHtml(text(favorite ? "unfavorite" : "favorite"))}">${favorite ? "♥" : "♡"}</button>
        <div class="work-info"><div><span>${escapeHtml(localized(work.categoryLabel))}</span><h3>${escapeHtml(localized(work.title))}</h3></div></div>
      </article>`;
    }).join("");
    $$(".work-card").forEach(card => {
      card.addEventListener("click", event => { if (!event.target.closest("[data-favorite]")) openLightbox(card.dataset.id); });
      card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openLightbox(card.dataset.id); } });
    });
    $$('[data-favorite]').forEach(button => button.addEventListener("click", event => {
      event.stopPropagation();
      toggleFavorite(button.dataset.favorite);
    }));
  };

  const originalOpenLightbox = openLightbox;
  openLightbox = function (id) {
    const work = state.works.find(item => item.id === id);
    if (work && !state.matureUnlocked && isMatureWork(work)) {
      openAgeGate(id, work.rating);
      return;
    }
    originalOpenLightbox(id);
  };

  const originalConfirmMatureAccess = confirmMatureAccess;
  confirmMatureAccess = function () {
    const pending = state.pendingAccess;
    originalConfirmMatureAccess();
    state.index = 0;
    renderAll();
    if (pending) openLightbox(pending);
  };

  const originalLockMatureContent = lockMatureContent;
  lockMatureContent = function () {
    originalLockMatureContent();
    state.index = 0;
    renderAll();
  };

  startAutoPlay = function () {
    clearInterval(state.timer);
    if (state.featured.length > 1) state.timer = setInterval(() => selectHero(state.index + 1), 8000);
  };

  renderAll();
  startAutoPlay();
})();
