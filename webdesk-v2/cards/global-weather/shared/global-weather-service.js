export const layers=[
  {id:'wind',label:'風',unit:'km/h'},
  {id:'gust',label:'陣風',unit:'km/h'},
  {id:'rain',label:'降雨',unit:'mm'},
  {id:'temp',label:'溫度',unit:'°C'},
  {id:'pressure',label:'氣壓',unit:'hPa'}
];

export const VISUAL_OVERLAY_LAYERS=new Set(['temp','rain','pressure']);
export const WIND_FIELD_LAYERS=new Set(['wind','gust']);
export const DEFAULT_CENTER={name:'深圳',lat:22.5431,lon:114.0579};
export function layerById(id){return layers.find(x=>x.id===id)||layers[0]}
export function supportsVisualOverlay(id){return VISUAL_OVERLAY_LAYERS.has(id)}
export function supportsWindField(id){return WIND_FIELD_LAYERS.has(id)}

export function initialGlobalWeather(){
  return{
    place:DEFAULT_CENTER.name,
    updatedAt:new Date().toISOString(),
    activeLayer:'wind',
    summary:{wind:'—',gust:'—',rain:'—',temp:'—',pressure:'—'},
    alerts:[]
  };
}

export async function fetchPointWeather(lat,lon,{signal}={}){
  const q=new URLSearchParams({
    latitude:String(lat),longitude:String(lon),
    current:'temperature_2m,precipitation,pressure_msl,wind_speed_10m,wind_gusts_10m,weather_code',
    wind_speed_unit:'kmh',timezone:'auto'
  });
  const r=await fetch(`https://api.open-meteo.com/v1/forecast?${q}`,{signal});
  if(!r.ok)throw new Error(`weather ${r.status}`);
  const j=await r.json(),c=j.current||{};
  return{
    lat:Number(j.latitude??lat),lon:Number(j.longitude??lon),
    updatedAt:c.time||new Date().toISOString(),source:'Open-Meteo',
    summary:{
      wind:round(c.wind_speed_10m),gust:round(c.wind_gusts_10m),rain:round(c.precipitation,1),
      temp:round(c.temperature_2m,1),pressure:round(c.pressure_msl)
    },code:Number(c.weather_code||0)
  };
}

function gridPoints({lat,lon,zoom=4,size=5}={}){
  const n=Math.max(3,Math.min(9,Number(size)||5));
  const lonSpan=Math.max(2.2,Math.min(90,(360/Math.pow(2,Math.max(1.6,Number(zoom)||4)))*1.45));
  const latSpan=Math.max(1.6,Math.min(50,lonSpan*.62));
  const points=[];
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const px=Number(lon)-lonSpan/2+lonSpan*(x/(n-1));
    const py=Math.max(-84,Math.min(84,Number(lat)-latSpan/2+latSpan*(y/(n-1))));
    points.push({lat:Number(py.toFixed(4)),lon:Number((((px+540)%360)-180).toFixed(4))});
  }
  return points;
}

export async function fetchWeatherGrid({lat,lon,zoom=4,layer='temp',signal,size=5}={}){
  if(!supportsVisualOverlay(layer))return null;
  const points=gridPoints({lat,lon,zoom,size});
  const variable={temp:'temperature_2m',rain:'precipitation',pressure:'pressure_msl'}[layer];
  const q=new URLSearchParams({
    latitude:points.map(p=>p.lat).join(','),longitude:points.map(p=>p.lon).join(','),
    current:variable,timezone:'GMT'
  });
  const r=await fetch(`https://api.open-meteo.com/v1/forecast?${q}`,{signal});
  if(!r.ok)throw new Error(`weather grid ${r.status}`);
  const raw=await r.json(),rows=Array.isArray(raw)?raw:[raw];
  const featureRows=rows.map((row,i)=>{
    const p=points[i]||{lat:Number(row.latitude),lon:Number(row.longitude)};
    const current=row?.current||{};
    const value=Number(current[variable]);
    if(!Number.isFinite(value))return null;
    return{
      type:'Feature',geometry:{type:'Point',coordinates:[p.lon,p.lat]},
      properties:{value,layer,label:formatOverlayValue(layer,value),updatedAt:current.time||''}
    };
  }).filter(Boolean);
  const updatedAt=featureRows.find(f=>f.properties.updatedAt)?.properties.updatedAt||new Date().toISOString();
  return{
    layer,source:'Open-Meteo',updatedAt,
    geojson:{type:'FeatureCollection',features:featureRows},
    sampleCount:featureRows.length
  };
}

export async function fetchWindField({lat,lon,zoom=4,layer='wind',signal,size=7}={}){
  if(!supportsWindField(layer))return null;
  const points=gridPoints({lat,lon,zoom,size});
  const q=new URLSearchParams({
    latitude:points.map(p=>p.lat).join(','),longitude:points.map(p=>p.lon).join(','),
    current:'wind_speed_10m,wind_gusts_10m,wind_direction_10m',wind_speed_unit:'kmh',timezone:'GMT'
  });
  const r=await fetch(`https://api.open-meteo.com/v1/forecast?${q}`,{signal});
  if(!r.ok)throw new Error(`wind field ${r.status}`);
  const raw=await r.json(),rows=Array.isArray(raw)?raw:[raw];
  const features=rows.map((row,i)=>{
    const p=points[i]||{lat:Number(row.latitude),lon:Number(row.longitude)},c=row?.current||{};
    const speed=Number(layer==='gust'?c.wind_gusts_10m:c.wind_speed_10m),direction=Number(c.wind_direction_10m);
    if(!Number.isFinite(speed)||!Number.isFinite(direction))return null;
    return{type:'Feature',geometry:{type:'Point',coordinates:[p.lon,p.lat]},properties:{speed,direction,layer,label:`${Math.round(speed)} km/h`,updatedAt:c.time||''}};
  }).filter(Boolean);
  const updatedAt=features.find(f=>f.properties.updatedAt)?.properties.updatedAt||new Date().toISOString();
  return{layer,source:'Open-Meteo',updatedAt,geojson:{type:'FeatureCollection',features},sampleCount:features.length};
}

export function formatOverlayValue(layer,value){
  const n=Number(value);if(!Number.isFinite(n))return'—';
  if(layer==='temp')return`${n.toFixed(0)}°`;
  if(layer==='rain')return`${n.toFixed(n<1?1:0)} mm`;
  if(layer==='pressure')return`${n.toFixed(0)} hPa`;
  return String(n);
}
function round(v,d=0){const n=Number(v);return Number.isFinite(n)?Number(n.toFixed(d)):'—'}
