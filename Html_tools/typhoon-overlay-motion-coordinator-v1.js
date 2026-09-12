(()=>{
'use strict';
const VER='20260912-typhoon-overlay-motion-coordinator-v1.0';
if(window.__windzxyTyphoonOverlayMotion===VER)return;
window.__windzxyTyphoonOverlayMotion=VER;
const STATES=new WeakMap();
function cleanup(root){const s=STATES.get(root);if(!s)return;if(s.timer)clearTimeout(s.timer);try{s.map?.off('movestart zoomstart',s.start);s.map?.off('moveend zoomend',s.end)}catch(_){}STATES.delete(root);root.__tpOverlayMotion=null}
function bind(root){const map=root?.__tpMap;if(!root||!map)return;const old=STATES.get(root);if(old?.map===map)return;if(old)cleanup(root);const s={map,generation:0,moving:false,timer:0,start:null,end:null};s.start=()=>{s.moving=true;++s.generation;if(s.timer){clearTimeout(s.timer);s.timer=0}root.__tpOverlayMotion={moving:true,generation:s.generation};root.dispatchEvent(new CustomEvent('typhoon-overlay-motion-start',{detail:{generation:s.generation}}))};s.end=()=>{s.moving=false;const gen=++s.generation;if(s.timer)clearTimeout(s.timer);s.timer=setTimeout(()=>{s.timer=0;if(STATES.get(root)!==s||root.__tpMap!==map||s.moving||gen!==s.generation)return;root.__tpOverlayMotion={moving:false,generation:gen};root.dispatchEvent(new CustomEvent('typhoon-overlay-motion-settled',{detail:{generation:gen}}))},260)};STATES.set(root,s);root.__tpOverlayMotion={moving:false,generation:0};map.on('movestart zoomstart',s.start);map.on('moveend zoomend',s.end);s.end()}
function scan(scope=document){scope.querySelectorAll?.('[data-typhoon-root]').forEach(root=>{if(root.__tpMap)bind(root);else cleanup(root)})}
function boot(){scan();const host=document.getElementById('windowLayer')||document.body;new MutationObserver(()=>scan()).observe(host,{childList:true,subtree:true});setInterval(scan,1400)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskTyphoonOverlayMotion={version:'v1.0',sharedGeneration:true,settleDelay:260,scan};
})();