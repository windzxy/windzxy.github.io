import {loadWeather,weatherIcon,weatherLabel} from '../shared/weather-service.js';

export async function mount({host,sdk,signal}){
  host.innerHTML=`<section class="weather-v2 weather-v2-tablet" aria-live="polite"><div class="weather-v2-loading">取得天氣…</div></section>`;
  const data=await loadWeather({signal});
  if(signal?.aborted)return;
  host.innerHTML=`<section class="weather-v2 weather-v2-tablet" tabindex="0" role="button" aria-label="${data.place}天氣，${data.temperature}度，濕度${data.humidity}%">
    <div class="weather-v2-tablet-mini"><strong>☁️ 天氣</strong><span>· ${data.place}</span><b>${data.temperature}°</b><span>濕度 ${data.humidity}%</span></div>
    <div class="weather-v2-tablet-main"><small>${data.place}${data.isFallback?' · 預覽':''}</small><strong>${weatherIcon(data.code)} ${data.temperature}°</strong><span>${weatherLabel(data.code)} · 體感 ${data.feelsLike}°</span></div>
    <div class="weather-v2-tablet-strip"><span>${data.high}° / ${data.low}°</span><span>降雨 ${data.rain}%</span><span>風 ${data.wind} km/h</span></div>
    <button class="wd-card-cta" type="button" data-open-weather>詳細天氣</button>
  </section>`;
  const root=host.firstElementChild,button=host.querySelector('[data-open-weather]');
  const open=()=>sdk.openApp();button?.addEventListener('click',open);root?.addEventListener('dblclick',open);
  root?.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target===root){e.preventDefault();open()}});
  return()=>{button?.removeEventListener('click',open);root?.removeEventListener('dblclick',open)};
}
