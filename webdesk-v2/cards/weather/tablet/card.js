import {loadWeather,weatherIcon,weatherLabel} from '../shared/weather-service.js';

export async function mount({host,sdk,signal}){
  host.innerHTML=`<section class="weather-v2 weather-v2-tablet" aria-live="polite"><div class="weather-v2-loading">正在取得天氣…</div></section>`;
  const data=await loadWeather({signal});
  if(signal?.aborted)return;
  host.innerHTML=`<section class="weather-v2 weather-v2-tablet"><div class="weather-v2-tablet-main"><small>${data.place}${data.isFallback?' · 預覽':''}</small><strong>${weatherIcon(data.code)} ${data.temperature}°</strong><span>${weatherLabel(data.code)} · 體感 ${data.feelsLike}°</span></div><div class="weather-v2-tablet-strip"><span>${data.high}° / ${data.low}°</span><span>降雨 ${data.rain}%</span><span>風 ${data.wind} km/h</span></div><button type="button" data-open-weather>展開天氣</button></section>`;
  const button=host.querySelector('[data-open-weather]');
  button?.addEventListener('click',sdk.openApp);
  return()=>button?.removeEventListener('click',sdk.openApp);
}
