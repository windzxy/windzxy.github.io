(function(){
  if(window.__windzxyLayoutPersistFixLoaded)return;
  window.__windzxyLayoutPersistFixLoaded=1;
  const VER='20260819-layout-persist7-calendar';
  const GEO_KEY='windzxy-web-desktop-card-geometry-v4';
  const OLD_KEYS=['windzxy-web-desktop-card-geometry-v3','windzxy-web-desktop-card-geometry-v2','windzxy-web-desktop-card-geometry-v1'];
  const STORE_KEY='windzxy-web-desktop-workspaces';
  const PLUGIN_APPS=new Set(['metals','fx-rates','calendar']);
  let saving=false,patched=false,boundsPatched=false;

  function wsList(){try{return Array.isArray(workspaces)?workspaces:[];}catch(e){return [];}}
  function currentWorkspace(){try{return typeof activeWorkspace==='function'?activeWorkspace():wsList()[0];}catch(e){return null;}}
  function activeWorkspaceId(){try{return activeId||currentWorkspace()?.id||'daily';}catch(e){return 'daily';}}
  function px(value){const n=parseFloat(String(value||'').replace('px',''));return Number.isFinite(n)?n:null;}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function readJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'')||fallback;}catch(e){return fallback;}}
  function readGeo(){
    let geo=readJSON(GEO_KEY,{});
    if(!Object.keys(geo).length){
      for(const key of OLD_KEYS){
        const old=readJSON(key,{});
        if(Object.keys(old).length){geo=old;writeGeo(geo);break;}
      }
    }
    return geo;
  }
  function writeGeo(geo){try{localStorage.setItem(GEO_KEY,JSON.stringify(geo));}catch(e){}}
  function idKey(ws,card){return `${ws?.id||activeWorkspaceId()}::id::${card?.id||''}`;}
  function appKey(ws,cardOrAppId){const appId=typeof cardOrAppId==='string'?cardOrAppId:cardOrAppId?.appId;return `${ws?.id||activeWorkspaceId()}::app::${appId||''}`;}
  function rawSave(){
    if(saving)return;
    saving=true;
    try{
      if(typeof window.__windzxyRawSave==='function')window.__windzxyRawSave();
      else if(typeof workspaces!=='undefined')localStorage.setItem(STORE_KEY,JSON.stringify(workspaces));
    }catch(e){console.warn('raw layout save failed',e);}finally{saving=false;}
  }
  function geoFromCard(card){
    if(!card)return null;
    const g={};
    ['x','y','w','h'].forEach(k=>{if(Number.isFinite(Number(card[k])))g[k]=Math.round(Number(card[k]));});
    if(typeof card.collapsed==='boolean')g.collapsed=card.collapsed;
    if(card.appId)g.appId=card.appId;
    return Object.keys(g).length?g:null;
  }
  function mergeGeo(base,next,overwrite=true){
    const out=Object.assign({},base||{});
    ['x','y','w','h'].forEach(k=>{if(Number.isFinite(next?.[k])&&(overwrite||!Number.isFinite(out[k])))out[k]=next[k];});
    if(typeof next?.collapsed==='boolean'&&(overwrite||typeof out.collapsed!=='boolean'))out.collapsed=next.collapsed;
    if(next?.appId)out.appId=next.appId;
    out.savedAt=overwrite?Date.now():(out.savedAt||Date.now());
    return out;
  }
  function captureRawStoreGeometry(){
    const raw=readJSON(STORE_KEY,[]);
    if(!Array.isArray(raw))return;
    const geo=readGeo();
    let changed=false;
    raw.forEach(ws=>(ws.cards||[]).forEach(card=>{
      const g=geoFromCard(card);
      if(!g||!card.appId)return;
      const ik=idKey(ws,card),ak=appKey(ws,card);
      geo[ik]=mergeGeo(geo[ik],g,true);
      if(!geo[ak])geo[ak]=mergeGeo(null,g,true);
      changed=true;
    }));
    if(changed)writeGeo(geo);
  }
  function geoFor(ws,card){const geo=readGeo();return geo[idKey(ws,card)]||geo[appKey(ws,card)]||null;}
  function setGeo(ws,card,g){
    if(!card||!card.appId)return;
    const geo=readGeo();
    const clean=Object.assign({},g,{appId:card.appId,savedAt:Date.now()});
    geo[idKey(ws,card)]=mergeGeo(geo[idKey(ws,card)],clean,true);
    geo[appKey(ws,card)]=mergeGeo(geo[appKey(ws,card)],clean,true);
    writeGeo(geo);
  }
  function persistGeometry(options={}){
    if(saving)return;
    const ws=currentWorkspace();
    if(!ws||!Array.isArray(ws.cards))return;
    let changed=false;
    document.querySelectorAll('.desktop-card[data-card-id]').forEach(el=>{
      const card=ws.cards.find(x=>String(x.id)===String(el.dataset.cardId));
      if(!card)return;
      const g=geoFor(ws,card)||{};
      const x=px(el.style.left),y=px(el.style.top),w=px(el.style.width),h=px(el.style.height);
      if(Number.isFinite(x)){g.x=Math.max(0,Math.round(x));if(card.x!==g.x){card.x=g.x;changed=true;}}
      if(Number.isFinite(y)){g.y=Math.max(0,Math.round(y));if(card.y!==g.y){card.y=g.y;changed=true;}}
      g.collapsed=el.classList.contains('is-collapsed')||!!card.collapsed;
      if(card.collapsed!==g.collapsed){card.collapsed=g.collapsed;changed=true;}
      if(!g.collapsed){
        if(Number.isFinite(w)){g.w=Math.max(1,Math.round(w));if(card.w!==g.w){card.w=g.w;changed=true;}}
        if(Number.isFinite(h)){g.h=Math.max(1,Math.round(h));if(card.h!==g.h){card.h=g.h;changed=true;}}
      }
      setGeo(ws,card,g);
    });
    if((changed||options.force)&&!options.noSave)rawSave();
  }
  function restoreGeometryToModel(){
    captureRawStoreGeometry();
    let changed=false;
    wsList().forEach(ws=>(ws.cards||[]).forEach(card=>{
      const g=geoFor(ws,card);
      if(!g)return;
      ['x','y','w','h'].forEach(k=>{if(Number.isFinite(g[k])&&card[k]!==g[k]){card[k]=g[k];changed=true;}});
      if(typeof g.collapsed==='boolean'&&card.collapsed!==g.collapsed){card.collapsed=g.collapsed;changed=true;}
    }));
    if(changed)rawSave();
  }
  function applyGeometryToDom(){
    const ws=currentWorkspace();
    if(!ws)return;
    document.querySelectorAll('.desktop-card[data-card-id]').forEach(el=>{
      const card=ws.cards.find(x=>String(x.id)===String(el.dataset.cardId));
      const g=card&&geoFor(ws,card);
      if(!g)return;
      if(Number.isFinite(g.x))el.style.left=g.x+'px';
      if(Number.isFinite(g.y))el.style.top=g.y+'px';
      if(Number.isFinite(g.w))el.style.width=g.w+'px';
      if(!g.collapsed&&Number.isFinite(g.h))el.style.height=g.h+'px';
    });
  }
  function protectPluginCards(){
    try{
      const raw=readJSON(STORE_KEY,[]);
      if(!Array.isArray(raw))return;
      const geo=readGeo();
      wsList().forEach(ws=>{
        const rawWs=raw.find(x=>x.id===ws.id);
        if(!rawWs||!Array.isArray(rawWs.cards))return;
        rawWs.cards.forEach(oldCard=>{
          if(!PLUGIN_APPS.has(oldCard.appId))return;
          if((ws.cards||[]).some(c=>c.appId===oldCard.appId))return;
          const g=geo[appKey(ws,oldCard)]||geoFromCard(oldCard)||{};
          const restored=Object.assign({},oldCard,g,{id:oldCard.id||`restored-${oldCard.appId}-${Date.now()}`,appId:oldCard.appId,collapsed:!!g.collapsed});
          ws.cards.push(restored);
        });
      });
    }catch(e){console.warn('plugin layout restore failed',e);}
  }
  function patchBottomBounds(){
    if(boundsPatched)return;boundsPatched=true;
    document.addEventListener('pointermove',event=>{
      try{
        if(typeof drag!=='undefined'&&drag&&drag.item&&drag.el){
          const canvas=document.getElementById('desktopCanvas');
          if(!canvas)return;
          const rect=canvas.getBoundingClientRect();
          const item=drag.item,el=drag.el;
          const w=item.w||el.offsetWidth||300;
          const h=item.collapsed?46:(item.h||el.offsetHeight||150);
          const nextX=clamp(drag.origX+event.clientX-drag.startX,0,Math.max(0,rect.width-w-10));
          const nextY=clamp(drag.origY+event.clientY-drag.startY,0,Math.max(0,rect.height-h-10));
          item.x=nextX;item.y=nextY;
          el.style.left=nextX+'px';el.style.top=nextY+'px';
        }
        if(typeof windowDrag!=='undefined'&&windowDrag&&windowDrag.win){
          const canvas=document.getElementById('desktopCanvas');
          if(!canvas)return;
          const rect=canvas.getBoundingClientRect();
          const win=windowDrag.win;
          const nextX=clamp(windowDrag.origX+event.clientX-windowDrag.startX,0,Math.max(0,rect.width-win.offsetWidth-10));
          const nextY=clamp(windowDrag.origY+event.clientY-windowDrag.startY,0,Math.max(0,rect.height-win.offsetHeight-10));
          win.style.left=nextX+'px';win.style.top=nextY+'px';
        }
      }catch(e){}
    },false);
  }
  function patch(){
    if(patched)return;patched=true;
    try{
      captureRawStoreGeometry();protectPluginCards();patchBottomBounds();
      if(typeof save==='function'&&!window.__windzxyRawSave){
        window.__windzxyRawSave=save;
        save=function(){persistGeometry({noSave:true});return window.__windzxyRawSave.apply(this,arguments);};
      }
      if(typeof renderDesktop==='function'&&!window.__windzxyRenderDesktopLayoutPatched){
        window.__windzxyRenderDesktopLayoutPatched=1;
        const oldRenderDesktop=renderDesktop;
        renderDesktop=function(){protectPluginCards();restoreGeometryToModel();const out=oldRenderDesktop.apply(this,arguments);setTimeout(applyGeometryToDom,0);return out;};
      }
      if(typeof renderAll==='function'&&!window.__windzxyRenderAllLayoutPatched){
        window.__windzxyRenderAllLayoutPatched=1;
        const oldRenderAll=renderAll;
        renderAll=function(){persistGeometry({noSave:true});protectPluginCards();restoreGeometryToModel();return oldRenderAll.apply(this,arguments);};
      }
    }catch(e){console.warn('layout patch failed',e);}
  }
  function bind(){
    patch();protectPluginCards();restoreGeometryToModel();applyGeometryToDom();patchBottomBounds();
    window.addEventListener('pagehide',()=>persistGeometry({force:true}),{capture:true});
    window.addEventListener('beforeunload',()=>persistGeometry({force:true}),{capture:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)persistGeometry({force:true});},{passive:true});
    document.addEventListener('pointerup',()=>setTimeout(()=>persistGeometry({force:true}),0),true);
    document.addEventListener('mouseup',()=>setTimeout(()=>persistGeometry({force:true}),0),true);
    setInterval(()=>persistGeometry({force:false}),1200);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
  window.windzxyPersistLayoutNow=()=>persistGeometry({force:true});
})();