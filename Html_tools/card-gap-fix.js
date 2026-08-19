(function(){
  if(window.__windzxyCardGapFixLoaded)return;
  window.__windzxyCardGapFixLoaded=1;

  const VER='20260819-card-gap1-5px';
  const GAP=5;
  const EDGE=5;
  const MAX_PASS=28;
  let raf=0;

  function ws(){
    try{return typeof activeWorkspace==='function'?activeWorkspace():(Array.isArray(workspaces)?workspaces[0]:null);}catch(e){return null;}
  }
  function canvas(){return document.getElementById('desktopCanvas');}
  function num(v,fallback=0){const n=parseFloat(String(v??'').replace('px',''));return Number.isFinite(n)?n:fallback;}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function cardEl(card){return card&&document.querySelector(`.desktop-card[data-card-id="${CSS.escape(String(card.id))}"]`);}
  function heightOf(card,el){return card?.collapsed||el?.classList.contains('is-collapsed')?46:num(el?.style.height,card?.h||el?.offsetHeight||140);}
  function rectOf(card,el=cardEl(card)){
    return {
      x:num(el?.style.left,card?.x||0),
      y:num(el?.style.top,card?.y||0),
      w:num(el?.style.width,card?.w||el?.offsetWidth||260),
      h:heightOf(card,el)
    };
  }
  function overlapWithGap(a,b){
    return a.x < b.x + b.w + GAP && a.x + a.w + GAP > b.x && a.y < b.y + b.h + GAP && a.y + a.h + GAP > b.y;
  }
  function apply(card,el,r,saveNow=false){
    const cv=canvas();
    const cr=cv?.getBoundingClientRect();
    if(cr){
      r.x=clamp(Math.round(r.x),EDGE,Math.max(EDGE,Math.round(cr.width-r.w-EDGE)));
      r.y=clamp(Math.round(r.y),EDGE,Math.max(EDGE,Math.round(cr.height-r.h-EDGE)));
    }
    if(card){card.x=r.x;card.y=r.y;}
    if(el){el.style.left=r.x+'px';el.style.top=r.y+'px';}
    if(saveNow)persist();
  }
  function chooseShift(a,b,cr){
    const maxX=cr?Math.max(EDGE,cr.width-a.w-EDGE):Infinity;
    const maxY=cr?Math.max(EDGE,cr.height-a.h-EDGE):Infinity;
    const options=[
      {dx:b.x-a.w-GAP-a.x,dy:0},
      {dx:b.x+b.w+GAP-a.x,dy:0},
      {dx:0,dy:b.y-a.h-GAP-a.y},
      {dx:0,dy:b.y+b.h+GAP-a.y}
    ].filter(o=>{
      const nx=a.x+o.dx,ny=a.y+o.dy;
      return nx>=EDGE-0.01&&nx<=maxX+0.01&&ny>=EDGE-0.01&&ny<=maxY+0.01;
    });
    options.sort((p,q)=>(Math.abs(p.dx)+Math.abs(p.dy))-(Math.abs(q.dx)+Math.abs(q.dy)));
    return options[0]||null;
  }
  function resolveOne(card,el,saveNow=false){
    const desk=ws();
    const cv=canvas();
    const cr=cv?.getBoundingClientRect();
    if(!desk||!card||!el)return false;
    let r=rectOf(card,el);
    let moved=false;
    for(let pass=0;pass<MAX_PASS;pass++){
      let hit=false;
      for(const other of desk.cards||[]){
        if(!other||String(other.id)===String(card.id))continue;
        const oe=cardEl(other);
        if(!oe)continue;
        const or=rectOf(other,oe);
        if(!overlapWithGap(r,or))continue;
        const s=chooseShift(r,or,cr);
        if(!s)continue;
        r.x+=s.dx;r.y+=s.dy;
        hit=true;moved=true;
        break;
      }
      if(!hit)break;
    }
    if(moved)apply(card,el,r,saveNow);
    return moved;
  }
  function resolveAll(saveNow=false){
    const desk=ws();
    if(!desk||!Array.isArray(desk.cards))return;
    let changed=false;
    for(const card of desk.cards){
      const el=cardEl(card);
      if(el)changed=resolveOne(card,el,false)||changed;
    }
    if(changed&&saveNow)persist();
  }
  function activeCard(){
    try{
      if(typeof drag!=='undefined'&&drag&&drag.item&&drag.el)return {card:drag.item,el:drag.el};
      if(typeof resize!=='undefined'&&resize&&resize.item&&resize.el)return {card:resize.item,el:resize.el};
    }catch(e){}
    return null;
  }
  function persist(){
    try{window.windzxyPersistLayoutNow?.();}
    catch(e){}
    try{if(typeof save==='function')save();}catch(e){}
  }
  function scheduleActive(){
    if(raf)return;
    raf=requestAnimationFrame(()=>{
      raf=0;
      const a=activeCard();
      if(a)resolveOne(a.card,a.el,false);
    });
  }
  function patchRender(){
    try{
      if(typeof renderDesktop==='function'&&!window.__windzxyCardGapRenderPatched){
        window.__windzxyCardGapRenderPatched=1;
        const old=renderDesktop;
        renderDesktop=function(){const out=old.apply(this,arguments);setTimeout(()=>resolveAll(true),0);return out;};
      }
    }catch(e){}
  }
  function bind(){
    patchRender();
    document.addEventListener('pointermove',scheduleActive,false);
    document.addEventListener('pointerup',()=>setTimeout(()=>resolveAll(true),0),true);
    window.addEventListener('resize',()=>setTimeout(()=>resolveAll(true),80));
    setTimeout(()=>resolveAll(true),250);
    window.windzxyEnforceCardGap=()=>resolveAll(true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();