(function(){
'use strict';
const VER='20260901-class-schedule-week-v9.2-restore-safe';
if(window.__windzxyClassScheduleWeekV9===VER)return;
window.__windzxyClassScheduleWeekV9=VER;
function installStyle(){
  if(document.getElementById('classScheduleWeekV9Style'))return;
  const s=document.createElement('style');
  s.id='classScheduleWeekV9Style';
  s.textContent=`
/* Restore-safe week mode: CSS :has() is the source of truth, so persisted week view
   is correct even before the JS enhancer has run. */
.cs4:has(.cs4-content.week){grid-template-rows:auto auto minmax(0,1fr);gap:10px}
.cs4:has(.cs4-content.week)>.cs4-days{display:none!important}
.cs4:has(.cs4-content.week) .cs4-head{justify-content:flex-end;min-height:34px}
.cs4:has(.cs4-content.week) .cs4-title{display:none!important}
.cs4:has(.cs4-content.week) .cs4-hero{gap:7px}
.cs4:has(.cs4-content.week) .cs4-stat{min-height:78px;padding:10px 12px;border-radius:14px}
.cs4:has(.cs4-content.week) .cs4-stat>span{margin-bottom:4px}
.cs4:has(.cs4-content.week) .cs4-stat>strong{font-size:16px}
.cs4:has(.cs4-content.week) .cs4-stat>b{margin-top:4px;font-size:10px}
.cs4:has(.cs4-content.week) .cs4-stat>small{display:none}
.cs4:has(.cs4-content.week) .cs4-content.week{padding:1px 2px 5px;overflow:auto;scrollbar-width:thin}

/* Week table is one coherent surface, not a grid of floating cards. */
.cs4:has(.cs4-content.week) .cs4-week-grid{
  min-width:720px;display:grid;grid-template-columns:112px repeat(5,minmax(108px,1fr));gap:0!important;
  border:1px solid color-mix(in srgb,var(--line) 72%,transparent);border-radius:15px;overflow:hidden;
  background:color-mix(in srgb,var(--panel) 94%,transparent);
  box-shadow:0 10px 28px color-mix(in srgb,var(--ink) 4%,transparent),inset 0 1px 0 rgba(255,255,255,.06)
}
.cs4:has(.cs4-content.week) .cs4-week-corner,
.cs4:has(.cs4-content.week) .cs4-week-grid>button,
.cs4:has(.cs4-content.week) .cs4-week-label,
.cs4:has(.cs4-content.week) .cs4-week-cell{
  margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;
  min-height:52px;padding:8px 10px!important;background:transparent!important;
  border-right:1px solid color-mix(in srgb,var(--line) 50%,transparent)!important;
  border-bottom:1px solid color-mix(in srgb,var(--line) 48%,transparent)!important
}
.cs4:has(.cs4-content.week) .cs4-week-corner,
.cs4:has(.cs4-content.week) .cs4-week-grid>button{
  position:sticky;top:0;z-index:5;min-height:46px;
  background:color-mix(in srgb,var(--panel2) 88%,var(--panel))!important;backdrop-filter:blur(12px)
}
.cs4:has(.cs4-content.week) .cs4-week-corner{display:flex;align-items:center;font-size:10px;font-weight:800;color:var(--muted);letter-spacing:.04em}
.cs4:has(.cs4-content.week) .cs4-week-grid>button{display:flex;align-items:center;justify-content:space-between;gap:7px;cursor:pointer;color:var(--muted)}
.cs4:has(.cs4-content.week) .cs4-week-grid>button b{font-size:12px;font-weight:800;color:var(--ink)}
.cs4:has(.cs4-content.week) .cs4-week-grid>button small{font-size:9px;font-weight:680;color:var(--muted)}
.cs4:has(.cs4-content.week) .cs4-week-grid>button.on{background:linear-gradient(180deg,color-mix(in srgb,var(--blue1) 13%,var(--panel)),color-mix(in srgb,var(--blue1) 5%,var(--panel2)))!important}
.cs4:has(.cs4-content.week) .cs4-week-grid>button.on b{color:color-mix(in srgb,var(--blue1) 84%,var(--ink))}
.cs4:has(.cs4-content.week) .cs4-week-label{display:flex;flex-direction:column;justify-content:center;background:color-mix(in srgb,var(--panel2) 48%,transparent)!important}
.cs4:has(.cs4-content.week) .cs4-week-label b{font-size:11px;font-weight:790;color:var(--ink)}
.cs4:has(.cs4-content.week) .cs4-week-label small{margin-top:2px;font-size:9px;color:var(--muted);font-variant-numeric:tabular-nums}
.cs4:has(.cs4-content.week) .cs4-week-cell{position:relative;display:grid;place-items:center;text-align:center;font-size:12px;font-weight:720;color:var(--ink);transition:background .15s ease,color .15s ease}
.cs4:has(.cs4-content.week) .cs4-week-cell::before{content:'';position:absolute;left:7px;top:50%;width:3px;height:17px;border-radius:999px;transform:translateY(-50%);background:var(--sub,#94a3b8);opacity:.28}
.cs4:has(.cs4-content.week) .cs4-week-cell:hover{background:color-mix(in srgb,var(--panel2) 58%,transparent)!important}
.cs4:has(.cs4-content.week) .cs9-selected-col{background:color-mix(in srgb,var(--blue1) 6%,var(--panel))!important}
.cs4:has(.cs4-content.week) .cs4-week-cell.cs9-selected-col::before{opacity:.85;box-shadow:0 0 8px color-mix(in srgb,var(--sub,#4f7cff) 28%,transparent)}
.cs4:has(.cs4-content.week) .cs9-section-start{border-top:2px solid color-mix(in srgb,var(--cs-orange,#f59e0b) 30%,var(--line))!important}
.cs4:has(.cs4-content.week) .cs9-after-start{border-top-color:color-mix(in srgb,var(--cs-violet,#7c5cff) 34%,var(--line))!important}
.cs4:has(.cs4-content.week) .cs9-afternoon-label b{color:color-mix(in srgb,var(--cs-orange,#f59e0b) 82%,var(--ink))}
.cs4:has(.cs4-content.week) .cs9-after-label b{color:color-mix(in srgb,var(--cs-violet,#7c5cff) 84%,var(--ink))}
.cs4:has(.cs4-content.week) .cs4-week-grid>*:nth-child(6n){border-right:0!important}
.cs4:has(.cs4-content.week) .cs4-week-grid>*:nth-last-child(-n+6){border-bottom:0!important}
:root[data-theme=dark] .cs4:has(.cs4-content.week) .cs4-week-grid{background:color-mix(in srgb,var(--panel) 96%,#0b1220 4%);box-shadow:0 10px 28px rgba(0,0,0,.13)}
@container (max-width:760px){
  .cs4:has(.cs4-content.week) .cs4-week-grid{min-width:650px;grid-template-columns:102px repeat(5,minmax(98px,1fr))}
  .cs4:has(.cs4-content.week) .cs4-week-corner,.cs4:has(.cs4-content.week) .cs4-week-grid>button,.cs4:has(.cs4-content.week) .cs4-week-label,.cs4:has(.cs4-content.week) .cs4-week-cell{min-height:48px;padding:7px 8px!important}
  .cs4:has(.cs4-content.week) .cs4-week-cell{font-size:11px}
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
    if(row===5){label?.classList.add('cs9-section-start','cs9-afternoon-label');for(let j=1;j<=5;j++)children[start+j]?.classList.add('cs9-section-start');}
    if(row===8){label?.classList.add('cs9-section-start','cs9-after-start','cs9-after-label');for(let j=1;j<=5;j++)children[start+j]?.classList.add('cs9-section-start','cs9-after-start');}
  }
}
function scan(){document.querySelectorAll('.class-schedule-v1.cs4').forEach(sync)}
let pending=false;
function scheduleScan(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;scan()})}
function boot(){
  installStyle();scan();
  /* Structural-only observer on body is restore-safe and cannot loop on our class updates. */
  new MutationObserver(muts=>{if(muts.some(m=>m.addedNodes.length||m.removedNodes.length))scheduleScan()}).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest('[data-cs4-view],[data-cs4-day]'))requestAnimationFrame(scheduleScan)},true);
  setTimeout(scan,0);setTimeout(scan,120);setTimeout(scan,500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.WebDeskClassScheduleWeek={version:'v9.2',performanceFix:true,restoreSafe:true};
})();