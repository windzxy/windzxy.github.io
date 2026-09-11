/* WebDesk Typhoon overlay health guard v1.1
 * Non-invasive recovery for radar/satellite/precipitation Leaflet overlays.
 * Keeps base-map/provider failover untouched, refreshes weather overlays,
 * and synchronises visible source/time status after successful tile recovery.
 */
(function(){
  'use strict';
  const VERSION='1.1-overlay-time-source-sync';
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
  function layerRaw(layer){
    return [layer&&layer.options&&layer.options.className,layer&&layer.options&&layer.options.attribution,layer&&layer._url,layer&&layer.options&&layer.options.url].filter(Boolean).join(' ');
  }
  function layerLabel(layer){
    const raw=layerRaw(layer).toLowerCase();
    if(/radar|rainviewer|rain|precip/.test(raw)) return 'radar';
    if(/satellite|cloud|imagery|eox|esri/.test(raw)) return 'satellite';
    if(/weather|temperature|wind|gust/.test(raw)) return 'weather';
    return '';
  }
  function providerLabel(layer){
    const raw=layerRaw(layer).toLowerCase();
    if(/rainviewer/.test(raw)) return 'RainViewer';
    if(/eox/.test(raw)) return 'EOX';
    if(/arcgis|esri/.test(raw)) return 'Esri';
    if(/openweathermap/.test(raw)) return 'OpenWeather';
    if(/open-meteo|openmeteo/.test(raw)) return 'Open-Meteo';
    if(/carto/.test(raw)) return 'CARTO';
    return 'Weather overlay';
  }
  function parseOverlayTime(layer){
    const candidates=[layer&&layer._url,layer&&layer.options&&layer.options.url,layer&&layer.options&&layer.options.time,layer&&layer.options&&layer.options.timestamp];
    for(const value of candidates){
      if(value==null) continue;
      const text=String(value);
      const epoch=text.match(/(?:timestamp|time|ts|t)[=/:-](\d{10,13})/i) || text.match(/\/(\d{10,13})(?:\/|\.|\?|$)/);
      if(epoch){
        let n=Number(epoch[1]); if(n<1e12)n*=1000;
        if(Number.isFinite(n)&&n>946684800000&&n<4102444800000)return n;
      }
      const iso=text.match(/(20\d{2})[-_/]?([01]\d)[-_/]?([0-3]\d)[T_ -]?([0-2]\d)?(?::?([0-5]\d))?/);
      if(iso){
        const d=new Date(Date.UTC(+iso[1],+iso[2]-1,+iso[3],+(iso[4]||0),+(iso[5]||0)));
        if(Number.isFinite(d.getTime()))return d.getTime();
      }
    }
    return null;
  }
  function formatTime(ms){
    try{return new Intl.DateTimeFormat('zh-HK',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(ms));}
    catch(_){return new Date(ms).toLocaleString();}
  }
  function isOverlay(layer){
    if(!layer||typeof layer.on!=='function')return false;
    const label=layerLabel(layer);
    if(label)return true;
    const pane=layer.options&&layer.options.pane;
    return !!(pane && /weather|radar|satellite|overlay|precip/i.test(String(pane)));
  }
  function statusNodes(){
    if(!root)return [];
    return [...root.querySelectorAll('[data-weather-status],.tp-weather-source,.typhoon-weather-source')];
  }
  function emitHealth(detail){
    try{ root&&root.dispatchEvent(new CustomEvent('typhoon:overlay-health',{detail})); }catch(_){ }
  }
  function updateStatus(kind,text,meta){
    statusNodes().forEach(box=>{
      box.dataset.overlayHealth=kind;
      box.title=text;
      if(meta&&meta.provider)box.dataset.overlayProvider=meta.provider;
      if(meta&&meta.time)box.dataset.overlayTime=String(meta.time);
      const timeNode=box.querySelector&&box.querySelector('[data-overlay-time]');
      const sourceNode=box.querySelector&&box.querySelector('[data-overlay-source]');
      if(timeNode&&meta&&meta.time)timeNode.textContent=formatTime(meta.time);
      if(sourceNode&&meta&&meta.provider)sourceNode.textContent=meta.provider;
    });
    emitHealth(Object.assign({status:kind,message:text,at:now()},meta||{}));
  }
  function syncSuccess(layer,state){
    const tileTime=parseOverlayTime(layer);
    state.lastLoad=now();
    state.dataTime=tileTime||state.lastLoad;
    state.provider=providerLabel(layer);
    const label=state.label==='radar'?'雷達':state.label==='satellite'?'衛星':state.label==='weather'?'氣象':'氣象影像';
    updateStatus('ok',label+'已更新 · '+state.provider+' · '+formatTime(state.dataTime),{layer:state.label,provider:state.provider,time:state.dataTime});
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
      updateStatus('recovering','氣象影像層正在恢復 · '+reason,{layer:state.label,provider:state.provider||providerLabel(layer),time:state.dataTime||state.lastLoad});
    }catch(_){ }
  }
  function bindLayer(layer){
    if(registry.has(layer)||!isOverlay(layer))return;
    const state={errors:[],lastLoad:now(),dataTime:parseOverlayTime(layer),tries:0,nextTry:0,label:layerLabel(layer)||'overlay',provider:providerLabel(layer)};
    registry.set(layer,state);
    layer.on('tileload',()=>{
      state.errors=[]; state.tries=0; state.nextTry=0; syncSuccess(layer,state);
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
    if(map&&typeof map.on==='function'&&!map.__tpOverlayHealthBound){
      map.__tpOverlayHealthBound=true;
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
  window.__typhoonOverlayHealth={version:VERSION,refresh:()=>wake('手動刷新'),check:healthCheck};
})();