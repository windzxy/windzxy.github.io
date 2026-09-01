(function(){
  'use strict';
  const VER='20260901-workspace-core-guard4-preserve-deleted-workspaces';
  if(window.__windzxyWorkspaceCoreGuardLoaded===VER)return;
  window.__windzxyWorkspaceCoreGuardLoaded=VER;
  window.__windzxyWorkspaceCoreGuardV4Loaded=1;

  const STORE_KEY='windzxy-web-desktop-workspaces';
  const LEGACY_KEYS=['windzxy-desktop-workspaces','windzxy-dashboard-workspaces'];
  const ACTIVE_KEY='windzxy-active-workspace';
  const INIT_KEY='windzxy-webdesk-core-initialized-v3';
  const ADD_MARK_KEY='windzxy-webdesk-last-manual-add';
  const DEFAULT_IDS=['daily','office','imageDesk','data'];
  const DEFAULT_WS_IDS=new Set(DEFAULT_IDS);
  const DEFAULT_CARD_RE=/^(daily|office|imageDesk|data)-[A-Za-z0-9_-]+-\d+$/;
  let patched=false;
  let sanitizing=false;
  let rendering=false;
  let manualAddUntil=0;

  function clone(v){try{return JSON.parse(JSON.stringify(v));}catch(e){return v;}}
  function readStore(){
    try{
      const raw=localStorage.getItem(STORE_KEY);
      if(raw!==null)return JSON.parse(raw);
      for(const k of LEGACY_KEYS){const v=localStorage.getItem(k);if(v)return JSON.parse(v);}
    }catch(e){}
    return null;
  }
  function writeStore(list){
    try{
      localStorage.setItem(STORE_KEY,JSON.stringify(list));
      localStorage.setItem(INIT_KEY,'1');
    }catch(e){}
  }
  function wsList(){try{return Array.isArray(workspaces)?workspaces:[];}catch(e){return [];}}
  function currentActiveId(){try{return activeId||localStorage.getItem(ACTIVE_KEY)||'daily';}catch(e){return localStorage.getItem(ACTIVE_KEY)||'daily';}}
  function shellDefaults(){
    let base=[];
    try{if(Array.isArray(defaults)&&defaults.length)base=defaults;}catch(e){}
    if(!base.length)base=[
      {id:'daily',name:'日常工作區',hint:'從右側功能中心選擇需要的卡片。'},
      {id:'office',name:'辦公整理',hint:'文字、表格、日期與 JSON 放在一起。'},
      {id:'imageDesk',name:'圖片工作台',hint:'圖片處理與 OCR 優先。'},
      {id:'data',name:'資料處理',hint:'整理表格、JSON 和日期資料。'}
    ];
    return base.map(ws=>({id:ws.id,name:ws.name,hint:ws.hint,cards:[]}));
  }
  function ensureWorkspaceShells(list){
    const source=Array.isArray(list)&&list.length?list:shellDefaults();
    const out=source.filter(Boolean).map(ws=>Object.assign({},ws));
    out.forEach(ws=>{if(!Array.isArray(ws.cards))ws.cards=[];});
    return out;
  }
  function isSeedCard(card,ws){
    if(!card)return false;
    const id=String(card.id||'');
    if(DEFAULT_CARD_RE.test(id))return true;
    const wsId=String(ws?.id||'');
    if(DEFAULT_WS_IDS.has(wsId)&&id.startsWith(wsId+'-'))return true;
    return false;
  }
  function hasSeedCards(list){return Array.isArray(list)&&list.some(ws=>(ws.cards||[]).some(card=>isSeedCard(card,ws)));}
  function stripSeedCards(list){
    const out=ensureWorkspaceShells(clone(Array.isArray(list)?list:[]));
    let changed=false;
    out.forEach(ws=>{
      const before=Array.isArray(ws.cards)?ws.cards.length:0;
      ws.cards=(Array.isArray(ws.cards)?ws.cards:[]).filter(card=>!isSeedCard(card,ws));
      if(ws.cards.length!==before)changed=true;
    });
    return {list:out,changed};
  }
  function normalizeSavedOrEmpty(saved){
    if(!Array.isArray(saved)||!saved.length)return shellDefaults();
    return stripSeedCards(saved).list;
  }
  function patchCore(){
    if(patched)return;
    patched=true;
    try{
      if(typeof loadWorkspaces==='function'&&!window.__windzxyLoadWorkspacesGuardedV4){
        window.__windzxyLoadWorkspacesGuardedV4=1;
        const oldLoad=loadWorkspaces;
        loadWorkspaces=function(){
          let out;
          const saved=readStore();
          try{out=oldLoad.apply(this,arguments);}catch(e){out=saved;}
          if(!Array.isArray(saved)||!saved.length)out=shellDefaults();
          const res=stripSeedCards(Array.isArray(out)&&out.length?out:normalizeSavedOrEmpty(saved));
          if(res.changed||hasSeedCards(saved)||!Array.isArray(saved)||!saved.length)writeStore(clone(res.list));
          return res.list;
        };
      }
      if(typeof save==='function'&&!window.__windzxySaveGuardedV4){
        window.__windzxySaveGuardedV4=1;
        const oldSave=save;
        save=function(){
          try{localStorage.setItem(INIT_KEY,'1');}catch(e){}
          if(!sanitizing)sanitize('before-save');
          const out=oldSave.apply(this,arguments);
          if(!sanitizing)sanitize('after-save');
          return out;
        };
      }
      if(typeof addCard==='function'&&!window.__windzxyAddCardGuardedV4){
        window.__windzxyAddCardGuardedV4=1;
        const oldAdd=addCard;
        addCard=function(){
          manualAddUntil=Date.now()+1600;
          try{localStorage.setItem(ADD_MARK_KEY,String(Date.now()));localStorage.setItem(INIT_KEY,'1');}catch(e){}
          const out=oldAdd.apply(this,arguments);
          setTimeout(()=>{manualAddUntil=0;sanitize('manual-add-end');},1700);
          return out;
        };
      }
      if(typeof resetLayout==='function'&&!window.__windzxyResetLayoutGuardedV4){
        window.__windzxyResetLayoutGuardedV4=1;
        resetLayout=function(){
          try{
            const ws=activeWorkspace();
            if(ws)ws.cards=[];
            if(typeof save==='function')save();
            if(typeof renderAll==='function')renderAll();
          }catch(e){}
        };
      }
      if(typeof renderAll==='function'&&!window.__windzxyRenderAllWorkspaceGuardedV4){
        window.__windzxyRenderAllWorkspaceGuardedV4=1;
        const oldRenderAll=renderAll;
        renderAll=function(){
          rendering=true;
          const out=oldRenderAll.apply(this,arguments);
          rendering=false;
          setTimeout(()=>sanitize('renderAll'),0);
          return out;
        };
      }
      if(typeof renderDesktop==='function'&&!window.__windzxyRenderDesktopWorkspaceGuardedV4){
        window.__windzxyRenderDesktopWorkspaceGuardedV4=1;
        const oldRenderDesktop=renderDesktop;
        renderDesktop=function(){
          const out=oldRenderDesktop.apply(this,arguments);
          setTimeout(()=>sanitize('renderDesktop'),0);
          return out;
        };
      }
    }catch(e){console.warn('workspace guard v4 patch failed',e);}
  }
  function sanitize(reason){
    if(sanitizing)return;
    sanitizing=true;
    try{
      let list=wsList();
      if(!list.length){
        list=shellDefaults();
        try{workspaces=list;}catch(e){}
      }
      const res=stripSeedCards(list);
      const saved=readStore();
      const savedHasSeed=hasSeedCards(saved);
      let changed=res.changed||savedHasSeed;
      if(changed){
        try{workspaces=res.list;}catch(e){}
        writeStore(clone(res.list));
        const active=currentActiveId();
        if(res.list.some(ws=>ws.id===active)){
          try{activeId=active;localStorage.setItem(ACTIVE_KEY,active);}catch(e){}
        }else if(res.list[0]){
          try{activeId=res.list[0].id;localStorage.setItem(ACTIVE_KEY,activeId);}catch(e){}
        }
        if(!rendering){
          setTimeout(()=>{
            try{if(typeof renderWorkspaces==='function')renderWorkspaces();if(typeof renderDesktop==='function')renderDesktop();}catch(e){}
          },0);
        }
      }else if(!Array.isArray(saved)||!saved.length){
        writeStore(clone(res.list));
      }
    }finally{sanitizing=false;}
  }
  function boot(){
    patchCore();
    sanitize('boot');
    setTimeout(()=>{patchCore();sanitize('120ms');},120);
    setTimeout(()=>{patchCore();sanitize('500ms');},500);
    setTimeout(()=>{patchCore();sanitize('1500ms');},1500);
    setTimeout(()=>{patchCore();sanitize('3000ms');},3000);
    document.addEventListener('click',e=>{
      if(e.target.closest('.dock-tool,[data-id]'))setTimeout(()=>sanitize('click'),120);
      if(e.target.closest('[data-close],[aria-label="關閉"],[aria-label="关闭"],[aria-label="Close"],.card-remove'))setTimeout(()=>sanitize('close/remove'),160);
    },true);
    window.addEventListener('pagehide',()=>{try{sanitize('pagehide');}catch(e){}},{capture:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyWorkspaceCoreGuardVersion=VER;
})();
