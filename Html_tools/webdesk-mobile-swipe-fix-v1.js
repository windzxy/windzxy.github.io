(()=>{
'use strict';
const VERSION='20260913-webdesk-mobile-swipe-fix-v1.2-flight-board-safe';
if(window.__webdeskMobileSwipeFix===VERSION)return;
window.__webdeskMobileSwipeFix=VERSION;
let start=null,lastSwitch=0;
const isMobile=()=>innerWidth<=820;
const cards=()=>[...document.querySelectorAll('#desktopCanvas .desktop-card')];
function blocked(el){
  if(!el?.closest)return false;
  /* All game boards are interaction zones, never card-swipe zones. */
  if(el.closest('.gomoku-board,.chess-board,.xq-board,.flight-board,.flight-board-wrap,[data-flight-board],[data-flight-plane],.gomoku-board-wrap,.chess-board-wrap,[data-gomoku-cell],[data-chess-square],[data-xq-cell],.gomoku-cell,.chess-square,.xq-cell'))return true;
  if(el.closest('.table-output,.table-wrap,.table-scroll,.schedule-table-wrap,input,textarea,select,button,a,[contenteditable=true]'))return true;
  return false;
}
function currentIndex(list){
  const i=list.findIndex(x=>x.classList.contains('mobile-active-card'));
  return i<0?0:i;
}
function workspaceKey(){
  try{return typeof activeWorkspace==='function'?(activeWorkspace()?.id||'default'):'default'}catch(_){return 'default'}
}
function updateIndicator(list,index){
  const el=document.querySelector('.webdesk-mobile-card-indicator');
  if(!el)return;
  const title=list[index]?.querySelector('.card-bar h3')?.textContent?.trim()||'卡片';
  const dots=list.length<=8?'<span class="webdesk-mobile-card-dots">'+list.map((_,i)=>'<i class="'+(i===index?'active':'')+'"></i>').join('')+'</span>':'';
  el.innerHTML='<span>'+escapeHtml(title)+'</span><b>'+(index+1)+' / '+list.length+'</b>'+dots;
}
function escapeHtml(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function switchTo(delta){
  const now=Date.now();if(now-lastSwitch<260)return;
  const list=cards();if(list.length<2)return;
  const i=currentIndex(list),next=Math.max(0,Math.min(list.length-1,i+delta));if(next===i)return;
  lastSwitch=now;
  list.forEach((c,n)=>c.classList.toggle('mobile-active-card',n===next));
  localStorage.setItem('webdesk-mobile-card-index:'+workspaceKey(),String(next));
  updateIndicator(list,next);
  const canvas=document.getElementById('desktopCanvas');
  if(canvas){const y=canvas.getBoundingClientRect().top+scrollY-8;window.scrollTo({top:Math.max(0,y),behavior:'smooth'})}
}
function begin(x,y,target){if(!isMobile()||blocked(target)){start=null;return}start={x,y,t:Date.now()}}
function finish(x,y){
  if(!start||!isMobile())return;
  const dx=x-start.x,dy=y-start.y,dt=Date.now()-start.t;start=null;
  if(dt>1000||Math.abs(dx)<52||Math.abs(dx)<Math.abs(dy)*1.25)return;
  switchTo(dx<0?1:-1);
}
function boot(){
  const canvas=document.getElementById('desktopCanvas');if(!canvas||canvas.dataset.mobileSwipeFixV12==='1')return;canvas.dataset.mobileSwipeFixV12='1';
  canvas.addEventListener('touchstart',e=>{const p=e.touches?.[0];if(p)begin(p.clientX,p.clientY,e.target)},{passive:true,capture:true});
  canvas.addEventListener('touchend',e=>{const p=e.changedTouches?.[0];if(p)finish(p.clientX,p.clientY)},{passive:true,capture:true});
  canvas.addEventListener('touchcancel',()=>{start=null},{passive:true,capture:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
new MutationObserver(()=>{if(isMobile())boot()}).observe(document.documentElement,{childList:true,subtree:true});
window.WebDeskMobileSwipeFix={version:VERSION,boardSafe:true,flightBoardSafe:true};
})();