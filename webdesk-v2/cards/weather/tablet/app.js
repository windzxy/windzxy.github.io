import {loadWeather,weatherIcon,weatherLabel,weatherInsight,searchCities,savedLocations,saveLocation} from '../shared/weather-service.js';
export async function mount({host,signal}){
  async function render(location=null){
    host.innerHTML='<section class="weather-app weather-app-tablet" aria-busy="true"></section>';
    const d=await loadWeather({signal,location});if(signal.aborted)return;const insight=weatherInsight(d);
    host.innerHTML=`<section class="weather-app weather-app-tablet">
      <div class="weather-tablet-top"><button class="weather-tablet-place" data-city>${d.place}<span>⌄</span></button>${d.source?`<small>${String(d.updatedAt||'').slice(-5)} · ${d.source}</small>`:''}</div>
      <header class="weather-tablet-hero"><div class="weather-tablet-now"><strong>${d.temperature}°</strong><div><b>${weatherIcon(d.code)} ${weatherLabel(d.code)}</b><span>體感 ${d.feelsLike}°</span><span>${d.low}° / ${d.high}°</span></div></div><div class="weather-tablet-summary"><article><small>降雨</small><b>${d.rain}%</b></article><article><small>風</small><b>${d.wind}<i> km/h</i></b></article><article><small>濕度</small><b>${d.humidity}%</b></article><article><small>UV</small><b>${d.uv}</b></article></div></header>
      ${insight?`<p class="weather-tablet-insight">${insight}</p>`:''}
      <div class="weather-tablet-hourly" aria-label="逐小時預報">${d.hourly.slice(0,8).map(x=>`<article><small>${x.time}</small><strong>${weatherIcon(x.code)}</strong><b>${x.temp}°</b><span>${x.rain}%</span></article>`).join('')}</div>
      <section class="weather-tablet-lower"><div class="weather-tablet-days" aria-label="七日預報">${d.forecast.slice(0,7).map(x=>`<article><span>${x.label}</span><strong>${weatherIcon(x.code)}</strong><small>${x.rain}%</small><b>${x.low}°</b><em>${x.high}°</em></article>`).join('')}</div><div class="weather-tablet-metrics"><article><small>陣風</small><b>${d.gust}<i> km/h</i></b></article><article><small>氣壓</small><b>${d.pressure}<i> hPa</i></b></article><article><small>能見度</small><b>${d.visibility}<i> km</i></b></article><article><small>日出 / 日落</small><b>${d.sunrise}<i> · </i>${d.sunset}</b></article></div></section>
      <div class="weather-tablet-sheet" data-sheet hidden><div class="weather-tablet-search"><input class="wd-search" data-query type="search" placeholder="搜尋城市" autocomplete="off"><button class="wd-ios-button wd-ios-button-secondary" data-close>完成</button></div><div data-results></div></div>
    </section>`;bind();
  }
  function bind(){const sheet=host.querySelector('[data-sheet]'),results=host.querySelector('[data-results]'),input=host.querySelector('[data-query]');host.querySelector('[data-city]').onclick=()=>{sheet.hidden=false;paint(savedLocations())};host.querySelector('[data-close]').onclick=()=>sheet.hidden=true;let timer;input.oninput=()=>{clearTimeout(timer);timer=setTimeout(async()=>{try{paint(await searchCities(input.value,{signal}))}catch{}},250)};function paint(list){results.innerHTML=list.length?list.map(x=>`<button class="wd-ios-button wd-ios-button-row" data-id="${x.id}"><span>${x.name}</span><small>${x.region}</small></button>`).join(''):'<p class="weather-empty">沒有結果</p>';results.querySelectorAll('[data-id]').forEach((b,i)=>b.onclick=()=>{saveLocation(list[i]);render(list[i])})}}
  await render();
}
