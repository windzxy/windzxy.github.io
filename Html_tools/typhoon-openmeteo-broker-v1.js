(()=>{
'use strict';
const VER='20260910-typhoon-openmeteo-broker-v2.1-stable-shared-viewport';
if(window.__windzxyTyphoonOpenMeteoBroker===VER)return;
window.__windzxyTyphoonOpenMeteoBroker=VER;

const nativeFetch=window.fetch.bind(window);
const HOST='api.open-meteo.com';
const ALL_FIELDS=['temperature_2m','relative_humidity_2m','wind_speed_10m','wind_direction_10m','wind_gusts_10m','precipitation','pressure_msl','weather_code'];
const FIELD_UNITS={temperature_2m:'°C',relative_humidity_2m:'%',wind_speed_10m:'km/h',wind_direction_10m:'°',wind_gusts_10m:'km/h',precipitation:'mm',pressure_msl:'hPa',weather_code:'wmo code'};
const GENERIC_FRESH_MS=90000;
const SHARED_FRESH_MS=75000;
const STALE_MS=10*60*1000;
const MAX_ACTIVE=2;
const genericCache=new Map();
const genericInflight=new Map();
const genericQueue=[];
const HUBS=new WeakMap();
let active=0,seq=0;

function isOpenMeteo(input){try{const u=new URL(typeof input==='string'?input:input?.url,location.href);return u.hostname===HOST&&u.pathname.startsWith('/v1/forecast')}catch(_){return false}}
function urlOf(input){return new URL(typeof input==='string'?input:input.url,location.href).toString()}
function normLon(v){v=((+v+180)%360+360)%360-180;return v===-180?180:v}
function unwrapLon(v,center){v=+v;while(v-center>180)v-=360;while(v-center<-180)v+=360;return v}
function visibleRoot(){
  let best=null,bestArea=0;
  document.querySelectorAll('[data-typhoon-root]').forEach(root=>{
    if(!root.__tpMap)return;
    const r=root.getBoundingClientRect();
    const w=Math.max(0,Math.min(innerWidth,r.right)-Math.max(0,r.left));
    const h=Math.max(0,Math.min(innerHeight,r.bottom)-Math.max(0,r.top));
    const area=w*h;
    if(area>bestArea&&w>160&&h>160){best=root;bestArea=area}
  });
  return best;
}
function parsePoints(url){
  const u=new URL(url),latRaw=u.searchParams.get('latitude'),lonRaw=u.searchParams.get('longitude');
  if(!latRaw||!lonRaw)return null;
  const la=latRaw.split(',').map(Number),lo=lonRaw.split(',').map(Number);
  if(!la.length||la.length!==lo.length||la.some(v=>!Number.isFinite(v))||lo.some(v=>!Number.isFinite(v)))return null;
  return la.map((lat,i)=>({lat:Math.max(-89.4,Math.min(89.4,lat)),lon:normLon(lo[i])}));
}
function currentFields(url){return (new URL(url).searchParams.get('current')||'').split(',').map(s=>s.trim()).filter(Boolean)}
function isSharedCandidate(url){
  const pts=parsePoints(url),fields=currentFields(url);
  return !!(pts&&pts.length>=2&&pts.length<=80&&fields.length&&fields.every(f=>ALL_FIELDS.includes(f)));
}
function responseFrom(entry){return new Response(entry.body,{status:entry.status,statusText:entry.statusText,headers:entry.headers})}
function retryable(status){return status===408||status===425||status===429||status===500||status===502||status===503||status===504}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
async function nativeWithTimeout(url,init,ms){
  const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),ms),clean={...init};delete clean.signal;
  try{return await nativeFetch(url,{...clean,cache:'no-store',signal:ctl.signal})}finally{clearTimeout(t)}
}

function rememberGeneric(key,res,body){
  const headers={};try{res.headers.forEach((v,k)=>headers[k]=v)}catch(_){}
  const entry={body,status:res.status,statusText:res.statusText,headers,at:Date.now()};
  genericCache.set(key,entry);while(genericCache.size>64)genericCache.delete(genericCache.keys().next().value);return entry;
}
async function executeGeneric(task){
  const {url,key,init}=task;let lastErr=null;
  for(let attempt=0;attempt<2;attempt++){
    try{
      const res=await nativeWithTimeout(url,init,attempt?9000:7000);
      if(res.ok){const body=await res.text();return responseFrom(rememberGeneric(key,res,body))}
      if(!retryable(res.status))return res;
      lastErr=new Error('Open-Meteo '+res.status);
    }catch(err){lastErr=err}
    if(attempt===0)await sleep(320);
  }
  const stale=genericCache.get(key);
  if(stale&&Date.now()-stale.at<STALE_MS)return responseFrom(stale);
  throw lastErr||new Error('Open-Meteo request failed');
}
function pump(){while(active<MAX_ACTIVE&&genericQueue.length){const task=genericQueue.shift();active++;executeGeneric(task).then(task.resolve,task.reject).finally(()=>{active--;genericInflight.delete(task.key);pump()})}}
function genericFetch(url,init={}){
  const key=url,hit=genericCache.get(key);
  if(hit&&Date.now()-hit.at<GENERIC_FRESH_MS)return Promise.resolve(responseFrom(hit));
  if(genericInflight.has(key))return genericInflight.get(key).then(r=>r.clone());
  const p=new Promise((resolve,reject)=>{genericQueue.push({url,key,init:{...init},resolve,reject,seq:++seq});pump()});
  genericInflight.set(key,p);return p.then(r=>r.clone());
}

function hubState(root){
  let s=HUBS.get(root);
  if(!s){s={grid:null,previous:null,inflight:null,key:'',lastSuccess:0,failures:0};HUBS.set(root,s)}
  return s;
}
function mercY(lat){const r=Math.max(-85,Math.min(85,+lat))*Math.PI/180;return Math.log(Math.tan(Math.PI/4+r/2))}
function gridSpec(root){
  const map=root.__tpMap,size=map.getSize(),c=map.getCenter(),b=map.getBounds();
  let west=unwrapLon(b.getWest(),c.lng),east=unwrapLon(b.getEast(),c.lng);while(east<=west)east+=360;
  const lonSpan=Math.max(.1,east-west),south=Math.max(-84.8,b.getSouth()),north=Math.min(84.8,b.getNorth()),latSpan=Math.max(.1,north-south);
  west-=lonSpan*.10;east+=lonSpan*.10;
  const s=Math.max(-84.8,south-latSpan*.10),n=Math.min(84.8,north+latSpan*.10);
  const nx=size.x>1200?6:5,ny=4,pts=[];
  const yN=mercY(n),yS=mercY(s);
  for(let y=0;y<ny;y++){
    const fy=y/(ny-1),my=yN+(yS-yN)*fy,lat=180/Math.PI*(2*Math.atan(Math.exp(my))-Math.PI/2);
    for(let x=0;x<nx;x++){
      const lon=west+(east-west)*x/(nx-1);
      pts.push({lat,lon:normLon(lon)})
    }
  }
  const key=[Math.round(map.getZoom()*2)/2,Math.round(c.lat*2)/2,Math.round(normLon(c.lng)*2)/2,nx,ny].join('|');
  return{key,nx,ny,pts,west,east,south:s,north:n,centerLon:c.lng,size:{x:size.x,y:size.y}};
}
function hubUrl(spec){return 'https://api.open-meteo.com/v1/forecast?latitude='+spec.pts.map(p=>p.lat.toFixed(3)).join(',')+'&longitude='+spec.pts.map(p=>p.lon.toFixed(3)).join(',')+'&current='+ALL_FIELDS.join(',')+'&timezone=GMT&wind_speed_unit=kmh&precipitation_unit=mm'}
function gridCovers(grid,pts){
  if(!grid||!pts?.length)return false;
  const padLat=Math.max(.5,(grid.north-grid.south)*.06),padLon=Math.max(.5,(grid.east-grid.west)*.06);
  return pts.every(p=>{
    const lon=unwrapLon(p.lon,grid.centerLon);
    return p.lat>=grid.south-padLat&&p.lat<=grid.north+padLat&&lon>=grid.west-padLon&&lon<=grid.east+padLon;
  });
}
async function fetchHubGrid(root,force=false){
  const st=hubState(root),spec=gridSpec(root),now=Date.now();
  if(!force&&st.grid&&st.key===spec.key&&now-st.lastSuccess<SHARED_FRESH_MS)return st.grid;
  if(st.inflight&&st.inflight.key===spec.key)return st.inflight.promise;
  const p=(async()=>{
    let lastErr=null;
    for(let attempt=0;attempt<2;attempt++){
      try{
        const res=await nativeWithTimeout(hubUrl(spec),{},attempt?7800:5600);
        if(!res.ok)throw new Error('Open-Meteo '+res.status);
        const j=await res.json(),data=Array.isArray(j)?j:[j];
        if(data.length!==spec.pts.length)throw new Error('shared viewport grid incomplete');
        const grid={...spec,data,at:Date.now(),sourceTime:data.find(d=>d?.current?.time)?.current?.time||null};
        st.previous=st.grid;st.grid=grid;st.key=spec.key;st.lastSuccess=Date.now();st.failures=0;
        root.__tpSharedWeatherGrid=grid;
        try{root.dispatchEvent(new CustomEvent('typhoon-shared-weather-update',{detail:{grid,version:'v2.1'}}))}catch(_){}
        return grid;
      }catch(err){
        lastErr=err;
        st.failures++;
        if(st.grid&&Date.now()-st.grid.at<STALE_MS)return st.grid;
        if(attempt===0)await sleep(260);
      }
    }
    throw lastErr||new Error('shared viewport weather unavailable');
  })();
  st.inflight={key:spec.key,promise:p};
  try{return await p}finally{if(st.inflight?.promise===p)st.inflight=null}
}
function currentVal(d,k){const v=d?.current?.[k];return Number.isFinite(+v)?+v:NaN}
function weights(grid,lat,lon){
  lon=unwrapLon(lon,grid.centerLon);while(lon<grid.west)lon+=360;while(lon>grid.east)lon-=360;
  const fx=Math.max(0,Math.min(grid.nx-1,(lon-grid.west)/Math.max(.0001,grid.east-grid.west)*(grid.nx-1)));
  const yN=mercY(grid.north),yS=mercY(grid.south),my=mercY(lat);
  const fy=Math.max(0,Math.min(grid.ny-1,(my-yN)/Math.max(.0001,yS-yN)*(grid.ny-1)));
  const x0=Math.floor(fx),y0=Math.floor(fy),x1=Math.min(grid.nx-1,x0+1),y1=Math.min(grid.ny-1,y0+1),tx=fx-x0,ty=fy-y0;
  return{x0,y0,x1,y1,tx,ty};
}
function interpolate(grid,lat,lon,field){
  const w=weights(grid,lat,lon),at=(x,y)=>currentVal(grid.data[y*grid.nx+x],field);
  const a=at(w.x0,w.y0),b=at(w.x1,w.y0),c=at(w.x0,w.y1),d=at(w.x1,w.y1);
  if(field==='weather_code'){const vals=[a,b,c,d].filter(Number.isFinite);return vals.length?Math.round(vals[0]):NaN}
  if(field==='wind_direction_10m'){
    const vals=[[a,(1-w.tx)*(1-w.ty)],[b,w.tx*(1-w.ty)],[c,(1-w.tx)*w.ty],[d,w.tx*w.ty]].filter(q=>Number.isFinite(q[0]));
    if(!vals.length)return NaN;let sx=0,sy=0;for(const [deg,wt] of vals){const r=deg*Math.PI/180;sx+=Math.cos(r)*wt;sy+=Math.sin(r)*wt}return (Math.atan2(sy,sx)*180/Math.PI+360)%360;
  }
  if(![a,b,c,d].every(Number.isFinite)){for(const v of [a,b,c,d])if(Number.isFinite(v))return v;return NaN}
  return(a*(1-w.tx)+b*w.tx)*(1-w.ty)+(c*(1-w.tx)+d*w.tx)*w.ty;
}
function sampleItems(grid,pts,fields){
  const time=grid.sourceTime||new Date().toISOString().slice(0,16);
  return pts.map(p=>{
    const current={time,interval:900};
    for(const f of fields){const v=interpolate(grid,p.lat,p.lon,f);current[f]=Number.isFinite(v)?(f==='weather_code'?Math.round(v):v):null}
    return{latitude:p.lat,longitude:p.lon,current};
  });
}
function syntheticResponse(url,grid){
  const pts=parsePoints(url),fields=currentFields(url),items=sampleItems(grid,pts,fields);
  return new Response(JSON.stringify(items.map(item=>{
    const units={time:'iso8601',interval:'seconds'};for(const f of fields)units[f]=FIELD_UNITS[f]||'';
    return{...item,generationtime_ms:0,utc_offset_seconds:0,timezone:'GMT',timezone_abbreviation:'GMT',elevation:0,current_units:units};
  })),{status:200,headers:{'content-type':'application/json','x-webdesk-weather-source':'shared-viewport','x-webdesk-weather-grid':grid.nx+'x'+grid.ny}});
}
async function sharedFetch(url,init={}){
  const root=visibleRoot(),pts=parsePoints(url);
  if(!root||!pts)return genericFetch(url,init);
  const st=hubState(root),now=Date.now();
  if(st.grid&&gridCovers(st.grid,pts)){
    if(now-st.grid.at>SHARED_FRESH_MS&&!st.inflight)fetchHubGrid(root,false).catch(()=>{});
    return syntheticResponse(url,st.grid);
  }
  try{
    const grid=await fetchHubGrid(root,false);
    return gridCovers(grid,pts)?syntheticResponse(url,grid):genericFetch(url,init);
  }catch(_){return genericFetch(url,init)}
}
function brokerFetch(input,init={}){
  if(!isOpenMeteo(input))return nativeFetch(input,init);
  const method=String(init?.method||(typeof input!=='string'&&input?.method)||'GET').toUpperCase();
  if(method!=='GET')return nativeFetch(input,init);
  const url=urlOf(input);
  return isSharedCandidate(url)?sharedFetch(url,init):genericFetch(url,init);
}
window.fetch=brokerFetch;

function softenFailure(node){
  if(!(node instanceof Element))return;
  const s=node.matches?.('[data-layer-fix-status]')?node:node.querySelector?.('[data-layer-fix-status]');if(!s)return;
  const txt=s.textContent||'';if(!/載入失敗|回應逾時|資料.*失敗/.test(txt))return;
  const root=s.closest('[data-typhoon-root]');if(!root)return;
  const canvas=root.querySelector('.tp-weather-motion-canvas');
  const hasVisual=!!(root.__v11Overlay||root.__fastRadarLayer||root.__fastSatLayer||root.__tpSharedWeatherGrid||(canvas&&canvas.style.display!=='none'));
  if(hasVisual){s.textContent='資料源波動 · 已保留上一幀，背景同步中';s.style.color='#fde68a'}
}
const mo=new MutationObserver(ms=>ms.forEach(m=>softenFailure(m.target)));
function boot(){document.querySelectorAll('[data-layer-fix-status]').forEach(softenFailure);mo.observe(document.documentElement,{subtree:true,childList:true,characterData:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();

window.WebDeskTyphoonWeatherHub={
  version:'v2.1',source:'shared-viewport-grid',fields:ALL_FIELDS.slice(),freshMs:SHARED_FRESH_MS,staleMs:STALE_MS,
  get(root,force=false){return root?.__tpMap?fetchHubGrid(root,force):Promise.reject(new Error('typhoon map unavailable'))},
  async sample(root,pts,fields=ALL_FIELDS){const grid=await fetchHubGrid(root,false);return sampleItems(grid,pts,fields)},
  state(root){return root?hubState(root):null}
};
window.WebDeskTyphoonOpenMeteoBroker={version:'v2.1',maxConcurrent:MAX_ACTIVE,freshMs:GENERIC_FRESH_MS,sharedFreshMs:SHARED_FRESH_MS,staleMs:STALE_MS,genericCache,genericQueue,genericInflight,HUBS};
})();