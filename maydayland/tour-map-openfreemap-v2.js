(()=>{
'use strict';
const VER='20260908-mayday-openfreemap-v2.1';
if(window.__maydayOpenFreeMap===VER)return;
window.__maydayOpenFreeMap=VER;
const LEAFLET_JS='https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js';
const LEAFLET_CSS='https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css';
const MAPLIBRE_JS='https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.js';
const MAPLIBRE_CSS='https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.css';
const BRIDGE_JS='https://unpkg.com/@maplibre/maplibre-gl-leaflet/leaflet-maplibre-gl.js';
const OFM='https://tiles.openfreemap.org/styles/';
const CITIES={
 taipei:{name:'台北',lat:25.0330,lon:121.5654},
 taichung:{name:'台中',lat:24.1477,lon:120.6736},
 kaohsiung:{name:'高雄',lat:22.6273,lon:120.3014},
 hongkong:{name:'香港',lat:22.3193,lon:114.1694},
 shanghai:{name:'上海',lat:31.2304,lon:121.4737},
 beijing:{name:'北京',lat:39.9042,lon:116.4074},
 shenzhen:{name:'深圳',lat:22.5431,lon:114.0579},
 singapore:{name:'新加坡',lat:1.3521,lon:103.8198},
 tokyo:{name:'東京',lat:35.6762,lon:139.6503}
};
const TOURS={
 t5525:{name:'5525 回到那一天',color:'#28d7ff',route:['taichung','kaohsiung','hongkong','beijing','shanghai','taipei']},
 wantsee:{name:'好好好想見到你',color:'#f7c65b',route:['kaohsiung','taichung','taipei','hongkong','shenzhen','shanghai']},
 life:{name:'LIFE 人生無限公司',color:'#9b84ff',route:['taipei','hongkong','shanghai','beijing','kaohsiung']},
 ark:{name:'諾亞方舟',color:'#ff7ea9',route:['taipei','kaohsiung','hongkong','shanghai','beijing']},
 dna:{name:'DNA 創造',color:'#72f5c6',route:['taipei','hongkong','shanghai','singapore','tokyo']}
};
const MODES={street:{kind:'vector',style:'liberty',label:'街道'},bright:{kind:'vector',style:'bright',label:'明亮'},terrain:{kind:'raster',label:'地形'},dark:{kind:'vector',style:'dark',label:'深色'},sat:{kind:'sat',label:'衛星'}};
let depsPromise=null,map=null,base=null,raster=null,routeLayer=null,markerLayer=null,mode='street',mountedStage=null;
function css(){if(document.getElementById('mayday-openfreemap-style'))return;const s=document.createElement('style');s.id='mayday-openfreemap-style';s.textContent=`
.map-stage.mayday-real-map{position:relative!important;min-height:520px!important;overflow:hidden!important;border-radius:18px;background:#07111d}
.map-stage.mayday-real-map>.map-svg,.map-stage.mayday-real-map>.city-btn{display:none!important}
.mayday-leaflet-map{position:absolute;inset:0;z-index:1;width:100%;height:100%;background:#07111d}
.mayday-leaflet-map .leaflet-maplibre-gl{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;pointer-events:none!important}
.mayday-leaflet-map .maplibregl-map{width:100%!important;height:100%!important}
.mayday-leaflet-map .leaflet-control-attribution{font-size:9px;background:rgba(5,9,18,.72)!important;color:#b9c8d8}.mayday-leaflet-map .leaflet-control-attribution a{color:#d9e7f5}
.mayday-map-modes{position:absolute;right:12px;top:12px;z-index:500;display:flex;gap:4px;padding:4px;border-radius:12px;background:rgba(5,9,18,.78);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(14px)}
.mayday-map-modes button{border:0;border-radius:8px;padding:7px 9px;background:transparent;color:#b8c8d8;font:600 11px/1 system-ui;cursor:pointer;white-space:nowrap}.mayday-map-modes button.on{background:rgba(255,255,255,.14);color:#fff}
.mayday-city-icon{background:transparent!important;border:0!important}.mayday-city-icon span{display:flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:50%;background:#fff;border:4px solid #17283b;box-shadow:0 0 0 2px rgba(255,255,255,.8),0 3px 12px rgba(0,0,0,.55)}
.mayday-city-icon.active span{border-color:#28d7ff;box-shadow:0 0 0 3px rgba(40,215,255,.28),0 3px 14px rgba(0,0,0,.58)}
.mayday-leaflet-map .leaflet-tooltip{border:1px solid rgba(255,255,255,.16);border-radius:10px;background:rgba(5,9,18,.92);color:#fff;box-shadow:0 8px 28px rgba(0,0,0,.3);font:600 12px/1.2 system-ui}.mayday-leaflet-map .leaflet-tooltip:before{display:none}
@media(max-width:720px){.map-stage.mayday-real-map{min-height:430px!important;overflow:hidden!important}.map-stage.mayday-real-map .mayday-map-modes{max-width:calc(100% - 24px);overflow-x:auto;scrollbar-width:none}.map-stage.mayday-real-map .mayday-map-modes::-webkit-scrollbar{display:none}}
`;document.head.appendChild(s)}
function loadCss(href,key){if(document.querySelector('link[data-mayday-map="'+key+'"]'))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;l.dataset.maydayMap=key;document.head.appendChild(l)}
function script(src,key,test){if(test())return Promise.resolve();const old=document.querySelector('script[data-mayday-map="'+key+'"]');if(old)return new Promise((res,rej)=>{old.addEventListener('load',()=>test()?res():rej(new Error(key)),{once:true});old.addEventListener('error',rej,{once:true})});return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.async=true;s.dataset.maydayMap=key;s.onload=()=>test()?res():rej(new Error(key));s.onerror=rej;document.head.appendChild(s)})}
function deps(){if(depsPromise)return depsPromise;loadCss(LEAFLET_CSS,'leaflet-css');loadCss(MAPLIBRE_CSS,'maplibre-css');depsPromise=script(LEAFLET_JS,'leaflet',()=>!!window.L).then(()=>script(MAPLIBRE_JS,'maplibre',()=>!!window.maplibregl)).then(()=>script(BRIDGE_JS,'bridge',()=>!!window.L?.maplibreGL));return depsPromise}
function addVector(style){if(!map||!window.L?.maplibreGL)return;removeRaster();const old=base;base=window.L.maplibreGL({style:OFM+style,pane:'tilePane',interactive:false,attributionControl:false,renderWorldCopies:false,fadeDuration:0,padding:.05});base.addTo(map);if(old&&old!==base)try{map.removeLayer(old)}catch(_){}try{map.attributionControl.addAttribution('OpenFreeMap © OpenMapTiles · OpenStreetMap')}catch(_){}}
function removeRaster(){if(raster&&map)try{map.removeLayer(raster)}catch(_){}raster=null}
function addRaster(kind){if(!map||!window.L)return;const old=base;if(old)try{map.removeLayer(old)}catch(_){}base=null;removeRaster();if(kind==='sat'){
 const img=L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2025_3857/default/g/{z}/{y}/{x}.jpg',{maxNativeZoom:14,maxZoom:18,attribution:'Sentinel-2 cloudless 2025 © EOX'});
 const labels=L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/overlay_3857/default/g/{z}/{y}/{x}.png',{maxZoom:18,opacity:.92});raster=L.layerGroup([img,labels]).addTo(map);
 }else{
 const img=L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg',{maxNativeZoom:17,maxZoom:18,attribution:'Terrain Light © EOX / OpenStreetMap'});
 const labels=L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/overlay_3857/default/g/{z}/{y}/{x}.png',{maxZoom:18,opacity:.9});raster=L.layerGroup([img,labels]).addTo(map);
 }}
function switchMode(next){if(!MODES[next]||next===mode)return;mode=next;const spec=MODES[next];if(spec.kind==='vector')addVector(spec.style);else addRaster(spec.kind);document.querySelectorAll('.mayday-map-modes button').forEach(b=>b.classList.toggle('on',b.dataset.mode===mode));setTimeout(()=>{try{map.invalidateSize(false)}catch(_){}},50)}
function selectedTour(){return document.querySelector('.tour.active[data-tour]')?.dataset.tour||window.MAYDAYLAND_CORE?.state?.tour||'all'}
function selectedCity(){return window.MAYDAYLAND_CORE?.state?.city||document.querySelector('.city-btn.active[data-city]')?.dataset.city||'taipei'}
function draw(){if(!map||!window.L)return;if(routeLayer)routeLayer.clearLayers();else routeLayer=L.layerGroup().addTo(map);if(markerLayer)markerLayer.clearLayers();else markerLayer=L.layerGroup().addTo(map);const active=selectedTour();Object.entries(TOURS).forEach(([id,t])=>{const pts=t.route.map(k=>[CITIES[k].lat,CITIES[k].lon]);L.polyline(pts,{color:t.color,weight:active==='all'||active===id?4.5:2,opacity:active==='all'||active===id?.95:.10,interactive:true}).bindTooltip(t.name,{sticky:true}).addTo(routeLayer)});
 const cityActive=selectedCity();Object.entries(CITIES).forEach(([id,c])=>{const icon=L.divIcon({className:'mayday-city-icon '+(id===cityActive?'active':''),html:'<span></span>',iconSize:[22,22],iconAnchor:[11,11]});const m=L.marker([c.lat,c.lon],{icon,title:c.name}).bindTooltip(c.name,{direction:'top',offset:[0,-10]});m.on('click',()=>{const btn=document.querySelector('.city-btn[data-city="'+id+'"]');if(btn)btn.click();else{document.dispatchEvent(new CustomEvent('mayday-city-map-select',{detail:{id}}))}setTimeout(draw,0)});m.addTo(markerLayer)});
}
function fitAll(){if(!map||!window.L)return;const pts=Object.values(CITIES).map(c=>[c.lat,c.lon]);map.fitBounds(L.latLngBounds(pts).pad(.12),{padding:[28,28],maxZoom:5,animate:false})}
function controls(stage){if(stage.querySelector('.mayday-map-modes'))return;const box=document.createElement('div');box.className='mayday-map-modes';box.setAttribute('aria-label','地圖底圖');box.innerHTML=Object.entries(MODES).map(([k,v])=>'<button type="button" data-mode="'+k+'" class="'+(k===mode?'on':'')+'">'+v.label+'</button>').join('');box.addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(b)switchMode(b.dataset.mode)});stage.appendChild(box)}
async function mount(){const stage=document.querySelector('#page-home .map-stage');if(!stage)return false;if(stage===mountedStage&&map){setTimeout(()=>map.invalidateSize(false),0);draw();return true}css();stage.classList.add('mayday-real-map');let host=stage.querySelector('.mayday-leaflet-map');if(!host){host=document.createElement('div');host.className='mayday-leaflet-map';host.setAttribute('aria-label','五月天巡演互動地圖');stage.appendChild(host)}controls(stage);try{await deps();if(!document.body.contains(stage))return false;map=L.map(host,{zoomControl:true,attributionControl:true,minZoom:2,maxZoom:18,worldCopyJump:false,preferCanvas:true});mountedStage=stage;addVector('liberty');draw();fitAll();new ResizeObserver(()=>{try{map.invalidateSize(false);map.__gl?.resize?.()}catch(_){}}).observe(stage);document.documentElement.dataset.maydaylandMap='openfreemap-v2.1';return true}catch(err){console.warn('[Maydayland] OpenFreeMap unavailable, OSM fallback',err);if(window.L&&!map){map=L.map(host,{zoomControl:true,minZoom:2,maxZoom:18});L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);mountedStage=stage;draw();fitAll();document.documentElement.dataset.maydaylandMap='osm-fallback'}return !!map}}
function sync(){if((location.hash||'#home').replace(/^#/,'').split('/')[0]!=='home')return;mount().then(()=>{draw();try{map?.invalidateSize(false)}catch(_){}})}
function boot(){css();let n=0;const wait=setInterval(()=>{if(mount()||n++>50)clearInterval(wait)},120);document.addEventListener('click',e=>{if(e.target.closest?.('[data-tour],[data-city],[data-page]'))setTimeout(sync,30)},true);window.addEventListener('hashchange',()=>setTimeout(sync,30));window.addEventListener('resize',()=>{try{map?.invalidateSize(false)}catch(_){}})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
