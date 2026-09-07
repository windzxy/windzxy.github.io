(()=>{'use strict';
const VER='20260907-typhoon-weather-ui-recovery-v11.3-self-heal';
if(window.__windzxyTyphoonWeatherUiRecovery===VER)return;window.__windzxyTyphoonWeatherUiRecovery=VER;
const T={'zh-HK':{radar:'雷達',cloud:'衛星',precip:'降水',wind:'風',gust:'陣風',temp:'溫度',humidity:'濕度',pressure:'氣壓',now:'現在',live:'實況',forecast:'預報',layers:'氣象圖層'},'zh-CN':{radar:'雷达',cloud:'卫星',precip:'降水',wind:'风',gust:'阵风',temp:'温度',humidity:'湿度',pressure:'气压',now:'现在',live:'实况',forecast:'预报',layers:'气象图层'},en:{radar:'Radar',cloud:'Satellite',precip:'Rain',wind:'Wind',gust:'Gusts',temp:'Temperature',humidity:'Humidity',pressure:'Pressure',now:'Now',live:'Live',forecast:'Forecast',layers:'Weather layers'}};
function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';return /^zh-CN/i.test(v)?'zh-CN':/^en/i.test(v)?'en':'zh-HK'}
function t(k){return T[lang()]?.[k]||T['zh-HK'][k]||k}
function style(){if(document.getElementById('tpWeatherRecoveryV113Css'))return;const s=document.createElement('style');s.id='tpWeatherRecoveryV113Css';s.textContent=`
[data-typhoon-root] .tp-weather-v11 .v11-layer-title{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:4px 7px 6px;margin-bottom:2px;border-bottom:1px solid rgba(255,255,255,.09);color:#f0f7ff;font:850 9px/1 system-ui;letter-spacing:.04em;white-space:nowrap}
[data-typhoon-root] .tp-weather-v11 .v11-layer-title::after{content:'LIVE';padding:2px 5px;border-radius:999px;background:rgba(34,197,94,.14);color:#86efac;font:850 7px/1 system-ui;letter-spacing:.08em}
@container(max-width:720px){[data-typhoon-root] .tp-weather-v11 .v11-layer-title{position:sticky;left:0;flex:0 0 auto;border-bottom:0;border-right:1px solid rgba(255,255,255,.09);margin:0 3px 0 0;padding:0 8px}[data-typhoon-root] .tp-weather-v11 .v11-layer-title::after{display:none}}
`;document.head.appendChild(s)}
function decorate(root){const list=root?.querySelector?.('.tp-weather-v11 .layer-list');if(!list)return false;let title=list.querySelector('.v11-layer-title');if(!title){title=document.createElement('div');title.className='v11-layer-title';list.prepend(title)}title.textContent=t('layers');root.dataset.v11LayerPanelVisible='1';return true}
function build(root){
  if(!root||!document.body.contains(root)||root.querySelector('.tp-weather-v11')||root.dataset.v11Bound!=='1')return false;
  const w=document.createElement('div');w.className='tp-weather-v11';w.dataset.v11Recovered='1';
  w.innerHTML='<div class="layer-list"><div class="v11-layer-title">'+t('layers')+'</div><span class="group">LIVE</span><button data-v11-mode="radar">'+t('radar')+'</button><button data-v11-mode="cloud">'+t('cloud')+'</button><span class="group forecast">FORECAST</span>'+['precip','wind','gust','temp','humidity','pressure'].map(k=>'<button data-v11-mode="'+k+'">'+t(k)+'</button>').join('')+'</div><div class="timeline"><button class="play" data-v11-play>▶</button><div class="slider"><input data-v11-time type="range" min="0" max="48" step="1" value="'+String(root.__v11Hour||0)+'"><div class="ticks"><span>'+t('now')+'</span><span>+12h</span><span>+24h</span><span>+48h</span></div></div><div class="when"><strong data-v11-label>--</strong><small data-v11-kind>'+t('forecast')+'</small></div></div>';
  root.appendChild(w);
  if(!root.querySelector('.v11-status')){const s=document.createElement('div');s.className='v11-status';root.appendChild(s)}
  if(!root.querySelector('.v11-legend')){const l=document.createElement('div');l.className='v11-legend';l.innerHTML='<i></i><span></span>';root.appendChild(l)}
  const mode=root.__v11Mode||'radar';root.querySelectorAll('[data-v11-mode]').forEach(b=>b.classList.toggle('on',b.dataset.v11Mode===mode));
  root.dataset.v11RecoveryDone='1';root.dataset.v11LayerPanelVisible='1';
  return true;
}
function relabel(root){if(!root)return;const title=root.querySelector('.v11-layer-title');if(title)title.textContent=t('layers');root.querySelectorAll('[data-v11-mode]').forEach(b=>{const k=b.dataset.v11Mode;if(T['zh-HK'][k])b.textContent=t(k)});const now=root.querySelector('.ticks span');if(now)now.textContent=t('now')}
function heal(root){if(!root||!document.body.contains(root))return false;if(root.querySelector('.tp-weather-v11')){decorate(root);relabel(root);return true}if(root.dataset.v11Bound==='1')return build(root);return false}
function watch(root){if(!root||root.dataset.v11RecoveryWatch==='1')return;root.dataset.v11RecoveryWatch='1';let timer=0;const schedule=()=>{clearTimeout(timer);timer=setTimeout(()=>heal(root),60)};new MutationObserver(schedule).observe(root,{childList:true,subtree:false});let tries=0;const wait=()=>{if(!document.body.contains(root))return;if(heal(root))return;if(tries++<80)setTimeout(wait,100)};wait()}
function scan(scope=document){scope.querySelectorAll?.('[data-typhoon-root]').forEach(root=>{watch(root);heal(root)})}
function boot(){
  style();scan();
  const host=document.getElementById('windowLayer')||document.body;
  new MutationObserver(ms=>{for(const m of ms){for(const n of m.addedNodes)if(n.nodeType===1){if(n.matches?.('[data-typhoon-root]')){watch(n);heal(n)}scan(n)}const root=m.target?.closest?.('[data-typhoon-root]');if(root)heal(root)}}).observe(host,{childList:true,subtree:true});
  document.addEventListener('change',e=>{if(e.target?.matches('.lang-select'))setTimeout(()=>document.querySelectorAll('[data-typhoon-root]').forEach(root=>{heal(root);relabel(root)}),0)},true);
  setInterval(()=>document.querySelectorAll('[data-typhoon-root]').forEach(heal),2500);
  window.WebDeskTyphoonWeatherUiRecovery={version:'v11.3',selfHealing:true,passiveSingleShot:false,functionalOnly:true,layerPanelTitle:true};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();