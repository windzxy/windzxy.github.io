import{fetchPointWeather,DEFAULT_CENTER}from'../shared/global-weather-service.js';
export async function mount({host,sdk,signal}){
  host.innerHTML=`<section class="gw-card gw-mobile-card" tabindex="0" role="button" aria-label="打開全球天氣"><div><strong data-value>🌍 讀取中…</strong><span>${DEFAULT_CENTER.name} · 風</span></div><span>›</span></section>`;
  const el=host.firstElementChild,value=host.querySelector('[data-value]');
  const open=()=>sdk.openApp();el.onclick=open;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}};
  try{const d=await fetchPointWeather(DEFAULT_CENTER.lat,DEFAULT_CENTER.lon,{signal});if(!signal?.aborted)value.textContent=`🌍 ${d.summary.wind} km/h`}catch{if(!signal?.aborted)value.textContent='🌍 全球天氣'}
  return()=>{el.onclick=null;el.onkeydown=null};
}
