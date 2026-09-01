(()=>{'use strict';
const VER='20260901-typhoon-layout-v5.3-overlay-safe';
if(window.__windzxyTyphoonLayoutV53===VER)return;
window.__windzxyTyphoonLayoutV53=VER;
function installStyle(){if(document.getElementById('typhoonLayoutV53Style'))return;const s=document.createElement('style');s.id='typhoonLayoutV53Style';s.textContent=`
.tpv53-rail{display:none;position:absolute;z-index:515;left:0;top:0;bottom:0;width:326px;pointer-events:none;background:linear-gradient(180deg,rgba(6,15,28,.98),rgba(9,21,37,.96));border-right:1px solid rgba(255,255,255,.12);box-shadow:18px 0 42px rgba(0,0,0,.16)}
.tpv53-toggle{display:none;margin-left:auto;width:28px;height:24px;border:1px solid rgba(255,255,255,.12);border-radius:8px;background:rgba(255,255,255,.07);color:#dbeafe;font-size:13px;line-height:1;cursor:pointer}
.tpv53-narrow .tpv53-toggle{display:grid;place-items:center}
.tpv53-narrow .tpv52{top:auto!important;left:10px!important;right:10px!important;bottom:12px!important;width:auto!important;max-width:none!important;transition:bottom .18s ease,transform .18s ease}
.tpv53-narrow.tpv41-radar-on .tpv52,.tpv53-narrow.tpv51-sat-on .tpv52{bottom:116px!important}
.tpv53-narrow.tpv53-collapsed .tpv52{padding:9px 10px!important;border-radius:14px!important}
.tpv53-narrow.tpv53-collapsed .tpv52-metrics,.tpv53-narrow.tpv53-collapsed .tpv52-impact,.tpv53-narrow.tpv53-collapsed .tpv52-targets,.tpv53-narrow.tpv53-collapsed .tpv52-note{display:none!important}
.tpv53-narrow.tpv53-collapsed .tpv52-kicker{margin-bottom:3px!important}.tpv53-narrow.tpv53-collapsed .tpv52-head h3{font-size:14px!important}.tpv53-narrow.tpv53-collapsed .tpv52-head small{margin-top:2px!important}
@container (min-width:760px){
  .tpv53-rail{display:block}
  .tpv4-map{left:326px!important}
  .tpv4-top{left:338px!important}
  .tpv4-info{left:338px!important}
  .tpv52{left:12px!important;top:12px!important;bottom:auto!important;width:302px!important;max-width:302px!important;z-index:540!important;box-shadow:0 14px 34px rgba(0,0,0,.24)!important}
  .tpv4-storms{left:12px!important;top:326px!important;width:302px!important;max-width:302px!important;max-height:calc(100% - 338px)!important;overflow:auto!important;scrollbar-width:thin;z-index:535!important}
  .tpv4.tpv53-single .tpv4-storms{display:none!important}
  .tpv4 .tpv5-legend{display:none!important}
}
@container (min-width:760px) and (max-height:500px){
  .tpv52{padding:9px!important}.tpv52-note{display:none!important}.tpv52-metrics{margin-top:7px!important}.tpv4-storms{top:278px!important;max-height:calc(100% - 290px)!important}
}
`;document.head.appendChild(s)}
function ensureRail(root){if(root.querySelector(':scope > .tpv53-rail'))return;const rail=document.createElement('div');rail.className='tpv53-rail';rail.setAttribute('aria-hidden','true');root.prepend(rail)}
function ensureToggle(root){const panel=root.querySelector('.tpv52');if(!panel)return;const kicker=panel.querySelector('.tpv52-kicker');if(!kicker||kicker.querySelector('.tpv53-toggle'))return;const b=document.createElement('button');b.type='button';b.className='tpv53-toggle';b.dataset.tpv53Toggle='1';b.setAttribute('aria-label','展開或收起颱風資訊');b.setAttribute('aria-expanded','false');b.textContent='⌃';kicker.appendChild(b)}
function updateStormCount(root){const count=Array.isArray(root.__tpData?.storms)?root.__tpData.storms.length:root.querySelectorAll('[data-tp-storm]').length;root.classList.toggle('tpv53-single',count<=1&&count>0)}
function applyMode(root){const w=root.getBoundingClientRect().width;const narrow=w<760;root.classList.toggle('tpv53-narrow',narrow);if(!narrow){root.classList.remove('tpv53-collapsed')}else if(!root.dataset.tpv53UserState){root.classList.add('tpv53-collapsed')}const b=root.querySelector('[data-tpv53-toggle]');if(b){const open=!root.classList.contains('tpv53-collapsed');b.setAttribute('aria-expanded',String(open));b.textContent=open?'⌄':'⌃'}setTimeout(()=>{try{root.__tpMap?.invalidateSize(false)}catch(e){}},80)}
function sync(root){if(!root||!document.body.contains(root))return;ensureRail(root);ensureToggle(root);updateStormCount(root);applyMode(root)}
function bind(root){if(root.dataset.tpv53Bound)return;root.dataset.tpv53Bound='1';root.addEventListener('click',e=>{const b=e.target.closest('[data-tpv53-toggle]');if(b){e.preventDefault();root.dataset.tpv53UserState='1';root.classList.toggle('tpv53-collapsed');applyMode(root);return}if(e.target.closest('[data-tp-storm]')||e.target.closest('[data-tp-refresh]'))setTimeout(()=>sync(root),220)},true);const ro=new ResizeObserver(()=>applyMode(root));ro.observe(root);root.__tpV53Resize=ro;let tries=0;const wait=()=>{if(!document.body.contains(root))return;sync(root);if(root.querySelector('.tpv52'))return;if(tries++<80)setTimeout(wait,120)};wait();root.__tpV53Timer=setInterval(()=>{if(document.body.contains(root))sync(root);else{clearInterval(root.__tpV53Timer);try{ro.disconnect()}catch(e){}}},30000)}
function scan(scope=document){if(scope.matches?.('[data-typhoon-root]'))bind(scope);scope.querySelectorAll?.('[data-typhoon-root]').forEach(bind)}
let queued=false;function schedule(scope=document){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan(scope)})}
function boot(){installStyle();scan();const host=document.getElementById('windowLayer')||document.body;new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)scan(n)}).observe(host,{childList:true,subtree:true});document.addEventListener('change',e=>{if(e.target?.matches('.lang-select'))setTimeout(()=>scan(),0)},true);window.WebDeskTyphoonLayout={version:'v5.3',desktopDock:true,mobileBottomSheet:true,overlaySafe:true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();