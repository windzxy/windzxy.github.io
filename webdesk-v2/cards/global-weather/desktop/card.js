import{fetchPointWeather,DEFAULT_CENTER,layerById}from'../shared/global-weather-service.js';
export async function mount({host,sdk,signal}){
  const activeLayer='wind',l=layerById(activeLayer);
  host.innerHTML=`<section class="gw-card gw-desktop-card" tabindex="0" role="button" aria-label="打開全球天氣"><div><span>${DEFAULT_CENTER.name}</span><strong data-value>${l.label} 讀取中…</strong></div><span>🌍</span></section>`;
  const el=host.firstElementChild,value=host.querySelector('[data-value]');
  const open=()=>sdk.openApp();el.onclick=open;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}};
  try{const d=await fetchPointWeather(DEFAULT_CENTER.lat,DEFAULT_CENTER.lon,{signal});if(!signal?.aborted)value.textContent=`${l.label} ${d.summary[activeLayer]} ${l.unit}`}catch{if(!signal?.aborted)value.textContent='全球天氣'}
  return()=>{el.onclick=null;el.onkeydown=null};
}
