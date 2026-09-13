import {loadWeather,weatherIcon,weatherLabel} from '../shared/weather-service.js';

export async function mount({host,sdk,signal}){
  host.innerHTML=`<section class="weather-v2 weather-v2-mobile" aria-live="polite"><div class="weather-v2-loading">正在取得天氣…</div></section>`;
  const data=await loadWeather({signal});
  if(signal?.aborted)return;
  host.innerHTML=`<section class="weather-v2 weather-v2-mobile"><div class="weather-v2-mobile-top"><div><small>${data.place}${data.isFallback?' · 預覽':''}</small><strong>${weatherIcon(data.code)} ${data.temperature}°</strong></div><span>${weatherLabel(data.code)}</span></div><div class="weather-v2-mobile-meta"><span>${data.high}° / ${data.low}°</span><span>降雨 ${data.rain}%</span></div><button class="wd-card-cta" type="button" data-open-weather>查看天氣</button></section>`;
  const button=host.querySelector('[data-open-weather]');
  button?.addEventListener('click',sdk.openApp);
  return()=>button?.removeEventListener('click',sdk.openApp);
}
