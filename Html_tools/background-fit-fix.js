(function(){
  if(window.__windzxyBackgroundFitFixLoaded)return;
  window.__windzxyBackgroundFitFixLoaded=1;

  const VER='20260819-bg-fit1-no-crop';
  const BG_KEY='windzxy-desktop-bg';

  function cssUrl(src){
    return 'url("'+String(src||'').replace(/["\\\n\r]/g,m=>m==='"'?'%22':m==='\\'?'%5C':'')+'")';
  }

  function applyLayeredBackground(file,src){
    const app=document.getElementById('desktopApp');
    if(!app||!src)return;
    const u=cssUrl(src);
    app.style.backgroundImage=u+', '+u;
    app.style.backgroundSize='contain, cover';
    app.style.backgroundPosition='center center, center center';
    app.style.backgroundRepeat='no-repeat, no-repeat';
    app.style.backgroundColor='#0b1020';
    app.dataset.backgroundFit='full-image';
    if(file){
      app.dataset.background=file;
      try{localStorage.setItem(BG_KEY,file);}catch(e){}
    }
  }

  function patchCore(){
    if(typeof setBackgroundImage==='function'&&!window.__windzxyBackgroundSetPatched){
      window.__windzxyBackgroundSetPatched=1;
      const old=setBackgroundImage;
      window.setBackgroundImage=function(file,src){
        const out=old.apply(this,arguments);
        applyLayeredBackground(file,src);
        return out;
      };
    }
  }

  function applyCurrent(){
    const app=document.getElementById('desktopApp');
    if(!app)return;
    if(app.dataset.backgroundFit==='full-image')return;
    const file=app.dataset.background||localStorage.getItem(BG_KEY)||'';
    if(file&&typeof resolveBackgroundSource==='function'){
      try{
        const r=resolveBackgroundSource(file);
        if(r&&typeof r.then==='function')r.then(src=>applyLayeredBackground(file,src)).catch(()=>{});
        else if(r)applyLayeredBackground(file,r);
        return;
      }catch(e){}
    }
    const raw=app.style.backgroundImage||'';
    const m=raw.match(/url\(["']?(.+?)["']?\)/);
    if(m&&m[1])applyLayeredBackground(file,m[1]);
  }

  function boot(){
    patchCore();
    applyCurrent();
    setTimeout(()=>{patchCore();applyCurrent();},250);
    setTimeout(()=>{patchCore();applyCurrent();},1000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.windzxyBackgroundFitFixVersion=VER;
})();