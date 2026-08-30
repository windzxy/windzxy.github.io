/* Maydayland · Atlas v99 focus runtime
 * Active Atlas layer: keeps v72 operational/a11y behaviour and adds evidence-native
 * single-city focus for verified Budokan tour layers without fabricating route geometry.
 */
(() => {
  'use strict';
  const atlasStage = document.getElementById('atlasStage');
  if (!atlasStage) return;

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
  const shader = document.body.dataset.shader;
  const bloom = document.body.dataset.bloom;
  atlasStage.dataset.effectsProfile = reduceMotion ? 'reduced' : (shader === 'on' || bloom === 'on' ? 'enhanced' : 'standard');
  atlasStage.dataset.vectorLayer = 'svg-overlay';
  atlasStage.dataset.cameraMode = coarsePointer ? 'touch-safe' : 'precision';

  const nativeStatus = document.getElementById('webglStatus');
  if (nativeStatus && reduceMotion) {
    const observer = new MutationObserver(() => {
      if (nativeStatus.textContent?.includes('WebGL context lost')) {
        nativeStatus.textContent = 'WebGL context lost · atlas remains available as a reduced static surface.';
      }
    });
    observer.observe(nativeStatus, { childList:true, subtree:true, characterData:true });
  }

  const ariaDescription = document.createElement('p');
  ariaDescription.className = 'sr-only';
  ariaDescription.id = 'atlasOperationalDescription';
  ariaDescription.setAttribute('aria-live','polite');
  atlasStage.appendChild(ariaDescription);
  atlasStage.setAttribute('aria-describedby', [atlasStage.getAttribute('aria-describedby'), ariaDescription.id].filter(Boolean).join(' '));

  const verifiedSingleCityLayers = Object.freeze({
    'just-rock-it-2015-budokan': {
      cityId: 'tokyo',
      city: '東京',
      venue: '日本武道館',
      tour: 'Just Rock It! 2015',
      dates: ['2015-08-28', '2015-08-29'],
      evidence: 'OFFICIAL PRIMARY'
    },
    'redna-2017-budokan': {
      cityId: 'tokyo',
      city: '東京',
      venue: '日本武道館',
      tour: 'Re:DNA 2017',
      dates: ['2017-02-03', '2017-02-04'],
      evidence: 'OFFICIAL PRIMARY'
    }
  });

  const focusStyle = document.createElement('style');
  focusStyle.id = 'atlasFocusStyleV99';
  focusStyle.textContent = `
    #atlasStage[data-tour-focus="single-city"] .v43-city-label{opacity:.16;filter:saturate(.45) brightness(.75);transition:opacity .24s ease,filter .24s ease,transform .24s ease}
    #atlasStage[data-tour-focus="single-city"] .v43-city-label[data-city-id="tokyo"]{opacity:1;filter:none;transform:scale(1.08);z-index:8}
    #atlasStage[data-tour-focus="single-city"] .v64-chronology{opacity:.24;filter:saturate(.45);pointer-events:none;transition:opacity .24s ease,filter .24s ease}
    .v99-tour-evidence{position:absolute;left:18px;bottom:18px;z-index:18;max-width:min(390px,calc(100% - 36px));padding:14px 16px;border:1px solid rgba(255,255,255,.18);border-radius:16px;background:rgba(7,10,18,.82);backdrop-filter:blur(16px);box-shadow:0 14px 42px rgba(0,0,0,.28);color:#fff;font:500 13px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .v99-tour-evidence[hidden]{display:none}
    .v99-tour-evidence__eyebrow{font-size:10px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;opacity:.68}
    .v99-tour-evidence__title{margin-top:4px;font-size:17px;font-weight:800;letter-spacing:-.02em}
    .v99-tour-evidence__venue{margin-top:2px;opacity:.8}
    .v99-tour-evidence__dates{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
    .v99-tour-evidence__date{padding:4px 7px;border-radius:999px;background:rgba(255,255,255,.1);font-variant-numeric:tabular-nums}
    .v99-tour-evidence__note{margin-top:9px;font-size:11px;opacity:.62}
    @media (max-width:640px){.v99-tour-evidence{left:12px;right:12px;bottom:12px;max-width:none;padding:12px 13px}.v99-tour-evidence__title{font-size:15px}}
  `;
  document.head.appendChild(focusStyle);

  const evidencePanel = document.createElement('section');
  evidencePanel.className = 'v99-tour-evidence';
  evidencePanel.id = 'atlasTourEvidenceV99';
  evidencePanel.hidden = true;
  evidencePanel.setAttribute('role','status');
  evidencePanel.setAttribute('aria-live','polite');
  evidencePanel.setAttribute('aria-atomic','true');
  atlasStage.appendChild(evidencePanel);

  const activeTourId = () => document.querySelector('#tourLegend [data-tour].is-active')?.dataset.tour
    || document.querySelector('#tourLegend [data-tour][aria-pressed="true"]')?.dataset.tour
    || 'all';

  const renderTourFocus = () => {
    const id = activeTourId();
    const layer = verifiedSingleCityLayers[id];
    if (!layer) {
      delete atlasStage.dataset.tourFocus;
      delete atlasStage.dataset.focusCity;
      evidencePanel.hidden = true;
      evidencePanel.replaceChildren();
      return { mode:'overview', tourId:id };
    }

    atlasStage.dataset.tourFocus = 'single-city';
    atlasStage.dataset.focusCity = layer.cityId;
    evidencePanel.hidden = false;
    evidencePanel.innerHTML = `
      <div class="v99-tour-evidence__eyebrow">${layer.evidence} · VERIFIED SINGLE-CITY NODE</div>
      <div class="v99-tour-evidence__title">${layer.tour}</div>
      <div class="v99-tour-evidence__venue">${layer.venue} · ${layer.city}</div>
      <div class="v99-tour-evidence__dates">${layer.dates.map((date) => `<span class="v99-tour-evidence__date">${date}</span>`).join('')}</div>
      <div class="v99-tour-evidence__note">Only verified dates are surfaced. No cross-city flight segment is generated for a single-city evidence layer.</div>
    `;
    return { mode:'single-city', tourId:id, ...layer };
  };

  const updateDescription = () => {
    const selectedTour = document.getElementById('selectedTourLabel')?.textContent?.trim() || 'All tours';
    const activePhase = document.querySelector('.phase-led.is-active')?.textContent?.trim() || 'chronology hidden';
    const lights = document.getElementById('ledToggle')?.getAttribute('aria-pressed') === 'true' ? 'lights on' : 'lights off';
    const focus = renderTourFocus();
    const focusText = focus.mode === 'single-city' ? ` Focused on ${focus.city}, ${focus.venue}; verified dates ${focus.dates.join(' and ')}.` : '';
    ariaDescription.textContent = `${selectedTour}; ${activePhase}; ${lights}; ${atlasStage.dataset.effectsProfile} effects profile.${focusText}`;
  };
  updateDescription();

  const auditObserver = new MutationObserver(updateDescription);
  ['selectedTourLabel','phaseControls','ledToggle','tourLegend'].forEach((id) => {
    const node = document.getElementById(id);
    if (node) auditObserver.observe(node, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:['class','aria-pressed'] });
  });

  document.getElementById('tourLegend')?.addEventListener('click', (event) => {
    if (!event.target.closest('[data-tour]')) return;
    queueMicrotask(updateDescription);
  });

  window.MAYDAYLAND_ATLAS_FOCUS_V99 = Object.freeze({
    refresh: updateDescription,
    snapshot: () => ({
      runtime: 'MAYDAYLAND_ATLAS_V99',
      selectedTourId: activeTourId(),
      tourFocus: atlasStage.dataset.tourFocus || 'overview',
      focusCity: atlasStage.dataset.focusCity || null,
      effectsProfile: atlasStage.dataset.effectsProfile,
      evidencePanelVisible: !evidencePanel.hidden
    })
  });

  atlasStage.dataset.runtime = 'MAYDAYLAND_ATLAS_V99';
})();
