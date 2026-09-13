const FALLBACK={place:'天氣預覽',temperature:24,feelsLike:25,code:3,high:27,low:21,rain:20,wind:12,gust:20,humidity:72,uv:4,sunrise:'06:18',sunset:'18:32',updatedAt:null,hourly:[{time:'現在',temp:24,rain:20,code:3},{time:'1小時',temp:25,rain:20,code:3},{time:'2小時',temp:25,rain:30,code:61},{time:'3小時',temp:24,rain:40,code:61}],forecast:[{label:'今天',high:27,low:21,code:3},{label:'明天',high:28,low:22,code:2},{label:'後天',high:27,low:22,code:61}]};

export function weatherIcon(code){if(code===0)return'☀️';if([1,2].includes(code))return'🌤️';if(code===3)return'☁️';if([45,48].includes(code))return'🌫️';if(code>=51&&code<=67)return'🌧️';if(code>=71&&code<=77)return'🌨️';if(code>=80&&code<=82)return'🌦️';if(code>=95)return'⛈️';return'☁️'}
export function weatherLabel(code){if(code===0)return'晴朗';if([1,2].includes(code))return'晴間多雲';if(code===3)return'多雲';if([45,48].includes(code))return'有霧';if(code>=51&&code<=67)return'有雨';if(code>=71&&code<=77)return'降雪';if(code>=80&&code<=82)return'驟雨';if(code>=95)return'雷暴';return'天氣'}

export function weatherInsight(data){
  const next=(data.hourly||[]).slice(1,5);
  const wet=next.find(x=>x.rain>=50);
  if(wet)return `留意降雨：${wet.time} 降雨機率約 ${wet.rain}%`;
  if(data.gust>=45)return `陣風較強，最高約 ${data.gust} km/h，戶外活動請留意。`;
  if(data.uv>=7)return `紫外線偏強（UV ${data.uv}），外出建議做好防曬。`;
  const delta=(next.at(-1)?.temp??data.temperature)-data.temperature;
  if(delta>=3)return `未來數小時升溫約 ${delta}°，體感會更暖。`;
  if(delta<=-3)return `未來數小時降溫約 ${Math.abs(delta)}°，可適量添衣。`;
  return `${weatherLabel(data.code)}為主，短時間內天氣變化不大。`;
}

function locate(signal){return new Promise(resolve=>{if(!navigator.geolocation)return resolve(null);let done=false;const finish=v=>{if(done)return;done=true;resolve(v)};const timer=setTimeout(()=>finish(null),2500);signal?.addEventListener('abort',()=>{clearTimeout(timer);finish(null)},{once:true});navigator.geolocation.getCurrentPosition(p=>{clearTimeout(timer);finish({lat:p.coords.latitude,lon:p.coords.longitude})},()=>{clearTimeout(timer);finish(null)},{enableHighAccuracy:false,timeout:2200,maximumAge:900000})})}
function clock(value){if(!value)return'--:--';return String(value).slice(-5)}

export async function loadWeather({signal,allowLocation=true}={}){
  const position=allowLocation?await locate(signal):null;
  if(!position)return {...FALLBACK,updatedAt:new Date().toISOString(),isFallback:true};
  const params=new URLSearchParams({
    latitude:String(position.lat),longitude:String(position.lon),
    current:'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_gusts_10m',
    hourly:'temperature_2m,precipitation_probability,weather_code',
    daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset',
    timezone:'auto',forecast_days:'7'
  });
  try{
    const response=await fetch(`https://api.open-meteo.com/v1/forecast?${params}`,{signal});
    if(!response.ok)throw new Error(`weather ${response.status}`);
    const d=await response.json();
    const currentTime=d.current?.time;
    let start=Math.max(0,(d.hourly?.time||[]).findIndex(t=>t>=currentTime));
    if(start<0)start=0;
    const hourly=(d.hourly?.time||[]).slice(start,start+12).map((t,i)=>({
      time:i===0?'現在':clock(t),
      temp:Math.round(d.hourly.temperature_2m[start+i]),
      rain:Math.round(d.hourly.precipitation_probability[start+i]??0),
      code:d.hourly.weather_code[start+i]
    }));
    return {
      place:'目前位置',
      temperature:Math.round(d.current?.temperature_2m??24),
      feelsLike:Math.round(d.current?.apparent_temperature??24),
      humidity:Math.round(d.current?.relative_humidity_2m??0),
      code:d.current?.weather_code??3,
      high:Math.round(d.daily?.temperature_2m_max?.[0]??27),
      low:Math.round(d.daily?.temperature_2m_min?.[0]??21),
      rain:Math.round(d.daily?.precipitation_probability_max?.[0]??0),
      wind:Math.round(d.current?.wind_speed_10m??0),
      gust:Math.round(d.current?.wind_gusts_10m??0),
      uv:Math.round((d.daily?.uv_index_max?.[0]??0)*10)/10,
      sunrise:clock(d.daily?.sunrise?.[0]),sunset:clock(d.daily?.sunset?.[0]),
      updatedAt:currentTime||new Date().toISOString(),hourly,
      forecast:(d.daily?.time||[]).slice(0,7).map((_,i)=>({label:i===0?'今天':i===1?'明天':new Date(d.daily.time[i]).toLocaleDateString('zh-HK',{weekday:'short'}),high:Math.round(d.daily.temperature_2m_max[i]),low:Math.round(d.daily.temperature_2m_min[i]),code:d.daily.weather_code[i]})),
      isFallback:false
    };
  }catch(error){if(signal?.aborted)throw error;return {...FALLBACK,updatedAt:new Date().toISOString(),isFallback:true}}
}
