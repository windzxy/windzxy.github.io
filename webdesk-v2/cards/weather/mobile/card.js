import {loadWeather,weatherIcon} from '../shared/weather-service.js';
export async function mount({host,sdk,signal}){
  host.innerHTML='<section class="weather-v2 weather-v2-mobile weather-v2-mini" aria-busy="true">☁️ 天氣 · 深圳　讀取中…</section>';
  const d=await loadWeather({signal});if(signal?.aborted)return;
  host.innerHTML=`<section class="weather-v2 weather-v2-mobile weather-v2-mini" role="button" tabindex="0" aria-label="天氣，${d.place}，${d.temperature}度，濕度${d.humidity}%，打開詳細天氣"><span>${weatherIcon(d.code)}</span><strong>天氣 · ${d.place}</strong><span>${d.temperature}°</span><span>濕度 ${d.humidity}%</span></section>`;
  const card=host.querySelector('.weather-v2-mobile');
  const open=()=>sdk.openApp();
  const key=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}};
  card?.addEventListener('click',open);card?.addEventListener('keydown',key);
  return()=>{card?.removeEventListener('click',open);card?.removeEventListener('keydown',key)};
}
