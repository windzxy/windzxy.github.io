(function(){
  if(window.__windzxyCardFoldFixV4Loaded)return;
  window.__windzxyCardFoldFixV4Loaded=1;

  const VER='20260819-card-fold4-preserve-body';
  const COLLAPSED_H=44;
  const MIN_W=156;
  const MAX_W=238;

  function css(){
    if(document.getElementById('windzxyCardFoldFixStyleV4'))return;
    const s=document.createElement('style');
    s.id='windzxyCardFoldFixStyleV4';
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
  padding:6px 8px!important;
  gap:8px!important;
}
.desktop-card.is-collapsed .card-body,
.desktop-card.is-collapsed .resize-grip,
.desktop-card[data-collapsed="1"] .card-body,
.desktop-card[data-collapsed="1"] .resize-grip{
  visibility:hidden!important;
  opacity:0!important;
  pointer-events:none!important;
}
.desktop-card.is-collapsed .card-body,
.desktop-card[data-collapsed="1"] .card-body{
  height:0!important;
  max-height:0!important;
  overflow:hidden!important;
}
.desktop-card.is-collapsed .card-fold,
.desktop-card.is-collapsed .card-remove,
.desktop-card[data-collapsed="1"] .card-fold,
.desktop-card[data-collapsed="1"] .card-remove{
  width:26px!important;
  height:26px!important;
  min-width:26px!important;
  border-radius:999px!important;
  display:grid!important;
  place-items:center!important;
  pointer-events:auto!important;
  cursor:pointer!important;
  flex:0 0 26px!important;
}
.desktop-card.is-collapsed .app-icon,
.desktop-card[data-collapsed="1"] .app-icon{
  width:28px!important;
  height:28px!important;
  min-width:28px!important;
  border-radius:10px!important;
  font-size:14px!important;
  flex:0 0 28px!important;
}
.desktop-card.is-collapsed h3,
.desktop-card[data-collapsed="1"] h3{
  line-height:1!important;
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
  min-width:0!important;
}
`;
    document.head.appendChild(s);
  }

  function activeWs(){try{return typeof activeWorkspace==='function'?activeWorkspace():null;}catch(e){return null;}}
  function saveNow(){try{if(typeof save==='function')save();}catch(e){}try{window.windzxyPersistLayoutNow?.();}catch(e){}}
  function n(v,f=0){const x=parseFloat(String(v??'').replace('px',''));return Number.isFinite(x)?x:f;}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function byRoot(root){const ws=activeWs();return ws?.cards?.find(c=>String(c.id)===String(root?.dataset?.cardId));}
  function appInfo(card){try{return apps?.find(a=>a.id===card?.appId)||null;}catch(e){return null;}}

  function collapsedWidth(root){
    const title=(root?.querySelector('h3')?.textContent||'Card').trim();
    const len=[...title].reduce((sum,ch)=>sum+(/[^\x00-\xff]/.test(ch)?13:8),0);
    return clamp(Math.round(92+len),MIN_W,MAX_W);
  }
  function fitInside(root,w){
    const canvas=document.getElementById('desktopCanvas');
    const cw=canvas?.clientWidth||window.innerWidth||w;
    const x=n(root?.style?.left,0);
    return Math.max(MIN_W,Math.min(w,Math.max(MIN_W,cw-x-10)));
  }
  function setButton(root,collapsed){
    const btn=root?.querySelector?.('.card-fold');
    if(!btn)return;
    btn.textContent=collapsed?'▣':'—';
    btn.setAttribute('aria-label',collapsed?'展開':'摺疊');
    btn.title=collapsed?'展開':'摺疊';
  }
  function expandedSize(card,root){
    const w=n(card?.foldExpandedW,0)||n(card?._expandedW,0)||n(root?.dataset?.expandedWidth,0)||n(card?.w,0)||n(root?.style?.width,0)||root?.offsetWidth||300;
    const h=n(card?.foldExpandedH,0)||n(card?._expandedH,0)||n(root?.dataset?.expandedHeight,0)||n(card?.h,0)||n(root?.style?.height,0)||root?.offsetHeight||220;
    return {w:Math.max(180,Math.round(w)),h:Math.max(110,Math.round(h))};
  }
  function storeExpanded(card,root){
    const w=Math.max(180,Math.round(n(root.style.width,0)||root.offsetWidth||card.w||300));
    const h=Math.max(110,Math.round(n(root.style.height,0)||root.offsetHeight||card.h||220));
    card.foldExpandedW=w;card._expandedW=w;root.dataset.expandedWidth=String(w);
    card.foldExpandedH=h;card._expandedH=h;root.dataset.expandedHeight=String(h);
  }
  function bodyEmpty(root){
    const body=root?.querySelector?.('.card-body');
    if(!body)return false;
    return !body.children.length && !String(body.textContent||'').trim();
  }
  function restoreBody(root,card){
    const body=root?.querySelector?.('.card-body');
    if(!body||!card||!bodyEmpty(root))return;
    try{
      if(typeof bodyHtml==='function'){
        const html=bodyHtml(card,appInfo(card));
        if(String(html||'').trim()){
          body.innerHTML=html;
          setTimeout(()=>{
            try{window.tickWidgets?.();}catch(e){}
            try{window.windzxyRefreshFx?.();}catch(e){}
            try{window.windzxyRefreshMetals?.();}catch(e){}
            document.dispatchEvent(new CustomEvent('windzxy-card-expanded',{detail:{id:card.id,appId:card.appId}}));
          },0);
          return;
        }
      }
    }catch(e){console.warn(e);}
    try{if(typeof renderDesktop==='function')renderDesktop();}catch(e){}
  }
  function apply(root,card){
    if(!root||!card)return;
    const collapsed=!!card.collapsed;
    root.classList.toggle('is-collapsed',collapsed);
    root.dataset.collapsed=collapsed?'1':'0';
    if(collapsed){
      const w=fitInside(root,collapsedWidth(root));
      card.w=w;
      root.style.width=w+'px';
      root.style.height=COLLAPSED_H+'px';
    }else{
      const size=expandedSize(card,root);
      card.w=size.w;card.h=size.h;
      root.style.width=size.w+'px';
      root.style.height=size.h+'px';
      restoreBody(root,card);
    }
    setButton(root,collapsed);
  }
  function toggle(root){
    const card=byRoot(root);
    if(!card)return;
    if(!card.collapsed){
      storeExpanded(card,root);
      card.collapsed=true;
    }else{
      card.collapsed=false;
      const size=expandedSize(card,root);
      card.w=size.w;card.h=size.h;
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
    if(window.__windzxyNativeToggleFoldPatchedV4)return;
    window.__windzxyNativeToggleFoldPatchedV4=1;
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
    if(window.__windzxyCardFoldFixV4Bound)return;
    window.__windzxyCardFoldFixV4Bound=1;
    document.addEventListener('pointerdown',e=>{if(e.target.closest?.('.card-fold'))e.stopPropagation();},true);
    document.addEventListener('click',e=>{
      const btn=e.target.closest?.('.card-fold');
      if(!btn)return;
      const root=btn.closest('.desktop-card[data-card-id]');
      if(!root)return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
      toggle(root);
    },true);
    window.addEventListener('resize',()=>requestAnimationFrame(scan),{passive:true});
    const canvas=document.getElementById('desktopCanvas');
    if(canvas&&window.MutationObserver)new MutationObserver(()=>requestAnimationFrame(scan)).observe(canvas,{childList:true,subtree:false});
  }
  function boot(){
    css();patchNativeToggle();bind();requestAnimationFrame(scan);setTimeout(scan,300);
    window.windzxyCardFoldFixVersion=VER;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
