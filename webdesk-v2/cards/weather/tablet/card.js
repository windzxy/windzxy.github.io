import {loadWeather,weatherIcon,weatherLabel} from '../shared/weather-service.js';

export async function mount({host,sdk,signal}){
  host.innerHTML=`<section class="weather-v2 weather-v2-tablet" aria-live="polite"><div class="weather-v2-loading">取得天氣…</div></section>`;
  const data=await loadWeather({signal});
  if(signal?.aborted)return;
  const forecast=(data.forecast||[]).slice(0,3).map(item=>`<article><small>${item.label}</small><strong>${weatherIcon(item.code)}</strong><span>${item.high}° / ${item.low}°</span></article>`).join('');
  host.innerHTML=`<section class="weather-v2 weather-v2-tablet" tabindex="0" role="button" aria-label="${data.place}天氣，${data.temperature}度，濕度${data.humidity}%，打開詳細天氣">
    <div class="weather-v2-tablet-mini"><span>${weatherIcon(data.code)}</span><strong>天氣 · ${data.place}</strong><span>${data.temperature}°</span><span>濕度 ${data.humidity}%</span></div>
    <div class="weather-v2-tablet-main"><small>${data.place}${data.isFallback?' · 預覽':''}</small><strong>${weatherIcon(data.code)} ${data.temperature}°</strong><span>${weatherLabel(data.code)} · 體感 ${data.feelsLike}°</span></div>
    <div class="weather-v2-tablet-strip"><span>${data.high}° / ${data.low}°</span><span>降雨 ${data.rain}%</span><span>風 ${data.wind} km/h</span></div>
    <div class="weather-v2-tablet-forecast" aria-label="未來天氣">${forecast}</div>
    <button class="wd-card-cta" type="button" data-open-weather>詳細天氣</button>
  </section>`;
  const root=host.firstElementChild,button=host.querySelector('[data-open-weather]');
  const open=()=>sdk.openApp();
  const click=e=>{if(e.target.closest('[data-open-weather]'))return;open()};
  const key=e=>{if((e.key==='Enter'||e.key===' ')&&e.target===root){e.preventDefault();open()}};
  button?.addEventListener('click',open);root?.addEventListener('click',click);root?.addEventListener('keydown',key);
  return()=>{button?.removeEventListener('click',open);root?.removeEventListener('click',click);root?.removeEventListener('keydown',key)};
}
