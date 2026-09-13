import {loadWeather,weatherIcon,weatherLabel,weatherInsight} from '../shared/weather-service.js';
export async function mount({host,signal}){
  host.innerHTML='<section class="weather-app weather-app-tablet" aria-busy="true"></section>';
  const d=await loadWeather({signal});if(signal.aborted)return;
  host.innerHTML=`<section class="weather-app weather-app-tablet"><header><div><small>${d.place}${d.isFallback?' · 預覽':''}</small><h2>${weatherIcon(d.code)} ${d.temperature}°</h2><p>${weatherLabel(d.code)} · 體感 ${d.feelsLike}°</p></div><div class="weather-tablet-summary"><span>${d.high}° / ${d.low}°</span><span>降雨 ${d.rain}%</span><span>風 ${d.wind} km/h</span></div></header><div class="weather-app-insight"><p>${weatherInsight(d)}</p></div><div class="weather-tablet-days" aria-label="四日預報">${d.forecast.slice(0,4).map(x=>`<article><span>${x.label}</span><strong>${weatherIcon(x.code)}</strong><b>${x.high}°</b><small>${x.low}°</small></article>`).join('')}</div></section>`;
}
