export const layers=[
  {id:'radar',label:'雷達',unit:''},{id:'cloud',label:'衛星',unit:''},{id:'rain',label:'降水',unit:'mm'},{id:'wind',label:'風',unit:'km/h'},{id:'gust',label:'陣風',unit:'km/h'},{id:'temp',label:'溫度',unit:'°C'},{id:'humidity',label:'濕度',unit:'%'},{id:'pressure',label:'氣壓',unit:'hPa'}
];
export const TIMELINE_HOURS=[0,3,6,12,24,48];
export const VISUAL_OVERLAY_LAYERS=new Set(['temp','rain','humidity','pressure']);
export const WIND_FIELD_LAYERS=new Set(['wind','gust']);
export const IMAGERY_LAYERS=new Set(['radar','cloud']);
export const DEFAULT_CENTER={name:'深圳',lat:22.5431,lon:114.0579};
const GRID_FIELDS='temperature_2m,precipitation,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_gusts_10m,wind_direction_10m',GRID_CACHE=new Map(),POINT_CACHE=new Map(),GRID_TTL=300000,POINT_TTL=120000,STALE_TTL=1800000,GRID_MAX=12,POINT_MAX=16,GRID_BATCH=48,GRID_CONCURRENCY=2;
export function layerById(id){return layers.find(x=>x.id===id)||layers[0]}
export function supportsVisualOverlay(id){return VISUAL_OVERLAY_LAYERS.has(id)}
export function supportsWindField(id){return WIND_FIELD_LAYERS.has(id)}
export function supportsImageryLayer(id){return IMAGERY_LAYERS.has(id)}
export function timelineLabel(h){return h===0?'現在':h<24?`+${h}h`:`+${Math.round(h/24)}d`}
function targetMs(offsetHours=0){return Date.now()+Math.max(0,Number(offsetHours)||0)*3600000}
function nearestIndex(times=[],offsetHours=0){const target=targetMs(offsetHours);let best=0,delta=Infinity;times.forEach((t,i)=>{const d=Math.abs(new Date(t).getTime()-target);if(d<delta){delta=d;best=i}});return best}
function hourlyValue(row,key,offsetHours=0){const h=row?.hourly||{},times=h.time||[],i=nearestIndex(times,offsetHours);return{value:h[key]?.[i],time:times[i]||''}}
function abortError(){try{return new DOMException('Aborted','AbortError')}catch{const e=new Error('Aborted');e.name='AbortError';return e}}
function withSignal(promise,signal){if(!signal)return promise;if(signal.aborted)return Promise.reject(abortError());return new Promise((resolve,reject)=>{const onAbort=()=>reject(abortError());signal.addEventListener('abort',onAbort,{once:true});promise.then(v=>{signal.removeEventListener('abort',onAbort);resolve(v)},e=>{signal.removeEventListener('abort',onAbort);reject(e)})})}
const sleep=(ms,signal)=>new Promise((resolve,reject)=>{if(signal?.aborted)return reject(abortError());const id=setTimeout(done,ms);function done(){signal?.removeEventListener('abort',cancel);resolve()}function cancel(){clearTimeout(id);reject(abortError())}signal?.addEventListener('abort',cancel,{once:true})});
function trimCache(map,max){while(map.size>max)map.delete(map.keys().next().value)}
export function initialGlobalWeather(){return{place:DEFAULT_CENTER.name,updatedAt:new Date().toISOString(),activeLayer:'temp',summary:{wind:'—',gust:'—',rain:'—',temp:'—',humidity:'—',pressure:'—'},alerts:[]}}
export async function fetchPointWeather(lat,lon,{signal,offsetHours=0}={}){
  const key=`${Math.round(Number(lat)*10)/10}|${Math.round(Number(lon)*10)/10}|${Number(offsetHours)||0}`,now=Date.now(),cached=POINT_CACHE.get(key);
  if(cached&&now-cached.at<POINT_TTL)return cached.data;
  const hourly='temperature_2m,precipitation,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_gusts_10m,weather_code',q=new URLSearchParams({latitude:String(lat),longitude:String(lon),hourly,wind_speed_unit:'kmh',timezone:'auto',forecast_days:'3'});
  let last;
  for(let attempt=0;attempt<3;attempt++){
    if(signal?.aborted)throw abortError();
    try{
      const r=await fetch(`https://api.open-meteo.com/v1/forecast?${q}`,{signal,cache:'default'});
      if(r.ok){const j=await r.json(),h=j.hourly||{},i=nearestIndex(h.time||[],offsetHours),pick=k=>h[k]?.[i],data={lat:Number(j.latitude??lat),lon:Number(j.longitude??lon),updatedAt:h.time?.[i]||new Date().toISOString(),source:'Open-Meteo',forecastOffset:Number(offsetHours)||0,summary:{wind:round(pick('wind_speed_10m')),gust:round(pick('wind_gusts_10m')),rain:round(pick('precipitation'),1),temp:round(pick('temperature_2m'),1),humidity:round(pick('relative_humidity_2m')),pressure:round(pick('pressure_msl'))},code:Number(pick('weather_code')||0),stale:false};POINT_CACHE.set(key,{at:Date.now(),data});trimCache(POINT_CACHE,POINT_MAX);return data}
      last=new Error(`weather ${r.status}`);if(![429,500,502,503,504].includes(r.status))throw last;
    }catch(e){if(e?.name==='AbortError')throw e;last=e}
    if(attempt<2)await sleep(260*Math.pow(2,attempt)+Math.random()*160,signal);
  }
  if(cached?.data&&now-cached.at<STALE_TTL)return{...cached.data,source:'Open-Meteo cache',stale:true,dataAgeMs:now-cached.at};
  throw last||new Error('weather unavailable');
}
function wrapLon(v){return((Number(v)+540)%360)-180}
function gridDensity({zoom=4,lonSpan=20,latSpan=12,quality='full'}={}){if(quality==='preview')return{nx:8,ny:6};const z=Number(zoom)||4,area=Math.max(1,Number(lonSpan)*Number(latSpan));if(z>=7||area<90)return{nx:20,ny:16};if(z>=5||area<600)return{nx:18,ny:14};return{nx:16,ny:12}}
function gridSpec({lat,lon,zoom=4,bounds,quality='full'}={}){let lonSpan=Math.max(2.2,Math.min(90,(360/Math.pow(2,Math.max(1.6,Number(zoom)||4)))*1.45)),latSpan=Math.max(1.6,Math.min(50,lonSpan*.62));if(bounds&&[bounds.west,bounds.east,bounds.south,bounds.north].every(Number.isFinite)){let rawLon=Math.abs(Number(bounds.east)-Number(bounds.west));if(rawLon>180)rawLon=360-rawLon;const rawLat=Math.abs(Number(bounds.north)-Number(bounds.south));if(rawLon>.2)lonSpan=Math.max(2.2,Math.min(120,rawLon*1.34));if(rawLat>.2)latSpan=Math.max(1.6,Math.min(70,rawLat*1.34))}const{nx,ny}=gridDensity({zoom,lonSpan,latSpan,quality}),cLat=Number(lat),cLon=Number(lon),points=[];for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const px=cLon-lonSpan/2+lonSpan*(x/(nx-1)),py=Math.max(-84,Math.min(84,cLat-latSpan/2+latSpan*(y/(ny-1))));points.push({lat:Number(py.toFixed(4)),lon:Number(wrapLon(px).toFixed(4))})}return{nx,ny,points,lonSpan,latSpan,quality,coverage:{west:wrapLon(cLon-lonSpan/2),east:wrapLon(cLon+lonSpan/2),south:Math.max(-84,cLat-latSpan/2),north:Math.min(84,cLat+latSpan/2)}}}
function gridKey({lat,lon,zoom=4,bounds,quality='full'}={}){const s=gridSpec({lat,lon,zoom,bounds,quality});return`${quality}|${Math.round(Number(zoom)||4)}|${Math.round(Number(lat)*2)/2}|${Math.round(Number(lon)*2)/2}|${s.nx}x${s.ny}|${Math.round(s.lonSpan)}x${Math.round(s.latSpan)}`}
function chunks(items,size){const out=[];for(let i=0;i<items.length;i+=size)out.push(items.slice(i,i+size));return out}
async function fetchGridBatch(points,signal,allowSplit=true){
  const q=new URLSearchParams({latitude:points.map(p=>p.lat).join(','),longitude:points.map(p=>p.lon).join(','),hourly:GRID_FIELDS,wind_speed_unit:'kmh',timezone:'GMT',forecast_days:'3'});let last;
  for(let attempt=0;attempt<3;attempt++){
    if(signal?.aborted)throw abortError();
    try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?${q}`,{cache:'default',signal});if(r.ok){const raw=await r.json(),rows=Array.isArray(raw)?raw:[raw];if(rows.length!==points.length)throw new Error('incomplete weather grid batch');return rows}last=new Error(`weather grid ${r.status}`);if(![408,413,414,429,500,502,503,504].includes(r.status))throw last}catch(e){if(e?.name==='AbortError')throw e;last=e}
    if(attempt<2)await sleep(320*Math.pow(2,attempt)+Math.random()*180,signal);
  }
  if(allowSplit&&points.length>12){const mid=Math.ceil(points.length/2),left=await fetchGridBatch(points.slice(0,mid),signal,true),right=await fetchGridBatch(points.slice(mid),signal,true);return left.concat(right)}
  throw last||new Error('weather grid unavailable');
}
async function fetchBatchesLimited(batches,signal){const parts=new Array(batches.length);let cursor=0;async function worker(){while(true){const i=cursor++;if(i>=batches.length)return;parts[i]=await fetchGridBatch(batches[i],signal)}}await Promise.all(Array.from({length:Math.min(GRID_CONCURRENCY,batches.length)},worker));return parts}
async function loadGridBundle({lat,lon,zoom=4,bounds,quality='full',signal}={}){
  const spec=gridSpec({lat,lon,zoom,bounds,quality}),key=gridKey({lat,lon,zoom,bounds,quality}),now=Date.now(),cached=GRID_CACHE.get(key),staleData=cached?.data;
  if(staleData&&now-cached.at<GRID_TTL)return staleData;
  if(cached?.promise)return withSignal(cached.promise,signal);
  const batches=chunks(spec.points,GRID_BATCH);
  const promise=fetchBatchesLimited(batches,signal).then(parts=>{const rows=parts.flat();if(rows.length!==spec.points.length)throw new Error('incomplete weather grid');const data={key,at:Date.now(),rows,points:spec.points,nx:spec.nx,ny:spec.ny,quality,coverage:spec.coverage,batches:batches.length,stale:false};GRID_CACHE.set(key,{at:data.at,data});trimCache(GRID_CACHE,GRID_MAX);return data}).catch(e=>{if(e?.name==='AbortError')throw e;if(staleData&&now-cached.at<STALE_TTL){const data={...staleData,stale:true,dataAgeMs:now-cached.at};GRID_CACHE.set(key,{at:cached.at,data:staleData});return data}if(GRID_CACHE.get(key)?.promise===promise)GRID_CACHE.delete(key);throw e});
  GRID_CACHE.set(key,{at:cached?.at||now,data:staleData,promise});
  return withSignal(promise,signal);
}
export async function fetchWeatherGrid({lat,lon,zoom=4,bounds,layer='temp',quality='full',signal,offsetHours=0}={}){if(!supportsVisualOverlay(layer))return null;const variable={temp:'temperature_2m',rain:'precipitation',humidity:'relative_humidity_2m',pressure:'pressure_msl'}[layer],bundle=await loadGridBundle({lat,lon,zoom,bounds,quality,signal}),featureRows=bundle.rows.map((row,i)=>{const p=bundle.points[i],hv=hourlyValue(row,variable,offsetHours),value=Number(hv.value);if(!Number.isFinite(value))return null;return{type:'Feature',geometry:{type:'Point',coordinates:[p.lon,p.lat]},properties:{value,layer,label:formatOverlayValue(layer,value),updatedAt:hv.time}}}).filter(Boolean);return{layer,source:bundle.stale?'Open-Meteo cache':'Open-Meteo',quality,stale:Boolean(bundle.stale),dataAgeMs:bundle.dataAgeMs||0,updatedAt:featureRows.find(f=>f.properties.updatedAt)?.properties.updatedAt||new Date().toISOString(),forecastOffset:Number(offsetHours)||0,grid:{nx:bundle.nx,ny:bundle.ny},coverage:bundle.coverage,geojson:{type:'FeatureCollection',features:featureRows},sampleCount:featureRows.length,batchCount:bundle.batches,cached:true}}
function windFieldFromBundle(bundle,layer,offsetHours){const speedKey=layer==='gust'?'wind_gusts_10m':'wind_speed_10m',features=bundle.rows.map((row,i)=>{const p=bundle.points[i],s=hourlyValue(row,speedKey,offsetHours),d=hourlyValue(row,'wind_direction_10m',offsetHours),speed=Number(s.value),direction=Number(d.value);if(!Number.isFinite(speed)||!Number.isFinite(direction))return null;return{type:'Feature',geometry:{type:'Point',coordinates:[p.lon,p.lat]},properties:{speed,direction,layer,label:`${Math.round(speed)} km/h`,updatedAt:s.time||d.time||''}}}).filter(Boolean);return{layer,source:bundle.stale?'Open-Meteo cache':'Open-Meteo',quality:bundle.quality,stale:Boolean(bundle.stale),dataAgeMs:bundle.dataAgeMs||0,updatedAt:features.find(f=>f.properties.updatedAt)?.properties.updatedAt||new Date().toISOString(),forecastOffset:Number(offsetHours)||0,grid:{nx:bundle.nx,ny:bundle.ny},coverage:bundle.coverage,geojson:{type:'FeatureCollection',features},sampleCount:features.length,batchCount:bundle.batches,cached:true}}
export async function fetchWindField({lat,lon,zoom=4,bounds,layer='wind',quality='preview',signal,offsetHours=0,prewarmFull=true}={}){if(!supportsWindField(layer))return null;const request={lat,lon,zoom,bounds,quality,signal},bundle=await loadGridBundle(request);if(quality==='preview'&&prewarmFull&&!signal?.aborted)loadGridBundle({lat,lon,zoom,bounds,quality:'full'}).catch(()=>{});return windFieldFromBundle(bundle,layer,offsetHours)}
export function formatOverlayValue(layer,value){const n=Number(value);if(!Number.isFinite(n))return'—';if(layer==='temp')return`${n.toFixed(0)}°`;if(layer==='rain')return`${n.toFixed(n<1?1:0)} mm`;if(layer==='humidity')return`${n.toFixed(0)}%`;if(layer==='pressure')return`${n.toFixed(0)} hPa`;return String(n)}
function round(v,d=0){const n=Number(v);return Number.isFinite(n)?Number(n.toFixed(d)):'—'}
