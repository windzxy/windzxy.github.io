(()=>{'use strict';
const VER='20260911-typhoon-provider-failover-v1.0';
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
function roots(){return [...document.querySelectorAll('[data-typhoon-root]')];}
function getState(root){let s=state.get(root);if(!s){s={mode:'',hits:0,first:0,cooldown:0,watched:new WeakSet(),fallback:null};state.set(root,s)}return s;}
function status(root,text){root.dataset.providerFailoverStatus=text;root.dataset.providerFailoverAt=String(Date.now());try{root.dispatchEvent(new CustomEvent('typhoon:provider-failover',{bubbles:true,detail:{status:text,at:Date.now()}}))}catch{}}
function clearFallback(root){const s=getState(root),map=root.__tpMap;if(s.fallback&&map){try{map.removeLayer(s.fallback)}catch{}}s.fallback=null;}
function activateFallback(root,reason){const map=root.__tpMap,L=window.L;if(!map||!L)return;const s=getState(root),mode=root.__tpOfmMode||root.dataset.zeBaseMode||'street',spec=FALLBACK[mode]||FALLBACK.street;if(Date.now()<s.cooldown)return;s.cooldown=Date.now()+30000;s.hits=0;clearFallback(root);
 try{const ofm=root.__tpOpenFreeMap;if(ofm&&map.hasLayer?.(ofm))map.removeLayer(ofm)}catch{}
 try{const ras=root.__tpOfmRaster;if(ras&&map.hasLayer?.(ras))map.removeLayer(ras)}catch{}
 const opts={pane:'tilePane',maxZoom:19,updateWhenIdle:true,keepBuffer:2,attribution:spec.attr,crossOrigin:true};if(mode==='terrain')opts.maxNativeZoom=17;if(mode==='sat')opts.maxNativeZoom=18;
 try{s.fallback=L.tileLayer(spec.url,opts).addTo(map);root.dataset.ofmProvider='Auto fallback · '+(mode==='sat'?'Esri':mode==='terrain'?'OpenTopoMap':mode==='street'?'OpenStreetMap':'CARTO');root.dataset.providerFailover='active';status(root,'fallback:'+mode+':'+reason);map.invalidateSize?.({pan:false,animate:false});}catch(e){status(root,'fallback-failed:'+mode)}
}
function hit(root,reason){const s=getState(root),now=Date.now();if(now-s.first>9000){s.first=now;s.hits=0}s.hits++;root.dataset.providerErrorHits=String(s.hits);if(s.hits>=4)activateFallback(root,reason)}
function watchLayer(root,layer){if(!layer||typeof layer.on!=='function')return;const s=getState(root);if(s.watched.has(layer))return;s.watched.add(layer);layer.on('tileerror',()=>hit(root,'tileerror'));layer.on('tileload',()=>{const q=getState(root);if(Date.now()-q.first>2500)q.hits=Math.max(0,q.hits-1)});}
function watchMaplibre(root){let gl=null;try{gl=root.__tpOpenFreeMap?.getMaplibreMap?.()||null}catch{}if(!gl||gl.__windzxyFailoverWatch)return;gl.__windzxyFailoverWatch=true;gl.on?.('error',e=>{const msg=String(e?.error?.message||e?.message||'maplibre-error');if(/style|source|tile|network|fetch|load/i.test(msg))hit(root,'maplibre')});gl.on?.('idle',()=>{const s=getState(root);s.hits=0;root.dataset.providerFailover='healthy'});}
function inspect(root){if(!root||!document.body.contains(root)||!root.__tpMap)return;const s=getState(root),mode=root.__tpOfmMode||root.dataset.zeBaseMode||'street';if(s.mode!==mode){s.mode=mode;s.hits=0;s.first=Date.now();if(s.fallback){clearFallback(root);root.dataset.providerFailover='monitoring'}}
 watchMaplibre(root);const ras=root.__tpOfmRaster;if(ras){if(typeof ras.eachLayer==='function')ras.eachLayer(l=>watchLayer(root,l));else watchLayer(root,ras)}
 root.__tpMap.eachLayer?.(l=>{if(l&&l!==s.fallback&&typeof l.getTileUrl==='function')watchLayer(root,l)});
}
function boot(){const scan=()=>roots().forEach(inspect);scan();new MutationObserver(scan).observe(document.getElementById('windowLayer')||document.body,{childList:true,subtree:true});setInterval(scan,1500);window.WebDeskTyphoonProviderFailover={version:'v1.0',errorThreshold:4,windowMs:9000,cooldownMs:30000,fallbacks:['OpenStreetMap','CARTO','OpenTopoMap','Esri']};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();