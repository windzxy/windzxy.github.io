(()=>{'use strict';
const VER='20260913-typhoon-weather-p0-remount-v10-human-ui';
if(window.__windzxyTyphoonWeatherP0Remount===VER)return;
window.__windzxyTyphoonWeatherP0Remount=VER;
const LABEL={
  'zh-HK':{radar:'雷達',cloud:'衛星',precip:'降水',wind:'風場',gust:'陣風',temp:'溫度',humidity:'濕度',pressure:'氣壓',layers:'全球氣象',forecast:'預報圖層',updated:'資料時間',collapse:'收起',expand:'展開'},
  'zh-CN':{radar:'雷达',cloud:'卫星',precip:'降水',wind:'风场',gust:'阵风',temp:'温度',humidity:'湿度',pressure:'气压',layers:'全球气象',forecast:'预报图层',updated:'资料时间',collapse:'收起',expand:'展开'},
  en:{radar:'Radar',cloud:'Satellite',precip:'Rain',wind:'Wind',gust:'Gusts',temp:'Temperature',humidity:'Humidity',pressure:'Pressure',layers:'Global Weather',forecast:'Forecast layer',updated:'Data time',collapse:'Collapse',expand:'Expand'}
};
const MODES=['radar','cloud','precip','wind','gust','temp','humidity','pressure'];
const FORECAST=['precip','wind','gust','temp','humidity','pressure'];
const mirrors=new WeakMap();
function lang(){const v=document.querySelector('.lang-select')?.value||localStorage.getItem('windzxy-lang')||document.documentElement.lang||'zh-HK';return /^zh-CN/i.test(v)?'zh-CN':/^en/i.test(v)?'en':'zh-HK'}
function labels(){return LABEL[lang()]||LABEL['zh-HK']}
function visible(el){if(!el)return false;const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0'&&el.getClientRects().length>0}
function rootVisible(root){if(!visible(root))return false;const r=root.getBoundingClientRect();return r.width>80&&r.height>80&&r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth}
function ensureStyle(){let s=document.getElementById('tpWeatherSingleControllerCss');if(!s){s=document.createElement('style');s.id='tpWeatherSingleControllerCss';(document.head||document.documentElement).appendChild(s)}s.textContent=`
[data-typhoon-root] .tp-weather-v11 .layer-list,[data-typhoon-root] .tpv41-radarbar,[data-typhoon-root] .tpv41-radar-status,[data-typhoon-root] .tpv51-satbar,[data-typhoon-root] .tpv51-sat-status,[data-typhoon-root] .tpv41-radar-toggle,[data-typhoon-root] .tpv51-cloud-toggle{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
[data-typhoon-root]>.tp-weather-p0-global{display:grid}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-head]{grid-column:1/-1;display:flex;align-items:center;gap:8px}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-title]{flex:1;min-width:0}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-collapse]{appearance:none;border:0;background:transparent;color:inherit;cursor:pointer}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-body]{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:7px}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-select-wrap]{grid-column:1/-1;display:grid;gap:4px}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-select-label]{font:700 8px/1 system-ui;color:#8fb3ca}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-select]{width:100%;min-width:0}
[data-typhoon-root]>.tp-weather-p0-global[data-collapsed="1"] [data-p0-body],
[data-typhoon-root]>.tp-weather-p0-global[data-collapsed="1"] [data-layer-freshness]{display:none!important}
[data-typhoon-root]>.tp-weather-p0-global [data-layer-freshness]{grid-column:1/-1;color:#b9d7e8}
`;}
ensureStyle();
function realPanel(root){return root?.querySelector?.('.tp-weather-v11')||null}
function hideLegacy(root){root?.querySelectorAll?.('.tp-weather-v11 .layer-list,.tpv41-radarbar,.tpv41-radar-status,.tpv51-satbar,.tpv51-sat-status,.tpv41-radar-toggle,.tpv51-cloud-toggle').forEach(el=>{el.style.setProperty('display','none','important');el.style.setProperty('visibility','hidden','important');el.style.setProperty('opacity','0','important');el.style.setProperty('pointer-events','none','important')})}
function runtimeReady(root){const p=realPanel(root);if(!p)return false;return MODES.some(mode=>!!p.querySelector('[data-v11-mode="'+mode+'"]'))}
function cleanupStale(){document.querySelectorAll('.tp-weather-p0-global').forEach(box=>{if(!box.closest('[data-typhoon-root]'))box.remove()})}
function currentMode(root,box){const pressed=box?.querySelector?.('[data-p0-mode][aria-pressed="true"]')?.dataset?.p0Mode;if(MODES.includes(pressed))return pressed;const v=String(root?.__v11Mode||'');return MODES.includes(v)?v:'radar'}
function setActive(box,mode){box.querySelectorAll('[data-p0-mode]').forEach(b=>{const on=b.dataset.p0Mode===mode;b.dataset.active=on?'1':'0';b.setAttribute('aria-pressed',on?'true':'false')});const sel=box.querySelector('[data-p0-select]');if(sel){if(FORECAST.includes(mode))sel.value=mode;else sel.value=''}}
function fire(root,box,mode,button){if(!MODES.includes(mode))return;setActive(box,mode);root.dispatchEvent(new CustomEvent('typhoon-weather-controller-mode',{bubbles:true,detail:{mode,button:button||box}}))}
function position(box,root){const r=root.getBoundingClientRect(),mobile=innerWidth<760||r.width<560;box.dataset.compact=mobile?'1':'0'}
function makeButton(mode){const b=document.createElement('button');b.type='button';b.dataset.p0Mode=mode;b.setAttribute('aria-pressed','false');return b}
function makeMirror(root){let box=mirrors.get(root);if(box&&root.contains(box))return box;root.querySelectorAll(':scope > .tp-weather-p0-global').forEach(n=>n.remove());if(getComputedStyle(root).position==='static')root.style.position='relative';
 box=document.createElement('div');box.className='tp-weather-p0-global';box.setAttribute('role','group');box.dataset.controllerOwner='human-ui-v10';box.dataset.collapsed='0';
 const head=document.createElement('div');head.dataset.p0Head='1';const title=document.createElement('strong');title.dataset.p0Title='1';const collapse=document.createElement('button');collapse.type='button';collapse.dataset.p0Collapse='1';collapse.setAttribute('aria-expanded','true');head.append(title,collapse);box.appendChild(head);
 const body=document.createElement('div');body.dataset.p0Body='1';const radar=makeButton('radar'),cloud=makeButton('cloud');body.append(radar,cloud);
 const wrap=document.createElement('label');wrap.dataset.p0SelectWrap='1';const sl=document.createElement('span');sl.dataset.p0SelectLabel='1';const select=document.createElement('select');select.dataset.p0Select='1';select.setAttribute('aria-label','Forecast layer');const empty=document.createElement('option');empty.value='';empty.disabled=true;select.appendChild(empty);FORECAST.forEach(mode=>{const o=document.createElement('option');o.value=mode;select.appendChild(o)});wrap.append(sl,select);body.appendChild(wrap);box.appendChild(body);
 const fresh=document.createElement('div');fresh.dataset.layerFreshness='1';fresh.setAttribute('role','status');fresh.setAttribute('aria-live','polite');box.appendChild(fresh);root.appendChild(box);mirrors.set(root,box);
 radar.addEventListener('click',()=>fire(root,box,'radar',radar));cloud.addEventListener('click',()=>fire(root,box,'cloud',cloud));select.addEventListener('change',()=>fire(root,box,select.value,select));collapse.addEventListener('click',()=>{const next=box.dataset.collapsed!=='1';box.dataset.collapsed=next?'1':'0';collapse.setAttribute('aria-expanded',next?'false':'true');localize(box);try{localStorage.setItem('windzxy-weather-panel-collapsed',next?'1':'0')}catch(_){}});
 try{const saved=localStorage.getItem('windzxy-weather-panel-collapsed');if(saved==='1')box.dataset.collapsed='1'}catch(_){ }
 return box}
function localize(box){const l=labels();box.setAttribute('aria-label',l.layers);box.querySelector('[data-p0-title]').textContent=l.layers;const collapse=box.querySelector('[data-p0-collapse]');const collapsed=box.dataset.collapsed==='1';collapse.textContent=collapsed?'＋':'−';collapse.title=collapsed?l.expand:l.collapse;collapse.setAttribute('aria-label',collapse.title);box.querySelector('[data-p0-mode="radar"]').textContent=l.radar;box.querySelector('[data-p0-mode="cloud"]').textContent=l.cloud;box.querySelector('[data-p0-select-label]').textContent=l.forecast;const select=box.querySelector('[data-p0-select]');select.options[0].textContent=l.forecast;FORECAST.forEach((mode,i)=>select.options[i+1].textContent=l[mode]);const fresh=box.querySelector('[data-layer-freshness]');if(fresh&&!fresh.textContent.trim())fresh.textContent=l.updated+' · --:--'}
function mirror(root){ensureStyle();hideLegacy(root);let box=mirrors.get(root);if(!rootVisible(root)){if(box)box.style.display='none';return}box=makeMirror(root);localize(box);position(box,root);box.style.display='grid';setActive(box,currentMode(root,box))}
function reload(root,force=false){if(!root)return;const now=Date.now(),last=+(root.dataset.weatherP0ReloadAt||0);if(!force&&now-last<5000)return;root.dataset.weatherP0ReloadAt=String(now);try{root.dataset.v11Bound='0';window.__windzxyTyphoonWeatherRuntimeV11='';const s=document.createElement('script');s.src='Html_tools/typhoon-weather-runtime-v11.js?v=20260913-p0-remount-v10-'+now;s.async=true;s.onload=()=>setTimeout(()=>ensure(root),250);s.onerror=()=>mirror(root);document.head.appendChild(s)}catch(_){mirror(root)}}
function ensure(root){if(!root||!document.body.contains(root))return;mirror(root);if(!runtimeReady(root))reload(root)}
function scan(scope=document){const set=new Set();if(scope.matches?.('[data-typhoon-root]'))set.add(scope);scope.querySelectorAll?.('[data-typhoon-root]').forEach(n=>set.add(n));set.forEach(ensure)}
function refresh(){ensureStyle();cleanupStale();document.querySelectorAll('[data-typhoon-root]').forEach(root=>{if(document.body.contains(root))mirror(root)})}
function boot(){ensureStyle();cleanupStale();scan();const host=document.getElementById('windowLayer')||document.body;new MutationObserver(ms=>{let removed=false;for(const m of ms){for(const n of m.addedNodes){if(n.nodeType!==1)continue;if(n.matches?.('[data-typhoon-root]'))ensure(n);n.querySelectorAll?.('[data-typhoon-root]').forEach(ensure)}if(m.removedNodes?.length)removed=true}if(removed)cleanupStale()}).observe(host,{childList:true,subtree:true});setInterval(()=>{if(!document.hidden)refresh()},5000);let resizeRaf=0;addEventListener('resize',()=>{if(resizeRaf)return;resizeRaf=requestAnimationFrame(()=>{resizeRaf=0;refresh()})},{passive:true});window.WebDeskTyphoonWeatherP0={version:'v10',runtimeRemount:true,singleController:true,humanUi:true,compactPrimaryActions:true,forecastSelect:true,collapsible:true,mutationLight:true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();