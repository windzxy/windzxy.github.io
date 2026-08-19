(function(){
  if(window.__windzxyFirstRunEmptyDesktopLoaded)return;
  window.__windzxyFirstRunEmptyDesktopLoaded=1;

  const VER='20260819-first-run-empty1';
  const STORE='windzxy-web-desktop-workspaces';
  const LEGACY=['windzxy-desktop-workspaces','windzxy-dashboard-workspaces'];
  const ACTIVE='windzxy-active-workspace';
  const hadSaved=!!(localStorage.getItem(STORE)||LEGACY.some(k=>localStorage.getItem(k)));

  window.__windzxyFirstRunEmptyDesktop=!hadSaved;
  window.__windzxyFirstRunEmptyDesktopVersion=VER;

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
  }

  function markUserChoice(){
    window.__windzxyFirstRunEmptyDesktop=false;
  }

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
    if(!window.__windzxyFirstRunEmptyDesktop)return;
    saveEmpty();
    renderEmpty();
  }

  if(!hadSaved){
    document.documentElement.dataset.firstRunEmpty='1';
    run();
    setTimeout(run,0);
    setTimeout(run,120);
    setTimeout(()=>{
      if(window.__windzxyFirstRunEmptyDesktop){
        saveEmpty();
        renderEmpty();
      }
    },450);
  }else{
    patchAddCard();
  }
})();
