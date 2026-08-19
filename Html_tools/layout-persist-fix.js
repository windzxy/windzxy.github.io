(function(){
  if(window.__windzxyLayoutPersistFixLoaded)return;
  window.__windzxyLayoutPersistFixLoaded=1;
  const VER='20260819-layout-persist8-cross-browser-sync';
  const GEO_KEY='windzxy-web-desktop-card-geometry-v4';
  const OLD_KEYS=['windzxy-web-desktop-card-geometry-v3','windzxy-web-desktop-card-geometry-v2','windzxy-web-desktop-card-geometry-v1'];
  const STORE_KEY='windzxy-web-desktop-workspaces';
  const SYNC_KEYS=[STORE_KEY,GEO_KEY,'windzxy-active-workspace','windzxy-desktop-bg','windzxy-theme','windzxy-lang','windzxy-metals-active'];
  const PLUGIN_APPS=new Set(['metals','fx-rates','calendar']);
  let saving=false,patched=false,boundsPatched=false,syncUiReady=false;

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

  function encodeSync(payload){return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));}
  function decodeSync(code){
    const raw=String(code||'').trim().replace(/^#?layout=/,'').replace(/^layout:/,'');
    if(!raw)throw new Error('empty layout code');
    try{return JSON.parse(decodeURIComponent(escape(atob(raw))));}
    catch(e){return JSON.parse(raw);}
  }
  function makeLayoutPayload(){
    persistGeometry({force:true});
    const data={};
    SYNC_KEYS.forEach(key=>{const v=localStorage.getItem(key);if(v!==null)data[key]=v;});
    return {type:'windzxy-webdesk-layout',version:VER,createdAt:new Date().toISOString(),data};
  }
  function applyLayoutPayload(payload){
    if(!payload||payload.type!=='windzxy-webdesk-layout'||!payload.data)throw new Error('invalid layout payload');
    Object.entries(payload.data).forEach(([key,value])=>{if(SYNC_KEYS.includes(key))localStorage.setItem(key,String(value));});
    location.reload();
  }
  async function copyText(text){
    try{await navigator.clipboard.writeText(text);return true;}
    catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();return true;}
  }
  function downloadLayout(){
    const blob=new Blob([JSON.stringify(makeLayoutPayload(),null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='webdesk-layout-'+new Date().toISOString().slice(0,10)+'.json';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  function installLayoutSyncStyle(){
    if(document.getElementById('windzxyLayoutSyncStyle'))return;
    const s=document.createElement('style');
    s.id='windzxyLayoutSyncStyle';
    s.textContent=`
.layout-sync-panel{margin-top:14px;padding:12px;border:1px solid rgba(255,255,255,.10);border-radius:16px;background:rgba(255,255,255,.045);display:grid;gap:9px}
.layout-sync-panel strong{font-size:13px}.layout-sync-panel p{margin:0;color:var(--muted);font-size:11px;line-height:1.45}.layout-sync-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.layout-sync-actions button,.layout-sync-panel label{min-height:34px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(255,255,255,.08);color:var(--ink);font-weight:850;cursor:pointer;display:grid;place-items:center;text-align:center}.layout-sync-panel label input{display:none}.layout-sync-status{min-height:16px;color:#38d99a;font-size:11px}.layout-sync-status.err{color:#ff6b88}@media(max-width:520px){.layout-sync-actions{grid-template-columns:1fr}}
    `;
    document.head.appendChild(s);
  }
  function setSyncStatus(text,err=false){const el=document.querySelector('[data-layout-sync-status]');if(el){el.textContent=text;el.classList.toggle('err',!!err);}}
  function installLayoutSyncUi(){
    if(syncUiReady&&document.getElementById('layoutSyncPanel'))return;
    const panel=document.querySelector('[data-panel="settings"]');
    if(!panel)return;
    installLayoutSyncStyle();
    const old=document.getElementById('layoutSyncPanel');
    if(old)old.remove();
    const box=document.createElement('div');
    box.id='layoutSyncPanel';
    box.className='layout-sync-panel';
    box.innerHTML=`<strong>佈局同步</strong><p>目前佈局仍保存在本瀏覽器 localStorage。用同步碼/同步連結可在其他瀏覽器恢復同一套卡片位置、大小、背景與主題。</p><div class="layout-sync-actions"><button type="button" data-layout-copy-code>複製同步碼</button><button type="button" data-layout-copy-link>複製同步連結</button><button type="button" data-layout-import>貼上恢復</button><button type="button" data-layout-download>下載備份</button><label>從文件恢復<input type="file" accept="application/json" data-layout-file></label></div><small class="layout-sync-status" data-layout-sync-status></small>`;
    panel.appendChild(box);
    box.querySelector('[data-layout-copy-code]').onclick=async()=>{await copyText(encodeSync(makeLayoutPayload()));setSyncStatus('已複製同步碼。');};
    box.querySelector('[data-layout-copy-link]').onclick=async()=>{const code=encodeSync(makeLayoutPayload());await copyText(location.origin+location.pathname+'#layout='+code);setSyncStatus('已複製同步連結。');};
    box.querySelector('[data-layout-import]').onclick=()=>{const code=prompt('貼上同步碼、同步連結或 JSON 備份內容');if(!code)return;try{const m=String(code).match(/[#?&]layout=([^&]+)/);applyLayoutPayload(decodeSync(m?decodeURIComponent(m[1]):code));}catch(e){setSyncStatus('恢復失敗：同步碼格式不對。',true);}};
    box.querySelector('[data-layout-download]').onclick=downloadLayout;
    box.querySelector('[data-layout-file]').onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{applyLayoutPayload(JSON.parse(String(r.result||'')));}catch(err){setSyncStatus('恢復失敗：文件格式不對。',true);}};r.readAsText(f);};
    syncUiReady=true;
  }
  function importFromHashOnce(){
    const hash=location.hash||'';
    const m=hash.match(/layout=([^&]+)/);
    if(!m||sessionStorage.getItem('windzxy-layout-hash-imported')===m[1])return;
    if(confirm('檢測到 WebDesk 佈局同步連結，是否恢復到本瀏覽器？')){
      sessionStorage.setItem('windzxy-layout-hash-imported',m[1]);
      try{applyLayoutPayload(decodeSync(decodeURIComponent(m[1])));}catch(e){alert('佈局同步連結無效。');}
    }
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
        renderDesktop=function(){protectPluginCards();restoreGeometryToModel();const out=oldRenderDesktop.apply(this,arguments);setTimeout(applyGeometryToDom,0);setTimeout(installLayoutSyncUi,0);return out;};
      }
      if(typeof renderAll==='function'&&!window.__windzxyRenderAllLayoutPatched){
        window.__windzxyRenderAllLayoutPatched=1;
        const oldRenderAll=renderAll;
        renderAll=function(){persistGeometry({noSave:true});protectPluginCards();restoreGeometryToModel();const out=oldRenderAll.apply(this,arguments);setTimeout(installLayoutSyncUi,0);return out;};
      }
    }catch(e){console.warn('layout patch failed',e);}
  }
  function bind(){
    patch();protectPluginCards();restoreGeometryToModel();applyGeometryToDom();patchBottomBounds();installLayoutSyncUi();importFromHashOnce();
    window.addEventListener('hashchange',importFromHashOnce);
    window.addEventListener('pagehide',()=>persistGeometry({force:true}),{capture:true});
    window.addEventListener('beforeunload',()=>persistGeometry({force:true}),{capture:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)persistGeometry({force:true});},{passive:true});
    document.addEventListener('pointerup',()=>setTimeout(()=>persistGeometry({force:true}),0),true);
    document.addEventListener('mouseup',()=>setTimeout(()=>persistGeometry({force:true}),0),true);
    setInterval(()=>persistGeometry({force:false}),1200);
    setInterval(installLayoutSyncUi,1800);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
  window.windzxyPersistLayoutNow=()=>persistGeometry({force:true});
  window.windzxyExportLayout=()=>encodeSync(makeLayoutPayload());
  window.windzxyImportLayout=code=>applyLayoutPayload(decodeSync(code));
})();