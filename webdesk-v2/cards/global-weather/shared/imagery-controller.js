const SOURCE_ID='gw-remote-imagery';
const LAYER_ID='gw-remote-imagery-layer';
const SAT_BACKDROP_SOURCE='gw-satellite-backdrop';
const SAT_BACKDROP_LAYER='gw-satellite-backdrop-layer';
const RAINVIEWER_META='https://api.rainviewer.com/public/weather-maps.json';
const JMA_TIMES='https://www.jma.go.jp/bosai/himawari/data/satimg/targetTimes_fd.json';
const EOX_SAT='https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2025_3857/default/g/{z}/{y}/{x}.jpg';

export const imageryModes=[
  {id:'off',label:'無疊圖'},
  {id:'radar',label:'雷達'},
  {id:'satellite',label:'衛星雲圖'}
];
function emit(cb,payload){try{cb?.(payload)}catch{}}
function jmaIso(v){if(!/^\d{14}$/.test(String(v||'')))return'';const s=String(v);return new Date(Date.UTC(+s.slice(0,4),+s.slice(4,6)-1,+s.slice(6,8),+s.slice(8,10),+s.slice(10,12),+s.slice(12,14))).toISOString()}
function radarFrames(meta){
  if(!meta?.host)throw new Error('RainViewer host unavailable');
  const past=(meta?.radar?.past||[]).filter(f=>f?.path&&f?.time).map(f=>({...f,forecast:false}));
  const nowcast=(meta?.radar?.nowcast||[]).filter(f=>f?.path&&f?.time).map(f=>({...f,forecast:true}));
  const byTime=new Map();
  [...past,...nowcast].forEach(f=>byTime.set(Number(f.time),f));
  const list=[...byTime.values()].sort((a,b)=>Number(a.time)-Number(b.time));
  if(!list.length)throw new Error('RainViewer radar frames unavailable');
  return list.map((f,i)=>({index:i,mode:'radar',source:f.forecast?'RainViewer Nowcast':'RainViewer Radar',updatedAt:new Date(Number(f.time)*1000).toISOString(),forecast:Boolean(f.forecast),tiles:[`${meta.host}${f.path}/256/{z}/{x}/{y}/2/1_1.png`],tileSize:256,maxzoom:7,opacity:.72,attribution:'Weather radar © <a href="https://www.rainviewer.com/" target="_blank" rel="noopener">RainViewer</a>'}));
}
function himawariFrames(raw){const list=(Array.isArray(raw)?raw:[]).slice(-18).filter(f=>f?.basetime&&f?.validtime);if(!list.length)throw new Error('JMA Himawari frames unavailable');return list.map((f,i)=>({index:i,mode:'satellite',source:'JMA Himawari',updatedAt:jmaIso(f.validtime),forecast:false,tiles:[`https://www.jma.go.jp/bosai/himawari/data/satimg/${f.basetime}/fd/${f.validtime}/REP/ETC/{z}/{x}/{y}.jpg`],tileSize:256,maxzoom:5,opacity:.67,attribution:'Himawari © Japan Meteorological Agency'}))}
function firstLabelLayer(map){return(map?.getStyle?.()?.layers||[]).find(l=>l.type==='symbol')?.id}

export function createImageryController(mapApi,{signal,onChange}={}){
  const map=mapApi?.map||null;
  let active='off',descriptor=null,frames=[],index=0,destroyed=false,requestSeq=0,timer=0,playing=false;
  const clearPrimary=()=>{if(!map)return;try{if(map.getLayer(LAYER_ID))map.removeLayer(LAYER_ID)}catch{}try{if(map.getSource(SOURCE_ID))map.removeSource(SOURCE_ID)}catch{}};
  const clearBackdrop=()=>{if(!map)return;try{if(map.getLayer(SAT_BACKDROP_LAYER))map.removeLayer(SAT_BACKDROP_LAYER)}catch{}try{if(map.getSource(SAT_BACKDROP_SOURCE))map.removeSource(SAT_BACKDROP_SOURCE)}catch{}};
  const clearRaster=()=>{clearPrimary();clearBackdrop()};
  const snapshot=(state='ready',extra={})=>({state,mode:active,source:descriptor?.source||'',updatedAt:descriptor?.updatedAt||'',forecast:Boolean(descriptor?.forecast),frameCount:frames.length,index,playing,...extra});
  const ensureSatelliteBackdrop=()=>{if(!map||destroyed||!map.isStyleLoaded?.())return false;try{if(!map.getSource(SAT_BACKDROP_SOURCE))map.addSource(SAT_BACKDROP_SOURCE,{type:'raster',tiles:[EOX_SAT],tileSize:256,maxzoom:14,attribution:'Sentinel-2 cloudless 2025 © EOX'});if(!map.getLayer(SAT_BACKDROP_LAYER)){const before=firstLabelLayer(map);map.addLayer({id:SAT_BACKDROP_LAYER,type:'raster',source:SAT_BACKDROP_SOURCE,paint:{'raster-opacity':.92,'raster-fade-duration':120,'raster-resampling':'linear'}},before)}return true}catch(e){console.warn('[Global Weather satellite backdrop]',e);return false}};
  const apply=desc=>{descriptor=desc;if(!map||destroyed||!map.isStyleLoaded?.())return false;clearPrimary();if(active==='satellite')ensureSatelliteBackdrop();else clearBackdrop();try{map.addSource(SOURCE_ID,{type:'raster',tiles:desc.tiles,tileSize:desc.tileSize||256,maxzoom:desc.maxzoom||9,attribution:desc.attribution});const before=firstLabelLayer(map);map.addLayer({id:LAYER_ID,type:'raster',source:SOURCE_ID,paint:{'raster-opacity':desc.opacity??.74,'raster-fade-duration':160,'raster-resampling':'linear'}},before);emit(onChange,snapshot('ready',{backdrop:active==='satellite'?'EOX Sentinel-2':''}));return true}catch(e){emit(onChange,snapshot('error',{error:String(e?.message||e)}));return false}};
  const showFrame=i=>{if(!frames.length)return false;index=Math.max(0,Math.min(frames.length-1,Number(i)||0));return apply(frames[index])};
  const stop=()=>{playing=false;if(timer){clearInterval(timer);timer=0}if(active!=='off')emit(onChange,snapshot(descriptor?'ready':'loading'))};
  const play=()=>{if(!frames.length||active==='off')return false;if(playing){stop();return false}playing=true;emit(onChange,snapshot('ready'));timer=setInterval(()=>{if(destroyed||document.hidden){stop();return}showFrame((index+1)%frames.length)},active==='radar'?720:900);return true};
  const loadRadar=async seq=>{emit(onChange,{state:'loading',mode:'radar',source:'RainViewer',frameCount:0,index:0,playing:false});const r=await fetch(RAINVIEWER_META,{signal,cache:'no-store'});if(!r.ok)throw new Error(`RainViewer ${r.status}`);const next=radarFrames(await r.json());if(destroyed||seq!==requestSeq||active!=='radar')return false;frames=next;const lastObserved=frames.map((f,i)=>f.forecast?-1:i).reduce((a,b)=>Math.max(a,b),-1);index=lastObserved>=0?lastObserved:frames.length-1;return showFrame(index)};
  const loadSatellite=async seq=>{emit(onChange,{state:'loading',mode:'satellite',source:'JMA Himawari',frameCount:0,index:0,playing:false,backdrop:'EOX Sentinel-2'});if(map?.isStyleLoaded?.())ensureSatelliteBackdrop();const r=await fetch(JMA_TIMES,{signal,cache:'no-store'});if(!r.ok)throw new Error(`JMA Himawari ${r.status}`);const next=himawariFrames(await r.json());if(destroyed||seq!==requestSeq||active!=='satellite')return false;frames=next;index=frames.length-1;return showFrame(index)};
  const set=async mode=>{stop();active=imageryModes.some(x=>x.id===mode)?mode:'off';requestSeq++;const seq=requestSeq;if(active==='off'){frames=[];index=0;descriptor=null;clearRaster();emit(onChange,{state:'off',mode:'off',source:'',updatedAt:'',frameCount:0,index:0,playing:false});return true}if(!map){emit(onChange,{state:'unavailable',mode:active,source:'地圖備援模式',updatedAt:'',frameCount:0,index:0,playing:false,error:'MapLibre raster overlay unavailable'});return false}try{return active==='radar'?await loadRadar(seq):await loadSatellite(seq)}catch(e){if(!destroyed&&seq===requestSeq)emit(onChange,{state:'error',mode:active,source:active==='radar'?'RainViewer':'JMA Himawari',updatedAt:'',frameCount:0,index:0,playing:false,error:String(e?.message||e)});return false}};
  const onStyleLoad=()=>{if(active==='satellite')setTimeout(()=>ensureSatelliteBackdrop(),0);if(descriptor&&active!=='off')setTimeout(()=>apply(descriptor),0)};
  const onVisibility=()=>{if(document.hidden&&playing)stop()};
  map?.on?.('style.load',onStyleLoad);document.addEventListener('visibilitychange',onVisibility);
  return{set,setFrame(i){stop();return showFrame(i)},play,stop,get mode(){return active},get meta(){return snapshot(descriptor?'ready':'loading')},get frames(){return frames.map(f=>({index:f.index,updatedAt:f.updatedAt,source:f.source,forecast:Boolean(f.forecast)}))},destroy(){destroyed=true;requestSeq++;stop();clearRaster();map?.off?.('style.load',onStyleLoad);document.removeEventListener('visibilitychange',onVisibility)}};
}
