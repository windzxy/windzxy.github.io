(() => {
  const isMature = work => ["16+", "18+"].includes(String(work?.rating || "").toLowerCase());
  const sessionKey = "astra-gallery-mature-session";

  localStorage.removeItem("astra-gallery-mature");
  state.matureUnlocked = sessionStorage.getItem(sessionKey) === "1";

  function sortedVisibleWorks(){
    const works = Array.isArray(state.works) ? [...state.works] : [];
    if (!state.matureUnlocked) return works.filter(work => !isMature(work));
    return works.sort((a, b) => Number(isMature(b)) - Number(isMature(a)));
  }

  function syncFeatured(){
    const visible = sortedVisibleWorks();
    if (state.filter !== "all" && state.filter !== "favorites" && !visible.some(work => work.category === state.filter)) state.filter = "all";
    const featured = visible.filter(work => work.featured);
    state.featured = (featured.length ? featured : visible).slice(0, 5);
    state.index = Math.max(0, Math.min(state.index || 0, Math.max(state.featured.length - 1, 0)));
  }

  renderProtection = function(){
    const toggle = document.querySelector("#protectionToggle");
    const label = document.querySelector("#protectionLabel");
    if (!toggle) return;
    toggle.classList.toggle("is-unlocked", state.matureUnlocked);
    toggle.setAttribute("aria-label", state.matureUnlocked ? text("matureMode") : text("safeMode"));
    if (label) label.textContent = text(state.matureUnlocked ? "matureMode" : "safeMode");
  };

  renderAll = function(){
    syncFeatured();
    applyLanguage();
    renderProtection();
    renderRail();
    renderHero(false);
    renderFilters();
    renderGallery();
    updateFavoriteCount();
  };

  renderRail = function(){
    const rail = document.querySelector("#seriesRail");
    if (!rail) return;
    rail.innerHTML = state.featured.map((work, index) => `<button class="series-button ${index === state.index ? "active" : ""}" type="button" data-index="${index}" aria-label="${escapeHtml(localized(work.title))}">${escapeHtml(localized(work.title))}<small>${ratingLabel(work)}</small></button>`).join("");
    document.querySelectorAll(".series-button").forEach(button => button.addEventListener("click", () => selectHero(Number(button.dataset.index))));
  };

  renderFilters = function(){
    const row = document.querySelector("#filterRow");
    if (!row) return;
    const categories = [...new Set(sortedVisibleWorks().map(work => work.category))];
    const filters = ["all", ...categories, "favorites"];
    row.innerHTML = filters.map(filter => `<button class="filter-button ${state.filter === filter ? "active" : ""}" type="button" data-filter="${escapeHtml(filter)}">${escapeHtml(text(filter))}</button>`).join("");
    document.querySelectorAll(".filter-button").forEach(button => button.addEventListener("click", () => { state.filter = button.dataset.filter; renderAll(); }));
  };

  renderHero = function(animate = true){
    const work = state.featured[state.index];
    const hero = document.querySelector(".hero");
    if (!hero) return;
    if (!work) {
      ["#heroTitle", "#heroDescription", "#heroCategory", "#heroStyle", "#heroDate", "#heroCounter"].forEach(selector => { const el = document.querySelector(selector); if (el) el.textContent = ""; });
      const img = document.querySelector("#heroImage"); if (img) img.removeAttribute("src");
      const lock = document.querySelector("#heroLock"); if (lock) lock.hidden = true;
      return;
    }
    if (animate) hero.classList.add("is-changing");
    const update = () => {
      const img = document.querySelector("#heroImage"); if (img) { img.src = work.image; img.alt = localized(work.title); }
      const set = (selector, value) => { const el = document.querySelector(selector); if (el) el.textContent = value; };
      set("#heroIndex", String(state.index + 1).padStart(2, "0"));
      set("#heroCategory", localized(work.categoryLabel).toUpperCase());
      set("#heroTitle", localized(work.title));
      set("#heroDescription", localized(work.description));
      set("#heroDate", formatDate(work.date));
      set("#heroStyle", localized(work.styleLabel));
      set("#heroCounter", `${String(state.index + 1).padStart(2, "0")} / ${String(state.featured.length).padStart(2, "0")}`);
      const rating = document.querySelector("#heroRating"); if (rating) { rating.textContent = ratingLabel(work); rating.className = `rating-badge ${ratingClass(work)}`; }
      const progress = document.querySelector("#heroProgress"); if (progress) progress.style.width = `${((state.index + 1) / Math.max(state.featured.length, 1)) * 100}%`;
      const fav = document.querySelector("#favoriteHero"); if (fav) {
        const favorite = state.favorites.has(work.id); fav.classList.toggle("is-favorite", favorite);
        const heart = fav.querySelector(".heart"); if (heart) heart.textContent = favorite ? "♥" : "♡";
        const label = fav.querySelector("[data-i18n]"); if (label) label.textContent = text(favorite ? "unfavorite" : "favorite");
      }
      hero.classList.remove("is-restricted");
      const lock = document.querySelector("#heroLock"); if (lock) lock.hidden = true;
      renderRail(); hero.classList.remove("is-changing");
    };
    animate ? setTimeout(update, 180) : update();
  };

  renderGallery = function(){
    const grid = document.querySelector("#galleryGrid");
    if (!grid) return;
    const visible = sortedVisibleWorks();
    const works = visible.filter(work => state.filter === "all" || (state.filter === "favorites" && state.favorites.has(work.id)) || work.category === state.filter);
    const empty = document.querySelector("#emptyState"); if (empty) empty.hidden = works.length > 0;
    grid.innerHTML = works.map(work => {
      const favorite = state.favorites.has(work.id);
      return `<article class="work-card" data-id="${escapeHtml(work.id)}" tabindex="0" aria-label="${escapeHtml(localized(work.title))}"><img src="${escapeHtml(work.thumb || work.image)}" alt="${escapeHtml(localized(work.title))}" loading="lazy"><div class="card-badges"><span class="rating-badge ${ratingClass(work)}">${ratingLabel(work)}</span><span class="style-badge">${escapeHtml(localized(work.styleLabel))}</span></div><button class="favorite-card ${favorite ? "is-favorite" : ""}" type="button" data-favorite="${escapeHtml(work.id)}" aria-label="${escapeHtml(text(favorite ? "unfavorite" : "favorite"))}">${favorite ? "♥" : "♡"}</button><div class="work-info"><div><span>${escapeHtml(localized(work.categoryLabel))}</span><h3>${escapeHtml(localized(work.title))}</h3></div></div></article>`;
    }).join("");
    document.querySelectorAll(".work-card").forEach(card => {
      card.addEventListener("click", event => { if (!event.target.closest("[data-favorite]")) openLightbox(card.dataset.id); });
      card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openLightbox(card.dataset.id); } });
    });
    document.querySelectorAll("[data-favorite]").forEach(button => button.addEventListener("click", event => { event.stopPropagation(); toggleFavorite(button.dataset.favorite); }));
  };

  const originalOpenLightbox = openLightbox;
  openLightbox = function(id){
    const work = state.works.find(item => item.id === id);
    if (work && isMature(work) && !state.matureUnlocked) return;
    originalOpenLightbox(id);
  };

  confirmMatureAccess = function(){
    const pending = state.pendingAccess;
    state.matureUnlocked = true;
    sessionStorage.setItem(sessionKey, "1");
    localStorage.removeItem("astra-gallery-mature");
    state.pendingAccess = null;
    const gate = document.querySelector("#ageGate"); if (gate?.open) gate.close();
    state.index = 0;
    renderAll();
    if (pending) openLightbox(pending);
  };

  lockMatureContent = function(){
    state.matureUnlocked = false;
    sessionStorage.removeItem(sessionKey);
    localStorage.removeItem("astra-gallery-mature");
    if (state.activeLightbox) closeLightbox();
    state.index = 0;
    renderAll();
  };

  startAutoPlay = function(){
    clearInterval(state.timer);
    if (state.featured.length > 1) state.timer = setInterval(() => selectHero(state.index + 1), 8000);
  };

  renderAll();
  startAutoPlay();
})();
