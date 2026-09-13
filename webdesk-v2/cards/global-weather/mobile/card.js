import{fetchPointWeather,DEFAULT_CENTER}from'../shared/global-weather-service.js';
export async function mount({host,sdk,signal}){
  host.innerHTML=`<section class="gw-card gw-mobile-card gw-mini-card" tabindex="0" role="button" aria-label="打開全球天氣"><span>🌍</span><strong>全球天氣 · ${DEFAULT_CENTER.name}</strong><span data-wind>風 讀取中…</span><span data-rain></span></section>`;
  const el=host.firstElementChild,wind=host.querySelector('[data-wind]'),rain=host.querySelector('[data-rain]');
  const open=()=>sdk.openApp();el.onclick=open;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}};
  try{const d=await fetchPointWeather(DEFAULT_CENTER.lat,DEFAULT_CENTER.lon,{signal});if(!signal?.aborted){wind.textContent=`風 ${d.summary.wind} km/h`;rain.textContent=`降雨 ${d.summary.rain} mm`;el.setAttribute('aria-label',`全球天氣，${DEFAULT_CENTER.name}，風 ${d.summary.wind}公里每小時，降雨 ${d.summary.rain}毫米，打開詳細地圖`)}}catch{if(!signal?.aborted){wind.textContent='全球天氣';rain.textContent=''}}
  return()=>{el.onclick=null;el.onkeydown=null};
}
