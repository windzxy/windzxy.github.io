const MAPLIBRE_VERSION='5.10.0';
const MAPLIBRE_SOURCES=[
  `https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js`,
  `https://cdn.jsdelivr.net/npm/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js`
];
const MAPLIBRE_CSS=`https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css`;
const OFM='https://tiles.openfreemap.org/styles/';
const OVERLAY_SOURCE='gw-weather-field';
const OVERLAY_FIELD='gw-weather-field-circles';
const OVERLAY_LABEL='gw-weather-field-labels';
let loader=null;

export const basemaps=[
  {id:'street',label:'街道',source:'OpenFreeMap',style:()=>OFM+'liberty'},
  {id:'bright',label:'明亮',source:'OpenFreeMap',style:()=>OFM+'bright'},
  {id:'weather',label:'氣象',source:'OpenFreeMap',style:()=>OFM+'fiord'},
  {id:'dark',label:'深色',source:'OpenFreeMap',style:()=>OFM+'dark'},
  {id:'terrain',label:'地形',source:'EOX',style:()=>rasterStyle('https://tiles.maps.eox.at/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg','EOX Terrain Light')},
  {id:'sat',label:'衛星',source:'EOX Sentinel-2',style:()=>rasterStyle('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2025_3857/default/g/{z}/{y}/{x}.jpg','EOX Sentinel-2 cloudless 2025')}
];

function rasterStyle(tile,attribution){return{version:8,sources:{base:{type:'raster',tiles:[tile],tileSize:256,attribution}},layers:[{id:'base',type:'raster',source:'base',minzoom:0,maxzoom:22}]}}
function ensureCss(){if(document.querySelector('link[data-gw-maplibre]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href=MAPLIBRE_CSS;link.dataset.gwMaplibre='1';document.head.appendChild(link)}
function loadScript(src,index){return new Promise((resolve,reject)=>{const old=document.querySelector(`script[data-gw-maplibre="${index}"]`);if(old){if(window.maplibregl)return resolve(window.maplibregl);old.addEventListener('load',()=>window.maplibregl?resolve(window.maplibregl):reject(new Error('MapLibre unavailable')),{once:true});old.addEventListener('error',()=>reject(new Error('MapLibre CDN failed')),{once:true});return}const s=document.createElement('script');s.src=src;s.async=true;s.crossOrigin='anonymous';s.dataset.gwMaplibre=String(index);const t=setTimeout(()=>{s.remove();reject(new Error('MapLibre CDN timeout'))},9000);s.onload=()=>{clearTimeout(t);window.maplibregl?resolve(window.maplibregl):reject(new Error('MapLibre unavailable'))};s.onerror=()=>{clearTimeout(t);s.remove();reject(new Error('MapLibre CDN failed'))};document.head.appendChild(s)})}
async function load(){if(window.maplibregl)return window.maplibregl;if(loader)return loader;ensureCss();loader=(async()=>{let last;for(let i=0;i<MAPLIBRE_SOURCES.length;i++){try{return await loadScript(MAPLIBRE_SOURCES[i],i)}catch(e){last=e}}throw last||new Error('MapLibre unavailable')})();try{return await loader}catch(e){loader=null;throw e}}
function specFor(id){return basemaps.find(x=>x.id===id)||basemaps[0]}
function overlayColor(layer){
  if(layer==='temp')return['interpolate',['linear'],['get','value'],-25,'#5537a8',-5,'#2678d8',10,'#46b9b0',22,'#72c66b',32,'#f3b43f',42,'#df554f'];
  if(layer==='rain')return['interpolate',['linear'],['get','value'],0,'rgba(105,170,205,0.10)',.2,'#67c6d3',2,'#3d9bd8',8,'#5361c9',20,'#9a4bb8',50,'#d14d86'];
  return['interpolate',['linear'],['get','value'],970,'#4968b8',990,'#5ca8ca',1010,'#73c39b',1025,'#e2c75d',1045,'#d27a55'];
}
function fallbackMap(container,{center,onMove,onStatus,reason}={}){
  const [lon,lat]=center||[114.0579,22.5431];
  container.innerHTML='';
  const wrap=document.createElement('div');wrap.className='gw-map-fallback-wrap';wrap.style.cssText='position:absolute;inset:0;background:#dbe7ef';
  const iframe=document.createElement('iframe');
  iframe.className='gw-map-fallback';iframe.title='全球天氣地圖';iframe.loading='eager';iframe.referrerPolicy='no-referrer-when-downgrade';
  const span=7,box=[lon-span,lat-span*.65,lon+span,lat+span*.65].join('%2C');
  iframe.src=`https://www.openstreetmap.org/export/embed.html?bbox=${box}&layer=mapnik&marker=${lat}%2C${lon}`;
  iframe.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#dbe7ef';
  const label=document.createElement('div');label.textContent='地圖備援模式';label.style.cssText='position:absolute;left:10px;bottom:10px;z-index:2;padding:5px 8px;border-radius:9px;background:rgba(0,0,0,.5);color:#fff;font:11px -apple-system,BlinkMacSystemFont,sans-serif;pointer-events:none';
  wrap.append(iframe,label);container.appendChild(wrap);onMove?.({lat,lon,zoom:4});
  onStatus?.({state:'fallback',source:'OpenStreetMap',reason:String(reason?.message||reason||'MapLibre unavailable')});
  return{map:null,isFallback:true,source:'OpenStreetMap',setBasemap(){return'fallback'},setWeatherOverlay(){return false},clearWeatherOverlay(){},flyTo(){},resize(){},destroy(){wrap.remove()}};
}

export async function mountMap(container,{center=[114.0579,22.5431],zoom=4.2,basemap='weather',onMove,onStatus}={}){
  if(!container||!document.body.contains(container))return null;
  container.style.minHeight='220px';
  onStatus?.({state:'loading',source:specFor(basemap).source});
  let gl;try{gl=await load()}catch(e){console.warn('[Global Weather] MapLibre unavailable, using OSM fallback',e);return fallbackMap(container,{center,onMove,onStatus,reason:e})}
  if(!container||!document.body.contains(container))return null;
  try{
    let activeSpec=specFor(basemap),activeOverlay=null;
    const map=new gl.Map({container,style:activeSpec.style(),center,zoom,minZoom:1.6,maxZoom:16,renderWorldCopies:true,attributionControl:true,fadeDuration:0});
    map.addControl(new gl.NavigationControl({showCompass:false}),'bottom-right');
    let settled=false,failed=false,ro=null,watchdog=0,destroyed=false;
    const notify=()=>{const c=map.getCenter();onMove?.({lat:c.lat,lon:c.lng,zoom:map.getZoom()})};
    const resize=()=>{if(destroyed||!container.isConnected||container.clientWidth<1||container.clientHeight<1)return;try{map.resize()}catch{}};
    const clearOverlay=()=>{try{if(map.getLayer(OVERLAY_LABEL))map.removeLayer(OVERLAY_LABEL);if(map.getLayer(OVERLAY_FIELD))map.removeLayer(OVERLAY_FIELD);if(map.getSource(OVERLAY_SOURCE))map.removeSource(OVERLAY_SOURCE)}catch{}};
    const applyOverlay=()=>{
      if(destroyed||!activeOverlay||!map.isStyleLoaded())return false;
      const {layer,geojson}=activeOverlay;if(!geojson?.features?.length)return false;
      try{
        const existing=map.getSource(OVERLAY_SOURCE);
        if(existing?.setData)existing.setData(geojson);else map.addSource(OVERLAY_SOURCE,{type:'geojson',data:geojson});
        if(!map.getLayer(OVERLAY_FIELD))map.addLayer({id:OVERLAY_FIELD,type:'circle',source:OVERLAY_SOURCE,paint:{
          'circle-radius':['interpolate',['linear'],['zoom'],2,34,5,54,8,82],
          'circle-color':overlayColor(layer),'circle-opacity':layer==='rain'?0.48:0.52,'circle-blur':0.78
        }});else{map.setPaintProperty(OVERLAY_FIELD,'circle-color',overlayColor(layer));map.setPaintProperty(OVERLAY_FIELD,'circle-opacity',layer==='rain'?0.48:0.52)}
        if(!map.getLayer(OVERLAY_LABEL))map.addLayer({id:OVERLAY_LABEL,type:'symbol',source:OVERLAY_SOURCE,minzoom:2.6,layout:{'text-field':['get','label'],'text-size':11,'text-allow-overlap':false},paint:{'text-color':'#fff','text-halo-color':'rgba(25,30,40,.75)','text-halo-width':1.4}});
        return true;
      }catch(e){console.warn('[Global Weather overlay]',e);return false}
    };
    const markReady=()=>{if(destroyed)return;settled=true;failed=false;clearTimeout(watchdog);resize();applyOverlay();notify();onStatus?.({state:'ready',source:activeSpec.source,basemap:activeSpec.id})};
    const failover=reason=>{if(destroyed||failed||settled||!container.isConnected)return;failed=true;clearTimeout(watchdog);console.warn('[Global Weather] map render failed, using OSM fallback',reason);try{ro?.disconnect?.();map.remove()}catch{}fallbackMap(container,{center,onMove,onStatus,reason})};
    const onStyleLoad=()=>{resize();applyOverlay()};
    map.on('moveend',notify);map.on('load',markReady);map.on('idle',markReady);map.on('style.load',onStyleLoad);
    map.on('error',e=>{console.warn('[Global Weather map]',e?.error||e);if(!settled)failover(e?.error||e)});
    watchdog=setTimeout(()=>failover(new Error('map first render timeout')),6500);
    try{ro=new ResizeObserver(()=>resize());ro.observe(container)}catch{}
    requestAnimationFrame(()=>{resize();requestAnimationFrame(resize)});
    return{map,isFallback:false,get source(){return activeSpec.source},resize,setWeatherOverlay(layer,geojson){activeOverlay={layer,geojson};return applyOverlay()},clearWeatherOverlay(){activeOverlay=null;clearOverlay()},setBasemap(id){const spec=specFor(id);activeSpec=spec;settled=false;failed=false;clearTimeout(watchdog);onStatus?.({state:'loading',source:spec.source,basemap:spec.id});watchdog=setTimeout(()=>failover(new Error('basemap render timeout')),6500);try{map.setStyle(spec.style(),{diff:true})}catch{map.setStyle(spec.style())}setTimeout(resize,60);return spec.id},flyTo(lon,lat,z=Math.max(map.getZoom(),6)){map.flyTo({center:[lon,lat],zoom:z,essential:false,duration:550})},destroy(){destroyed=true;activeOverlay=null;clearTimeout(watchdog);ro?.disconnect?.();map.off('moveend',notify);map.off('load',markReady);map.off('idle',markReady);map.off('style.load',onStyleLoad);try{map.remove()}catch{}}};
  }catch(e){console.warn('[Global Weather] map init failed, using OSM fallback',e);return fallbackMap(container,{center,onMove,onStatus,reason:e})}
}
