(function(){
'use strict';
const VER='20260908-typhoon-window-p0-fix7-tile-viewport-repair';
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

function showDegraded(root){
  if(!root||!document.body.contains(root)||root.querySelector('.leaflet-container'))return;
  const loading=root.querySelector('.tpv4-map-loading');
  if(!loading)return;
  loading.innerHTML='<span>⚠️</span><b>颱風資料暫時無法載入</b><small style="display:block;margin-top:8px;opacity:.72">請稍後再試。</small>';
}

function redrawLeafletLayers(map){
  if(!map||typeof map.eachLayer!=='function')return;
  try{
    map.eachLayer(function(layer){
      if(layer&&typeof layer.redraw==='function'){
        try{layer.redraw();}catch(_){ }
      }
    });
  }catch(_){ }
}

function repairMapViewport(root,reason){
  if(!root||!root.isConnected)return;
  const map=root.__tpMap;
  if(!map||typeof map.invalidateSize!=='function')return;
  const container=typeof map.getContainer==='function'?map.getContainer():root.querySelector('.leaflet-container');
  if(container){
    const rect=container.getBoundingClientRect();
    if(rect.width<16||rect.height<16)return;
  }
  try{map.invalidateSize({pan:false,animate:false});}catch(_){try{map.invalidateSize(false);}catch(__){}}
  redrawLeafletLayers(map);
  try{if(typeof map.fire==='function')map.fire('moveend',{hardRefresh:true,reason:reason||'repair'});}catch(_){ }
  requestAnimationFrame(function(){
    if(!root.isConnected)return;
    try{map.invalidateSize({pan:false,animate:false});}catch(_){ }
    redrawLeafletLayers(map);
  });
}

function installResizeRepair(win,root){
  if(!win||!root||win.__tpResizeRepairVersion===VER)return;
  win.__tpResizeRepairVersion=VER;
  let raf=0;
  let lastW=0,lastH=0;
  const repair=(reason)=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>repairMapViewport(root,reason));
  };
  const observeTarget=(target,observer)=>{if(target&&target.nodeType===1)observer.observe(target);};
  if(typeof ResizeObserver==='function'){
    if(win.__tpResizeObserver)try{win.__tpResizeObserver.disconnect();}catch(_){ }
    const observer=new ResizeObserver((entries)=>{
      if(!win.isConnected){observer.disconnect();return;}
      let changed=false;
      entries.forEach(entry=>{
        const box=entry.contentRect;
        if(Math.abs(box.width-lastW)>1||Math.abs(box.height-lastH)>1){lastW=box.width;lastH=box.height;changed=true;}
      });
      if(changed)repair('resize-observer');
    });
    observeTarget(win,observer);
    observeTarget(win.querySelector('.desktop-window-body'),observer);
    observeTarget(root.querySelector('.tpv4-map'),observer);
    observeTarget(root.querySelector('.leaflet-container'),observer);
    win.__tpResizeObserver=observer;
  }
  const map=root.__tpMap;
  if(map&&typeof map.on==='function'&&!map.__tpViewportRepairBound){
    map.__tpViewportRepairBound=true;
    map.on('zoomend moveend layeradd baselayerchange overlayadd overlayremove',function(){repair('map-event');});
  }
  [0,60,160,360,800,1600].forEach(ms=>setTimeout(()=>repair('startup-'+ms),ms));
  win.addEventListener('transitionend',()=>repair('transitionend'));
  window.addEventListener('resize',()=>repair('window-resize'),{passive:true});
}

function bindWindowRoot(win){
  const root=win?.querySelector?.('[data-typhoon-root]');
  if(!root)return;
  win.dataset.tpP0Fixed='1';
  root.dataset.tpP0Stable='1';
  root.dataset.tpOwner='window-bridge-v7';
  installResizeRepair(win,root);
  setTimeout(()=>showDegraded(root),12000);
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
      if(appId==='typhoon')requestAnimationFrame(()=>bindWindowRoot(win));
      return out;
    };
  }
  window.WebDeskTyphoonWindowBridge={version:VER,appWindow:true,degradedRecovery:true,globalRerender:false,stableRoot:true,weatherControlsPreserved:true,mapResizeRepair:true,tileViewportRepair:true,layerRedraw:true};
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
else install();
})();
