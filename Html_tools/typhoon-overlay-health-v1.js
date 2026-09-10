/* WebDesk Typhoon overlay health guard v1.0
 * Non-invasive recovery for radar/satellite/precipitation Leaflet overlays.
 * Keeps base-map/provider failover untouched and only refreshes weather overlays.
 */
(function(){
  'use strict';
  const VERSION='1.0-radar-satellite-precip-recovery';
  const ERROR_WINDOW=12000;
  const ERROR_LIMIT=4;
  const STALE_MS=8*60*1000;
  const BASE_BACKOFF=5000;
  const MAX_BACKOFF=120000;
  const registry=new WeakMap();
  let root=null,map=null,scanTimer=null;

  const now=()=>Date.now();
  function isTyphoonRoot(el){
    if(!el||!el.querySelector)return false;
    return !!(el.__tpMap || el.querySelector('[data-weather-layer], .typhoon-weather, .tp-weather-layer, .typhoon-map'));
  }
  function findRoot(){
    const candidates=[...document.querySelectorAll('.app-window,.desktop-window,[data-app-id="typhoon"],[data-app="typhoon"]')];
    return candidates.find(isTyphoonRoot) || candidates.find(el=>el.__tpMap) || null;
  }
  function findMap(r){ return r && r.__tpMap ? r.__tpMap : null; }
  function layerLabel(layer){
    const raw=[layer&&layer.options&&layer.options.className,layer&&layer.options&&layer.options.attribution,layer&&layer._url,layer&&layer.options&&layer.options.url].filter(Boolean).join(' ').toLowerCase();
    if(/radar|rain|precip|rainviewer/.test(raw)) return 'radar';
    if(/satellite|cloud|imagery|eox/.test(raw)) return 'satellite';
    if(/weather|temperature|wind|gust/.test(raw)) return 'weather';
    return '';
  }
  function isOverlay(layer){
    if(!layer||typeof layer.on!=='function')return false;
    const label=layerLabel(layer);
    if(label)return true;
    const pane=layer.options&&layer.options.pane;
    return !!(pane && /weather|radar|satellite|overlay|precip/i.test(String(pane)));
  }
  function updateStatus(kind,text){
    if(!root)return;
    const box=root.querySelector('[data-weather-status],.tp-weather-source,.typhoon-weather-source');
    if(!box)return;
    box.dataset.overlayHealth=kind;
    box.title=text;
  }
  function recover(layer,state,reason){
    if(!navigator.onLine)return;
    const t=now();
    if(t<state.nextTry)return;
    state.tries=Math.min(state.tries+1,6);
    state.nextTry=t+Math.min(MAX_BACKOFF,BASE_BACKOFF*Math.pow(2,state.tries-1));
    try{
      if(typeof layer.redraw==='function') layer.redraw();
      else if(map && typeof map.removeLayer==='function' && typeof map.addLayer==='function' && map.hasLayer && map.hasLayer(layer)){
        map.removeLayer(layer); setTimeout(()=>{ try{ map.addLayer(layer); }catch(_){ } },80);
      }
      updateStatus('recovering','氣象影像層正在恢復 · '+reason);
    }catch(_){ }
  }
  function bindLayer(layer){
    if(registry.has(layer)||!isOverlay(layer))return;
    const state={errors:[],lastLoad:now(),tries:0,nextTry:0,label:layerLabel(layer)||'overlay'};
    registry.set(layer,state);
    layer.on('tileload',()=>{
      state.lastLoad=now(); state.errors=[]; state.tries=0; state.nextTry=0;
      updateStatus('ok','氣象影像層已更新 · '+state.label);
    });
    layer.on('tileerror',()=>{
      const t=now(); state.errors.push(t); state.errors=state.errors.filter(x=>t-x<=ERROR_WINDOW);
      if(state.errors.length>=ERROR_LIMIT) recover(layer,state,'連續載入失敗');
    });
  }
  function scanLayers(){
    root=findRoot(); map=findMap(root);
    if(!map||typeof map.eachLayer!=='function')return;
    map.eachLayer(bindLayer);
  }
  function healthCheck(){
    if(!map||typeof map.eachLayer!=='function'){ scanLayers(); return; }
    const t=now();
    map.eachLayer(layer=>{
      bindLayer(layer);
      const state=registry.get(layer);
      if(!state)return;
      if(t-state.lastLoad>STALE_MS) recover(layer,state,'資料超過 8 分鐘未刷新');
    });
  }
  function wake(reason){
    scanLayers();
    setTimeout(()=>{
      if(!map||typeof map.eachLayer!=='function')return;
      map.eachLayer(layer=>{ const state=registry.get(layer); if(state) recover(layer,state,reason); });
    },180);
  }
  function attach(){
    scanLayers();
    if(map&&typeof map.on==='function'){
      map.on('layeradd',e=>bindLayer(e.layer));
      map.on('moveend zoomend',()=>setTimeout(healthCheck,450));
    }
    clearInterval(scanTimer); scanTimer=setInterval(healthCheck,30000);
  }
  window.addEventListener('online',()=>wake('網絡已恢復'));
  window.addEventListener('pageshow',()=>wake('頁面已恢復'));
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden)wake('頁面重新顯示'); });
  window.addEventListener('orientationchange',()=>setTimeout(()=>wake('螢幕方向改變'),350));
  const observer=new MutationObserver(()=>{ if(!root||!document.contains(root))attach(); else scanLayers(); });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  attach();
  window.__typhoonOverlayHealth={version:VERSION,refresh:()=>wake('手動刷新')};
})();