(function(){
  if(window.__windzxyWorkspaceDefaultCleanerLoaded)return;
  window.__windzxyWorkspaceDefaultCleanerLoaded=1;

  const VER='20260828-workspace-default-cleaner1-source-empty';
  const STORE='windzxy-web-desktop-workspaces';
  const INIT='windzxy-webdesk-core-initialized-v3';
  const DEFAULT_IDS=new Set(['daily','office','imageDesk','data']);
  const SEED_RE=/^(daily|office|imageDesk|data)-.+-\d+$/i;
  let cleaning=false;

  function clone(v){try{return JSON.parse(JSON.stringify(v));}catch(e){return v;}}
  function read(){try{const v=JSON.parse(localStorage.getItem(STORE)||'null');return Array.isArray(v)?v:null;}catch(e){return null;}}
  function write(list){try{localStorage.setItem(STORE,JSON.stringify(list));localStorage.setItem(INIT,'1');}catch(e){}}
  function isSeedCard(card,ws){
    if(!card)return false;
    const id=String(card.id||'');
    if(SEED_RE.test(id))return true;
    if(ws&&DEFAULT_IDS.has(ws.id)&&id.startsWith(ws.id+'-')&&!id.startsWith('card-')&&!id.startsWith('custom-'))return true;
    return false;
  }
  function cleanList(list){
    if(!Array.isArray(list))return {list,changed:false};
    let changed=false;
    const next=list.map(ws=>{
      const copy=Object.assign({},ws);
      const cards=Array.isArray(ws.cards)?ws.cards:[];
      const kept=cards.filter(card=>!isSeedCard(card,ws));
      if(kept.length!==cards.length)changed=true;
      copy.cards=kept;
      return copy;
    });
    return {list:next,changed};
  }
  function emptyDefaultsFromRuntime(){
    try{
      if(Array.isArray(defaults)&&defaults.length)return defaults.map(ws=>({id:ws.id,name:ws.name,hint:ws.hint,cards:[]}));
    }catch(e){}
    return [
      {id:'daily',name:'日常工作區',hint:'從右側功能中心選擇需要的卡片。',cards:[]},
      {id:'office',name:'辦公整理',hint:'文字、表格、日期與 JSON 放在一起。',cards:[]},
      {id:'imageDesk',name:'圖片工作台',hint:'圖片處理與 OCR 優先。',cards:[]},
      {id:'data',name:'資料處理',hint:'整理表格、JSON 和日期資料。',cards:[]}
    ];
  }
  function normalizeStore(){
    const saved=read();
    if(!saved||!saved.length)return;
    const cleaned=cleanList(saved);
    if(cleaned.changed)write(cleaned.list);
  }
  function cleanRuntime(reason){
    if(cleaning)return;
    cleaning=true;
    try{
      normalizeStore();
      if(typeof workspaces!=='undefined'&&Array.isArray(workspaces)){
        const cleaned=cleanList(workspaces);
        if(cleaned.changed){
          workspaces=cleaned.list;
          write(clone(workspaces));
          setTimeout(()=>{try{if(typeof renderWorkspaces==='function')renderWorkspaces();if(typeof renderDesktop==='function')renderDesktop();}catch(e){}},0);
        }
      }
    }finally{cleaning=false;}
  }
  function patch(){
    try{
      if(typeof loadWorkspaces==='function'&&!window.__windzxyLoadWorkspacesNoSeedPatched){
        window.__windzxyLoadWorkspacesNoSeedPatched=1;
        const old=loadWorkspaces;
        loadWorkspaces=function(){
          let out=old.apply(this,arguments);
          if(!Array.isArray(out)||!out.length)out=emptyDefaultsFromRuntime();
          const cleaned=cleanList(out).list;
          if(cleanList(out).changed)write(cleaned);
          return cleaned;
        };
      }
      if(typeof save==='function'&&!window.__windzxySaveNoSeedPatched){
        window.__windzxySaveNoSeedPatched=1;
        const old=save;
        save=function(){
          try{if(typeof workspaces!=='undefined'&&Array.isArray(workspaces))workspaces=cleanList(workspaces).list;}catch(e){}
          const out=old.apply(this,arguments);
          normalizeStore();
          return out;
        };
      }
      if(typeof resetLayout==='function'&&!window.__windzxyResetClearOnlyPatched){
        window.__windzxyResetClearOnlyPatched=1;
        resetLayout=function(){
          try{
            const ws=activeWorkspace();
            if(ws)ws.cards=[];
            if(typeof save==='function')save();
            if(typeof renderAll==='function')renderAll();
          }catch(e){}
        };
      }
      if(typeof addCard==='function'&&!window.__windzxyAddCardManualPatched){
        window.__windzxyAddCardManualPatched=1;
        const old=addCard;
        addCard=function(appId){
          const wsBefore=typeof activeWorkspace==='function'?activeWorkspace():null;
          const before=wsBefore&&Array.isArray(wsBefore.cards)?wsBefore.cards.length:0;
          const out=old.apply(this,arguments);
          try{
            const ws=activeWorkspace();
            const card=ws&&ws.cards&&ws.cards[ws.cards.length-1];
            if(card&&ws.cards.length>before){card.source='manual';card.createdAt=card.createdAt||Date.now();}
            if(typeof save==='function')save();
          }catch(e){}
          return out;
        };
      }
    }catch(e){console.warn('workspace default cleaner patch failed',e);}
  }
  function boot(){
    patch();
    cleanRuntime('boot');
    [80,250,600,1200,2500].forEach(ms=>setTimeout(()=>{patch();cleanRuntime(String(ms));},ms));
    window.addEventListener('storage',e=>{if(e.key===STORE)setTimeout(()=>cleanRuntime('storage'),30);});
    window.addEventListener('pagehide',()=>cleanRuntime('pagehide'),{capture:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyWorkspaceDefaultCleanerVersion=VER;
})();