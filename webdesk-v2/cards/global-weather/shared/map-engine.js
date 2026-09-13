const MAPLIBRE_JS='https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.js';
const MAPLIBRE_CSS='https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.css';
const OFM='https://tiles.openfreemap.org/styles/';
let loader=null;

export const basemaps=[
  {id:'street',label:'街道',style:()=>OFM+'liberty'},
  {id:'bright',label:'明亮',style:()=>OFM+'bright'},
  {id:'weather',label:'氣象',style:()=>OFM+'fiord'},
  {id:'dark',label:'深色',style:()=>OFM+'dark'},
  {id:'terrain',label:'地形',style:()=>rasterStyle('https://tiles.maps.eox.at/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg','EOX Terrain Light')},
  {id:'sat',label:'衛星',style:()=>rasterStyle('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2025_3857/default/g/{z}/{y}/{x}.jpg','EOX Sentinel-2 cloudless 2025')}
];

function rasterStyle(tile,attribution){return{version:8,sources:{base:{type:'raster',tiles:[tile],tileSize:256,attribution}},layers:[{id:'base',type:'raster',source:'base',minzoom:0,maxzoom:22}]}}
function ensureCss(){if(document.querySelector('link[data-gw-maplibre]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href=MAPLIBRE_CSS;link.dataset.gwMaplibre='1';document.head.appendChild(link)}
function load(){if(window.maplibregl)return Promise.resolve(window.maplibregl);if(loader)return loader;ensureCss();loader=new Promise((resolve,reject)=>{const old=document.querySelector('script[data-gw-maplibre]');if(old){old.addEventListener('load',()=>window.maplibregl?resolve(window.maplibregl):reject(new Error('MapLibre unavailable')),{once:true});old.addEventListener('error',reject,{once:true});return}const s=document.createElement('script');s.src=MAPLIBRE_JS;s.async=true;s.dataset.gwMaplibre='1';s.onload=()=>window.maplibregl?resolve(window.maplibregl):reject(new Error('MapLibre unavailable'));s.onerror=()=>reject(new Error('MapLibre load failed'));document.head.appendChild(s)});return loader}
function specFor(id){return basemaps.find(x=>x.id===id)||basemaps[0]}

export async function mountMap(container,{center=[114.0579,22.5431],zoom=4.2,basemap='weather',onMove}={}){
  const gl=await load();
  if(!container||!document.body.contains(container))return null;
  const map=new gl.Map({container,style:specFor(basemap).style(),center,zoom,minZoom:1.6,maxZoom:16,renderWorldCopies:true,attributionControl:true,fadeDuration:0});
  map.addControl(new gl.NavigationControl({showCompass:false}),'bottom-right');
  const notify=()=>{const c=map.getCenter();onMove?.({lat:c.lat,lon:c.lng,zoom:map.getZoom()})};
  map.on('moveend',notify);
  map.on('load',notify);
  let ro=null;try{ro=new ResizeObserver(()=>map.resize());ro.observe(container)}catch{}
  return{
    map,
    setBasemap(id){const spec=specFor(id);try{map.setStyle(spec.style(),{diff:true})}catch{map.setStyle(spec.style())}return spec.id},
    flyTo(lon,lat,z=Math.max(map.getZoom(),6)){map.flyTo({center:[lon,lat],zoom:z,essential:false,duration:550})},
    destroy(){ro?.disconnect?.();map.off('moveend',notify);try{map.remove()}catch{}}
  };
}
