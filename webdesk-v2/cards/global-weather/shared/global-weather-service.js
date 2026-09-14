export const layers=[
  {id:'radar',label:'雷達',unit:''},
  {id:'cloud',label:'衛星',unit:''},
  {id:'rain',label:'降水',unit:'mm'},
  {id:'wind',label:'風',unit:'km/h'},
  {id:'gust',label:'陣風',unit:'km/h'},
  {id:'temp',label:'溫度',unit:'°C'},
  {id:'humidity',label:'濕度',unit:'%'},
  {id:'pressure',label:'氣壓',unit:'hPa'}
];
export const TIMELINE_HOURS=[0,3,6,12,24,48];
export const VISUAL_OVERLAY_LAYERS=new Set(['temp','rain','humidity','pressure']);
export const WIND_FIELD_LAYERS=new Set(['wind','gust']);
export const IMAGERY_LAYERS=new Set(['radar','cloud']);
export const DEFAULT_CENTER={name:'深圳',lat:22.5431,lon:114.0579};
const GRID_FIELDS='temperature_2m,precipitation,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_gusts_10m,wind_direction_10m';
const GRID_CACHE=new Map();
const GRID_TTL=300000;
const GRID_MAX=8;
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
export function initialGlobalWeather(){return{place:DEFAULT_CENTER.name,updatedAt:new Date().toISOString(),activeLayer:'temp',summary:{wind:'—',gust:'—',rain:'—',temp:'—',humidity:'—',pressure:'—'},alerts:[]}}
export async function fetchPointWeather(lat,lon,{signal,offsetHours=0}={}){
  const hourly='temperature_2m,precipitation,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_gusts_10m,weather_code';
  const q=new URLSearchParams({latitude:String(lat),longitude:String(lon),hourly,wind_speed_unit:'kmh',timezone:'auto',forecast_days:'3'});
  const r=await fetch(`https://api.open-meteo.com/v1/forecast?${q}`,{signal});if(!r.ok)throw new Error(`weather ${r.status}`);
  const j=await r.json(),h=j.hourly||{},i=nearestIndex(h.time||[],offsetHours),pick=k=>h[k]?.[i];
  return{lat:Number(j.latitude??lat),lon:Number(j.longitude??lon),updatedAt:h.time?.[i]||new Date().toISOString(),source:'Open-Meteo',forecastOffset:Number(offsetHours)||0,summary:{wind:round(pick('wind_speed_10m')),gust:round(pick('wind_gusts_10m')),rain:round(pick('precipitation'),1),temp:round(pick('temperature_2m'),1),humidity:round(pick('relative_humidity_2m')),pressure:round(pick('pressure_msl'))},code:Number(pick('weather_code')||0)};
}
function gridSpec({lat,lon,zoom=4}={}){const nx=7,ny=5,lonSpan=Math.max(2.2,Math.min(90,(360/Math.pow(2,Math.max(1.6,Number(zoom)||4)))*1.45)),latSpan=Math.max(1.6,Math.min(50,lonSpan*.62)),points=[];for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const px=Number(lon)-lonSpan/2+lonSpan*(x/(nx-1)),py=Math.max(-84,Math.min(84,Number(lat)-latSpan/2+latSpan*(y/(ny-1))));points.push({lat:Number(py.toFixed(4)),lon:Number((((px+540)%360)-180).toFixed(4))})}return{nx,ny,points}}
function gridKey({lat,lon,zoom=4}={}){return`${Math.round(Number(zoom)||4)}|${Math.round(Number(lat)*2)/2}|${Math.round(Number(lon)*2)/2}`}
async function loadGridBundle({lat,lon,zoom=4,signal}={}){
  const key=gridKey({lat,lon,zoom}),now=Date.now(),cached=GRID_CACHE.get(key);
  if(cached&&cached.data&&now-cached.at<GRID_TTL)return cached.data;
  if(cached?.promise)return withSignal(cached.promise,signal);
  const spec=gridSpec({lat,lon,zoom});
  const q=new URLSearchParams({latitude:spec.points.map(p=>p.lat).join(','),longitude:spec.points.map(p=>p.lon).join(','),hourly:GRID_FIELDS,wind_speed_unit:'kmh',timezone:'GMT',forecast_days:'3'});
  const promise=fetch(`https://api.open-meteo.com/v1/forecast?${q}`,{cache:'default'}).then(r=>{if(!r.ok)throw new Error(`weather grid ${r.status}`);return r.json()}).then(raw=>{const rows=Array.isArray(raw)?raw:[raw];if(rows.length!==spec.points.length)throw new Error('incomplete weather grid');const data={key,at:Date.now(),rows,points:spec.points,nx:spec.nx,ny:spec.ny};GRID_CACHE.set(key,{at:data.at,data});while(GRID_CACHE.size>GRID_MAX)GRID_CACHE.delete(GRID_CACHE.keys().next().value);return data}).catch(e=>{if(GRID_CACHE.get(key)?.promise===promise)GRID_CACHE.delete(key);throw e});
  GRID_CACHE.set(key,{at:now,promise});
  return withSignal(promise,signal);
}
export async function fetchWeatherGrid({lat,lon,zoom=4,layer='temp',signal,offsetHours=0}={}){
  if(!supportsVisualOverlay(layer))return null;const variable={temp:'temperature_2m',rain:'precipitation',humidity:'relative_humidity_2m',pressure:'pressure_msl'}[layer],bundle=await loadGridBundle({lat,lon,zoom,signal});
  const featureRows=bundle.rows.map((row,i)=>{const p=bundle.points[i],hv=hourlyValue(row,variable,offsetHours),value=Number(hv.value);if(!Number.isFinite(value))return null;return{type:'Feature',geometry:{type:'Point',coordinates:[p.lon,p.lat]},properties:{value,layer,label:formatOverlayValue(layer,value),updatedAt:hv.time}}}).filter(Boolean);
  return{layer,source:'Open-Meteo',updatedAt:featureRows.find(f=>f.properties.updatedAt)?.properties.updatedAt||new Date().toISOString(),forecastOffset:Number(offsetHours)||0,grid:{nx:bundle.nx,ny:bundle.ny},geojson:{type:'FeatureCollection',features:featureRows},sampleCount:featureRows.length,cached:true};
}
export async function fetchWindField({lat,lon,zoom=4,layer='wind',signal,offsetHours=0}={}){
  if(!supportsWindField(layer))return null;const bundle=await loadGridBundle({lat,lon,zoom,signal}),speedKey=layer==='gust'?'wind_gusts_10m':'wind_speed_10m';
  const features=bundle.rows.map((row,i)=>{const p=bundle.points[i],s=hourlyValue(row,speedKey,offsetHours),d=hourlyValue(row,'wind_direction_10m',offsetHours),speed=Number(s.value),direction=Number(d.value);if(!Number.isFinite(speed)||!Number.isFinite(direction))return null;return{type:'Feature',geometry:{type:'Point',coordinates:[p.lon,p.lat]},properties:{speed,direction,layer,label:`${Math.round(speed)} km/h`,updatedAt:s.time||d.time||''}}}).filter(Boolean);
  return{layer,source:'Open-Meteo',updatedAt:features.find(f=>f.properties.updatedAt)?.properties.updatedAt||new Date().toISOString(),forecastOffset:Number(offsetHours)||0,grid:{nx:bundle.nx,ny:bundle.ny},geojson:{type:'FeatureCollection',features},sampleCount:features.length,cached:true};
}
export function formatOverlayValue(layer,value){const n=Number(value);if(!Number.isFinite(n))return'—';if(layer==='temp')return`${n.toFixed(0)}°`;if(layer==='rain')return`${n.toFixed(n<1?1:0)} mm`;if(layer==='humidity')return`${n.toFixed(0)}%`;if(layer==='pressure')return`${n.toFixed(0)} hPa`;return String(n)}
function round(v,d=0){const n=Number(v);return Number.isFinite(n)?Number(n.toFixed(d)):'—'}
