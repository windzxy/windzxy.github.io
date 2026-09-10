(()=>{
'use strict';
const VER='20260910-typhoon-openmeteo-broker-v2.2-pan-safe';
if(window.__windzxyTyphoonOpenMeteoBroker===VER)return;
window.__windzxyTyphoonOpenMeteoBroker=VER;

const nativeFetch=window.fetch.bind(window);
const HOST='api.open-meteo.com';
const API='https://api.open-meteo.com/v1/forecast';
const ALL_FIELDS=['temperature_2m','relative_humidity_2m','wind_speed_10m','wind_direction_10m','wind_gusts_10m','precipitation','pressure_msl','weather_code'];
const FIELD_UNITS={temperature_2m:'°C',relative_humidity_2m:'%',wind_speed_10m:'km/h',wind_direction_10m:'°',wind_gusts_10m:'km/h',precipitation:'mm',pressure_msl:'hPa',weather_code:'wmo code'};
const FRESH_MS=90000,STALE_MS=20*60*1000;
const HUBS=new WeakMap();
const GENERIC_CACHE=new Map();
const GENERIC_INFLIGHT=new Map();
let genericActive=0;
const GENERIC_QUEUE=[];

function isOpenMeteo(input){try{const u=new URL(typeof input==='string'?input:input?.url,location.href);return u.hostname===HOST&&u.pathname.startsWith('/v1/forecast')}catch(_){return false}}
function urlOf(input){return new URL(typeof input==='string'?input:input.url,location.href).toString()}
function normLon(v){v=((+v+180)%360+360)%360-180;return v===-180?180:v}
function unwrapLon(v,c){v=+v;while(v-c>180)v-=360;while(v-c<-180)v+=360;return v}
function parsePoints(url){const u=new URL(url),a=(u.searchParams.get('latitude')||'').split(',').map(Number),o=(u.searchParams.get('longitude')||'').split(',').map(Number);if(!a.length||a.length!==o.length||a.some(v=>!Number.isFinite(v))||o.some(v=>!Number.isFinite(v)))return null;return a.map((lat,i)=>({lat:Math.max(-89.4,Math.min(89.4,lat)),lon:normLon(o[i])}))}
function fieldsOf(url){return(new URL(url).searchParams.get('current')||'').split(',').map(s=>s.trim()).filter(Boolean)}
function sharedCandidate(url){const p=parsePoints(url),f=fieldsOf(url);return!!(p&&p.length>=2&&p.length<=100&&f.length&&f.every(x=>ALL_FIELDS.includes(x)))}
function visibleRoot(){let best=null,area=0;document.querySelectorAll('[data-typhoon-root]').forEach(r=>{if(!r.__tpMap)return;const b=r.getBoundingClientRect(),w=Math.max(0,Math.min(innerWidth,b.right)-Math.max(0,b.left)),h=Math.max(0,Math.min(innerHeight,b.bottom)-Math.max(0,b.top)),a=w*h;if(a>area&&w>160&&h>160){best=r;area=a}});return best}
function timeoutFetch(url,ms=6500){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);return nativeFetch(url,{cache:'no-store',signal:c.signal}).finally(()=>clearTimeout(t))}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function response(body,status=200,headers={'content-type':'application/json'}){return new Response(body,{status,headers})}

function state(root){let s=HUBS.get(root);if(!s){s={grid:null,key:'',at:0,inflight:null,moving:false,bound:false,timer:0,failures:0};HUBS.set(root,s);bind(root,s)}return s}
function bind(root,s){if(s.bound||!root.__tpMap)return;s.bound=true;const map=root.__tpMap;map.on('movestart zoomstart',()=>{s.moving=true;clearTimeout(s.timer)});map.on('moveend zoomend',()=>{s.moving=false;clearTimeout(s.timer);s.timer=setTimeout(()=>refreshHub(root,true).catch(()=>{}),160)});map.on('resize',()=>{clearTimeout(s.timer);s.timer=setTimeout(()=>refreshHub(root,false).catch(()=>{}),220)})}
function spec(root){const map=root.__tpMap,b=map.getBounds(),c=map.getCenter();let w=unwrapLon(b.getWest(),c.lng),e=unwrapLon(b.getEast(),c.lng);while(e<=w)e+=360;const south=Math.max(-84,b.getSouth()),north=Math.min(84,b.getNorth()),px=(e-w)*.10,py=(north-south)*.10;w-=px;e+=px;const s=Math.max(-84,south-py),n=Math.min(84,north+py),nx=3,ny=3,pts=[];for(let y=0;y<ny;y++)for(let x=0;x<nx;x++)pts.push({lat:n-(n-s)*y/(ny-1),lon:normLon(w+(e-w)*x/(nx-1))});const key=[Math.round(map.getZoom()),Math.round(c.lat),Math.round(normLon(c.lng))].join('|');return{key,nx,ny,pts,west:w,east:e,south:s,north:n,centerLon:c.lng}}
function urlFor(pts){return API+'?latitude='+pts.map(p=>p.lat.toFixed(3)).join(',')+'&longitude='+pts.map(p=>p.lon.toFixed(3)).join(',')+'&current='+ALL_FIELDS.join(',')+'&timezone=GMT&wind_speed_unit=kmh&precipitation_unit=mm'}
function normalize(j,count){const a=Array.isArray(j)?j:[j];return a.length===count?a:null}
function replicate(sp,d){return sp.pts.map(p=>({...d,latitude:p.lat,longitude:p.lon,current:{...(d.current||{})}}))}
async function requestGrid(sp){let err=null;try{const r=await timeoutFetch(urlFor(sp.pts),6200);if(!r.ok)throw new Error('Open-Meteo '+r.status);const d=normalize(await r.json(),sp.pts.length);if(!d)throw new Error('grid incomplete');return{...sp,data:d,degraded:false,at:Date.now(),sourceTime:d.find(x=>x?.current?.time)?.current?.time||null}}catch(e){err=e}
 try{const mid=sp.pts[Math.floor(sp.pts.length/2)],r=await timeoutFetch(urlFor([mid]),4800);if(!r.ok)throw new Error('Open-Meteo '+r.status);const j=await r.json(),d=Array.isArray(j)?j[0]:j;if(!d?.current)throw new Error('center incomplete');return{...sp,data:replicate(sp,d),degraded:true,at:Date.now(),sourceTime:d.current.time||null}}catch(e){throw err||e}}
async function refreshHub(root,force=false){const s=state(root),sp=spec(root),now=Date.now();if(!force&&s.grid&&s.key===sp.key&&now-s.at<FRESH_MS)return s.grid;if(s.moving&&s.grid)return s.grid;if(s.inflight)return s.grid||s.inflight;const p=(async()=>{try{const g=await requestGrid(sp);s.grid=g;s.key=sp.key;s.at=g.at;s.failures=0;root.__tpSharedWeatherGrid=g;try{root.dispatchEvent(new CustomEvent('typhoon-shared-weather-update',{detail:{grid:g,version:'v2.2'}}))}catch(_){}return g}catch(e){s.failures++;if(s.grid&&Date.now()-s.grid.at<STALE_MS)return s.grid;throw e}})();s.inflight=p;try{return await p}finally{if(s.inflight===p)s.inflight=null}}
function cv(d,k){const v=+(d?.current?.[k]);return Number.isFinite(v)?v:NaN}
function weights(g,lat,lon){lon=unwrapLon(lon,g.centerLon);while(lon<g.west)lon+=360;while(lon>g.east)lon-=360;const fx=Math.max(0,Math.min(g.nx-1,(lon-g.west)/Math.max(.0001,g.east-g.west)*(g.nx-1))),fy=Math.max(0,Math.min(g.ny-1,(g.north-lat)/Math.max(.0001,g.north-g.south)*(g.ny-1))),x0=Math.floor(fx),y0=Math.floor(fy),x1=Math.min(g.nx-1,x0+1),y1=Math.min(g.ny-1,y0+1);return{x0,y0,x1,y1,tx:fx-x0,ty:fy-y0}}
function interp(g,lat,lon,k){const q=weights(g,lat,lon),at=(x,y)=>cv(g.data[y*g.nx+x],k),a=at(q.x0,q.y0),b=at(q.x1,q.y0),c=at(q.x0,q.y1),d=at(q.x1,q.y1);if(k==='weather_code'){const v=[a,b,c,d].find(Number.isFinite);return Number.isFinite(v)?Math.round(v):NaN}if(k==='wind_direction_10m'){const v=[[a,(1-q.tx)*(1-q.ty)],[b,q.tx*(1-q.ty)],[c,(1-q.tx)*q.ty],[d,q.tx*q.ty]].filter(x=>Number.isFinite(x[0]));if(!v.length)return NaN;let sx=0,sy=0;for(const [deg,w] of v){const r=deg*Math.PI/180;sx+=Math.cos(r)*w;sy+=Math.sin(r)*w}return(Math.atan2(sy,sx)*180/Math.PI+360)%360}if(![a,b,c,d].every(Number.isFinite)){const v=[a,b,c,d].find(Number.isFinite);return Number.isFinite(v)?v:NaN}return(a*(1-q.tx)+b*q.tx)*(1-q.ty)+(c*(1-q.tx)+d*q.tx)*q.ty}
function synthetic(url,g){const pts=parsePoints(url),fs=fieldsOf(url),time=g.sourceTime||new Date().toISOString().slice(0,16),items=pts.map(p=>{const cur={time,interval:900},units={time:'iso8601',interval:'seconds'};for(const f of fs){const v=interp(g,p.lat,p.lon,f);cur[f]=Number.isFinite(v)?(f==='weather_code'?Math.round(v):v):null;units[f]=FIELD_UNITS[f]||''}return{latitude:p.lat,longitude:p.lon,generationtime_ms:0,utc_offset_seconds:0,timezone:'GMT',timezone_abbreviation:'GMT',elevation:0,current_units:units,current:cur}});return response(JSON.stringify(items),200,{'content-type':'application/json','x-webdesk-weather-source':g.degraded?'shared-center-fallback':'shared-3x3','x-webdesk-weather-stale':String(Date.now()-g.at>FRESH_MS)})}
async function sharedFetch(url){const root=visibleRoot();if(!root)return genericFetch(url);const s=state(root);if(s.grid){const wanted=spec(root);if(!s.moving&&s.key!==wanted.key&&!s.inflight)refreshHub(root,true).catch(()=>{});return synthetic(url,s.grid)}try{return synthetic(url,await refreshHub(root,false))}catch(_){return genericFetch(url)}}

function cloneEntry(e){return response(e.body,e.status,e.headers)}
async function doGeneric(url){let last=null;for(let i=0;i<2;i++){try{const r=await timeoutFetch(url,i?8000:6000);if(r.ok){const body=await r.text(),headers={};try{r.headers.forEach((v,k)=>headers[k]=v)}catch(_){}const e={body,status:r.status,headers,at:Date.now()};GENERIC_CACHE.set(url,e);while(GENERIC_CACHE.size>32)GENERIC_CACHE.delete(GENERIC_CACHE.keys().next().value);return cloneEntry(e)}last=new Error('Open-Meteo '+r.status)}catch(e){last=e}if(i===0)await sleep(280)}const e=GENERIC_CACHE.get(url);if(e&&Date.now()-e.at<STALE_MS)return cloneEntry(e);throw last||new Error('Open-Meteo failed')}
function pump(){while(genericActive<1&&GENERIC_QUEUE.length){const t=GENERIC_QUEUE.shift();genericActive++;doGeneric(t.url).then(t.resolve,t.reject).finally(()=>{genericActive--;GENERIC_INFLIGHT.delete(t.url);pump()})}}
function genericFetch(url){const hit=GENERIC_CACHE.get(url);if(hit&&Date.now()-hit.at<FRESH_MS)return Promise.resolve(cloneEntry(hit));if(GENERIC_INFLIGHT.has(url))return GENERIC_INFLIGHT.get(url).then(r=>r.clone());const p=new Promise((resolve,reject)=>{GENERIC_QUEUE.push({url,resolve,reject});pump()});GENERIC_INFLIGHT.set(url,p);return p.then(r=>r.clone())}
function brokerFetch(input,init={}){if(!isOpenMeteo(input))return nativeFetch(input,init);const method=String(init?.method||(typeof input!=='string'&&input?.method)||'GET').toUpperCase();if(method!=='GET')return nativeFetch(input,init);const url=urlOf(input);return sharedCandidate(url)?sharedFetch(url):genericFetch(url)}
window.fetch=brokerFetch;

function soften(node){if(!(node instanceof Element))return;const el=node.matches?.('[data-layer-fix-status]')?node:node.querySelector?.('[data-layer-fix-status]');if(!el)return;const txt=el.textContent||'';if(!/載入失敗|回應逾時|資料.*失敗/.test(txt))return;const root=el.closest('[data-typhoon-root]');if(!root)return;const s=state(root);if(s.grid||root.__v11Overlay||root.__fastRadarLayer||root.__fastSatLayer){el.textContent=s.moving?'移動中 · 保留上一幀':'資料源波動 · 保留上一幀並背景同步';el.style.color='#fde68a'}}
function boot(){const mo=new MutationObserver(ms=>ms.forEach(m=>soften(m.target)));mo.observe(document.documentElement,{subtree:true,childList:true,characterData:true});setInterval(()=>document.querySelectorAll('[data-typhoon-root]').forEach(r=>{if(r.__tpMap)state(r)}),1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();

window.WebDeskTyphoonWeatherHub={version:'v2.2',source:'pan-safe-shared-3x3',fields:ALL_FIELDS.slice(),freshMs:FRESH_MS,staleMs:STALE_MS,get:(root,force=false)=>refreshHub(root,force),state};
window.WebDeskTyphoonOpenMeteoBroker={version:'v2.2',sharedGrid:'3x3',singleHubInflight:true,noFetchDuringPan:true,centerFallback:true,maxGenericConcurrent:1};
})();