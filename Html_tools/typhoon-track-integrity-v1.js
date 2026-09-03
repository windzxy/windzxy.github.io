(()=>{
'use strict';
const VERSION='20260903-typhoon-track-integrity-v1';
if(window.__windzxyTyphoonTrackIntegrity===VERSION)return;
window.__windzxyTyphoonTrackIntegrity=VERSION;
const nativeFetch=window.fetch.bind(window);
function isTrackRequest(input){
  try{const raw=typeof input==='string'?input:input?.url||'';const u=new URL(raw,location.href);return /\/data\/typhoon\.json$/i.test(u.pathname)}catch(_){return false}
}
function finitePoint(p){return p&&Number.isFinite(+p.lat)&&Number.isFinite(+p.lon)&&+p.lat>=-90&&+p.lat<=90&&+p.lon>=-180&&+p.lon<=180}
function normalizeStorm(storm){
  const src=Array.isArray(storm?.points)?storm.points.filter(finitePoint):[];
  if(!src.length)return {...storm,points:[]};
  const analysis=src.filter(p=>p.kind==='analysis');
  const current=analysis.length?analysis[analysis.length-1]:null;
  if(!current)return {...storm,points:src};
  const past=src.filter(p=>p!==current&&p.kind!=='forecast'&&p.kind!=='analysis');
  const forecast=src.filter(p=>p.kind==='forecast');
  const currentTime=Date.parse(current.time||'');
  const safePast=past.filter(p=>{
    const ts=Date.parse(p.time||'');
    return !Number.isFinite(currentTime)||!Number.isFinite(ts)||ts<=currentTime;
  });
  const safeForecast=forecast.filter(p=>{
    const ts=Date.parse(p.time||'');
    return !Number.isFinite(currentTime)||!Number.isFinite(ts)||ts>currentTime;
  });
  return {...storm,instanceId:String(storm.id||storm.name||'storm')+'@'+String(storm.bulletinTime||current.time||''),points:[...safePast,current,...safeForecast]};
}
function normalize(data){
  if(!data||!Array.isArray(data.storms))return data;
  return {...data,storms:data.storms.map(normalizeStorm)};
}
window.fetch=async function(input,init){
  if(!isTrackRequest(input))return nativeFetch(input,init);
  const raw=typeof input==='string'?input:input.url;
  const u=new URL(raw,location.href);u.searchParams.set('_tp',String(Date.now()));
  const reqInit={...(init||{}),cache:'no-store',headers:{...((init&&init.headers)||{}),'Cache-Control':'no-cache'}};
  const res=await nativeFetch(u.toString(),reqInit);
  if(!res.ok)return res;
  try{
    const data=normalize(await res.clone().json());
    return new Response(JSON.stringify(data),{status:res.status,statusText:res.statusText,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
  }catch(_){return res}
};
})();
