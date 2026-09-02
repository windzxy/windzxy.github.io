(function(){
'use strict';
const VER='20260902-typhoon-window-p0-fix1';
if(window.__windzxyTyphoonWindowP0===VER)return;
window.__windzxyTyphoonWindowP0=VER;

function fallbackBody(){
  return '<div class="typhoon-widget tpv4" data-typhoon-root data-version="'+VER+'"><div class="tpv4-map"><div class="tpv4-map-loading"><span>🌀</span><b>正在載入颱風資料…</b></div></div></div>';
}

function typhoonBody(){
  try{
    if(typeof bodyHtml==='function'){
      const html=bodyHtml({appId:'typhoon',data:{}},{id:'typhoon',title:'颱風路徑'});
      if(html&&html.indexOf('data-typhoon-root')!==-1)return html;
    }
  }catch(error){
    console.error('[typhoon-window] body bridge failed',error);
  }
  return fallbackBody();
}

function bindWindowRoot(win){
  setTimeout(()=>{
    const root=win?.querySelector?.('[data-typhoon-root]');
    if(!root)return;
    try{
      /* The unified runtime wraps renderAll() and runs bindAll afterwards. */
      if(typeof renderAll==='function')renderAll();
    }catch(error){
      console.error('[typhoon-window] runtime bind failed',error);
    }
  },0);
}

function install(){
  if(typeof appContent!=='function'||typeof bindApp!=='function'||typeof bodyHtml!=='function'){
    setTimeout(install,80);
    return;
  }
  if(!window.__windzxyTyphoonWindowContentP0){
    window.__windzxyTyphoonWindowContentP0=1;
    const oldAppContent=appContent;
    appContent=function(appId){
      if(appId==='typhoon')return typhoonBody();
      return oldAppContent.apply(this,arguments);
    };
  }
  if(!window.__windzxyTyphoonWindowBindP0){
    window.__windzxyTyphoonWindowBindP0=1;
    const oldBindApp=bindApp;
    bindApp=function(win,appId){
      const out=oldBindApp.apply(this,arguments);
      if(appId==='typhoon')bindWindowRoot(win);
      return out;
    };
  }
  window.WebDeskTyphoonWindowBridge={version:VER,appWindow:true};
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
else install();
})();
