(function(){
  'use strict';
  const VER='20260908-workspace-storage-recovery-v1';
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
    try{raw=localStorage.getItem(STORE_KEY)||'';}catch(e){return {recovered:false,ids:[]};}
    if(!raw)return {recovered:false,ids:[]};
    try{
      const rows=JSON.parse(raw);
      if(!Array.isArray(rows))throw new Error('workspace-store-not-array');
      const ids=rows.map(row=>row&&row.id!=null?String(row.id):'').filter(Boolean);
      if(ids.length){
        try{
          const active=localStorage.getItem(ACTIVE_KEY)||'';
          if(active&&!ids.includes(active))localStorage.setItem(ACTIVE_KEY,ids[0]);
        }catch(e){}
      }
      return {recovered:false,ids:ids};
    }catch(err){
      backup(STORE_KEY,raw,err&&err.message);
      try{localStorage.removeItem(STORE_KEY);localStorage.removeItem(ACTIVE_KEY);}catch(e){}
      return {recovered:true,ids:[]};
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

  const workspaceResult=recoverWorkspaces();
  const geometryRecovered=recoverGeometry();
  window.WebDeskWorkspaceStorageRecovery={
    version:VER,
    workspaceRecovered:workspaceResult.recovered,
    geometryRecovered:geometryRecovered,
    backupSuffix:BACKUP_SUFFIX
  };
})();
