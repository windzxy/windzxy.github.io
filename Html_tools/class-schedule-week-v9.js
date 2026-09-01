(function(){
'use strict';
const VER='20260901-class-schedule-week-v9-clean-grid';
if(window.__windzxyClassScheduleWeekV9===VER)return;
window.__windzxyClassScheduleWeekV9=VER;
function installStyle(){
  if(document.getElementById('classScheduleWeekV9Style'))return;
  const s=document.createElement('style');
  s.id='classScheduleWeekV9Style';
  s.textContent=`
/* Week view has its own weekday header; do not repeat the day switcher above it. */
.cs4.cs9-weekview{grid-template-rows:auto auto minmax(0,1fr);gap:11px}
.cs4.cs9-weekview>.cs4-days{display:none!important}
.cs4.cs9-weekview .cs4-content.week{padding:1px 2px 5px;overflow:auto;scrollbar-width:thin}

/* One calm timetable surface instead of dozens of floating coloured cards. */
.cs4.cs9-weekview .cs4-week-grid{
  min-width:720px;
  display:grid;
  grid-template-columns:112px repeat(5,minmax(108px,1fr));
  gap:0!important;
  border:1px solid color-mix(in srgb,var(--line) 72%,transparent);
  border-radius:16px;
  overflow:hidden;
  background:color-mix(in srgb,var(--panel) 91%,transparent);
  box-shadow:0 10px 30px color-mix(in srgb,var(--ink) 5%,transparent),inset 0 1px 0 rgba(255,255,255,.08)
}
.cs4.cs9-weekview .cs4-week-corner,
.cs4.cs9-weekview .cs4-week-grid>button,
.cs4.cs9-weekview .cs4-week-label,
.cs4.cs9-weekview .cs4-week-cell{
  margin:0!important;
  border:0!important;
  border-radius:0!important;
  box-shadow:none!important;
  min-height:54px;
  padding:9px 11px!important;
  background:transparent!important;
  border-right:1px solid color-mix(in srgb,var(--line) 55%,transparent)!important;
  border-bottom:1px solid color-mix(in srgb,var(--line) 52%,transparent)!important
}
.cs4.cs9-weekview .cs4-week-corner,
.cs4.cs9-weekview .cs4-week-grid>button{
  position:sticky;top:0;z-index:5;min-height:48px;
  background:color-mix(in srgb,var(--panel2) 88%,var(--panel))!important;
  backdrop-filter:blur(14px)
}
.cs4.cs9-weekview .cs4-week-corner{display:flex;align-items:center;font-size:10px;font-weight:800;color:var(--muted);letter-spacing:.04em}
.cs4.cs9-weekview .cs4-week-grid>button{display:flex;align-items:center;justify-content:space-between;gap:7px;cursor:pointer;color:var(--muted)}
.cs4.cs9-weekview .cs4-week-grid>button b{font-size:12px;font-weight:780;color:var(--ink)}
.cs4.cs9-weekview .cs4-week-grid>button small{font-size:9px;font-weight:680;color:var(--muted)}
.cs4.cs9-weekview .cs4-week-grid>button.on{background:linear-gradient(180deg,color-mix(in srgb,var(--blue1) 13%,var(--panel)),color-mix(in srgb,var(--blue1) 6%,var(--panel2)))!important}
.cs4.cs9-weekview .cs4-week-grid>button.on b{color:color-mix(in srgb,var(--blue1) 84%,var(--ink))}
.cs4.cs9-weekview .cs4-week-label{display:flex;flex-direction:column;justify-content:center;background:color-mix(in srgb,var(--panel2) 54%,transparent)!important}
.cs4.cs9-weekview .cs4-week-label b{font-size:11px;font-weight:780;color:var(--ink)}
.cs4.cs9-weekview .cs4-week-label small{margin-top:2px;font-size:9px;color:var(--muted);font-variant-numeric:tabular-nums}
.cs4.cs9-weekview .cs4-week-cell{position:relative;display:grid;place-items:center;text-align:center;font-size:12px;font-weight:720;color:var(--ink);transition:background .15s ease,color .15s ease}
.cs4.cs9-weekview .cs4-week-cell::before{content:'';position:absolute;left:7px;top:50%;width:3px;height:18px;border-radius:999px;transform:translateY(-50%);background:var(--sub,#94a3b8);opacity:.34}
.cs4.cs9-weekview .cs4-week-cell:hover{background:color-mix(in srgb,var(--panel2) 64%,transparent)!important}
.cs4.cs9-weekview .cs9-selected-col{background:color-mix(in srgb,var(--blue1) 7%,var(--panel))!important}
.cs4.cs9-weekview .cs4-week-cell.cs9-selected-col::before{opacity:.9;box-shadow:0 0 9px color-mix(in srgb,var(--sub,#4f7cff) 32%,transparent)}

/* Make the afternoon / after-school transitions readable without adding more chrome. */
.cs4.cs9-weekview .cs9-section-start{border-top:2px solid color-mix(in srgb,var(--cs-orange,#f59e0b) 34%,var(--line))!important}
.cs4.cs9-weekview .cs9-after-start{border-top-color:color-mix(in srgb,var(--cs-violet,#7c5cff) 38%,var(--line))!important}
.cs4.cs9-weekview .cs9-afternoon-label b{color:color-mix(in srgb,var(--cs-orange,#f59e0b) 82%,var(--ink))}
.cs4.cs9-weekview .cs9-after-label b{color:color-mix(in srgb,var(--cs-violet,#7c5cff) 84%,var(--ink))}

/* Remove outer-edge divider lines so the whole table reads as one component. */
.cs4.cs9-weekview .cs4-week-grid>*:nth-child(6n){border-right:0!important}
.cs4.cs9-weekview .cs4-week-grid>*:nth-last-child(-n+6){border-bottom:0!important}
:root[data-theme=dark] .cs4.cs9-weekview .cs4-week-grid{background:color-mix(in srgb,var(--panel) 95%,#0b1220 5%);box-shadow:0 12px 32px rgba(0,0,0,.15)}

@container (max-width:760px){
  .cs4.cs9-weekview .cs4-week-grid{min-width:660px;grid-template-columns:104px repeat(5,minmax(100px,1fr))}
  .cs4.cs9-weekview .cs4-week-corner,.cs4.cs9-weekview .cs4-week-grid>button,.cs4.cs9-weekview .cs4-week-label,.cs4.cs9-weekview .cs4-week-cell{min-height:49px;padding:8px 9px!important}
  .cs4.cs9-weekview .cs4-week-cell{font-size:11px}
}
`;
  document.head.appendChild(s);
}
function sync(root){
  const content=root.querySelector('.cs4-content');
  const week=!!content?.classList.contains('week');
  root.classList.toggle('cs9-weekview',week);
  if(!week)return;
  const grid=content.querySelector('.cs4-week-grid');
  if(!grid)return;
  grid.querySelectorAll('.cs9-selected-col,.cs9-section-start,.cs9-after-start,.cs9-afternoon-label,.cs9-after-label').forEach(el=>el.classList.remove('cs9-selected-col','cs9-section-start','cs9-after-start','cs9-afternoon-label','cs9-after-label'));
  const headers=[...grid.querySelectorAll(':scope > button[data-cs4-day]')];
  let selected=headers.findIndex(b=>b.classList.contains('on'));
  if(selected<0){const d=new Date().getDay();selected=d>=1&&d<=5?d-1:0;}
  if(headers[selected])headers[selected].classList.add('cs9-selected-col');
  const children=[...grid.children];
  let row=0;
  for(let start=6;start<children.length;start+=6,row++){
    const label=children[start];
    const cell=children[start+1+selected];
    if(cell)cell.classList.add('cs9-selected-col');
    if(row===5){
      label?.classList.add('cs9-section-start','cs9-afternoon-label');
      for(let j=1;j<=5;j++)children[start+j]?.classList.add('cs9-section-start');
    }
    if(row===8){
      label?.classList.add('cs9-section-start','cs9-after-start','cs9-after-label');
      for(let j=1;j<=5;j++)children[start+j]?.classList.add('cs9-section-start','cs9-after-start');
    }
  }
}
function scan(){document.querySelectorAll('.class-schedule-v1.cs4').forEach(sync)}
function boot(){
  installStyle();scan();
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  document.addEventListener('click',e=>{if(e.target.closest('[data-cs4-view],[data-cs4-day]'))requestAnimationFrame(()=>requestAnimationFrame(scan));},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskClassScheduleWeek={version:'v9'};
})();