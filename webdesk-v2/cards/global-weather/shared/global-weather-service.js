export const layers=[
  {id:'wind',label:'風',unit:'km/h'},
  {id:'gust',label:'陣風',unit:'km/h'},
  {id:'rain',label:'降雨',unit:'mm'},
  {id:'temp',label:'溫度',unit:'°C'},
  {id:'pressure',label:'氣壓',unit:'hPa'}
];

export const DEFAULT_CENTER={name:'深圳',lat:22.5431,lon:114.0579};
export function layerById(id){return layers.find(x=>x.id===id)||layers[0]}

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
function round(v,d=0){const n=Number(v);return Number.isFinite(n)?Number(n.toFixed(d)):'—'}
