const FALLBACK={place:'天氣預覽',temperature:24,feelsLike:25,code:3,high:27,low:21,rain:20,wind:12,updatedAt:null,forecast:[{label:'今天',high:27,low:21,code:3},{label:'明天',high:28,low:22,code:2},{label:'後天',high:27,low:22,code:61}]};

export function weatherIcon(code){if(code===0)return'☀️';if([1,2].includes(code))return'🌤️';if(code===3)return'☁️';if([45,48].includes(code))return'🌫️';if(code>=51&&code<=67)return'🌧️';if(code>=71&&code<=77)return'🌨️';if(code>=80&&code<=82)return'🌦️';if(code>=95)return'⛈️';return'☁️'}
export function weatherLabel(code){if(code===0)return'晴朗';if([1,2].includes(code))return'晴間多雲';if(code===3)return'多雲';if([45,48].includes(code))return'有霧';if(code>=51&&code<=67)return'有雨';if(code>=71&&code<=77)return'降雪';if(code>=80&&code<=82)return'驟雨';if(code>=95)return'雷暴';return'天氣'}

function locate(signal){return new Promise(resolve=>{if(!navigator.geolocation)return resolve(null);let done=false;const finish=v=>{if(done)return;done=true;resolve(v)};const timer=setTimeout(()=>finish(null),2500);signal?.addEventListener('abort',()=>{clearTimeout(timer);finish(null)},{once:true});navigator.geolocation.getCurrentPosition(p=>{clearTimeout(timer);finish({lat:p.coords.latitude,lon:p.coords.longitude})},()=>{clearTimeout(timer);finish(null)},{enableHighAccuracy:false,timeout:2200,maximumAge:900000})})}

export async function loadWeather({signal,allowLocation=true}={}){
  const position=allowLocation?await locate(signal):null;
  if(!position)return {...FALLBACK,updatedAt:new Date().toISOString(),isFallback:true};
  const params=new URLSearchParams({latitude:String(position.lat),longitude:String(position.lon),current:'temperature_2m,apparent_temperature,weather_code,wind_speed_10m',daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',timezone:'auto',forecast_days:'5'});
  try{
    const response=await fetch(`https://api.open-meteo.com/v1/forecast?${params}`,{signal});if(!response.ok)throw new Error(`weather ${response.status}`);const d=await response.json();
    return {place:'目前位置',temperature:Math.round(d.current?.temperature_2m??24),feelsLike:Math.round(d.current?.apparent_temperature??24),code:d.current?.weather_code??3,high:Math.round(d.daily?.temperature_2m_max?.[0]??27),low:Math.round(d.daily?.temperature_2m_min?.[0]??21),rain:Math.round(d.daily?.precipitation_probability_max?.[0]??0),wind:Math.round(d.current?.wind_speed_10m??0),updatedAt:d.current?.time||new Date().toISOString(),forecast:(d.daily?.time||[]).slice(0,5).map((_,i)=>({label:i===0?'今天':i===1?'明天':new Date(d.daily.time[i]).toLocaleDateString('zh-HK',{weekday:'short'}),high:Math.round(d.daily.temperature_2m_max[i]),low:Math.round(d.daily.temperature_2m_min[i]),code:d.daily.weather_code[i]})),isFallback:false};
  }catch(error){if(signal?.aborted)throw error;return {...FALLBACK,updatedAt:new Date().toISOString(),isFallback:true}}
}
