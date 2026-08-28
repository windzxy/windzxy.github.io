(function(){
  'use strict';
  const VER='20260828-metals-calendar-restore-guard1';
  if(window.__windzxyMetalsCalendarRestoreGuard===VER)return;
  window.__windzxyMetalsCalendarRestoreGuard=VER;

  const CAL_SEL='.calendar-v10,.calendar-v9,.calendar-v8,.calendar-v7,.calendar-v6,.calendar-v5,.calendar-v4,.cal10-app,.cal9-app,.cal8-app,.cal7-app,.cal6-app';
  const METALS_RE=/^(Metals|金價|黃金|貴金屬)$/i;

  function cardTitle(card){return (card?.querySelector('.card-bar h3')?.textContent||card?.querySelector('h3')?.textContent||'').trim();}
  function isMetalsCard(card){
    const title=cardTitle(card);
    const app=(card?.dataset?.appId||card?.getAttribute('data-app-id')||card?.dataset?.inlineApp||'').toLowerCase();
    return app==='metals'||METALS_RE.test(title)||/\bAU\b/i.test(card?.querySelector('.app-icon,.card-icon')?.textContent||'');
  }
  function hasCalendarBody(card){return !!card?.querySelector('.card-body')?.querySelector(CAL_SEL);}
  function metalsHtml(){
    try{if(typeof window.appContent==='function'){const html=window.appContent('metals');if(html&&/metals|gold|貴金屬|TradingView|XAU|AU/i.test(html))return html;}}catch(e){}
    try{if(typeof window.bodyHtml==='function'){const html=window.bodyHtml({appId:'metals',title:'Metals',data:{}},{id:'metals'});if(html&&/metals|gold|貴金屬|TradingView|XAU|AU/i.test(html))return html;}}catch(e){}
    return '<div class="metals-widget metals-widget-pending" data-metals-restored="1" style="padding:16px;color:#fff"><b>Metals</b><p style="opacity:.72;margin:.5em 0 0">Reloading metals widget…</p></div>';
  }
  function restoreOne(card){
    const body=card.querySelector('.card-body');
    if(!body||!isMetalsCard(card)||!hasCalendarBody(card))return false;
    body.innerHTML=metalsHtml();
    card.classList.remove('calendar-v10-card','calendar-v9-card','calendar-v8-card','calendar-v7-card','calendar-v6-card');
    card.classList.add('metals-card-restored');
    body.dispatchEvent(new CustomEvent('windzxy:metals-restored',{bubbles:true}));
    document.dispatchEvent(new CustomEvent('windzxy:metals-restored',{detail:{card}}));
    return true;
  }
  function restoreAll(){
    let count=0;
    document.querySelectorAll('.desktop-card').forEach(card=>{if(restoreOne(card))count++;});
    if(count){
      try{document.dispatchEvent(new CustomEvent('windzxy:layout-changed'));}catch(e){}
    }
    return count;
  }
  function boot(){
    restoreAll();
    setTimeout(restoreAll,150);
    setTimeout(restoreAll,800);
    new MutationObserver(()=>restoreAll()).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();