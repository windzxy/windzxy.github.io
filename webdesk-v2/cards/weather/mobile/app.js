import {loadWeather,weatherIcon,weatherLabel,weatherInsight} from '../shared/weather-service.js';
export async function mount({host,signal}){
  host.innerHTML='<section class="weather-app weather-app-mobile"><p>載入天氣中…</p></section>';
  const d=await loadWeather({signal});if(signal.aborted)return;
  host.innerHTML=`<section class="weather-app weather-app-mobile">
    <div class="weather-mobile-current">
      <small>${d.place}${d.isFallback?' · 預覽':''}</small>
      <h2>${weatherIcon(d.code)} ${d.temperature}°</h2>
      <p>${weatherLabel(d.code)} · 體感 ${d.feelsLike}°</p>
      <div><span>↑ ${d.high}°</span><span>↓ ${d.low}°</span><span>雨 ${d.rain}%</span></div>
    </div>
    <div class="weather-mobile-insight"><strong>現在最重要</strong><p>${weatherInsight(d)}</p></div>
    <div class="weather-mobile-hourly">${d.hourly.slice(0,6).map(x=>`<article><small>${x.time}</small><strong>${weatherIcon(x.code)}</strong><b>${x.temp}°</b><span>${x.rain}%</span></article>`).join('')}</div>
    <div class="weather-mobile-list">${d.forecast.slice(0,7).map(x=>`<article><span>${x.label}</span><strong>${weatherIcon(x.code)}</strong><b>${x.high}°</b><small>${x.low}°</small></article>`).join('')}</div>
    <div class="weather-mobile-details"><span>濕度 ${d.humidity}%</span><span>陣風 ${d.gust} km/h</span><span>UV ${d.uv}</span></div>
  </section>`;
}
