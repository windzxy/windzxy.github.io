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
  const flow=document.createElement('div');flow.style.cssText='display:none;position:absolute;right:10px;top:10px;z-index:3;padding:6px 9px;border-radius:10px;background:rgba(18,24,35,.68);color:#fff;font:11px -apple-system,BlinkMacSystemFont,sans-serif;backdrop-filter:blur(8px);pointer-events:none';
  wrap.append(iframe,label,flow);container.appendChild(wrap);onMove?.({lat,lon,zoom:4});
  onStatus?.({state:'fallback',source:'OpenStreetMap',reason:String(reason?.message||reason||'MapLibre unavailable')});
  return{map:null,isFallback:true,source:'OpenStreetMap',setBasemap(){return'fallback'},setWeatherOverlay(){return false},clearWeatherOverlay(){},setWindField(layer,geojson){const count=geojson?.features?.length||0;flow.textContent=count?`${layer==='gust'?'陣風':'風'}場 ${count} 點 · 靜態備援`:'風場不可用';flow.style.display='block';return count>0},clearWindField(){flow.style.display='none'},flyTo(){},resize(){},destroy(){wrap.remove()}};
}

export async function mountMap(container,{center=[114.0579,22.5431],zoom=4.2,basemap='weather',onMove,onStatus}={}){
  if(!container||!document.body.contains(container))return null;
  container.style.minHeight='220px';
  onStatus?.({state:'loading',source:specFor(basemap).source});
  let gl;try{gl=await load()}catch(e){console.warn('[Global Weather] MapLibre unavailable, using OSM fallback',e);return fallbackMap(container,{center,onMove,onStatus,reason:e})}
  if(!container||!document.body.contains(container))return null;
  try{
    let activeSpec=specFor(basemap),activeOverlay=null,windField=null;
    const map=new gl.Map({container,style:activeSpec.style(),center,zoom,minZoom:1.6,maxZoom:16,renderWorldCopies:true,attributionControl:true,fadeDuration:0});
    map.addControl(new gl.NavigationControl({showCompass:false}),'bottom-right');
    let settled=false,failed=false,ro=null,watchdog=0,destroyed=false,windCanvas=null,windCtx=null,windRaf=0,particles=[],windPaused=false;
    const reduceMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
    const notify=()=>{const c=map.getCenter();onMove?.({lat:c.lat,lon:c.lng,zoom:map.getZoom()})};
    const resizeWind=()=>{if(!windCanvas)return;const r=container.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);windCanvas.width=Math.max(1,Math.round(r.width*dpr));windCanvas.height=Math.max(1,Math.round(r.height*dpr));windCanvas.style.width=r.width+'px';windCanvas.style.height=r.height+'px';windCtx=windCanvas.getContext('2d');windCtx?.setTransform(dpr,0,0,dpr,0,0);particles=[]};
    const resize=()=>{if(destroyed||!container.isConnected||container.clientWidth<1||container.clientHeight<1)return;try{map.resize()}catch{}resizeWind()};
    const clearOverlay=()=>{try{if(map.getLayer(OVERLAY_LABEL))map.removeLayer(OVERLAY_LABEL);if(map.getLayer(OVERLAY_FIELD))map.removeLayer(OVERLAY_FIELD);if(map.getSource(OVERLAY_SOURCE))map.removeSource(OVERLAY_SOURCE)}catch{}};
    const applyOverlay=()=>{
      if(destroyed||!activeOverlay||!map.isStyleLoaded())return false;
      const {layer,geojson}=activeOverlay;if(!geojson?.features?.length)return false;
      try{
        const existing=map.getSource(OVERLAY_SOURCE);
        if(existing?.setData)existing.setData(geojson);else map.addSource(OVERLAY_SOURCE,{type:'geojson',data:geojson});
        if(!map.getLayer(OVERLAY_FIELD))map.addLayer({id:OVERLAY_FIELD,type:'circle',source:OVERLAY_SOURCE,paint:{'circle-radius':['interpolate',['linear'],['zoom'],2,34,5,54,8,82],'circle-color':overlayColor(layer),'circle-opacity':layer==='rain'?0.48:0.52,'circle-blur':0.78}});else{map.setPaintProperty(OVERLAY_FIELD,'circle-color',overlayColor(layer));map.setPaintProperty(OVERLAY_FIELD,'circle-opacity',layer==='rain'?0.48:0.52)}
        if(!map.getLayer(OVERLAY_LABEL))map.addLayer({id:OVERLAY_LABEL,type:'symbol',source:OVERLAY_SOURCE,minzoom:2.6,layout:{'text-field':['get','label'],'text-size':11,'text-allow-overlap':false},paint:{'text-color':'#fff','text-halo-color':'rgba(25,30,40,.75)','text-halo-width':1.4}});
        return true;
      }catch(e){console.warn('[Global Weather overlay]',e);return false}
    };
    const ensureWindCanvas=()=>{if(windCanvas)return windCanvas;windCanvas=document.createElement('canvas');windCanvas.className='gw-wind-canvas';windCanvas.setAttribute('aria-hidden','true');windCanvas.style.cssText='position:absolute;inset:0;z-index:3;pointer-events:none';container.appendChild(windCanvas);resizeWind();return windCanvas};
    const samples=()=>windField?.geojson?.features?.map(f=>({lon:Number(f.geometry?.coordinates?.[0]),lat:Number(f.geometry?.coordinates?.[1]),speed:Number(f.properties?.speed),direction:Number(f.properties?.direction)})).filter(s=>Number.isFinite(s.lon)&&Number.isFinite(s.lat)&&Number.isFinite(s.speed)&&Number.isFinite(s.direction))||[];
    const nearest=(lng,lat,list)=>{let best=null,bd=Infinity,cos=Math.max(.15,Math.cos(lat*Math.PI/180));for(const s of list){let dx=Math.abs(s.lon-lng);dx=Math.min(dx,360-dx)*cos;const dy=s.lat-lat,d=dx*dx+dy*dy;if(d<bd){bd=d;best=s}}return best};
    const resetParticle=(p,w,h)=>{p.x=Math.random()*w;p.y=Math.random()*h;p.age=Math.random()*80;p.max=70+Math.random()*100};
    const drawStaticWind=()=>{const list=samples();if(!windCtx||!list.length)return;const r=container.getBoundingClientRect();windCtx.clearRect(0,0,r.width,r.height);windCtx.lineWidth=1.5;windCtx.strokeStyle='rgba(238,248,255,.78)';for(const s of list){const pt=map.project([s.lon,s.lat]);if(pt.x<0||pt.y<0||pt.x>r.width||pt.y>r.height)continue;const a=(s.direction+180)*Math.PI/180,len=Math.max(8,Math.min(24,8+s.speed*.22)),dx=Math.sin(a)*len,dy=-Math.cos(a)*len;windCtx.beginPath();windCtx.moveTo(pt.x-dx*.45,pt.y-dy*.45);windCtx.lineTo(pt.x+dx*.55,pt.y+dy*.55);windCtx.stroke();const ex=pt.x+dx*.55,ey=pt.y+dy*.55;windCtx.beginPath();windCtx.moveTo(ex,ey);windCtx.lineTo(ex-Math.sin(a-.55)*5,ey+Math.cos(a-.55)*5);windCtx.moveTo(ex,ey);windCtx.lineTo(ex-Math.sin(a+.55)*5,ey+Math.cos(a+.55)*5);windCtx.stroke()}};
    const stopWindAnimation=()=>{if(windRaf)cancelAnimationFrame(windRaf);windRaf=0};
    const animateWind=()=>{stopWindAnimation();ensureWindCanvas();const list=samples(),r=container.getBoundingClientRect();if(!windCtx||!list.length)return;if(reduceMotion()){drawStaticWind();return}const count=Math.max(38,Math.min(120,Math.round(r.width*r.height/6200)));if(particles.length!==count){particles=Array.from({length:count},()=>{const p={};resetParticle(p,r.width,r.height);return p})}windCtx.clearRect(0,0,r.width,r.height);const frame=()=>{if(destroyed||windPaused||!windField||reduceMotion())return;windCtx.fillStyle='rgba(11,18,28,.075)';windCtx.fillRect(0,0,r.width,r.height);windCtx.lineWidth=1.15;for(const p of particles){let ll;try{ll=map.unproject([p.x,p.y])}catch{resetParticle(p,r.width,r.height);continue}const s=nearest(ll.lng,ll.lat,list);if(!s){resetParticle(p,r.width,r.height);continue}const a=(s.direction+180)*Math.PI/180,v=Math.max(.35,Math.min(3.1,s.speed*.045)),nx=p.x+Math.sin(a)*v,ny=p.y-Math.cos(a)*v;windCtx.strokeStyle=`rgba(225,244,255,${Math.max(.28,Math.min(.78,.28+s.speed/100))})`;windCtx.beginPath();windCtx.moveTo(p.x,p.y);windCtx.lineTo(nx,ny);windCtx.stroke();p.x=nx;p.y=ny;p.age++;if(nx<-6||ny<-6||nx>r.width+6||ny>r.height+6||p.age>p.max)resetParticle(p,r.width,r.height)}windRaf=requestAnimationFrame(frame)};windRaf=requestAnimationFrame(frame)};
    const applyWind=()=>{if(!windField?.geojson?.features?.length){stopWindAnimation();windCanvas?.remove();windCanvas=null;windCtx=null;return false}ensureWindCanvas();animateWind();return true};
    const markReady=()=>{if(destroyed)return;settled=true;failed=false;clearTimeout(watchdog);resize();applyOverlay();applyWind();notify();onStatus?.({state:'ready',source:activeSpec.source,basemap:activeSpec.id})};
    const failover=reason=>{if(destroyed||failed||settled||!container.isConnected)return;failed=true;clearTimeout(watchdog);console.warn('[Global Weather] map render failed, using OSM fallback',reason);stopWindAnimation();try{ro?.disconnect?.();map.remove()}catch{}fallbackMap(container,{center,onMove,onStatus,reason})};
    const onStyleLoad=()=>{resize();applyOverlay();applyWind()};
    const onMoveStart=()=>{windPaused=true;stopWindAnimation();if(windCtx&&windCanvas){const r=container.getBoundingClientRect();windCtx.clearRect(0,0,r.width,r.height)}};
    const onMoveEnd=()=>{windPaused=false;notify();applyWind()};
    map.on('moveend',onMoveEnd);map.on('movestart',onMoveStart);map.on('load',markReady);map.on('idle',markReady);map.on('style.load',onStyleLoad);
    map.on('error',e=>{console.warn('[Global Weather map]',e?.error||e);if(!settled)failover(e?.error||e)});
    watchdog=setTimeout(()=>failover(new Error('map first render timeout')),6500);
    try{ro=new ResizeObserver(()=>resize());ro.observe(container)}catch{}
    requestAnimationFrame(()=>{resize();requestAnimationFrame(resize)});
    return{map,isFallback:false,get source(){return activeSpec.source},resize,setWeatherOverlay(layer,geojson){activeOverlay={layer,geojson};return applyOverlay()},clearWeatherOverlay(){activeOverlay=null;clearOverlay()},setWindField(layer,geojson){windField={layer,geojson};return applyWind()},clearWindField(){windField=null;particles=[];stopWindAnimation();windCanvas?.remove();windCanvas=null;windCtx=null},setBasemap(id){const spec=specFor(id);activeSpec=spec;settled=false;failed=false;clearTimeout(watchdog);onStatus?.({state:'loading',source:spec.source,basemap:spec.id});watchdog=setTimeout(()=>failover(new Error('basemap render timeout')),6500);try{map.setStyle(spec.style(),{diff:true})}catch{map.setStyle(spec.style())}setTimeout(resize,60);return spec.id},flyTo(lon,lat,z=Math.max(map.getZoom(),6)){map.flyTo({center:[lon,lat],zoom:z,essential:false,duration:550})},destroy(){destroyed=true;activeOverlay=null;windField=null;stopWindAnimation();windCanvas?.remove();clearTimeout(watchdog);ro?.disconnect?.();map.off('moveend',onMoveEnd);map.off('movestart',onMoveStart);map.off('load',markReady);map.off('idle',markReady);map.off('style.load',onStyleLoad);try{map.remove()}catch{}}};
  }catch(e){console.warn('[Global Weather] map init failed, using OSM fallback',e);return fallbackMap(container,{center,onMove,onStatus,reason:e})}
}
