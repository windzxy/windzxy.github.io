(function(){
'use strict';
const VER='20260903-calendar-holiday-dot-sync-v1';
if(window.__windzxyCalendarHolidayDotSync===VER)return;
window.__windzxyCalendarHolidayDotSync=VER;

function installStyle(){
  if(document.getElementById('calendarHolidayDotSyncV1Style'))return;
  const st=document.createElement('style');
  st.id='calendarHolidayDotSyncV1Style';
  st.textContent=`
  .calendar-v11 .cal11-day .cal-auth-dots{position:absolute;right:8px;top:8px;display:flex;gap:4px;align-items:center;z-index:2}
  .calendar-v11 .cal11-day .cal-auth-dots i{position:static!important;display:block;width:6px!important;height:6px!important;border-radius:50%!important;margin:0!important;box-shadow:0 0 0 1px rgba(255,255,255,.10)}
  .calendar-v11 .cal11-day .cal-auth-dots i.cn-holiday{background:#ffc176!important}
  .calendar-v11 .cal11-day .cal-auth-dots i.cn-work{background:#76a9ff!important}
  .calendar-v11 .cal11-day .cal-auth-dots i.hk-holiday{background:#86e2aa!important}
  .calendar-v11.cal11-compact .cal11-day .cal-auth-dots,.calendar-v11.cal11-tiny .cal11-day .cal-auth-dots{right:6px;top:6px;gap:3px}
  .calendar-v11.cal11-compact .cal11-day .cal-auth-dots i,.calendar-v11.cal11-tiny .cal11-day .cal-auth-dots i{width:5px!important;height:5px!important}
  `;
  document.head.appendChild(st);
}

function patchCell(cell){
  const isWork=cell.dataset.calAuthWork==='1';
  const hasHK=cell.dataset.calAuthHk==='1';
  const hasAuthority=cell.querySelector(':scope > i[data-holiday-authority], :scope > .cal-auth-dots') || isWork || hasHK || cell.classList.contains('holiday');
  if(!hasAuthority)return;
  cell.querySelectorAll(':scope > i[data-holiday-authority], :scope > i.work').forEach(el=>el.remove());
  let wrap=cell.querySelector(':scope > .cal-auth-dots');
  if(!wrap){wrap=document.createElement('span');wrap.className='cal-auth-dots';wrap.setAttribute('aria-hidden','true');cell.appendChild(wrap)}
  wrap.innerHTML='';
  if(isWork){const i=document.createElement('i');i.className='cn-work';wrap.appendChild(i)}
  else if(cell.classList.contains('holiday')){const i=document.createElement('i');i.className='cn-holiday';wrap.appendChild(i)}
  if(hasHK){const i=document.createElement('i');i.className='hk-holiday';wrap.appendChild(i)}
  if(!wrap.children.length)wrap.remove();
}

let queued=false;
function run(){queued=false;installStyle();document.querySelectorAll('.calendar-v11 [data-cal11-cell]').forEach(patchCell)}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(run)}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-cal-auth-work','data-cal-auth-hk']});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
