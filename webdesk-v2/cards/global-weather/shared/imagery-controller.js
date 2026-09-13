const SOURCE_ID='gw-remote-imagery';
const LAYER_ID='gw-remote-imagery-layer';
const RAINVIEWER_META='https://api.rainviewer.com/public/weather-maps.json';
const NASA_LAYER='VIIRS_SNPP_CorrectedReflectance_TrueColor_v1_NRT';
const NASA_ROOT='https://gibs.earthdata.nasa.gov/wmts/epsg3857/nrt';

export const imageryModes=[
  {id:'off',label:'無疊圖'},
  {id:'radar',label:'雷達'},
  {id:'satellite',label:'衛星雲圖'}
];

function isoDay(daysAgo=0){
  const d=new Date(Date.now()-daysAgo*86400000);
  return d.toISOString().slice(0,10);
}
function emit(cb,payload){try{cb?.(payload)}catch{}}
function rainviewerDescriptor(meta){
  const frames=meta?.radar?.past||[];
  const frame=frames[frames.length-1];
  if(!meta?.host||!frame?.path)throw new Error('RainViewer radar frame unavailable');
  return{
    mode:'radar',source:'RainViewer',updatedAt:new Date(Number(frame.time)*1000).toISOString(),
    tiles:[`${meta.host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`],tileSize:256,maxzoom:7,opacity:.72,
    attribution:'Weather radar © <a href="https://www.rainviewer.com/" target="_blank" rel="noopener">RainViewer</a>'
  };
}
function satelliteDescriptor(daysAgo){
  const date=isoDay(daysAgo);
  return{
    mode:'satellite',source:'NASA GIBS · VIIRS SNPP NRT',updatedAt:date,date,daysAgo,
    tiles:[`${NASA_ROOT}/${NASA_LAYER}/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`],tileSize:256,maxzoom:9,opacity:.82,
    attribution:'Satellite imagery © <a href="https://earthdata.nasa.gov/gibs" target="_blank" rel="noopener">NASA GIBS</a>'
  };
}

export function createImageryController(mapApi,{signal,onChange}={}){
  const map=mapApi?.map||null;
  let active='off',descriptor=null,destroyed=false,requestSeq=0,satelliteFallbacks=[2,3,4],satelliteIndex=0,errorTimer=0;
  const clearRaster=()=>{
    if(!map)return;
    try{if(map.getLayer(LAYER_ID))map.removeLayer(LAYER_ID)}catch{}
    try{if(map.getSource(SOURCE_ID))map.removeSource(SOURCE_ID)}catch{}
  };
  const apply=desc=>{
    descriptor=desc;
    if(!map||destroyed||!map.isStyleLoaded?.())return false;
    clearRaster();
    try{
      map.addSource(SOURCE_ID,{type:'raster',tiles:desc.tiles,tileSize:desc.tileSize||256,maxzoom:desc.maxzoom||9,attribution:desc.attribution});
      map.addLayer({id:LAYER_ID,type:'raster',source:SOURCE_ID,paint:{'raster-opacity':desc.opacity??.78,'raster-fade-duration':120}});
      emit(onChange,{state:'ready',...desc});
      return true;
    }catch(e){
      emit(onChange,{state:'error',mode:active,source:desc.source,updatedAt:desc.updatedAt,error:String(e?.message||e)});
      return false;
    }
  };
  const loadRadar=async seq=>{
    emit(onChange,{state:'loading',mode:'radar',source:'RainViewer'});
    const r=await fetch(RAINVIEWER_META,{signal,cache:'no-store'});
    if(!r.ok)throw new Error(`RainViewer ${r.status}`);
    const desc=rainviewerDescriptor(await r.json());
    if(destroyed||seq!==requestSeq||active!=='radar')return false;
    return apply(desc);
  };
  const loadSatellite=seq=>{
    satelliteIndex=0;
    const desc=satelliteDescriptor(satelliteFallbacks[satelliteIndex]);
    emit(onChange,{state:'loading',mode:'satellite',source:desc.source,updatedAt:desc.updatedAt});
    if(destroyed||seq!==requestSeq||active!=='satellite')return false;
    return apply(desc);
  };
  const set=async mode=>{
    active=imageryModes.some(x=>x.id===mode)?mode:'off';
    requestSeq++;
    const seq=requestSeq;
    clearTimeout(errorTimer);
    if(active==='off'){
      descriptor=null;clearRaster();emit(onChange,{state:'off',mode:'off',source:'',updatedAt:''});return true;
    }
    if(!map){emit(onChange,{state:'unavailable',mode:active,source:'地圖備援模式',updatedAt:'',error:'MapLibre raster overlay unavailable'});return false}
    try{return active==='radar'?await loadRadar(seq):loadSatellite(seq)}catch(e){
      if(!destroyed&&seq===requestSeq)emit(onChange,{state:'error',mode:active,source:active==='radar'?'RainViewer':'NASA GIBS',updatedAt:'',error:String(e?.message||e)});
      return false;
    }
  };
  const onStyleLoad=()=>{if(descriptor&&active!=='off')setTimeout(()=>apply(descriptor),0)};
  const onMapError=e=>{
    if(destroyed||active==='off'||!descriptor)return;
    const sourceId=e?.sourceId||e?.error?.sourceId||'';
    const message=String(e?.error?.message||e?.message||'');
    if(sourceId&&sourceId!==SOURCE_ID)return;
    if(!sourceId&&!message.includes(SOURCE_ID)&&!message.includes('raster')&&!message.includes('tile'))return;
    if(active==='satellite'&&satelliteIndex<satelliteFallbacks.length-1){
      clearTimeout(errorTimer);
      errorTimer=setTimeout(()=>{
        if(destroyed||active!=='satellite')return;
        satelliteIndex++;
        const next=satelliteDescriptor(satelliteFallbacks[satelliteIndex]);
        emit(onChange,{state:'fallback',mode:'satellite',source:next.source,updatedAt:next.updatedAt,error:'較新影像載入失敗，改用較早日期'});
        apply(next);
      },280);
    }else{
      emit(onChange,{state:'error',mode:active,source:descriptor.source,updatedAt:descriptor.updatedAt,error:'影像 tile 載入失敗'});
    }
  };
  map?.on?.('style.load',onStyleLoad);
  map?.on?.('error',onMapError);
  return{
    set,get mode(){return active},get meta(){return descriptor},
    destroy(){destroyed=true;requestSeq++;clearTimeout(errorTimer);clearRaster();map?.off?.('style.load',onStyleLoad);map?.off?.('error',onMapError)}
  };
}
