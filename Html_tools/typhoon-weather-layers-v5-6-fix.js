(()=>{'use strict';
const VER='20260901-typhoon-weather-v5.6-control-fix';
if(window.__windzxyTyphoonWeatherV56===VER)return;
window.__windzxyTyphoonWeatherV56=VER;
const TXT={
  open:{'zh-CN':'图层','zh-HK':'圖層',en:'Layers'},
  title:{'zh-CN':'气象图层','zh-HK':'氣象圖層',en:'Weather layers'},
  radar:{'zh-CN':'雷达降水','zh-HK':'雷達降水',en:'Radar'},
  cloud:{'zh-CN':'卫星云图','zh-HK':'衛星雲圖',en:'Satellite'},
  precip:{'zh-CN':'降水','zh-HK':'降水',en:'Precipitation'},
  wind:{'zh-CN':'风速','zh-HK':'風速',en:'Wind'},
  gust:{'zh-CN':'阵风','zh-HK':'陣風',en:'Gusts'},
  pressure:{'zh-CN':'气压','zh-HK':'氣壓',en:'Pressure'},
  model:{'zh-CN':'模式：Open-Meteo','zh-HK':'模式：Open-Meteo',en:'Model: Open-Meteo'},
  now:{'zh-CN':'现在','zh-HK':'現在',en:'Now'}
};
const OFFSETS=[0,3,6,12,24];
function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';if(/^zh-CN/i.test(v)||/Hans/i.test(v))return'zh-CN';if(/^en/i.test(v))return'en';return'zh-HK'}
function t(k){return TXT[k]?.[lang()]||TXT[k]?.['zh-HK']||k}
function installStyle(){if(document.getElementById('typhoonWeatherV56FixStyle'))return;const s=document.createElement('style');s.id='typhoonWeatherV56FixStyle';s.textContent=`
.tpv4-maptools .tpv55-wrap{position:relative!important;z-index:650!important;display:block!important}
.tpv4-maptools .tpv55-open{display:block!important;min-width:48px!important;height:34px!important;padding:0 10px!important;border:1px solid rgba(255,255,255,.18)!important;border-radius:17px!important;background:rgba(15,28,40,.88)!important;color:#fff!important;font-size:9px!important;font-weight:900!important;box-shadow:0 5px 16px rgba(0,0,0,.18)!important;cursor:pointer!important}
.tpv4-maptools .tpv55-open:hover{background:rgba(18,45,67,.94)!important}
.tpv4-maptools .tpv55-panel{z-index:900!important}
`;document.head.appendChild(s)}
function markup(){return `<button type="button" class="tpv55-open" data-tpv55-open>${t('open')}</button><div class="tpv55-panel" data-tpv55-panel><div class="tpv55-title"><strong>${t('title')}</strong><small>${t('model')}</small></div><div class="tpv55-grid"><button data-tpv55-layer="radar">${t('radar')}</button><button data-tpv55-layer="cloud">${t('cloud')}</button><button data-tpv55-layer="precip">${t('precip')}</button><button data-tpv55-layer="wind">${t('wind')}</button><button data-tpv55-layer="gust">${t('gust')}</button><button data-tpv55-layer="pressure">${t('pressure')}</button></div><div class="tpv55-timebar" data-tpv55-timebar>${OFFSETS.map((h,i)=>`<button data-tpv55-hour="${h}" class="${i===0?'on':''}">${h===0?t('now'):'+'+h+'h'}</button>`).join('')}</div><div class="tpv55-meta"><span data-tpv55-modeltime>--</span><span>Open-Meteo</span></div></div>`}
function inject(root){if(!root||!root.isConnected)return false;if(root.querySelector('[data-tpv55-open]'))return true;const tools=root.querySelector('.tpv4-maptools');if(!tools)return false;const wrap=document.createElement('div');wrap.className='tpv55-wrap';wrap.innerHTML=markup();tools.insertBefore(wrap,tools.firstChild||null);if(!root.querySelector('[data-tpv55-status]')){const st=document.createElement('div');st.className='tpv55-status';st.dataset.tpv55Status='1';root.appendChild(st)}if(!root.querySelector('[data-tpv55-legend]')){const lg=document.createElement('div');lg.className='tpv55-legend';lg.dataset.tpv55Legend='1';lg.innerHTML='<span data-tpv55-legend-title></span><i class="tpv55-swatch"></i>';root.appendChild(lg)}root.dataset.tpv55Ui='1';return true}
function scan(scope=document){if(scope.matches?.('[data-typhoon-root]'))inject(scope);scope.querySelectorAll?.('[data-typhoon-root]').forEach(inject)}
function boot(){installStyle();scan();const host=document.getElementById('windowLayer')||document.body;new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)scan(n)}).observe(host,{childList:true,subtree:true});let tries=0;const retry=setInterval(()=>{tries++;scan();if(tries>=40)clearInterval(retry)},250);document.addEventListener('change',e=>{if(!e.target?.matches('.lang-select'))return;setTimeout(()=>document.querySelectorAll('[data-typhoon-root]').forEach(root=>{root.querySelector('.tpv55-wrap')?.remove();root.dataset.tpv55Ui='';inject(root)}),0)},true);window.WebDeskTyphoonWeatherControlFix={version:'v5.6',reason:'late-maptools-initialization'} }
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();