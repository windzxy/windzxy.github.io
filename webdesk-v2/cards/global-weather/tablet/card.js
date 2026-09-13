import{fetchPointWeather,DEFAULT_CENTER}from'../shared/global-weather-service.js';
export async function mount({host,sdk,signal}){
  host.innerHTML=`<section class="gw-card gw-tablet-card" tabindex="0" role="button" aria-label="打開全球天氣"><div class="gw-card-line"><strong>🌍 全球天氣</strong><span>· ${DEFAULT_CENTER.name}</span><b data-value>讀取中…</b><span data-extra></span></div></section>`;
  const el=host.firstElementChild,value=host.querySelector('[data-value]'),extra=host.querySelector('[data-extra]');
  const open=()=>sdk.openApp();el.onclick=open;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}};
  try{const d=await fetchPointWeather(DEFAULT_CENTER.lat,DEFAULT_CENTER.lon,{signal});if(!signal?.aborted){value.textContent=`風 ${d.summary.wind} km/h`;extra.textContent=`降雨 ${d.summary.rain} mm`}}catch{if(!signal?.aborted){value.textContent='全球天氣';extra.textContent=''}}
  return()=>{el.onclick=null;el.onkeydown=null};
}
