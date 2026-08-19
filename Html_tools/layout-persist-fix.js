(function(){
  if(window.__windzxyLayoutPersistFixLoaded)return;
  window.__windzxyLayoutPersistFixLoaded=1;
  const VER='20260819-layout-persist1';

  function currentWorkspace(){
    try{return typeof activeWorkspace==='function'?activeWorkspace():null;}catch(e){return null;}
  }
  function numberFromStyle(value){
    const n=parseFloat(String(value||'').replace('px',''));
    return Number.isFinite(n)?n:null;
  }
  function persistGeometry(){
    try{
      const ws=currentWorkspace();
      if(!ws||!Array.isArray(ws.cards))return;
      document.querySelectorAll('.desktop-card[data-card-id]').forEach(el=>{
        const card=ws.cards.find(x=>String(x.id)===String(el.dataset.cardId));
        if(!card)return;
        const x=numberFromStyle(el.style.left),y=numberFromStyle(el.style.top),w=numberFromStyle(el.style.width),h=numberFromStyle(el.style.height);
        if(Number.isFinite(x))card.x=Math.max(0,Math.round(x));
        if(Number.isFinite(y))card.y=Math.max(0,Math.round(y));
        if(!card.collapsed){
          if(Number.isFinite(w))card.w=Math.max(1,Math.round(w));
          if(Number.isFinite(h))card.h=Math.max(1,Math.round(h));
        }
      });
      if(typeof save==='function')save();
    }catch(e){console.warn('layout persist failed',e);}
  }
  function patchRenderer(){
    if(window.__windzxyLayoutPersistRendererPatched||typeof renderAll!=='function')return;
    window.__windzxyLayoutPersistRendererPatched=1;
    const oldRenderAll=renderAll;
    renderAll=function(){persistGeometry();return oldRenderAll.apply(this,arguments);};
  }
  function bind(){
    patchRenderer();
    window.addEventListener('pagehide',persistGeometry,{capture:true});
    window.addEventListener('beforeunload',persistGeometry,{capture:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)persistGeometry();},{passive:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
  window.windzxyPersistLayoutNow=persistGeometry;
})();