(()=>{'use strict';
const VER='20260911-typhoon-provider-failover-v1.1-recover-primary';
if(window.__windzxyTyphoonProviderFailover===VER)return;window.__windzxyTyphoonProviderFailover=VER;
const state=new WeakMap();
const FALLBACK={
 street:{url:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',attr:'© OpenStreetMap contributors'},
 bright:{url:'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',attr:'© OpenStreetMap © CARTO'},
 weather:{url:'https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png',attr:'© OpenStreetMap © CARTO'},
 dark:{url:'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',attr:'© OpenStreetMap © CARTO'},
 terrain:{url:'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',attr:'© OpenTopoMap contributors'},
 sat:{url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',attr:'Tiles © Esri'}
};
const VECTOR_STYLE={street:'liberty',bright:'bright',weather:'fiord',dark:'dark'};
const OFM='https://tiles.openfreemap.org/styles/';
function roots(){return [...document.querySelectorAll('[data-typhoon-root]')];}
function getState(root){let s=state.get(root);if(!s){s={mode:'',hits:0,first:0,cooldown:0,watched:new WeakSet(),fallback:null,probing:false,probeTimer:0,retryAt:0,retryMs:45000};state.set(root,s)}return s;}
function status(root,text){root.dataset.providerFailoverStatus=text;root.dataset.providerFailoverAt=String(Date.now());try{root.dispatchEvent(new CustomEvent('typhoon:provider-failover',{bubbles:true,detail:{status:text,at:Date.now()}}))}catch{}}
function clearFallback(root){const s=getState(root),map=root.__tpMap;if(s.fallback&&map){try{map.removeLayer(s.fallback)}catch{}}s.fallback=null;}
function primaryLayers(root){const out=[];if(root.__tpOpenFreeMap)out.push(root.__tpOpenFreeMap);const ras=root.__tpOfmRaster;if(ras){if(typeof ras.eachLayer==='function')ras.eachLayer(l=>out.push(l));else out.push(ras)}return out;}
function removePrimary(root){const map=root.__tpMap;if(!map)return;for(const l of primaryLayers(root)){try{if(map.hasLayer?.(l))map.removeLayer(l)}catch{}}}
function activateFallback(root,reason){const map=root.__tpMap,L=window.L;if(!map||!L)return;const s=getState(root),mode=root.__tpOfmMode||root.dataset.zeBaseMode||'street',spec=FALLBACK[mode]||FALLBACK.street;if(Date.now()<s.cooldown&&!s.probing)return;s.cooldown=Date.now()+30000;s.hits=0;s.probing=false;clearTimeout(s.probeTimer);removePrimary(root);clearFallback(root);
 const opts={pane:'tilePane',maxZoom:19,updateWhenIdle:true,keepBuffer:2,attribution:spec.attr,crossOrigin:true};if(mode==='terrain')opts.maxNativeZoom=17;if(mode==='sat')opts.maxNativeZoom=18;
 try{s.fallback=L.tileLayer(spec.url,opts).addTo(map);root.dataset.ofmProvider='Auto fallback · '+(mode==='sat'?'Esri':mode==='terrain'?'OpenTopoMap':mode==='street'?'OpenStreetMap':'CARTO');root.dataset.providerFailover='active';s.retryAt=Date.now()+s.retryMs;status(root,'fallback:'+mode+':'+reason);map.invalidateSize?.({pan:false,animate:false});}catch(e){status(root,'fallback-failed:'+mode)}
}
function recoverySuccess(root,source){const s=getState(root),map=root.__tpMap;if(!s.probing||!map)return;s.probing=false;clearTimeout(s.probeTimer);clearFallback(root);s.hits=0;s.first=Date.now();s.retryMs=45000;s.retryAt=0;root.dataset.providerFailover='healthy';const mode=root.__tpOfmMode||root.dataset.zeBaseMode||'street';root.dataset.ofmProvider=VECTOR_STYLE[mode]?'OpenFreeMap · '+VECTOR_STYLE[mode]:(mode==='sat'?'EOX Sentinel-2 2025':'EOX Terrain Light');status(root,'primary-restored:'+mode+':'+source);try{map.invalidateSize?.({pan:false,animate:false})}catch{}
}
function recoveryFailed(root,reason){const s=getState(root);if(!s.probing)return;s.probing=false;clearTimeout(s.probeTimer);removePrimary(root);s.retryMs=Math.min(180000,Math.round(s.retryMs*1.6));s.retryAt=Date.now()+s.retryMs;root.dataset.providerFailover='active';status(root,'primary-probe-failed:'+reason);}
function beginRecovery(root){const s=getState(root),map=root.__tpMap;if(!map||!s.fallback||s.probing||Date.now()<s.retryAt)return;const mode=root.__tpOfmMode||root.dataset.zeBaseMode||'street';s.probing=true;root.dataset.providerFailover='probing';status(root,'primary-probe:'+mode);
 try{if(VECTOR_STYLE[mode]){const ofm=root.__tpOpenFreeMap;if(!ofm)throw new Error('missing-openfreemap');if(!map.hasLayer?.(ofm))ofm.addTo(map);const gl=ofm.getMaplibreMap?.();try{gl?.setStyle?.(OFM+VECTOR_STYLE[mode],{diff:true})}catch{try{gl?.setStyle?.(OFM+VECTOR_STYLE[mode])}catch{}}}
 else{const ras=root.__tpOfmRaster;if(!ras)throw new Error('missing-raster');if(!map.hasLayer?.(ras))ras.addTo(map)}
 try{map.invalidateSize?.({pan:false,animate:false})}catch{}s.probeTimer=setTimeout(()=>recoveryFailed(root,'timeout'),9000);
 }catch(e){recoveryFailed(root,e?.message||'setup')}
}
function hit(root,reason){const s=getState(root),now=Date.now();if(s.probing){recoveryFailed(root,reason);return}if(now-s.first>9000){s.first=now;s.hits=0}s.hits++;root.dataset.providerErrorHits=String(s.hits);if(s.hits>=4)activateFallback(root,reason)}
function watchLayer(root,layer){if(!layer||typeof layer.on!=='function')return;const s=getState(root);if(s.watched.has(layer))return;s.watched.add(layer);layer.on('tileerror',()=>hit(root,'tileerror'));layer.on('tileload',()=>{const q=getState(root);if(q.probing){recoverySuccess(root,'tileload');return}if(Date.now()-q.first>2500)q.hits=Math.max(0,q.hits-1)});}
function watchMaplibre(root){let gl=null;try{gl=root.__tpOpenFreeMap?.getMaplibreMap?.()||null}catch{}if(!gl||gl.__windzxyFailoverWatch)return;gl.__windzxyFailoverWatch=true;gl.on?.('error',e=>{const msg=String(e?.error?.message||e?.message||'maplibre-error');if(/style|source|tile|network|fetch|load/i.test(msg))hit(root,'maplibre')});gl.on?.('idle',()=>{const s=getState(root);if(s.probing){recoverySuccess(root,'maplibre-idle');return}s.hits=0;if(!s.fallback)root.dataset.providerFailover='healthy'});}
function inspect(root){if(!root||!document.body.contains(root)||!root.__tpMap)return;const s=getState(root),mode=root.__tpOfmMode||root.dataset.zeBaseMode||'street';if(s.mode!==mode){s.mode=mode;s.hits=0;s.first=Date.now();s.probing=false;clearTimeout(s.probeTimer);if(s.fallback){clearFallback(root);root.dataset.providerFailover='monitoring'}s.retryAt=0;s.retryMs=45000}
 watchMaplibre(root);const ras=root.__tpOfmRaster;if(ras){if(typeof ras.eachLayer==='function')ras.eachLayer(l=>watchLayer(root,l));else watchLayer(root,ras)}
 root.__tpMap.eachLayer?.(l=>{if(l&&l!==s.fallback&&typeof l.getTileUrl==='function')watchLayer(root,l)});if(s.fallback)beginRecovery(root);
}
function boot(){const scan=()=>roots().forEach(inspect);scan();new MutationObserver(scan).observe(document.getElementById('windowLayer')||document.body,{childList:true,subtree:true});setInterval(scan,1500);window.WebDeskTyphoonProviderFailover={version:'v1.1',errorThreshold:4,windowMs:9000,cooldownMs:30000,recoveryProbe:true,retryMs:[45000,180000],fallbacks:['OpenStreetMap','CARTO','OpenTopoMap','Esri']};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();