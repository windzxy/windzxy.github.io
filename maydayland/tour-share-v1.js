(()=>{
'use strict';
const VERSION='20260903-maydayland-tour-share-v1';
if(window.__maydaylandTourShare===VERSION)return;
window.__maydaylandTourShare=VERSION;

function selectedTour(){return document.querySelector('.tour.active[data-tour]')||document.querySelector('.tour[data-tour="all"]');}
function routeName(){const tour=selectedTour();return (tour?.querySelector('b')?.textContent||'Maydayland 巡演地圖').trim();}
function shareUrl(){return location.href;}
function ensureButton(){
  const status=document.querySelector('.tour-route-status');
  if(!status)return false;
  let actions=status.querySelector('.tour-route-actions');
  if(!actions){
    actions=document.createElement('div');
    actions.className='tour-route-actions';
    actions.style.cssText='display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end';
    status.appendChild(actions);
  }
  if(!actions.querySelector('[data-share-tour]')){
    const button=document.createElement('button');
    button.type='button';
    button.dataset.shareTour='1';
    button.textContent='分享路線';
    button.setAttribute('aria-label','分享目前巡演路線');
    actions.prepend(button);
  }
  const reset=status.querySelector('[data-show-all-routes]');
  if(reset&&reset.parentElement!==actions)actions.appendChild(reset);
  return true;
}
async function share(){
  const title=routeName()+' · Maydayland';
  const url=shareUrl();
  try{
    if(navigator.share){await navigator.share({title,url});return;}
    if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);flash('已複製分享連結');return;}
  }catch(error){if(error?.name==='AbortError')return;}
  try{
    const ta=document.createElement('textarea');ta.value=url;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();flash('已複製分享連結');
  }catch(_){flash('請複製瀏覽器網址分享');}
}
function flash(text){
  const status=document.querySelector('.tour-route-status small');
  if(!status)return;
  const old=status.textContent;status.textContent=text;
  clearTimeout(status.__shareTimer);status.__shareTimer=setTimeout(()=>{if(document.body.contains(status))status.textContent=old;},1600);
}
function boot(){
  if(ensureButton())return;
  let tries=0;const timer=setInterval(()=>{tries++;if(ensureButton()||tries>50)clearInterval(timer);},120);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
document.addEventListener('click',event=>{
  if(event.target.closest?.('[data-share-tour]')){event.preventDefault();share();return;}
  if(event.target.closest?.('[data-tour]'))requestAnimationFrame(ensureButton);
});
window.addEventListener('hashchange',()=>requestAnimationFrame(ensureButton));
})();
