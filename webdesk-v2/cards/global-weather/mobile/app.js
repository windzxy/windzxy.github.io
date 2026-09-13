import{layers,layerById,fetchPointWeather,DEFAULT_CENTER}from'../shared/global-weather-service.js';
import{mountMap,basemaps}from'../shared/map-engine.js';
export async function mount({host,signal}){
  let active='wind',data=null,timer=0,mapApi=null;
  host.innerHTML=`<section class="gw-app gw-mobile-app"><div class="gw-mobile-map" data-map aria-label="全球天氣地圖"></div><div class="gw-mobile-title"><strong>全球天氣</strong><span>深圳附近</span></div><nav class="gw-mobile-layers">${layers.map((l,i)=>`<button type="button" data-layer="${l.id}" class="${i?'':'on'}">${l.label}</button>`).join('')}</nav><section class="gw-mobile-sheet"><div class="gw-mobile-readout" data-readout>讀取即時資料…</div><nav class="gw-mobile-bases">${basemaps.map(b=>`<button type="button" data-base="${b.id}" class="${b.id==='weather'?'on':''}">${b.label}</button>`).join('')}</nav><small data-source></small></section></section>`;
  const readout=host.querySelector('[data-readout]'),source=host.querySelector('[data-source]');
  const paint=()=>{if(!data)return;const l=layerById(active),v=data.summary[active];readout.textContent=`${l.label} ${v}${v==='—'?'':' '+l.unit}`;source.textContent=`${data.source} · ${String(data.updatedAt||'').slice(11,16)}`};
  const refresh=({lat,lon})=>{clearTimeout(timer);timer=setTimeout(async()=>{try{data=await fetchPointWeather(lat,lon,{signal});if(!signal.aborted)paint()}catch{if(!signal.aborted){readout.textContent='即時資料暫時不可用';source.textContent=''}}},220)};
  mapApi=await mountMap(host.querySelector('[data-map]'),{center:[DEFAULT_CENTER.lon,DEFAULT_CENTER.lat],zoom:4.1,basemap:'weather',onMove:refresh});
  host.querySelectorAll('[data-layer]').forEach(b=>b.onclick=()=>{active=b.dataset.layer;host.querySelectorAll('[data-layer]').forEach(x=>x.classList.toggle('on',x===b));paint()});
  host.querySelectorAll('[data-base]').forEach(b=>b.onclick=()=>{mapApi?.setBasemap(b.dataset.base);host.querySelectorAll('[data-base]').forEach(x=>x.classList.toggle('on',x===b))});
  return()=>{clearTimeout(timer);mapApi?.destroy?.()};
}
