(function(){
  if(window.__windzxyCardFoldFixLoaded)return;
  window.__windzxyCardFoldFixLoaded=1;
  const VER='20260819-card-fold1-compact-reopen';
  const COLLAPSED_H=38;

  function style(){
    if(document.getElementById('windzxyCardFoldFixStyle'))return;
    const s=document.createElement('style');
    s.id='windzxyCardFoldFixStyle';
    s.textContent=`
.desktop-card.is-collapsed,
.desktop-card[data-collapsed="1"]{
  height:${COLLAPSED_H}px!important;
  min-height:${COLLAPSED_H}px!important;
  max-height:${COLLAPSED_H}px!important;
  overflow:hidden!important;
}
.desktop-card.is-collapsed .card-bar,
.desktop-card[data-collapsed="1"] .card-bar{
  height:${COLLAPSED_H}px!important;
  min-height:${COLLAPSED_H}px!important;
  padding-top:5px!important;
  padding-bottom:5px!important;
}
.desktop-card.is-collapsed .card-body,
.desktop-card.is-collapsed .resize-grip,
.desktop-card[data-collapsed="1"] .card-body,
.desktop-card[data-collapsed="1"] .resize-grip{
  display:none!important;
  pointer-events:none!important;
}
.desktop-card.is-collapsed .card-fold,
.desktop-card[data-collapsed="1"] .card-fold{
  width:26px!important;
  height:26px!important;
  min-width:26px!important;
  border-radius:999px!important;
  display:grid!important;
  place-items:center!important;
  pointer-events:auto!important;
  cursor:pointer!important;
}
.desktop-card.is-collapsed .app-icon,
.desktop-card[data-collapsed="1"] .app-icon{
  width:26px!important;
  height:26px!important;
  min-width:26px!important;
}
.desktop-card.is-collapsed h3,
.desktop-card[data-collapsed="1"] h3{
  line-height:1!important;
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
}
`;
    document.head.appendChild(s);
  }

  function activeWs(){try{return typeof activeWorkspace==='function'?activeWorkspace():null;}catch(e){return null;}}
  function persist(){try{if(typeof save==='function')save();}catch(e){}}
  function rerender(){try{if(typeof renderAll==='function')renderAll();else if(typeof renderDesktop==='function')renderDesktop();}catch(e){}}
  function findCardByElement(el){
    const root=el.closest('[data-card-id]');
    if(!root)return null;
    const ws=activeWs();
    const card=ws?.cards?.find(c=>String(c.id)===String(root.dataset.cardId));
    return {root,card};
  }
  function applyCollapsedAttrs(){
    document.querySelectorAll('.desktop-card[data-card-id]').forEach(root=>{
      const ws=activeWs();
      const card=ws?.cards?.find(c=>String(c.id)===String(root.dataset.cardId));
      const collapsed=!!card?.collapsed||root.classList.contains('is-collapsed');
      root.classList.toggle('is-collapsed',collapsed);
      root.dataset.collapsed=collapsed?'1':'0';
      if(collapsed){
        root.style.height=COLLAPSED_H+'px';
        const btn=root.querySelector('.card-fold');
        if(btn){btn.textContent='▣';btn.setAttribute('aria-label','展開');}
      }
    });
  }
  function bindGlobal(){
    if(window.__windzxyCardFoldFixBound)return;
    window.__windzxyCardFoldFixBound=1;
    document.addEventListener('click',event=>{
      const btn=event.target.closest?.('.card-fold');
      if(!btn)return;
      const found=findCardByElement(btn);
      if(!found?.card)return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      found.card.collapsed=!found.card.collapsed;
      persist();
      rerender();
      setTimeout(applyCollapsedAttrs,0);
    },true);
    document.addEventListener('pointerdown',event=>{
      if(event.target.closest?.('.card-fold'))event.stopPropagation();
    },true);
  }
  function observe(){
    if(window.__windzxyCardFoldFixObserver)return;
    window.__windzxyCardFoldFixObserver=1;
    const run=()=>requestAnimationFrame(applyCollapsedAttrs);
    new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
    window.addEventListener('resize',run,{passive:true});
    document.addEventListener('click',()=>setTimeout(run,40),true);
    run();setTimeout(run,300);setTimeout(run,1200);
  }
  function boot(){style();bindGlobal();observe();applyCollapsedAttrs();window.windzxyCardFoldFixVersion=VER;}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
