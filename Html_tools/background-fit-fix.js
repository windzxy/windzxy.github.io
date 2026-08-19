(function(){
  if(window.__windzxyBackgroundFitFixV2Loaded)return;
  window.__windzxyBackgroundFitFixV2Loaded=1;

  const VER='20260819-bg-fit2-stable-one-image';
  const BG_KEY='windzxy-desktop-bg';
  let lockedFile=localStorage.getItem(BG_KEY)||'';
  let manualUntil=0;
  let applying=false;

  function cssUrl(src){
    return 'url("'+String(src||'').replace(/["\\\n\r]/g,m=>m==='"'?'%22':m==='\\'?'%5C':'')+'")';
  }

  function currentApp(){return document.getElementById('desktopApp');}
  function currentFile(){
    const app=currentApp();
    return app?.dataset.background||localStorage.getItem(BG_KEY)||'';
  }
  function isManual(){return Date.now()<manualUntil;}

  function applyLayeredBackground(file,src,write=true){
    const app=currentApp();
    if(!app||!src)return;
    applying=true;
    const u=cssUrl(src);
    app.style.backgroundImage=u+', '+u;
    app.style.backgroundSize='contain, cover';
    app.style.backgroundPosition='center center, center center';
    app.style.backgroundRepeat='no-repeat, no-repeat';
    app.style.backgroundColor='#0b1020';
    app.dataset.backgroundFit='full-image';
    if(file){
      app.dataset.background=file;
      if(write){
        try{localStorage.setItem(BG_KEY,file);}catch(e){}
      }
    }
    setTimeout(()=>{applying=false;},40);
  }

  function resolveAndApply(file,write=true){
    if(!file)return;
    if(typeof resolveBackgroundSource==='function'){
      try{
        const r=resolveBackgroundSource(file);
        if(r&&typeof r.then==='function')r.then(src=>applyLayeredBackground(file,src,write)).catch(()=>{});
        else if(r)applyLayeredBackground(file,r,write);
        return;
      }catch(e){}
    }
    applyLayeredBackground(file,file,write);
  }

  function stabilize(){
    if(applying)return;
    const app=currentApp();
    if(!app)return;
    const file=currentFile();
    if(isManual()){
      if(file)lockedFile=file;
      if(file)resolveAndApply(file,true);
      return;
    }
    if(lockedFile&&file&&file!==lockedFile){
      resolveAndApply(lockedFile,true);
      return;
    }
    if(!lockedFile&&file){
      lockedFile=file;
      resolveAndApply(file,true);
      return;
    }
    if(file)resolveAndApply(file,true);
  }

  function markManual(){manualUntil=Date.now()+5000;}

  function patchCore(){
    if(typeof randomBackground==='function'&&!window.__windzxyRandomBgManualPatched){
      window.__windzxyRandomBgManualPatched=1;
      const old=randomBackground;
      window.randomBackground=function(){markManual();return old.apply(this,arguments);};
    }
  }

  function boot(){
    patchCore();
    document.addEventListener('click',e=>{if(e.target.closest('[data-random-bg], .background-item'))markManual();},true);
    const app=currentApp();
    if(app&&window.MutationObserver){
      new MutationObserver(()=>setTimeout(stabilize,60)).observe(app,{attributes:true,attributeFilter:['style','data-background','data-background-fit']});
    }
    stabilize();
    setTimeout(()=>{patchCore();stabilize();},250);
    setTimeout(()=>{patchCore();stabilize();},1000);
    setTimeout(()=>{patchCore();stabilize();},1800);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyBackgroundFitFixVersion=VER;
})();