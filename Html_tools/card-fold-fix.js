(function(){
  if(window.__windzxyCardFoldFixV2Loaded)return;
  window.__windzxyCardFoldFixV2Loaded=1;

  const VER='20260819-card-fold2-all-cards-light';
  const COLLAPSED_H=44;

  function css(){
    if(document.getElementById('windzxyCardFoldFixStyleV2'))return;
    const s=document.createElement('style');
    s.id='windzxyCardFoldFixStyleV2';
    s.textContent=`
.desktop-card.is-collapsed,
.desktop-card[data-collapsed="1"]{
  height:${COLLAPSED_H}px!important;
  min-height:${COLLAPSED_H}px!important;
  max-height:${COLLAPSED_H}px!important;
  overflow:hidden!important;
  contain:layout paint!important;
}
.desktop-card.is-collapsed .card-bar,
.desktop-card[data-collapsed="1"] .card-bar{
  height:${COLLAPSED_H}px!important;
  min-height:${COLLAPSED_H}px!important;
  padding-top:6px!important;
  padding-bottom:6px!important;
}
.desktop-card.is-collapsed .card-body,
.desktop-card.is-collapsed .resize-grip,
.desktop-card[data-collapsed="1"] .card-body,
.desktop-card[data-collapsed="1"] .resize-grip{
  display:none!important;
  pointer-events:none!important;
  visibility:hidden!important;
}
.desktop-card.is-collapsed .card-fold,
.desktop-card[data-collapsed="1"] .card-fold{
  width:28px!important;
  height:28px!important;
  min-width:28px!important;
  border-radius:999px!important;
  display:grid!important;
  place-items:center!important;
  pointer-events:auto!important;
  cursor:pointer!important;
}
.desktop-card.is-collapsed .app-icon,
.desktop-card[data-collapsed="1"] .app-icon{
  width:28px!important;
  height:28px!important;
  min-width:28px!important;
  border-radius:10px!important;
  font-size:15px!important;
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
  function saveNow(){try{if(typeof save==='function')save();}catch(e){}try{window.windzxyPersistLayoutNow?.();}catch(e){}}
  function n(v,f=0){const x=parseFloat(String(v??'').replace('px',''));return Number.isFinite(x)?x:f;}
  function byRoot(root){const ws=activeWs();return ws?.cards?.find(c=>String(c.id)===String(root?.dataset?.cardId));}

  function setButton(root,collapsed){
    const btn=root?.querySelector?.('.card-fold');
    if(!btn)return;
    btn.textContent=collapsed?'▣':'—';
    btn.setAttribute('aria-label',collapsed?'展開':'摺疊');
    btn.title=collapsed?'展開':'摺疊';
  }

  function expandedHeight(card,root){
    const fromCard=n(card?._expandedH,0)||n(card?.foldExpandedH,0)||n(card?.h,0);
    const fromDom=n(root?.dataset?.expandedHeight,0)||n(root?.style?.height,0)||root?.offsetHeight||0;
    return Math.max(110,Math.round(fromCard||fromDom||260));
  }

  function apply(root,card){
    if(!root||!card)return;
    const collapsed=!!card.collapsed;
    root.classList.toggle('is-collapsed',collapsed);
    root.dataset.collapsed=collapsed?'1':'0';
    if(collapsed){
      const h=expandedHeight(card,root);
      card._expandedH=h;
      card.foldExpandedH=h;
      root.dataset.expandedHeight=String(h);
      root.style.height=COLLAPSED_H+'px';
    }else{
      const h=expandedHeight(card,root);
      card.h=h;
      root.style.height=h+'px';
    }
    setButton(root,collapsed);
  }

  function toggle(root){
    const card=byRoot(root);
    if(!card)return;
    const was=!!card.collapsed;
    if(!was){
      const h=Math.max(110,Math.round(n(root.style.height,0)||root.offsetHeight||card.h||260));
      card.h=h;
      card._expandedH=h;
      card.foldExpandedH=h;
      root.dataset.expandedHeight=String(h);
      card.collapsed=true;
    }else{
      card.collapsed=false;
      card.h=expandedHeight(card,root);
    }
    apply(root,card);
    saveNow();
  }

  function scan(){
    document.querySelectorAll('.desktop-card[data-card-id]').forEach(root=>{
      const card=byRoot(root);
      if(card)apply(root,card);
    });
  }

  function patchNativeToggle(){
    if(window.__windzxyNativeToggleFoldPatched)return;
    window.__windzxyNativeToggleFoldPatched=1;
    try{
      if(typeof toggleFold==='function'){
        const old=toggleFold;
        toggleFold=function(id){
          const root=document.querySelector(`.desktop-card[data-card-id="${CSS.escape(String(id))}"]`);
          if(root){toggle(root);return;}
          return old.apply(this,arguments);
        };
      }
    }catch(e){}
  }

  function bind(){
    if(window.__windzxyCardFoldFixV2Bound)return;
    window.__windzxyCardFoldFixV2Bound=1;
    document.addEventListener('pointerdown',e=>{
      if(e.target.closest?.('.card-fold'))e.stopPropagation();
    },true);
    document.addEventListener('click',e=>{
      const btn=e.target.closest?.('.card-fold');
      if(!btn)return;
      const root=btn.closest('.desktop-card[data-card-id]');
      if(!root)return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation?.();
      toggle(root);
    },true);
    window.addEventListener('resize',()=>requestAnimationFrame(scan),{passive:true});
    const canvas=document.getElementById('desktopCanvas');
    if(canvas&&window.MutationObserver){
      new MutationObserver(()=>requestAnimationFrame(scan)).observe(canvas,{childList:true,subtree:false});
    }
  }

  function boot(){
    css();
    patchNativeToggle();
    bind();
    requestAnimationFrame(scan);
    setTimeout(scan,300);
    window.windzxyCardFoldFixVersion=VER;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
