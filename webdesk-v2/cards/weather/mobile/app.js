import {loadWeather,weatherIcon,weatherLabel,weatherInsight} from '../shared/weather-service.js';
export async function mount({host,signal}){
  host.innerHTML='<section class="weather-app weather-app-mobile" aria-busy="true"></section>';
  const d=await loadWeather({signal});if(signal.aborted)return;
  host.innerHTML=`<section class="weather-app weather-app-mobile">
    <div class="weather-mobile-current">
      <small>${d.place}${d.isFallback?' · 預覽':''}</small>
      <h2>${weatherIcon(d.code)} ${d.temperature}°</h2>
      <p>${weatherLabel(d.code)} · 體感 ${d.feelsLike}°</p>
      <div><span>${d.high}° / ${d.low}°</span><span>降雨 ${d.rain}%</span></div>
    </div>
    <div class="weather-mobile-insight"><p>${weatherInsight(d)}</p></div>
    <div class="weather-mobile-hourly" aria-label="逐小時預報">${d.hourly.slice(0,6).map(x=>`<article><small>${x.time}</small><strong>${weatherIcon(x.code)}</strong><b>${x.temp}°</b><span>${x.rain}%</span></article>`).join('')}</div>
    <div class="weather-mobile-list" aria-label="七日預報">${d.forecast.slice(0,7).map(x=>`<article><span>${x.label}</span><strong>${weatherIcon(x.code)}</strong><b>${x.high}°</b><small>${x.low}°</small></article>`).join('')}</div>
    <div class="weather-mobile-details"><span>濕度 ${d.humidity}%</span><span>陣風 ${d.gust} km/h</span><span>UV ${d.uv}</span></div>
  </section>`;
}
