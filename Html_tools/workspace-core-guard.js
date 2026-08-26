(function(){
  if(window.__windzxyWorkspaceCoreGuardLoaded)return;
  window.__windzxyWorkspaceCoreGuardLoaded=1;

  const VER='20260826-workspace-core-guard2-no-unapproved-cards';
  const STORE_KEY='windzxy-web-desktop-workspaces';
  const ACTIVE_KEY='windzxy-active-workspace';
  const INIT_KEY='windzxy-webdesk-core-initialized-v2';
  const ADD_MARK_KEY='windzxy-webdesk-last-manual-add';
  const DEFAULT_WS_IDS=new Set(['daily','office','imageDesk','data']);
  const DEFAULT_CARD_RE=/^(daily|office|imageDesk|data)-[a-z0-9-]+-\d+$/i;
  let patched=false;
  let manualAddUntil=0;
  let sanitizing=false;

  function readStore(){try{const v=JSON.parse(localStorage.getItem(STORE_KEY)||'null');return Array.isArray(v)?v:null;}catch(e){return null;}}
  function writeStore(list){try{localStorage.setItem(STORE_KEY,JSON.stringify(list));localStorage.setItem(INIT_KEY,'1');}catch(e){}}
  function clone(v){try{return JSON.parse(JSON.stringify(v));}catch(e){return v;}}
  function wsList(){try{return Array.isArray(workspaces)?workspaces:[];}catch(e){return [];}}
  function emptyDefaults(){
    let base=[];
    try{if(Array.isArray(defaults)&&defaults.length)base=defaults;}catch(e){}
    if(!base.length)base=[
      {id:'daily',name:'日常工作區',hint:'拖拽卡片可任意擺放；點擊卡片打開工具。',cards:[]},
      {id:'office',name:'辦公整理',hint:'文字、表格、日期與 JSON 放在一起。',cards:[]},
      {id:'imageDesk',name:'圖片工作台',hint:'圖片處理與 OCR 優先。',cards:[]},
      {id:'data',name:'資料處理',hint:'整理表格、JSON 和日期資料。',cards:[]}
    ];
    return base.map(ws=>({id:ws.id,name:ws.name,hint:ws.hint,cards:[]}));
  }
  function isSeedCard(card,ws){
    if(!card)return false;
    const id=String(card.id||'');
    if(DEFAULT_CARD_RE.test(id))return true;
    if(ws&&DEFAULT_WS_IDS.has(ws.id)&&id.startsWith(ws.id+'-'))return true;
    return false;
  }
  function isPureSeedLayout(list){
    if(!Array.isArray(list)||!list.length)return false;
    let count=0;
    for(const ws of list){
      const cards=Array.isArray(ws.cards)?ws.cards:[];
      for(const card of cards){count++;if(!isSeedCard(card,ws))return false;}
    }
    return count>0;
  }
  function savedCardKeys(store){
    const saved=Array.isArray(store)?store:(readStore()||[]);
    const keys=new Set();
    saved.forEach(ws=>(ws.cards||[]).forEach(card=>{
      if(card&&card.id)keys.add(ws.id+'::id::'+card.id);
      if(card&&card.appId)keys.add(ws.id+'::app::'+card.appId+'::'+(card.id||''));
    }));
    return keys;
  }
  function cardAllowed(card,ws,keys){
    if(!card)return false;
    if(isSeedCard(card,ws))return false;
    if(Date.now()<manualAddUntil)return true;
    if(card.id&&keys.has(ws.id+'::id::'+card.id))return true;
    if(card.appId&&keys.has(ws.id+'::app::'+card.appId+'::'+(card.id||'')))return true;
    return false;
  }
  function normalizeInitialState(){
    const saved=readStore();
    const hasInit=localStorage.getItem(INIT_KEY)==='1';
    if(!saved||!saved.length||(!hasInit&&isPureSeedLayout(saved))){
      const empty=emptyDefaults();
      try{workspaces=empty;activeId=localStorage.getItem(ACTIVE_KEY)||empty[0].id;localStorage.setItem(ACTIVE_KEY,activeId);}catch(e){}
      writeStore(empty);
      try{if(typeof renderAll==='function')renderAll();if(typeof openDrawer==='function')openDrawer('tools');}catch(e){}
      return;
    }
    if(isPureSeedLayout(saved)){
      const empty=saved.map(ws=>Object.assign({},ws,{cards:[]}));
      try{workspaces=empty;}catch(e){}
      writeStore(empty);
      try{if(typeof renderAll==='function')renderAll();}catch(e){}
    }
  }
  function sanitize(reason){
    if(sanitizing)return;
    sanitizing=true;
    try{
      const list=wsList();
      if(!list.length)return;
      let changed=false;
      const store=readStore();
      const keys=savedCardKeys(store);
      const storeHasReal=Array.isArray(store)&&store.some(ws=>(ws.cards||[]).some(card=>!isSeedCard(card,ws)));
      list.forEach(ws=>{
        if(!Array.isArray(ws.cards)){ws.cards=[];changed=true;return;}
        const before=ws.cards.length;
        if(!storeHasReal&&isPureSeedLayout(list)){
          ws.cards=[];
        }else{
          ws.cards=ws.cards.filter(card=>cardAllowed(card,ws,keys));
        }
        if(ws.cards.length!==before)changed=true;
      });
      if(changed){
        writeStore(clone(list));
        setTimeout(()=>{try{if(typeof renderWorkspaces==='function')renderWorkspaces();if(typeof renderDesktop==='function')renderDesktop();}catch(e){}},0);
      }
    }finally{sanitizing=false;}
  }
  function patchCore(){
    if(patched)return;patched=true;
    try{
      if(typeof loadWorkspaces==='function'&&!window.__windzxyLoadWorkspacesGuarded){
        window.__windzxyLoadWorkspacesGuarded=1;
        const oldLoad=loadWorkspaces;
        loadWorkspaces=function(){
          const saved=readStore();
          if(!saved||!saved.length)return emptyDefaults();
          const out=oldLoad.apply(this,arguments);
          return isPureSeedLayout(out)?out.map(ws=>Object.assign({},ws,{cards:[]})):out;
        };
      }
      if(typeof save==='function'&&!window.__windzxySaveGuarded){
        window.__windzxySaveGuarded=1;
        const oldSave=save;
        save=function(){
          localStorage.setItem(INIT_KEY,'1');
          const out=oldSave.apply(this,arguments);
          sanitize('save');
          return out;
        };
      }
      if(typeof addCard==='function'&&!window.__windzxyAddCardGuarded){
        window.__windzxyAddCardGuarded=1;
        const oldAdd=addCard;
        addCard=function(appId){
          manualAddUntil=Date.now()+1500;
          try{localStorage.setItem(ADD_MARK_KEY,String(Date.now()));localStorage.setItem(INIT_KEY,'1');}catch(e){}
          const out=oldAdd.apply(this,arguments);
          setTimeout(()=>{try{if(typeof save==='function')save();}catch(e){}sanitize('manual-add');},0);
          setTimeout(()=>{manualAddUntil=0;sanitize('manual-add-end');},1600);
          return out;
        };
      }
      if(typeof renderAll==='function'&&!window.__windzxyRenderAllWorkspaceGuarded){
        window.__windzxyRenderAllWorkspaceGuarded=1;
        const oldRenderAll=renderAll;
        renderAll=function(){const out=oldRenderAll.apply(this,arguments);setTimeout(()=>sanitize('renderAll'),0);return out;};
      }
      if(typeof renderDesktop==='function'&&!window.__windzxyRenderDesktopWorkspaceGuarded){
        window.__windzxyRenderDesktopWorkspaceGuarded=1;
        const oldRenderDesktop=renderDesktop;
        renderDesktop=function(){const out=oldRenderDesktop.apply(this,arguments);setTimeout(()=>sanitize('renderDesktop'),0);return out;};
      }
    }catch(e){console.warn('workspace guard patch failed',e);}
  }
  function boot(){
    patchCore();
    normalizeInitialState();
    sanitize('boot');
    setTimeout(()=>{patchCore();sanitize('250ms');},250);
    setTimeout(()=>{patchCore();sanitize('1000ms');},1000);
    setTimeout(()=>{patchCore();sanitize('2500ms');},2500);
    document.addEventListener('click',e=>{
      if(e.target.closest('.dock-tool,[data-id]'))setTimeout(()=>sanitize('click'),120);
      if(e.target.closest('[data-close],[aria-label="關閉"],[aria-label="关闭"],[aria-label="Close"]'))setTimeout(()=>{try{if(typeof save==='function')save();}catch(_){ }sanitize('close');},160);
    },true);
    window.addEventListener('pagehide',()=>{try{sanitize('pagehide');}catch(e){}},{capture:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyWorkspaceCoreGuardVersion=VER;
})();
