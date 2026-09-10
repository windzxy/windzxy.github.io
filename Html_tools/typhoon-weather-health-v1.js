(()=>{
'use strict';
const VER='20260911-typhoon-weather-health-v1.0';
if(window.__windzxyTyphoonWeatherHealth===VER)return;
window.__windzxyTyphoonWeatherHealth=VER;
const STATES=new WeakMap();
const MAX_STALE=6*60*1000;
function hub(){return window.WebDeskTyphoonWeatherHub}
function state(root){let s=STATES.get(root);if(!s){s={lastOk:0,failures:0,timer:0,bound:false,provider:'',recovering:false};STATES.set(root,s)}return s}
function badge(root){let el=root.querySelector('.tp-weather-health');if(el)return el;el=document.createElement('div');el.className='tp-weather-health';el.setAttribute('role','status');el.setAttribute('aria-live','polite');Object.assign(el.style,{position:'absolute',right:'12px',bottom:'12px',zIndex:'690',padding:'6px 9px',borderRadius:'999px',background:'rgba(8,25,38,.78)',border:'1px solid rgba(255,255,255,.13)',color:'#dcecff',font:'700 9px/1.2 system-ui',pointerEvents:'none',backdropFilter:'blur(10px)',opacity:'0',transition:'opacity .18s'});root.appendChild(el);return el}
function show(root,text,hold=2600){const el=badge(root);el.textContent=text;el.style.opacity='1';clearTimeout(el.__hide);el.__hide=setTimeout(()=>{el.style.opacity='0'},hold)}
function nextDelay(f){return Math.min(120000,5000*Math.pow(2,Math.min(4,Math.max(0,f-1))))}
function schedule(root,immediate=false){const s=state(root);clearTimeout(s.timer);if(document.hidden||!root.isConnected)return;const delay=immediate?120:nextDelay(Math.max(1,s.failures));s.timer=setTimeout(()=>recover(root),delay)}
async function recover(root){if(document.hidden||!root.isConnected||!root.__tpMap)return;const h=hub(),s=state(root);if(!h?.get||s.recovering)return;s.recovering=true;try{const g=await h.get(root,true);if(g){s.lastOk=g.at||Date.now();s.failures=0;s.provider=g.provider||'';show(root,'氣象資料已更新 · '+(s.provider||'Weather'),1800)}}catch(_){s.failures++;show(root,'氣象資料暫時不可用 · 自動重試',3000);schedule(root,false)}finally{s.recovering=false}}
function bind(root){const s=state(root);if(s.bound)return;s.bound=true;root.addEventListener('typhoon-shared-weather-update',e=>{const g=e.detail?.grid;s.lastOk=g?.at||Date.now();s.failures=0;s.provider=e.detail?.provider||g?.provider||''});const map=root.__tpMap;if(map?.on){let t=0;const refresh=()=>{clearTimeout(t);t=setTimeout(()=>{const age=Date.now()-(root.__tpSharedWeatherGrid?.at||s.lastOk||0);if(age>MAX_STALE)schedule(root,true)},260)};map.on('moveend zoomend',refresh)}}
function scan(){document.querySelectorAll('[data-typhoon-root]').forEach(root=>{if(!root.__tpMap)return;bind(root);const s=state(root),age=Date.now()-(root.__tpSharedWeatherGrid?.at||s.lastOk||0);if(age>MAX_STALE&&!s.recovering&&!s.timer)schedule(root,true)})}
window.addEventListener('pageshow',()=>setTimeout(scan,120));window.addEventListener('online',()=>setTimeout(()=>document.querySelectorAll('[data-typhoon-root]').forEach(r=>schedule(r,true)),120));document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>document.querySelectorAll('[data-typhoon-root]').forEach(r=>schedule(r,true)),160)});setInterval(scan,5000);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();
})();