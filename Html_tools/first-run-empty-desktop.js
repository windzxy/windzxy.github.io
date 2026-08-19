(function(){
  if(window.__windzxyFirstRunEmptyDesktopV3Loaded)return;
  window.__windzxyFirstRunEmptyDesktopV3Loaded=1;

  const VER='20260819-first-run-empty3-keep-bg-fit';
  const STORE='windzxy-web-desktop-workspaces';
  const LEGACY=['windzxy-desktop-workspaces','windzxy-dashboard-workspaces'];
  const ACTIVE='windzxy-active-workspace';
  const BG='windzxy-desktop-bg';
  const hadSaved=!!(localStorage.getItem(STORE)||LEGACY.some(k=>localStorage.getItem(k)));

  window.__windzxyFirstRunEmptyDesktop=!hadSaved;
  window.__windzxyFirstRunEmptyDesktopVersion=VER;

  function cssUrl(src){return 'url("'+String(src||'').replace(/["\\\n\r]/g,m=>m==='"'?'%22':m==='\\'?'%5C':'')+'")';}
  function fitBackground(file,src){
    const app=document.getElementById('desktopApp');
    if(!app||!src)return;
    const u=cssUrl(src);
    app.style.backgroundImage=u+', '+u;
    app.style.backgroundPosition='center center, center center';
    app.style.backgroundRepeat='no-repeat, no-repeat';
    app.style.backgroundSize='contain, cover';
    app.style.backgroundColor='#0b1020';
    app.dataset.backgroundFit='full-image';
    if(file)app.dataset.background=file;
  }
  function emptyWorkspace(ws){
    if(!ws)return ws;
    ws.cards=[];
    if(ws.id==='daily')ws.hint='從右側功能中心選擇需要的卡片。';
    return ws;
  }
  function openTools(){
    try{
      if(typeof openDrawer==='function')openDrawer('tools');
      else document.getElementById('desktopDrawer')?.classList.add('is-open');
    }catch(e){}
  }
  function hasBg(){
    const app=document.getElementById('desktopApp');
    return !!(app&&(app.dataset.background||app.style.backgroundImage));
  }
  function ensureBackground(){
    try{
      if(typeof loadBackgrounds==='function'){
        const r=loadBackgrounds();
        if(r&&typeof r.catch==='function')r.catch(()=>{});
      }
    }catch(e){}
    setTimeout(()=>{
      try{
        if(hasBg())return;
        if(typeof randomBackground==='function')randomBackground();
        else if(typeof applyBackground==='function'&&Array.isArray(backgrounds)&&backgrounds[0])applyBackground(backgrounds[0].file);
      }catch(e){}
    },500);
    setTimeout(()=>{
      try{
        const app=document.getElementById('desktopApp');
        const file=app?.dataset.background||localStorage.getItem(BG);
        if(!app||!file)return;
        if(typeof resolveBackgroundSource==='function'){
          const r=resolveBackgroundSource(file);
          if(r&&typeof r.then==='function')r.then(src=>fitBackground(file,src)).catch(()=>{});
          else if(r)fitBackground(file,r);
        }
      }catch(e){}
    },1300);
  }
  function saveEmpty(){
    try{
      if(Array.isArray(workspaces)){
        workspaces.forEach(emptyWorkspace);
        if(workspaces[0]){
          activeId=workspaces[0].id;
          localStorage.setItem(ACTIVE,activeId);
        }
      }
      if(typeof save==='function')save();
      else if(Array.isArray(workspaces))localStorage.setItem(STORE,JSON.stringify(workspaces));
    }catch(e){}
  }
  function renderEmpty(){
    try{ if(typeof renderAll==='function')renderAll(); }catch(e){}
    openTools();
    ensureBackground();
  }
  function markUserChoice(){window.__windzxyFirstRunEmptyDesktop=false;}
  function patchAddCard(){
    try{
      if(typeof addCard==='function'&&!window.__windzxyFirstRunAddCardPatched){
        window.__windzxyFirstRunAddCardPatched=1;
        const old=addCard;
        addCard=function(){markUserChoice();return old.apply(this,arguments);};
      }
      if(typeof addCustomCard==='function'&&!window.__windzxyFirstRunAddCustomPatched){
        window.__windzxyFirstRunAddCustomPatched=1;
        const old=addCustomCard;
        addCustomCard=function(){markUserChoice();return old.apply(this,arguments);};
      }
    }catch(e){}
  }
  function run(){
    patchAddCard();
    ensureBackground();
    if(!window.__windzxyFirstRunEmptyDesktop)return;
    saveEmpty();
    renderEmpty();
  }
  if(!hadSaved){
    document.documentElement.dataset.firstRunEmpty='1';
    run();
    setTimeout(run,0);
    setTimeout(run,120);
    setTimeout(run,450);
    setTimeout(()=>{
      if(window.__windzxyFirstRunEmptyDesktop){saveEmpty();renderEmpty();}
      else ensureBackground();
    },1200);
  }else{
    patchAddCard();
    ensureBackground();
  }
})();