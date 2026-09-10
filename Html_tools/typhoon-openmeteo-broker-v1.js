(()=>{
'use strict';
const VER='20260910-typhoon-openmeteo-broker-v1.0';
if(window.__windzxyTyphoonOpenMeteoBroker===VER)return;
window.__windzxyTyphoonOpenMeteoBroker=VER;

const nativeFetch=window.fetch.bind(window);
const HOST='api.open-meteo.com';
const MAX_ACTIVE=3;
const FRESH_MS=75000;
const STALE_MS=10*60*1000;
const cache=new Map();
const inflight=new Map();
const queue=[];
let active=0,seq=0;

function isOpenMeteo(input){
  try{const u=new URL(typeof input==='string'?input:input?.url,location.href);return u.hostname===HOST&&u.pathname.startsWith('/v1/forecast')}catch(_){return false}
}
function urlOf(input){return new URL(typeof input==='string'?input:input.url,location.href).toString()}
function responseFrom(entry){return new Response(entry.body,{status:entry.status,statusText:entry.statusText,headers:entry.headers})}
function remember(key,res,body){
  const headers={};
  try{res.headers.forEach((v,k)=>headers[k]=v)}catch(_){}
  const entry={body,status:res.status,statusText:res.statusText,headers,at:Date.now()};
  cache.set(key,entry);
  while(cache.size>48)cache.delete(cache.keys().next().value);
  return entry;
}
function retryable(status){return status===408||status===425||status===429||status===500||status===502||status===503||status===504}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
async function nativeWithTimeout(url,init,ms){
  const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),ms);
  const clean={...init};delete clean.signal;
  try{return await nativeFetch(url,{...clean,cache:'no-store',signal:ctl.signal})}finally{clearTimeout(t)}
}
async function execute(task){
  const {url,key,init}=task;
  let lastErr=null;
  for(let attempt=0;attempt<3;attempt++){
    try{
      const res=await nativeWithTimeout(url,init,attempt===0?8000:10000);
      if(res.ok){const body=await res.text(),entry=remember(key,res,body);return responseFrom(entry)}
      if(!retryable(res.status))return res;
      lastErr=new Error('Open-Meteo '+res.status);
    }catch(err){lastErr=err}
    if(attempt<2)await sleep(attempt===0?260:720);
  }
  const stale=cache.get(key);
  if(stale&&Date.now()-stale.at<STALE_MS)return responseFrom(stale);
  throw lastErr||new Error('Open-Meteo request failed');
}
function pump(){
  while(active<MAX_ACTIVE&&queue.length){
    const task=queue.shift();active++;
    execute(task).then(task.resolve,task.reject).finally(()=>{active--;inflight.delete(task.key);pump()});
  }
}
function brokerFetch(input,init={}){
  if(!isOpenMeteo(input))return nativeFetch(input,init);
  const method=String(init?.method||(typeof input!=='string'&&input?.method)||'GET').toUpperCase();
  if(method!=='GET')return nativeFetch(input,init);
  const url=urlOf(input),key=url;
  const hit=cache.get(key);
  if(hit&&Date.now()-hit.at<FRESH_MS)return Promise.resolve(responseFrom(hit));
  if(inflight.has(key))return inflight.get(key).then(r=>r.clone());
  const p=new Promise((resolve,reject)=>{queue.push({url,key,init:{...init},resolve,reject,seq:++seq,at:Date.now()});pump()});
  inflight.set(key,p);
  return p.then(r=>r.clone());
}
window.fetch=brokerFetch;

function softenFailure(node){
  if(!(node instanceof Element))return;
  const s=node.matches?.('[data-layer-fix-status]')?node:node.querySelector?.('[data-layer-fix-status]');
  if(!s)return;
  const txt=s.textContent||'';
  if(!/載入失敗|回應逾時|資料.*失敗/.test(txt))return;
  const root=s.closest('[data-typhoon-root]');
  if(!root)return;
  const canvas=root.querySelector('.tp-weather-motion-canvas');
  const hasVisual=!!(root.__v11Overlay||root.__fastRadarLayer||root.__fastSatLayer||(canvas&&canvas.style.display!=='none'));
  if(hasVisual){s.textContent='網絡波動 · 已保留上一幀，正在背景重試';s.style.color='#fde68a'}
}
const mo=new MutationObserver(ms=>ms.forEach(m=>softenFailure(m.target)));
function boot(){
  document.querySelectorAll('[data-layer-fix-status]').forEach(softenFailure);
  mo.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();

window.WebDeskTyphoonOpenMeteoBroker={version:'v1.0',maxConcurrent:MAX_ACTIVE,freshMs:FRESH_MS,staleMs:STALE_MS,cache,queue,inflight};
})();