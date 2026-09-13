import {loadWeather,weatherIcon,weatherLabel} from '../shared/weather-service.js';

export async function mount({host,sdk,signal}){
  host.innerHTML=`<section class="weather-v2 weather-v2-desktop" aria-live="polite"><div class="weather-v2-loading">正在取得天氣…</div></section>`;
  const data=await loadWeather({signal});
  if(signal?.aborted)return;
  const extended=(data.forecast||[]).slice(0,4).map(item=>`<article><small>${item.label}</small><strong>${weatherIcon(item.code)}</strong><span>${item.high}° / ${item.low}°</span></article>`).join('');
  host.innerHTML=`<section class="weather-v2 weather-v2-desktop"><div class="weather-v2-current"><small>${data.place}${data.isFallback?' · 預覽':''}</small><h3>${weatherIcon(data.code)} ${data.temperature}°</h3><p>${weatherLabel(data.code)} · 體感 ${data.feelsLike}°</p></div><div class="weather-v2-grid"><span>最高 ${data.high}°</span><span>最低 ${data.low}°</span><span>降雨 ${data.rain}%</span><span>風速 ${data.wind} km/h</span></div><div class="weather-v2-extended" aria-label="未來天氣">${extended}</div><button class="wd-card-cta" type="button" data-open-weather>查看完整天氣</button></section>`;
  const button=host.querySelector('[data-open-weather]');
  button?.addEventListener('click',sdk.openApp);
  return()=>button?.removeEventListener('click',sdk.openApp);
}
