(() => {
  const BAD_PREFIX = "../assets/generated/";
  const GOOD_PREFIX = "./assets/generated/";

  function fixAssetPath(value) {
    if (typeof value !== "string" || !value) return value;
    if (value.startsWith(BAD_PREFIX)) return GOOD_PREFIX + value.slice(BAD_PREFIX.length);
    if (value.startsWith("/assets/generated/")) return "." + value;
    if (value.startsWith("AICG/assets/generated/")) return "./" + value.slice("AICG/".length);
    return value;
  }

  function fixWork(work) {
    if (!work || typeof work !== "object") return work;
    work.image = fixAssetPath(work.image);
    work.thumb = fixAssetPath(work.thumb || work.image);
    return work;
  }

  function fixStateWorks() {
    if (!window.state) return false;
    if (Array.isArray(state.works)) state.works.forEach(fixWork);
    if (Array.isArray(state.featured)) state.featured.forEach(fixWork);
    return true;
  }

  function fixRenderedImages() {
    document.querySelectorAll("img").forEach(img => {
      const raw = img.getAttribute("src");
      const fixed = fixAssetPath(raw);
      if (raw && fixed !== raw) img.setAttribute("src", fixed);
    });
  }

  if (typeof window.normalizeWork === "function") {
    const originalNormalizeWork = window.normalizeWork;
    window.normalizeWork = function patchedNormalizeWork(work) {
      return fixWork(originalNormalizeWork(work));
    };
  } else if (typeof normalizeWork === "function") {
    const originalNormalizeWork = normalizeWork;
    normalizeWork = function patchedNormalizeWork(work) {
      return fixWork(originalNormalizeWork(work));
    };
  }

  const originalRenderHero = typeof renderHero === "function" ? renderHero : null;
  if (originalRenderHero) {
    renderHero = function patchedRenderHero(...args) {
      fixStateWorks();
      return originalRenderHero(...args);
    };
  }

  const originalRenderGallery = typeof renderGallery === "function" ? renderGallery : null;
  if (originalRenderGallery) {
    renderGallery = function patchedRenderGallery(...args) {
      fixStateWorks();
      const result = originalRenderGallery(...args);
      fixRenderedImages();
      return result;
    };
  }

  function applyFix() {
    const hadState = fixStateWorks();
    fixRenderedImages();
    if (hadState && Array.isArray(state.works) && state.works.length) {
      try {
        if (typeof renderHero === "function") renderHero(false);
        if (typeof renderGallery === "function") renderGallery();
      } catch (error) {
        console.warn("Astra asset path fix deferred", error);
      }
    }
  }

  document.addEventListener("error", event => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    const raw = target.getAttribute("src");
    const fixed = fixAssetPath(raw);
    if (fixed && fixed !== raw) target.setAttribute("src", fixed);
  }, true);

  applyFix();
  document.addEventListener("DOMContentLoaded", applyFix);
  window.addEventListener("load", applyFix);
  setTimeout(applyFix, 300);
  setTimeout(applyFix, 1200);
})();
