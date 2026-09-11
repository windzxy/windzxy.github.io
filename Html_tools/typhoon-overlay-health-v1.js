/* WebDesk Typhoon overlay health guard v1.2
 * Non-invasive recovery for radar/satellite/precipitation Leaflet overlays.
 * Keeps base-map/provider failover untouched, refreshes weather overlays,
 * and keeps overlay/provider timestamps honest when source URLs expose no data time.
 */
(function(){
  'use strict';
  const VERSION='1.2-data-time-coherence';
  const ERROR_WINDOW=12000;
  const ERROR_LIMIT=4;
  const STALE_MS=8*60*1000;
  const BASE_BACKOFF=5000;
  const MAX_BACKOFF=120000;
  const MAX_TIME_SKEW=20*60*1000;
  const registry=new WeakMap();
  let root=null,map=null,scanTimer=null,latestGridTime=null;

  const now=()=>Date.now();
  function isTyphoonRoot(el){
    if(!el||!el.querySelector)return false;
    return !!(el.__tpMap || el.querySelector('[data-weather-layer], .typhoon-weather, .tp-weather-layer, .typhoon-map'));
  }
  function findRoot(){
    const candidates=[...document.querySelectorAll('.app-window,.desktop-window,[data-app-id="typhoon"],[data-app="typhoon"],[data-typhoon-root]')];
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
  function validEpoch(n){
    n=Number(n);
    if(!Number.isFinite(n))return null;
    if(n<1e12)n*=1000;
    return n>946684800000&&n<4102444800000?n:null;
  }
  function parseOverlayTime(layer){
    const candidates=[layer&&layer._url,layer&&layer.options&&layer.options.url,layer&&layer.options&&layer.options.time,layer&&layer.options&&layer.options.timestamp];
    for(const value of candidates){
      if(value==null) continue;
      const text=String(value);
      const rainViewer=text.match(/(?:\/v2\/radar\/|\/radar\/)(\d{10})(?:\/|$)/i);
      if(rainViewer){ const t=validEpoch(rainViewer[1]); if(t)return t; }
      const epoch=text.match(/(?:timestamp|time|ts|t)[=/:-](\d{10,13})/i) || text.match(/\/(\d{10,13})(?:\/|\.|\?|$)/);
      if(epoch){ const t=validEpoch(epoch[1]); if(t)return t; }
      const iso=text.match(/(20\d{2})[-_/]?([01]\d)[-_/]?([0-3]\d)[T_ -]?([0-2]\d)?(?::?([0-5]\d))?/);
      if(iso){
        const d=new Date(Date.UTC(+iso[1],+iso[2]-1,+iso[3],+(iso[4]||0),+(iso[5]||0)));
        if(Number.isFinite(d.getTime()))return d.getTime();
      }
    }
    return null;
  }
  function gridTimeFromDetail(detail){
    const grid=detail&&detail.grid;
    if(!grid)return null;
    const values=[];
    if(grid.at)values.push(grid.at);
    (grid.data||[]).forEach(cell=>{
      const t=cell&&cell.current&&cell.current.time;
      if(!t)return;
      const ms=Date.parse(t);
      if(Number.isFinite(ms))values.push(ms);
    });
    const valid=values.map(validEpoch).filter(Boolean);
    return valid.length?Math.max.apply(null,valid):null;
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
      if(meta&&meta.time)box.dataset.overlayTime=String(meta.time); else delete box.dataset.overlayTime;
      if(meta&&meta.timeKnown!=null)box.dataset.overlayTimeKnown=meta.timeKnown?'1':'0';
      const timeNode=box.querySelector&&box.querySelector('[data-overlay-time]');
      const sourceNode=box.querySelector&&box.querySelector('[data-overlay-source]');
      if(timeNode)timeNode.textContent=meta&&meta.time?formatTime(meta.time):'時間由來源決定';
      if(sourceNode&&meta&&meta.provider)sourceNode.textContent=meta.provider;
    });
    emitHealth(Object.assign({status:kind,message:text,at:now()},meta||{}));
  }
  function syncSuccess(layer,state){
    const explicitTime=parseOverlayTime(layer);
    state.lastLoad=now();
    state.dataTime=explicitTime;
    state.timeKnown=!!explicitTime;
    state.provider=providerLabel(layer);
    const label=state.label==='radar'?'雷達':state.label==='satellite'?'衛星':state.label==='weather'?'氣象':'氣象影像';
    let kind='ok';
    let text=label+'已刷新 · '+state.provider;
    if(explicitTime){
      text+=' · '+formatTime(explicitTime);
      if(latestGridTime&&Math.abs(explicitTime-latestGridTime)>MAX_TIME_SKEW){
        kind='time-skew';
        const delta=Math.round(Math.abs(explicitTime-latestGridTime)/60000);
        text+=' · 與風場資料相差約 '+delta+' 分鐘';
      }
    }else{
      text+=' · 來源未提供可驗證影像時間';
    }
    updateStatus(kind,text,{layer:state.label,provider:state.provider,time:explicitTime,timeKnown:!!explicitTime,gridTime:latestGridTime});
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
      updateStatus('recovering','氣象影像層正在恢復 · '+reason,{layer:state.label,provider:state.provider||providerLabel(layer),time:state.dataTime,timeKnown:state.timeKnown,gridTime:latestGridTime});
    }catch(_){ }
  }
  function bindLayer(layer){
    if(registry.has(layer)||!isOverlay(layer))return;
    const explicitTime=parseOverlayTime(layer);
    const state={errors:[],lastLoad:now(),dataTime:explicitTime,timeKnown:!!explicitTime,tries:0,nextTry:0,label:layerLabel(layer)||'overlay',provider:providerLabel(layer)};
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
      if(t-state.lastLoad>STALE_MS) recover(layer,state,'影像超過 8 分鐘未成功刷新');
      else if(state.timeKnown&&latestGridTime&&Math.abs(state.dataTime-latestGridTime)>MAX_TIME_SKEW){
        updateStatus('time-skew','氣象圖層時間不同步 · '+state.provider+' · '+formatTime(state.dataTime),{layer:state.label,provider:state.provider,time:state.dataTime,timeKnown:true,gridTime:latestGridTime});
      }
    });
  }
  function wake(reason){
    scanLayers();
    setTimeout(()=>{
      if(!map||typeof map.eachLayer!=='function')return;
      map.eachLayer(layer=>{ const state=registry.get(layer); if(state) recover(layer,state,reason); });
    },180);
  }
  function bindGridTime(){
    if(!root||root.__tpOverlayGridTimeBound)return;
    root.__tpOverlayGridTimeBound=true;
    root.addEventListener('typhoon-shared-weather-update',e=>{
      const t=gridTimeFromDetail(e.detail);
      if(t)latestGridTime=t;
      healthCheck();
    });
    const existing=root.__tpSharedWeatherGrid;
    if(existing){
      const t=gridTimeFromDetail({grid:existing});
      if(t)latestGridTime=t;
    }
  }
  function attach(){
    scanLayers();
    bindGridTime();
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
  const observer=new MutationObserver(()=>{ if(!root||!document.contains(root))attach(); else {scanLayers();bindGridTime();} });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  attach();
  window.__typhoonOverlayHealth={version:VERSION,refresh:()=>wake('手動刷新'),check:healthCheck,getGridTime:()=>latestGridTime};
})();