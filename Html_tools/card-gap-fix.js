(function(){
  if(window.__windzxyCardGapFixLoaded)return;
  window.__windzxyCardGapFixLoaded=1;

  const VER='20260819-card-gap2-new-card-only';
  const GAP=5;
  const EDGE=5;
  const SCAN_STEP=18;
  let raf=0;
  let patched=false;
  let lastActiveId=null;
  const knownIds=new Set();

  function ws(){
    try{return typeof activeWorkspace==='function'?activeWorkspace():(Array.isArray(workspaces)?workspaces[0]:null);}catch(e){return null;}
  }
  function cv(){return document.getElementById('desktopCanvas');}
  function num(v,fallback=0){const n=parseFloat(String(v??'').replace('px',''));return Number.isFinite(n)?n:fallback;}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function esc(s){try{return CSS.escape(String(s));}catch(e){return String(s).replace(/"/g,'\\"');}}
  function cardEl(cardOrId){const id=typeof cardOrId==='object'?cardOrId?.id:cardOrId;return id?document.querySelector(`.desktop-card[data-card-id="${esc(id)}"]`):null;}
  function heightOf(card,el){return card?.collapsed||el?.classList.contains('is-collapsed')?46:num(el?.style.height,card?.h||el?.offsetHeight||140);}
  function rectOf(card,el=cardEl(card)){
    return {
      x:num(el?.style.left,card?.x||0),
      y:num(el?.style.top,card?.y||0),
      w:num(el?.style.width,card?.w||el?.offsetWidth||260),
      h:heightOf(card,el)
    };
  }
  function bounded(r){
    const box=cv()?.getBoundingClientRect();
    const out=Object.assign({},r);
    if(box){
      out.x=clamp(Math.round(out.x),EDGE,Math.max(EDGE,Math.round(box.width-out.w-EDGE)));
      out.y=clamp(Math.round(out.y),EDGE,Math.max(EDGE,Math.round(box.height-out.h-EDGE)));
    }
    return out;
  }
  function overlap(a,b){
    return a.x < b.x + b.w + GAP && a.x + a.w + GAP > b.x && a.y < b.y + b.h + GAP && a.y + a.h + GAP > b.y;
  }
  function allOtherRects(card){
    const desk=ws();
    if(!desk||!Array.isArray(desk.cards))return [];
    return desk.cards.filter(other=>other&&String(other.id)!==String(card.id)).map(other=>{
      const el=cardEl(other);
      if(!el)return null;
      return rectOf(other,el);
    }).filter(Boolean);
  }
  function isFree(card,r){
    const rr=bounded(r);
    return !allOtherRects(card).some(or=>overlap(rr,or));
  }
  function apply(card,el,r,saveNow=false){
    const rr=bounded(r);
    if(card){card.x=rr.x;card.y=rr.y;}
    if(el){el.style.left=rr.x+'px';el.style.top=rr.y+'px';}
    if(saveNow)persist();
    return rr;
  }
  function nearestFree(card,origin){
    const box=cv()?.getBoundingClientRect();
    let base=bounded(origin);
    if(isFree(card,base))return base;
    if(!box)return base;
    const maxX=Math.max(EDGE,Math.floor(box.width-base.w-EDGE));
    const maxY=Math.max(EDGE,Math.floor(box.height-base.h-EDGE));
    const candidates=[];

    // First try close positions around the requested location, so a newly added card
    // appears near where the desktop originally put it, without moving old cards.
    for(let radius=GAP+SCAN_STEP;radius<=220;radius+=SCAN_STEP){
      candidates.push({x:base.x+radius,y:base.y},{x:base.x-radius,y:base.y},{x:base.x,y:base.y+radius},{x:base.x,y:base.y-radius});
      candidates.push({x:base.x+radius,y:base.y+radius},{x:base.x-radius,y:base.y+radius},{x:base.x+radius,y:base.y-radius},{x:base.x-radius,y:base.y-radius});
    }
    // Then scan the desktop grid. Existing cards are treated as fixed obstacles.
    for(let y=EDGE;y<=maxY;y+=SCAN_STEP){
      for(let x=EDGE;x<=maxX;x+=SCAN_STEP)candidates.push({x,y});
    }
    let best=null,bestScore=Infinity;
    for(const c of candidates){
      const r=bounded({x:c.x,y:c.y,w:base.w,h:base.h});
      if(!isFree(card,r))continue;
      const score=Math.abs(r.x-base.x)+Math.abs(r.y-base.y)+(r.y*0.015)+(r.x*0.005);
      if(score<bestScore){bestScore=score;best=r;}
    }
    return best||base;
  }
  function placeCardOnly(card,saveNow=false){
    const el=cardEl(card);
    if(!card||!el)return false;
    const origin=rectOf(card,el);
    const target=nearestFree(card,origin);
    const moved=Math.round(origin.x)!==Math.round(target.x)||Math.round(origin.y)!==Math.round(target.y);
    if(moved)apply(card,el,target,saveNow);
    return moved;
  }
  function markKnown(){
    const desk=ws();
    if(desk&&Array.isArray(desk.cards))desk.cards.forEach(card=>card?.id&&knownIds.add(String(card.id)));
    document.querySelectorAll('.desktop-card[data-card-id]').forEach(el=>knownIds.add(String(el.dataset.cardId)));
  }
  function placeOnlyUnknown(saveNow=false){
    const desk=ws();
    if(!desk||!Array.isArray(desk.cards))return;
    let changed=false;
    for(const card of desk.cards){
      if(!card?.id)continue;
      const id=String(card.id);
      if(knownIds.has(id))continue;
      changed=placeCardOnly(card,false)||changed;
      knownIds.add(id);
    }
    if(changed&&saveNow)persist();
  }
  function active(){
    try{
      if(typeof drag!=='undefined'&&drag&&drag.item&&drag.el){lastActiveId=String(drag.item.id);return {card:drag.item,el:drag.el};}
      if(typeof resize!=='undefined'&&resize&&resize.item&&resize.el){lastActiveId=String(resize.item.id);return {card:resize.item,el:resize.el};}
    }catch(e){}
    if(lastActiveId){
      const desk=ws();
      const card=desk?.cards?.find(c=>String(c.id)===String(lastActiveId));
      const el=cardEl(lastActiveId);
      if(card&&el)return {card,el};
    }
    return null;
  }
  function persist(){
    try{window.windzxyPersistLayoutNow?.();}catch(e){}
    try{if(typeof save==='function')save();}catch(e){}
  }
  function scheduleActiveOnly(){
    if(raf)return;
    raf=requestAnimationFrame(()=>{
      raf=0;
      const a=active();
      if(a)placeCardOnly(a.card,false);
    });
  }
  function clampAllToCanvas(saveNow=false){
    const desk=ws();
    if(!desk||!Array.isArray(desk.cards))return;
    let changed=false;
    desk.cards.forEach(card=>{
      const el=cardEl(card);if(!el)return;
      const r=rectOf(card,el),b=bounded(r);
      if(Math.round(r.x)!==b.x||Math.round(r.y)!==b.y){apply(card,el,b,false);changed=true;}
    });
    if(changed&&saveNow)persist();
  }
  function patch(){
    if(patched)return;patched=true;
    try{
      if(typeof addCard==='function'&&!window.__windzxyCardGapAddPatched){
        window.__windzxyCardGapAddPatched=1;
        const oldAdd=addCard;
        addCard=function(appId){
          const before=new Set((ws()?.cards||[]).map(c=>String(c.id)));
          const out=oldAdd.apply(this,arguments);
          setTimeout(()=>{
            const desk=ws();
            if(desk&&Array.isArray(desk.cards)){
              desk.cards.forEach(card=>{if(before.has(String(card.id)))knownIds.add(String(card.id));});
            }
            placeOnlyUnknown(true);
          },0);
          return out;
        };
      }
      if(typeof renderDesktop==='function'&&!window.__windzxyCardGapRenderPatched){
        window.__windzxyCardGapRenderPatched=1;
        const oldRender=renderDesktop;
        renderDesktop=function(){
          const out=oldRender.apply(this,arguments);
          // Do not resolve the whole desktop. Only cards that did not exist before
          // this render are allowed to move.
          setTimeout(()=>placeOnlyUnknown(true),0);
          return out;
        };
      }
    }catch(e){console.warn('card gap patch failed',e);}
  }
  function bind(){
    markKnown();
    patch();
    setTimeout(markKnown,120);
    document.addEventListener('pointermove',scheduleActiveOnly,false);
    document.addEventListener('pointerup',()=>setTimeout(()=>{const a=active();if(a)placeCardOnly(a.card,true);lastActiveId=null;markKnown();},0),true);
    window.addEventListener('resize',()=>setTimeout(()=>clampAllToCanvas(true),80));
    window.windzxyEnforceCardGap=()=>{const a=active();if(a)placeCardOnly(a.card,true);else placeOnlyUnknown(true);};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();