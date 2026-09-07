(()=>{'use strict';
const VER='20260907-typhoon-weather-p0-remount-v1';
if(window.__windzxyTyphoonWeatherP0Remount===VER)return;
window.__windzxyTyphoonWeatherP0Remount=VER;
const LABEL={
  'zh-HK':['雷達','衛星','降水','風','陣風','溫度','濕度','氣壓'],
  'zh-CN':['雷达','卫星','降水','风','阵风','温度','湿度','气压'],
  en:['Radar','Satellite','Rain','Wind','Gusts','Temperature','Humidity','Pressure']
};
const MODES=['radar','cloud','precip','wind','gust','temp','humidity','pressure'];
function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';return /^zh-CN/i.test(v)?'zh-CN':/^en/i.test(v)?'en':'zh-HK'}
function fallback(root){if(!root||root.querySelector('.tp-weather-v11'))return;let box=root.querySelector('.tp-weather-p0-fallback');if(box)return;box=document.createElement('div');box.className='tp-weather-p0-fallback';box.style.cssText='position:absolute;z-index:699;left:10px;top:48px;width:112px;padding:7px;display:grid;gap:3px;border:1px solid rgba(255,255,255,.16);border-radius:12px;background:rgba(8,25,38,.9);backdrop-filter:blur(14px);pointer-events:auto';const labels=LABEL[lang()];box.innerHTML='<strong style="padding:4px 6px;color:#f0f7ff;font:800 10px system-ui">'+(lang()==='en'?'Weather layers':lang()==='zh-CN'?'气象图层':'氣象圖層')+'</strong>'+MODES.map((m,i)=>'<button type="button" data-v11-mode="'+m+'" style="height:29px;border:0;border-radius:8px;background:rgba(255,255,255,.06);color:#eef6ff;text-align:left;padding:0 8px;font:750 10px system-ui;cursor:pointer">'+labels[i]+'</button>').join('');root.appendChild(box)}
function reload(root){if(!root||root.dataset.weatherP0Reload==='1')return;root.dataset.weatherP0Reload='1';try{if(root.dataset.v11Bound==='1')root.dataset.v11Bound='0';window.__windzxyTyphoonWeatherRuntimeV11='';const s=document.createElement('script');s.src='Html_tools/typhoon-weather-runtime-v11.js?v=20260907-p0-remount-'+Date.now();s.async=true;s.onload=()=>{setTimeout(()=>{root.querySelector('.tp-weather-p0-fallback')?.remove();if(!root.querySelector('.tp-weather-v11'))fallback(root)},250)};s.onerror=()=>fallback(root);document.head.appendChild(s)}catch(_){fallback(root)}}
function ensure(root){if(!root||!document.body.contains(root))return;if(root.querySelector('.tp-weather-v11')){root.querySelector('.tp-weather-p0-fallback')?.remove();return}reload(root);setTimeout(()=>{if(document.body.contains(root)&&!root.querySelector('.tp-weather-v11'))fallback(root)},900)}
function scan(scope=document){scope.querySelectorAll?.('[data-typhoon-root]').forEach(ensure)}
function boot(){scan();const host=document.getElementById('windowLayer')||document.body;new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1){if(n.matches?.('[data-typhoon-root]'))ensure(n);scan(n)}}).observe(host,{childList:true,subtree:true});setInterval(()=>scan(),2000);window.WebDeskTyphoonWeatherP0={version:'v1',runtimeRemount:true,visibleFallback:true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();