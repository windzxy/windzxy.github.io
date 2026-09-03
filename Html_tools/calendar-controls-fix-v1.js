(function(){
'use strict';
const VER='20260903-calendar-controls-fix-v1';
if(window.__windzxyCalendarControlsFix===VER)return;
window.__windzxyCalendarControlsFix=VER;
function daysIn(y,m){return new Date(y,m+1,0).getDate()}
function installStyle(){if(document.getElementById('calendarControlsFixV1Style'))return;const st=document.createElement('style');st.id='calendarControlsFixV1Style';st.textContent=`
.calendar-v11 .cal11-controls select[data-cal11-month],.calendar-v11 .cal11-controls select[data-cal11-day]{appearance:none;-webkit-appearance:none;padding-right:34px!important;background-image:linear-gradient(45deg,transparent 50%,#dbe7f4 50%),linear-gradient(135deg,#dbe7f4 50%,transparent 50%)!important;background-position:calc(100% - 18px) 52%,calc(100% - 13px) 52%!important;background-size:5px 5px,5px 5px!important;background-repeat:no-repeat!important;cursor:pointer}
.calendar-v11 .cal11-controls select[data-cal11-month]:focus,.calendar-v11 .cal11-controls select[data-cal11-day]:focus{border-color:#72efff!important;box-shadow:0 0 0 1px rgba(114,239,255,.35) inset!important}
.calendar-v11 .cal11-controls select option{background:#2d3540!important;color:#fff!important}
`;document.head.appendChild(st)}
function parseDate(root){const m=(root.dataset.cal11Date||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?{y:+m[1],m:+m[2]-1,d:+m[3]}:{y:new Date().getFullYear(),m:new Date().getMonth(),d:new Date().getDate()}}
function hydrate(root){const ms=root.querySelector('[data-cal11-month]'),ds=root.querySelector('[data-cal11-day]'),ys=root.querySelector('[data-cal11-year]');if(!ms||!ds)return;const state=parseDate(root),y=Number(ys?.value)||state.y,m=Number(ms.value);if(!Number.isInteger(m)||m<0||m>11)ms.value=String(state.m);const mm=Number(ms.value),max=daysIn(y,mm),wanted=Math.max(1,Math.min(max,Number(ds.value)||state.d));if(ds.options.length!==max){const frag=document.createDocumentFragment();for(let i=1;i<=max;i++){const o=document.createElement('option');o.value=String(i);o.textContent=String(i);frag.appendChild(o)}ds.replaceChildren(frag)}ds.value=String(wanted);ms.dataset.calControlFixed='1';ds.dataset.calControlFixed='1'}
function guard(e){const s=e.target.closest?.('.calendar-v11 select[data-cal11-month],.calendar-v11 select[data-cal11-day]');if(!s)return;e.stopPropagation()}
function afterChange(e){const s=e.target.closest?.('.calendar-v11 select[data-cal11-month],.calendar-v11 select[data-cal11-day],.calendar-v11 input[data-cal11-year]');if(!s)return;setTimeout(()=>{const root=s.closest('.calendar-v11');if(root)hydrate(root)},0)}
let queued=false;function run(){queued=false;installStyle();document.querySelectorAll('.calendar-v11').forEach(hydrate)}function schedule(){if(queued)return;queued=true;requestAnimationFrame(run)}
document.addEventListener('pointerdown',guard,true);document.addEventListener('click',guard,true);document.addEventListener('change',afterChange,true);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();