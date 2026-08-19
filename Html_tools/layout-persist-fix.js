(function(){
  if(window.__windzxyLayoutPersistFixLoaded)return;
  window.__windzxyLayoutPersistFixLoaded=1;
  const VER='20260819-layout-persist2';
  const GEO_KEY='windzxy-web-desktop-card-geometry-v2';
  const STORE_KEY='windzxy-web-desktop-workspaces';
  let saving=false;
  let patched=false;

  function wsList(){try{return Array.isArray(workspaces)?workspaces:[];}catch(e){return [];}}
  function currentWorkspace(){try{return typeof activeWorkspace==='function'?activeWorkspace():wsList()[0];}catch(e){return null;}}
  function activeWorkspaceId(){try{return activeId||currentWorkspace()?.id||'daily';}catch(e){return 'daily';}}
  function px(value){const n=parseFloat(String(value||'').replace('px',''));return Number.isFinite(n)?n:null;}
  function readGeo(){try{return JSON.parse(localStorage.getItem(GEO_KEY)||'{}')||{};}catch(e){return {};}}
  function writeGeo(geo){try{localStorage.setItem(GEO_KEY,JSON.stringify(geo));}catch(e){}}
  function cardKey(ws,card){return String(ws?.id||activeWorkspaceId())+'::'+String(card?.id||'');}

  function persistGeometry(options={}){
    if(saving)return;
    const ws=currentWorkspace();
    if(!ws||!Array.isArray(ws.cards))return;
    const geo=readGeo();
    let changed=false;
    document.querySelectorAll('.desktop-card[data-card-id]').forEach(el=>{
      const card=ws.cards.find(x=>String(x.id)===String(el.dataset.cardId));
      if(!card)return;
      const g=geo[cardKey(ws,card)]||{};
      const x=px(el.style.left),y=px(el.style.top),w=px(el.style.width),h=px(el.style.height);
      if(Number.isFinite(x)){const v=Math.max(0,Math.round(x));if(card.x!==v){card.x=v;changed=true;}g.x=v;}
      if(Number.isFinite(y)){const v=Math.max(0,Math.round(y));if(card.y!==v){card.y=v;changed=true;}g.y=v;}
      g.collapsed=el.classList.contains('is-collapsed')||!!card.collapsed;
      card.collapsed=!!g.collapsed;
      if(!card.collapsed){
        if(Number.isFinite(w)){const v=Math.max(1,Math.round(w));if(card.w!==v){card.w=v;changed=true;}g.w=v;}
        if(Number.isFinite(h)){const v=Math.max(1,Math.round(h));if(card.h!==v){card.h=v;changed=true;}g.h=v;}
      }
      geo[cardKey(ws,card)]=g;
    });
    writeGeo(geo);
    if((changed||options.force)&&!options.noSave)rawSave();
  }

  function restoreGeometryToModel(){
    const geo=readGeo();
    let changed=false;
    wsList().forEach(ws=>(ws.cards||[]).forEach(card=>{
      const g=geo[cardKey(ws,card)];
      if(!g)return;
      ['x','y','w','h'].forEach(k=>{
        if(Number.isFinite(g[k])&&card[k]!==g[k]){card[k]=g[k];changed=true;}
      });
      if(typeof g.collapsed==='boolean'&&card.collapsed!==g.collapsed){card.collapsed=g.collapsed;changed=true;}
    }));
    if(changed)rawSave();
  }

  function applyGeometryToDom(){
    const ws=currentWorkspace();
    if(!ws)return;
    const geo=readGeo();
    document.querySelectorAll('.desktop-card[data-card-id]').forEach(el=>{
      const card=ws.cards.find(x=>String(x.id)===String(el.dataset.cardId));
      const g=card&&geo[cardKey(ws,card)];
      if(!g)return;
      if(Number.isFinite(g.x))el.style.left=g.x+'px';
      if(Number.isFinite(g.y))el.style.top=g.y+'px';
      if(Number.isFinite(g.w))el.style.width=g.w+'px';
      if(!g.collapsed&&Number.isFinite(g.h))el.style.height=g.h+'px';
    });
  }

  function rawSave(){
    if(saving)return;
    saving=true;
    try{
      if(typeof window.__windzxyRawSave==='function')window.__windzxyRawSave();
      else if(typeof workspaces!=='undefined')localStorage.setItem(STORE_KEY,JSON.stringify(workspaces));
    }catch(e){console.warn('raw layout save failed',e);}finally{saving=false;}
  }

  function patch(){
    if(patched)return;patched=true;
    try{
      if(typeof save==='function'&&!window.__windzxyRawSave){
        window.__windzxyRawSave=save;
        save=function(){persistGeometry({noSave:true});return window.__windzxyRawSave.apply(this,arguments);};
      }
      if(typeof renderDesktop==='function'&&!window.__windzxyRenderDesktopLayoutPatched){
        window.__windzxyRenderDesktopLayoutPatched=1;
        const oldRenderDesktop=renderDesktop;
        renderDesktop=function(){restoreGeometryToModel();const out=oldRenderDesktop.apply(this,arguments);setTimeout(applyGeometryToDom,0);return out;};
      }
      if(typeof renderAll==='function'&&!window.__windzxyRenderAllLayoutPatched){
        window.__windzxyRenderAllLayoutPatched=1;
        const oldRenderAll=renderAll;
        renderAll=function(){persistGeometry({noSave:true});restoreGeometryToModel();return oldRenderAll.apply(this,arguments);};
      }
    }catch(e){console.warn('layout patch failed',e);}
  }

  function bind(){
    patch();
    restoreGeometryToModel();
    applyGeometryToDom();
    window.addEventListener('pagehide',()=>persistGeometry({force:true}),{capture:true});
    window.addEventListener('beforeunload',()=>persistGeometry({force:true}),{capture:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)persistGeometry({force:true});},{passive:true});
    document.addEventListener('pointerup',()=>setTimeout(()=>persistGeometry({force:true}),0),true);
    document.addEventListener('mouseup',()=>setTimeout(()=>persistGeometry({force:true}),0),true);
    setInterval(()=>persistGeometry({force:false}),2000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
  window.windzxyPersistLayoutNow=()=>persistGeometry({force:true});
})();