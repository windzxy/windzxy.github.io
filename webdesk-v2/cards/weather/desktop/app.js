import {loadWeather,weatherIcon,weatherLabel,weatherInsight} from '../shared/weather-service.js';
export async function mount({host,signal}){
  host.innerHTML='<section class="weather-app weather-app-desktop" aria-busy="true"></section>';
  const d=await loadWeather({signal});if(signal.aborted)return;
  host.innerHTML=`<section class="weather-app weather-app-desktop">
    <div class="weather-app-hero">
      <div><small>${d.place}${d.isFallback?' · 預覽':''}</small><h2>${weatherIcon(d.code)} ${d.temperature}°</h2><p>${weatherLabel(d.code)} · 體感 ${d.feelsLike}°</p></div>
      <div class="weather-app-meta"><span>${d.high}° / ${d.low}°</span><span>降雨 ${d.rain}%</span><span>風 ${d.wind} km/h</span><span>陣風 ${d.gust} km/h</span><span>濕度 ${d.humidity}%</span><span>UV ${d.uv}</span></div>
    </div>
    <div class="weather-app-insight"><p>${weatherInsight(d)}</p></div>
    <div class="weather-app-hourly" aria-label="逐小時預報">${d.hourly.slice(0,8).map(x=>`<article><small>${x.time}</small><strong>${weatherIcon(x.code)}</strong><span>${x.temp}°</span><em>${x.rain}%</em></article>`).join('')}</div>
    <div class="weather-app-forecast" aria-label="七日預報">${d.forecast.slice(0,7).map(x=>`<article><small>${x.label}</small><strong>${weatherIcon(x.code)}</strong><span>${x.high}° / ${x.low}°</span></article>`).join('')}</div>
    <div class="weather-app-details"><span>日出 ${d.sunrise}</span><span>日落 ${d.sunset}</span><span>${String(d.updatedAt||'').slice(-5)} 更新</span></div>
  </section>`;
}
