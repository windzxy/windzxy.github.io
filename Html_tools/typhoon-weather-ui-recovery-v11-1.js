(()=>{'use strict';
const VER='20260903-typhoon-weather-ui-recovery-v11.2-passive';
if(window.__windzxyTyphoonWeatherUiRecovery===VER)return;window.__windzxyTyphoonWeatherUiRecovery=VER;
const T={'zh-HK':{radar:'雷達',cloud:'衛星',precip:'降水',wind:'風',gust:'陣風',temp:'溫度',humidity:'濕度',pressure:'氣壓',now:'現在',live:'實況',forecast:'預報'},'zh-CN':{radar:'雷达',cloud:'卫星',precip:'降水',wind:'风',gust:'阵风',temp:'温度',humidity:'湿度',pressure:'气压',now:'现在',live:'实况',forecast:'预报'},en:{radar:'Radar',cloud:'Satellite',precip:'Rain',wind:'Wind',gust:'Gusts',temp:'Temperature',humidity:'Humidity',pressure:'Pressure',now:'Now',live:'Live',forecast:'Forecast'}};
function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';return /^zh-CN/i.test(v)?'zh-CN':/^en/i.test(v)?'en':'zh-HK'}
function t(k){return T[lang()]?.[k]||T['zh-HK'][k]||k}
function build(root){
  if(!root||!document.body.contains(root)||root.querySelector('.tp-weather-v11'))return false;
  const w=document.createElement('div');w.className='tp-weather-v11';w.dataset.v11Recovered='1';
  w.innerHTML='<div class="layer-list"><span class="group">LIVE</span><button data-v11-mode="radar">'+t('radar')+'</button><button data-v11-mode="cloud">'+t('cloud')+'</button><span class="group forecast">FORECAST</span>'+['precip','wind','gust','temp','humidity','pressure'].map(k=>'<button data-v11-mode="'+k+'">'+t(k)+'</button>').join('')+'</div><div class="timeline"><button class="play" data-v11-play>▶</button><div class="slider"><input data-v11-time type="range" min="0" max="48" step="1" value="'+String(root.__v11Hour||0)+'"><div class="ticks"><span>'+t('now')+'</span><span>+12h</span><span>+24h</span><span>+48h</span></div></div><div class="when"><strong data-v11-label>--</strong><small data-v11-kind>'+t('forecast')+'</small></div></div>';
  root.appendChild(w);
  if(!root.querySelector('.v11-status')){const s=document.createElement('div');s.className='v11-status';root.appendChild(s)}
  if(!root.querySelector('.v11-legend')){const l=document.createElement('div');l.className='v11-legend';l.innerHTML='<i></i><span></span>';root.appendChild(l)}
  const mode=root.__v11Mode||'radar';root.querySelectorAll('[data-v11-mode]').forEach(b=>b.classList.toggle('on',b.dataset.v11Mode===mode));
  root.dataset.v11RecoveryDone='1';
  return true;
}
function recoverOnce(root){
  if(!root||!document.body.contains(root)||root.dataset.v11RecoveryDone==='1'||root.querySelector('.tp-weather-v11'))return;
  let tries=0;
  const wait=()=>{
    if(!document.body.contains(root)||root.dataset.v11RecoveryDone==='1'||root.querySelector('.tp-weather-v11'))return;
    if(root.dataset.v11Bound==='1'){build(root);return}
    if(tries++<20)setTimeout(wait,100);
  };
  setTimeout(wait,120);
}
function scan(scope=document){scope.querySelectorAll?.('[data-typhoon-root]').forEach(recoverOnce)}
function boot(){
  scan();
  const host=document.getElementById('windowLayer')||document.body;
  new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1){if(n.matches?.('[data-typhoon-root]'))recoverOnce(n);scan(n)}}).observe(host,{childList:true,subtree:true});
  window.WebDeskTyphoonWeatherUiRecovery={version:'v11.2',selfHealing:false,passiveSingleShot:true};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();