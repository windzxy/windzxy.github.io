(function(){
  if(window.__windzxyBackgroundFitFixV4Loaded)return;
  window.__windzxyBackgroundFitFixV4Loaded=1;

  const VER='20260820-bg-fit4-single-cover-no-tile';
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

  function applySingleCoverBackground(file,src,write=true){
    const app=currentApp();
    if(!app||!src)return;
    applying=true;
    const u=cssUrl(src);

    // One desktop = one background image. Fill the viewport, no repeat, no stitched layers.
    app.style.backgroundImage=u;
    app.style.backgroundSize='cover';
    app.style.backgroundPosition='center center';
    app.style.backgroundRepeat='no-repeat';
    app.style.backgroundAttachment='fixed';
    app.style.backgroundColor='#0b1020';
    app.style.imageRendering='auto';
    app.dataset.backgroundFit='single-cover';

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
        if(r&&typeof r.then==='function')r.then(src=>applySingleCoverBackground(file,src,write)).catch(()=>{});
        else if(r)applySingleCoverBackground(file,r,write);
        return;
      }catch(e){}
    }
    applySingleCoverBackground(file,file,write);
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
    if(typeof setBackgroundImage==='function'&&!window.__windzxySetBgSingleCoverPatched){
      window.__windzxySetBgSingleCoverPatched=1;
      const oldSet=setBackgroundImage;
      window.setBackgroundImage=function(file,src){
        const out=oldSet.apply(this,arguments);
        applySingleCoverBackground(file,src,true);
        return out;
      };
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