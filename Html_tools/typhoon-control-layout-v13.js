(()=>{
'use strict';
const VER='20260913-typhoon-control-layout-v13.2-human-ui';
if(window.__windzxyTyphoonControlLayoutV13===VER)return;
window.__windzxyTyphoonControlLayoutV13=VER;
window.__windzxyTyphoonLayoutOwner=VER;
const LEGACY_STYLE_IDS=['tpControlLayoutV10Css','tpControlLayoutV11Css','tpControlLayoutV12Css'];
function cleanupLegacyLayouts(){LEGACY_STYLE_IDS.forEach(id=>document.getElementById(id)?.remove());document.querySelectorAll('script[src*="typhoon-control-layout-v10.js"],script[src*="typhoon-control-layout-v11.js"],script[src*="typhoon-control-layout-v12.js"]').forEach(el=>el.remove())}
function style(){cleanupLegacyLayouts();let s=document.getElementById('tpControlLayoutV13Css');if(!s){s=document.createElement('style');s.id='tpControlLayoutV13Css';document.head.appendChild(s)}s.textContent=`
[data-typhoon-root]>.tp-weather-p0-global{left:12px!important;right:auto!important;top:52px!important;bottom:auto!important;transform:none!important;width:244px!important;max-width:calc(100% - 24px)!important;max-height:none!important;box-sizing:border-box!important;display:grid!important;grid-template-columns:1fr!important;gap:7px!important;padding:9px!important;border-radius:16px!important;overflow:hidden!important;background:linear-gradient(180deg,rgba(4,18,30,.94),rgba(5,21,34,.88))!important;border:1px solid rgba(180,224,255,.20)!important;box-shadow:0 10px 30px rgba(0,0,0,.30)!important;backdrop-filter:blur(16px) saturate(1.08)!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-head]{min-height:24px!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-title]{font:800 11px/1.1 system-ui!important;color:#f3f8ff!important;letter-spacing:.01em!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-collapse]{width:26px!important;height:26px!important;border-radius:8px!important;background:rgba(255,255,255,.08)!important;color:#dff4ff!important;font:800 18px/1 system-ui!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-body]{grid-template-columns:1fr 1fr!important;gap:7px!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{min-width:0!important;height:36px!important;min-height:36px!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:10px!important;background:rgba(255,255,255,.07)!important;color:#edf8ff!important;font:760 10px/1 system-ui!important;cursor:pointer!important;transition:background .16s ease,border-color .16s ease,transform .16s ease!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]:hover{background:rgba(255,255,255,.12)!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-mode][aria-pressed="true"]{background:linear-gradient(135deg,rgba(14,165,233,.48),rgba(37,99,235,.30))!important;border-color:rgba(125,211,252,.85)!important;box-shadow:0 0 0 1px rgba(125,211,252,.10) inset!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-select-wrap]{grid-column:1/-1!important;gap:5px!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-select-label]{font-size:8px!important;letter-spacing:.06em!important;text-transform:uppercase!important;color:#78a9c3!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-select]{height:36px!important;padding:0 34px 0 10px!important;border:1px solid rgba(255,255,255,.13)!important;border-radius:10px!important;background:rgba(8,30,47,.92)!important;color:#eef9ff!important;font:750 10px/1 system-ui!important;outline:none!important}
[data-typhoon-root]>.tp-weather-p0-global [data-p0-select]:focus{border-color:rgba(125,211,252,.78)!important;box-shadow:0 0 0 2px rgba(56,189,248,.12)!important}
[data-typhoon-root]>.tp-weather-p0-global [data-layer-freshness]{min-height:0!important;margin:0!important;padding:5px 2px 0!important;border-top:1px solid rgba(160,210,235,.10)!important;color:#9fc4d7!important;font-size:7.5px!important;line-height:1.25!important}
[data-typhoon-root]>.tp-weather-p0-global[data-collapsed="1"]{width:auto!important;min-width:142px!important;padding:7px 8px!important}
[data-typhoon-root] .tpv4-panel{right:12px!important;top:48px!important;width:218px!important;max-height:210px!important;padding:9px!important;border-radius:12px!important;overflow:auto!important}
[data-typhoon-root] .tpv4-storms{right:12px!important;top:266px!important;width:218px!important;max-height:120px!important;overflow:auto!important}
[data-typhoon-root] .tpv4-maptools{right:12px!important;bottom:14px!important;top:auto!important;left:auto!important;display:flex!important;flex-direction:column!important;align-items:flex-end!important;gap:6px!important}
[data-typhoon-root] .leaflet-top.leaflet-left{top:52px!important;left:270px!important}
@media(max-width:760px){
 [data-typhoon-root]>.tp-weather-p0-global{left:8px!important;right:8px!important;top:auto!important;bottom:8px!important;width:auto!important;max-width:none!important;padding:8px!important;border-radius:15px!important;background:rgba(4,18,30,.93)!important;box-shadow:0 10px 30px rgba(0,0,0,.32)!important}
 [data-typhoon-root]>.tp-weather-p0-global [data-p0-head]{min-height:22px!important}
 [data-typhoon-root]>.tp-weather-p0-global [data-p0-mode]{height:34px!important;min-height:34px!important;font-size:9.5px!important}
 [data-typhoon-root]>.tp-weather-p0-global [data-p0-select]{height:34px!important;font-size:9.5px!important}
 [data-typhoon-root]>.tp-weather-p0-global[data-collapsed="1"]{left:auto!important;right:8px!important;width:146px!important;min-width:0!important}
 [data-typhoon-root] .tpv4-panel{right:8px!important;top:44px!important;width:min(202px,50vw)!important;max-height:148px!important;padding:7px!important}
 [data-typhoon-root] .tpv4-storms{display:none!important}
 [data-typhoon-root] .tpv4-maptools{right:8px!important;bottom:58px!important}
 [data-typhoon-root] .leaflet-top.leaflet-left{top:48px!important;left:4px!important}
}
@media(max-width:420px){[data-typhoon-root]>.tp-weather-p0-global{left:6px!important;right:6px!important;bottom:6px!important}[data-typhoon-root]>.tp-weather-p0-global[data-collapsed="1"]{left:auto!important;right:6px!important;width:138px!important}}
`}
function annotate(root){cleanupLegacyLayouts();const box=root.querySelector(':scope > .tp-weather-p0-global');if(box){box.dataset.layout='human-ui-v13.2';box.dataset.layoutOwner='v13.2'}}
function scan(){document.querySelectorAll('[data-typhoon-root]').forEach(annotate)}
function boot(){style();scan();const host=document.getElementById('windowLayer')||document.body;new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1&&(n.matches?.('[data-typhoon-root]')||n.querySelector?.('[data-typhoon-root]'))){scan();return}}).observe(host,{childList:true,subtree:true});setInterval(()=>{if(!document.hidden)scan()},5000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskTyphoonControlLayout={version:'v13.2',desktop:'compact-primary-actions',mobile:'bottom-sheet',forecast:'select',collapsible:true,mapFirst:true,singleOwner:true};
})();