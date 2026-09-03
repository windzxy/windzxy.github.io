(()=>{
'use strict';
const VERSION='20260903-maydayland-tour-share-feedback-v1';
if(window.__maydaylandTourShareFeedback===VERSION)return;
window.__maydaylandTourShareFeedback=VERSION;
function css(){if(document.getElementById('tourShareFeedbackV1Style'))return;const s=document.createElement('style');s.id='tourShareFeedbackV1Style';s.textContent='.tour-route-actions [data-share-tour]{min-width:88px}.tour-route-actions [data-share-tour][data-state="busy"]{opacity:.68;cursor:progress}.tour-route-actions [data-share-tour][data-state="done"]{border-color:rgba(114,245,198,.42);color:#9ee9cb}';document.head.appendChild(s)}
function bind(button){if(!button||button.dataset.shareFeedbackBound==='1')return;button.dataset.shareFeedbackBound='1';button.addEventListener('click',()=>{button.dataset.state='busy';button.textContent='分享中…';setTimeout(()=>{if(!button.isConnected)return;button.dataset.state='done';button.textContent='已開啟分享';setTimeout(()=>{if(!button.isConnected)return;button.dataset.state='';button.textContent='分享路線'},1200)},500)},true)}
function scan(root=document){root.querySelectorAll?.('[data-share-tour]').forEach(bind)}
function boot(){css();scan();new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.matches?.('[data-share-tour]'))bind(n);scan(n)}))).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
