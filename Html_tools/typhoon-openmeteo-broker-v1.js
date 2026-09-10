(()=>{
'use strict';
const VER='20260910-typhoon-openmeteo-broker-v2.3-fail-open';
if(window.__windzxyTyphoonOpenMeteoBroker===VER)return;
window.__windzxyTyphoonOpenMeteoBroker=VER;

/*
  IMPORTANT STABILITY RULE
  ------------------------
  Do not monkey-patch window.fetch. The v2.0-v2.2 interceptor could turn one
  provider/network problem into a complete weather outage because every scalar
  layer, city-label request and motion request passed through the same wrapper.

  v2.3 keeps the shared viewport hub as an opt-in data source while leaving the
  browser's native fetch untouched. Existing weather modules therefore fail open:
  if the hub is unavailable they continue using their own direct provider request
  instead of losing all weather information at once.
*/
const nativeFetch=window.fetch.bind(window);
const API='https://api.open-meteo.com/v1/forecast';
const ALL_FIELDS=['temperature_2m','relative_humidity_2m','wind_speed_10m','wind_direction_10m','wind_gusts_10m','precipitation','pressure_msl','weather_code'];
const FRESH_MS=90000;
const STALE_MS=20*60*1000;
const HUBS=new WeakMap();

function normLon(v){v=((+v+180)%360+360)%360-180;return v===-180?180:v}
function unwrapLon(v,c){v=+v;while(v-c>180)v-=360;while(v-c<-180)v+=360;return v}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function timeoutFetch(url,ms=6500){
  const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);
  return nativeFetch(url,{cache:'no-store',signal:c.signal}).finally(()=>clearTimeout(t));
}
function state(root){
  let s=HUBS.get(root);
  if(!s){s={grid:null,key:'',at:0,inflight:null,moving:false,bound:false,timer:0,failures:0};HUBS.set(root,s);bind(root,s)}
  return s;
}
function bind(root,s){
  if(s.bound||!root.__tpMap)return;
  s.bound=true;
  const map=root.__tpMap;
  map.on('movestart zoomstart',()=>{s.moving=true;clearTimeout(s.timer)});
  map.on('moveend zoomend',()=>{s.moving=false;clearTimeout(s.timer);s.timer=setTimeout(()=>refreshHub(root,true).catch(()=>{}),220)});
  map.on('resize',()=>{clearTimeout(s.timer);s.timer=setTimeout(()=>refreshHub(root,false).catch(()=>{}),260)});
}
function spec(root){
  const map=root.__tpMap,b=map.getBounds(),c=map.getCenter();
  let w=unwrapLon(b.getWest(),c.lng),e=unwrapLon(b.getEast(),c.lng);while(e<=w)e+=360;
  const south=Math.max(-84,b.getSouth()),north=Math.min(84,b.getNorth()),px=(e-w)*.08,py=(north-south)*.08;
  w-=px;e+=px;
  const s=Math.max(-84,south-py),n=Math.min(84,north+py),nx=3,ny=3,pts=[];
  for(let y=0;y<ny;y++)for(let x=0;x<nx;x++)pts.push({lat:n-(n-s)*y/(ny-1),lon:normLon(w+(e-w)*x/(nx-1))});
  const key=[Math.round(map.getZoom()),Math.round(c.lat),Math.round(normLon(c.lng))].join('|');
  return{key,nx,ny,pts,west:w,east:e,south:s,north:n,centerLon:c.lng};
}
function urlFor(pts){
  return API+'?latitude='+pts.map(p=>p.lat.toFixed(3)).join(',')+
    '&longitude='+pts.map(p=>p.lon.toFixed(3)).join(',')+
    '&current='+ALL_FIELDS.join(',')+
    '&timezone=GMT&wind_speed_unit=kmh&precipitation_unit=mm';
}
function normalize(j,count){const a=Array.isArray(j)?j:[j];return a.length===count?a:null}
function replicate(sp,d){return sp.pts.map(p=>({...d,latitude:p.lat,longitude:p.lon,current:{...(d.current||{})}}))}
async function requestGrid(sp){
  let firstErr=null;
  try{
    const r=await timeoutFetch(urlFor(sp.pts),5200);
    if(!r.ok)throw new Error('Open-Meteo '+r.status);
    const d=normalize(await r.json(),sp.pts.length);
    if(!d)throw new Error('grid incomplete');
    return{...sp,data:d,degraded:false,at:Date.now(),sourceTime:d.find(x=>x?.current?.time)?.current?.time||null};
  }catch(e){firstErr=e}
  /* If a multi-coordinate call is rejected or times out, fall back to one point.
     This is hub-only; it never blocks the normal weather modules. */
  try{
    const mid=sp.pts[Math.floor(sp.pts.length/2)],r=await timeoutFetch(urlFor([mid]),4200);
    if(!r.ok)throw new Error('Open-Meteo '+r.status);
    const j=await r.json(),d=Array.isArray(j)?j[0]:j;
    if(!d?.current)throw new Error('center incomplete');
    return{...sp,data:replicate(sp,d),degraded:true,at:Date.now(),sourceTime:d.current.time||null};
  }catch(e){throw firstErr||e}
}
async function refreshHub(root,force=false){
  if(!root?.__tpMap)throw new Error('typhoon map unavailable');
  const s=state(root),sp=spec(root),now=Date.now();
  if(!force&&s.grid&&s.key===sp.key&&now-s.at<FRESH_MS)return s.grid;
  if(s.moving&&s.grid)return s.grid;
  if(s.inflight)return s.grid||s.inflight;
  const p=(async()=>{
    try{
      const g=await requestGrid(sp);
      s.grid=g;s.key=sp.key;s.at=g.at;s.failures=0;
      root.__tpSharedWeatherGrid=g;
      try{root.dispatchEvent(new CustomEvent('typhoon-shared-weather-update',{detail:{grid:g,version:'v2.3'}}))}catch(_){}
      return g;
    }catch(e){
      s.failures++;
      if(s.grid&&Date.now()-s.grid.at<STALE_MS)return s.grid;
      throw e;
    }
  })();
  s.inflight=p;
  try{return await p}finally{if(s.inflight===p)s.inflight=null}
}
function cv(d,k){const v=+(d?.current?.[k]);return Number.isFinite(v)?v:NaN}
function weights(g,lat,lon){
  lon=unwrapLon(lon,g.centerLon);while(lon<g.west)lon+=360;while(lon>g.east)lon-=360;
  const fx=Math.max(0,Math.min(g.nx-1,(lon-g.west)/Math.max(.0001,g.east-g.west)*(g.nx-1)));
  const fy=Math.max(0,Math.min(g.ny-1,(g.north-lat)/Math.max(.0001,g.north-g.south)*(g.ny-1)));
  const x0=Math.floor(fx),y0=Math.floor(fy),x1=Math.min(g.nx-1,x0+1),y1=Math.min(g.ny-1,y0+1);
  return{x0,y0,x1,y1,tx:fx-x0,ty:fy-y0};
}
function sample(grid,lat,lon,field){
  if(!grid)return NaN;
  const q=weights(grid,lat,lon),at=(x,y)=>cv(grid.data[y*grid.nx+x],field);
  const a=at(q.x0,q.y0),b=at(q.x1,q.y0),c=at(q.x0,q.y1),d=at(q.x1,q.y1);
  if(field==='weather_code'){const v=[a,b,c,d].find(Number.isFinite);return Number.isFinite(v)?Math.round(v):NaN}
  if(field==='wind_direction_10m'){
    const vals=[[a,(1-q.tx)*(1-q.ty)],[b,q.tx*(1-q.ty)],[c,(1-q.tx)*q.ty],[d,q.tx*q.ty]].filter(x=>Number.isFinite(x[0]));
    if(!vals.length)return NaN;let sx=0,sy=0;
    for(const [deg,w] of vals){const r=deg*Math.PI/180;sx+=Math.cos(r)*w;sy+=Math.sin(r)*w}
    return(Math.atan2(sy,sx)*180/Math.PI+360)%360;
  }
  const vals=[a,b,c,d];if(!vals.every(Number.isFinite)){const v=vals.find(Number.isFinite);return Number.isFinite(v)?v:NaN}
  return(a*(1-q.tx)+b*q.tx)*(1-q.ty)+(c*(1-q.tx)+d*q.tx)*q.ty;
}
function boot(){
  setInterval(()=>document.querySelectorAll('[data-typhoon-root]').forEach(root=>{
    if(root.__tpMap){state(root);if(!state(root).grid&&!state(root).moving)refreshHub(root,false).catch(()=>{})}
  }),1800);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();

/* Native fetch intentionally remains untouched. */
window.WebDeskTyphoonWeatherHub={
  version:'v2.3',source:'opt-in-shared-3x3-fail-open',fields:ALL_FIELDS.slice(),freshMs:FRESH_MS,staleMs:STALE_MS,
  get:(root,force=false)=>refreshHub(root,force),state,sample
};
window.WebDeskTyphoonOpenMeteoBroker={version:'v2.3',interceptsFetch:false,failOpen:true,sharedGrid:'3x3',centerFallback:true};
})();