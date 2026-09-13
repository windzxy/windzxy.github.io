import {loadWeather,weatherIcon,weatherLabel,weatherInsight,searchCities,savedLocations,saveLocation} from '../shared/weather-service.js';
export async function mount({host,signal}){
  let active=null;
  async function render(location=null){
    active=location;host.innerHTML='<section class="weather-app weather-app-mobile" aria-busy="true"></section>';
    const d=await loadWeather({signal,location});if(signal.aborted)return;const insight=weatherInsight(d);
    host.innerHTML=`<section class="weather-app weather-app-mobile">
      <header class="weather-mobile-hero"><button class="weather-mobile-place" data-city>${d.place}<span>⌄</span></button><div class="weather-mobile-temp"><strong>${d.temperature}°</strong><div><b>${weatherIcon(d.code)} ${weatherLabel(d.code)}</b><span>體感 ${d.feelsLike}°</span><span>${d.low}° / ${d.high}°</span></div></div>${insight?`<p>${insight}</p>`:''}</header>
      <div class="weather-mobile-hourly" aria-label="逐小時預報">${d.hourly.slice(0,8).map(x=>`<article><small>${x.time}</small><strong>${weatherIcon(x.code)}</strong><b>${x.temp}°</b><span>${x.rain}%</span></article>`).join('')}</div>
      <section class="weather-mobile-days"><div class="weather-mobile-list" aria-label="七日預報">${d.forecast.slice(0,7).map(x=>`<article><span>${x.label}</span><strong>${weatherIcon(x.code)}</strong><small>${x.rain}%</small><b>${x.low}°</b><em>${x.high}°</em></article>`).join('')}</div></section>
      <section class="weather-mobile-metrics" aria-label="天氣詳情">
        <article><small>濕度</small><strong>${d.humidity}%</strong></article>
        <article><small>風</small><strong>${d.wind}<i> km/h</i></strong></article>
        <article><small>陣風</small><strong>${d.gust}<i> km/h</i></strong></article>
        <article><small>UV</small><strong>${d.uv}</strong></article>
        <article><small>氣壓</small><strong>${d.pressure}<i> hPa</i></strong></article>
        <article><small>能見度</small><strong>${d.visibility}<i> km</i></strong></article>
        <article><small>日出</small><strong>${d.sunrise}</strong></article>
        <article><small>日落</small><strong>${d.sunset}</strong></article>
      </section>
      ${d.source?`<small class="weather-source">${String(d.updatedAt||'').slice(-5)} · ${d.source}</small>`:''}
      <div class="weather-city-sheet" data-sheet hidden><div class="weather-city-search"><input class="wd-search" data-query type="search" placeholder="搜尋城市" autocomplete="off"><button class="wd-ios-button wd-ios-button-secondary" data-close>完成</button></div><div data-results></div></div>
    </section>`;bind();
  }
  function bind(){const sheet=host.querySelector('[data-sheet]'),results=host.querySelector('[data-results]'),input=host.querySelector('[data-query]');host.querySelector('[data-city]').onclick=()=>{sheet.hidden=false;paint(savedLocations())};host.querySelector('[data-close]').onclick=()=>sheet.hidden=true;let timer;input.oninput=()=>{clearTimeout(timer);timer=setTimeout(async()=>{try{paint(await searchCities(input.value,{signal}))}catch{}},220)};function paint(list){results.innerHTML=list.length?list.map(x=>`<button class="wd-ios-button wd-ios-button-row" data-id="${x.id}"><span>${x.name}</span><small>${x.region}</small></button>`).join(''):'<p class="weather-empty">沒有結果</p>';results.querySelectorAll('[data-id]').forEach((b,i)=>b.onclick=()=>{const loc=list[i];saveLocation(loc);render(loc)})}}
  await render(active);
}
