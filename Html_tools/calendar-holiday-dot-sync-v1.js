(function(){
'use strict';
const VER='20260903-calendar-holiday-dot-sync-v2';
if(window.__windzxyCalendarHolidayDotSync===VER)return;
window.__windzxyCalendarHolidayDotSync=VER;
function installStyle(){if(document.getElementById('calendarHolidayDotSyncV2Style'))return;const st=document.createElement('style');st.id='calendarHolidayDotSyncV2Style';st.textContent=`
.calendar-v11 .cal11-day .cal-auth-dots{position:absolute;right:8px;top:8px;display:flex;gap:4px;align-items:center;z-index:3}
.calendar-v11 .cal11-day .cal-auth-dots i{position:static!important;display:block;width:6px!important;height:6px!important;border-radius:50%!important;margin:0!important;box-shadow:0 0 0 1px rgba(255,255,255,.12)}
.calendar-v11 .cal11-day .cal-auth-dots i.cn-holiday{background:#ffc176!important}
.calendar-v11 .cal11-day .cal-auth-dots i.cn-work{background:#76a9ff!important}
.calendar-v11 .cal11-day .cal-auth-dots i.hk-holiday{background:#86e2aa!important}
.calendar-v11.cal11-compact .cal11-day .cal-auth-dots,.calendar-v11.cal11-tiny .cal11-day .cal-auth-dots{right:6px;top:6px;gap:3px}
.calendar-v11.cal11-compact .cal11-day .cal-auth-dots i,.calendar-v11.cal11-tiny .cal11-day .cal-auth-dots i{width:5px!important;height:5px!important}
`;document.head.appendChild(st)}
function patchCell(cell){const title=cell.title||'';const isWork=cell.dataset.calAuthWork==='1';const hasHK=cell.dataset.calAuthHk==='1'||title.includes('香港：');const hasCNHoliday=!isWork&&(cell.dataset.calAuthCnHoliday==='1'||title.includes('中國內地：'));
cell.querySelectorAll(':scope > i, :scope > .cal-auth-dots').forEach(el=>el.remove());
if(!(isWork||hasCNHoliday||hasHK))return;
const wrap=document.createElement('span');wrap.className='cal-auth-dots';wrap.setAttribute('aria-hidden','true');
if(isWork){const i=document.createElement('i');i.className='cn-work';wrap.appendChild(i)}
if(hasCNHoliday){const i=document.createElement('i');i.className='cn-holiday';wrap.appendChild(i)}
if(hasHK){const i=document.createElement('i');i.className='hk-holiday';wrap.appendChild(i)}
cell.appendChild(wrap)}
let queued=false;function run(){queued=false;installStyle();document.querySelectorAll('.calendar-v11 [data-cal11-cell]').forEach(patchCell)}function schedule(){if(queued)return;queued=true;requestAnimationFrame(run)}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','title','data-cal-auth-work','data-cal-auth-hk','data-cal-auth-cn-holiday']});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();