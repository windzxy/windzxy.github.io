import{layers,layerById,fetchPointWeather,DEFAULT_CENTER}from'../shared/global-weather-service.js';
import{mountMap,basemaps}from'../shared/map-engine.js';
export async function mount({host,signal}){
  let active='wind',data=null,timer=0,mapApi=null,resizeTimer=0,weatherAbort=null,mapState={state:'loading',source:'OpenFreeMap'};
  host.innerHTML=`<section class="gw-app gw-mobile-app"><div class="gw-mobile-map" data-map aria-label="全球天氣地圖"></div><div class="gw-mobile-title"><strong>全球天氣</strong><span data-map-status>地圖載入中…</span></div><nav class="gw-mobile-layers">${layers.map((l,i)=>`<button type="button" data-layer="${l.id}" class="${i?'':'on'}">${l.label}</button>`).join('')}</nav><section class="gw-mobile-sheet"><div class="gw-mobile-readout" data-readout>讀取即時資料…</div><nav class="gw-mobile-bases">${basemaps.map(b=>`<button type="button" data-base="${b.id}" class="${b.id==='weather'?'on':''}">${b.label}</button>`).join('')}</nav><small data-source>資料載入中…</small></section></section>`;
  const readout=host.querySelector('[data-readout]'),source=host.querySelector('[data-source]'),mapStatus=host.querySelector('[data-map-status]'),mapNode=host.querySelector('[data-map]');
  const paint=()=>{if(!data)return;const l=layerById(active),v=data.summary[active];readout.textContent=`${l.label} ${v}${v==='—'?'':' '+l.unit}`;const t=String(data.updatedAt||'').slice(11,16)||'—';source.textContent=`天氣 ${data.source} · 更新 ${t} · 地圖 ${mapState.source||'—'}${mapState.state==='fallback'?'（備援）':''}`};
  const updateMapStatus=s=>{mapState=s||mapState;if(!mapStatus)return;if(s.state==='fallback')mapStatus.textContent='OpenStreetMap 備援';else if(s.state==='ready')mapStatus.textContent=`${s.source} 地圖`;else mapStatus.textContent=`${s.source||'地圖'} 載入中…`;paint()};
  const refresh=({lat,lon},delay=180)=>{clearTimeout(timer);timer=setTimeout(async()=>{weatherAbort?.abort();weatherAbort=new AbortController();const relay=()=>weatherAbort?.abort();signal?.addEventListener('abort',relay,{once:true});try{data=await fetchPointWeather(lat,lon,{signal:weatherAbort.signal});if(!signal?.aborted)paint()}catch(e){if(!signal?.aborted&&e?.name!=='AbortError'){readout.textContent='即時資料暫時不可用';source.textContent=`地圖 ${mapState.source||'—'}`}}finally{signal?.removeEventListener('abort',relay)}},delay)};
  refresh({lat:DEFAULT_CENTER.lat,lon:DEFAULT_CENTER.lon},0);
  mapApi=await mountMap(mapNode,{center:[DEFAULT_CENTER.lon,DEFAULT_CENTER.lat],zoom:4.1,basemap:'weather',onMove:p=>refresh(p),onStatus:updateMapStatus});
  if(!mapApi&&!signal?.aborted){updateMapStatus({state:'fallback',source:'地圖不可用'});readout.textContent='地圖暫時不可用'}
  const syncMapSize=()=>{if(signal?.aborted)return;mapApi?.resize?.()};
  requestAnimationFrame(()=>{syncMapSize();requestAnimationFrame(syncMapSize)});
  resizeTimer=setTimeout(syncMapSize,240);
  const onViewportResize=()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(syncMapSize,80)};
  window.addEventListener('resize',onViewportResize,{passive:true});
  window.visualViewport?.addEventListener('resize',onViewportResize,{passive:true});
  host.querySelectorAll('[data-layer]').forEach(b=>b.onclick=()=>{active=b.dataset.layer;host.querySelectorAll('[data-layer]').forEach(x=>x.classList.toggle('on',x===b));paint()});
  host.querySelectorAll('[data-base]').forEach(b=>b.onclick=()=>{mapApi?.setBasemap(b.dataset.base);host.querySelectorAll('[data-base]').forEach(x=>x.classList.toggle('on',x===b));setTimeout(syncMapSize,120)});
  return()=>{clearTimeout(timer);clearTimeout(resizeTimer);weatherAbort?.abort();window.removeEventListener('resize',onViewportResize);window.visualViewport?.removeEventListener('resize',onViewportResize);mapApi?.destroy?.()};
}
