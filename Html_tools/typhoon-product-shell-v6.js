(()=>{'use strict';
const VER='20260902-typhoon-product-shell-v6';
if(window.__windzxyTyphoonProductShell===VER)return;
window.__windzxyTyphoonProductShell=VER;
function css(){if(document.getElementById('tpProductShellV6Style'))return;const s=document.createElement('style');s.id='tpProductShellV6Style';s.textContent=`
[data-typhoon-root]{--ze-panel:rgba(9,24,38,.84);--ze-line:rgba(255,255,255,.14);--ze-text:#edf6ff;--ze-muted:#9fb4c8}
[data-typhoon-root] .tpv4-top{top:9px;left:10px;right:10px}
[data-typhoon-root] .tpv4-source{padding:5px 8px;background:rgba(8,25,38,.78);border-color:var(--ze-line);box-shadow:none}
[data-typhoon-root] .tpv4-actions{gap:5px}
[data-typhoon-root] .tpv4-actions button,[data-typhoon-root] .tpv4-actions a{height:28px;background:rgba(8,25,38,.76);box-shadow:none}
[data-typhoon-root] .tpv4-panel{left:auto!important;right:14px!important;top:48px!important;width:244px!important;padding:10px!important;border-radius:13px!important;background:var(--ze-panel)!important;border-color:var(--ze-line)!important;box-shadow:0 10px 28px rgba(0,0,0,.22)!important;backdrop-filter:blur(14px)!important}
[data-typhoon-root] .tpv4-panel h3{font-size:16px!important}[data-typhoon-root] .tpv4-panel small{font-size:8px!important}
[data-typhoon-root] .tpv4-metrics,[data-typhoon-root] .tpv4-impact{gap:4px!important;margin-top:6px!important}
[data-typhoon-root] .tpv4-metrics div,[data-typhoon-root] .tpv4-impact div{padding:6px!important;border-radius:8px!important;background:rgba(255,255,255,.055)!important}
[data-typhoon-root] .tpv4-legend,[data-typhoon-root] .tpv4-info{display:none!important}
[data-typhoon-root] .tpv4-storms{left:auto!important;right:14px!important;top:226px!important;width:214px!important;gap:4px!important;z-index:535!important}
[data-typhoon-root] .tpv4-storms button{padding:6px 8px!important;border-radius:10px!important;background:rgba(8,25,38,.76)!important;box-shadow:none!important}
[data-typhoon-root] .tpv4-storms button.on{display:none!important}
[data-typhoon-root] .tpv4-maptools{top:auto!important;right:12px!important;bottom:76px!important;gap:6px!important;z-index:620!important}
[data-typhoon-root] .tpv4-basemap{background:rgba(8,25,38,.76)!important;border:1px solid var(--ze-line);padding:2px!important}
[data-typhoon-root] .tpv4-zoom{gap:3px!important}[data-typhoon-root] .tpv4-zoom button{width:30px!important;height:30px!important;border-radius:9px!important;background:rgba(8,25,38,.78)!important;box-shadow:none!important}
[data-typhoon-root] .tp-weather-v4{inset:0!important;left:0!important;bottom:0!important;transform:none!important;width:100%!important;max-width:none!important;display:block!important;pointer-events:none!important;z-index:640!important}
[data-typhoon-root] .tp-weather-v4 .dock{display:contents!important}
[data-typhoon-root] .tp-weather-v4 .layers{position:absolute;left:10px;top:48px;width:108px;display:grid!important;grid-template-columns:1fr!important;gap:2px!important;padding:7px!important;overflow:visible!important;border:1px solid var(--ze-line);border-radius:12px;background:rgba(8,25,38,.80);backdrop-filter:blur(14px);box-shadow:0 10px 26px rgba(0,0,0,.18);pointer-events:auto!important}
[data-typhoon-root] .tp-weather-v4 .layers .ze-group-title{display:block;padding:4px 7px 3px;color:#7f9bb2;font:800 8px/1 system-ui;letter-spacing:.08em;text-transform:uppercase;pointer-events:none}
[data-typhoon-root] .tp-weather-v4 .layers .ze-group-title.forecast{margin-top:4px;padding-top:7px;border-top:1px solid rgba(255,255,255,.09)}
[data-typhoon-root] .tp-weather-v4 .layers button{height:30px!important;width:100%!important;padding:0 8px!important;border-radius:8px!important;text-align:left!important;font-size:10px!important;color:#dfeaf4!important}
[data-typhoon-root] .tp-weather-v4 .layers button.on{background:rgba(255,255,255,.15)!important;color:#fff!important;box-shadow:none!important}
[data-typhoon-root] .tp-weather-v4 .layers button[data-tp-layer='radar']::before{content:'◉';margin-right:7px;color:#60a5fa}
[data-typhoon-root] .tp-weather-v4 .layers button[data-tp-layer='cloud']::before{content:'◐';margin-right:7px;color:#c4b5fd}
[data-typhoon-root] .tp-weather-v4 .layers button[data-tp-layer='precip']::before{content:'☂';margin-right:7px;color:#7dd3fc}
[data-typhoon-root] .tp-weather-v4 .layers button[data-tp-layer='wind']::before{content:'≋';margin-right:7px;color:#e2e8f0}
[data-typhoon-root] .tp-weather-v4 .layers button[data-tp-layer='gust']::before{content:'≈';margin-right:7px;color:#fde68a}
[data-typhoon-root] .tp-weather-v4 .layers button[data-tp-layer='temp']::before{content:'°';margin-right:9px;color:#fb7185}
[data-typhoon-root] .tp-weather-v4 .layers button[data-tp-layer='humidity']::before{content:'◒';margin-right:7px;color:#67e8f9}
[data-typhoon-root] .tp-weather-v4 .layers button[data-tp-layer='pressure']::before{content:'◎';margin-right:7px;color:#a7f3d0}
[data-typhoon-root] .tp-weather-v4 .timeline{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);width:min(360px,calc(100% - 270px));display:grid!important;grid-template-columns:30px minmax(130px,1fr) 62px!important;gap:6px!important;align-items:center!important;padding:5px 7px!important;border:1px solid var(--ze-line);border-radius:13px;background:rgba(8,25,38,.84);backdrop-filter:blur(16px);box-shadow:0 10px 24px rgba(0,0,0,.2);pointer-events:auto!important}
[data-typhoon-root] .tp-weather-v4.is-loading .timeline::after{content:'…';color:#7dd3fc;font-weight:900}
[data-typhoon-root] .tp-weather-legend{left:130px!important;bottom:14px!important;background:rgba(8,25,38,.72)!important}
@container(max-width:680px){[data-typhoon-root] .tpv4-panel{left:8px!important;right:auto!important;top:48px!important;width:210px!important;padding:8px!important}[data-typhoon-root] .tpv4-impact,[data-typhoon-root] .tpv4-storms{display:none!important}[data-typhoon-root] .tp-weather-v4 .layers{left:8px!important;right:8px!important;top:auto!important;bottom:54px!important;width:auto!important;display:flex!important;padding:5px!important;overflow-x:auto!important}[data-typhoon-root] .tp-weather-v4 .layers .ze-group-title{display:none!important}[data-typhoon-root] .tp-weather-v4 .layers button{width:auto!important;flex:0 0 auto!important;text-align:center!important}[data-typhoon-root] .tp-weather-v4 .timeline{left:8px!important;right:8px!important;bottom:8px!important;transform:none!important;width:auto!important}}
`;document.head.appendChild(s)}
function group(root){const l=root.querySelector('.tp-weather-v4 .layers');if(!l||l.dataset.zeGrouped==='1')return;l.dataset.zeGrouped='1';const radar=l.querySelector('[data-tp-layer="radar"]'),precip=l.querySelector('[data-tp-layer="precip"]');if(radar){const a=document.createElement('span');a.className='ze-group-title live';a.textContent='LIVE';l.insertBefore(a,radar)}if(precip){const b=document.createElement('span');b.className='ze-group-title forecast';b.textContent='FORECAST';l.insertBefore(b,precip)}}
function mount(root){if(!root||!document.body.contains(root))return;root.dataset.zeDarkBase='1';group(root)}
function scan(s=document){s.querySelectorAll?.('[data-typhoon-root]').forEach(mount)}
function boot(){css();scan();const host=document.getElementById('windowLayer')||document.body;new MutationObserver(ms=>{for(const m of ms){const o=m.target?.closest?.('[data-typhoon-root]');if(o)mount(o);for(const n of m.addedNodes)if(n.nodeType===1){if(n.matches?.('[data-typhoon-root]'))mount(n);scan(n)}}}).observe(host,{childList:true,subtree:true});window.WebDeskTyphoonProductShell={version:'v6',zoomEarthLayout:true,keylessOnly:true,legacyCarto:false,singleTimeline:true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();