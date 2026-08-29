(() => {
  'use strict';
  function boot(){
    const badge=document.querySelector('.v64-badge');
    if(badge)badge.textContent='ROUTE GEOMETRY · 69 · 58 DATES / 9 CITIES';
    const top=document.querySelector('.v64-top small');
    if(top)top.textContent='V69 · VERIFIED CHRONOLOGY ROUTE · RELEASE CONSISTENCY';
    const title=document.querySelector('.v64-top h3');
    if(title)title.textContent='58 verified dates · 9 cities · 8 live map segments';
    const access=document.querySelector('.v67-head small');
    if(access)access.textContent='V69 · ACCESSIBILITY + CONSISTENCY QA';
    document.documentElement.dataset.maydaylandVersion='69';
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1450));
})();