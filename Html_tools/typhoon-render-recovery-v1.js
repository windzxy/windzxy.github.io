(()=>{'use strict';
const VER='20260911-typhoon-render-recovery-v1.1-leaflet';
if(window.__windzxyTyphoonRenderRecovery===VER)return;window.__windzxyTyphoonRenderRecovery=VER;
const seen=new WeakMap();
function roots(){return [...document.querySelectorAll('[data-typhoon-root]')];}
function maps(root){const out=[];for(const v of [root.__tpMap,root.__map,root._map,root.map,root.__typhoonMap,window.__typhoonMap,window.typhoonMap])if(v&&typeof v==='object'&&!out.includes(v))out.push(v);return out;}
function refreshMap(m){if(!m)return;try{m.invalidateSize?.({pan:false,animate:false});}catch{}try{m.resize?.();}catch{}try{m.triggerRepaint?.();}catch{}try{m.repaint=true;}catch{}try{m.eachLayer?.(layer=>{if(layer&&typeof layer.redraw==='function')layer.redraw();});}catch{}}
function nudge(root,reason){if(!root||!document.body.contains(root))return;root.dataset.renderRecoveryReason=reason;root.dataset.renderRecoveryAt=String(Date.now());root.dispatchEvent(new CustomEvent('typhoon:render-recovery',{bubbles:true,detail:{reason,at:Date.now()}}));window.dispatchEvent(new Event('resize'));for(const m of maps(root))refreshMap(m);
 const active=root.querySelector('[data-v11-mode].on,[data-weather-layer].active,[aria-pressed="true"][data-layer]');if(active){try{active.dispatchEvent(new CustomEvent('typhoon:layer-refresh',{bubbles:true,detail:{reason}}));}catch{}}
 setTimeout(()=>{for(const m of maps(root))refreshMap(m)},120);setTimeout(()=>{for(const m of maps(root))refreshMap(m)},420);
}
function canvasLooksBlank(root){const c=[...root.querySelectorAll('canvas')].find(x=>x.width>64&&x.height>64);if(!c)return false;try{const ctx=c.getContext('2d',{willReadFrequently:true});if(!ctx)return false;const w=c.width,h=c.height,s=ctx.getImageData(Math.max(0,w/2-2),Math.max(0,h/2-2),4,4).data;let lum=0,a=0;for(let i=0;i<s.length;i+=4){lum+=s[i]+s[i+1]+s[i+2];a+=s[i+3]}return a>0&&lum<80;}catch{return false;}}
function watch(root){if(seen.has(root))return;let timer=0,last={w:root.clientWidth,h:root.clientHeight};const schedule=(why,delay=70)=>{clearTimeout(timer);timer=setTimeout(()=>nudge(root,why),delay)};const ro=new ResizeObserver(()=>{const now={w:root.clientWidth,h:root.clientHeight};if(now.w!==last.w||now.h!==last.h){last=now;schedule('container-resize')}});ro.observe(root);
 let blankHits=0;const blankTimer=setInterval(()=>{if(!document.body.contains(root)){clearInterval(blankTimer);ro.disconnect();seen.delete(root);return}if(document.visibilityState!=='visible'||root.offsetParent===null)return;if(canvasLooksBlank(root)){blankHits++;if(blankHits>=2){blankHits=0;nudge(root,'blank-canvas')}}else blankHits=0;},4000);
 seen.set(root,{ro,blankTimer});schedule('mount',180);
}
function scan(node=document){node.querySelectorAll?.('[data-typhoon-root]').forEach(watch);if(node.matches?.('[data-typhoon-root]'))watch(node)}
function boot(){scan();new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)scan(n)}).observe(document.getElementById('windowLayer')||document.body,{childList:true,subtree:true});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')roots().forEach(r=>nudge(r,'visibility-return'))});window.addEventListener('pageshow',()=>roots().forEach(r=>nudge(r,'pageshow')));window.addEventListener('orientationchange',()=>setTimeout(()=>roots().forEach(r=>nudge(r,'orientationchange')),180));
 window.WebDeskTyphoonRenderRecovery={version:'v1.1',resizeRecovery:true,blankCanvasGuard:true,leafletInvalidateSize:true,tpMapAware:true,layerRedraw:true};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();