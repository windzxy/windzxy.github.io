import {loadWeather,weatherIcon,weatherLabel} from '../shared/weather-service.js';
export async function mount({host,sdk,signal}){
  host.innerHTML='<section class="weather-v2 weather-v2-mobile" aria-busy="true"></section>';
  const d=await loadWeather({signal});if(signal?.aborted)return;
  host.innerHTML=`<section class="weather-v2 weather-v2-mobile" role="button" tabindex="0" aria-label="打開天氣詳情"><div class="weather-v2-mobile-top"><strong>${weatherIcon(d.code)} ${d.temperature}°</strong><span>${weatherLabel(d.code)}</span></div><div class="weather-v2-mobile-meta"><span>${d.high}° / ${d.low}°</span><span>雨 ${d.rain}%</span></div></section>`;
  const card=host.querySelector('.weather-v2-mobile');
  const open=()=>sdk.openApp();
  const key=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}};
  card?.addEventListener('click',open);card?.addEventListener('keydown',key);
  return()=>{card?.removeEventListener('click',open);card?.removeEventListener('keydown',key)};
}
