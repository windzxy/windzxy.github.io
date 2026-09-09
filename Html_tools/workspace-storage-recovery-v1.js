(function(){
  'use strict';
  const VER='20260909-workspace-storage-recovery-v1.2-empty-active';
  if(window.__windzxyWorkspaceStorageRecovery===VER)return;
  window.__windzxyWorkspaceStorageRecovery=VER;

  const STORE_KEY='windzxy-web-desktop-workspaces';
  const ACTIVE_KEY='windzxy-active-workspace';
  const GEO_KEY='windzxy-web-desktop-card-geometry-v4';
  const BACKUP_SUFFIX='-recovery-backup';

  function backup(key,raw,reason){
    try{
      localStorage.setItem(key+BACKUP_SUFFIX,JSON.stringify({
        capturedAt:new Date().toISOString(),
        reason:String(reason||'invalid-data'),
        raw:String(raw||'').slice(0,250000)
      }));
    }catch(e){}
  }

  function recoverWorkspaces(){
    let raw='';
    try{raw=localStorage.getItem(STORE_KEY)||'';}catch(e){return {recovered:false,ids:[],activeAdjusted:false};}
    if(!raw)return {recovered:false,ids:[],activeAdjusted:false};
    try{
      const rows=JSON.parse(raw);
      if(!Array.isArray(rows))throw new Error('workspace-store-not-array');
      const ids=rows.map(row=>row&&row.id!=null?String(row.id):'').filter(Boolean);
      let activeAdjusted=false;
      try{
        const active=localStorage.getItem(ACTIVE_KEY)||'';
        if(active&&!ids.includes(active)){
          if(ids[0])localStorage.setItem(ACTIVE_KEY,ids[0]);
          else localStorage.removeItem(ACTIVE_KEY);
          activeAdjusted=true;
        }
      }catch(e){}
      return {recovered:false,ids:ids,activeAdjusted:activeAdjusted};
    }catch(err){
      backup(STORE_KEY,raw,err&&err.message);
      try{localStorage.removeItem(STORE_KEY);localStorage.removeItem(ACTIVE_KEY);}catch(e){}
      return {recovered:true,ids:[],activeAdjusted:false};
    }
  }

  function recoverGeometry(){
    let raw='';
    try{raw=localStorage.getItem(GEO_KEY)||'';}catch(e){return false;}
    if(!raw)return false;
    try{
      const geo=JSON.parse(raw);
      if(!geo||typeof geo!=='object'||Array.isArray(geo))throw new Error('geometry-store-not-object');
      return false;
    }catch(err){
      backup(GEO_KEY,raw,err&&err.message);
      try{localStorage.removeItem(GEO_KEY);}catch(e){}
      return true;
    }
  }

  function announce(result){
    if(!result.workspaceRecovered&&!result.geometryRecovered&&!result.activeWorkspaceAdjusted)return;
    function show(){
      const hint=document.getElementById('workspaceHint');
      const lang=(document.documentElement.lang||'').toLowerCase();
      const text=lang.indexOf('en')===0
        ? 'Workspace data was repaired safely; damaged data was backed up when available.'
        : '已安全修復工作區資料；如有損壞資料，已先建立復原備份。';
      if(hint){
        hint.setAttribute('role','status');
        hint.setAttribute('aria-live','polite');
        hint.textContent=text;
      }
      try{window.dispatchEvent(new CustomEvent('webdesk:workspace-storage-recovered',{detail:result}));}catch(e){}
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show,{once:true});
    else show();
  }

  const workspaceResult=recoverWorkspaces();
  const geometryRecovered=recoverGeometry();
  const result={
    version:VER,
    workspaceRecovered:workspaceResult.recovered,
    geometryRecovered:geometryRecovered,
    activeWorkspaceAdjusted:workspaceResult.activeAdjusted,
    backupSuffix:BACKUP_SUFFIX
  };
  window.WebDeskWorkspaceStorageRecovery=result;
  announce(result);
})();